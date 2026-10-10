// A phone's sheet as the compiled stylesheet draws it: along the bottom at the screen's width, three quarters of it high at most,
// sliding up out of its popover and down into it, a nested list sliding in from the side; its handle, and a dialog's bottom sheet
// rounded as it is, and wearing the same handle and following the same drag where the viewer may dismiss it.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The body of the first rule whose selector list is exactly `selector`. */
function rule(selector: string): string {
    const start = css.indexOf(`\n${selector} {`);

    assert.ok(start >= 0, `no rule for ${selector}`);

    return css.slice(start + selector.length + 3, css.indexOf("\n}", start));
}

test("a sheet lies along the bottom at the screen's width, three quarters of it high at most, and slides", () => {
    const sheet = rule("[data-ui-sheet][popover]");

    assert.match(sheet, /inset: auto 0 0;/);
    assert.match(sheet, /max-width: none;/);
    assert.match(sheet, /max-height: 75dvh;/);
    assert.match(sheet, /transform: translateY\(100%\);/);
    assert.match(sheet, /env\(safe-area-inset-bottom\)/);
    assert.match(rule("[data-ui-sheet][popover]:popover-open"), /transform: translateY\(var\(--ui-sheet-drag, 0px\)\);/);
    assert.match(rule("[data-ui-sheet=\"nested\"][popover]"), /transform: translateX\(100%\);/);
    assert.match(rule("[data-ui-sheet][popover]:popover-open[data-ui-sheet-dragging]"), /transition: none;/);
});

test("the sheet's stylesheet comes after every list popup's, so its rule outweighs their placement", () => {
    for (const list of [".ui-context-menu {", ".ui-select__popup {", ".ui-pager .ui-pager__sizes {", ".ui-menu__submenu[data-ui-menu-flyout] {"])
        assert.ok(css.indexOf(list) < css.indexOf("\n[data-ui-sheet][popover] {"), `${list} comes after the sheet's rule`);
});

test("a dialog's bottom sheet the viewer may dismiss wears the handle and follows the drag", () => {
    const surface = ".ui-dialog[data-ui-dialog-placement=\"bottom\"]:is([data-ui-dialog-close-backdrop], [data-ui-dialog-close-escape]) > .ui-dialog__surface";

    assert.match(rule(surface), /transform: translateY\(var\(--ui-sheet-drag, 0px\)\);/);
    assert.match(rule(`${surface}::before`), /width: 2rem;/);
    assert.match(rule(`[data-ui-sheet][popover]::before`), /width: 2rem;/);
});

test("a dialog's bottom sheet rounds its top corners as a list's sheet does; a sheet against another edge stays square", () => {
    const corners = /border-radius: var\(--ui-radius-card\) var\(--ui-radius-card\) 0 0;/;

    assert.match(rule("[data-ui-sheet][popover]"), corners);
    assert.match(rule(".ui-dialog[data-ui-dialog-placement=\"bottom\"] > .ui-dialog__surface"), corners);
    assert.match(rule(".ui-dialog[data-ui-dialog-placement] > .ui-dialog__surface"), /border-radius: 0;/);
    assert.ok(css.indexOf("\n.ui-dialog[data-ui-dialog-placement] > .ui-dialog__surface {") < css.indexOf("\n.ui-dialog[data-ui-dialog-placement=\"bottom\"] > .ui-dialog__surface {"), "the bottom sheet's corners come after every edge's square ones");
});
