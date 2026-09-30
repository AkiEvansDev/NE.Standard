// Where a tree takes a dropped node: a folder, marked one or holding children, and not disabled; never a file.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { takesDrop } = await import("../src/interactions/tree-drop.ts");

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
