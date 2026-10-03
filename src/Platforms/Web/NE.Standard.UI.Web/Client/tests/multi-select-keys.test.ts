// A multi-select's value: the chosen keys in choice order, each once, never past the field's limit — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import { enterTags, holdsTagSeparator, isChoiceFull, parseChosenKeys, parseMaxChosen, removeChosenKey, splitTags, takeTypedTags, toggleChosenKey } from "../src/interactions/multi-select-keys.ts";

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

test("a text's tags are split at commas, a full-width one too, and at line breaks; each trimmed, the empty ones dropped", () => {
    assert.deepEqual(splitTags("a, b ,c"), ["a", "b", "c"]);
    assert.deepEqual(splitTags("a\uFF0Cb\nc\r\nd,, ,"), ["a", "b", "c", "d"]);
    assert.deepEqual(splitTags("  "), []);
});

test("a separator in a paste makes several tags; text with none is one entry's", () => {
    assert.equal(holdsTagSeparator("a, b"), true);
    assert.equal(holdsTagSeparator("a\nb"), true);
    assert.equal(holdsTagSeparator("machine learning"), false);
});

test("typing a separator takes the tags before the last one and leaves the text after it as it stands", () => {
    assert.deepEqual(takeTypedTags("design,"), { tags: ["design"], rest: "" });
    assert.deepEqual(takeTypedTags("design, back"), { tags: ["design"], rest: " back" });
    assert.deepEqual(takeTypedTags("design"), { tags: [], rest: "design" });
});

test("typed tags are added last in order, one already chosen passed over", () => {
    const entered = enterTags(["a"], [{ text: "B", key: "b" }, { text: "a", key: "a" }, { text: "c", key: "c" }], null, "full", () => null);

    assert.deepEqual(entered, { keys: ["a", "b", "c"], refused: [], reason: null });
});

test("a tag past the cap is left over as typed, and the cap is the reason", () => {
    const entered = enterTags(["a"], [{ text: "b", key: "b" }, { text: "c", key: "c" }], 2, "full", () => null);

    assert.deepEqual(entered, { keys: ["a", "b"], refused: ["c"], reason: "full" });
});

test("a tag the judge refuses is left over, judged against the keys as they stand at its turn; the first reason stands", () => {
    const seen: string[][] = [];
    const entered = enterTags([], [{ text: "ok", key: "ok" }, { text: "x", key: "x" }, { text: "y", key: "y" }, { text: "fine", key: "fine" }], null, "full", (current, next) => {
        seen.push([...current]);
        return next[next.length - 1].length < 2 ? `short ${next[next.length - 1]}` : null;
    });

    assert.deepEqual(entered, { keys: ["ok", "fine"], refused: ["x", "y"], reason: "short x" });
    assert.deepEqual(seen, [[], ["ok"], ["ok"], ["ok"]]);
});
