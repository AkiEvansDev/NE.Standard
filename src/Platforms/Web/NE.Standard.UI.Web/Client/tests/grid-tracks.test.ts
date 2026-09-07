// A splitter's arithmetic: reading a container's template, dividing the room, and writing the template back.

import assert from "node:assert/strict";
import test from "node:test";

import {
    applyGridTrackLimits,
    formatGridTracks,
    moveSplit,
    parseGridTrackLimits,
    parseGridTracks,
    resolveSplitRuns,
    splitPercent
} from "../src/interactions/grid-tracks.ts";

test("the renderer's repeat template reads as twenty-four stars", () => {
    const tracks = parseGridTracks("repeat(24, minmax(0, 1fr))");

    assert.equal(tracks?.length, 24);
    assert.deepEqual(tracks?.[0], { kind: "star", value: 1 });
});

test("every token the renderer writes reads back", () => {
    assert.deepEqual(parseGridTracks("220px auto minmax(80px, auto) fit-content(300px) minmax(160px, 2fr) 1fr"), [
        { kind: "px", value: 220 },
        { kind: "auto", value: 0 },
        { kind: "auto", value: 0, min: 80 },
        { kind: "auto", value: 0, max: 300 },
        { kind: "star", value: 2, min: 160 },
        { kind: "star", value: 1 }
    ]);
});

test("a token that is not the renderer's leaves the template unread", () => {
    assert.equal(parseGridTracks("repeat(auto-fill, 100px)"), null);
    assert.equal(parseGridTracks("calc(100% - 4px)"), null);
});

test("formatting writes what the renderer would have written", () => {
    const template = "220px auto minmax(80px, auto) fit-content(300px) minmax(160px, 2fr) minmax(0, 1fr)";

    assert.equal(formatGridTracks(parseGridTracks(template)!), template);
});

test("limits are one-based on the attribute and land on the track", () => {
    const limits = parseGridTrackLimits("1:160:420 3::300");

    assert.deepEqual(limits, [{ index: 0, min: 160, max: 420 }, { index: 2, max: 300 }]);

    const bounded = applyGridTrackLimits(parseGridTracks("220px auto 1fr")!, limits);

    assert.deepEqual(bounded[0], { kind: "px", value: 220, min: 160, max: 420 });
    assert.deepEqual(bounded[2], { kind: "star", value: 1, max: 300 });
});

test("a run reaches the container's edge or the next splitter", () => {
    assert.deepEqual(resolveSplitRuns(1, [], 4), { before: [0], after: [2, 3] });
    assert.deepEqual(resolveSplitRuns(3, [1], 6), { before: [2], after: [4, 5] });
    assert.deepEqual(resolveSplitRuns(1, [3], 6), { before: [0], after: [2] });
    assert.equal(resolveSplitRuns(0, [], 4), null);
});

test("a sidebar beside stars is written in pixels and the stars are left alone", () => {
    const tracks = parseGridTracks("220px auto minmax(0, 1fr) minmax(0, 1fr)")!;
    const moved = moveSplit(tracks, [220, 8, 386, 386], { before: [0], after: [2, 3] }, 40)!;

    assert.deepEqual(moved[0], { kind: "px", value: 260 });
    assert.deepEqual(moved[2], { kind: "star", value: 1 });
    assert.equal(formatGridTracks(moved), "260px auto minmax(0, 1fr) minmax(0, 1fr)");
});

test("two star runs share one weight and keep their proportion", () => {
    const tracks = parseGridTracks("repeat(4, minmax(0, 1fr)) auto repeat(4, minmax(0, 1fr))")!;
    const sizes = [100, 100, 100, 100, 8, 100, 100, 100, 100];
    const moved = moveSplit(tracks, sizes, { before: [0, 1, 2, 3], after: [5, 6, 7, 8] }, 200)!;

    // 600 of 800 on the left: six of the eight stars, spread evenly over four tracks.
    assert.equal(moved[0].value, 1.5);
    assert.equal(moved[5].value, 0.5);
    assert.equal(moved.reduce((total, track) => total + (track.kind === "star" ? track.value : 0), 0), 8);
});

test("the drag stops where a track's floor or ceiling does", () => {
    const tracks = applyGridTrackLimits(parseGridTracks("220px auto minmax(0, 1fr)")!, parseGridTrackLimits("1:160:420"));
    const runs = { before: [0], after: [2] };

    assert.equal(moveSplit(tracks, [220, 8, 500], runs, -100)![0].value, 160);
    assert.equal(moveSplit(tracks, [220, 8, 500], runs, 1000)![0].value, 420);
});

test("a floor on the other side holds the boundary too", () => {
    const tracks = applyGridTrackLimits(parseGridTracks("220px auto minmax(0, 1fr)")!, parseGridTrackLimits("3:300:"));

    assert.equal(moveSplit(tracks, [220, 8, 500], { before: [0], after: [2] }, 1000)![0].value, 420);
});

test("a run squeezed to nothing comes back", () => {
    const tracks = parseGridTracks("0px auto minmax(0, 1fr)")!;
    const moved = moveSplit(tracks, [0, 8, 700], { before: [0], after: [2] }, 50)!;

    assert.deepEqual(moved[0], { kind: "px", value: 50 });
});

test("a move of nothing is nothing", () => {
    const tracks = parseGridTracks("220px auto minmax(0, 1fr)")!;

    assert.equal(moveSplit(tracks, [220, 8, 500], { before: [0], after: [2] }, 0), null);
});

test("the reported position is the run before the bar in percent", () => {
    assert.equal(splitPercent([300, 8, 700], { before: [0], after: [2] }), 30);
});
