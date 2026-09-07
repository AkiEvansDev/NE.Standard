// The client half of the kebab-case parity check, against the same corpus WebNamingParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { toKebabCase } from "../src/addressing/dom-attributes.ts";

type CorpusCase = { readonly input: string; readonly expected: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/kebab-case-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The kebab-case corpus is empty.");

for (const testCase of corpus.cases) {
    test(testCase.input, () => {
        assert.equal(toKebabCase(testCase.input), testCase.expected);
    });
}
