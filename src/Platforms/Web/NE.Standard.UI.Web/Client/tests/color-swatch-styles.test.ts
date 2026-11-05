// A colour input's closed row carries its swatch button on the left (`.ui-color-input__swatch`) and its formatted value beside it,
// while the popup's mode switcher (`.ui-color-input__tabs`) is a right-aligned segmented ButtonGroup capsule.

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

const swatch = ".ui-color-input__swatch";

test("the swatch is a clickable square button inside the field row, with a checkerboard and an inset mark border", () => {
    const own = declarations(swatch) ?? "";

    assert.match(own, /width: 1\.4em;/);
    assert.match(own, /height: 1\.4em;/);
    assert.match(own, /cursor: pointer;/);
    assert.match(own, /box-shadow: inset 0 0 0 1px var\(--ui-color-mark\);/);
});

test("the popup's mode switcher is a right-aligned segmented capsule framed in the mark", () => {
    const tabs = declarations(".ui-color-input__tabs") ?? "";
    const selectedTab = declarations(".ui-color-input__tab[data-ui-color-tab-selected]") ?? "";

    assert.match(tabs, /align-self: flex-end;/);
    assert.match(tabs, /border: 1px solid var\(--ui-color-mark\);/);
    assert.match(tabs, /padding: 2px;/);
    assert.match(selectedTab, /background: var\(--ui-selected-background, var\(--ui-wash-selected\)\);/);
    assert.match(selectedTab, /color: var\(--ui-selected-foreground, var\(--ui-text-selected\)\);/);
});

test("without the palette, the switcher and palette pane hide cleanly and the picker pane adds no top spacing", () => {
    const hidden = declarations(".ui-color-input[data-ui-color-no-palette] :is(.ui-color-input__tabs, [data-ui-color-pane=\"palette\"]),\n.ui-color-input[data-ui-color-no-opacity] .ui-color-input__slider--opacity") ?? "";
    const pickerOnly = declarations(".ui-color-input[data-ui-color-no-palette] .ui-color-input__pane[data-ui-color-pane=\"picker\"]") ?? "";
    const pane = declarations(".ui-color-input__pane") ?? "";

    assert.match(hidden, /display: none;/);
    assert.match(pickerOnly, /display: flex;/);
    assert.doesNotMatch(pane, /margin|padding/);
    assert.equal(css.includes("data-ui-color-no-picker"), false);
});

test("a focused selected palette chip keeps its 2px inset white outline and 4px grid gap", () => {
    const grid = declarations(".ui-color-input__grid") ?? "";
    const selected = declarations(".ui-color-input__chip[data-ui-color-name-selected]") ?? "";
    const focusedSelected = declarations(".ui-color-input__chip[data-ui-color-name-selected]:focus-visible:not([data-ui-pointer-focus])") ?? "";

    assert.match(grid, /gap: 4px;/);
    assert.match(selected, /outline: 2px solid #fff;/);
    assert.match(selected, /outline-offset: -2px;/);
    assert.match(focusedSelected, /outline: 2px solid #fff;/);
    assert.match(focusedSelected, /outline-offset: -2px;/);
});
