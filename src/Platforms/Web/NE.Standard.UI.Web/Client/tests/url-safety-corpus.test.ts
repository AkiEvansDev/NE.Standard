// The client half of the one address rule, against the corpus UrlSafetyCorpusTests reads: a picture's source as either side writes
// it, and a return address a navigation may go to.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { isLocalRoute, readImageSource } from "../src/rendering/url-safety.ts";

type PictureCase = { readonly name: string; readonly value: string; readonly source: string | null };
type RouteCase = { readonly name: string; readonly value: string; readonly local: boolean };

const here = dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(readFileSync(resolve(here, "../../../../../../eng/Tests/Shared/url-safety-corpus.json"), "utf8")) as {
    readonly pictures: readonly PictureCase[];
    readonly localRoutes: readonly RouteCase[];
};

assert.ok(corpus.pictures.length > 0 && corpus.localRoutes.length > 0, "The address corpus is empty.");

for (const testCase of corpus.pictures) {
    test(`picture: ${testCase.name}`, () => assert.equal(readImageSource(testCase.value), testCase.source));
}

for (const testCase of corpus.localRoutes) {
    test(`return address: ${testCase.name}`, () => assert.equal(isLocalRoute(testCase.value), testCase.local));
}
