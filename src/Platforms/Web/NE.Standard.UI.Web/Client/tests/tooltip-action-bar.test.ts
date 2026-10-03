// A host an action bar stands over says nothing of its own while the bar stands: the bar takes the place above it the words would
// take (a graph's card, whose hover words and bar both stand over it).

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

function shownText(): string | null | undefined {
    const tooltip = fakeDocument.body.querySelector(".ui-tooltip");

    return tooltip?.classList.contains("ui-tooltip--visible") === true ? tooltip.getAttribute("data-ui-tooltip-text") : null;
}

test("a host its action bar stands over shows no words, and shows them once the bar is gone", () => {
    const bar = FakeElement.of("ui-action-bar");
    const card = FakeElement.of("ui-graph__node", { "data-ui-action-bar": "center" }).append(bar);

    fakeDocument.body.append(card);
    tooltips.show(real(card), "Components");

    assert.equal(shownText(), null);

    bar.remove();
    tooltips.show(real(card), "Components");

    assert.equal(shownText(), "Components");
    tooltips.hide();
});
