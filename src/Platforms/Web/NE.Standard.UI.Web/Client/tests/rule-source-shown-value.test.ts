// A list's filter reading a field set at authoring time and bound to nothing: no push ever brings its value, so the rule records
// the value the field shows as it starts to watch it, as it records the reader's edit — or the list stays unfiltered until the
// reader types, and typing the same text back never filters it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { ValueReaderRegistry } = await import("../src/extensions/value-readers.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");
const { ReactiveSourceRegistry } = await import("../src/updates/reactive-source-registry.ts");

const FilterValue = { componentId: 7, propertyId: "filter.value" };

function createRegistry(): { readonly state: InstanceType<typeof PropertyStateStore>; readonly sources: InstanceType<typeof ReactiveSourceRegistry> } {
    const state = new PropertyStateStore();
    const addressResolver = { resolveProperties: () => [], isTranslatable: () => false, getPropertyName: () => "Value" };
    const patches = new PropertyPatchEngine(real(addressResolver), real({}), real({ converters: { convert: (_: string, value: unknown) => value } }), state);
    const sources = new ReactiveSourceRegistry(patches, { root: real<ParentNode>(fakeDocument.body), valueReaders: new ValueReaderRegistry() });

    return { state, sources };
}

test("a watched source's field set at authoring time is read as the rule starts to watch it", () => {
    const field = new FakeInput("text");

    field.value = "on";
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-text-input", { "data-ui-id": "7" }).append(field));

    const { state, sources } = createRegistry();

    sources.watch(FilterValue, () => undefined);

    assert.equal(state.get(FilterValue, []), "on");
});

test("a source with no field on the page records nothing", () => {
    fakeDocument.body.children.length = 0;

    const { state, sources } = createRegistry();

    sources.watch(FilterValue, () => undefined);

    assert.equal(state.has(FilterValue, []), false);
});
