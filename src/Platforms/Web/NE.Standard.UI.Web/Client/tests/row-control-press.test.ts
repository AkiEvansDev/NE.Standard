// A list whose rows are each one control — an emoji panel's tiles, each a button — is one Tab stop: the list, its cursor moved by the
// arrows; Enter and Space on the cursor's row press that row's control, as a listbox of buttons would. A row of several controls, or
// of a field, keeps them as they are. A wrap list's stop is the cursor's tile, its row being display: contents: the tile takes the
// focus, its arrows and Enter the list's, a button or a clickable card alike.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { soleControlOf } = await import("../src/interactions/own-control.ts");
const { SurfacePressEngine } = await import("../src/interactions/surface-press-engine.ts");
const { notePress, noteKey } = await import("../src/interactions/popup-focus.ts");

function tile(key: string, top: number): FakeElement {
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key });

    row.rect = { left: 0, top, width: 40, height: 40 };

    return row.append(FakeElement.of("ui-button", { "data-ui-id": "5", "data-ui-pc": "1" }, "button"));
}

/** A list of the tiles, its root the stop, with the clicks each tile's button raises counted. */
function panel(...rows: FakeElement[]): { readonly root: FakeElement; readonly clicks: string[] } {
    const clicks: string[] = [];
    const root = FakeElement.of("ui-items-view ui-orientation--vertical", { tabindex: "0" }).append(FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(...rows));

    for (const row of rows)
        row.querySelector("button")?.addEventListener("click", () => clicks.push(row.getAttribute("data-ui-key") ?? ""));

    fakeDocument.body.replaceChildren(root);
    new ItemsSelectionEngine({ root: real<ParentNode>(fakeDocument.body) });
    root.focus();

    return { root, clicks };
}

test("a row that is one button is pressed through the list, whose one stop the list is", () => {
    const { root, clicks } = panel(tile("smile", 0), tile("heart", 40));

    assert.deepEqual(root.querySelectorAll("button").map(button => button.getAttribute("tabindex")), ["-1", "-1"]);

    // Focused from the keyboard, the list's cursor stands on its first row already.
    root.dispatchEvent(new FakeKeyboardEvent("Enter", root));
    root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", root));

    const space = new FakeKeyboardEvent(" ", root);

    root.dispatchEvent(space);

    assert.deepEqual(clicks, ["smile", "heart"]);
    assert.equal(space.defaultPrevented, true);
});

test("a list the pointer focused shows no cursor, and its first arrow lights its near end: the first row going down, the last going up", () => {
    // A press focuses the list; the key that follows is noted as the window's listener notes it, ahead of the list.
    const arrive = (): FakeElement => {
        notePress(null);

        const { root } = panel(tile("a", 0), tile("b", 40), tile("c", 80));

        assert.equal(root.querySelector("[data-ui-row-focus]"), null);

        return root;
    };
    const arrow = (root: FakeElement, key: string): string | null => {
        const domEvent = new FakeKeyboardEvent(key, root);

        noteKey(real<Event>(domEvent));
        root.dispatchEvent(domEvent);

        return root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key") ?? null;
    };

    assert.equal(arrow(arrive(), "ArrowDown"), "a");
    assert.equal(arrow(arrive(), "ArrowUp"), "c");
});

test("a row of several controls, or of a field, is not one control", () => {
    const pair = FakeElement.of("ui-items-view__item").append(FakeElement.of("", {}, "button"), FakeElement.of("", {}, "button"));
    const field = FakeElement.of("ui-items-view__item").append(FakeElement.of("", {}, "input"));
    const menu = FakeElement.of("ui-context-menu", { role: "menu" }).append(FakeElement.of("ui-menu-item", {}, "button"));
    const tileWithMenu = FakeElement.of("ui-items-view__item").append(FakeElement.of("", {}, "button"), menu, FakeElement.of("ui-row__grip", { role: "button" }));

    assert.equal(soleControlOf(real<Element>(pair)), null);
    assert.equal(soleControlOf(real<Element>(field)), null);
    assert.equal(soleControlOf(real<Element>(tileWithMenu)), tileWithMenu.children[0]);
});

test("every row's one control is read before any row's is written, so the page is laid out once rather than once a row", () => {
    const log: string[] = [];
    const rows = [tile("a", 0), tile("b", 40), tile("c", 80)];

    for (const row of rows) {
        const button = row.querySelector("button")!;
        const rects = button.getClientRects.bind(button);
        const write = button.setAttribute.bind(button);

        button.getClientRects = (): unknown[] => {
            log.push("read");
            return rects();
        };
        button.setAttribute = (name: string, value: string): void => {
            if (name === "tabindex")
                log.push("write");

            write(name, value);
        };
    }

    panel(...rows);

    assert.deepEqual(log.slice(0, log.indexOf("write")), ["read", "read", "read"]);
});

test("a list's cursor row takes the focus itself, a list naming no active descendant", () => {
    const { root } = panel(tile("a", 0), tile("b", 40));

    root.setAttribute("role", "list");
    root.dispatchEvent(new FakeKeyboardEvent("ArrowDown", root));

    const cursor = root.querySelector("[data-ui-row-focus]");

    assert.equal(cursor?.getAttribute("data-ui-key"), "b");
    assert.equal(fakeDocument.activeElement, cursor);
    assert.equal(root.getAttribute("aria-activedescendant"), null);
});

/**
 * A wrap list as the renderer writes it, its tiles buttons: a row of display: contents, no box of its own, around the template's root,
 * the tiles side by side on one line.
 */
function wrapPanel(keys: readonly string[], drawTile = (id: string): FakeElement => FakeElement.of("ui-button", { "data-ui-id": id, "data-ui-pc": "1" }, "button")): { readonly root: FakeElement; readonly tiles: FakeElement[]; readonly clicks: string[] } {
    const clicks: string[] = [];
    const tiles = keys.map((key, index) => {
        const button = drawTile(`${index + 10}`);

        button.rect = { left: index * 40, top: 0, width: 40, height: 40 };
        button.addEventListener("click", () => clicks.push(key));

        return button;
    });
    const rows = tiles.map((button, index) => {
        const row = FakeElement.of("ui-items-view__item", { role: "listitem", "data-ui-key": keys[index] }).append(button);

        row.laidOut = false;

        return row;
    });
    const root = FakeElement.of("ui-items-view ui-items-view--wrap", { "data-ui-id": "5", role: "list", tabindex: "0" })
        .append(FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" }).append(...rows));

    fakeDocument.body.replaceChildren(root);
    new ItemsSelectionEngine({ root: real<ParentNode>(fakeDocument.body) });
    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    root.focus();

    return { root, tiles, clicks };
}

test("a wrap list's cursor stands on a tile that takes the focus itself, the list's one stop, naming no active descendant", () => {
    const { root, tiles, clicks } = wrapPanel(["a", "b", "c"]);

    // Arrived by Tab: the root hands the focus to the first tile, which alone stays in the Tab order.
    assert.equal(fakeDocument.activeElement, tiles[0]);
    assert.deepEqual(tiles.map(button => button.getAttribute("tabindex")), ["0", "-1", "-1"]);
    assert.equal(root.getAttribute("tabindex"), "-1");

    // The tile is a button, but its arrows are the list's.
    const right = new FakeKeyboardEvent("ArrowRight", tiles[0]);

    tiles[0].dispatchEvent(right);

    assert.equal(right.defaultPrevented, true);
    assert.equal(root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key"), "b");
    assert.equal(fakeDocument.activeElement, tiles[1]);
    assert.deepEqual(tiles.map(button => button.getAttribute("tabindex")), ["-1", "0", "-1"]);
    assert.equal(root.getAttribute("aria-activedescendant"), null);

    // Enter presses the tile as a row's one control, once, the browser's own press of a focused button kept off.
    const enter = new FakeKeyboardEvent("Enter", tiles[1]);

    tiles[1].dispatchEvent(enter);

    assert.deepEqual(clicks, ["b"]);
    assert.equal(enter.defaultPrevented, true);
});

test("a wrap list's tile pressed takes the cursor and the stop; a redraw keeps the stop on the tile", () => {
    const { root, tiles } = wrapPanel(["a", "b"]);

    tiles[1].focus();

    assert.equal(root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key"), "b");
    assert.deepEqual(tiles.map(button => button.getAttribute("tabindex")), ["-1", "0"]);

    // The rows put in again: the stop's tile is not taken out of the Tab order as a row's one control.
    new ItemsSelectionEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.deepEqual(tiles.map(button => button.getAttribute("tabindex")), ["-1", "0"]);
});

test("a wrap list's tile that is a clickable card keeps the stop the cursor gave it as the card's engine reads it again", () => {
    const { tiles } = wrapPanel(["a", "b"], id => FakeElement.of("ui-card ui-surface--clickable", { "data-ui-id": id }).append(FakeElement.of("ui-text")));

    new SurfacePressEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.deepEqual(tiles.map(card => card.getAttribute("role")), ["button", "button"]);
    assert.deepEqual(tiles.map(card => card.getAttribute("tabindex")), ["0", "-1"]);
});
