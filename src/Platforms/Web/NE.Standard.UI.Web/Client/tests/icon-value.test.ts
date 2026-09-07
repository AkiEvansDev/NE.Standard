// The client half of the icon-value parity check, against the same corpus IconValueCorpusTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { iconImageClassName, readIconSource, toIconGlyphClassName, toIconSourceCss } from "../src/rendering/icon-value.ts";

type CorpusCase = { readonly name: string; readonly value: string; readonly class: string; readonly url: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/icon-value-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The icon-value corpus is empty.");

// Takes the same branch the converter does, so both halves are asserted through one path.
function iconClassName(value: string): string {
    const image = readIconSource(value);

    return image !== null
        ? (image.tinted ? "" : iconImageClassName)
        : toIconGlyphClassName(value);
}

for (const testCase of corpus.cases) {
    test(`icon value: ${testCase.name}`, () => {
        assert.equal(iconClassName(testCase.value), testCase.class);
        assert.equal(toIconSourceCss(testCase.value), testCase.url);
    });
}
