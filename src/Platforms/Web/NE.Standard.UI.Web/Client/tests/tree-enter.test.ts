// Enter on a tree's node is a list row's Enter (issue #92): it chooses where the tree chooses, raises the node's click — the command
// `OnNodeClick` hangs on the row — and then its open. A node is never one control, so its chevron, a button, is not pressed in its place.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    }
});

const { enterRow, pressRow } = await import("../src/interactions/items-selection-engine.ts");
const { RowPressEventName } = await import("../src/interactions/row-cursor.ts");

type Tree = { readonly root: FakeElement; readonly rows: FakeElement[]; readonly folded: () => number; readonly raised: string[] };

/** A tree's rows as the renderer draws them: the row carries the row template's id, its node a chevron that folds it. */
function tree(selection: string | null, ...keys: string[]): Tree {
    let folds = 0;
    const raised: string[] = [];
    const rows = keys.map(key => {
        const chevron = FakeElement.of("ui-tree-node__toggle", { type: "button", tabindex: "-1", "data-ui-event-boundary": "" }, "button");
        const row = FakeElement.of("ui-tree__row", { "data-ui-key": key, "data-ui-id": "7", "aria-expanded": "false" })
            .append(FakeElement.of("ui-tree__node").append(FakeElement.of("ui-tree-node", { "data-ui-id": "8" }).append(chevron)));

        chevron.addEventListener("click", () => folds++);

        for (const name of [RowPressEventName, "open"])
            row.addEventListener(name, () => raised.push(`${key}:${name}`));

        return row;
    });
    const root = FakeElement.of("ui-tree", { tabindex: "0", ...(selection === null ? {} : { "data-ui-selection": selection }) })
        .append(FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(...rows));

    return { root, rows, folded: () => folds, raised };
}

test("Enter on a node chooses it, raises its click and then its open, and folds nothing", () => {
    const { root, rows, folded, raised } = tree("one", "notes", "drafts");

    enterRow(real(root), real(rows), real(rows[1]), null);

    assert.equal(rows[1].hasAttribute("data-ui-selected"), true);
    assert.deepEqual(raised, [`drafts:${RowPressEventName}`, "drafts:open"]);
    assert.equal(folded(), 0);
});

test("in a tree that chooses nothing, Enter still presses and opens, and Space's press raises the click alone", () => {
    const { root, rows, raised } = tree(null, "notes");

    enterRow(real(root), real(rows), real(rows[0]), null);
    pressRow(real(rows[0]), null);

    assert.equal(rows[0].hasAttribute("data-ui-selected"), false);
    assert.deepEqual(raised, [`notes:${RowPressEventName}`, "notes:open", `notes:${RowPressEventName}`]);
});
