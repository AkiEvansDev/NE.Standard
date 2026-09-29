// The client half of the item-template parity check, against the same corpus BindingTemplateParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { isContentItem, readsDrawnRow, tryResolveItemTemplateValue } from "../src/items/binding-template-evaluator.ts";
import { FakeElement, real } from "./fake-dom.ts";
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

test("a resolution names the item it read the value off: the innermost, or the one a Dynamic parameter names", () => {
    const outer = { id: "row", title: "Row" };
    const inner = { id: "option", title: "Option" };
    const stack = [{ scopeComponentId: 7, item: outer }, { scopeComponentId: 9, item: inner }];

    const plain = tryResolveItemTemplateValue(stack, "Title", []);
    const named = tryResolveItemTemplateValue(stack, "[].Title", [{ kind: "Dynamic", componentId: 7 }]);

    assert.ok(plain.ok && named.ok);
    assert.equal("scope" in plain ? plain.scope : undefined, inner);
    assert.equal("scope" in named ? named.scope : undefined, outer);
});

test("an item is content only where it says so, under the wire's name or the CLR one", () => {
    assert.equal(isContentItem({ id: "utf8", title: "UTF-8", isContent: true }), true);
    assert.equal(isContentItem({ id: "utf8", title: "UTF-8", IsContent: true }), true);
    assert.equal(isContentItem({ id: "plain", title: "ui.code.plain-text" }), false);
    assert.equal(isContentItem({ id: "odd", isContent: "true" }), false);
    assert.equal(isContentItem(null), false);
    assert.equal(isContentItem("UTF-8"), false);
});

test("a row the server drew inside a template keeps its values: its own scope is never on the stack, and it is not a miss", () => {
    const table = FakeElement.of("ui-table", { "data-ui-id": "136" });
    const drawn = FakeElement.of("ui-table__row", { "data-ui-id": "137", "data-ui-key": "Starter" });
    const built = FakeElement.of("ui-container", { "data-ui-id": "137" });
    const outer = [{ scopeComponentId: 131, item: { id: "SUB-002002" } }];
    const own = [{ kind: "Dynamic" as const, componentId: 137 }];

    table.append(drawn);

    assert.equal(readsDrawnRow(real<Element>(drawn), own, outer), true);
    // A row built from the template holds its item, and one without a drawn row is a real miss the evaluator reports.
    assert.equal(readsDrawnRow(real<Element>(drawn), own, [...outer, { scopeComponentId: 137, item: { id: "Starter" } }]), false);
    assert.equal(readsDrawnRow(real<Element>(built), own, outer), false);
});
