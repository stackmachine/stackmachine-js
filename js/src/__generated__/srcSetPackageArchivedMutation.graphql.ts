/**
 * @generated SignedSource<<5c5a4b630234a4bcfa0c7b794885b5f1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type srcSetPackageArchivedMutation$variables = {
  archived: boolean;
  id: string;
};
export type srcSetPackageArchivedMutation$data = {
  readonly setPackageArchived: {
    readonly package: {
      readonly id: string;
      readonly isArchived: boolean;
    };
  } | null | undefined;
};
export type srcSetPackageArchivedMutation = {
  response: srcSetPackageArchivedMutation$data;
  variables: srcSetPackageArchivedMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "archived"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "archived",
            "variableName": "archived"
          },
          {
            "kind": "Variable",
            "name": "packageId",
            "variableName": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "SetPackageArchivedPayload",
    "kind": "LinkedField",
    "name": "setPackageArchived",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Package",
        "kind": "LinkedField",
        "name": "package",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isArchived",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "srcSetPackageArchivedMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "srcSetPackageArchivedMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e5d3cce30c94493a36c14a09aa4aecc5",
    "id": null,
    "metadata": {},
    "name": "srcSetPackageArchivedMutation",
    "operationKind": "mutation",
    "text": "mutation srcSetPackageArchivedMutation(\n  $id: ID!\n  $archived: Boolean!\n) {\n  setPackageArchived(input: {packageId: $id, archived: $archived}) {\n    package {\n      id\n      isArchived\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d5ee1c85b68f7e5a7c0284f1775d589b";

export default node;
