// A split button's list: opened by a press it holds the keyboard itself, the first arrow entering at the near end; opened by a key
// it starts on its first entry — ArrowUp on a closed opener on its last — and every opening starts afresh, not where the last one
// was left.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { SplitButtonEngine } = await import("../src/interactions/split-button-engine.ts");
const { MenuEngine } = await import("../src/interactions/menu-engine.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new SplitButtonEngine({ root: real<ParentNode>(fakeDocument.body) });
new MenuEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly button: FakeElement; readonly toggle: FakeElement; readonly list: FakeElement; readonly entries: readonly FakeElement[] };

function scene(): Scene {
    const entries = ["restart", "stop", "remove"].map(name => FakeElement.of("ui-menu-item", { id: name, role: "menuitem" }));
    const list = FakeElement.of("ui-menu", { role: "menu" }).append(...entries);
    const toggle = FakeElement.of("ui-split-button__toggle", { "aria-haspopup": "menu" }, "button");
    const button = FakeElement.of("ui-split-button", { "data-ui-id": "4" }).append(
        FakeElement.of("ui-split-button__main", {}, "button"),
        toggle,
        FakeElement.of("ui-split-button__menu", { role: "presentation" }).append(list)
    );

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(button);
    toggle.focus();

    return { button, toggle, list, entries };
}

function key(name: string, target: FakeElement | null = fakeDocument.activeElement): void {
    const event = new FakeKeyboardEvent(name, target);

    noteKey(real<Event>(event));
    target?.dispatchEvent(event);
}

function press(at: Scene): void {
    notePress(real(at.toggle));
    at.toggle.dispatchEvent(new FakeEvent("click"));
}

function escape(): void {
    key("Escape", fakeDocument.documentElement);
}

test("a list a press opened holds the keyboard itself, and the first ArrowDown lands on its first entry", () => {
    const at = scene();

    press(at);

    assert.equal(at.button.classes.has("ui-split-button--open"), true);
    assert.equal(fakeDocument.activeElement, at.list);
    assert.deepEqual(at.entries.map(entry => entry.getAttribute("tabindex")), ["-1", "-1", "-1"]);

    key("ArrowDown");

    assert.equal(fakeDocument.activeElement, at.entries[0]);
    escape();
});

test("ArrowDown on the closed opener opens on the first entry, ArrowUp on the last", () => {
    const at = scene();

    key("ArrowDown");

    assert.equal(fakeDocument.activeElement, at.entries[0]);

    escape();
    at.toggle.focus();
    key("ArrowUp");

    assert.equal(fakeDocument.activeElement, at.entries[2]);
    escape();
});

test("a list opened again from the keyboard starts afresh, not on the entry the last opening was left on", () => {
    const at = scene();

    press(at);
    key("ArrowDown");
    key("ArrowDown");

    assert.equal(fakeDocument.activeElement, at.entries[1]);

    escape();
    at.toggle.focus();
    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    at.toggle.dispatchEvent(new FakeEvent("click"));

    assert.equal(fakeDocument.activeElement, at.entries[0]);
    escape();
});
