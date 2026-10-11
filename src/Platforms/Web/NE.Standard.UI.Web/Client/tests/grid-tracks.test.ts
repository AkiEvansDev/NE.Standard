// A splitter's arithmetic: reading a container's template, dividing the room, and writing the template back.

import assert from "node:assert/strict";
import test from "node:test";

import {
    applyGridTrackLimits,
    bigStep,
    coversNoRoom,
    foldDelta,
    FoldPixels,
    formatGridTracks,
    moveSplit,
    narrowRunTracks,
    parseGridTrackLimits,
    parseGridTracks,
    parseShare,
    resolveSplitRuns,
    shareDelta,
    splitPercent,
    splitShare
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

test("a container that grows past its box writes a bare content track as its content's width, and reads it back", () => {
    const tracks = parseGridTracks("auto minmax(80px, auto) fit-content(300px) minmax(0, 1fr)")!;
    const wide = formatGridTracks(tracks, "max-content");

    assert.equal(wide, "max-content minmax(80px, auto) fit-content(300px) minmax(0, 1fr)");
    assert.deepEqual(parseGridTracks(wide), tracks);
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
    const moved = moveSplit(tracks, [0, 8, 700], { before: [0], after: [2] }, 150)!;

    assert.deepEqual(moved[0], { kind: "px", value: 150 });
});

test("a move of nothing is nothing", () => {
    const tracks = parseGridTracks("220px auto minmax(0, 1fr)")!;

    assert.equal(moveSplit(tracks, [220, 8, 500], { before: [0], after: [2] }, 0), null);
});

test("the reported position is the run before the bar in percent", () => {
    assert.equal(splitPercent([300, 8, 700], { before: [0], after: [2] }), 30);
});

test("a bound position is the run before the bar's share, and the move that puts the bar at another share", () => {
    const runs = { before: [0, 1], after: [3] };
    const sizes = [200, 100, 8, 700];

    assert.equal(splitShare(sizes, runs), 0.3);
    assert.equal(shareDelta(sizes, runs, 0.5), 200, "half of the thousand pixels either side, from three hundred");
    assert.equal(shareDelta(sizes, runs, 2), 700, "a share past the room is held to it");
    assert.equal(splitShare([0, 8, 0], { before: [0], after: [2] }), 0, "no room, no share");
});

test("a position written on a bar is a share from 0 to 1, and anything else is none", () => {
    assert.equal(parseShare("0.25"), 0.25);
    assert.equal(parseShare("0"), 0);
    assert.equal(parseShare("1"), 1);

    for (const text of [null, "", "1.5", "-0.1", "half", "NaN"])
        assert.equal(parseShare(text), null, String(text));
});

test("a pane is folded only while every track it covers has no room, and one the grid placed itself never is", () => {
    const sizes = [0, 8, 0.4, 0, 300];

    assert.equal(coversNoRoom("1", "auto", sizes), true, "one track by default");
    assert.equal(coversNoRoom("3", "span 2", sizes), true);
    assert.equal(coversNoRoom("3", "6", sizes), false, "the last track has room");
    assert.equal(coversNoRoom("2", "3", sizes), false, "the splitter's own track");
    assert.equal(coversNoRoom("auto", "auto", sizes), false);
    assert.equal(coversNoRoom("5", "span 3", sizes), false, "past the template: not read as folded");
    assert.equal(coversNoRoom("5", "6", sizes, new Set([4])), true, "a track a drag has taken too narrow counts as none");
});

test("a run is never left a sliver: shrunk into one it folds to nothing, grown out of nothing it opens past it", () => {
    const tracks = parseGridTracks("minmax(0, 1fr) auto minmax(0, 1fr)")!;
    const runs = { before: [0], after: [2] };
    const width = (moved: ReturnType<typeof moveSplit>, sizes: readonly number[]): number => moved![0].value / (moved![0].value + moved![2].value) * (sizes[0] + sizes[2]);

    assert.equal(Math.round(width(moveSplit(tracks, [150, 8, 450], runs, -60), [150, 8, 450])), 0, "90 would be a sliver: folded");
    assert.equal(Math.round(width(moveSplit(tracks, [0, 8, 600], runs, 16), [0, 8, 600])), 120, "one key's step opens it to the sliver's edge");
    assert.equal(Math.round(width(moveSplit(tracks, [300, 8, 300], runs, 280), [300, 8, 300])), 600, "the other run folds the same way");
    assert.equal(Math.round(width(moveSplit(tracks, [300, 8, 300], runs, -100), [300, 8, 300])), 200, "outside the sliver a move is as it was");
});

test("a splitter's side follows a drag all the way, and is folded only once the bar is let go under the fold's width", () => {
    const tracks = parseGridTracks("minmax(0, 1fr) auto minmax(0, 1fr)")!;
    const runs = { before: [0], after: [2] };
    const width = (moved: ReturnType<typeof moveSplit>, sizes: readonly number[]): number => moved![0].value / (moved![0].value + moved![2].value) * (sizes[0] + sizes[2]);

    assert.equal(Math.round(width(moveSplit(tracks, [150, 8, 450], runs, -130, 0), [150, 8, 450])), 20, "a drag does not snap");
    assert.equal(Math.round(width(moveSplit(tracks, [60, 8, 540], runs, -16, FoldPixels), [60, 8, 540])), 0, "a key's step into it folds");
    assert.equal(Math.round(width(moveSplit(tracks, [0, 8, 600], runs, 16, FoldPixels), [0, 8, 600])), FoldPixels, "a step opens a folded side to the fold's width");

    assert.equal(foldDelta([20, 8, 580], runs, FoldPixels), -20, "let go at 20 px, the side before folds");
    assert.equal(foldDelta([570, 8, 30], runs, FoldPixels), 30, "the side after the same way");
    assert.equal(foldDelta([0, 8, 600], runs, FoldPixels), 0, "a folded side stays");
    assert.equal(foldDelta([48, 8, 552], runs, FoldPixels), 0, "a side as wide as the fold stays");

    assert.deepEqual([...narrowRunTracks([20, 8, 580], runs, FoldPixels)], [0]);
    assert.deepEqual([...narrowRunTracks([300, 8, 300], runs, FoldPixels)], []);
});

test("a big step, a page key's, is a tenth of the room the bar moves in, never less than an arrow's step", () => {
    assert.equal(bigStep(16, 1200), 120);
    assert.equal(bigStep(16, 90), 16);
});
