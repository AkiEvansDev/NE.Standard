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
    const root = FakeElement.of("", { "data-ui-root": "" }).append(FakeElement.of("", { "data-ui-region": "header" }).append(burger), drawer);

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
