// A popup takes the side it asks for, flips to the opposite one where that has the room, and — in a window too short for either
// side of its axis — stands beside its anchor across the axis rather than being clamped over the anchor it opened from; with room
// nowhere, it takes the larger side of its axis capped to that room, scrolling inside. A boundary
// (a list's box) is the room its side is chosen in. A popup opened from inside a popup or bar keeps the gap off that surface's edge,
// on whichever side it ends up, and a submenu stands with its first entry level with the entry it opened from. A menu at the pointer
// opens down and to the right of it, turning up or leftward where there is no room, as a native one does.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const viewport = { innerWidth: 1000, innerHeight: 300 };
// The size observer's callback, called by hand: a popup's own size changing.
let observed: ((entries: readonly { readonly target: unknown }[]) => void) | null = null;
// An element's own padding and border, where a test gives it one.
const boxStyles = new Map<unknown, Readonly<Record<string, string>>>();

installFakeDom({
    window: Object.assign(viewport, { addEventListener: () => undefined }),
    ResizeObserver: class {
        public constructor(callback: (entries: readonly { readonly target: unknown }[]) => void) {
            observed = callback;
        }

        public observe(): void {
        }

        public unobserve(): void {
        }
    },
    getComputedStyle: (element: unknown) => ({ transform: "none", filter: "none", perspective: "none", ...boxStyles.get(element) })
});

const { PopupGap, placeAnchoredPopup, placeAtPoint, releaseAnchoredPopup, repositionAnchoredPopup } = await import("../src/interactions/anchored-popup.ts");

type Placed = { readonly side: string; readonly left: number; readonly top: number };

/** Places a popup of the given size against an anchor at the given box, in a window of the given size. */
function place(anchor: { left: number; top: number; width: number; height: number }, popup: { width: number; height: number }, view: { width: number; height: number }, placement: "bottom-start" | "top" | "right" = "bottom-start", extra: readonly FakeElement[] = []): Placed {
    viewport.innerWidth = view.width;
    viewport.innerHeight = view.height;

    const anchorElement = FakeElement.of("anchor");
    const popupElement = FakeElement.of("popup");

    anchorElement.rect = anchor;
    popupElement.rect = { left: 0, top: 0, ...popup };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(anchorElement, popupElement, ...extra);

    placeAnchoredPopup(real(anchorElement), real(popupElement), { placement, gap: 4 });
    releaseAnchoredPopup(real(popupElement));

    return { side: popupElement.dataset.uiPlacement, left: Number.parseFloat(String(popupElement.style.left)), top: Number.parseFloat(String(popupElement.style.top)) };
}

test("a popup with room below stays below, and one with room only above flips above", () => {
    assert.equal(place({ left: 100, top: 20, width: 80, height: 30 }, { width: 200, height: 150 }, { width: 1000, height: 300 }).side, "bottom-start");
    assert.equal(place({ left: 100, top: 240, width: 80, height: 30 }, { width: 200, height: 150 }, { width: 1000, height: 300 }).side, "top-start");
});

test("a popup with room neither below nor above stands beside its anchor, clear of it", () => {
    const placed = place({ left: 100, top: 120, width: 80, height: 30 }, { width: 200, height: 250 }, { width: 1000, height: 300 });

    assert.equal(placed.side, "right-start");
    assert.equal(placed.left, 184);
    // Clamped into the window along its new cross axis, as any popup is.
    assert.equal(placed.top, 46);
});

test("with no room to the right it stands to the left, and a popup asked above runs upward from the anchor's foot", () => {
    assert.equal(place({ left: 800, top: 120, width: 80, height: 30 }, { width: 200, height: 250 }, { width: 900, height: 300 }).side, "left-start");
    assert.equal(place({ left: 100, top: 120, width: 80, height: 30 }, { width: 200, height: 250 }, { width: 1000, height: 300 }, "top").side, "right-end");
});

test("a popup with room nowhere takes the side of its axis with the more room, capped to it and scrolling, its anchor in sight", () => {
    assert.equal(place({ left: 100, top: 120, width: 300, height: 30 }, { width: 500, height: 250 }, { width: 500, height: 300 }).side, "bottom-start");
    assert.equal(place({ left: 100, top: 150, width: 300, height: 30 }, { width: 500, height: 250 }, { width: 500, height: 300 }).side, "top-start");

    viewport.innerWidth = 500;
    viewport.innerHeight = 300;

    const anchor = FakeElement.of("anchor");
    const popup = FakeElement.of("popup");

    anchor.rect = { left: 100, top: 120, width: 300, height: 30 };
    popup.rect = { left: 0, top: 0, width: 500, height: 250 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(anchor, popup);

    placeAnchoredPopup(real(anchor), real(popup), { placement: "bottom-start", gap: 4 });

    // Below the anchor's foot (150), less the gap and the window's margin: 300 - 150 - 4 - 4.
    assert.equal(popup.style["max-height"], "142px");
    assert.equal(popup.style["overflow-y"], "auto");

    // Room come back: the cap is taken off before the popup is measured again, and it stands whole.
    viewport.innerHeight = 600;
    repositionAnchoredPopup(real(popup));
    releaseAnchoredPopup(real(popup));

    assert.equal(popup.style["max-height"], undefined);
    assert.equal(popup.dataset.uiPlacement, "bottom-start");
});

test("a side popup with no room either way flips across to below", () => {
    assert.equal(place({ left: 100, top: 20, width: 800, height: 30 }, { width: 150, height: 100 }, { width: 1000, height: 300 }, "right").side, "bottom-start");
});

test("a boundary is the room a side is chosen in: a popup the window has room for above, but its box has not, stands below", () => {
    viewport.innerWidth = 1000;
    viewport.innerHeight = 600;

    const box = FakeElement.of("list");
    const anchor = FakeElement.of("row");
    const popup = FakeElement.of("bar");

    box.rect = { left: 0, top: 200, width: 600, height: 300 };
    anchor.rect = { left: 0, top: 210, width: 600, height: 40 };
    popup.rect = { left: 0, top: 0, width: 100, height: 30 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(box.append(anchor), popup);

    placeAnchoredPopup(real(anchor), real(popup), { placement: "top-end", gap: 6 });
    assert.equal(popup.dataset.uiPlacement, "top-end");

    placeAnchoredPopup(real(anchor), real(popup), { placement: "top-end", gap: 6, boundary: real(box) });
    releaseAnchoredPopup(real(popup));

    assert.equal(popup.dataset.uiPlacement, "bottom-end");
    assert.equal(Number.parseFloat(String(popup.style.top)), 256);
});

test("an on-screen keyboard's room is not the popup's: one that fitted below flips above it, and one that fits nowhere stays clear of it", () => {
    // A phone of 765 px with a keyboard taking the bottom 300: the visual viewport ends at 465, the window still at 765.
    Object.assign(viewport, { visualViewport: { scale: 1, offsetTop: 0, height: 465, addEventListener: () => undefined } });

    try {
        const flipped = place({ left: 16, top: 380, width: 358, height: 44 }, { width: 358, height: 300 }, { width: 390, height: 765 });

        assert.equal(flipped.side, "top-start");
        assert.equal(flipped.top, 76);

        const kept = place({ left: 16, top: 200, width: 358, height: 44 }, { width: 358, height: 300 }, { width: 390, height: 765 });

        // Neither side has the room: the popup is held inside what the keyboard leaves, capped to the larger side, not under the keys.
        assert.equal(kept.top + 300 <= 465 - 4, true);

        // Zoomed in, the page keeps the window's room, as before.
        Object.assign(viewport, { visualViewport: { scale: 2, offsetTop: 0, height: 200, addEventListener: () => undefined } });

        assert.equal(place({ left: 16, top: 200, width: 358, height: 44 }, { width: 358, height: 300 }, { width: 390, height: 765 }).side, "bottom-start");
    }
    finally {
        Object.assign(viewport, { visualViewport: undefined });
    }
});

test("a phone's bottom bar is not the popup's room: one that fitted below over the bar flips above, and a side column takes nothing", () => {
    const bar = FakeElement.of("", { "data-ui-bottom-bar": "" });

    // The composer's button above the bar: 120 px to the window's foot, 66 to the bar's top.
    bar.rect = { left: 0, top: 790, width: 390, height: 54 };
    assert.equal(place({ left: 90, top: 690, width: 36, height: 36 }, { width: 200, height: 110 }, { width: 390, height: 844 }, "bottom-start", [bar]).side, "top-start");

    // The same region from the drawer breakpoint up: the page's side column, the rail's width.
    bar.rect = { left: 0, top: 64, width: 72, height: 780 };
    assert.equal(place({ left: 90, top: 690, width: 36, height: 36 }, { width: 200, height: 110 }, { width: 390, height: 844 }, "bottom-start", [bar]).side, "bottom-start");
});

test("an open popup keeps its side while it fits there: a list narrowed above its field does not jump below it", () => {
    viewport.innerWidth = 1000;
    viewport.innerHeight = 300;

    const anchor = FakeElement.of("field");
    const popup = FakeElement.of("list");

    anchor.rect = { left: 100, top: 220, width: 200, height: 30 };
    popup.rect = { left: 0, top: 0, width: 200, height: 150 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(anchor, popup);

    placeAnchoredPopup(real(anchor), real(popup), { placement: "bottom-start", gap: 4 });
    assert.equal(popup.dataset.uiPlacement, "top-start");

    // Narrowed to one row, which its size observer hears: below would have the room now, and it stays above.
    popup.rect = { left: 0, top: 0, width: 200, height: 40 };
    observed?.([{ target: popup }]);
    assert.equal(popup.dataset.uiPlacement, "top-start");

    // Its anchor moved instead: the side is chosen afresh.
    repositionAnchoredPopup(real(popup));
    assert.equal(popup.dataset.uiPlacement, "bottom-start");

    releaseAnchoredPopup(real(popup));
});

/** A menu at 100,100 (200 × 40) with an entry inside its 5 px of padding and border, and a submenu of 160 × 120 to open from it. */
function submenuParts(menuLeft = 100): { readonly menu: FakeElement; readonly entry: FakeElement; readonly submenu: FakeElement } {
    const menu = FakeElement.of("menu");
    const entry = FakeElement.of("entry");
    const submenu = FakeElement.of("submenu");

    menu.rect = { left: menuLeft, top: 100, width: 200, height: 40 };
    entry.rect = { left: menuLeft + 5, top: 105, width: 190, height: 30 };
    submenu.rect = { left: 0, top: 0, width: 160, height: 120 };
    boxStyles.set(submenu, { paddingTop: "4px", borderTopWidth: "1px", paddingBottom: "6px", borderBottomWidth: "1px" });
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(menu.append(entry), submenu);

    return { menu, entry, submenu };
}

function placedAt(popup: FakeElement): { readonly side: string; readonly left: number; readonly top: number } {
    return { side: popup.dataset.uiPlacement, left: Number.parseFloat(String(popup.style.left)), top: Number.parseFloat(String(popup.style.top)) };
}

test("a gap left unset is the framework's one popup gap", () => {
    viewport.innerWidth = 1000;
    viewport.innerHeight = 600;

    const anchor = FakeElement.of("anchor");
    const popup = FakeElement.of("popup");

    anchor.rect = { left: 100, top: 100, width: 80, height: 30 };
    popup.rect = { left: 0, top: 0, width: 200, height: 100 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(anchor, popup);

    placeAnchoredPopup(real(anchor), real(popup), { placement: "bottom-start" });
    releaseAnchoredPopup(real(popup));

    assert.equal(PopupGap, 4);
    assert.equal(placedAt(popup).top, 130 + PopupGap);
});

test("a popup from an entry of a popup keeps the gap off that popup's edge, on the side it asked for and on the side it flips to", () => {
    viewport.innerWidth = 1000;
    viewport.innerHeight = 600;

    const right = submenuParts();

    placeAnchoredPopup(real(right.entry), real(right.submenu), { placement: "right-start", surface: real(right.menu) });
    releaseAnchoredPopup(real(right.submenu));
    assert.deepEqual(placedAt(right.submenu), { side: "right-start", left: 300 + PopupGap, top: 105 });

    // No room on the right: to the left, the same gap off the menu's left edge.
    const left = submenuParts(700);

    placeAnchoredPopup(real(left.entry), real(left.submenu), { placement: "right-start", surface: real(left.menu) });
    releaseAnchoredPopup(real(left.submenu));
    assert.deepEqual(placedAt(left.submenu), { side: "left-start", left: 700 - PopupGap - 160, top: 105 });
});

test("a submenu aligned by its entries stands with its first entry level with the entry, and run upward with its last", () => {
    viewport.innerWidth = 1000;
    viewport.innerHeight = 600;

    const down = submenuParts();

    placeAnchoredPopup(real(down.entry), real(down.submenu), { placement: "right-start", surface: real(down.menu), alignEntries: true });
    releaseAnchoredPopup(real(down.submenu));
    // Up by its top padding and border: its first entry's row starts where the entry's does.
    assert.equal(placedAt(down.submenu).top, 105 - 5);

    const up = submenuParts();

    placeAnchoredPopup(real(up.entry), real(up.submenu), { placement: "right-end", surface: real(up.menu), alignEntries: true });
    releaseAnchoredPopup(real(up.submenu));
    // Its last entry's row ends where the entry's does: down by its bottom padding and border.
    assert.equal(placedAt(up.submenu).top, 135 - 120 + 7);
});

/** A 200 × 150 menu placed at a point of a 1000 × 600 window. */
function atPoint(x: number, y: number, size = { width: 200, height: 150 }): { readonly left: number; readonly top: number } {
    viewport.innerWidth = 1000;
    viewport.innerHeight = 600;

    const menu = FakeElement.of("menu");

    menu.rect = { left: 0, top: 0, ...size };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(menu);
    placeAtPoint(real(menu), x, y);

    return { left: Number.parseFloat(String(menu.style.left)), top: Number.parseFloat(String(menu.style.top)) };
}

test("a menu at the pointer opens down and to the right of it, its corner on the point", () => {
    assert.deepEqual(atPoint(300, 200), { left: 300, top: 200 });
});

test("a menu at the pointer with no room below opens upward, its bottom edge on the point", () => {
    assert.deepEqual(atPoint(300, 500), { left: 300, top: 350 });
});

test("a menu at the pointer with no room to the right opens leftward, its right edge on the point", () => {
    assert.deepEqual(atPoint(900, 200), { left: 700, top: 200 });
});

test("a menu at the pointer in the window's far corner opens up and to the left, never over the point", () => {
    assert.deepEqual(atPoint(900, 500), { left: 700, top: 350 });
});

test("a menu at the pointer that fits on neither side is clamped inside the window", () => {
    // Taller than the room above and below the point alike: held 4 px off the window's foot.
    assert.deepEqual(atPoint(300, 300, { width: 200, height: 400 }), { left: 300, top: 196 });
});
