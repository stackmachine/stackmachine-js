/**
 * @generated SignedSource<<1654b6af68b27dea387e5bffc9f69678>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppKind$data = {
  readonly __typename: "WordpressAppKind";
  readonly " $fragmentType": "srcDeployAppKind";
} | {
  // This will never be '%other', but we need some
  // value in case none of the concrete values match.
  readonly __typename: "%other";
  readonly " $fragmentType": "srcDeployAppKind";
};
export type srcDeployAppKind$key = {
  readonly " $data"?: srcDeployAppKind$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppKind">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDeployAppKind",
  "selections": [
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
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

(node as any).hash = "784536ddb1bd89ee563f556cce6d24c8";

export default node;
