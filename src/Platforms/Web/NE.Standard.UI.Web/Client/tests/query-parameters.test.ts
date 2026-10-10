// The client half of the query-parameters parity check, against the same corpus UINavigationAddressParityTests reads: the page reads
// its address's query as the host reads a request's, and a test page opens an address the same way.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { readQueryParameters } from "../src/effects/address-history.ts";

type CorpusCase = {
    readonly name: string;
    readonly search: string;
    readonly parameters: Record<string, unknown> | null;
};

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/query-parameters-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

test("the corpus is read", () => {
    assert.ok(corpus.cases.length > 5);
});

for (const corpusCase of corpus.cases) {
    test(`a query reads as the host reads it: ${corpusCase.name}`, () => {
        assert.deepEqual(readQueryParameters(corpusCase.search), corpusCase.parameters);
    });
}
