// A clickable surface is a press target for the keyboard: a Tab stop, Enter and Space raising its click (Space on its release), a
// button to a screen reader while it holds no control of its own and a group once it does; a disabled or loading one is no stop, and
// a key from a control inside it is that control's. Under the pointer it washes and presses only where no control of its own takes the
// pointer, which the engine marks on it.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { SurfacePressEngine } = await import("../src/interactions/surface-press-engine.ts");

function surface(classes = "ui-surface ui-surface--clickable", ...children: FakeElement[]): FakeElement {
    return FakeElement.of(classes, { "data-ui-id": "7" }).append(...children);
}

/** Starts the engine over the surfaces, and counts the clicks each one raises. */
function start(...surfaces: FakeElement[]): Map<FakeElement, number> {
    const clicks = new Map<FakeElement, number>();

    for (const element of surfaces) {
        clicks.set(element, 0);
        element.addEventListener("click", () => clicks.set(element, (clicks.get(element) ?? 0) + 1));
    }

    fakeDocument.body.replaceChildren(...surfaces);
    new SurfacePressEngine({ root: real<ParentNode>(fakeDocument.body) });

    return clicks;
}

function keyUp(key: string, target: FakeElement): FakeKeyboardEvent {
    return Object.defineProperty(new FakeKeyboardEvent(key, target), "type", { value: "keyup" });
}

test("a clickable surface holding only words is a button the Tab stops on, and a plain one is neither", () => {
    const card = surface("ui-card ui-surface--clickable", FakeElement.of("ui-text"));
    const plain = surface("ui-surface");

    start(card, plain);

    assert.equal(card.getAttribute("tabindex"), "0");
    assert.equal(card.getAttribute("role"), "button");
    assert.equal(plain.hasAttribute("tabindex"), false);
    assert.equal(plain.hasAttribute("role"), false);
});

test("one holding a control of its own is a group, so the control inside stays the reader's", () => {
    const holder = surface(undefined, FakeElement.of("ui-button", {}, "button"));
    const outer = surface(undefined, surface());

    start(holder, outer);

    assert.equal(holder.getAttribute("role"), "group");
    assert.equal(holder.getAttribute("tabindex"), "0");
    assert.equal(outer.getAttribute("role"), "group");
});

test("its own right-click menu is a popup of its own, not a control it holds", () => {
    const menu = FakeElement.of("ui-context-menu", { role: "menu" }).append(FakeElement.of("ui-menu-item", {}, "button"));
    const card = surface("ui-card ui-surface--clickable", FakeElement.of("ui-text"), menu);

    start(card);

    assert.equal(card.getAttribute("role"), "button");
});

test("Enter presses it at once and Space on its release, taking the key from the page", () => {
    const pressable = surface();
    const clicks = start(pressable);
    const enter = new FakeKeyboardEvent("Enter", pressable);
    const space = new FakeKeyboardEvent(" ", pressable);

    pressable.dispatchEvent(enter);
    assert.equal(clicks.get(pressable), 1);
    assert.equal(enter.defaultPrevented, true);

    pressable.dispatchEvent(space);
    assert.equal(clicks.get(pressable), 1);
    assert.equal(space.defaultPrevented, true);

    pressable.dispatchEvent(keyUp(" ", pressable));
    assert.equal(clicks.get(pressable), 2);
});

test("a key from a field inside it is the field's", () => {
    const field = FakeElement.of("ui-text-input__native", {}, "input");
    const holder = surface(undefined, field);
    const clicks = start(holder);
    const enter = new FakeKeyboardEvent("Enter", field);

    field.dispatchEvent(enter);
    field.dispatchEvent(new FakeKeyboardEvent(" ", field));
    field.dispatchEvent(keyUp(" ", field));

    assert.equal(clicks.get(holder), 0);
    assert.equal(enter.defaultPrevented, false);
});

test("a disabled or loading surface is no stop and takes no key, and says it is still a button", () => {
    const disabled = surface("ui-surface ui-surface--clickable ui-disabled");
    const loading = surface("ui-card ui-surface--clickable ui-loading");
    const clicks = start(disabled, loading);

    disabled.dispatchEvent(new FakeKeyboardEvent("Enter", disabled));

    assert.equal(disabled.hasAttribute("tabindex"), false);
    assert.equal(loading.hasAttribute("tabindex"), false);
    assert.equal(disabled.getAttribute("role"), "button");
    assert.equal(clicks.get(disabled), 0);
});

test("a picture of a surface, with no id, is left alone", () => {
    const copy = FakeElement.of("ui-surface ui-surface--clickable");

    start(copy);

    assert.equal(copy.hasAttribute("tabindex"), false);
});

/** A pointer event on `target`, as the root hears it bubbling up. */
function pointer(type: string, target: FakeElement, init: Readonly<Record<string, unknown>> = {}): void {
    target.dispatchEvent(Object.assign(new FakeEvent(type), { button: 0, relatedTarget: null }, init));
}

const Mark = "data-ui-inner-pointer";

test("the pointer over a control inside marks every clickable surface around it, and off it on the surface's own ground", () => {
    const glyph = FakeElement.of("ui-icon");
    const button = FakeElement.of("ui-button", {}, "button").append(glyph);
    const words = FakeElement.of("ui-text");
    const card = surface("ui-card ui-surface--clickable", words, button);
    const outer = surface(undefined, card);
    const plain = surface("ui-surface", FakeElement.of("ui-button", {}, "button"));

    start(outer, plain);

    pointer("pointerover", glyph);
    assert.deepEqual([card.getAttribute(Mark), outer.getAttribute(Mark)], ["hover", "hover"]);

    pointer("pointerover", words);
    assert.deepEqual([card.hasAttribute(Mark), outer.hasAttribute(Mark)], [false, false]);

    pointer("pointerover", plain.children[0]);
    assert.equal(plain.hasAttribute(Mark), false);
});

test("a press on a control inside holds its mark until the release, wherever the pointer goes meanwhile", () => {
    const button = FakeElement.of("ui-button", {}, "button");
    const words = FakeElement.of("ui-text");
    const card = surface("ui-card ui-surface--clickable", words, button);

    start(card);

    pointer("pointerover", button);
    pointer("pointerdown", button);
    assert.equal(card.getAttribute(Mark), "hover press");

    pointer("pointerout", button, { relatedTarget: words });
    pointer("pointerover", words);
    assert.equal(card.getAttribute(Mark), "press");

    pointer("pointerup", words);
    assert.equal(card.hasAttribute(Mark), false);

    // A press that becomes a drag holds `:active` through it: the browser's cancel at the drag's start leaves the mark, its end takes it.
    pointer("pointerdown", button);
    pointer("dragstart", button);
    pointer("pointercancel", button);
    assert.equal(card.getAttribute(Mark), "press");

    pointer("dragend", button);
    assert.equal(card.hasAttribute(Mark), false);

    // A press the browser cancels with no drag (a finger turning into a scroll) is over.
    pointer("pointerdown", button);
    pointer("pointercancel", button);
    assert.equal(card.hasAttribute(Mark), false);

    // A press on the surface's own ground is the surface's; a secondary button presses nothing.
    pointer("pointerdown", words);
    pointer("pointerdown", button, { button: 2 });
    assert.equal(card.hasAttribute(Mark), false);
});

test("the pointer leaving the page takes the hover mark off", () => {
    const button = FakeElement.of("ui-button", {}, "button");
    const card = surface("ui-card ui-surface--clickable", button);

    start(card);

    pointer("pointerover", button);
    pointer("pointerout", button);

    assert.equal(card.hasAttribute(Mark), false);
});
