// What decides whether an attach has any work to do, over values off the wire that are always fresh objects.

import assert from "node:assert/strict";
import test from "node:test";

import { areValuesEqual } from "../src/state/value-equality.ts";

test("the same value parsed twice is the same value", () => {
    const responsive = "{\"base\":true,\"sm\":null,\"md\":null,\"xl\":null,\"xxl\":null}";

    assert.equal(areValuesEqual(JSON.parse(responsive), JSON.parse(responsive)), true);
});

test("a value that moved is not equal", () => {
    assert.equal(areValuesEqual({ base: true, sm: null }, { base: false, sm: null }), false);
    assert.equal(areValuesEqual([1, 2, 3], [1, 2]), false);
    assert.equal(areValuesEqual({ style: "Primary" }, { style: "Primary", light: null }), false);
});

test("nested items compare all the way down", () => {
    const left = { key: { title: "Region", color: { style: "OnBackground" } }, tags: ["a", "b"] };
    const right = { key: { title: "Region", color: { style: "OnBackground" } }, tags: ["a", "b"] };

    assert.equal(areValuesEqual(left, right), true);

    assert.equal(areValuesEqual(left, { ...right, key: { title: "Region", color: { style: "Muted" } } }), false);
});

test("null, undefined and a missing key are told apart", () => {
    assert.equal(areValuesEqual(null, undefined), false);
    assert.equal(areValuesEqual(null, null), true);
    assert.equal(areValuesEqual({ a: null }, {}), false);
});

test("dates compare by instant, not by identity", () => {
    assert.equal(areValuesEqual(new Date(0), new Date(0)), true);
    assert.equal(areValuesEqual(new Date(0), new Date(1)), false);
    assert.equal(areValuesEqual(new Date(0), 0), false);
});

test("an inherited name does not stand in for a carried one", () => {
    // `"toString" in right` is true for every object, so an `in` check would call these two equal.
    assert.equal(areValuesEqual({ toString: "x" }, {}), false);
});
