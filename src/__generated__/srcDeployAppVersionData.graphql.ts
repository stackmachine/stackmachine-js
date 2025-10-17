/**
 * @generated SignedSource<<10c436297861ac4f569fd6bebbf17a0f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcDeployAppVersionData$data = {
  readonly app: {
    readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppData">;
  };
  readonly id: string;
  readonly " $fragmentType": "srcDeployAppVersionData";
};
export type srcDeployAppVersionData$key = {
  readonly " $data"?: srcDeployAppVersionData$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcDeployAppVersionData">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "srcDeployAppVersionData",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DeployApp",
      "kind": "LinkedField",
      "name": "app",
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
  "type": "DeployAppVersion",
  "abstractKey": null
};

(node as any).hash = "2b885bfc25cdb9ef4ab8a8ced31511b7";

export default node;
