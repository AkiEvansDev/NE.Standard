// A tooltip is inline markup unless the render marked it as written (`TooltipPlain`): a name a person typed — a bound header's line,
// a pane's name — shows its brackets as characters rather than turning into a live link, and a phrase pushed into it keeps its
// arguments unescaped; an unmarked one still reads its markup.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

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

const { startTooltips } = await import("../src/interactions/tooltip-engine.ts");
const { noteKey } = await import("../src/interactions/popup-focus.ts");
const { readsMarkup } = await import("../src/updates/shown-words.ts");

startTooltips();

const typed = "Acme [support](https://evil.example)";

function focusByKey(control: FakeElement): void {
    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    control.focus();

    const domEvent = new FakeEvent("focusin");

    domEvent.target = control;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

function shownFor(attributes: Record<string, string>): FakeElement {
    const control = FakeElement.of("ui-button", { "data-ui-tooltip": typed, tabindex: "0", ...attributes }, "button");

    fakeDocument.body.append(control);
    focusByKey(control);

    const tooltip = fakeDocument.body.querySelector(".ui-tooltip");

    assert.ok(tooltip !== null);

    return tooltip;
}

test("a tooltip marked as written shows a person's brackets as characters, no link built from them", () => {
    const tooltip = shownFor({ "data-ui-tooltip-plain": "" });

    assert.equal(tooltip.textContent, typed);
    assert.equal(tooltip.classes.has("ui-tooltip--linked"), false);
    assert.equal(tooltip.querySelector("a"), null);
});

test("an unmarked tooltip still reads its words as inline markup", () => {
    const tooltip = shownFor({});

    assert.equal(tooltip.classes.has("ui-tooltip--linked"), true);
    assert.equal(tooltip.textContent, "Acme support");
});

test("a phrase pushed into a tooltip marked as written takes its arguments as they are", () => {
    const operation = { kind: "Attribute", name: "data-ui-tooltip" } as unknown as Parameters<typeof readsMarkup>[0];

    assert.equal(readsMarkup(operation, real(FakeElement.of("ui-text", { "data-ui-tooltip-plain": "" }))), false);
    assert.equal(readsMarkup(operation, real(FakeElement.of("ui-text"))), true);
});
