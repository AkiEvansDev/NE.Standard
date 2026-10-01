// A text in Title mode with an icon and no title stands the icon on its description's first line, read back from the compiled
// stylesheet: the box is that line's height, yet never shorter than the glyph it draws, which keeps the title's size — a shorter box
// spilled the glyph out of the text, and a scroller around it scrolled by the spill.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("the icon on a description's line is that line's height, never shorter than its glyph nor drawing past it", () => {
    for (const role of ["display", "title", "subtitle", "body", "caption", "overline"]) {
        const rule = new RegExp(`\\.ui-text__description\\.ui-text-type--${role}\\) > \\.ui-text__icon \\{\\s*height: ([^;]+);`).exec(css);

        assert.equal(rule?.[1], `max(var(--ui-text-${role}-line-height), 1em)`, role);
        assert.match(css, new RegExp(`\\.ui-text__description\\.ui-text-type--${role}\\) > \\.ui-text__icon::before \\{\\s*overflow: clip;`), role);
    }
});
