// A list's entries read back from the compiled stylesheet: one corner for every one of them, a button's (`--ui-radius-button`, 6px),
// and the popup's own widened by 2px (`calc(var(--ui-radius-button) + 2px)`, 8px) so the outer curve visually nests its 4px-padded
// entries; selected list and vertical menu entries keep all four rounded corners, while a horizontal menu bar and a rail draw a 2px line.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const entryRadius = "border-radius: var(--ui-radius-button);";
const popupRadius = "border-radius: calc(var(--ui-radius-button) + 2px);";

/** The declarations of the first rule whose selector list starts with `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector}`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("a popup's list entries take the entry corner, and the popup rounds to it plus 2px", () => {
    for (const popup of [".ui-select__popup {", ".ui-context-menu {", ".ui-split-button__menu {", ".ui-menu__submenu[data-ui-menu-flyout] {", ".ui-temporal-input__popup {"]) {
        const at = css.indexOf(popup);

        assert.ok(at >= 0, `no rule for ${popup}`);
        assert.ok(css.slice(at, css.indexOf("}", at)).includes(popupRadius), `${popup} does not take the popup's corner`);
    }

    for (const entry of [
        ".ui-select__option {",
        ".ui-tab-overflow__entry {",
        ".ui-language-switcher__choice {",
        ".ui-temporal-input__day,"
    ]) {
        const at = css.indexOf(entry);

        assert.ok(at >= 0, `no rule for ${entry}`);
        assert.ok(css.slice(at, css.indexOf("}", at)).includes(entryRadius), `${entry} does not take the list entry's corner`);
    }

    const menuEntry = declarations(":is(.ui-context-menu, .ui-split-button__menu, .ui-menu__submenu[data-ui-menu-flyout]) .ui-menu-item {") ?? "";

    assert.ok(menuEntry.includes("var(--ui-radius-button)"), "a popup menu's entry does not take the list entry's corner");
});

test("a popup's entries round after a bar's square ones, so a bar's flyout is a rounded list too", () => {
    const bar = css.indexOf("\n.ui-menu.ui-orientation--horizontal .ui-menu-item {");
    const popup = css.indexOf("\n:is(.ui-context-menu, .ui-split-button__menu, .ui-menu__submenu[data-ui-menu-flyout]) .ui-menu-item {");

    assert.ok(bar >= 0 && popup > bar, "the popup's entry corner does not follow the bar's square one");
});

test("a sidebar's entry rounds all four corners through the border chain and keeps them when selected", () => {
    const entry = declarations(".ui-menu-item {") ?? "";

    assert.ok(entry.includes("var(--ui-radius-button)"), "a sidebar's entry does not take the list entry's corner");
    assert.doesNotMatch(declarations(".ui-menu-item--selected {") ?? "", /radius/);
});

test("a list's rows round all four corners for their washes and selection; a grid's stay square", () => {
    for (const [host, row] of [[".ui-items-view--stack", ".ui-items-view__item"], [".ui-tree", ".ui-tree__row"]] as const) {
        const rows = `${host} > [data-ui-items-host] > ${row}`;

        assert.equal(declarations(`${rows} {`)?.trim(), `${entryRadius}\n  corner-shape: squircle;`, `${row} does not take the list entry's corner`);
        assert.equal(declarations(`${rows}[data-ui-selected] {\n  border-top-left-radius: 0;`), null, `a chosen ${row} squares its corners`);
    }

    assert.doesNotMatch(css, /\.ui-items-view--wrap[^{,]*> \.ui-items-view__item \{[^}]*radius/, "a wrapped view's row, display: contents, takes no corner: its tile keeps its own");
    assert.doesNotMatch(css, /\n\.ui-(table__row|key-value-action__row)[^{]*\{[^}]*var\(--ui-radius-button\)/, "a table's or a key-value list's row takes the list entry's corner");
});

test("a label floating over the page keeps a field's corner rather than the list popup's", () => {
    assert.match(declarations(".ui-tooltip {") ?? "", /border-radius: var\(--ui-radius-input\);/);
    assert.match(declarations(".ui-slider__bubble {") ?? "", /border-radius: var\(--ui-radius-input\);/);
});
