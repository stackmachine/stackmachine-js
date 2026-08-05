VIEWER_QUERY = """
query srcViewerQuery {
  viewer {
    username
  }
}
"""

USAGE_METRICS_FIELDS = """
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
"""

USAGE_APP_METRICS_QUERY = f"""
query srcUsageAppMetricsQuery(
  $appId: ID!
  $start: DateTime!
  $end: DateTime!
  $groupedBy: MetricGrouping!
) {{
  node(id: $appId) {{
    __typename
    ... on DeployApp {{
      groupedMetrics(startAt: $start, endAt: $end, groupedBy: $groupedBy) {{
        {USAGE_METRICS_FIELDS}
      }}
    }}
  }}
}}
"""

USAGE_OWNER_METRICS_QUERY = f"""
query srcUsageOwnerMetricsQuery(
  $owner: String!
  $start: DateTime!
  $end: DateTime!
  $groupedBy: MetricGrouping!
) {{
  owner: getGlobalObject(slug: $owner) {{
    __typename
    ... on Namespace {{
      groupedMetrics(startAt: $start, endAt: $end, groupedBy: $groupedBy) {{
        {USAGE_METRICS_FIELDS}
      }}
    }}
    ... on User {{
      groupedMetrics(startAt: $start, endAt: $end, groupedBy: $groupedBy) {{
        {USAGE_METRICS_FIELDS}
      }}
    }}
  }}
}}
"""

USAGE_VIEWER_METRICS_QUERY = f"""
query srcUsageViewerMetricsQuery(
  $start: DateTime!
  $end: DateTime!
  $groupedBy: MetricGrouping!
) {{
  viewer {{
    groupedMetrics(startAt: $start, endAt: $end, groupedBy: $groupedBy) {{
      {USAGE_METRICS_FIELDS}
    }}
  }}
}}
"""

UPLOAD_QUERY = """
query uploadQuery($filename: String!) {
  getSignedUrl(filename: $filename) {
    url
  }
}
"""

AUTOBUILD_MUTATION = """
mutation srcAutobuildMutation($input: DeployViaAutobuildInput!) {
  deployViaAutobuild(input: $input) {
    success
    buildId
  }
}
"""

AUTOBUILD_SUBSCRIPTION = """
subscription srcAutobuildSubscription($buildId: UUID!) {
  autobuildDeployment(buildId: $buildId) {
    appVersion {
      id
      app {
        id
        willPerishAt
        name
        url
        adminUrl
        activeVersion {
          id
        }
        favicon
        screenshot
      }
    }
    kind
    datetime
    stream
    message
  }
}
"""

GET_DEPLOYMENT_STATUS_QUERY = """
query srcGetDeploymentStatusQuery($buildId: UUID!) {
  autobuildDeploymentStatus(buildId: $buildId) {
    buildId
    status
    appVersion {
      id
      app {
        id
        willPerishAt
        name
        url
        adminUrl
        activeVersion {
          id
        }
        favicon
        screenshot
      }
    }
  }
}
"""

APP_FIELDS = """
id
willPerishAt
name
url
adminUrl
activeVersion {
  id
}
favicon
screenshot
"""

APP_ALIAS_FIELDS = """
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
"""

APP_VOLUME_FIELDS = """
id
volumeId
mountPath
maxSizeBytes
s3Enabled
s3Url
explorerUrl
isAddedByUi
"""

APP_DATABASE_FIELDS = f"""
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
app {{
  {APP_FIELDS}
}}
"""

GITHUB_REPO_CONNECTION_FIELDS = f"""
id
connectedAt
deployBranch
deploymentStatusEvents
pullRequestComments
connectedBy {{
  id
  username
  globalName
}}
app {{
  {APP_FIELDS}
}}
githubRepoInstallation {{
  id
  name
  namespace
  repoUrl
  url
  installation {{
    id
    slug
    githubConfigureUrl
  }}
}}
"""

DNS_OWNER_FIELDS = """
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
"""

DNS_RECORD_FIELDS = """
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
"""

DNS_DOMAIN_FIELDS = f"""
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
owner {{
  {DNS_OWNER_FIELDS}
}}
records {{
  {DNS_RECORD_FIELDS}
}}
"""

DNS_DOMAIN_LIST_FIELDS = f"""
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
owner {{
  {DNS_OWNER_FIELDS}
}}
"""

EMAIL_MESSAGE_FIELDS = f"""
id
bcc
cc
createdAt
direction
from
htmlBody
receivedAt
replyTo
sentAt
status
subject
textBody
to
app {{
  id
}}
owner {{
  {DNS_OWNER_FIELDS}
}}
"""

SSH_USER_FIELDS = """
id
username
port
serverHost
sftpRootFolder
authenticationMethods
"""

SSH_SERVER_FIELDS = """
id
enabled
"""

AUTHORIZED_KEY_FIELDS = """
id
name
publicKey
createdAt
"""

LIST_APPS_QUERY = f"""
query srcListDeployAppsQuery(
  $first: Int
  $after: String
  $last: Int
  $before: String
  $ownerId: ID
  $sortBy: DeployAppsSortBy
) {{
  getDeployApps(
    first: $first
    after: $after
    last: $last
    before: $before
    ownerId: $ownerId
    sortBy: $sortBy
  ) {{
    edges {{
      cursor
      node {{
        {APP_FIELDS}
      }}
    }}
    pageInfo {{
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }}
    totalCount
  }}
}}
"""

GET_APP_BY_ID_QUERY = f"""
query srcGetAppByIdQuery($id: ID!) {{
  app: node(id: $id) {{
    __typename
    ... on DeployApp {{
      {APP_FIELDS}
    }}
  }}
}}
"""

GET_APPS_BY_IDS_QUERY = f"""
query srcGetAppsByIdsQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on DeployApp {{
      {APP_FIELDS}
    }}
  }}
}}
"""

GET_APP_BY_NAME_QUERY = f"""
query srcGetAppByNameQuery($name: String!, $owner: String) {{
  app: getDeployApp(name: $name, owner: $owner) {{
    {APP_FIELDS}
  }}
}}
"""

DELETE_APP_MUTATION = """
mutation srcDeleteAppMutation($input: DeleteAppInput!) {
  deleteApp(input: $input) {
    success
  }
}
"""

GET_APP_ALIASES_QUERY = f"""
query srcGetAppAliasesQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on AppAlias {{
      {APP_ALIAS_FIELDS}
    }}
  }}
}}
"""

LIST_APP_DOMAINS_QUERY = f"""
query srcListAppDomainsQuery(
  $appId: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
  $sortBy: AppAliasSortBy!
) {{
  node(id: $appId) {{
    ... on DeployApp {{
      domains(
        first: $first
        after: $after
        last: $last
        before: $before
        sortBy: $sortBy
      ) {{
        edges {{
          cursor
          node {{
            {APP_ALIAS_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

LIST_APP_VOLUMES_QUERY = f"""
query srcListAppVolumesQuery(
  $appId: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $appId) {{
    ... on DeployApp {{
      volumes(
        first: $first
        after: $after
        last: $last
        before: $before
      ) {{
        edges {{
          cursor
          node {{
            {APP_VOLUME_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

UPSERT_APP_DOMAIN_MUTATION = f"""
mutation srcUpsertAppDomainMutation($input: UpsertAppDomainInput!) {{
  upsertAppDomain(input: $input) {{
    success
    domains {{
      {APP_ALIAS_FIELDS}
    }}
  }}
}}
"""

CREATE_APP_VOLUME_MUTATION = f"""
mutation srcCreateAppVolumeMutation($input: CreateAppVolumeInput!) {{
  createAppVolume(input: $input) {{
    success
    volume {{
      {APP_VOLUME_FIELDS}
    }}
  }}
}}
"""

UPDATE_VOLUME_MUTATION = f"""
mutation srcUpdateVolumeMutation($input: UpdateVolumeInput!) {{
  updateVolume(input: $input) {{
    success
    volume {{
      {APP_VOLUME_FIELDS}
    }}
  }}
}}
"""

DELETE_APP_VOLUME_MUTATION = """
mutation srcDeleteAppVolumeMutation($input: DeleteAppVolumeInput!) {
  deleteAppVolume(input: $input) {
    success
  }
}
"""

LIST_APP_DATABASES_QUERY = f"""
query srcListAppDatabasesQuery(
  $appId: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $appId) {{
    ... on DeployApp {{
      databases(
        first: $first
        after: $after
        last: $last
        before: $before
      ) {{
        edges {{
          cursor
          node {{
            {APP_DATABASE_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

CREATE_APP_DATABASE_MUTATION = f"""
mutation srcCreateAppDatabaseMutation($input: CreateAppDBInput!) {{
  createAppDb(input: $input) {{
    database {{
      {APP_DATABASE_FIELDS}
    }}
    password
  }}
}}
"""

CREATE_DATABASE_AND_LINK_TO_APP_MUTATION = f"""
mutation srcCreateDatabaseAndLinkToAppMutation(
  $input: CreateAppDatabaseInput!
) {{
  createDatabaseAndLinkToApp(input: $input) {{
    database {{
      {APP_DATABASE_FIELDS}
    }}
    password
  }}
}}
"""

ROTATE_APP_DATABASE_CREDENTIALS_MUTATION = f"""
mutation srcRotateAppDatabaseCredentialsMutation(
  $input: RotateCredentialsForAppDBInput!
) {{
  rotateCredentialsForAppDb(input: $input) {{
    database {{
      {APP_DATABASE_FIELDS}
    }}
    password
  }}
}}
"""

DELETE_APP_DATABASE_MUTATION = """
mutation srcDeleteAppDatabaseMutation($input: DeleteAppDBInput!) {
  deleteAppDb(input: $input) {
    success
  }
}
"""

GET_APP_GIT_CONNECTION_QUERY = f"""
query srcGetAppGitConnectionQuery($id: ID!) {{
  node(id: $id) {{
    __typename
    ... on DeployApp {{
      githubRepoConnection {{
        {GITHUB_REPO_CONNECTION_FIELDS}
      }}
    }}
  }}
}}
"""

GET_APP_GIT_CONNECTIONS_QUERY = f"""
query srcGetAppGitConnectionsQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on DeployApp {{
      githubRepoConnection {{
        {GITHUB_REPO_CONNECTION_FIELDS}
      }}
    }}
  }}
}}
"""

GET_GITHUB_REPO_UPDATE_TARGET_QUERY = """
query srcGetGithubRepoUpdateTargetQuery($id: ID!) {
  node(id: $id) {
    __typename
  }
}
"""

CONNECT_GITHUB_REPO_TO_APP_MUTATION = f"""
mutation srcConnectGithubRepoToAppMutation(
  $input: ConnectGithubRepoToAppInput!
) {{
  connectGithubRepoToApp(input: $input) {{
    success
    githubRepoConnection {{
      {GITHUB_REPO_CONNECTION_FIELDS}
    }}
  }}
}}
"""

UPDATE_GITHUB_REPO_CONNECTION_MUTATION = f"""
mutation srcUpdateGithubRepoConnectionMutation(
  $input: UpdateGithubRepoAppConnectionInput!
) {{
  updateGithubRepoConnection(input: $input) {{
    success
    githubRepoConnection {{
      {GITHUB_REPO_CONNECTION_FIELDS}
    }}
  }}
}}
"""

DISCONNECT_GITHUB_REPO_FROM_APP_MUTATION = """
mutation srcDisconnectGithubRepoFromAppMutation(
  $input: DisconnectGithubRepoFromAppInput!
) {
  disconnectGithubRepoFromApp(input: $input) {
    success
  }
}
"""

VERIFY_APP_DOMAIN_MUTATION = """
mutation srcVerifyAppDomainMutation($input: VerifyAppDomainInput!) {
  verifyAppDomain(input: $input) {
    verified
  }
}
"""

DELETE_APP_DOMAIN_MUTATION = """
mutation srcDeleteAppDomainMutation($input: DeleteAppDomainInput!) {
  deleteAppDomain(input: $input) {
    success
    id
  }
}
"""

LIST_APP_VERSIONS_QUERY = f"""
query srcListAppVersionsQuery(
  $appId: ID!
  $createdAfter: DateTime
  $sortBy: DeployAppVersionsSortBy
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $appId) {{
    ... on DeployApp {{
      versions(
        createdAfter: $createdAfter
        sortBy: $sortBy
        first: $first
        after: $after
        last: $last
        before: $before
      ) {{
        edges {{
          cursor
          node {{
            id
            app {{
              {APP_FIELDS}
            }}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

GET_APP_LOGS_QUERY = """
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
"""

GET_APP_SSH_SERVER_QUERY = f"""
query srcGetAppSshServerQuery($id: ID!) {{
  node(id: $id) {{
    ... on DeployApp {{
      sshServer {{
        {SSH_SERVER_FIELDS}
      }}
    }}
  }}
}}
"""

GET_APP_SSH_SERVERS_QUERY = f"""
query srcGetAppSshServersQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on DeployApp {{
      id
      sshServer {{
        {SSH_SERVER_FIELDS}
      }}
    }}
  }}
}}
"""

TOGGLE_SSH_SERVER_MUTATION = f"""
mutation srcToggleSshServerMutation($input: ToggleSshServerInput!) {{
  toggleSshServer(input: $input) {{
    sshServer {{
      {SSH_SERVER_FIELDS}
    }}
  }}
}}
"""

GENERATE_SSH_TOKEN_MUTATION = """
mutation srcGenerateSshTokenMutation($input: GenerateSshTokenInput!) {
  generateSshToken(input: $input) {
    token
  }
}
"""

GET_APP_SSH_USERS_QUERY = f"""
query srcGetAppSshUsersQuery(
  $id: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $id) {{
    ... on DeployApp {{
      sshServer {{
        users(first: $first, after: $after, last: $last, before: $before) {{
          edges {{
            cursor
            node {{
              {SSH_USER_FIELDS}
            }}
          }}
          pageInfo {{
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }}
          totalCount
        }}
      }}
    }}
  }}
}}
"""

GET_SSH_USER_BY_ID_QUERY = f"""
query srcGetSshUserByIdQuery($id: ID!) {{
  node(id: $id) {{
    __typename
    ... on SshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

GET_SSH_USERS_BY_IDS_QUERY = f"""
query srcGetSshUsersByIdsQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on SshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

EDIT_SSH_USER_MUTATION = f"""
mutation srcEditSshUserMutation($input: EditSshUserInput!) {{
  editSshUser(input: $input) {{
    sshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

REVEAL_SSH_USER_PASSWORD_MUTATION = f"""
mutation srcRevealSshUserPasswordMutation($input: RevealSshUserPasswordInput!) {{
  revealSshUserPassword(input: $input) {{
    password
    sshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

ROTATE_SSH_USER_PASSWORD_MUTATION = f"""
mutation srcRotateSshUserPasswordMutation($input: RotateSshUserPasswordInput!) {{
  rotateSshUserPassword(input: $input) {{
    password
    sshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

GET_SSH_AUTHORIZED_KEYS_QUERY = f"""
query srcGetSshAuthorizedKeysQuery(
  $id: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $id) {{
    ... on SshUser {{
      authorizedKeys(first: $first, after: $after, last: $last, before: $before) {{
        edges {{
          cursor
          node {{
            {AUTHORIZED_KEY_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

ADD_SSH_AUTHORIZED_KEY_MUTATION = f"""
mutation srcAddSshAuthorizedKeyMutation($input: AddSshAuthorizedKeyInput!) {{
  addSshAuthorizedKey(input: $input) {{
    authorizedKey {{
      {AUTHORIZED_KEY_FIELDS}
    }}
  }}
}}
"""

DELETE_SSH_AUTHORIZED_KEY_MUTATION = """
mutation srcDeleteSshAuthorizedKeyMutation($input: DeleteSshAuthorizedKeyInput!) {
  deleteSshAuthorizedKey(input: $input) {
    success
  }
}
"""

DELETE_SSH_AUTHORIZED_KEY_BY_ID_MUTATION = """
mutation srcDeleteSshAuthorizedKeyByIdMutation(
  $input: DeleteSshAuthorizedKeyByIdInput!
) {
  deleteSshAuthorizedKeyById(input: $input) {
    success
  }
}
"""

LIST_DNS_DOMAINS_QUERY = f"""
query srcListDNSDomainsQuery(
  $owner: ID
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  getAllDomains(
    ownerId: $owner
    first: $first
    after: $after
    last: $last
    before: $before
  ) {{
    edges {{
      cursor
      node {{
        {DNS_DOMAIN_LIST_FIELDS}
      }}
    }}
    pageInfo {{
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }}
    totalCount
  }}
}}
"""

GET_DNS_DOMAINS_QUERY = f"""
query srcGetDNSDomainsQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on DNSDomain {{
      {DNS_DOMAIN_FIELDS}
    }}
  }}
}}
"""

GET_DNS_DOMAIN_BY_NAME_QUERY = f"""
query srcGetDNSDomainByNameQuery($name: String!) {{
  getDomain(name: $name) {{
    {DNS_DOMAIN_FIELDS}
  }}
}}
"""

REGISTER_DNS_DOMAIN_MUTATION = f"""
mutation srcRegisterDNSDomainMutation($input: RegisterDomainInput!) {{
  registerDomain(input: $input) {{
    success
    domain {{
      {DNS_DOMAIN_FIELDS}
    }}
  }}
}}
"""

UPSERT_DNS_DOMAIN_FROM_ZONE_FILE_MUTATION = f"""
mutation srcUpsertDNSDomainFromZoneFileMutation(
  $input: UpsertDomainFromZoneFileInput!
) {{
  upsertDomainFromZoneFile(input: $input) {{
    success
    domain {{
      {DNS_DOMAIN_FIELDS}
    }}
  }}
}}
"""

DELETE_DNS_DOMAIN_MUTATION = """
mutation srcDeleteDNSDomainMutation($input: DeleteDomainInput!) {
  deleteDomain(input: $input) {
    success
  }
}
"""

LIST_DNS_RECORDS_QUERY = f"""
query srcListDNSRecordsQuery($domainId: ID!) {{
  node(id: $domainId) {{
    __typename
    ... on DNSDomain {{
      records {{
        {DNS_RECORD_FIELDS}
      }}
    }}
  }}
}}
"""

LIST_DNS_RECORDS_CONNECTION_QUERY = f"""
query srcListDNSRecordsConnectionQuery(
  $domainId: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
  $sortBy: DNSRecordsSortBy
) {{
  node(id: $domainId) {{
    __typename
    ... on DNSDomain {{
      recordsConnection(
        first: $first
        after: $after
        last: $last
        before: $before
        sortBy: $sortBy
      ) {{
        edges {{
          cursor
          node {{
            {DNS_RECORD_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

GET_DNS_RECORDS_QUERY = f"""
query srcGetDNSRecordsQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    {DNS_RECORD_FIELDS}
  }}
}}
"""

UPSERT_DNS_RECORD_MUTATION = f"""
mutation srcUpsertDNSRecordMutation($input: UpsertDNSRecordInput!) {{
  upsertDNSRecord(input: $input) {{
    success
    record {{
      {DNS_RECORD_FIELDS}
    }}
  }}
}}
"""

DELETE_DNS_RECORD_MUTATION = """
mutation srcDeleteDNSRecordMutation($input: DeleteDNSRecordInput!) {
  deleteDNSRecord(input: $input) {
    success
  }
}
"""

UPDATE_DNS_RECORDS_MUTATION = f"""
mutation srcUpdateDNSRecordsMutation($input: UpdateDNSRecordsInput!) {{
  updateDNSRecords(input: $input) {{
    success
    records {{
      {DNS_RECORD_FIELDS}
    }}
  }}
}}
"""

LIST_SENT_EMAILS_QUERY = f"""
query srcListSentEmailsQuery(
  $id: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $id) {{
    __typename
    ... on DeployApp {{
      emails: sentEmails(first: $first, after: $after, last: $last, before: $before) {{
        edges {{
          cursor
          node {{
            {EMAIL_MESSAGE_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
    ... on Namespace {{
      emails: sentEmails(first: $first, after: $after, last: $last, before: $before) {{
        edges {{
          cursor
          node {{
            {EMAIL_MESSAGE_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
    ... on User {{
      emails: sentEmails(first: $first, after: $after, last: $last, before: $before) {{
        edges {{
          cursor
          node {{
            {EMAIL_MESSAGE_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

LIST_RECEIVED_EMAILS_QUERY = f"""
query srcListReceivedEmailsQuery(
  $id: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $id) {{
    __typename
    ... on DeployApp {{
      emails: receivedEmails(
        first: $first
        after: $after
        last: $last
        before: $before
      ) {{
        edges {{
          cursor
          node {{
            {EMAIL_MESSAGE_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
    ... on Namespace {{
      emails: receivedEmails(
        first: $first
        after: $after
        last: $last
        before: $before
      ) {{
        edges {{
          cursor
          node {{
            {EMAIL_MESSAGE_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
    ... on User {{
      emails: receivedEmails(
        first: $first
        after: $after
        last: $last
        before: $before
      ) {{
        edges {{
          cursor
          node {{
            {EMAIL_MESSAGE_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

SEND_APP_EMAIL_MUTATION = f"""
mutation srcSendAppEmailMutation($input: SendAppEmailInput!) {{
  sendAppEmail(input: $input) {{
    success
    message {{
      {EMAIL_MESSAGE_FIELDS}
    }}
  }}
}}
"""

PACKAGE_VERSION_FIELDS = """
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
"""

SEARCH_PACKAGES_QUERY = f"""
query srcSearchPackagesQuery(
  $query: String!
  $first: Int
  $after: String
  $last: Int
  $before: String
  $packages: PackagesFilter
) {{
  search(
    query: $query
    packages: $packages
    first: $first
    after: $after
    last: $last
    before: $before
  ) {{
    edges {{
      cursor
      node {{
        __typename
        ... on PackageVersion {{
          {PACKAGE_VERSION_FIELDS}
        }}
      }}
    }}
    pageInfo {{
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }}
    totalCount
  }}
}}
"""

PACKAGE_DISTRIBUTION_FIELDS = """
piritaSha256Hash
piritaDownloadUrl
downloadUrl
size
piritaSize
webcVersion
webcManifest
"""

GET_PACKAGE_QUERY = f"""
query srcGetPackageQuery($name: String!) {{
  getPackage(name: $name) {{
    id
    packageName
    namespace
    private
    isArchived
    archivedBy {{ username }}
    lastVersion {{
      id
      version
      createdAt
      distribution {{ {PACKAGE_DISTRIBUTION_FIELDS} }}
    }}
  }}
}}
"""

RESOLVE_PACKAGE_VERSION_QUERY = f"""
query srcResolvePackageVersionQuery($name: String!, $version: String!) {{
  getPackageVersion(name: $name, version: $version) {{
    id
    version
    createdAt
    distribution {{ {PACKAGE_DISTRIBUTION_FIELDS} }}
    yankedAt
    yankReason
    yankedBy {{ username }}
    rebuilds {{
      id
      version
      createdAt
      distribution {{ {PACKAGE_DISTRIBUTION_FIELDS} }}
    }}
  }}
}}
"""

YANK_PACKAGE_VERSIONS_MUTATION = """
mutation srcYankPackageVersionsMutation($input: YankPackageVersionsInput!) {
  yankPackageVersions(input: $input) {
    packageVersions {
      id
      version
      yankedAt
      yankReason
    }
  }
}
"""

GET_PACKAGE_ID_QUERY = """
query srcGetPackageIdQuery($name: String!) {
  getPackage(name: $name) {
    id
  }
}
"""

SET_PACKAGE_ARCHIVED_MUTATION = """
mutation srcSetPackageArchivedMutation($id: ID!, $archived: Boolean!) {
  setPackageArchived(input: { packageId: $id, archived: $archived }) {
    package {
      id
      isArchived
    }
  }
}
"""

GET_APP_CACHE_QUERY = """
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
"""

CONFIGURE_APP_CDN_CACHE_MUTATION = """
mutation srcConfigureAppCdnCacheMutation(
  $app: ID!
  $config: AppCdnCacheConfigUpdate!
) {
  configureAppCdnCache(app: $app, config: $config) {
    success
  }
}
"""

PURGE_APP_CDN_CACHE_MUTATION = """
mutation srcPurgeAppCdnCacheMutation($app: ID!) {
  purgeAppCdnCache(app: $app) {
    success
  }
}
"""

CRON_JOB_FIELDS = """
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
"""

LIST_APP_CRON_JOBS_QUERY = f"""
query srcListAppCronJobsQuery(
  $appId: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
  $kind: CronJobKind
  $sortBy: CronJobsSortBy
) {{
  node(id: $appId) {{
    ... on DeployApp {{
      cronJobs(
        first: $first
        after: $after
        last: $last
        before: $before
        kind: $kind
        sortBy: $sortBy
      ) {{
        edges {{
          cursor
          node {{
            {CRON_JOB_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

GET_CRON_JOBS_BY_IDS_QUERY = f"""
query srcGetCronJobsByIdsQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on CronJob {{
      {CRON_JOB_FIELDS}
    }}
  }}
}}
"""

CREATE_CRON_JOB_MUTATION = f"""
mutation srcCreateCronJobMutation($input: CreateCronJobInput!) {{
  createCronJob(input: $input) {{
    cronJob {{
      {CRON_JOB_FIELDS}
    }}
  }}
}}
"""

UPDATE_CRON_JOB_MUTATION = f"""
mutation srcUpdateCronJobMutation($input: UpdateCronJobInput!) {{
  updateCronJob(input: $input) {{
    cronJob {{
      {CRON_JOB_FIELDS}
    }}
  }}
}}
"""

DELETE_CRON_JOB_MUTATION = """
mutation srcDeleteCronJobMutation($input: DeleteCronJobInput!) {
  deleteCronJob(input: $input) {
    success
    deletedCronJobId
  }
}
"""
