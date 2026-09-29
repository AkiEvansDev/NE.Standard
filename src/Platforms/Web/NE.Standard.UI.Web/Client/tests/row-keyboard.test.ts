// The keyboard of a host with rows — which keys are its, how a wrap's arrows move, how a key chooses on a host that chooses by a
// control of its own — and what a select-all takes, over a small stand-in for the DOM that knows classes, attributes, children
// and laid-out boxes, which is all these read.

import assert from "node:assert/strict";
import test from "node:test";

import { resolveRowTarget, rowKeyTarget } from "../src/interactions/row-cursor.ts";
import { chooseRow, choosesOnEnter, ensureAnchor, itemSelection, keyGestureOf, setAnchor } from "../src/interactions/row-selection.ts";

type Box = { readonly left: number; readonly top: number; readonly width: number; readonly height: number };

class FakeElement {
    public readonly children: FakeElement[] = [];
    public readonly attributes = new Map<string, string>();
    public readonly classes: Set<string>;
    public parent: FakeElement | null = null;
    public box: Box | null;

    public constructor(classes: readonly string[] = [], box: Box | null = { left: 0, top: 0, width: 10, height: 10 }) {
        this.classes = new Set(classes);
        this.box = box;
    }

    public get classList(): { contains(name: string): boolean } {
        return { contains: name => this.classes.has(name) };
    }

    public append(...children: FakeElement[]): this {
        for (const child of children) {
            child.parent = this;
            this.children.push(child);
        }

        return this;
    }

    public with(name: string, value = ""): this {
        this.attributes.set(name, value);
        return this;
    }

    public getClientRects(): unknown[] {
        return this.box === null ? [] : [this.box];
    }

    public getBoundingClientRect(): DOMRect {
        const box = this.box ?? { left: 0, top: 0, width: 0, height: 0 };

        return { ...box, x: box.left, y: box.top, right: box.left + box.width, bottom: box.top + box.height, toJSON: () => box };
    }

    public hasAttribute(name: string): boolean {
        return this.attributes.has(name);
    }

    public getAttribute(name: string): string | null {
        return this.attributes.get(name) ?? null;
    }

    public setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
    }

    public removeAttribute(name: string): void {
        this.attributes.delete(name);
    }

    public toggleAttribute(name: string, force: boolean): boolean {
        if (force)
            this.attributes.set(name, "");
        else
            this.attributes.delete(name);

        return force;
    }

    public dispatchEvent(): boolean {
        return true;
    }

    public contains(other: FakeElement | null): boolean {
        for (let node = other; node !== null; node = node.parent) {
            if (node === this)
                return true;
        }

        return false;
    }

    public matches(selectors: string): boolean {
        return selectors.split(",").some(selector => this.matchesCompound(selector.trim()));
    }

    public closest(selectors: string): FakeElement | null {
        return this.matches(selectors) ? this : this.parent?.closest(selectors) ?? null;
    }

    public querySelectorAll(selectors: string): FakeElement[] {
        return this.children.flatMap(child => [...(child.matches(selectors) ? [child] : []), ...child.querySelectorAll(selectors)]);
    }

    public querySelector(selectors: string): FakeElement | null {
        const scoped = /^:scope > (.+)$/.exec(selectors);

        if (scoped !== null)
            return this.children.find(child => child.matches(scoped[1])) ?? null;

        return this.querySelectorAll(selectors)[0] ?? null;
    }

    // A compound of classes and attributes; anything else (a pseudo-class, a combinator) matches nothing here.
    private matchesCompound(selector: string): boolean {
        const parts = selector.match(/\.[\w-]+|\[[\w-]+(?:=(?:'[^']*'|"[^"]*"))?\]/g);

        if (parts === null || parts.join("") !== selector)
            return false;

        return parts.every(part => {
            if (part.startsWith("."))
                return this.classes.has(part.slice(1));

            const [, name, quoted] = /^\[([\w-]+)(?:=(.*))?\]$/.exec(part) ?? [];

            return quoted === undefined ? this.attributes.has(name) : this.attributes.get(name) === quoted.slice(1, -1);
        });
    }
}

// The stand-in is the only element there is, so the selection's `instanceof HTMLElement` reads it as one.
(globalThis as { HTMLElement?: unknown }).HTMLElement = FakeElement;

function real(element: FakeElement): HTMLElement {
    return element as unknown as HTMLElement;
}

function key(name: string): KeyboardEvent {
    return { key: name, shiftKey: name.startsWith("Shift"), ctrlKey: false, metaKey: false } as KeyboardEvent;
}

/** A list with its items host and one row per key; each row carries a cell. */
function list(rootClass: string, keys: readonly string[]): { root: FakeElement; host: FakeElement; rows: FakeElement[] } {
    const root = new FakeElement([rootClass]);
    const host = new FakeElement().with("data-ui-items-host");
    const rows = keys.map(name => new FakeElement(["ui-items-view__item"]).with("data-ui-key", name).append(new FakeElement(["cell"])));

    root.append(host.append(...rows));

    return { root, host, rows };
}

test("a key on the host or in its own row is the row keyboard's", () => {
    const { root, rows } = list("ui-items-view", ["a", "b"]);

    assert.deepEqual(rowKeyTarget(real(root)), { root, row: null });
    assert.deepEqual(rowKeyTarget(real(rows[1].children[0])), { root, row: rows[1] });
});

test("a key on the chrome inside the host is not: a band's search box, a caption, a pager", () => {
    const { root } = list("ui-table", ["a"]);
    const search = new FakeElement(["ui-text-input"]);
    const caption = new FakeElement(["ui-table__header-cell"]);

    root.append(new FakeElement(["band"]).append(search), new FakeElement(["ui-table__header"]).append(caption));

    assert.equal(rowKeyTarget(real(search)), null);
    assert.equal(rowKeyTarget(real(caption)), null);
});

test("a key in a nested host is that host's, and its chrome is nobody's rows", () => {
    const outer = list("ui-table", ["a"]);
    const inner = list("ui-items-view", ["x"]);
    const pager = new FakeElement(["pager"]);

    outer.rows[0].append(inner.root.append(pager));

    assert.deepEqual(rowKeyTarget(real(inner.rows[0].children[0])), { root: inner.root, row: inner.rows[0] });
    assert.deepEqual(rowKeyTarget(real(inner.root)), { root: inner.root, row: null });
    assert.equal(rowKeyTarget(real(pager)), null);
});

test("on a host choosing by a control of its own, Shift adds a range and Enter does not choose", () => {
    const plain = new FakeElement(["ui-table"]);
    const boxes = new FakeElement(["ui-table"]).with("data-ui-no-row-select");

    assert.deepEqual(keyGestureOf(real(plain), key("Shift")), { shift: true, ctrl: false });
    assert.deepEqual(keyGestureOf(real(boxes), key("Shift")), { shift: true, ctrl: true });
    assert.deepEqual(keyGestureOf(real(boxes), key("ArrowDown")), { shift: false, ctrl: false });
    assert.equal(choosesOnEnter(real(plain)), true);
    assert.equal(choosesOnEnter(real(boxes)), false);
});

test("a Shift range from the keyboard keeps what the boxes chose", () => {
    const { root, host, rows } = list("ui-table", ["r0", "r1", "r2", "r3", "r4"]);

    root.with("data-ui-selection", "many").with("data-ui-no-row-select");
    host.with("data-ui-selected-keys", JSON.stringify(["r0"]));
    ensureAnchor(real(root), real(rows[2]));

    chooseRow(real(root), rows.map(real), real(rows[4]), keyGestureOf(real(root), key("Shift")));

    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["r0", "r2", "r3", "r4"]);
});

test("on a host choosing by its boxes, the row a click put the cursor on is where the next Shift range starts", () => {
    const { root, host, rows } = list("ui-table", ["r0", "r1", "r2", "r3", "r4", "r5", "r6"]);

    root.with("data-ui-selection", "many").with("data-ui-no-row-select");

    // A box ticked names its row the anchor; the click that then moves the cursor to r1 moves the anchor with it.
    chooseRow(real(root), rows.map(real), real(rows[5]), { shift: false, ctrl: true });
    setAnchor(real(root), real(rows[1]));
    ensureAnchor(real(root), real(rows[1]));
    chooseRow(real(root), rows.map(real), real(rows[2]), keyGestureOf(real(root), key("Shift")));

    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["r5", "r1", "r2"]);
});

/** Tiles of a wrap: each row is display: contents, laid out as the component it wraps. */
function wrap(boxes: readonly Box[]): FakeElement[] {
    const { rows } = list("ui-items-view", boxes.map((_, index) => `t${index}`));

    return rows.map((row, index) => {
        row.box = null;
        row.children.length = 0;
        row.append(new FakeElement(["tile"], boxes[index]).with("data-ui-id", `t${index}`));

        return row;
    });
}

function tile(left: number, top: number, height = 40): Box {
    return { left, top, width: 40, height };
}

// Three tiles, three tiles, then one under the first; the second line's middle tile is shorter than its neighbours.
const Tiles = [tile(0, 0), tile(50, 0), tile(100, 0), tile(0, 50), tile(50, 50, 20), tile(100, 50), tile(0, 100)];

test("a wrap's Down and Up move to the nearest tile on the next line", () => {
    const rows = wrap(Tiles).map(real);

    assert.equal(resolveRowTarget("ArrowDown", rows, rows[1], "grid"), rows[4]);
    assert.equal(resolveRowTarget("ArrowUp", rows, rows[4], "grid"), rows[1]);
    assert.equal(resolveRowTarget("ArrowDown", rows, rows[2], "grid"), rows[5]);
    assert.equal(resolveRowTarget("ArrowDown", rows, rows[5], "grid"), rows[6]);
    assert.equal(resolveRowTarget("ArrowDown", rows, rows[6], "grid"), null);
    assert.equal(resolveRowTarget("ArrowUp", rows, rows[0], "grid"), null);
});

test("a wrap's Left and Right step along the tiles, which are measured by the component each wraps", () => {
    const rows = wrap(Tiles).map(real);

    assert.equal(resolveRowTarget("ArrowRight", rows, rows[2], "grid"), rows[3]);
    assert.equal(resolveRowTarget("ArrowLeft", rows, rows[3], "grid"), rows[2]);
    assert.equal(resolveRowTarget("ArrowLeft", rows, rows[0], "grid"), null);
    assert.equal(resolveRowTarget("End", rows, rows[0], "grid"), rows[6]);
    assert.equal(resolveRowTarget("ArrowDown", rows, null, "grid"), rows[0]);
});

test("a disabled tile is passed over", () => {
    const fakes = wrap(Tiles);

    fakes[4].classes.add("ui-disabled");

    const rows = fakes.map(real);

    assert.equal(resolveRowTarget("ArrowDown", rows, rows[1], "grid"), rows[3]);
    assert.equal(resolveRowTarget("ArrowRight", rows, rows[3], "grid"), rows[5]);
});

test("a select-all takes neither a disabled row, one that refuses to be chosen, nor one a filter hides", () => {
    const { root, host, rows } = list("ui-table", ["a", "b", "c", "d"]);

    root.with("data-ui-selection", "many");
    rows[1].with("data-ui-unselectable");
    rows[2].classes.add("ui-disabled");
    rows[3].classes.add("ui-hidden");

    itemSelection.setSelected(real(root), rows.map(real), true);

    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["a"]);
});

test("by key, a refusing row is left as it was and a key with no row drawn is taken", () => {
    const { root, host, rows } = list("ui-table", ["a", "b"]);

    root.with("data-ui-selection", "many");
    host.with("data-ui-selected-keys", JSON.stringify(["b"]));
    rows[1].with("data-ui-unselectable");

    itemSelection.setSelectedKeys(real(root), ["a", "b", "z"], false);
    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["b"]);

    itemSelection.setSelectedKeys(real(root), ["a", "z"], true);
    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["b", "a", "z"]);
});
