// Read back from the compiled stylesheet: keyboard focus matches pointer hover across Link buttons, Surface split buttons, menu-mode
// split buttons, quiet-hover clickable surfaces, and completed step circles.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(match => ({ selector: match[1].trim(), body: match[2] }));

test("a link button keeps its brand ink and brightens its parts on keyboard focus", () => {
    const linkFocus = rules.find(rule => rule.selector.includes(".ui-button.ui-button--link") && rule.selector.includes(":focus-visible"));

    assert.ok(linkFocus !== undefined, "no keyboard-focus rule for .ui-button--link");
    assert.doesNotMatch(linkFocus.body, /(?:^|[\s;])color:/);

    const linkBrighten = rules.find(rule => rule.selector.includes(".ui-button.ui-button--link") && rule.selector.includes(":focus-visible") && rule.selector.includes("> :not("));

    assert.ok(linkBrighten !== undefined, "no part-brightening rule for .ui-button--link");
    assert.match(linkBrighten.body, /filter:\s*brightness\(1\.25\)/);
});

test("a surface split button washes its focused part rather than darkening it with the filled shade", () => {
    const splitSurface = rules.find(rule => rule.selector.includes('.ui-split-button:not([data-ui-split-mode="menu"]):is(') && rule.selector.includes(".ui-button--surface") && rule.selector.includes(":focus-visible"));

    assert.ok(splitSurface !== undefined, "no keyboard-focus wash rule for split .ui-button--surface");
    assert.match(splitSurface.body, /background-color:\s*var\(--ui-wash-hover\)/);
    assert.doesNotMatch(splitSurface.body, /black 10%/);
});

test("a menu-mode split button washes the whole root on keyboard focus within", () => {
    const menuGhost = rules.find(rule => rule.selector.includes('.ui-split-button[data-ui-split-mode="menu"]:is(.ui-button--ghost, .ui-button--outline)') && rule.selector.includes("[data-ui-focus-within='keyboard']"));

    assert.ok(menuGhost !== undefined, "no root keyboard-within wash rule for menu-mode split button");
    assert.match(menuGhost.body, /background-color:\s*var\(--ui-wash-hover\)/);
});

test("a quiet-hover clickable surface uses half the hover wash share on keyboard focus", () => {
    const quiet = rules.find(rule => rule.selector.includes(".ui-surface--clickable.ui-surface--quiet-hover") && rule.selector.includes(":focus-visible"));

    assert.ok(quiet !== undefined, "no keyboard-focus rule for .ui-surface--quiet-hover");
    assert.match(quiet.body, /calc\(var\(--ui-wash-hover-share\)\s*\/\s*2\)/);
});

test("a completed step circle preserves its 24x24 inline-flex box over the check glyph", () => {
    const completed = rules.find(rule => rule.selector === ".ui-steps__item[data-ui-step-completed]::before");

    assert.ok(completed !== undefined, "no rule for .ui-steps__item[data-ui-step-completed]::before");
    assert.match(completed.body, /display:\s*inline-flex[\s\S]*width:\s*24px[\s\S]*height:\s*24px/);
});
