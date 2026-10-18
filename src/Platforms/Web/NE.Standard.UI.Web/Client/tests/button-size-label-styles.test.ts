// A Small or Large button's size reaches its own label alone, read back from the compiled stylesheet: on the root or in a split
// button's main part, never a label further down — the entries of a split button's list are menu items of their own size, and a
// descendant rule set a Small split button's entries in caption type.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** Every selector of every rule in the sheet, one per entry. */
const selectors = Array.from(css.matchAll(/(?:^|\n)([^{}@\n][^{}]*)\{/g), match => match[1].split(",").map(part => part.trim())).flat();

test("a sized button's label type is set on its own label, on the root or in a split button's main part", () => {
    for (const size of ["small", "large"]) {
        assert.ok(selectors.includes(`.ui-button--${size} > .ui-button__content.ui-text-type--body`), size);
        assert.ok(selectors.includes(`.ui-button--${size} > .ui-split-button__main > .ui-button__content.ui-text-type--body`), size);
    }
});

test("no size rule of a button reaches a label or a glyph inside another control it holds", () => {
    const reaching = selectors.filter(selector => /^:where\(\.ui-button|^\.ui-button--(small|large)/.test(selector) && /\.ui-button(--small|--large)?(\[[^\]]+\]|:not\([^)]*\))* \.ui-(button__content|text__icon)/.test(selector));

    assert.deepEqual(reaching, []);
});
