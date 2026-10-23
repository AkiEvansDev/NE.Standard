// A popup lifted out from under a transformed ancestor (a canvas's scene) is in the top layer from its first frame: the hold its fade
// keeps on `overlay` for the exit is taken off the showing, or it is measured scaled with the scene and placed by that box.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const transitions = new Map<FakeElement, { transitionProperty: string; transitionDuration: string }>();
const transformed = new Set<FakeElement>();
const individual = new Map<FakeElement, { translate?: string; scale?: string; rotate?: string }>();

installFakeDom({
    window: { innerWidth: 1000, innerHeight: 800, addEventListener: () => undefined },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    },
    getComputedStyle: (element: FakeElement) => ({
        transform: transformed.has(element) ? "scale(0.5)" : "none",
        filter: "none",
        perspective: "none",
        translate: "none",
        scale: "none",
        rotate: "none",
        ...individual.get(element),
        getPropertyValue: () => "auto",
        ...transitions.get(element) ?? { transitionProperty: "all", transitionDuration: "0s" }
    })
});

const { placeAnchoredPopup } = await import("../src/interactions/anchored-popup.ts");

/** Places a popup inside a scaled scene and tells what its inline transition durations were as it entered the top layer. */
function durationsAtShowing(transition: { transitionProperty: string; transitionDuration: string }): { atShowing: unknown; after: unknown } {
    const scene = FakeElement.of("scene");
    const anchor = FakeElement.of("anchor");
    const popup = FakeElement.of("popup");
    let atShowing: unknown = "not shown";

    Object.assign(popup, {
        showPopover: () => {
            atShowing = popup.style["transition-duration"];
        }
    });

    anchor.rect = { left: 100, top: 300, width: 80, height: 30 };
    popup.rect = { left: 0, top: 0, width: 120, height: 34 };
    transformed.add(scene);
    transitions.set(popup, transition);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(scene.append(anchor.append(popup)));

    placeAnchoredPopup(real(anchor), real(popup), { placement: "top", gap: 6 });

    return { atShowing, after: popup.style["transition-duration"] };
}

test("a lifted popup enters the top layer with no hold on overlay, its fade's other durations kept, and the hold back after", () => {
    const { atShowing, after } = durationsAtShowing({ transitionProperty: "opacity, display, overlay", transitionDuration: "0.15s" });

    assert.equal(atShowing, "0.15s, 0.15s, 0s");
    assert.equal(after, undefined);
});

test("a lifted popup with no overlay among its transitions is shown as it stands", () => {
    const { atShowing, after } = durationsAtShowing({ transitionProperty: "opacity", transitionDuration: "0.15s" });

    assert.equal(atShowing, undefined);
    assert.equal(after, undefined);
});

/** Places a popup under an ancestor wearing `style` and tells whether it was lifted into the top layer. */
function liftedUnder(style: { translate?: string; scale?: string; rotate?: string }): boolean {
    const box = FakeElement.of("box");
    const anchor = FakeElement.of("anchor");
    const popup = FakeElement.of("popup");
    let shown = false;

    Object.assign(popup, {
        showPopover: () => {
            shown = true;
        }
    });

    anchor.rect = { left: 100, top: 300, width: 80, height: 30 };
    popup.rect = { left: 0, top: 0, width: 120, height: 34 };
    individual.set(box, style);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(box.append(anchor.append(popup)));

    placeAnchoredPopup(real(anchor), real(popup), { placement: "bottom", gap: 6 });

    return shown;
}

test("a popup under an ancestor moved by an individual transform is lifted, even one moved by nothing", () => {
    assert.equal(liftedUnder({ translate: "0px 0%" }), true);
    assert.equal(liftedUnder({ scale: "0.5" }), true);
    assert.equal(liftedUnder({ rotate: "45deg" }), true);
});

test("a popup under an ancestor with no transform of any kind stays where it stands", () => {
    assert.equal(liftedUnder({}), false);
});
