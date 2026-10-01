// Enter and Escape leave a field and hand the keyboard to the holder around it — a dialog, a flyout, a canvas, a host whose row
// holds the field, its cursor moved there — or, with none, leave it blurred, so the browser carries Tab on from the field's place.
// The two that stay: a text area that submits on Enter, and an entry field with OnEnter, which commits and raises its `enter`.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    // A stand-in event, so one the engine raises reaches its listeners with its target, as the browser's does.
    Event: class extends FakeEvent { public constructor(type: string) { super(type); } },
    CSS: { escape: (value: string) => value }
});

const { FieldKeysEngine } = await import("../src/interactions/field-keys-engine.ts");

const root = fakeDocument.body;

new FieldKeysEngine({ root: real<ParentNode>(root) });

function press(field: FakeElement, key: string): FakeKeyboardEvent {
    const domEvent = new FakeKeyboardEvent(key, field);

    field.dispatchEvent(domEvent);

    return domEvent;
}

function mount(...elements: FakeElement[]): void {
    root.children.length = 0;
    root.append(...elements);
}

test("with no holder around it, a field left by Enter or Escape stays blurred: the keyboard does not come back to it", () => {
    const field = new FakeInput();
    const area = new FakeTextArea();

    mount(FakeElement.of("", { tabindex: "0" }).append(field), area);

    for (const [entry, key] of [[field, "Enter"], [field, "Escape"], [area, "Escape"]] as const) {
        entry.focus();

        assert.equal(press(entry, key).defaultPrevented, true);
        assert.equal(fakeDocument.activeElement, fakeDocument.body);
    }
});

test("Enter in a multi-line field is a line break, not a leave", () => {
    const area = new FakeTextArea();

    mount(area);
    area.focus();

    assert.equal(press(area, "Enter").defaultPrevented, false);
    assert.equal(fakeDocument.activeElement, area);
});

test("a dialog, a flyout or a marked holder around the field takes the keyboard", () => {
    for (const holder of [
        FakeElement.of("ui-dialog__surface", { tabindex: "-1" }),
        FakeElement.of("ui-flyout__content", { tabindex: "-1" }),
        FakeElement.of("", { tabindex: "0", "data-ui-focus-holder": "" })
    ]) {
        const field = new FakeInput();

        mount(holder.append(new FakeElement().append(field)));
        field.focus();
        press(field, "Escape");

        assert.equal(fakeDocument.activeElement, holder);
    }
});

test("a host of rows takes the keyboard from a field in its row and moves its cursor there; from its chrome it does not", () => {
    const rowField = new FakeInput();
    const searchField = new FakeInput("search");
    const first = FakeElement.of("ui-items-view__item", { "data-ui-row-focus": "" });
    const second = FakeElement.of("ui-items-view__item").append(rowField);
    const view = FakeElement.of("ui-items-view", { tabindex: "0" }).append(searchField, first, second);

    mount(view);
    rowField.focus();
    press(rowField, "Enter");

    assert.equal(fakeDocument.activeElement, view);
    assert.equal(second.hasAttribute("data-ui-row-focus"), true);
    assert.equal(first.hasAttribute("data-ui-row-focus"), false);

    searchField.focus();
    press(searchField, "Enter");

    assert.equal(fakeDocument.activeElement, fakeDocument.body);
});

test("a key a nearer control already took is left alone", () => {
    const field = new FakeInput();
    const taken = new FakeKeyboardEvent("Escape", field);

    mount(field);
    field.focus();
    taken.preventDefault();
    field.dispatchEvent(taken);

    assert.equal(fakeDocument.activeElement, field);
});

/** A text area that submits on Enter, its form's button, and what each of them heard, in order. */
function submittingArea(): { area: FakeTextArea; heard: string[] } {
    const area = new FakeTextArea();
    const button = FakeElement.of("ui-button", { "data-ui-submit-form-id": "chat" }, "button");
    const heard: string[] = [];

    area.setAttribute("data-ui-submit-on-enter", "");
    area.setAttribute("data-ui-form-id", "chat");
    area.addEventListener("change", () => heard.push(`change ${area.value}`));
    button.addEventListener("click", () => heard.push("click"));
    mount(area, button);

    return { area, heard };
}

test("Enter in an area that submits on it commits the value, then presses the form's button, and the focus stays to write the next", () => {
    const { area, heard } = submittingArea();

    area.focus();
    area.value = "Hello";

    assert.equal(press(area, "Enter").defaultPrevented, true);
    assert.deepEqual(heard, ["change Hello", "click"]);
    assert.equal(fakeDocument.activeElement, area);

    // A value already committed (a debounce, a pushed clear) is not sent again: the button alone is pressed.
    heard.length = 0;
    area.dispatchEvent(new FakeEvent("change"));
    heard.length = 0;
    press(area, "Enter");

    assert.deepEqual(heard, ["click"]);
});

test("Shift+Enter in an area that submits on Enter is a line break, and an Enter that ends a composition submits nothing", () => {
    const { area, heard } = submittingArea();

    area.focus();
    area.value = "こんにちは";

    for (const chord of [{ shiftKey: true }, { isComposing: true }, { keyCode: 229 }]) {
        // The plain stand-in has no chord and never composes; these are what a browser's event would carry.
        const domEvent = Object.assign(new FakeKeyboardEvent("Enter", area), chord);

        area.dispatchEvent(domEvent);

        assert.equal(domEvent.defaultPrevented, false);
    }

    assert.deepEqual(heard, []);
    assert.equal(fakeDocument.activeElement, area);
});

test("a read-only area that submits on Enter leaves Enter to the browser", () => {
    const { area, heard } = submittingArea();

    area.readOnly = true;
    area.focus();

    assert.equal(press(area, "Enter").defaultPrevented, false);
    assert.deepEqual(heard, []);
});

test("an area that submits on Enter commits the same text again after its value was pushed away", () => {
    const { area, heard } = submittingArea();

    area.focus();

    for (let round = 0; round < 2; round++) {
        area.value = "ok";
        area.dispatchEvent(new FakeEvent("input"));
        press(area, "Enter");

        // The controller empties the box by a push, which raises nothing.
        area.value = "";
    }

    assert.deepEqual(heard, ["change ok", "click", "change ok", "click"]);
});

/** A one-line field with OnEnter inside a form, the form's button, and what each of them heard, in order. */
function entryField(): { field: FakeInput; heard: string[] } {
    const field = new FakeInput();
    const button = FakeElement.of("ui-button", { "data-ui-submit-form-id": "checklist" }, "button");
    const heard: string[] = [];

    field.setAttribute("data-ui-runs-on-enter", "");
    field.setAttribute("data-ui-form-id", "checklist");
    field.addEventListener("change", () => heard.push(`change ${field.value}`));
    field.addEventListener("enter", () => heard.push("enter"));
    button.addEventListener("click", () => heard.push("click"));
    mount(field, button);

    return { field, heard };
}

function type(field: FakeInput, value: string): void {
    field.value = value;
    field.dispatchEvent(new FakeEvent("input"));
}

test("Enter in a field with OnEnter commits the value, then raises its enter, presses no form's button, and keeps the focus", () => {
    const { field, heard } = entryField();

    field.focus();
    type(field, "Milk");

    assert.equal(press(field, "Enter").defaultPrevented, true);
    assert.deepEqual(heard, ["change Milk", "enter"]);
    assert.equal(fakeDocument.activeElement, field);
});

test("an entry field commits each line typed, the same text after a pushed clear too, and an untouched one runs its enter alone", () => {
    const { field, heard } = entryField();

    field.focus();
    type(field, "Milk");
    press(field, "Enter");

    // The controller clears the field by a push, which raises nothing; the next line happens to be the same text.
    field.value = "";
    type(field, "Milk");
    press(field, "Enter");

    field.value = "";
    press(field, "Enter");

    assert.deepEqual(heard, ["change Milk", "enter", "change Milk", "enter", "enter"]);
    assert.equal(fakeDocument.activeElement, field);
});

test("an Enter that ends a composition, a held key's repeat and a read-only entry field run nothing, and the field keeps the focus", () => {
    const { field, heard } = entryField();

    field.focus();
    type(field, "牛奶");

    for (const chord of [{ isComposing: true }, { keyCode: 229 }, { repeat: true }]) {
        const domEvent = Object.assign(new FakeKeyboardEvent("Enter", field), chord);

        field.dispatchEvent(domEvent);
    }

    field.readOnly = true;
    press(field, "Enter");

    assert.deepEqual(heard, []);
    assert.equal(fakeDocument.activeElement, field);
});

test("a chord on an entry field keeps a field's ordinary Enter: it leaves and presses the form's button", () => {
    const { field, heard } = entryField();

    field.focus();
    type(field, "Milk");
    field.dispatchEvent(Object.assign(new FakeKeyboardEvent("Enter", field), { shiftKey: true }));

    assert.deepEqual(heard, ["change Milk", "click"]);
    assert.equal(fakeDocument.activeElement, fakeDocument.body);
});

/** A text area with OnEnter and no form, and what it heard, in order. */
function entryArea(): { area: FakeTextArea; heard: string[] } {
    const area = new FakeTextArea();
    const heard: string[] = [];

    area.setAttribute("data-ui-runs-on-enter", "");
    area.addEventListener("change", () => heard.push(`change ${area.value}`));
    area.addEventListener("enter", () => heard.push("enter"));
    mount(area);

    return { area, heard };
}

test("Enter in a text area with OnEnter commits the value, then raises its enter, and keeps the focus; the same text goes again after a clear", () => {
    const { area, heard } = entryArea();

    area.focus();

    for (let round = 0; round < 2; round++) {
        area.value = "Looks good";
        area.dispatchEvent(new FakeEvent("input"));

        assert.equal(press(area, "Enter").defaultPrevented, true);

        area.value = "";
    }

    assert.deepEqual(heard, ["change Looks good", "enter", "change Looks good", "enter"]);
    assert.equal(fakeDocument.activeElement, area);
});

test("Shift+Enter in a text area with OnEnter breaks the line; a composing Enter, a repeat and a read-only area run nothing", () => {
    const { area, heard } = entryArea();

    area.focus();
    area.value = "第一行";
    area.dispatchEvent(new FakeEvent("input"));

    const lineBreak = Object.assign(new FakeKeyboardEvent("Enter", area), { shiftKey: true });

    area.dispatchEvent(lineBreak);

    assert.equal(lineBreak.defaultPrevented, false);

    for (const chord of [{ isComposing: true }, { keyCode: 229 }, { repeat: true }])
        area.dispatchEvent(Object.assign(new FakeKeyboardEvent("Enter", area), chord));

    area.readOnly = true;
    press(area, "Enter");

    assert.deepEqual(heard, []);
    assert.equal(fakeDocument.activeElement, area);
});
