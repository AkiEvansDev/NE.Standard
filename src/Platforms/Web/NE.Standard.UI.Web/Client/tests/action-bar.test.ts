// An action bar is a quick view of its host's context menu: the entries marked for it as icons, drawn over the host the reader chose
// — pressed, tapped, or reached by the keyboard (on a list, the row its cursor lights) — never on hover, and gone on a press
// elsewhere, Escape, or another host chosen. It stands above its host as a popup does, placed by anchored-popup.ts; a host drawn
// anew in its place keeps it. A press on an icon is the entry's own press after the opening its menu would hear, "more" opens the
// menu itself, and a finger's long press opens the menu with the icons in a row atop it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

function pathOf(target: FakeElement | null): FakeElement[] {
    const path: FakeElement[] = [];

    for (let current = target; current !== null; current = current.parent)
        path.push(current);

    return path;
}

// The context menu engine reads a click's path to know whether it landed in the open menu.
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
        this.button = init.button ?? 2;
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

// The observers the engine leaves on a shown bar's menu and on a chosen row's list, so a test can tell one its target changed.
class FakeObserver {
    public static readonly all: FakeObserver[] = [];
    public readonly callback: () => void;
    public target: unknown = null;
    public connected = false;

    public constructor(callback: () => void) {
        this.callback = callback;
        FakeObserver.all.push(this);
    }

    /** Tells every observer still watching `target` that it changed. */
    public static changed(target: FakeElement): void {
        for (const observer of FakeObserver.all.filter(candidate => candidate.connected && candidate.target === target))
            observer.callback();
    }

    public observe(target: unknown): void {
        this.target = target;
        this.connected = true;
    }

    public disconnect(): void {
        this.connected = false;
    }
}

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    MouseEvent: FakeMouseEvent,
    CustomEvent: FakeCustomEvent,
    MutationObserver: FakeObserver,
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    },
    // What the stylesheet would answer: an inline display or a `hidden` draws nothing, an inline overflow clips, an inline direction
    // turns the page; the closed menu's own state is never asked, and nothing is transformed.
    getComputedStyle: (element: FakeElement) => ({
        display: element.style.display === "none" || element.hasAttribute("hidden") ? "none" : "block",
        visibility: element.visible ? "visible" : "hidden",
        position: "static",
        overflowX: element.style.overflowY ?? "visible",
        overflowY: element.style.overflowY ?? "visible",
        direction: element.style.direction ?? "ltr",
        transform: "none",
        filter: "none",
        perspective: "none",
        getPropertyValue: (name: string) => (element.style.getPropertyValue as (name: string) => string)(name)
    })
});

const { readActionBarEntries } = await import("../src/interactions/action-bar.ts");
const { ActionBarEngine } = await import("../src/interactions/action-bar-engine.ts");
const { ContextMenuEngine } = await import("../src/interactions/context-menu-engine.ts");
const { soleControlOf } = await import("../src/interactions/own-control.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new ContextMenuEngine({ root: real<ParentNode>(fakeDocument.body) });
new ActionBarEngine({ root: real<ParentNode>(fakeDocument.body) });

/** An entry as a menu's text template draws it: the icon part always there, wearing a glyph's class only when it names one. */
function entry(title: string, inBar: boolean, icon: string | null = title.toLowerCase()): FakeElement {
    const content = FakeElement.of("ui-button__content ui-text");
    const glyph = FakeElement.of("ui-text__icon ui-icon", { "data-ui-bind-icon": "7" }, "span");

    if (icon !== null)
        glyph.classes.add(`ui-icon-glyph--${icon}`);

    content.append(glyph);

    const words = FakeElement.of("ui-text__title", {}, "span");

    words.textContent = title;
    content.append(words);

    return FakeElement.of("ui-menu-item ui-button", { role: "menuitem", tabindex: "-1", "data-ui-menu-item-kind": "item", ...(inBar ? { "data-ui-in-action-bar": "" } : {}) }, "a").append(content);
}

type Scene = {
    readonly host: FakeElement;
    readonly text: FakeElement;
    readonly link: FakeElement;
    readonly menu: FakeElement;
    readonly pin: FakeElement;
    readonly edit: FakeElement;
    readonly remove: FakeElement;
    readonly outside: FakeElement;
};

type SceneOptions = { readonly copy?: boolean; readonly hostAttributes?: Readonly<Record<string, string>> };

/** A host, its text and its menu, drawn but not yet on the page. */
function parts(options: SceneOptions = {}): Scene {
    const pin = entry("Pin", true);
    const edit = entry("Edit", true);
    const remove = entry("Delete", true);
    const entries = [pin, edit, remove, ...(options.copy === false ? [] : [entry("Copy text", false)])];
    const menu = FakeElement.of("ui-context-menu", { "data-ui-context-menu": "", role: "menu" }).append(FakeElement.of("ui-menu").append(...entries));
    const link = new FakeElement("a");
    const text = new FakeElement("p").append(link);
    const host = FakeElement.of("ui-stack-panel", { "data-ui-id": "3", "data-ui-context-menu-owner": "", "data-ui-action-bar": "end", ...options.hostAttributes }).append(text, menu);
    const outside = new FakeElement("button");

    return { host, text, link, menu, pin, edit, remove, outside };
}

/** A host on a page of its own, beside a button outside it, nothing chosen: a press on nothing takes the last scene's bar away. */
function scene(options: SceneOptions = {}): Scene {
    const at = parts(options);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(at.outside, at.host);
    fakeDocument.activeElement = fakeDocument.body;
    press(at.outside);

    return at;
}

/** Moves a scene's host into a box of its own on the page. */
function into(box: FakeElement, host: FakeElement): void {
    host.remove();
    box.append(host);
    fakeDocument.body.append(box);
}

/** A press of the pointer as the browser raises it: the press noted first (popup-focus.ts listens on the window), then its event. */
function press(target: FakeElement, pointerType = "mouse", button = 0): void {
    notePress(real(target), pointerType);
    target.dispatchEvent(new FakeMouseEvent("pointerdown", { pointerType, button }));
}

/** A finger's tap: its press, and the lift that makes it one. */
function tap(target: FakeElement): void {
    press(target, "touch");
    target.dispatchEvent(new FakeMouseEvent("pointerup", { pointerType: "touch", button: 0 }));
}

function key(name: string, target: FakeElement | null = fakeDocument.activeElement): void {
    const event = new FakeKeyboardEvent(name, target);

    noteKey(real<Event>(event));
    target?.dispatchEvent(event);
}

function barOf(host: FakeElement): FakeElement | null {
    return host.children.find(child => child.classes.has("ui-action-bar")) ?? null;
}

function buttonsOf(bar: FakeElement | null): FakeElement[] {
    return bar?.children ?? [];
}

function labelsOf(bar: FakeElement | null): string[] {
    return buttonsOf(bar).map(button => button.classes.has("ui-action-bar__more") ? "more" : button.getAttribute("aria-label") ?? button.textContent);
}

test("a press on a host draws its bar beside the host's own content, and a press elsewhere takes it away", () => {
    const at = scene();

    press(at.text);

    const bar = barOf(at.host);

    assert.notEqual(bar, null);
    assert.equal(at.host.children.indexOf(bar!), at.host.children.indexOf(at.menu) - 1);
    assert.equal(bar!.getAttribute("role"), "toolbar");
    assert.equal(bar!.hasAttribute("data-ui-event-boundary"), true);
    assert.equal(bar!.hasAttribute("data-ui-no-row-drag"), true);
    assert.deepEqual(labelsOf(bar), ["Pin", "Edit", "Delete", "more"]);
    // The glyph stands alone: drawn by an icon value's own mark, not hidden as a text part, and no second target of the entry's binding.
    const glyph = buttonsOf(bar)[0].children[0];

    assert.equal(glyph.classes.has("ui-icon-glyph--pin"), true);
    assert.equal(glyph.hasAttribute("data-ui-icon"), true);
    assert.equal(glyph.classes.has("ui-text__icon"), false);
    assert.equal(glyph.hasAttribute("data-ui-bind-icon"), false);

    press(at.outside);

    assert.equal(barOf(at.host), null);
});

test("the pointer resting on a host draws nothing: the bar is never shown on hover", () => {
    const at = scene();

    at.text.dispatchEvent(new FakeMouseEvent("pointerover", { pointerType: "mouse" }));

    assert.equal(barOf(at.host), null);
});

test("the bar stands while its host is chosen: a press again or in the bar keeps it, and Escape takes it away", () => {
    const at = scene();

    press(at.text);
    press(at.link);

    const bar = barOf(at.host);

    assert.notEqual(bar, null);

    press(buttonsOf(bar)[0]);
    assert.equal(barOf(at.host), bar);

    key("Escape", at.link);
    assert.equal(barOf(at.host), null);
});

test("Escape in an open dialog the host is not in is the dialog's, and leaves the bar; in one holding the host it takes the bar away", () => {
    const at = scene();
    const dialog = FakeElement.of("ui-dialog", { "data-ui-dialog": "edit" });
    const field = FakeElement.of("ui-text-input", {}, "input");

    dialog.append(field);
    fakeDocument.body.append(dialog);
    press(at.text);

    const bar = barOf(at.host);

    assert.notEqual(bar, null);

    key("Escape", field);
    assert.equal(barOf(at.host), bar);

    // A dialog shut is no longer the key's owner.
    dialog.setAttribute("hidden", "");
    key("Escape", field);
    assert.equal(barOf(at.host), null);

    dialog.removeAttribute("hidden");
    into(dialog, at.host);
    press(at.text);
    assert.notEqual(barOf(at.host), null);

    key("Escape", at.link);
    assert.equal(barOf(at.host), null);
});

test("a right press elsewhere takes the bar away and chooses nothing; on the chosen host it keeps it", () => {
    const at = scene();

    press(at.text, "mouse", 2);
    assert.equal(barOf(at.host), null, "a right press opens the menu, not the bar");

    press(at.text);
    press(at.text, "mouse", 2);
    assert.notEqual(barOf(at.host), null);

    press(at.outside, "mouse", 2);
    assert.equal(barOf(at.host), null);
});

test("a finger's tap chooses as it lifts; a press that turned into a scroll or a long press chooses nothing", () => {
    const at = scene();

    tap(at.text);
    assert.notEqual(barOf(at.host), null);

    // A finger scrolling the list from elsewhere: the browser takes the pointer, and the bar stays.
    press(at.outside, "touch");
    at.outside.dispatchEvent(new FakeMouseEvent("pointercancel", { pointerType: "touch" }));
    assert.notEqual(barOf(at.host), null);

    tap(at.outside);
    assert.equal(barOf(at.host), null);

    // A long press opens the menu, with the icons atop it, and no bar.
    press(at.text, "touch");
    at.text.dispatchEvent(new FakeMouseEvent("contextmenu"));
    at.text.dispatchEvent(new FakeMouseEvent("pointerup", { pointerType: "touch", button: 0 }));
    assert.equal(barOf(at.host), null);
    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    key("Escape", fakeDocument.documentElement);
});

test("the bar stands above its host as a popup, at the end, the start or the middle the host names, mirrored right to left", () => {
    const at = scene();

    at.host.rect = { left: 100, top: 300, width: 400, height: 60 };
    press(at.text);

    const bar = barOf(at.host)!;

    // A bar of no size measured: it stands its gap above the host's top edge, at its end.
    assert.equal(bar.style.top, "294px");
    assert.equal(bar.style.left, "500px");
    assert.equal(bar.dataset.uiPlacement, "top-end");

    for (const [alignment, direction, placement] of [["start", "ltr", "top-start"], ["center", "ltr", "top"], ["end", "rtl", "top-start"], ["start", "rtl", "top-end"]]) {
        const again = scene({ hostAttributes: { "data-ui-action-bar": alignment } });

        again.host.style.direction = direction;
        again.host.rect = { left: 100, top: 300, width: 400, height: 60 };
        press(again.text);

        assert.equal(barOf(again.host)!.dataset.uiPlacement, placement, `${alignment} ${direction}`);
    }
});

test("a host that sets its own gap has its bar that far above it", () => {
    const at = scene();

    at.host.style["--ui-action-bar-gap"] = "10px";
    at.host.rect = { left: 100, top: 300, width: 400, height: 60 };
    press(at.text);

    assert.equal(barOf(at.host)!.style.top, "290px");
});

test("a host the box around it leaves no room above has its bar under it, inside that box", () => {
    const at = scene();
    const list = FakeElement.of("ui-items-view");

    list.style.overflowY = "auto";
    list.rect = { left: 0, top: 280, width: 600, height: 400 };
    into(list, at.host);
    // The row stands at the list's top edge: the page has room above it, the list has none.
    at.host.rect = { left: 0, top: 290, width: 600, height: 60 };
    press(at.text);

    const bar = barOf(at.host)!;

    bar.rect = { left: 0, top: 0, width: 120, height: 32 };
    // Measured once laid out: the next scroll places it again.
    list.dispatchEvent(new FakeEvent("scroll"));
    fakeDocument.documentElement.dispatchEvent(new FakeEvent("scroll"));

    assert.equal(bar.dataset.uiPlacement, "bottom-end");
    assert.equal(bar.style.top, "356px");
    assert.equal(bar.style.left, "480px");
});

test("a list that does not scroll is no boundary: its first row's bar stands above it while the page has room, not over the next row", () => {
    const at = scene();
    const list = FakeElement.of("ui-items-view__host ui-scroll-x--disabled ui-scroll-y--disabled");

    // `DisableScroll()`: hidden only to clip, scrolling never.
    list.style.overflowY = "hidden";
    list.rect = { left: 0, top: 465, width: 600, height: 221 };
    into(list, at.host);
    at.host.rect = { left: 0, top: 465, width: 600, height: 94 };
    drawnAtSize(() => press(at.text));

    assert.equal(barOf(at.host)!.dataset.uiPlacement, "top-end");
});

test("a container that only clips is no boundary: a host at its top edge has its bar above while the window has room, and one inside a list is measured against the list", () => {
    const at = scene();
    const panel = FakeElement.of("ui-container");

    panel.style.overflowY = "clip";
    panel.rect = { left: 0, top: 280, width: 600, height: 400 };
    into(panel, at.host);
    at.host.rect = { left: 0, top: 290, width: 600, height: 60 };
    drawnAtSize(() => press(at.text));

    assert.equal(barOf(at.host)!.dataset.uiPlacement, "top-end");
    assert.equal(barOf(at.host)!.style.top, "252px");

    // The same panel in a list scrolled to its end, the row at the list's top edge: the list scrolls it into view.
    const again = scene();
    const list = FakeElement.of("ui-items-view");
    const row = FakeElement.of("ui-container");

    list.style.overflowY = "auto";
    list.rect = { left: 0, top: 280, width: 600, height: 400 };
    list.scrollTop = 100;
    row.style.overflowY = "clip";
    row.rect = { left: 0, top: 290, width: 600, height: 60 };
    again.host.remove();
    row.append(again.host);
    into(list, row);
    again.host.rect = { left: 0, top: 290, width: 600, height: 60 };
    drawnAtSize(() => press(again.text));

    assert.equal(list.scrollTop, 72);
});

test("a host chosen at its scrolling box's top edge is scrolled into view by what its bar lacks, and has the bar under it only where the box cannot scroll that far", () => {
    for (const [scrolled, expected, placement] of [[100, 72, "top-end"], [20, 20, "bottom-end"]] as const) {
        const at = scene();
        const list = FakeElement.of("ui-items-view");

        list.style.overflowY = "auto";
        list.rect = { left: 0, top: 280, width: 600, height: 400 };
        list.scrollTop = scrolled;
        into(list, at.host);
        // Ten pixels under the list's top edge: a bar of 32 and its gap of 6 lack 28.
        at.host.rect = { left: 0, top: 290, width: 600, height: 60 };
        drawnAtSize(() => press(at.text));

        assert.equal(list.scrollTop, expected, `scrolled ${scrolled}`);

        // Laid out as the scroll left it: the row lower by what the list scrolled.
        at.host.rect = { left: 0, top: 290 + scrolled - expected, width: 600, height: 60 };
        fakeDocument.documentElement.dispatchEvent(new FakeEvent("scroll"));
        assert.equal(barOf(at.host)!.dataset.uiPlacement, placement, `scrolled ${scrolled}`);
    }
});

test("a host the reader scrolls to the box's top edge keeps its bar where it fits: the box scrolls only on a choice", () => {
    const at = scene();
    const list = FakeElement.of("ui-items-view");

    list.style.overflowY = "auto";
    list.rect = { left: 0, top: 280, width: 600, height: 400 };
    list.scrollTop = 100;
    into(list, at.host);
    at.host.rect = { left: 0, top: 400, width: 600, height: 60 };
    drawnAtSize(() => press(at.text));
    assert.equal(list.scrollTop, 100);

    at.host.rect = { left: 0, top: 290, width: 600, height: 60 };
    fakeDocument.documentElement.dispatchEvent(new FakeEvent("scroll"));
    drawnAtSize(() => press(at.text));

    assert.equal(list.scrollTop, 100);
    assert.equal(barOf(at.host)!.dataset.uiPlacement, "bottom-end");
});

/** Runs a press with every element drawn at a bar's size, as a browser lays out a fixed bar the moment it is drawn. */
function drawnAtSize(run: () => void): void {
    const create = fakeDocument.createElement;

    fakeDocument.createElement = (tagName: string) => {
        const element = create(tagName);

        element.rect = { left: 0, top: 0, width: 120, height: 32 };
        return element;
    };

    try {
        run();
    }
    finally {
        fakeDocument.createElement = create;
    }
}

test("a host the scroll takes wholly out of sight hides its bar, still chosen, until it comes back", () => {
    const at = scene();
    const list = FakeElement.of("ui-items-view");

    list.style.overflowY = "auto";
    list.rect = { left: 0, top: 100, width: 600, height: 400 };
    into(list, at.host);
    at.host.rect = { left: 0, top: 200, width: 600, height: 60 };
    press(at.text);

    const bar = barOf(at.host)!;

    assert.equal(bar.classes.has("ui-action-bar--out"), false);

    at.host.rect = { left: 0, top: 20, width: 600, height: 60 };
    list.dispatchEvent(new FakeEvent("scroll"));
    assert.equal(bar.classes.has("ui-action-bar--out"), true);

    at.host.rect = { left: 0, top: 120, width: 600, height: 60 };
    list.dispatchEvent(new FakeEvent("scroll"));
    assert.equal(bar.classes.has("ui-action-bar--out"), false);
});

test("a drag beginning takes the bar away", () => {
    const at = scene();

    press(at.text);
    at.text.dispatchEvent(new FakeEvent("dragstart"));

    assert.equal(barOf(at.host), null);
});

test("an icon is named by its entry's title alone, with no tooltip: one would be a popup over the bar", () => {
    const at = scene();

    press(at.text);

    for (const button of buttonsOf(barOf(at.host))) {
        assert.ok((button.getAttribute("aria-label") ?? "").length > 0);
        assert.equal(button.hasAttribute("data-ui-tooltip"), false);
    }

    assert.equal(buttonsOf(barOf(at.host))[0].getAttribute("aria-label"), "Pin");
});

test("the keyboard in a host draws its bar, and the keyboard leaving the host takes it away", () => {
    const at = scene();

    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.link.focus();

    assert.notEqual(barOf(at.host), null);

    at.outside.focus();

    assert.equal(barOf(at.host), null);
});

test("a focus the pointer gave chooses nothing by itself: its press did the choosing", () => {
    const at = scene();

    notePress(real(at.link), "mouse");
    at.link.focus();

    assert.equal(barOf(at.host), null);

    key("Shift");
    at.outside.focus();
});

type ListScene = { readonly list: FakeElement; readonly rows: readonly FakeElement[]; readonly hosts: readonly FakeElement[]; readonly texts: readonly FakeElement[] };

function listScene(): ListScene {
    const first = parts();
    const second = parts();
    const rows = [first.host, second.host].map((host, index) => FakeElement.of("ui-items-view__item", { "data-ui-key": `m${index}` }).append(host));
    const list = FakeElement.of("ui-items-view", { tabindex: "0" }).append(...rows);

    rows[0].setAttribute("data-ui-row-focus", "");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(first.outside, list);
    fakeDocument.activeElement = fakeDocument.body;
    press(first.outside);

    return { list, rows, hosts: [first.host, second.host], texts: [first.text, second.text] };
}

/** A row as the list draws it anew for its item: the same key, a new element, the host inside it new too. */
function redrawnRow(key: string): { readonly row: FakeElement; readonly host: FakeElement; readonly text: FakeElement } {
    const again = parts();
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(again.host);

    return { row, host: again.host, text: again.text };
}

test("a list holding the focus draws the bar of the row its cursor lights, and the bar follows the cursor", () => {
    const at = listScene();

    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.list.focus();

    assert.notEqual(barOf(at.hosts[0]), null);
    assert.equal(barOf(at.hosts[1]), null);

    // The list's own engine moves the cursor on the key; the bar is read again after it.
    at.rows[0].removeAttribute("data-ui-row-focus");
    at.rows[1].setAttribute("data-ui-row-focus", "");
    key("ArrowDown");

    assert.equal(barOf(at.hosts[0]), null);
    assert.notEqual(barOf(at.hosts[1]), null);

    // As the selection engine does, in the capture phase: it moves the cursor and takes the arrow, so the page does not scroll.
    const takesKey = (domEvent: FakeEvent): void => {
        at.rows[1].removeAttribute("data-ui-row-focus");
        at.rows[0].setAttribute("data-ui-row-focus", "");
        domEvent.preventDefault();
    };

    at.list.addEventListener("keydown", takesKey);
    key("ArrowUp");
    at.list.removeEventListener("keydown", takesKey);

    assert.notEqual(barOf(at.hosts[0]), null, "a key the list took still moved its cursor");
    assert.equal(barOf(at.hosts[1]), null);
});

test("a press on a row's own edge chooses the host its template draws in it, a press on another row moves the bar there, and one on another component in a row chooses none", () => {
    const at = listScene();

    press(at.rows[1]);
    assert.notEqual(barOf(at.hosts[1]), null);

    press(at.texts[0]);
    assert.notEqual(barOf(at.hosts[0]), null);
    assert.equal(barOf(at.hosts[1]), null);

    // Another component in the row — a day's header standing over the row's message — is no edge of the row's.
    const header = FakeElement.of("ui-surface", { "data-ui-id": "9" });

    at.rows[1].insertBefore(header, at.hosts[1]);
    press(header);
    assert.equal(barOf(at.hosts[0]), null);
    assert.equal(barOf(at.hosts[1]), null);
});

test("Tab from the list goes to the lit row's bar, the arrows walk it, Escape gives the keyboard back, and Escape again takes the bar away", () => {
    const at = listScene();

    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.list.focus();
    key("Tab");

    const buttons = buttonsOf(barOf(at.hosts[0]));

    assert.equal(fakeDocument.activeElement, buttons[0]);
    assert.deepEqual(buttons.map(button => button.getAttribute("tabindex")), ["0", "-1", "-1", "-1"]);

    key("ArrowRight");
    assert.equal(fakeDocument.activeElement, buttons[1]);

    key("End");
    assert.equal(fakeDocument.activeElement, buttons[3]);

    key("ArrowRight");
    assert.equal(fakeDocument.activeElement, buttons[0]);

    key("Escape");
    assert.equal(fakeDocument.activeElement, at.list);
    // Back on the list, the keyboard is still on the row: its bar stays.
    assert.notEqual(barOf(at.hosts[0]), null);

    key("Escape");
    assert.equal(barOf(at.hosts[0]), null);

    // Nothing chosen, Tab leaves the list as it would.
    key("Tab");
    assert.equal(fakeDocument.activeElement, at.list);
});

test("Escape gives the keyboard back elsewhere when what it came from can take the focus no more", () => {
    const at = listScene();

    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.list.focus();
    key("Tab");

    const buttons = buttonsOf(barOf(at.hosts[0]));

    assert.equal(fakeDocument.activeElement, buttons[0]);

    // A root made focusable for one return gives its tab index back as the focus leaves it.
    at.list.removeAttribute("tabindex");
    key("Escape");

    assert.equal(buttons.includes(real(fakeDocument.activeElement)), false, "the keyboard is out of the bar");
    assert.notEqual(fakeDocument.activeElement, fakeDocument.body);
    assert.notEqual(fakeDocument.activeElement, at.list, "not the element that took no focus");
});

test("a row drawn anew keeps its bar: replaced in place, or gone from the window and back; a press elsewhere forgets it", () => {
    const at = listScene();

    press(at.texts[0]);
    assert.notEqual(barOf(at.hosts[0]), null);

    // The list replaces the row with one drawn afresh for the same item.
    const replaced = redrawnRow("m0");

    at.list.insertBefore(replaced.row, at.rows[0]);
    at.rows[0].remove();
    FakeObserver.changed(at.list);

    assert.notEqual(barOf(replaced.host), null);

    // A window scrolled past the row takes it off the page; scrolled back, it is drawn again and its bar with it.
    replaced.row.remove();
    FakeObserver.changed(at.list);

    const back = redrawnRow("m0");

    at.list.insertBefore(back.row, at.rows[1]);
    FakeObserver.changed(at.list);

    assert.notEqual(barOf(back.host), null);

    press(fakeDocument.body);
    back.row.remove();
    FakeObserver.changed(at.list);

    const later = redrawnRow("m0");

    at.list.insertBefore(later.row, at.rows[1]);
    FakeObserver.changed(at.list);

    assert.equal(barOf(later.host), null);
});

test("a package's host keyed for its bar keeps the bar when the package draws it anew", () => {
    const at = scene({ hostAttributes: { "data-ui-action-bar-key": "n1" } });
    const layer = FakeElement.of("ui-graph__nodes");

    into(layer, at.host);
    press(at.text);
    assert.notEqual(barOf(at.host), null);

    const redrawn = parts({ hostAttributes: { "data-ui-action-bar-key": "n1" } });
    const other = parts({ hostAttributes: { "data-ui-action-bar-key": "n2" } });

    layer.replaceChildren(other.host, redrawn.host);
    FakeObserver.changed(layer);

    assert.notEqual(barOf(redrawn.host), null);
    assert.equal(barOf(other.host), null);
});

test("a finger's tap on a part its own press drew anew chooses the part drawn in its place", () => {
    const at = scene({ hostAttributes: { "data-ui-action-bar-key": "n1" } });
    const layer = FakeElement.of("ui-graph__nodes");

    into(layer, at.host);
    press(at.text, "touch");

    // The canvas settles the node it began to drag as the finger lifts, drawing the nodes anew before the lift reaches the page.
    const redrawn = parts({ hostAttributes: { "data-ui-action-bar-key": "n1" } });

    layer.replaceChildren(redrawn.host);
    // The canvas holds the pointer: the lift reaches it, not the part drawn away.
    layer.dispatchEvent(new FakeMouseEvent("pointerup", { pointerType: "touch", button: 0 }));

    assert.notEqual(barOf(redrawn.host), null);
});

test("the chosen host pressed again asks its menu again: kept shut for the press, the bar goes and comes back as the press ends", () => {
    const at = scene();
    let dragging = false;

    at.menu.addEventListener("ui-context-menu-opening", domEvent => {
        if (dragging)
            domEvent.preventDefault();
    });
    press(at.text);
    assert.notEqual(barOf(at.host), null);

    // A canvas starting a drag of the node keeps the bar shut for it.
    dragging = true;
    press(at.text);
    assert.equal(barOf(at.host), null);

    dragging = false;
    at.text.dispatchEvent(new FakeMouseEvent("pointerup", { pointerType: "mouse", button: 0 }));
    assert.notEqual(barOf(at.host), null);
});

test("a press on an icon is its entry's own press, after the opening the menu would hear before it", () => {
    const at = scene();
    const openings: { readonly target: unknown; readonly actionBar?: boolean }[] = [];
    let pressed = 0;

    at.menu.addEventListener("ui-context-menu-opening", domEvent => openings.push((domEvent as FakeCustomEvent).detail as { target: unknown; actionBar?: boolean }));
    at.pin.addEventListener("click", () => pressed++);
    press(at.text);

    // The showing asks as the bar, for the host; nothing is pressed yet.
    assert.deepEqual(openings, [{ target: at.host, actionBar: true }]);

    const pin = buttonsOf(barOf(at.host))[0];

    pin.click();

    assert.equal(pressed, 1);
    assert.deepEqual(openings[1], { target: pin, actionBar: false });
});

test("a finger's press on a bar that came up a double tap ago is held, so a double tap on a host presses nothing on its bar", t => {
    t.mock.timers.enable({ apis: ["Date"], now: 1000 });

    const at = scene();
    let pressed = 0;

    at.pin.addEventListener("click", () => pressed++);
    tap(at.text);

    const pin = buttonsOf(barOf(at.host))[0];

    // The second tap, landing on the icon that came up where the host stood.
    notePress(real(pin), "touch");
    pin.click();

    assert.equal(pressed, 0);

    t.mock.timers.tick(500);
    notePress(real(pin), "touch");
    pin.click();

    assert.equal(pressed, 1);

    // A mouse's press is never held: its bar comes up beside the pointer, not under it.
    press(at.outside);
    press(at.text);
    notePress(real(buttonsOf(barOf(at.host))[0]), "mouse");
    buttonsOf(barOf(at.host))[0].click();

    assert.equal(pressed, 2);
});

test("an entry the press's opening turned off, or an opening kept shut, presses nothing", () => {
    const at = scene();
    let pressed = 0;
    let refuse: "disable" | "cancel" = "disable";

    at.pin.addEventListener("click", () => pressed++);
    at.menu.addEventListener("ui-context-menu-opening", domEvent => {
        const detail = (domEvent as FakeCustomEvent).detail as { readonly actionBar: boolean };

        if (detail.actionBar)
            return;

        if (refuse === "disable")
            at.pin.classes.add("ui-disabled");
        else
            domEvent.preventDefault();
    });
    press(at.text);

    buttonsOf(barOf(at.host))[0].click();
    assert.equal(pressed, 0);

    at.pin.classes.delete("ui-disabled");
    refuse = "cancel";
    buttonsOf(barOf(at.host))[0].click();
    assert.equal(pressed, 0);
});

test("a menu kept shut for the bar draws no bar", () => {
    const at = scene();

    at.menu.addEventListener("ui-context-menu-opening", domEvent => domEvent.preventDefault());
    press(at.text);

    assert.equal(barOf(at.host), null);
});

test("an entry turned off draws its icon turned off, and the keyboard starts on the first live one", () => {
    const at = scene();

    at.pin.classes.add("ui-disabled");
    press(at.text);

    const buttons = buttonsOf(barOf(at.host));

    assert.equal(buttons[0].classes.has("ui-disabled"), true);
    assert.equal(buttons[0].getAttribute("aria-disabled"), "true");
    assert.equal(buttons[1].getAttribute("tabindex"), "0");
});

test("an entry the menu does not show stands in no bar, and an entry with no icon stands as its title", () => {
    const at = scene();

    at.edit.style.display = "none";
    // As an icon value naming nothing leaves it: the part stays, its glyph's class gone.
    at.remove.children[0].children[0].classes.delete("ui-icon-glyph--delete");
    press(at.text);

    const buttons = buttonsOf(barOf(at.host));

    assert.deepEqual(labelsOf(barOf(at.host)), ["Pin", "Delete", "more"]);
    assert.equal(buttons[1].hasAttribute("aria-label"), false);
});

test("more stands only while the menu holds an entry out of the bar, and opens the menu itself under it", () => {
    const all = scene({ copy: false });

    press(all.text);
    assert.deepEqual(labelsOf(barOf(all.host)), ["Pin", "Edit", "Delete"]);

    const at = scene();

    press(at.text);

    const more = buttonsOf(barOf(at.host))[3];

    more.rect = { left: 300, top: 20, width: 28, height: 28 };
    // The bar around it: 2 px of padding and a 1 px border.
    barOf(at.host)!.rect = { left: 207, top: 17, width: 124, height: 34 };
    press(more);
    more.click();

    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    // Under "more" as a menu button's list, the popup gap below the bar rather than the button inside it.
    assert.equal(at.menu.style.left, "300px");
    assert.equal(at.menu.style.top, "55px");
    // Not a long press: no row of icons atop it.
    assert.equal(at.menu.children[0].classes.has("ui-action-bar"), false);

    // A press on the open menu is the menu's, never a press elsewhere.
    press(at.pin);
    assert.notEqual(barOf(at.host), null);

    key("Escape", fakeDocument.documentElement);
    assert.equal(at.menu.classes.has("ui-context-menu--open"), false);
});

test("more over a host asking for the rest opens the menu without the bar's entries, and a caption or rule left with nothing goes too", () => {
    const at = scene({ hostAttributes: { "data-ui-action-bar-rest": "" } });
    const copy = entry("Copy text", false);
    const passive = (kind: string): FakeElement => FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": kind }, "a");
    const list = at.menu.children[0];

    list.children.length = 0;
    list.append(passive("header"), at.pin, at.edit, passive("separator"), copy, passive("separator"), passive("separator"), passive("header"), at.remove);

    press(at.text);

    const more = buttonsOf(barOf(at.host))[3];
    const leftOut = (): FakeElement[] => list.children.filter(child => child.hasAttribute("data-ui-menu-left-out"));

    press(more);
    more.click();

    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    assert.deepEqual(list.children.filter(child => !leftOut().includes(child)), [copy]);

    // A bar drawn meanwhile still shows its three: what the opening left out stands in the menu all the same.
    assert.deepEqual(readActionBarEntries(real(at.menu)).entries, [at.pin, at.edit, at.remove].map(entry => real<HTMLElement>(entry)));

    key("Escape", fakeDocument.documentElement);

    // A right press opens the whole menu.
    at.text.dispatchEvent(new FakeMouseEvent("contextmenu"));
    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    assert.deepEqual(leftOut(), []);
    key("Escape", fakeDocument.documentElement);
});

test("more over a host asking for the rest keeps one rule between the entries left on either side of the bar's", () => {
    const at = scene({ hostAttributes: { "data-ui-action-bar-rest": "" } });
    const copy = entry("Copy text", false);
    const paste = entry("Paste", false);
    const rule = (): FakeElement => FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": "separator" }, "a");
    const [first, second] = [rule(), rule()];
    const list = at.menu.children[0];

    list.children.length = 0;
    list.append(copy, first, second, at.pin, paste);

    press(at.text);

    const more = buttonsOf(barOf(at.host)).at(-1)!;

    press(more);
    more.click();

    assert.deepEqual(list.children.filter(child => !child.hasAttribute("data-ui-menu-left-out")), [copy, first, paste]);
    key("Escape", fakeDocument.documentElement);
});

test("more over a host that does not ask for the rest opens the whole menu", () => {
    const at = scene();

    press(at.text);

    const more = buttonsOf(barOf(at.host))[3];

    press(more);
    more.click();

    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    assert.equal(at.menu.children[0].children.some(child => child.hasAttribute("data-ui-menu-left-out")), false);
    key("Escape", fakeDocument.documentElement);
});

test("the keyboard's more opens the menu over a bar that stays, said open, and Escape brings the keyboard back to more", () => {
    const at = scene();

    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.link.focus();

    const more = buttonsOf(barOf(at.host))[3];

    more.focus();
    more.click();

    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    assert.equal(at.menu.contains(fakeDocument.activeElement), true, "the menu takes the keyboard");
    assert.notEqual(barOf(at.host), null, "the bar stands under the menu its more opened");
    assert.equal(buttonsOf(barOf(at.host))[3].getAttribute("aria-expanded"), "true", "said open");

    key("Escape", fakeDocument.documentElement);
    assert.equal(at.menu.classes.has("ui-context-menu--open"), false);

    // The menu's class went: the observers on it hear so.
    FakeObserver.changed(at.menu);

    const again = buttonsOf(barOf(at.host))[3];

    assert.equal(again.getAttribute("aria-expanded"), "false");
    assert.equal(fakeDocument.activeElement, again);
});

test("a menu standing outside its host gives the keyboard back to its owner as it closes, and the bar stays for more to take it", () => {
    // A canvas's node menu: the canvas owns it, and the node names it.
    const at = parts({ hostAttributes: { "data-ui-context-menu-use": "node" } });

    at.host.attributes.delete("data-ui-context-menu-owner");
    at.menu.remove();
    at.menu.setAttribute("data-ui-context-menu", "node");

    const owner = FakeElement.of("ui-graph", { "data-ui-id": "9", "data-ui-context-menu-owner": "", tabindex: "-1" }).append(at.host, at.menu);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(at.outside, owner);
    fakeDocument.activeElement = fakeDocument.body;
    press(at.outside);
    press(at.text);

    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));

    const more = buttonsOf(barOf(at.host))[3];

    more.focus();
    more.click();
    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);

    // "More" was drawn again under the menu, so the close's return finds the owner around it; then the menu's class goes.
    owner.focus();
    key("Escape", fakeDocument.documentElement);
    FakeObserver.changed(at.menu);

    const again = buttonsOf(barOf(at.host))[3];

    assert.notEqual(again, undefined, "the bar stays");
    assert.equal(fakeDocument.activeElement, again, "and the keyboard goes on to more");
});

test("a host whose menu is refused, or a host turned off, draws no bar", () => {
    for (const hostAttributes of [{ "data-ui-no-context-menu": "" }, { "aria-disabled": "true" }] as Readonly<Record<string, string>>[]) {
        const at = scene({ hostAttributes });

        press(at.text);

        assert.equal(barOf(at.host), null);
    }
});

test("a finger's long press opens the menu with the bar's icons in a row atop it, a press there pressing the entry", () => {
    const at = scene();
    let pressed = 0;

    at.edit.addEventListener("click", () => pressed++);
    notePress(real(at.text), "touch");
    at.text.dispatchEvent(new FakeMouseEvent("contextmenu"));

    const strip = at.menu.children[0];

    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    assert.equal(strip.classes.has("ui-action-bar--strip"), true);
    assert.deepEqual(labelsOf(strip), ["Pin", "Edit", "Delete"]);
    assert.deepEqual(buttonsOf(strip).map(button => button.getAttribute("role")), ["menuitem", "menuitem", "menuitem"]);

    buttonsOf(strip)[1].click();

    assert.equal(pressed, 1);
    assert.equal(at.menu.classes.has("ui-context-menu--open"), false);

    // A mouse's right press opens the menu as it was, the row of icons gone.
    notePress(real(at.text), "mouse");
    at.text.dispatchEvent(new FakeMouseEvent("contextmenu"));

    assert.equal(at.menu.children[0].classes.has("ui-action-bar"), false);
    key("Escape", fakeDocument.documentElement);
});

test("a finger's long press takes away the bar standing, on its host or elsewhere, and nothing is chosen once the menu closes", () => {
    const at = scene();

    tap(at.text);
    assert.notEqual(barOf(at.host), null);

    // On its own host: the menu's row of icons stands for the bar, never the two at once.
    press(at.text, "touch");
    at.text.dispatchEvent(new FakeMouseEvent("contextmenu"));
    at.text.dispatchEvent(new FakeMouseEvent("pointerup", { pointerType: "touch", button: 0 }));

    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    assert.equal(at.menu.children[0].classes.has("ui-action-bar--strip"), true);
    assert.equal(barOf(at.host), null);

    // An entry pressed from the menu: the menu closes, and the message is done with.
    buttonsOf(at.menu.children[0])[0].click();
    assert.equal(at.menu.classes.has("ui-context-menu--open"), false);
    assert.equal(barOf(at.host), null);

    // Elsewhere: the bar goes as it would for a tap there.
    tap(at.text);
    press(at.outside, "touch");
    at.outside.dispatchEvent(new FakeMouseEvent("contextmenu"));
    assert.equal(barOf(at.host), null);
});

test("a mouse's right press on the chosen host keeps its bar over the menu, and a finger's more opens the menu with no second row of icons", t => {
    t.mock.timers.enable({ apis: ["Date"], now: 1000 });

    const at = scene();

    press(at.text);
    press(at.text, "mouse", 2);
    at.text.dispatchEvent(new FakeMouseEvent("contextmenu"));

    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    assert.notEqual(barOf(at.host), null);
    key("Escape", fakeDocument.documentElement);

    tap(at.text);

    const more = buttonsOf(barOf(at.host))[3];

    // Pressed a while after the bar came up: sooner, a finger's press is a double tap's second and held.
    t.mock.timers.tick(500);
    press(more, "touch");
    more.click();

    assert.equal(at.menu.classes.has("ui-context-menu--open"), true);
    assert.equal(at.menu.children[0].classes.has("ui-action-bar"), false);
    assert.notEqual(barOf(at.host), null, "the bar stands under the menu its more opened");
    key("Escape", fakeDocument.documentElement);
});

test("the bar is drawn again as its menu changes, the keyboard kept on the icon of the entry it was on", () => {
    const at = scene();

    press(at.text);
    buttonsOf(barOf(at.host))[1].focus();

    // A push renames an entry and takes another out of the bar.
    at.edit.children[0].children[1].textContent = "Edit again";
    at.pin.removeAttribute("data-ui-in-action-bar");
    FakeObserver.changed(at.menu);

    const buttons = buttonsOf(barOf(at.host));

    assert.deepEqual(labelsOf(barOf(at.host)), ["Edit again", "Delete", "more"]);
    assert.equal(fakeDocument.activeElement, buttons[0]);
});

test("the bar is no control of its row's own: a row that is one button stays that button", () => {
    const at = scene();
    const tile = new FakeElement("button");
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": "r1" }).append(tile);

    at.link.remove();
    into(row, at.host);
    press(at.text);

    assert.notEqual(barOf(at.host), null);
    assert.equal(soleControlOf(real(row)), tile);
});
