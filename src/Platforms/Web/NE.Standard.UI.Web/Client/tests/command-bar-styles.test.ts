// A command bar on a row lays out as a grid of its commands and its "…", read back from the compiled stylesheet: the row is its
// commands' height, centred in a bar taller than it, so the "…" — a square the row's height — stays a command's size wherever the bar
// is stretched; on one flex line it was as tall as the bar and reserved that width, sending commands that fitted into the list. A
// vertical bar keeps its flex column, its commands at its top.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector list is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const match = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`).exec(css);

    return match?.[1] ?? null;
}

test("a bar on a row is a grid whose one row is its commands' height, centred in the bar", () => {
    const rule = declarations(".ui-command-bar:not(.ui-orientation--vertical)") ?? "";

    assert.match(rule, /display: grid;/);
    assert.match(rule, /grid-template-columns: minmax\(0, 1fr\) auto;/);
    assert.match(rule, /align-content: center;/);
});

test("the \"…\" is a square stretched to that row", () => {
    const rule = declarations(".ui-command-bar > .ui-command-bar__overflow") ?? "";

    assert.match(rule, /align-self: stretch;/);
    assert.match(rule, /aspect-ratio: 1;/);
});
