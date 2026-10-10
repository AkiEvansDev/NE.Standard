// Read back from the compiled stylesheet: menus, breadcrumbs, command bars and tab strips read what they are styled by off marks the render
// and their engines write — a group holding the current entry, a word at an entry's end, a caption's row along a bar, the popup a menu
// fills, a trail's last shown step and collapsed steps, a strip none of whose tabs closes — never through a `:has()`.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector list contains `selector` as one of its selectors, or null. */
function declarations(selector: string): string | null {
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (selectors(match[1]).includes(selector))
            return match[2];
    }

    return null;
}

/** A selector list's selectors: split at its own commas, not those inside `:is()` or `:not()`. */
function selectors(list: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;

    for (let index = 0; index < list.length; index++) {
        if (list[index] === "(")
            depth++;
        else if (list[index] === ")")
            depth--;
        else if (list[index] === "," && depth === 0) {
            parts.push(list.slice(start, index).trim());
            start = index + 1;
        }
    }

    parts.push(list.slice(start).trim());

    return parts;
}

test("no menu, trail, command bar or tab strip rule looks into its parts through a :has()", () => {
    for (const block of ["ui-menu", "ui-breadcrumbs", "ui-command-bar", "ui-tabs-view", "ui-context-menu", "ui-split-button__menu"])
        assert.doesNotMatch(css, new RegExp(`\\.${block}[^{}]*:has\\(`), block);
});

test("a folded group holding the current page wears its mark by the group's own mark, under forced colours too", () => {
    assert.match(declarations(".ui-menu__item[data-ui-menu-group][data-ui-menu-holds-current]:not([data-ui-menu-open]) > .ui-menu-item:not(.ui-menu-item--selected)") ?? "", /background-image: linear-gradient\(var\(--ui-wash-descendant\), var\(--ui-wash-descendant\)\);/);
    assert.match(css, /\.ui-menu__item\[data-ui-menu-group\]\[data-ui-menu-holds-current\]:not\(\[data-ui-menu-open\]\) > \.ui-menu-item:not\(\.ui-menu-item--selected\):not\([^{]*\{\s*outline: 1px solid Highlight;/);
});

test("a check or a chevron keeps beside a word at the entry's end by the entry's own mark", () => {
    assert.match(declarations(".ui-menu-item:is([data-ui-menu-item-shortcut], [data-ui-menu-item-value])::after") ?? "", /margin-left: 0\.5rem;/);
});

test("a menu's Surface names the ground of the popup it fills by the popup's mark", () => {
    assert.match(declarations(":is(.ui-context-menu, .ui-split-button__menu)[data-ui-menu-surface=\"background\"]") ?? "", /--ui-popup-ground: var\(--ui-color-background\);/);
    assert.match(declarations(":is(.ui-context-menu, .ui-split-button__menu)[data-ui-menu-surface=\"raised\"]") ?? "", /--ui-popup-ground: var\(--ui-surface-raised\);/);
    assert.match(declarations(":is(.ui-context-menu, .ui-split-button__menu)[data-ui-menu-surface=\"tinted\"]") ?? "", /--ui-popup-ground: color-mix/);
});

test("along a bar a caption's or a rule's row takes its own width by the row's mark", () => {
    assert.match(declarations(".ui-menu--rail.ui-orientation--horizontal > .ui-menu__host > .ui-menu__item[data-ui-menu-passive]") ?? "", /flex: 0 0 auto;/);
});

test("a trail hides a collapsed step and drops the separator of its last shown step by the wrapper's tiers, in each tier's band", () => {
    assert.match(declarations(".ui-breadcrumbs__item::after") ?? "", /content:/);

    for (const tier of ["base", "sm", "md", "xl", "xxl"]) {
        assert.match(declarations(`.ui-breadcrumbs__item[data-ui-step-collapsed~="${tier}"]`) ?? "", /display: none;/, tier);
        assert.match(declarations(`.ui-breadcrumbs__item[data-ui-step-end~="${tier}"]::after`) ?? "", /content: none;/, tier);
    }

    // After the text separator's rule, which it ties with: the author's separator goes too.
    assert.ok(css.indexOf(".ui-breadcrumbs--text-separator .ui-breadcrumbs__item::after") < css.indexOf(".ui-breadcrumbs__item[data-ui-step-end~=\"base\"]::after"));
});

test("a command bar's host gives way to the bar, and a strip none of whose tabs closes keeps no room for a close", () => {
    assert.match(declarations(".ui-command-bar > .ui-command-bar__host") ?? "", /min-width: 0;/);
    assert.match(declarations(".ui-tabs-view:is([data-ui-tabs-unremovable], [data-ui-tabs-none-removable]) .ui-tab-item__close") ?? "", /display: none;/);
});
