// The collection a host inside an item template shares with every row's copy, held for the rows built after it arrived: a refill
// replaces it, and every later change is applied to it as a host applies it to its rows.

import assert from "node:assert/strict";
import test from "node:test";

import { HeldCollections } from "../src/items/held-collections.ts";
import type { ServerCollectionChangeUIUpdate, ServerCollectionItemChange } from "../src/metadata/metadata-index.ts";

const Select = 42;

function change(action: string, items: readonly ServerCollectionItemChange[] = [], moves: ServerCollectionChangeUIUpdate["moves"] = []): ServerCollectionChangeUIUpdate {
    return { kind: "CollectionChange", action, component: { id: Select, dynamicParameters: [] }, items, moves } as ServerCollectionChangeUIUpdate;
}

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
