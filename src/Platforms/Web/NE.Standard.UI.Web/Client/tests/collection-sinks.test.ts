// A component that names a sink takes its collection as values: the shape a sink receives, and what an unregistered kind costs.

import assert from "node:assert/strict";
import test from "node:test";

import { CollectionSinkRegistry, toCollectionChange } from "../src/updates/collection-sinks.ts";

const component = {} as Element;

test("a server insert reaches the sink as keyed values in source order", () => {
    const change = toCollectionChange(
        { kind: 0, action: "Insert", component: { id: 7 }, items: [{ key: "a", index: 0, item: { id: "a", y: 3 } }, { key: "b", index: 1, item: { id: "b", y: 5 } }] },
        component,
        7,
        ["s1"]
    );

    assert.equal(change.action, "Insert");
    assert.equal(change.componentId, 7);
    assert.deepEqual(change.dynamicParameters, ["s1"]);
    assert.deepEqual(change.items.map(item => [item.key, item.index, (item.item as { y: number }).y]), [["a", 0, 3], ["b", 1, 5]]);
    assert.deepEqual(change.moves, []);
});

test("a move carries both positions and a missing field reads as null, never undefined", () => {
    const change = toCollectionChange({ kind: 0, action: "Move", component: { id: 7 }, moves: [{ key: "a", oldIndex: 0, newIndex: 2 }] }, component, 7, []);

    assert.deepEqual(change.moves, [{ key: "a", oldIndex: 0, newIndex: 2 }]);

    const reset = toCollectionChange({ kind: 0, action: "Reset", component: { id: 7 }, items: [{}] }, component, 7, []);

    assert.deepEqual(reset.items, [{ key: null, oldKey: null, index: null, item: undefined }]);
});

test("the registry hands a change to the sink of its kind and says when there is none", () => {
    const registry = new CollectionSinkRegistry();
    const received: string[] = [];

    registry.register({ kind: "chart", handler: change => received.push(change.action) });

    const change = toCollectionChange({ kind: 0, action: "Reset", component: { id: 1 } }, component, 1, []);

    assert.equal(registry.dispatch("chart", change), true);
    assert.equal(registry.dispatch("canvas", change), false);
    assert.deepEqual(received, ["Reset"]);
});
