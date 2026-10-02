// Where a tree takes a dropped node: a folder, marked one or holding children, and not disabled; never a file.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { keyMovePlace, keyMoveTarget, placeMoves, takesDrop } = await import("../src/interactions/tree-drop.ts");

/** A tree row and its node, the row folding (`aria-expanded`, as the walk writes it) where it holds children. */
function row(holdsChildren: boolean, folder: string | null = null): { readonly row: FakeElement; readonly node: FakeElement } {
    const node = FakeElement.of("ui-tree-node", folder === null ? {} : { "data-ui-tree-folder": folder });
    const treeRow = FakeElement.of("ui-tree__row", holdsChildren ? { "aria-expanded": "false" } : {}).append(node);

    return { row: treeRow, node };
}

function takes(target: { readonly row: FakeElement; readonly node: FakeElement }): boolean {
    return takesDrop(real(target.row), real(target.node));
}

test("an unmarked node takes a drop while it holds children, and a file never", () => {
    assert.equal(takes(row(true)), true);
    assert.equal(takes(row(false)), false);
});

test("a node marked a folder takes a drop even while empty, and one marked no folder never", () => {
    assert.equal(takes(row(false, "true")), true);
    assert.equal(takes(row(true, "false")), false);
});

test("a disabled folder takes no drop", () => {
    const folder = row(false, "true");

    folder.row.classes.add("ui-disabled");

    assert.equal(takes(folder), false);
});

// Docs > { Drafts (folder) > { a, b }, Notes (file) }, Pictures (folder), c — in walking order.
const nodes = [
    { key: "docs", parent: "", takesDrop: true },
    { key: "drafts", parent: "docs", takesDrop: true },
    { key: "a", parent: "drafts", takesDrop: false },
    { key: "b", parent: "drafts", takesDrop: false },
    { key: "notes", parent: "docs", takesDrop: false },
    { key: "pictures", parent: "", takesDrop: true },
    { key: "c", parent: "", takesDrop: false }
];

test("Alt+Right puts a node into the folder just above it at its level, past that folder's own nodes", () => {
    assert.equal(keyMoveTarget(nodes, "c", true), "pictures");
    assert.equal(keyMoveTarget(nodes, "notes", true), "drafts");
    assert.equal(keyMoveTarget(nodes, "pictures", true), "docs");
});

test("Alt+Right leaves a node whose node above at its level is a file, or the first of its folder, where it is", () => {
    assert.equal(keyMoveTarget([...nodes, { key: "d", parent: "", takesDrop: false }], "d", true), null);
    assert.equal(keyMoveTarget(nodes, "a", true), null);
    assert.equal(keyMoveTarget(nodes, "docs", true), null);
});

test("Alt+Left takes a node out of its folder into the one around it, the top level's being the tree's own ground", () => {
    assert.equal(keyMoveTarget(nodes, "a", false), "docs");
    assert.equal(keyMoveTarget(nodes, "notes", false), "");
    assert.equal(keyMoveTarget(nodes, "c", false), null);
    assert.equal(keyMoveTarget(nodes, "missing", false), null);
});

test("Alt+Up and Alt+Down move a node past its shown sibling and stop at either end of its folder", () => {
    assert.deepEqual(keyMovePlace(nodes, "b", "up"), { parent: "drafts", before: "a" });
    assert.deepEqual(keyMovePlace(nodes, "a", "down"), { parent: "drafts", before: null });
    assert.deepEqual(keyMovePlace(nodes, "pictures", "up"), { parent: "", before: "docs" });
    assert.deepEqual(keyMovePlace(nodes, "docs", "down"), { parent: "", before: "c" });
    assert.equal(keyMovePlace(nodes, "a", "up"), null);
    assert.equal(keyMovePlace(nodes, "c", "down"), null);

    // A sibling a filter took out is stepped over, though it keeps its place.
    const filtered = nodes.map(node => node.key === "pictures" ? { ...node, shown: false } : node);

    assert.deepEqual(keyMovePlace(filtered, "c", "up"), { parent: "", before: "docs" });
});

test("Alt+Left puts a node right after the folder it left; Alt+Right into the folder above as its last node", () => {
    assert.deepEqual(keyMovePlace(nodes, "a", "out"), { parent: "docs", before: "notes" });
    assert.deepEqual(keyMovePlace(nodes, "notes", "out"), { parent: "", before: "pictures" });
    assert.deepEqual(keyMovePlace(nodes, "c", "in"), { parent: "pictures", before: null });
    assert.equal(keyMovePlace(nodes, "c", "out"), null);
});

test("a key's move is refused where the folder it would land in takes no drop", () => {
    const closed = nodes.map(node => node.key === "drafts" ? { ...node, takesDrop: false } : node);

    assert.equal(keyMovePlace(closed, "b", "up"), null, "inside a folder that takes nothing");
    assert.equal(keyMovePlace(closed, "notes", "in"), null);
    assert.deepEqual(keyMovePlace(closed, "a", "out"), { parent: "docs", before: "notes" });
});

test("each moved node's index is where it lands among its new folder's nodes, the moves applied one after another", () => {
    // Into the top level before Pictures: docs, [c], pictures — then a right after it.
    assert.deepEqual(placeMoves(nodes, ["c"], { parent: "", before: "pictures" }), [1]);
    assert.deepEqual(placeMoves(nodes, ["a", "notes"], { parent: "", before: "pictures" }), [1, 2]);
    // Within its own folder, down past its sibling: the index Move puts it at.
    assert.deepEqual(placeMoves(nodes, ["a"], { parent: "drafts", before: null }), [1]);
    assert.deepEqual(placeMoves(nodes, ["docs"], { parent: "", before: "c" }), [1]);
    // A place named by a moved node is the next one that stays — none here, so the two go last, in order: docs, pictures, c.
    assert.deepEqual(placeMoves(nodes, ["pictures", "c"], { parent: "", before: "pictures" }), [2, 2]);
    // Onto a folder: after its last node.
    assert.deepEqual(placeMoves(nodes, ["c"], { parent: "pictures", before: null }), [0]);
});
