// A paragraph's layout rules, read back from the compiled stylesheet. Centred or at the end with an icon, the icon's track is its
// glyph's width, so the title keeps the rest of the block: an `auto` track took a share of the description spanning both tracks and
// cut the title to an ellipsis. A clamped description under a title stands as close to it as the same words unclamped: the room the
// clip keeps for the keyboard's frame is given back on top of the description's own pull towards its title, not in place of it.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector starts with `start` and ends with `end`. */
function declarationsOf(start: string, end: string): string[] {
    return Array.from(css.matchAll(/(?:^|\n)([^{}@\n][^{}]*)\{([^}]*)\}/g))
        .filter(match => match[1].trim().startsWith(start) && match[1].trim().endsWith(end))
        .map(match => match[2]);
}

test("centred or at the end, a paragraph's icon track is its glyph's width", () => {
    // Named as a text with an icon is, so it outranks ui-text.less's content-sized tracks for one: a plain `.ui-paragraph[…]` lost to them.
    const rules = declarationsOf(":is([data-ui-text-icon] > .ui-text", ".ui-paragraph:is(.ui-text--align-center, .ui-text--align-end)");

    assert.equal(rules.length, 1);
    assert.match(rules[0], /grid-template-columns: min-content minmax\(0, 1fr\);/);
});

test("a clamped description under a title keeps its pull towards it, less the two pixels the clip's padding adds", () => {
    const rules = declarationsOf(".ui-paragraph.ui-text--wrap.ui-text--max-lines:is([data-ui-text-title][data-ui-text-description]", "> .ui-text__body > .ui-text__description");

    assert.equal(rules.length, 1);
    assert.match(rules[0], /margin-top: calc\(\(1em - 1lh\) \/ 2 - 2px\);/);
});
