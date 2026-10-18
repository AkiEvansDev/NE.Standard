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

test("no keyboard frame is drawn in another shape: every keyboard-mark or words-ink outline is the frame's line", () => {
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*outline: 2px solid (?:var\(--ui-mark-keyboard\)|currentColor)[^{}]*)\}/g)) {
        const body = match[2];

        assert.match(body, /outline-offset: (-2px|0px|2px|calc\(var\(--ui-radius-button\) - [^;]+\)|calc\(-2px - var\(--ui-border-width, 1px\)\));/, `${match[1].trim().slice(0, 120)} draws a frame of another shape`);
    }
});

test("a tab's caption on every strip frames itself on its edges, its foot square on the chosen line, rounded above as every frame", () => {
    const tabs = ".ui-tab-caption:focus-visible:not([data-ui-pointer-focus])";
    const others = [".ui-color-input__tab:focus-visible:not([data-ui-pointer-focus])", ".ui-tab-item__caption[data-ui-focus-within='keyboard']"];

    assert.match(rules(tabs), /outline: 2px solid var\(--ui-mark-keyboard\);/);
    // A Tabs caption is a root an author's corners are written on: its corner goes through their chain.
    assert.match(rules(tabs), /border-radius: var\(--ui-border-radius-xxl, .*var\(--ui-radius-button\) var\(--ui-radius-button\) 0 0\)+;/);

    for (const caption of [tabs, ...others]) {
        assert.match(rules(caption), /outline-offset: -2px;/, caption);
        // The box reaches 2 px down, over the 2 px line, and its margin takes that back: nothing moves, and the frame's foot, 2 px in
        // from the reached edge, lies on the line — where the mark, placed from the padding box, still is.
        assert.match(rules(caption), /margin-bottom: -2px;/, caption);
        assert.match(rules(caption), /border-bottom: 2px solid transparent;/, caption);
    }

    for (const caption of others)
        assert.match(rules(caption), /border-radius: var\(--ui-radius-button\) var\(--ui-radius-button\) 0 0;/, caption);

    // The mark is the line the foot lies on: 2 px under the padding box, as wide as the frame's line.
    assert.match(rules(".ui-tab-caption::after"), /bottom: -2px;\s*left: 0;\s*height: 2px;/);
    // A TabsView caption's wash stays in its own box, under the pointer too.
    assert.match(rules(".ui-tab-item__caption[data-ui-focus-within='keyboard']"), /background-clip: padding-box;/);
    assert.doesNotMatch(css, /\.ui-tab-item__caption:(?:hover|active)(?::not\([^)]*\))? \{\s*background:/);

    // Still no pressable's plain frame: a frame on the caption's edge would lie on its chosen line.
    const pressables = [...css.matchAll(/:where\(([^{}]*)\):focus-visible:not\(\[data-ui-pointer-focus\]\)\s*\{/g)].find(match => match[1].includes(".ui-collapsible__toggle"));

    assert.ok(pressables?.[1].includes(".ui-button:not(.ui-tab-caption, .ui-tab-item__label,"));
});

test("a panel's pin takes the keyboard's frame and the ink under the pointer, as its switch does", () => {
    const pressables = [...css.matchAll(/:where\(([^{}]*)\):focus-visible:not\(\[data-ui-pointer-focus\]\)\s*\{([^{}]*)\}/g)].find(match => match[1].includes(".ui-collapsible__toggle"));

    assert.ok(pressables !== undefined);
    assert.ok(pressables[1].includes(".ui-collapsible__pin"));
    assert.match(pressables[2], /outline: 2px solid var\(--ui-mark-keyboard\);/);

    assert.match(css, /:is\(\.ui-collapsible__toggle, \.ui-collapsible__pin\):hover \{\s*color: var\(--ui-faint-base, var\(--ui-color-on-surface\)\);/);
});

test("a toast's cross is a button and takes a button's keyboard frame, with no resting fade to lift", () => {
    const pressables = [...css.matchAll(/:where\(([^{}]*)\):focus-visible:not\(\[data-ui-pointer-focus\]\)\s*\{([^{}]*)\}/g)].find(match => match[1].includes(".ui-collapsible__toggle"));

    assert.ok(pressables !== undefined);
    assert.ok(pressables[1].startsWith(".ui-button:not("));
    assert.ok(!pressables[1].includes(".ui-notification__close"), "listed on its own beside the buttons it now is");
    assert.doesNotMatch(css, /\.ui-notification__close[^{}]*\{[^{}]*opacity/);
});

test("a frame meeting a chosen line stays straight on the line's side, rounded on the others, and lies on the line", () => {
    // A menu's entry: the frame's corners are the frame's own but where the current entry's line stands, inside the entry's border.
    const entry = /\.ui-menu-item[^{}]*:focus-visible:not\(\[data-ui-pointer-focus\]\) \{([^{}]*)\}/g;
    const bodies = [...css.matchAll(entry)].map(match => match[1]).join("");

    assert.match(bodies, /var\(--ui-menu-frame-tl, var\(--ui-radius-button\)\) var\(--ui-menu-frame-tr, var\(--ui-radius-button\)\) var\(--ui-menu-frame-br, var\(--ui-radius-button\)\) var\(--ui-menu-frame-bl, var\(--ui-radius-button\)\)/);
    assert.match(bodies, /outline-offset: calc\(-2px - var\(--ui-border-width, 1px\)\);/);

    for (const [side, corners] of [["left", ["tl", "bl"]], ["right", ["tr", "br"]], ["top", ["tl", "tr"]], ["bottom", ["br", "bl"]]] as const) {
        const body = rules(`.ui-menu.ui-side--${side} .ui-menu-item--selected`);

        for (const corner of ["tl", "tr", "br", "bl"])
            assert.match(body, new RegExp(`--ui-menu-frame-${corner}: ${(corners as readonly string[]).includes(corner) ? "0" : "initial"};`), `${side} ${corner}`);
    }

    // A bar's current entry draws its line along its bottom whatever the side; a flyout's draws none.
    assert.match(rules(".ui-menu.ui-orientation--horizontal .ui-menu-item--selected"), /--ui-menu-frame-tl: initial;\s*--ui-menu-frame-tr: initial;\s*--ui-menu-frame-br: 0;\s*--ui-menu-frame-bl: 0;/);
    assert.match(rules(".ui-menu .ui-menu__submenu[data-ui-menu-flyout] .ui-menu-item--selected"), /--ui-menu-frame-tl: initial;\s*--ui-menu-frame-tr: initial;\s*--ui-menu-frame-br: initial;\s*--ui-menu-frame-bl: initial;/);

    // A chosen row's line is on its leading edge.
    assert.match(css, /\.ui-items-view__item\[data-ui-row-focus\]\[data-ui-selected\] \{[^{}]*border-radius: var\(--ui-radius-button\);\s*border-top-left-radius: 0;\s*border-bottom-left-radius: 0;/);
});
