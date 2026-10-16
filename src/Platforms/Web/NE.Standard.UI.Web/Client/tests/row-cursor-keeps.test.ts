// The keyboard's cursor in a host with rows keeps its row through what takes the row away: a virtualized row scrolled out leaves its
// key waiting on the root and takes the cursor back once drawn, unless the cursor moved meanwhile; a filter that hides the cursor's
// row moves it to the nearest row still shown. Only the cursor row's controls are Tab stops, kept in step as the cursor moves and read
// again only for rows put in or taken out, never for a key the arrows chose; Delete raises only a removal the application wired, and
// of a chosen group only for the rows shown; Home and End reach a virtualized host's real ends and a windowed host's. The keyboard
// arriving shows the cursor at once. A removal of the cursor's row moves it to the row that followed, and scrolls there only where the
// reader saw the row removed.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The observers the engine makes, so a test can hand them the records a browser would; `notify` hands each only what it watches.
const observers: { readonly callback: (records: unknown[]) => void; options?: MutationObserverInit }[] = [];

installFakeDom({
    // What a removal measures the cursor's row against, beside the host's own box.
    window: { addEventListener: () => undefined, innerWidth: 1200, innerHeight: 800 },
    MutationObserver: class {
        public readonly callback: (records: unknown[]) => void;
        public options?: MutationObserverInit;

        public constructor(callback: (records: unknown[]) => void) {
            this.callback = callback;
            observers.push(this);
        }

        public observe(_target: unknown, options: MutationObserverInit): void {
            this.options = options;
        }

        public disconnect(): void {
        }
    }
});

const { enterRowCursor, giveRowCursor, keepRowCursorShown, planRowRemoval, restoreWaitingCursor, setRowFocus, takeRowCursor } = await import("../src/interactions/row-cursor.ts");
const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");

function row(key: string, top: number, ...controls: FakeElement[]): FakeElement {
    const element = FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(...controls);

    element.rect = { left: 0, top, width: 200, height: 40 };

    return element;
}

/** A list in a page of its own, which a test's engine listens on: an engine an earlier test left on the body hears nothing of it. */
function list(rows: readonly FakeElement[], rootAttributes: Readonly<Record<string, string>> = {}): { readonly root: FakeElement; readonly host: FakeElement; readonly page: ParentNode } {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(...rows);
    const root = FakeElement.of("ui-items-view ui-orientation--vertical", { tabindex: "0", ...rootAttributes }).append(host);
    const page = FakeElement.of("page").append(root);

    fakeDocument.body.replaceChildren(page);

    return { root, host, page: real<ParentNode>(page) };
}

function cursorKey(root: FakeElement): string | null {
    return root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key") ?? null;
}

test("a row scrolled out leaves its key waiting on the root, and takes the cursor back once drawn again", () => {
    const rows = [row("a", 0), row("b", 40)];
    const { root, host } = list(rows);

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[1]));

    const held = takeRowCursor(real<Element>(rows[1]));

    rows[1].remove();
    giveRowCursor(real<Element>(host), null, held);

    assert.equal(root.getAttribute("data-ui-row-cursor-waits"), "b");

    const back = row("b", 40);

    host.append(back);
    restoreWaitingCursor(real<Element>(host), real<Element>(back));

    assert.equal(back.hasAttribute("data-ui-row-focus"), true);
    assert.equal(root.getAttribute("aria-activedescendant"), back.id);
    assert.equal(root.hasAttribute("data-ui-row-cursor-waits"), false);
});

test("a row coming back after the cursor moved to another row meanwhile takes nothing: the newest cursor wins", () => {
    const rows = [row("a", 0), row("b", 40), row("c", 80)];
    const { root, host } = list(rows);

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[0]));

    const held = takeRowCursor(real<Element>(rows[0]));

    rows[0].remove();
    giveRowCursor(real<Element>(host), null, held);
    // The reader clicks another row, which then scrolls out of view in its turn: no drawn row holds the cursor.
    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows.slice(1)), real<HTMLElement>(rows[2]));
    rows[2].removeAttribute("data-ui-row-focus");

    const back = row("a", 0);

    host.prepend(back);
    restoreWaitingCursor(real<Element>(host), real<Element>(back));

    assert.equal(back.hasAttribute("data-ui-row-focus"), false);
});

test("a filter that hides the cursor's row moves the cursor to the next row shown, else the last one above", () => {
    const rows = [row("a", 0), row("b", 40), row("c", 80), row("d", 120)];
    const { root } = list(rows);

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[1]));
    rows[1].laidOut = false;
    rows[2].laidOut = false;
    keepRowCursorShown(real<HTMLElement>(root), real<HTMLElement[]>(rows));

    assert.equal(cursorKey(root), "d");

    rows[3].laidOut = false;
    keepRowCursorShown(real<HTMLElement>(root), real<HTMLElement[]>(rows));

    assert.equal(cursorKey(root), "a");

    rows[0].laidOut = false;
    keepRowCursorShown(real<HTMLElement>(root), real<HTMLElement[]>(rows));

    assert.equal(cursorKey(root), null);
    assert.equal(root.hasAttribute("aria-activedescendant"), false);
});

test("a removal moves the cursor to the row that followed the one removed, though the caller drops that row from its list first", () => {
    const rows = [row("a", 0), row("b", 40), row("c", 80), row("d", 120)];
    const { root } = list(rows);

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[1]));

    const restore = planRowRemoval(real<HTMLElement>(root), real<HTMLElement[]>(rows), new Set([real<Element>(rows[1])]));

    // As the update processor does: the row off the page and out of the list it passed, before the cursor moves.
    rows[1].remove();
    rows.splice(1, 1);
    restore?.();

    assert.equal(cursorKey(root), "c");
});

test("several rows removed at once move the cursor once, past all of them, else to the last row above", () => {
    const rows = [row("a", 0), row("b", 40), row("c", 80), row("d", 120)];
    const { root } = list(rows);

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[1]));
    remove(root, rows, [rows[1], rows[2]]);

    assert.equal(cursorKey(root), "d");

    remove(root, [rows[0], rows[3]], [rows[3]]);

    assert.equal(cursorKey(root), "a");
});

test("the cursor's row removed out of sight moves the cursor without a scroll; one the reader saw brings its follower into view", () => {
    const rows = [row("a", 0), row("b", 40), row("c", 80), row("d", 120)];
    const { root, host } = list(rows);
    const scrolled: string[] = [];

    // The host shows the rows from 50 to 150: a is above it, as a window's start the server trims.
    host.rect = { left: 0, top: 50, width: 200, height: 100 };

    for (const target of rows)
        target.scrollIntoView = () => scrolled.push(target.getAttribute("data-ui-key") ?? "");

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[0]), null, false);
    remove(root, rows, [rows[0]]);

    assert.equal(cursorKey(root), "b");
    assert.deepEqual(scrolled, []);

    remove(root, rows.slice(1), [rows[1]]);

    assert.equal(cursorKey(root), "c");
    assert.deepEqual(scrolled, ["c"]);
});

/** Removes rows as a collection change does: the cursor planned over the rows as they stand, the rows taken off, then the cursor moved. */
function remove(root: FakeElement, rows: readonly FakeElement[], removed: readonly FakeElement[]): void {
    const restore = planRowRemoval(real<HTMLElement>(root), real<HTMLElement[]>(rows), new Set(real<Element[]>(removed)));

    for (const target of removed)
        target.remove();

    restore?.();
}

test("the list names no row once the cursor's row is taken off the page with none to move to: scrolled out, or the last removed", () => {
    const rows = [row("a", 0), row("b", 40)];
    const { root, host } = list(rows);

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[1]));

    const held = takeRowCursor(real<Element>(rows[1]));

    rows[1].remove();
    giveRowCursor(real<Element>(host), null, held);

    assert.equal(root.hasAttribute("aria-activedescendant"), false);

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>([rows[0]]), real<HTMLElement>(rows[0]));
    remove(root, [rows[0]], [rows[0]]);

    assert.equal(cursorKey(root), null);
    assert.equal(root.hasAttribute("aria-activedescendant"), false);
});

test("only the cursor row's controls are Tab stops, and they follow the cursor", () => {
    const pair = (): FakeElement[] => [FakeElement.of("", {}, "button"), FakeElement.of("", {}, "button")];
    const rows = [row("a", 0, ...pair()), row("b", 40, ...pair())];
    const { root, page } = list(rows);
    const stops = (target: FakeElement): string[] => target.querySelectorAll("button").map(button => String(button.tabIndex));

    observers.length = 0;
    new ItemsSelectionEngine({ root: page });

    assert.deepEqual([...stops(rows[0]), ...stops(rows[1])], ["-1", "-1", "-1", "-1"]);

    // The keyboard's arrival puts the cursor on the first row; the mark's move, as the browser reports it to the engine's observer.
    root.focus();
    for (const observer of observers)
        observer.callback(rows.map(target => ({ target, type: "attributes", attributeName: "data-ui-row-focus" })));

    assert.deepEqual(stops(rows[0]), ["0", "0"]);
    assert.deepEqual(stops(rows[1]), ["-1", "-1"]);

    root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", root));
    for (const observer of observers)
        observer.callback(rows.map(target => ({ target, type: "attributes", attributeName: "data-ui-row-focus" })));

    assert.deepEqual(stops(rows[0]), ["-1", "-1"]);
    assert.deepEqual(stops(rows[1]), ["0", "0"]);
    // Given back as it was: no tabindex of its own.
    assert.equal(rows[1].children[0].hasAttribute("tabindex"), false);
});

type Mutation = { readonly type: string; readonly target: FakeElement; readonly attributeName?: string };

/** Hands each record only to the observers watching its kind, as the browser does: rows put in, or an attribute an observer names. */
function notify(records: readonly Mutation[]): void {
    for (const observer of observers) {
        const options = observer.options;
        const watched = records.filter(record => record.type === "childList"
            ? options?.childList === true
            : options?.attributes === true && (options.attributeFilter?.includes(record.attributeName ?? "") ?? true));

        if (watched.length > 0)
            observer.callback(watched.map(record => ({ addedNodes: [], removedNodes: [], ...record })));
    }
}

test("a key the arrows chose re-marks the rows alone, reading none of their controls again; a row put in is read", () => {
    const rows = Array.from({ length: 40 }, (_, index) => row(`r${index}`, index * 40, FakeElement.of("", {}, "button")));
    const { root, host, page } = list(rows, { "data-ui-selection": "one", "data-ui-selected-key": "r0" });
    const count = { queries: 0 };

    observers.length = 0;
    new ItemsSelectionEngine({ root: page });

    for (const target of rows) {
        const query = target.querySelectorAll.bind(target);

        target.querySelectorAll = (selector: string): FakeElement[] => {
            count.queries++;
            return query(selector);
        };
    }

    root.focus();
    root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", root));
    count.queries = 0;
    notify([{ type: "attributes", target: root, attributeName: "data-ui-selected-key" }]);

    assert.equal(root.getAttribute("data-ui-selected-key"), "r1");
    assert.deepEqual([rows[0], rows[1]].map(target => target.getAttribute("aria-selected")), ["false", "true"]);
    assert.equal(count.queries, 0);

    // A row the source pushed: its one control leaves the Tab order as every row's did, and it is marked as one not chosen.
    const pushed = row("r40", 1600, FakeElement.of("", {}, "button"));

    host.append(pushed);
    notify([{ type: "childList", target: host }]);

    assert.equal(pushed.children[0].tabIndex, -1);
    assert.equal(pushed.getAttribute("aria-selected"), "false");
});

test("a control of a row taking the focus brings the cursor to its row", () => {
    const rows = [row("a", 0, FakeElement.of("", {}, "button"), FakeElement.of("", {}, "button")), row("b", 40, FakeElement.of("", {}, "button"), FakeElement.of("", {}, "button"))];
    const { root, page } = list(rows);

    new ItemsSelectionEngine({ root: page });
    rows[1].children[1].focus();

    assert.equal(cursorKey(root), "b");
});

test("Delete raises a row's removal only where the application wired one; else the key is the page's", () => {
    const removed: string[] = [];
    const rows = [row("a", 0)];

    rows[0].addEventListener("remove", () => removed.push("a"));

    const unwired = list(rows);

    new ItemsSelectionEngine({ root: unwired.page });
    unwired.root.focus();
    unwired.root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", unwired.root));

    const ignored = new FakeKeyboardEvent("Delete", unwired.root);

    unwired.root.dispatchEvent(ignored);

    assert.equal(ignored.defaultPrevented, false);
    assert.deepEqual(removed, []);

    const wired = list(rows, { "data-ui-rows-remove": "" });

    new ItemsSelectionEngine({ root: wired.page });
    wired.root.focus();

    const taken = new FakeKeyboardEvent("Delete", wired.root);

    wired.root.dispatchEvent(taken);

    assert.equal(taken.defaultPrevented, true);
    assert.deepEqual(removed, ["a"]);
});

test("Delete on a chosen group removes the chosen rows shown, never one a filter or a fold hides, as a drag leaves it", () => {
    const removed: string[] = [];
    const rows = [row("a", 0), row("b", 40), row("c", 80)];

    for (const target of rows)
        target.addEventListener("remove", () => removed.push(target.getAttribute("data-ui-key") ?? ""));

    // b is chosen, then filtered out: it stays chosen, out of sight.
    rows[1].laidOut = false;

    const { root, host, page } = list(rows, { "data-ui-rows-remove": "", "data-ui-selection": "many" });

    host.setAttribute("data-ui-selected-keys", JSON.stringify(["a", "b", "c"]));
    new ItemsSelectionEngine({ root: page });
    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[0]));
    root.focus();
    root.dispatchEvent(new FakeKeyboardEvent("Delete", root));

    assert.deepEqual(removed, ["a", "c"]);
});

test("Home and End in a virtualized host reach its collection's ends, drawn on demand", () => {
    const keys = ["a", "b", "c", "d", "e"];
    const { root, host, page } = list([row("b", 0), row("c", 40)], { "data-ui-selection": "none" });
    const revealed: string[] = [];
    // The host's values hold all five; only b and c are drawn. A reveal draws the row asked for in place of the others.
    const rows = {
        shownKeysOf: () => keys,
        rangeKeysOf: () => null,
        reveal: (_host: Element, key: string) => {
            revealed.push(key);
            host.replaceChildren(row(key, 0));

            return null;
        }
    };

    new ItemsSelectionEngine({ root: page, rows });
    root.focus();
    root.dispatchEvent(new FakeKeyboardEvent("End", root));

    assert.deepEqual(revealed, ["e"]);
    assert.equal(cursorKey(root), "e");

    root.dispatchEvent(new FakeKeyboardEvent("Home", root));

    assert.deepEqual(revealed, ["e", "a"]);
    assert.equal(cursorKey(root), "a");
});

test("Shift with End in a virtualized host chooses every row to the collection's end, drawn or not, but one drawn that refuses", () => {
    const keys = ["a", "b", "c", "d", "e"];
    const refusing = row("c", 80);
    const { root, host, page } = list([row("b", 40), refusing], { "data-ui-selection": "many" });
    // The host's values say which rows a range takes; the engine asked for c refusing nothing, but its drawn row refuses.
    const rows = {
        shownKeysOf: () => keys,
        rangeKeysOf: (_host: Element, from: string, to: string) => keys.slice(Math.min(keys.indexOf(from), keys.indexOf(to)), Math.max(keys.indexOf(from), keys.indexOf(to)) + 1),
        reveal: (_host: Element, key: string) => {
            host.append(row(key, 160));

            return null;
        }
    };

    refusing.setAttribute("data-ui-unselectable", "");
    new ItemsSelectionEngine({ root: page, rows });
    root.focus();
    root.dispatchEvent(Object.assign(new FakeKeyboardEvent("End", root), { shiftKey: true }));

    assert.equal(cursorKey(root), "e");
    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["b", "d", "e"]);
});

test("Home in a windowed host whose window starts past its first row scrolls there and lands once the first window is drawn", () => {
    const { root, host, page } = list([row("k20", 0), row("k21", 40)]);

    host.setAttribute("data-ui-host-mode", "windowed");
    host.setAttribute("data-ui-window-offset", "20");
    host.setAttribute("data-ui-window-total", "100");
    host.setAttribute("data-ui-window-more-before", "true");
    host.scrollTop = 800;

    new ItemsSelectionEngine({ root: page });
    root.focus();

    const home = new FakeKeyboardEvent("Home", root);

    root.dispatchEvent(home);

    assert.equal(home.defaultPrevented, true);
    assert.equal(host.scrollTop, 0);
    // The arrival's cursor stays on the drawn row until the first window comes.
    assert.equal(cursorKey(root), "k20");

    // The window read for the scroll arrives: the first rows, nothing before them.
    host.setAttribute("data-ui-window-offset", "0");
    host.setAttribute("data-ui-window-more-before", "false");
    host.replaceChildren(row("k0", 0), row("k1", 40));

    for (const observer of observers)
        observer.callback([{ target: host, type: "childList", addedNodes: [], removedNodes: [] }]);

    assert.equal(cursorKey(root), "k0");
});

test("the keyboard arriving shows the cursor on the chosen row, else the first, and keeps one already placed or waiting", () => {
    const rows = [row("a", 0), row("b", 40), row("c", 80)];
    const { root } = list(rows);

    enterRowCursor(real<HTMLElement>(root), real<HTMLElement[]>(rows));
    assert.equal(cursorKey(root), "a");

    rows[0].removeAttribute("data-ui-row-focus");
    rows[2].setAttribute("data-ui-selected", "");
    enterRowCursor(real<HTMLElement>(root), real<HTMLElement[]>(rows));
    assert.equal(cursorKey(root), "c");

    setRowFocus(real<HTMLElement>(root), real<HTMLElement[]>(rows), real<HTMLElement>(rows[1]));
    enterRowCursor(real<HTMLElement>(root), real<HTMLElement[]>(rows));
    assert.equal(cursorKey(root), "b");

    rows[1].removeAttribute("data-ui-row-focus");
    root.setAttribute("data-ui-row-cursor-waits", "z");
    enterRowCursor(real<HTMLElement>(root), real<HTMLElement[]>(rows));
    assert.equal(cursorKey(root), null);
});
