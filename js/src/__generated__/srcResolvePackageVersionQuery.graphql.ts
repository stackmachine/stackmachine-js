/**
 * @generated SignedSource<<52f10bfe998734ed23f62738572dec0b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type WebcVersion = "V2" | "V3" | "%future added value";
export type srcResolvePackageVersionQuery$variables = {
  name: string;
  version: string;
};
export type srcResolvePackageVersionQuery$data = {
  readonly getPackageVersion: {
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
    readonly rebuilds: ReadonlyArray<{
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
    }>;
    readonly version: string;
    readonly yankReason: string | null | undefined;
    readonly yankedAt: any | null | undefined;
    readonly yankedBy: {
      readonly username: string;
    } | null | undefined;
  } | null | undefined;
};
export type srcResolvePackageVersionQuery = {
  response: srcResolvePackageVersionQuery$data;
  variables: srcResolvePackageVersionQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "version"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  },
  {
    "kind": "Variable",
    "name": "version",
    "variableName": "version"
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
  "name": "version",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v5 = {
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
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "yankedAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "yankReason",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "PackageVersion",
  "kind": "LinkedField",
  "name": "rebuilds",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    (v3/*: any*/),
    (v4/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcResolvePackageVersionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "PackageVersion",
        "kind": "LinkedField",
        "name": "getPackageVersion",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "yankedBy",
            "plural": false,
            "selections": [
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/)
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
    "name": "srcResolvePackageVersionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "PackageVersion",
        "kind": "LinkedField",
        "name": "getPackageVersion",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "yankedBy",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2e66d5e5e76d315d23528be923f99afb",
    "id": null,
    "metadata": {},
    "name": "srcResolvePackageVersionQuery",
    "operationKind": "query",
    "text": "query srcResolvePackageVersionQuery(\n  $name: String!\n  $version: String!\n) {\n  getPackageVersion(name: $name, version: $version) {\n    id\n    version\n    createdAt\n    distribution {\n      piritaSha256Hash\n      piritaDownloadUrl\n      downloadUrl\n      size\n      piritaSize\n      webcVersion\n      webcManifest\n    }\n    yankedAt\n    yankReason\n    yankedBy {\n      username\n      id\n    }\n    rebuilds {\n      id\n      version\n      createdAt\n      distribution {\n        piritaSha256Hash\n        piritaDownloadUrl\n        downloadUrl\n        size\n        piritaSize\n        webcVersion\n        webcManifest\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd36635b82b69a74ab26f88de8441f8b";

export default node;
