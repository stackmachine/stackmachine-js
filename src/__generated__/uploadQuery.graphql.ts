/**
 * @generated SignedSource<<9762a3be8dd2560858240195169c1a7a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type uploadQuery$variables = {
  filename: string;
};
export type uploadQuery$data = {
  readonly getSignedUrl: {
    readonly url: string;
  } | null | undefined;
};
export type uploadQuery = {
  response: uploadQuery$data;
  variables: uploadQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filename"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "filename",
        "variableName": "filename"
      }
    ],
    "concreteType": "SignedUrl",
    "kind": "LinkedField",
    "name": "getSignedUrl",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "url",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "uploadQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "uploadQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fcd2079971563c64ce13747f438513e9",
    "id": null,
    "metadata": {},
    "name": "uploadQuery",
    "operationKind": "query",
    "text": "query uploadQuery(\n  $filename: String!\n) {\n  getSignedUrl(filename: $filename) {\n    url\n  }\n}\n"
  }
};
})();

(node as any).hash = "9df956017328e4bbc39b3adb77bc042f";

export default node;
