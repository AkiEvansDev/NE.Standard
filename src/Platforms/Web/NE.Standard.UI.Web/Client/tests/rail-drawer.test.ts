// A left side that is a rail alone, kept a drawer by its view (UIViewOptions.RailBottomBar off): on a phone the rail is drawn as a
// list, its groups opening inline; on a wide screen it is the rail again, its groups flying out. A rail in any other drawer stays one.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let width = 390;
const widthListeners: (() => void)[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 390, innerHeight: 844, localStorage: { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } },
    getComputedStyle: () => ({ getPropertyValue: () => "", transform: "none", filter: "none", perspective: "none", direction: "ltr", position: "static", overflowX: "visible", overflowY: "visible" }),
    // The stylesheet's own question: a `min-width` query answered for the width this test sets.
    matchMedia: (query: string) => ({ matches: width >= Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0), addEventListener: (_: string, listener: () => void) => widthListeners.push(listener) }),
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

const { MenuGroupEngine, isBottomBar } = await import("../src/interactions/menu-group-engine.ts");

const RailClass = "ui-menu--rail";
const OpenAttribute = "data-ui-menu-open";
const FlyoutAttribute = "data-ui-menu-flyout";

function entry(id: string, selected = false): FakeElement {
    return FakeElement.of(selected ? "ui-menu-item ui-menu-item--selected" : "ui-menu-item", { id, tabindex: "-1" }, "a");
}

const settingsEntry = entry("settings");
const settingsSubmenu = FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry("profile", true)))));
const settings = FakeElement.of("ui-menu__item", { "data-ui-menu-group": "", "data-ui-key": "settings" }).append(settingsEntry, settingsSubmenu);

const rail = FakeElement.of(`ui-menu ${RailClass} ui-menu--medium ui-orientation--vertical ui-side--left`).append(
    FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry("chats")), settings)
);

// As the server writes a side kept a drawer: the rail in a padded box, the side marked.
const side = FakeElement.of("", { "data-ui-region": "left-side", "data-ui-rail-drawer": "" }).append(FakeElement.of("ui-container", { "data-ui-id": "1" }).append(rail));

// A rail beside something else in an ordinary drawer, which stays the rail it is.
const otherRail = FakeElement.of(`ui-menu ${RailClass} ui-orientation--vertical ui-side--right`);
const otherSide = FakeElement.of("", { "data-ui-region": "right-side" }).append(FakeElement.of("ui-stack-panel", { "data-ui-id": "2" }).append(otherRail));

fakeDocument.body.append(FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "" }).append(side, otherSide));

new MenuGroupEngine({ root: real<ParentNode>(fakeDocument.body) });

function resize(to: number): void {
    width = to;

    for (const listener of widthListeners)
        listener();
}

test("on a phone the drawer's rail is a list, its current page's group open inline, and no bar", () => {
    assert.equal(rail.classList.contains(RailClass), false);
    assert.equal(settings.hasAttribute(OpenAttribute), true, "the group the current page sits in opens as a list's does");
    assert.equal(settingsSubmenu.hasAttribute(FlyoutAttribute), false);
    assert.equal(isBottomBar(real(rail)), false);
});

test("a rail in any other drawer stays a rail", () => {
    assert.equal(otherRail.classList.contains(RailClass), true);
});

test("a group of the list folds and unfolds in place", () => {
    settingsEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(settings.hasAttribute(OpenAttribute), false);

    settingsEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(settings.hasAttribute(OpenAttribute), true);
    assert.equal(settingsSubmenu.hasAttribute(FlyoutAttribute), false, "inline, not a popup beside the entry");
});

test("on a wide screen it is the rail again, its inline group closed and its groups flying out", () => {
    resize(1280);

    assert.equal(rail.classList.contains(RailClass), true);
    assert.equal(settings.hasAttribute(OpenAttribute), false);

    settingsEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(settingsSubmenu.hasAttribute(FlyoutAttribute), true);

    settingsEntry.dispatchEvent(new FakeEvent("click"));
});

test("narrow again, it is the list again", () => {
    resize(390);

    assert.equal(rail.classList.contains(RailClass), false);
    assert.equal(settings.hasAttribute(OpenAttribute), true);
});
