// A folded menu's group flies out beside its icon: opened from the keyboard its first entry takes the keyboard, opened by a press
// the focus stays on the rail; and one group's flyout swapped for another's goes at once, not fading under the new one.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900, localStorage: { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } },
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

const { MenuGroupEngine } = await import("../src/interactions/menu-group-engine.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

type Group = { readonly entry: FakeElement; readonly submenu: FakeElement; readonly entries: readonly FakeElement[] };

function group(name: string): { readonly element: FakeElement; readonly parts: Group } {
    const entry = FakeElement.of("ui-menu-item", { id: name });
    const entries = ["one", "two"].map(item => FakeElement.of("ui-menu-item", { id: `${name}-${item}` }));
    const submenu = FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(...entries));
    const element = FakeElement.of("ui-menu__item", { "data-ui-menu-group": "", "data-ui-key": name }).append(entry, submenu);

    return { element, parts: { entry, submenu, entries } };
}

const layouts = group("layouts");
const inputs = group("inputs");

fakeDocument.body.append(FakeElement.of("ui-menu", { "data-ui-collapsed": "" }).append(FakeElement.of("ui-menu__host").append(layouts.element, inputs.element)));

new MenuGroupEngine({ root: real<ParentNode>(fakeDocument.body) });

function openByKey(at: Group): void {
    at.entry.focus();
    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    at.entry.dispatchEvent(new FakeEvent("click"));
}

function openByPress(at: Group): void {
    notePress(real(at.entry));
    at.entry.focus();
    at.entry.dispatchEvent(new FakeEvent("click"));
}

test("a group's flyout opened from the keyboard gives its first entry the keyboard", () => {
    openByKey(layouts.parts);

    assert.equal(layouts.parts.submenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(fakeDocument.activeElement, layouts.parts.entries[0]);

    openByKey(layouts.parts);
});

test("a group's flyout opened by a press leaves the focus on the rail", () => {
    openByPress(inputs.parts);

    assert.equal(fakeDocument.activeElement, inputs.parts.entry);

    openByPress(inputs.parts);
});

test("one group's flyout swapped for another's goes at once, not fading under the new one", () => {
    openByPress(layouts.parts);
    openByPress(inputs.parts);

    assert.equal(layouts.parts.submenu.hasAttribute("data-ui-menu-flyout"), false);
    assert.equal(inputs.parts.submenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(inputs.element.hasAttribute("data-ui-menu-open"), true);
});
