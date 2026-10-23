// A glyph edge (StackPanel.GlyphEdge, and by default the core's own bands: a card header's far end, a tab strip's actions, a toast's
// close) hangs the first or last quiet button it shows past the edge by what stands between its box and what it shows — an icon's
// glyph, a label's words, a switcher's glyph — read back from the compiled
// stylesheet: a drawer's own button the shell hides for its side's state is not the one shown, a row on the edge passes it on to its
// own child, and each kind and size reads its inset from one rule.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The edge's rules, one per band: a selector reading the edge's last shown child and the declarations it hangs by. */
const endRules = [...css.matchAll(/([^{}]*ui-tabs__actions\) > :nth-last-child\(1 of [^{}]*)\{([^}]*)\}/g)].map(match => ({ selector: match[1], body: match[2] }));

/** The declarations of the rule whose selector ends with `ending`. */
function inset(ending: string): string {
    const match = new RegExp(`\\)${literal(ending)} \\{([^}]*)\\}`).exec(css);

    assert.ok(match, `no rule ending ${ending}`);

    return match[1];
}

function literal(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("each band hangs the edge's button once for every kind and size, by the inset its kind and size set", () => {
    assert.equal(endRules.length, 5, "one rule per width band, not one per band and size");

    for (const rule of endRules)
        assert.match(rule.body, /margin-inline-end: calc\(-1 \* var\(--ui-glyph-inset-end, var\(--ui-glyph-inset\)\) \* var\(--ui-glyph-hang-end, 1\)\);/);

    assert.match(css, /--ui-glyph-box: 2\.5rem;\s*--ui-glyph-size: 1\.125rem;\s*--ui-glyph-inset: calc\(\(var\(--ui-glyph-box\) - var\(--ui-glyph-size\)\) \/ 2\);/, "a medium button's 40 px box round its 18 px glyph: 11 px");
    assert.match(css, /\.ui-button--small \{\s*--ui-glyph-box: 1\.75rem;\s*--ui-glyph-size: 1rem;/, "a small one's 28 px round 16 px: 6 px");
});

test("an icon-only button with an IconSize of its own hangs by that glyph, which its root carries", () => {
    assert.match(inset("[data-ui-icon-size=\"small\"]"), /--ui-glyph-size: 0\.875rem;/);
    assert.match(inset("[data-ui-icon-size=\"medium\"]"), /--ui-glyph-size: 1\.25rem;/);
    assert.match(inset("[data-ui-icon-size=\"large\"]"), /--ui-glyph-size: 1\.5rem;/);
    // After the sizes and the switcher's own glyph, so an authored IconSize wins over both.
    assert.ok(css.indexOf("[data-ui-icon-size=\"small\"] {") > css.indexOf(".ui-button--link).ui-theme-switcher {"));
});

test("a quiet button with words hangs by its press's padding, a split button's end by its toggle's", () => {
    assert.match(inset("[data-ui-text-title]"), /--ui-glyph-inset: 1rem;/);
    assert.match(inset(".ui-button--small[data-ui-text-title]"), /--ui-glyph-inset: 0\.5rem;/);
    assert.match(inset(".ui-button--large[data-ui-text-title]"), /--ui-glyph-inset: 1\.5rem;/);
    assert.match(inset(".ui-split-button[data-ui-text-title]"), /--ui-glyph-inset-end: 0\.5rem;/);
    assert.match(inset(".ui-split-button--no-chevron[data-ui-split-mode=\"menu\"][data-ui-text-title]"), /--ui-glyph-inset-end: var\(--ui-glyph-inset\);/);
});

test("the switchers hang too: the theme switcher by its glyph, the language switcher by its press's padding", () => {
    assert.match(css, /\(\.ui-button--ghost, \.ui-button--link\)/);
    assert.match(css, /:is\(\.ui-button:is\(\[data-ui-text-icon\], \[data-ui-text-title\]\), \.ui-theme-switcher, \.ui-language-switcher\)/);
    assert.match(inset(".ui-theme-switcher"), /--ui-glyph-size: 1\.125rem;/);
    assert.match(inset(".ui-language-switcher"), /--ui-glyph-inset: 0\.75rem;/);
});

test("the core's own bands are edges by default: a card header's far end, but not a header that is only a control, and a tab strip's actions", () => {
    for (const rule of endRules)
        assert.match(rule.selector, /:is\(\.ui-stack-panel--glyph-end, \.ui-card__header--content > \.ui-card__header-action, \.ui-tabs__actions\)/);
});

test("a tab strip's action hangs by a field action's small box round its glyph, whatever the button's size", () => {
    assert.match(css, /\.ui-tabs__actions > :is\(\.ui-button:is\(\[data-ui-text-icon\], \[data-ui-text-title\]\), \.ui-theme-switcher, \.ui-language-switcher\):is\(\.ui-button--ghost, \.ui-button--link\),\n\.ui-tabs__actions > \.ui-tabs__tab-actions > [^{]*\{\s*--ui-glyph-box: 1\.75rem;/);
});

test("a tab strip's action with words hangs by a field action's 8 px padding, not its size's own, a flyout's anchor too", () => {
    const rule = /\n(\.ui-tabs__actions > [^{]*\[data-ui-text-title\]) \{([^}]*)\}/.exec(css);

    assert.ok(rule, "no rule for a tab strip's action with words");
    assert.match(rule[2], /--ui-glyph-inset: 0\.5rem;/);
    assert.match(rule[1], /\.ui-tabs__actions > \.ui-tabs__tab-actions > \.ui-flyout > \.ui-flyout__anchor > :is\(/);
    // After the button's own insets by size, which tie with it.
    assert.ok(rule.index > css.indexOf(".ui-button--large[data-ui-text-title] {"));
});

test("a toast's close hangs past the toast's end by its 6 px inset, its cross on the content's edge", () => {
    const close = /\n\.ui-notification__close \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(close, /--ui-glyph-inset: calc\(\(1\.75rem - 1rem\) \/ 2\);/);
    assert.match(close, /margin-inline-end: calc\(-1 \* var\(--ui-glyph-inset-end, var\(--ui-glyph-inset\)\) \* var\(--ui-glyph-hang-end, 1\)\);/);
});

test("a hidden child, as a tab's actions behind another tab, is not the one shown", () => {
    for (const rule of endRules)
        assert.match(rule.selector, /:not\(\.ui-hidden, \[hidden\], /);
});

test("a pinned side's own drawer button is not shown where a pin holds, and no pin is below the medium breakpoint", () => {
    const narrow = endRules.find(rule => rule.selector.includes("data-ui-visibility='collapsed'"));
    const medium = endRules.find(rule => rule.selector.includes("data-ui-visibility-md='collapsed'"));

    assert.ok(narrow !== undefined && medium !== undefined);
    assert.match(medium.selector, /\[data-ui-pinned-left-side\] \[data-ui-drawer-toggle='left-side'\]/);
    assert.match(medium.selector, /\[data-ui-pinned-right-side\] \[data-ui-drawer-toggle='right-side'\]/);
    assert.doesNotMatch(narrow.selector, /data-ui-pinned/, "below the medium breakpoint a pinned side is a drawer still");
    assert.match(narrow.selector, /\[data-ui-drawer-pin\][,)]/, "a pin means nothing there");
});

test("a language switcher with one language, which draws nothing, is not the one shown", () => {
    for (const rule of endRules)
        assert.match(rule.selector, /\.ui-language-switcher--single/);
});

test("a row on the edge passes it on to its own last child, as the tab in front's actions do", () => {
    for (const rule of endRules)
        assert.match(rule.selector, /\)\):is\(\.ui-orientation--horizontal, \.ui-tabs__tab-actions\) > :nth-last-child\(1 of /);
});
