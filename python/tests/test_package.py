from __future__ import annotations

import json
import shlex
import zipfile
from datetime import datetime, timezone
from importlib.metadata import version
from io import BytesIO
from typing import Any, Optional, get_type_hints

import httpx
import pytest

import stackmachine
from stackmachine import (
    AsyncStackMachine,
    StackMachine,
    StackMachineAPIError,
    StackMachineAuthenticationError,
    StackMachineGraphQLError,
    StackMachineValidationError,
    create_zip,
)
from stackmachine.resources.deployments import DeploymentsResource
from stackmachine.resources.files import FilesResource


def app_payload(id: str = "app_1") -> dict[str, Any]:
    return {
        "id": id,
        "willPerishAt": None,
        "name": f"app-{id}",
        "url": f"https://{id}.stackmachine.dev",
        "adminUrl": f"https://{id}.stackmachine.dev/admin",
        "activeVersion": None,
        "favicon": None,
        "screenshot": None,
    }


def volume_payload(id: str = "volume_1", **overrides: Any) -> dict[str, Any]:
    payload = {
        "id": id,
        "volumeId": f"volume-{id}",
        "mountPath": "/data",
        "maxSizeBytes": 1_073_741_824,
        "s3Enabled": False,
        "s3Url": None,
        "explorerUrl": f"https://console.example.test/volumes/{id}",
        "isAddedByUi": True,
    }
    payload.update(overrides)
    return payload


def cron_job_payload(id: str = "cron_1", **overrides: Any) -> dict[str, Any]:
    payload = {
        "__typename": "CronJob",
        "id": id,
        "name": f"cron-{id}",
        "schedule": "0 * * * *",
        "enabled": True,
        "kind": "EXECUTE",
        "source": "API",
        "isManaged": False,
        "maxRetries": 3,
        "maxScheduleDrift": "5m",
        "timeout": "30s",
        "createdAt": "2026-07-01T00:00:00Z",
        "updatedAt": "2026-07-02T00:00:00Z",
        "target": {
            "__typename": "ExecuteCronJobTarget",
            "command": "python",
            "cliArgs": ["cleanup.py", "--older-than", "30 days", "it's-old"],
            "env": {"LOG_LEVEL": "info"},
            "packageName": None,
        },
    }
    payload.update(overrides)
    return payload


def database_payload(id: str = "db_1", **overrides: Any) -> dict[str, Any]:
    payload = {
        "id": id,
        "name": f"database_{id}",
        "host": "db.example.test",
        "port": "3306",
        "username": f"user_{id}",
        "password": None,
        "phpmyadminUrl": f"https://console.example.test/db/{id}/phpmyadmin",
        "dbExplorerUrl": f"https://console.example.test/db/{id}",
        "deletedAt": None,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z",
        "app": app_payload("app_1"),
    }
    payload.update(overrides)
    return payload


def usage_metrics_payload(**overrides: Any) -> dict[str, Any]:
    payload = {
        "startAt": "2026-06-01T00:00:00Z",
        "endAt": "2026-06-30T00:00:00Z",
        "grouped": [
            {
                "groupedAt": "2026-06-01T00:00:00Z",
                "requests": {
                    "cachedRequests": "12",
                    "dataCachedBytes": "2048",
                    "dataServedBytes": "4096",
                    "http2xx": "100",
                    "http3xx": "7",
                    "http4xx": "3",
                    "http5xx": "1",
                    "httpOther": "2",
                    "percentageCached": 12.5,
                    "requestDurationMillis": "3456",
                    "totalRequests": "9007199254740993",
                    "uniqueUsers": 42,
                },
                "workloads": {
                    "memoryBytes": "8192",
                    "networkEgressBytes": "16384",
                    "networkIngressBytes": "32768",
                    "realCpuTimeMillis": "120000",
                    "wallCpuTimeMillis": "180000",
                    "workloads": 5,
                },
            }
        ],
        "totals": {
            "requests": {
                "cachedRequests": "12",
                "dataCachedBytes": "2048",
                "dataServedBytes": "4096",
                "http2xx": "100",
                "http3xx": "7",
                "http4xx": "3",
                "http5xx": "1",
                "httpOther": "2",
                "percentageCached": 12.5,
                "requestDurationMillis": "3456",
                "totalRequests": "9007199254740993",
                "uniqueUsers": 42,
            },
            "workloads": {
                "memoryBytes": "8192",
                "networkEgressBytes": "16384",
                "networkIngressBytes": "32768",
                "realCpuTimeMillis": "120000",
                "wallCpuTimeMillis": "180000",
                "workloads": 5,
            },
        },
    }
    payload.update(overrides)
    return payload


def git_connection_payload(id: str = "conn_1", **overrides: Any) -> dict[str, Any]:
    payload = {
        "id": id,
        "connectedAt": "2024-01-01T00:00:00Z",
        "deployBranch": "main",
        "deploymentStatusEvents": True,
        "pullRequestComments": False,
        "connectedBy": {
            "id": "user_1",
            "username": "syrus",
            "globalName": "syrus",
        },
        "app": app_payload("app_1"),
        "githubRepoInstallation": {
            "id": "repo_1",
            "name": "stackmachine-js",
            "namespace": "stackmachine",
            "repoUrl": "https://github.com/stackmachine/sdks.git",
            "url": "https://github.com/stackmachine/sdks",
            "installation": {
                "id": "install_1",
                "slug": "stackmachine",
                "githubConfigureUrl": "https://github.com/apps/stackmachine",
            },
        },
    }
    payload.update(overrides)
    return payload


def dns_owner_payload(**overrides: Any) -> dict[str, Any]:
    payload = {
        "__typename": "Namespace",
        "id": "owner_1",
        "globalId": "owner_1",
        "globalName": "stackmachine",
        "isPro": True,
        "name": "stackmachine",
        "displayName": "StackMachine",
    }
    payload.update(overrides)
    return payload


def dns_record_payload(kind: str = "A", id: str = "record_1") -> dict[str, Any]:
    typenames = {
        "A": "ARecord",
        "AAAA": "AAAARecord",
        "CAA": "CAARecord",
        "CNAME": "CNAMERecord",
        "DNAME": "DNAMERecord",
        "MX": "MXRecord",
        "NS": "NSRecord",
        "PTR": "PTRRecord",
        "SOA": "SOARecord",
        "SRV": "SRVRecord",
        "SSHFP": "SSHFPRecord",
        "TXT": "TXTRecord",
    }
    payload: dict[str, Any] = {
        "__typename": typenames[kind],
        "id": id,
        "createdAt": "2024-01-01T00:00:00Z",
        "deletedAt": None,
        "dnsClass": "IN",
        "domain": {"id": "domain_1", "name": "example.com", "slug": "example-com"},
        "name": "www",
        "text": "www.example.com. 3600 IN A 192.0.2.1",
        "ttl": 3600,
        "updatedAt": "2024-01-02T00:00:00Z",
    }
    extras_by_kind: dict[str, dict[str, Any]] = {
        "A": {"address": "192.0.2.1"},
        "AAAA": {"address": "2001:db8::1"},
        "CAA": {"flags": 0, "tag": "issue", "value": "letsencrypt.org"},
        "CNAME": {"cName": "target.example.com"},
        "DNAME": {"dName": "target.example.com"},
        "MX": {"exchange": "mail.example.com", "preference": 10},
        "NS": {"nsdname": "ns1.example.com"},
        "PTR": {"ptrdname": "ptr.example.com"},
        "SOA": {
            "expire": 1_209_600,
            "minimum": 3600,
            "mname": "ns1.example.com",
            "refresh": 3600,
            "retry": 600,
            "rname": "admin.example.com",
            "serial": 1,
        },
        "SRV": {
            "port": 443,
            "priority": 10,
            "protocol": "tcp",
            "service": "xmpp",
            "target": "xmpp.example.com",
            "weight": 20,
        },
        "SSHFP": {"algorithm": 1, "fingerprint": "abcdef", "type": 1},
        "TXT": {"data": "hello"},
    }
    payload.update(extras_by_kind[kind])
    return payload


def dns_domain_payload(id: str = "domain_1", **overrides: Any) -> dict[str, Any]:
    payload = {
        "__typename": "DNSDomain",
        "id": id,
        "name": "example.com",
        "slug": "example-com",
        "zoneFile": "$ORIGIN example.com.",
        "delegationStatus": "VERIFIED",
        "nameservers": ["ns1.stackmachine.example.", "ns2.stackmachine.example."],
        "deletedAt": None,
        "lastCheckedAt": "2024-01-03T00:00:00Z",
        "verifiedAt": "2024-01-03T00:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z",
        "owner": dns_owner_payload(),
        "records": [dns_record_payload("A", "record_1")],
    }
    payload.update(overrides)
    return payload


def email_message_payload(id: str = "email_1", **overrides: Any) -> dict[str, Any]:
    payload = {
        "id": id,
        "app": app_payload("app_1"),
        "bcc": [],
        "cc": [],
        "createdAt": "2024-01-01T00:00:00Z",
        "direction": "SENT",
        "from": "app@example.com",
        "htmlBody": "<p>Hello</p>",
        "owner": dns_owner_payload(),
        "receivedAt": None,
        "replyTo": None,
        "sentAt": "2024-01-01T00:00:00Z",
        "status": "SENT",
        "subject": "Hello",
        "textBody": "Hello",
        "to": ["user@example.com"],
    }
    payload.update(overrides)
    return payload


def email_connection_payload(message: dict[str, Any]) -> dict[str, Any]:
    cursor = f"cursor_{message['id']}"
    return {
        "edges": [{"cursor": cursor, "node": message}],
        "pageInfo": {
            "hasNextPage": False,
            "hasPreviousPage": False,
            "endCursor": cursor,
            "startCursor": cursor,
        },
        "totalCount": 1,
    }


def graphql_response(data: dict[str, Any], status_code: int = 200) -> httpx.Response:
    return httpx.Response(status_code, json={"data": data})


def test_version_matches_package_metadata() -> None:
    assert stackmachine.__version__ == version("stackmachine")


def test_exports_clients_and_models() -> None:
    assert stackmachine.StackMachine is StackMachine
    assert stackmachine.AsyncStackMachine is AsyncStackMachine
    assert stackmachine.AppVolume.__name__ == "AppVolume"
    assert stackmachine.AppCache.__name__ == "AppCache"
    assert stackmachine.CronJob.__name__ == "CronJob"
    assert stackmachine.AppDatabase.__name__ == "AppDatabase"
    assert stackmachine.DeployAppReference.__name__ == "DeployAppReference"
    assert stackmachine.GithubRepoConnection.__name__ == "GithubRepoConnection"
    assert stackmachine.DNSDomain.__name__ == "DNSDomain"
    assert stackmachine.DNSRecord.__name__ == "DNSRecord"
    assert stackmachine.EmailMessage.__name__ == "EmailMessage"
    assert stackmachine.UsageMetrics.__name__ == "UsageMetrics"
    assert "StackMachine" in stackmachine.__all__
    assert "AsyncStackMachine" in stackmachine.__all__
    assert "AppVolume" in stackmachine.__all__
    assert "AppCache" in stackmachine.__all__
    assert "CronJob" in stackmachine.__all__
    assert "AppDatabase" in stackmachine.__all__
    assert "DeployAppReference" in stackmachine.__all__
    assert "GithubRepoConnection" in stackmachine.__all__
    assert "DNSDomain" in stackmachine.__all__
    assert "DNSRecord" in stackmachine.__all__
    assert "EmailMessage" in stackmachine.__all__
    assert "UsageMetrics" in stackmachine.__all__


def test_exports_public_input_types() -> None:
    assert "DeployAppAutobuildInput" in stackmachine.__all__
    assert "DeploymentFilesInput" in stackmachine.__all__
    assert "AppsVolumesCreateInput" in stackmachine.__all__
    assert "AppsVolumesListInput" in stackmachine.__all__
    assert "AppsVolumesUpdateInput" in stackmachine.__all__
    assert "AppsCacheUpdateInput" in stackmachine.__all__
    assert "AppsCronJobsCreateInput" in stackmachine.__all__
    assert "AppsCronJobsListInput" in stackmachine.__all__
    assert "AppsCronJobsUpdateInput" in stackmachine.__all__
    assert "CronJobExecuteTargetInput" in stackmachine.__all__
    assert "CronJobFetchTargetInput" in stackmachine.__all__
    assert "AppsGitConnectInput" in stackmachine.__all__
    assert "AppsGitUpdateInput" in stackmachine.__all__
    assert "AppsDatabasesCreateInput" in stackmachine.__all__
    assert "AppsDatabasesListInput" in stackmachine.__all__
    assert "DNSDomainsCreateInput" in stackmachine.__all__
    assert "DNSRecordsUpsertInput" in stackmachine.__all__
    assert "DNSRecordsUpdateManyInput" in stackmachine.__all__
    assert "DatabaseEngine" in stackmachine.__all__
    assert "EmailsListInput" in stackmachine.__all__
    assert "EmailsSendInput" in stackmachine.__all__
    assert "UsageMetricsInput" in stackmachine.__all__
    assert "MetricGrouping" in stackmachine.__all__
    assert "RequestOptionsInput" in stackmachine.__all__
    assert "FileInput" in stackmachine.__all__
    assert stackmachine.DeployAppAutobuildInput.__name__ == "DeployAppAutobuildInput"
    assert stackmachine.AppsVolumesCreateInput.__name__ == "AppsVolumesCreateInput"
    assert stackmachine.AppsGitConnectInput.__name__ == "AppsGitConnectInput"
    assert stackmachine.DNSRecordKind is not None
    assert stackmachine.DeploymentFilesInput == stackmachine.CreateZipFiles
    assert stackmachine.RequestOptionsInput.__name__ == "RequestOptionsInput"


def test_new_resource_trees_are_available() -> None:
    transport = httpx.MockTransport(lambda _: graphql_response({}))
    with StackMachine("secret", http_transport=transport) as client:
        assert client.apps.git is not None
        assert client.apps.cache is not None
        assert client.apps.cronjobs is not None
        assert client.apps.databases is not None
        assert client.dns.domains is not None
        assert client.dns.records is not None
        assert client.emails.sent is not None
        assert client.emails.received is not None
        assert client.usage is not None


async def test_async_new_resource_trees_are_available() -> None:
    transport = httpx.MockTransport(lambda _: graphql_response({}))
    client = AsyncStackMachine("secret", http_transport=transport)
    try:
        assert client.apps.git is not None
        assert client.apps.cache is not None
        assert client.apps.cronjobs is not None
        assert client.apps.databases is not None
        assert client.dns.domains is not None
        assert client.dns.records is not None
        assert client.emails.sent is not None
        assert client.emails.received is not None
        assert client.usage is not None
    finally:
        await client.close()


def test_file_upload_signature_uses_public_types() -> None:
    hints = get_type_hints(FilesResource.upload)

    assert hints["file"] == stackmachine.FileInput
    assert hints["on_progress"] == Optional[stackmachine.UploadProgressCallback]
    assert hints["request_options"] == Optional[stackmachine.RequestOptionsLike]


def test_deployment_create_signature_uses_upload_progress_type() -> None:
    hints = get_type_hints(DeploymentsResource.create)

    assert hints["on_upload_progress"] == Optional[stackmachine.UploadProgressCallback]


def test_client_constructor_accepts_configuration_aliases() -> None:
    client = StackMachine(
        "token-1",
        apiUrl="https://api.example/graphql",
        maxNetworkRetries=3,
        http_transport=httpx.MockTransport(lambda _: graphql_response({})),
    )
    try:
        assert client.api_key == "token-1"
        assert client.api_url == "https://api.example/graphql"
        assert client.apiUrl == "https://api.example/graphql"
        assert client.max_network_retries == 3
        assert client.maxNetworkRetries == 3
    finally:
        client.close()


def test_client_init_accepts_mapping_settings() -> None:
    client = StackMachine.init(
        {"token": "token-1", "apiUrl": "https://api.example/graphql"},
        maxNetworkRetries=3,
        http_transport=httpx.MockTransport(lambda _: graphql_response({})),
    )
    try:
        assert client.api_key == "token-1"
        assert client.api_url == "https://api.example/graphql"
        assert client.max_network_retries == 3
    finally:
        client.close()


def test_sync_viewer_sends_auth_header_and_returns_model() -> None:
    seen: dict[str, Any] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["authorization"] = request.headers["authorization"]
        seen["body"] = json.loads(request.content)
        return graphql_response({"viewer": {"username": "syrus"}})

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        viewer = client.viewer()

    assert viewer is not None
    assert viewer.username == "syrus"
    assert seen["authorization"] == "Bearer secret"
    assert seen["body"]["operationName"] == "srcViewerQuery"


def test_request_options_override_auth_and_mutation_id() -> None:
    seen: dict[str, Any] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["authorization"] = request.headers["authorization"]
        seen["body"] = json.loads(request.content)
        return graphql_response(
            {"deployViaAutobuild": {"success": True, "buildId": "build-1"}}
        )

    with StackMachine("default", http_transport=httpx.MockTransport(handler)) as client:
        deployment = client.deployments.create(
            {"upload_url": "zip://example"},
            request_options={
                "api_key": "override",
                "idempotency_key": "mutation-1",
            },
        )

    assert deployment.build_id == "build-1"
    assert seen["authorization"] == "Bearer override"
    assert seen["body"]["variables"]["input"]["uploadUrl"] == "zip://example"
    assert seen["body"]["variables"]["input"]["clientMutationId"] == "mutation-1"


def test_deployments_create_accepts_files_and_upload_progress() -> None:
    seen: dict[str, Any] = {}
    upload_progress: list[stackmachine.UploadProgress] = []

    def on_upload_progress(progress: stackmachine.UploadProgress) -> None:
        upload_progress.append(progress)

    def handler(request: httpx.Request) -> httpx.Response:
        if str(request.url) == "https://storage.example.test/app.zip":
            assert request.method == "POST"
            return httpx.Response(
                200, headers={"Location": "https://storage.example.test/session"}
            )
        if str(request.url) == "https://storage.example.test/session":
            assert request.method == "PUT"
            seen["archive"] = request.content
            return httpx.Response(200)

        body = json.loads(request.content)
        if body["operationName"] == "uploadQuery":
            return graphql_response(
                {"getSignedUrl": {"url": "https://storage.example.test/app.zip"}}
            )
        if body["operationName"] == "srcAutobuildMutation":
            seen["mutation"] = body
            return graphql_response(
                {"deployViaAutobuild": {"success": True, "buildId": "build-files"}}
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        deployment = client.deployments.create(
            app_name="hello-stackmachine",
            owner="tester",
            files={"index.html": "<html><body><h1>Hello</h1></body></html>"},
            chunk_size=10_000_000,
            on_upload_progress=on_upload_progress,
        )

    assert deployment.build_id == "build-files"
    assert seen["mutation"]["variables"]["input"] == {
        "appName": "hello-stackmachine",
        "owner": "tester",
        "uploadUrl": "https://storage.example.test/app.zip",
    }
    assert "files" not in seen["mutation"]["variables"]["input"]
    assert upload_progress[0].loaded == 0
    assert upload_progress[-1].percent == 1
    with zipfile.ZipFile(BytesIO(seen["archive"])) as archive:
        assert archive.read("index.html") == b"<html><body><h1>Hello</h1></body></html>"


async def test_async_deployments_create_accepts_files() -> None:
    seen: dict[str, Any] = {}

    async def handler(request: httpx.Request) -> httpx.Response:
        if str(request.url) == "https://storage.example.test/app.zip":
            return httpx.Response(
                200, headers={"Location": "https://storage.example.test/session"}
            )
        if str(request.url) == "https://storage.example.test/session":
            return httpx.Response(200)

        body = json.loads(request.content)
        if body["operationName"] == "uploadQuery":
            return graphql_response(
                {"getSignedUrl": {"url": "https://storage.example.test/app.zip"}}
            )
        if body["operationName"] == "srcAutobuildMutation":
            seen["mutation"] = body
            return graphql_response(
                {
                    "deployViaAutobuild": {
                        "success": True,
                        "buildId": "build-files-async",
                    }
                }
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        deployment = await client.deployments.create(
            app_name="hello-stackmachine",
            owner="tester",
            files={"index.html": "<h1>Hello</h1>"},
            chunk_size=10_000_000,
        )
    finally:
        await client.close()

    assert deployment.build_id == "build-files-async"
    assert seen["mutation"]["variables"]["input"] == {
        "appName": "hello-stackmachine",
        "owner": "tester",
        "uploadUrl": "https://storage.example.test/app.zip",
    }


def test_deployments_create_rejects_files_with_upload_url() -> None:
    calls = 0

    def handler(_: httpx.Request) -> httpx.Response:
        nonlocal calls
        calls += 1
        return graphql_response({})

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineValidationError) as exc_info:
            client.deployments.create(
                app_name="ambiguous",
                owner="tester",
                upload_url="https://storage.example.test/app.zip",
                files={"index.html": "<h1>Hello</h1>"},
            )

    assert exc_info.value.code == "invalid_deployment_source"
    assert exc_info.value.param == "files"
    assert calls == 0


def test_graphql_errors_are_mapped() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={
                "errors": [
                    {
                        "message": "No access",
                        "extensions": {"code": "FORBIDDEN", "param": "app"},
                    }
                ]
            },
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineGraphQLError) as exc_info:
            client.viewer()

    assert str(exc_info.value) == "No access"
    assert exc_info.value.code == "FORBIDDEN"
    assert exc_info.value.param == "app"


def test_http_errors_are_mapped() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(
            401,
            json={"error": {"message": "Bad token", "code": "bad_token"}},
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineAuthenticationError) as exc_info:
            client.viewer()

    assert str(exc_info.value) == "Bad token"
    assert exc_info.value.code == "bad_token"
    assert exc_info.value.status_code == 401


def test_sync_list_auto_paginates() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        assert body["operationName"] == "srcListDeployAppsQuery"
        assert "getDeployApps" in body["query"]
        assert "ownerId: $ownerId" in body["query"]
        variables = body["variables"]
        calls.append(variables)
        if variables.get("after") is None:
            return graphql_response(
                {
                    "getDeployApps": {
                        "edges": [{"node": app_payload("app_1")}],
                        "pageInfo": {
                            "hasNextPage": True,
                            "hasPreviousPage": False,
                            "endCursor": "cursor-1",
                            "startCursor": "cursor-0",
                        },
                        "totalCount": 2,
                    }
                }
            )
        return graphql_response(
            {
                "getDeployApps": {
                    "edges": [{"node": app_payload("app_2")}],
                    "pageInfo": {
                        "hasNextPage": False,
                        "hasPreviousPage": True,
                        "endCursor": "cursor-2",
                        "startCursor": "cursor-1",
                    },
                    "totalCount": 2,
                }
            }
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        apps = client.apps.list(owner_id="owner_1", limit=1)
        data = apps.auto_paging_to_array(limit=2)

    assert [app.id for app in data] == ["app_1", "app_2"]
    assert calls[0]["first"] == 1
    assert calls[0]["ownerId"] == "owner_1"
    assert calls[1]["after"] == "cursor-1"
    assert calls[1]["ownerId"] == "owner_1"


def test_sync_usage_metrics_support_app_owner_and_viewer_scopes() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcUsageAppMetricsQuery":
            return graphql_response(
                {
                    "node": {
                        "__typename": "DeployApp",
                        "groupedMetrics": usage_metrics_payload(),
                    }
                }
            )
        if body["operationName"] == "srcUsageOwnerMetricsQuery":
            owner_metrics = usage_metrics_payload()
            owner_metrics["totals"]["requests"]["totalRequests"] = "200"
            return graphql_response(
                {
                    "owner": {
                        "__typename": "Namespace",
                        "groupedMetrics": owner_metrics,
                    }
                }
            )
        if body["operationName"] == "srcUsageViewerMetricsQuery":
            viewer_metrics = usage_metrics_payload()
            viewer_metrics["totals"]["workloads"]["workloads"] = 9
            return graphql_response({"viewer": {"groupedMetrics": viewer_metrics}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        app_metrics = client.usage.metrics(
            app="app_1",
            start="2026-06-01T00:00:00Z",
            end="2026-06-30T00:00:00Z",
            grouped_by="BY_HOUR",
        )
        owner_metrics = client.usage.metrics(
            {
                "owner": "stackmachine",
                "start": "2026-06-01T00:00:00Z",
                "end": "2026-06-30T00:00:00Z",
            }
        )
        viewer_metrics = client.usage.metrics(
            start="2026-06-01T00:00:00Z",
            end="2026-06-30T00:00:00Z",
        )
        with pytest.raises(StackMachineValidationError):
            client.usage.metrics(
                app="app_1",
                owner="stackmachine",
                start="2026-06-01T00:00:00Z",
                end="2026-06-30T00:00:00Z",
            )

    assert app_metrics.scope.type == "app"
    assert app_metrics.scope.app_id == "app_1"
    assert app_metrics.totals.requests.total_requests == "9007199254740993"
    assert app_metrics.totals.workloads.wall_cpu_time_millis == "180000"
    assert app_metrics.grouped[0].grouped_at.isoformat() == "2026-06-01T00:00:00+00:00"
    assert owner_metrics.scope.type == "owner"
    assert owner_metrics.scope.owner == "stackmachine"
    assert owner_metrics.scope.owner_type == "Namespace"
    assert owner_metrics.totals.requests.total_requests == "200"
    assert viewer_metrics.scope.type == "viewer"
    assert viewer_metrics.totals.workloads.workloads == 9
    assert calls[0]["variables"] == {
        "appId": "app_1",
        "start": "2026-06-01T00:00:00Z",
        "end": "2026-06-30T00:00:00Z",
        "groupedBy": "BY_HOUR",
    }
    assert calls[1]["variables"]["owner"] == "stackmachine"
    assert calls[1]["variables"]["groupedBy"] == "BY_DAY"
    assert calls[2]["variables"]["groupedBy"] == "BY_DAY"
    assert len(calls) == 3


def test_sync_usage_metrics_raise_for_missing_scope_targets() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        if body["operationName"] == "srcUsageAppMetricsQuery":
            return graphql_response({"node": None})
        if body["operationName"] == "srcUsageOwnerMetricsQuery":
            return graphql_response({"owner": None})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(stackmachine.StackMachineInvalidRequestError):
            client.usage.metrics(
                app="missing_app",
                start="2026-06-01T00:00:00Z",
                end="2026-06-30T00:00:00Z",
            )
        with pytest.raises(stackmachine.StackMachineInvalidRequestError):
            client.usage.metrics(
                owner="missing-owner",
                start="2026-06-01T00:00:00Z",
                end="2026-06-30T00:00:00Z",
            )


def test_sync_app_volumes_lifecycle() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        variables = body["variables"]
        if body["operationName"] == "srcListAppVolumesQuery":
            is_first_page = variables.get("after") is None
            volume_id = "volume_1" if is_first_page else "volume_2"
            return graphql_response(
                {
                    "node": {
                        "volumes": {
                            "edges": [{"node": volume_payload(volume_id)}],
                            "pageInfo": {
                                "hasNextPage": is_first_page,
                                "hasPreviousPage": not is_first_page,
                                "endCursor": "cursor-1"
                                if is_first_page
                                else "cursor-2",
                                "startCursor": "cursor-1"
                                if is_first_page
                                else "cursor-2",
                            },
                            "totalCount": 2,
                        }
                    }
                }
            )
        if body["operationName"] == "srcCreateAppVolumeMutation":
            return graphql_response(
                {
                    "createAppVolume": {
                        "success": True,
                        "volume": volume_payload(
                            "volume_created",
                            mountPath="/uploads",
                            maxSizeBytes=2_147_483_648,
                        ),
                    }
                }
            )
        if body["operationName"] == "srcUpdateVolumeMutation":
            return graphql_response(
                {
                    "updateVolume": {
                        "success": True,
                        "volume": volume_payload(
                            "volume_created",
                            mountPath="/uploads-v2",
                            s3Enabled=True,
                        ),
                    }
                }
            )
        if body["operationName"] == "srcDeleteAppVolumeMutation":
            return graphql_response({"deleteAppVolume": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        volumes = client.apps.volumes.list(
            app="app_1",
            limit=1,
            request_options={"api_key": "override"},
        ).auto_paging_to_array(limit=2)
        created = client.apps.volumes.create(
            app="app_1",
            mount_path="/uploads",
            max_size_bytes=2_147_483_648,
            request_options={"client_mutation_id": "cmid-create-volume"},
        )
        updated = client.apps.volumes.update(
            "volume_created",
            mount_path="/uploads-v2",
            s3_enabled=True,
            request_options={"idempotency_key": "idem-update-volume"},
        )
        client.apps.volumes.delete(
            "volume_created",
            request_options={"client_mutation_id": "cmid-delete-volume"},
        )

    assert [volume.id for volume in volumes] == ["volume_1", "volume_2"]
    assert isinstance(volumes[0], stackmachine.AppVolume)
    assert volumes[0].volume_id == "volume-volume_1"
    assert volumes[0].mount_path == "/data"
    assert volumes[0].max_size_bytes == 1_073_741_824
    assert volumes[0].s3_enabled is False
    assert volumes[0].s3_url is None
    assert volumes[0].explorer_url == "https://console.example.test/volumes/volume_1"
    assert volumes[0].is_added_by_ui is True
    assert created.id == "volume_created"
    assert created.mount_path == "/uploads"
    assert updated.mount_path == "/uploads-v2"
    assert updated.s3_enabled is True

    assert calls[0]["variables"]["appId"] == "app_1"
    assert calls[0]["variables"]["first"] == 1
    assert calls[1]["variables"]["after"] == "cursor-1"
    assert calls[0]["operationName"] == "srcListAppVolumesQuery"
    assert calls[2]["variables"]["input"] == {
        "appId": "app_1",
        "mountPath": "/uploads",
        "maxSizeBytes": 2_147_483_648,
        "clientMutationId": "cmid-create-volume",
    }
    assert calls[3]["variables"]["input"] == {
        "id": "volume_created",
        "mountPath": "/uploads-v2",
        "s3Enabled": True,
        "clientMutationId": "idem-update-volume",
    }
    assert calls[4]["variables"]["input"] == {
        "id": "volume_created",
        "clientMutationId": "cmid-delete-volume",
    }


def test_sync_app_volume_mutations_raise_on_unsuccessful_payloads() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        operation_name = json.loads(request.content)["operationName"]
        if operation_name == "srcCreateAppVolumeMutation":
            return graphql_response(
                {
                    "createAppVolume": {
                        "success": False,
                        "volume": volume_payload("volume_failed"),
                    }
                }
            )
        if operation_name == "srcUpdateVolumeMutation":
            return graphql_response(
                {
                    "updateVolume": {
                        "success": False,
                        "volume": volume_payload("volume_failed"),
                    }
                }
            )
        if operation_name == "srcDeleteAppVolumeMutation":
            return graphql_response({"deleteAppVolume": {"success": False}})
        raise AssertionError(f"Unexpected operation {operation_name}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineAPIError):
            client.apps.volumes.create(app="app_1", mount_path="/data")
        with pytest.raises(StackMachineAPIError):
            client.apps.volumes.update("volume_1", mount_path="/data")
        with pytest.raises(StackMachineAPIError):
            client.apps.volumes.delete("volume_1")


def test_sync_app_git_lifecycle() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcGetAppGitConnectionQuery":
            return graphql_response(
                {
                    "node": {
                        "__typename": "DeployApp",
                        "githubRepoConnection": git_connection_payload("conn_1"),
                    }
                }
            )
        if body["operationName"] == "srcGetAppGitConnectionsQuery":
            return graphql_response(
                {
                    "nodes": [
                        {
                            "__typename": "DeployApp",
                            "githubRepoConnection": git_connection_payload("conn_1"),
                        },
                        {"__typename": "DeployApp", "githubRepoConnection": None},
                    ]
                }
            )
        if body["operationName"] == "srcConnectGithubRepoToAppMutation":
            return graphql_response(
                {
                    "connectGithubRepoToApp": {
                        "success": True,
                        "githubRepoConnection": git_connection_payload("conn_new"),
                    }
                }
            )
        if body["operationName"] == "srcUpdateGithubRepoConnectionMutation":
            return graphql_response(
                {
                    "updateGithubRepoConnection": {
                        "success": True,
                        "githubRepoConnection": git_connection_payload(
                            "conn_new",
                            deployBranch="release",
                            deploymentStatusEvents=False,
                            pullRequestComments=True,
                        ),
                    }
                }
            )
        if body["operationName"] == "srcDisconnectGithubRepoFromAppMutation":
            return graphql_response({"disconnectGithubRepoFromApp": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        connection = client.apps.git.retrieve("app_1")
        many = client.apps.git.retrieve_many(["app_1", "app_2"])
        connected = client.apps.git.connect(
            app="app_1",
            installation_repo_id="repo_1",
            deploy_branch="main",
            request_options={"client_mutation_id": "cmid-connect-git"},
        )
        updated = client.apps.git.update(
            "app_1",
            deploy_branch="release",
            deployment_status_events=False,
            pull_request_comments=True,
        )
        client.apps.git.delete("app_1")

    assert connection.id == "conn_1"
    assert connection.github_repo_installation.installation.slug == "stackmachine"
    assert [item.id if item else None for item in many] == ["conn_1", None]
    assert connected.id == "conn_new"
    assert updated.deploy_branch == "release"
    assert updated.deployment_status_events is False
    assert updated.pull_request_comments is True
    assert calls[0]["variables"] == {"id": "app_1"}
    assert calls[1]["variables"] == {"ids": ["app_1", "app_2"]}
    assert calls[2]["variables"]["input"] == {
        "appId": "app_1",
        "installationRepoId": "repo_1",
        "deployBranch": "main",
        "clientMutationId": "cmid-connect-git",
    }
    assert calls[3]["variables"]["input"] == {
        "appId": "app_1",
        "deployBranch": "release",
        "deploymentStatusEvents": False,
        "pullRequestComments": True,
    }
    assert calls[4]["variables"]["input"] == {"appId": "app_1"}


def test_sync_app_git_update_accepts_legacy_connection_id() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcUpdateGithubRepoConnectionMutation":
            if body["variables"]["input"].get("appId"):
                return httpx.Response(
                    200,
                    json={
                        "errors": [
                            {
                                "message": "Expected a DeployApp id for appId, "
                                "got GithubRepoConnection.",
                            }
                        ]
                    },
                )
            return graphql_response(
                {
                    "updateGithubRepoConnection": {
                        "success": True,
                        "githubRepoConnection": git_connection_payload(
                            "conn_1",
                            pullRequestComments=True,
                        ),
                    }
                }
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        updated = client.apps.git.update(
            "conn_1",
            pull_request_comments=True,
        )

    assert updated.id == "conn_1"
    assert calls[0]["variables"]["input"]["appId"] == "conn_1"
    assert calls[1]["variables"]["input"]["connectionId"] == "conn_1"
    assert calls[1]["variables"]["input"].get("appId") is None
    assert calls[1]["variables"]["input"]["pullRequestComments"] is True


def test_sync_app_databases_lifecycle() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        variables = body["variables"]
        if body["operationName"] == "srcListAppDatabasesQuery":
            is_first_page = variables.get("after") is None
            return graphql_response(
                {
                    "node": {
                        "databases": {
                            "edges": [
                                {
                                    "node": database_payload(
                                        "db_1" if is_first_page else "db_2"
                                    )
                                }
                            ],
                            "pageInfo": {
                                "hasNextPage": is_first_page,
                                "hasPreviousPage": not is_first_page,
                                "endCursor": "cursor-1"
                                if is_first_page
                                else "cursor-2",
                                "startCursor": "cursor-1"
                                if is_first_page
                                else "cursor-2",
                            },
                            "totalCount": 2,
                        }
                    }
                }
            )
        if body["operationName"] == "srcCreateDatabaseAndLinkToAppMutation":
            return graphql_response(
                {
                    "createDatabaseAndLinkToApp": {
                        "database": database_payload("db_created"),
                        "password": "created-secret",
                    }
                }
            )
        if body["operationName"] == "srcRotateAppDatabaseCredentialsMutation":
            return graphql_response(
                {
                    "rotateCredentialsForAppDb": {
                        "database": database_payload("db_created"),
                        "password": "rotated-secret",
                    }
                }
            )
        if body["operationName"] == "srcDeleteAppDatabaseMutation":
            return graphql_response({"deleteAppDb": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        databases = client.apps.databases.list(app="app_1", limit=1)
        data = databases.auto_paging_to_array(limit=2)
        created = client.apps.databases.create(
            app="app_1",
            db_engine="POSTGRES",
            name="primary",
            request_options={"client_mutation_id": "cmid-create-db"},
        )
        rotated = client.apps.databases.rotate_credentials("db_created")
        client.apps.databases.delete("db_created")

    assert [database.id for database in data] == ["db_1", "db_2"]
    assert isinstance(data[0], stackmachine.AppDatabase)
    assert created.database.id == "db_created"
    assert created.password == "created-secret"
    assert rotated.password == "rotated-secret"
    assert calls[0]["variables"] == {"appId": "app_1", "first": 1}
    assert calls[1]["variables"] == {
        "appId": "app_1",
        "first": 1,
        "after": "cursor-1",
    }
    assert calls[2]["variables"]["input"] == {
        "appId": "app_1",
        "dbEngine": "POSTGRES",
        "name": "primary",
        "clientMutationId": "cmid-create-db",
    }
    assert calls[3]["variables"]["input"] == {"id": "db_created"}
    assert calls[4]["variables"]["input"] == {"id": "db_created"}


def test_sync_app_database_create_without_engine_uses_legacy_mutation() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcCreateAppDatabaseMutation":
            return graphql_response(
                {
                    "createAppDb": {
                        "database": database_payload("db_legacy"),
                        "password": "legacy-secret",
                    }
                }
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        created = client.apps.databases.create(app="app_1")

    assert created.database.id == "db_legacy"
    assert created.password == "legacy-secret"
    assert calls[0]["variables"]["input"]["id"] == "app_1"
    assert "dbEngine" not in calls[0]["variables"]["input"]


def test_sync_dns_domains_lifecycle() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        variables = body["variables"]
        if body["operationName"] == "srcListDNSDomainsQuery":
            is_first_page = variables.get("after") is None
            return graphql_response(
                {
                    "getAllDomains": {
                        "edges": [
                            {
                                "node": dns_domain_payload(
                                    "domain_1" if is_first_page else "domain_2",
                                    records=[],
                                )
                            }
                        ],
                        "pageInfo": {
                            "hasNextPage": is_first_page,
                            "hasPreviousPage": not is_first_page,
                            "endCursor": "cursor-1" if is_first_page else "cursor-2",
                            "startCursor": "cursor-1" if is_first_page else "cursor-2",
                        },
                        "totalCount": 2,
                    }
                }
            )
        if body["operationName"] == "srcGetDNSDomainsQuery":
            return graphql_response(
                {
                    "nodes": [
                        dns_domain_payload("domain_1"),
                        {"__typename": "DeployApp"},
                    ]
                }
            )
        if body["operationName"] == "srcGetDNSDomainByNameQuery":
            return graphql_response({"getDomain": dns_domain_payload("domain_named")})
        if body["operationName"] == "srcRegisterDNSDomainMutation":
            return graphql_response(
                {
                    "registerDomain": {
                        "success": True,
                        "domain": dns_domain_payload("domain_created"),
                    }
                }
            )
        if body["operationName"] == "srcUpsertDNSDomainFromZoneFileMutation":
            return graphql_response(
                {
                    "upsertDomainFromZoneFile": {
                        "success": True,
                        "domain": dns_domain_payload("domain_zone"),
                    }
                }
            )
        if body["operationName"] == "srcDeleteDNSDomainMutation":
            return graphql_response({"deleteDomain": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        domains = client.dns.domains.list(owner="owner_1", limit=1)
        data = domains.auto_paging_to_array(limit=2)
        many = client.dns.domains.retrieve_many(["domain_1", "missing"])
        named = client.dns.domains.retrieve_by_name("example.com")
        created = client.dns.domains.create(
            name="example.com",
            owner="owner_1",
            import_records=True,
        )
        imported = client.dns.domains.import_zone_file(
            zone_file="$ORIGIN example.com.",
            delete_missing_records=True,
        )
        client.dns.domains.delete("domain_created")

    assert [domain.id for domain in data] == ["domain_1", "domain_2"]
    assert data[0].owner and data[0].owner.global_name == "stackmachine"
    assert data[0].delegation_status == "VERIFIED"
    assert data[0].nameservers == [
        "ns1.stackmachine.example.",
        "ns2.stackmachine.example.",
    ]
    assert data[0].last_checked_at is not None
    assert data[0].verified_at is not None
    assert [domain.id if domain else None for domain in many] == ["domain_1", None]
    assert named.id == "domain_named"
    assert created.id == "domain_created"
    assert imported.id == "domain_zone"
    assert calls[0]["variables"] == {"owner": "owner_1", "first": 1}
    assert calls[1]["variables"] == {
        "owner": "owner_1",
        "first": 1,
        "after": "cursor-1",
    }
    assert calls[3]["variables"] == {"name": "example.com"}
    assert calls[4]["variables"]["input"] == {
        "name": "example.com",
        "ownerId": "owner_1",
        "importRecords": True,
    }
    assert calls[5]["variables"]["input"] == {
        "zoneFile": "$ORIGIN example.com.",
        "deleteMissingRecords": True,
    }
    assert calls[6]["variables"]["input"] == {"domainId": "domain_created"}


def test_sync_dns_records_lifecycle_and_union_mapping() -> None:
    calls: list[dict[str, Any]] = []
    kinds = [
        "A",
        "AAAA",
        "CAA",
        "CNAME",
        "DNAME",
        "MX",
        "NS",
        "PTR",
        "SOA",
        "SRV",
        "SSHFP",
        "TXT",
    ]
    records = [dns_record_payload(kind, f"record_{kind.lower()}") for kind in kinds]

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcListDNSRecordsQuery":
            return graphql_response(
                {"node": {"__typename": "DNSDomain", "records": records}}
            )
        if body["operationName"] == "srcListDNSRecordsConnectionQuery":
            return graphql_response(
                {
                    "node": {
                        "__typename": "DNSDomain",
                        "recordsConnection": {
                            "edges": [
                                {
                                    "node": dns_record_payload(
                                        "TXT",
                                        "record_paged",
                                    )
                                }
                            ],
                            "pageInfo": {
                                "hasNextPage": False,
                                "hasPreviousPage": False,
                                "endCursor": "cursor-record",
                                "startCursor": "cursor-record",
                            },
                            "totalCount": 1,
                        },
                    }
                }
            )
        if body["operationName"] == "srcGetDNSRecordsQuery":
            return graphql_response({"nodes": [records[0], None]})
        if body["operationName"] == "srcUpsertDNSRecordMutation":
            record_id = body["variables"]["input"].get("recordId")
            return graphql_response(
                {
                    "upsertDNSRecord": {
                        "success": True,
                        "record": dns_record_payload(
                            "MX" if record_id else "CAA",
                            "record_updated" if record_id else "record_created",
                        ),
                    }
                }
            )
        if body["operationName"] == "srcUpdateDNSRecordsMutation":
            return graphql_response(
                {
                    "updateDNSRecords": {
                        "success": True,
                        "records": [
                            dns_record_payload("A", "record_bulk"),
                        ],
                    }
                }
            )
        if body["operationName"] == "srcDeleteDNSRecordMutation":
            return graphql_response({"deleteDNSRecord": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        listed = client.dns.records.list(domain="domain_1")
        paged = client.dns.records.list_page(
            domain="domain_1",
            limit=1,
            sort_by="NEWEST",
        ).auto_paging_to_array(limit=1)
        many = client.dns.records.retrieve_many(["record_a", "missing"])
        created = client.dns.records.create(
            domain="domain_1",
            kind="CAA",
            name="@",
            value="letsencrypt.org",
            ttl=300,
            caa={"flags": 0, "tag": "issue"},
        )
        updated = client.dns.records.update(
            "record_created",
            domain="domain_1",
            kind="CAA",
            name="@",
            value="letsencrypt.org",
            ttl=300,
            caa={"flags": 0, "tag": "issue"},
        )
        updated_many = client.dns.records.update_many(
            domain="domain_1",
            records=[
                {
                    "kind": "A",
                    "name": "api",
                    "value": "192.0.2.2",
                    "ttl": 60,
                }
            ],
        )
        client.dns.records.delete("record_created")

    assert [record.kind for record in listed] == kinds
    assert listed[0].address == "192.0.2.1"
    assert listed[2].flags == 0
    assert listed[2].value == "letsencrypt.org"
    assert listed[5].preference == 10
    assert listed[8].serial == 1
    assert listed[9].priority == 10
    assert listed[10].sshfp_type == 1
    assert listed[11].data == "hello"
    assert [record.id for record in paged] == ["record_paged"]
    assert [record.id if record else None for record in many] == [
        "record_a",
        None,
    ]
    assert created.id == "record_created"
    assert updated.id == "record_updated"
    assert updated_many[0].id == "record_bulk"
    assert calls[0]["variables"] == {"domainId": "domain_1"}
    assert calls[1]["variables"] == {
        "domainId": "domain_1",
        "sortBy": "NEWEST",
        "first": 1,
    }
    assert calls[2]["variables"] == {"ids": ["record_a", "missing"]}
    assert calls[3]["variables"]["input"] == {
        "domainId": "domain_1",
        "kind": "CAA",
        "name": "@",
        "value": "letsencrypt.org",
        "ttl": 300,
        "caa": {"flags": 0, "tag": "issue"},
    }
    assert calls[4]["variables"]["input"] == {
        "domainId": "domain_1",
        "kind": "CAA",
        "name": "@",
        "value": "letsencrypt.org",
        "ttl": 300,
        "recordId": "record_created",
        "caa": {"flags": 0, "tag": "issue"},
    }
    assert calls[5]["variables"]["input"] == {
        "domainId": "domain_1",
        "records": [
            {
                "kind": "A",
                "name": "api",
                "value": "192.0.2.2",
                "ttl": 60,
            }
        ],
    }
    assert calls[6]["variables"]["input"] == {"recordId": "record_created"}


def test_sync_ssh_authorized_key_delete_accepts_id_and_legacy_user_name() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcDeleteSshAuthorizedKeyByIdMutation":
            return graphql_response({"deleteSshAuthorizedKeyById": {"success": True}})
        if body["operationName"] == "srcDeleteSshAuthorizedKeyMutation":
            return graphql_response({"deleteSshAuthorizedKey": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        client.apps.ssh.users.authorized_keys.delete("key_1")
        client.apps.ssh.users.authorized_keys.delete(user="ssh_user_1", name="laptop")

    assert calls[0]["variables"]["input"] == {"authorizedKeyId": "key_1"}
    assert calls[1]["variables"]["input"] == {
        "sshUserId": "ssh_user_1",
        "name": "laptop",
    }


def test_sync_emails_list_and_send() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcListSentEmailsQuery":
            return graphql_response(
                {
                    "node": {
                        "__typename": "DeployApp",
                        "emails": email_connection_payload(
                            email_message_payload(
                                "email_sent",
                                subject="Sent message",
                            )
                        ),
                    }
                }
            )
        if body["operationName"] == "srcListReceivedEmailsQuery":
            return graphql_response(
                {
                    "node": {
                        "__typename": "Namespace",
                        "emails": email_connection_payload(
                            email_message_payload(
                                "email_received",
                                app=None,
                                direction="RECEIVED",
                                receivedAt="2024-01-03T00:00:00Z",
                                sentAt=None,
                                status="RECEIVED",
                                subject="Received message",
                            )
                        ),
                    }
                }
            )
        if body["operationName"] == "srcSendAppEmailMutation":
            return graphql_response(
                {
                    "sendAppEmail": {
                        "success": True,
                        "message": email_message_payload(
                            "email_new",
                            subject="Hello from SDK",
                            to=["user@example.com", "second@example.com"],
                        ),
                    }
                }
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        sent = client.emails.sent.list(
            app="app_1",
            limit=1,
        ).auto_paging_to_array(limit=1)
        received = client.emails.received.list(
            owner="owner_1",
            limit=1,
        ).auto_paging_to_array(limit=1)
        message = client.emails.send(
            app="app_1",
            to=["user@example.com", "second@example.com"],
            cc=["cc@example.com"],
            bcc=["bcc@example.com"],
            reply_to="reply@example.com",
            from_address="app@example.com",
            subject="Hello from SDK",
            text_body="Plain text body",
            html_body="<p>HTML body</p>",
        )

    assert isinstance(sent[0], stackmachine.EmailMessage)
    assert sent[0].id == "email_sent"
    assert sent[0].app and sent[0].app.id == "app_1"
    assert sent[0].app_id == "app_1"
    assert sent[0].owner and sent[0].owner.global_name == "stackmachine"
    assert received[0].direction == "RECEIVED"
    assert received[0].received_at is not None
    assert message.id == "email_new"
    assert message.to == ["user@example.com", "second@example.com"]
    assert calls[0]["variables"] == {"id": "app_1", "first": 1}
    assert calls[1]["variables"] == {"id": "owner_1", "first": 1}
    assert calls[2]["variables"]["input"] == {
        "appId": "app_1",
        "to": ["user@example.com", "second@example.com"],
        "subject": "Hello from SDK",
        "bcc": ["bcc@example.com"],
        "cc": ["cc@example.com"],
        "fromAddress": "app@example.com",
        "htmlBody": "<p>HTML body</p>",
        "replyTo": "reply@example.com",
        "textBody": "Plain text body",
    }


def test_sync_emails_send_supports_raw_mime_upload() -> None:
    requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        content_type = request.headers.get("content-type", "")
        assert content_type.startswith("multipart/form-data")
        body = request.content
        assert b'name="operations"' in body
        assert b'name="map"' in body
        assert b'name="0"; filename="upload"' in body
        assert b'"operationName": "srcSendAppEmailMutation"' in body
        assert b'"rawMessage": null' in body
        assert b'"0": ["variables.input.rawMessage"]' in body
        assert b"Subject: Raw hello" in body
        return graphql_response(
            {
                "sendAppEmail": {
                    "success": True,
                    "message": email_message_payload(
                        "email_raw",
                        subject="Raw hello",
                        to=["user@example.com"],
                    ),
                }
            }
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        message = client.emails.send(
            app="app_1",
            to=["user@example.com"],
            subject="Raw hello",
            raw_message=(
                b"From: app@example.com\r\n"
                b"To: user@example.com\r\n"
                b"Subject: Raw hello\r\n\r\n"
                b"Hello from raw MIME."
            ),
        )

    assert message.id == "email_raw"
    assert len(requests) == 1


def test_sync_emails_validate_list_target_and_raise_on_send_failure() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        if body["operationName"] == "srcSendAppEmailMutation":
            return graphql_response(
                {
                    "sendAppEmail": {
                        "success": False,
                        "message": email_message_payload("email_failed"),
                    }
                }
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineValidationError):
            client.emails.sent.list(app="app_1", owner="owner_1")
        with pytest.raises(StackMachineValidationError):
            client.emails.received.list()
        with pytest.raises(StackMachineAPIError):
            client.emails.send(
                app="app_1",
                to=["user@example.com"],
                subject="Hello",
                text_body="Hello",
            )


def test_sync_new_mutations_raise_on_unsuccessful_or_null_payloads() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        operation_name = json.loads(request.content)["operationName"]
        if operation_name == "srcConnectGithubRepoToAppMutation":
            return graphql_response({"connectGithubRepoToApp": {"success": False}})
        if operation_name == "srcUpdateGithubRepoConnectionMutation":
            return graphql_response({"updateGithubRepoConnection": {"success": False}})
        if operation_name == "srcDisconnectGithubRepoFromAppMutation":
            return graphql_response({"disconnectGithubRepoFromApp": {"success": False}})
        if operation_name == "srcCreateAppDatabaseMutation":
            return graphql_response({"createAppDb": None})
        if operation_name == "srcCreateDatabaseAndLinkToAppMutation":
            return graphql_response({"createDatabaseAndLinkToApp": None})
        if operation_name == "srcRotateAppDatabaseCredentialsMutation":
            return graphql_response({"rotateCredentialsForAppDb": None})
        if operation_name == "srcDeleteAppDatabaseMutation":
            return graphql_response({"deleteAppDb": {"success": False}})
        if operation_name == "srcRegisterDNSDomainMutation":
            return graphql_response({"registerDomain": {"success": False}})
        if operation_name == "srcUpsertDNSDomainFromZoneFileMutation":
            return graphql_response({"upsertDomainFromZoneFile": {"success": False}})
        if operation_name == "srcDeleteDNSDomainMutation":
            return graphql_response({"deleteDomain": {"success": False}})
        if operation_name == "srcUpsertDNSRecordMutation":
            return graphql_response({"upsertDNSRecord": {"success": False}})
        if operation_name == "srcUpdateDNSRecordsMutation":
            return graphql_response({"updateDNSRecords": {"success": False}})
        if operation_name == "srcDeleteDNSRecordMutation":
            return graphql_response({"deleteDNSRecord": {"success": False}})
        if operation_name == "srcSendAppEmailMutation":
            return graphql_response({"sendAppEmail": {"success": False}})
        raise AssertionError(f"Unexpected operation {operation_name}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineAPIError):
            client.apps.git.connect(app="app_1", installation_repo_id="repo_1")
        with pytest.raises(StackMachineAPIError):
            client.apps.git.update("conn_1", deployment_status_events=True)
        with pytest.raises(StackMachineAPIError):
            client.apps.git.delete("app_1")
        with pytest.raises(StackMachineAPIError):
            client.apps.databases.create(app="app_1")
        with pytest.raises(StackMachineAPIError):
            client.apps.databases.create(app="app_1", db_engine="MYSQL")
        with pytest.raises(StackMachineAPIError):
            client.apps.databases.rotate_credentials("db_1")
        with pytest.raises(StackMachineAPIError):
            client.apps.databases.delete("db_1")
        with pytest.raises(StackMachineAPIError):
            client.dns.domains.create(name="example.com")
        with pytest.raises(StackMachineAPIError):
            client.dns.domains.import_zone_file(zone_file="$ORIGIN example.com.")
        with pytest.raises(StackMachineAPIError):
            client.dns.domains.delete("domain_1")
        with pytest.raises(StackMachineAPIError):
            client.dns.records.create(
                domain="domain_1",
                kind="A",
                name="@",
                value="192.0.2.1",
            )
        with pytest.raises(StackMachineAPIError):
            client.dns.records.delete("record_1")
        with pytest.raises(StackMachineAPIError):
            client.dns.records.update_many(
                domain="domain_1",
                records=[{"kind": "A", "name": "@", "value": "192.0.2.1"}],
            )
        with pytest.raises(StackMachineAPIError):
            client.emails.send(
                app="app_1",
                to=["user@example.com"],
                subject="Hello",
                text_body="Hello",
            )


async def test_async_viewer_returns_model() -> None:
    async def handler(_: httpx.Request) -> httpx.Response:
        return graphql_response({"viewer": {"username": "async-user"}})

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        viewer = await client.viewer()
    finally:
        await client.close()

    assert viewer is not None
    assert viewer.username == "async-user"


async def test_async_list_request_can_be_awaited_and_iterated() -> None:
    async def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        assert body["operationName"] == "srcListDeployAppsQuery"
        assert "getDeployApps" in body["query"]
        assert "ownerId: $ownerId" in body["query"]
        assert body["variables"]["ownerId"] == "owner_1"
        return graphql_response(
            {
                "getDeployApps": {
                    "edges": [{"node": app_payload("app_1")}],
                    "pageInfo": {
                        "hasNextPage": False,
                        "hasPreviousPage": False,
                        "endCursor": "cursor-1",
                        "startCursor": "cursor-0",
                    },
                    "totalCount": 1,
                }
            }
        )

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        apps = client.apps.list(owner_id="owner_1", limit=1)
        page = await apps
        iterated = [app async for app in apps]
    finally:
        await client.close()

    assert page.data[0].id == "app_1"
    assert [app.id for app in iterated] == ["app_1"]


async def test_async_usage_metrics_app_scope() -> None:
    calls: list[dict[str, Any]] = []

    async def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        assert body["operationName"] == "srcUsageAppMetricsQuery"
        return graphql_response(
            {
                "node": {
                    "__typename": "DeployApp",
                    "groupedMetrics": usage_metrics_payload(),
                }
            }
        )

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        metrics = await client.usage.metrics(
            app="app_1",
            start="2026-06-01T00:00:00Z",
            end="2026-06-30T00:00:00Z",
        )
    finally:
        await client.close()

    assert metrics.scope.type == "app"
    assert metrics.scope.app_id == "app_1"
    assert metrics.totals.requests.total_requests == "9007199254740993"
    assert calls[0]["variables"]["groupedBy"] == "BY_DAY"


async def test_async_app_volumes_lifecycle() -> None:
    calls: list[dict[str, Any]] = []

    async def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcListAppVolumesQuery":
            return graphql_response(
                {
                    "node": {
                        "volumes": {
                            "edges": [{"node": volume_payload("volume_async")}],
                            "pageInfo": {
                                "hasNextPage": False,
                                "hasPreviousPage": False,
                                "endCursor": "cursor-async",
                                "startCursor": "cursor-async",
                            },
                            "totalCount": 1,
                        }
                    }
                }
            )
        if body["operationName"] == "srcCreateAppVolumeMutation":
            return graphql_response(
                {
                    "createAppVolume": {
                        "success": True,
                        "volume": volume_payload(
                            "volume_async_created",
                            mountPath="/async",
                        ),
                    }
                }
            )
        if body["operationName"] == "srcUpdateVolumeMutation":
            return graphql_response(
                {
                    "updateVolume": {
                        "success": True,
                        "volume": volume_payload(
                            "volume_async_created",
                            mountPath="/async-v2",
                            s3Enabled=True,
                        ),
                    }
                }
            )
        if body["operationName"] == "srcDeleteAppVolumeMutation":
            return graphql_response({"deleteAppVolume": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        page = await client.apps.volumes.list(app="app_1", limit=1)
        created = await client.apps.volumes.create(
            app="app_1",
            mount_path="/async",
        )
        updated = await client.apps.volumes.update(
            "volume_async_created",
            mount_path="/async-v2",
            s3_enabled=True,
            request_options={"idempotency_key": "idem-async-volume"},
        )
        await client.apps.volumes.delete("volume_async_created")
    finally:
        await client.close()

    assert page.data[0].id == "volume_async"
    assert created.mount_path == "/async"
    assert updated.mount_path == "/async-v2"
    assert updated.s3_enabled is True
    assert calls[0]["variables"]["appId"] == "app_1"
    assert calls[1]["variables"]["input"] == {
        "appId": "app_1",
        "mountPath": "/async",
    }
    assert calls[2]["variables"]["input"] == {
        "id": "volume_async_created",
        "mountPath": "/async-v2",
        "s3Enabled": True,
        "clientMutationId": "idem-async-volume",
    }


def test_pagination_validation() -> None:
    transport = httpx.MockTransport(lambda _: graphql_response({}))
    with StackMachine("secret", http_transport=transport) as client:
        with pytest.raises(StackMachineValidationError):
            client.apps.list(limit=0)


def test_sync_app_cache_lifecycle_and_errors() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcGetAppCacheQuery":
            return graphql_response(
                {
                    "node": {
                        "__typename": "DeployApp",
                        "id": "app_1",
                        "cdnCacheEnabled": True,
                        "cdnCachePurgedAt": "2026-07-03T04:05:06Z",
                    }
                }
            )
        if body["operationName"] == "srcConfigureAppCdnCacheMutation":
            return graphql_response({"configureAppCdnCache": {"success": True}})
        if body["operationName"] == "srcPurgeAppCdnCacheMutation":
            return graphql_response({"purgeAppCdnCache": {"success": True}})
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        cache = client.apps.cache.retrieve("app_1")
        client.apps.cache.update("app_1", enabled=False)
        client.apps.cache.purge("app_1")

    assert cache.app_id == "app_1"
    assert cache.enabled is True
    assert cache.purged_at is not None
    assert cache.purged_at.isoformat() == "2026-07-03T04:05:06+00:00"
    assert calls[1]["variables"] == {
        "app": "app_1",
        "config": {"enabled": False},
    }
    assert calls[2]["variables"] == {"app": "app_1"}

    missing = httpx.MockTransport(lambda _: graphql_response({"node": None}))
    with StackMachine("secret", http_transport=missing) as client:
        with pytest.raises(stackmachine.StackMachineInvalidRequestError):
            client.apps.cache.retrieve("missing")

    def failure_handler(request: httpx.Request) -> httpx.Response:
        operation_name = json.loads(request.content)["operationName"]
        field = (
            "configureAppCdnCache"
            if operation_name == "srcConfigureAppCdnCacheMutation"
            else "purgeAppCdnCache"
        )
        return graphql_response({field: {"success": False}})

    with StackMachine(
        "secret", http_transport=httpx.MockTransport(failure_handler)
    ) as client:
        with pytest.raises(StackMachineAPIError):
            client.apps.cache.update("app_1", enabled=True)
        with pytest.raises(StackMachineAPIError):
            client.apps.cache.purge("app_1")


def test_sync_app_cronjobs_lifecycle_and_command_round_trip() -> None:
    calls: list[dict[str, Any]] = []
    fetch_job = cron_job_payload(
        "fetch_1",
        kind="FETCH",
        target={
            "__typename": "FetchCronJobTarget",
            "path": "/health",
            "method": "POST",
            "headers": {"authorization": "Bearer token"},
            "body": "ping",
            "expectBodyIncludes": "pong",
            "expectBodyRegex": None,
            "expectStatusCodes": [200, 204],
        },
    )

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if body["operationName"] == "srcListAppCronJobsQuery":
            return graphql_response(
                {
                    "node": {
                        "cronJobs": {
                            "edges": [
                                {"node": cron_job_payload("execute_1")},
                                {"node": fetch_job},
                            ],
                            "pageInfo": {
                                "hasNextPage": False,
                                "hasPreviousPage": False,
                                "endCursor": "cursor_2",
                                "startCursor": "cursor_1",
                            },
                            "totalCount": 2,
                        }
                    }
                }
            )
        if body["operationName"] == "srcGetCronJobsByIdsQuery":
            return graphql_response({"nodes": [cron_job_payload("execute_1"), None]})
        if body["operationName"] == "srcCreateCronJobMutation":
            return graphql_response(
                {"createCronJob": {"cronJob": cron_job_payload("created")}}
            )
        if body["operationName"] == "srcUpdateCronJobMutation":
            return graphql_response(
                {
                    "updateCronJob": {
                        "cronJob": cron_job_payload(
                            "created", enabled=False, maxRetries=None, timeout=None
                        )
                    }
                }
            )
        if body["operationName"] == "srcDeleteCronJobMutation":
            return graphql_response(
                {
                    "deleteCronJob": {
                        "success": True,
                        "deletedCronJobId": "created",
                    }
                }
            )
        raise AssertionError(f"Unexpected operation {body['operationName']}")

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        page = client.apps.cronjobs.list(
            app="app_1", kind="EXECUTE", sort_by="OLDEST", limit=2
        )
        many = client.apps.cronjobs.retrieve_many(["execute_1", "missing"])
        created = client.apps.cronjobs.create(
            app="app_1",
            name="cleanup",
            schedule="0 2 * * *",
            execute={
                "command": "python cleanup.py --label '30 days' path\\ with\\ spaces",
                "env": {"LOG_LEVEL": "debug"},
                "package_name": "python/python",
            },
            request_options={"idempotency_key": "cron-create-1"},
        )
        updated = client.apps.cronjobs.update(
            "created",
            enabled=False,
            max_retries=None,
            timeout=None,
        )
        client.apps.cronjobs.delete("created")

    assert page.url == "/v1/apps/cronjobs"
    assert page.total_count == 2
    assert isinstance(page.data[0], stackmachine.CronJob)
    assert isinstance(page.data[0].target, stackmachine.CronJobExecuteTarget)
    assert shlex.split(page.data[0].target.command or "") == [
        "python",
        "cleanup.py",
        "--older-than",
        "30 days",
        "it's-old",
    ]
    assert page.data[0].target.env == {"LOG_LEVEL": "info"}
    assert isinstance(page.data[1].target, stackmachine.CronJobFetchTarget)
    assert page.data[1].target.headers == {"authorization": "Bearer token"}
    assert page.data[1].target.expect_status_codes == [200, 204]
    assert [job.id if job else None for job in many] == ["execute_1", None]
    assert created.id == "created"
    assert updated.enabled is False
    assert updated.max_retries is None

    assert calls[0]["variables"] == {
        "appId": "app_1",
        "kind": "EXECUTE",
        "sortBy": "OLDEST",
        "first": 2,
    }
    assert calls[2]["variables"]["input"] == {
        "appId": "app_1",
        "name": "cleanup",
        "schedule": "0 2 * * *",
        "execute": {
            "command": "python",
            "cliArgs": ["cleanup.py", "--label", "30 days", "path with spaces"],
            "env": {"LOG_LEVEL": "debug"},
            "packageName": "python/python",
        },
        "clientMutationId": "cron-create-1",
    }
    assert calls[3]["variables"]["input"] == {
        "cronJobId": "created",
        "enabled": False,
        "maxRetries": None,
        "timeout": None,
    }
    assert calls[4]["variables"]["input"]["cronJobId"] == "created"


def test_sync_app_cronjobs_validates_targets_commands_and_payloads() -> None:
    transport = httpx.MockTransport(
        lambda _: pytest.fail("invalid input should not make a request")
    )
    with StackMachine("secret", http_transport=transport) as client:
        with pytest.raises(StackMachineValidationError):
            client.apps.cronjobs.create(
                app="app_1", name="missing", schedule="* * * * *"
            )
        with pytest.raises(StackMachineValidationError):
            client.apps.cronjobs.create(
                app="app_1",
                name="both",
                schedule="* * * * *",
                execute={"command": "echo ok"},
                fetch={"path": "/health"},
            )
        for command in ("   ", "''", "echo 'unterminated", "echo \\"):
            with pytest.raises(StackMachineValidationError):
                client.apps.cronjobs.create(
                    app="app_1",
                    name="invalid",
                    schedule="* * * * *",
                    execute={"command": command},
                )

    def failure_handler(request: httpx.Request) -> httpx.Response:
        operation_name = json.loads(request.content)["operationName"]
        if operation_name == "srcCreateCronJobMutation":
            return graphql_response({"createCronJob": None})
        if operation_name == "srcUpdateCronJobMutation":
            return graphql_response({"updateCronJob": None})
        return graphql_response(
            {"deleteCronJob": {"success": False, "deletedCronJobId": "cron_1"}}
        )

    with StackMachine(
        "secret", http_transport=httpx.MockTransport(failure_handler)
    ) as client:
        with pytest.raises(StackMachineAPIError):
            client.apps.cronjobs.create(
                app="app_1",
                name="missing",
                schedule="* * * * *",
                execute={"command": "echo ok"},
            )
        with pytest.raises(StackMachineAPIError):
            client.apps.cronjobs.update("cron_1", enabled=False)
        with pytest.raises(StackMachineAPIError):
            client.apps.cronjobs.delete("cron_1")


async def test_async_app_cache_and_cronjobs() -> None:
    calls: list[dict[str, Any]] = []
    fetch_job = cron_job_payload(
        "fetch_async",
        kind="FETCH",
        target={
            "__typename": "FetchCronJobTarget",
            "path": "/health",
            "method": "GET",
            "headers": {},
            "body": None,
            "expectBodyIncludes": None,
            "expectBodyRegex": None,
            "expectStatusCodes": [200],
        },
    )

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        operation_name = body["operationName"]
        if operation_name == "srcGetAppCacheQuery":
            return graphql_response(
                {
                    "node": {
                        "__typename": "DeployApp",
                        "id": "app_1",
                        "cdnCacheEnabled": False,
                        "cdnCachePurgedAt": None,
                    }
                }
            )
        if operation_name == "srcConfigureAppCdnCacheMutation":
            return graphql_response({"configureAppCdnCache": {"success": True}})
        if operation_name == "srcPurgeAppCdnCacheMutation":
            return graphql_response({"purgeAppCdnCache": {"success": True}})
        if operation_name == "srcListAppCronJobsQuery":
            return graphql_response(
                {
                    "node": {
                        "cronJobs": {
                            "edges": [{"node": fetch_job}],
                            "pageInfo": {
                                "hasNextPage": False,
                                "hasPreviousPage": False,
                                "endCursor": "cursor",
                                "startCursor": "cursor",
                            },
                            "totalCount": 1,
                        }
                    }
                }
            )
        if operation_name == "srcCreateCronJobMutation":
            return graphql_response({"createCronJob": {"cronJob": fetch_job}})
        if operation_name == "srcUpdateCronJobMutation":
            return graphql_response({"updateCronJob": {"cronJob": fetch_job}})
        if operation_name == "srcDeleteCronJobMutation":
            return graphql_response(
                {
                    "deleteCronJob": {
                        "success": True,
                        "deletedCronJobId": "fetch_async",
                    }
                }
            )
        raise AssertionError(f"Unexpected operation {operation_name}")

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        cache = await client.apps.cache.retrieve("app_1")
        await client.apps.cache.update("app_1", enabled=True)
        await client.apps.cache.purge("app_1")
        page = await client.apps.cronjobs.list(app="app_1", limit=1)
        created = await client.apps.cronjobs.create(
            app="app_1",
            name="healthcheck",
            schedule="*/5 * * * *",
            fetch={
                "path": "/health",
                "headers": {"accept": "application/json"},
                "expect_status_codes": [200],
            },
        )
        await client.apps.cronjobs.update(
            "fetch_async", fetch={"path": "/ready", "method": "POST"}
        )
        await client.apps.cronjobs.delete("fetch_async")
    finally:
        await client.close()

    assert cache.enabled is False
    assert page.data[0].id == "fetch_async"
    assert created.target.kind == "FETCH"
    assert calls[4]["variables"]["input"]["fetch"] == {
        "path": "/health",
        "headers": {"accept": "application/json"},
        "expectStatusCodes": [200],
    }
    assert calls[5]["variables"]["input"]["fetch"] == {
        "path": "/ready",
        "method": "POST",
    }


def test_create_zip_supports_bytes_strings_and_file_paths(tmp_path) -> None:
    path = tmp_path / "file.txt"
    path.write_text("from disk")

    archive_bytes = create_zip(
        {
            "bytes.txt": b"raw",
            "string.txt": "inline",
            "file.txt": path,
        }
    )

    with zipfile.ZipFile(BytesIO(archive_bytes)) as archive:
        assert archive.read("bytes.txt") == b"raw"
        assert archive.read("string.txt") == b"inline"
        assert archive.read("file.txt") == b"from disk"


def package_version_payload(id: str = "version_1", **overrides: Any) -> dict[str, Any]:
    return {
        "__typename": "PackageVersion",
        "id": id,
        "version": overrides.get("version", "0.1.0"),
        "createdAt": overrides.get("created_at", "2026-01-01T00:00:00Z"),
        "package": {
            "id": overrides.get("package_id", f"pkg-{id}"),
            "packageName": overrides.get("package_name", f"pkg-{id}"),
            "namespace": overrides.get("namespace", "tester"),
            "private": overrides.get("private", False),
            "lastVersion": {
                "id": f"{id}-last",
                "version": overrides.get("version", "0.1.0"),
                "createdAt": overrides.get("created_at", "2026-01-01T00:00:00Z"),
                "distribution": {
                    "piritaSha256Hash": "sha256:abc",
                    "piritaDownloadUrl": f"https://cdn.example.test/{id}.webc",
                    "downloadUrl": f"https://cdn.example.test/{id}.tar.gz",
                    "size": 1024,
                    "piritaSize": 2048,
                    "webcVersion": "V3",
                    "webcManifest": "{}",
                },
            },
        },
    }


def search_response(
    nodes: list[dict[str, Any]],
    *,
    has_next: bool = False,
    total: Optional[int] = None,
) -> httpx.Response:
    return graphql_response(
        {
            "search": {
                "edges": [
                    {"cursor": f"cursor-{index}", "node": node}
                    for index, node in enumerate(nodes)
                ],
                "pageInfo": {
                    "hasNextPage": has_next,
                    "hasPreviousPage": False,
                    "endCursor": None,
                    "startCursor": None,
                },
                "totalCount": total if total is not None else len(nodes),
            }
        }
    )


def test_packages_retrieve_maps_lifecycle_state() -> None:
    package = package_version_payload()["package"]
    package.update({"isArchived": True, "archivedBy": {"username": "alice"}})

    def handler(request: httpx.Request) -> httpx.Response:
        assert json.loads(request.content)["variables"] == {"name": "tester/alpha"}
        return graphql_response({"getPackage": package})

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        result = client.packages.retrieve("tester/alpha")

    assert result.is_archived is True
    assert result.archived_by is not None
    assert result.archived_by.username == "alice"
    assert result.last_version is not None
    assert result.last_version.distribution.webc_version == "V3"


def test_packages_versions_resolve_maps_lifecycle_and_rebuilds() -> None:
    version = package_version_payload()["package"]["lastVersion"]
    version.update(
        {
            "yankedAt": "2026-01-02T00:00:00Z",
            "yankReason": "bad build",
            "yankedBy": {"username": "alice"},
            "rebuilds": [{**version, "id": "rebuild_1", "version": "0.1.0+wasix.1"}],
        }
    )

    def handler(request: httpx.Request) -> httpx.Response:
        assert json.loads(request.content)["variables"] == {
            "name": "tester/alpha",
            "version": ">=0.1.0",
        }
        return graphql_response({"getPackageVersion": version})

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        result = client.packages.versions.resolve("tester/alpha", ">=0.1.0")

    assert result is not None
    assert result.yanked_at == datetime(2026, 1, 2, tzinfo=timezone.utc)
    assert result.yank_reason == "bad build"
    assert result.yanked_by is not None
    assert result.yanked_by.username == "alice"
    assert result.rebuilds[0].version == "0.1.0+wasix.1"


async def test_async_packages_retrieve_and_resolve() -> None:
    package = package_version_payload()["package"]
    package.update({"isArchived": False, "archivedBy": None})
    version = package["lastVersion"]
    version.update(
        {"yankedAt": None, "yankReason": None, "yankedBy": None, "rebuilds": []}
    )

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        if "srcGetPackageQuery" in body["query"]:
            return graphql_response({"getPackage": package})
        return graphql_response({"getPackageVersion": version})

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        retrieved = await client.packages.retrieve("tester/alpha")
        resolved = await client.packages.versions.resolve("tester/alpha", "latest")
    finally:
        await client.close()

    assert retrieved.is_archived is False
    assert resolved is not None
    assert resolved.version == "0.1.0"


def test_packages_search_maps_results_and_sends_filter() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body["variables"])
        return search_response(
            [package_version_payload("version_1", package_name="alpha")],
            total=3,
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        page = client.packages.search(
            query="alpha", filter={"owner": "tester"}, limit=1
        )

    assert [result.package.package_name for result in page.data] == ["alpha"]
    assert page.data[0].version == "0.1.0"
    assert page.data[0].package.namespace == "tester"
    assert page.total_count == 3

    last_version = page.data[0].package.last_version
    assert last_version is not None
    assert last_version.distribution.webc_version == "V3"
    assert (
        last_version.distribution.download_url
        == "https://cdn.example.test/version_1.tar.gz"
    )
    assert calls[0]["query"] == "alpha"
    assert calls[0]["packages"] == {"owner": "tester"}
    assert calls[0]["first"] == 1


def test_packages_search_defaults_query_and_sends_empty_filter() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(json.loads(request.content)["variables"])
        return search_response([])

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        client.packages.search()

    assert calls[0]["query"] == ""
    assert calls[0]["packages"] == {}


def test_packages_search_camelizes_snake_case_filter() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(json.loads(request.content)["variables"])
        return search_response([])

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        client.packages.search(
            filter={
                "owner": "tester",
                "published_by": "tester",
                "has_bindings": True,
                "downloads": {"count": 100, "comparison": "GREATER_THAN_OR_EQUAL"},
                "order_by": "TOTAL_DOWNLOADS",
                "sort_by": "DESC",
            }
        )

    assert calls[0]["packages"] == {
        "owner": "tester",
        "publishedBy": "tester",
        "hasBindings": True,
        "downloads": {"count": 100, "comparison": "GREATER_THAN_OR_EQUAL"},
        "orderBy": "TOTAL_DOWNLOADS",
        "sortBy": "DESC",
    }


def test_packages_search_maps_every_package_version() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return search_response(
            [
                package_version_payload("version_1", package_name="alpha"),
                package_version_payload("version_2", package_name="beta"),
            ]
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        page = client.packages.search(query="*")

    assert [result.package.package_name for result in page.data] == [
        "alpha",
        "beta",
    ]


async def test_async_packages_search() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return search_response(
            [package_version_payload("version_1", package_name="alpha")]
        )

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        page = await client.packages.search(filter={"owner": "tester"})
    finally:
        await client.close()

    assert [result.package.package_name for result in page.data] == ["alpha"]


def yank_response(versions: list[dict[str, Any]]) -> httpx.Response:
    return graphql_response({"yankPackageVersions": {"packageVersions": versions}})


def yanked_version_payload(
    version: str, *, is_yanked: bool = True, reason: Optional[str] = "bad build"
) -> dict[str, Any]:
    return {
        "id": f"pkv_{version}",
        "version": version,
        "yankedAt": "2024-01-01T00:00:00Z" if is_yanked else None,
        "yankReason": reason,
    }


def test_packages_yank_sends_input_and_maps_results() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(json.loads(request.content)["variables"])
        return yank_response([yanked_version_payload("1.2.3")])

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        result = client.packages.yank(["pkv_1", "pkv_2"], reason="bad build")

    assert [version.version for version in result] == ["1.2.3"]
    assert result[0].yanked_at == datetime(2024, 1, 1, tzinfo=timezone.utc)
    assert result[0].yank_reason == "bad build"
    assert calls[0]["input"] == {
        "packageVersionIds": ["pkv_1", "pkv_2"],
        "reason": "bad build",
        "undo": False,
    }


def test_packages_yank_accepts_several_ids() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(json.loads(request.content)["variables"])
        return yank_response(
            [yanked_version_payload("1.0.0"), yanked_version_payload("1.1.0")]
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        result = client.packages.yank(["pkv_a", "pkv_b"])

    assert [version.version for version in result] == ["1.0.0", "1.1.0"]
    assert calls[0]["input"]["packageVersionIds"] == ["pkv_a", "pkv_b"]
    # `None` values are pruned from the payload by `_clean_json`, so an
    # omitted reason must not be sent as an explicit `null`.
    assert "reason" not in calls[0]["input"]


def test_packages_unyank_sets_undo_and_omits_reason() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(json.loads(request.content)["variables"])
        return yank_response(
            [yanked_version_payload("1.2.3", is_yanked=False, reason=None)]
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        result = client.packages.unyank(["pkv_1"])

    assert result[0].yanked_at is None
    assert result[0].yank_reason is None
    assert calls[0]["input"]["packageVersionIds"] == ["pkv_1"]
    assert calls[0]["input"]["undo"] is True
    assert "reason" not in calls[0]["input"]


def test_packages_yank_returns_empty_when_nothing_changed() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return yank_response([])

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        result = client.packages.yank(["pkv_1"])

    assert result == []


def test_packages_yank_propagates_permission_errors() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={
                "data": None,
                "errors": [
                    {
                        "message": (
                            "You do not have permission to yank versions of "
                            "this package."
                        ),
                        "extensions": {"code": "FORBIDDEN"},
                    }
                ],
            },
        )

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineGraphQLError) as exc_info:
            client.packages.yank(["pkv_1"])

    assert "permission" in str(exc_info.value)


async def test_async_packages_yank_and_unyank() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(json.loads(request.content)["variables"])
        return yank_response([yanked_version_payload("1.2.3")])

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        yanked = await client.packages.yank(["pkv_1"], reason="oops")
        await client.packages.unyank(["pkv_1"])
    finally:
        await client.close()

    assert [version.version for version in yanked] == ["1.2.3"]
    assert calls[0]["input"]["undo"] is False
    assert calls[0]["input"]["reason"] == "oops"
    assert calls[1]["input"]["undo"] is True


def package_id_response(package_id: str = "pkg_1") -> httpx.Response:
    return graphql_response({"getPackage": {"id": package_id}})


def set_archived_response(is_archived: bool) -> httpx.Response:
    return graphql_response(
        {"setPackageArchived": {"package": {"id": "pkg_1", "isArchived": is_archived}}}
    )


def test_packages_archive_resolves_id_then_archives() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if "getPackage" in body["query"]:
            return package_id_response("pkg_42")
        return set_archived_response(True)

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        archived = client.packages.archive("tester/alpha")

    assert archived is True
    assert calls[0]["variables"] == {"name": "tester/alpha"}
    assert calls[1]["variables"] == {"id": "pkg_42", "archived": True}


def test_packages_unarchive_sends_resolved_id() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if "getPackage" in body["query"]:
            return package_id_response("pkg_7")
        return set_archived_response(False)

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        archived = client.packages.unarchive("tester/alpha")

    assert archived is False
    assert calls[1]["variables"] == {"id": "pkg_7", "archived": False}


def test_packages_archive_raises_when_package_missing() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return graphql_response({"getPackage": None})

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(StackMachineAPIError):
            client.packages.archive("tester/missing")


async def test_async_packages_archive_round_trip() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if "getPackage" in body["query"]:
            return package_id_response("pkg_9")
        return set_archived_response(bool(body["variables"]["archived"]))

    client = AsyncStackMachine("secret", http_transport=httpx.MockTransport(handler))
    try:
        assert await client.packages.archive("tester/alpha") is True
        assert await client.packages.unarchive("tester/alpha") is False
    finally:
        await client.close()

    assert calls[1]["variables"] == {"id": "pkg_9", "archived": True}
    assert calls[3]["variables"] == {"id": "pkg_9", "archived": False}


def test_packages_set_archived_sends_boolean() -> None:
    calls: list[dict[str, Any]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        calls.append(body)
        if "getPackage" in body["query"]:
            return package_id_response("pkg_5")
        return set_archived_response(bool(body["variables"]["archived"]))

    with StackMachine("secret", http_transport=httpx.MockTransport(handler)) as client:
        assert client.packages.set_archived("tester/alpha", True) is True
        assert client.packages.set_archived("tester/alpha", False) is False

    assert calls[1]["variables"] == {"id": "pkg_5", "archived": True}
    assert calls[3]["variables"] == {"id": "pkg_5", "archived": False}
