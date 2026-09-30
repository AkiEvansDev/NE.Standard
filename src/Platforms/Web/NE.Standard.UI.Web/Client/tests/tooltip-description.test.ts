// A tooltip is named by the element a screen reader stands on — a field's own input when the focus is in it, not the component
// around it — beside that element's own descriptions, which it takes nothing from when it closes.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// Enough of a laid-out page for the tooltip to be placed: no transform anywhere, and a size observer that watches nothing.
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

const { pinTooltip, tooltips } = await import("../src/interactions/tooltip-engine.ts");

function field(): { readonly root: FakeElement; readonly input: FakeInput } {
    const input = new FakeInput("text");
    const root = FakeElement.of("ui-text-input", { "data-ui-id": "1", "data-ui-tooltip": "The name on the card" }).append(input);

    input.setAttribute("aria-describedby", "card-hint");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    return { root, input };
}

test("a field's tooltip is named by its focused input, beside the input's own description, which it leaves as it was", () => {
    const { root, input } = field();

    fakeDocument.activeElement = input;
    pinTooltip(real(root));

    assert.equal(input.getAttribute("aria-describedby"), "card-hint ui-tooltip");
    assert.equal(root.hasAttribute("aria-describedby"), false);

    tooltips.hide();

    assert.equal(input.getAttribute("aria-describedby"), "card-hint");
});

test("a tooltip shown with no focus inside is named by its anchor, and taken off it as another control takes the tooltip over", () => {
    const { root } = field();
    const button = FakeElement.of("", { "data-ui-tooltip": "Save" }, "button");

    fakeDocument.body.append(button);
    fakeDocument.activeElement = fakeDocument.body;
    tooltips.show(real(root), "The name on the card");

    assert.equal(root.getAttribute("aria-describedby"), "ui-tooltip");

    tooltips.show(real(button), "Save");

    assert.equal(root.hasAttribute("aria-describedby"), false);
    assert.equal(button.getAttribute("aria-describedby"), "ui-tooltip");

    tooltips.hide();
});
