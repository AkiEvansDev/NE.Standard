// A select's option, read back from the compiled stylesheet: a popup list's row as a menu's entry and the other lists' rows are — the
// list row's height and padding — a small field's a step denser at the small field's height, a phone's sheet a finger's row; a
// template shorter than the row in its middle.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector is exactly `selector`, joined. */
function declarations(selector: string): string {
    let found = "";

    for (let start = css.indexOf(`\n${selector} {`); start >= 0; start = css.indexOf(`\n${selector} {`, start + 1))
        found += css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));

    assert.ok(found.length > 0, `No rule for ${selector}.`);

    return found;
}

test("an option is a list's row: the menu entry's least height and padding", () => {
    const option = declarations(".ui-select__option");
    const entry = declarations(".ui-menu-item");

    assert.match(option, /min-height: 1\.75rem;/);
    assert.match(option, /padding: 0\.25rem 0\.5rem;/);
    assert.match(entry, /--ui-min-height, 1\.75rem\)/);
    assert.match(entry, /--ui-padding, 0\.25rem 0\.5rem\)/);
});

test("a small field's option is a step denser: its caption text in the small field's height", () => {
    const small = declarations(".ui-input--small .ui-select__popup:where(:not([data-ui-sheet])) .ui-select__option");

    assert.match(small, /min-height: 1\.5rem;/);
    assert.doesNotMatch(small, /padding/);
    assert.match(declarations(".ui-input--small .ui-select__popup:where(:not([data-ui-sheet])) .ui-select__option > .ui-text"), /font-size: var\(--ui-text-caption-font-size\);/);
});

test("on a phone's sheet an option keeps a finger's row", () => {
    assert.match(css, /\[data-ui-sheet\]\[popover\] :is\(\[role="menuitem"\], \[role="menuitemcheckbox"\], \[role="menuitemradio"\], \[role="option"\], \.ui-menu-item\):not\(\.ui-action-bar > \*, \[data-ui-menu-item-kind="header"\], \[data-ui-menu-item-kind="separator"\]\) \{\s*min-height: 3rem;/);
});

test("a template shorter than the row stands in its middle: a select's option centres its block, a multi-select's its flex item", () => {
    const option = declarations(".ui-select__option");

    // A block still, so a template fills the row's width and several stack as they did; only the content moves to the middle.
    assert.match(option, /display: block;\s*align-content: center;/);
    // A component root's own `align-self: normal` stretched it in the multi-select's row; the template's own alignment still wins.
    assert.match(declarations(".ui-multi-select .ui-select__option > *"), /align-self: var\(--ui-align-v, center\);/);
});
