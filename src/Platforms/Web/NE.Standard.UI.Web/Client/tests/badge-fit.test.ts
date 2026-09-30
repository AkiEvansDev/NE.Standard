// The client half of the badge-fit parity check, against the same corpus BadgeFitParityTests reads: two cells make a circle, a
// narrow character one, an East Asian wide one or an emoji two.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

type CorpusCase = { readonly text: string; readonly compact: boolean };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/badge-fit-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };
const fit = webDomConverters.get("badgeTextFit");

assert.ok(corpus.cases.length > 0, "The badge-fit corpus is empty.");
assert.ok(fit !== undefined, "No converter 'badgeTextFit'.");

for (const testCase of corpus.cases) {
    test(JSON.stringify(testCase.text), () => {
        assert.equal(fit(testCase.text), testCase.compact ? "compact" : "");
    });
}

test("no text is no fit", () => {
    assert.equal(fit(""), "");
    assert.equal(fit(null), "");
});
