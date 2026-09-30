// A field the reader cannot change raises no `change` of its own: a date pushed outside Min and Max is shown as it is rather than
// clamped and reported, a slider's clamp only shows, a number's trailing zeros are not trimmed and sent on a plain focus and blur, and
// a read-only range moved by no key or pointer (a screen reader's increment) is put back. The editable field does each of them.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({ window: { addEventListener: () => { } } });

const { clampPushedValue } = await import("../src/interactions/temporal-dom.ts");
const { NumberInputEngine } = await import("../src/interactions/number-input-engine.ts");
const { RangeValueEngine } = await import("../src/interactions/range-value-engine.ts");

const Editable = "";

/** Each state a field refuses the reader in, and the editable one. */
const States = ["ui-readonly", "ui-disabled", "ui-loading"];

/** Puts a component on the page, and answers every `change` raised inside it. */
function place(component: FakeElement): FakeEvent[] {
    const changes: FakeEvent[] = [];

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(component);
    fakeDocument.activeElement = fakeDocument.body;
    component.addEventListener("change", domEvent => changes.push(domEvent));

    return changes;
}

function datePicker(state: string): { readonly value: FakeInput; readonly changes: FakeEvent[] } {
    const value = new FakeInput("hidden");
    const root = FakeElement.of(`ui-temporal-input ${state}`, { "data-ui-id": "1", "data-ui-temporal-mode": "date", "data-ui-temporal-min": "2026-09-30" });

    value.classes.add("ui-temporal-input__value-input");
    value.value = "2026-01-15";
    root.append(value);

    return { value, changes: place(root) };
}

test("a date pushed before Min is clamped and reported while the field is editable, and shown as it is while it is not", () => {
    const editable = datePicker(Editable);

    clampPushedValue(real(editable.value.parent));

    assert.equal(editable.value.value, "2026-09-30");
    assert.equal(editable.changes.length, 1);

    for (const state of States) {
        const fixed = datePicker(state);

        clampPushedValue(real(fixed.value.parent));

        assert.equal(fixed.value.value, "2026-01-15", `${state} clamped its value`);
        assert.equal(fixed.changes.length, 0, `${state} reported a clamp`);
    }
});

function numberField(state: string): { readonly field: FakeInput; readonly changes: FakeEvent[] } {
    const field = new FakeInput("text");
    const root = FakeElement.of(`ui-number-input ${state}`, { "data-ui-id": "1" });

    field.classes.add("ui-number-input__field");
    field.setAttribute("data-ui-number-trim-zeros", "");
    field.value = "1.50";
    root.append(field);

    const changes = place(root);

    new NumberInputEngine({ root: real(root) });

    return { field, changes };
}

/** A focus and a blur and nothing typed between them, as the keyboard passing through does. */
function passThrough(field: FakeInput): void {
    fakeDocument.activeElement = field;
    field.dispatchEvent(new FakeEvent("focus"));
    fakeDocument.activeElement = fakeDocument.body;
    field.dispatchEvent(new FakeEvent("blur"));
}

test("a number's trailing zeros are trimmed and sent on its blur while it is editable, and left as the server wrote them while it is not", () => {
    const editable = numberField(Editable);

    passThrough(editable.field);

    assert.equal(editable.changes.length, 1);

    for (const state of States) {
        const fixed = numberField(state);

        passThrough(fixed.field);

        assert.equal(fixed.changes.length, 0, `${state} sent its trimmed value`);
        assert.equal(fixed.field.value, "1.50", `${state} trimmed what it shows`);
    }
});

function slider(state: string): { readonly input: FakeInput; readonly changes: FakeEvent[]; push(value: number): void } {
    const input = new FakeInput("range");
    const component = FakeElement.of(`ui-slider ${state}`, { "data-ui-id": "1" }).append(FakeElement.of("ui-slider__track").append(input));
    let handler: ((change: unknown) => void) | null = null;

    input.classes.add("ui-slider__input");

    const changes = place(component);

    new RangeValueEngine({
        root: real(component),
        propertyPatchEngine: real({ addValueChangeHandler: (added: (change: unknown) => void) => { handler = added; } }),
        dom: real({ findAllComponents: () => [component] })
    });

    return {
        input,
        changes,
        // The browser holds the range's value inside its bounds before the engine hears the push.
        push: value => {
            input.value = String(Math.min(value, 100));
            handler?.({ propertyName: "Value", reference: { componentId: 1 }, dynamicParameters: [], value, components: [component] });
        }
    };
}

test("a slider's value pushed past Max is reported back while it is editable, and only shown clamped while it is not", () => {
    const editable = slider(Editable);

    editable.push(150);

    assert.equal(editable.changes.length, 1);

    for (const state of States) {
        const fixed = slider(state);

        fixed.push(150);

        assert.equal(fixed.changes.length, 0, `${state} reported the clamp`);
    }
});

test("a read-only range moved by no key or pointer is put back where the server left it; an editable one keeps the move", () => {
    const editable = slider(Editable);
    const fixed = slider("ui-readonly");

    for (const { input, push } of [editable, fixed]) {
        push(40);
        input.value = "60";
        input.dispatchEvent(new FakeEvent("input"));
    }

    assert.equal(editable.input.value, "60");
    assert.equal(fixed.input.value, "40");
});
