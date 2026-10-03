// A value judged by a component's rules with nothing shown (`validation.judge`): the strongest rule it fails, whatever its trigger,
// or null. A field asked whether it refuses what it holds (`validation.refuses`): every rule judged as a submit would and the verdict
// shown; only an error refuses.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex, WebRenderValidationMetadata } from "../src/metadata/metadata-index.ts";
import type { PropertyPatchEngine } from "../src/updates/property-patch-engine.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");

const ComponentId = 9;
const Positive = real<WebRenderValidationMetadata>({ target: { propertyId: "quantity.value" }, trigger: "Change", operator: "Greater", value: 0, severity: "Error", message: { text: "At least one." } });
const Modest = real<WebRenderValidationMetadata>({ target: { propertyId: "quantity.value" }, trigger: "Blur", operator: "LessOrEqual", value: 100, severity: "Warning", message: { key: "quantity.many" } });
const Noted = real<WebRenderValidationMetadata>({ target: { propertyId: "quantity.value" }, trigger: "Submit", operator: "LessOrEqual", value: 10, severity: "Info", message: { text: "Over ten." } });

const engine = new ValidationEngine({
    root: real<ParentNode>(fakeDocument.body),
    metadata: real<MetadataIndex>({ getValidationsForComponent: (id: number) => id === ComponentId ? [Noted, Modest, Positive] : [], getValidationTarget: () => undefined }),
    dom: real({
        findAllComponents: () => fakeDocument.body.querySelectorAll(`[data-ui-id='${ComponentId}']`),
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
        }
    }),
    propertyPatchEngine: real<PropertyPatchEngine>({ addValueChangeHandler: () => undefined }),
    valueReaders: real({ readBound: (element: FakeInput) => element.value, readHeld: (element: FakeElement) => (element.querySelector("input") as FakeInput | null)?.value })
});

function createField(value: string): { field: FakeElement; input: FakeInput } {
    const input = new FakeInput("text");
    const field = FakeElement.of("ui-text-input", { "data-ui-id": String(ComponentId) }).append(input);

    input.value = value;
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(field);

    return { field, input };
}

test("a value is judged by the strongest rule it fails, whatever the rule's trigger", () => {
    assert.deepEqual(engine.judge(ComponentId, 0), { severity: "error", words: { text: "At least one." } });
    assert.deepEqual(engine.judge(ComponentId, 500), { severity: "warning", words: { key: "quantity.many" } });
    assert.deepEqual(engine.judge(ComponentId, 20), { severity: "info", words: { text: "Over ten." } });
});

test("a value passing every rule, or a component with none, is judged null", () => {
    assert.equal(engine.judge(ComponentId, 5), null);
    assert.equal(engine.judge(ComponentId + 1, 0), null);
});

test("judging shows nothing on the page", () => {
    const { field } = createField("0");

    engine.judge(ComponentId, 0);

    assert.equal(field.classList.contains("ui-invalid"), false);
});

test("a field holding an error's value refuses it and shows why", () => {
    const { field, input } = createField("0");

    assert.equal(engine.refuses(real(input)), true);
    assert.equal(field.classList.contains("ui-invalid"), true);
});

test("a warning or a note only speaks: the field takes the value", () => {
    const { field, input } = createField("500");

    assert.equal(engine.refuses(real(input)), false);
    assert.equal(field.classList.contains("ui-validation--warning"), true);
});

test("a value put right is taken, and the error goes", () => {
    const { field, input } = createField("0");

    assert.equal(engine.refuses(real(input)), true);
    input.value = "4";
    assert.equal(engine.refuses(real(input)), false);
    assert.equal(field.classList.contains("ui-invalid"), false);
});
