// A wheel read in pixels and notches: a mouse wheel's one event a notch, a trackpad's glide of many small ones — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import { turnWheel, WheelNotch, wheelPixels } from "../src/interactions/wheel-notches.ts";

test("a mouse wheel's notch is one step", () => {
    assert.deepEqual(turnWheel(0, WheelNotch), { steps: 1, carried: 0 });
});

test("a notch reported in lines is three of them", () => {
    assert.deepEqual(turnWheel(0, wheelPixels({ deltaX: 0, deltaY: -3, deltaMode: 1 }).y), { steps: -1, carried: 0 });
});

test("a trackpad's glide steps once per notch's worth, not once per event", () => {
    let carried = 0;
    let steps = 0;

    for (let event = 0; event < 30; event++) {
        const turn = turnWheel(carried, 12);

        carried = turn.carried;
        steps += turn.steps;
    }

    assert.equal(steps, 3);
    assert.equal(carried, 60);
});

test("a turn the other way starts over rather than paying back the last direction", () => {
    assert.deepEqual(turnWheel(90, -40), { steps: 0, carried: -40 });
});

test("pixels stay pixels on both axes, and a page is what the caller says, else a line", () => {
    assert.deepEqual(wheelPixels({ deltaX: 5, deltaY: -7, deltaMode: 0 }), { x: 5, y: -7 });
    assert.deepEqual(wheelPixels({ deltaX: 0, deltaY: 2, deltaMode: 2 }, 400), { x: 0, y: 800 });
    assert.equal(wheelPixels({ deltaX: 0, deltaY: 3, deltaMode: 2 }).y, WheelNotch);
});
