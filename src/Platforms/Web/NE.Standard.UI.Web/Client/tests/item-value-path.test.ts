// `readItemValuePath` walks the same template grammar `tryResolveItemTemplateValue` resolves against, but only to collect the
// property names a patch travels through — this is its own corpus coverage, over the shared binding-template corpus.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { readItemValuePath } from "../src/items/binding-template-evaluator.ts";
import type { WebRenderBindingMetadata, WebRenderBindingParameterKind } from "../src/metadata/metadata-index.ts";

type CorpusParameter = { readonly kind: string; readonly componentId?: number; readonly value?: unknown };
type CorpusCase = {
    readonly name: string;
    readonly template: string;
    readonly parameters: readonly CorpusParameter[];
    readonly itemValuePath?: readonly string[] | null;
};

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/binding-template-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The binding-template corpus is empty.");
assert.ok(corpus.cases.some(testCase => testCase.itemValuePath !== undefined), "No corpus case carries an itemValuePath to check.");

for (const testCase of corpus.cases) {
    if (testCase.itemValuePath === undefined)
        continue;

    test(`item value path: ${testCase.name}`, () => {
        const binding: WebRenderBindingMetadata = {
            componentId: 0,
            propertyId: "x",
            bindingId: 0,
            itemTemplate: testCase.template,
            itemTemplateParameters: testCase.parameters.map(parameter => ({
                kind: parameter.kind as WebRenderBindingParameterKind,
                componentId: parameter.componentId,
                value: parameter.value
            }))
        };

        const path = readItemValuePath(binding);

        if (testCase.itemValuePath === null) {
            assert.equal(path, null);
            return;
        }

        assert.notEqual(path, null);
        assert.deepEqual(path?.steps.filter(step => step.kind === "property").map(step => step.name), testCase.itemValuePath);
    });
}
