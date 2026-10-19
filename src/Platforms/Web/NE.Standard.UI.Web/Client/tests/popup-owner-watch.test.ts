// While a popup is open, its owner's watch hears the tree and the attributes of the owner and of everything above it — not the page's,
// whose classes change with every hover; a change of the tree alone asks only whether an owner left the page, but judges whole an owner
// it moved, whose new line is watched from then. A tooltip's watch hears the same of its anchor.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type Registration = { readonly target: unknown; readonly options: MutationObserverInit };

// The one observer the popups leave, its registrations as they stand and its callback, which a test calls with records it makes up.
const observers: FakeObserver[] = [];

class FakeObserver {
    public readonly callback: (records: MutationRecord[]) => void;
    public registrations: Registration[] = [];

    public constructor(callback: (records: MutationRecord[]) => void) {
        this.callback = callback;
        observers.push(this);
    }

    public observe(target: unknown, options: MutationObserverInit): void {
        this.registrations = [...this.registrations.filter(each => each.target !== target), { target, options }];
    }

    public disconnect(): void {
        this.registrations = [];
    }
}

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ display: "block", transform: "none", filter: "none", perspective: "none", position: "static", overflowX: "visible", overflowY: "visible", getPropertyValue: () => "" }),
    MutationObserver: FakeObserver,
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { OwnedPopups } = await import("../src/interactions/owned-popup.ts");
const { startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");

function records(type: "attributes" | "childList", ...addedNodes: FakeElement[]): MutationRecord[] {
    return [real<MutationRecord>({ type, addedNodes, removedNodes: [] })];
}

function attributeTargets(watch: FakeObserver): unknown[] {
    return watch.registrations.filter(each => each.options.attributes === true).map(each => each.target);
}

test("an open popup's watch hears its owner's line and the tree, and a change of the tree alone asks only about a detached owner", () => {
    const closed: string[] = [];
    const popups = new OwnedPopups({ show: () => undefined, hide: (_, reason) => closed.push(String(reason)) });
    const owner = new FakeElement();
    const popup = new FakeElement();
    const box = new FakeElement().append(owner.append(popup));
    const beside = new FakeElement();

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(box, beside);
    popups.open({ owner: real(owner), popup: real(popup) });

    const [watch] = observers;

    assert.deepEqual(attributeTargets(watch), [owner, box, fakeDocument.body]);
    assert.equal(watch.registrations.some(each => each.target === fakeDocument && each.options.childList === true && each.options.attributes !== true), true);

    // The box hidden with the change of the tree that came with it: a tree's change alone asks only whether the owner left.
    box.laidOut = false;
    watch.callback(records("childList"));

    assert.deepEqual(closed, []);

    watch.callback(records("attributes"));

    assert.deepEqual(closed, ["owner"]);
});

test("a tooltip's watch hears the tree and its anchor's line, and goes once its anchor is out of sight", () => {
    startTooltips();

    const anchor = FakeElement.of("ui-button", { "data-ui-tooltip": "Pin" }, "button");
    const box = new FakeElement().append(anchor);

    anchor.rect = { left: 10, top: 10, width: 30, height: 30 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(box, new FakeElement());
    tooltips.show(real(anchor), "Pin");

    const watch = observers.at(-1)!;

    assert.deepEqual(attributeTargets(watch), [anchor, box, fakeDocument.body]);
    assert.equal(anchor.getAttribute("aria-describedby"), "ui-tooltip");

    box.laidOut = false;
    watch.callback(records("childList"));

    assert.equal(anchor.getAttribute("aria-describedby"), "ui-tooltip");

    watch.callback(records("attributes"));

    assert.equal(anchor.hasAttribute("aria-describedby"), false);
});

test("an owner a change of the tree moved has its new line watched, and closes its popup once moved into a place out of sight", () => {
    const closed: string[] = [];
    const popups = new OwnedPopups({ show: () => undefined, hide: (_, reason) => closed.push(String(reason)) });
    const owner = new FakeElement();
    const popup = new FakeElement();
    const shown = new FakeElement().append(owner.append(popup));
    const elsewhere = new FakeElement();
    const folded = new FakeElement();

    folded.laidOut = false;
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(shown, elsewhere, folded);
    popups.open({ owner: real(owner), popup: real(popup) });

    // The popups' own watch, made anew as this one opened: the last ones let go of theirs as they closed.
    const watch = observers.at(-1)!;

    elsewhere.append(owner);
    watch.callback(records("childList", owner));

    assert.deepEqual(closed, []);
    assert.equal(attributeTargets(watch).includes(elsewhere), true);

    folded.append(owner);
    watch.callback(records("childList", owner));

    assert.deepEqual(closed, ["owner"]);
});

test("a waiting flyout's watch hears the tree and its own line, and a change there brings it back once in sight", async () => {
    const { FlyoutInteractionEngine } = await import("../src/interactions/flyout-interaction-engine.ts");
    const button = new FakeElement("button");
    const flyout = FakeElement.of("ui-flyout ui-flyout--open", { "data-ui-id": "5" }).append(FakeElement.of("ui-flyout__anchor").append(button), FakeElement.of("ui-flyout__content"));
    const box = new FakeElement().append(flyout);

    box.laidOut = false;
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(box, new FakeElement());
    new FlyoutInteractionEngine({ root: real<ParentNode>(box) });

    // The engine's own watch of its flyouts' classes stands beside it: the one on the waiting flyout's line is its sight's.
    const watch = observers.find(each => each.registrations.some(registration => registration.target === flyout))!;

    assert.deepEqual(attributeTargets(watch), [flyout, box, fakeDocument.body]);
    assert.equal(watch.registrations.some(each => each.target === fakeDocument && each.options.childList === true && each.options.attributes !== true), true);

    box.laidOut = true;
    watch.callback(records("childList"));

    assert.equal(button.getAttribute("aria-expanded"), null);

    watch.callback(records("attributes"));

    assert.equal(button.getAttribute("aria-expanded"), "true");
});
