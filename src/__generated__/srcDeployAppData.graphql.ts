/**
 * @generated SignedSource<<838abe95e8815c2555b0ef7e37b967f2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppData$data = {
  readonly activeVersion: {
    readonly id: string;
  } | null | undefined;
  readonly adminUrl: string;
  readonly domains: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"srcAppAlias">;
      } | null | undefined;
    } | null | undefined>;
  };
  readonly favicon: any | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly screenshot: any | null | undefined;
  readonly url: string;
  readonly willPerishAt: any | null | undefined;
  readonly " $fragmentType": "srcDeployAppData";
};
export type srcDeployAppData$key = {
  readonly " $data"?: srcDeployAppData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDeployAppData",
  "selections": [
    (v0/*: any*/),
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
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    },
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
        (v0/*: any*/)
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
  "type": "DeployApp",
  "abstractKey": null
};
})();

(node as any).hash = "b2edc2167f5bf2099616ef0a61c267d5";

export default node;
