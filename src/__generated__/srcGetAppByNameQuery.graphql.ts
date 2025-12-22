/**
 * @generated SignedSource<<655440b6ef8176b0d87f57ba4b9a8607>>
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
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/)
];
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hostname",
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "state",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "redirectionHttpCode",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AppAlias",
                        "kind": "LinkedField",
                        "name": "redirectsFrom",
                        "plural": true,
                        "selections": (v4/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AppAlias",
                        "kind": "LinkedField",
                        "name": "redirectsTo",
                        "plural": false,
                        "selections": (v4/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AppAliasDNSRecord",
                        "kind": "LinkedField",
                        "name": "expectedDnsRecords",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "host",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "recordType",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "value",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "firstCheckedAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "lastCheckedAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "updatedAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "createdAt",
                        "storageKey": null
                      }
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
            "concreteType": "DeployAppVersion",
            "kind": "LinkedField",
            "name": "activeVersion",
            "plural": false,
            "selections": [
              (v2/*: any*/)
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
    "cacheID": "612c9449f91b1c4372c70bf7e578cd55",
    "id": null,
    "metadata": {},
    "name": "srcGetAppByNameQuery",
    "operationKind": "query",
    "text": "query srcGetAppByNameQuery(\n  $name: String!\n  $owner: String\n) {\n  app: getDeployApp(name: $name, owner: $owner) {\n    ...srcDeployAppData\n    id\n  }\n}\n\nfragment srcAppAlias on AppAlias {\n  id\n  hostname\n  url\n  state\n  redirectionHttpCode\n  redirectsFrom {\n    id\n    url\n  }\n  redirectsTo {\n    id\n    url\n  }\n  expectedDnsRecords {\n    host\n    recordType\n    value\n  }\n  firstCheckedAt\n  lastCheckedAt\n  updatedAt\n  createdAt\n}\n\nfragment srcDeployAppData on DeployApp {\n  id\n  willPerishAt\n  name\n  url\n  adminUrl\n  domains {\n    edges {\n      node {\n        ...srcAppAlias\n        id\n      }\n    }\n  }\n  activeVersion {\n    id\n  }\n  favicon\n  screenshot\n}\n"
  }
};
})();

(node as any).hash = "c49663697ce7ade26a6e3e91807886b7";

export default node;
