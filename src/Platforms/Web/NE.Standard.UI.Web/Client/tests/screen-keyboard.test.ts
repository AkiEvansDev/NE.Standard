// A phone's on-screen keyboard, read off the visual viewport: up while a field takes typing and the window has lost more than a bar's
// height since it stood tallest at its width — not for a toolbar folding, nor for a press on a button that shrank nothing.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, FakeTextArea, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { isKeyboardUp } = await import("../src/interactions/screen-keyboard.ts");
const { takesTyping } = await import("../src/interactions/caret-fields.ts");

test("the keyboard is up while a field takes typing and the window lost more than a bar's height", () => {
    assert.equal(isKeyboardUp({ height: 420, tallest: 780, typing: true }), true);
    assert.equal(isKeyboardUp({ height: 420, tallest: 780, typing: false }), false, "no field: a split screen or a pinch, not a keyboard");
    assert.equal(isKeyboardUp({ height: 724, tallest: 780, typing: true }), false, "the browser's toolbar coming back is no keyboard");
});

test("a text field or a text area takes typing; a button and a checkbox do not", () => {
    const checkbox = new FakeInput("checkbox");

    assert.equal(takesTyping(real(new FakeInput())), true);
    assert.equal(takesTyping(real(new FakeTextArea())), true);
    assert.equal(takesTyping(real(checkbox)), false);
    assert.equal(takesTyping(real(FakeElement.of("", {}, "button"))), false);
    assert.equal(takesTyping(null), false);
});
