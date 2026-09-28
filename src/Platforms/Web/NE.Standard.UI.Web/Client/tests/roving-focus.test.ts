// Which keys arrow among siblings, and that a key that moves nothing reads none of them — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import { isRovingKey, resolveRovingTarget } from "../src/interactions/roving-focus.ts";

test("the arrows of the axis, Home and End are the roving keys", () => {
    assert.equal(isRovingKey("ArrowDown", "vertical"), true);
    assert.equal(isRovingKey("Home", "horizontal"), true);
    assert.equal(isRovingKey("End", "vertical"), true);
    assert.equal(isRovingKey("ArrowRight", "both"), true);
});

test("the other axis's arrows and every other key are not", () => {
    assert.equal(isRovingKey("ArrowLeft", "vertical"), false);
    assert.equal(isRovingKey("ArrowUp", "horizontal"), false);
    assert.equal(isRovingKey("a", "both"), false);
    assert.equal(isRovingKey("Tab", "both"), false);
});

test("a key that moves nothing measures no item", () => {
    // An item that throws when measured: a list of thousands must not be read for a letter typed over it.
    const unmeasurable = {
        getClientRects: () => {
            throw new Error("measured");
        }
    } as unknown as HTMLElement;

    assert.equal(resolveRovingTarget({ key: "a", items: [unmeasurable], current: null, axis: "vertical" }), null);
    assert.equal(resolveRovingTarget({ key: "ArrowLeft", items: [unmeasurable], current: null, axis: "vertical" }), null);
});
