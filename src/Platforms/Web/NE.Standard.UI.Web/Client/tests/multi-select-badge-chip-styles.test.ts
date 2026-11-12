// A multi-select drawn as badges: a chip is a pill whatever its words: two characters ("P1") make a badge round with no side padding, which a chip with
// its cross inside it must not take, or its words stand against its edge. Read back from the compiled stylesheet.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

const Chip = ".ui-badge-select .ui-multi-select__chips > .ui-multi-select__chip.ui-badge";
const RoundWords = "[data-ui-badge-title=\"compact\"]:not([data-ui-badge-icon], .ui-badge-variant--plain)";

/** The declarations of the rule whose selector list holds `selector`, with where it stands in the sheet. */
function rule(selector: string): { readonly body: string; readonly at: number } {
    // Whole entries only: a `:not()` of two arguments carries a comma of its own, so the list is not split on commas.
    const entry = new RegExp(`(?:^|,)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(?:,|$)`);

    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (entry.test(match[1].trim()))
            return { body: match[2], at: match.index };
    }

    return { body: "", at: -1 };
}

test("a compact badge keeps side air past its corner arcs while an empty dot stays a square, and a chip keeps its pill start padding", () => {
    const empty = rule(".ui-badge:not([data-ui-badge-icon], [data-ui-badge-title], .ui-badge-variant--plain)");
    const compact = rule(`.ui-badge${RoundWords}`);
    const chip = rule(`${Chip}${RoundWords}`);

    assert.match(empty.body, /padding-inline: 0;\s*aspect-ratio: 1;/);
    assert.match(compact.body, /min-width: calc\(.*;\s*padding-inline: 0\.375em;/);
    assert.doesNotMatch(compact.body, /aspect-ratio: 1;/);
    assert.match(chip.body, /padding-inline-start: 0\.5em;/);
    assert.ok(compact.at < chip.at, "the chip's rule comes later");
    assert.match(rule(Chip).body, /aspect-ratio: auto;/, "and is no circle");
});
