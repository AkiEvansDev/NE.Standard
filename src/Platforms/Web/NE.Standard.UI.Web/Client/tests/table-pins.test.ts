// Where the pinned columns stick: the first at the table's edge, each next one after the widths before it, and all past a start grip's track.

import assert from "node:assert/strict";
import test from "node:test";

import { pinOffsets, zeroTracks } from "../src/interactions/grid-tracks.ts";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { leadsWithGrip } = await import("../src/interactions/table-columns-engine.ts");

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

test("a start grip's track leads the columns' only while the table's rows drag by grips: its width is no column's", () => {
    const table = FakeElement.of("ui-table ui-drag-handle--start", { "data-ui-rows-draggable": "", "data-ui-rows-drag-handle": "" });

    assert.equal(leadsWithGrip(real(table)), true);

    table.removeAttribute("data-ui-rows-drag-handle");
    assert.equal(leadsWithGrip(real(table)), false);

    table.setAttribute("data-ui-rows-drag-handle", "");
    table.className = "ui-table ui-drag-handle--end";
    assert.equal(leadsWithGrip(real(table)), false);
});
