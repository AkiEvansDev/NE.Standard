// Read back from the compiled stylesheet: what forced colours would drop is drawn again in system colours — a toast's tone bar as a
// border, a toggle's keyboard frame, every focused field's edge, a badge's and a chip's shape, an empty badge's dot — a toast's
// shadow lies under the stack on a layer of its own, and the toasts' host, a popover, wears none of the browser's popover box.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The contents of every block opened by `header`, braces balanced. */
function blocksOf(text: string, header: string): string[] {
    const blocks: string[] = [];

    for (let start = text.indexOf(header); start >= 0; start = text.indexOf(header, start + header.length)) {
        const open = text.indexOf("{", start);
        let depth = 0;

        for (let index = open; index < text.length; index++) {
            if (text[index] === "{")
                depth++;
            else if (text[index] === "}" && --depth === 0) {
                blocks.push(text.slice(open + 1, index));
                break;
            }
        }
    }

    return blocks;
}

/** The declarations of every innermost rule of `text` one of whose selectors is exactly `selector`, joined. */
function bodiesOf(text: string, selector: string): string {
    return [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
        .filter(match => match[1].split(/,\s*(?![^()]*\))/).map(part => part.trim()).includes(selector))
        .map(match => match[2])
        .join("\n");
}

const forced = blocksOf(css, "@media (forced-colors: active)").join("\n");
const tones = ["info", "success", "warning", "danger", "primary", "accent"];

test("a toast's tone is a border down its left edge, which forced colours keep, in each tone's ink", () => {
    const bar = bodiesOf(css, ".ui-notification::before");

    assert.match(bar, /border-left: \d+px solid var\(--ui-notification-accent, var\(--ui-color-border\)\);/);
    assert.doesNotMatch(bar, /background/);

    for (const tone of tones)
        assert.match(bodiesOf(css, `.ui-notification--${tone}`), new RegExp(`--ui-notification-accent: var\\(--ui-color-${tone}-ink\\);`), tone);
});

test("a toast's shadow lies on a layer of its own under the toast, so it never falls over the next toast's edge", () => {
    const toast = bodiesOf(css, ".ui-notification");
    const shadow = bodiesOf(css, ".ui-notification::after");

    assert.match(toast, /position: relative;/);
    assert.doesNotMatch(toast, /box-shadow/);
    assert.match(shadow, /z-index: -1;/);
    assert.match(shadow, /inset: calc\(-1 \* var\(--ui-border-width, 1px\)\);/);
    assert.match(shadow, /box-shadow: /);
});

test("the toasts' host undoes the browser's popover box before it stands in its corner", () => {
    const host = bodiesOf(css, ".ui-notification-host");

    assert.match(host, /inset: auto;\s*margin: 0;\s*border: 0;\s*background: none;\s*color: inherit;\s*overflow: visible;[\s\S]*right: /);
    assert.match(host, /padding: 1rem;/);
    assert.match(bodiesOf(css, '[data-ui-notifications="top"] .ui-notification-host'), /top: 0;\s*bottom: auto;/);
});

test("in forced colours, the keyboard's toggle row is framed, its input being hidden with its ring", () => {
    const frame = bodiesOf(forced, ":is(.ui-checkbox, .ui-switch, .ui-radio-group__item, .ui-multi-select__check)[data-ui-focus-within='keyboard']");

    assert.match(frame, /outline: 2px solid Highlight;\s*outline-offset: 2px;/);
});

test("in forced colours, the keyboard's row of a key-value list, a table and a list is framed dashed on its own focus, in the selection colour where it is chosen", () => {
    const focus = ":focus:not([data-ui-pointer-focus])";
    const rows = [
        `.ui-key-value-action > [data-ui-items-host] > .ui-key-value-action__row[data-ui-row-focus]${focus}`,
        `.ui-table[role="table"] > .ui-table__scroll > [data-ui-items-host] > .ui-table__row[data-ui-row-focus]${focus}`,
        `.ui-items-view[role="list"]:not(.ui-items-view--wrap) > [data-ui-items-host] > .ui-items-view__item[data-ui-row-focus]${focus}`
    ];

    for (const row of rows) {
        assert.match(bodiesOf(forced, row), /outline: 2px dashed CanvasText;\s*outline-offset: -2px;/, row);
        assert.match(bodiesOf(forced, `${row}[data-ui-selected]`), /outline-color: Highlight;/, row);
    }

    // A wrap list's tile holds it for its row, display: contents.
    const tile = `.ui-items-view--wrap[role="list"] > [data-ui-items-host] > .ui-items-view__item[data-ui-row-focus]`;

    assert.match(bodiesOf(forced, `${tile} > [data-ui-id]${focus}`), /outline: 2px dashed CanvasText;/);
    assert.match(bodiesOf(forced, `${tile}[data-ui-selected] > [data-ui-id]${focus}`), /outline-color: Highlight;/);

    // A listbox and a grid still hold the focus on the root.
    assert.match(bodiesOf(forced, `.ui-items-view:not(.ui-items-view--wrap, [role="list"])${focus} > [data-ui-items-host] > .ui-items-view__item[data-ui-row-focus]`), /outline: 2px dashed CanvasText;/);
    assert.doesNotMatch(forced, /\.ui-key-value-action:focus/, "a key-value list's root never holds the focus");
});

test("in forced colours, every focused field shows its focus in the selection colour, its edge's colour and shadow being dropped", () => {
    assert.match(forced, /:not\(\.ui-disabled\) > :is\(\.ui-text-input__row, [^)]*\.ui-field-box, \.ui-image-input__surface\):focus-within:where\(:not\(\[data-ui-pointer-focus\], \[data-ui-focus-within='pointer'\]\)\) \{\s*outline: 2px solid Highlight;\s*outline-offset: -2px;/);
    assert.doesNotMatch(forced, /\.ui-input--no-focus-edge:not\(\.ui-disabled\)/, "the field told to draw no edge is one of every field");

    // The active edge's mixin carries it too, so an own field-shaped control and a package's field show it as well.
    const active = blocksOf(css, "@media (forced-colors: active)").filter(block => block.includes(".ui-color-input__field-input"));

    assert.ok(active.some(block => block.includes("outline: 2px solid Highlight;")), "the colour picker's own fields show no focus in forced colours");
});

test("in forced colours, a badge and a chip keep their shape by an edge, and an empty badge is a dot of the text's colour", () => {
    const edged = bodiesOf(forced, ".ui-badge:not(.ui-badge-variant--plain)");

    assert.match(edged, /outline: 1px solid CanvasText;\s*outline-offset: -1px;/);
    assert.equal(bodiesOf(forced, ".ui-multi-select__chip"), edged);

    const dot = bodiesOf(forced, ".ui-badge:not([data-ui-badge-icon], [data-ui-badge-title], .ui-badge-variant--plain)");

    assert.match(dot, /forced-color-adjust: none;\s*background: CanvasText;/);
    assert.ok(forced.includes(".ui-text__badge[data-ui-badge-set]:not([data-ui-badge-title], [data-ui-badge-icon]) {"), "a menu's dot vanishes in forced colours");
});
