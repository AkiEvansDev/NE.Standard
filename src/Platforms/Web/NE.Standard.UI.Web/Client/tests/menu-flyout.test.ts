// A folded menu's group flies out beside its icon: opened from the keyboard its first entry takes the keyboard, opened by a press
// the focus stays on the rail; and one group's flyout swapped for another's goes at once, not fading under the new one. A submenu
// opened from a popup's entry stands flush against that popup and level with its entry.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// An element's own padding and border, where a test gives it one.
const boxStyles = new Map<unknown, Readonly<Record<string, string>>>();

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900, localStorage: { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } },
    getComputedStyle: (element: unknown) => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr", ...boxStyles.get(element) }),
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
    }
});

const { MenuGroupEngine } = await import("../src/interactions/menu-group-engine.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

type Group = { readonly entry: FakeElement; readonly submenu: FakeElement; readonly entries: readonly FakeElement[] };

function group(name: string): { readonly element: FakeElement; readonly parts: Group } {
    const entry = FakeElement.of("ui-menu-item", { id: name });
    const entries = ["one", "two"].map(item => FakeElement.of("ui-menu-item", { id: `${name}-${item}` }));
    const submenu = FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(...entries));
    const element = FakeElement.of("ui-menu__item", { "data-ui-menu-group": "", "data-ui-key": name }).append(entry, submenu);

    return { element, parts: { entry, submenu, entries } };
}

const layouts = group("layouts");
const inputs = group("inputs");

fakeDocument.body.append(FakeElement.of("ui-menu", { "data-ui-collapsed": "" }).append(FakeElement.of("ui-menu__host").append(layouts.element, inputs.element)));

new MenuGroupEngine({ root: real<ParentNode>(fakeDocument.body) });

function openByKey(at: Group): void {
    at.entry.focus();
    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    at.entry.dispatchEvent(new FakeEvent("click"));
}

function openByPress(at: Group): void {
    notePress(real(at.entry));
    at.entry.focus();
    at.entry.dispatchEvent(new FakeEvent("click"));
}

test("a group's flyout opened from the keyboard gives its first entry the keyboard", () => {
    openByKey(layouts.parts);

    assert.equal(layouts.parts.submenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(fakeDocument.activeElement, layouts.parts.entries[0]);

    openByKey(layouts.parts);
});

test("a group's flyout opened by a press leaves the focus on the rail", () => {
    openByPress(inputs.parts);

    assert.equal(fakeDocument.activeElement, inputs.parts.entry);

    openByPress(inputs.parts);
});

test("one group's flyout swapped for another's goes at once, not fading under the new one", () => {
    openByPress(layouts.parts);
    openByPress(inputs.parts);

    assert.equal(layouts.parts.submenu.hasAttribute("data-ui-menu-flyout"), false);
    assert.equal(inputs.parts.submenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(inputs.element.hasAttribute("data-ui-menu-open"), true);
});

test("a press on a flyout's entry puts it away; one on a caption or a check keeps it up", () => {
    const caption = FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": "header" });
    const check = FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": "check" });

    layouts.parts.entries[0].parentElement?.append(caption, check);
    openByPress(layouts.parts);

    caption.dispatchEvent(new FakeEvent("click"));
    assert.equal(layouts.element.hasAttribute("data-ui-menu-open"), true);

    check.dispatchEvent(new FakeEvent("click"));
    assert.equal(layouts.element.hasAttribute("data-ui-menu-open"), true);

    layouts.parts.entries[1].dispatchEvent(new FakeEvent("click"));
    assert.equal(layouts.element.hasAttribute("data-ui-menu-open"), false);

    caption.remove();
    check.remove();
});

test("a press on the flyout between its entries — its padding, a gap — keeps it up", () => {
    openByPress(layouts.parts);

    layouts.parts.submenu.dispatchEvent(new FakeEvent("click"));
    assert.equal(layouts.element.hasAttribute("data-ui-menu-open"), true);

    layouts.parts.entries[0].parentElement?.dispatchEvent(new FakeEvent("click"));
    assert.equal(layouts.element.hasAttribute("data-ui-menu-open"), true);

    layouts.parts.entries[0].dispatchEvent(new FakeEvent("click"));
    assert.equal(layouts.element.hasAttribute("data-ui-menu-open"), false);
});

test("a submenu from a context menu's entry stands flush against the menu, its first entry level with the entry", () => {
    const color = group("color");
    const menu = FakeElement.of("ui-context-menu").append(FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(color.element)));

    color.element.setAttribute("data-ui-menu-select", "");
    menu.rect = { left: 100, top: 100, width: 200, height: 40 };
    color.parts.entry.rect = { left: 105, top: 105, width: 190, height: 30 };
    color.parts.submenu.rect = { left: 0, top: 0, width: 160, height: 120 };
    boxStyles.set(color.parts.submenu, { paddingTop: "4px", borderTopWidth: "1px", paddingBottom: "4px", borderBottomWidth: "1px" });
    fakeDocument.body.append(menu);

    openByPress(color.parts);

    // Flush with the menu's edge, not the entry's, which stands inside the menu's padding; up by its own padding and border.
    assert.equal(color.parts.submenu.style.left, "300px");
    assert.equal(color.parts.submenu.style.top, "100px");

    openByPress(color.parts);
});

test("a submenu from an on-page surface-wrapped menu docks flush on the surface's 1 px border", () => {
    const region = group("region");
    const surface = FakeElement.of("ui-surface").append(FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(region.element)));

    region.element.setAttribute("data-ui-menu-select", "");
    surface.rect = { left: 100, top: 100, width: 200, height: 120 };
    boxStyles.set(surface, { borderRightWidth: "1px", borderLeftWidth: "1px" });
    region.parts.entry.rect = { left: 105, top: 105, width: 190, height: 30 };
    region.parts.submenu.rect = { left: 0, top: 0, width: 160, height: 120 };
    boxStyles.set(region.parts.submenu, { paddingTop: "4px", borderTopWidth: "1px", paddingBottom: "4px", borderBottomWidth: "1px" });
    fakeDocument.body.append(surface);

    openByPress(region.parts);

    assert.equal(region.parts.submenu.style.left, "299px");
    assert.equal(region.parts.submenu.style.top, "100px");

    openByPress(region.parts);
});

test("a group's flyout is called what the group's own entry says", () => {
    openByPress(inputs.parts);

    const list = inputs.parts.submenu.children[0];

    assert.notEqual(inputs.parts.entry.id, "");
    assert.equal(list.getAttribute("aria-labelledby"), inputs.parts.entry.id);
    openByPress(inputs.parts);
});

test("nested flyouts cascade across three levels and close together when an entry is chosen", () => {
    const copyAs = group("copy-as");
    const copy = group("copy-nested");
    const menu = FakeElement.of("ui-context-menu").append(FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(copy.element)));

    copy.parts.submenu.children[0].append(copyAs.element);
    menu.rect = { left: 100, top: 100, width: 200, height: 120 };
    boxStyles.set(menu, { borderRightWidth: "1px", borderLeftWidth: "1px" });
    copy.parts.entry.rect = { left: 105, top: 105, width: 190, height: 30 };
    copy.parts.submenu.rect = { left: 299, top: 100, width: 180, height: 100 };
    boxStyles.set(copy.parts.submenu, { paddingTop: "4px", borderTopWidth: "1px", borderRightWidth: "1px", paddingBottom: "4px", borderBottomWidth: "1px" });
    copyAs.parts.entry.rect = { left: 304, top: 135, width: 170, height: 30 };
    copyAs.parts.submenu.rect = { left: 0, top: 0, width: 160, height: 90 };
    boxStyles.set(copyAs.parts.submenu, { paddingTop: "4px", borderTopWidth: "1px", paddingBottom: "4px", borderBottomWidth: "1px" });
    fakeDocument.body.append(menu);

    openByPress(copy.parts);
    assert.equal(copy.parts.submenu.style.left, "299px");
    assert.equal(copy.element.hasAttribute("data-ui-menu-open"), true);

    openByPress(copyAs.parts);
    assert.equal(copy.element.hasAttribute("data-ui-menu-open"), true);
    assert.equal(copy.parts.submenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(copyAs.element.hasAttribute("data-ui-menu-open"), true);
    assert.equal(copyAs.parts.submenu.hasAttribute("data-ui-menu-flyout"), true);
    assert.equal(copyAs.parts.submenu.style.left, "478px");

    // Hovering a sibling entry in the second-level flyout closes the third-level flyout while keeping the second open.
    copy.parts.entries[0].dispatchEvent(new FakeEvent("pointerover"));
    assert.equal(copy.element.hasAttribute("data-ui-menu-open"), true);
    assert.equal(copyAs.element.hasAttribute("data-ui-menu-open"), false);

    // Reopen the third level and pick an action inside it: both nested flyouts close.
    openByPress(copyAs.parts);
    copyAs.parts.entries[0].setAttribute("data-ui-menu-item-kind", "item");
    copyAs.parts.entries[0].dispatchEvent(new FakeEvent("click"));
    assert.equal(copyAs.element.hasAttribute("data-ui-menu-open"), false);
    assert.equal(copy.element.hasAttribute("data-ui-menu-open"), false);
});
