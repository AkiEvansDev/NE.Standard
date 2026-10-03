// A value past its field's Min or Max is never pulled back to the bound: the field keeps what the reader gave and says why in words —
// the bound written as the field shows a value — the value is not sent, and the error stops a submit. An empty optional field is no
// value past anything. A message about a value the reader has replaced, or the controller has given back, does not outlive it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex, ServerValidationUIUpdate } from "../src/metadata/metadata-index.ts";
import type { WordsTable } from "../src/runtime/client-strings.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../src/updates/property-patch-engine.ts";
import type { UpdateProcessor } from "../src/updates/update-processor.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    MutationObserver: class {
        public observe(): void {
        }
    }
});

const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");

clientStrings.useTable(tableOf({
    "ui.value.max": "At most {max}.",
    "ui.value.min": "At least {min}.",
    "ui.value.after": "Not after {max}.",
    "ui.value.before": "Not before {min}.",
    "ui.value.format": "The value does not match the expected format."
}));

const Culture = JSON.stringify({ decimalSeparator: ",", groupSeparator: " ", groupSizes: [3], negativeSign: "-", decimalDigits: 2 });
const valueChangeHandlers: ((change: PropertyValueChange) => void)[] = [];
const refusalHandlers: ((update: ServerValidationUIUpdate) => void)[] = [];

const engine = new ValidationEngine({
    root: real<ParentNode>(fakeDocument.body),
    metadata: stub<MetadataIndex>({ getValidationsForComponent: () => [], getValidationTarget: () => undefined }),
    dom: stub({
        resolveNearestComponent: (start: FakeElement) => {
            const element = start.closest("[data-ui-id]");

            return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
        },
        findAllComponents: (id: number) => fakeDocument.body.querySelectorAll(`[data-ui-id='${id}']`)
    }),
    propertyPatchEngine: stub<PropertyPatchEngine>({ addValueChangeHandler: (handler: (change: PropertyValueChange) => void) => valueChangeHandlers.push(handler) }),
    updateProcessor: stub<UpdateProcessor>({ addValidationHandler: (handler: (update: ServerValidationUIUpdate) => void) => refusalHandlers.push(handler) }),
    valueReaders: stub({ readBound: (element: FakeInput) => element.value }),
    // As the number engine answers once the change has read the typed text: invariant.
    readValue: (element: Element) => (element as unknown as FakeInput).value
});

function stub<T>(value: object): T {
    return value as T;
}

function tableOf(words: Record<string, string>): WordsTable {
    return { language: "en", complete: true, prefixes: ["ui."], words };
}

type Field = { readonly root: FakeElement; readonly input: FakeInput; readonly line: FakeElement };

/** A number field as `NumberInputComponentRenderer` writes it, `SetRange(1, 1000)` in a culture grouping by a space. */
function numberField(classes = ""): Field {
    const input = new FakeInput("text");
    const line = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");
    const root = FakeElement.of(`ui-number-input ${classes}`, { "data-ui-id": "7", "data-ui-number-culture": Culture }).append(input, line);

    input.classes.add("ui-number-input__field");
    input.setAttribute("data-ui-number-min", "1");
    input.setAttribute("data-ui-number-max", "1000");
    input.value = "4";
    place(root);

    return { root, input, line };
}

function place(root: FakeElement): void {
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    fakeDocument.activeElement = fakeDocument.body;
}

/** The reader's value committed: typed text read as invariant, then the change every engine hears. */
function give(field: Field, value: string): boolean {
    field.input.value = value;
    field.input.dispatchEvent(new FakeEvent("change"));

    return engine.isRefused(real(field.root));
}

function refuseOnServer(property = "Value"): void {
    for (const handler of refusalHandlers)
        handler({ kind: 0, address: { component: { id: 7, dynamicParameters: [] }, property }, message: "ui.value.format" });
}

function push(field: Field, propertyName: string): void {
    for (const handler of valueChangeHandlers)
        handler({ reference: { componentId: 7, propertyId: propertyName }, propertyName, dynamicParameters: [], value: field.input.value, local: false, components: [real(field.root)] });
}

test("a number past Max keeps what the reader typed and says the bound as the field shows it; the value is refused", () => {
    const field = numberField();

    assert.equal(give(field, "1500"), true);
    assert.equal(field.input.value, "1500", "pulled back to the bound");
    assert.ok(field.root.classes.has("ui-invalid"));
    assert.equal(field.input.getAttribute("aria-invalid"), "true");
    assert.equal(field.line.textContent, "At most 1 000.");

    assert.equal(give(field, "0"), true);
    assert.equal(field.line.textContent, "At least 1.");
});

test("a value back inside the bounds takes the error off, and an empty optional field is no value past anything", () => {
    const field = numberField();

    give(field, "1500");

    assert.equal(give(field, "10"), false);
    assert.ok(!field.root.classes.has("ui-invalid"));
    assert.equal(field.line.textContent, "");

    assert.equal(give(field, "1500"), true);
    assert.equal(give(field, ""), false);
    assert.ok(!field.root.classes.has("ui-invalid"));
});

test("the server's refusal of an earlier text does not outlive the value the reader replaced it with", () => {
    const field = numberField();

    field.input.value = "";
    refuseOnServer();

    assert.equal(field.line.textContent, "The value does not match the expected format.");

    give(field, "0");

    assert.equal(field.line.textContent, "At least 1.");

    give(field, "5");

    assert.ok(!field.root.classes.has("ui-invalid"), "the refusal outlived its value");
    assert.equal(field.line.textContent, "");
});

test("the controller's value given back takes off the refusal and the bound's error that spoke for the reader's", () => {
    const field = numberField();

    refuseOnServer();
    field.input.value = "4";
    push(field, "Value");

    assert.ok(!field.root.classes.has("ui-invalid"), "the runtime's refusal outlived the value it refused");

    give(field, "1500");
    field.input.value = "4";
    push(field, "Value");

    assert.ok(!field.root.classes.has("ui-invalid"), "the bound's error outlived the reader's value");
    assert.equal(engine.isRefused(real(field.root)), false);

    // A push of another property leaves the reader's error standing.
    give(field, "1500");
    push(field, "Placeholder");

    assert.ok(field.root.classes.has("ui-invalid"));
});

test("a bound that moves judges the reader's value again", () => {
    const field = numberField();

    give(field, "1500");
    field.input.setAttribute("data-ui-number-max", "2000");
    push(field, "Max");

    assert.ok(!field.root.classes.has("ui-invalid"));
});

test("a field the reader cannot change is not judged against its bounds", () => {
    const field = numberField("ui-readonly");

    assert.equal(give(field, "1500"), false);
    assert.ok(!field.root.classes.has("ui-invalid"));
});

test("a value past the bounds stops its form's submit, and the first such field takes the focus", () => {
    const field = numberField();

    field.input.setAttribute("data-ui-form-id", "plan");
    give(field, "1500");

    assert.equal(engine.runSubmitValidation("plan"), false);
    assert.equal(engine.focusFirstInvalid("plan"), true);
    assert.equal(fakeDocument.activeElement, field.input);

    give(field, "500");

    assert.equal(engine.runSubmitValidation("plan"), true);
});

/** A date input `SetMax(2026-09-30)`, shown `dd.MM.yyyy`, or a time period `SetRange(09:00, 18:00)`. */
function temporal(mode: "date" | "time", value: string, end: string | null = null): { readonly root: FakeElement; readonly value: FakeInput; readonly end: FakeInput | null; readonly line: FakeElement } {
    const start = Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__value-input", value });
    const endInput = end === null ? null : Object.assign(new FakeInput("hidden"), { className: "ui-temporal-input__end-value-input", value: end });
    const line = FakeElement.of("ui-validation-message", { "data-ui-validation-message": "" }, "span");
    const root = FakeElement.of("ui-temporal-input", mode === "date"
        ? { "data-ui-id": "7", "data-ui-temporal-mode": "date", "data-ui-temporal-format": "dd.MM.yyyy", "data-ui-temporal-max": "2026-09-30" }
        : { "data-ui-id": "7", "data-ui-temporal-mode": "time", "data-ui-temporal-format": "HH:mm", "data-ui-temporal-min": "09:00:00", "data-ui-temporal-max": "18:00:00" });

    root.append(start, line);

    if (endInput !== null) {
        endInput.setAttribute("data-ui-temporal-end", "");
        root.setAttribute("data-ui-temporal-range", "");
        root.append(endInput);
    }

    place(root);

    return { root, value: start, end: endInput, line };
}

test("a day past Max is refused in words, the bound written in the field's own format", () => {
    const scene = temporal("date", "2026-10-15");

    scene.value.dispatchEvent(new FakeEvent("change"));

    assert.equal(scene.value.value, "2026-10-15");
    assert.ok(scene.root.classes.has("ui-invalid"));
    assert.equal(scene.line.textContent, "Not after 30.09.2026.");

    scene.value.value = "";
    scene.value.dispatchEvent(new FakeEvent("change"));

    assert.ok(!scene.root.classes.has("ui-invalid"), "a cleared day is refused");
});

test("a period's end before Min is refused as its start would be", () => {
    const scene = temporal("time", "09:30:00", "08:15:00");

    scene.end?.dispatchEvent(new FakeEvent("change"));

    assert.equal(scene.line.textContent, "Not before 09:00.");
});
