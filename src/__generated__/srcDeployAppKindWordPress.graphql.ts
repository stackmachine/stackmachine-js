/**
 * @generated SignedSource<<e16ba75aa4728556e7ba34b2ea294119>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppKindWordPress$data = {
  readonly adminUrl?: string;
  readonly " $fragmentType": "srcDeployAppKindWordPress";
};
export type srcDeployAppKindWordPress$key = {
  readonly " $data"?: srcDeployAppKindWordPress$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppKindWordPress">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDeployAppKindWordPress",
  "selections": [
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "adminUrl",
          "storageKey": null
        }
      ],
      "type": "WordpressAppKind",
      "abstractKey": null
    }
  ],
  "type": "Kind",
  "abstractKey": "__isKind"
};

(node as any).hash = "c0e67cd4572ec8b5e6328ee231f8659f";

export default node;
