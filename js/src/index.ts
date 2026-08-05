import { srcAutobuildMutation } from "__generated__/srcAutobuildMutation.graphql";
import { srcAutobuildSubscription } from "__generated__/srcAutobuildSubscription.graphql";
import nodeAppAlias, {
  srcAppAlias$data,
} from "__generated__/srcAppAlias.graphql";
import { srcDeleteAppMutation } from "__generated__/srcDeleteAppMutation.graphql";
import { srcYankPackageVersionsMutation } from "__generated__/srcYankPackageVersionsMutation.graphql";
import { srcSetPackageArchivedMutation } from "__generated__/srcSetPackageArchivedMutation.graphql";
import { srcGetPackageIdQuery } from "__generated__/srcGetPackageIdQuery.graphql";
import { srcGetPackageQuery } from "__generated__/srcGetPackageQuery.graphql";
import { srcResolvePackageVersionQuery } from "__generated__/srcResolvePackageVersionQuery.graphql";
import nodeAppDatabase, {
  srcAppDatabaseData$data,
} from "__generated__/srcAppDatabaseData.graphql";
import nodeAppVolume, {
  srcAppVolume$data,
} from "__generated__/srcAppVolume.graphql";
import { srcCreateAppVolumeMutation } from "__generated__/srcCreateAppVolumeMutation.graphql";
import nodeCronJob, {
  srcCronJobData$data,
} from "__generated__/srcCronJobData.graphql";
import nodeApp, {
  srcDeployAppData$data,
} from "__generated__/srcDeployAppData.graphql";
import { srcDeployAppKindWordPress$data } from "__generated__/srcDeployAppKindWordPress.graphql";
import nodeAppVersion, {
  srcDeployAppVersionData$data,
} from "__generated__/srcDeployAppVersionData.graphql";
import nodeDNSDomain, {
  srcDNSDomainData$data,
} from "__generated__/srcDNSDomainData.graphql";
import nodeDNSRecord, {
  srcDNSRecordData$data,
} from "__generated__/srcDNSRecordData.graphql";
import nodeEmailMessage, {
  srcEmailMessageData$data,
} from "__generated__/srcEmailMessageData.graphql";
import nodeGithubRepoConnection, {
  srcGithubRepoConnectionData$data,
} from "__generated__/srcGithubRepoConnectionData.graphql";
import nodeSearchPackageVersion, {
  srcSearchPackageVersionData$data,
} from "__generated__/srcSearchPackageVersionData.graphql";
import { srcGetAppAliasesQuery } from "__generated__/srcGetAppAliasesQuery.graphql";
import { srcGetAppByIdQuery } from "__generated__/srcGetAppByIdQuery.graphql";
import { srcGetAppByNameQuery } from "__generated__/srcGetAppByNameQuery.graphql";
import { srcGetAppLogsQuery } from "__generated__/srcGetAppLogsQuery.graphql";
import { srcGetDeploymentStatusQuery } from "__generated__/srcGetDeploymentStatusQuery.graphql";
import { srcListDeployAppsQuery } from "__generated__/srcListDeployAppsQuery.graphql";
import { srcUsageAppMetricsQuery } from "__generated__/srcUsageAppMetricsQuery.graphql";
import { srcUsageOwnerMetricsQuery } from "__generated__/srcUsageOwnerMetricsQuery.graphql";
import { srcUsageViewerMetricsQuery } from "__generated__/srcUsageViewerMetricsQuery.graphql";
import { srcDeleteAppDomainMutation } from "__generated__/srcDeleteAppDomainMutation.graphql";
import { srcDeleteAppVolumeMutation } from "__generated__/srcDeleteAppVolumeMutation.graphql";
import { srcUpsertAppDomainMutation } from "__generated__/srcUpsertAppDomainMutation.graphql";
import { srcUpdateVolumeMutation } from "__generated__/srcUpdateVolumeMutation.graphql";
import { srcVerifyAppDomainMutation } from "__generated__/srcVerifyAppDomainMutation.graphql";
import { srcViewerQuery } from "__generated__/srcViewerQuery.graphql";
import RelayRuntime, {
  ReaderFragment,
  type Environment,
  type GraphQLTaggedNode,
  type UploadableMap,
} from "relay-runtime";
import {
  createEnvironment,
  DEFAULT_MAX_NETWORK_RETRIES,
  DEFAULT_TIMEOUT_MS,
  type EnvironmentOptions,
  type StackMachineCacheConfig,
  type StackMachineRequestOptions,
} from "./environment";
import {
  StackMachineAPIError,
  StackMachineError,
  StackMachineGraphQLError,
  StackMachineAuthenticationError,
  StackMachineConnectionError,
  StackMachineInvalidRequestError,
  StackMachinePermissionError,
  StackMachineRateLimitError,
  StackMachineValidationError,
  stackMachineErrorFromGraphQLErrors,
  stackMachineErrorFromUnknown,
  type StackMachineGraphQLErrorPayload,
} from "./errors";
import {
  connectionToListPageData,
  createStackMachineListPromise,
  type StackMachineAutoPagingEachHandler,
  type StackMachineAutoPagingToArrayOptions,
  type StackMachineList,
  type StackMachineListPromise,
  type StackMachinePaginationParams,
} from "./pagination";
import {
  createZip,
  handleUploadFileToCloud,
  resolveUploadOptions,
  type StackMachineUploadOptions,
  type StackMachineUploadProgress,
  type StackMachineZipFile,
  type StackMachineZipFiles,
} from "./upload";

const {
  graphql,
  fetchQuery,
  commitMutation,
  requestSubscription,
  getSelector,
} = RelayRuntime;

const DEFAULT_API_URL = "https://api.stackmachine.com/graphql";

export { createZip };
export {
  StackMachineAPIError,
  StackMachineAuthenticationError,
  StackMachineConnectionError,
  StackMachineError,
  StackMachineGraphQLError,
  StackMachineInvalidRequestError,
  StackMachinePermissionError,
  StackMachineRateLimitError,
  StackMachineValidationError,
  type StackMachineGraphQLErrorPayload,
  type StackMachineRequestOptions,
  type StackMachineAutoPagingEachHandler,
  type StackMachineAutoPagingToArrayOptions,
  type StackMachineList,
  type StackMachineListPromise,
  type StackMachinePaginationParams,
  type StackMachineUploadOptions,
  type StackMachineUploadProgress,
  type StackMachineZipFile,
  type StackMachineZipFiles,
};

export type StackMachineConfig = {
  apiUrl?: string;
  headers?: HeadersInit;
  timeout?: number;
  maxNetworkRetries?: number;
  fetch?: typeof fetch;
};

export type StackMachineRegistryConfig = StackMachineConfig & {
  apiKey?: string;
  /** @deprecated Use `apiKey` instead. */
  token?: string;
};

type MutationShape = {
  response: unknown;
  variables: Record<string, unknown>;
};

type SubscriptionHandlers<TSubscription extends { response: unknown }> = {
  onNext?: (data: TSubscription["response"]) => void;
  onCompleted?: () => void;
  onError?: (error: Error) => void;
};

type StackMachineUploadConfig = {
  fetch: typeof fetch;
  timeout: number;
  maxNetworkRetries: number;
};

type SdkContext = {
  environment: Environment;
  _query<
    TQuery extends { response: unknown; variables: Record<string, unknown> },
  >(
    query: GraphQLTaggedNode,
    variables: TQuery["variables"],
    options?: StackMachineRequestOptions,
  ): Promise<TQuery["response"]>;
  _mutation<TMutation extends MutationShape>(
    mutation: GraphQLTaggedNode,
    variables: TMutation["variables"],
    options?: StackMachineRequestOptions,
    uploadables?: UploadableMap | null,
  ): Promise<TMutation["response"]>;
  _requestSubscription<TSubscription extends { response: unknown }>(
    subscription: GraphQLTaggedNode,
    variables: Record<string, unknown>,
    handlers: SubscriptionHandlers<TSubscription>,
    options?: StackMachineRequestOptions,
  ): { dispose: () => void };
  _getFragmentData<T>(node: ReaderFragment, fetchedData: unknown): T;
};

export type DeployAppEnvVarInput = {
  name: string;
  sensitive?: boolean | null;
  value: string;
};
export type DeployAppWordPressExtraData = {
  adminEmail: string;
  adminPassword: string;
  adminUsername: string;
  language?: string | null;
  siteName: string;
  theme?: string | null;
};
export type DeployAppAutobuildExtraData = {
  wordpress?: DeployAppWordPressExtraData | null;
};
export type DeployAppJobDefinitionInput = {
  cliArgs?: ReadonlyArray<string | null | undefined> | null;
  command: string;
  env?: ReadonlyArray<string | null | undefined> | null;
  name?: string | null;
  package?: string | null;
  timeout?: string | null;
};
export type DeployAppAutobuildInput = {
  afterDeployCmd?: string | null;
  allowExistingApp?: boolean | null;
  appId?: string | null;
  appName?: string | null;
  branch?: string | null;
  buildCmd?: string | null;
  clientMutationId?: string | null;
  domains?: ReadonlyArray<string | null | undefined> | null;
  enableDatabase?: boolean | null;
  envVars?: ReadonlyArray<DeployAppEnvVarInput | null | undefined> | null;
  extraData?: DeployAppAutobuildExtraData | null;
  installCmd?: string | null;
  jobs?: ReadonlyArray<DeployAppJobDefinitionInput | null | undefined> | null;
  kind?: string | null;
  managed?: boolean | null;
  owner?: string | null;
  params?: DeployAppAutobuildExtraData | null;
  perishAt?: string | null;
  presetName?: string | null;
  region?: string | null;
  repoUrl?: string | null;
  rootDir?: string | null;
  startCmd?: string | null;
  uploadUrl?: string | null;
  waitForScreenshotGeneration?: boolean | null;
};
export type DeploymentCreateInput = DeployAppAutobuildInput & {
  files?: StackMachineZipFiles | null;
};
export type DeploymentCreateOptions = StackMachineRequestOptions & {
  chunkSize?: number;
  onUploadProgress?: (progress: StackMachineUploadProgress) => void;
};
export type AppsDomainsCreateInput = {
  app: string;
  hostname: string;
  isDefault?: boolean;
};
export type AppsVolumesListInput = StackMachinePaginationParams & {
  app: string;
};
export type AppsVolumesCreateInput = {
  app: string;
  mountPath: string;
  maxSizeBytes?: number | string | null;
};
export type AppsVolumesUpdateInput = {
  mountPath?: string | null;
  maxSizeBytes?: number | string | null;
  redeployApp?: boolean | null;
  s3Enabled?: boolean | null;
};
export type AppsGitConnectInput = {
  app: string;
  installationRepoId: string;
  deployBranch?: string | null;
};
export type AppsGitUpdateInput = {
  deployBranch?: string | null;
  deploymentStatusEvents?: boolean | null;
  pullRequestComments?: boolean | null;
};
export type AppsDatabasesListInput = StackMachinePaginationParams & {
  app: string;
};
export type DatabaseEngine = "MYSQL" | "POSTGRES" | "SQLITE";
export type AppsDatabasesCreateWithEngineInput = {
  app: string;
  dbEngine: DatabaseEngine;
  name?: string | null;
};
/**
 * @deprecated Prefer `AppsDatabasesCreateWithEngineInput` with `dbEngine`.
 * This remains supported for compatibility with the legacy `createAppDb` mutation.
 */
export type AppsDatabasesCreateLegacyInput = {
  app: string;
  dbEngine?: null;
  name?: string | null;
};
export type AppsDatabasesCreateInput =
  | AppsDatabasesCreateWithEngineInput
  | AppsDatabasesCreateLegacyInput;
export type AppDatabaseWithPassword = {
  database: AppDatabase;
  password: string;
};
export type DNSRecordKind =
  | "A"
  | "AAAA"
  | "CAA"
  | "CNAME"
  | "DNAME"
  | "MX"
  | "NS"
  | "PTR"
  | "SOA"
  | "SRV"
  | "SSHFP"
  | "TXT"
  | "%future added value";
export type DNSRecordsSortBy = "NEWEST" | "OLDEST";
export type DNSDomainsListInput = StackMachinePaginationParams & {
  owner?: string | null;
};
export type DNSDomainsCreateInput = {
  name: string;
  owner?: string | null;
  importRecords?: boolean | null;
};
export type DNSDomainsImportZoneFileInput = {
  zoneFile: string;
  deleteMissingRecords?: boolean | null;
};
export type DNSRecordsListInput = {
  domain: string;
};
export type DNSRecordsListPageInput = StackMachinePaginationParams & {
  domain: string;
  sortBy?: DNSRecordsSortBy | null;
};
export type DNSCAAExtraInput = {
  flags: number;
  tag: string;
};
export type DNSMXExtraInput = {
  preference: number;
};
export type DNSSOAExtraInput = {
  expire: number;
  minimum: number;
  mname: string;
  refresh: number;
  retry: number;
  rname: string;
  serial: number;
};
export type DNSSRVExtraInput = {
  port: number;
  priority: number;
  protocol: string;
  service: string;
  weight: number;
};
export type DNSSSHFPExtraInput = {
  algorithm: number;
  type: number;
};
export type DNSRecordsUpsertInput = {
  domain: string;
  kind: DNSRecordKind;
  name: string;
  value: string;
  ttl?: number | null;
  caa?: DNSCAAExtraInput | null;
  mx?: DNSMXExtraInput | null;
  soa?: DNSSOAExtraInput | null;
  srv?: DNSSRVExtraInput | null;
  sshfp?: DNSSSHFPExtraInput | null;
};
export type DNSRecordUpdateInput = {
  id?: string | null;
  delete?: boolean | null;
  kind?: DNSRecordKind | null;
  name?: string | null;
  value?: string | null;
  ttl?: number | null;
  caa?: DNSCAAExtraInput | null;
  mx?: DNSMXExtraInput | null;
  soa?: DNSSOAExtraInput | null;
  srv?: DNSSRVExtraInput | null;
  sshfp?: DNSSSHFPExtraInput | null;
};
export type DNSRecordsUpdateManyInput = {
  domain: string;
  records: ReadonlyArray<DNSRecordUpdateInput | null | undefined>;
};
export type EmailMessageDirection = "RECEIVED" | "SENT" | "%future added value";
export type EmailMessageStatus =
  | "DELIVERED"
  | "FAILED"
  | "QUEUED"
  | "RECEIVED"
  | "SENT"
  | "%future added value";
export type MetricGrouping =
  | "BY_5_MINUTES"
  | "BY_15_MINUTES"
  | "BY_DAY"
  | "BY_HOUR"
  | "BY_WEEK"
  | "%future added value";
export type UsageMetricValue = number | string;
export type UsageRequestMetrics = {
  cachedRequests: UsageMetricValue;
  dataCachedBytes: UsageMetricValue;
  dataServedBytes: UsageMetricValue;
  http2xx: UsageMetricValue;
  http3xx: UsageMetricValue;
  http4xx: UsageMetricValue;
  http5xx: UsageMetricValue;
  httpOther: UsageMetricValue;
  percentageCached: number;
  requestDurationMillis: UsageMetricValue;
  totalRequests: UsageMetricValue;
  uniqueUsers: number;
};
export type UsageWorkloadMetrics = {
  memoryBytes: UsageMetricValue;
  networkEgressBytes: UsageMetricValue;
  networkIngressBytes: UsageMetricValue;
  realCpuTimeMillis: UsageMetricValue;
  wallCpuTimeMillis: UsageMetricValue;
  workloads: number;
};
export type UsageMetricsTotals = {
  requests: UsageRequestMetrics;
  workloads: UsageWorkloadMetrics;
};
export type GroupedUsageMetrics = UsageMetricsTotals & {
  groupedAt: Date;
};
export type UsageMetricsScope =
  | { type: "app"; appId: string }
  | { type: "owner"; owner: string; ownerType: "Namespace" | "User" }
  | { type: "viewer" };
export type UsageMetrics = {
  startAt: Date;
  endAt: Date;
  grouped: GroupedUsageMetrics[];
  totals: UsageMetricsTotals;
  scope: UsageMetricsScope;
};
export type UsageMetricsInput = {
  app?: string | null;
  owner?: string | null;
  start: Date | string;
  end: Date | string;
  groupedBy?: MetricGrouping | null;
};
export type EmailsListInput = StackMachinePaginationParams & {
  app?: string | null;
  owner?: string | null;
};
export type EmailsSendInput = {
  app: string;
  to: ReadonlyArray<string>;
  subject: string;
  bcc?: ReadonlyArray<string> | null;
  cc?: ReadonlyArray<string> | null;
  fromAddress?: string | null;
  fromEmailId?: string | null;
  htmlBody?: string | null;
  rawMessage?: Blob | File | null;
  replyTo?: string | null;
  textBody?: string | null;
};
export type AppAliasSortBy = "NEWEST" | "OLDEST";
export type DeployAppsSortBy = "MOST_ACTIVE" | "NEWEST" | "OLDEST";
export type DeployAppVersionsSortBy = "NEWEST" | "OLDEST";
export type DeployAppsListInput = StackMachinePaginationParams & {
  ownerId?: string | null;
  sortBy?: DeployAppsSortBy;
};
export type AppsDomainsListInput = StackMachinePaginationParams & {
  app: string;
  sortBy?: AppAliasSortBy;
};
export type AppsVersionsListInput = StackMachinePaginationParams & {
  app: string;
  createdAfter?: Date;
  sortBy?: DeployAppVersionsSortBy;
};
export type AppsVersionsLogsListInput = StackMachinePaginationParams & {
  version: string;
  since?: Date;
  until?: Date;
  instanceId?: string;
  requestId?: string;
  streams?: LogStream[];
  textSearch?: string;
};
export type AppsSshUsersListInput = StackMachinePaginationParams & {
  app: string;
};
export type AppsSshAuthorizedKeysListInput = StackMachinePaginationParams & {
  user: string;
};
export type AppsSshAuthorizedKeysCreateInput = {
  user: string;
  publicKey: string;
  name?: string;
};
export type AppsSshAuthorizedKeysDeleteInput = {
  authorizedKeyId?: string;
  user?: string;
  name?: string;
};
export type AppsSshUsersUpdateInput = {
  username?: string;
  sftpRootFolder?: string;
  authenticationMethods?: SshAuthenticationMethod[];
};
export type AppsSshServerUpdateInput = { enabled: boolean };

export type AppCache = {
  appId: string;
  enabled: boolean;
  purgedAt: Date | null;
};
export type AppsCacheUpdateInput = {
  enabled: boolean;
};

export type CronJobKind = "EXECUTE" | "FETCH" | "%future added value";
export type CronJobSource =
  | "API"
  | "CONFIG"
  | "PROVISIONED"
  | "%future added value";
export type CronJobsSortBy = "NEWEST" | "OLDEST";
export type CronJobExecuteTarget = {
  kind: "EXECUTE";
  command: string | null;
  env: Record<string, string>;
  packageName: string | null;
};
export type CronJobFetchTarget = {
  kind: "FETCH";
  path: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  expectBodyIncludes: string | null;
  expectBodyRegex: string | null;
  expectStatusCodes: number[] | null;
};
export type CronJobTarget = CronJobExecuteTarget | CronJobFetchTarget;
export type CronJobExecuteTargetInput = {
  command?: string | null;
  env?: Readonly<Record<string, string>> | null;
  packageName?: string | null;
};
export type CronJobFetchTargetInput = {
  path: string;
  method?: string | null;
  headers?: Readonly<Record<string, string>> | null;
  body?: string | null;
  expectBodyIncludes?: string | null;
  expectBodyRegex?: string | null;
  expectStatusCodes?: ReadonlyArray<number> | null;
};
export type AppsCronJobsListInput = StackMachinePaginationParams & {
  app: string;
  kind?: Exclude<CronJobKind, "%future added value"> | null;
  sortBy?: CronJobsSortBy | null;
};
type AppsCronJobsCreateCommonInput = {
  app: string;
  name: string;
  schedule: string;
  enabled?: boolean | null;
  maxRetries?: number | null;
  maxScheduleDrift?: string | null;
  timeout?: string | null;
};
export type AppsCronJobsCreateInput = AppsCronJobsCreateCommonInput &
  (
    | { execute: CronJobExecuteTargetInput; fetch?: never }
    | { execute?: never; fetch: CronJobFetchTargetInput }
  );
type AppsCronJobsUpdateCommonInput = {
  name?: string | null;
  schedule?: string | null;
  enabled?: boolean | null;
  maxRetries?: number | null;
  maxScheduleDrift?: string | null;
  timeout?: string | null;
};
export type AppsCronJobsUpdateInput = AppsCronJobsUpdateCommonInput &
  (
    | { execute?: CronJobExecuteTargetInput; fetch?: never }
    | { execute?: never; fetch?: CronJobFetchTargetInput }
  );

export type AppAliasVerificationState =
  | "APEX_WITHOUT_REDIRECTION"
  | "UNVERIFIED"
  | "VERIFIED"
  | "%future added value";
export type HTTPRedirectType =
  | "PERMANENT_MOVED"
  | "PERMANENT_REDIRECT"
  | "TEMPORARY_FOUND"
  | "TEMPORARY_REDIRECT"
  | "%future added value";

function parseDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }
  return value instanceof Date ? value : new Date(value as string);
}

function requiredPayload<T>(
  value: T | null | undefined,
  message: string,
  operationName?: string,
): T {
  if (!value) {
    throw new StackMachineAPIError({ message, operationName });
  }
  return value;
}

function resourceMissingError(
  resource: string,
  identifier: string,
  operationName?: string,
  param = "id",
) {
  return new StackMachineInvalidRequestError({
    message: `No such ${resource}: ${identifier}.`,
    operationName,
    statusCode: 404,
    code: "resource_missing",
    param,
  });
}

function invalidCronCommand(message: string): StackMachineValidationError {
  return new StackMachineValidationError({
    message,
    code: "invalid_cron_command",
    param: "command",
  });
}

function parseCronCommand(value: string): {
  command: string;
  cliArgs: string[];
} {
  const tokens: string[] = [];
  let token = "";
  let tokenStarted = false;
  let quote: "single" | "double" | null = null;

  const finishToken = () => {
    if (tokenStarted) {
      tokens.push(token);
      token = "";
      tokenStarted = false;
    }
  };

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote === "single") {
      if (character === "'") {
        quote = null;
      } else {
        token += character;
      }
      continue;
    }
    if (quote === "double") {
      if (character === '"') {
        quote = null;
      } else if (character === "\\") {
        index += 1;
        if (index >= value.length) {
          throw invalidCronCommand(
            "`command` cannot end with an incomplete escape sequence.",
          );
        }
        token += value[index];
      } else {
        token += character;
      }
      continue;
    }
    if (/\s/.test(character)) {
      finishToken();
    } else if (character === "'") {
      quote = "single";
      tokenStarted = true;
    } else if (character === '"') {
      quote = "double";
      tokenStarted = true;
    } else if (character === "\\") {
      tokenStarted = true;
      index += 1;
      if (index >= value.length) {
        throw invalidCronCommand(
          "`command` cannot end with an incomplete escape sequence.",
        );
      }
      token += value[index];
    } else {
      tokenStarted = true;
      token += character;
    }
  }

  if (quote) {
    throw invalidCronCommand("`command` contains an unterminated quote.");
  }
  finishToken();
  if (!tokens[0]) {
    throw invalidCronCommand("`command` must contain a non-empty command.");
  }
  return { command: tokens[0], cliArgs: tokens.slice(1) };
}

function quoteCronCommandToken(value: string): string {
  if (/^[A-Za-z0-9_@%+=:,./-]+$/.test(value)) {
    return value;
  }
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

function formatCronCommand(
  command: string | null | undefined,
  cliArgs: unknown,
): string | null {
  const args = Array.isArray(cliArgs)
    ? cliArgs.filter((arg): arg is string => typeof arg === "string")
    : [];
  const tokens =
    command === null || command === undefined ? args : [command, ...args];
  return tokens.length > 0 ? tokens.map(quoteCronCommandToken).join(" ") : null;
}

function serializeCronExecuteTarget(input: CronJobExecuteTargetInput) {
  if (input.command === undefined) {
    return {
      env: input.env,
      packageName: input.packageName,
    };
  }
  if (input.command === null) {
    return {
      command: null,
      cliArgs: [],
      env: input.env,
      packageName: input.packageName,
    };
  }
  return {
    ...parseCronCommand(input.command),
    env: input.env,
    packageName: input.packageName,
  };
}

function shouldRetryGitUpdateWithConnectionId(error: unknown): boolean {
  return (
    error instanceof StackMachineGraphQLError ||
    error instanceof StackMachineInvalidRequestError
  );
}

function operationNameFromNode(node: GraphQLTaggedNode): string | undefined {
  return (node as any)?.params?.name ?? (node as any)?.default?.params?.name;
}

function generateClientMutationId(): string {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) {
    return `sm_${cryptoApi.randomUUID()}`;
  }
  return `sm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function resolveClientMutationId(
  inputClientMutationId: unknown,
  options?: StackMachineRequestOptions,
): string {
  const optionClientMutationId = options?.clientMutationId;
  const optionIdempotencyKey = options?.idempotencyKey;
  if (
    optionClientMutationId &&
    optionIdempotencyKey &&
    optionClientMutationId !== optionIdempotencyKey
  ) {
    throw new StackMachineValidationError({
      message:
        "`idempotencyKey` and `clientMutationId` must match when both are provided.",
      code: "idempotency_conflict",
    });
  }

  const optionValue = optionClientMutationId ?? optionIdempotencyKey;
  if (
    optionValue &&
    typeof inputClientMutationId === "string" &&
    inputClientMutationId &&
    inputClientMutationId !== optionValue
  ) {
    throw new StackMachineValidationError({
      message:
        "`input.clientMutationId` must match `idempotencyKey`/`clientMutationId` when both are provided.",
      code: "idempotency_conflict",
    });
  }

  if (optionValue) {
    return optionValue;
  }
  if (typeof inputClientMutationId === "string" && inputClientMutationId) {
    return inputClientMutationId;
  }
  return generateClientMutationId();
}

function resolveRuntimeFetch(fetchFn?: typeof fetch): typeof fetch {
  const resolvedFetch = fetchFn ?? globalThis.fetch;
  if (!resolvedFetch) {
    throw new StackMachineConnectionError({
      message: "`fetch` is not available in this runtime.",
    });
  }
  return resolvedFetch.bind(globalThis) as typeof fetch;
}

function withClientMutationId<TVariables extends Record<string, unknown>>(
  variables: TVariables,
  options?: StackMachineRequestOptions,
): TVariables {
  const input = variables.input;
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return variables;
  }

  const inputRecord = input as Record<string, unknown>;
  return {
    ...variables,
    input: {
      ...inputRecord,
      clientMutationId: resolveClientMutationId(
        inputRecord.clientMutationId,
        options,
      ),
    },
  };
}

class DeployAppKind {
  static fragment = graphql`
    fragment srcDeployAppKind on Kind {
      ... on WordpressAppKind {
        __typename
      }
    }
  `;
}

export class DeployAppKindWordPress extends DeployAppKind {
  static fragment = graphql`
    fragment srcDeployAppKindWordPress on Kind {
      ... on WordpressAppKind {
        adminUrl
      }
    }
  `;
  adminUrl?: string;
  constructor(data: any) {
    super();
    const typedData = data as srcDeployAppKindWordPress$data;
    this.adminUrl = typedData.adminUrl;
  }
}

export class AppAlias {
  static fragment = graphql`
    fragment srcAppAlias on AppAlias {
      id
      hostname
      url
      state
      redirectionHttpCode
      redirectsFrom {
        id
      }
      redirectsTo {
        id
      }
      expectedDnsRecords {
        host
        recordType
        value
      }
      firstCheckedAt
      lastCheckedAt
      updatedAt
      createdAt
    }
  `;
  id: string;
  hostname: string;
  url: string;
  state: AppAliasVerificationState;
  redirectionHttpCode: HTTPRedirectType | null | undefined;
  redirectsFromIds: string[];
  redirectsToId: string | undefined;
  expectedDnsRecords: { host: string; recordType: string; value: string }[];
  firstCheckedAt: Date | null;
  lastCheckedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;

  constructor(data: any) {
    const typedData = data as srcAppAlias$data;
    this.id = typedData.id;
    this.hostname = typedData.hostname;
    this.url = typedData.url;
    this.state = typedData.state;
    this.redirectionHttpCode = typedData.redirectionHttpCode;
    this.redirectsFromIds =
      typedData.redirectsFrom
        ?.map((redirect) => redirect?.id!)
        .filter(Boolean) || [];
    this.redirectsToId = typedData.redirectsTo?.id;
    this.expectedDnsRecords =
      typedData.expectedDnsRecords
        ?.filter((record): record is NonNullable<typeof record> => !!record)
        .map((record) => ({
          host: record.host,
          recordType: record.recordType,
          value: record.value,
        })) || [];
    this.firstCheckedAt = parseDate(typedData.firstCheckedAt);
    this.lastCheckedAt = parseDate(typedData.lastCheckedAt);
    this.updatedAt = parseDate(typedData.updatedAt)!;
    this.createdAt = parseDate(typedData.createdAt)!;
  }
}

export class AppVolume {
  static fragment = graphql`
    fragment srcAppVolume on AppVolume {
      id
      volumeId
      mountPath
      maxSizeBytes
      s3Enabled
      s3Url
      explorerUrl
      isAddedByUi
    }
  `;
  id: string;
  volumeId: string;
  mountPath: string;
  maxSizeBytes: number | string;
  s3Enabled: boolean;
  s3Url: string | null;
  explorerUrl: string | null;
  isAddedByUi: boolean;

  constructor(data: any) {
    const typedData = data as srcAppVolume$data;
    this.id = typedData.id;
    this.volumeId = typedData.volumeId;
    this.mountPath = typedData.mountPath;
    this.maxSizeBytes = typedData.maxSizeBytes;
    this.s3Enabled = typedData.s3Enabled;
    this.s3Url = typedData.s3Url ?? null;
    this.explorerUrl = typedData.explorerUrl ?? null;
    this.isAddedByUi = typedData.isAddedByUi;
  }
}

export class DeployApp {
  static fragment = graphql`
    fragment srcDeployAppData on DeployApp {
      id
      willPerishAt
      createdAt
      name
      url
      adminUrl
      activeVersion {
        id
      }
      favicon
      screenshot
      # managed
      # kind {
      #   __typename
      #   ...srcDeployAppKind
      # }
    }
  `;
  id: string;
  willPerishAt: Date | null;
  createdAt: Date;
  name: string;
  url: string;
  adminUrl: string;
  favicon: string | null;
  screenshot: string | null;
  activeVersion: DeployAppVersion | null;

  constructor(
    data: any,
    private client: SdkContext,
  ) {
    const typedData = data as srcDeployAppData$data;
    this.id = typedData.id;
    this.willPerishAt = parseDate(typedData.willPerishAt);
    this.createdAt = parseDate(typedData.createdAt)!;
    this.name = typedData.name;
    this.url = typedData.url;
    this.adminUrl = typedData.adminUrl;
    this.favicon = typedData.favicon ?? null;
    this.screenshot = typedData.screenshot ?? null;
    this.activeVersion = typedData.activeVersion
      ? new DeployAppVersion(typedData.activeVersion as any, this.client, this)
      : null;
  }
}

function stringDictionary(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

export class CronJob {
  static fragment = graphql`
    fragment srcCronJobData on CronJob {
      id
      name
      schedule
      enabled
      kind
      source
      isManaged
      maxRetries
      maxScheduleDrift
      timeout
      createdAt
      updatedAt
      target {
        __typename
        ... on ExecuteCronJobTarget {
          command
          cliArgs
          env
          packageName
        }
        ... on FetchCronJobTarget {
          path
          method
          headers
          body
          expectBodyIncludes
          expectBodyRegex
          expectStatusCodes
        }
      }
    }
  `;
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  kind: CronJobKind;
  source: CronJobSource;
  isManaged: boolean;
  maxRetries: number | null;
  maxScheduleDrift: string | null;
  timeout: string | null;
  createdAt: Date;
  updatedAt: Date;
  target: CronJobTarget;

  constructor(data: any) {
    const typedData = data as srcCronJobData$data;
    this.id = typedData.id;
    this.name = typedData.name;
    this.schedule = typedData.schedule;
    this.enabled = typedData.enabled;
    this.kind = typedData.kind;
    this.source = typedData.source;
    this.isManaged = typedData.isManaged;
    this.maxRetries = typedData.maxRetries ?? null;
    this.maxScheduleDrift = typedData.maxScheduleDrift ?? null;
    this.timeout = typedData.timeout ?? null;
    this.createdAt = parseDate(typedData.createdAt)!;
    this.updatedAt = parseDate(typedData.updatedAt)!;

    if (typedData.target.__typename === "ExecuteCronJobTarget") {
      this.target = {
        kind: "EXECUTE",
        command: formatCronCommand(
          typedData.target.command,
          typedData.target.cliArgs,
        ),
        env: stringDictionary(typedData.target.env),
        packageName: typedData.target.packageName ?? null,
      };
    } else if (typedData.target.__typename === "FetchCronJobTarget") {
      this.target = {
        kind: "FETCH",
        path: typedData.target.path,
        method: typedData.target.method,
        headers: stringDictionary(typedData.target.headers),
        body: typedData.target.body ?? null,
        expectBodyIncludes: typedData.target.expectBodyIncludes ?? null,
        expectBodyRegex: typedData.target.expectBodyRegex ?? null,
        expectStatusCodes: Array.isArray(typedData.target.expectStatusCodes)
          ? typedData.target.expectStatusCodes.filter(
              (status): status is number => typeof status === "number",
            )
          : null,
      };
    } else {
      throw new StackMachineAPIError({
        message: "Unsupported cron job target returned by the API.",
      });
    }
  }
}

export type DeployAppReference = {
  id: string;
};

export type LogStream = "RUNTIME" | "STDERR" | "STDOUT" | "%future added value";

export type Log = {
  datetime: Date;
  instanceId: string;
  message: string;
  stream: LogStream | null | undefined;
  timestamp: number;
};

export class DeployAppVersion {
  static fragment = graphql`
    fragment srcDeployAppVersionData on DeployAppVersion {
      id
      app {
        ...srcDeployAppData
      }
    }
  `;
  id: string;
  app: DeployApp;

  constructor(
    data: any,
    private client: SdkContext,
    app?: DeployApp,
  ) {
    const typedData = data as srcDeployAppVersionData$data;
    this.id = typedData.id;
    if (!app) {
      const appData = this.client._getFragmentData<srcDeployAppData$data>(
        nodeApp,
        typedData.app,
      );
      app = new DeployApp(appData, this.client);
    }
    this.app = app;
  }
}

export type StackMachineOwnerSummary = {
  id: string | null;
  type: string;
  globalId: string;
  globalName: string;
  isPro: boolean;
  name?: string | null;
  displayName?: string | null;
  username?: string | null;
};

function parseOwnerSummary(data: any): StackMachineOwnerSummary {
  return {
    id: data?.id ?? null,
    type: data?.__typename ?? "Owner",
    globalId: data?.globalId,
    globalName: data?.globalName,
    isPro: Boolean(data?.isPro),
    name: data?.name ?? null,
    displayName: data?.displayName ?? null,
    username: data?.username ?? null,
  };
}

export type StackMachineUserSummary = {
  id: string;
  username: string;
  globalName?: string | null;
};

function parseUserSummary(data: any): StackMachineUserSummary {
  return {
    id: data.id,
    username: data.username,
    globalName: data.globalName ?? null,
  };
}

export class AppDatabase {
  static fragment = graphql`
    fragment srcAppDatabaseData on AppDatabase {
      id
      name
      host
      port
      username
      password
      phpmyadminUrl
      dbExplorerUrl
      deletedAt
      createdAt
      updatedAt
      app {
        ...srcDeployAppData
      }
    }
  `;

  id: string;
  name: string;
  host: string;
  port: string;
  username: string;
  password: string | null;
  phpmyadminUrl: string | null;
  dbExplorerUrl: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  app: DeployApp | null;

  constructor(data: any, client?: SdkContext) {
    const typedData = data as srcAppDatabaseData$data;
    this.id = typedData.id;
    this.name = typedData.name;
    this.host = typedData.host;
    this.port = typedData.port;
    this.username = typedData.username;
    this.password = typedData.password ?? null;
    this.phpmyadminUrl = typedData.phpmyadminUrl ?? null;
    this.dbExplorerUrl = typedData.dbExplorerUrl ?? null;
    this.deletedAt = parseDate(typedData.deletedAt);
    this.createdAt = parseDate(typedData.createdAt)!;
    this.updatedAt = parseDate(typedData.updatedAt)!;
    if (typedData.app && client) {
      const appData = client._getFragmentData<srcDeployAppData$data>(
        nodeApp,
        typedData.app,
      );
      this.app = new DeployApp(appData, client);
    } else {
      this.app = null;
    }
  }
}

export class GithubAppInstallation {
  id: string;
  slug: string;
  githubConfigureUrl: string;

  constructor(data: any) {
    this.id = data.id;
    this.slug = data.slug;
    this.githubConfigureUrl = data.githubConfigureUrl;
  }
}

export class GithubInstallationRepository {
  id: string;
  name: string;
  namespace: string;
  repoUrl: string;
  url: string;
  installation: GithubAppInstallation;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.namespace = data.namespace;
    this.repoUrl = data.repoUrl;
    this.url = data.url;
    this.installation = new GithubAppInstallation(data.installation);
  }
}

export class GithubRepoConnection {
  static fragment = graphql`
    fragment srcGithubRepoConnectionData on GithubRepoConnection {
      id
      connectedAt
      deployBranch
      deploymentStatusEvents
      pullRequestComments
      connectedBy {
        id
        username
        globalName
      }
      app {
        ...srcDeployAppData
      }
      githubRepoInstallation {
        id
        name
        namespace
        repoUrl
        url
        installation {
          id
          slug
          githubConfigureUrl
        }
      }
    }
  `;

  id: string;
  app: DeployApp;
  connectedAt: Date;
  connectedBy: StackMachineUserSummary;
  deployBranch: string;
  deploymentStatusEvents: boolean;
  pullRequestComments: boolean;
  githubRepoInstallation: GithubInstallationRepository;

  constructor(data: any, client: SdkContext) {
    const typedData = data as srcGithubRepoConnectionData$data;
    this.id = typedData.id;
    const appData = client._getFragmentData<srcDeployAppData$data>(
      nodeApp,
      typedData.app,
    );
    this.app = new DeployApp(appData, client);
    this.connectedAt = parseDate(typedData.connectedAt)!;
    this.connectedBy = parseUserSummary(typedData.connectedBy);
    this.deployBranch = typedData.deployBranch;
    this.deploymentStatusEvents = typedData.deploymentStatusEvents;
    this.pullRequestComments = typedData.pullRequestComments;
    this.githubRepoInstallation = new GithubInstallationRepository(
      typedData.githubRepoInstallation,
    );
  }
}

export type DNSRecordDomainSummary = {
  id: string;
  name: string;
  slug: string;
};

function dnsRecordKindFromTypename(typename: string): DNSRecordKind {
  switch (typename) {
    case "AAAARecord":
      return "AAAA";
    case "ARecord":
      return "A";
    case "CAARecord":
      return "CAA";
    case "CNAMERecord":
      return "CNAME";
    case "DNAMERecord":
      return "DNAME";
    case "MXRecord":
      return "MX";
    case "NSRecord":
      return "NS";
    case "PTRRecord":
      return "PTR";
    case "SOARecord":
      return "SOA";
    case "SRVRecord":
      return "SRV";
    case "SSHFPRecord":
      return "SSHFP";
    case "TXTRecord":
      return "TXT";
    default:
      return "%future added value";
  }
}

function isDNSRecordTypename(typename: string | null | undefined): boolean {
  return (
    typename === "AAAARecord" ||
    typename === "ARecord" ||
    typename === "CAARecord" ||
    typename === "CNAMERecord" ||
    typename === "DNAMERecord" ||
    typename === "MXRecord" ||
    typename === "NSRecord" ||
    typename === "PTRRecord" ||
    typename === "SOARecord" ||
    typename === "SRVRecord" ||
    typename === "SSHFPRecord" ||
    typename === "TXTRecord"
  );
}

function dnsRecordValueFromData(data: any): string {
  return (
    data.value ??
    data.address ??
    data.cName ??
    data.dName ??
    data.exchange ??
    data.nsdname ??
    data.ptrdname ??
    data.target ??
    data.data ??
    data.fingerprint ??
    data.text
  );
}

export class DNSRecord {
  static fragment = graphql`
    fragment srcDNSRecordData on DNSRecord {
      __typename
      ... on Node {
        id
      }
      ... on DNSRecordInterface {
        createdAt
        deletedAt
        dnsClass
        domain {
          id
          name
          slug
        }
        name
        text
        ttl
        updatedAt
      }
      ... on AAAARecord {
        address
      }
      ... on ARecord {
        address
      }
      ... on CAARecord {
        flags
        tag
        value
      }
      ... on CNAMERecord {
        cName
      }
      ... on DNAMERecord {
        dName
      }
      ... on MXRecord {
        exchange
        preference
      }
      ... on NSRecord {
        nsdname
      }
      ... on PTRRecord {
        ptrdname
      }
      ... on SOARecord {
        expire
        minimum
        mname
        refresh
        retry
        rname
        serial
      }
      ... on SRVRecord {
        port
        priority
        protocol
        service
        target
        weight
      }
      ... on SSHFPRecord {
        algorithm
        fingerprint
        type
      }
      ... on TXTRecord {
        data
      }
    }
  `;

  id: string;
  type: string;
  kind: DNSRecordKind;
  domain: DNSRecordDomainSummary;
  name: string;
  text: string;
  value: string;
  ttl: number;
  dnsClass: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  address?: string;
  cName?: string;
  dName?: string;
  flags?: number;
  tag?: string;
  exchange?: string;
  preference?: number;
  nsdname?: string;
  ptrdname?: string;
  expire?: number | string;
  minimum?: number | string;
  mname?: string;
  refresh?: number | string;
  retry?: number | string;
  rname?: string;
  serial?: number | string;
  port?: number;
  priority?: number;
  protocol?: string;
  service?: string;
  target?: string;
  weight?: number;
  algorithm?: string | number;
  fingerprint?: string;
  sshfpType?: string | number;
  data?: string;

  constructor(data: any) {
    const typedData = data as srcDNSRecordData$data;
    if (
      typedData.id == null ||
      typedData.domain == null ||
      typedData.name == null ||
      typedData.text == null ||
      typedData.ttl == null ||
      typedData.createdAt == null ||
      typedData.updatedAt == null
    ) {
      throw new StackMachineAPIError({
        message: "DNS record response is missing required fields.",
        operationName: "srcDNSRecordData",
      });
    }

    this.id = typedData.id;
    this.type = typedData.__typename;
    this.kind = dnsRecordKindFromTypename(typedData.__typename);
    this.domain = {
      id: typedData.domain.id,
      name: typedData.domain.name,
      slug: typedData.domain.slug,
    };
    this.name = typedData.name;
    this.text = typedData.text;
    this.value = dnsRecordValueFromData(typedData);
    this.ttl = typedData.ttl;
    this.dnsClass = typedData.dnsClass ?? null;
    this.deletedAt = parseDate(typedData.deletedAt);
    this.createdAt = parseDate(typedData.createdAt)!;
    this.updatedAt = parseDate(typedData.updatedAt)!;
    this.address = typedData.address;
    this.cName = typedData.cName;
    this.dName = typedData.dName;
    this.flags = typedData.flags;
    this.tag = typedData.tag;
    this.exchange = typedData.exchange;
    this.preference = typedData.preference;
    this.nsdname = typedData.nsdname;
    this.ptrdname = typedData.ptrdname;
    this.expire = typedData.expire;
    this.minimum = typedData.minimum;
    this.mname = typedData.mname;
    this.refresh = typedData.refresh;
    this.retry = typedData.retry;
    this.rname = typedData.rname;
    this.serial = typedData.serial;
    this.port = typedData.port;
    this.priority = typedData.priority;
    this.protocol = typedData.protocol;
    this.service = typedData.service;
    this.target = typedData.target;
    this.weight = typedData.weight;
    this.algorithm = typedData.algorithm;
    this.fingerprint = typedData.fingerprint;
    this.sshfpType = typedData.type;
    this.data = typedData.data;
  }
}

export class DNSDomain {
  static fragment = graphql`
    fragment srcDNSDomainData on DNSDomain {
      id
      name
      slug
      zoneFile
      delegationStatus
      nameservers
      lastCheckedAt
      verifiedAt
      deletedAt
      createdAt
      updatedAt
      owner {
        __typename
        globalId
        globalName
        isPro
        ... on Namespace {
          id
          name
          displayName
        }
        ... on User {
          id
          username
        }
      }
    }
  `;

  id: string;
  name: string;
  slug: string;
  zoneFile: string;
  delegationStatus: string | null;
  nameservers: string[];
  owner: StackMachineOwnerSummary;
  records: DNSRecord[];
  deletedAt: Date | null;
  lastCheckedAt: Date | null;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    const typedData = data as srcDNSDomainData$data & {
      records?: srcDNSRecordData$data[] | null;
    };
    this.id = typedData.id;
    this.name = typedData.name;
    this.slug = typedData.slug;
    this.zoneFile = typedData.zoneFile;
    this.delegationStatus = typedData.delegationStatus ?? null;
    this.nameservers = (typedData.nameservers ?? []).filter(Boolean);
    this.owner = parseOwnerSummary(typedData.owner);
    this.records = (data.records ?? [])
      .filter(Boolean)
      .map((record: any) => new DNSRecord(record));
    this.deletedAt = parseDate(typedData.deletedAt);
    this.lastCheckedAt = parseDate(typedData.lastCheckedAt);
    this.verifiedAt = parseDate(typedData.verifiedAt);
    this.createdAt = parseDate(typedData.createdAt)!;
    this.updatedAt = parseDate(typedData.updatedAt)!;
  }
}

export class EmailMessage {
  static fragment = graphql`
    fragment srcEmailMessageData on EmailMessage {
      id
      app {
        id
      }
      bcc
      cc
      createdAt
      direction
      from
      htmlBody
      owner {
        __typename
        globalId
        globalName
        isPro
        ... on Namespace {
          id
          name
          displayName
        }
        ... on User {
          id
          username
        }
      }
      receivedAt
      replyTo
      sentAt
      status
      subject
      textBody
      to
    }
  `;

  id: string;
  app: DeployAppReference | null;
  appId: string | null;
  owner: StackMachineOwnerSummary | null;
  direction: EmailMessageDirection;
  status: EmailMessageStatus;
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  replyTo: string | null;
  subject: string;
  textBody: string | null;
  htmlBody: string | null;
  receivedAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;

  constructor(data: any) {
    const typedData = data as srcEmailMessageData$data;
    this.id = data.id;
    this.app = typedData.app ? { id: typedData.app.id } : null;
    this.appId = typedData.app?.id ?? null;
    this.owner = typedData.owner ? parseOwnerSummary(typedData.owner) : null;
    this.direction = typedData.direction;
    this.status = typedData.status;
    this.from = typedData.from;
    this.to = (typedData.to ?? []).filter(Boolean);
    this.cc = (typedData.cc ?? []).filter(Boolean);
    this.bcc = (typedData.bcc ?? []).filter(Boolean);
    this.replyTo = typedData.replyTo ?? null;
    this.subject = typedData.subject;
    this.textBody = typedData.textBody ?? null;
    this.htmlBody = typedData.htmlBody ?? null;
    this.receivedAt = parseDate(typedData.receivedAt);
    this.sentAt = parseDate(typedData.sentAt);
    this.createdAt = parseDate(typedData.createdAt)!;
  }
}

export type SshAuthenticationMethod =
  | "PASSWORD"
  | "PUBLIC_KEY"
  | "%future added value";

export class SshAuthorizedKey {
  id: string;
  name: string | null;
  publicKey: string;
  createdAt: Date;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name || null;
    this.publicKey = data.publicKey;
    this.createdAt = parseDate(data.createdAt)!;
  }
}

export class SshUser {
  id: string;
  username: string;
  port: number;
  serverHost: string;
  sftpRootFolder: string;
  authenticationMethods: SshAuthenticationMethod[] | null;
  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.port = data.port;
    this.serverHost = data.serverHost;
    this.sftpRootFolder = data.sftpRootFolder;
    this.authenticationMethods = data.authenticationMethods
      ? data.authenticationMethods.map(
          (method: SshAuthenticationMethod) => method,
        )
      : null;
  }
}

export class AppSshServer {
  id: string;
  enabled: boolean;
  constructor(data: any) {
    this.id = data.id;
    this.enabled = data.enabled;
  }
}

export type AutoBuildDeployAppLogKind =
  | "BUILD_STATUS"
  | "COMPLETE"
  | "DEPLOY_STATUS"
  | "FAILED"
  | "FETCHING_PLAN_STATUS"
  | "LOG"
  | "PREPARING_TO_DEPLOY_STATUS"
  | "%future added value";

export type AutoBuildProgressData = {
  kind: AutoBuildDeployAppLogKind;
  message: string | undefined | null;
  datetime: Date;
  stream: LogStream | undefined | null;
};

export type DeploymentProgress = AutoBuildProgressData;
export type DeploymentProgressKind = AutoBuildDeployAppLogKind;
export type DeploymentStatus =
  | "CANCELLED"
  | "FAILED"
  | "INTERNAL_ERROR"
  | "QUEUED"
  | "RUNNING"
  | "SUCCESS"
  | "TIMEOUT"
  | "WORKING"
  | "%future added value";

export type DeploymentWaitOptions = {
  onProgress?: (entry: DeploymentProgress) => void;
};

export type Viewer = {
  username: string;
};

function isFailedDeploymentStatus(status: DeploymentStatus | undefined) {
  return (
    status === "CANCELLED" ||
    status === "FAILED" ||
    status === "INTERNAL_ERROR" ||
    status === "TIMEOUT"
  );
}

function isCompleteDeploymentStatus(status: DeploymentStatus | undefined) {
  return status === "SUCCESS";
}

export class Deployment {
  buildId: string;
  status?: DeploymentStatus;
  appVersion: DeployAppVersion | null = null;
  subscription: { dispose: () => void } | null = null;
  pendingLogs: DeploymentProgress[] = [];
  onProgress: ((data: DeploymentProgress) => void) | null = null;
  private waitPromise: Promise<DeployAppVersion> | null = null;

  constructor(
    buildId: string,
    private client: SdkContext,
    initial?: {
      status?: DeploymentStatus;
      appVersion?: DeployAppVersion | null;
    },
    private defaultRequestOptions?: StackMachineRequestOptions,
  ) {
    this.buildId = buildId;
    this.status = initial?.status;
    this.appVersion = initial?.appVersion ?? null;
  }

  private setProgressCallback(callback: (data: DeploymentProgress) => void) {
    if (this.pendingLogs.length > 0) {
      for (const data of this.pendingLogs) {
        callback(data);
      }
      this.pendingLogs = [];
    }
    this.onProgress = callback;
  }

  private dispatchProgress(progress: DeploymentProgress) {
    if (this.onProgress) {
      this.onProgress(progress);
    } else {
      this.pendingLogs.push(progress);
    }
  }

  private createMissingAppVersionError() {
    return new StackMachineAPIError({
      message:
        "Error when building the app: build finished without deployed app.",
      operationName: "srcAutobuildSubscription",
    });
  }

  private createTerminalStatusError() {
    return new StackMachineAPIError({
      message: `The app build ended with status ${this.status}.`,
      operationName: "srcAutobuildSubscription",
    });
  }

  private startWait(
    requestOptions?: StackMachineRequestOptions,
  ): Promise<DeployAppVersion> {
    if (this.appVersion && isCompleteDeploymentStatus(this.status)) {
      return Promise.resolve(this.appVersion);
    }
    if (isFailedDeploymentStatus(this.status)) {
      return Promise.reject(this.createTerminalStatusError());
    }
    if (this.waitPromise) {
      return this.waitPromise;
    }

    this.waitPromise = new Promise((resolve, reject) => {
      const cleanup = () => {
        this.onProgress = null;
        this.subscription?.dispose();
        this.subscription = null;
      };
      const settleResolve = (value: DeployAppVersion) => {
        cleanup();
        resolve(value);
      };
      const settleReject = (error: StackMachineError) => {
        cleanup();
        reject(error);
      };

      this.subscription =
        this.client._requestSubscription<srcAutobuildSubscription>(
          graphql`
            subscription srcAutobuildSubscription($buildId: UUID!) {
              autobuildDeployment(buildId: $buildId) {
                appVersion {
                  ...srcDeployAppVersionData
                }
                kind
                datetime
                stream
                message
              }
            }
          `,
          {
            buildId: this.buildId,
          },
          {
            onNext: (data) => {
              if (!data?.autobuildDeployment) {
                return;
              }
              const { kind, message, appVersion, datetime, stream } =
                data.autobuildDeployment;

              if (kind === "FAILED") {
                this.status = "FAILED";
                settleReject(
                  new StackMachineAPIError({
                    message: message || "The app build failed.",
                    operationName: "srcAutobuildSubscription",
                  }),
                );
                return;
              }
              if (kind === "COMPLETE") {
                this.status = "SUCCESS";
                if (appVersion !== undefined && appVersion !== null) {
                  const appVersionData =
                    this.client._getFragmentData<srcDeployAppVersionData$data>(
                      nodeAppVersion,
                      appVersion,
                    );
                  this.appVersion = new DeployAppVersion(
                    appVersionData,
                    this.client,
                  );
                  settleResolve(this.appVersion);
                  return;
                }
                settleReject(this.createMissingAppVersionError());
                return;
              }

              const progress = {
                kind,
                message,
                datetime: parseDate(datetime)!,
                stream,
              };
              this.dispatchProgress(progress);
            },
            onCompleted: () => {
              if (this.appVersion) {
                settleResolve(this.appVersion);
              } else {
                settleReject(this.createMissingAppVersionError());
              }
            },
            onError: (error) => {
              settleReject(
                stackMachineErrorFromUnknown(error, "srcAutobuildSubscription"),
              );
            },
          },
          requestOptions ?? this.defaultRequestOptions,
        );
    });
    return this.waitPromise;
  }

  async wait(
    options?: DeploymentWaitOptions,
    requestOptions?: StackMachineRequestOptions,
  ): Promise<DeployAppVersion> {
    if (options?.onProgress) {
      this.setProgressCallback(options.onProgress);
    }
    return this.startWait(requestOptions);
  }

  /** @deprecated Use `wait({ onProgress })` instead. */
  subscribeToProgress(callback: (data: DeploymentProgress) => void) {
    this.setProgressCallback(callback);
    this.startWait().catch(() => {});
  }

  /** @deprecated Use `wait()` instead. */
  async finish(): Promise<DeployAppVersion> {
    return this.startWait();
  }
}

/** @deprecated Use `Deployment` instead. */
export { Deployment as AutobuildApp };

export class DeploymentsResource {
  constructor(
    private client: SdkContext,
    private filesResource: FilesResource,
  ) {}

  private deploymentFromStatus(
    status: NonNullable<
      srcGetDeploymentStatusQuery["response"]["autobuildDeploymentStatus"]
    >,
    options?: StackMachineRequestOptions,
  ): Deployment {
    const appVersionData = status.appVersion
      ? this.client._getFragmentData<srcDeployAppVersionData$data>(
          nodeAppVersion,
          status.appVersion,
        )
      : null;
    const appVersion = appVersionData
      ? new DeployAppVersion(appVersionData, this.client)
      : null;

    return new Deployment(
      status.buildId,
      this.client,
      {
        status: status.status,
        appVersion,
      },
      options,
    );
  }

  private async retrieveOrNull(
    buildId: string,
    options?: StackMachineRequestOptions,
  ): Promise<Deployment | null> {
    const query = await this.client._query<srcGetDeploymentStatusQuery>(
      graphql`
        query srcGetDeploymentStatusQuery($buildId: UUID!) {
          autobuildDeploymentStatus(buildId: $buildId) {
            buildId
            status
            appVersion {
              ...srcDeployAppVersionData
            }
          }
        }
      `,
      { buildId },
      options,
    );
    const status = query?.autobuildDeploymentStatus;
    return status ? this.deploymentFromStatus(status, options) : null;
  }

  async create(
    input: DeploymentCreateInput,
    options?: DeploymentCreateOptions,
  ): Promise<Deployment> {
    const { chunkSize, onUploadProgress, ...requestOptions } = options ?? {};
    const { files, ...deploymentInput } = input;
    let resolvedInput: DeployAppAutobuildInput = deploymentInput;

    if (files) {
      if (deploymentInput.uploadUrl) {
        throw new StackMachineValidationError({
          message:
            "`files` cannot be passed together with `uploadUrl`; pass one deployment source.",
          code: "invalid_deployment_source",
          param: "files",
        });
      }
      const archive = await createZip(files);
      const uploadUrl = await this.filesResource.upload(archive, {
        ...requestOptions,
        chunkSize,
        onProgress: onUploadProgress,
      });
      resolvedInput = {
        ...deploymentInput,
        uploadUrl,
      };
    }

    const response = await this.client._mutation<srcAutobuildMutation>(
      graphql`
        mutation srcAutobuildMutation($input: DeployViaAutobuildInput!) {
          deployViaAutobuild(input: $input) {
            success
            buildId
          }
        }
      `,
      {
        input: resolvedInput,
      },
      requestOptions,
    );
    const payload = requiredPayload(
      response.deployViaAutobuild,
      "The app could not be built.",
      "srcAutobuildMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "The app could not be built.",
        operationName: "srcAutobuildMutation",
      });
    }
    return new Deployment(
      payload.buildId,
      this.client,
      undefined,
      requestOptions,
    );
  }

  async retrieve(
    buildId: string,
    options?: StackMachineRequestOptions,
  ): Promise<Deployment> {
    const deployment = await this.retrieveOrNull(buildId, options);
    if (!deployment) {
      throw resourceMissingError(
        "deployment",
        buildId,
        "srcGetDeploymentStatusQuery",
        "buildId",
      );
    }

    return deployment;
  }

  async retrieveMany(
    buildIds: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(Deployment | null)[]> {
    return Promise.all(
      buildIds.map((buildId) => this.retrieveOrNull(buildId, options)),
    );
  }
}

export class AppsDomainsResource {
  constructor(private client: SdkContext) {}

  async retrieveMany(
    ids: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(AppAlias | null)[]> {
    if (ids.length === 0) {
      return [];
    }

    const query = await this.client._query<srcGetAppAliasesQuery>(
      graphql`
        query srcGetAppAliasesQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            __typename
            ...srcAppAlias
          }
        }
      `,
      {
        ids,
      },
      options,
    );
    const nodes = query?.nodes ?? [];
    return ids.map((_, index) => {
      const node = nodes[index] as any;
      if (!node || node.__typename !== "AppAlias") {
        return null;
      }
      return new AppAlias(
        this.client._getFragmentData<srcAppAlias$data>(nodeAppAlias, node),
      );
    });
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<AppAlias> {
    const aliases = await this.retrieveMany([id], options);
    const alias = aliases[0];
    if (!alias) {
      throw resourceMissingError("domain", id, "srcGetAppAliasesQuery");
    }
    return alias;
  }

  list(
    input: AppsDomainsListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<AppAlias> {
    return createStackMachineListPromise<AppAlias, AppsDomainsListInput>({
      params: input,
      options,
      url: "/v1/apps/domains",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcListAppDomainsQuery(
              $appId: ID!
              $first: Int
              $after: String
              $last: Int
              $before: String
              $sortBy: AppAliasSortBy!
            ) {
              node(id: $appId) {
                ... on DeployApp {
                  domains(
                    first: $first
                    after: $after
                    last: $last
                    before: $before
                    sortBy: $sortBy
                  ) {
                    edges {
                      cursor
                      node {
                        ...srcAppAlias
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      endCursor
                      startCursor
                    }
                    totalCount
                  }
                }
              }
            }
          `,
          {
            appId: params.app,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
            sortBy: params.sortBy ?? "NEWEST",
          },
          requestOptions,
        );

        return connectionToListPageData(
          query?.node?.domains,
          (node: any) =>
            new AppAlias(
              this.client._getFragmentData<srcAppAlias$data>(
                nodeAppAlias,
                node,
              ),
            ),
        );
      },
    });
  }

  async create(
    input: AppsDomainsCreateInput,
    options?: StackMachineRequestOptions,
  ): Promise<AppAlias> {
    const response = await this.client._mutation<srcUpsertAppDomainMutation>(
      graphql`
        mutation srcUpsertAppDomainMutation($input: UpsertAppDomainInput!) {
          upsertAppDomain(input: $input) {
            success
            domains {
              ...srcAppAlias
            }
          }
        }
      `,
      {
        input: {
          appId: input.app,
          name: input.hostname,
          isDefault: input.isDefault,
          wait: false,
        },
      },
      options,
    );

    const payload = requiredPayload(
      response.upsertAppDomain,
      "Failed to create domain, mutation failed.",
      "srcUpsertAppDomainMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to create domain, mutation was not successful.",
        operationName: "srcUpsertAppDomainMutation",
      });
    }

    const domains = requiredPayload(
      payload.domains,
      "Failed to create domain, no domains returned.",
      "srcUpsertAppDomainMutation",
    );
    const addedDomain = domains
      .filter((domain): domain is NonNullable<typeof domain> => !!domain)
      .map(
        (domain) =>
          new AppAlias(
            this.client._getFragmentData<srcAppAlias$data>(
              nodeAppAlias,
              domain,
            ),
          ),
      )
      .find((domain) =>
        domain.expectedDnsRecords.some(
          (record) => record.host === input.hostname,
        ),
      );

    return requiredPayload(
      addedDomain,
      "Failed to create domain, domain not found in returned domains.",
      "srcUpsertAppDomainMutation",
    );
  }

  async verify(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<boolean> {
    const response = await this.client._mutation<srcVerifyAppDomainMutation>(
      graphql`
        mutation srcVerifyAppDomainMutation($input: VerifyAppDomainInput!) {
          verifyAppDomain(input: $input) {
            verified
          }
        }
      `,
      {
        input: {
          domainId: id,
        },
      },
      options,
    );
    return requiredPayload(
      response.verifyAppDomain,
      "Failed to verify domain, mutation was not successful.",
      "srcVerifyAppDomainMutation",
    ).verified;
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<srcDeleteAppDomainMutation>(
      graphql`
        mutation srcDeleteAppDomainMutation($input: DeleteAppDomainInput!) {
          deleteAppDomain(input: $input) {
            success
          }
        }
      `,
      {
        input: {
          id,
        },
      },
      options,
    );
    if (!response.deleteAppDomain?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete domain, mutation was not successful.",
        operationName: "srcDeleteAppDomainMutation",
      });
    }
  }
}

export class AppsVolumesResource {
  constructor(private client: SdkContext) {}

  list(
    input: AppsVolumesListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<AppVolume> {
    return createStackMachineListPromise<AppVolume, AppsVolumesListInput>({
      params: input,
      options,
      url: "/v1/apps/volumes",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcListAppVolumesQuery(
              $appId: ID!
              $first: Int
              $after: String
              $last: Int
              $before: String
            ) {
              node(id: $appId) {
                ... on DeployApp {
                  volumes(
                    first: $first
                    after: $after
                    last: $last
                    before: $before
                  ) {
                    edges {
                      cursor
                      node {
                        ...srcAppVolume
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      endCursor
                      startCursor
                    }
                    totalCount
                  }
                }
              }
            }
          `,
          {
            appId: params.app,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
          },
          requestOptions,
        );

        return connectionToListPageData(
          query?.node?.volumes,
          (node: any) =>
            new AppVolume(
              this.client._getFragmentData<srcAppVolume$data>(
                nodeAppVolume,
                node,
              ),
            ),
        );
      },
    });
  }

  async create(
    input: AppsVolumesCreateInput,
    options?: StackMachineRequestOptions,
  ): Promise<AppVolume> {
    const response = await this.client._mutation<srcCreateAppVolumeMutation>(
      graphql`
        mutation srcCreateAppVolumeMutation($input: CreateAppVolumeInput!) {
          createAppVolume(input: $input) {
            success
            volume {
              ...srcAppVolume
            }
          }
        }
      `,
      {
        input: {
          appId: input.app,
          mountPath: input.mountPath,
          maxSizeBytes: input.maxSizeBytes,
        },
      },
      options,
    );
    const payload = requiredPayload(
      response.createAppVolume,
      "Failed to create volume, mutation failed.",
      "srcCreateAppVolumeMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to create volume, mutation was not successful.",
        operationName: "srcCreateAppVolumeMutation",
      });
    }
    const volume = requiredPayload(
      payload.volume,
      "Failed to create volume, no volume returned.",
      "srcCreateAppVolumeMutation",
    );
    return new AppVolume(
      this.client._getFragmentData<srcAppVolume$data>(nodeAppVolume, volume),
    );
  }

  async update(
    id: string,
    input: AppsVolumesUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<AppVolume> {
    const response = await this.client._mutation<srcUpdateVolumeMutation>(
      graphql`
        mutation srcUpdateVolumeMutation($input: UpdateVolumeInput!) {
          updateVolume(input: $input) {
            success
            volume {
              ...srcAppVolume
            }
          }
        }
      `,
      {
        input: {
          id,
          mountPath: input.mountPath,
          maxSizeBytes: input.maxSizeBytes,
          redeployApp: input.redeployApp,
          s3Enabled: input.s3Enabled,
        },
      },
      options,
    );
    const payload = requiredPayload(
      response.updateVolume,
      "Failed to update volume, mutation failed.",
      "srcUpdateVolumeMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to update volume, mutation was not successful.",
        operationName: "srcUpdateVolumeMutation",
      });
    }
    const volume = requiredPayload(
      payload.volume,
      "Failed to update volume, no volume returned.",
      "srcUpdateVolumeMutation",
    );
    return new AppVolume(
      this.client._getFragmentData<srcAppVolume$data>(nodeAppVolume, volume),
    );
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<srcDeleteAppVolumeMutation>(
      graphql`
        mutation srcDeleteAppVolumeMutation($input: DeleteAppVolumeInput!) {
          deleteAppVolume(input: $input) {
            success
          }
        }
      `,
      {
        input: {
          id,
        },
      },
      options,
    );
    if (!response.deleteAppVolume?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete volume, mutation was not successful.",
        operationName: "srcDeleteAppVolumeMutation",
      });
    }
  }
}

export class AppsDatabasesResource {
  constructor(private client: SdkContext) {}

  private databaseFromNode(node: any): AppDatabase {
    return new AppDatabase(
      this.client._getFragmentData<srcAppDatabaseData$data>(
        nodeAppDatabase,
        node,
      ),
      this.client,
    );
  }

  list(
    input: AppsDatabasesListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<AppDatabase> {
    return createStackMachineListPromise<AppDatabase, AppsDatabasesListInput>({
      params: input,
      options,
      url: "/v1/apps/databases",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcListAppDatabasesQuery(
              $appId: ID!
              $first: Int
              $after: String
              $last: Int
              $before: String
            ) {
              node(id: $appId) {
                ... on DeployApp {
                  databases(
                    first: $first
                    after: $after
                    last: $last
                    before: $before
                  ) {
                    edges {
                      cursor
                      node {
                        ...srcAppDatabaseData
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      endCursor
                      startCursor
                    }
                    totalCount
                  }
                }
              }
            }
          `,
          {
            appId: params.app,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
          },
          requestOptions,
        );

        return connectionToListPageData(query?.node?.databases, (node: any) =>
          this.databaseFromNode(node),
        );
      },
    });
  }

  async create(
    input: AppsDatabasesCreateInput,
    options?: StackMachineRequestOptions,
  ): Promise<AppDatabaseWithPassword> {
    // Prefer the engine-aware mutation. The no-engine branch remains for legacy callers.
    if (input.dbEngine) {
      const response = await this.client._mutation<any>(
        graphql`
          mutation srcCreateDatabaseAndLinkToAppMutation(
            $input: CreateAppDatabaseInput!
          ) {
            createDatabaseAndLinkToApp(input: $input) {
              database {
                ...srcAppDatabaseData
              }
              password
            }
          }
        `,
        {
          input: {
            appId: input.app,
            dbEngine: input.dbEngine,
            name: input.name,
          },
        },
        options,
      );
      const payload = requiredPayload(
        response.createDatabaseAndLinkToApp,
        "Failed to create database, mutation failed.",
        "srcCreateDatabaseAndLinkToAppMutation",
      );
      const database = requiredPayload(
        payload.database,
        "Failed to create database, no database returned.",
        "srcCreateDatabaseAndLinkToAppMutation",
      );
      return {
        database: this.databaseFromNode(database),
        password: payload.password,
      };
    }

    const response = await this.client._mutation<any>(
      graphql`
        mutation srcCreateAppDatabaseMutation($input: CreateAppDBInput!) {
          createAppDb(input: $input) {
            database {
              ...srcAppDatabaseData
            }
            password
          }
        }
      `,
      {
        input: {
          id: input.app,
          name: input.name,
        },
      },
      options,
    );

    const payload = requiredPayload(
      response.createAppDb,
      "Failed to create database, mutation failed.",
      "srcCreateAppDatabaseMutation",
    );
    const database = requiredPayload(
      payload.database,
      "Failed to create database, no database returned.",
      "srcCreateAppDatabaseMutation",
    );
    return {
      database: this.databaseFromNode(database),
      password: payload.password,
    };
  }

  async rotateCredentials(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<AppDatabaseWithPassword> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcRotateAppDatabaseCredentialsMutation(
          $input: RotateCredentialsForAppDBInput!
        ) {
          rotateCredentialsForAppDb(input: $input) {
            database {
              ...srcAppDatabaseData
            }
            password
          }
        }
      `,
      {
        input: { id },
      },
      options,
    );

    const payload = requiredPayload(
      response.rotateCredentialsForAppDb,
      "Failed to rotate database credentials, mutation failed.",
      "srcRotateAppDatabaseCredentialsMutation",
    );
    const database = requiredPayload(
      payload.database,
      "Failed to rotate database credentials, no database returned.",
      "srcRotateAppDatabaseCredentialsMutation",
    );
    return {
      database: this.databaseFromNode(database),
      password: payload.password,
    };
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcDeleteAppDatabaseMutation($input: DeleteAppDBInput!) {
          deleteAppDb(input: $input) {
            success
          }
        }
      `,
      {
        input: { id },
      },
      options,
    );
    if (!response.deleteAppDb?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete database, mutation was not successful.",
        operationName: "srcDeleteAppDatabaseMutation",
      });
    }
  }
}

export class AppsGitResource {
  constructor(private client: SdkContext) {}

  private connectionFromNode(node: any): GithubRepoConnection {
    return new GithubRepoConnection(
      this.client._getFragmentData<srcGithubRepoConnectionData$data>(
        nodeGithubRepoConnection,
        node,
      ),
      this.client,
    );
  }

  async retrieve(
    appId: string,
    options?: StackMachineRequestOptions,
  ): Promise<GithubRepoConnection> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetAppGitConnectionQuery($id: ID!) {
          node(id: $id) {
            __typename
            ... on DeployApp {
              githubRepoConnection {
                ...srcGithubRepoConnectionData
              }
            }
          }
        }
      `,
      { id: appId },
      options,
    );
    const connection = query?.node?.githubRepoConnection;
    if (!connection) {
      throw resourceMissingError(
        "git connection",
        appId,
        "srcGetAppGitConnectionQuery",
        "app",
      );
    }
    return this.connectionFromNode(connection);
  }

  async retrieveMany(
    appIds: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(GithubRepoConnection | null)[]> {
    if (appIds.length === 0) {
      return [];
    }

    const query = await this.client._query<any>(
      graphql`
        query srcGetAppGitConnectionsQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            __typename
            ... on DeployApp {
              githubRepoConnection {
                ...srcGithubRepoConnectionData
              }
            }
          }
        }
      `,
      { ids: appIds },
      options,
    );
    const nodes = query?.nodes ?? [];
    return appIds.map((_, index) => {
      const node = nodes[index];
      return node?.__typename === "DeployApp" && node.githubRepoConnection
        ? this.connectionFromNode(node.githubRepoConnection)
        : null;
    });
  }

  async connect(
    input: AppsGitConnectInput,
    options?: StackMachineRequestOptions,
  ): Promise<GithubRepoConnection> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcConnectGithubRepoToAppMutation(
          $input: ConnectGithubRepoToAppInput!
        ) {
          connectGithubRepoToApp(input: $input) {
            success
            githubRepoConnection {
              ...srcGithubRepoConnectionData
            }
          }
        }
      `,
      {
        input: {
          appId: input.app,
          installationRepoId: input.installationRepoId,
          deployBranch: input.deployBranch,
        },
      },
      options,
    );
    const payload = requiredPayload(
      response.connectGithubRepoToApp,
      "Failed to connect GitHub repo to app, mutation failed.",
      "srcConnectGithubRepoToAppMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message:
          "Failed to connect GitHub repo to app, mutation was not successful.",
        operationName: "srcConnectGithubRepoToAppMutation",
      });
    }
    const connection = requiredPayload(
      payload.githubRepoConnection,
      "Failed to connect GitHub repo to app, no connection returned.",
      "srcConnectGithubRepoToAppMutation",
    );
    return this.connectionFromNode(connection);
  }

  async update(
    appOrConnectionId: string,
    input: AppsGitUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<GithubRepoConnection> {
    try {
      return await this.updateWithId(
        "appId",
        appOrConnectionId,
        input,
        options,
      );
    } catch (error) {
      if (!shouldRetryGitUpdateWithConnectionId(error)) {
        throw error;
      }
      return this.updateWithId(
        "connectionId",
        appOrConnectionId,
        input,
        options,
      );
    }
  }

  private async updateWithId(
    idKey: "appId" | "connectionId",
    id: string,
    input: AppsGitUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<GithubRepoConnection> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcUpdateGithubRepoConnectionMutation(
          $input: UpdateGithubRepoAppConnectionInput!
        ) {
          updateGithubRepoConnection(input: $input) {
            success
            githubRepoConnection {
              ...srcGithubRepoConnectionData
            }
          }
        }
      `,
      {
        input: {
          [idKey]: id,
          deployBranch: input.deployBranch,
          deploymentStatusEvents: input.deploymentStatusEvents,
          pullRequestComments: input.pullRequestComments,
        },
      },
      options,
    );
    const payload = requiredPayload(
      response.updateGithubRepoConnection,
      "Failed to update GitHub repo connection, mutation failed.",
      "srcUpdateGithubRepoConnectionMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message:
          "Failed to update GitHub repo connection, mutation was not successful.",
        operationName: "srcUpdateGithubRepoConnectionMutation",
      });
    }
    const connection = requiredPayload(
      payload.githubRepoConnection,
      "Failed to update GitHub repo connection, no connection returned.",
      "srcUpdateGithubRepoConnectionMutation",
    );
    return this.connectionFromNode(connection);
  }

  async del(
    appId: string,
    options?: StackMachineRequestOptions,
  ): Promise<void> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcDisconnectGithubRepoFromAppMutation(
          $input: DisconnectGithubRepoFromAppInput!
        ) {
          disconnectGithubRepoFromApp(input: $input) {
            success
          }
        }
      `,
      {
        input: { appId },
      },
      options,
    );
    if (!response.disconnectGithubRepoFromApp?.success) {
      throw new StackMachineAPIError({
        message:
          "Failed to disconnect GitHub repo from app, mutation was not successful.",
        operationName: "srcDisconnectGithubRepoFromAppMutation",
      });
    }
  }
}

export class AppsVersionsLogsResource {
  constructor(private client: SdkContext) {}

  list(
    input: AppsVersionsLogsListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<Log> {
    return createStackMachineListPromise<Log, AppsVersionsLogsListInput>({
      params: input,
      options,
      url: "/v1/apps/versions/logs",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<srcGetAppLogsQuery>(
          graphql`
            query srcGetAppLogsQuery(
              $appId: ID!
              $since: DateTime
              $until: DateTime
              $instanceId: String
              $requestId: String
              $streams: [LogStream]
              $textSearch: String
              $first: Int
              $after: String
              $last: Int
              $before: String
            ) {
              node(id: $appId) {
                ... on DeployAppVersion {
                  logs(
                    startingFromISO: $since
                    end: $until
                    instanceId: $instanceId
                    requestId: $requestId
                    streams: $streams
                    textSearch: $textSearch
                    first: $first
                    after: $after
                    last: $last
                    before: $before
                  ) {
                    edges {
                      cursor
                      node {
                        datetime
                        instanceId
                        message
                        stream
                        timestamp
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      endCursor
                      startCursor
                    }
                  }
                }
              }
            }
          `,
          {
            appId: params.version,
            since: params.since?.toISOString(),
            until: params.until?.toISOString(),
            instanceId: params.instanceId,
            requestId: params.requestId,
            streams: params.streams,
            textSearch: params.textSearch,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
          },
          requestOptions,
        );

        return connectionToListPageData(query?.node?.logs, (node) => ({
          datetime: parseDate(node.datetime)!,
          instanceId: node.instanceId,
          message: node.message,
          stream: node.stream,
          timestamp: node.timestamp,
        }));
      },
    });
  }
}

export class AppsVersionsResource {
  logs: AppsVersionsLogsResource;
  constructor(private client: SdkContext) {
    this.logs = new AppsVersionsLogsResource(client);
  }

  list(
    input: AppsVersionsListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<DeployAppVersion> {
    return createStackMachineListPromise<
      DeployAppVersion,
      AppsVersionsListInput
    >({
      params: input,
      options,
      url: "/v1/apps/versions",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcListAppVersionsQuery(
              $appId: ID!
              $createdAfter: DateTime
              $sortBy: DeployAppVersionsSortBy
              $first: Int
              $after: String
              $last: Int
              $before: String
            ) {
              node(id: $appId) {
                ... on DeployApp {
                  versions(
                    createdAfter: $createdAfter
                    sortBy: $sortBy
                    first: $first
                    after: $after
                    last: $last
                    before: $before
                  ) {
                    edges {
                      cursor
                      node {
                        ...srcDeployAppVersionData
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      endCursor
                      startCursor
                    }
                    totalCount
                  }
                }
              }
            }
          `,
          {
            appId: params.app,
            createdAfter: params.createdAfter?.toISOString(),
            sortBy: params.sortBy ?? "NEWEST",
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
          },
          requestOptions,
        );

        return connectionToListPageData(
          query?.node?.versions,
          (node: any) =>
            new DeployAppVersion(
              this.client._getFragmentData<srcDeployAppVersionData$data>(
                nodeAppVersion,
                node,
              ),
              this.client,
            ),
        );
      },
    });
  }
}

export class AppsSshUsersPasswordsResource {
  constructor(private client: SdkContext) {}

  async reveal(
    userId: string,
    options?: StackMachineRequestOptions,
  ): Promise<{ password: string | null; sshUser: SshUser }> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcRevealSshUserPasswordMutation(
          $input: RevealSshUserPasswordInput!
        ) {
          revealSshUserPassword(input: $input) {
            password
            sshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      {
        input: { sshUserId: userId },
      },
      options,
    );
    const payload = requiredPayload(
      response.revealSshUserPassword,
      "Failed to reveal SSH user password.",
      "srcRevealSshUserPasswordMutation",
    );
    return {
      password: payload.password || null,
      sshUser: new SshUser(payload.sshUser),
    };
  }

  async rotate(
    userId: string,
    options?: StackMachineRequestOptions,
  ): Promise<{ password: string; sshUser: SshUser }> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcRotateSshUserPasswordMutation(
          $input: RotateSshUserPasswordInput!
        ) {
          rotateSshUserPassword(input: $input) {
            password
            sshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      {
        input: { sshUserId: userId },
      },
      options,
    );
    const payload = requiredPayload(
      response.rotateSshUserPassword,
      "Failed to rotate SSH user password.",
      "srcRotateSshUserPasswordMutation",
    );
    return {
      password: payload.password,
      sshUser: new SshUser(payload.sshUser),
    };
  }
}

export class AppsSshUsersAuthorizedKeysResource {
  constructor(private client: SdkContext) {}

  list(
    input: AppsSshAuthorizedKeysListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<SshAuthorizedKey> {
    return createStackMachineListPromise<
      SshAuthorizedKey,
      AppsSshAuthorizedKeysListInput
    >({
      params: input,
      options,
      url: "/v1/apps/ssh/users/authorized_keys",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcGetSshAuthorizedKeysQuery(
              $id: ID!
              $first: Int
              $after: String
              $last: Int
              $before: String
            ) {
              node(id: $id) {
                ... on SshUser {
                  authorizedKeys(
                    first: $first
                    after: $after
                    last: $last
                    before: $before
                  ) {
                    edges {
                      cursor
                      node {
                        id
                        name
                        publicKey
                        createdAt
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      endCursor
                      startCursor
                    }
                    totalCount
                  }
                }
              }
            }
          `,
          {
            id: params.user,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
          },
          requestOptions,
        );

        return connectionToListPageData(
          query?.node?.authorizedKeys,
          (node: any) => new SshAuthorizedKey(node),
        );
      },
    });
  }

  async create(
    input: AppsSshAuthorizedKeysCreateInput,
    options?: StackMachineRequestOptions,
  ): Promise<SshAuthorizedKey> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcAddSshAuthorizedKeyMutation(
          $input: AddSshAuthorizedKeyInput!
        ) {
          addSshAuthorizedKey(input: $input) {
            authorizedKey {
              id
              name
              publicKey
              createdAt
            }
          }
        }
      `,
      {
        input: {
          sshUserId: input.user,
          publicKey: input.publicKey,
          name: input.name,
        },
      },
      options,
    );
    const keyData = requiredPayload(
      response.addSshAuthorizedKey?.authorizedKey,
      "Failed to add SSH authorized key.",
      "srcAddSshAuthorizedKeyMutation",
    );
    return new SshAuthorizedKey(keyData);
  }

  async del(
    input: string | AppsSshAuthorizedKeysDeleteInput,
    options?: StackMachineRequestOptions,
  ): Promise<void> {
    const authorizedKeyId =
      typeof input === "string" ? input : input.authorizedKeyId;
    if (authorizedKeyId) {
      const response = await this.client._mutation<any>(
        graphql`
          mutation srcDeleteSshAuthorizedKeyByIdMutation(
            $input: DeleteSshAuthorizedKeyByIdInput!
          ) {
            deleteSshAuthorizedKeyById(input: $input) {
              success
            }
          }
        `,
        {
          input: { authorizedKeyId },
        },
        options,
      );
      if (!response.deleteSshAuthorizedKeyById?.success) {
        throw new StackMachineAPIError({
          message: "Failed to delete SSH authorized key.",
          operationName: "srcDeleteSshAuthorizedKeyByIdMutation",
        });
      }
      return;
    }

    if (typeof input === "string") {
      throw new StackMachineValidationError({
        message:
          "`authorizedKeyId` is required to delete an SSH authorized key.",
        code: "invalid_ssh_authorized_key_delete_input",
        param: "authorizedKeyId",
      });
    }

    if (!input.user || !input.name) {
      throw new StackMachineValidationError({
        message:
          "`authorizedKeyId` or both `user` and `name` are required to delete an SSH authorized key.",
        code: "invalid_ssh_authorized_key_delete_input",
        param: "authorizedKeyId",
      });
    }

    const response = await this.client._mutation<any>(
      graphql`
        mutation srcDeleteSshAuthorizedKeyMutation(
          $input: DeleteSshAuthorizedKeyInput!
        ) {
          deleteSshAuthorizedKey(input: $input) {
            success
          }
        }
      `,
      {
        input: { sshUserId: input.user, name: input.name },
      },
      options,
    );
    if (!response.deleteSshAuthorizedKey?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete SSH authorized key.",
        operationName: "srcDeleteSshAuthorizedKeyMutation",
      });
    }
  }
}

export class AppsSshUsersResource {
  passwords: AppsSshUsersPasswordsResource;
  authorizedKeys: AppsSshUsersAuthorizedKeysResource;

  constructor(private client: SdkContext) {
    this.passwords = new AppsSshUsersPasswordsResource(client);
    this.authorizedKeys = new AppsSshUsersAuthorizedKeysResource(client);
  }

  list(
    input: AppsSshUsersListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<SshUser> {
    return createStackMachineListPromise<SshUser, AppsSshUsersListInput>({
      params: input,
      options,
      url: "/v1/apps/ssh/users",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcGetAppSshUsersQuery(
              $id: ID!
              $first: Int
              $after: String
              $last: Int
              $before: String
            ) {
              node(id: $id) {
                ... on DeployApp {
                  sshServer {
                    users(
                      first: $first
                      after: $after
                      last: $last
                      before: $before
                    ) {
                      edges {
                        cursor
                        node {
                          id
                          username
                          port
                          serverHost
                          sftpRootFolder
                          authenticationMethods
                        }
                      }
                      pageInfo {
                        hasNextPage
                        hasPreviousPage
                        endCursor
                        startCursor
                      }
                      totalCount
                    }
                  }
                }
              }
            }
          `,
          {
            id: params.app,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
          },
          requestOptions,
        );

        return connectionToListPageData(
          query?.node?.sshServer?.users,
          (node: any) => new SshUser(node),
        );
      },
    });
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<SshUser> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetSshUserByIdQuery($id: ID!) {
          node(id: $id) {
            __typename
            ... on SshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      { id },
      options,
    );
    if (!query?.node || query.node.__typename !== "SshUser") {
      throw resourceMissingError("SSH user", id, "srcGetSshUserByIdQuery");
    }
    return new SshUser(query.node);
  }

  async retrieveMany(
    ids: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(SshUser | null)[]> {
    if (ids.length === 0) {
      return [];
    }

    const query = await this.client._query<any>(
      graphql`
        query srcGetSshUsersByIdsQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            __typename
            ... on SshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      { ids },
      options,
    );
    const nodes = query?.nodes ?? [];
    return ids.map((_, index) => {
      const node = nodes[index];
      return node?.__typename === "SshUser" ? new SshUser(node) : null;
    });
  }

  async update(
    id: string,
    input: AppsSshUsersUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<SshUser> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcEditSshUserMutation($input: EditSshUserInput!) {
          editSshUser(input: $input) {
            sshUser {
              id
              username
              port
              serverHost
              sftpRootFolder
              authenticationMethods
            }
          }
        }
      `,
      {
        input: {
          id,
          username: input.username,
          sftpRootFolder: input.sftpRootFolder,
          authenticationMethods: input.authenticationMethods,
        },
      },
      options,
    );
    const userData = requiredPayload(
      response.editSshUser?.sshUser,
      "Failed to update SSH user.",
      "srcEditSshUserMutation",
    );
    return new SshUser(userData);
  }
}

export class AppsSshTokensResource {
  constructor(private client: SdkContext) {}

  async create(
    input: { app: string },
    options?: StackMachineRequestOptions,
  ): Promise<{ token: string }> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcGenerateSshTokenMutation($input: GenerateSshTokenInput!) {
          generateSshToken(input: $input) {
            token
          }
        }
      `,
      {
        input: {
          appId: input.app,
        },
      },
      options,
    );
    const token = response.generateSshToken?.token;
    if (!token) {
      throw new StackMachineAPIError({
        message: "Failed to generate SSH token.",
        operationName: "srcGenerateSshTokenMutation",
      });
    }
    return { token };
  }
}

export class AppsSshResource {
  tokens: AppsSshTokensResource;
  users: AppsSshUsersResource;

  constructor(private client: SdkContext) {
    this.tokens = new AppsSshTokensResource(client);
    this.users = new AppsSshUsersResource(client);
  }

  async retrieve(
    appId: string,
    options?: StackMachineRequestOptions,
  ): Promise<AppSshServer> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetAppSshServerQuery($id: ID!) {
          node(id: $id) {
            ... on DeployApp {
              sshServer {
                id
                enabled
              }
            }
          }
        }
      `,
      { id: appId },
      options,
    );
    if (!query?.node?.sshServer) {
      throw resourceMissingError(
        "SSH server",
        appId,
        "srcGetAppSshServerQuery",
        "app",
      );
    }
    return new AppSshServer(query.node.sshServer);
  }

  async retrieveMany(
    appIds: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(AppSshServer | null)[]> {
    if (appIds.length === 0) {
      return [];
    }

    const query = await this.client._query<any>(
      graphql`
        query srcGetAppSshServersQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            __typename
            ... on DeployApp {
              id
              sshServer {
                id
                enabled
              }
            }
          }
        }
      `,
      { ids: appIds },
      options,
    );
    const nodes = query?.nodes ?? [];
    return appIds.map((_, index) => {
      const node = nodes[index];
      return node?.__typename === "DeployApp" && node.sshServer
        ? new AppSshServer(node.sshServer)
        : null;
    });
  }

  async update(
    appId: string,
    input: AppsSshServerUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<AppSshServer> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcToggleSshServerMutation($input: ToggleSshServerInput!) {
          toggleSshServer(input: $input) {
            sshServer {
              id
              enabled
            }
          }
        }
      `,
      {
        input: {
          appId,
          enabled: input.enabled,
        },
      },
      options,
    );
    const sshServer = requiredPayload(
      response.toggleSshServer?.sshServer,
      "Failed to update SSH server.",
      "srcToggleSshServerMutation",
    );
    return new AppSshServer(sshServer);
  }
}

export class AppsCacheResource {
  constructor(private client: SdkContext) {}

  async retrieve(
    appId: string,
    options?: StackMachineRequestOptions,
  ): Promise<AppCache> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetAppCacheQuery($id: ID!) {
          node(id: $id) {
            __typename
            ... on DeployApp {
              id
              cdnCacheEnabled
              cdnCachePurgedAt
            }
          }
        }
      `,
      { id: appId },
      options,
    );
    if (query?.node?.__typename !== "DeployApp") {
      throw resourceMissingError("app", appId, "srcGetAppCacheQuery", "app");
    }
    return {
      appId: query.node.id,
      enabled: query.node.cdnCacheEnabled,
      purgedAt: parseDate(query.node.cdnCachePurgedAt),
    };
  }

  async update(
    appId: string,
    input: AppsCacheUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<void> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcConfigureAppCdnCacheMutation(
          $app: ID!
          $config: AppCdnCacheConfigUpdate!
        ) {
          configureAppCdnCache(app: $app, config: $config) {
            success
          }
        }
      `,
      { app: appId, config: { enabled: input.enabled } },
      options,
    );
    if (!response.configureAppCdnCache?.success) {
      throw new StackMachineAPIError({
        message: "Failed to configure app CDN cache.",
        operationName: "srcConfigureAppCdnCacheMutation",
      });
    }
  }

  async purge(
    appId: string,
    options?: StackMachineRequestOptions,
  ): Promise<void> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcPurgeAppCdnCacheMutation($app: ID!) {
          purgeAppCdnCache(app: $app) {
            success
          }
        }
      `,
      { app: appId },
      options,
    );
    if (!response.purgeAppCdnCache?.success) {
      throw new StackMachineAPIError({
        message: "Failed to purge app CDN cache.",
        operationName: "srcPurgeAppCdnCacheMutation",
      });
    }
  }
}

export class AppsCronJobsResource {
  constructor(private client: SdkContext) {}

  private cronJobFromNode(node: any): CronJob {
    return new CronJob(
      this.client._getFragmentData<srcCronJobData$data>(nodeCronJob, node),
    );
  }

  list(
    input: AppsCronJobsListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<CronJob> {
    return createStackMachineListPromise<CronJob, AppsCronJobsListInput>({
      params: input,
      options,
      url: "/v1/apps/cronjobs",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcListAppCronJobsQuery(
              $appId: ID!
              $first: Int
              $after: String
              $last: Int
              $before: String
              $kind: CronJobKind
              $sortBy: CronJobsSortBy
            ) {
              node(id: $appId) {
                ... on DeployApp {
                  cronJobs(
                    first: $first
                    after: $after
                    last: $last
                    before: $before
                    kind: $kind
                    sortBy: $sortBy
                  ) {
                    edges {
                      cursor
                      node {
                        ...srcCronJobData
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      endCursor
                      startCursor
                    }
                    totalCount
                  }
                }
              }
            }
          `,
          {
            appId: params.app,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
            kind: params.kind,
            sortBy: params.sortBy ?? "NEWEST",
          },
          requestOptions,
        );
        return connectionToListPageData(query?.node?.cronJobs, (node: any) =>
          this.cronJobFromNode(node),
        );
      },
    });
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<CronJob> {
    const cronJobs = await this.retrieveMany([id], options);
    const cronJob = cronJobs[0];
    if (!cronJob) {
      throw resourceMissingError("cron job", id, "srcGetCronJobsByIdsQuery");
    }
    return cronJob;
  }

  async retrieveMany(
    ids: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(CronJob | null)[]> {
    if (ids.length === 0) {
      return [];
    }
    const query = await this.client._query<any>(
      graphql`
        query srcGetCronJobsByIdsQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            __typename
            ... on CronJob {
              ...srcCronJobData
            }
          }
        }
      `,
      { ids },
      options,
    );
    const nodes = query?.nodes ?? [];
    return ids.map((_, index) => {
      const node = nodes[index];
      return node?.__typename === "CronJob" ? this.cronJobFromNode(node) : null;
    });
  }

  async create(
    input: AppsCronJobsCreateInput,
    options?: StackMachineRequestOptions,
  ): Promise<CronJob> {
    const { app, execute, fetch, ...commonInput } = input;
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcCreateCronJobMutation($input: CreateCronJobInput!) {
          createCronJob(input: $input) {
            cronJob {
              ...srcCronJobData
            }
          }
        }
      `,
      {
        input: {
          ...commonInput,
          appId: app,
          execute: execute ? serializeCronExecuteTarget(execute) : undefined,
          fetch,
        },
      },
      options,
    );
    const cronJob = requiredPayload(
      response.createCronJob?.cronJob,
      "Failed to create cron job.",
      "srcCreateCronJobMutation",
    );
    return this.cronJobFromNode(cronJob);
  }

  async update(
    id: string,
    input: AppsCronJobsUpdateInput,
    options?: StackMachineRequestOptions,
  ): Promise<CronJob> {
    const { execute, fetch, ...commonInput } = input;
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcUpdateCronJobMutation($input: UpdateCronJobInput!) {
          updateCronJob(input: $input) {
            cronJob {
              ...srcCronJobData
            }
          }
        }
      `,
      {
        input: {
          ...commonInput,
          cronJobId: id,
          execute: execute ? serializeCronExecuteTarget(execute) : undefined,
          fetch,
        },
      },
      options,
    );
    const cronJob = requiredPayload(
      response.updateCronJob?.cronJob,
      "Failed to update cron job.",
      "srcUpdateCronJobMutation",
    );
    return this.cronJobFromNode(cronJob);
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcDeleteCronJobMutation($input: DeleteCronJobInput!) {
          deleteCronJob(input: $input) {
            success
            deletedCronJobId
          }
        }
      `,
      { input: { cronJobId: id } },
      options,
    );
    if (!response.deleteCronJob?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete cron job.",
        operationName: "srcDeleteCronJobMutation",
      });
    }
  }
}

export class DeployAppsResource {
  cache: AppsCacheResource;
  cronjobs: AppsCronJobsResource;
  domains: AppsDomainsResource;
  volumes: AppsVolumesResource;
  databases: AppsDatabasesResource;
  git: AppsGitResource;
  versions: AppsVersionsResource;
  ssh: AppsSshResource;

  constructor(
    private client: SdkContext,
    private deployments: DeploymentsResource,
  ) {
    this.cache = new AppsCacheResource(client);
    this.cronjobs = new AppsCronJobsResource(client);
    this.domains = new AppsDomainsResource(client);
    this.volumes = new AppsVolumesResource(client);
    this.databases = new AppsDatabasesResource(client);
    this.git = new AppsGitResource(client);
    this.versions = new AppsVersionsResource(client);
    this.ssh = new AppsSshResource(client);
  }

  list(
    input: DeployAppsListInput = {},
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<DeployApp> {
    return createStackMachineListPromise<DeployApp, DeployAppsListInput>({
      params: input,
      options,
      url: "/v1/apps",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<srcListDeployAppsQuery>(
          graphql`
            query srcListDeployAppsQuery(
              $first: Int
              $after: String
              $last: Int
              $before: String
              $ownerId: ID
              $sortBy: DeployAppsSortBy
            ) {
              getDeployApps(
                first: $first
                after: $after
                last: $last
                before: $before
                ownerId: $ownerId
                sortBy: $sortBy
              ) {
                edges {
                  cursor
                  node {
                    ...srcDeployAppData
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  endCursor
                  startCursor
                }
                totalCount
              }
            }
          `,
          {
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
            ownerId: params.ownerId,
            sortBy: params.sortBy ?? "NEWEST",
          },
          requestOptions,
        );

        return connectionToListPageData(query?.getDeployApps, (node: any) => {
          const appData = this.client._getFragmentData<srcDeployAppData$data>(
            nodeApp,
            node,
          );
          return new DeployApp(appData, this.client);
        });
      },
    });
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<DeployApp> {
    const query = await this.client._query<srcGetAppByIdQuery>(
      graphql`
        query srcGetAppByIdQuery($id: ID!) {
          app: node(id: $id) {
            __typename
            ...srcDeployAppData
          }
        }
      `,
      {
        id,
      },
      options,
    );
    if (!query?.app || query.app.__typename !== "DeployApp") {
      throw resourceMissingError("app", id, "srcGetAppByIdQuery");
    }
    const appData = this.client._getFragmentData<srcDeployAppData$data>(
      nodeApp,
      query.app,
    );
    return new DeployApp(appData, this.client);
  }

  async retrieveMany(
    ids: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(DeployApp | null)[]> {
    if (ids.length === 0) {
      return [];
    }

    const query = await this.client._query<any>(
      graphql`
        query srcGetAppsByIdsQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            __typename
            ...srcDeployAppData
          }
        }
      `,
      { ids },
      options,
    );
    const nodes = query?.nodes ?? [];
    return ids.map((_, index) => {
      const node = nodes[index];
      if (!node || node.__typename !== "DeployApp") {
        return null;
      }
      const appData = this.client._getFragmentData<srcDeployAppData$data>(
        nodeApp,
        node,
      );
      return new DeployApp(appData, this.client);
    });
  }

  async retrieveByName(
    name: string,
    owner?: string,
    options?: StackMachineRequestOptions,
  ): Promise<DeployApp> {
    const query = await this.client._query<srcGetAppByNameQuery>(
      graphql`
        query srcGetAppByNameQuery($name: String!, $owner: String) {
          app: getDeployApp(name: $name, owner: $owner) {
            ...srcDeployAppData
          }
        }
      `,
      {
        name,
        owner,
      },
      options,
    );
    if (!query?.app) {
      throw resourceMissingError(
        "app",
        owner ? `${owner}/${name}` : name,
        "srcGetAppByNameQuery",
        "name",
      );
    }
    const appData = this.client._getFragmentData<srcDeployAppData$data>(
      nodeApp,
      query.app,
    );
    return new DeployApp(appData, this.client);
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<srcDeleteAppMutation>(
      graphql`
        mutation srcDeleteAppMutation($input: DeleteAppInput!) {
          deleteApp(input: $input) {
            success
          }
        }
      `,
      {
        input: { id },
      },
      options,
    );
    if (!response.deleteApp?.success) {
      throw new StackMachineAPIError({
        message: "The app could not be deleted.",
        operationName: "srcDeleteAppMutation",
      });
    }
  }

  async autobuild(
    input: DeploymentCreateInput,
    options?: DeploymentCreateOptions,
  ): Promise<Deployment> {
    return this.deployments.create(input, options);
  }
}

export class DNSDomainsResource {
  constructor(private client: SdkContext) {}

  private recordFromNode(node: any): srcDNSRecordData$data {
    return this.client._getFragmentData<srcDNSRecordData$data>(
      nodeDNSRecord,
      node,
    );
  }

  private domainFromNode(node: any): DNSDomain {
    const domainData = this.client._getFragmentData<srcDNSDomainData$data>(
      nodeDNSDomain,
      node,
    );
    const records = (node.records ?? [])
      .filter(Boolean)
      .map((record: any) => this.recordFromNode(record));
    return new DNSDomain({ ...domainData, records });
  }

  list(
    input: DNSDomainsListInput = {},
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<DNSDomain> {
    return createStackMachineListPromise<DNSDomain, DNSDomainsListInput>({
      params: input,
      options,
      url: "/v1/dns/domains",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcListDNSDomainsQuery(
              $owner: ID
              $first: Int
              $after: String
              $last: Int
              $before: String
            ) {
              getAllDomains(
                ownerId: $owner
                first: $first
                after: $after
                last: $last
                before: $before
              ) {
                edges {
                  cursor
                  node {
                    ...srcDNSDomainData
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  endCursor
                  startCursor
                }
                totalCount
              }
            }
          `,
          {
            owner: params.owner,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
          },
          requestOptions,
        );

        return connectionToListPageData(query?.getAllDomains, (node: any) =>
          this.domainFromNode(node),
        );
      },
    });
  }

  async retrieveMany(
    ids: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(DNSDomain | null)[]> {
    if (ids.length === 0) {
      return [];
    }

    const query = await this.client._query<any>(
      graphql`
        query srcGetDNSDomainsQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            __typename
            ... on DNSDomain {
              ...srcDNSDomainData
              records {
                ...srcDNSRecordData
              }
            }
          }
        }
      `,
      { ids },
      options,
    );
    const nodes = query?.nodes ?? [];
    return ids.map((_, index) => {
      const node = nodes[index];
      return node?.__typename === "DNSDomain"
        ? this.domainFromNode(node)
        : null;
    });
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<DNSDomain> {
    const domain = (await this.retrieveMany([id], options))[0];
    if (!domain) {
      throw resourceMissingError("DNS domain", id, "srcGetDNSDomainsQuery");
    }
    return domain;
  }

  async retrieveByName(
    name: string,
    options?: StackMachineRequestOptions,
  ): Promise<DNSDomain> {
    const query = await this.client._query<any>(
      graphql`
        query srcGetDNSDomainByNameQuery($name: String!) {
          getDomain(name: $name) {
            ...srcDNSDomainData
            records {
              ...srcDNSRecordData
            }
          }
        }
      `,
      { name },
      options,
    );
    if (!query?.getDomain) {
      throw resourceMissingError(
        "DNS domain",
        name,
        "srcGetDNSDomainByNameQuery",
        "name",
      );
    }
    return this.domainFromNode(query.getDomain);
  }

  async create(
    input: DNSDomainsCreateInput,
    options?: StackMachineRequestOptions,
  ): Promise<DNSDomain> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcRegisterDNSDomainMutation($input: RegisterDomainInput!) {
          registerDomain(input: $input) {
            success
            domain {
              ...srcDNSDomainData
              records {
                ...srcDNSRecordData
              }
            }
          }
        }
      `,
      {
        input: {
          name: input.name,
          ownerId: input.owner,
          importRecords: input.importRecords,
        },
      },
      options,
    );
    const payload = requiredPayload(
      response.registerDomain,
      "Failed to create DNS domain, mutation failed.",
      "srcRegisterDNSDomainMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to create DNS domain, mutation was not successful.",
        operationName: "srcRegisterDNSDomainMutation",
      });
    }
    const domain = requiredPayload(
      payload.domain,
      "Failed to create DNS domain, no domain returned.",
      "srcRegisterDNSDomainMutation",
    );
    return this.domainFromNode(domain);
  }

  async importZoneFile(
    input: DNSDomainsImportZoneFileInput,
    options?: StackMachineRequestOptions,
  ): Promise<DNSDomain> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcUpsertDNSDomainFromZoneFileMutation(
          $input: UpsertDomainFromZoneFileInput!
        ) {
          upsertDomainFromZoneFile(input: $input) {
            success
            domain {
              ...srcDNSDomainData
              records {
                ...srcDNSRecordData
              }
            }
          }
        }
      `,
      {
        input: {
          zoneFile: input.zoneFile,
          deleteMissingRecords: input.deleteMissingRecords,
        },
      },
      options,
    );
    const payload = requiredPayload(
      response.upsertDomainFromZoneFile,
      "Failed to import DNS zone file, mutation failed.",
      "srcUpsertDNSDomainFromZoneFileMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to import DNS zone file, mutation was not successful.",
        operationName: "srcUpsertDNSDomainFromZoneFileMutation",
      });
    }
    const domain = requiredPayload(
      payload.domain,
      "Failed to import DNS zone file, no domain returned.",
      "srcUpsertDNSDomainFromZoneFileMutation",
    );
    return this.domainFromNode(domain);
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcDeleteDNSDomainMutation($input: DeleteDomainInput!) {
          deleteDomain(input: $input) {
            success
          }
        }
      `,
      {
        input: { domainId: id },
      },
      options,
    );
    if (!response.deleteDomain?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete DNS domain, mutation was not successful.",
        operationName: "srcDeleteDNSDomainMutation",
      });
    }
  }
}

export class DNSRecordsResource {
  constructor(private client: SdkContext) {}

  private recordFromNode(node: any): DNSRecord {
    return new DNSRecord(
      this.client._getFragmentData<srcDNSRecordData$data>(nodeDNSRecord, node),
    );
  }

  async list(
    input: DNSRecordsListInput,
    options?: StackMachineRequestOptions,
  ): Promise<DNSRecord[]> {
    const domain = await this.client._query<any>(
      graphql`
        query srcListDNSRecordsQuery($domainId: ID!) {
          node(id: $domainId) {
            __typename
            ... on DNSDomain {
              records {
                ...srcDNSRecordData
              }
            }
          }
        }
      `,
      { domainId: input.domain },
      options,
    );
    if (!domain?.node || domain.node.__typename !== "DNSDomain") {
      throw resourceMissingError(
        "DNS domain",
        input.domain,
        "srcListDNSRecordsQuery",
        "domain",
      );
    }
    return (domain.node.records ?? [])
      .filter(Boolean)
      .map((record: any) => this.recordFromNode(record));
  }

  listPage(
    input: DNSRecordsListPageInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<DNSRecord> {
    return createStackMachineListPromise<DNSRecord, DNSRecordsListPageInput>({
      params: input,
      options,
      url: "/v1/dns/records",
      fetchPage: async (pagination, params, requestOptions) => {
        const query = await this.client._query<any>(
          graphql`
            query srcListDNSRecordsConnectionQuery(
              $domainId: ID!
              $first: Int
              $after: String
              $last: Int
              $before: String
              $sortBy: DNSRecordsSortBy
            ) {
              node(id: $domainId) {
                __typename
                ... on DNSDomain {
                  recordsConnection(
                    first: $first
                    after: $after
                    last: $last
                    before: $before
                    sortBy: $sortBy
                  ) {
                    edges {
                      cursor
                      node {
                        ...srcDNSRecordData
                      }
                    }
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                      endCursor
                      startCursor
                    }
                    totalCount
                  }
                }
              }
            }
          `,
          {
            domainId: params.domain,
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
            sortBy: params.sortBy,
          },
          requestOptions,
        );
        if (!query?.node || query.node.__typename !== "DNSDomain") {
          throw resourceMissingError(
            "DNS domain",
            params.domain,
            "srcListDNSRecordsConnectionQuery",
            "domain",
          );
        }
        return connectionToListPageData(
          query.node.recordsConnection,
          (node: any) => this.recordFromNode(node),
        );
      },
    });
  }

  async retrieveMany(
    ids: string[],
    options?: StackMachineRequestOptions,
  ): Promise<(DNSRecord | null)[]> {
    if (ids.length === 0) {
      return [];
    }

    const query = await this.client._query<any>(
      graphql`
        query srcGetDNSRecordsQuery($ids: [ID!]!) {
          nodes(ids: $ids) {
            __typename
            ... on DNSRecord {
              ...srcDNSRecordData
            }
          }
        }
      `,
      { ids },
      options,
    );
    const nodes = query?.nodes ?? [];
    return ids.map((_, index) => {
      const node = nodes[index];
      return isDNSRecordTypename(node?.__typename)
        ? this.recordFromNode(node)
        : null;
    });
  }

  async retrieve(
    id: string,
    options?: StackMachineRequestOptions,
  ): Promise<DNSRecord> {
    const record = (await this.retrieveMany([id], options))[0];
    if (!record) {
      throw resourceMissingError("DNS record", id, "srcGetDNSRecordsQuery");
    }
    return record;
  }

  private async upsert(
    input: DNSRecordsUpsertInput,
    recordId: string | undefined,
    options?: StackMachineRequestOptions,
  ): Promise<DNSRecord> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcUpsertDNSRecordMutation($input: UpsertDNSRecordInput!) {
          upsertDNSRecord(input: $input) {
            success
            record {
              ...srcDNSRecordData
            }
          }
        }
      `,
      {
        input: {
          domainId: input.domain,
          kind: input.kind,
          name: input.name,
          value: input.value,
          ttl: input.ttl,
          caa: input.caa,
          mx: input.mx,
          soa: input.soa,
          srv: input.srv,
          sshfp: input.sshfp,
          recordId,
        },
      },
      options,
    );
    const payload = requiredPayload(
      response.upsertDNSRecord,
      "Failed to upsert DNS record, mutation failed.",
      "srcUpsertDNSRecordMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to upsert DNS record, mutation was not successful.",
        operationName: "srcUpsertDNSRecordMutation",
      });
    }
    const record = requiredPayload(
      payload.record,
      "Failed to upsert DNS record, no record returned.",
      "srcUpsertDNSRecordMutation",
    );
    return this.recordFromNode(record);
  }

  async create(
    input: DNSRecordsUpsertInput,
    options?: StackMachineRequestOptions,
  ): Promise<DNSRecord> {
    return this.upsert(input, undefined, options);
  }

  async update(
    id: string,
    input: DNSRecordsUpsertInput,
    options?: StackMachineRequestOptions,
  ): Promise<DNSRecord> {
    return this.upsert(input, id, options);
  }

  async updateMany(
    input: DNSRecordsUpdateManyInput,
    options?: StackMachineRequestOptions,
  ): Promise<DNSRecord[]> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcUpdateDNSRecordsMutation($input: UpdateDNSRecordsInput!) {
          updateDNSRecords(input: $input) {
            success
            records {
              ...srcDNSRecordData
            }
          }
        }
      `,
      {
        input: {
          domainId: input.domain,
          records: input.records,
        },
      },
      options,
    );
    const payload = requiredPayload(
      response.updateDNSRecords,
      "Failed to update DNS records, mutation failed.",
      "srcUpdateDNSRecordsMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to update DNS records, mutation was not successful.",
        operationName: "srcUpdateDNSRecordsMutation",
      });
    }
    return (payload.records ?? [])
      .filter(Boolean)
      .map((record: any) => this.recordFromNode(record));
  }

  async del(id: string, options?: StackMachineRequestOptions): Promise<void> {
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcDeleteDNSRecordMutation($input: DeleteDNSRecordInput!) {
          deleteDNSRecord(input: $input) {
            success
          }
        }
      `,
      {
        input: { recordId: id },
      },
      options,
    );
    if (!response.deleteDNSRecord?.success) {
      throw new StackMachineAPIError({
        message: "Failed to delete DNS record, mutation was not successful.",
        operationName: "srcDeleteDNSRecordMutation",
      });
    }
  }
}

export class DNSResource {
  domains: DNSDomainsResource;
  records: DNSRecordsResource;

  constructor(client: SdkContext) {
    this.domains = new DNSDomainsResource(client);
    this.records = new DNSRecordsResource(client);
  }
}

export class EmailsMessagesResource {
  constructor(
    private client: SdkContext,
    private direction: "sent" | "received",
  ) {}

  list(
    input: EmailsListInput,
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<EmailMessage> {
    const id = input.app ?? input.owner;
    if (!id || (input.app && input.owner)) {
      throw new StackMachineValidationError({
        message: "`app` or `owner` is required, but not both.",
        code: "invalid_email_list_input",
        param: "app",
      });
    }
    const operationName =
      this.direction === "sent"
        ? "srcListSentEmailsQuery"
        : "srcListReceivedEmailsQuery";

    return createStackMachineListPromise<EmailMessage, EmailsListInput>({
      params: input,
      options,
      url: `/v1/emails/${this.direction}`,
      fetchPage: async (pagination, params, requestOptions) => {
        const query =
          this.direction === "sent"
            ? await this.client._query<any>(
                graphql`
                  query srcListSentEmailsQuery(
                    $id: ID!
                    $first: Int
                    $after: String
                    $last: Int
                    $before: String
                  ) {
                    node(id: $id) {
                      __typename
                      ... on DeployApp {
                        emails: sentEmails(
                          first: $first
                          after: $after
                          last: $last
                          before: $before
                        ) {
                          edges {
                            cursor
                            node {
                              ...srcEmailMessageData
                            }
                          }
                          pageInfo {
                            hasNextPage
                            hasPreviousPage
                            endCursor
                            startCursor
                          }
                          totalCount
                        }
                      }
                      ... on Namespace {
                        emails: sentEmails(
                          first: $first
                          after: $after
                          last: $last
                          before: $before
                        ) {
                          edges {
                            cursor
                            node {
                              ...srcEmailMessageData
                            }
                          }
                          pageInfo {
                            hasNextPage
                            hasPreviousPage
                            endCursor
                            startCursor
                          }
                          totalCount
                        }
                      }
                      ... on User {
                        emails: sentEmails(
                          first: $first
                          after: $after
                          last: $last
                          before: $before
                        ) {
                          edges {
                            cursor
                            node {
                              ...srcEmailMessageData
                            }
                          }
                          pageInfo {
                            hasNextPage
                            hasPreviousPage
                            endCursor
                            startCursor
                          }
                          totalCount
                        }
                      }
                    }
                  }
                `,
                {
                  id: params.app ?? params.owner,
                  first: pagination.first,
                  after: pagination.after,
                  last: pagination.last,
                  before: pagination.before,
                },
                requestOptions,
              )
            : await this.client._query<any>(
                graphql`
                  query srcListReceivedEmailsQuery(
                    $id: ID!
                    $first: Int
                    $after: String
                    $last: Int
                    $before: String
                  ) {
                    node(id: $id) {
                      __typename
                      ... on DeployApp {
                        emails: receivedEmails(
                          first: $first
                          after: $after
                          last: $last
                          before: $before
                        ) {
                          edges {
                            cursor
                            node {
                              ...srcEmailMessageData
                            }
                          }
                          pageInfo {
                            hasNextPage
                            hasPreviousPage
                            endCursor
                            startCursor
                          }
                          totalCount
                        }
                      }
                      ... on Namespace {
                        emails: receivedEmails(
                          first: $first
                          after: $after
                          last: $last
                          before: $before
                        ) {
                          edges {
                            cursor
                            node {
                              ...srcEmailMessageData
                            }
                          }
                          pageInfo {
                            hasNextPage
                            hasPreviousPage
                            endCursor
                            startCursor
                          }
                          totalCount
                        }
                      }
                      ... on User {
                        emails: receivedEmails(
                          first: $first
                          after: $after
                          last: $last
                          before: $before
                        ) {
                          edges {
                            cursor
                            node {
                              ...srcEmailMessageData
                            }
                          }
                          pageInfo {
                            hasNextPage
                            hasPreviousPage
                            endCursor
                            startCursor
                          }
                          totalCount
                        }
                      }
                    }
                  }
                `,
                {
                  id: params.app ?? params.owner,
                  first: pagination.first,
                  after: pagination.after,
                  last: pagination.last,
                  before: pagination.before,
                },
                requestOptions,
              );

        if (!query?.node?.emails) {
          throw resourceMissingError(
            input.app ? "app" : "owner",
            id,
            operationName,
            input.app ? "app" : "owner",
          );
        }
        return connectionToListPageData(
          query.node.emails,
          (node: any) =>
            new EmailMessage(
              this.client._getFragmentData<srcEmailMessageData$data>(
                nodeEmailMessage,
                node,
              ),
            ),
        );
      },
    });
  }
}

export class EmailsResource {
  sent: EmailsMessagesResource;
  received: EmailsMessagesResource;

  constructor(private client: SdkContext) {
    this.sent = new EmailsMessagesResource(client, "sent");
    this.received = new EmailsMessagesResource(client, "received");
  }

  async send(
    input: EmailsSendInput,
    options?: StackMachineRequestOptions,
  ): Promise<EmailMessage> {
    const uploadables = input.rawMessage
      ? { "variables.input.rawMessage": input.rawMessage }
      : undefined;
    const response = await this.client._mutation<any>(
      graphql`
        mutation srcSendAppEmailMutation($input: SendAppEmailInput!) {
          sendAppEmail(input: $input) {
            success
            message {
              ...srcEmailMessageData
            }
          }
        }
      `,
      {
        input: {
          appId: input.app,
          to: input.to,
          subject: input.subject,
          bcc: input.bcc,
          cc: input.cc,
          fromAddress: input.fromAddress,
          fromEmailId: input.fromEmailId,
          htmlBody: input.htmlBody,
          rawMessage: input.rawMessage ? null : undefined,
          replyTo: input.replyTo,
          textBody: input.textBody,
        },
      },
      options,
      uploadables,
    );
    const payload = requiredPayload(
      response.sendAppEmail,
      "Failed to send app email, mutation failed.",
      "srcSendAppEmailMutation",
    );
    if (!payload.success) {
      throw new StackMachineAPIError({
        message: "Failed to send app email, mutation was not successful.",
        operationName: "srcSendAppEmailMutation",
      });
    }
    const message = requiredPayload(
      payload.message,
      "Failed to send app email, no message returned.",
      "srcSendAppEmailMutation",
    );
    return new EmailMessage(
      this.client._getFragmentData<srcEmailMessageData$data>(
        nodeEmailMessage,
        message,
      ),
    );
  }
}

export class FilesResource {
  constructor(
    private client: SdkContext,
    private uploadConfig: StackMachineUploadConfig,
  ) {}

  async upload(
    file: Blob,
    options?: StackMachineUploadOptions,
  ): Promise<string> {
    if (typeof (options as unknown) === "function") {
      throw new StackMachineValidationError({
        message:
          "`client.files.upload` progress must be passed as `options.onProgress`.",
        code: "invalid_upload_options",
        param: "options",
      });
    }
    return handleUploadFileToCloud(
      this.client.environment,
      file,
      resolveUploadOptions(options, this.uploadConfig),
    );
  }
}

function serializeUsageDate(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function parseUsageRequestMetrics(data: any): UsageRequestMetrics {
  return {
    cachedRequests: data.cachedRequests,
    dataCachedBytes: data.dataCachedBytes,
    dataServedBytes: data.dataServedBytes,
    http2xx: data.http2xx,
    http3xx: data.http3xx,
    http4xx: data.http4xx,
    http5xx: data.http5xx,
    httpOther: data.httpOther,
    percentageCached: data.percentageCached,
    requestDurationMillis: data.requestDurationMillis,
    totalRequests: data.totalRequests,
    uniqueUsers: data.uniqueUsers,
  };
}

function parseUsageWorkloadMetrics(data: any): UsageWorkloadMetrics {
  return {
    memoryBytes: data.memoryBytes,
    networkEgressBytes: data.networkEgressBytes,
    networkIngressBytes: data.networkIngressBytes,
    realCpuTimeMillis: data.realCpuTimeMillis,
    wallCpuTimeMillis: data.wallCpuTimeMillis,
    workloads: data.workloads,
  };
}

function parseUsageMetricsTotals(data: any): UsageMetricsTotals {
  return {
    requests: parseUsageRequestMetrics(data.requests),
    workloads: parseUsageWorkloadMetrics(data.workloads),
  };
}

function parseUsageMetrics(data: any, scope: UsageMetricsScope): UsageMetrics {
  return {
    startAt: parseDate(data.startAt)!,
    endAt: parseDate(data.endAt)!,
    grouped: (data.grouped ?? []).map((group: any) => ({
      groupedAt: parseDate(group.groupedAt)!,
      ...parseUsageMetricsTotals(group),
    })),
    totals: parseUsageMetricsTotals(data.totals),
    scope,
  };
}

export class UsageResource {
  constructor(private client: SdkContext) {}

  async metrics(
    input: UsageMetricsInput,
    options?: StackMachineRequestOptions,
  ): Promise<UsageMetrics> {
    if (input.app !== undefined && input.app !== null) {
      if (input.owner !== undefined && input.owner !== null) {
        throw new StackMachineValidationError({
          message: "`app` and `owner` cannot both be provided.",
          param: "owner",
        });
      }
      return this.appMetrics(input, options);
    }
    if (input.owner !== undefined && input.owner !== null) {
      return this.ownerMetrics(input, options);
    }
    return this.viewerMetrics(input, options);
  }

  private async appMetrics(
    input: UsageMetricsInput,
    options?: StackMachineRequestOptions,
  ): Promise<UsageMetrics> {
    const appId = input.app!;
    const response = await this.client._query<srcUsageAppMetricsQuery>(
      graphql`
        query srcUsageAppMetricsQuery(
          $appId: ID!
          $start: DateTime!
          $end: DateTime!
          $groupedBy: MetricGrouping!
        ) {
          node(id: $appId) {
            __typename
            ... on DeployApp {
              groupedMetrics(
                startAt: $start
                endAt: $end
                groupedBy: $groupedBy
              ) {
                startAt
                endAt
                grouped {
                  groupedAt
                  requests {
                    cachedRequests
                    dataCachedBytes
                    dataServedBytes
                    http2xx
                    http3xx
                    http4xx
                    http5xx
                    httpOther
                    percentageCached
                    requestDurationMillis
                    totalRequests
                    uniqueUsers
                  }
                  workloads {
                    memoryBytes
                    networkEgressBytes
                    networkIngressBytes
                    realCpuTimeMillis
                    wallCpuTimeMillis
                    workloads
                  }
                }
                totals {
                  requests {
                    cachedRequests
                    dataCachedBytes
                    dataServedBytes
                    http2xx
                    http3xx
                    http4xx
                    http5xx
                    httpOther
                    percentageCached
                    requestDurationMillis
                    totalRequests
                    uniqueUsers
                  }
                  workloads {
                    memoryBytes
                    networkEgressBytes
                    networkIngressBytes
                    realCpuTimeMillis
                    wallCpuTimeMillis
                    workloads
                  }
                }
              }
            }
          }
        }
      `,
      {
        appId,
        start: serializeUsageDate(input.start),
        end: serializeUsageDate(input.end),
        groupedBy: input.groupedBy ?? "BY_DAY",
      },
      options,
    );
    if (!response.node || response.node.__typename !== "DeployApp") {
      throw resourceMissingError("app", appId, "srcUsageAppMetricsQuery");
    }
    return parseUsageMetrics(response.node.groupedMetrics, {
      type: "app",
      appId,
    });
  }

  private async ownerMetrics(
    input: UsageMetricsInput,
    options?: StackMachineRequestOptions,
  ): Promise<UsageMetrics> {
    const owner = input.owner!;
    const response = await this.client._query<srcUsageOwnerMetricsQuery>(
      graphql`
        query srcUsageOwnerMetricsQuery(
          $owner: String!
          $start: DateTime!
          $end: DateTime!
          $groupedBy: MetricGrouping!
        ) {
          owner: getGlobalObject(slug: $owner) {
            __typename
            ... on Namespace {
              groupedMetrics(
                startAt: $start
                endAt: $end
                groupedBy: $groupedBy
              ) {
                startAt
                endAt
                grouped {
                  groupedAt
                  requests {
                    cachedRequests
                    dataCachedBytes
                    dataServedBytes
                    http2xx
                    http3xx
                    http4xx
                    http5xx
                    httpOther
                    percentageCached
                    requestDurationMillis
                    totalRequests
                    uniqueUsers
                  }
                  workloads {
                    memoryBytes
                    networkEgressBytes
                    networkIngressBytes
                    realCpuTimeMillis
                    wallCpuTimeMillis
                    workloads
                  }
                }
                totals {
                  requests {
                    cachedRequests
                    dataCachedBytes
                    dataServedBytes
                    http2xx
                    http3xx
                    http4xx
                    http5xx
                    httpOther
                    percentageCached
                    requestDurationMillis
                    totalRequests
                    uniqueUsers
                  }
                  workloads {
                    memoryBytes
                    networkEgressBytes
                    networkIngressBytes
                    realCpuTimeMillis
                    wallCpuTimeMillis
                    workloads
                  }
                }
              }
            }
            ... on User {
              groupedMetrics(
                startAt: $start
                endAt: $end
                groupedBy: $groupedBy
              ) {
                startAt
                endAt
                grouped {
                  groupedAt
                  requests {
                    cachedRequests
                    dataCachedBytes
                    dataServedBytes
                    http2xx
                    http3xx
                    http4xx
                    http5xx
                    httpOther
                    percentageCached
                    requestDurationMillis
                    totalRequests
                    uniqueUsers
                  }
                  workloads {
                    memoryBytes
                    networkEgressBytes
                    networkIngressBytes
                    realCpuTimeMillis
                    wallCpuTimeMillis
                    workloads
                  }
                }
                totals {
                  requests {
                    cachedRequests
                    dataCachedBytes
                    dataServedBytes
                    http2xx
                    http3xx
                    http4xx
                    http5xx
                    httpOther
                    percentageCached
                    requestDurationMillis
                    totalRequests
                    uniqueUsers
                  }
                  workloads {
                    memoryBytes
                    networkEgressBytes
                    networkIngressBytes
                    realCpuTimeMillis
                    wallCpuTimeMillis
                    workloads
                  }
                }
              }
            }
          }
        }
      `,
      {
        owner,
        start: serializeUsageDate(input.start),
        end: serializeUsageDate(input.end),
        groupedBy: input.groupedBy ?? "BY_DAY",
      },
      options,
    );
    if (!response.owner) {
      throw resourceMissingError(
        "owner",
        owner,
        "srcUsageOwnerMetricsQuery",
        "owner",
      );
    }
    const ownerType = response.owner.__typename;
    if (ownerType !== "Namespace" && ownerType !== "User") {
      throw resourceMissingError(
        "owner",
        owner,
        "srcUsageOwnerMetricsQuery",
        "owner",
      );
    }
    return parseUsageMetrics(response.owner.groupedMetrics, {
      type: "owner",
      owner,
      ownerType,
    });
  }

  private async viewerMetrics(
    input: UsageMetricsInput,
    options?: StackMachineRequestOptions,
  ): Promise<UsageMetrics> {
    const response = await this.client._query<srcUsageViewerMetricsQuery>(
      graphql`
        query srcUsageViewerMetricsQuery(
          $start: DateTime!
          $end: DateTime!
          $groupedBy: MetricGrouping!
        ) {
          viewer {
            groupedMetrics(
              startAt: $start
              endAt: $end
              groupedBy: $groupedBy
            ) {
              startAt
              endAt
              grouped {
                groupedAt
                requests {
                  cachedRequests
                  dataCachedBytes
                  dataServedBytes
                  http2xx
                  http3xx
                  http4xx
                  http5xx
                  httpOther
                  percentageCached
                  requestDurationMillis
                  totalRequests
                  uniqueUsers
                }
                workloads {
                  memoryBytes
                  networkEgressBytes
                  networkIngressBytes
                  realCpuTimeMillis
                  wallCpuTimeMillis
                  workloads
                }
              }
              totals {
                requests {
                  cachedRequests
                  dataCachedBytes
                  dataServedBytes
                  http2xx
                  http3xx
                  http4xx
                  http5xx
                  httpOther
                  percentageCached
                  requestDurationMillis
                  totalRequests
                  uniqueUsers
                }
                workloads {
                  memoryBytes
                  networkEgressBytes
                  networkIngressBytes
                  realCpuTimeMillis
                  wallCpuTimeMillis
                  workloads
                }
              }
            }
          }
        }
      `,
      {
        start: serializeUsageDate(input.start),
        end: serializeUsageDate(input.end),
        groupedBy: input.groupedBy ?? "BY_DAY",
      },
      options,
    );
    const viewer = requiredPayload(
      response.viewer,
      "Failed to retrieve usage metrics, no viewer returned.",
      "srcUsageViewerMetricsQuery",
    );
    return parseUsageMetrics(viewer.groupedMetrics, { type: "viewer" });
  }
}

export type CountComparison =
  | "EQUAL"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "%future added value";
export type PackageOrderBy =
  | "ALPHABETICALLY"
  | "CREATED_DATE"
  | "PUBLISHED_DATE"
  | "SIZE"
  | "TOTAL_DOWNLOADS"
  | "TOTAL_LIKES"
  | "%future added value";
export type SearchOrderSort = "ASC" | "DESC" | "%future added value";
export type SearchPublishDate =
  | "LAST_DAY"
  | "LAST_MONTH"
  | "LAST_WEEK"
  | "LAST_YEAR"
  | "%future added value";
export type CountFilter = {
  count?: number | null;
  comparison?: CountComparison | null;
};
export type PackagesFilter = {
  owner?: string | null;
  publishedBy?: string | null;
  curated?: boolean | null;
  deployable?: boolean | null;
  hasBindings?: boolean | null;
  hasCommands?: boolean | null;
  isStandalone?: boolean | null;
  withInterfaces?: ReadonlyArray<string | null | undefined> | null;
  license?: string | null;
  size?: CountFilter | null;
  downloads?: CountFilter | null;
  likes?: CountFilter | null;
  createdAfter?: Date | null;
  createdBefore?: Date | null;
  lastPublishedAfter?: Date | null;
  lastPublishedBefore?: Date | null;
  publishDate?: SearchPublishDate | null;
  orderBy?: PackageOrderBy | null;
  sortBy?: SearchOrderSort | null;
  count?: number | null;
};

export type WebcVersion = "V2" | "V3" | "%future added value";

export interface PackageDistribution {
  piritaSha256Hash: string | null;
  piritaDownloadUrl: string | null;
  downloadUrl: string | null;
  size: number | null;
  piritaSize: number | null;
  webcVersion: WebcVersion | null;
  /** The webc manifest, as a JSON string. */
  webcManifest: string | null;
}

export interface PackageVersion {
  id: string;
  version: string;
  createdAt: Date;
  distribution: PackageDistribution;
}

export interface Package {
  id: string;
  packageName: string;
  namespace: string | null;
  lastVersion: PackageVersion | null;
  private: boolean;
}

export interface PackageActor {
  username: string;
}

export interface PackageDetails extends Package {
  isArchived: boolean;
  archivedBy: PackageActor | null;
}

export interface ResolvedPackageVersion extends PackageVersion {
  yankedAt: Date | null;
  yankReason: string | null;
  yankedBy: PackageActor | null;
  rebuilds: PackageVersion[];
}

export class SearchPackageVersion {
  static fragment = graphql`
    fragment srcSearchPackageVersionData on PackageVersion {
      id
      version
      createdAt
      package {
        id
        packageName
        namespace
        private
        lastVersion {
          id
          version
          createdAt
          distribution {
            piritaSha256Hash
            piritaDownloadUrl
            downloadUrl
            size
            piritaSize
            webcVersion
            webcManifest
          }
        }
      }
    }
  `;

  /** The package version's id. */
  id: string;
  version: string;
  createdAt: Date;
  package: Package;

  constructor(data: any) {
    const typedData = data as srcSearchPackageVersionData$data;
    this.id = typedData.id;
    this.version = typedData.version;
    this.createdAt = parseDate(typedData.createdAt)!;
    this.package = {
      id: typedData.package.id,
      packageName: typedData.package.packageName,
      namespace: typedData.package.namespace ?? null,
      lastVersion: mapPackageVersion(typedData.package.lastVersion),
      private: typedData.package.private,
    };
  }
}

export type PackagesSearchInput = StackMachinePaginationParams & {
  /** Free-text query. Empty (the default) matches everything subject to filters. */
  query?: string;
  /**
   * The full registry package filter (owner, curated, downloads, likes, size,
   * license, dates, interfaces, ordering, ...). See {@link PackagesFilter}.
   */
  filter?: PackagesFilter;
};

export type PackageYankInput = {
  /** Why the versions are being yanked. Shown to users who still pin them. */
  reason?: string | null;
};

export interface YankedPackageVersion {
  id: string;
  version: string;
  yankedAt: Date | null;
  yankReason: string | null;
}

function mapPackageDistribution(distribution: any): PackageDistribution {
  return {
    piritaSha256Hash: distribution?.piritaSha256Hash ?? null,
    piritaDownloadUrl: distribution?.piritaDownloadUrl ?? null,
    downloadUrl: distribution?.downloadUrl ?? null,
    size: distribution?.size ?? null,
    piritaSize: distribution?.piritaSize ?? null,
    webcVersion: distribution?.webcVersion ?? null,
    webcManifest: distribution?.webcManifest ?? null,
  };
}

function mapPackageVersion(version: any): PackageVersion | null {
  if (!version) {
    return null;
  }
  return {
    id: version.id,
    version: version.version,
    createdAt: parseDate(version.createdAt)!,
    distribution: mapPackageDistribution(version.distribution),
  };
}

export class PackageVersionsResource {
  constructor(private client: SdkContext) {}

  /** Resolve an exact version, semver range, or tag such as `latest`. */
  async resolve(
    packageName: string,
    selector: string,
    options?: StackMachineRequestOptions,
  ): Promise<ResolvedPackageVersion | null> {
    const response = await this.client._query<srcResolvePackageVersionQuery>(
      graphql`
        query srcResolvePackageVersionQuery($name: String!, $version: String!) {
          getPackageVersion(name: $name, version: $version) {
            id
            version
            createdAt
            distribution {
              piritaSha256Hash
              piritaDownloadUrl
              downloadUrl
              size
              piritaSize
              webcVersion
              webcManifest
            }
            yankedAt
            yankReason
            yankedBy {
              username
            }
            rebuilds {
              id
              version
              createdAt
              distribution {
                piritaSha256Hash
                piritaDownloadUrl
                downloadUrl
                size
                piritaSize
                webcVersion
                webcManifest
              }
            }
          }
        }
      `,
      { name: packageName, version: selector },
      options,
    );
    const version = response.getPackageVersion;
    if (!version) {
      return null;
    }
    return {
      ...mapPackageVersion(version)!,
      yankedAt: parseDate(version.yankedAt),
      yankReason: version.yankReason ?? null,
      yankedBy: version.yankedBy
        ? { username: version.yankedBy.username }
        : null,
      rebuilds: version.rebuilds.map((rebuild) => mapPackageVersion(rebuild)!),
    };
  }
}

// `PackagesFilter` is one nested `$packages` variable, so its `DateTime` fields
// can't be serialized inline like the top-level scalar date inputs (cf. logs
// `since`/`until`). Expose them as `Date` and convert just those to ISO strings
// here.
// If nested transforms like this pop up in the future, it may make sense
// to hoist this out into some form of generic/reusable abstraction akin to
// what python does already.
function serializePackagesFilter(
  filter: PackagesFilter | undefined,
): Record<string, unknown> {
  if (!filter) {
    return {};
  }
  return {
    ...filter,
    createdAfter: filter.createdAfter?.toISOString(),
    createdBefore: filter.createdBefore?.toISOString(),
    lastPublishedAfter: filter.lastPublishedAfter?.toISOString(),
    lastPublishedBefore: filter.lastPublishedBefore?.toISOString(),
  };
}

export class PackagesResource {
  versions: PackageVersionsResource;

  constructor(private client: SdkContext) {
    this.versions = new PackageVersionsResource(client);
  }

  /** Retrieve a package by its fully-qualified registry name. */
  async retrieve(
    packageName: string,
    options?: StackMachineRequestOptions,
  ): Promise<PackageDetails> {
    const response = await this.client._query<srcGetPackageQuery>(
      graphql`
        query srcGetPackageQuery($name: String!) {
          getPackage(name: $name) {
            id
            packageName
            namespace
            private
            isArchived
            archivedBy {
              username
            }
            lastVersion {
              id
              version
              createdAt
              distribution {
                piritaSha256Hash
                piritaDownloadUrl
                downloadUrl
                size
                piritaSize
                webcVersion
                webcManifest
              }
            }
          }
        }
      `,
      { name: packageName },
      options,
    );
    const package_ = response.getPackage;
    if (!package_) {
      throw resourceMissingError(
        "package",
        packageName,
        "srcGetPackageQuery",
        "name",
      );
    }
    return {
      id: package_.id,
      packageName: package_.packageName,
      namespace: package_.namespace ?? null,
      private: package_.private,
      lastVersion: mapPackageVersion(package_.lastVersion),
      isArchived: package_.isArchived,
      archivedBy: package_.archivedBy
        ? { username: package_.archivedBy.username }
        : null,
    };
  }

  /**
   * Search the registry for packages. Results are the latest version of each
   * matching package. Supports the registry's package filters (e.g. `owner`,
   * `curated`).
   */
  search(
    input: PackagesSearchInput = {},
    options?: StackMachineRequestOptions,
  ): StackMachineListPromise<SearchPackageVersion> {
    return createStackMachineListPromise<
      SearchPackageVersion,
      PackagesSearchInput
    >({
      params: input,
      options,
      url: "/v1/packages",
      fetchPage: async (pagination, params, requestOptions) => {
        const result = await this.client._query<any>(
          graphql`
            query srcSearchPackagesQuery(
              $searchQuery: String!
              $first: Int
              $after: String
              $last: Int
              $before: String
              $packages: PackagesFilter
            ) {
              search(
                query: $searchQuery
                packages: $packages
                first: $first
                after: $after
                last: $last
                before: $before
              ) {
                edges {
                  cursor
                  node {
                    __typename
                    ... on PackageVersion {
                      ...srcSearchPackageVersionData
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  endCursor
                  startCursor
                }
                totalCount
              }
            }
          `,
          {
            searchQuery: params.query ?? "",
            // A non-null `packages` filter is what scopes `search` to packages,
            // so always send at least an empty filter.
            packages: serializePackagesFilter(params.filter),
            first: pagination.first,
            after: pagination.after,
            last: pagination.last,
            before: pagination.before,
          },
          requestOptions,
        );

        // `search` returns a union, but the `packages` filter scopes results
        // to PackageVersion nodes.
        return connectionToListPageData(
          result?.search,
          (node: any) =>
            new SearchPackageVersion(
              this.client._getFragmentData<srcSearchPackageVersionData$data>(
                nodeSearchPackageVersion,
                node,
              ),
            ),
        );
      },
    });
  }

  /**
   * Yank the given package versions, by node id. Requires package-admin
   * rights, and all ids must belong to the same package. A yanked version
   * still resolves when pinned exactly. It is skipped by `latest` and by
   * semver-range resolution. Resolves to only the versions whose yank state
   * changed, so re-yanking an already-yanked version resolves to an empty
   * array.
   */
  async yank(
    versionIds: string[],
    input: PackageYankInput = {},
    options?: StackMachineRequestOptions,
  ): Promise<YankedPackageVersion[]> {
    return this.yankPackageVersions(
      versionIds,
      input.reason ?? null,
      false,
      options,
    );
  }

  /** Restore the given previously yanked package versions, by node id. */
  async unyank(
    versionIds: string[],
    options?: StackMachineRequestOptions,
  ): Promise<YankedPackageVersion[]> {
    return this.yankPackageVersions(versionIds, null, true, options);
  }

  private async yankPackageVersions(
    versionIds: string[],
    reason: string | null,
    undo: boolean,
    options?: StackMachineRequestOptions,
  ): Promise<YankedPackageVersion[]> {
    const response =
      await this.client._mutation<srcYankPackageVersionsMutation>(
        graphql`
          mutation srcYankPackageVersionsMutation(
            $input: YankPackageVersionsInput!
          ) {
            yankPackageVersions(input: $input) {
              packageVersions {
                id
                version
                yankedAt
                yankReason
              }
            }
          }
        `,
        {
          input: { packageVersionIds: versionIds, reason, undo },
        },
        options,
      );

    return (response.yankPackageVersions?.packageVersions ?? []).map(
      (version) => ({
        id: version.id,
        version: version.version,
        yankedAt: parseDate(version.yankedAt),
        yankReason: version.yankReason ?? null,
      }),
    );
  }

  /**
   * Set (or clear) a package's archived state. Requires package-admin rights.
   * Archiving hides the package from search and listings. It has no effect on
   * resolution, so apps and dependencies already pointing at it keep working.
   */
  async setArchived(
    packageName: string,
    archived: boolean,
    options?: StackMachineRequestOptions,
  ): Promise<boolean> {
    const id = await this.resolvePackageId(packageName, options);
    const response = await this.client._mutation<srcSetPackageArchivedMutation>(
      graphql`
        mutation srcSetPackageArchivedMutation($id: ID!, $archived: Boolean!) {
          setPackageArchived(input: { packageId: $id, archived: $archived }) {
            package {
              id
              isArchived
            }
          }
        }
      `,
      { id, archived },
      options,
    );
    return response.setPackageArchived?.package.isArchived ?? false;
  }

  /** Archive (delist) a package. Shorthand for `setArchived(name, true)`. */
  async archive(
    packageName: string,
    options?: StackMachineRequestOptions,
  ): Promise<boolean> {
    return this.setArchived(packageName, true, options);
  }

  /** Restore a previously archived package. `setArchived(name, false)`. */
  async unarchive(
    packageName: string,
    options?: StackMachineRequestOptions,
  ): Promise<boolean> {
    return this.setArchived(packageName, false, options);
  }

  private async resolvePackageId(
    packageName: string,
    options?: StackMachineRequestOptions,
  ): Promise<string> {
    const response = await this.client._query<srcGetPackageIdQuery>(
      graphql`
        query srcGetPackageIdQuery($name: String!) {
          getPackage(name: $name) {
            id
          }
        }
      `,
      { name: packageName },
      options,
    );
    const id = response.getPackage?.id;
    if (!id) {
      throw new StackMachineAPIError({
        message: `Package '${packageName}' was not found.`,
        operationName: "srcGetPackageIdQuery",
      });
    }
    return id;
  }
}

export class StackMachine implements SdkContext {
  environment: Environment;
  deployments: DeploymentsResource;
  apps: DeployAppsResource;
  dns: DNSResource;
  emails: EmailsResource;
  packages: PackagesResource;
  files: FilesResource;
  usage: UsageResource;
  readonly apiUrl: string;
  readonly timeout: number;
  readonly maxNetworkRetries: number;
  private readonly fetch: typeof fetch;

  constructor(apiKey: string, config: StackMachineConfig = {}) {
    this.apiUrl = config.apiUrl || DEFAULT_API_URL;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT_MS;
    this.maxNetworkRetries =
      config.maxNetworkRetries ?? DEFAULT_MAX_NETWORK_RETRIES;
    this.fetch = resolveRuntimeFetch(config.fetch);

    const environmentOptions: EnvironmentOptions = {
      endpoint: this.apiUrl,
      apiKey,
      headers: config.headers,
      timeout: this.timeout,
      maxNetworkRetries: this.maxNetworkRetries,
      fetch: this.fetch,
    };
    this.environment = createEnvironment(environmentOptions);
    this.files = new FilesResource(this, {
      fetch: this.fetch,
      timeout: this.timeout,
      maxNetworkRetries: this.maxNetworkRetries,
    });
    this.deployments = new DeploymentsResource(this, this.files);
    this.apps = new DeployAppsResource(this, this.deployments);
    this.dns = new DNSResource(this);
    this.emails = new EmailsResource(this);
    this.packages = new PackagesResource(this);
    this.usage = new UsageResource(this);
  }

  static async init(settings: StackMachineRegistryConfig) {
    if (!settings.apiKey && settings.token) {
      console.warn(
        "[stackmachine] `token` is deprecated. Please use `apiKey` instead.",
      );
    }
    const { apiKey, token, ...config } = settings;
    return new StackMachine(apiKey || token || "", config);
  }

  _cacheConfig(options?: StackMachineRequestOptions): StackMachineCacheConfig {
    return {
      force: options?.force ?? true,
      stackMachine: options,
    };
  }

  async _query<
    TQuery extends { response: unknown; variables: Record<string, unknown> },
  >(
    query: GraphQLTaggedNode,
    variables: TQuery["variables"],
    options?: StackMachineRequestOptions,
  ): Promise<TQuery["response"]> {
    const operationName = operationNameFromNode(query);
    try {
      const result = await fetchQuery<TQuery>(
        this.environment,
        query,
        variables,
        {
          networkCacheConfig: this._cacheConfig(options),
        },
      ).toPromise();
      return result as TQuery["response"];
    } catch (error) {
      throw stackMachineErrorFromUnknown(error, operationName);
    }
  }

  async _mutation<TMutation extends MutationShape>(
    mutation: GraphQLTaggedNode,
    variables: TMutation["variables"],
    options?: StackMachineRequestOptions,
    uploadables?: UploadableMap | null,
  ): Promise<TMutation["response"]> {
    const operationName = operationNameFromNode(mutation);
    const variablesWithClientMutationId = withClientMutationId(
      variables,
      options,
    );

    return new Promise<TMutation["response"]>((resolve, reject) => {
      try {
        commitMutation<any>(this.environment, {
          mutation,
          variables: variablesWithClientMutationId,
          cacheConfig: this._cacheConfig(options),
          uploadables,
          onCompleted: (response, errors) => {
            if (errors && errors.length > 0) {
              reject(
                stackMachineErrorFromGraphQLErrors(
                  errors as StackMachineGraphQLErrorPayload[],
                  operationName,
                ),
              );
              return;
            }
            resolve(response as TMutation["response"]);
          },
          onError: (error) => {
            reject(stackMachineErrorFromUnknown(error, operationName));
          },
        });
      } catch (error) {
        reject(stackMachineErrorFromUnknown(error, operationName));
      }
    });
  }

  _requestSubscription<TSubscription extends { response: unknown }>(
    subscription: GraphQLTaggedNode,
    variables: Record<string, unknown>,
    handlers: SubscriptionHandlers<TSubscription>,
    options?: StackMachineRequestOptions,
  ) {
    return requestSubscription<any>(this.environment, {
      subscription,
      variables,
      cacheConfig: this._cacheConfig(options),
      onNext: handlers.onNext,
      onCompleted: handlers.onCompleted,
      onError: handlers.onError,
    });
  }

  _getFragmentData<T>(node: ReaderFragment, fetchedData: unknown): T {
    const selector = getSelector(node, fetchedData);
    return this.environment.lookup(selector as any).data as T;
  }

  async viewer(options?: StackMachineRequestOptions): Promise<Viewer | null> {
    const query = await this._query<srcViewerQuery>(
      graphql`
        query srcViewerQuery {
          viewer {
            username
          }
        }
      `,
      {},
      options,
    );
    if (!query?.viewer) {
      return null;
    }
    return {
      username: query.viewer.username,
    };
  }
}

export default StackMachine;
