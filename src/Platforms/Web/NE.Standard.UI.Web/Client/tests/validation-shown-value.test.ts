// A field shown between edits is judged by every rule it has against the value it shows, whatever the rules' trigger, and what the
// rules said of a draft goes with the draft; an empty value is judged as any other. A submit refused for a rule that failed on a pushed value
// before the reader came by says why on the field, rather than refusing in silence. A message judged before the page took its words
// table is written again in the table's words, and a message the server rendered is weighed with the rules rather than written over.
// A discarded form forgets what was said of its fields.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex, WebRenderValidationMetadata } from "../src/metadata/metadata-index.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../src/updates/property-patch-engine.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");

const ComponentId = 4;
const Rule = real<WebRenderValidationMetadata>({ target: { propertyId: "limit.value" }, trigger: "Change", operator: "Greater", value: 0, severity: "Error", message: { text: "zero" } });
const valueChangeHandlers: ((change: PropertyValueChange) => void)[] = [];

const engine = createEngine();

/** An engine over the page as it stands: it reads the messages the server rendered as it starts. */
function createEngine(): InstanceType<typeof ValidationEngine> {
    return new ValidationEngine({
        root: real<ParentNode>(fakeDocument.body),
        metadata: real<MetadataIndex>({ getValidationsForComponent: (id: number) => id === ComponentId ? [Rule] : [], getValidationTarget: () => undefined }),
        dom: real({
            findAllComponents: () => fakeDocument.body.querySelectorAll(`[data-ui-id='${ComponentId}']`),
            resolveNearestComponent: (start: FakeElement) => {
                const element = start.closest("[data-ui-id]");

                return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
            }
        }),
        propertyPatchEngine: real<PropertyPatchEngine>({ addValueChangeHandler: (handler: (change: PropertyValueChange) => void) => valueChangeHandlers.push(handler) }),
        valueReaders: real({ readBound: (element: FakeInput) => element.value, readHeld: (element: FakeElement) => (element.querySelector("input") as FakeInput | null)?.value })
    });
}

type Row = { readonly row: FakeElement; readonly field: FakeElement; readonly input: FakeInput };

function createRow(): Row {
    const input = new FakeInput("text");
    const field = FakeElement.of("ui-number-input", { "data-ui-id": String(ComponentId) }).append(input);
    const row = FakeElement.of("ui-key-value-action__row").append(field);

    input.setAttribute("data-ui-form-id", "row");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(row);
    fakeDocument.activeElement = fakeDocument.body;

    return { row, field, input };
}

function push(value: unknown): void {
    for (const handler of valueChangeHandlers)
        handler(real<PropertyValueChange>({ reference: { componentId: ComponentId, propertyId: "limit.value" }, propertyName: "Value", dynamicParameters: [], value, local: false, components: [] }));
}

test("a shown value is judged by its rules at once, unseen or not", () => {
    const { field, input } = createRow();

    engine.judgeShown(real(input), "0");

    assert.equal(field.classList.contains("ui-invalid"), true);
});

test("a shown value replaces what the rules said of the draft", () => {
    const { field, input } = createRow();

    input.dispatchEvent(new FakeEvent("focus"));
    input.value = "0";
    input.dispatchEvent(new FakeEvent("input"));
    assert.equal(field.classList.contains("ui-invalid"), true);

    input.value = "";
    engine.judgeShown(real(input), "100");

    assert.equal(field.classList.contains("ui-invalid"), false);
});

test("without a stand-in text, the field's own value is judged", () => {
    const { field, input } = createRow();

    input.value = "0";
    engine.judgeShown(real(input), null);

    assert.equal(field.classList.contains("ui-invalid"), true);
});

test("an empty shown value is judged as any other", () => {
    const { field, input } = createRow();

    engine.judgeShown(real(input), "");

    assert.equal(field.classList.contains("ui-invalid"), true, "nothing is not above zero");
});

test("a message judged before the page took its table is written again in its words", () => {
    const { field, input } = createRow();
    const line = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");

    field.append(line);
    engine.judgeShown(real(input), "0");
    assert.equal(line.textContent, "zero");

    clientStrings.useTable({ language: "en", words: { zero: "Above zero, please" }, complete: true, prefixes: [] });

    assert.equal(line.textContent, "Above zero, please");
});

test("a message the server rendered stays the field's own: a rule's error outweighs it, and it shows again once the rule passes", () => {
    const { field, input } = createRow();
    const line = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "", "data-ui-words": JSON.stringify({ "#text": "region.fixed" }) }, "span");

    line.textContent = "region.fixed";
    field.classList.add("ui-validation--info");
    field.append(line);

    const page = createEngine();

    page.judgeShown(real(input), "0");
    assert.equal(field.classList.contains("ui-invalid"), true);

    page.judgeShown(real(input), "100");
    assert.equal(field.classList.contains("ui-invalid"), false);
    assert.equal(field.classList.contains("ui-validation--info"), true);
    assert.equal(line.textContent, "region.fixed");
});

test("a submit refused for a rule that failed unseen shows the error", () => {
    const { field } = createRow();

    push(0);
    assert.equal(field.classList.contains("ui-invalid"), false, "a pushed value is judged unseen");

    assert.equal(engine.runSubmitValidation("row"), false);
    assert.equal(field.classList.contains("ui-invalid"), true);
});

test("a discarded form forgets what its rules said of the attempt, on a field whose value it did not change too", () => {
    const { field, input } = createRow();

    input.dispatchEvent(new FakeEvent("focus"));
    input.value = "0";
    input.dispatchEvent(new FakeEvent("input"));
    assert.equal(field.classList.contains("ui-invalid"), true);

    engine.discardForm("row");

    assert.equal(field.classList.contains("ui-invalid"), false);
});

test("a discarded form stands as untouched: a value pushed after it is judged unseen", () => {
    const { field, input } = createRow();

    // Visited through the engine itself: a focus event would reach the other engine an earlier test left listening on the page.
    engine.judgeShown(real(input), "100");
    engine.discardForm("row");
    push(0);

    assert.equal(field.classList.contains("ui-invalid"), false);
});
