// compareValues/compareItems: the ordering an items host's client-side sort rules are judged by, over the coercions the
// C# theory covers too (numeric vs numeric, a numeric string vs a number, a non-numeric string, null/undefined, and mixed).

import assert from "node:assert/strict";
import test from "node:test";

import { compareItems, compareValues, getActiveSorts, itemMatchesFilters } from "../src/items/items-filter-sort.ts";
import type { ItemsQuery } from "../src/items/items-filter-sort.ts";
import type { PropertyStateStore } from "../src/state/property-state-store.ts";
import type { WebRenderItemsSortMetadata } from "../src/metadata/metadata-index.ts";

function sort(itemProperty: string, direction: "Ascending" | "Descending" = "Ascending"): WebRenderItemsSortMetadata {
    return { itemProperty, direction, priority: 0, activeOperator: "Equal" };
}

test("two numbers compare by value", () => {
    assert.ok(compareValues(1, 2) < 0);
    assert.ok(compareValues(2, 1) > 0);
    assert.equal(compareValues(2, 2), 0);
});

test("a numeric string against a number compares numerically", () => {
    assert.ok(compareValues("10", 2) > 0);
    assert.ok(compareValues("2", 10) < 0);
    assert.equal(compareValues("5", 5), 0);
});

test("two numeric strings compare numerically, not lexically", () => {
    assert.ok(compareValues("9", "10") < 0);
});

test("a non-numeric string compares by locale text", () => {
    assert.ok(compareValues("apple", "banana") < 0);
    assert.ok(compareValues("banana", "apple") > 0);
    assert.equal(compareValues("apple", "apple"), 0);
});

test("a non-numeric string against a number falls back to text", () => {
    assert.ok(compareValues("abc", 5) !== 0);
});

test("null and undefined both sort before a real value", () => {
    assert.ok(compareValues(null, 1) < 0);
    assert.ok(compareValues(undefined, 1) < 0);
    assert.ok(compareValues(1, null) > 0);
    assert.ok(compareValues(1, undefined) > 0);
});

test("null and undefined are each equal to themselves, and neither counts as after the other", () => {
    assert.equal(compareValues(null, null), 0);
    assert.equal(compareValues(undefined, undefined), 0);
    assert.ok(compareValues(null, undefined) <= 0);
    assert.ok(compareValues(undefined, null) <= 0);
});

test("mixed types that are the same reference or primitive value are equal outright", () => {
    const shared = { id: 1 };

    assert.equal(compareValues(shared, shared), 0);
    assert.equal(compareValues(true, true), 0);
});

test("compareItems reads the sort's item property off both items", () => {
    const left = { title: "Bravo" };
    const right = { title: "Alpha" };

    assert.ok(compareItems(left, right, [sort("Title")]) > 0);
    assert.ok(compareItems(right, left, [sort("Title")]) < 0);
});

test("compareItems flips the sign for a Descending sort", () => {
    const left = { title: "Alpha" };
    const right = { title: "Bravo" };

    assert.ok(compareItems(left, right, [sort("Title", "Descending")]) > 0);
});

test("compareItems falls through to the next sort only when the first ties", () => {
    const left = { group: "A", title: "Bravo" };
    const right = { group: "A", title: "Alpha" };

    assert.ok(compareItems(left, right, [sort("Group"), sort("Title")]) > 0);
});

test("compareItems with no active sorts leaves every pair tied", () => {
    assert.equal(compareItems({ title: "Bravo" }, { title: "Alpha" }, []), 0);
});

const noState = {} as PropertyStateStore;

test("the viewer's query filters beside the authored rules, and with none authored at all", () => {
    const query: ItemsQuery = { filters: [{ itemProperty: "Title", operator: "LikeIgnoreCase", value: "alp" }] };

    assert.equal(itemMatchesFilters(undefined, { title: "Alpha" }, noState, query), true);
    assert.equal(itemMatchesFilters(undefined, { title: "Bravo" }, noState, query), false);
    assert.equal(itemMatchesFilters(undefined, { title: "Bravo" }, noState, null), true);
});

test("the viewer's sorts come before the authored ones", () => {
    const authored = { componentId: 1, filters: [], sorts: [sort("Group")] };
    const active = getActiveSorts(authored, noState, { sorts: [{ itemProperty: "Title", direction: "Descending" }] });

    assert.deepEqual(active.map(entry => [entry.itemProperty, entry.direction]), [["Title", "Descending"], ["Group", "Ascending"]]);
    assert.deepEqual(getActiveSorts(undefined, noState, null), []);
});
