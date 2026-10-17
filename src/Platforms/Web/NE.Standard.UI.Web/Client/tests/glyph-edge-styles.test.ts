// A glyph edge (StackPanel.GlyphEdge) hangs the first or last icon-only quiet button it shows past the edge by its glyph's inset, read
// back from the compiled stylesheet: a drawer's own button the shell hides for its side's state is not the one shown, a row on the
// edge passes it on to its own child, and each size reads its inset from one rule.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The edge's rules, one per band: a selector reading the edge's last shown child and the declarations it hangs by. */
const endRules = [...css.matchAll(/([^{}]*glyph-end > :nth-last-child\(1 of [^{}]*)\{([^}]*)\}/g)].map(match => ({ selector: match[1], body: match[2] }));

test("each band hangs the edge's button once for every size, by the inset its size sets", () => {
    assert.equal(endRules.length, 5, "one rule per width band, not one per band and size");

    for (const rule of endRules)
        assert.match(rule.body, /margin-inline-end: calc\(-1 \* var\(--ui-glyph-inset\) \* var\(--ui-glyph-hang-end, 1\)\);/);

    assert.match(css, /--ui-glyph-inset: calc\(\(2\.5rem - 1\.125rem\) \/ 2\);/, "a medium button's 40 px box round its 18 px glyph: 11 px");
    assert.match(css, /\.ui-button--small \{\s*--ui-glyph-inset: calc\(\(1\.75rem - 1rem\) \/ 2\);/, "a small one's 28 px round 16 px: 6 px");
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

test("a row on the edge passes it on to its own last child", () => {
    for (const rule of endRules)
        assert.match(rule.selector, /\)\)\.ui-orientation--horizontal > :nth-last-child\(1 of /);
});
