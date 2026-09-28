// A host's published values are found by its whole address: a list inside every row of another is one host per row.

import assert from "node:assert/strict";
import test from "node:test";

import { MetadataIndex } from "../src/metadata/metadata-index.ts";

function index(): MetadataIndex {
    return new MetadataIndex({
        propertyDefinitions: [],
        bindings: [],
        events: [],
        interactions: [],
        validations: [],
        items: [],
        itemsFilterSort: [],
        itemValues: [
            { componentId: 7, dynamicParameters: ["a"], items: [{ key: "a1", item: { title: "A1" } }] },
            { componentId: 7, dynamicParameters: ["b"], items: [{ key: "b1", item: { title: "B1" } }] },
            { componentId: 9, items: [{ key: "x", item: null }] }
        ]
    });
}

test("each row's host reads only its own values", () => {
    const metadata = index();

    assert.deepEqual(metadata.getItemValues(7, ["a"]).map(value => value.key), ["a1"]);
    assert.deepEqual(metadata.getItemValues(7, ["b"]).map(value => value.key), ["b1"]);
    assert.deepEqual(metadata.getItemValues(7, ["c"]), []);
});

test("a host in no row is found with no parameters", () => {
    assert.deepEqual(index().getItemValues(9).map(value => value.key), ["x"]);
});

test("a numeric key finds the host its digits name", () => {
    const metadata = new MetadataIndex({
        propertyDefinitions: [], bindings: [], events: [], interactions: [], validations: [], items: [], itemsFilterSort: [],
        itemValues: [{ componentId: 3, dynamicParameters: [12], items: [{ key: "k", item: 1 }] }]
    });

    assert.equal(metadata.getItemValues(3, ["12"]).length, 1);
});
