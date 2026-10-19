// A split button's list on a phone is a sheet from the bottom, closed as its list beside the button is: Escape puts it away and gives
// the keyboard back to the opener, and the window widening past the small breakpoint puts it away too.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let width = 390;
const tierListeners: (() => void)[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, innerWidth: 390, innerHeight: 844 },
    matchMedia: (query: string) => ({ matches: width >= Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0), addEventListener: (_: string, listener: () => void) => tierListeners.push(listener) }),
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr", transitionProperty: "all", transitionDuration: "0s", getPropertyValue: () => "" }),
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
const { notePress } = await import("../src/interactions/popup-focus.ts");

new SplitButtonEngine({ root: real<ParentNode>(fakeDocument.body) });
new MenuEngine({ root: real<ParentNode>(fakeDocument.body) });

function scene(): { button: FakeElement; toggle: FakeElement; menu: FakeElement; list: FakeElement } {
    const list = FakeElement.of("ui-menu", { role: "menu" }).append(FakeElement.of("ui-menu-item", { role: "menuitem" }));
    const toggle = FakeElement.of("ui-split-button__toggle", { "aria-haspopup": "menu" }, "button");
    const menu = FakeElement.of("ui-split-button__menu", { role: "presentation" }).append(list);
    const button = FakeElement.of("ui-split-button", { "data-ui-id": "4" }).append(FakeElement.of("ui-split-button__main", {}, "button"), toggle, menu);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(button);
    toggle.focus();
    notePress(real(toggle));
    toggle.dispatchEvent(new FakeEvent("click"));

    return { button, toggle, menu, list };
}

test("Escape puts a split button's sheet away and gives the keyboard back to its opener", async () => {
    width = 390;

    const { button, toggle, menu, list } = scene();

    await Promise.resolve();

    assert.equal(menu.getAttribute("data-ui-sheet"), "root");
    assert.equal(fakeDocument.activeElement, list);

    fakeDocument.documentElement.dispatchEvent(new FakeKeyboardEvent("Escape", list));

    assert.equal(button.classes.has("ui-split-button--open"), false);
    assert.equal(menu.popoverOpen, false);
    assert.equal(fakeDocument.activeElement, toggle);
});

test("the window widening past the small breakpoint puts a split button's sheet away", () => {
    width = 390;

    const { button, toggle, menu } = scene();

    assert.equal(menu.getAttribute("data-ui-sheet"), "root");

    width = 1280;

    for (const listener of [...tierListeners])
        listener();

    assert.equal(button.classes.has("ui-split-button--open"), false);
    assert.equal(menu.popoverOpen, false);
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
});
