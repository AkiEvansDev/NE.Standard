// A Scroll effect moves the addressed element's own scroll box, one that overflows before one that only could; a box that could
// scroll but shows all it holds (a chat feed still short) takes the scroll as a no-op rather than being passed over for the page,
// and only an element with nothing in reach that could ever scroll has no scroller.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    getComputedStyle: (element: FakeElement) => ({
        overflowX: element.style.overflowX ?? "visible",
        overflowY: element.style.overflowY ?? "visible"
    })
});

const { resolveScroller } = await import("../src/effects/scroller.ts");

/** A box with the overflow given, holding `content` pixels in `height` of its own. */
function box(overflow: string, height: number, content: number): FakeElement {
    const element = new FakeElement();

    element.style.overflowY = overflow;
    element.rect.height = height;
    Object.assign(element, { scrollHeight: content });

    return element;
}

function scroller(element: FakeElement): FakeElement | null {
    return resolveScroller(real<Element>(element), true) as unknown as FakeElement | null;
}

test("a feed that could scroll but shows all it holds is still the scroller, not the page around it that overflows", () => {
    const page = box("auto", 600, 2400);
    const feed = box("auto", 300, 120);

    page.append(feed);

    assert.equal(scroller(feed), feed);
});

test("inside the addressed element, one that overflows comes before one that only could", () => {
    const root = new FakeElement();
    const short = box("auto", 300, 120);
    const long = box("scroll", 300, 900);

    root.append(short, long);

    assert.equal(scroller(root), long);

    long.style.overflowY = "hidden";

    assert.equal(scroller(root), short);
});

test("an element with no scroll box of its own scrolls the nearest one outside it, overflowing or not", () => {
    const outer = box("auto", 600, 2400);
    const panel = box("auto", 400, 200);
    const text = new FakeElement();

    outer.append(panel);
    panel.append(text);

    assert.equal(scroller(text), outer);

    outer.style.overflowY = "visible";

    assert.equal(scroller(text), panel);
});

test("nothing in reach whose overflow could scroll leaves no scroller", () => {
    const outer = box("visible", 600, 2400);
    const inner = box("hidden", 100, 400);

    outer.append(inner);

    assert.equal(scroller(inner), null);
});
