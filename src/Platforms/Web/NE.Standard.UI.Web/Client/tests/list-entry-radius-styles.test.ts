// A list's entries read back from the compiled stylesheet: one corner for every one of them, two thirds of a button's, and the popup's
// own that corner widened by the list's padding, so the two run parallel; a current entry is straight only on the edge its mark stands on.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const entryRadius = "border-radius: calc(var(--ui-radius-button) * 2 / 3);";
// A menu's entry takes the corner one by one, so its shape rules add up as corner properties would and its border's chain reads them.
const entryCorners = ["tl", "tr", "br", "bl"].map(corner => `--ui-menu-entry-${corner}: calc(var(--ui-radius-button) * 2 / 3);`);
const entryChain = "var(--ui-border-radius, var(--ui-menu-entry-tl) var(--ui-menu-entry-tr) var(--ui-menu-entry-br) var(--ui-menu-entry-bl))";
const popupRadius = "border-radius: calc(var(--ui-radius-button) * 2 / 3 + 0.25rem);";

/** The declarations of the first rule whose selector list starts with `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector}`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("a popup's list entries take the entry corner, and the popup rounds to it plus the list's padding", () => {
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

    assert.ok(entryCorners.every(corner => menuEntry.includes(corner)), "a popup menu's entry does not take the list entry's corner");
});

test("a popup's entries round after a bar's square ones, so a bar's flyout is a rounded list too", () => {
    const bar = css.indexOf("\n.ui-menu.ui-orientation--horizontal .ui-menu-item {");
    const popup = css.indexOf("\n:is(.ui-context-menu, .ui-split-button__menu, .ui-menu__submenu[data-ui-menu-flyout]) .ui-menu-item {");

    assert.ok(bar >= 0 && popup > bar, "the popup's entry corner does not follow the bar's square one");
});

test("a sidebar's current entry rounds as its neighbours do, straight only on the edge its mark stands on", () => {
    const entry = declarations(".ui-menu-item {") ?? "";

    assert.ok(entryCorners.every(corner => entry.includes(corner)), "a sidebar's entry does not take the list entry's corner");
    assert.ok(entry.includes(entryChain), "a sidebar's entry does not read its corners through the border's chain");
    assert.doesNotMatch(declarations(".ui-menu-item--selected {") ?? "", /radius|--ui-menu-entry/);

    for (const [side, corners] of [["left", ["tl", "bl"]], ["right", ["tr", "br"]], ["top", ["tl", "tr"]], ["bottom", ["bl", "br"]]] as const) {
        const rule = declarations(`.ui-menu.ui-side--${side} .ui-menu-item--selected {`) ?? "";

        for (const corner of corners)
            assert.match(rule, new RegExp(`--ui-menu-entry-${corner}: 0;`), `the ${side} mark's ${corner} corner is not straight`);

        assert.equal((rule.match(/--ui-menu-entry-|radius/g) ?? []).length, 2, `the ${side} mark straightens more than its own edge`);
    }
});

test("a label floating over the page keeps a field's corner rather than the list popup's", () => {
    assert.match(declarations(".ui-tooltip {") ?? "", /border-radius: var\(--ui-radius-input\);/);
    assert.match(declarations(".ui-slider__bubble {") ?? "", /border-radius: var\(--ui-radius-input\);/);
});
