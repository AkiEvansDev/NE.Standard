// A popup keeps the form it opened in, beside its anchor or as a phone's sheet, however often it is placed again; the window crossing
// the small breakpoint either way closes a list and a menu standing at a point, and a sheet closed leaves no sheet's look behind. A
// popup goes as its owner goes out of sight — hidden, or scrolled wholly out of its box, as a tooltip goes — and the keyboard it held
// finds the owner drawn anew, never the body.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let width = 1280;
// Every listener a breakpoint's watch was given, which a crossing calls.
const tierListeners: (() => void)[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    matchMedia: (query: string) => ({ matches: width >= Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0), addEventListener: (_: string, listener: () => void) => tierListeners.push(listener) }),
    // An inline overflow clips, as the stylesheet's would; nothing is transformed or moving.
    getComputedStyle: (element: FakeElement) => ({
        transform: "none",
        filter: "none",
        perspective: "none",
        direction: "ltr",
        display: element.style.display ?? "block",
        position: "static",
        overflowX: element.style.overflow ?? "visible",
        overflowY: element.style.overflow ?? "visible",
        transitionProperty: "all",
        transitionDuration: "0s",
        getPropertyValue: () => ""
    }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { createPopups } = await import("../src/interactions/popup-service.ts");
const { OwnedPopups, setPopupComponents } = await import("../src/interactions/owned-popup.ts");

const popups = createPopups({ findEveryComponent: () => [] });

/** The window resized to `to` pixels, its breakpoints' watches told. */
function resize(to: number): void {
    width = to;

    for (const listener of [...tierListeners])
        listener();
}

/** A box's scroll, as the document's capturing listeners hear it. */
function scrolled(box: FakeElement): void {
    fakeDocument.documentElement.dispatchEvent(Object.assign(new FakeEvent("scroll"), { target: box }));
}

/** Lets a closed sheet's slide out run its course: the stand-in has no transitions, so it lands once the queued work has run. */
async function slid(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0));
}

function scene(): { anchor: FakeElement; popup: FakeElement; box: FakeElement } {
    const anchor = new FakeElement("button");
    const popup = new FakeElement();
    const box = new FakeElement().append(anchor);

    anchor.rect = { left: 10, top: 10, width: 80, height: 30 };
    popup.rect = { left: 0, top: 0, width: 120, height: 60 };
    box.rect = { left: 0, top: 0, width: 400, height: 400 };
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(box, popup);

    return { anchor, popup, box };
}

const list = (reasons: string[]) => ({ placement: "bottom-start" as const, sheetOnPhone: true, closesOnTab: true, onDismiss: (reason: string) => reasons.push(reason) });

test("a list opened beside its anchor stays beside it when placed again below the small breakpoint, and the crossing closes it", () => {
    resize(1280);

    const { anchor, popup } = scene();
    const reasons: string[] = [];
    const handle = popups.open(real(anchor), real(popup), list(reasons));

    width = 390;
    handle.reposition();

    assert.equal(popup.hasAttribute("data-ui-sheet"), false);
    assert.equal(popup.style.top, "44px");

    resize(390);

    assert.deepEqual(reasons, ["owner"]);
});

test("a sheet the window widens past the small breakpoint closes, and opened again at once it stands beside its anchor", async () => {
    resize(390);

    const { anchor, popup } = scene();
    const reasons: string[] = [];

    popups.open(real(anchor), real(popup), list(reasons));
    assert.equal(popup.getAttribute("data-ui-sheet"), "root");

    resize(1280);
    assert.deepEqual(reasons, ["owner"]);

    // Still sliding out as a sheet, it opens again beside its anchor with no sheet's look left on it.
    const handle = popups.open(real(anchor), real(popup), list([]));

    assert.equal(popup.hasAttribute("data-ui-sheet"), false);
    assert.equal(popup.style.top, "44px");

    handle.close();
    await slid();

    assert.equal(popup.hasAttribute("data-ui-sheet"), false);
    assert.equal(popup.hasAttribute("popover"), false);
});

test("a sheet closed takes its look off once its slide is over, and the next opening on a wide window is beside its anchor", async () => {
    resize(390);

    const { anchor, popup } = scene();
    const handle = popups.open(real(anchor), real(popup), list([]));

    handle.close();
    await slid();

    assert.equal(popup.hasAttribute("data-ui-sheet"), false);
    assert.equal(popup.hasAttribute("popover"), false);

    resize(1280);

    const again = popups.open(real(anchor), real(popup), list([]));

    assert.equal(popup.hasAttribute("data-ui-sheet"), false);
    assert.equal(popup.style.top, "44px");

    again.close();
});

test("a panel beside its anchor stays open across the small breakpoint; a menu at a point closes at it either way", () => {
    resize(1280);

    const { anchor, popup } = scene();
    const panelReasons: string[] = [];
    const panel = popups.open(real(anchor), real(popup), { placement: "bottom-start", onDismiss: reason => panelReasons.push(reason) });
    const closed: string[] = [];
    const menus = new OwnedPopups({ show: () => undefined, hide: (_, reason) => closed.push(String(reason)), single: false });
    const owner = new FakeElement();
    const menu = new FakeElement();

    fakeDocument.body.append(owner.append(menu));

    for (const to of [390, 1280]) {
        menus.open({ owner: real(owner), popup: real(menu) });
        resize(to);
    }

    assert.deepEqual(closed, ["owner", "owner"]);
    assert.deepEqual(panelReasons, []);

    panel.close();
});

test("a popup whose owner goes out of sight closes — a dialog closed round it, a fold, a tier's Visibility", () => {
    resize(1280);

    const closed: string[] = [];
    const lists = new OwnedPopups({ show: () => undefined, hide: (_, reason) => closed.push(String(reason)) });
    const dialog = new FakeElement();
    const owner = new FakeElement();
    const popup = new FakeElement();

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(dialog.append(owner.append(popup)));
    lists.open({ owner: real(owner), popup: real(popup) });

    lists.closeStranded();
    assert.deepEqual(closed, []);

    dialog.laidOut = false;
    lists.closeStranded();

    assert.deepEqual(closed, ["owner"]);
});

test("an owner that boxes nothing itself (display: contents) keeps its popup while the box around it shows", () => {
    resize(1280);

    const closed: string[] = [];
    const lists = new OwnedPopups({ show: () => undefined, hide: (_, reason) => closed.push(String(reason)) });
    const row = new FakeElement();
    const owner = new FakeElement();
    const popup = new FakeElement();

    // What `checkVisibility` answers for it: no box of its own.
    owner.laidOut = false;
    owner.style.display = "contents";
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(row.append(owner.append(popup)));

    assert.equal(lists.open({ owner: real(owner), popup: real(popup) }), true);

    lists.closeStranded();
    assert.deepEqual(closed, []);

    row.laidOut = false;
    lists.closeStranded();

    assert.deepEqual(closed, ["owner"]);
});

test("the keyboard a popup held goes to its owner drawn anew, not to the page's body", () => {
    resize(1280);

    const lists = new OwnedPopups({ show: () => undefined, hide: () => undefined });
    const owner = FakeElement.of("ui-select", { "data-ui-id": "7" }, "button");
    const popup = new FakeElement();
    const entry = FakeElement.of("", { tabindex: "-1" }, "button");
    const drawnAnew = FakeElement.of("ui-select", { "data-ui-id": "7" }, "button");

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(owner.append(popup.append(entry)));
    setPopupComponents({ findEveryComponent: id => (id === 7 ? [real<Element>(drawnAnew)] : []) });

    try {
        lists.open({ owner: real(owner), popup: real(popup), focus: real(entry) });
        assert.equal(fakeDocument.activeElement, entry);

        owner.remove();
        fakeDocument.body.append(drawnAnew);
        lists.closeStranded();

        assert.equal(lists.current, null);
        assert.equal(fakeDocument.activeElement, drawnAnew);
    }
    finally {
        setPopupComponents(null);
    }
});

test("a scroll that takes a popup's anchor wholly out of its box closes it, judged once a frame; its own list scrolling, or an anchor still in sight, does not", async () => {
    resize(1280);

    const { anchor, popup, box } = scene();
    const reasons: string[] = [];

    box.style.overflow = "auto";
    popups.open(real(anchor), real(popup), list(reasons));

    // Half the anchor still shows at the box's top.
    anchor.rect = { left: 10, top: -15, width: 80, height: 30 };
    scrolled(box);
    scrolled(popup);
    await slid();

    assert.deepEqual(reasons, []);

    anchor.rect = { left: 10, top: -60, width: 80, height: 30 };
    scrolled(popup);
    await slid();

    assert.deepEqual(reasons, []);

    // Judged as the frame comes, not at the scroll itself.
    scrolled(box);

    assert.deepEqual(reasons, []);

    await slid();

    assert.deepEqual(reasons, ["owner"]);
});
