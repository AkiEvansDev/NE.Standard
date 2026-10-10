// A table acting as a grid walks its cells: the cursor stands on a cell, which the table names; Left and Right, Home and End go along
// the row in the order the columns stand, a hidden one left out, with no wrap; Up, Down, the page keys and Ctrl with Home or End move
// between rows in the same column; a detail spanning its row is a line of its own. Enter, F2 and a typed character are offered first to
// a package that edits the cell; then a cell's one control is pressed, F2 goes into the cell, and Enter is the row's.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

/** A click as the browser counts it, the pointer's: its detail is 1. */
class FakeMouseEvent extends FakeEvent {
    public readonly detail = 1;
    public readonly shiftKey = false;
    public readonly ctrlKey = false;
    public readonly metaKey = false;

    public constructor() {
        super("click");
    }
}

installFakeDom({
    MouseEvent: FakeMouseEvent,
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    window: { innerHeight: 1000, addEventListener: () => undefined }
});

const { CellKeyEventName } = await import("../src/addressing/dom-attributes.ts");
const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { giveRowCursor, moveRowCursor, revealDelta, RowPressEventName, takeRowCursor } = await import("../src/interactions/row-cursor.ts");

const RowHeight = 40;
const Columns = 4;

type Modifiers = { readonly ctrlKey?: boolean; readonly shiftKey?: boolean };

function row(key: string, index: number): FakeElement {
    const element = FakeElement.of("ui-table__row", { "data-ui-key": key, role: "row" });

    element.rect = { left: 0, top: index * RowHeight, width: 400, height: RowHeight };

    for (let column = 0; column < Columns; column++)
        element.append(FakeElement.of("ui-table__cell", { role: "gridcell", "data-ui-table-column": String(column) }));

    return element;
}

type Grid = {
    readonly root: FakeElement;
    readonly host: FakeElement;
    readonly rows: FakeElement[];
    /** What the rows raised, in order: `key:event`. */
    readonly raised: string[];
};

/**
 * A grid of `count` rows of four columns, where the viewer moved the last column to the front and hid the third: the cells stand as
 * 3, 0, 1 along the row.
 */
function grid(count: number, selection: string | null = null): Grid {
    const rows = Array.from({ length: count }, (_, index) => row(`r${index}`, index));
    const host = FakeElement.of("ui-table__host", { "data-ui-items-host": "", role: "rowgroup" }).append(...rows);
    const root = FakeElement.of("ui-table", { tabindex: "0", role: "grid", "data-ui-table-hidden": "2", ...(selection === null ? {} : { "data-ui-selection": selection }) })
        .append(FakeElement.of("ui-table__scroll").append(host));
    const raised: string[] = [];

    for (const [index, place] of [[0, 1], [1, 2], [2, 3], [3, 0]])
        (root.style.setProperty as (name: string, value: string) => void)(`--ui-table-order-${index}`, String(place));

    host.rect = { left: 0, top: 0, width: 400, height: 3 * RowHeight };

    for (const element of rows) {
        for (const name of [RowPressEventName, "open"])
            element.addEventListener(name, () => raised.push(`${element.getAttribute("data-ui-key") ?? ""}:${name}`));
    }

    // A page of its own, which this grid's engine listens on: an engine an earlier test left on the body hears nothing of it.
    const page = FakeElement.of("page").append(root);

    fakeDocument.body.replaceChildren(page);
    new ItemsSelectionEngine({ root: real<ParentNode>(page) });
    // Focused from the keyboard: the cursor arrives on the first row, in its first column.
    root.focus();

    return { root, host, rows, raised };
}

function press(target: FakeElement, key: string, modifiers: Modifiers = {}): FakeKeyboardEvent {
    const domEvent = Object.assign(new FakeKeyboardEvent(key, target), modifiers);

    target.dispatchEvent(domEvent);

    return domEvent;
}

/** Where the cursor stands: the row's key and the cell's column, as the table names it. */
function cursorOf(root: FakeElement): string {
    const cell = root.querySelector("[data-ui-cell-focus]");
    const row = root.querySelector("[data-ui-row-focus]");

    assert.equal(root.getAttribute("aria-activedescendant"), cell?.id, "the table names the cursor's cell");

    return `${row?.getAttribute("data-ui-key") ?? "-"}/${cell?.getAttribute("data-ui-table-column") ?? "-"}`;
}

test("Left, Right, Home and End walk the row's cells as the columns stand, a hidden one left out, and stop at the ends", () => {
    const { root } = grid(3);

    assert.equal(cursorOf(root), "r0/3");

    assert.equal(press(root, "ArrowRight").defaultPrevented, true);
    assert.equal(cursorOf(root), "r0/0");
    press(root, "ArrowRight");
    assert.equal(cursorOf(root), "r0/1");

    // The row's end: the key is spent, and nothing wraps to the next row.
    assert.equal(press(root, "ArrowRight").defaultPrevented, true);
    assert.equal(cursorOf(root), "r0/1");

    press(root, "Home");
    assert.equal(cursorOf(root), "r0/3");
    assert.equal(press(root, "ArrowLeft").defaultPrevented, true);
    assert.equal(cursorOf(root), "r0/3");

    press(root, "End");
    assert.equal(cursorOf(root), "r0/1");
});

test("Up, Down, the page keys and Ctrl with Home or End move between rows in the column the cursor stands in", () => {
    const { root } = grid(8);

    press(root, "ArrowRight");
    press(root, "ArrowDown");
    assert.equal(cursorOf(root), "r1/0");

    press(root, "PageDown");
    assert.equal(cursorOf(root), "r3/0");

    assert.equal(press(root, "End", { ctrlKey: true }).defaultPrevented, true);
    assert.equal(cursorOf(root), "r7/0");

    press(root, "Home", { ctrlKey: true });
    assert.equal(cursorOf(root), "r0/0");
});

test("Shift with Down extends the choice by rows, keeping the column", () => {
    const { root, rows } = grid(3, "many");

    press(root, "ArrowRight");
    press(root, "ArrowDown", { shiftKey: true });

    assert.equal(cursorOf(root), "r1/0");
    assert.ok(rows[0].hasAttribute("data-ui-selected") && rows[1].hasAttribute("data-ui-selected"));
});

test("a detail spanning its row is a line of the walk: Down from the row lands on it, Up from the row below comes back to it", () => {
    const { root, rows } = grid(3);
    const detail = FakeElement.of("ui-data-grid__detail", { role: "gridcell", "aria-colspan": "4" });

    rows[0].append(detail);

    press(root, "ArrowRight");
    press(root, "ArrowDown");
    assert.ok(detail.hasAttribute("data-ui-cell-focus"));
    assert.equal(root.getAttribute("aria-activedescendant"), detail.id);

    // Left and Right have nowhere to go on a cell spanning the row.
    press(root, "ArrowRight");
    assert.ok(detail.hasAttribute("data-ui-cell-focus"));

    press(root, "ArrowDown");
    assert.equal(cursorOf(root), "r1/0");

    press(root, "ArrowUp");
    assert.ok(detail.hasAttribute("data-ui-cell-focus"));

    press(root, "ArrowUp");
    assert.equal(cursorOf(root), "r0/0");
});

test("Enter, F2 and a typed character are offered to a package first: one that takes the key is the only one to act", () => {
    const { root, raised } = grid(2);
    const offered: string[] = [];

    root.addEventListener(CellKeyEventName, domEvent => {
        const { key, cell } = real<CustomEvent<{ key: string; cell: FakeElement }>>(domEvent).detail;

        offered.push(`${key}@${cell.getAttribute("data-ui-table-column") ?? ""}`);
        domEvent.preventDefault();
    });

    press(root, "ArrowDown");
    press(root, "Enter");
    press(root, "F2");

    // A typed character's own default is left for the package, so the character lands in the field it focuses.
    assert.equal(press(root, "7").defaultPrevented, false);

    assert.deepEqual(offered, ["Enter@3", "F2@3", "7@3"]);
    assert.deepEqual(raised, []);
});

test("untaken, Enter is the row's; Enter and Space press a cell's one control; F2 goes into a cell's field", () => {
    const { root, rows, raised } = grid(2);
    const button = new FakeElement("button");
    const field = new FakeInput();
    let pressed = 0;

    button.addEventListener("click", () => pressed++);
    rows[0].children[3].append(button);
    rows[0].children[0].append(field);

    press(root, "Enter");
    press(root, " ");
    assert.equal(pressed, 2);
    assert.deepEqual(raised, []);

    press(root, "ArrowRight");
    press(root, "Enter");
    assert.deepEqual(raised, [`r0:${RowPressEventName}`, "r0:open"]);

    // A character no package takes types nothing, and leaves the cursor where it stood.
    assert.equal(press(root, "x").defaultPrevented, false);

    press(root, "F2");
    assert.equal(fakeDocument.activeElement, field);
});

test("a click puts the cursor on the cell pressed", () => {
    const { root, rows } = grid(3);

    rows[2].children[1].dispatchEvent(new FakeMouseEvent());

    assert.equal(cursorOf(root), "r2/1");
});

test("a row drawn anew, and a package's move, keep the column the cursor stood in", () => {
    const { root, host, rows } = grid(3);

    press(root, "ArrowRight");
    press(root, "ArrowDown");

    const held = takeRowCursor(real<Element>(rows[1]));
    const redrawn = row("r1", 1);

    host.children.splice(1, 1, redrawn);
    redrawn.parent = host;
    giveRowCursor(real<Element>(host), real<Element>(redrawn), held);

    assert.equal(cursorOf(root), "r1/0");

    moveRowCursor(real<Element>(rows[2]));
    assert.equal(cursorOf(root), "r2/0");

    moveRowCursor(real<Element>(rows[0]), real<Element>(rows[0].children[1]));
    assert.equal(cursorOf(root), "r0/1");
});

test("Up from the first row goes to the caption of the cursor's column, and Down from a caption to that caption's column", () => {
    const { root, host } = grid(2);
    const captions = [0, 1, 2, 3].map(column => {
        const caption = FakeElement.of("ui-table__header-cell", { role: "columnheader", tabindex: "0", "data-ui-table-column": String(column) });

        caption.rect = { left: [1, 2, 3, 0][column] * 100, top: -RowHeight, width: 100, height: RowHeight };

        return caption;
    });

    host.parent?.prepend(FakeElement.of("ui-table__header", { role: "row" }).append(...captions));
    press(root, "ArrowRight");
    press(root, "ArrowUp");
    assert.equal(fakeDocument.activeElement, captions[0]);

    press(captions[0], "ArrowRight");
    assert.equal(fakeDocument.activeElement, captions[1]);

    press(captions[1], "ArrowDown");
    assert.equal(fakeDocument.activeElement, root);
    assert.equal(cursorOf(root), "r0/1");
});

test("a cell past a wide grid's edge scrolls in by what it lacks, its start first, clear of the pinned cells; one inside scrolls nothing", () => {
    // A box from 100 to 500, its pinned cells ending at 220.
    assert.equal(revealDelta(560, 700, 220, 500), 200);
    assert.equal(revealDelta(150, 270, 220, 500), -70);
    assert.equal(revealDelta(300, 400, 220, 500), 0);
    // Wider than the room: its start at the pinned edge, not its end at the box's.
    assert.equal(revealDelta(400, 800, 220, 500), 180);
});

test("a table that is only read walks its rows: no cell is marked, and Home and End reach the first and last row", () => {
    const { root } = grid(3);

    root.setAttribute("role", "table");
    press(root, "ArrowDown");
    press(root, "End");

    assert.equal(root.querySelector("[data-ui-cell-focus]"), null);
    assert.equal(root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key"), "r2");
    assert.equal(root.getAttribute("aria-activedescendant"), root.querySelector("[data-ui-row-focus]")?.id);
});
