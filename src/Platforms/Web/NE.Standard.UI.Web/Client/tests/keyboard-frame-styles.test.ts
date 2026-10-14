// The keyboard's frame is one shape wherever it is drawn: a 2 px line whose corners are the theme's button radius. A row, a cell and
// an entry take that corner while framed; a card insets the frame until concentric; a toggle's row and a link stand it outside,
// taking the corner that keeps the frame's own; a quiet expander's line stands it in air of its own; a clipping component leaves it
// its reach.

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
    const header = rules(".ui-expander:not(.ui-expander--quiet) > .ui-expander__header:focus-visible:not([data-ui-pointer-focus])");

    assert.match(header, /border-radius: var\(--ui-radius-card\);/);
    assert.match(header, /outline-offset: calc\(var\(--ui-radius-button\) - var\(--ui-radius-card\) - 2px\);/);
});

test("a toggle's row and a link stand the frame outside, taking the corner that keeps the frame's own", () => {
    const row = rules(".ui-checkbox[data-ui-focus-within='keyboard']");

    assert.match(row, /border-radius: calc\(var\(--ui-radius-button\) - 2px - 2px\);/);
    assert.match(row, /outline-offset: 2px;/);
    assert.match(rules(".ui-link:focus-visible:not([data-ui-pointer-focus])"), /outline-offset: 2px;/);
});

test("a quiet expander's line stands its frame in air of its own, pulled back out so its words stay on the content's edge", () => {
    const header = rules(".ui-expander--quiet > .ui-expander__header");
    const framed = rules(".ui-expander--quiet > .ui-expander__header:focus-visible:not([data-ui-pointer-focus])");

    assert.match(header, /margin: -0\.25rem -6px;/);
    assert.match(header, /padding: 0\.25rem 6px;/);
    assert.match(framed, /outline-offset: -2px;/);
    assert.match(framed, /border-radius: var\(--ui-radius-button\);/);
});

test("a component that clips its children leaves an outside frame its reach", () => {
    // A quiet expander's frame reaches farthest: its 6 px of air round its words.
    assert.match(rules("[data-ui-id][style*=\"overflow: clip\"]"), /overflow-clip-margin: 6px;/);
    // A card's expander clips at its edge, its frames inside it; a quiet one keeps the reach for the frame round its line.
    assert.match(rules(".ui-expander:not(.ui-expander--quiet)[data-ui-id][style*=\"overflow: clip\"]"), /overflow-clip-margin: 0px;/);
    // Square unless authored: a clip margin keeps the box's curve, which cut the corners of the frame standing out past it.
    assert.match(rules(".ui-expander.ui-expander--quiet"), /border-radius: var\(--ui-border-radius-xxl, .*, 0\)+;/);
});

test("no keyboard frame is drawn in another shape: every brand-ink or words-ink outline is the frame's line", () => {
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*outline: 2px solid (?:var(--ui-color-primary-ink)|currentColor)[^{}]*)\}/g)) {
        const body = match[2];

        assert.match(body, /outline-offset: (-2px|0px|2px|calc\(var\(--ui-radius-button\) - [^;]+\));/, `${match[1].trim().slice(0, 120)} draws a frame of another shape`);
    }
});

test("a panel's pin takes the keyboard's frame and the ink under the pointer, as its switch does", () => {
    const pressables = [...css.matchAll(/:where\(([^{}]*)\):focus-visible:not\(\[data-ui-pointer-focus\]\)\s*\{([^{}]*)\}/g)].find(match => match[1].includes(".ui-collapsible__toggle"));

    assert.ok(pressables !== undefined);
    assert.ok(pressables[1].includes(".ui-collapsible__pin"));
    assert.match(pressables[2], /outline: 2px solid var\(--ui-color-primary-ink\);/);

    assert.match(css, /:is\(\.ui-collapsible__toggle, \.ui-collapsible__pin\):hover \{\s*color: var\(--ui-faint-base, var\(--ui-color-on-surface\)\);/);
});
