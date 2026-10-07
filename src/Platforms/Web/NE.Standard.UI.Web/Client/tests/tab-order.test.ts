// Where a tab just pinned or unpinned stands until the server answers: the pinned tabs kept at the strip's head — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import type { StripTab } from "../src/interactions/tab-order.ts";
import { pinnedBoundary } from "../src/interactions/tab-order.ts";

function tabs(count: number): StripTab[] {
    return Array.from({ length: count }, () => ({ pinned: false }));
}

test("a tab pinned goes right after the last pinned tab", () => {
    const index = pinnedBoundary([
        { pinned: true },
        { pinned: true },
        { pinned: false },
        { pinned: false }
    ]);

    assert.equal(index, 2);
});

test("with nothing pinned, the tab goes first", () => {
    assert.equal(pinnedBoundary(tabs(2)), 0);
});

test("with everything else pinned, the tab goes last", () => {
    assert.equal(pinnedBoundary([{ pinned: true }, { pinned: true }]), 2);
});

test("a tab unpinned lands at the same boundary: the head of the unpinned tabs", () => {
    // The unpinned tab itself is not among the others; the one pinned tab left stays ahead of it.
    assert.equal(pinnedBoundary([{ pinned: true }, { pinned: false }]), 1);
});

test("a pinned tab stranded among unpinned ones still counts: the boundary is after the last one pinned", () => {
    const index = pinnedBoundary([
        { pinned: true },
        { pinned: false },
        { pinned: true },
        { pinned: false }
    ]);

    assert.equal(index, 3);
});

test("a tab alone in its strip has no boundary to move to", () => {
    assert.equal(pinnedBoundary([]), 0);
});
