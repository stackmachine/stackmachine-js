import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import StackMachineDefault, {
  AutobuildApp,
  AppDatabase,
  AppVolume,
  DNSDomain,
  DNSRecord,
  Deployment,
  EmailMessage,
  GithubRepoConnection,
  StackMachine,
  StackMachineAPIError,
  StackMachineAuthenticationError,
  StackMachineConnectionError,
  StackMachineGraphQLError,
  StackMachineInvalidRequestError,
  StackMachineRateLimitError,
  StackMachineValidationError,
} from "../dist/index.js";

const require = createRequire(import.meta.url);

const jsonResponse = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });

const viewerResponse = (username = "tester") =>
  jsonResponse({
    data: {
      viewer: {
        id: `viewer-${username}`,
        username,
      },
    },
  });

const deleteAppResponse = (success = true) =>
  jsonResponse({
    data: {
      deleteApp: {
        success,
      },
    },
  });

const appNode = (id) => ({
  __typename: "DeployApp",
  id,
  willPerishAt: null,
  createdAt: "2026-01-01T00:00:00Z",
  name: `app-${id}`,
  url: `https://${id}.example.test`,
  adminUrl: `https://${id}.example.test/admin`,
  activeVersion: null,
  favicon: null,
  screenshot: null,
});

const cronJobNode = (id, overrides = {}) => ({
  __typename: "CronJob",
  id,
  name: `cron-${id}`,
  schedule: "0 * * * *",
  enabled: true,
  kind: "EXECUTE",
  source: "API",
  isManaged: false,
  maxRetries: 3,
  maxScheduleDrift: "5m",
  timeout: "30s",
  createdAt: "2026-07-01T00:00:00Z",
  updatedAt: "2026-07-02T00:00:00Z",
  target: {
    __typename: "ExecuteCronJobTarget",
    command: "python",
    cliArgs: ["cleanup.py", "--older-than", "30 days", "it's-old"],
    env: { LOG_LEVEL: "info" },
    packageName: null,
  },
  ...overrides,
});

const appAliasNode = (id) => ({
  __typename: "AppAlias",
  id,
  hostname: `${id}.example.test`,
  url: `https://${id}.example.test`,
  state: "VERIFIED",
  redirectionHttpCode: null,
  redirectsFrom: [],
  redirectsTo: null,
  expectedDnsRecords: [
    {
      host: `${id}.example.test`,
      recordType: "CNAME",
      value: "stackmachine.example.test",
    },
  ],
  firstCheckedAt: null,
  lastCheckedAt: null,
  updatedAt: "2026-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
});

const appVolumeNode = (id, overrides = {}) => ({
  __typename: "AppVolume",
  id,
  volumeId: `volume-${id}`,
  mountPath: "/data",
  maxSizeBytes: 1_073_741_824,
  s3Enabled: false,
  s3Url: null,
  explorerUrl: `https://console.example.test/volumes/${id}`,
  isAddedByUi: true,
  ...overrides,
});

const appDatabaseNode = (id, overrides = {}) => ({
  __typename: "AppDatabase",
  id,
  name: `db_${id}`,
  host: "db.example.test",
  port: "3306",
  username: `user_${id}`,
  password: null,
  phpmyadminUrl: `https://phpmyadmin.example.test/${id}`,
  dbExplorerUrl: `https://console.example.test/databases/${id}`,
  deletedAt: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  app: appNode("app_1"),
  ...overrides,
});

const usageMetricsPayload = (overrides = {}) => ({
  startAt: "2026-06-01T00:00:00Z",
  endAt: "2026-06-30T00:00:00Z",
  grouped: [
    {
      groupedAt: "2026-06-01T00:00:00Z",
      requests: {
        cachedRequests: "12",
        dataCachedBytes: "2048",
        dataServedBytes: "4096",
        http2xx: "100",
        http3xx: "7",
        http4xx: "3",
        http5xx: "1",
        httpOther: "2",
        percentageCached: 12.5,
        requestDurationMillis: "3456",
        totalRequests: "9007199254740993",
        uniqueUsers: 42,
      },
      workloads: {
        memoryBytes: "8192",
        networkEgressBytes: "16384",
        networkIngressBytes: "32768",
        realCpuTimeMillis: "120000",
        wallCpuTimeMillis: "180000",
        workloads: 5,
      },
    },
  ],
  totals: {
    requests: {
      cachedRequests: "12",
      dataCachedBytes: "2048",
      dataServedBytes: "4096",
      http2xx: "100",
      http3xx: "7",
      http4xx: "3",
      http5xx: "1",
      httpOther: "2",
      percentageCached: 12.5,
      requestDurationMillis: "3456",
      totalRequests: "9007199254740993",
      uniqueUsers: 42,
    },
    workloads: {
      memoryBytes: "8192",
      networkEgressBytes: "16384",
      networkIngressBytes: "32768",
      realCpuTimeMillis: "120000",
      wallCpuTimeMillis: "180000",
      workloads: 5,
    },
  },
  ...overrides,
});

const githubRepoConnectionNode = (id, overrides = {}) => ({
  __typename: "GithubRepoConnection",
  id,
  connectedAt: "2026-01-01T00:00:00Z",
  connectedBy: {
    id: "user_1",
    username: "octocat",
    globalName: "octocat",
  },
  deployBranch: "main",
  deploymentStatusEvents: true,
  pullRequestComments: false,
  app: appNode("app_1"),
  githubRepoInstallation: {
    id: `repo_${id}`,
    name: "example-repo",
    namespace: "stackmachine",
    repoUrl: "https://github.com/stackmachine/example-repo.git",
    url: "https://github.com/stackmachine/example-repo",
    installation: {
      id: "installation_1",
      slug: "stackmachine",
      githubConfigureUrl:
        "https://github.com/apps/stackmachine/installations/1",
    },
  },
  ...overrides,
});

const dnsOwnerNode = (overrides = {}) => ({
  __typename: "Namespace",
  __isNode: "Namespace",
  __isOwner: "Namespace",
  id: "owner_1",
  globalId: "owner_1",
  globalName: "stackmachine",
  isPro: true,
  name: "stackmachine",
  displayName: "StackMachine",
  ...overrides,
});

const dnsRecordNode = (id, kind = "ARecord", overrides = {}) => {
  const base = {
    __typename: kind,
    __isNode: kind,
    __isDNSRecord: kind,
    __isDNSRecordInterface: kind,
    id,
    createdAt: "2026-01-01T00:00:00Z",
    deletedAt: null,
    dnsClass: "IN",
    domain: {
      id: "dns_domain_1",
      name: "example.com",
      slug: "example-com",
    },
    name: "www",
    text: "192.0.2.1",
    ttl: 300,
    updatedAt: "2026-01-01T00:00:00Z",
  };
  const extras = {
    AAAARecord: { address: "2001:db8::1", text: "2001:db8::1" },
    ARecord: { address: "192.0.2.1" },
    CAARecord: { flags: 0, tag: "ISSUE", value: "letsencrypt.org" },
    CNAMERecord: { cName: "target.example.com." },
    DNAMERecord: { dName: "target.example.com." },
    MXRecord: { exchange: "mail.example.com.", preference: 10 },
    NSRecord: { nsdname: "ns1.example.com." },
    PTRRecord: { ptrdname: "ptr.example.com." },
    SOARecord: {
      expire: 1_209_600,
      minimum: 300,
      mname: "ns1.example.com.",
      refresh: 3_600,
      retry: 600,
      rname: "hostmaster.example.com.",
      serial: 1,
    },
    SRVRecord: {
      port: 443,
      priority: 10,
      protocol: "tcp",
      service: "xmpp",
      target: "xmpp.example.com.",
      weight: 5,
    },
    SSHFPRecord: {
      algorithm: "RSA",
      fingerprint: "abcdef",
      type: "SHA1",
    },
    TXTRecord: { data: "hello=world" },
  };
  return {
    ...base,
    ...extras[kind],
    ...overrides,
  };
};

const dnsDomainNode = (id, overrides = {}) => ({
  __typename: "DNSDomain",
  id,
  name: "example.com",
  slug: "example-com",
  zoneFile: "$ORIGIN example.com.",
  delegationStatus: "VERIFIED",
  nameservers: ["ns1.stackmachine.example.", "ns2.stackmachine.example."],
  deletedAt: null,
  lastCheckedAt: "2026-01-02T00:00:00Z",
  verifiedAt: "2026-01-02T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  owner: dnsOwnerNode(),
  records: [dnsRecordNode("dns_record_1")],
  ...overrides,
});

const emailMessageNode = (id, overrides = {}) => ({
  __typename: "EmailMessage",
  id,
  app: appNode("app_1"),
  bcc: [],
  cc: [],
  createdAt: "2026-01-01T00:00:00Z",
  direction: "SENT",
  from: "app@example.com",
  htmlBody: "<p>Hello</p>",
  owner: dnsOwnerNode(),
  receivedAt: null,
  replyTo: null,
  sentAt: "2026-01-01T00:00:00Z",
  status: "SENT",
  subject: "Hello",
  textBody: "Hello",
  to: ["user@example.com"],
  ...overrides,
});

const sshUserNode = (id) => ({
  __typename: "SshUser",
  id,
  username: `user-${id}`,
  port: 2222,
  serverHost: "ssh.example.test",
  sftpRootFolder: "/",
  authenticationMethods: ["PUBLIC_KEY"],
});

const appVersionNode = (id = "version_1", appId = "app_1") => ({
  id,
  app: appNode(appId),
});

const deploymentCreateResponse = (buildId = "build_1", success = true) =>
  jsonResponse({
    data: {
      deployViaAutobuild: {
        success,
        buildId,
      },
    },
  });

const deploymentStatusResponse = (status) =>
  jsonResponse({
    data: {
      autobuildDeploymentStatus: status,
    },
  });

const uploadQueryResponse = (url = "https://storage.example.test/upload.zip") =>
  jsonResponse({
    data: {
      getSignedUrl: {
        url,
      },
    },
  });

const uploadSessionResponse = (
  uploadUrl = "https://storage.example.test/session",
) =>
  new Response(null, {
    status: 200,
    headers: {
      location: uploadUrl,
    },
  });

const uploadRangeResponse = (endByte) =>
  new Response(null, {
    status: 308,
    headers: {
      range: `bytes=0-${endByte}`,
    },
  });

const uploadCompleteResponse = () => new Response(null, { status: 200 });

const appsListConnection = (
  items,
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: items.at(-1)?.cursor ?? null,
    startCursor: items[0]?.cursor ?? null,
  },
  totalCount = items.length,
) => ({
  edges: items.map((item) => ({
    cursor: item.cursor,
    node: appNode(item.id),
  })),
  pageInfo,
  totalCount,
});

const appsListResponse = (
  items,
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: items.at(-1)?.cursor ?? null,
    startCursor: items[0]?.cursor ?? null,
  },
  totalCount = items.length,
) =>
  jsonResponse({
    data: {
      getDeployApps: appsListConnection(items, pageInfo, totalCount),
    },
  });

const appVolumesListResponse = (
  items,
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: items.at(-1)?.cursor ?? null,
    startCursor: items[0]?.cursor ?? null,
  },
  totalCount = items.length,
) =>
  jsonResponse({
    data: {
      node: {
        __typename: "DeployApp",
        id: "app_1",
        volumes: {
          edges: items.map((item) => ({
            cursor: item.cursor,
            node: appVolumeNode(item.id, item.overrides),
          })),
          pageInfo,
          totalCount,
        },
      },
    },
  });

const appDatabasesListResponse = (
  items,
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: items.at(-1)?.cursor ?? null,
    startCursor: items[0]?.cursor ?? null,
  },
  totalCount = items.length,
) =>
  jsonResponse({
    data: {
      node: {
        __typename: "DeployApp",
        id: "app_1",
        databases: {
          edges: items.map((item) => ({
            cursor: item.cursor,
            node: appDatabaseNode(item.id, item.overrides),
          })),
          pageInfo,
          totalCount,
        },
      },
    },
  });

const dnsDomainsListResponse = (
  items,
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: items.at(-1)?.cursor ?? null,
    startCursor: items[0]?.cursor ?? null,
  },
  totalCount = items.length,
) =>
  jsonResponse({
    data: {
      getAllDomains: {
        edges: items.map((item) => ({
          cursor: item.cursor,
          node: dnsDomainNode(item.id, item.overrides),
        })),
        pageInfo,
        totalCount,
      },
    },
  });

const abortError = () =>
  Object.assign(new Error("Aborted"), { name: "AbortError" });

function mockFetch(handler) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    const body =
      typeof init.body === "string" && init.body
        ? JSON.parse(init.body)
        : init.body;
    const call = {
      url: String(url),
      init,
      headers: new Headers(init.headers),
      body,
    };
    calls.push(call);
    return handler(call, calls.length - 1);
  };
  fetch.calls = calls;
  return fetch;
}

function mockSubscriptionClient(events) {
  const subscriptions = [];
  const client = {
    _getFragmentData: (_, data) => data,
    _requestSubscription: (_subscription, variables, handlers, options) => {
      const subscription = {
        variables,
        options,
        disposed: false,
      };
      subscriptions.push(subscription);
      queueMicrotask(() => {
        for (const event of events) {
          handlers.onNext?.({
            autobuildDeployment: event,
          });
        }
        handlers.onCompleted?.();
      });
      return {
        dispose: () => {
          subscription.disposed = true;
        },
      };
    },
  };
  return { client, subscriptions };
}

test("clients keep independent keys, endpoints, caches, and resources", async () => {
  const fetchA = mockFetch(() => viewerResponse("client-a"));
  const fetchB = mockFetch(() => viewerResponse("client-b"));
  const clientA = new StackMachine("key-a", {
    apiUrl: "https://api-a.example.test/graphql",
    fetch: fetchA,
  });
  const clientB = new StackMachine("key-b", {
    apiUrl: "https://api-b.example.test/graphql",
    fetch: fetchB,
  });

  assert.notEqual(clientA.environment, clientB.environment);
  assert.notEqual(clientA.apps, clientB.apps);
  assert.notEqual(clientA.apps.cache, clientB.apps.cache);
  assert.notEqual(clientA.apps.cronjobs, clientB.apps.cronjobs);
  assert.notEqual(clientA.apps.volumes, clientB.apps.volumes);
  assert.notEqual(clientA.apps.databases, clientB.apps.databases);
  assert.notEqual(clientA.apps.git, clientB.apps.git);
  assert.notEqual(clientA.dns, clientB.dns);
  assert.notEqual(clientA.dns.domains, clientB.dns.domains);
  assert.notEqual(clientA.dns.records, clientB.dns.records);
  assert.notEqual(clientA.emails, clientB.emails);
  assert.notEqual(clientA.emails.sent, clientB.emails.sent);
  assert.notEqual(clientA.emails.received, clientB.emails.received);
  assert.notEqual(clientA.deployments, clientB.deployments);
  assert.notEqual(clientA.files, clientB.files);
  assert.notEqual(clientA.usage, clientB.usage);

  assert.deepEqual(await clientA.viewer({ force: false }), {
    username: "client-a",
  });
  assert.deepEqual(await clientA.viewer({ force: false }), {
    username: "client-a",
  });
  assert.deepEqual(await clientB.viewer({ force: false }), {
    username: "client-b",
  });
  assert.deepEqual(await clientB.viewer({ force: false }), {
    username: "client-b",
  });

  assert.equal(fetchA.calls.length, 1);
  assert.equal(fetchB.calls.length, 1);
  assert.equal(fetchA.calls[0].url, "https://api-a.example.test/graphql");
  assert.equal(fetchB.calls[0].url, "https://api-b.example.test/graphql");
  assert.equal(fetchA.calls[0].headers.get("authorization"), "Bearer key-a");
  assert.equal(fetchB.calls[0].headers.get("authorization"), "Bearer key-b");
});

test("per-request auth, headers, timeout, signal, and retry options override config", async () => {
  const controller = new AbortController();
  const fetch = mockFetch((call) => {
    assert.ok(call.init.signal instanceof AbortSignal);
    return viewerResponse("override");
  });
  const client = new StackMachine("global-key", {
    apiUrl: "https://api.example.test/graphql",
    headers: {
      "x-global": "global",
      "x-shared": "global",
    },
    timeout: 80_000,
    maxNetworkRetries: 4,
    fetch,
  });

  await client.viewer({
    apiKey: "request-key",
    headers: {
      "x-request": "request",
      "x-shared": "request",
    },
    timeout: 5_000,
    maxNetworkRetries: 0,
    signal: controller.signal,
  });

  const headers = fetch.calls[0].headers;
  assert.equal(headers.get("authorization"), "Bearer request-key");
  assert.equal(headers.get("x-global"), "global");
  assert.equal(headers.get("x-request"), "request");
  assert.equal(headers.get("x-shared"), "request");

  const failingFetch = mockFetch(() =>
    jsonResponse(
      { errors: [{ message: "temporarily unavailable" }] },
      { status: 503 },
    ),
  );
  const retryClient = new StackMachine("global-key", {
    apiUrl: "https://api.example.test/graphql",
    maxNetworkRetries: 4,
    fetch: failingFetch,
  });

  await assert.rejects(
    retryClient.viewer({ maxNetworkRetries: 0 }),
    StackMachineAPIError,
  );
  assert.equal(failingFetch.calls.length, 1);
});

test("StackMachine.init remains compatible and accepts token alias", async () => {
  const fetch = mockFetch(() => viewerResponse("token-user"));
  const warn = console.warn;
  console.warn = () => {};
  try {
    const client = await StackMachine.init({
      token: "token-key",
      apiUrl: "https://api.example.test/graphql",
      fetch,
    });
    assert.deepEqual(await client.viewer(), { username: "token-user" });
  } finally {
    console.warn = warn;
  }

  assert.equal(fetch.calls[0].headers.get("authorization"), "Bearer token-key");
});

test("package supports default import and CommonJS callable construction", async () => {
  assert.equal(StackMachineDefault, StackMachine);

  const StackMachineCjs = require("..");
  assert.equal(typeof StackMachineCjs, "function");
  assert.equal(typeof StackMachineCjs.default, "function");
  assert.equal(typeof StackMachineCjs.StackMachine, "function");
  assert.equal(typeof StackMachineCjs.StackMachineAPIError, "function");

  const callableClient = StackMachineCjs("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: mockFetch(() => viewerResponse("callable")),
  });
  assert.ok(callableClient instanceof StackMachineCjs);
  assert.ok(callableClient instanceof StackMachineCjs.StackMachine);
  assert.equal(callableClient.apiUrl, "https://api.example.test/graphql");
  assert.ok(callableClient.apps);
  assert.ok(callableClient.deployments);
  assert.ok(callableClient.usage);

  const constructedClient = new StackMachineCjs("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: mockFetch(() => viewerResponse("constructed")),
  });
  assert.ok(constructedClient instanceof StackMachineCjs);
  assert.ok(constructedClient instanceof StackMachineCjs.StackMachine);

  const namedClient = new StackMachineCjs.StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: mockFetch(() => viewerResponse("named")),
  });
  assert.ok(namedClient instanceof StackMachineCjs.StackMachine);
});

test("files.upload supports options object progress, chunk size, and injected fetch", async () => {
  const progress = [];
  const fetch = mockFetch((call) => {
    if (call.body?.operationName === "uploadQuery") {
      return uploadQueryResponse();
    }
    if (
      call.url === "https://storage.example.test/upload.zip" &&
      call.init.method === "POST"
    ) {
      return uploadSessionResponse();
    }
    if (
      call.url === "https://storage.example.test/session" &&
      call.init.method === "PUT"
    ) {
      const range = call.headers.get("content-range");
      if (range === "bytes 0-3/10") {
        return uploadRangeResponse(3);
      }
      if (range === "bytes 4-7/10") {
        return uploadRangeResponse(7);
      }
      if (range === "bytes 8-9/10") {
        return uploadCompleteResponse();
      }
    }
    throw new Error(`Unexpected upload call ${call.init.method} ${call.url}`);
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const uploadUrl = await client.files.upload(new Blob(["0123456789"]), {
    chunkSize: 4,
    onProgress: (value) => progress.push(value),
  });

  assert.equal(uploadUrl, "https://storage.example.test/upload.zip");
  assert.deepEqual(
    fetch.calls
      .filter((call) => call.url === "https://storage.example.test/session")
      .map((call) => call.headers.get("content-range")),
    ["bytes 0-3/10", "bytes 4-7/10", "bytes 8-9/10"],
  );
  assert.deepEqual(progress, [
    { loaded: 0, total: 10, percent: 0 },
    { loaded: 4, total: 10, percent: 0.4 },
    { loaded: 8, total: 10, percent: 0.8 },
    { loaded: 10, total: 10, percent: 1 },
  ]);
});

test("files.upload rejects the removed positional progress callback signature", async () => {
  const fetch = mockFetch(() => uploadQueryResponse());
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.files.upload(new Blob(["legacy"]), () => {}),
    (error) => {
      assert.ok(error instanceof StackMachineValidationError);
      assert.equal(
        error.message,
        "`client.files.upload` progress must be passed as `options.onProgress`.",
      );
      return true;
    },
  );
  assert.equal(fetch.calls.length, 0);
});

test("files.upload retries retryable chunk failures and resumes from server range", async () => {
  const progress = [];
  const ranges = [];
  let failedSecondChunk = false;
  const fetch = mockFetch((call) => {
    if (call.body?.operationName === "uploadQuery") {
      return uploadQueryResponse();
    }
    if (call.init.method === "POST") {
      return uploadSessionResponse();
    }
    if (call.init.method === "PUT") {
      const range = call.headers.get("content-range");
      ranges.push(range);
      if (range === "bytes 0-3/8") {
        return uploadRangeResponse(3);
      }
      if (range === "bytes 4-7/8" && !failedSecondChunk) {
        failedSecondChunk = true;
        return new Response("retry later", {
          status: 503,
          statusText: "Unavailable",
        });
      }
      if (range === "bytes */8") {
        return uploadRangeResponse(5);
      }
      if (range === "bytes 6-7/8") {
        return uploadCompleteResponse();
      }
    }
    throw new Error(`Unexpected upload call ${call.init.method} ${call.url}`);
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await client.files.upload(new Blob(["12345678"]), {
    chunkSize: 4,
    maxNetworkRetries: 1,
    onProgress: (value) => progress.push(value),
  });

  assert.deepEqual(ranges, [
    "bytes 0-3/8",
    "bytes 4-7/8",
    "bytes */8",
    "bytes 6-7/8",
  ]);
  assert.deepEqual(progress, [
    { loaded: 0, total: 8, percent: 0 },
    { loaded: 4, total: 8, percent: 0.5 },
    { loaded: 6, total: 8, percent: 0.75 },
    { loaded: 8, total: 8, percent: 1 },
  ]);
});

test("files.upload validates chunk size before fetching", async () => {
  const fetch = mockFetch(() => uploadQueryResponse());
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.files.upload(new Blob(["invalid"]), { chunkSize: 0 }),
    (error) => {
      assert.ok(error instanceof StackMachineValidationError);
      assert.equal(
        error.message,
        "`chunkSize` must be an integer between 1 and 536870912 bytes.",
      );
      return true;
    },
  );
  assert.equal(fetch.calls.length, 0);
});

test("deployments.create uses the autobuild mutation and apps.autobuild remains an alias", async () => {
  const createFetch = mockFetch(() => deploymentCreateResponse("build_create"));
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: createFetch,
  });

  const deployment = await client.deployments.create(
    {
      appName: "app-create",
      owner: "tester",
      uploadUrl: "https://upload.example.test/app.zip",
    },
    {
      apiKey: "request-key",
      headers: { "x-request": "yes" },
      clientMutationId: "cmid-deploy",
    },
  );

  assert.ok(deployment instanceof Deployment);
  assert.ok(deployment instanceof AutobuildApp);
  assert.equal(deployment.buildId, "build_create");
  assert.equal(createFetch.calls[0].body.operationName, "srcAutobuildMutation");
  assert.equal(
    createFetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );
  assert.equal(createFetch.calls[0].headers.get("x-request"), "yes");
  assert.deepEqual(createFetch.calls[0].body.variables.input, {
    appName: "app-create",
    owner: "tester",
    uploadUrl: "https://upload.example.test/app.zip",
    clientMutationId: "cmid-deploy",
  });

  const aliasFetch = mockFetch(() => deploymentCreateResponse("build_alias"));
  const aliasClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: aliasFetch,
  });

  const aliasDeployment = await aliasClient.apps.autobuild({
    appName: "app-alias",
    owner: "tester",
    uploadUrl: "https://upload.example.test/app.zip",
  });

  assert.ok(aliasDeployment instanceof Deployment);
  assert.equal(aliasDeployment.buildId, "build_alias");
  assert.equal(aliasFetch.calls[0].body.operationName, "srcAutobuildMutation");
});

test("deployments.create accepts files and reports upload progress", async () => {
  const progress = [];
  const fetch = mockFetch((call) => {
    if (call.body?.operationName === "uploadQuery") {
      return uploadQueryResponse("https://storage.example.test/app.zip");
    }
    if (
      call.url === "https://storage.example.test/app.zip" &&
      call.init.method === "POST"
    ) {
      return uploadSessionResponse("https://storage.example.test/session");
    }
    if (
      call.url === "https://storage.example.test/session" &&
      call.init.method === "PUT"
    ) {
      assert.match(call.headers.get("content-range"), /^bytes 0-\d+\/\d+$/);
      return uploadCompleteResponse();
    }
    if (call.body?.operationName === "srcAutobuildMutation") {
      return deploymentCreateResponse("build_from_files");
    }
    throw new Error(`Unexpected call ${call.init.method} ${call.url}`);
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const deployment = await client.deployments.create(
    {
      appName: "hello-stackmachine",
      owner: "tester",
      files: {
        "index.html": "<html><body><h1>Hello World!</h1></body></html>",
      },
    },
    {
      chunkSize: 10_000_000,
      onUploadProgress: (entry) => progress.push(entry),
    },
  );

  const mutation = fetch.calls.find(
    (call) => call.body?.operationName === "srcAutobuildMutation",
  );
  assert.ok(mutation);
  assert.equal(deployment.buildId, "build_from_files");
  assert.equal(mutation.body.variables.input.appName, "hello-stackmachine");
  assert.equal(mutation.body.variables.input.owner, "tester");
  assert.equal(
    mutation.body.variables.input.uploadUrl,
    "https://storage.example.test/app.zip",
  );
  assert.match(mutation.body.variables.input.clientMutationId, /^sm_/);
  assert.equal(Object.hasOwn(mutation.body.variables.input, "files"), false);
  assert.equal(progress[0].loaded, 0);
  assert.equal(progress.at(-1).percent, 1);
});

test("deployments.create rejects files together with uploadUrl", async () => {
  const fetch = mockFetch(() => deploymentCreateResponse());
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.deployments.create({
      appName: "ambiguous",
      owner: "tester",
      uploadUrl: "https://storage.example.test/app.zip",
      files: {
        "index.html": "<h1>Hello</h1>",
      },
    }),
    (error) => {
      assert.ok(error instanceof StackMachineValidationError);
      assert.equal(error.code, "invalid_deployment_source");
      assert.equal(error.param, "files");
      return true;
    },
  );
  assert.equal(fetch.calls.length, 0);
});

test("deployments.retrieve maps status/appVersion and throws for missing deployments", async () => {
  const fetch = mockFetch(() =>
    deploymentStatusResponse({
      buildId: "build_found",
      status: "SUCCESS",
      appVersion: appVersionNode("version_1", "app_1"),
    }),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const deployment = await client.deployments.retrieve("build_found", {
    apiKey: "request-key",
  });

  assert.ok(deployment instanceof Deployment);
  assert.equal(deployment.buildId, "build_found");
  assert.equal(deployment.status, "SUCCESS");
  assert.equal(deployment.appVersion.id, "version_1");
  assert.equal(deployment.appVersion.app.id, "app_1");
  assert.equal(await deployment.wait(), deployment.appVersion);
  assert.equal(
    fetch.calls[0].body.operationName,
    "srcGetDeploymentStatusQuery",
  );
  assert.equal(fetch.calls[0].body.variables.buildId, "build_found");
  assert.equal(
    fetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );

  const missingFetch = mockFetch(() => deploymentStatusResponse(null));
  const missingClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: missingFetch,
  });

  await assert.rejects(
    missingClient.deployments.retrieve("build_missing"),
    (error) => {
      assert.ok(error instanceof StackMachineInvalidRequestError);
      assert.equal(error.statusCode, 404);
      assert.equal(error.code, "resource_missing");
      assert.equal(error.param, "buildId");
      return true;
    },
  );
});

test("retrieve methods throw resource_missing errors instead of returning null", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcGetAppByIdQuery":
        return jsonResponse({ data: { app: null } });
      case "srcGetAppByNameQuery":
        return jsonResponse({ data: { app: null } });
      case "srcGetAppAliasesQuery":
        return jsonResponse({ data: { nodes: [null] } });
      case "srcGetSshUserByIdQuery":
        return jsonResponse({ data: { node: null } });
      case "srcGetAppSshServerQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DeployApp",
              id: "app_missing",
              sshServer: null,
            },
          },
        });
      case "srcGetAppGitConnectionQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DeployApp",
              id: "app_missing",
              githubRepoConnection: null,
            },
          },
        });
      case "srcGetDNSDomainsQuery":
        return jsonResponse({ data: { nodes: [null] } });
      case "srcGetDNSDomainByNameQuery":
        return jsonResponse({ data: { getDomain: null } });
      case "srcGetDNSRecordsQuery":
        return jsonResponse({ data: { nodes: [null] } });
      case "srcListDNSRecordsQuery":
        return jsonResponse({ data: { node: null } });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const cases = [
    () => client.apps.retrieve("app_missing"),
    () => client.apps.retrieveByName("app-name", "owner"),
    () => client.apps.domains.retrieve("domain_missing"),
    () => client.apps.ssh.users.retrieve("ssh_user_missing"),
    () => client.apps.ssh.retrieve("app_missing"),
    () => client.apps.git.retrieve("app_missing"),
    () => client.dns.domains.retrieve("dns_domain_missing"),
    () => client.dns.domains.retrieveByName("missing.example.com"),
    () => client.dns.records.retrieve("dns_record_missing"),
    () => client.dns.records.list({ domain: "dns_domain_missing" }),
  ];

  for (const retrieve of cases) {
    await assert.rejects(retrieve(), (error) => {
      assert.ok(error instanceof StackMachineInvalidRequestError);
      assert.equal(error.statusCode, 404);
      assert.equal(error.code, "resource_missing");
      return true;
    });
  }
});

test("retrieveMany methods preserve input order and return null for missing ids", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcGetDeploymentStatusQuery": {
        const { buildId } = call.body.variables;
        return deploymentStatusResponse(
          buildId === "build_missing"
            ? null
            : {
                buildId,
                status: "RUNNING",
                appVersion: null,
              },
        );
      }
      case "srcGetAppsByIdsQuery":
        return jsonResponse({
          data: {
            nodes: [
              appNode("app_1"),
              null,
              sshUserNode("ssh_wrong_for_apps"),
              appNode("app_2"),
            ],
          },
        });
      case "srcGetAppAliasesQuery":
        return jsonResponse({
          data: {
            nodes: [
              appAliasNode("domain_1"),
              null,
              appNode("app_wrong_for_domains"),
              appAliasNode("domain_2"),
            ],
          },
        });
      case "srcGetSshUsersByIdsQuery":
        return jsonResponse({
          data: {
            nodes: [
              sshUserNode("ssh_1"),
              null,
              appNode("app_wrong_for_ssh_users"),
              sshUserNode("ssh_2"),
            ],
          },
        });
      case "srcGetAppSshServersQuery":
        return jsonResponse({
          data: {
            nodes: [
              {
                __typename: "DeployApp",
                id: "app_1",
                sshServer: { id: "ssh_server_1", enabled: true },
              },
              {
                __typename: "DeployApp",
                id: "app_without_ssh",
                sshServer: null,
              },
              sshUserNode("ssh_wrong_for_servers"),
              {
                __typename: "DeployApp",
                id: "app_2",
                sshServer: { id: "ssh_server_2", enabled: false },
              },
            ],
          },
        });
      case "srcGetAppGitConnectionsQuery":
        return jsonResponse({
          data: {
            nodes: [
              {
                __typename: "DeployApp",
                id: "app_1",
                githubRepoConnection: githubRepoConnectionNode("git_1"),
              },
              {
                __typename: "DeployApp",
                id: "app_without_git",
                githubRepoConnection: null,
              },
              sshUserNode("wrong_type"),
              {
                __typename: "DeployApp",
                id: "app_2",
                githubRepoConnection: githubRepoConnectionNode("git_2"),
              },
            ],
          },
        });
      case "srcGetDNSDomainsQuery":
        return jsonResponse({
          data: {
            nodes: [
              dnsDomainNode("dns_domain_1"),
              null,
              appNode("wrong_type"),
              dnsDomainNode("dns_domain_2", { name: "second.example.com" }),
            ],
          },
        });
      case "srcGetDNSRecordsQuery":
        return jsonResponse({
          data: {
            nodes: [
              dnsRecordNode("dns_record_1", "ARecord"),
              null,
              appNode("wrong_type"),
              dnsRecordNode("dns_record_2", "TXTRecord"),
            ],
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });
  const options = { apiKey: "request-key" };

  const deployments = await client.deployments.retrieveMany(
    ["build_1", "build_missing", "build_2"],
    options,
  );
  assert.deepEqual(
    deployments.map((deployment) => deployment?.buildId ?? null),
    ["build_1", null, "build_2"],
  );

  const apps = await client.apps.retrieveMany(
    ["app_1", "app_missing", "wrong_type", "app_2"],
    options,
  );
  assert.deepEqual(
    apps.map((app) => app?.id ?? null),
    ["app_1", null, null, "app_2"],
  );

  const domains = await client.apps.domains.retrieveMany(
    ["domain_1", "domain_missing", "wrong_type", "domain_2"],
    options,
  );
  assert.deepEqual(
    domains.map((domain) => domain?.id ?? null),
    ["domain_1", null, null, "domain_2"],
  );

  const sshUsers = await client.apps.ssh.users.retrieveMany(
    ["ssh_1", "ssh_missing", "wrong_type", "ssh_2"],
    options,
  );
  assert.deepEqual(
    sshUsers.map((user) => user?.id ?? null),
    ["ssh_1", null, null, "ssh_2"],
  );

  const sshServers = await client.apps.ssh.retrieveMany(
    ["app_1", "app_without_ssh", "wrong_type", "app_2"],
    options,
  );
  assert.deepEqual(
    sshServers.map((server) => server?.id ?? null),
    ["ssh_server_1", null, null, "ssh_server_2"],
  );

  const gitConnections = await client.apps.git.retrieveMany(
    ["app_1", "app_without_git", "wrong_type", "app_2"],
    options,
  );
  assert.deepEqual(
    gitConnections.map((connection) => connection?.id ?? null),
    ["git_1", null, null, "git_2"],
  );

  const dnsDomains = await client.dns.domains.retrieveMany(
    ["dns_domain_1", "dns_domain_missing", "wrong_type", "dns_domain_2"],
    options,
  );
  assert.deepEqual(
    dnsDomains.map((domain) => domain?.id ?? null),
    ["dns_domain_1", null, null, "dns_domain_2"],
  );

  const dnsRecords = await client.dns.records.retrieveMany(
    ["dns_record_1", "dns_record_missing", "wrong_type", "dns_record_2"],
    options,
  );
  assert.deepEqual(
    dnsRecords.map((record) => record?.id ?? null),
    ["dns_record_1", null, null, "dns_record_2"],
  );

  const callsBeforeEmptyBatches = fetch.calls.length;
  assert.deepEqual(await client.deployments.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.domains.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.ssh.users.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.ssh.retrieveMany([], options), []);
  assert.deepEqual(await client.apps.git.retrieveMany([], options), []);
  assert.deepEqual(await client.dns.domains.retrieveMany([], options), []);
  assert.deepEqual(await client.dns.records.retrieveMany([], options), []);
  assert.equal(fetch.calls.length, callsBeforeEmptyBatches);

  assert.deepEqual(
    fetch.calls
      .filter(
        (call) => call.body.operationName === "srcGetDeploymentStatusQuery",
      )
      .map((call) => call.body.variables.buildId),
    ["build_1", "build_missing", "build_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetAppsByIdsQuery",
    ).body.variables.ids,
    ["app_1", "app_missing", "wrong_type", "app_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetAppAliasesQuery",
    ).body.variables.ids,
    ["domain_1", "domain_missing", "wrong_type", "domain_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetSshUsersByIdsQuery",
    ).body.variables.ids,
    ["ssh_1", "ssh_missing", "wrong_type", "ssh_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetAppSshServersQuery",
    ).body.variables.ids,
    ["app_1", "app_without_ssh", "wrong_type", "app_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetAppGitConnectionsQuery",
    ).body.variables.ids,
    ["app_1", "app_without_git", "wrong_type", "app_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetDNSDomainsQuery",
    ).body.variables.ids,
    ["dns_domain_1", "dns_domain_missing", "wrong_type", "dns_domain_2"],
  );
  assert.deepEqual(
    fetch.calls.find(
      (call) => call.body.operationName === "srcGetDNSRecordsQuery",
    ).body.variables.ids,
    ["dns_record_1", "dns_record_missing", "wrong_type", "dns_record_2"],
  );
  assert.ok(
    fetch.calls.every(
      (call) => call.headers.get("authorization") === "Bearer request-key",
    ),
  );
});

test("deployment.wait emits progress, resolves on complete, and preserves request options", async () => {
  const { client, subscriptions } = mockSubscriptionClient([
    {
      kind: "LOG",
      message: "Installing dependencies",
      datetime: "2026-01-01T00:00:00Z",
      stream: "STDOUT",
      appVersion: null,
    },
    {
      kind: "COMPLETE",
      message: null,
      datetime: "2026-01-01T00:00:01Z",
      stream: null,
      appVersion: appVersionNode("version_complete", "app_complete"),
    },
  ]);
  const deployment = new Deployment("build_wait", client);
  const progress = [];

  const appVersion = await deployment.wait(
    {
      onProgress: (entry) => {
        progress.push(entry);
      },
    },
    { apiKey: "subscription-key" },
  );

  assert.equal(appVersion.id, "version_complete");
  assert.equal(appVersion.app.id, "app_complete");
  assert.equal(deployment.status, "SUCCESS");
  assert.equal(deployment.appVersion, appVersion);
  assert.equal(progress.length, 1);
  assert.equal(progress[0].kind, "LOG");
  assert.ok(progress[0].datetime instanceof Date);
  assert.equal(subscriptions.length, 1);
  assert.deepEqual(subscriptions[0].variables, { buildId: "build_wait" });
  assert.equal(subscriptions[0].options.apiKey, "subscription-key");
  assert.equal(subscriptions[0].disposed, true);
});

test("deployment.wait rejects typed errors on failed deployments", async () => {
  const { client } = mockSubscriptionClient([
    {
      kind: "FAILED",
      message: "Build failed",
      datetime: "2026-01-01T00:00:00Z",
      stream: "STDERR",
      appVersion: null,
    },
  ]);
  const deployment = new Deployment("build_failed", client);

  await assert.rejects(deployment.wait(), (error) => {
    assert.ok(error instanceof StackMachineAPIError);
    assert.equal(error.message, "Build failed");
    assert.equal(error.operationName, "srcAutobuildSubscription");
    return true;
  });
  assert.equal(deployment.status, "FAILED");
});

test("finish and subscribeToProgress remain deployment compatibility aliases", async () => {
  const { client } = mockSubscriptionClient([
    {
      kind: "LOG",
      message: "Preparing",
      datetime: "2026-01-01T00:00:00Z",
      stream: "STDOUT",
      appVersion: null,
    },
    {
      kind: "COMPLETE",
      message: null,
      datetime: "2026-01-01T00:00:01Z",
      stream: null,
      appVersion: appVersionNode("version_alias", "app_alias"),
    },
  ]);
  const deployment = new Deployment("build_alias_wait", client);
  const progress = [];

  deployment.subscribeToProgress((entry) => {
    progress.push(entry);
  });
  const appVersion = await deployment.finish();

  assert.equal(appVersion.id, "version_alias");
  assert.deepEqual(
    progress.map((entry) => entry.message),
    ["Preparing"],
  );
});

test("list methods return Stripe-like list objects", async () => {
  const fetch = mockFetch(() =>
    appsListResponse(
      [{ id: "app_1", cursor: "cursor_1" }],
      {
        hasNextPage: true,
        hasPreviousPage: false,
        endCursor: "cursor_1",
        startCursor: "cursor_1",
      },
      3,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const page = await client.apps.list({ limit: 1 });

  assert.equal(page.object, "list");
  assert.equal(page.url, "/v1/apps");
  assert.equal(page.hasMore, true);
  assert.equal(page.has_more, true);
  assert.equal(page.nextPageCursor, "cursor_1");
  assert.equal(page.previousPageCursor, "cursor_1");
  assert.equal(page.totalCount, 3);
  assert.equal(page.data.length, 1);
  assert.equal(page.data[0].id, "app_1");
  assert.equal(
    page.data[0].createdAt.toISOString(),
    "2026-01-01T00:00:00.000Z",
  );
  assert.equal(fetch.calls[0].body.operationName, "srcListDeployAppsQuery");
  assert.match(fetch.calls[0].body.query, /getDeployApps/);
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(fetch.calls[0].body.variables.sortBy, "NEWEST");
});

test("apps list can filter by owner id", async () => {
  const fetch = mockFetch(() =>
    appsListResponse([{ id: "app_owner_1", cursor: "cursor_owner_1" }]),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const page = await client.apps.list({ ownerId: "owner_1", limit: 1 });

  assert.equal(page.data[0].id, "app_owner_1");
  assert.match(fetch.calls[0].body.query, /ownerId: \$ownerId/);
  assert.equal(fetch.calls[0].body.variables.ownerId, "owner_1");
});

test("usage metrics support app, owner, and viewer scopes", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcUsageAppMetricsQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DeployApp",
              groupedMetrics: usageMetricsPayload(),
            },
          },
        });
      case "srcUsageOwnerMetricsQuery":
        return jsonResponse({
          data: {
            owner: {
              __typename: "Namespace",
              groupedMetrics: usageMetricsPayload({
                totals: {
                  ...usageMetricsPayload().totals,
                  requests: {
                    ...usageMetricsPayload().totals.requests,
                    totalRequests: "200",
                  },
                },
              }),
            },
          },
        });
      case "srcUsageViewerMetricsQuery":
        return jsonResponse({
          data: {
            viewer: {
              groupedMetrics: usageMetricsPayload({
                totals: {
                  ...usageMetricsPayload().totals,
                  workloads: {
                    ...usageMetricsPayload().totals.workloads,
                    workloads: 9,
                  },
                },
              }),
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });
  const start = new Date("2026-06-01T00:00:00Z");
  const end = "2026-06-30T00:00:00Z";

  const appMetrics = await client.usage.metrics({
    app: "app_1",
    start,
    end,
    groupedBy: "BY_HOUR",
  });
  const ownerMetrics = await client.usage.metrics({
    owner: "stackmachine",
    start,
    end,
  });
  const viewerMetrics = await client.usage.metrics({ start, end });

  assert.deepEqual(appMetrics.scope, { type: "app", appId: "app_1" });
  assert.equal(appMetrics.totals.requests.totalRequests, "9007199254740993");
  assert.equal(
    appMetrics.grouped[0].groupedAt.toISOString(),
    "2026-06-01T00:00:00.000Z",
  );
  assert.equal(appMetrics.totals.workloads.wallCpuTimeMillis, "180000");
  assert.deepEqual(ownerMetrics.scope, {
    type: "owner",
    owner: "stackmachine",
    ownerType: "Namespace",
  });
  assert.equal(ownerMetrics.totals.requests.totalRequests, "200");
  assert.deepEqual(viewerMetrics.scope, { type: "viewer" });
  assert.equal(viewerMetrics.totals.workloads.workloads, 9);
  assert.equal(fetch.calls[0].body.variables.appId, "app_1");
  assert.equal(fetch.calls[0].body.variables.start, "2026-06-01T00:00:00.000Z");
  assert.equal(fetch.calls[0].body.variables.groupedBy, "BY_HOUR");
  assert.equal(fetch.calls[1].body.variables.owner, "stackmachine");
  assert.equal(fetch.calls[1].body.variables.groupedBy, "BY_DAY");
  assert.equal(fetch.calls[2].body.variables.groupedBy, "BY_DAY");

  await assert.rejects(
    client.usage.metrics({
      app: "app_1",
      owner: "stackmachine",
      start,
      end,
    }),
    StackMachineValidationError,
  );
  assert.equal(fetch.calls.length, 3);
});

test("usage metrics throw resource missing errors for invalid app or owner", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcUsageAppMetricsQuery":
        return jsonResponse({
          data: {
            node: null,
          },
        });
      case "srcUsageOwnerMetricsQuery":
        return jsonResponse({
          data: {
            owner: null,
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });
  const input = {
    start: "2026-06-01T00:00:00Z",
    end: "2026-06-30T00:00:00Z",
  };

  await assert.rejects(
    client.usage.metrics({ ...input, app: "missing_app" }),
    StackMachineInvalidRequestError,
  );
  await assert.rejects(
    client.usage.metrics({ ...input, owner: "missing-owner" }),
    StackMachineInvalidRequestError,
  );
});

test("app volumes list, create, update, and delete map to GraphQL operations", async () => {
  const fetch = mockFetch((call, index) => {
    switch (call.body.operationName) {
      case "srcListAppVolumesQuery":
        return appVolumesListResponse(
          [
            {
              id: index === 0 ? "volume_1" : "volume_2",
              cursor: index === 0 ? "cursor_1" : "cursor_2",
              overrides:
                index === 0
                  ? { s3Enabled: true, s3Url: "https://s3.example.test/v1" }
                  : { mountPath: "/cache" },
            },
          ],
          {
            hasNextPage: index === 0,
            hasPreviousPage: index > 0,
            endCursor: index === 0 ? "cursor_1" : "cursor_2",
            startCursor: index === 0 ? "cursor_1" : "cursor_2",
          },
          2,
        );
      case "srcCreateAppVolumeMutation":
        return jsonResponse({
          data: {
            createAppVolume: {
              success: true,
              volume: appVolumeNode("volume_created", {
                mountPath: "/uploads",
                maxSizeBytes: 2_147_483_648,
              }),
            },
          },
        });
      case "srcUpdateVolumeMutation":
        return jsonResponse({
          data: {
            updateVolume: {
              success: true,
              volume: appVolumeNode("volume_created", {
                mountPath: "/uploads-v2",
                s3Enabled: true,
              }),
            },
          },
        });
      case "srcDeleteAppVolumeMutation":
        return jsonResponse({
          data: {
            deleteAppVolume: {
              success: true,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const volumes = await client.apps.volumes
    .list(
      { app: "app_1", limit: 1 },
      { apiKey: "request-key", headers: { "x-request": "yes" } },
    )
    .autoPagingToArray({ limit: 2 });
  const created = await client.apps.volumes.create(
    {
      app: "app_1",
      mountPath: "/uploads",
      maxSizeBytes: 2_147_483_648,
    },
    { clientMutationId: "cmid-create-volume" },
  );
  const updated = await client.apps.volumes.update(
    "volume_created",
    { mountPath: "/uploads-v2", s3Enabled: true },
    { idempotencyKey: "idem-update-volume" },
  );
  await client.apps.volumes.del("volume_created", {
    clientMutationId: "cmid-delete-volume",
  });

  assert.deepEqual(
    volumes.map((volume) => volume.id),
    ["volume_1", "volume_2"],
  );
  assert.ok(volumes[0] instanceof AppVolume);
  assert.equal(volumes[0].volumeId, "volume-volume_1");
  assert.equal(volumes[0].mountPath, "/data");
  assert.equal(volumes[0].maxSizeBytes, 1_073_741_824);
  assert.equal(volumes[0].s3Enabled, true);
  assert.equal(volumes[0].s3Url, "https://s3.example.test/v1");
  assert.equal(
    volumes[0].explorerUrl,
    "https://console.example.test/volumes/volume_1",
  );
  assert.equal(volumes[0].isAddedByUi, true);
  assert.equal(created.id, "volume_created");
  assert.equal(created.mountPath, "/uploads");
  assert.equal(updated.mountPath, "/uploads-v2");
  assert.equal(updated.s3Enabled, true);

  assert.equal(fetch.calls[0].body.variables.appId, "app_1");
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(fetch.calls[0].body.variables.after, undefined);
  assert.equal(fetch.calls[1].body.variables.after, "cursor_1");
  assert.equal(
    fetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );
  assert.equal(fetch.calls[1].headers.get("x-request"), "yes");
  assert.deepEqual(fetch.calls[2].body.variables.input, {
    appId: "app_1",
    mountPath: "/uploads",
    maxSizeBytes: 2_147_483_648,
    clientMutationId: "cmid-create-volume",
  });
  assert.deepEqual(fetch.calls[3].body.variables.input, {
    id: "volume_created",
    mountPath: "/uploads-v2",
    s3Enabled: true,
    clientMutationId: "idem-update-volume",
  });
  assert.deepEqual(fetch.calls[4].body.variables.input, {
    id: "volume_created",
    clientMutationId: "cmid-delete-volume",
  });
});

test("app volume mutations throw when backend success is false", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcCreateAppVolumeMutation":
        return jsonResponse({
          data: {
            createAppVolume: {
              success: false,
              volume: appVolumeNode("volume_failed"),
            },
          },
        });
      case "srcUpdateVolumeMutation":
        return jsonResponse({
          data: {
            updateVolume: {
              success: false,
              volume: appVolumeNode("volume_failed"),
            },
          },
        });
      case "srcDeleteAppVolumeMutation":
        return jsonResponse({
          data: {
            deleteAppVolume: {
              success: false,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.apps.volumes.create({ app: "app_1", mountPath: "/data" }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.volumes.update("volume_1", { mountPath: "/data" }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.volumes.del("volume_1"),
    StackMachineAPIError,
  );
});

test("app databases list, create, rotate credentials, and delete map to GraphQL operations", async () => {
  const fetch = mockFetch((call, index) => {
    switch (call.body.operationName) {
      case "srcListAppDatabasesQuery":
        return appDatabasesListResponse(
          [
            {
              id: index === 0 ? "db_1" : "db_2",
              cursor: index === 0 ? "cursor_1" : "cursor_2",
              overrides:
                index === 0
                  ? { name: "primary", password: "existing-secret" }
                  : { name: "analytics" },
            },
          ],
          {
            hasNextPage: index === 0,
            hasPreviousPage: index > 0,
            endCursor: index === 0 ? "cursor_1" : "cursor_2",
            startCursor: index === 0 ? "cursor_1" : "cursor_2",
          },
          2,
        );
      case "srcCreateDatabaseAndLinkToAppMutation":
        return jsonResponse({
          data: {
            createDatabaseAndLinkToApp: {
              database: appDatabaseNode("db_created", { name: "primary" }),
              password: "created-password",
            },
          },
        });
      case "srcRotateAppDatabaseCredentialsMutation":
        return jsonResponse({
          data: {
            rotateCredentialsForAppDb: {
              database: appDatabaseNode("db_created"),
              password: "rotated-password",
            },
          },
        });
      case "srcDeleteAppDatabaseMutation":
        return jsonResponse({
          data: {
            deleteAppDb: {
              success: true,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const databases = await client.apps.databases
    .list({ app: "app_1", limit: 1 })
    .autoPagingToArray({ limit: 2 });
  const created = await client.apps.databases.create(
    { app: "app_1", dbEngine: "POSTGRES", name: "primary" },
    { clientMutationId: "cmid-create-db" },
  );
  const rotated = await client.apps.databases.rotateCredentials("db_created", {
    idempotencyKey: "idem-rotate-db",
  });
  await client.apps.databases.del("db_created", {
    clientMutationId: "cmid-delete-db",
  });

  assert.deepEqual(
    databases.map((database) => database.id),
    ["db_1", "db_2"],
  );
  assert.ok(databases[0] instanceof AppDatabase);
  assert.equal(databases[0].name, "primary");
  assert.equal(databases[0].password, "existing-secret");
  assert.equal(databases[0].app.name, "app-app_1");
  assert.equal(created.database.id, "db_created");
  assert.equal(created.password, "created-password");
  assert.equal(rotated.database.id, "db_created");
  assert.equal(rotated.password, "rotated-password");

  assert.equal(fetch.calls[0].body.variables.appId, "app_1");
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(fetch.calls[1].body.variables.after, "cursor_1");
  assert.deepEqual(fetch.calls[2].body.variables.input, {
    appId: "app_1",
    dbEngine: "POSTGRES",
    name: "primary",
    clientMutationId: "cmid-create-db",
  });
  assert.deepEqual(fetch.calls[3].body.variables.input, {
    id: "db_created",
    clientMutationId: "idem-rotate-db",
  });
  assert.deepEqual(fetch.calls[4].body.variables.input, {
    id: "db_created",
    clientMutationId: "cmid-delete-db",
  });
});

test("app databases create remains compatible with legacy createAppDb mutation", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcCreateAppDatabaseMutation":
        return jsonResponse({
          data: {
            createAppDb: {
              database: appDatabaseNode("db_created", { name: "legacy" }),
              password: "legacy-password",
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const created = await client.apps.databases.create({ app: "app_1" });

  assert.equal(created.database.name, "legacy");
  assert.equal(created.password, "legacy-password");
  assert.equal(
    fetch.calls[0].body.operationName,
    "srcCreateAppDatabaseMutation",
  );
  assert.equal(fetch.calls[0].body.variables.input.id, "app_1");
  assert.equal(fetch.calls[0].body.variables.input.dbEngine, undefined);
  assert.ok(fetch.calls[0].body.variables.input.clientMutationId);
});

test("app database mutations throw when backend payloads are missing or unsuccessful", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcCreateDatabaseAndLinkToAppMutation":
        return jsonResponse({ data: { createDatabaseAndLinkToApp: null } });
      case "srcCreateAppDatabaseMutation":
        return jsonResponse({ data: { createAppDb: null } });
      case "srcRotateAppDatabaseCredentialsMutation":
        return jsonResponse({
          data: { rotateCredentialsForAppDb: { database: null, password: "" } },
        });
      case "srcDeleteAppDatabaseMutation":
        return jsonResponse({ data: { deleteAppDb: { success: false } } });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.apps.databases.create({ app: "app_1" }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.databases.create({ app: "app_1", dbEngine: "MYSQL" }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.databases.rotateCredentials("db_1"),
    StackMachineAPIError,
  );
  await assert.rejects(client.apps.databases.del("db_1"), StackMachineAPIError);
});

test("app git connections retrieve, connect, update, and delete map to GraphQL operations", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcGetAppGitConnectionQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DeployApp",
              id: "app_1",
              githubRepoConnection: githubRepoConnectionNode("git_1"),
            },
          },
        });
      case "srcConnectGithubRepoToAppMutation":
        return jsonResponse({
          data: {
            connectGithubRepoToApp: {
              success: true,
              githubRepoConnection: githubRepoConnectionNode("git_connected", {
                deployBranch: "production",
              }),
            },
          },
        });
      case "srcUpdateGithubRepoConnectionMutation":
        return jsonResponse({
          data: {
            updateGithubRepoConnection: {
              success: true,
              githubRepoConnection: githubRepoConnectionNode("git_connected", {
                deployBranch: "release",
                deploymentStatusEvents: false,
                pullRequestComments: true,
              }),
            },
          },
        });
      case "srcDisconnectGithubRepoFromAppMutation":
        return jsonResponse({
          data: {
            disconnectGithubRepoFromApp: {
              success: true,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const retrieved = await client.apps.git.retrieve("app_1");
  const connected = await client.apps.git.connect(
    {
      app: "app_1",
      installationRepoId: "repo_1",
      deployBranch: "production",
    },
    { clientMutationId: "cmid-connect-git" },
  );
  const updated = await client.apps.git.update(
    "app_1",
    {
      deployBranch: "release",
      deploymentStatusEvents: false,
      pullRequestComments: true,
    },
    { idempotencyKey: "idem-update-git" },
  );
  await client.apps.git.del("app_1", {
    clientMutationId: "cmid-delete-git",
  });

  assert.ok(retrieved instanceof GithubRepoConnection);
  assert.equal(retrieved.id, "git_1");
  assert.equal(retrieved.connectedBy.username, "octocat");
  assert.equal(retrieved.githubRepoInstallation.namespace, "stackmachine");
  assert.equal(connected.deployBranch, "production");
  assert.equal(updated.deployBranch, "release");
  assert.equal(updated.deploymentStatusEvents, false);
  assert.equal(updated.pullRequestComments, true);

  assert.deepEqual(fetch.calls[0].body.variables, { id: "app_1" });
  assert.deepEqual(fetch.calls[1].body.variables.input, {
    appId: "app_1",
    installationRepoId: "repo_1",
    deployBranch: "production",
    clientMutationId: "cmid-connect-git",
  });
  assert.deepEqual(fetch.calls[2].body.variables.input, {
    appId: "app_1",
    deployBranch: "release",
    deploymentStatusEvents: false,
    pullRequestComments: true,
    clientMutationId: "idem-update-git",
  });
  assert.deepEqual(fetch.calls[3].body.variables.input, {
    appId: "app_1",
    clientMutationId: "cmid-delete-git",
  });
});

test("app git update accepts legacy connection ids without breaking old callers", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcUpdateGithubRepoConnectionMutation":
        if (call.body.variables.input.appId) {
          return jsonResponse({
            errors: [
              {
                message:
                  "Expected a DeployApp id for appId, got GithubRepoConnection.",
              },
            ],
          });
        }
        return jsonResponse({
          data: {
            updateGithubRepoConnection: {
              success: true,
              githubRepoConnection: githubRepoConnectionNode("git_connected", {
                pullRequestComments: true,
              }),
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const updated = await client.apps.git.update("git_connected", {
    pullRequestComments: true,
  });

  assert.equal(updated.id, "git_connected");
  assert.equal(fetch.calls[0].body.variables.input.appId, "git_connected");
  assert.equal(
    fetch.calls[1].body.variables.input.connectionId,
    "git_connected",
  );
  assert.equal(fetch.calls[1].body.variables.input.appId, undefined);
  assert.equal(fetch.calls[1].body.variables.input.pullRequestComments, true);
  assert.ok(fetch.calls[1].body.variables.input.clientMutationId);
});

test("app git mutations throw when backend success is false", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcConnectGithubRepoToAppMutation":
        return jsonResponse({
          data: {
            connectGithubRepoToApp: {
              success: false,
              githubRepoConnection: githubRepoConnectionNode("git_failed"),
            },
          },
        });
      case "srcUpdateGithubRepoConnectionMutation":
        return jsonResponse({
          data: {
            updateGithubRepoConnection: {
              success: false,
              githubRepoConnection: githubRepoConnectionNode("git_failed"),
            },
          },
        });
      case "srcDisconnectGithubRepoFromAppMutation":
        return jsonResponse({
          data: {
            disconnectGithubRepoFromApp: {
              success: false,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.apps.git.connect({ app: "app_1", installationRepoId: "repo_1" }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.git.update("git_1", { pullRequestComments: true }),
    StackMachineAPIError,
  );
  await assert.rejects(client.apps.git.del("app_1"), StackMachineAPIError);
});

test("hosted DNS domains use owner input and map to GraphQL domain operations", async () => {
  const fetch = mockFetch((call, index) => {
    switch (call.body.operationName) {
      case "srcListDNSDomainsQuery":
        return dnsDomainsListResponse(
          [
            {
              id: index === 0 ? "dns_domain_1" : "dns_domain_2",
              cursor: index === 0 ? "cursor_1" : "cursor_2",
            },
          ],
          {
            hasNextPage: index === 0,
            hasPreviousPage: index > 0,
            endCursor: index === 0 ? "cursor_1" : "cursor_2",
            startCursor: index === 0 ? "cursor_1" : "cursor_2",
          },
          2,
        );
      case "srcGetDNSDomainByNameQuery":
        return jsonResponse({
          data: {
            getDomain: dnsDomainNode("dns_domain_1"),
          },
        });
      case "srcRegisterDNSDomainMutation":
        return jsonResponse({
          data: {
            registerDomain: {
              success: true,
              domain: dnsDomainNode("dns_domain_created", {
                name: "created.example.com",
              }),
            },
          },
        });
      case "srcUpsertDNSDomainFromZoneFileMutation":
        return jsonResponse({
          data: {
            upsertDomainFromZoneFile: {
              success: true,
              domain: dnsDomainNode("dns_domain_imported", {
                name: "imported.example.com",
              }),
            },
          },
        });
      case "srcDeleteDNSDomainMutation":
        return jsonResponse({
          data: {
            deleteDomain: {
              success: true,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const domains = await client.dns.domains
    .list({ owner: "owner_1", limit: 1 })
    .autoPagingToArray({ limit: 2 });
  const byName = await client.dns.domains.retrieveByName("example.com");
  const created = await client.dns.domains.create(
    {
      name: "created.example.com",
      owner: "owner_1",
      importRecords: false,
    },
    { clientMutationId: "cmid-create-dns-domain" },
  );
  const imported = await client.dns.domains.importZoneFile(
    {
      zoneFile: "$ORIGIN imported.example.com.",
      deleteMissingRecords: true,
    },
    { idempotencyKey: "idem-import-zone" },
  );
  await client.dns.domains.del("dns_domain_created", {
    clientMutationId: "cmid-delete-dns-domain",
  });

  assert.deepEqual(
    domains.map((domain) => domain.id),
    ["dns_domain_1", "dns_domain_2"],
  );
  assert.ok(domains[0] instanceof DNSDomain);
  assert.equal(domains[0].owner.globalName, "stackmachine");
  assert.equal(domains[0].delegationStatus, "VERIFIED");
  assert.deepEqual(domains[0].nameservers, [
    "ns1.stackmachine.example.",
    "ns2.stackmachine.example.",
  ]);
  assert.equal(
    domains[0].lastCheckedAt.toISOString(),
    "2026-01-02T00:00:00.000Z",
  );
  assert.equal(domains[0].verifiedAt.toISOString(), "2026-01-02T00:00:00.000Z");
  assert.equal(byName.records[0].kind, "A");
  assert.equal(created.name, "created.example.com");
  assert.equal(imported.name, "imported.example.com");

  assert.equal(fetch.calls[0].body.variables.owner, "owner_1");
  assert.match(fetch.calls[0].body.query, /ownerId: \$owner/);
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(fetch.calls[1].body.variables.after, "cursor_1");
  assert.deepEqual(fetch.calls[3].body.variables.input, {
    name: "created.example.com",
    ownerId: "owner_1",
    importRecords: false,
    clientMutationId: "cmid-create-dns-domain",
  });
  assert.deepEqual(fetch.calls[4].body.variables.input, {
    zoneFile: "$ORIGIN imported.example.com.",
    deleteMissingRecords: true,
    clientMutationId: "idem-import-zone",
  });
  assert.deepEqual(fetch.calls[5].body.variables.input, {
    domainId: "dns_domain_created",
    clientMutationId: "cmid-delete-dns-domain",
  });
});

test("hosted DNS domain mutations throw when backend success is false", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcRegisterDNSDomainMutation":
        return jsonResponse({
          data: {
            registerDomain: {
              success: false,
              domain: dnsDomainNode("dns_failed"),
            },
          },
        });
      case "srcUpsertDNSDomainFromZoneFileMutation":
        return jsonResponse({
          data: {
            upsertDomainFromZoneFile: {
              success: false,
              domain: dnsDomainNode("dns_failed"),
            },
          },
        });
      case "srcDeleteDNSDomainMutation":
        return jsonResponse({ data: { deleteDomain: { success: false } } });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.dns.domains.create({ name: "failed.example.com" }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.dns.domains.importZoneFile({ zoneFile: "$ORIGIN example.com." }),
    StackMachineAPIError,
  );
  await assert.rejects(client.dns.domains.del("dns_1"), StackMachineAPIError);
});

test("hosted DNS records list, create, update, and delete map all record types", async () => {
  const allRecordKinds = [
    "ARecord",
    "AAAARecord",
    "CAARecord",
    "CNAMERecord",
    "DNAMERecord",
    "MXRecord",
    "NSRecord",
    "PTRRecord",
    "SOARecord",
    "SRVRecord",
    "SSHFPRecord",
    "TXTRecord",
  ];
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcListDNSRecordsQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DNSDomain",
              id: "dns_domain_1",
              records: allRecordKinds.map((kind, recordIndex) =>
                dnsRecordNode(`dns_record_${recordIndex}`, kind),
              ),
            },
          },
        });
      case "srcListDNSRecordsConnectionQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DNSDomain",
              id: "dns_domain_1",
              recordsConnection: {
                edges: [
                  {
                    cursor: "cursor_record_1",
                    node: dnsRecordNode("dns_record_paged", "TXTRecord", {
                      data: "paged=1",
                    }),
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  endCursor: "cursor_record_1",
                  startCursor: "cursor_record_1",
                },
                totalCount: 1,
              },
            },
          },
        });
      case "srcUpsertDNSRecordMutation":
        return jsonResponse({
          data: {
            upsertDNSRecord: {
              success: true,
              record: call.body.variables.input.recordId
                ? dnsRecordNode("dns_record_updated", "MXRecord", {
                    exchange: "mail.example.com.",
                    preference: 20,
                  })
                : dnsRecordNode("dns_record_created", "CAARecord", {
                    name: "@",
                    value: "letsencrypt.org",
                  }),
            },
          },
        });
      case "srcUpdateDNSRecordsMutation":
        return jsonResponse({
          data: {
            updateDNSRecords: {
              success: true,
              records: [
                dnsRecordNode("dns_record_bulk", "ARecord", {
                  name: "api",
                  text: "192.0.2.2",
                  address: "192.0.2.2",
                }),
              ],
            },
          },
        });
      case "srcDeleteDNSRecordMutation":
        return jsonResponse({
          data: {
            deleteDNSRecord: {
              success: true,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const records = await client.dns.records.list({ domain: "dns_domain_1" });
  const pagedRecords = await client.dns.records
    .listPage({
      domain: "dns_domain_1",
      limit: 1,
      sortBy: "NEWEST",
    })
    .autoPagingToArray({ limit: 1 });
  const created = await client.dns.records.create(
    {
      domain: "dns_domain_1",
      kind: "CAA",
      name: "@",
      value: "letsencrypt.org",
      ttl: 300,
      caa: { flags: 0, tag: "issue" },
    },
    { clientMutationId: "cmid-create-dns-record" },
  );
  const updated = await client.dns.records.update(
    "dns_record_created",
    {
      domain: "dns_domain_1",
      kind: "MX",
      name: "@",
      value: "mail.example.com.",
      mx: { preference: 20 },
    },
    { idempotencyKey: "idem-update-dns-record" },
  );
  const updatedMany = await client.dns.records.updateMany(
    {
      domain: "dns_domain_1",
      records: [
        {
          kind: "A",
          name: "api",
          value: "192.0.2.2",
          ttl: 60,
        },
      ],
    },
    { clientMutationId: "cmid-update-dns-records" },
  );
  await client.dns.records.del("dns_record_created", {
    clientMutationId: "cmid-delete-dns-record",
  });

  assert.deepEqual(
    records.map((record) => record.kind),
    [
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
    ],
  );
  assert.ok(records[0] instanceof DNSRecord);
  assert.equal(records[0].address, "192.0.2.1");
  assert.equal(records[2].value, "letsencrypt.org");
  assert.equal(records[5].preference, 10);
  assert.equal(records[11].data, "hello=world");
  assert.deepEqual(
    pagedRecords.map((record) => record.id),
    ["dns_record_paged"],
  );
  assert.equal(created.kind, "CAA");
  assert.equal(created.value, "letsencrypt.org");
  assert.equal(updated.kind, "MX");
  assert.equal(updated.preference, 20);
  assert.equal(updatedMany[0].id, "dns_record_bulk");
  assert.equal(updatedMany[0].value, "192.0.2.2");

  assert.deepEqual(fetch.calls[0].body.variables, {
    domainId: "dns_domain_1",
  });
  assert.equal(fetch.calls[1].body.variables.domainId, "dns_domain_1");
  assert.equal(fetch.calls[1].body.variables.first, 1);
  assert.equal(fetch.calls[1].body.variables.after, undefined);
  assert.equal(fetch.calls[1].body.variables.sortBy, "NEWEST");
  assert.deepEqual(fetch.calls[2].body.variables.input, {
    domainId: "dns_domain_1",
    kind: "CAA",
    name: "@",
    value: "letsencrypt.org",
    ttl: 300,
    caa: { flags: 0, tag: "issue" },
    clientMutationId: "cmid-create-dns-record",
  });
  assert.deepEqual(fetch.calls[3].body.variables.input, {
    domainId: "dns_domain_1",
    kind: "MX",
    name: "@",
    value: "mail.example.com.",
    mx: { preference: 20 },
    recordId: "dns_record_created",
    clientMutationId: "idem-update-dns-record",
  });
  assert.deepEqual(fetch.calls[4].body.variables.input, {
    domainId: "dns_domain_1",
    records: [
      {
        kind: "A",
        name: "api",
        value: "192.0.2.2",
        ttl: 60,
      },
    ],
    clientMutationId: "cmid-update-dns-records",
  });
  assert.deepEqual(fetch.calls[5].body.variables.input, {
    recordId: "dns_record_created",
    clientMutationId: "cmid-delete-dns-record",
  });
});

test("hosted DNS record mutations throw when backend success is false", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcUpsertDNSRecordMutation":
        return jsonResponse({
          data: {
            upsertDNSRecord: {
              success: false,
              record: dnsRecordNode("dns_failed"),
            },
          },
        });
      case "srcDeleteDNSRecordMutation":
        return jsonResponse({
          data: {
            deleteDNSRecord: {
              success: false,
            },
          },
        });
      case "srcUpdateDNSRecordsMutation":
        return jsonResponse({
          data: {
            updateDNSRecords: {
              success: false,
              records: [dnsRecordNode("dns_failed")],
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.dns.records.create({
      domain: "dns_domain_1",
      kind: "A",
      name: "www",
      value: "192.0.2.1",
    }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.dns.records.del("dns_record_1"),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.dns.records.updateMany({
      domain: "dns_domain_1",
      records: [{ kind: "A", name: "www", value: "192.0.2.1" }],
    }),
    StackMachineAPIError,
  );
});

test("app SSH authorized key delete accepts key ids and legacy user/name inputs", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcDeleteSshAuthorizedKeyByIdMutation":
        return jsonResponse({
          data: {
            deleteSshAuthorizedKeyById: {
              success: true,
            },
          },
        });
      case "srcDeleteSshAuthorizedKeyMutation":
        return jsonResponse({
          data: {
            deleteSshAuthorizedKey: {
              success: true,
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await client.apps.ssh.users.authorizedKeys.del("key_1", {
    clientMutationId: "cmid-delete-key-id",
  });
  await client.apps.ssh.users.authorizedKeys.del(
    { user: "ssh_user_1", name: "laptop" },
    { clientMutationId: "cmid-delete-key-legacy" },
  );

  assert.deepEqual(fetch.calls[0].body.variables.input, {
    authorizedKeyId: "key_1",
    clientMutationId: "cmid-delete-key-id",
  });
  assert.deepEqual(fetch.calls[1].body.variables.input, {
    sshUserId: "ssh_user_1",
    name: "laptop",
    clientMutationId: "cmid-delete-key-legacy",
  });
});

test("emails list by app or owner and send from app map to GraphQL operations", async () => {
  const emailConnection = (message) => ({
    edges: [
      {
        cursor: `cursor_${message.id}`,
        node: message,
      },
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      endCursor: `cursor_${message.id}`,
      startCursor: `cursor_${message.id}`,
    },
    totalCount: 1,
  });
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcListSentEmailsQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DeployApp",
              id: "app_1",
              emails: emailConnection(
                emailMessageNode("email_sent", {
                  subject: "Sent message",
                  status: "SENT",
                }),
              ),
            },
          },
        });
      case "srcListReceivedEmailsQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "Namespace",
              id: "owner_1",
              emails: emailConnection(
                emailMessageNode("email_received", {
                  app: null,
                  direction: "RECEIVED",
                  receivedAt: "2026-01-02T00:00:00Z",
                  sentAt: null,
                  status: "RECEIVED",
                  subject: "Received message",
                }),
              ),
            },
          },
        });
      case "srcSendAppEmailMutation":
        return jsonResponse({
          data: {
            sendAppEmail: {
              success: true,
              message: emailMessageNode("email_new", {
                subject: "Hello from SDK",
                to: ["user@example.com", "second@example.com"],
              }),
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const sent = await client.emails.sent
    .list({ app: "app_1", limit: 1 })
    .autoPagingToArray({ limit: 1 });
  const received = await client.emails.received
    .list({ owner: "owner_1", limit: 1 })
    .autoPagingToArray({ limit: 1 });
  const message = await client.emails.send(
    {
      app: "app_1",
      to: ["user@example.com", "second@example.com"],
      cc: ["cc@example.com"],
      bcc: ["bcc@example.com"],
      replyTo: "reply@example.com",
      fromAddress: "app@example.com",
      subject: "Hello from SDK",
      textBody: "Plain text body",
      htmlBody: "<p>HTML body</p>",
    },
    { clientMutationId: "cmid-send-email" },
  );

  assert.ok(sent[0] instanceof EmailMessage);
  assert.equal(sent[0].id, "email_sent");
  assert.equal(sent[0].app.id, "app_1");
  assert.equal(sent[0].appId, "app_1");
  assert.equal(sent[0].owner.globalName, "stackmachine");
  assert.equal(received[0].direction, "RECEIVED");
  assert.equal(
    received[0].receivedAt.toISOString(),
    "2026-01-02T00:00:00.000Z",
  );
  assert.equal(message.id, "email_new");
  assert.deepEqual(message.to, ["user@example.com", "second@example.com"]);

  assert.deepEqual(fetch.calls[0].body.variables, {
    id: "app_1",
    first: 1,
  });
  assert.deepEqual(fetch.calls[1].body.variables, {
    id: "owner_1",
    first: 1,
  });
  assert.deepEqual(fetch.calls[2].body.variables.input, {
    appId: "app_1",
    to: ["user@example.com", "second@example.com"],
    subject: "Hello from SDK",
    bcc: ["bcc@example.com"],
    cc: ["cc@example.com"],
    fromAddress: "app@example.com",
    htmlBody: "<p>HTML body</p>",
    replyTo: "reply@example.com",
    textBody: "Plain text body",
    clientMutationId: "cmid-send-email",
  });
});

test("emails send supports raw MIME upload", async () => {
  const rawMessage = new Blob(
    [
      "From: app@example.com\r\n",
      "To: user@example.com\r\n",
      "Subject: Raw hello\r\n",
      "\r\n",
      "Hello from raw MIME.",
    ],
    { type: "message/rfc822" },
  );
  const fetch = mockFetch(async (call) => {
    assert.ok(call.body instanceof FormData);
    assert.equal(call.headers.get("content-type"), null);
    const operations = JSON.parse(call.body.get("operations"));
    const uploadMap = JSON.parse(call.body.get("map"));
    const uploaded = call.body.get("0");
    assert.deepEqual(uploadMap, {
      0: ["variables.input.rawMessage"],
    });
    assert.equal(operations.operationName, "srcSendAppEmailMutation");
    assert.equal(operations.variables.input.rawMessage, null);
    assert.equal(operations.variables.input.appId, "app_1");
    assert.ok(uploaded instanceof Blob);
    assert.equal(await uploaded.text(), await rawMessage.text());
    return jsonResponse({
      data: {
        sendAppEmail: {
          success: true,
          message: emailMessageNode("email_raw", {
            subject: "Raw hello",
            to: ["user@example.com"],
          }),
        },
      },
    });
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const message = await client.emails.send({
    app: "app_1",
    to: ["user@example.com"],
    subject: "Raw hello",
    rawMessage,
  });

  assert.equal(message.id, "email_raw");
});

test("emails validate list targets and throw when send fails", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcSendAppEmailMutation":
        return jsonResponse({
          data: {
            sendAppEmail: {
              success: false,
              message: emailMessageNode("email_failed"),
            },
          },
        });
      default:
        throw new Error(`Unexpected operation ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  assert.throws(
    () => client.emails.sent.list({ app: "app_1", owner: "owner_1" }),
    StackMachineValidationError,
  );
  assert.throws(
    () => client.emails.received.list({}),
    StackMachineValidationError,
  );
  await assert.rejects(
    client.emails.send({
      app: "app_1",
      to: ["user@example.com"],
      subject: "Hello",
      textBody: "Hello",
    }),
    StackMachineAPIError,
  );
});

test("pagination aliases map to GraphQL variables and validate conflicts", async () => {
  const fetch = mockFetch(() => appsListResponse([]));
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await client.apps.list({ limit: 2, starting_after: "cursor_a" });
  await client.apps.list({ limit: 3, startingAfter: "cursor_b" });

  assert.equal(fetch.calls[0].body.variables.first, 2);
  assert.equal(fetch.calls[0].body.variables.after, "cursor_a");
  assert.equal(fetch.calls[1].body.variables.first, 3);
  assert.equal(fetch.calls[1].body.variables.after, "cursor_b");

  assert.throws(
    () =>
      client.apps.list({
        startingAfter: "cursor_a",
        starting_after: "cursor_b",
      }),
    StackMachineValidationError,
  );
  assert.throws(
    () =>
      client.apps.list({
        startingAfter: "cursor_a",
        endingBefore: "cursor_b",
      }),
    StackMachineValidationError,
  );
  assert.throws(
    () => client.apps.list({ limit: 0 }),
    StackMachineValidationError,
  );
  assert.throws(
    () => client.apps.list({ limit: 101 }),
    StackMachineValidationError,
  );
});

test("async iteration fetches subsequent pages and preserves request options", async () => {
  const fetch = mockFetch((_, index) => {
    if (index === 0) {
      return appsListResponse(
        [{ id: "app_1", cursor: "cursor_1" }],
        {
          hasNextPage: true,
          hasPreviousPage: false,
          endCursor: "cursor_1",
          startCursor: "cursor_1",
        },
        2,
      );
    }
    return appsListResponse(
      [{ id: "app_2", cursor: "cursor_2" }],
      {
        hasNextPage: false,
        hasPreviousPage: true,
        endCursor: "cursor_2",
        startCursor: "cursor_2",
      },
      2,
    );
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const ids = [];
  for await (const app of client.apps.list(
    { limit: 1 },
    {
      apiKey: "request-key",
      headers: { "x-request": "yes" },
    },
  )) {
    ids.push(app.id);
  }

  assert.deepEqual(ids, ["app_1", "app_2"]);
  assert.equal(fetch.calls.length, 2);
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(fetch.calls[0].body.variables.after, undefined);
  assert.equal(fetch.calls[1].body.variables.first, 1);
  assert.equal(fetch.calls[1].body.variables.after, "cursor_1");
  assert.equal(
    fetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );
  assert.equal(
    fetch.calls[1].headers.get("authorization"),
    "Bearer request-key",
  );
  assert.equal(fetch.calls[1].headers.get("x-request"), "yes");
});

test("autoPagingEach stops when the handler returns false", async () => {
  const fetch = mockFetch(() =>
    appsListResponse(
      [{ id: "app_1", cursor: "cursor_1" }],
      {
        hasNextPage: true,
        hasPreviousPage: false,
        endCursor: "cursor_1",
        startCursor: "cursor_1",
      },
      2,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const ids = [];
  await client.apps.list({ limit: 1 }).autoPagingEach((app) => {
    ids.push(app.id);
    return false;
  });

  assert.deepEqual(ids, ["app_1"]);
  assert.equal(fetch.calls.length, 1);
});

test("autoPagingToArray requires a limit and stops at that cap", async () => {
  const fetch = mockFetch((_, index) =>
    appsListResponse(
      [{ id: `app_${index + 1}`, cursor: `cursor_${index + 1}` }],
      {
        hasNextPage: index < 2,
        hasPreviousPage: index > 0,
        endCursor: `cursor_${index + 1}`,
        startCursor: `cursor_${index + 1}`,
      },
      3,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.apps.list({ limit: 1 }).autoPagingToArray(),
    StackMachineValidationError,
  );

  const apps = await client.apps
    .list({ limit: 1 })
    .autoPagingToArray({ limit: 2 });

  assert.deepEqual(
    apps.map((app) => app.id),
    ["app_2", "app_3"],
  );
  assert.equal(fetch.calls.length, 3);
});

test("backward pagination maps endingBefore to GraphQL before and last", async () => {
  const fetch = mockFetch(() =>
    appsListResponse(
      [{ id: "app_2", cursor: "cursor_2" }],
      {
        hasNextPage: true,
        hasPreviousPage: true,
        endCursor: "cursor_2",
        startCursor: "cursor_2",
      },
      3,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const page = await client.apps.list({
    limit: 2,
    endingBefore: "cursor_3",
  });

  assert.equal(fetch.calls[0].body.variables.first, undefined);
  assert.equal(fetch.calls[0].body.variables.after, undefined);
  assert.equal(fetch.calls[0].body.variables.last, 2);
  assert.equal(fetch.calls[0].body.variables.before, "cursor_3");
  assert.equal(page.hasMore, true);
  assert.equal(page.previousPageCursor, "cursor_2");
});

test("mutations receive explicit, aliased, and generated client mutation ids", async () => {
  const explicitFetch = mockFetch(() => deleteAppResponse());
  const explicitClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: explicitFetch,
  });
  await explicitClient.apps.del("app-explicit", {
    clientMutationId: "cmid-explicit",
  });
  assert.equal(
    explicitFetch.calls[0].body.variables.input.clientMutationId,
    "cmid-explicit",
  );

  const idempotencyFetch = mockFetch(() => deleteAppResponse());
  const idempotencyClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: idempotencyFetch,
  });
  await idempotencyClient.apps.del("app-idempotent", {
    idempotencyKey: "idem-key",
  });
  assert.equal(
    idempotencyFetch.calls[0].body.variables.input.clientMutationId,
    "idem-key",
  );

  const retryFetch = mockFetch((_, index) =>
    index === 0
      ? jsonResponse({ errors: [{ message: "retry later" }] }, { status: 503 })
      : deleteAppResponse(),
  );
  const retryClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: retryFetch,
  });
  await retryClient.apps.del("app-generated");

  assert.equal(retryFetch.calls.length, 2);
  const firstId = retryFetch.calls[0].body.variables.input.clientMutationId;
  const secondId = retryFetch.calls[1].body.variables.input.clientMutationId;
  assert.match(firstId, /^sm_/);
  assert.equal(secondId, firstId);
});

test("conflicting idempotency options throw validation errors before fetch", async () => {
  const fetch = mockFetch(() => deleteAppResponse());
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await assert.rejects(
    client.apps.del("app", {
      idempotencyKey: "idem-a",
      clientMutationId: "idem-b",
    }),
    StackMachineValidationError,
  );
  assert.equal(fetch.calls.length, 0);
});

test("retryable HTTP and network failures retry, but application errors do not", async () => {
  const httpFetch = mockFetch((_, index) =>
    index === 0
      ? jsonResponse(
          { errors: [{ message: "service unavailable" }] },
          { status: 503 },
        )
      : viewerResponse("after-http-retry"),
  );
  const httpClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: httpFetch,
  });
  assert.deepEqual(await httpClient.viewer(), {
    username: "after-http-retry",
  });
  assert.equal(httpFetch.calls.length, 2);

  const networkFetch = mockFetch((_, index) => {
    if (index === 0) {
      throw new Error("socket closed");
    }
    return viewerResponse("after-network-retry");
  });
  const networkClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: networkFetch,
  });
  assert.deepEqual(await networkClient.viewer(), {
    username: "after-network-retry",
  });
  assert.equal(networkFetch.calls.length, 2);

  const applicationFetch = mockFetch(() => deleteAppResponse(false));
  const applicationClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    maxNetworkRetries: 3,
    fetch: applicationFetch,
  });
  await assert.rejects(applicationClient.apps.del("app"), StackMachineAPIError);
  assert.equal(applicationFetch.calls.length, 1);
});

test("user aborts and timeouts become connection errors without retrying aborts", async () => {
  const abortedController = new AbortController();
  abortedController.abort();
  const abortFetch = mockFetch((call) => {
    if (call.init.signal?.aborted) {
      throw abortError();
    }
    return viewerResponse();
  });
  const abortClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: abortFetch,
  });

  await assert.rejects(
    abortClient.viewer({
      maxNetworkRetries: 2,
      signal: abortedController.signal,
    }),
    (error) => {
      assert.ok(error instanceof StackMachineConnectionError);
      assert.equal(error.code, "request_aborted");
      return true;
    },
  );
  assert.equal(abortFetch.calls.length, 1);

  const timeoutFetch = mockFetch(
    (call) =>
      new Promise((_, reject) => {
        call.init.signal?.addEventListener(
          "abort",
          () => reject(abortError()),
          { once: true },
        );
      }),
  );
  const timeoutClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: timeoutFetch,
  });

  await assert.rejects(
    timeoutClient.viewer({ timeout: 1, maxNetworkRetries: 0 }),
    (error) => {
      assert.ok(error instanceof StackMachineConnectionError);
      assert.equal(error.code, "request_timeout");
      return true;
    },
  );
});

test("HTTP and GraphQL failures normalize to typed SDK errors", async () => {
  const cases = [
    [400, StackMachineInvalidRequestError],
    [401, StackMachineAuthenticationError],
    [429, StackMachineRateLimitError],
  ];

  for (const [status, ErrorClass] of cases) {
    const fetch = mockFetch(() =>
      jsonResponse(
        {
          errors: [
            {
              message: `status ${status}`,
              extensions: { code: `STATUS_${status}` },
            },
          ],
        },
        {
          status,
          headers: { "x-request-id": `req_${status}` },
        },
      ),
    );
    const client = new StackMachine("key", {
      apiUrl: "https://api.example.test/graphql",
      fetch,
    });

    await assert.rejects(client.viewer(), (error) => {
      assert.ok(error instanceof ErrorClass);
      assert.equal(error.statusCode, status);
      assert.equal(error.requestId, `req_${status}`);
      assert.equal(error.code, `STATUS_${status}`);
      return true;
    });
  }

  const graphQLFetch = mockFetch(() =>
    jsonResponse({
      errors: [
        {
          message: "field validation failed",
          extensions: { code: "BAD_USER_INPUT", param: "input.name" },
        },
      ],
    }),
  );
  const graphQLClient = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch: graphQLFetch,
  });

  await assert.rejects(graphQLClient.apps.del("app"), (error) => {
    assert.ok(error instanceof StackMachineGraphQLError);
    assert.equal(error.operationName, "srcDeleteAppMutation");
    assert.equal(error.code, "BAD_USER_INPUT");
    assert.equal(error.param, "input.name");
    assert.equal(error.graphQLErrors.length, 1);
    return true;
  });
  assert.equal(graphQLFetch.calls.length, 1);
});

const packageVersionNode = (id, overrides = {}) => ({
  __typename: "PackageVersion",
  id,
  version: "0.1.0",
  createdAt: "2026-01-01T00:00:00Z",
  package: {
    id: `pkg-${id}`,
    packageName: `pkg-${id}`,
    namespace: "tester",
    private: false,
    lastVersion: {
      id: `${id}-last`,
      version: "0.1.0",
      createdAt: "2026-01-01T00:00:00Z",
      distribution: {
        piritaSha256Hash: "sha256:abc",
        piritaDownloadUrl: `https://cdn.example.test/${id}.webc`,
        downloadUrl: `https://cdn.example.test/${id}.tar.gz`,
        size: 1024,
        piritaSize: 2048,
        webcVersion: "V3",
        webcManifest: "{}",
      },
    },
    ...overrides,
  },
});

const searchResponse = (
  nodes,
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: null,
    startCursor: null,
  },
  totalCount = nodes.length,
) =>
  jsonResponse({
    data: {
      search: {
        edges: nodes.map((node, index) => ({
          cursor: `cursor_${index + 1}`,
          node,
        })),
        pageInfo,
        totalCount,
      },
    },
  });

test("packages.search returns a list and maps package versions from the search query", async () => {
  const fetch = mockFetch(() =>
    searchResponse(
      [
        packageVersionNode("version_1", {
          packageName: "alpha",
          namespace: "tester",
        }),
      ],
      {
        hasNextPage: true,
        hasPreviousPage: false,
        endCursor: "cursor_1",
        startCursor: "cursor_1",
      },
      3,
    ),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const page = await client.packages.search(
    { query: "alpha", filter: { owner: "tester" }, limit: 1 },
    { apiKey: "request-key" },
  );

  assert.equal(page.object, "list");
  assert.equal(page.url, "/v1/packages");
  assert.equal(page.hasMore, true);
  assert.equal(page.totalCount, 3);
  assert.equal(page.data.length, 1);
  assert.equal(page.data[0].id, "version_1");
  assert.equal(page.data[0].version, "0.1.0");
  assert.equal(page.data[0].package.packageName, "alpha");
  assert.equal(page.data[0].package.namespace, "tester");
  // The full authoritative shape includes the package's last version + its
  // distribution.
  assert.equal(page.data[0].package.lastVersion.version, "0.1.0");
  assert.equal(page.data[0].package.lastVersion.distribution.webcVersion, "V3");
  assert.equal(
    page.data[0].package.lastVersion.distribution.downloadUrl,
    "https://cdn.example.test/version_1.tar.gz",
  );
  assert.ok(page.data[0].createdAt instanceof Date);
  assert.ok(page.data[0].package.lastVersion.createdAt instanceof Date);

  assert.equal(fetch.calls[0].body.operationName, "srcSearchPackagesQuery");
  assert.equal(fetch.calls[0].body.variables.searchQuery, "alpha");
  assert.deepEqual(fetch.calls[0].body.variables.packages, { owner: "tester" });
  assert.equal(fetch.calls[0].body.variables.first, 1);
  assert.equal(
    fetch.calls[0].headers.get("authorization"),
    "Bearer request-key",
  );
});

test("packages.search defaults to an empty query and always sends a packages filter", async () => {
  const fetch = mockFetch(() => searchResponse([]));
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const page = await client.packages.search();

  assert.equal(page.data.length, 0);
  // `query` is required by the schema; a non-null `packages` filter is what
  // scopes `search` to packages, so an empty filter is still sent.
  assert.equal(fetch.calls[0].body.variables.searchQuery, "");
  assert.deepEqual(fetch.calls[0].body.variables.packages, {});
});

test("packages.search forwards the full package filter unchanged", async () => {
  const fetch = mockFetch(() => searchResponse([]));
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const filter = {
    owner: "tester",
    curated: true,
    downloads: { count: 100, comparison: "GREATER_THAN_OR_EQUAL" },
    orderBy: "TOTAL_DOWNLOADS",
    sortBy: "DESC",
  };
  await client.packages.search({ filter });

  assert.deepEqual(fetch.calls[0].body.variables.packages, filter);
});

test("packages.search serializes Date filters to ISO strings", async () => {
  const fetch = mockFetch(() => searchResponse([]));
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  await client.packages.search({
    filter: {
      owner: "tester",
      createdAfter: new Date("2026-01-02T03:04:05.000Z"),
      lastPublishedBefore: new Date("2026-02-03T04:05:06.000Z"),
    },
  });

  // DateTime filters are sent as ISO strings, like the SDK's other date inputs.
  assert.deepEqual(fetch.calls[0].body.variables.packages, {
    owner: "tester",
    createdAfter: "2026-01-02T03:04:05.000Z",
    lastPublishedBefore: "2026-02-03T04:05:06.000Z",
  });
});

test("packages.search maps every package version in the page", async () => {
  const fetch = mockFetch(() =>
    searchResponse([
      packageVersionNode("version_1", { packageName: "alpha" }),
      packageVersionNode("version_2", { packageName: "beta" }),
    ]),
  );
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const page = await client.packages.search({ query: "*" });

  assert.deepEqual(
    page.data.map((result) => result.package.packageName),
    ["alpha", "beta"],
  );
});

test("apps.cache retrieves, configures, and purges CDN cache state", async () => {
  const fetch = mockFetch((call) => {
    switch (call.body.operationName) {
      case "srcGetAppCacheQuery":
        return jsonResponse({
          data: {
            node: {
              __typename: "DeployApp",
              id: "app_1",
              cdnCacheEnabled: true,
              cdnCachePurgedAt: "2026-07-03T04:05:06Z",
            },
          },
        });
      case "srcConfigureAppCdnCacheMutation":
        return jsonResponse({
          data: { configureAppCdnCache: { success: true } },
        });
      case "srcPurgeAppCdnCacheMutation":
        return jsonResponse({ data: { purgeAppCdnCache: { success: true } } });
      default:
        throw new Error(`Unexpected operation: ${call.body.operationName}`);
    }
  });
  const client = new StackMachine("key", {
    apiUrl: "https://api.example.test/graphql",
    fetch,
  });

  const cache = await client.apps.cache.retrieve("app_1");
  await client.apps.cache.update(
    "app_1",
    { enabled: false },
    { apiKey: "request-key" },
  );
  await client.apps.cache.purge("app_1");

  assert.deepEqual(cache, {
    appId: "app_1",
    enabled: true,
    purgedAt: new Date("2026-07-03T04:05:06Z"),
  });
  assert.deepEqual(fetch.calls[1].body.variables, {
    app: "app_1",
    config: { enabled: false },
  });
  assert.deepEqual(fetch.calls[2].body.variables, { app: "app_1" });
  assert.equal(
    fetch.calls[1].headers.get("authorization"),
    "Bearer request-key",
  );
});

test("apps.cache reports missing apps and unsuccessful mutations", async () => {
  const missingClient = new StackMachine("key", {
    fetch: mockFetch(() => jsonResponse({ data: { node: null } })),
  });
  await assert.rejects(
    missingClient.apps.cache.retrieve("app_missing"),
    StackMachineInvalidRequestError,
  );

  const failureClient = new StackMachine("key", {
    fetch: mockFetch((call) =>
      jsonResponse({
        data:
          call.body.operationName === "srcConfigureAppCdnCacheMutation"
            ? { configureAppCdnCache: { success: false } }
            : { purgeAppCdnCache: { success: false } },
      }),
    ),
  });
  await assert.rejects(
    failureClient.apps.cache.update("app_1", { enabled: true }),
    StackMachineAPIError,
  );
  await assert.rejects(
    failureClient.apps.cache.purge("app_1"),
    StackMachineAPIError,
  );
});

test("apps.cronjobs lists and maps execute and fetch targets", async () => {
  const fetchJob = cronJobNode("fetch_1", {
    kind: "FETCH",
    target: {
      __typename: "FetchCronJobTarget",
      path: "/health",
      method: "POST",
      headers: { authorization: "Bearer token" },
      body: "ping",
      expectBodyIncludes: "pong",
      expectBodyRegex: null,
      expectStatusCodes: [200, 204],
    },
  });
  const fetch = mockFetch(() =>
    jsonResponse({
      data: {
        node: {
          __typename: "DeployApp",
          id: "app_1",
          cronJobs: {
            edges: [
              { cursor: "cursor_1", node: cronJobNode("execute_1") },
              { cursor: "cursor_2", node: fetchJob },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              endCursor: "cursor_2",
              startCursor: "cursor_1",
            },
            totalCount: 2,
          },
        },
      },
    }),
  );
  const client = new StackMachine("key", { fetch });

  const page = await client.apps.cronjobs.list({
    app: "app_1",
    kind: "EXECUTE",
    sortBy: "OLDEST",
    limit: 2,
  });

  assert.equal(page.url, "/v1/apps/cronjobs");
  assert.equal(page.totalCount, 2);
  assert.equal(
    page.data[0].target.command,
    "python cleanup.py --older-than '30 days' 'it'\\''s-old'",
  );
  assert.deepEqual(page.data[0].target.env, { LOG_LEVEL: "info" });
  assert.ok(page.data[0].createdAt instanceof Date);
  assert.deepEqual(page.data[1].target, {
    kind: "FETCH",
    path: "/health",
    method: "POST",
    headers: { authorization: "Bearer token" },
    body: "ping",
    expectBodyIncludes: "pong",
    expectBodyRegex: null,
    expectStatusCodes: [200, 204],
  });
  assert.equal(fetch.calls[0].body.variables.appId, "app_1");
  assert.equal(fetch.calls[0].body.variables.kind, "EXECUTE");
  assert.equal(fetch.calls[0].body.variables.sortBy, "OLDEST");
  assert.equal(fetch.calls[0].body.variables.first, 2);
});

test("apps.cronjobs retrieves many in input order and reports missing jobs", async () => {
  const fetch = mockFetch((call) =>
    jsonResponse({
      data: {
        nodes: call.body.variables.ids.map((id) =>
          id === "missing" ? null : cronJobNode(id),
        ),
      },
    }),
  );
  const client = new StackMachine("key", { fetch });

  const jobs = await client.apps.cronjobs.retrieveMany([
    "cron_1",
    "missing",
    "cron_2",
  ]);
  assert.deepEqual(
    jobs.map((job) => job?.id ?? null),
    ["cron_1", null, "cron_2"],
  );
  assert.deepEqual(await client.apps.cronjobs.retrieveMany([]), []);
  await assert.rejects(
    client.apps.cronjobs.retrieve("missing"),
    StackMachineInvalidRequestError,
  );
});

test("apps.cronjobs creates execute jobs from one parsed command", async () => {
  const fetch = mockFetch(() =>
    jsonResponse({
      data: { createCronJob: { cronJob: cronJobNode("cron_created") } },
    }),
  );
  const client = new StackMachine("key", { fetch });

  const cronJob = await client.apps.cronjobs.create(
    {
      app: "app_1",
      name: "cleanup",
      schedule: "0 2 * * *",
      execute: {
        command: "python cleanup.py --label '30 days' path\\ with\\ spaces",
        env: { LOG_LEVEL: "debug" },
        packageName: "python/python",
      },
    },
    { idempotencyKey: "cron-create-1" },
  );

  assert.equal(cronJob.id, "cron_created");
  assert.deepEqual(fetch.calls[0].body.variables.input, {
    appId: "app_1",
    name: "cleanup",
    schedule: "0 2 * * *",
    execute: {
      command: "python",
      cliArgs: ["cleanup.py", "--label", "30 days", "path with spaces"],
      env: { LOG_LEVEL: "debug" },
      packageName: "python/python",
    },
    clientMutationId: "cron-create-1",
  });
});

test("apps.cronjobs creates fetch jobs, updates partial fields, and deletes", async () => {
  const fetch = mockFetch((call) => {
    if (call.body.operationName === "srcCreateCronJobMutation") {
      return jsonResponse({
        data: {
          createCronJob: {
            cronJob: cronJobNode("fetch_created", {
              kind: "FETCH",
              target: {
                __typename: "FetchCronJobTarget",
                path: "/health",
                method: "GET",
                headers: {},
                body: null,
                expectBodyIncludes: null,
                expectBodyRegex: null,
                expectStatusCodes: [200],
              },
            }),
          },
        },
      });
    }
    if (call.body.operationName === "srcUpdateCronJobMutation") {
      return jsonResponse({
        data: {
          updateCronJob: {
            cronJob: cronJobNode("fetch_created", {
              enabled: false,
              maxRetries: null,
            }),
          },
        },
      });
    }
    return jsonResponse({
      data: {
        deleteCronJob: {
          success: true,
          deletedCronJobId: "fetch_created",
        },
      },
    });
  });
  const client = new StackMachine("key", { fetch });

  await client.apps.cronjobs.create({
    app: "app_1",
    name: "healthcheck",
    schedule: "*/5 * * * *",
    fetch: {
      path: "/health",
      headers: { accept: "application/json" },
      expectStatusCodes: [200],
    },
  });
  await client.apps.cronjobs.update("fetch_created", {
    enabled: false,
    maxRetries: null,
  });
  await client.apps.cronjobs.del("fetch_created");

  assert.deepEqual(fetch.calls[0].body.variables.input.fetch, {
    path: "/health",
    headers: { accept: "application/json" },
    expectStatusCodes: [200],
  });
  assert.equal(fetch.calls[1].body.variables.input.cronJobId, "fetch_created");
  assert.equal(fetch.calls[1].body.variables.input.enabled, false);
  assert.equal(fetch.calls[1].body.variables.input.maxRetries, null);
  assert.equal(fetch.calls[2].body.variables.input.cronJobId, "fetch_created");
});

test("apps.cronjobs rejects blank and malformed execute commands", async () => {
  const fetch = mockFetch(() => {
    throw new Error("fetch should not be called");
  });
  const client = new StackMachine("key", { fetch });
  const base = {
    app: "app_1",
    name: "invalid",
    schedule: "* * * * *",
  };

  for (const command of ["   ", "''", "echo 'unterminated", "echo \\"]) {
    await assert.rejects(
      client.apps.cronjobs.create({ ...base, execute: { command } }),
      StackMachineValidationError,
    );
  }
  assert.equal(fetch.calls.length, 0);
});

test("apps.cronjobs rejects missing and unsuccessful mutation payloads", async () => {
  const fetch = mockFetch((call) => {
    if (call.body.operationName === "srcCreateCronJobMutation") {
      return jsonResponse({ data: { createCronJob: null } });
    }
    if (call.body.operationName === "srcUpdateCronJobMutation") {
      return jsonResponse({ data: { updateCronJob: null } });
    }
    return jsonResponse({
      data: {
        deleteCronJob: { success: false, deletedCronJobId: "cron_1" },
      },
    });
  });
  const client = new StackMachine("key", { fetch });

  await assert.rejects(
    client.apps.cronjobs.create({
      app: "app_1",
      name: "missing",
      schedule: "* * * * *",
      execute: { command: "echo ok" },
    }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.cronjobs.update("cron_1", { enabled: false }),
    StackMachineAPIError,
  );
  await assert.rejects(
    client.apps.cronjobs.del("cron_1"),
    StackMachineAPIError,
  );
});

const yankResponse = (versions) =>
  jsonResponse({
    data: {
      yankPackageVersions: { packageVersions: versions },
    },
  });

const yankedVersionNode = (version, overrides = {}) => ({
  id: `pkv_${version}`,
  version,
  yankedAt:
    "yankedAt" in overrides ? overrides.yankedAt : "2024-01-01T00:00:00Z",
  // `??` would clobber an explicit `null` reason, which is exactly what an
  // unyanked version carries.
  yankReason: "yankReason" in overrides ? overrides.yankReason : "bad build",
});

test("packages.retrieve maps lifecycle state and actor", async () => {
  const node = packageVersionNode("version_1").package;
  const fetch = mockFetch(() =>
    jsonResponse({
      data: {
        getPackage: {
          ...node,
          isArchived: true,
          archivedBy: { username: "alice" },
        },
      },
    }),
  );
  const client = new StackMachine("key", { fetch });

  const package_ = await client.packages.retrieve("tester/pkg-version_1");

  assert.equal(package_.isArchived, true);
  assert.equal(package_.archivedBy.username, "alice");
  assert.equal(package_.lastVersion.distribution.webcVersion, "V3");
  assert.deepEqual(fetch.calls[0].body.variables, {
    name: "tester/pkg-version_1",
  });
});

test("packages.versions.resolve maps yank state and rebuilds", async () => {
  const base = packageVersionNode("version_1").package.lastVersion;
  const fetch = mockFetch(() =>
    jsonResponse({
      data: {
        getPackageVersion: {
          ...base,
          yankedAt: "2026-01-02T00:00:00Z",
          yankReason: "bad build",
          yankedBy: { username: "alice" },
          rebuilds: [
            { ...base, id: "version_1_rebuild", version: "0.1.0+wasix.1" },
          ],
        },
      },
    }),
  );
  const client = new StackMachine("key", { fetch });

  const version = await client.packages.versions.resolve(
    "tester/pkg-version_1",
    ">=0.1.0",
  );

  assert.equal(version.yankedAt.toISOString(), "2026-01-02T00:00:00.000Z");
  assert.equal(version.yankReason, "bad build");
  assert.equal(version.yankedBy.username, "alice");
  assert.equal(version.rebuilds[0].version, "0.1.0+wasix.1");
  assert.deepEqual(fetch.calls[0].body.variables, {
    name: "tester/pkg-version_1",
    version: ">=0.1.0",
  });
});

test("packages.versions.resolve returns null when no version matches", async () => {
  const fetch = mockFetch(() =>
    jsonResponse({ data: { getPackageVersion: null } }),
  );
  const client = new StackMachine("key", { fetch });

  assert.equal(
    await client.packages.versions.resolve("tester/missing", "latest"),
    null,
  );
});

test("packages.yank sends the input and maps the changed versions", async () => {
  const fetch = mockFetch(() => yankResponse([yankedVersionNode("1.2.3")]));
  const client = new StackMachine("key", { fetch });

  const versions = await client.packages.yank(["pkv_1", "pkv_2"], {
    reason: "bad build",
  });

  assert.equal(versions.length, 1);
  assert.equal(versions[0].version, "1.2.3");
  assert.equal(versions[0].yankedAt.toISOString(), "2024-01-01T00:00:00.000Z");
  assert.equal(versions[0].yankReason, "bad build");

  assert.equal(
    fetch.calls[0].body.operationName,
    "srcYankPackageVersionsMutation",
  );
  // The SDK adds its own `clientMutationId`, so compare the fields we set.
  const { clientMutationId, ...input } = fetch.calls[0].body.variables.input;
  assert.deepEqual(input, {
    packageVersionIds: ["pkv_1", "pkv_2"],
    reason: "bad build",
    undo: false,
  });
  assert.ok(clientMutationId);
});

test("packages.yank accepts several version ids", async () => {
  const fetch = mockFetch(() =>
    yankResponse([yankedVersionNode("1.0.0"), yankedVersionNode("1.1.0")]),
  );
  const client = new StackMachine("key", { fetch });

  const versions = await client.packages.yank(["pkv_a", "pkv_b"]);

  assert.deepEqual(
    versions.map((version) => version.version),
    ["1.0.0", "1.1.0"],
  );
  assert.deepEqual(fetch.calls[0].body.variables.input.packageVersionIds, [
    "pkv_a",
    "pkv_b",
  ]);
  assert.equal(fetch.calls[0].body.variables.input.reason, null);
});

test("packages.unyank sets undo and clears the reason", async () => {
  const fetch = mockFetch(() =>
    yankResponse([
      yankedVersionNode("1.2.3", { yankedAt: null, yankReason: null }),
    ]),
  );
  const client = new StackMachine("key", { fetch });

  const versions = await client.packages.unyank(["pkv_1"]);

  assert.equal(versions[0].yankedAt, null);
  assert.equal(versions[0].yankReason, null);
  assert.deepEqual(fetch.calls[0].body.variables.input.packageVersionIds, [
    "pkv_1",
  ]);
  assert.equal(fetch.calls[0].body.variables.input.undo, true);
  assert.equal(fetch.calls[0].body.variables.input.reason, null);
});

test("packages.yank resolves to an empty array when nothing changed", async () => {
  const fetch = mockFetch(() => yankResponse([]));
  const client = new StackMachine("key", { fetch });

  assert.deepEqual(await client.packages.yank(["pkv_1"]), []);
});

test("packages.yank surfaces permission errors from the registry", async () => {
  const fetch = mockFetch(() =>
    jsonResponse({
      data: null,
      errors: [
        {
          message:
            "You do not have permission to yank versions of this package.",
          extensions: { code: "FORBIDDEN" },
        },
      ],
    }),
  );
  const client = new StackMachine("key", { fetch });

  await assert.rejects(
    client.packages.yank(["pkv_1"]),
    StackMachineGraphQLError,
  );
});

const packageIdResponse = (id) =>
  jsonResponse({ data: { getPackage: { id } } });

const setArchivedResponse = (isArchived) =>
  jsonResponse({
    data: { setPackageArchived: { package: { id: "pkg_1", isArchived } } },
  });

test("packages.archive resolves the id then archives", async () => {
  const responses = [packageIdResponse("pkg_42"), setArchivedResponse(true)];
  let call = 0;
  const fetch = mockFetch(() => responses[call++]);
  const client = new StackMachine("key", { fetch });

  const archived = await client.packages.archive("tester/alpha");

  assert.equal(archived, true);
  assert.equal(fetch.calls[0].body.operationName, "srcGetPackageIdQuery");
  assert.deepEqual(fetch.calls[0].body.variables, { name: "tester/alpha" });
  assert.equal(
    fetch.calls[1].body.operationName,
    "srcSetPackageArchivedMutation",
  );
  assert.deepEqual(fetch.calls[1].body.variables, {
    id: "pkg_42",
    archived: true,
  });
});

test("packages.unarchive sends the resolved id", async () => {
  const responses = [packageIdResponse("pkg_7"), setArchivedResponse(false)];
  let call = 0;
  const fetch = mockFetch(() => responses[call++]);
  const client = new StackMachine("key", { fetch });

  const archived = await client.packages.unarchive("tester/alpha");

  assert.equal(archived, false);
  assert.deepEqual(fetch.calls[1].body.variables, {
    id: "pkg_7",
    archived: false,
  });
});

test("packages.archive throws when the package is not found", async () => {
  const fetch = mockFetch(() => jsonResponse({ data: { getPackage: null } }));
  const client = new StackMachine("key", { fetch });

  await assert.rejects(
    client.packages.archive("tester/missing"),
    StackMachineAPIError,
  );
});

test("packages.setArchived sends the boolean", async () => {
  const responses = [
    packageIdResponse("pkg_5"),
    setArchivedResponse(true),
    packageIdResponse("pkg_5"),
    setArchivedResponse(false),
  ];
  let call = 0;
  const fetch = mockFetch(() => responses[call++]);
  const client = new StackMachine("key", { fetch });

  assert.equal(await client.packages.setArchived("tester/alpha", true), true);
  assert.equal(await client.packages.setArchived("tester/alpha", false), false);

  assert.deepEqual(fetch.calls[1].body.variables, {
    id: "pkg_5",
    archived: true,
  });
  assert.deepEqual(fetch.calls[3].body.variables, {
    id: "pkg_5",
    archived: false,
  });
});
