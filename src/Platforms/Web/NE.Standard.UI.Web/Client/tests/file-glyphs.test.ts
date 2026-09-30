// The client half of the file-glyph parity check, against the same corpus UIFileGlyphsParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { fileGlyph } from "../src/rendering/file-glyphs.ts";

type CorpusCase = { readonly name: string; readonly type: string; readonly glyph: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/file-glyph-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The file-glyph corpus is empty.");

for (const testCase of corpus.cases) {
    test(`"${testCase.name}" ${testCase.type}`, () => {
        assert.equal(fileGlyph(testCase.name, testCase.type), testCase.glyph);
    });
}
