// A pane container's arithmetic apart from the DOM: which pane a layout puts at each place (as UIPaneLayout.Resolve does on the
// server), which place an arrow key goes to, and the slide a pane plays from its old box to its new one.

import assert from "node:assert/strict";
import test from "node:test";
import { installFakeDom } from "./fake-dom.ts";

installFakeDom();

const { nearestToward, resolvePaneLayout, slideFrames } = await import("../src/interactions/pane-container-engine.ts");

const added = ["chat", "tasks", "tree"];

test("a layout puts each named pane at its place, and none puts each where it was added", () => {
    assert.deepEqual(resolvePaneLayout(added, "tree,chat,tasks"), ["tree", "chat", "tasks"]);
    assert.deepEqual(resolvePaneLayout(added, null), added);
    assert.deepEqual(resolvePaneLayout(added, ""), added);
    assert.deepEqual(resolvePaneLayout(added, " tasks , chat ,tree"), ["tasks", "chat", "tree"], "spaces around a name are not part of it");
});

test("a place the layout leaves open takes the first pane it left out, in the order the panes were added", () => {
    assert.deepEqual(resolvePaneLayout(added, "tree,old,chat"), ["tree", "tasks", "chat"], "an unknown name holds its place open");
    assert.deepEqual(resolvePaneLayout(added, "tree,tree,chat"), ["tree", "tasks", "chat"], "a name given twice counts once");
    assert.deepEqual(resolvePaneLayout(added, "tasks"), ["tasks", "chat", "tree"], "a short layout fills the rest");
    assert.deepEqual(resolvePaneLayout(added, "tree,tasks,chat,extra"), ["tree", "tasks", "chat"], "names past the places are passed over");
});

test("an arrow goes to the nearest place on its side, one straight ahead before a nearer one off to the side", () => {
    const from = { x: 100, y: 100 };
    const right = { x: 1, y: 0 };

    assert.equal(nearestToward(from, [{ x: 300, y: 100 }, { x: 160, y: 200 }], right), 0, "two hundred ahead beats sixty ahead and a hundred across");
    assert.equal(nearestToward(from, [{ x: 40, y: 100 }, null], right), null, "nothing lies that way");
    assert.equal(nearestToward(from, [null, { x: 100, y: 300 }], { x: 0, y: 1 }), 1, "a null centre is no candidate");
});

test("a pane slides from its old corner and its old size to its new place's", () => {
    assert.deepEqual(slideFrames({ left: 400, top: 0, width: 200, height: 100 }, { left: 0, top: 0, width: 300, height: 300 }), [
        { transform: "translate(400px, 0px)", width: "200px", height: "100px" },
        { transform: "none", width: "300px", height: "300px" }
    ]);
    assert.equal(slideFrames({ left: 0, top: 0, width: 200, height: 100 }, { left: 0, top: 0, width: 200, height: 100 }), null, "nothing moves, nothing plays");
    assert.equal(slideFrames({ left: 0, top: 0, width: 300, height: 300 }, { left: 0, top: 0, width: 200, height: 100 })?.[0].width, "300px", "a smaller place shrinks the pane under the slide");
});
