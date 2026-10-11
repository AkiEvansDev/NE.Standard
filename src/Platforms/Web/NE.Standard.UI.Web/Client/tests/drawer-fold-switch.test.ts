// A sidebar's fold switch in an open drawer lies where the header's button was, under the drawer: a press on it puts the drawer away,
// as a second press on that button would, and leaves the sidebar open. A folded sidebar's switch unfolds it, a panel on another edge
// folds, and with the drawer put away the switch is the sidebar's own again.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    CSS: { escape: (value: string) => value },
    requestAnimationFrame: () => 0,
    MutationObserver: class {
        public observe(): void {
            // The engines' own watch over new components; these tests build every element before the press.
        }

        public disconnect(): void {
            // Nothing observed.
        }
    }
});

const { CollapsibleEngine } = await import("../src/interactions/collapsible-engine.ts");
const { SideDrawerEngine } = await import("../src/interactions/side-drawer-engine.ts");

type Page = { root: FakeElement; burger: FakeElement; panel: FakeElement; fold: FakeElement };

function page(edge = "ui-side--left"): Page {
    const burger = FakeElement.of("ui-shell__drawer-toggle", { "data-ui-drawer-toggle": "left-side" }, "button");
    const fold = FakeElement.of("ui-collapsible__toggle", { "data-ui-collapse-toggle": "", "aria-expanded": "true" }, "button");
    const panel = FakeElement.of(`ui-menu ui-collapsible ${edge}`).append(fold, FakeElement.of("ui-collapsible__content"));
    const drawer = FakeElement.of("", { "data-ui-region": "left-side" }).append(new FakeElement().append(panel));
    const root = FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "md" }).append(FakeElement.of("", { "data-ui-region": "header" }).append(burger), drawer);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    return { root, burger, panel, fold };
}

// In the browser's order: the fold's listener captures, the drawer's bubbles.
new CollapsibleEngine({ root: real<ParentNode>(fakeDocument.body) });
new SideDrawerEngine({ root: real<ParentNode>(fakeDocument.body) });

function press(element: FakeElement): void {
    element.dispatchEvent(new FakeEvent("click"));
}

test("the burger opens the drawer, and the sidebar's switch lying where it was puts the drawer away with the sidebar left open", () => {
    const { root, burger, panel, fold } = page();

    press(burger);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left-side");

    fold.focus();
    press(fold);

    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
    assert.equal(panel.hasAttribute("data-ui-collapsed"), false, "the press folded the sidebar inside the drawer");
    assert.equal(burger.getAttribute("aria-expanded"), "false");
    assert.equal(fakeDocument.activeElement, burger, "the focus stayed inside a drawer out of sight");
});

test("a folded sidebar's switch in an open drawer unfolds it, and the drawer stays", () => {
    const { root, burger, panel, fold } = page();

    panel.setAttribute("data-ui-collapsed", "");
    press(burger);
    press(fold);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left-side");
    assert.equal(panel.hasAttribute("data-ui-collapsed"), false);
});

test("a panel hung on another edge folds inside the open drawer as anywhere", () => {
    const { root, burger, panel, fold } = page("ui-side--top");

    press(burger);
    press(fold);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left-side");
    assert.equal(panel.hasAttribute("data-ui-collapsed"), true);
});

test("with no drawer open the switch folds its sidebar", () => {
    const { root, panel, fold } = page();

    press(fold);

    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
    assert.equal(panel.hasAttribute("data-ui-collapsed"), true);
});

test("an open drawer's switch takes the place and the size of the button that opened it, and is called what it does there", () => {
    const { root, burger, panel, fold } = page();
    const drawer = panel.parent!.parent!;

    // The header's button 40 px at (12, 10.75); the drawer still a whole width off its edge as it starts to slide in, its switch 28 px
    // where the side's padding puts it.
    burger.rect = { left: 12, top: 10.75, width: 40, height: 40 };
    drawer.rect = { left: -320, top: 0, width: 320, height: 800 };
    drawer.offset = { left: 0, top: 0 };
    fold.rect = { left: -312, top: 8, width: 28, height: 28 };
    fold.setAttribute("aria-label", "Expand or collapse");

    press(burger);

    assert.equal(fold.hasAttribute("data-ui-drawer-switch"), true);
    assert.equal(fold.style["--ui-drawer-switch-width"], "40px");
    assert.equal(fold.style["--ui-drawer-switch-height"], "40px");
    assert.equal(fold.style["--ui-drawer-switch-x"], "4px", "measured against the drawer's edge it slides to, not where it starts");
    assert.equal(fold.style["--ui-drawer-switch-y"], "2.75px", "the switch moves itself where it has no row");
    assert.notEqual(fold.getAttribute("aria-label"), "Expand or collapse");

    press(fold);

    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
    assert.equal(fold.getAttribute("aria-label"), "Expand or collapse", "the switch folds its side again once the drawer is put away");
});

test("a switch beside its own content moves its row up and down, and a button out of sight leaves it where the padding puts it", () => {
    const burger = FakeElement.of("ui-shell__drawer-toggle", { "data-ui-drawer-toggle": "left-side" }, "button");
    const fold = FakeElement.of("ui-collapsible__toggle", { "data-ui-collapse-toggle": "", "aria-expanded": "true" }, "button");
    const bar = FakeElement.of("ui-collapsible__bar").append(fold, FakeElement.of("ui-collapsible__bar-content"));
    const panel = FakeElement.of("ui-menu ui-collapsible ui-side--left").append(bar, FakeElement.of("ui-collapsible__content"));
    const drawer = FakeElement.of("", { "data-ui-region": "left-side" }).append(panel);
    const root = FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "md" }).append(FakeElement.of("", { "data-ui-region": "header" }).append(burger), drawer);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    burger.rect = { left: 12, top: 10, width: 40, height: 40 };
    drawer.rect = { left: 0, top: 0, width: 320, height: 800 };
    fold.rect = { left: 8, top: 8, width: 28, height: 28 };
    press(burger);

    assert.equal(bar.hasAttribute("data-ui-drawer-switch-row"), true);
    assert.equal(bar.style["--ui-drawer-switch-y"], "2px");
    assert.equal(fold.style["--ui-drawer-switch-x"], "4px");

    press(burger);
    burger.rect = { left: 0, top: 0, width: 0, height: 0 };
    press(burger);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left-side");
    assert.equal(fold.hasAttribute("data-ui-drawer-switch"), false);
    assert.equal(bar.hasAttribute("data-ui-drawer-switch-row"), false);
});

test("an opener beyond the drawer leaves the switch at the drawer's nearest edge, not out of it or its content pushed down", () => {
    const { burger, panel, fold } = page();
    const drawer = panel.parent!.parent!;

    // A page's own button low on the page and across the screen from a drawer 320 by 400.
    burger.rect = { left: 500, top: 600, width: 40, height: 40 };
    drawer.rect = { left: 0, top: 0, width: 320, height: 400 };
    fold.rect = { left: 8, top: 8, width: 28, height: 28 };

    press(burger);

    assert.equal(fold.style["--ui-drawer-switch-x"], "284px", "its right edge at the drawer's");
    assert.equal(fold.style["--ui-drawer-switch-y"], "364px", "its bottom edge at the drawer's");
});

test("a panel further down the drawer than its start keeps its switch and its name: it lies nowhere near the opener", () => {
    const burger = FakeElement.of("ui-shell__drawer-toggle", { "data-ui-drawer-toggle": "left-side" }, "button");
    const fold = FakeElement.of("ui-collapsible__toggle", { "data-ui-collapse-toggle": "", "aria-expanded": "true", "aria-label": "Expand or collapse" }, "button");
    const panel = FakeElement.of("ui-collapsible ui-side--left").append(fold, FakeElement.of("ui-collapsible__content"));
    const drawer = FakeElement.of("", { "data-ui-region": "left-side" }).append(FakeElement.of("ui-text"), panel);
    const root = FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "md" }).append(FakeElement.of("", { "data-ui-region": "header" }).append(burger), drawer);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    burger.rect = { left: 12, top: 10, width: 40, height: 40 };
    press(burger);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left-side");
    assert.equal(fold.hasAttribute("data-ui-drawer-switch"), false);
    assert.equal(fold.getAttribute("aria-label"), "Expand or collapse");
});

test("opening the other side puts the open drawer away first: its holder's marks and its switch's name given back", () => {
    const { root, burger, fold, panel } = page();
    const drawer = panel.parent!.parent!;
    const rightBurger = FakeElement.of("ui-shell__drawer-toggle", { "data-ui-drawer-toggle": "right-side" }, "button");
    const right = FakeElement.of("", { "data-ui-region": "right-side" });

    root.children[0].append(rightBurger);
    root.append(right);
    fold.setAttribute("aria-label", "Expand or collapse");
    burger.rect = { left: 12, top: 10, width: 40, height: 40 };

    press(burger);
    assert.equal(drawer.getAttribute("aria-modal"), "true");

    press(rightBurger);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "right-side");
    assert.equal(drawer.hasAttribute("aria-modal"), false);
    assert.equal(drawer.hasAttribute("role"), false);
    assert.equal(fold.getAttribute("aria-label"), "Expand or collapse");
    assert.equal(right.getAttribute("aria-modal"), "true");
});
