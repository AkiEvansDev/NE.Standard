// What a rule reads when the reader leaves a field: the component's value, where the control left holds none of its own — a
// select's trigger, a free-text multi-select's entry, whose text is a draft — and the control itself where it is the value. And
// what refuses a tag before it is a chip: the first error rule the next value fails where the current one passes.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
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

let rules: WebRenderValidationMetadata[] = [];
// The component's value as its holder keeps it, and what the control left reads as itself.
let held: unknown = null;
const readAsItself: Element[] = [];

const engine = new ValidationEngine({
    root: real<ParentNode>(fakeDocument.body),
    metadata: stub<MetadataIndex>({ getValidationsForComponent: () => rules, getValidationTarget: () => undefined }),
    dom: stub({
        resolveNearestComponent: (target: FakeElement) => {
            const element = target.closest(`[data-ui-id='${ComponentId}']`);

            return element === null ? null : { componentId: ComponentId, element };
        },
        findAllComponents: () => fakeDocument.body.querySelectorAll(`[data-ui-id='${ComponentId}']`)
    }),
    propertyPatchEngine: stub<PropertyPatchEngine>({ addValueChangeHandler: () => undefined }),
    valueReaders: stub({
        readBound: (element: Element) => {
            readAsItself.push(element);
            return (element as unknown as FakeInput).value ?? null;
        },
        readHeld: () => held
    })
});

function stub<T>(value: object): T {
    return value as T;
}

function rule(trigger: string, operator: string, value: unknown, message: string): WebRenderValidationMetadata {
    return stub<WebRenderValidationMetadata>({ target: { componentId: ComponentId, propertyId: "Value" }, trigger, operator, value, severity: "Error", message: { text: message } });
}

/** A field's root holding one control the reader leaves, and the control. */
function field(control: FakeElement): FakeElement {
    const root = FakeElement.of("ui-multi-select", { "data-ui-id": String(ComponentId) }).append(FakeElement.of("ui-select__trigger").append(control));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    readAsItself.length = 0;

    return root;
}

function leave(control: FakeElement): void {
    control.dispatchEvent(new FakeEvent("focus"));
    control.dispatchEvent(new FakeEvent("blur"));
}

test("leaving a free-text entry reads the chips, not the draft: a required field with a chip is answered", () => {
    const entry = new FakeInput();

    entry.setAttribute("data-ui-draft", "");
    rules = [rule("Blur", "Required", null, "Add a label.")];
    held = ["billing"];

    const root = field(entry);

    leave(entry);

    assert.equal(root.classes.has("ui-invalid"), false);
    assert.deepEqual(readAsItself, []);

    held = [];
    leave(entry);

    assert.equal(root.classes.has("ui-invalid"), true);
});

test("leaving a select's trigger reads the chosen value, which the trigger itself never held", () => {
    const trigger = FakeElement.of("ui-select__trigger-button", {}, "button");

    rules = [rule("Blur", "Required", null, "Pick one.")];
    held = "mon";

    const root = field(trigger);

    leave(trigger);

    assert.equal(root.classes.has("ui-invalid"), false);
});

test("a native field is still read as itself", () => {
    const input = new FakeInput();

    input.value = "";
    rules = [rule("Blur", "Required", null, "Required.")];
    held = "something else";

    const root = field(input);

    leave(input);

    assert.deepEqual(readAsItself, [input]);
    assert.equal(root.classes.has("ui-invalid"), true);
});

test("a tag is refused by the first error rule the next value fails where the current one passes", () => {
    const root = field(new FakeInput());

    rules = [rule("Change", "RegexEach", "^\\S{2,}$", "Two characters at least, no spaces.")];

    assert.deepEqual(engine.entryRefusal(real(root), ["ok"], ["ok", "q 4"]), { text: "Two characters at least, no spaces." });
    assert.equal(engine.entryRefusal(real(root), ["ok"], ["ok", "fine"]), null);
});

test("a chip already standing that a rule refuses is not blamed on the tag being typed", () => {
    const root = field(new FakeInput());

    rules = [rule("Submit", "RegexEach", "^\\S{2,}$", "Two characters at least, no spaces.")];

    assert.equal(engine.entryRefusal(real(root), ["x y"], ["x y", "fine"]), null);
});
