// A menu's keys: one walk and one Tab stop for the whole menu, a group's inline block in it while open; Right opens a group — its
// block inline, a select's list as a flyout on its first entry — and Left closes it back to its entry; the arrows walk round past
// the ends and leave a chord to the browser; a typed letter reaches the next entry it begins; Space presses on its release.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900, localStorage: { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
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

const { MenuEngine } = await import("../src/interactions/menu-engine.ts");
const { MenuGroupEngine } = await import("../src/interactions/menu-group-engine.ts");
const { noteKey } = await import("../src/interactions/popup-focus.ts");

function entry(title: string): FakeElement {
    const element = FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": "item" }, "a");

    element.textContent = title;
    return element;
}

function item(element: FakeElement): FakeElement {
    return FakeElement.of("ui-menu__item").append(element);
}

function group(title: string, children: readonly string[], select = false): { readonly element: FakeElement; readonly entry: FakeElement; readonly entries: FakeElement[] } {
    const own = entry(title);
    const entries = children.map(entry);
    const submenu = FakeElement.of("ui-menu__submenu").append(FakeElement.of("ui-menu ui-menu--nested").append(FakeElement.of("ui-menu__host").append(...entries.map(item))));
    const element = FakeElement.of("ui-menu__item", { "data-ui-menu-group": "", "data-ui-key": title, ...(select ? { "data-ui-menu-select": "" } : {}) }).append(own, submenu);

    return { element, entry: own, entries };
}

const home = entry("Home");
const screens = group("Screens", ["Sign up", "Checkout"]);
const sort = group("Sort by", ["Name", "Created"], true);
const mechanisms = entry("Mechanisms");

fakeDocument.body.append(FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(item(home), screens.element, sort.element, item(mechanisms))));

new MenuGroupEngine({ root: real<ParentNode>(fakeDocument.body) });
new MenuEngine({ root: real<ParentNode>(fakeDocument.body) });

function key(name: string, init: Readonly<Record<string, unknown>> = {}): FakeKeyboardEvent {
    const target = fakeDocument.activeElement;
    const event = Object.assign(new FakeKeyboardEvent(name, target), init);

    noteKey(real<Event>(event));
    target?.dispatchEvent(event);

    return event;
}

function keyUp(name: string): void {
    const event = Object.defineProperty(new FakeKeyboardEvent(name, fakeDocument.activeElement), "type", { value: "keyup" });

    fakeDocument.activeElement?.dispatchEvent(event);
}

test("the menu is one stop of the Tab order", () => {
    assert.deepEqual([home, screens.entry, sort.entry, mechanisms, ...screens.entries].map(element => element.tabIndex), [0, -1, -1, -1, -1, -1]);
});

test("Right unfolds an inline group, Down walks into its block, and Left folds it back to its entry", () => {
    screens.entry.focus();
    key("ArrowRight");

    assert.equal(screens.element.hasAttribute("data-ui-menu-open"), true);
    assert.equal(fakeDocument.activeElement, screens.entry);

    key("ArrowDown");
    assert.equal(fakeDocument.activeElement, screens.entries[0]);
    key("ArrowDown");
    assert.equal(fakeDocument.activeElement, screens.entries[1]);
    key("ArrowDown");
    assert.equal(fakeDocument.activeElement, sort.entry);

    // The block's entries are the menu's: one stop among them all.
    assert.deepEqual([home, screens.entry, ...screens.entries, sort.entry, mechanisms].filter(element => element.tabIndex === 0), [sort.entry]);

    key("ArrowUp");
    key("ArrowLeft");
    assert.equal(fakeDocument.activeElement, screens.entry);
    assert.equal(screens.element.hasAttribute("data-ui-menu-open"), false);

    key("ArrowDown");
    assert.equal(fakeDocument.activeElement, sort.entry);
});

test("Right on a select's entry flies its list out on its first entry, and Left closes it, the keyboard back on the entry", () => {
    sort.entry.focus();
    key("ArrowRight");

    assert.equal(sort.element.hasAttribute("data-ui-menu-open"), true);
    assert.equal(fakeDocument.activeElement, sort.entries[0]);

    key("ArrowLeft");

    assert.equal(sort.element.hasAttribute("data-ui-menu-open"), false);
    assert.equal(fakeDocument.activeElement, sort.entry);
});

test("the arrows walk round past the ends, and leave a chord to the browser", () => {
    mechanisms.focus();
    key("ArrowDown");
    assert.equal(fakeDocument.activeElement, home);

    const back = key("ArrowUp", { altKey: true });

    assert.equal(fakeDocument.activeElement, home);
    assert.equal(back.defaultPrevented, false);
});

test("a typed letter reaches the next entry it begins, and is taken whether or not one does", async () => {
    home.focus();
    key("m");
    assert.equal(fakeDocument.activeElement, mechanisms);

    // A pause ends the prefix: the next letter starts a new one.
    await new Promise(resolve => setTimeout(resolve, 600));

    const none = key("q");

    assert.equal(fakeDocument.activeElement, mechanisms);
    assert.equal(none.defaultPrevented, true);
});

test("Space presses an entry on its release, Enter on its press", () => {
    let presses = 0;

    mechanisms.addEventListener("click", () => presses++);
    mechanisms.focus();

    key(" ");
    assert.equal(presses, 0);
    keyUp(" ");
    assert.equal(presses, 1);

    key("Enter");
    assert.equal(presses, 2);
});
