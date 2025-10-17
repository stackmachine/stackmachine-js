/**
 * @generated SignedSource<<b8463fa8e3d678db483660815caf6a70>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcGetAppByNameQuery$variables = {
  name: string;
  owner?: string | null | undefined;
};
export type srcGetAppByNameQuery$data = {
  readonly app: {
    readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
  } | null | undefined;
};
export type srcGetAppByNameQuery = {
  response: srcGetAppByNameQuery$data;
  variables: srcGetAppByNameQuery$variables;
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
    "name": "owner"
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
    "name": "owner",
    "variableName": "owner"
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
  "name": "url",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppByNameQuery",
    "selections": [
      {
        "alias": "app",
        "args": (v1/*: any*/),
        "concreteType": "DeployApp",
        "kind": "LinkedField",
        "name": "getDeployApp",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "srcDeployAppData"
          }
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
    "name": "srcGetAppByNameQuery",
    "selections": [
      {
        "alias": "app",
        "args": (v1/*: any*/),
        "concreteType": "DeployApp",
        "kind": "LinkedField",
        "name": "getDeployApp",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "willPerishAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "adminUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "AppAliasConnection",
            "kind": "LinkedField",
            "name": "domains",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AppAliasEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AppAlias",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "favicon",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "screenshot",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "16e0c93c9b0053ad2bffd2190f3e9d3c",
    "id": null,
    "metadata": {},
    "name": "srcGetAppByNameQuery",
    "operationKind": "query",
    "text": "query srcGetAppByNameQuery(\n  $name: String!\n  $owner: String\n) {\n  app: getDeployApp(name: $name, owner: $owner) {\n    ...srcDeployAppData\n    id\n  }\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  name\n  url\n  adminUrl\n  domains {\n    edges {\n      node {\n        id\n        url\n      }\n    }\n  }\n  favicon\n  screenshot\n}\n"
  }
};
})();

(node as any).hash = "c49663697ce7ade26a6e3e91807886b7";

export default node;
