// The action bar read back from the compiled stylesheet: a floating layer placed as a popup is, above the item it was chosen over and
// never clipped by a box around it, under the popups, its icons wrapping rather than running past the window; atop a menu it is a
// row of the menu's. A menu's owner, where a long press opens the menu, shows no callout and on a screen with no hover starts no selection.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector is exactly `selector`. */
function rule(selector: string): string {
    const start = css.indexOf(`\n${selector} {`);

    assert.ok(start >= 0, `No rule for ${selector}.`);

    return css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("the bar is a popup's floating layer, fixed where anchored-popup.ts places it, under the popups and never wider than the window", () => {
    const bar = rule(".ui-action-bar:not(.ui-action-bar--strip)");

    assert.match(bar, /position: fixed;/);
    assert.match(bar, /z-index: 29;/);
    assert.match(bar, /box-shadow:/);
    assert.match(bar, /flex-wrap: wrap;/);
    assert.match(bar, /max-width: calc\(100vw - /);
});

test("a host is no longer made a box for its bar: it keeps its own position", () => {
    assert.equal(css.includes(":where([data-ui-action-bar])"), false);
});

test("a bar whose item the scroll took out of sight is hidden, not removed", () => {
    assert.match(rule(".ui-action-bar--out"), /visibility: hidden;/);
});

test("atop a menu the icons are a row of the menu's, not a floating bar", () => {
    const strip = rule(".ui-action-bar--strip");

    assert.doesNotMatch(strip, /position: fixed;/);
    assert.match(strip, /border-bottom:/);
});

test("a menu's owner shows no callout on a long press, and only a screen with no hover stops selecting text in it", () => {
    assert.match(rule("[data-ui-context-menu-owner]"), /-webkit-touch-callout: none;/);
    assert.doesNotMatch(rule("[data-ui-context-menu-owner]"), /user-select/);

    const touch = css.slice(css.indexOf("@media (hover: none) and (pointer: coarse) {\n  [data-ui-context-menu-owner]"));

    assert.match(touch.slice(0, touch.indexOf("}")), /user-select: none;/);
});

test("the row a bar stands over washes as the keyboard's row does, outside the hover query, and as a layer on a chosen row", () => {
    for (const [row, bar] of [
        [".ui-items-view > [data-ui-items-host] > .ui-items-view__item", "> [data-ui-action-bar] > .ui-action-bar"],
        [".ui-table > .ui-table__scroll > [data-ui-items-host] > .ui-table__row", "> .ui-action-bar, > [data-ui-action-bar] > .ui-action-bar"],
        [".ui-tree > [data-ui-items-host] > .ui-tree__row", "> .ui-tree__node > [data-ui-action-bar] > .ui-action-bar"]
    ]) {
        assert.match(rule(`${row}:not([data-ui-selected]):has(${bar})`), /background-color: var\(--ui-wash-hover\);/);
        assert.match(rule(`${row}[data-ui-selected]:has(${bar})`), /--ui-row-cursor-wash: var\(--ui-wash-hover\);/);
    }

    assert.ok(css.includes("\n.ui-items-view > [data-ui-items-host] > .ui-items-view__item:not([data-ui-selected]):has("), "the row's wash stands inside a media query");
});

test("in forced colours the row a bar stands over is outlined as the keyboard's row is", () => {
    const forced = css.slice(css.indexOf("@media (forced-colors: active)"));

    assert.match(forced, /\.ui-items-view__item:has\(> \[data-ui-action-bar\] > \.ui-action-bar\)[^{]*\{\s*outline: 2px dashed CanvasText;/);
});
