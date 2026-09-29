// The client half of the plural-rules parity check, against the same CLDR corpus UIPluralRulesParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { selectPlural } from "../src/runtime/plural-rules.ts";

type PluralCase = { readonly language: string; readonly number: number; readonly expected: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/plural-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly PluralCase[] };

assert.ok(corpus.cases.length > 0, "The plural corpus is empty.");

for (const testCase of corpus.cases) {
    test(`${testCase.language} ${testCase.number} is ${testCase.expected}`, () => {
        assert.equal(selectPlural(testCase.language, testCase.number), testCase.expected);
    });
}

test("a number that is no number is other", () => {
    assert.equal(selectPlural("ru", Number.NaN), "other");
    assert.equal(selectPlural("en", Number.POSITIVE_INFINITY), "other");
});
