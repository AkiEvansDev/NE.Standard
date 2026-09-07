// The client half of the comparison parity check, against the same corpus UIComparisonEvaluatorParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { evaluateOperator } from "../src/interactions/interaction-evaluator.ts";
import type { WebInteractionOperator } from "../src/metadata/metadata-index.ts";

type CorpusCase = {
    readonly name: string;
    readonly left: unknown;
    readonly operator: string;
    readonly right: unknown;
    readonly expected: boolean;
};

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/comparison-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The comparison corpus is empty.");

for (const testCase of corpus.cases) {
    test(testCase.name, () => {
        assert.equal(evaluateOperator(testCase.left, testCase.operator as WebInteractionOperator, testCase.right), testCase.expected);
    });
}
