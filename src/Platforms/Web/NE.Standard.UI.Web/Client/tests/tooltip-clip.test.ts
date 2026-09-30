// A tooltip is not shown for a control scrolled or clipped out of a box around it — a field at the top of a dialog scrolled down —
// since its words would float outside that box, and one on screen closes when a scroll takes its control out of sight. A popup
// (fixed) escapes every box around it, an absolute element those below its containing block, and an edge that touches still shows.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1024, innerHeight: 768 },
    getComputedStyle: (element: FakeElement) => ({
        getPropertyValue: () => "",
        transform: element.style.transform ?? "none",
        filter: "none",
        perspective: "none",
        position: element.style.position ?? "static",
        overflowX: element.style.overflowX ?? "visible",
        overflowY: element.style.overflowY ?? "visible"
    }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { isClippedOut } = await import("../src/interactions/element-visibility.ts");
const { startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");

startTooltips();

/** A dialog's body scrolling its content: the box from 100 to 400 down the window, the anchor at `top` in it, 20 tall. */
function page(top: number): { readonly body: FakeElement; readonly anchor: FakeElement } {
    const body = FakeElement.of("ui-dialog__surface");
    const anchor = FakeElement.of("ui-text__badge", { "data-ui-tooltip": "The name printed on the card" }, "span");

    body.style.overflowX = "auto";
    body.style.overflowY = "auto";
    body.rect = { left: 100, top: 100, width: 400, height: 300 };
    anchor.rect = { left: 120, top, width: 20, height: 20 };
    body.append(anchor);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(body);

    return { body, anchor };
}

function clipped(element: FakeElement): boolean {
    return isClippedOut(real<Element>(element));
}

function shows(element: FakeElement): boolean {
    return element.getAttribute("aria-describedby") === "ui-tooltip";
}

function scroll(target: FakeElement): void {
    const domEvent = new FakeEvent("scroll");

    domEvent.target = target;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

test("a control scrolled wholly out of its box is out of sight; one inside it, or partly in, or touching its edge is not", () => {
    assert.equal(clipped(page(40).anchor), true);
    assert.equal(clipped(page(420).anchor), true);
    assert.equal(clipped(page(150).anchor), false);
    assert.equal(clipped(page(390).anchor), false);

    const { anchor } = page(400);

    anchor.rect = { left: 120, top: 400, width: 0, height: 0 };

    assert.equal(clipped(anchor), false);
});

test("a control out of the window is out of sight, whatever box it stands in", () => {
    const { body, anchor } = page(150);

    body.style.overflowX = "visible";
    body.style.overflowY = "visible";
    anchor.rect = { left: 120, top: -40, width: 20, height: 20 };

    assert.equal(clipped(anchor), true);
});

test("a fixed popup escapes every box around it, an absolute element the boxes below its containing block", () => {
    const { body, anchor } = page(40);
    const holder = new FakeElement();

    // Moved one level down, so the box between is not the anchor's containing block.
    body.children.length = 0;
    body.append(holder);
    holder.append(anchor);
    anchor.style.position = "fixed";

    assert.equal(clipped(anchor), false);

    anchor.style.position = "absolute";

    assert.equal(clipped(anchor), false);

    body.style.position = "relative";

    assert.equal(clipped(anchor), true);
});

test("a tooltip asked for a control out of its box shows nothing, and one inside shows", () => {
    tooltips.show(real(page(40).anchor), "The name printed on the card");

    assert.equal(fakeDocument.body.querySelector(".ui-tooltip--visible"), null);

    const { anchor } = page(150);

    tooltips.show(real(anchor), "The name printed on the card");

    assert.equal(shows(anchor), true);

    tooltips.hide();
});

test("a scroll that takes the control out of its box closes its tooltip; a scroll elsewhere leaves it", () => {
    const { body, anchor } = page(150);
    const elsewhere = new FakeElement();

    fakeDocument.body.append(elsewhere);
    tooltips.show(real(anchor), "The name printed on the card");

    anchor.rect = { left: 120, top: 40, width: 20, height: 20 };
    scroll(elsewhere);

    assert.equal(shows(anchor), true);

    scroll(body);

    assert.equal(shows(anchor), false);
});
