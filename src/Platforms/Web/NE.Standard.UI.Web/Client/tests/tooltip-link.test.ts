// Words carrying a link take the pointer's press, any other tooltip lets it through to the control under it: the engine marks the
// tooltip `ui-tooltip--linked` as it writes words with a link, and takes the mark off the next words without one.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1024, innerHeight: 768 },
    getComputedStyle: () => ({ getPropertyValue: () => "", transform: "none", filter: "none", perspective: "none", position: "static", overflowX: "visible", overflowY: "visible" }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");

startTooltips();

function anchor(): FakeElement {
    const element = FakeElement.of("ui-button", {}, "button");

    element.rect = { left: 100, top: 100, width: 80, height: 32 };
    fakeDocument.body.append(element);

    return element;
}

function tooltip(): FakeElement {
    const element = fakeDocument.body.querySelector(".ui-tooltip");

    assert.ok(element !== null);

    return element;
}

test("words with a link mark the tooltip linked, and the next words without one take the mark off", () => {
    fakeDocument.body.children.length = 0;

    tooltips.show(real(anchor()), "See [the docs](https://docs.example/digest).");

    assert.equal(tooltip().classes.has("ui-tooltip--linked"), true);

    tooltips.show(real(anchor()), "Copy");

    assert.equal(tooltip().classes.has("ui-tooltip--linked"), false);
});
