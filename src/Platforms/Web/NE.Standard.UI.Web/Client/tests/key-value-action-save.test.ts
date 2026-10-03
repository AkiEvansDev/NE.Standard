// An open key-value row is a form of its own: its field and its Save carry one form name while it is open, so the submit check
// the pipeline runs before a Save weighs the row's rules — an error stops the save, a warning lets it through — and a closed row
// is in no form. Enter leaves the field for Save, as a press on Save does, before it presses it. A cancel sends nothing of the draft:
// its press takes no focus, and the browser's change as a closed row hides its field is stopped.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { MetadataIndex, WebRenderValidationMetadata } from "../src/metadata/metadata-index.ts";
import type { PropertyPatchEngine } from "../src/updates/property-patch-engine.ts";

type Handler = (mutations: readonly { readonly target: FakeElement }[]) => void;

const observers: Handler[] = [];

installFakeDom({
    Event: FakeEvent,
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    MutationObserver: class {
        public constructor(handler: Handler) {
            observers.push(handler);
        }

        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { KeyValueActionEngine } = await import("../src/interactions/key-value-action-engine.ts");
const { ValidationEngine } = await import("../src/interactions/validation-engine.ts");

const FormIdAttribute = "data-ui-form-id";
const SubmitFormIdAttribute = "data-ui-submit-form-id";

/** A limit's rules, judged on a submit: above zero or an error, at most 200 or a warning. */
const Rules: readonly WebRenderValidationMetadata[] = [
    real<WebRenderValidationMetadata>({ trigger: "Submit", operator: "Greater", value: 0, severity: "Error", message: { text: "zero" } }),
    real<WebRenderValidationMetadata>({ trigger: "Submit", operator: "LessOrEqual", value: 200, severity: "Warning", message: { text: "above" } })
];

type Row = {
    readonly row: FakeElement;
    readonly field: FakeInput;
    readonly save: FakeElement;
    readonly cancel: FakeElement;
    readonly validation: InstanceType<typeof ValidationEngine>;
};

function createRow(): Row {
    const field = new FakeInput("text");
    const component = FakeElement.of("ui-number-input", { "data-ui-id": "4" }).append(field);
    const save = FakeElement.of("ui-button", { "data-ui-id": "7" }, "button");
    const cancel = FakeElement.of("ui-button", { "data-ui-id": "8" }, "button");
    const row = FakeElement.of("ui-key-value-action__row").append(
        FakeElement.of("ui-key-value-action__value-input").append(component),
        FakeElement.of("ui-key-value-action__edit-action").append(save, cancel)
    );

    field.value = "150";
    field.setAttribute("data-ui-bind-value", "11");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-key-value-action").append(row));
    fakeDocument.activeElement = fakeDocument.body;
    observers.length = 0;

    const validation = new ValidationEngine({
        root: real<ParentNode>(fakeDocument.body),
        metadata: real<MetadataIndex>({ getValidationsForComponent: (id: number) => id === 4 ? Rules : [], getValidationTarget: () => undefined }),
        dom: real({
            resolveNearestComponent: (start: FakeElement) => {
                const element = start.closest("[data-ui-id]");

                return element === null ? null : { element, componentId: Number(element.getAttribute("data-ui-id")), dynamicParameters: [] };
            }
        }),
        propertyPatchEngine: real<PropertyPatchEngine>({ addValueChangeHandler: () => undefined }),
        valueReaders: real({ readBound: (element: FakeInput) => element.value })
    });

    new KeyValueActionEngine({ root: real(fakeDocument.body), dom: real({}), propertyPatchEngine: real({}), validation });

    return { row, field, save, cancel, validation };
}

function mutate(target: FakeElement): void {
    for (const observer of observers)
        observer([{ target }]);
}

function open(row: FakeElement): void {
    row.setAttribute("data-ui-row-editing", "");
    mutate(row);
}

/** What the pipeline asks before a Save runs its command: whether the form the Save names holds no error. */
function saves({ save, validation }: Row): boolean {
    const form = save.getAttribute(SubmitFormIdAttribute);

    assert.notEqual(form, null, "the Save names its row's form");

    return validation.runSubmitValidation(form!);
}

test("an open row's field and its Save name one form", () => {
    const { row, field, save } = createRow();

    open(row);

    assert.notEqual(field.getAttribute(FormIdAttribute), null);
    assert.equal(field.getAttribute(FormIdAttribute), save.getAttribute(SubmitFormIdAttribute));
});

test("an error in the row stops its save; a warning lets it through", () => {
    const page = createRow();

    open(page.row);
    page.field.value = "0";
    assert.equal(saves(page), false);

    page.field.value = "500";
    assert.equal(saves(page), true);
});

test("a closed row is in no form", () => {
    const { row, field, save } = createRow();

    open(row);
    row.removeAttribute("data-ui-row-editing");
    mutate(row);

    assert.equal(field.getAttribute(FormIdAttribute), null);
    assert.equal(save.getAttribute(SubmitFormIdAttribute), null);
});

test("a field already in its author's form stays in it", () => {
    const { row, field } = createRow();

    field.setAttribute(FormIdAttribute, "settings");
    open(row);
    row.removeAttribute("data-ui-row-editing");
    mutate(row);

    assert.equal(field.getAttribute(FormIdAttribute), "settings");
});

test("Enter leaves the field for Save before it presses it", () => {
    const { row, field, save } = createRow();
    let focusedAtPress: unknown = null;

    open(row);
    field.focus();
    save.addEventListener("click", () => {
        focusedAtPress = fakeDocument.activeElement;
    });
    field.dispatchEvent(new FakeKeyboardEvent("Enter", field));

    assert.equal(focusedAtPress, save);
});

test("a press on Cancel takes no focus; a press on Save does", () => {
    const { row, save, cancel } = createRow();
    const press = (button: FakeElement): boolean => {
        const domEvent = new FakeEvent("mousedown");

        button.dispatchEvent(domEvent);

        return domEvent.defaultPrevented;
    };

    open(row);

    assert.equal(press(cancel), true);
    assert.equal(press(save), false);
});

test("the browser's change from a closed row's field is stopped; an open row's goes", () => {
    const { row, field } = createRow();
    let heard = 0;
    const leave = (): void => {
        field.dispatchEvent(Object.assign(new FakeEvent("change"), { isTrusted: true }));
    };

    fakeDocument.body.addEventListener("change", () => heard++);
    open(row);
    leave();
    assert.equal(heard, 1);

    row.removeAttribute("data-ui-row-editing");
    mutate(row);
    leave();
    assert.equal(heard, 1, "the leave of a field its closing row hid");

    // An engine's own change from the closed row — a picture's draft let go of, published as nothing — still goes.
    field.dispatchEvent(new FakeEvent("change"));
    assert.equal(heard, 2);
});
