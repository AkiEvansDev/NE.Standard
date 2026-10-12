// A reset and the inserts right after it on one host are one refill, which the page reconciles by key: a controller's Clear() and
// its Adds (an insert per item) included, so a row whose key and item stay is kept rather than dropped and drawn again.

import assert from "node:assert/strict";
import test from "node:test";

import { readCollectionRefill } from "../src/updates/collection-refill.ts";
import type { ServerCollectionItemChange, ServerUIUpdate } from "../src/metadata/metadata-index.ts";

const List = 69;

function change(action: string, items: readonly ServerCollectionItemChange[] = [], component = List, dynamicParameters: readonly unknown[] = []): ServerUIUpdate {
    return { kind: "CollectionChange", action, component: { id: component, dynamicParameters }, items, moves: [] } as unknown as ServerUIUpdate;
}

function service(key: string, index?: number): ServerCollectionItemChange {
    return { index, key, item: { id: key, title: key.toUpperCase() } };
}

function keysOf(items: readonly ServerCollectionItemChange[] | undefined): (string | null | undefined)[] {
    return (items ?? []).map(item => item.key);
}

test("a reset and one insert are the collection whole, taken as it came", () => {
    const insert = [service("provisioner", 0), service("dns", 1)];
    const refill = readCollectionRefill([change("Reset"), change("Insert", insert)], 0);

    assert.equal(refill?.componentId, List);
    assert.equal(refill?.items, insert);
    assert.equal(refill?.length, 2);
});

test("a clear and its adds, an insert per item, are one refill holding every row", () => {
    const updates = [
        change("Reset"),
        change("Insert", [service("provisioner", 0)]),
        change("Insert", [service("status-page", 1)]),
        change("Insert", [service("dns", 2)]),
        change("Insert", [service("metrics", 3)]),
        { kind: "Value", address: { component: { id: 73 }, property: "Description" }, value: "filtered" } as unknown as ServerUIUpdate
    ];
    const refill = readCollectionRefill(updates, 0);

    assert.deepEqual(keysOf(refill?.items), ["provisioner", "status-page", "dns", "metrics"]);
    assert.equal(refill?.length, 5, "the value after it is the set's own update");
});

test("a later insert lands at its index in the rows the inserts before it left, or last with none", () => {
    const refill = readCollectionRefill([
        change("Reset"),
        change("Insert", [service("a", 0), service("c", 1)]),
        change("Insert", [service("b", 1)]),
        change("Insert", [service("d")]),
        change("Insert", [service("first", 0), service("second", 1)])
    ], 0);

    assert.deepEqual(keysOf(refill?.items), ["first", "second", "a", "b", "c", "d"]);
});

test("the refill ends at the first update that is not an insert on its own host", () => {
    const otherHost = readCollectionRefill([change("Reset"), change("Insert", [service("a")]), change("Insert", [service("x")], 70), change("Insert", [service("b")])], 0);
    const otherRow = readCollectionRefill([change("Reset", [], List, ["row-1"]), change("Insert", [service("a")], List, ["row-1"]), change("Insert", [service("b")], List, ["row-2"])], 0);
    const removed = readCollectionRefill([change("Reset"), change("Insert", [service("a")]), change("Remove", [service("a")]), change("Insert", [service("b")])], 0);

    assert.deepEqual(keysOf(otherHost?.items), ["a"]);
    assert.equal(otherHost?.length, 2);
    assert.deepEqual(keysOf(otherRow?.items), ["a"]);
    assert.deepEqual(otherRow?.dynamicParameters, ["row-1"]);
    assert.deepEqual(keysOf(removed?.items), ["a"]);
});

test("a reset no insert follows, or an insert with no reset before it, is no refill", () => {
    assert.equal(readCollectionRefill([change("Reset")], 0), null);
    assert.equal(readCollectionRefill([change("Reset"), change("Remove", [service("a")])], 0), null);
    assert.equal(readCollectionRefill([change("Insert", [service("a")]), change("Insert", [service("b")])], 0), null);
    assert.equal(readCollectionRefill([change("Reset"), change("Insert", [service("a")])], 1), null);
});

test("rows added one at a time with a menu each, sent merged, are one refill of every row, and each menu its own after it", () => {
    const Menu = 70;
    // As the server sends a clear and an Add per row once it merged the row inserts above the menus (#180).
    const merged = [
        change("Reset"),
        change("Insert", [service("r1", 0), service("r2", 1), service("r3", 2)]),
        change("Reset", [], Menu, ["r1"]),
        change("Insert", [service("x", 0), service("y", 1)], Menu, ["r1"]),
        change("Reset", [], Menu, ["r2"]),
        change("Insert", [service("z", 0)], Menu, ["r2"])
    ];
    // The same, unmerged: the refill reads the first row alone and the others are drawn again one by one.
    const interleaved = [
        change("Reset"),
        change("Insert", [service("r1", 0)]),
        change("Reset", [], Menu, ["r1"]),
        change("Insert", [service("x", 0), service("y", 1)], Menu, ["r1"]),
        change("Insert", [service("r2", 1)])
    ];

    const rows = readCollectionRefill(merged, 0);
    const menu = readCollectionRefill(merged, 2);

    assert.deepEqual(keysOf(rows?.items), ["r1", "r2", "r3"]);
    assert.equal(rows?.length, 2);
    assert.deepEqual(menu?.dynamicParameters, ["r1"]);
    assert.deepEqual(keysOf(menu?.items), ["x", "y"]);
    assert.deepEqual(keysOf(readCollectionRefill(merged, 4)?.items), ["z"]);
    assert.deepEqual(keysOf(readCollectionRefill(interleaved, 0)?.items), ["r1"]);
});
