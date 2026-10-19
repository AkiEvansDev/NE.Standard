// The collection a host inside an item template shares with every row's copy, held for the rows built after it arrived: a refill
// replaces it, and every later change is applied to it as a host applies it to its rows. A row's own collection for its menu waiting
// to be drawn is held by the rows it stands in, written by a patch to an entry's part, and let go of with its rows.

import assert from "node:assert/strict";
import test from "node:test";

import { HeldCollections } from "../src/items/held-collections.ts";
import type { ServerCollectionChangeUIUpdate, ServerCollectionItemChange } from "../src/metadata/metadata-index.ts";

const Select = 42;

function change(action: string, items: readonly ServerCollectionItemChange[] = [], moves: ServerCollectionChangeUIUpdate["moves"] = []): ServerCollectionChangeUIUpdate {
    return { kind: "CollectionChange", action, component: { id: Select, dynamicParameters: [] }, items, moves } as ServerCollectionChangeUIUpdate;
}

function rowChange(action: string, dynamicParameters: readonly unknown[], items: readonly ServerCollectionItemChange[] = []): ServerCollectionChangeUIUpdate {
    return { kind: "CollectionChange", action, component: { id: Menu, dynamicParameters }, items, moves: [] } as ServerCollectionChangeUIUpdate;
}

const Menu = 13;

function keysOf(held: HeldCollections): string[] {
    return (held.get(Select) ?? []).map(row => row.key);
}

test("nothing is held for a collection that never came", () => {
    assert.equal(new HeldCollections().get(Select), undefined);
});

test("a refill is held as it stands, and a later one replaces it", () => {
    const held = new HeldCollections();

    held.hold(Select, [{ key: "fire", item: { Title: "Fire" } }, { key: "ice", item: { Title: "Ice" } }]);
    assert.deepEqual(keysOf(held), ["fire", "ice"]);
    assert.deepEqual(held.get(Select)?.[0].item, { Title: "Fire" });

    held.hold(Select, [{ key: "arcane", item: {} }]);
    assert.deepEqual(keysOf(held), ["arcane"]);
});

test("an insert lands at its index, or at the end", () => {
    const held = new HeldCollections();

    held.hold(Select, [{ key: "a" }, { key: "c" }]);
    held.apply(change("Insert", [{ key: "b", index: 1 }]));
    held.apply(change("Insert", [{ key: "d" }]));

    assert.deepEqual(keysOf(held), ["a", "b", "c", "d"]);
});

test("a remove, a replace and a move change the held rows as they change a host's", () => {
    const held = new HeldCollections();

    held.hold(Select, [{ key: "a" }, { key: "b" }, { key: "c" }]);
    held.apply(change("Remove", [{ key: "b" }]));
    held.apply(change("Replace", [{ oldKey: "a", key: "a2", item: { Title: "A2" } }]));
    held.apply(change("Move", [], [{ key: "c", newIndex: 0 }]));

    assert.deepEqual(keysOf(held), ["c", "a2"]);
    assert.deepEqual(held.get(Select)?.[1].item, { Title: "A2" });
});

test("a reset empties the held rows, and a change to a collection not held starts one", () => {
    const held = new HeldCollections();

    held.hold(Select, [{ key: "a" }]);
    held.apply(change("Reset"));
    assert.deepEqual(keysOf(held), []);

    const fresh = new HeldCollections();

    fresh.apply(change("Insert", [{ key: "x" }]));
    assert.deepEqual(keysOf(fresh), ["x"]);
});

test("a row's host waiting to be drawn is drawn from the held rows as they stand then, every change since taken", () => {
    const held = new HeldCollections();
    const host = {};

    held.hold(Select, [{ key: "fire" }, { key: "ice" }]);
    held.markWaiting(host, Select);
    assert.equal(held.isWaiting(host), true);

    // The same set goes on to keep the shared options in step: the empty host is passed by, and the held rows take the change.
    held.apply(change("Remove", [{ key: "fire" }]));
    held.apply(change("Insert", [{ key: "water", index: 0 }]));

    assert.deepEqual(held.takeWaiting(host)?.map(row => row.key), ["water", "ice"]);
    assert.equal(held.isWaiting(host), false);
    assert.equal(held.takeWaiting(host), undefined);
});

test("a row's own collection is held by the rows it stands in, apart from every other row's", () => {
    const held = new HeldCollections();

    held.holdRow(Menu, ["m1"], [{ key: "pin", item: { Title: "Pin" } }, { key: "edit" }]);
    held.applyRow(rowChange("Remove", ["m1"], [{ key: "edit" }]));
    // A key sent as a number is the page's digits.
    held.applyRow(rowChange("Insert", [7], [{ key: "copy" }]));

    assert.deepEqual(held.getRow(Menu, ["m1"])?.map(row => row.key), ["pin"]);
    assert.deepEqual(held.getRow(Menu, ["7"])?.map(row => row.key), ["copy"]);
    assert.equal(held.getRow(Menu, ["m2"]), undefined);
    assert.equal(held.get(Menu), undefined);
});

test("a patch to an entry's part writes its held item, in its own menu's list at its rows alone, or in the list shared outside the rows", () => {
    const held = new HeldCollections();
    const other = 31;

    held.holdRow(Menu, ["m1"], [{ key: "pin", item: { Title: "Pin" } }]);
    held.holdRow(Menu, ["m2"], [{ key: "pin", item: { Title: "Pin" } }]);
    held.holdRow(other, ["m1"], [{ key: "pin", item: { Title: "Pin" } }]);
    held.hold(Menu, [{ key: "pin", item: { Title: "Pin" } }]);

    const written = held.writeItem(Menu, ["m1"], "pin", item => ({ ...item as object, Title: "Unpin" }));

    assert.equal(written, true);
    assert.deepEqual(held.getRow(Menu, ["m1"])?.[0].item, { Title: "Unpin" });
    assert.deepEqual(held.getRow(Menu, ["m2"])?.[0].item, { Title: "Pin" });
    assert.deepEqual(held.getRow(other, ["m1"])?.[0].item, { Title: "Pin" });
    assert.deepEqual(held.get(Menu)?.[0].item, { Title: "Pin" });
    assert.equal(held.writeItem(Menu, ["m1"], "gone", item => item), false);

    assert.equal(held.writeItem(Menu, [], "pin", item => ({ ...item as object, Title: "Unpin" })), true);
    assert.deepEqual(held.get(Menu)?.[0].item, { Title: "Unpin" });
    assert.equal(held.writeItem(other, [], "pin", item => item), false);
});

test("the rows' own collections go with the rows they stand in, and every row's below them", () => {
    const held = new HeldCollections();
    const other = 31;

    held.holdRow(Menu, ["m1"], [{ key: "pin" }]);
    held.holdRow(Menu, ["m1", "pin"], [{ key: "sub" }]);
    held.holdRow(Menu, ["m2"], [{ key: "pin" }]);
    held.holdRow(other, ["m1"], [{ key: "pin" }]);

    held.forgetRows(["m1"], componentId => componentId === Menu);

    assert.equal(held.getRow(Menu, ["m1"]), undefined);
    assert.equal(held.getRow(Menu, ["m1", "pin"]), undefined);
    assert.notEqual(held.getRow(Menu, ["m2"]), undefined);
    assert.notEqual(held.getRow(other, ["m1"]), undefined);
});

test("every held row is visited with its component, shared or a row's own", () => {
    const held = new HeldCollections();
    const visited: string[] = [];

    held.hold(Select, [{ key: "fire" }]);
    held.holdRow(Menu, ["m1"], [{ key: "pin" }]);
    held.forEachRow((componentId, row) => visited.push(`${componentId}:${row.key}`));

    assert.deepEqual(visited, [`${Select}:fire`, `${Menu}:pin`]);
});
