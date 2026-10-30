// A multi-select drawn as checkboxes wears the checkbox's own box: each size and the message's edge are one rule with a checkbox's,
// so the two never drift. Read back from the compiled stylesheet.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The selector lists of every rule, each split into its entries. */
const rules = [...css.matchAll(/([^{}]+)\{[^{}]*\}/g)].map(match => match[1].split(",").map(entry => entry.trim()));

/** Whether one rule names both selectors. */
function shareRule(first: string, second: string): boolean {
    return rules.some(entries => entries.includes(first) && entries.includes(second));
}

test("a group's box takes a checkbox's size at every step", () => {
    for (const size of ["small", "large"]) {
        assert.ok(shareRule(`.ui-checkbox.ui-input--${size} > .ui-checkbox__box`, `.ui-multi-select--checkboxes.ui-input--${size} .ui-multi-select__check > .ui-checkbox__box`), size);
        assert.ok(shareRule(`.ui-checkbox.ui-input--${size} > .ui-checkbox__box::after`, `.ui-multi-select--checkboxes.ui-input--${size} .ui-multi-select__check > .ui-checkbox__box::after`), `${size} mark`);
    }
});

test("a group's message colours every box's edge, as a checkbox's colours its own", () => {
    // Whole selector lists: a `:is()` of the marks carries commas of its own.
    const lists = [...css.matchAll(/([^{}]+)\{[^{}]*\}/g)].map(match => match[1]);

    assert.ok(lists.some(list => /\.ui-checkbox:is\([^)]*\) > \.ui-checkbox__box/.test(list) && /\.ui-multi-select--checkboxes:is\([^)]*\) \.ui-multi-select__check > \.ui-checkbox__box/.test(list)));
});
