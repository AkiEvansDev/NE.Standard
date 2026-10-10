// A list popup on a phone is a sheet from the bottom: below the small breakpoint it takes no anchored place, stands in the top layer
// over a veil, keeps the keyboard and hides the page beside it from a screen reader until it closes; a list opened from one of its
// entries stands over it as a nested sheet, a row on top naming that entry leading back. From the small breakpoint up it is anchored
// as before. A swipe closes past a third of the sheet's height or on a flick.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let phone = true;

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, innerWidth: 390, innerHeight: 844 },
    // Asked of the small breakpoint (`min-width: 640px`), which a phone is under.
    matchMedia: () => ({ matches: !phone, addEventListener: () => undefined }),
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr", transitionProperty: "all", transitionDuration: "0s", getPropertyValue: () => "" }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { createPopups } = await import("../src/interactions/popup-service.ts");
const { hideAround } = await import("../src/interactions/popup-sheet.ts");
const { swipeCloses } = await import("../src/interactions/sheet-swipe.ts");

const popups = createPopups({ findEveryComponent: () => [] });

function scene(): { anchor: FakeElement; popup: FakeElement; page: FakeElement; entry: FakeElement; nested: FakeElement } {
    const anchor = new FakeElement("button");
    const entry = new FakeElement("button");
    const popup = new FakeElement().append(entry);
    const nested = new FakeElement();
    const page = new FakeElement("main").append(anchor);

    entry.textContent = "Open in";
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(page, FakeElement.of("", { "data-ui-id": "1" }).append(popup, nested));

    return { anchor, popup, page, entry, nested };
}

const options = (reasons: string[] = []) => ({ placement: "bottom-start" as const, sheetOnPhone: true, closesOnTab: true, onDismiss: (reason: string) => reasons.push(reason) });

test("below the small breakpoint a list opened with sheetOnPhone is a sheet over a veil, its anchored place taken off", () => {
    phone = true;
    const { anchor, popup } = scene();

    popup.style.top = "120px";
    popup.style.left = "40px";

    const handle = popups.open(real(anchor), real(popup), options());

    assert.equal(popup.getAttribute("data-ui-sheet"), "root");
    assert.equal(popup.popoverOpen, true);
    assert.equal(popup.style.top, undefined);
    assert.equal(popup.style.left, undefined);

    const scrim = fakeDocument.body.querySelector(".ui-sheet-scrim");

    assert.equal(scrim?.popoverOpen, true);

    handle.close();

    assert.equal(popup.popoverOpen, false);
    assert.equal(scrim?.popoverOpen, false);
});

test("from the small breakpoint up the same list stands beside its anchor", () => {
    phone = false;
    const { anchor, popup } = scene();

    anchor.rect = { left: 10, top: 10, width: 80, height: 30 };
    popup.rect = { left: 0, top: 0, width: 120, height: 60 };

    const handle = popups.open(real(anchor), real(popup), options());

    assert.equal(popup.hasAttribute("data-ui-sheet"), false);
    assert.equal(popup.style.top, "44px");

    handle.close();
    phone = true;
});

test("a sheet takes the keyboard and hides the page beside it from a screen reader until it closes", async () => {
    const { anchor, popup, page } = scene();

    anchor.focus();

    const handle = popups.open(real(anchor), real(popup), options());

    await Promise.resolve();

    assert.equal(fakeDocument.activeElement, popup);
    assert.equal(page.getAttribute("aria-hidden"), "true");

    handle.close();

    assert.equal(page.hasAttribute("aria-hidden"), false);
});

test("a list opened from a sheet's entry is a nested sheet, a row naming the entry on top, which leads back to the sheet", async () => {
    const { anchor, popup, entry, nested } = scene();
    const reasons: string[] = [];

    const outer = popups.open(real(anchor), real(popup), options());
    popups.open(real(entry), real(nested), { ...options(reasons), owner: real(entry) });
    await Promise.resolve();

    assert.equal(nested.getAttribute("data-ui-sheet"), "nested");
    assert.equal(popup.hasAttribute("data-ui-sheet-covered"), true);

    const back = nested.children[0];

    assert.equal(back.classes.has("ui-sheet__back"), true);
    assert.equal(back.textContent, "Open in");

    back.click();

    assert.deepEqual(reasons, ["escape"]);
    assert.equal(nested.popoverOpen, false);
    assert.equal(popup.hasAttribute("data-ui-sheet-covered"), false);
    assert.equal(popup.popoverOpen, true);

    outer.close();
});

test("closing a sheet closes the nested one over it first", async () => {
    const { anchor, popup, entry, nested } = scene();
    const reasons: string[] = [];

    const outer = popups.open(real(anchor), real(popup), options());
    popups.open(real(entry), real(nested), { ...options(reasons), owner: real(entry) });
    await Promise.resolve();

    outer.close();

    assert.deepEqual(reasons, ["escape"]);
    assert.equal(nested.popoverOpen, false);
});

test("hiding the page beside a sheet leaves the sheet's own line and anything hidden already", () => {
    const sheet = new FakeElement();
    const sibling = new FakeElement();
    const hiddenAlready = FakeElement.of("", { "aria-hidden": "true" });
    const line = new FakeElement().append(sheet, sibling);
    const aside = new FakeElement();

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(line, aside, hiddenAlready);

    const hidden = hideAround(real(sheet));

    assert.deepEqual(hidden, [sibling, aside]);
    assert.equal(line.hasAttribute("aria-hidden"), false);
    assert.equal(sheet.hasAttribute("aria-hidden"), false);
});

test("a swipe closes past a third of the sheet's height or on a flick, and springs back short of both", () => {
    assert.equal(swipeCloses(140, 400, 0.1), true);
    assert.equal(swipeCloses(120, 400, 0.1), false);
    assert.equal(swipeCloses(40, 400, 0.9), true);
    assert.equal(swipeCloses(4, 400, 0.9), false);
});
