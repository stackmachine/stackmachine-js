/**
 * @generated SignedSource<<c5ae4e2fdebfe49c5f5843ab9f677f2c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type YankPackageVersionsInput = {
  clientMutationId?: string | null | undefined;
  packageVersionIds: ReadonlyArray<string>;
  reason?: string | null | undefined;
  undo?: boolean | null | undefined;
};
export type srcYankPackageVersionsMutation$variables = {
  input: YankPackageVersionsInput;
};
export type srcYankPackageVersionsMutation$data = {
  readonly yankPackageVersions: {
    readonly packageVersions: ReadonlyArray<{
      readonly id: string;
      readonly version: string;
      readonly yankReason: string | null | undefined;
      readonly yankedAt: any | null | undefined;
    }>;
  } | null | undefined;
};
export type srcYankPackageVersionsMutation = {
  response: srcYankPackageVersionsMutation$data;
  variables: srcYankPackageVersionsMutation$variables;
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
    "concreteType": "YankPackageVersionsPayload",
    "kind": "LinkedField",
    "name": "yankPackageVersions",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PackageVersion",
        "kind": "LinkedField",
        "name": "packageVersions",
        "plural": true,
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
            "name": "version",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "yankedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "yankReason",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcYankPackageVersionsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcYankPackageVersionsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0de67335338e8fa92eed58468776f395",
    "id": null,
    "metadata": {},
    "name": "srcYankPackageVersionsMutation",
    "operationKind": "mutation",
    "text": "mutation srcYankPackageVersionsMutation(\n  $input: YankPackageVersionsInput!\n) {\n  yankPackageVersions(input: $input) {\n    packageVersions {\n      id\n      version\n      yankedAt\n      yankReason\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4bf9227ebe40b78265cc96017fa7c0f9";

export default node;
