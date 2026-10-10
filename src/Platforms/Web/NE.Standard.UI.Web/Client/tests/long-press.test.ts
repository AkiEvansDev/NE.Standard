// A finger held still on a part with a context menu opens the menu, as iOS Safari never does on its own: half a second held within a
// small slop, not a scroll, a pan or a pinch, never in a field. Where the browser sends its own `contextmenu` too, the menu opens
// once, and the release's click presses nothing.

import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

function pathOf(target: FakeElement | null): FakeElement[] {
    const path: FakeElement[] = [];

    for (let current = target; current !== null; current = current.parent)
        path.push(current);

    return path;
}

Object.assign(FakeEvent.prototype, {
    composedPath(this: FakeEvent): FakeElement[] {
        return pathOf(this.target);
    }
});

class FakeMouseEvent extends FakeEvent {
    public readonly clientX: number;
    public readonly clientY: number;
    public readonly button: number;
    public readonly pointerType: string | undefined;
    public readonly pointerId: number;

    public constructor(type: string, init: { readonly clientX?: number; readonly clientY?: number; readonly button?: number; readonly pointerType?: string; readonly pointerId?: number } = {}) {
        super(type);
        this.clientX = init.clientX ?? 10;
        this.clientY = init.clientY ?? 10;
        this.button = init.button ?? 0;
        this.pointerType = init.pointerType;
        this.pointerId = init.pointerId ?? 1;
    }
}

class FakeCustomEvent extends FakeEvent {
    public readonly detail: unknown;

    public constructor(type: string, init: { readonly detail?: unknown } = {}) {
        super(type);
        this.detail = init.detail;
    }
}

// The page's window, where the release's click is caught first.
const windowClicks: ((domEvent: FakeEvent) => void)[] = [];

installFakeDom({
    window: {
        addEventListener: (type: string, listener: (domEvent: FakeEvent) => void) => {
            if (type === "click")
                windowClicks.push(listener);
        },
        setTimeout,
        innerWidth: 1280,
        innerHeight: 900
    },
    MouseEvent: FakeMouseEvent,
    CustomEvent: FakeCustomEvent,
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    getComputedStyle: () => ({ display: "block", visibility: "visible" })
});

mock.timers.enable({ apis: ["setTimeout"] });

const { ContextMenuEngine } = await import("../src/interactions/context-menu-engine.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new ContextMenuEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly owner: FakeElement; readonly text: FakeElement; readonly field: FakeElement; readonly checkbox: FakeElement; readonly menu: FakeElement; readonly entry: FakeElement; readonly outside: FakeElement; readonly openings: () => number };

function scene(): Scene {
    const entry = FakeElement.of("ui-menu-item", { role: "menuitem", tabindex: "-1" }, "a");
    const menu = FakeElement.of("ui-context-menu", { "data-ui-context-menu": "", role: "menu" }).append(FakeElement.of("ui-menu").append(entry));
    const text = new FakeElement("p");
    const field = new FakeInput();
    const checkbox = new FakeInput("checkbox");
    const owner = FakeElement.of("", { "data-ui-id": "4", "data-ui-context-menu-owner": "" }).append(text, field, checkbox, menu);
    const outside = new FakeElement("p");
    let openings = 0;

    menu.addEventListener("ui-context-menu-opening", () => openings++);
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(outside, owner);
    fakeDocument.activeElement = fakeDocument.body;

    return { owner, text, field, checkbox, menu, entry, outside, openings: () => openings };
}

function pointer(type: string, target: FakeElement, init: { readonly x?: number; readonly y?: number; readonly pointerType?: string; readonly pointerId?: number } = {}): FakeMouseEvent {
    const event = new FakeMouseEvent(type, { clientX: init.x ?? 10, clientY: init.y ?? 10, pointerType: init.pointerType ?? "touch", pointerId: init.pointerId ?? 1 });

    if (type === "pointerdown")
        notePress(real(target), event.pointerType);

    target.dispatchEvent(event);

    return event;
}

function isOpen(at: Scene): boolean {
    return at.menu.classes.has("ui-context-menu--open");
}

function close(at: Scene): void {
    const escape = new FakeKeyboardEvent("Escape", fakeDocument.activeElement);

    noteKey(real<Event>(escape));
    fakeDocument.documentElement.dispatchEvent(escape);
    assert.equal(isOpen(at), false);
}

test("a finger held still for half a second opens the menu where it went down", () => {
    const at = scene();

    pointer("pointerdown", at.text, { x: 40, y: 60 });
    mock.timers.tick(499);
    assert.equal(isOpen(at), false);

    mock.timers.tick(1);
    assert.equal(isOpen(at), true);
    assert.equal(at.openings(), 1);
    assert.equal(at.menu.style.left, "40px");

    pointer("pointerup", at.text);
    close(at);
});

test("a drift within the slop is still a held press; past it the press is a scroll or a drag and opens nothing", () => {
    const at = scene();

    pointer("pointerdown", at.text, { x: 10, y: 10 });
    pointer("pointermove", at.text, { x: 16, y: 16 });
    mock.timers.tick(500);
    assert.equal(isOpen(at), true);
    pointer("pointerup", at.text);
    close(at);

    pointer("pointerdown", at.text, { x: 10, y: 10 });
    pointer("pointermove", at.text, { x: 10, y: 25 });
    mock.timers.tick(500);
    assert.equal(isOpen(at), false);
    pointer("pointerup", at.text);
});

test("a release, a cancelled pointer or a second finger before the time opens nothing", () => {
    const at = scene();

    for (const end of ["pointerup", "pointercancel", "pointerdown"]) {
        pointer("pointerdown", at.text);
        mock.timers.tick(300);
        pointer(end, at.text, { pointerId: 2 });
        mock.timers.tick(500);
        assert.equal(isOpen(at), false, end);
        pointer("pointerup", at.text);
    }
});

test("a mouse held down, a press on no menu's owner and a press in a field time nothing", () => {
    const at = scene();
    let raised = 0;

    fakeDocument.body.addEventListener("contextmenu", () => raised++);

    pointer("pointerdown", at.text, { pointerType: "mouse" });
    mock.timers.tick(600);
    pointer("pointerup", at.text, { pointerType: "mouse" });

    pointer("pointerdown", at.outside);
    mock.timers.tick(600);
    pointer("pointerup", at.outside);

    pointer("pointerdown", at.field);
    mock.timers.tick(600);
    pointer("pointerup", at.field);

    assert.equal(raised, 0);
    assert.equal(isOpen(at), false);
});

test("a finger held on a checkbox opens the row's menu, as a right press there does: a checkbox takes no typing", () => {
    const at = scene();

    pointer("pointerdown", at.checkbox);
    mock.timers.tick(500);
    assert.equal(isOpen(at), true);

    pointer("pointerup", at.checkbox);
    close(at);
});

test("the browser's own contextmenu after the timer opened the menu is spent: the menu opens once", () => {
    const at = scene();

    pointer("pointerdown", at.text);
    mock.timers.tick(500);

    const native = new FakeMouseEvent("contextmenu", { pointerType: "touch", button: 2 });

    at.text.dispatchEvent(native);

    assert.equal(at.openings(), 1);
    assert.equal(native.defaultPrevented, true);
    assert.equal(isOpen(at), true);

    pointer("pointerup", at.text);
    close(at);
});

test("a contextmenu elsewhere after a long press opened the menu is not spent: only the held part's own is", () => {
    const at = scene();

    pointer("pointerdown", at.text);
    mock.timers.tick(500);
    pointer("pointerup", at.text);

    const elsewhere = new FakeMouseEvent("contextmenu", { pointerType: "mouse", button: 2 });

    at.outside.dispatchEvent(elsewhere);

    assert.equal(elsewhere.defaultPrevented, false);
    close(at);
});

test("the browser's own contextmenu before the time opens the menu, and the timer then opens nothing more", () => {
    const at = scene();

    pointer("pointerdown", at.text);
    mock.timers.tick(300);
    at.text.dispatchEvent(new FakeMouseEvent("contextmenu", { pointerType: "touch", button: 2 }));
    assert.equal(at.openings(), 1);

    mock.timers.tick(500);
    assert.equal(at.openings(), 1);

    pointer("pointerup", at.text);
    close(at);
});

function click(target: FakeElement): FakeEvent {
    const domEvent = Object.assign(new FakeEvent("click"), { target });

    for (const listener of windowClicks)
        listener(domEvent);

    return domEvent;
}

test("the click a long press's release raises presses nothing; a press on the menu's entry afterwards is its own", () => {
    const at = scene();

    pointer("pointerdown", at.text);
    mock.timers.tick(500);
    pointer("pointerup", at.text);

    const release = click(at.text);

    assert.equal(release.defaultPrevented, true);
    assert.equal(release.stopped, true);

    pointer("pointerdown", at.entry);
    pointer("pointerup", at.entry);
    assert.equal(click(at.entry).stopped, false);
    close(at);
});

test("the release's click over the menu that opened under the finger is spent too, so it does not close the menu", () => {
    const at = scene();

    pointer("pointerdown", at.text);
    mock.timers.tick(500);
    pointer("pointerup", at.text);

    assert.equal(click(at.menu).stopped, true);
    assert.equal(isOpen(at), true);
    close(at);
});

test("a finger that slid to an entry after the menu opened chooses it with its release", () => {
    const at = scene();

    pointer("pointerdown", at.text, { x: 10, y: 10 });
    mock.timers.tick(500);
    pointer("pointermove", at.entry, { x: 10, y: 60 });
    pointer("pointerup", at.entry, { x: 10, y: 60 });

    assert.equal(click(at.entry).stopped, false);
    close(at);
});

/** The browser's own drag of what the finger holds; `refused` as an engine listening after the long press refuses it. */
function dragStart(target: FakeElement, refused = false): void {
    const domEvent = new FakeMouseEvent("dragstart", { pointerType: "touch" });

    target.dispatchEvent(domEvent);

    if (refused)
        domEvent.preventDefault();
}

function dragOver(target: FakeElement, x: number, y: number): void {
    target.dispatchEvent(new FakeMouseEvent("dragover", { clientX: x, clientY: y }));
}

test("the browser's own drag of a held part, begun before the time, opens the menu as it begins; the time then opens nothing more", () => {
    const at = scene();

    pointer("pointerdown", at.text, { x: 10, y: 10 });
    mock.timers.tick(400);
    dragStart(at.text);
    pointer("pointercancel", at.text, { x: 10, y: 10 });
    mock.timers.tick(1);
    assert.equal(isOpen(at), true);
    assert.equal(at.openings(), 1);

    mock.timers.tick(500);
    assert.equal(at.openings(), 1);
    close(at);
});

test("the drag moving on past the slop takes the menu away as a press outside would; let go where it began, the menu stays", () => {
    const at = scene();

    pointer("pointerdown", at.text, { x: 10, y: 10 });
    mock.timers.tick(400);
    dragStart(at.text);
    pointer("pointercancel", at.text, { x: 10, y: 10 });
    mock.timers.tick(1);
    dragOver(at.text, 14, 14);
    assert.equal(isOpen(at), true);
    dragOver(at.outside, 10, 40);
    assert.equal(isOpen(at), false);

    pointer("pointerdown", at.text, { x: 10, y: 10 });
    mock.timers.tick(400);
    dragStart(at.text);
    pointer("pointercancel", at.text, { x: 10, y: 10 });
    mock.timers.tick(1);
    at.text.dispatchEvent(new FakeMouseEvent("dragend", { clientX: 10, clientY: 10 }));
    dragOver(at.outside, 10, 60);
    assert.equal(isOpen(at), true);
    close(at);
});

test("a drag an engine refused leaves the press to its timer, and a mouse's drag opens nothing", () => {
    const at = scene();

    pointer("pointerdown", at.text);
    mock.timers.tick(400);
    dragStart(at.text, true);
    mock.timers.tick(1);
    assert.equal(isOpen(at), false);
    mock.timers.tick(99);
    assert.equal(isOpen(at), true);
    pointer("pointerup", at.text);
    close(at);

    pointer("pointerdown", at.text, { pointerType: "mouse" });
    dragStart(at.text);
    mock.timers.tick(600);
    assert.equal(isOpen(at), false);
    pointer("pointerup", at.text, { pointerType: "mouse" });
});

test("on a handle a drag holds from its press, a slide after the menu opened takes the menu away; elsewhere it stays for an entry", () => {
    const at = scene();

    at.text.setAttribute("data-ui-splitting", "");
    pointer("pointerdown", at.text, { x: 10, y: 10 });
    mock.timers.tick(500);
    assert.equal(isOpen(at), true);
    pointer("pointermove", at.text, { x: 40, y: 10 });
    assert.equal(isOpen(at), false);
    pointer("pointerup", at.text, { x: 40, y: 10 });
    at.text.removeAttribute("data-ui-splitting");

    pointer("pointerdown", at.text, { x: 10, y: 10 });
    mock.timers.tick(500);
    pointer("pointermove", at.entry, { x: 10, y: 60 });
    assert.equal(isOpen(at), true);
    pointer("pointerup", at.entry, { x: 10, y: 60 });
    close(at);
});
