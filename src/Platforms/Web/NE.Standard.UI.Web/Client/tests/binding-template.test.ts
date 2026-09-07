// The client half of the item-template parity check, against the same corpus BindingTemplateParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { tryResolveItemTemplateValue } from "../src/items/binding-template-evaluator.ts";
import type { WebRenderBindingParameterKind } from "../src/metadata/metadata-index.ts";

type CorpusParameter = { readonly kind: string; readonly componentId?: number; readonly value?: unknown };
type CorpusScope = { readonly scopeComponentId: number; readonly item: unknown };
type CorpusCase = {
    readonly name: string;
    readonly template: string;
    readonly parameters: readonly CorpusParameter[];
    readonly stack: readonly CorpusScope[];
    readonly resolved: boolean;
    readonly value?: unknown;
};

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/binding-template-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The binding-template corpus is empty.");

for (const testCase of corpus.cases) {
    test(testCase.name, () => {
        const result = tryResolveItemTemplateValue(
            testCase.stack.map(entry => ({ scopeComponentId: entry.scopeComponentId, item: entry.item })),
            testCase.template,
            testCase.parameters.map(parameter => ({
                kind: parameter.kind as WebRenderBindingParameterKind,
                componentId: parameter.componentId,
                value: parameter.value
            }))
        );

        assert.equal(result.ok, testCase.resolved);

        if (result.ok && testCase.resolved)
            assert.equal(JSON.stringify(result.value ?? null), JSON.stringify(testCase.value ?? null));
    });
}
