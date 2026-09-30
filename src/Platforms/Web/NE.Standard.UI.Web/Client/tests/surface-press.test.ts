// A clickable surface is a press target for the keyboard: a Tab stop, Enter and Space raising its click (Space on its release), a
// button to a screen reader while it holds no control of its own and a group once it does; a disabled or loading one is no stop, and
// a key from a control inside it is that control's.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

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
