/**
 * @generated SignedSource<<c13f68765361283175cb5ce54ac1addd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteAppDomainInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type srcDeleteAppDomainMutation$variables = {
  input: DeleteAppDomainInput;
};
export type srcDeleteAppDomainMutation$data = {
  readonly deleteAppDomain: {
    readonly success: boolean;
  } | null | undefined;
};
export type srcDeleteAppDomainMutation = {
  response: srcDeleteAppDomainMutation$data;
  variables: srcDeleteAppDomainMutation$variables;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "success",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcDeleteAppDomainMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteAppDomainPayload",
        "kind": "LinkedField",
        "name": "deleteAppDomain",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcDeleteAppDomainMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteAppDomainPayload",
        "kind": "LinkedField",
        "name": "deleteAppDomain",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "300818621088b8f2a74ee7f3b2967566",
    "id": null,
    "metadata": {},
    "name": "srcDeleteAppDomainMutation",
    "operationKind": "mutation",
    "text": "mutation srcDeleteAppDomainMutation(\n  $input: DeleteAppDomainInput!\n) {\n  deleteAppDomain(input: $input) {\n    success\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "0e4f03a67822bea6f88f890af2ef9a99";

export default node;
