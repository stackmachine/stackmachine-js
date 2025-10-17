/**
 * @generated SignedSource<<3b15f5a8114480d48b66ca55cc542aa1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeployViaAutobuildInput = {
  allowExistingApp?: boolean | null | undefined;
  appId?: string | null | undefined;
  appName?: string | null | undefined;
  basePath?: string | null | undefined;
  branch?: string | null | undefined;
  buildCmd?: string | null | undefined;
  clientMutationId?: string | null | undefined;
  domains?: ReadonlyArray<string | null | undefined> | null | undefined;
  enableDatabase?: boolean | null | undefined;
  extraData?: AutobuildDeploymentExtraData | null | undefined;
  installCmd?: string | null | undefined;
  jobs?: ReadonlyArray<JobDefinitionInput | null | undefined> | null | undefined;
  kind?: string | null | undefined;
  managed?: boolean | null | undefined;
  owner?: string | null | undefined;
  params?: AutobuildDeploymentExtraData | null | undefined;
  region?: string | null | undefined;
  repoUrl?: string | null | undefined;
  secrets?: ReadonlyArray<SecretInput | null | undefined> | null | undefined;
  uploadUrl?: string | null | undefined;
  waitForScreenshotGeneration?: boolean | null | undefined;
};
export type AutobuildDeploymentExtraData = {
  wordpress?: WordpressDeploymentExtraData | null | undefined;
};
export type WordpressDeploymentExtraData = {
  adminEmail: string;
  adminPassword: string;
  adminUsername: string;
  language?: string | null | undefined;
  siteName: string;
};
export type JobDefinitionInput = {
  cliArgs?: ReadonlyArray<string | null | undefined> | null | undefined;
  command: string;
  env?: ReadonlyArray<string | null | undefined> | null | undefined;
  name?: string | null | undefined;
  package?: string | null | undefined;
  timeout?: string | null | undefined;
};
export type SecretInput = {
  name: string;
  value: string;
};
export type srcAutobuildMutation$variables = {
  input: DeployViaAutobuildInput;
};
export type srcAutobuildMutation$data = {
  readonly deployViaAutobuild: {
    readonly buildId: any;
    readonly success: boolean;
  } | null | undefined;
};
export type srcAutobuildMutation = {
  response: srcAutobuildMutation$data;
  variables: srcAutobuildMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "DeployViaAutobuildPayload",
    "kind": "LinkedField",
    "name": "deployViaAutobuild",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "buildId",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcAutobuildMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcAutobuildMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b34d983c369a9159e4613e12da2da02e",
    "id": null,
    "metadata": {},
    "name": "srcAutobuildMutation",
    "operationKind": "mutation",
    "text": "mutation srcAutobuildMutation(\n  $input: DeployViaAutobuildInput!\n) {\n  deployViaAutobuild(input: $input) {\n    success\n    buildId\n  }\n}\n"
  }
};
})();

(node as any).hash = "2041084de3f9bd75df495fb2a4df97e5";

export default node;
