// What the page's tooltip shows and for how long: an anchor not laid out (a mark its host shows only now and then) shows nothing; words
// on screen go once their anchor leaves the page, as a redraw on a phone takes it with no pointer leaving it; a package's plain words
// are shown as written, not read as inline markup.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The tree watcher the engine starts while words are on screen, called by hand: the page changed.
let treeChanged: (() => void) | null = null;

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1024, innerHeight: 768 },
    getComputedStyle: (element: { style?: Record<string, unknown> }) => ({ getPropertyValue: () => "", display: element.style?.display ?? "block", transform: "none", filter: "none", perspective: "none", position: "static", overflowX: "visible", overflowY: "visible" }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    },
    MutationObserver: class {
        public constructor(callback: () => void) {
            treeChanged = callback;
        }

        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");

startTooltips();

function button(words: string): FakeElement {
    const element = FakeElement.of("ui-button", { "data-ui-tooltip": words }, "button");

    const kept = fakeDocument.body.children.filter(child => child.id === "ui-tooltip");

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(...kept, element);
    fakeDocument.activeElement = fakeDocument.body;

    return element;
}

function focus(target: FakeElement): void {
    const domEvent = new FakeEvent("focusin");

    domEvent.target = target;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

function shows(element: FakeElement): boolean {
    return element.getAttribute("aria-describedby") === "ui-tooltip";
}

function shownText(): string | null {
    return fakeDocument.body.children.find(child => child.id === "ui-tooltip")?.getAttribute("data-ui-tooltip-text") ?? null;
}

test("an anchor not laid out shows nothing; laid out, it shows its words", () => {
    const save = button("Save");

    save.style.display = "none";
    focus(save);
    assert.equal(shows(save), false);

    save.style.display = "inline-flex";
    focus(save);
    assert.equal(shows(save), true);

    tooltips.hide();
});

test("words on screen go once the page has redrawn their anchor away", () => {
    const save = button("Save");

    focus(save);
    assert.equal(shows(save), true);

    fakeDocument.body.children.splice(fakeDocument.body.children.indexOf(save), 1);
    save.parent = null;
    treeChanged?.();

    assert.equal(shows(save), false);
});

test("a package's plain words are shown as written, and its own words are inline markup", () => {
    const point = button("");

    tooltips.show(real(point), "p*q*r", { plain: true });
    assert.equal(shownText(), "p*q*r");

    tooltips.show(real(point), "p*q*r");
    assert.equal(shownText(), "pqr");

    tooltips.hide();
});
