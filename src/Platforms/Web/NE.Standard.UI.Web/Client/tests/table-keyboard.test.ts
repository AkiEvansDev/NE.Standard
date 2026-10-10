// A table from the keyboard (issue #92): one Tab stop, its rows walked by the arrows, Home and End and Page Up and Page Down, Enter and
// Space raising the row's click; its header a group of its own, reached by Up from the first row, walked by Left and Right in the order
// the columns stand and left by Down. Read off a small stand-in for the DOM and off the compiled stylesheet.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

import { FakeElement, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    window: { innerHeight: 1000, addEventListener: () => undefined }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { RowPressEventName } = await import("../src/interactions/row-cursor.ts");
const { stampRowIndices } = await import("../src/items/table-row-indices.ts");
const { stampColumnIndices } = await import("../src/interactions/table-column-layout.ts");

const RowHeight = 40;

function row(key: string, index: number): FakeElement {
    const element = FakeElement.of("ui-table__row", { "data-ui-key": key, role: "row" });

    element.rect = { left: 0, top: index * RowHeight, width: 400, height: RowHeight };

    return element.append(FakeElement.of("ui-table__cell", { role: "gridcell" }));
}

function caption(column: number, left: number, attributes: Readonly<Record<string, string>> = {}): FakeElement {
    const cell = FakeElement.of("ui-table__header-cell", { role: "columnheader", "data-ui-table-column": String(column), ...attributes });

    cell.rect = { left, top: -RowHeight, width: 100, height: RowHeight };

    return cell;
}

type Table = {
    readonly root: FakeElement;
    readonly host: FakeElement;
    readonly rows: FakeElement[];
    /** The sorting captions in the order the columns stand, the box over the checkboxes last. */
    readonly stops: FakeElement[];
    /** What each row raised, in order: `key:event`. */
    readonly raised: string[];
};

/**
 * A table of `count` rows under a header whose columns stand in another order than the markup's: a moved column. A grid by default,
 * whose rows' one cell stands in no column, so its cursor stands on the row; `role` "table" for one that is only read.
 */
function table(count: number, selection: string | null = null, decorate?: (rows: readonly FakeElement[]) => void, role = "grid"): Table {
    // The viewer moved the third column to the front: the captions stand as 2, 1, 0, 3 along the row.
    const sortsSecond = caption(0, 200, { tabindex: "0", "data-ui-grid-sort": "b" });
    const sortsFirst = caption(2, 0, { tabindex: "0", "data-ui-grid-sort": "a" });
    const plain = caption(1, 100);
    const box = new FakeElement("input");
    const rows = Array.from({ length: count }, (_, index) => row(`r${index}`, index));
    const host = FakeElement.of("ui-table__host", { "data-ui-items-host": "", role: "rowgroup" }).append(...rows);
    const root = FakeElement.of("ui-table", { tabindex: "0", role, ...(selection === null ? {} : { "data-ui-selection": selection }) }).append(
        FakeElement.of("ui-table__scroll").append(
            FakeElement.of("ui-table__header", { role: "row" }).append(sortsSecond, plain, sortsFirst, caption(3, 300).append(box)),
            host
        )
    );
    const raised: string[] = [];

    for (const [index, place] of [[0, 2], [1, 1], [2, 0], [3, 3]])
        (root.style.setProperty as (name: string, value: string) => void)(`--ui-table-order-${index}`, String(place));

    host.rect = { left: 0, top: 0, width: 400, height: 3 * RowHeight };
    decorate?.(rows);

    for (const element of rows) {
        for (const name of [RowPressEventName, "open"])
            element.addEventListener(name, () => raised.push(`${element.getAttribute("data-ui-key") ?? ""}:${name}`));
    }

    fakeDocument.body.replaceChildren(root);
    new ItemsSelectionEngine({ root: real<ParentNode>(fakeDocument.body) });
    // Focused from the keyboard: the cursor arrives on the first row.
    root.focus();

    return { root, host, rows, stops: [sortsFirst, sortsSecond, box], raised };
}

function press(target: FakeElement, key: string): FakeKeyboardEvent {
    const domEvent = new FakeKeyboardEvent(key, target);

    target.dispatchEvent(domEvent);

    return domEvent;
}

function cursorOf(root: FakeElement): string | null {
    return root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key") ?? null;
}

test("the table is the one stop: a sorting caption and a header's box leave the Tab order, and no row is in it", () => {
    const { root, rows, stops } = table(3);

    assert.equal(root.getAttribute("tabindex"), "0");
    assert.deepEqual(stops.map(stop => stop.getAttribute("tabindex")), ["-1", "-1", "-1"]);
    assert.ok(rows.every(element => !element.hasAttribute("tabindex")));
});

test("the table's scrolling boxes are no stops either, and a press past the rows hands the keyboard to the table", () => {
    const { root, host } = table(3);
    const scroll = host.parent;

    assert.equal(host.getAttribute("tabindex"), "-1");
    assert.equal(scroll?.getAttribute("tabindex"), "-1");

    fakeDocument.body.focus();
    host.focus();

    assert.equal(fakeDocument.activeElement, root);
});

test("the arrows, Home, End and Page Up and Page Down walk a read-only table's rows; the cursor is named on the table, which keeps the focus", () => {
    const { root } = table(8, null, undefined, "table");
    const walk = (key: string): string | null => {
        assert.equal(press(root, key).defaultPrevented, true, key);

        return cursorOf(root);
    };

    // Focused from the keyboard, the table shows its cursor on the first row before any key.
    assert.equal(cursorOf(root), "r0");
    assert.equal(walk("ArrowDown"), "r1");
    // A viewport of three rows: the farthest row still within it.
    assert.equal(walk("PageDown"), "r3");
    assert.equal(walk("PageDown"), "r5");
    assert.equal(walk("End"), "r7");
    assert.equal(walk("PageUp"), "r5");
    assert.equal(walk("Home"), "r0");
    assert.equal(fakeDocument.activeElement, root);
    assert.equal(root.getAttribute("aria-activedescendant"), root.querySelector("[data-ui-row-focus]")?.id);
});

test("Enter on the keyboard's row raises its click, then its open; Space raises the click where the table chooses nothing", () => {
    const { root, raised } = table(3);

    press(root, "ArrowDown");
    press(root, "Enter");
    assert.equal(press(root, " ").defaultPrevented, true);

    assert.deepEqual(raised, [`r1:${RowPressEventName}`, "r1:open", `r1:${RowPressEventName}`]);
});

test("a control in a part of the row that answers a press itself (a grid's chevron, its checkbox) is no stop, nor the row Enter presses", () => {
    const chevron = new FakeElement("button");
    const box = new FakeElement("input");
    const { root, raised } = table(2, null, rows => rows[0].append(
        FakeElement.of("ui-table__cell", { "data-ui-no-row-open": "" }).append(chevron),
        FakeElement.of("ui-table__cell", { "data-ui-no-row-open": "" }).append(box)
    ));
    let pressed = 0;

    chevron.addEventListener("click", () => pressed++);

    // Reached by the row's keys, neither is a stop of its own.
    assert.deepEqual([chevron.getAttribute("tabindex"), box.getAttribute("tabindex")], ["-1", "-1"]);

    press(root, "Enter");

    assert.equal(pressed, 0);
    assert.deepEqual(raised, [`r0:${RowPressEventName}`, "r0:open"]);
});

test("where the table chooses, Space chooses the row and presses nothing, and Enter still chooses before it presses", () => {
    const { root, rows, raised } = table(3, "many");

    press(root, " ");

    assert.ok(rows[0].hasAttribute("data-ui-selected"));
    assert.deepEqual(raised, []);

    press(root, "ArrowDown");
    press(root, "Enter");

    assert.ok(rows[1].hasAttribute("data-ui-selected"));
    assert.deepEqual(raised, [`r1:${RowPressEventName}`, "r1:open"]);
});

test("Up from the first row goes to the header, whose stops Left and Right walk as the columns stand; Down goes back to the row", () => {
    const { root, stops } = table(3);

    assert.equal(press(root, "ArrowUp").defaultPrevented, true);
    assert.equal(fakeDocument.activeElement, stops[0]);

    press(stops[0], "ArrowRight");
    assert.equal(fakeDocument.activeElement, stops[1]);

    press(stops[1], "End");
    assert.equal(fakeDocument.activeElement, stops[2]);

    // The ends do not wrap, and the key is the header's all the same.
    assert.equal(press(stops[2], "ArrowRight").defaultPrevented, true);
    assert.equal(fakeDocument.activeElement, stops[2]);

    press(stops[2], "ArrowDown");
    assert.equal(fakeDocument.activeElement, root);
    assert.equal(cursorOf(root), "r0");

    // Back up, to the stop the header was left on.
    press(root, "ArrowUp");
    assert.equal(fakeDocument.activeElement, stops[2]);
});

test("a modified arrow on a caption is the caption's own: Alt moves the column, Shift sizes it", () => {
    const { root, stops } = table(3);

    press(root, "ArrowUp");

    const moved = Object.assign(new FakeKeyboardEvent("ArrowRight", stops[0]), { altKey: true });

    stops[0].dispatchEvent(moved);

    assert.equal(moved.defaultPrevented, false);
    assert.equal(fakeDocument.activeElement, stops[0]);
});

test("a table with no row to stand on still reaches its header by Up", () => {
    const { root, stops } = table(0);

    press(root, "ArrowUp");

    assert.equal(fakeDocument.activeElement, stops[0]);
});

test("a table drawing a window of its rows says where each stands among them all, its header the first", () => {
    const rows = [row("r10", 0), row("r11", 1)];
    const host = FakeElement.of("ui-table__host", { "data-ui-items-host": "" }).append(...rows);
    const header = FakeElement.of("ui-table__header", { role: "row" });
    const footer = FakeElement.of("ui-data-grid__footer", { role: "row" });
    const root = FakeElement.of("ui-table").append(FakeElement.of("ui-table__scroll").append(header, host, footer));

    stampRowIndices(real<Element>(host), rows.map((element, index) => [real<Element>(element), 10 + index] as const), 50);

    assert.equal(root.getAttribute("aria-rowcount"), "52");
    assert.deepEqual([header, ...rows, footer].map(element => element.getAttribute("aria-rowindex")), ["1", "12", "13", "52"]);

    stampRowIndices(real<Element>(host), [], null);
    assert.equal(root.getAttribute("aria-rowcount"), "-1");
});

test("every cell says where its column stands among the ones shown, a moved column its new place, so a reader hears it there", () => {
    const column = (index: number, role: string): FakeElement => FakeElement.of("", { role, "data-ui-table-column": String(index) });
    const captions = [0, 1, 2].map(index => column(index, "columnheader"));
    const resizer = FakeElement.of("ui-table__resizer", { "data-ui-table-column": "0" });

    captions[0].append(resizer);

    const cells = [0, 1, 2].map(index => column(index, "gridcell"));
    const detail = FakeElement.of("", { role: "gridcell", "aria-colspan": "3" });
    const nested = column(0, "gridcell");
    const root = FakeElement.of("ui-table").append(FakeElement.of("ui-table__scroll").append(
        FakeElement.of("ui-table__header", { role: "row" }).append(...captions),
        FakeElement.of("ui-table__host").append(
            FakeElement.of("ui-table__row", { role: "row" }).append(...cells, detail),
            FakeElement.of("ui-table__row", { role: "row" }).append(FakeElement.of("ui-table").append(nested))
        )
    ));

    // The last column moved to the front, the middle one hidden.
    stampColumnIndices(real<Element>(root), [2, 0, 1], new Set([1]), false);

    assert.equal(root.getAttribute("aria-colcount"), "2");
    assert.deepEqual(captions.map(cell => cell.getAttribute("aria-colindex")), ["2", null, "1"]);
    assert.deepEqual(cells.map(cell => cell.getAttribute("aria-colindex")), ["2", null, "1"]);
    assert.equal(resizer.getAttribute("aria-colindex"), null);
    assert.deepEqual([detail.getAttribute("aria-colindex"), detail.getAttribute("aria-colspan")], ["1", "2"]);
    assert.equal(nested.getAttribute("aria-colindex"), null);

    // Shown again: its cells take their place back.
    stampColumnIndices(real<Element>(root), [2, 0, 1], new Set(), false);

    assert.deepEqual(cells.map(cell => cell.getAttribute("aria-colindex")), ["2", "3", "1"]);
    assert.equal(detail.getAttribute("aria-colspan"), "3");
});

test("the header's keyboard stop and the keyboard's row are marked only for a focus the keyboard gave", async () => {
    const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
    const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

    assert.match(css, /\.ui-table > \.ui-table__scroll > \.ui-table__header > \.ui-table__header-cell:focus-visible:not\(\[data-ui-pointer-focus\]\) \{\s*box-shadow: inset 0 0 0 100vmax var\(--ui-wash-hover\);/);
    assert.match(css, /\.ui-table:not\(\[role="grid"\]\):focus:not\(\[data-ui-pointer-focus\]\) > \.ui-table__scroll > \[data-ui-items-host\] > \.ui-table__row\[data-ui-row-focus\]:not\(\[data-ui-selected\]\)/);
    // A grid's row keeps the wash, and its cursor's cell wears the frame.
    assert.match(css, /\.ui-table\[role="grid"\]:focus:not\(\[data-ui-pointer-focus\]\) > \.ui-table__scroll > \[data-ui-items-host\] > \.ui-table__row\[data-ui-row-focus\] > \[data-ui-cell-focus\] \{\s*outline: 2px solid var\(--ui-color-primary-ink\);/);
});
