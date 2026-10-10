// The keyboard's frame is one shape wherever it is drawn: a 2 px line whose corners are the theme's button radius. A row, a cell and
// an entry take that corner while framed; a card insets the frame until concentric; a toggle's row and a link stand it outside,
// taking the corner that keeps the frame's own; a clipping component leaves it its reach.

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

test("a row takes the frame's corner while the keyboard is on it, the frame on its edge", () => {
    const row = rules(".ui-tree:focus:not([data-ui-pointer-focus]) > [data-ui-items-host] > .ui-tree__row[data-ui-row-focus]:not([data-ui-selected])");

    assert.match(row, /border-radius: var\(--ui-radius-button\);/);
    assert.match(row, /outline-offset: -2px;/);
});

test("an expander's header takes a card's corner and the frame insets from it to keep its own", () => {
    const header = rules(".ui-expander__header:focus-visible:not([data-ui-pointer-focus])");

    assert.match(header, /border-radius: var\(--ui-radius-card\);/);
    assert.match(header, /outline-offset: calc\(var\(--ui-radius-button\) - var\(--ui-radius-card\) - 2px\);/);
});

test("a toggle's row and a link stand the frame outside, taking the corner that keeps the frame's own", () => {
    const row = rules(".ui-checkbox[data-ui-focus-within='keyboard']");

    assert.match(row, /border-radius: calc\(var\(--ui-radius-button\) - 2px - 2px\);/);
    assert.match(row, /outline-offset: 2px;/);
    assert.match(rules(".ui-link:focus-visible:not([data-ui-pointer-focus])"), /outline-offset: 2px;/);
});

test("a component that clips its children leaves an outside frame its reach", () => {
    assert.match(rules("[data-ui-id][style*=\"overflow: clip\"]"), /overflow-clip-margin: 4px;/);
});

test("no keyboard frame is drawn in another shape: every brand-ink or words-ink outline is the frame's line", () => {
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*outline: 2px solid (?:var(--ui-color-primary-ink)|currentColor)[^{}]*)\}/g)) {
        const body = match[2];

        assert.match(body, /outline-offset: (-2px|0px|2px|calc\(var\(--ui-radius-button\) - [^;]+\));/, `${match[1].trim().slice(0, 120)} draws a frame of another shape`);
    }
});
