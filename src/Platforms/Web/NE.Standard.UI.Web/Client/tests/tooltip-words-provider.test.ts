// Words a part of the page provides for elements that wrote no tooltip open and close by the tooltip engine's own rules: the nearest
// element speaks, so a provided element inside one with a tooltip of its own speaks first, and a written tooltip on the element wins.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom } from "./fake-dom.ts";

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

const { registerTooltipWords, startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");

startTooltips();

registerTooltipWords({
    anchor: target => target.closest(".spoken"),
    words: anchor => anchor.getAttribute("data-words")
});

function raise(type: string, target: FakeElement): void {
    const domEvent = new FakeEvent(type);

    domEvent.target = target;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

function tooltipText(): string | null | undefined {
    return fakeDocument.body.querySelector(".ui-tooltip")?.getAttribute("data-ui-tooltip-text");
}

test("an element a provider speaks for, inside one with a tooltip of its own, shows the provided words", () => {
    const entry = FakeElement.of("spoken", { "data-words": "Quick phrases" });
    const region = FakeElement.of("ui-surface", { "data-ui-tooltip": "The sidebar" }).append(entry);

    fakeDocument.body.append(region);
    raise("focusin", entry);

    assert.equal(tooltipText(), "Quick phrases");
    assert.equal(entry.getAttribute("aria-describedby"), "ui-tooltip");

    raise("focusout", entry);

    assert.equal(entry.hasAttribute("aria-describedby"), false);
});

test("an element's own tooltip wins over what a provider says for it", () => {
    const entry = FakeElement.of("spoken", { "data-words": "Administration", "data-ui-tooltip": "Users and roles" });

    fakeDocument.body.append(entry);
    raise("focusin", entry);

    assert.equal(tooltipText(), "Users and roles");

    tooltips.hide();
});

test("a provider saying nothing opens nothing", () => {
    const entry = FakeElement.of("spoken", { "data-words": "  " });

    fakeDocument.body.append(entry);
    raise("focusin", entry);

    assert.equal(entry.hasAttribute("aria-describedby"), false);
});
