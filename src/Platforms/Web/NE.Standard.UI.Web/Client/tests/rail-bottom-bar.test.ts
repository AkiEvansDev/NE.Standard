// A rail that is the whole of a left side stands as the page's bottom bar on a phone: its groups fly out above it — under the small
// breakpoint as a sheet from the bottom — and its cut labels' words stand there too, the arrows across it walk its entries; on a wide
// screen, or outside such a side, it is the column it always was.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let width = 390;
const widthListeners: (() => void)[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 390, innerHeight: 844, localStorage: { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } },
    getComputedStyle: () => ({ getPropertyValue: () => "", transform: "none", filter: "none", perspective: "none", direction: "ltr", position: "static", overflowX: "visible", overflowY: "visible", transitionProperty: "all", transitionDuration: "0s" }),
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

const { MenuGroupEngine, isBottomBar, towardContent } = await import("../src/interactions/menu-group-engine.ts");
const { MenuEngine } = await import("../src/interactions/menu-engine.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

function entry(id: string): FakeElement {
    return FakeElement.of("ui-menu-item", { id, tabindex: "-1" }, "a");
}

const chats = entry("chats");
const calls = entry("calls");
const moreEntry = entry("more");
const moreSubmenu = FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry("settings")))));
const more = FakeElement.of("ui-menu__item", { "data-ui-menu-group": "", "data-ui-key": "more" }).append(moreEntry, moreSubmenu);

moreEntry.rect = { left: 290, top: 788, width: 100, height: 56 };

const rail = FakeElement.of("ui-menu ui-menu--rail ui-orientation--vertical ui-side--left").append(
    FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(chats), FakeElement.of("ui-menu__item").append(calls), more)
);

// As the server writes the issue's own side: the rail in a padded box, the side marked a bar.
const bar = FakeElement.of("", { "data-ui-region": "left-side", "data-ui-bottom-bar": "" }).append(FakeElement.of("ui-container", { "data-ui-id": "1" }).append(rail));

fakeDocument.body.append(FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "" }).append(bar));

new MenuGroupEngine({ root: real<ParentNode>(fakeDocument.body) });
new MenuEngine({ root: real<ParentNode>(fakeDocument.body) });

function key(name: string): void {
    const domEvent = new FakeKeyboardEvent(name, fakeDocument.activeElement);

    noteKey(real<Event>(domEvent));
    fakeDocument.activeElement?.dispatchEvent(domEvent);
}

test("on a phone a rail that is its side's whole is the bottom bar, and its popups open above it", () => {
    width = 390;

    assert.equal(isBottomBar(real(rail)), true);
    assert.equal(towardContent(real(rail)), "top");
});

test("on a wide screen the same rail is its column again, its popups beside it", () => {
    width = 1280;

    assert.equal(isBottomBar(real(rail)), false);
    assert.equal(towardContent(real(rail)), "right");

    width = 390;
});

test("a rail outside a marked side, and a list menu inside one, are no bar", () => {
    const loose = FakeElement.of("ui-menu ui-menu--rail ui-side--left");
    const list = FakeElement.of("ui-menu ui-side--left");

    FakeElement.of("", { "data-ui-bottom-bar": "" }).append(list);

    assert.equal(towardContent(real(loose)), "right");
    assert.equal(towardContent(real(list)), "right");
});

test("a group of the bar flies out above it", () => {
    width = 700;
    notePress(real(moreEntry));
    moreEntry.focus();
    moreEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(moreSubmenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(real<HTMLElement>(moreSubmenu).dataset.uiPlacement, "top-start");

    moreEntry.dispatchEvent(new FakeEvent("click"));
    width = 390;
});

test("under the small breakpoint a group of the bar opens as a sheet from the bottom", () => {
    notePress(real(moreEntry));
    moreEntry.focus();
    moreEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(moreSubmenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(moreSubmenu.getAttribute("data-ui-sheet"), "root");

    moreEntry.dispatchEvent(new FakeEvent("click"));
});

test("a group's flyout goes when the bar turns into its column", () => {
    width = 700;
    notePress(real(moreEntry));
    moreEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(moreEntry.parentElement?.hasAttribute("data-ui-menu-open"), true);

    width = 1280;

    for (const listener of widthListeners)
        listener();

    assert.equal(moreEntry.parentElement?.hasAttribute("data-ui-menu-open"), false, "placed above a bar, it would hang over the column's entries");

    width = 390;
});

test("the arrows across the bar walk its entries, and those along it are left to the page", () => {
    chats.focus();
    key("ArrowRight");

    assert.equal(fakeDocument.activeElement, calls);

    key("ArrowDown");

    assert.equal(fakeDocument.activeElement, calls, "a bar runs across, so Down is not its key");

    key("ArrowLeft");

    assert.equal(fakeDocument.activeElement, chats);
});

test("on a wide screen the column's arrows are Up and Down again", () => {
    width = 1280;
    chats.focus();
    key("ArrowDown");

    assert.equal(fakeDocument.activeElement, calls);

    width = 390;
});
