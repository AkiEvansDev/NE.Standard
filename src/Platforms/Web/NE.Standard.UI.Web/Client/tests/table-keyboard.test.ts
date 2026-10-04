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

const RowHeight = 40;

function row(key: string, index: number): FakeElement {
    const element = FakeElement.of("ui-table__row", { "data-ui-key": key, role: "row" });

    element.rect = { left: 0, top: index * RowHeight, width: 400, height: RowHeight };

    return element.append(FakeElement.of("ui-table__cell", { role: "gridcell" }));
}

function caption(left: number, attributes: Readonly<Record<string, string>> = {}): FakeElement {
    const cell = FakeElement.of("ui-table__header-cell", { role: "columnheader", ...attributes });

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

/** A table of `count` rows under a header whose columns stand in another order than the markup's: a moved column. */
function table(count: number, selection: string | null = null, decorate?: (rows: readonly FakeElement[]) => void): Table {
    const sortsSecond = caption(200, { tabindex: "0", "data-ui-grid-sort": "b" });
    const sortsFirst = caption(0, { tabindex: "0", "data-ui-grid-sort": "a" });
    const plain = caption(100);
    const box = new FakeElement("input");
    const rows = Array.from({ length: count }, (_, index) => row(`r${index}`, index));
    const host = FakeElement.of("ui-table__host", { "data-ui-items-host": "", role: "rowgroup" }).append(...rows);
    const root = FakeElement.of("ui-table", { tabindex: "0", role: "grid", ...(selection === null ? {} : { "data-ui-selection": selection }) }).append(
        FakeElement.of("ui-table__scroll").append(
            FakeElement.of("ui-table__header", { role: "row" }).append(sortsSecond, plain, sortsFirst, caption(300).append(box)),
            host
        )
    );
    const raised: string[] = [];

    host.rect = { left: 0, top: 0, width: 400, height: 3 * RowHeight };
    decorate?.(rows);

    for (const element of rows) {
        for (const name of [RowPressEventName, "open"])
            element.addEventListener(name, () => raised.push(`${element.getAttribute("data-ui-key") ?? ""}:${name}`));
    }

    fakeDocument.body.replaceChildren(root);
    new ItemsSelectionEngine({ root: real<ParentNode>(fakeDocument.body) });
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

test("the arrows, Home, End and Page Up and Page Down walk the rows; the cursor is named on the table, which keeps the focus", () => {
    const { root } = table(8);
    const walk = (key: string): string | null => {
        assert.equal(press(root, key).defaultPrevented, true, key);

        return cursorOf(root);
    };

    assert.equal(walk("ArrowDown"), "r0");
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

    press(root, "ArrowDown");
    press(root, "Enter");

    assert.equal(pressed, 0);
    assert.deepEqual(raised, [`r0:${RowPressEventName}`, "r0:open"]);
});

test("where the table chooses, Space chooses the row and presses nothing, and Enter still chooses before it presses", () => {
    const { root, rows, raised } = table(3, "many");

    press(root, "ArrowDown");
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

    press(root, "ArrowDown");
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

test("a modified arrow on a caption is the caption's own: Ctrl moves the column, Shift sizes it", () => {
    const { root, stops } = table(3);

    press(root, "ArrowDown");
    press(root, "ArrowUp");

    const moved = Object.assign(new FakeKeyboardEvent("ArrowRight", stops[0]), { ctrlKey: true });

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

test("the header's keyboard stop and the keyboard's row are marked only for a focus the keyboard gave", async () => {
    const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
    const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

    assert.match(css, /\.ui-table > \.ui-table__scroll > \.ui-table__header > \.ui-table__header-cell:focus-visible:not\(\[data-ui-pointer-focus\]\) \{\s*box-shadow: inset 0 0 0 100vmax var\(--ui-wash-hover\);/);
    assert.match(css, /\.ui-table:focus:not\(\[data-ui-pointer-focus\]\):not\(\[data-ui-selection="one"\]\) > \.ui-table__scroll > \[data-ui-items-host\] > \.ui-table__row\[data-ui-row-focus\]:not\(\[data-ui-selected\]\)/);
});
