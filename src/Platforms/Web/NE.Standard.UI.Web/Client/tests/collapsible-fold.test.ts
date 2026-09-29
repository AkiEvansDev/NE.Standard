// A fold's slide: the component moves along its fold, and across it too when the fold changes that size as well (a panel folded
// to its switch), while the content holds its open size on each moving axis and fades only where it ends closed.

import assert from "node:assert/strict";
import test from "node:test";
import { installFakeDom } from "./fake-dom.ts";

installFakeDom();

const { foldKeyframes } = await import("../src/interactions/collapsible-engine.ts");

const open = { component: 336, componentAcross: 650, content: 334, contentAcross: 612 };
const box = { component: 71, componentAcross: 38, content: 0, contentAcross: 0 };

test("a panel folded to its switch slides both edges, and its content holds its open box and fades in", () => {
    const frames = foldKeyframes("width", box, open, false);

    assert.deepEqual(frames?.component, [{ width: "71px", height: "38px" }, { width: "336px", height: "650px" }]);
    assert.deepEqual(frames?.content, [
        { width: "334px", height: "612px", visibility: "visible", opacity: 0 },
        { width: "334px", height: "612px", visibility: "visible", opacity: 1 }
    ]);
});

test("folding it again runs the same way back, fading the content out", () => {
    const frames = foldKeyframes("width", open, box, true);

    assert.deepEqual(frames?.component, [{ width: "336px", height: "650px" }, { width: "71px", height: "38px" }]);
    assert.equal(frames?.content[0].opacity, 1);
    assert.equal(frames?.content[1].opacity, 0);
});

test("a rail as tall as it was open slides along its fold alone, and its content keeps showing", () => {
    const rail = { component: 56, componentAcross: 800, content: 40, contentAcross: 760 };
    const wide = { component: 240, componentAcross: 800, content: 224, contentAcross: 760 };
    const frames = foldKeyframes("width", wide, rail, true);

    assert.deepEqual(frames?.component, [{ width: "240px" }, { width: "56px" }]);
    assert.deepEqual(frames?.content, [
        { width: "224px", visibility: "visible", opacity: 1 },
        { width: "224px", visibility: "visible", opacity: 1 }
    ]);
});

test("nothing moves, nothing plays", () => {
    assert.equal(foldKeyframes("height", open, open, true), null);
});
