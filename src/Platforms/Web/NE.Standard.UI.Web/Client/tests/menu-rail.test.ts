// A rail never folds, yet its groups fly out beside it as a folded menu's do, and a group the server sent open is closed; an entry
// whose one-line label is cut shows it whole as its tooltip, from the keyboard at once, and its own words instead where it has them.
// A folded menu's entry shows its hidden title so always, and a flyout's entry, whose title shows, does not. The page's tooltip
// engine opens and closes those words, as any tooltip's; the menu engine only says what they are, and on which side: toward the
// content, where a flyout opens too. A group's own entry raises no click of the menu's: its press only opens the group.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 1280, innerHeight: 900, localStorage: { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } },
    getComputedStyle: () => ({ getPropertyValue: () => "", transform: "none", filter: "none", perspective: "none", direction: "ltr", position: "static", overflowX: "visible", overflowY: "visible" }),
    MutationObserver: class {
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
    },
    // The focus leaving a flyout's group is the owned popups' to hear; none is open here, so no event of this page is one.
    FocusEvent: class {
        public readonly relatedTarget = null;
    }
});

const { MenuGroupEngine, towardContent } = await import("../src/interactions/menu-group-engine.ts");
const { MenuEngine } = await import("../src/interactions/menu-engine.ts");
const { startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");

/** A rail entry drawn as the server draws one: the label in its header, `width` the room it has and `words` wide as written. */
function entry(title: string, words: number, width: number, attributes: Readonly<Record<string, string>> = {}): FakeElement {
    const label = FakeElement.of("ui-text__title");

    label.textContent = title;
    label.rect = { left: 0, top: 0, width, height: 16 };
    Object.defineProperty(label, "scrollWidth", { value: words });

    return FakeElement.of("ui-menu-item", { tabindex: "-1", ...attributes }, "a").append(
        FakeElement.of("ui-button__content ui-text").append(FakeElement.of("ui-text__body").append(FakeElement.of("ui-text__header").append(label)))
    );
}

const cut = entry("Quick phrases", 96, 60);
const whole = entry("Chat", 30, 60);
const own = entry("Administration", 110, 60, { "data-ui-tooltip": "Users and roles" });

const groupEntry = entry("Folders", 40, 60);
const submenu = FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(FakeElement.of("ui-menu-item", {}, "a")))));
const group = FakeElement.of("ui-menu__item", { "data-ui-menu-group": "", "data-ui-menu-open": "", "data-ui-key": "folders" }).append(groupEntry, submenu);

const rail = FakeElement.of("ui-menu ui-menu--rail ui-orientation--vertical").append(
    FakeElement.of("ui-menu__host").append(...[cut, whole, own].map(item => FakeElement.of("ui-menu__item").append(item)), group)
);

const folded = entry("Chat", 30, 60);
const foldedOwn = entry("Profile", 40, 60, { "data-ui-tooltip": "Your account" });
const flown = entry("Users", 30, 60);
const collapsed = FakeElement.of("ui-menu", { "data-ui-collapsed": "" }).append(
    FakeElement.of("ui-menu__host").append(
        ...[folded, foldedOwn].map(item => FakeElement.of("ui-menu__item").append(item)),
        FakeElement.of("ui-menu__item").append(FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(flown)))))
    )
);

// Placed as the server writes every entry: the tooltip placement attribute at its default, which is its own tooltip's.
const rightFolded = entry("Settings", 30, 60, { "data-ui-tooltip-placement": "top" });

rightFolded.rect = { left: 1200, top: 300, width: 40, height: 40 };

const rightCollapsed = FakeElement.of("ui-menu ui-side--right", { "data-ui-collapsed": "" }).append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(rightFolded)));

fakeDocument.body.append(rail, collapsed, rightCollapsed);

startTooltips();
new MenuGroupEngine({ root: real<ParentNode>(fakeDocument.body) });
new MenuEngine({ root: real<ParentNode>(fakeDocument.body) });

/** Focuses an entry, the page's capturing listeners on the document hearing it as the browser's do. */
function focus(element: FakeElement): void {
    element.focus();
    raise("focusin", element);
}

function blur(element: FakeElement): void {
    element.blur();
    raise("focusout", element);
}

function raise(type: string, target: FakeElement): void {
    const domEvent = new FakeEvent(type);

    domEvent.target = target;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

function tooltipText(): string | null | undefined {
    return fakeDocument.body.querySelector(".ui-tooltip")?.getAttribute("data-ui-tooltip-text");
}

function shows(element: FakeElement): boolean {
    return element.getAttribute("aria-describedby") === "ui-tooltip";
}

test("a rail's group the server sent open stands closed, its entry saying it opens a popup", () => {
    assert.equal(group.hasAttribute("data-ui-menu-open"), false);
    assert.equal(groupEntry.getAttribute("aria-haspopup"), "menu");
});

test("a rail's group flies out beside it, as a folded menu's does", () => {
    groupEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(submenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(group.hasAttribute("data-ui-menu-open"), true);

    groupEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(group.hasAttribute("data-ui-menu-open"), false);
});

test("a cut label shows whole under the keyboard's focus, and goes with the focus", () => {
    focus(cut);

    assert.equal(shows(cut), true);
    assert.equal(tooltipText(), "Quick phrases");

    blur(cut);
    focus(whole);

    assert.equal(shows(cut), false);
    assert.equal(shows(whole), false, "a label shown whole needs no tooltip");

    blur(whole);
});

test("an entry with a tooltip of its own shows its own words, not its cut label", () => {
    focus(own);

    assert.equal(shows(own), true);
    assert.equal(tooltipText(), "Users and roles");

    blur(own);
    tooltips.hide();
});

test("a label's words are not read as markup in the tooltip", () => {
    const starred = entry("*Starred*", 90, 40);

    rail.children[0].append(FakeElement.of("ui-menu__item").append(starred));
    focus(starred);

    assert.equal(tooltipText(), "*Starred*");

    blur(starred);
});

test("a cut label shows under the pointer's hover too, after the hover's wait", async () => {
    raise("pointerover", cut);
    await new Promise(done => setTimeout(done, 300));

    assert.equal(shows(cut), true);
    assert.equal(tooltipText(), "Quick phrases");

    tooltips.hide();
});

test("a folded menu's entry shows its title as its tooltip whether or not it would fit, its own words where it has them", () => {
    focus(folded);

    assert.equal(shows(folded), true);
    assert.equal(tooltipText(), "Chat");

    blur(folded);
    focus(foldedOwn);

    assert.equal(shows(folded), false);
    assert.equal(tooltipText(), "Your account", "the entry's own tooltip wins over its title");

    blur(foldedOwn);
    focus(flown);

    assert.equal(shows(flown), false, "a flyout's entry shows its title itself");

    blur(flown);
    tooltips.hide();
});

test("a menu's popups open toward the content: a right-hand menu's to its left, a left-hand one's to its right", () => {
    assert.equal(towardContent(real(FakeElement.of("ui-menu ui-side--left"))), "right");
    assert.equal(towardContent(real(FakeElement.of("ui-menu ui-side--right"))), "left");
    assert.equal(towardContent(real(FakeElement.of("ui-menu ui-side--top"))), "bottom");
    assert.equal(towardContent(real(FakeElement.of("ui-menu ui-side--bottom"))), "top");
});

test("a folded entry's title stands beside it, toward the content, rather than over the entry before it, whatever default it carries", () => {
    focus(rightFolded);

    assert.equal(shows(rightFolded), true);
    assert.equal(real<HTMLElement>(fakeDocument.body.querySelector(".ui-tooltip")).dataset.uiPlacement, "left");

    blur(rightFolded);
    tooltips.hide();
});

test("a group's own entry raises no click of the menu's, nor of anything around it: its press only opens the group", () => {
    assert.equal(groupEntry.hasAttribute("data-ui-no-click"), true);
    assert.equal(groupEntry.hasAttribute("data-ui-event-boundary"), true);
    assert.equal(cut.hasAttribute("data-ui-no-click"), false, "an entry of no group keeps its click");
});
