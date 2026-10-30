// Unified pointer hover and keyboard focus: under `forced-colors: none`, keyboard focus draws no separate 2px outline frame and instead
// lights rows, tiles, expanders, tabs, and pressable controls with the exact same surface wash and 2nd-degree text brightness as hover.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** Every rule's declarations whose selector list holds `selector`, joined. */
function rules(selector: string): string {
    let found = "";

    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (match[1].split(",").some(part => part.trim() === selector))
            found += match[2];
    }

    return found;
}

test("a tree row takes the hover wash and no outline while the keyboard is on it", () => {
    const row = rules(".ui-tree:focus:not([data-ui-pointer-focus]) > [data-ui-items-host] > .ui-tree__row[data-ui-row-focus]:not([data-ui-selected])");

    assert.match(row, /background-color: var\(--ui-wash-hover\);/);
    assert.doesNotMatch(row, /outline: 2px solid/);
});

test("a list's, a table's and a key-value list's row holds the focus itself: the wash is on its own focus, its ring off", () => {
    const focus = ":focus:not([data-ui-pointer-focus])";
    const hosts = [
        [".ui-items-view[role=\"list\"]:not(.ui-items-view--wrap)", ".ui-items-view__item", ""],
        [".ui-key-value-action", ".ui-key-value-action__row", ""],
        [".ui-table[role=\"table\"]", ".ui-table__row", ".ui-table__scroll > "]
    ];

    for (const [host, row, via] of hosts) {
        const path = `${host} > ${via}[data-ui-items-host] > ${row}`;
        const cursor = rules(`${path}[data-ui-row-focus]${focus}:not([data-ui-selected])`);

        assert.match(cursor, /background-color: var\(--ui-wash-hover\);/, row);
        assert.doesNotMatch(cursor, /outline: 2px solid/, row);
        assert.match(rules(`${path}[data-ui-row-focus]${focus}[data-ui-selected]`), /--ui-row-cursor-wash: var\(--ui-wash-hover\);/, row);
        assert.match(rules(`${path}:focus`), /outline: none;/, row);
        assert.match(rules(`${host}:focus-within > ${via}[data-ui-items-host] > ${row}`), /transition:/, row);
        assert.equal(rules(`${host}${focus} > ${via}[data-ui-items-host] > ${row}[data-ui-row-focus]:not([data-ui-selected])`), "", `${host}'s root still lights the row`);
    }

    // A listbox, a grid and a tree keep the focus on the root, which names the row.
    assert.match(rules(`.ui-items-view:not([role="list"])${focus} > [data-ui-items-host] > .ui-items-view__item[data-ui-row-focus]:not([data-ui-selected])`), /background-color: var\(--ui-wash-hover\);/);
    assert.match(rules(`.ui-table[role="grid"]${focus} > .ui-table__scroll > [data-ui-items-host] > .ui-table__row[data-ui-row-focus] > [data-ui-cell-focus]`), /background-image: linear-gradient\(var\(--ui-wash-hover\), var\(--ui-wash-hover\)\);/);
});

test("a wrap list's tile holds the focus itself, its row being display: contents: the washes and no ring of its own are the tile's", () => {
    const focus = ":focus:not([data-ui-pointer-focus])";
    const tile = rules(`.ui-items-view--wrap[role="list"] > [data-ui-items-host] > .ui-items-view__item[data-ui-row-focus] > [data-ui-id]${focus}`);

    assert.match(tile, /--ui-row-wash: var\(--ui-wash-hover\);/);
    assert.match(tile, /--ui-row-cursor-wash: var\(--ui-wash-hover\);/);
    assert.match(tile, /outline: none;/);
    assert.match(rules(`.ui-items-view--wrap[role="list"] > [data-ui-items-host] > .ui-items-view__item > [data-ui-id]:focus`), /outline: none;/);
    // A wrap listbox keeps the focus on its root, which lights the tile.
    assert.match(rules(`.ui-items-view--wrap:not([role="list"])${focus} > [data-ui-items-host] > .ui-items-view__item[data-ui-row-focus] > [data-ui-id]`), /--ui-row-wash: var\(--ui-wash-hover\);/);
    assert.doesNotMatch(css, /\.ui-items-view--wrap:focus/, "a wrap list's root never lights a tile");
});

test("a pinned table's focused row keeps its layer above its pinned cells", () => {
    const row = ".ui-table.ui-table--pinned[role=\"table\"] > .ui-table__scroll > [data-ui-items-host] > .ui-table__row[data-ui-row-focus]:focus:not([data-ui-pointer-focus])";

    assert.match(rules(row), /position: relative;/);
    assert.match(rules(`${row}::after`), /outline: inherit;/);
});

test("a quiet expander's header aligns its words flush at rest while its hover/focus pill protrudes by its padding", () => {
    const header = rules(".ui-expander--quiet > .ui-expander__header");

    assert.match(header, /width: fit-content;/);
    assert.match(header, /max-width: calc\(100% \+ 2 \* 0\.5rem\);/);
    assert.match(header, /margin: -0\.25rem -0\.5rem;/);
    assert.match(header, /padding: 0\.25rem 0\.5rem;/);
    assert.match(header, /border-radius: var\(--ui-radius-button\);/);
    assert.match(css, /\.ui-expander--quiet:not\(\.ui-disabled\):not\(\.ui-loading\):not\(:disabled\):where\(:not\(\[data-ui-popup-hover\]\)\) > \.ui-expander__header:focus-visible:not\(\[data-ui-pointer-focus\]\) \{\s*background-color: var\(--ui-wash-hover\);\s*color: var\(--ui-faint-base, var\(--ui-color-on-surface\)\);/);
});

test("a component that clips its children leaves an outside focus ring its reach in forced colours", () => {
    assert.match(rules("[data-ui-id][style*=\"overflow: clip\"]"), /overflow-clip-margin: 8px;/);
    assert.match(rules(".ui-expander:not(.ui-expander--quiet)[data-ui-id][style*=\"overflow: clip\"]"), /overflow-clip-margin: 0px;/);
    assert.match(rules(".ui-expander.ui-expander--quiet"), /border-radius: var\(--ui-border-radius-xxl, .*, 0\)+;/);
});

test("a tab's caption and a panel's pin answer keyboard focus with the same wash and ink as pointer hover", () => {
    assert.match(rules(".ui-tab-caption::after"), /bottom: -2px;\s*left: 0;\s*height: 2px;/);
    assert.doesNotMatch(css, /\.ui-tab-item__caption:(?:hover|active)(?::not\([^)]*\))? \{\s*background:/);
    assert.match(css, /:is\(\.ui-collapsible__toggle, \.ui-collapsible__pin\):hover \{\s*color: var\(--ui-faint-base, var\(--ui-color-on-surface\)\);/);
    assert.doesNotMatch(css, /\.ui-notification__close[^{}]*\{[^{}]*opacity/);
});

test("a file or image picker's trigger and add tile answer keyboard focus with the same ink or wash as pointer hover and no ring", () => {
    const filePickFocus = rules(".ui-file-input__pick:focus-visible:not([data-ui-pointer-focus]):not([aria-disabled='true'])");
    const filePickWithin = rules(".ui-file-input:not(.ui-disabled):not(.ui-readonly) > .ui-file-input__row[data-ui-focus-within='keyboard'] > .ui-file-input__pick:not([aria-disabled='true'])");
    const filePickFrame = rules(".ui-file-input__pick:focus-visible:not([data-ui-pointer-focus])");
    const imagePickFocus = rules(".ui-image-input:not(.ui-disabled):not(.ui-readonly) > .ui-image-input__surface:not(.ui-loading):focus-visible:not([data-ui-pointer-focus]) > .ui-image-input__pick");
    const imageAddHover = rules(".ui-image-input:not(.ui-disabled):not(.ui-readonly) .ui-image-input__add:hover");
    const imageAddFocus = rules(".ui-image-input:not(.ui-disabled):not(.ui-readonly) .ui-image-input__add:focus-visible:not([data-ui-pointer-focus])");

    assert.match(filePickFocus, /color: var\(--ui-color-on-surface\);/);
    assert.match(filePickWithin, /color: var\(--ui-color-on-surface\);/);
    assert.match(filePickFrame, /outline: none;/);
    assert.match(imagePickFocus, /color: var\(--ui-color-on-surface\);/);
    assert.match(imageAddHover, /background: var\(--ui-wash-hover\);/);
    assert.match(imageAddFocus, /background: var\(--ui-wash-hover\);/);
    assert.match(imageAddFocus, /outline: none;/);
});
