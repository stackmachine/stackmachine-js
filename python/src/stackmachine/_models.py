from __future__ import annotations

import shlex
from dataclasses import dataclass
from datetime import datetime
from typing import (
    Any,
    Callable,
    Dict,
    List,
    Literal,
    Mapping,
    Optional,
    Sequence,
    Union,
)

from ._utils import parse_datetime


@dataclass
class Viewer:
    username: str


@dataclass
class ExpectedDNSRecord:
    host: str
    record_type: str
    value: str


@dataclass
class DeployAppKindWordPress:
    admin_url: Optional[str] = None

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DeployAppKindWordPress":
        return cls(admin_url=data.get("adminUrl"))


@dataclass
class AppAlias:
    id: str
    hostname: str
    url: str
    state: str
    redirection_http_code: Optional[str]
    redirects_from_ids: List[str]
    redirects_to_id: Optional[str]
    expected_dns_records: List[ExpectedDNSRecord]
    first_checked_at: Optional[datetime]
    last_checked_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_at: Optional[datetime]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "AppAlias":
        return cls(
            id=str(data["id"]),
            hostname=str(data["hostname"]),
            url=str(data["url"]),
            state=str(data["state"]),
            redirection_http_code=data.get("redirectionHttpCode"),
            redirects_from_ids=[
                str(item["id"]) for item in data.get("redirectsFrom") or [] if item
            ],
            redirects_to_id=(
                str(data["redirectsTo"]["id"]) if data.get("redirectsTo") else None
            ),
            expected_dns_records=[
                ExpectedDNSRecord(
                    host=str(record["host"]),
                    record_type=str(record["recordType"]),
                    value=str(record["value"]),
                )
                for record in data.get("expectedDnsRecords") or []
                if record
            ],
            first_checked_at=parse_datetime(data.get("firstCheckedAt")),
            last_checked_at=parse_datetime(data.get("lastCheckedAt")),
            updated_at=parse_datetime(data.get("updatedAt")),
            created_at=parse_datetime(data.get("createdAt")),
        )


@dataclass
class AppVolume:
    id: str
    volume_id: str
    mount_path: str
    max_size_bytes: int
    s3_enabled: bool
    s3_url: Optional[str]
    explorer_url: Optional[str]
    is_added_by_ui: bool

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "AppVolume":
        return cls(
            id=str(data["id"]),
            volume_id=str(data["volumeId"]),
            mount_path=str(data["mountPath"]),
            max_size_bytes=int(data["maxSizeBytes"]),
            s3_enabled=bool(data["s3Enabled"]),
            s3_url=str(data["s3Url"]) if data.get("s3Url") else None,
            explorer_url=(
                str(data["explorerUrl"]) if data.get("explorerUrl") else None
            ),
            is_added_by_ui=bool(data["isAddedByUi"]),
        )


@dataclass
class StackMachineOwnerSummary:
    id: Optional[str]
    type: str
    global_id: Optional[str]
    global_name: Optional[str]
    is_pro: bool
    name: Optional[str] = None
    display_name: Optional[str] = None
    username: Optional[str] = None

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "StackMachineOwnerSummary":
        return cls(
            id=str(data["id"]) if data.get("id") is not None else None,
            type=str(data.get("__typename") or "Owner"),
            global_id=str(data["globalId"]) if data.get("globalId") else None,
            global_name=str(data["globalName"]) if data.get("globalName") else None,
            is_pro=bool(data.get("isPro")),
            name=str(data["name"]) if data.get("name") else None,
            display_name=(
                str(data["displayName"]) if data.get("displayName") else None
            ),
            username=str(data["username"]) if data.get("username") else None,
        )


@dataclass
class StackMachineUserSummary:
    id: str
    username: str
    global_name: Optional[str] = None

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "StackMachineUserSummary":
        return cls(
            id=str(data["id"]),
            username=str(data["username"]),
            global_name=str(data["globalName"]) if data.get("globalName") else None,
        )


@dataclass
class DeployApp:
    id: str
    will_perish_at: Optional[datetime]
    name: str
    url: str
    admin_url: str
    favicon: Optional[str]
    screenshot: Optional[str]
    active_version: Optional["DeployAppVersion"] = None

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DeployApp":
        app = cls(
            id=str(data["id"]),
            will_perish_at=parse_datetime(data.get("willPerishAt")),
            name=str(data["name"]),
            url=str(data["url"]),
            admin_url=str(data["adminUrl"]),
            favicon=data.get("favicon"),
            screenshot=data.get("screenshot"),
        )
        if data.get("activeVersion"):
            app.active_version = DeployAppVersion.from_graphql(
                data["activeVersion"], app=app
            )
        return app


@dataclass
class AppCache:
    app_id: str
    enabled: bool
    purged_at: Optional[datetime]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "AppCache":
        return cls(
            app_id=str(data["id"]),
            enabled=bool(data["cdnCacheEnabled"]),
            purged_at=parse_datetime(data.get("cdnCachePurgedAt")),
        )


def _string_dictionary(value: Any) -> Dict[str, str]:
    if not isinstance(value, Mapping):
        return {}
    return {str(key): item for key, item in value.items() if isinstance(item, str)}


@dataclass
class CronJobExecuteTarget:
    kind: Literal["EXECUTE"]
    command: Optional[str]
    env: Dict[str, str]
    package_name: Optional[str]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "CronJobExecuteTarget":
        command = data.get("command")
        tokens = ([str(command)] if command is not None else []) + [
            item for item in data.get("cliArgs") or [] if isinstance(item, str)
        ]
        return cls(
            kind="EXECUTE",
            command=shlex.join(tokens) if tokens else None,
            env=_string_dictionary(data.get("env")),
            package_name=(
                str(data["packageName"])
                if data.get("packageName") is not None
                else None
            ),
        )


@dataclass
class CronJobFetchTarget:
    kind: Literal["FETCH"]
    path: str
    method: str
    headers: Dict[str, str]
    body: Optional[str]
    expect_body_includes: Optional[str]
    expect_body_regex: Optional[str]
    expect_status_codes: Optional[List[int]]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "CronJobFetchTarget":
        raw_status_codes = data.get("expectStatusCodes")
        return cls(
            kind="FETCH",
            path=str(data["path"]),
            method=str(data["method"]),
            headers=_string_dictionary(data.get("headers")),
            body=str(data["body"]) if data.get("body") is not None else None,
            expect_body_includes=(
                str(data["expectBodyIncludes"])
                if data.get("expectBodyIncludes") is not None
                else None
            ),
            expect_body_regex=(
                str(data["expectBodyRegex"])
                if data.get("expectBodyRegex") is not None
                else None
            ),
            expect_status_codes=(
                [
                    int(status)
                    for status in raw_status_codes
                    if isinstance(status, int) and not isinstance(status, bool)
                ]
                if isinstance(raw_status_codes, list)
                else None
            ),
        )


CronJobTarget = Union[CronJobExecuteTarget, CronJobFetchTarget]


@dataclass
class CronJob:
    id: str
    name: str
    schedule: str
    enabled: bool
    kind: str
    source: str
    is_managed: bool
    max_retries: Optional[int]
    max_schedule_drift: Optional[str]
    timeout: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    target: CronJobTarget

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "CronJob":
        target_data = data["target"]
        typename = target_data.get("__typename")
        if typename == "ExecuteCronJobTarget":
            target: CronJobTarget = CronJobExecuteTarget.from_graphql(target_data)
        elif typename == "FetchCronJobTarget":
            target = CronJobFetchTarget.from_graphql(target_data)
        else:
            raise ValueError("Unsupported cron job target returned by the API.")
        return cls(
            id=str(data["id"]),
            name=str(data["name"]),
            schedule=str(data["schedule"]),
            enabled=bool(data["enabled"]),
            kind=str(data["kind"]),
            source=str(data["source"]),
            is_managed=bool(data["isManaged"]),
            max_retries=(
                int(data["maxRetries"]) if data.get("maxRetries") is not None else None
            ),
            max_schedule_drift=(
                str(data["maxScheduleDrift"])
                if data.get("maxScheduleDrift") is not None
                else None
            ),
            timeout=str(data["timeout"]) if data.get("timeout") is not None else None,
            created_at=parse_datetime(data.get("createdAt")),
            updated_at=parse_datetime(data.get("updatedAt")),
            target=target,
        )


@dataclass
class DeployAppReference:
    id: str

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DeployAppReference":
        return cls(id=str(data["id"]))


@dataclass
class DeployAppVersion:
    id: str
    app: DeployApp

    @classmethod
    def from_graphql(
        cls,
        data: Mapping[str, Any],
        *,
        app: Optional[DeployApp] = None,
    ) -> "DeployAppVersion":
        resolved_app = app or DeployApp.from_graphql(data["app"])
        return cls(id=str(data["id"]), app=resolved_app)


@dataclass
class AppDatabase:
    id: str
    name: str
    host: str
    port: str
    username: str
    password: Optional[str]
    phpmyadmin_url: Optional[str]
    db_explorer_url: Optional[str]
    deleted_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    app: Optional[DeployApp] = None

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "AppDatabase":
        return cls(
            id=str(data["id"]),
            name=str(data["name"]),
            host=str(data["host"]),
            port=str(data["port"]),
            username=str(data["username"]),
            password=str(data["password"]) if data.get("password") else None,
            phpmyadmin_url=(
                str(data["phpmyadminUrl"]) if data.get("phpmyadminUrl") else None
            ),
            db_explorer_url=(
                str(data["dbExplorerUrl"]) if data.get("dbExplorerUrl") else None
            ),
            deleted_at=parse_datetime(data.get("deletedAt")),
            created_at=parse_datetime(data.get("createdAt")),
            updated_at=parse_datetime(data.get("updatedAt")),
            app=DeployApp.from_graphql(data["app"]) if data.get("app") else None,
        )


@dataclass
class AppDatabaseCredentialsResult:
    database: AppDatabase
    password: str


UsageMetricValue = Union[int, str]


@dataclass
class UsageRequestMetrics:
    cached_requests: UsageMetricValue
    data_cached_bytes: UsageMetricValue
    data_served_bytes: UsageMetricValue
    http2xx: UsageMetricValue
    http3xx: UsageMetricValue
    http4xx: UsageMetricValue
    http5xx: UsageMetricValue
    http_other: UsageMetricValue
    percentage_cached: float
    request_duration_millis: UsageMetricValue
    total_requests: UsageMetricValue
    unique_users: int

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "UsageRequestMetrics":
        return cls(
            cached_requests=data["cachedRequests"],
            data_cached_bytes=data["dataCachedBytes"],
            data_served_bytes=data["dataServedBytes"],
            http2xx=data["http2xx"],
            http3xx=data["http3xx"],
            http4xx=data["http4xx"],
            http5xx=data["http5xx"],
            http_other=data["httpOther"],
            percentage_cached=float(data["percentageCached"]),
            request_duration_millis=data["requestDurationMillis"],
            total_requests=data["totalRequests"],
            unique_users=int(data["uniqueUsers"]),
        )


@dataclass
class UsageWorkloadMetrics:
    memory_bytes: UsageMetricValue
    network_egress_bytes: UsageMetricValue
    network_ingress_bytes: UsageMetricValue
    real_cpu_time_millis: UsageMetricValue
    wall_cpu_time_millis: UsageMetricValue
    workloads: int

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "UsageWorkloadMetrics":
        return cls(
            memory_bytes=data["memoryBytes"],
            network_egress_bytes=data["networkEgressBytes"],
            network_ingress_bytes=data["networkIngressBytes"],
            real_cpu_time_millis=data["realCpuTimeMillis"],
            wall_cpu_time_millis=data["wallCpuTimeMillis"],
            workloads=int(data["workloads"]),
        )


@dataclass
class UsageMetricsTotals:
    requests: UsageRequestMetrics
    workloads: UsageWorkloadMetrics

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "UsageMetricsTotals":
        return cls(
            requests=UsageRequestMetrics.from_graphql(data["requests"]),
            workloads=UsageWorkloadMetrics.from_graphql(data["workloads"]),
        )


@dataclass
class GroupedUsageMetrics:
    grouped_at: datetime
    requests: UsageRequestMetrics
    workloads: UsageWorkloadMetrics

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "GroupedUsageMetrics":
        return cls(
            grouped_at=parse_datetime(data["groupedAt"]) or datetime.min,
            requests=UsageRequestMetrics.from_graphql(data["requests"]),
            workloads=UsageWorkloadMetrics.from_graphql(data["workloads"]),
        )


@dataclass
class UsageMetricsScope:
    type: str
    app_id: Optional[str] = None
    owner: Optional[str] = None
    owner_type: Optional[str] = None


@dataclass
class UsageMetrics:
    start_at: datetime
    end_at: datetime
    grouped: List[GroupedUsageMetrics]
    totals: UsageMetricsTotals
    scope: UsageMetricsScope

    @classmethod
    def from_graphql(
        cls, data: Mapping[str, Any], *, scope: UsageMetricsScope
    ) -> "UsageMetrics":
        return cls(
            start_at=parse_datetime(data["startAt"]) or datetime.min,
            end_at=parse_datetime(data["endAt"]) or datetime.min,
            grouped=[
                GroupedUsageMetrics.from_graphql(group)
                for group in data.get("grouped") or []
                if group
            ],
            totals=UsageMetricsTotals.from_graphql(data["totals"]),
            scope=scope,
        )


@dataclass
class GithubAppInstallation:
    id: str
    slug: str
    github_configure_url: str

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "GithubAppInstallation":
        return cls(
            id=str(data["id"]),
            slug=str(data["slug"]),
            github_configure_url=str(data["githubConfigureUrl"]),
        )


@dataclass
class GithubInstallationRepository:
    id: str
    name: str
    namespace: str
    repo_url: str
    url: str
    installation: GithubAppInstallation

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "GithubInstallationRepository":
        return cls(
            id=str(data["id"]),
            name=str(data["name"]),
            namespace=str(data["namespace"]),
            repo_url=str(data["repoUrl"]),
            url=str(data["url"]),
            installation=GithubAppInstallation.from_graphql(data["installation"]),
        )


@dataclass
class GithubRepoConnection:
    id: str
    app: DeployApp
    connected_at: Optional[datetime]
    connected_by: StackMachineUserSummary
    deploy_branch: str
    deployment_status_events: bool
    pull_request_comments: bool
    github_repo_installation: GithubInstallationRepository

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "GithubRepoConnection":
        return cls(
            id=str(data["id"]),
            app=DeployApp.from_graphql(data["app"]),
            connected_at=parse_datetime(data.get("connectedAt")),
            connected_by=StackMachineUserSummary.from_graphql(data["connectedBy"]),
            deploy_branch=str(data["deployBranch"]),
            deployment_status_events=bool(data["deploymentStatusEvents"]),
            pull_request_comments=bool(data["pullRequestComments"]),
            github_repo_installation=GithubInstallationRepository.from_graphql(
                data["githubRepoInstallation"]
            ),
        )


@dataclass
class DNSRecordDomainSummary:
    id: str
    name: str
    slug: str

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DNSRecordDomainSummary":
        return cls(id=str(data["id"]), name=str(data["name"]), slug=str(data["slug"]))


def _dns_record_kind_from_typename(typename: str) -> str:
    record_kinds = {
        "AAAARecord": "AAAA",
        "ARecord": "A",
        "CAARecord": "CAA",
        "CNAMERecord": "CNAME",
        "DNAMERecord": "DNAME",
        "MXRecord": "MX",
        "NSRecord": "NS",
        "PTRRecord": "PTR",
        "SOARecord": "SOA",
        "SRVRecord": "SRV",
        "SSHFPRecord": "SSHFP",
        "TXTRecord": "TXT",
    }
    return record_kinds.get(typename, "%future added value")


def _dns_record_value_from_data(data: Mapping[str, Any]) -> str:
    for key in (
        "value",
        "address",
        "cName",
        "dName",
        "exchange",
        "nsdname",
        "ptrdname",
        "target",
        "data",
        "fingerprint",
        "text",
    ):
        if data.get(key) is not None:
            return str(data[key])
    return ""


@dataclass
class DNSRecord:
    id: str
    type: str
    kind: str
    domain: DNSRecordDomainSummary
    name: str
    text: str
    value: str
    ttl: int
    dns_class: Optional[str]
    deleted_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    address: Optional[str] = None
    c_name: Optional[str] = None
    d_name: Optional[str] = None
    flags: Optional[int] = None
    tag: Optional[str] = None
    exchange: Optional[str] = None
    preference: Optional[int] = None
    nsdname: Optional[str] = None
    ptrdname: Optional[str] = None
    expire: Optional[int] = None
    minimum: Optional[int] = None
    mname: Optional[str] = None
    refresh: Optional[int] = None
    retry: Optional[int] = None
    rname: Optional[str] = None
    serial: Optional[int] = None
    port: Optional[int] = None
    priority: Optional[int] = None
    protocol: Optional[str] = None
    service: Optional[str] = None
    target: Optional[str] = None
    weight: Optional[int] = None
    algorithm: Optional[int] = None
    fingerprint: Optional[str] = None
    sshfp_type: Optional[int] = None
    data: Optional[str] = None

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DNSRecord":
        typename = str(data.get("__typename") or "")
        return cls(
            id=str(data["id"]),
            type=typename,
            kind=_dns_record_kind_from_typename(typename),
            domain=DNSRecordDomainSummary.from_graphql(data["domain"]),
            name=str(data["name"]),
            text=str(data["text"]),
            value=_dns_record_value_from_data(data),
            ttl=int(data["ttl"]),
            dns_class=str(data["dnsClass"]) if data.get("dnsClass") else None,
            deleted_at=parse_datetime(data.get("deletedAt")),
            created_at=parse_datetime(data.get("createdAt")),
            updated_at=parse_datetime(data.get("updatedAt")),
            address=str(data["address"]) if data.get("address") else None,
            c_name=str(data["cName"]) if data.get("cName") else None,
            d_name=str(data["dName"]) if data.get("dName") else None,
            flags=int(data["flags"]) if data.get("flags") is not None else None,
            tag=str(data["tag"]) if data.get("tag") else None,
            exchange=str(data["exchange"]) if data.get("exchange") else None,
            preference=(
                int(data["preference"]) if data.get("preference") is not None else None
            ),
            nsdname=str(data["nsdname"]) if data.get("nsdname") else None,
            ptrdname=str(data["ptrdname"]) if data.get("ptrdname") else None,
            expire=int(data["expire"]) if data.get("expire") is not None else None,
            minimum=(int(data["minimum"]) if data.get("minimum") is not None else None),
            mname=str(data["mname"]) if data.get("mname") else None,
            refresh=int(data["refresh"]) if data.get("refresh") is not None else None,
            retry=int(data["retry"]) if data.get("retry") is not None else None,
            rname=str(data["rname"]) if data.get("rname") else None,
            serial=int(data["serial"]) if data.get("serial") is not None else None,
            port=int(data["port"]) if data.get("port") is not None else None,
            priority=(
                int(data["priority"]) if data.get("priority") is not None else None
            ),
            protocol=str(data["protocol"]) if data.get("protocol") else None,
            service=str(data["service"]) if data.get("service") else None,
            target=str(data["target"]) if data.get("target") else None,
            weight=int(data["weight"]) if data.get("weight") is not None else None,
            algorithm=(
                int(data["algorithm"]) if data.get("algorithm") is not None else None
            ),
            fingerprint=(str(data["fingerprint"]) if data.get("fingerprint") else None),
            sshfp_type=int(data["type"]) if data.get("type") is not None else None,
            data=str(data["data"]) if data.get("data") else None,
        )


@dataclass
class DNSDomain:
    id: str
    name: str
    slug: str
    zone_file: str
    delegation_status: Optional[str]
    nameservers: List[str]
    owner: Optional[StackMachineOwnerSummary]
    records: List[DNSRecord]
    deleted_at: Optional[datetime]
    last_checked_at: Optional[datetime]
    verified_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DNSDomain":
        return cls(
            id=str(data["id"]),
            name=str(data["name"]),
            slug=str(data["slug"]),
            zone_file=str(data["zoneFile"]),
            delegation_status=(
                str(data["delegationStatus"]) if data.get("delegationStatus") else None
            ),
            nameservers=[
                str(nameserver)
                for nameserver in data.get("nameservers") or []
                if nameserver
            ],
            owner=(
                StackMachineOwnerSummary.from_graphql(data["owner"])
                if data.get("owner")
                else None
            ),
            records=[
                DNSRecord.from_graphql(record)
                for record in data.get("records") or []
                if record
            ],
            deleted_at=parse_datetime(data.get("deletedAt")),
            last_checked_at=parse_datetime(data.get("lastCheckedAt")),
            verified_at=parse_datetime(data.get("verifiedAt")),
            created_at=parse_datetime(data.get("createdAt")),
            updated_at=parse_datetime(data.get("updatedAt")),
        )


@dataclass
class EmailMessage:
    id: str
    app: Optional[DeployAppReference]
    app_id: Optional[str]
    owner: Optional[StackMachineOwnerSummary]
    direction: str
    status: str
    from_: str
    to: List[str]
    cc: List[str]
    bcc: List[str]
    reply_to: Optional[str]
    subject: str
    text_body: Optional[str]
    html_body: Optional[str]
    received_at: Optional[datetime]
    sent_at: Optional[datetime]
    created_at: Optional[datetime]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "EmailMessage":
        return cls(
            id=str(data["id"]),
            app=(
                DeployAppReference.from_graphql(data["app"])
                if data.get("app")
                else None
            ),
            app_id=str(data["app"]["id"]) if data.get("app") else None,
            owner=(
                StackMachineOwnerSummary.from_graphql(data["owner"])
                if data.get("owner")
                else None
            ),
            direction=str(data["direction"]),
            status=str(data["status"]),
            from_=str(data["from"]),
            to=[str(address) for address in data.get("to") or [] if address],
            cc=[str(address) for address in data.get("cc") or [] if address],
            bcc=[str(address) for address in data.get("bcc") or [] if address],
            reply_to=str(data["replyTo"]) if data.get("replyTo") else None,
            subject=str(data["subject"]),
            text_body=str(data["textBody"]) if data.get("textBody") else None,
            html_body=str(data["htmlBody"]) if data.get("htmlBody") else None,
            received_at=parse_datetime(data.get("receivedAt")),
            sent_at=parse_datetime(data.get("sentAt")),
            created_at=parse_datetime(data.get("createdAt")),
        )


@dataclass
class Log:
    datetime: Optional[datetime]
    instance_id: str
    message: str
    stream: Optional[str]
    timestamp: float

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "Log":
        return cls(
            datetime=parse_datetime(data.get("datetime")),
            instance_id=str(data["instanceId"]),
            message=str(data["message"]),
            stream=data.get("stream"),
            timestamp=float(data["timestamp"]),
        )


@dataclass
class SshAuthorizedKey:
    id: str
    name: Optional[str]
    public_key: str
    created_at: Optional[datetime]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "SshAuthorizedKey":
        return cls(
            id=str(data["id"]),
            name=data.get("name"),
            public_key=str(data["publicKey"]),
            created_at=parse_datetime(data.get("createdAt")),
        )


@dataclass
class SshUser:
    id: str
    username: str
    port: int
    server_host: str
    sftp_root_folder: str
    authentication_methods: Optional[List[str]]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "SshUser":
        methods = data.get("authenticationMethods")
        return cls(
            id=str(data["id"]),
            username=str(data["username"]),
            port=int(data["port"]),
            server_host=str(data["serverHost"]),
            sftp_root_folder=str(data["sftpRootFolder"]),
            authentication_methods=list(methods) if methods is not None else None,
        )


@dataclass
class AppSshServer:
    id: str
    enabled: bool

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "AppSshServer":
        return cls(id=str(data["id"]), enabled=bool(data["enabled"]))


@dataclass
class DeploymentProgress:
    kind: str
    message: Optional[str]
    datetime: Optional[datetime]
    stream: Optional[str]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "DeploymentProgress":
        return cls(
            kind=str(data["kind"]),
            message=data.get("message"),
            datetime=parse_datetime(data.get("datetime")),
            stream=data.get("stream"),
        )


@dataclass
class UploadProgress:
    loaded: int
    total: int
    percent: float


OnProgress = Callable[[DeploymentProgress], None]
OnUploadProgress = Callable[[UploadProgress], None]


def app_aliases_from_nodes(
    ids: Sequence[str],
    nodes: Sequence[Optional[Mapping[str, Any]]],
) -> List[Optional[AppAlias]]:
    values: List[Optional[AppAlias]] = []
    for index, _ in enumerate(ids):
        node = nodes[index] if index < len(nodes) else None
        values.append(
            AppAlias.from_graphql(node)
            if node and node.get("__typename") == "AppAlias"
            else None
        )
    return values


@dataclass
class PackageDistribution:
    pirita_sha256_hash: Optional[str]
    pirita_download_url: Optional[str]
    download_url: Optional[str]
    size: Optional[int]
    pirita_size: Optional[int]
    webc_version: Optional[str]
    # The webc manifest, as a JSON string.
    webc_manifest: Optional[str]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "PackageDistribution":
        return cls(
            pirita_sha256_hash=data.get("piritaSha256Hash"),
            pirita_download_url=data.get("piritaDownloadUrl"),
            download_url=data.get("downloadUrl"),
            size=data.get("size"),
            pirita_size=data.get("piritaSize"),
            webc_version=data.get("webcVersion"),
            webc_manifest=data.get("webcManifest"),
        )


@dataclass
class PackageVersion:
    id: str
    version: str
    created_at: Optional[datetime]
    distribution: PackageDistribution

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "PackageVersion":
        return cls(
            id=str(data["id"]),
            version=str(data["version"]),
            created_at=parse_datetime(data.get("createdAt")),
            distribution=PackageDistribution.from_graphql(
                data.get("distribution") or {}
            ),
        )


@dataclass
class Package:
    id: str
    package_name: str
    namespace: Optional[str]
    last_version: Optional[PackageVersion]
    private: bool

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "Package":
        last_version = data.get("lastVersion")
        return cls(
            id=str(data["id"]),
            package_name=str(data["packageName"]),
            namespace=data.get("namespace"),
            last_version=(
                PackageVersion.from_graphql(last_version) if last_version else None
            ),
            private=bool(data["private"]),
        )


@dataclass
class PackageActor:
    username: str

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "PackageActor":
        return cls(username=str(data["username"]))


@dataclass
class PackageDetails(Package):
    is_archived: bool
    archived_by: Optional[PackageActor]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "PackageDetails":
        package = Package.from_graphql(data)
        archived_by = data.get("archivedBy")
        return cls(
            id=package.id,
            package_name=package.package_name,
            namespace=package.namespace,
            last_version=package.last_version,
            private=package.private,
            is_archived=bool(data["isArchived"]),
            archived_by=(
                PackageActor.from_graphql(archived_by) if archived_by else None
            ),
        )


@dataclass
class ResolvedPackageVersion(PackageVersion):
    yanked_at: Optional[datetime]
    yank_reason: Optional[str]
    yanked_by: Optional[PackageActor]
    rebuilds: List[PackageVersion]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "ResolvedPackageVersion":
        version = PackageVersion.from_graphql(data)
        yanked_by = data.get("yankedBy")
        return cls(
            id=version.id,
            version=version.version,
            created_at=version.created_at,
            distribution=version.distribution,
            yanked_at=parse_datetime(data.get("yankedAt")),
            yank_reason=data.get("yankReason"),
            yanked_by=PackageActor.from_graphql(yanked_by) if yanked_by else None,
            rebuilds=[
                PackageVersion.from_graphql(rebuild)
                for rebuild in data.get("rebuilds") or []
            ],
        )


@dataclass
class YankedPackageVersion:
    id: str
    version: str
    yanked_at: Optional[datetime]
    yank_reason: Optional[str]

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "YankedPackageVersion":
        return cls(
            id=str(data["id"]),
            version=str(data["version"]),
            yanked_at=parse_datetime(data.get("yankedAt")),
            yank_reason=data.get("yankReason"),
        )


@dataclass
class SearchPackageVersion:
    id: str
    version: str
    created_at: Optional[datetime]
    package: Package

    @classmethod
    def from_graphql(cls, data: Mapping[str, Any]) -> "SearchPackageVersion":
        return cls(
            id=str(data["id"]),
            version=str(data["version"]),
            created_at=parse_datetime(data.get("createdAt")),
            package=Package.from_graphql(data["package"]),
        )
