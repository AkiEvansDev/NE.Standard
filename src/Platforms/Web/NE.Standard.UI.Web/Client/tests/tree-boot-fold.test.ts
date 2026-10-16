// A tree's remembered fold is painted before the runtime's first walk by folder, not by a selector per row: the boot script walks the
// tree's rows once as the parser hands them over, each by its parent's key, and marks a row the viewer's fold shows or hides against the
// authored one, a folder whose node came late before the rows under it. A fold kept in another version, or as the selectors per row of
// the shape before, is ignored rather than misread.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The boot script's storage and its observer, which a test hands the parser's batches to.
const stored = new Map<string, string>();
const observers: ((records: readonly { readonly addedNodes: readonly FakeElement[] }[]) => void)[] = [];

installFakeDom({
    localStorage: {
        get length(): number {
            return stored.size;
        },
        key: (index: number) => [...stored.keys()][index] ?? null,
        getItem: (key: string) => stored.get(key) ?? null
    },
    MutationObserver: class {
        public constructor(callback: (records: readonly { readonly addedNodes: readonly FakeElement[] }[]) => void) {
            observers.push(callback);
        }

        public observe(): void {
        }
    }
});

const { readTreeFold, treeFoldWalk } = await import("../src/rendering/tree-boot-fold.ts");

// The folds the boot script finds as it starts, which it reads once: a tree the viewer opened a folder of; a fold kept with the
// selectors per row of the shape before; one of another version; and a tree whose folder the viewer folded.
stored.set("ne.ui:files:boot", JSON.stringify({
    fold: { fold: { version: 1, open: ["docs"], closed: [] } },
    "fold-hidden": { selector: ".ui-tree__row[data-ui-key=\"notes\"]", attributes: { "data-ui-tree-boot": "hidden" } }
}));
stored.set("ne.ui:old:boot", JSON.stringify({ fold: { fold: { version: 0, open: ["docs"], closed: [] } } }));
stored.set("ne.ui:slow:boot", JSON.stringify({ fold: { fold: { version: 1, open: [], closed: ["docs"] } } }));

await import("../src/boot.ts");

/** Hands the boot script's observer one batch of the parser's, a record per node. */
function handOver(...nodes: FakeElement[]): void {
    for (const observer of observers)
        observer(nodes.map(node => ({ addedNodes: [node] })));
}

/** A folder, open where the author made it so. */
function folder(key: string, open: boolean, parent = ""): FakeElement {
    return FakeElement.of("ui-tree__row", { "data-ui-key": key }).append(FakeElement.of("ui-tree-node", { ...(open ? { "data-ui-tree-expanded": "" } : {}), ...(parent.length > 0 ? { "data-ui-tree-parent": parent } : {}) }));
}

function leaf(key: string, parent: string): FakeElement {
    return FakeElement.of("ui-tree__row", { "data-ui-key": key }).append(FakeElement.of("ui-tree-node", { "data-ui-tree-parent": parent }));
}

function marks(rows: readonly FakeElement[]): Record<string, string | null> {
    return Object.fromEntries(rows.map((row): [string, string | null] => [row.getAttribute("data-ui-key") ?? "", row.getAttribute("data-ui-tree-boot")]));
}

test("the walk marks the rows the viewer's fold shows or hides against the authored one, a row whose node is late waiting for it", () => {
    // docs folded as authored, opened by the viewer; src open as authored, folded by the viewer; lib under src folded as authored.
    const rows = [folder("docs", false), leaf("readme", "docs"), folder("src", true), folder("lib", false, "src"), leaf("util", "lib"), leaf("notes", "")];
    const walk = treeFoldWalk({ version: 1, open: ["docs"], closed: ["src"] });
    const late = FakeElement.of("ui-tree__row", { "data-ui-key": "late" });

    assert.deepEqual(rows.map(row => walk(real<Element>(row))), [true, true, true, true, true, true]);
    assert.deepEqual(marks(rows), { docs: null, readme: "shown", src: null, lib: "hidden", util: null, notes: null });
    assert.equal(walk(real<Element>(late)), false);
});

test("a fold of another version, or of no such shape, is not read", () => {
    assert.equal(readTreeFold({ version: 2, open: ["docs"], closed: [] }), null);
    assert.equal(readTreeFold({ selector: ".ui-tree__row", attributes: { "data-ui-tree-boot": "hidden" } }), null);
    assert.equal(readTreeFold({ version: 1, open: [3], closed: [] }), null);
    assert.deepEqual(readTreeFold({ version: 1, open: ["docs"], closed: [] }), { version: 1, open: ["docs"], closed: [] });
});

test("the boot script paints a named tree's fold as the parser hands its rows over, and leaves an old shape's selectors and another version alone", () => {
    const rows = [folder("docs", false), leaf("readme", "docs"), leaf("notes", "")];
    const others = [folder("docs", false), leaf("readme", "docs")];
    const tree = FakeElement.of("ui-tree", { "data-ui-name": "files" }).append(FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(rows[0]));
    const old = FakeElement.of("ui-tree", { "data-ui-name": "old" }).append(FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(...others));

    fakeDocument.body.replaceChildren(tree, old);

    // The tree and its first row in one batch, the rest in the next.
    handOver(tree, old);
    tree.children[0].append(rows[1], rows[2]);
    handOver(rows[1], rows[2]);

    assert.deepEqual(marks(rows), { docs: null, readme: "shown", notes: null });
    assert.deepEqual(marks(others), { docs: null, readme: null });
});

test("a folder whose node comes in the batch after its row is placed before the rows under it, handed over with that node, are walked", () => {
    // The parser hands over the folder's row before its node, and the node in the next batch with the row under it.
    const docs = FakeElement.of("ui-tree__row", { "data-ui-key": "docs" });
    const readme = leaf("readme", "docs");
    const host = FakeElement.of("ui-tree__host", { "data-ui-items-host": "" }).append(docs);
    const tree = FakeElement.of("ui-tree", { "data-ui-name": "slow" }).append(host);
    const node = FakeElement.of("ui-tree-node", { "data-ui-tree-expanded": "" });

    fakeDocument.body.replaceChildren(tree);
    handOver(tree);
    docs.append(node);
    host.append(readme);
    handOver(node, readme);

    // Open as authored, folded by the viewer: what stands under it is hidden from the first paint.
    assert.deepEqual(marks([docs, readme]), { docs: null, readme: "hidden" });
});
