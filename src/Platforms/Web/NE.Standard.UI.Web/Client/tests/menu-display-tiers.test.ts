// A menu whose display differs by breakpoint (MenuComponent.Display): the rail on the tiers the server lists, the list on the rest,
// turned as the window crosses a breakpoint, its groups re-resolved for each shape. Where its side is a drawer the base tier alone
// decides: a drawer's rail is drawn as a list, a bottom bar stays the rail. A list's fold is kept while the menu is a rail, unread,
// and is the list's again.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let width = 900;
const widthListeners: (() => void)[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 900, innerHeight: 844, localStorage: { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } },
    getComputedStyle: () => ({ getPropertyValue: () => "", transform: "none", filter: "none", perspective: "none", direction: "ltr", position: "static", overflowX: "visible", overflowY: "visible" }),
    // The stylesheet's own question: a `min-width` query answered for the width this test sets.
    // Live, as a browser's list is: the page keeps one per breakpoint and reads it again.
    matchMedia: (query: string) => ({ get matches() { return width >= Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0); }, addEventListener: (_: string, listener: () => void) => widthListeners.push(listener) }),
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
    FocusEvent: class {
        public readonly relatedTarget = null;
    }
});

const { MenuGroupEngine } = await import("../src/interactions/menu-group-engine.ts");
const { MenuEngine } = await import("../src/interactions/menu-engine.ts");
const { startTooltips, tooltips } = await import("../src/interactions/tooltip-engine.ts");
const { fitMenuShape } = await import("../src/rendering/menu-shape.ts");

const RailClass = "ui-menu--rail";
const TiersAttribute = "data-ui-menu-rail-tiers";
const OpenAttribute = "data-ui-menu-open";
const FlyoutAttribute = "data-ui-menu-flyout";

/** An entry as the server draws one: its title in its header, `room` wide for words `words` wide. */
function entry(title: string, selected = false, words = 30, room = 60): FakeElement {
    const label = FakeElement.of("ui-text__title");

    label.textContent = title;
    label.rect = { left: 0, top: 0, width: room, height: 16 };
    Object.defineProperty(label, "scrollWidth", { value: words });

    return FakeElement.of(selected ? "ui-menu-item ui-menu-item--selected" : "ui-menu-item", { tabindex: "-1", "data-ui-text-icon": "" }, "a").append(
        FakeElement.of("ui-button__content ui-text").append(FakeElement.of("ui-text__body").append(FakeElement.of("ui-text__header").append(label)))
    );
}

/** A menu as the server writes one of tiers: the base tier's shape, its rail tiers listed, a group holding the current page. */
function tieredMenu(base: "rail" | "list", tiers: string, attributes: Readonly<Record<string, string>> = {}): { menu: FakeElement; group: FakeElement; groupEntry: FakeElement; submenu: FakeElement } {
    const groupEntry = entry("Settings");
    const submenu = FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry("Profile", true)))));
    const group = FakeElement.of("ui-menu__item", { "data-ui-menu-group": "", "data-ui-key": "settings" }).append(groupEntry, submenu);
    const menu = FakeElement.of(`ui-menu ${base === "rail" ? RailClass : ""} ui-menu--medium ui-orientation--vertical ui-side--left`, { [TiersAttribute]: tiers, ...attributes }).append(
        FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry("Chats")), group)
    );

    return { menu, group, groupEntry, submenu };
}

// The issue's shell: a rail on a tablet, a list on a wide screen, in a padded box in a left side kept a drawer.
const drawer = tieredMenu("rail", "base sm md");
const drawerSide = FakeElement.of("", { "data-ui-region": "left-side", "data-ui-rail-drawer": "" }).append(FakeElement.of("ui-container", { "data-ui-id": "1" }).append(drawer.menu));

// A rail on the base tier and a list from the small one up, the whole of a left side that is the bottom bar where it is a drawer.
const bar = tieredMenu("rail", "base");
const barSide = FakeElement.of("", { "data-ui-region": "left-side", "data-ui-bottom-bar": "" }).append(bar.menu);

// A list folded by its reader, a rail from the medium breakpoint up, in the page's content.
const folded = tieredMenu("list", "md xl xxl", { "data-ui-collapsed": "" });
const foldedChats = folded.menu.children[0].children[0].children[0];

// A list on the base tier and a rail from the small one up, in a left side holding more than it: a drawer below the medium breakpoint.
const smallRail = tieredMenu("list", "sm md xl xxl");
const smallRailSide = FakeElement.of("", { "data-ui-region": "left-side" }).append(FakeElement.of("ui-container").append(smallRail.menu, FakeElement.of("ui-text")));

// A list on the base tier and a rail from the medium one up, in a left side kept a drawer below the extra-large width.
const wideRail = tieredMenu("list", "md xl xxl");
const wideRailRoot = FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "xl" }).append(FakeElement.of("", { "data-ui-region": "left-side" }).append(wideRail.menu));

// The same in a right side whose view keeps its sides drawers at every width.
const alwaysRail = tieredMenu("list", "md xl xxl");

fakeDocument.body.append(
    FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "md" }).append(drawerSide),
    FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "md" }).append(barSide),
    FakeElement.of("", { "data-ui-root": "" }).append(folded.menu),
    FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "md" }).append(smallRailSide),
    wideRailRoot,
    FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": "always" }).append(FakeElement.of("", { "data-ui-region": "right-side" }).append(alwaysRail.menu))
);

startTooltips();
new MenuGroupEngine({ root: real<ParentNode>(fakeDocument.body) });
new MenuEngine({ root: real<ParentNode>(fakeDocument.body) });

function resize(to: number): void {
    width = to;

    for (const listener of widthListeners)
        listener();
}

function focus(element: FakeElement): void {
    element.focus();

    const domEvent = new FakeEvent("focusin");

    domEvent.target = element;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

function blur(element: FakeElement): void {
    element.blur();

    const domEvent = new FakeEvent("focusout");

    domEvent.target = element;
    fakeDocument.documentElement.dispatchEvent(domEvent);
}

function shows(element: FakeElement): boolean {
    return element.getAttribute("aria-describedby") === "ui-tooltip";
}

test("on a tablet the menu is the rail its tier says, its groups flying out", () => {
    assert.equal(drawer.menu.classList.contains(RailClass), true);
    assert.equal(drawer.group.hasAttribute(OpenAttribute), false);

    drawer.groupEntry.dispatchEvent(new FakeEvent("click"));

    assert.equal(drawer.submenu.hasAttribute(FlyoutAttribute), true);

    drawer.groupEntry.dispatchEvent(new FakeEvent("click"));
});

test("on a wide screen it is the list, the current page's group open inline", () => {
    resize(1280);

    assert.equal(drawer.menu.classList.contains(RailClass), false);
    assert.equal(drawer.group.hasAttribute(OpenAttribute), true);
    assert.equal(drawer.submenu.hasAttribute(FlyoutAttribute), false);
});

test("on a phone its side is a drawer, which draws its base tier's rail as a list", () => {
    resize(390);

    assert.equal(drawer.menu.classList.contains(RailClass), false);
    assert.equal(drawer.group.hasAttribute(OpenAttribute), true);
});

test("a bottom bar stays the rail where its side is a drawer, whatever a narrow tier above the base says", () => {
    resize(700);

    assert.equal(bar.menu.classList.contains(RailClass), true, "the small tier says list, but the side is the bar below the medium breakpoint");

    resize(900);

    assert.equal(bar.menu.classList.contains(RailClass), false, "in its column the tier decides");
});

test("a folded list keeps its fold as a rail, drawn as the rail's, and is folded again as the list", () => {
    resize(390);

    assert.equal(folded.menu.classList.contains(RailClass), false);
    focus(foldedChats);
    assert.equal(shows(foldedChats), true, "a folded list's entry shows its hidden title");
    blur(foldedChats);
    tooltips.hide();

    resize(900);

    assert.equal(folded.menu.classList.contains(RailClass), true);
    assert.equal(folded.menu.hasAttribute("data-ui-collapsed"), true, "the fold is kept for the list");
    focus(foldedChats);
    assert.equal(shows(foldedChats), false, "a rail's label shown whole needs no tooltip: the fold is not read on a rail");
    blur(foldedChats);
    tooltips.hide();

    resize(390);

    assert.equal(folded.menu.classList.contains(RailClass), false);
    assert.equal(folded.menu.hasAttribute("data-ui-collapsed"), true);
});

test("the shape is fitted as the boot script fits it: by the tiers alone where no side marks it", () => {
    const loose = FakeElement.of("ui-menu", { [TiersAttribute]: "md" });

    resize(390);
    assert.equal(fitMenuShape(real(loose)), false);
    assert.equal(loose.classList.contains(RailClass), false);

    resize(900);
    assert.equal(fitMenuShape(real(loose)), true, "it says it changed");
    assert.equal(loose.classList.contains(RailClass), true);

    resize(1280);
    assert.equal(fitMenuShape(real(loose)), true, "the tiers listed are every one it is a rail in");
    assert.equal(loose.classList.contains(RailClass), false);

    assert.equal(fitMenuShape(real(FakeElement.of("ui-menu"))), false, "a list at every width is left alone");
});

test("a list on the base tier stays the list in a drawer, whatever a narrow tier above it says, and is the rail in its column", () => {
    resize(700);

    assert.equal(smallRail.menu.classList.contains(RailClass), false, "the small tier says rail, but the side is a drawer below the medium breakpoint");

    resize(900);

    assert.equal(smallRail.menu.classList.contains(RailClass), true, "in its column the tier decides");

    resize(700);

    assert.equal(smallRail.menu.classList.contains(RailClass), false, "crossing back into the drawer gives the base tier's list again");
    assert.equal(smallRail.group.hasAttribute(OpenAttribute), true, "its groups are the list's again");
});

test("a view keeping its sides drawers to a wider width keeps the base tier's list there", () => {
    resize(900);

    assert.equal(wideRail.menu.classList.contains(RailClass), false, "the medium tier says rail, but the side is a drawer below the extra-large width");

    resize(1280);

    assert.equal(wideRail.menu.classList.contains(RailClass), true);

    resize(900);

    assert.equal(wideRail.menu.classList.contains(RailClass), false);
});

test("a pinned side stands in its column from the medium breakpoint up, where the tier decides again", () => {
    resize(900);
    wideRailRoot.setAttribute("data-ui-pinned-left-side", "");

    assert.equal(fitMenuShape(real(wideRail.menu)), true);
    assert.equal(wideRail.menu.classList.contains(RailClass), true);

    wideRailRoot.removeAttribute("data-ui-pinned-left-side");

    assert.equal(fitMenuShape(real(wideRail.menu)), true);
    assert.equal(wideRail.menu.classList.contains(RailClass), false);
});

test("a side that is a drawer at every width keeps the base tier's list at every width", () => {
    for (const to of [390, 900, 1280, 1600]) {
        resize(to);

        assert.equal(alwaysRail.menu.classList.contains(RailClass), false, `at ${to} px`);
    }
});
