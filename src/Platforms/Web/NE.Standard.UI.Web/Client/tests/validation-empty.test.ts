// An empty field says only that it is required: every rule but `Required` passes on an empty value — a pattern, a length, a range, a
// comparison — so tabbing through an untouched form marks no field with a rule it could only fail by being empty. A toggle's `false` is
// a value, not an empty one, and a value given is judged by every rule as before.

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

const Email = 1;
const Optional = 2;
const Accept = 3;
const Tags = 4;

function rule(operator: string, value: unknown, text: string, trigger = "Blur"): WebRenderValidationMetadata {
    return real<WebRenderValidationMetadata>({ target: { propertyId: "field.value" }, trigger, operator, value, severity: "Error", message: { text } });
}

const Required = rule("Required", null, "Required.", "Submit");
const Pattern = rule("Regex", "^[^@]+@[^@]+$", "Not an address.");
const Long = rule("Regex", "^.{3,}$", "Three letters at least.");
const Positive = rule("Greater", 0, "Above nothing.", "Change");
const Accepted = rule("Equal", true, "Accept it.");
const Listed = rule("In", ["a", "b"], "Not one of them.");

const rules = new Map<number, readonly WebRenderValidationMetadata[]>([
    [Email, [Required, Pattern]],
    [Optional, [Long, Positive]],
    [Accept, [Accepted]],
    [Tags, [Listed]]
]);

const engine = new ValidationEngine({
    root: real<ParentNode>(fakeDocument.body),
    metadata: real<MetadataIndex>({ getValidationsForComponent: (id: number) => rules.get(id) ?? [], getValidationTarget: () => undefined, getValidationsAgainst: () => [] }),
    dom: real({
        findAllComponents: () => [],
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
        }
    }),
    propertyPatchEngine: real<PropertyPatchEngine>({ addValueChangeHandler: () => undefined }),
    valueReaders: real({ readBound: (element: FakeInput) => element.value, readHeld: (element: FakeElement) => (element.querySelector("input") as FakeInput | null)?.value })
});

test("an empty required field fails only its Required, not the pattern it has nothing to match", () => {
    assert.deepEqual(engine.judge(Email, ""), { severity: "error", words: { text: "Required." } });
    assert.deepEqual(engine.judge(Email, "   "), { severity: "error", words: { text: "Required." } });
    assert.deepEqual(engine.judge(Email, null), { severity: "error", words: { text: "Required." } });
});

test("an empty optional field passes its pattern and its range", () => {
    assert.equal(engine.judge(Optional, ""), null);
    assert.equal(engine.judge(Optional, undefined), null);
    assert.equal(engine.judge(Tags, []), null);
});

test("a value given is judged by every rule", () => {
    assert.deepEqual(engine.judge(Email, "ann"), { severity: "error", words: { text: "Not an address." } });
    assert.deepEqual(engine.judge(Optional, "ab"), { severity: "error", words: { text: "Three letters at least." } });
    assert.deepEqual(engine.judge(Tags, "c"), { severity: "error", words: { text: "Not one of them." } });
});

test("a toggle's false is a value, judged by its rule", () => {
    assert.deepEqual(engine.judge(Accept, false), { severity: "error", words: { text: "Accept it." } });
    assert.equal(engine.judge(Accept, true), null);
});

test("an empty field left by the reader shows no error and is not refused", () => {
    const input = new FakeInput("text");
    const field = FakeElement.of("ui-text-input", { "data-ui-id": String(Optional) }).append(input);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(field);

    assert.equal(engine.refuses(real(input)), false);
    assert.equal(field.classList.contains("ui-invalid"), false);
});
