// The overlay scrollbar's geometry: a scroller under a transform (a canvas's zoom) gets its thumb on its scaled box; a fixed popup's
// list is clipped by none of the boxes around it in the document; a right-to-left scroller's horizontal thumb starts at its right end
// and drags back towards it; a scroller that draws no bar on purpose gets no thumb.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// Each element's computed style, as a test gives it; any other reads as a plain block that clips nothing.
const styles = new Map<FakeElement, Readonly<Record<string, string>>>();

installFakeDom({
    getComputedStyle: (element: FakeElement) => {
        const style = { overflowX: "visible", overflowY: "visible", position: "static", direction: "ltr", ...styles.get(element) };

        return { ...style, getPropertyValue: (name: string) => style[name as keyof typeof style] ?? "" };
    }
});

fakeDocument.documentElement.rect = { left: 0, top: 0, width: 1000, height: 800 };

const { canScroll, clientBox, dragScroll, thumbBox, visibleBox } = await import("../src/interactions/overlay-scrollbar-engine.ts");

/** A scroller laid out `width` by `height`, holding `scrollWidth` by `scrollHeight`, drawn on the viewport at `rect`. */
function scroller(rect: { left: number; top: number; width: number; height: number }, laidOut: { width: number; height: number }, held: { width: number; height: number }, style: Readonly<Record<string, string>> = {}): FakeElement {
    const element = FakeElement.of("scroller");

    element.rect = rect;
    Object.defineProperty(element, "offsetWidth", { value: laidOut.width });
    Object.defineProperty(element, "offsetHeight", { value: laidOut.height });
    Object.defineProperty(element, "clientWidth", { value: laidOut.width });
    Object.defineProperty(element, "clientHeight", { value: laidOut.height });
    Object.assign(element, { scrollWidth: held.width, scrollHeight: held.height });
    styles.set(element, { overflowX: "auto", overflowY: "auto", ...style });

    return element;
}

test("a scroller under a zoom of a half gets its thumb on the box it is drawn in, not on the one it is laid out in", () => {
    const editor = scroller({ left: 100, top: 50, width: 100, height: 60 }, { width: 200, height: 120 }, { width: 200, height: 480 });
    const client = clientBox(real(editor));

    assert.deepEqual([client.left, client.top, client.right, client.bottom], [100, 50, 200, 110]);

    // The vertical thumb stands at the drawn right edge, its track the drawn height less the insets.
    const thumb = thumbBox(real(editor), "y", client, false);

    assert.equal(thumb.left, 200 - 12);
    assert.equal(thumb.top, 52);
    assert.equal(thumb.height, 24);
});

test("a fixed popup's list is clipped by the viewport alone, not by the boxes around it in the document", () => {
    const card = FakeElement.of("card");
    const list = scroller({ left: 0, top: 300, width: 200, height: 200 }, { width: 200, height: 200 }, { width: 200, height: 600 }, { position: "fixed" });

    card.rect = { left: 0, top: 0, width: 400, height: 320 };
    styles.set(card, { overflowX: "hidden", overflowY: "hidden" });
    card.append(list);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(card);

    assert.equal(visibleBox(real(list))?.height, 200);

    // The same list in the card's flow is cut by the card.
    styles.set(list, { overflowX: "auto", overflowY: "auto" });

    assert.equal(visibleBox(real(list))?.height, 20);
});

test("a right-to-left scroller's horizontal thumb starts at its right end, and a drag to the right goes back towards it", () => {
    const strip = scroller({ left: 0, top: 0, width: 400, height: 100 }, { width: 400, height: 100 }, { width: 1600, height: 100 }, { direction: "rtl" });
    const client = clientBox(real(strip));
    const start = thumbBox(real(strip), "x", client, false);

    assert.equal(start.left + start.width, 400 - 2);

    strip.scrollLeft = -1200;

    assert.equal(thumbBox(real(strip), "x", client, false).left, 2);

    // Held at -1200 and pulled 10 pixels to the right at 4 scroll pixels a pixel: 40 back towards the start.
    assert.equal(dragScroll(1200, 10, 4, true), -1160);
    assert.equal(dragScroll(100, 10, 4, false), 140);
});

test("a scroller that draws no bar on purpose gets no thumb; one that only holds more than it shows does", () => {
    const column = scroller({ left: 0, top: 0, width: 60, height: 200 }, { width: 60, height: 200 }, { width: 60, height: 900 }, { "--ui-overlay-thumb": " none" });
    const list = scroller({ left: 0, top: 0, width: 60, height: 200 }, { width: 60, height: 200 }, { width: 60, height: 900 });
    const clipped = scroller({ left: 0, top: 0, width: 60, height: 200 }, { width: 60, height: 200 }, { width: 60, height: 900 }, { overflowY: "hidden" });

    assert.equal(canScroll(real(column), "y"), false);
    assert.equal(canScroll(real(list), "y"), true);
    assert.equal(canScroll(real(list), "x"), false);
    assert.equal(canScroll(real(clipped), "y"), false);
});
