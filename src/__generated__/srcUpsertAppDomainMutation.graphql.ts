/**
 * @generated SignedSource<<3e9351a4a0d231622208f028d7b9ead1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HTTPRedirectType = "PERMANENT_MOVED" | "PERMANENT_REDIRECT" | "TEMPORARY_FOUND" | "TEMPORARY_REDIRECT" | "%future added value";
export type UpsertAppDomainInput = {
  appId: string;
  clientMutationId?: string | null | undefined;
  id?: string | null | undefined;
  name: string;
  redirection?: AppDomainRedirectRules | null | undefined;
  wait?: boolean | null | undefined;
};
export type AppDomainRedirectRules = {
  httpCode: HTTPRedirectType;
  to: string;
};
export type srcUpsertAppDomainMutation$variables = {
  input: UpsertAppDomainInput;
};
export type srcUpsertAppDomainMutation$data = {
  readonly upsertAppDomain: {
    readonly domains: ReadonlyArray<{
      readonly " $fragmentSpreads": FragmentRefs<"srcAppAlias">;
    } | null | undefined> | null | undefined;
    readonly success: boolean;
  } | null | undefined;
};
export type srcUpsertAppDomainMutation = {
  response: srcUpsertAppDomainMutation$data;
  variables: srcUpsertAppDomainMutation$variables;
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
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v5 = [
  (v3/*: any*/),
  (v4/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "srcUpsertAppDomainMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpsertAppDomainPayload",
        "kind": "LinkedField",
        "name": "upsertAppDomain",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AppAlias",
            "kind": "LinkedField",
            "name": "domains",
            "plural": true,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "srcAppAlias"
              }
            ],
            "storageKey": null
          }
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
    "name": "srcUpsertAppDomainMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpsertAppDomainPayload",
        "kind": "LinkedField",
        "name": "upsertAppDomain",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AppAlias",
            "kind": "LinkedField",
            "name": "domains",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hostname",
                "storageKey": null
              },
              (v4/*: any*/),
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
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AppAlias",
                "kind": "LinkedField",
                "name": "redirectsTo",
                "plural": false,
                "selections": (v5/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "f44c95291b552526a04162a74b77233f",
    "id": null,
    "metadata": {},
    "name": "srcUpsertAppDomainMutation",
    "operationKind": "mutation",
    "text": "mutation srcUpsertAppDomainMutation(\n  $input: UpsertAppDomainInput!\n) {\n  upsertAppDomain(input: $input) {\n    success\n    domains {\n      ...srcAppAlias\n      id\n    }\n  }\n}\n\nfragment srcAppAlias on AppAlias {\n  id\n  hostname\n  url\n  state\n  redirectionHttpCode\n  redirectsFrom {\n    id\n    url\n  }\n  redirectsTo {\n    id\n    url\n  }\n  expectedDnsRecords {\n    host\n    recordType\n    value\n  }\n  firstCheckedAt\n  lastCheckedAt\n  updatedAt\n  createdAt\n}\n"
  }
};
})();

(node as any).hash = "223cc103d16763d5021a83d46f70610b";

export default node;
