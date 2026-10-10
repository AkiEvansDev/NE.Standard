// An input's caption row is one caption line whatever stands in it, so a badge taller than the line never moves the field away
// from its caption; a caption's badge with words is a tab stop, so it wears the keyboard's ring even where the theme draws none.

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
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(start + selector.length + 3, css.indexOf("}", start));
}

test("an input's caption row is exactly one line of its caption, a badge centred on it", () => {
    const row = declarations(".ui-input__header > .ui-text__body > .ui-text__header") ?? "";

    assert.match(row, /height: 1lh;/);
    // One line: a long caption ellipsises rather than dropping its required mark or its badge onto a second line inside the first.
    assert.match(row, /flex-wrap: nowrap;/);
    // Centred, so a taller badge overflows the line evenly above and below instead of pushing the field down.
    assert.match(declarations(".ui-text__header") ?? "", /align-items: center;/);
});

test("a caption's badge with words wears the keyboard's frame round it, and asks for help under the pointer", () => {
    const badge = ".ui-text__badge[data-ui-tooltip-press][data-ui-tooltip]";

    assert.match(declarations(badge) ?? "", /cursor: help;/);
    assert.match(css, /\.ui-text__badge\[data-ui-tooltip-press\]\[data-ui-tooltip\]:focus-visible:not\(\[data-ui-pointer-focus\]\) \{\s*outline: 2px solid var\(--ui-color-primary-ink\);\s*outline-offset: 2px;/);
});
