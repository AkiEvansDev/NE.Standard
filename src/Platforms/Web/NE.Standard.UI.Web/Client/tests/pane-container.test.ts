// A pane container's arithmetic apart from the DOM: which pane a layout puts at each place (as UIPaneLayout.Resolve does on the
// server), which place an arrow key goes to, and the slide a pane plays from its old box to its new one.

import assert from "node:assert/strict";
import test from "node:test";
import { installFakeDom } from "./fake-dom.ts";

installFakeDom();

const { nearestToward, resolvePaneLayout, slideFrames } = await import("../src/interactions/pane-container-engine.ts");

const added = ["chat", "tasks", "tree"];

test("a layout puts each named pane at its place, and none puts each where it was added", () => {
    assert.deepEqual(resolvePaneLayout(added, "tree,chat,tasks"), ["tree", "chat", "tasks"]);
    assert.deepEqual(resolvePaneLayout(added, null), added);
    assert.deepEqual(resolvePaneLayout(added, ""), added);
    assert.deepEqual(resolvePaneLayout(added, " tasks , chat ,tree"), ["tasks", "chat", "tree"], "spaces around a name are not part of it");
});

test("a place the layout leaves open takes the first pane it left out, in the order the panes were added", () => {
    assert.deepEqual(resolvePaneLayout(added, "tree,old,chat"), ["tree", "tasks", "chat"], "an unknown name holds its place open");
    assert.deepEqual(resolvePaneLayout(added, "tree,tree,chat"), ["tree", "tasks", "chat"], "a name given twice counts once");
    assert.deepEqual(resolvePaneLayout(added, "tasks"), ["tasks", "chat", "tree"], "a short layout fills the rest");
    assert.deepEqual(resolvePaneLayout(added, "tree,tasks,chat,extra"), ["tree", "tasks", "chat"], "names past the places are passed over");
});

test("an arrow goes to the nearest place on its side, one straight ahead before a nearer one off to the side", () => {
    const from = { x: 100, y: 100 };
    const right = { x: 1, y: 0 };

    assert.equal(nearestToward(from, [{ x: 300, y: 100 }, { x: 160, y: 200 }], right), 0, "two hundred ahead beats sixty ahead and a hundred across");
    assert.equal(nearestToward(from, [{ x: 40, y: 100 }, null], right), null, "nothing lies that way");
    assert.equal(nearestToward(from, [null, { x: 100, y: 300 }], { x: 0, y: 1 }), 1, "a null centre is no candidate");
});

test("a pane slides from its old corner and its old size to its new place's", () => {
    assert.deepEqual(slideFrames({ left: 400, top: 0, width: 200, height: 100 }, { left: 0, top: 0, width: 300, height: 300 }), [
        { transform: "translate(400px, 0px)", width: "200px", height: "100px" },
        { transform: "none", width: "300px", height: "300px" }
    ]);
    assert.equal(slideFrames({ left: 0, top: 0, width: 200, height: 100 }, { left: 0, top: 0, width: 200, height: 100 }), null, "nothing moves, nothing plays");
    assert.equal(slideFrames({ left: 0, top: 0, width: 300, height: 300 }, { left: 0, top: 0, width: 200, height: 100 })?.[0].width, "300px", "a smaller place shrinks the pane under the slide");
});

const { arrangePanes } = await import("../src/interactions/pane-container-engine.ts");

/** A place added at one set of cells for every tier, its pane keeping its size or not. */
function at(name: string, column: number, row: number, columnSpan: number, rowSpan: number, keepsSize = false) {
    return { name, cells: [{ column, row, columnSpan, rowSpan }, null, null, null, null], keepsSize };
}

test("a pane that keeps its size takes its own tracks to the place beside its own, the other taking what is left", () => {
    const places = [at("sheet", 1, 1, 23, 1), at("parameters", 24, 1, 1, 1, true)];
    const swapped = arrangePanes(places, ["parameters", "sheet"], 2, 24, 1, true, true);

    assert.deepEqual(swapped.cells, [{ column: 1, row: 1, columnSpan: 1, rowSpan: 1 }, { column: 2, row: 1, columnSpan: 23, rowSpan: 1 }]);
    assert.deepEqual(swapped.columnOrder, [23, ...Array.from({ length: 23 }, (_, index) => index)]);
    assert.equal(swapped.rowOrder, null);

    const home = arrangePanes(places, ["sheet", "parameters"], 2, 24, 1, true, true);

    assert.deepEqual(home.cells, places.map(place => place.cells[0]));
    assert.equal(home.columnOrder, null, "panes at home order nothing anew");
});

test("with no pane keeping its size, a pane takes the size of the place it lands in, as ever", () => {
    const places = [at("sheet", 1, 1, 23, 1), at("parameters", 24, 1, 1, 1)];
    const swapped = arrangePanes(places, ["parameters", "sheet"], 0, 24, 1, true, true);

    assert.deepEqual(swapped.cells, places.map(place => place.cells[0]));
    assert.equal(swapped.columnOrder, null);
});

test("a pane keeps its size only beside its own place: not across a gap, nor along an axis a splitter sizes", () => {
    const gap = [at("chat", 1, 1, 15, 1), at("tasks", 17, 1, 8, 1, true)];

    assert.equal(arrangePanes(gap, ["tasks", "chat"], 0, 24, 1, true, true).columnOrder, null, "a track between the places");

    const beside = [at("chat", 1, 1, 16, 1), at("tasks", 17, 1, 8, 1, true)];

    assert.equal(arrangePanes(beside, ["tasks", "chat"], 0, 24, 1, false, true).columnOrder, null, "a splitter sizes the columns");
    assert.notEqual(arrangePanes(beside, ["tasks", "chat"], 0, 24, 1, true, true).columnOrder, null);
});

test("a run another place stands in part of, or one a pane from outside it came into, is left as it is", () => {
    const board = [at("a", 1, 1, 12, 1, true), at("b", 13, 1, 12, 1), at("c", 1, 2, 8, 1), at("d", 9, 2, 16, 1)];

    assert.equal(arrangePanes(board, ["b", "a", "c", "d"], 0, 24, 2, true, true).columnOrder, null, "c and d stand in part of the run's tracks");

    const three = [at("a", 1, 1, 8, 1, true), at("b", 9, 1, 16, 1), at("c", 1, 2, 24, 1)];

    assert.equal(arrangePanes(three, ["c", "b", "a"], 0, 24, 2, true, true).columnOrder, null, "c came from another band");
    assert.equal(arrangePanes(three, ["b", "a", "c"], 0, 24, 2, true, true).columnOrder?.[0], 8, "c spans the whole run, which leaves it its width");
});

test("stacked at a narrow tier, a pane carries its rows; side by side at a wide one, its columns", () => {
    const places = [
        { name: "sheet", cells: [{ column: 1, row: 1, columnSpan: 24, rowSpan: 1 }, null, { column: 1, row: 1, columnSpan: 23, rowSpan: 2 }, null, null], keepsSize: false },
        { name: "parameters", cells: [{ column: 1, row: 2, columnSpan: 24, rowSpan: 1 }, null, { column: 24, row: 1, columnSpan: 1, rowSpan: 2 }, null, null], keepsSize: true }
    ];
    const narrow = arrangePanes(places, ["parameters", "sheet"], 0, 24, 2, true, true);
    const wide = arrangePanes(places, ["parameters", "sheet"], 3, 24, 2, true, true);

    assert.deepEqual(narrow.rowOrder, [1, 0]);
    assert.deepEqual(narrow.cells[0], { column: 1, row: 1, columnSpan: 24, rowSpan: 1 });
    assert.equal(narrow.columnOrder, null);
    assert.deepEqual(wide.cells.map(cells => [cells.column, cells.columnSpan]), [[1, 1], [2, 23]], "xl takes md's cells");
    assert.equal(wide.rowOrder, null);
});
