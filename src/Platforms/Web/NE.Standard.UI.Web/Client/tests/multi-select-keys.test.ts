// A multi-select's value: the chosen keys in choice order, each once, never past the field's limit — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import { isChoiceFull, parseChosenKeys, parseMaxChosen, removeChosenKey, toggleChosenKey } from "../src/interactions/multi-select-keys.ts";

test("the attribute's list is read in its own order", () => {
    assert.deepEqual(parseChosenKeys("[\"mon\",\"wed\",\"tue\"]"), ["mon", "wed", "tue"]);
});

test("a key given twice is chosen once, where it first stood", () => {
    assert.deepEqual(parseChosenKeys("[\"mon\",\"wed\",\"mon\"]"), ["mon", "wed"]);
});

test("no attribute, an empty one, text that is no list and entries that are no key are none", () => {
    assert.deepEqual(parseChosenKeys(null), []);
    assert.deepEqual(parseChosenKeys(""), []);
    assert.deepEqual(parseChosenKeys("mon"), []);
    assert.deepEqual(parseChosenKeys("{\"mon\":true}"), []);
    assert.deepEqual(parseChosenKeys("[1,null,\"\",\"fri\"]"), ["fri"]);
});

test("a key not chosen is added last", () => {
    assert.deepEqual(toggleChosenKey(["mon", "wed"], "tue", null), ["mon", "wed", "tue"]);
});

test("a chosen key is taken out and the rest keep their order", () => {
    assert.deepEqual(toggleChosenKey(["mon", "wed", "fri"], "wed", null), ["mon", "fri"]);
});

test("a full field refuses one more but still lets one go", () => {
    assert.equal(toggleChosenKey(["mon", "wed"], "fri", 2), null);
    assert.deepEqual(toggleChosenKey(["mon", "wed"], "mon", 2), ["wed"]);
});

test("the limit is a whole number of one or more, anything else none", () => {
    assert.equal(parseMaxChosen("3"), 3);
    assert.equal(parseMaxChosen(null), null);
    assert.equal(parseMaxChosen("0"), null);
    assert.equal(parseMaxChosen("2.5"), null);
    assert.equal(parseMaxChosen("many"), null);
});

test("a field is full at its limit and never without one", () => {
    assert.equal(isChoiceFull(["mon", "wed"], 2), true);
    assert.equal(isChoiceFull(["mon"], 2), false);
    assert.equal(isChoiceFull(["mon", "wed", "fri"], null), false);
});

test("removing a key that is not chosen changes nothing", () => {
    assert.equal(removeChosenKey(["mon"], "wed"), null);
    assert.deepEqual(removeChosenKey(["mon", "wed"], "mon"), ["wed"]);
});
