// A flyout's panel with no name of its own is called what its anchor's control is; an `AccessibleName` pushed while it is open names it
// at once, the opener's labelling, which would outrank it, taken off; one taken away hands the name back to the opener.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// Every observer's callback with the targets it watches, so a test can report an attribute written on one as the browser would.
const watches: { readonly callback: (records: MutationRecord[]) => void; readonly targets: Set<unknown> }[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", display: "block", getPropertyValue: () => "" }),
    MutationObserver: class {
        private readonly watch: { readonly callback: (records: MutationRecord[]) => void; readonly targets: Set<unknown> };

        public constructor(callback: (records: MutationRecord[]) => void) {
            this.watch = { callback, targets: new Set() };
            watches.push(this.watch);
        }

        public observe(target: unknown): void {
            this.watch.targets.add(target);
        }

        public disconnect(): void {
            this.watch.targets.clear();
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { FlyoutInteractionEngine } = await import("../src/interactions/flyout-interaction-engine.ts");

new FlyoutInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });

/** As FlyoutComponentRenderer draws it: the anchor's button, and the panel the dialog. */
function scene(): { readonly flyout: FakeElement; readonly button: FakeElement; readonly panel: FakeElement } {
    const button = FakeElement.of("ui-button", { "aria-label": "Filters" }, "button");
    const panel = FakeElement.of("ui-flyout__content", { role: "dialog" });
    const flyout = FakeElement.of("ui-flyout", { "data-ui-id": "5" }).append(FakeElement.of("ui-flyout__anchor").append(button), panel);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(flyout);

    return { flyout, button, panel };
}

/** Writes an attribute on the panel and tells the observers watching it, as the browser does once the patch lands. */
function push(panel: FakeElement, name: string, value: string | null): void {
    if (value === null)
        panel.removeAttribute(name);
    else
        panel.setAttribute(name, value);

    for (const watch of watches.filter(each => each.targets.has(panel)))
        watch.callback([real<MutationRecord>({ type: "attributes", target: panel, attributeName: name, addedNodes: [], removedNodes: [] })]);
}

test("an open flyout's panel is called what its anchor's control is", () => {
    const { flyout, button, panel } = scene();

    button.dispatchEvent(new FakeEvent("click"));

    assert.equal(flyout.classes.has("ui-flyout--open"), true);
    assert.notEqual(button.id, "");
    assert.equal(panel.getAttribute("aria-labelledby"), button.id);
    button.dispatchEvent(new FakeEvent("click"));
});

test("a name pushed on the open panel names it at once, and one taken away hands it back to the opener", () => {
    const { button, panel } = scene();

    button.dispatchEvent(new FakeEvent("click"));
    push(panel, "aria-label", "Share");

    assert.equal(panel.hasAttribute("aria-labelledby"), false, "the opener's labelling outranks the pushed name");

    push(panel, "aria-label", null);

    assert.equal(panel.getAttribute("aria-labelledby"), button.id);
    button.dispatchEvent(new FakeEvent("click"));
});

test("a closed panel is no longer followed", () => {
    const { button, panel } = scene();

    button.dispatchEvent(new FakeEvent("click"));
    button.dispatchEvent(new FakeEvent("click"));

    assert.equal(watches.some(each => each.targets.has(panel)), false);
});
