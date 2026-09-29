// Folds and marks read back from the compiled stylesheet: a fold animates the height it is given, a mark draws where it is seen,
// and a popup's owner never becomes the box a fixed popup is placed in.

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

test("a menu's inline group folds from a zero minimum, on one curve both ways", () => {
    const fold = ".ui-menu:not([data-ui-collapsed]) [data-ui-menu-group]:not([data-ui-menu-select]) > .ui-menu__submenu:not([data-ui-menu-flyout])";

    assert.match(declarations(".ui-menu__submenu") ?? "", /min-block-size: 0;/, "a flex item's automatic minimum holds the fold open");
    assert.match(declarations(fold) ?? "", /block-size 200ms cubic-bezier\(0\.4, 0, 0\.2, 1\)/, "the fold is not on @ui-motion-ease");
    assert.equal(declarations(".ui-menu:not([data-ui-collapsed]) [data-ui-menu-group][data-ui-menu-open]:not([data-ui-menu-select]) > .ui-menu__submenu:not([data-ui-menu-flyout])"), null, "an opening group has a curve of its own");
    assert.match(declarations(".ui-menu:not([data-ui-collapsed]) [data-ui-menu-group]:not([data-ui-menu-select]) > .ui-menu-item::after") ?? "", /transition-duration: 200ms;/, "the chevron does not turn at the fold's tempo");
});

test("an expander's air above its content is inside the fold", () => {
    const content = declarations(".ui-expander__content") ?? "";

    assert.doesNotMatch(content, /margin/, "a margin collapses out of ::details-content and jumps at the fold's ends");
    assert.match(content, /padding: 0\.75rem 1rem 1rem;/);
});

test("a validation line with no words takes no room, whatever marks the field", () => {
    const shown = css.indexOf("\n.ui-invalid > .ui-validation-message,");
    const empty = css.indexOf("\n.ui-validation-message:empty {\n  display: none;");

    assert.ok(shown >= 0 && empty > shown, "the empty line's rule does not follow the rule that shows the line");
});

test("a read-only time segment fills under a key's focus only", () => {
    const lit = ".ui-temporal-input__segment:focus:is(:not([aria-readonly=\"true\"]), :focus-visible:not([data-ui-pointer-focus]))";

    assert.match(declarations(lit) ?? "", /background: var\(--ui-color-primary\);/);
    assert.match(css, new RegExp(`\\n  ${lit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{\\s*forced-color-adjust: none;\\s*background: Highlight;`), "forced colours fill a read-only segment");
    assert.equal(declarations(".ui-temporal-input__segment:focus"), null, "a bare focus still fills a segment");
});

test("a quiet button brightens its parts under the pointer, never the root a popup inside is placed from", () => {
    assert.doesNotMatch(css, /\.ui-button--link[^{,]*:hover \{\s*filter: brightness/, "a Link button filters its root");
    assert.doesNotMatch(css, /\):hover,\n[^{]*\{\s*background-color: transparent;\s*filter: brightness/, "a hovered row filters a quiet button's root");
    assert.ok(css.includes(":hover > :not([role=\"menu\"], [role=\"listbox\"]) {\n  filter: brightness(1.25);"), "a Link button's parts do not brighten");
});

test("a quote paragraph's line is its own box, out of the reach of a tile's wash on the root's background", () => {
    assert.doesNotMatch(declarations(".ui-paragraph--quote") ?? "", /background/, "the line is the root's background, which a wrapped tile's wash rewrites");
    assert.match(declarations(".ui-paragraph--quote:not(.ui-loading)::before") ?? "", /width: 2px;\s*background-color: var\(--ui-quote-color/);
});

test("a chosen row with pinned cells draws its mark once, above them", () => {
    const row = ".ui-table > .ui-table__scroll > [data-ui-items-host] > .ui-table__row[data-ui-selected]";

    assert.match(declarations(`${row}:has(> .ui-table__cell--pinned)::after`) ?? "", /z-index: 1;\s*box-shadow: var\(--ui-selected-mark, none\);/);
    assert.match(declarations(`${row} > .ui-table__cell--pinned`) ?? "", /box-shadow: none;/, "each pinned cell draws the mark again");
    assert.doesNotMatch(css, /\.ui-table \[data-ui-items-host\] > \.ui-table__row/, "a table row rule reaches a nested table's rows");
});
