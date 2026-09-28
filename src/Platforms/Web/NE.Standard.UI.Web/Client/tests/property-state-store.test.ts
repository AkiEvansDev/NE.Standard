// A row that leaves takes its recorded values with it, so a value the server pushes to its successor is a first one again.

import assert from "node:assert/strict";
import test from "node:test";

import { PropertyStateStore } from "../src/state/property-state-store.ts";

const title = { componentId: 12, propertyId: "title" };
const color = { componentId: 12, propertyId: "color" };

test("a removed row's entries are forgotten and the next value is a change again", () => {
    const store = new PropertyStateStore();

    assert.equal(store.set(title, ["a"], "first", [{ host: 7, hostParameters: [], key: "a" }]), true);
    assert.equal(store.set(title, ["a"], "first", [{ host: 7, hostParameters: [], key: "a" }]), false);

    store.forgetRows(7, [], ["a"]);

    assert.equal(store.has(title, ["a"]), false);
    assert.equal(store.set(title, ["a"], "first", [{ host: 7, hostParameters: [], key: "a" }]), true);
});

test("forgetting a row leaves its neighbours and another host's row of the same key alone", () => {
    const store = new PropertyStateStore();

    store.set(title, ["a"], 1, [{ host: 7, hostParameters: [], key: "a" }]);
    store.set(color, ["a"], 2, [{ host: 7, hostParameters: [], key: "a" }]);
    store.set(title, ["b"], 3, [{ host: 7, hostParameters: [], key: "b" }]);
    store.set({ componentId: 20, propertyId: "title" }, ["a"], 4, [{ host: 9, hostParameters: [], key: "a" }]);

    store.forgetRows(7, [], ["a"]);

    assert.equal(store.has(title, ["a"]), false);
    assert.equal(store.has(color, ["a"]), false);
    assert.equal(store.get(title, ["b"]), 3);
    assert.equal(store.get({ componentId: 20, propertyId: "title" }, ["a"]), 4);
});

test("a nested row goes with its outer row, and a reset takes every row of the host", () => {
    const store = new PropertyStateStore();
    const inner = { componentId: 30, propertyId: "inner" };

    store.set(inner, ["a", "x"], 1, [{ host: 8, hostParameters: ["a"], key: "x" }, { host: 7, hostParameters: [], key: "a" }]);
    store.set(inner, ["b", "y"], 2, [{ host: 8, hostParameters: ["b"], key: "y" }, { host: 7, hostParameters: [], key: "b" }]);
    store.set(title, ["c"], 3, [{ host: 7, hostParameters: [], key: "c" }]);

    store.forgetRows(7, [], ["a"]);

    assert.equal(store.has(inner, ["a", "x"]), false);
    assert.equal(store.get(inner, ["b", "y"]), 2);

    store.forgetHost(7, []);

    assert.equal(store.has(inner, ["b", "y"]), false);
    assert.equal(store.has(title, ["c"]), false);
});

test("the same row key in two copies of a nested host is two rows", () => {
    const store = new PropertyStateStore();
    const step = { componentId: 30, propertyId: "step" };

    store.set(step, ["a", "1"], "a1", [{ host: 8, hostParameters: ["a"], key: "1" }, { host: 7, hostParameters: [], key: "a" }]);
    store.set(step, ["b", "1"], "b1", [{ host: 8, hostParameters: ["b"], key: "1" }, { host: 7, hostParameters: [], key: "b" }]);

    store.forgetRows(8, ["a"], ["1"]);

    assert.equal(store.has(step, ["a", "1"]), false);
    assert.equal(store.get(step, ["b", "1"]), "b1");

    store.forgetHost(8, ["a"]);

    assert.equal(store.get(step, ["b", "1"]), "b1");
});

test("a host's parameters compare as text, as the DOM registry matches them", () => {
    const store = new PropertyStateStore();
    const step = { componentId: 30, propertyId: "step" };

    store.set(step, ["5", "1"], "x", [{ host: 8, hostParameters: ["5"], key: "1" }]);
    store.forgetRows(8, [5], ["1"]);

    assert.equal(store.has(step, ["5", "1"]), false);
});

test("a value written under no row is kept until the store is cleared", () => {
    const store = new PropertyStateStore();

    store.set(title, [], "page");
    store.forgetHost(7, []);

    assert.equal(store.get(title, []), "page");

    store.clear();

    assert.equal(store.has(title, []), false);
});

test("a value written while its row was not on the page leaves with that row", () => {
    const store = new PropertyStateStore();

    // A virtualized row not drawn: the value comes with its address, and no element to say which row it stands in.
    assert.equal(store.set(title, ["a"], "done"), true);
    assert.equal(store.set(title, ["a"], "done"), false);

    store.forgetRows(7, [], ["a"]);

    assert.equal(store.has(title, ["a"]), false);
    assert.equal(store.set(title, ["a"], "done"), true);
});

test("an unplaced value in a nested row goes with its outer row, and a reset of the nested host takes it too", () => {
    const store = new PropertyStateStore();
    const inner = { componentId: 30, propertyId: "inner" };

    store.set(inner, ["a", "x"], 1);
    store.set(inner, ["b", "y"], 2);
    store.set(title, ["b"], 3);

    store.forgetRows(7, [], ["a"]);

    assert.equal(store.has(inner, ["a", "x"]), false);
    assert.equal(store.get(inner, ["b", "y"]), 2);

    store.forgetHost(8, ["b"]);

    assert.equal(store.has(inner, ["b", "y"]), false);
    // The outer row's own value is not the nested host's to forget.
    assert.equal(store.get(title, ["b"]), 3);
});

test("a value placed once its row is drawn is forgotten only by that row's host", () => {
    const store = new PropertyStateStore();

    store.set(title, ["a"], 1);
    store.set(title, ["a"], 1, [{ host: 7, hostParameters: [], key: "a" }]);

    store.forgetRows(9, [], ["a"]);

    assert.equal(store.get(title, ["a"]), 1);

    store.forgetRows(7, [], ["a"]);

    assert.equal(store.has(title, ["a"]), false);
});
