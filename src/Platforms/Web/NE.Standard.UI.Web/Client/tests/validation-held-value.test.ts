// What a rule reads: the component's value holder as its binding sends it, whichever control an event came from — a select's
// trigger, a free-text multi-select's draft, a number field's culture text, a date's shown text, a range's end — and once per
// component on a submit. And what refuses a tag before it is a chip: the first error rule the next value fails where the
// current one passes.

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
// What the readers make of an element: a value set here for it, else its own text; and every element read. Kept per element, so
// a field drawn afresh starts clean.
const values = new Map<FakeElement, unknown>();
const read: FakeElement[] = [];
// A number field's value as its binding sends it: invariant text, whatever its culture shows.
const invariant = new Map<FakeElement, string>();

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
        readBound: (element: FakeElement) => {
            read.push(element);
            return values.has(element) ? values.get(element) : (element as FakeInput).value ?? null;
        }
    }),
    readValue: (element: Element) => invariant.get(element as unknown as FakeElement)
});

function stub<T>(value: object): T {
    return value as T;
}

function rule(trigger: string, operator: string, value: unknown, message: string): WebRenderValidationMetadata {
    return stub<WebRenderValidationMetadata>({ target: { componentId: ComponentId, propertyId: "Value" }, trigger, operator, value, severity: "Error", message: { text: message } });
}

/** A field's root holding the controls given, the page holding nothing else. */
function field(...controls: FakeElement[]): FakeElement {
    const root = FakeElement.of("ui-multi-select", { "data-ui-id": String(ComponentId) }).append(FakeElement.of("ui-select__trigger").append(...controls));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    read.length = 0;

    return root;
}

/** The hidden input a component keeps its value on, holding `value`. */
function holder(value: unknown, attributes: Readonly<Record<string, string>> = {}): FakeInput {
    const input = new FakeInput("hidden");

    input.setAttribute("data-ui-value-holder", "");

    for (const [name, text] of Object.entries(attributes))
        input.setAttribute(name, text);

    values.set(input, value);

    return input;
}

function leave(control: FakeElement): void {
    control.dispatchEvent(new FakeEvent("focus"));
    control.dispatchEvent(new FakeEvent("blur"));
}

test("leaving a free-text entry reads the chips, not the draft: a required field with a chip is answered", () => {
    const entry = new FakeInput();
    const chips = holder(["billing"]);

    entry.value = "half a tag";
    rules = [rule("Blur", "Required", null, "Add a label.")];

    const root = field(entry, chips);

    leave(entry);

    assert.equal(root.classes.has("ui-invalid"), false);
    assert.deepEqual(read, [chips]);

    values.set(chips, []);
    leave(entry);

    assert.equal(root.classes.has("ui-invalid"), true);
});

test("leaving a select's trigger reads the chosen value, which the trigger itself never held", () => {
    const trigger = FakeElement.of("ui-select__trigger-button", {}, "button");

    rules = [rule("Blur", "Required", null, "Pick one.")];

    const root = field(trigger, holder("mon"));

    leave(trigger);

    assert.equal(root.classes.has("ui-invalid"), false);
});

test("a native field is still read as itself", () => {
    const input = new FakeInput();

    input.value = "";
    rules = [rule("Blur", "Required", null, "Required.")];

    const root = field(input);

    leave(input);

    assert.deepEqual(read, [input]);
    assert.equal(root.classes.has("ui-invalid"), true);
});

test("a number field's rules read its invariant value, not the text its culture shows", () => {
    const input = new FakeInput();

    input.value = "1.500";
    input.setAttribute("data-ui-form-id", "plan");
    rules = [rule("Submit", "LessOrEqual", 100, "At most 100.")];

    const root = field(input);

    invariant.set(input, "1500");

    assert.equal(engine.runSubmitValidation("plan"), false);
    assert.equal(root.classes.has("ui-invalid"), true);

    input.value = "12,5";
    invariant.set(input, "12.5");
    rules = [rule("Change", "GreaterOrEqual", 10, "At least 10.")];
    input.dispatchEvent(new FakeEvent("focus"));
    input.dispatchEvent(new FakeEvent("input"));

    assert.equal(root.classes.has("ui-invalid"), false);
});

test("leaving a date's shown text judges its canonical moment", () => {
    const shown = new FakeInput();

    shown.value = "07.10.2026";
    rules = [rule("Blur", "GreaterOrEqual", "2026-01-01", "From 2026 on.")];

    const root = field(shown, holder("2026-10-07"));

    leave(shown);

    assert.equal(root.classes.has("ui-invalid"), false);
});

test("a range's end judges no rule of its start: a submit is refused for the start, and leaving the end keeps the start's error", () => {
    const start = new FakeInput("range");
    const end = new FakeInput("range");

    start.value = "5";
    end.value = "50";
    start.setAttribute("data-ui-form-id", "plan");
    end.setAttribute("data-ui-form-id", "plan");
    end.setAttribute("data-ui-value-end", "");
    rules = [rule("Submit", "GreaterOrEqual", 10, "From 10 on."), rule("Blur", "GreaterOrEqual", 10, "From 10 on.")];

    const root = field(start, end);

    assert.equal(engine.runSubmitValidation("plan"), false);
    assert.equal(root.classes.has("ui-invalid"), true);

    leave(end);

    assert.equal(root.classes.has("ui-invalid"), true);
    assert.ok(read.every(element => element === start));
});

test("a value given with no input — a step, a clear — is judged by the Change rules", () => {
    const input = new FakeInput();

    input.value = "abc";
    rules = [rule("Change", "Required", null, "Required.")];

    const root = field(input);

    input.dispatchEvent(new FakeEvent("focus"));
    input.dispatchEvent(new FakeEvent("input"));

    assert.equal(root.classes.has("ui-invalid"), false);

    input.value = "";
    input.dispatchEvent(new FakeEvent("change"));

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
