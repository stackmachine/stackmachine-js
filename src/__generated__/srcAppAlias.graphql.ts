/**
 * @generated SignedSource<<e3a9ab5151db61907ac2d944ca4a6586>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AppAliasVerificationStates = "APEX_WITHOUT_REDIRECTION" | "UNVERIFIED" | "VERIFIED" | "%future added value";
export type HTTPRedirectType = "PERMANENT_MOVED" | "PERMANENT_REDIRECT" | "TEMPORARY_FOUND" | "TEMPORARY_REDIRECT" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type srcAppAlias$data = {
  readonly createdAt: any;
  readonly expectedDnsRecords: ReadonlyArray<{
    readonly host: string;
    readonly recordType: string;
    readonly value: string;
  } | null | undefined> | null | undefined;
  readonly firstCheckedAt: any | null | undefined;
  readonly hostname: string;
  readonly id: string;
  readonly lastCheckedAt: any | null | undefined;
  readonly redirectionHttpCode: HTTPRedirectType | null | undefined;
  readonly redirectsFrom: ReadonlyArray<{
    readonly id: string;
    readonly url: string;
  } | null | undefined> | null | undefined;
  readonly redirectsTo: {
    readonly id: string;
    readonly url: string;
  } | null | undefined;
  readonly state: AppAliasVerificationStates;
  readonly updatedAt: any;
  readonly url: string;
  readonly " $fragmentType": "srcAppAlias";
};
export type srcAppAlias$key = {
  readonly " $data"?: srcAppAlias$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcAppAlias">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcAppAlias",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hostname",
      "storageKey": null
    },
    (v1/*: any*/),
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
      "selections": (v2/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AppAlias",
      "kind": "LinkedField",
      "name": "redirectsTo",
      "plural": false,
      "selections": (v2/*: any*/),
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
  "type": "AppAlias",
  "abstractKey": null
};
})();

(node as any).hash = "9c7a9bdf1bc678fa649dce79715f388f";

export default node;
