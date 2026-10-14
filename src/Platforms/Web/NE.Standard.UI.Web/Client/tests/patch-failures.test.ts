// A patch that meets a failing part — a package's converter or DOM operation, or an operation missing its name — writes the rest of
// the property and records the value: the failure is logged and passed over, never left to stop the patch half-written.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { setLogLevel } = await import("../src/runtime/logger.ts");
const { ConverterRegistry } = await import("../src/extensions/converters.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { PropertyPatchEngine } = await import("../src/updates/property-patch-engine.ts");
const { PropertyStateStore } = await import("../src/state/property-state-store.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

setLogLevel("silent");

function context(kind: string, target: FakeElement, value: unknown): DomOperationContext {
    return { resolved: { componentId: 7, propertyId: "p1", component: target }, operation: { kind }, target, value, convertedValue: value, local: false } as unknown as DomOperationContext;
}

test("a DOM operation that throws is passed over, and the next one is written", () => {
    const registry = new DomOperationRegistry();
    const target = FakeElement.of("ui-text");

    registry.register("Broken", () => {
        throw new Error("a package's operation failed");
    });

    assert.doesNotThrow(() => registry.apply(context("Broken", target, "x")));

    registry.apply(context("Text", target, "written"));

    assert.equal(target.textContent, "written");
});

test("a converter that throws gives the value as it came, as one not found does", () => {
    const converters = new ConverterRegistry();

    converters.register({
        name: "boom",
        convert: () => {
            throw new Error("not a number");
        }
    });

    assert.equal(converters.convert("boom", "raw"), "raw");
});

test("a property whose first operations fail still writes its last one and records the value", () => {
    const component = FakeElement.of("ui-text", { "data-ui-id": "7" });
    const definition = {
        propertyName: "Title",
        operations: [
            { kind: "Text", converter: "boom" },
            // An attribute operation with no name throws as it runs.
            { kind: "Attribute" },
            { kind: "Attribute", name: "data-title" }
        ]
    };
    const addressResolver = {
        resolveProperties: () => [{ component, propertyName: "Title", definition }],
        resolveOperationTargets: () => [component],
        hasRenderedComponent: () => true,
        isTranslatable: () => false
    };
    const converters = new ConverterRegistry();

    converters.register({
        name: "boom",
        convert: () => {
            throw new Error("not a title");
        }
    });

    const state = new PropertyStateStore();
    const patches = new PropertyPatchEngine(real(addressResolver), new DomOperationRegistry(), real({ converters }), state);
    const reference = { componentId: 7, propertyId: "title" };

    patches.applyPropertyValue(reference, [], "Hello", false);

    assert.equal(component.textContent, "Hello");
    assert.equal(component.getAttribute("data-title"), "Hello");
    assert.equal(state.get(reference, []), "Hello");
});
