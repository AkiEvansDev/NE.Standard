// A flyout whose owner is only out of sight — a tab's page not shown, a closed dialog, a fold — stays open to its IsOpen and the server,
// raising nothing, and is placed once in sight again without taking the keyboard; one open at the page's start in such a place waits
// so too. A flyout whose owner turned disabled goes, telling its two-way IsOpen, and raises no close, which the server would refuse.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// Every observer the engines leave, which a test tells that the page changed.
const observers: (() => void)[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr", display: "block", getPropertyValue: () => "" }),
    MutationObserver: class {
        private readonly callback: (records: MutationRecord[]) => void;

        public constructor(callback: (records: MutationRecord[]) => void) {
            this.callback = callback;
            // A change of an attribute somewhere above, as the browser reports a class or `hidden` written.
            observers.push(() => this.callback([real<MutationRecord>({ type: "attributes", target: fakeDocument.body, attributeName: "class", addedNodes: [], removedNodes: [] })]));
        }

        public observe(): void {
        }

        public disconnect(): void {
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

/** A flyout inside a box, its anchor's button and its panel's. */
function flyoutIn(box: FakeElement, open = false): { flyout: FakeElement; anchorButton: FakeElement; panelButton: FakeElement } {
    const anchorButton = new FakeElement("button");
    const panelButton = new FakeElement("button");
    const flyout = FakeElement.of(open ? "ui-flyout ui-flyout--open" : "ui-flyout", { "data-ui-id": "5" }).append(FakeElement.of("ui-flyout__anchor").append(anchorButton), FakeElement.of("ui-flyout__content").append(panelButton));

    box.append(flyout);

    return { flyout, anchorButton, panelButton };
}

/** An open flyout inside a box on the page, and the events it raised once open. */
function openFlyout(): { box: FakeElement; flyout: FakeElement; heard: string[] } {
    const box = new FakeElement();
    const { flyout, anchorButton } = flyoutIn(box);
    const heard: string[] = [];

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(box);
    anchorButton.dispatchEvent(new FakeEvent("click"));

    assert.equal(flyout.classes.has("ui-flyout--open"), true);

    for (const name of ["toggle", "close", "open"])
        flyout.addEventListener(name, () => heard.push(name));

    return { box, flyout, heard };
}

function changed(): void {
    for (const observer of [...observers])
        observer();
}

test("a flyout put out of sight stays open, raising nothing, and is placed again once in sight, the keyboard left where it is", () => {
    const { box, flyout, heard } = openFlyout();
    const outside = new FakeElement("button");

    fakeDocument.body.append(outside);
    box.laidOut = false;
    changed();

    assert.equal(flyout.classes.has("ui-flyout--open"), true);
    assert.deepEqual(heard, []);

    outside.focus();
    box.laidOut = true;
    changed();

    assert.equal(flyout.classes.has("ui-flyout--open"), true);
    assert.equal(flyout.children[0].children[0].getAttribute("aria-expanded"), "true");
    assert.equal(fakeDocument.activeElement, outside);
    assert.deepEqual(heard, []);
});

test("a flyout open at the page's start in a place out of sight waits, open, and is placed once it shows", () => {
    const box = new FakeElement();
    const { flyout, anchorButton } = flyoutIn(box, true);
    const heard: string[] = [];

    box.laidOut = false;
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(box);
    flyout.addEventListener("toggle", () => heard.push("toggle"));
    new FlyoutInteractionEngine({ root: real<ParentNode>(box) });

    assert.equal(flyout.classes.has("ui-flyout--open"), true);
    assert.equal(anchorButton.getAttribute("aria-expanded"), null);

    box.laidOut = true;
    changed();

    assert.equal(anchorButton.getAttribute("aria-expanded"), "true");
    assert.deepEqual(heard, []);
});

test("a flyout whose owner turned disabled closes and raises no close, which the server would refuse", () => {
    const { flyout, heard } = openFlyout();

    flyout.classes.add("ui-disabled");
    changed();

    assert.equal(flyout.classes.has("ui-flyout--open"), false);
    assert.deepEqual(heard, ["toggle"]);
});
