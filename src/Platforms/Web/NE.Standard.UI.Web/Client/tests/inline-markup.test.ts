// The client half of the inline-markup parity check, against the same corpus UIInlineMarkupParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { inlineMarkupToPlainText, parseInlineMarkup } from "../src/rendering/inline-markup.ts";

type CorpusSegment = { readonly text: string; readonly styles: number; readonly url: string | null; readonly icon?: string | null; readonly fold?: string | null };
type CorpusCase = { readonly name: string; readonly input: string; readonly segments: readonly CorpusSegment[] };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/inline-markup-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The inline-markup corpus is empty.");

for (const testCase of corpus.cases) {
    test(`inline markup: ${testCase.name}`, () => {
        // `icon` and `fold` are normalised to null on both sides, or an omitted case and an undefined compare unequal.
        const actual = parseInlineMarkup(testCase.input).map(segment => ({
            text: segment.text,
            styles: segment.styles,
            url: segment.url,
            icon: segment.icon ?? null,
            fold: segment.fold ?? null
        }));

        assert.deepEqual(actual, testCase.segments.map(segment => ({ ...segment, icon: segment.icon ?? null, fold: segment.fold ?? null })));
    });
}

test("inline markup: plain text reads a fold unfolded", () => {
    assert.equal(inlineMarkupToPlainText("Frozen. [Why?]{The **branch** is re-cut, [and how]{by the pipeline}.}"), "Frozen. Why? The branch is re-cut, and how by the pipeline.");
});
