// Enter and Escape leave a field and hand the keyboard to the holder around it — a dialog, a flyout, a canvas, a host whose row
// holds the field, its cursor moved there — or, with none, leave it blurred, so the browser carries Tab on from the field's place.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    Event: class { public readonly type: string; public constructor(type: string) { this.type = type; } },
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
