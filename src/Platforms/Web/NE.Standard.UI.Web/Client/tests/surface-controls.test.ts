// One rule for what is a control of its own inside a row or a clickable surface: the engines' `ControlSelector`, and the stylesheet's
// twin that keeps a clickable surface's hover and press off such a control, name the same selectors.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { ControlSelector } from "../src/interactions/own-control.ts";

const stylesheet = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/components/ui-surface.less"), "utf8");

function selectors(list: string): string[] {
    return list.split(",").map(selector => selector.trim()).filter(selector => selector.length > 0).sort();
}

test("the stylesheet's inner controls are the engines' controls", () => {
    const declared = /@ui-surface-inner-control:\s*~"([^"]*)"/.exec(stylesheet);

    assert.ok(declared !== null, "ui-surface.less declares no @ui-surface-inner-control.");
    assert.deepEqual(selectors(declared[1]), selectors(ControlSelector));
});
