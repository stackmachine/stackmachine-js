/**
 * @generated SignedSource<<e236b6e827a06108168c0b3c241b1591>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteAppInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type srcDeleteAppMutation$variables = {
  input: DeleteAppInput;
};
export type srcDeleteAppMutation$data = {
  readonly deleteApp: {
    readonly success: boolean;
  } | null | undefined;
};
export type srcDeleteAppMutation = {
  response: srcDeleteAppMutation$data;
  variables: srcDeleteAppMutation$variables;
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
    "concreteType": "DeleteAppPayload",
    "kind": "LinkedField",
    "name": "deleteApp",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "srcDeleteAppMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDeleteAppMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2f8ce05e13c1e8dd4c1e957104ac2082",
    "id": null,
    "metadata": {},
    "name": "srcDeleteAppMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteAppMutation(\n  $input: DeleteAppInput!\n) {\n  deleteApp(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "57e5927510412f55dc9ad7a2fc658c27";

export default node;
