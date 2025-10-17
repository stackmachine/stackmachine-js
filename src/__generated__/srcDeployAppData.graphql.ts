/**
 * @generated SignedSource<<4839e898555aa60b91d974c746bec532>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppData$data = {
  readonly adminUrl: string;
  readonly domains: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly url: string;
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
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
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
    (v1/*: any*/),
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
                (v0/*: any*/),
                (v1/*: any*/)
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
  "type": "DeployApp",
  "abstractKey": null
};
})();

(node as any).hash = "48a07f72f9cac3afe1dc2b0a646db030";

export default node;
