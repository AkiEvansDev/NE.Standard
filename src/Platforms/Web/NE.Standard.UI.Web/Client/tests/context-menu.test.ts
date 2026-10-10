// A context menu: opened by the pointer it holds the keyboard itself with no entry current, the first arrow entering at the near
// end; opened by a key its first entry takes it. Closed, the focus goes back to what held it, else to its owner — never the page's
// body — and a closing press on nothing focusable is swallowed; a menu opened over one still fading cuts that fade short.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeMouseEvent extends FakeEvent {
    public readonly clientX = 10;
    public readonly clientY = 10;
    public readonly button: number;

    public constructor(type: string, target: FakeElement, button = 2) {
        super(type);
        this.target = target;
        this.button = button;
    }

    public composedPath(): FakeElement[] {
        return pathOf(this.target);
    }
}

class FakeCustomEvent extends FakeEvent {
    public readonly detail: unknown;

    public constructor(type: string, init: { readonly detail?: unknown } = {}) {
        super(type);
        this.detail = init.detail;
    }
}

// The fades a test hands a menu, finished when a new menu takes its place.
class FakeTransition {
    public finished = false;

    public finish(): void {
        this.finished = true;
    }
}

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    MouseEvent: FakeMouseEvent,
    CustomEvent: FakeCustomEvent,
    CSSTransition: FakeTransition,
    // A menu asked for from the keyboard is placed under the box it was asked from, as an anchored popup.
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

const { ContextMenuEngine, contextMenuAt } = await import("../src/interactions/context-menu-engine.ts");
const { MenuEngine } = await import("../src/interactions/menu-engine.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new ContextMenuEngine({ root: real<ParentNode>(fakeDocument.body) });
new MenuEngine({ root: real<ParentNode>(fakeDocument.body) });

function pathOf(target: FakeElement | null): FakeElement[] {
    const path: FakeElement[] = [];

    for (let current = target; current !== null; current = current.parent)
        path.push(current);

    return path;
}

type Scene = { readonly card: FakeElement; readonly host: FakeElement; readonly entries: readonly FakeElement[]; readonly before: FakeElement };

function scene(): Scene {
    const caption = FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": "header" });
    const rename = FakeElement.of("ui-menu-item", { role: "menuitem", tabindex: "-1" });
    const duplicate = FakeElement.of("ui-menu-item", { role: "menuitem", tabindex: "-1" });
    const host = FakeElement.of("ui-context-menu", { "data-ui-context-menu": "", role: "menu" }).append(FakeElement.of("ui-menu").append(caption, rename, duplicate));
    const card = FakeElement.of("", { "data-ui-id": "7", "data-ui-context-menu-owner": "" }).append(new FakeElement("p"), host);
    const before = new FakeElement("button");

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(before, card);
    fakeDocument.activeElement = fakeDocument.body;

    return { card, host, entries: [rename, duplicate], before };
}

function openByPointer(at: Scene, on: FakeElement = at.card): void {
    notePress(real(on));
    on.dispatchEvent(new FakeMouseEvent("contextmenu", on));
}

function openByKey(at: Scene): void {
    noteKey(real<Event>(new FakeKeyboardEvent("ContextMenu")));
    at.card.dispatchEvent(new FakeMouseEvent("contextmenu", at.card));
}

function key(name: string): void {
    const event = new FakeKeyboardEvent(name, fakeDocument.activeElement);

    noteKey(real<Event>(event));
    fakeDocument.activeElement?.dispatchEvent(event);
}

function escape(): void {
    const event = new FakeKeyboardEvent("Escape", fakeDocument.activeElement);

    noteKey(real<Event>(event));
    fakeDocument.documentElement.dispatchEvent(event);
}

test("a menu the pointer opened holds the keyboard itself, no entry current and none a tab stop", () => {
    const at = scene();

    openByPointer(at);

    assert.equal(at.host.classes.has("ui-context-menu--open"), true);
    assert.equal(fakeDocument.activeElement, at.host);
    assert.deepEqual(at.entries.map(entry => entry.getAttribute("tabindex")), ["-1", "-1"]);
});

test("the first ArrowDown in a menu the pointer opened lands on its first entry, the first ArrowUp on its last", () => {
    const at = scene();

    openByPointer(at);
    key("ArrowDown");

    assert.equal(fakeDocument.activeElement, at.entries[0]);

    escape();
    openByPointer(at);
    key("ArrowUp");

    assert.equal(fakeDocument.activeElement, at.entries[1]);
    escape();
});

test("a menu a key opened gives its first entry the keyboard, the menu's one tab stop", () => {
    const at = scene();

    openByKey(at);

    assert.equal(fakeDocument.activeElement, at.entries[0]);
    assert.deepEqual(at.entries.map(entry => entry.getAttribute("tabindex")), ["0", "-1"]);
    escape();
});

test("Escape gives the focus back to what held it before the menu opened", () => {
    const at = scene();

    at.before.focus();
    openByPointer(at);
    escape();

    assert.equal(at.host.classes.has("ui-context-menu--open"), false);
    assert.equal(fakeDocument.activeElement, at.before);
});

test("with nothing held, Escape gives the focus to the owner, made focusable for that return alone, never to the body", () => {
    const at = scene();

    openByPointer(at);
    escape();

    assert.equal(fakeDocument.activeElement, at.card);
    assert.equal(at.card.getAttribute("tabindex"), "-1");

    at.before.focus();

    assert.equal(at.card.hasAttribute("tabindex"), false);
});

test("the press that closes the menu is swallowed where it lands on nothing focusable, so the focus stays where the menu gave it back", () => {
    const at = scene();
    const ground = new FakeElement("p");
    const button = new FakeElement("button");

    fakeDocument.body.append(ground, button);
    at.before.focus();
    openByPointer(at);

    notePress(real(ground));
    fakeDocument.documentElement.dispatchEvent(Object.assign(new FakeMouseEvent("pointerdown", ground, 0), { composedPath: () => pathOf(ground) }));

    assert.equal(at.host.classes.has("ui-context-menu--open"), false);
    assert.equal(fakeDocument.activeElement, at.before);

    const onGround = new FakeMouseEvent("mousedown", ground, 0);
    const onButton = new FakeMouseEvent("mousedown", button, 0);

    fakeDocument.documentElement.dispatchEvent(onGround);
    fakeDocument.documentElement.dispatchEvent(onButton);

    assert.equal(onGround.defaultPrevented, true);
    assert.equal(onButton.defaultPrevented, false);
});

test("a menu opened over one still fading out ends that fade at once", () => {
    const at = scene();
    const fade = new FakeTransition();

    Object.assign(at.host, { getAnimations: () => [fade] });
    openByPointer(at);
    openByPointer(at);

    assert.equal(fade.finished, true);
    assert.equal(at.host.classes.has("ui-context-menu--open"), true);
    escape();
});

test("a table refusing menus refuses a nested component's in its rows, wherever its scroll box puts the host; so does a template's word", () => {
    const words = new FakeElement("p");
    const menu = FakeElement.of("ui-context-menu", { "data-ui-context-menu": "", role: "menu" }).append(FakeElement.of("ui-menu").append(FakeElement.of("ui-menu-item", { role: "menuitem", tabindex: "-1" })));
    const nested = FakeElement.of("", { "data-ui-id": "7", "data-ui-context-menu-owner": "" }).append(words, menu);
    const template = FakeElement.of("", { "data-ui-id": "5" }).append(nested);
    const row = FakeElement.of("ui-table__row", { "data-ui-key": "r1" }).append(FakeElement.of("ui-table__cell").append(template));
    const table = FakeElement.of("ui-table", { "data-ui-id": "4", "data-ui-no-context-menu": "" }).append(FakeElement.of("ui-table__scroll").append(FakeElement.of("", { "data-ui-items-host": "" }).append(row)));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(table);

    assert.equal(contextMenuAt(real(words)), null);

    table.removeAttribute("data-ui-no-context-menu");
    assert.equal(contextMenuAt(real(words))?.menu, menu);

    // `CanShowContextMenu = false` on the row's template, rather than on the item.
    template.setAttribute("data-ui-no-context-menu", "");
    assert.equal(contextMenuAt(real(words)), null);
});
