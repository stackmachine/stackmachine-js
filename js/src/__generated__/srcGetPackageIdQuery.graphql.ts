/**
 * @generated SignedSource<<813a7208f926f2a104fc284f9cc78a0c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcGetPackageIdQuery$variables = {
  name: string;
};
export type srcGetPackageIdQuery$data = {
  readonly getPackage: {
    readonly id: string;
  } | null | undefined;
};
export type srcGetPackageIdQuery = {
  response: srcGetPackageIdQuery$data;
  variables: srcGetPackageIdQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      }
    ],
    "concreteType": "Package",
    "kind": "LinkedField",
    "name": "getPackage",
    "plural": false,
    "selections": [
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetPackageIdQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcGetPackageIdQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "851a45089cc85e65891969ea3e9b546b",
    "id": null,
    "metadata": {},
    "name": "srcGetPackageIdQuery",
    "operationKind": "query",
    "text": "query srcGetPackageIdQuery(\n  $name: String!\n) {\n  getPackage(name: $name) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "02bed2724db3713aedfcc36b2245aea3";

export default node;
