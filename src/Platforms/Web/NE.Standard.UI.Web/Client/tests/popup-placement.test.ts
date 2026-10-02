// A popup takes the side it asks for, flips to the opposite one where that has the room, and — in a window too short for either
// side of its axis — stands beside its anchor across the axis rather than being clamped over the anchor it opened from. A boundary
// (a list's box) is the room its side is chosen in.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const viewport = { innerWidth: 1000, innerHeight: 300 };
// The size observer's callback, called by hand: a popup's own size changing.
let observed: ((entries: readonly { readonly target: unknown }[]) => void) | null = null;

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
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none" })
});

const { placeAnchoredPopup, releaseAnchoredPopup, repositionAnchoredPopup } = await import("../src/interactions/anchored-popup.ts");

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

test("a popup with room nowhere keeps the side of its axis with the more room, as before", () => {
    assert.equal(place({ left: 100, top: 120, width: 300, height: 30 }, { width: 500, height: 250 }, { width: 500, height: 300 }).side, "bottom-start");
    assert.equal(place({ left: 100, top: 150, width: 300, height: 30 }, { width: 500, height: 250 }, { width: 500, height: 300 }).side, "top-start");
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

        // Neither side has the room: the popup is held inside what the keyboard leaves, over its anchor rather than under the keys.
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
