// A press on a field box's own empty space focuses its text field with the caret at the end; a control of the box's own keeps its
// press, and a read-only, disabled or loading field takes no caret.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { FieldBoxPressEngine } = await import("../src/interactions/field-box-press-engine.ts");

const root = fakeDocument.body;

new FieldBoxPressEngine({ root: real<ParentNode>(root) });

function press(target: FakeElement, button = 0): FakeEvent {
    const domEvent = Object.assign(new FakeEvent("pointerdown"), { button });

    target.dispatchEvent(domEvent);

    return domEvent;
}

/** A title-inside number field as the renderer writes it: the component, its box, the caption, the field and a stepper. */
function numberField(value: string, componentClasses = ""): { component: FakeElement; box: FakeElement; header: FakeElement; field: FakeInput; step: FakeElement } {
    const input = new FakeInput();

    input.classes.add("ui-number-input__field");
    input.classes.add("ui-field");
    input.value = value;

    const header = FakeElement.of("ui-input__header");
    const step = FakeElement.of("ui-number-input__step-up", {}, "button");
    const box = FakeElement.of("ui-number-input__row").append(header, input, FakeElement.of("ui-number-input__stepper").append(step));
    const component = FakeElement.of(`ui-number-input ui-input--title-inside ${componentClasses}`.trim(), { "data-ui-id": "amount" }).append(box);

    root.children.length = 0;
    root.append(component);
    fakeDocument.activeElement = fakeDocument.body;

    return { component, box, header, field: input, step };
}

test("a press on the box's empty space focuses its field, the caret after the last character", () => {
    const { box, field } = numberField("1250");
    const domEvent = press(box);

    assert.equal(fakeDocument.activeElement, field);
    assert.deepEqual(field.selection, [4, 4]);
    assert.equal(domEvent.defaultPrevented, true);
});

test("a press on an email or a number field's box focuses the field and leaves its caret to the browser", () => {
    for (const type of ["email", "number"]) {
        const { box, field } = numberField("a@b.c");

        field.type = type;

        const domEvent = press(box);

        assert.equal(fakeDocument.activeElement, field, type);
        assert.equal(field.selection, null, type);
        assert.equal(domEvent.defaultPrevented, true, type);
    }
});

test("a press on a part inside the box that is no control, a caption, reaches the field too", () => {
    const { header, field } = numberField("7");

    press(header);

    assert.equal(fakeDocument.activeElement, field);
    assert.deepEqual(field.selection, [1, 1]);
});

test("a control of the box's own, the field itself, and a press of another button are left alone", () => {
    const { box, field, step } = numberField("7");

    assert.equal(press(step).defaultPrevented, false);
    assert.equal(fakeDocument.activeElement, fakeDocument.body);

    assert.equal(press(field).defaultPrevented, false);
    assert.equal(field.selection, null);

    assert.equal(press(box, 2).defaultPrevented, false);
    assert.equal(fakeDocument.activeElement, fakeDocument.body);
});

test("a read-only, disabled or loading field takes no caret from a press on its box", () => {
    for (const setUp of [
        (parts: ReturnType<typeof numberField>) => { parts.field.readOnly = true; },
        (parts: ReturnType<typeof numberField>) => { parts.component.classes.add("ui-readonly"); },
        (parts: ReturnType<typeof numberField>) => { parts.component.classes.add("ui-disabled"); },
        (parts: ReturnType<typeof numberField>) => { parts.component.classes.add("ui-loading"); }
    ]) {
        const parts = numberField("7");

        setUp(parts);

        assert.equal(press(parts.box).defaultPrevented, false);
        assert.equal(fakeDocument.activeElement, fakeDocument.body);
        assert.equal(parts.field.selection, null);
    }
});

test("a box whose field is a multi-line text takes the press the same way", () => {
    const area = new FakeTextArea();

    area.classes.add("ui-field");
    area.value = "two\nlines";

    const box = FakeElement.of("ui-text-input__row").append(area);

    root.children.length = 0;
    root.append(FakeElement.of("ui-text-input", { "data-ui-id": "notes" }).append(box));
    fakeDocument.activeElement = fakeDocument.body;

    press(box);

    assert.equal(fakeDocument.activeElement, area);
    assert.deepEqual(area.selection, [9, 9]);
});

test("a press in a popup a field's action opened is the popup's, and the field keeps the caret the reader left", () => {
    const area = new FakeTextArea();

    area.classes.add("ui-field");
    area.value = "Hello world";

    const list = FakeElement.of("ui-split-button__menu", { role: "presentation", "data-ui-event-boundary": "" });
    const panel = FakeElement.of("ui-flyout__content", { role: "dialog" });
    const box = FakeElement.of("ui-text-area__box ui-field-box").append(area, FakeElement.of("ui-text-area__action").append(list, panel));

    root.children.length = 0;
    root.append(FakeElement.of("ui-text-area", { "data-ui-id": "composer" }).append(box));
    fakeDocument.activeElement = fakeDocument.body;

    for (const popup of [list, panel]) {
        assert.equal(press(popup).defaultPrevented, false);
        assert.equal(fakeDocument.activeElement, fakeDocument.body);
        assert.equal(area.selection, null);
    }
});
