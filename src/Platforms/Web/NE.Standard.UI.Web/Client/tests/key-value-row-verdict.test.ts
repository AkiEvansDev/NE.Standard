// A key-value row's own rules judge the value the row shows: at load, as it opens (the value its draft starts from) and once it
// closes (the saved value, or the one a cancel restores) — so a saved value's warning stays on the closed row and in its next open.
// A change inside a closed row closes it no second time, and an empty value is judged as any other: `Required` marks a row holding none.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
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

const WarningClass = "ui-validation--warning";
const ErrorClass = "ui-invalid";

/** The owner's rule: a person's address, else a warning — judged as the reader types. */
const OwnerRule = real<WebRenderValidationMetadata>({ trigger: "Change", operator: "Regex", value: "@", severity: "Warning", message: { text: "team" } });
/** A value the row must hold, else an error. */
const RequiredRule = real<WebRenderValidationMetadata>({ trigger: "Submit", operator: "Required", value: null, severity: "Error", message: { text: "required" } });
/** The limit's rule: above zero, else an error. */
const LimitRule = real<WebRenderValidationMetadata>({ trigger: "Change", operator: "Greater", value: 0, severity: "Error", message: { text: "zero" } });

type Row = { readonly row: FakeElement; readonly title: FakeElement; readonly component: FakeElement; readonly field: FakeInput };

function createRow(value: string, rule: WebRenderValidationMetadata): Row {
    const field = new FakeInput("text");
    const component = FakeElement.of("ui-text-input", { "data-ui-id": "4" }).append(field);
    const title = FakeElement.of("ui-text__title", {}, "span");
    const row = FakeElement.of("ui-key-value-action__row").append(
        FakeElement.of("ui-key-value-action__value").append(FakeElement.of("ui-text").append(title)),
        FakeElement.of("ui-key-value-action__value-input").append(component),
        FakeElement.of("ui-key-value-action__edit-action").append(FakeElement.of("ui-button", {}, "button"), FakeElement.of("ui-button", {}, "button"))
    );

    title.textContent = value;
    field.value = value;
    field.setAttribute("data-ui-bind-value", "11");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("ui-key-value-action").append(row));
    fakeDocument.activeElement = fakeDocument.body;
    observers.length = 0;

    const validation = new ValidationEngine({
        root: real<ParentNode>(fakeDocument.body),
        metadata: real<MetadataIndex>({ getValidationsForComponent: (id: number) => id === 4 ? [rule] : [], getValidationTarget: () => undefined }),
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

    return { row, title, component, field };
}

function mutate(target: FakeElement): void {
    for (const observer of observers)
        observer([{ target }]);
}

function open(row: FakeElement): void {
    row.setAttribute("data-ui-row-editing", "");
    mutate(row);
}

function close(row: FakeElement): void {
    row.removeAttribute("data-ui-row-editing");
    mutate(row);
}

function type(field: FakeInput, value: string): void {
    field.value = value;
    field.dispatchEvent(new FakeEvent("input"));
}

test("a closed row's value is judged at load", () => {
    const { component } = createRow("on-call", OwnerRule);

    assert.equal(component.classList.contains(WarningClass), true);
});

test("a saved value's warning stays on the closed row, and the row opened again shows it", () => {
    const { row, title, component, field } = createRow("ann@example.com", OwnerRule);

    open(row);
    assert.equal(component.classList.contains(WarningClass), false);

    type(field, "on-call");
    assert.equal(component.classList.contains(WarningClass), true);

    // The save: the controller takes the draft as the row's value and closes the row.
    title.textContent = "on-call";
    close(row);
    assert.equal(field.value, "", "the closed field is emptied for its next open");
    assert.equal(component.classList.contains(WarningClass), true);

    open(row);
    assert.equal(field.value, "on-call");
    assert.equal(component.classList.contains(WarningClass), true);
});

test("a cancel judges the value it restores", () => {
    const { row, component, field } = createRow("ann@example.com", OwnerRule);

    open(row);
    type(field, "on-call");
    close(row);

    assert.equal(component.classList.contains(WarningClass), false);
});

test("an error a draft was refused for goes with the draft", () => {
    const { row, component, field } = createRow("100", LimitRule);

    open(row);
    type(field, "0");
    assert.equal(component.classList.contains(ErrorClass), true);

    close(row);
    assert.equal(component.classList.contains(ErrorClass), false);
});

test("a change inside a closed row closes it no second time and keeps its verdict", () => {
    const { row, component } = createRow("on-call", OwnerRule);
    let dropped = 0;

    fakeDocument.body.addEventListener("ui-draft-dropped", () => dropped++);
    mutate(row);
    mutate(row);

    assert.equal(dropped, 0);
    assert.equal(component.classList.contains(WarningClass), true);
});

test("an empty value is judged: a required row holding none is marked, closed and open", () => {
    const { row, component } = createRow("", RequiredRule);

    assert.equal(component.classList.contains(ErrorClass), true);

    open(row);
    assert.equal(component.classList.contains(ErrorClass), true);
});
