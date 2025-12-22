/**
 * @generated SignedSource<<b42076925f328f66eb272448f8a316dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LogStream = "RUNTIME" | "STDERR" | "STDOUT" | "%future added value";
export type srcGetAppLogsQuery$variables = {
  appId: string;
  since: any;
};
export type srcGetAppLogsQuery$data = {
  readonly node: {
    readonly logs?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly datetime: any;
          readonly instanceId: string;
          readonly message: string;
          readonly stream: LogStream | null | undefined;
          readonly timestamp: number;
        } | null | undefined;
      } | null | undefined>;
    };
  } | null | undefined;
};
export type srcGetAppLogsQuery = {
  response: srcGetAppLogsQuery$data;
  variables: srcGetAppLogsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "appId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "since"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "appId"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "startingFromISO",
          "variableName": "since"
        }
      ],
      "concreteType": "LogConnection",
      "kind": "LinkedField",
      "name": "logs",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "LogEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Log",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "datetime",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "instanceId",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "message",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "stream",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "timestamp",
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
    }
  ],
  "type": "DeployAppVersion",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcGetAppLogsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "srcGetAppLogsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
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
    "cacheID": "3516b5fde92c62ba97630cdb6896aac4",
    "id": null,
    "metadata": {},
    "name": "srcGetAppLogsQuery",
    "operationKind": "query",
    "text": "query srcGetAppLogsQuery(\n  $appId: ID!\n  $since: DateTime!\n) {\n  node(id: $appId) {\n    __typename\n    ... on DeployAppVersion {\n      logs(startingFromISO: $since) {\n        edges {\n          node {\n            datetime\n            instanceId\n            message\n            stream\n            timestamp\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "54773f6336665bf511c1be0e94bf0cd6";

export default node;
