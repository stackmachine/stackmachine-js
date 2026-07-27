/**
 * @generated SignedSource<<6c0090fadae37be942a5887f5ba570cc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type WebcVersion = "V2" | "V3" | "%future added value";
export type srcGetPackageQuery$variables = {
  name: string;
};
export type srcGetPackageQuery$data = {
  readonly getPackage: {
    readonly archivedBy: {
      readonly username: string;
    } | null | undefined;
    readonly id: string;
    readonly isArchived: boolean;
    readonly lastVersion: {
      readonly createdAt: any;
      readonly distribution: {
        readonly downloadUrl: string;
        readonly piritaDownloadUrl: string | null | undefined;
        readonly piritaSha256Hash: string | null | undefined;
        readonly piritaSize: number | null | undefined;
        readonly size: number | null | undefined;
        readonly webcManifest: any | null | undefined;
        readonly webcVersion: WebcVersion | null | undefined;
      };
      readonly id: string;
      readonly version: string;
    } | null | undefined;
    readonly namespace: string;
    readonly packageName: string;
    readonly private: boolean;
  } | null | undefined;
};
export type srcGetPackageQuery = {
  response: srcGetPackageQuery$data;
  variables: srcGetPackageQuery$variables;
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
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "packageName",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "namespace",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "private",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isArchived",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "PackageVersion",
  "kind": "LinkedField",
  "name": "lastVersion",
  "plural": false,
  "selections": [
    (v2/*: any*/),
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
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PackageDistribution",
      "kind": "LinkedField",
      "name": "distribution",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "piritaSha256Hash",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "piritaDownloadUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "downloadUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "size",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "piritaSize",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "webcVersion",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "webcManifest",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetPackageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Package",
        "kind": "LinkedField",
        "name": "getPackage",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "archivedBy",
            "plural": false,
            "selections": [
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "srcGetPackageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Package",
        "kind": "LinkedField",
        "name": "getPackage",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "archivedBy",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "14a74fc0a4e2003c20c0324e5a68e2db",
    "id": null,
    "metadata": {},
    "name": "srcGetPackageQuery",
    "operationKind": "query",
    "text": "query srcGetPackageQuery(\n  $name: String!\n) {\n  getPackage(name: $name) {\n    id\n    packageName\n    namespace\n    private\n    isArchived\n    archivedBy {\n      username\n      id\n    }\n    lastVersion {\n      id\n      version\n      createdAt\n      distribution {\n        piritaSha256Hash\n        piritaDownloadUrl\n        downloadUrl\n        size\n        piritaSize\n        webcVersion\n        webcManifest\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f07b8520f7ff7657851853bd816e1484";

export default node;
