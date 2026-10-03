// A validation mark's words wear its severity: the tooltip carries the mark's `data-ui-tooltip-severity` while it speaks for it, for
// the stylesheet's accent down its leading edge, and drops it for the next anchor that has none.

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

const { pinTooltip, startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");

startTooltips();

function anchor(attributes: Record<string, string>): FakeElement {
    const element = FakeElement.of("ui-validation-mark", attributes, "span");

    element.rect = { left: 100, top: 100, width: 8, height: 8 };
    fakeDocument.body.append(element);

    return element;
}

function tooltip(): FakeElement {
    const element = fakeDocument.body.querySelector(".ui-tooltip");

    assert.ok(element !== null);

    return element;
}

test("a mark's tooltip wears its severity, and the next tooltip with none drops it", () => {
    fakeDocument.body.children.length = 0;

    pinTooltip(real(anchor({ "data-ui-tooltip": "Name a person", "data-ui-tooltip-severity": "warning" })));

    assert.equal(tooltip().getAttribute("data-ui-tooltip-severity"), "warning");

    tooltips.show(real(anchor({ "data-ui-tooltip": "Copy" })), "Copy");

    assert.equal(tooltip().getAttribute("data-ui-tooltip-severity"), null);
});
