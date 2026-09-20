// Where the pinned columns stick: the first at the table's edge, each next one after the widths before it.

import assert from "node:assert/strict";
import test from "node:test";

import { pinOffsets, zeroTracks } from "../src/interactions/grid-tracks.ts";

test("each pinned column starts where the widths before it end", () => {
    assert.deepEqual(pinOffsets([120, 200, 300, 300], 3), [0, 120, 320]);
});

test("a width the layout has not given yet counts as nothing", () => {
    assert.deepEqual(pinOffsets([120, Number.NaN], 3), [0, 120, 120]);
});

test("no pinned columns, no offsets", () => {
    assert.deepEqual(pinOffsets([120, 200], 0), []);
});

test("a hidden column keeps its track, at zero and unbounded", () => {
    assert.deepEqual(zeroTracks([{ kind: "px", value: 120 }, { kind: "auto", value: 0, min: 80 }, { kind: "star", value: 1 }], new Set([1])), [
        { kind: "px", value: 120 },
        { kind: "px", value: 0 },
        { kind: "star", value: 1 }
    ]);
});
