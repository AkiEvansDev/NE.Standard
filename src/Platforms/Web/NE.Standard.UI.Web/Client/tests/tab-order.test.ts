// A tab's order after a drop or a pin: between its new neighbours, the pinned tabs kept at the strip's head — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import type { StripTab } from "../src/interactions/tab-order.ts";
import { orderBetween, ordersAfterMove, pinnedBoundary } from "../src/interactions/tab-order.ts";

function tabs(...orders: (number | null)[]): StripTab[] {
    return orders.map(order => ({ order, pinned: false }));
}

test("a tab between two takes the midpoint of their orders", () => {
    assert.equal(orderBetween(1, 2), 1.5);
});

test("a tab at either end steps one past its only neighbour", () => {
    assert.equal(orderBetween(null, 3), 2);
    assert.equal(orderBetween(3, null), 4);
});

test("a tab with no neighbour carrying an order takes zero", () => {
    assert.equal(orderBetween(null, null), 0);
});

test("a moved tab alone takes an order between its neighbours", () => {
    assert.deepEqual([...ordersAfterMove(tabs(1, 9, 2), 1)], [[1, 1.5]]);
    assert.deepEqual([...ordersAfterMove(tabs(9, 1, 2), 0)], [[0, 0]]);
    assert.deepEqual([...ordersAfterMove(tabs(1, 2, 0), 2)], [[2, 3]]);
});

test("a tab moved after tabs that carry no order steps before the first that does", () => {
    // The tabs without an order sort ahead of every number, so the moved tab stands after them with any order below the next one's.
    assert.deepEqual([...ordersAfterMove(tabs(null, null, 9, 3), 2)], [[2, 2]]);
});

test("a tab moved to the end of a strip without orders takes one, which sorts it after them", () => {
    assert.deepEqual([...ordersAfterMove(tabs(null, null, null), 2)], [[2, 0]]);
});

test("a tab moved before a tab without an order numbers the whole strip, which no order of its own could keep it ahead of", () => {
    assert.deepEqual([...ordersAfterMove(tabs(null, null, null), 0)], [[0, 0], [1, 1], [2, 2]]);
    assert.deepEqual([...ordersAfterMove(tabs(null, 7, null), 1)], [[0, 0], [1, 1], [2, 2]]);
});

test("a strip numbered afresh leaves a tab already standing at its place's number alone", () => {
    assert.deepEqual([...ordersAfterMove(tabs(0, 5, null), 1)], [[1, 1], [2, 2]]);
});

test("a tab pinned goes right after the last pinned tab", () => {
    const index = pinnedBoundary([
        { order: 1, pinned: true },
        { order: 2, pinned: true },
        { order: 3, pinned: false },
        { order: 5, pinned: false }
    ]);

    assert.equal(index, 2);
});

test("with nothing pinned, the tab goes first", () => {
    assert.equal(pinnedBoundary(tabs(1, 2)), 0);
});

test("with everything else pinned, the tab goes last", () => {
    assert.equal(pinnedBoundary([{ order: 1, pinned: true }, { order: 4, pinned: true }]), 2);
});

test("a tab unpinned lands at the same boundary: the head of the unpinned tabs", () => {
    // The unpinned tab itself is not among the others; the one pinned tab left stays ahead of it.
    assert.equal(pinnedBoundary([{ order: 2, pinned: true }, { order: 3, pinned: false }]), 1);
});

test("a pinned tab stranded among unpinned ones still counts: the boundary is after the last one pinned", () => {
    const index = pinnedBoundary([
        { order: 1, pinned: true },
        { order: 2, pinned: false },
        { order: 3, pinned: true },
        { order: 4, pinned: false }
    ]);

    assert.equal(index, 3);
});

test("a tab pinned in a strip without orders stands first, the rest numbered after it", () => {
    // Three tabs without an order, the third pinned: it goes first, before a tab that carries none.
    const others = tabs(null, null);
    const index = pinnedBoundary(others);
    const strip = [...others.slice(0, index), { order: null, pinned: true }, ...others.slice(index)];

    assert.equal(index, 0);
    assert.deepEqual([...ordersAfterMove(strip, index)], [[0, 0], [1, 1], [2, 2]]);
});

test("a tab alone in its strip has no boundary to move to", () => {
    assert.equal(pinnedBoundary([]), 0);
});
