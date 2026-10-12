// The lightbox's look read back from the compiled stylesheet: the arrows show for a hovering pointer only while it is over the picture
// or the keyboard's focus is on one; the counter keeps one width through a set; the strip's three figures stand a pitch apart, its gap
// the one lightbox.ts slides by, and move at once while held still.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css.replace(/\/\*[\s\S]*?\*\//g, "");

/** The bodies of the rules whose selector list holds `selector` exactly, each with the `@media` it stands in, if any. */
function rules(selector: string): { readonly media: string | null; readonly body: string }[] {
    const found: { media: string | null; body: string }[] = [];

    // After the brace that ends the rule before, not taking it, so two rules in a row are both read.
    for (const match of css.matchAll(/(?<=^|[{}])\s*([^{}@]+?)\s*\{([^{}]*)\}/g)) {
        if (!match[1].split(",").map(part => part.trim()).includes(selector))
            continue;

        const before = css.slice(0, match.index);
        const media = before.lastIndexOf("@media");
        const inside = media >= 0 && (before.slice(media).match(/\{/g)?.length ?? 0) > (before.slice(media).match(/\}/g)?.length ?? 0);

        found.push({ media: inside ? before.slice(media, before.indexOf("{", media)).trim() : null, body: match[2] });
    }

    return found;
}

test("the arrows hide where a pointer hovers unless it is over the picture or the keyboard's focus is on an arrow", () => {
    const hiding = rules(".ui-lightbox__figure:not(:hover) > .ui-lightbox__nav:not([data-ui-focus-within='keyboard'])");

    assert.equal(hiding.length, 1);
    assert.equal(hiding[0].media, "@media (hover: hover)");
    assert.match(hiding[0].body, /opacity:\s*0/);

    // A pointer's focus left on the arrow it pressed is no reason to keep them up once the pointer is gone.
    assert.doesNotMatch(css, /\.ui-lightbox__nav:not\(:focus-within\)/);
    assert.ok(rules(".ui-lightbox__nav").every(rule => !/opacity:\s*0/.test(rule.body)), "a screen without a hover shows them always");
});

test("the counter holds the width of its widest words in one cell with the shown ones, its digits all one width", () => {
    const counter = rules(".ui-lightbox__counter")[0];

    assert.match(counter.body, /display:\s*inline-grid/);
    assert.match(counter.body, /font-variant-numeric:\s*tabular-nums/);
    assert.match(counter.body, /white-space:\s*nowrap/);

    for (const part of [".ui-lightbox__count", ".ui-lightbox__count-room"])
        assert.ok(rules(part).some(rule => /grid-area:\s*1 \/ 1/.test(rule.body)), `${part} stands in the counter's one cell`);

    assert.ok(rules(".ui-lightbox__count-room").some(rule => /visibility:\s*hidden/.test(rule.body)));
});

test("the strip's figures stand a pitch apart, the next one the way the page reads, and move at once while it is held still", () => {
    const figure = rules(".ui-lightbox__figure")[0];
    const gap = /\(100cqw \+ (\d+)px\)/.exec(figure.body)?.[1];
    const script = readFileSync(resolve(here, "../src/interactions/lightbox.ts"), "utf8");

    assert.match(figure.body, /var\(--ui-lightbox-slot\) \* var\(--ui-lightbox-way\)/);
    assert.match(figure.body, /var\(--ui-lightbox-shift, 0px\)/);
    assert.match(figure.body, /transition:\s*transform/);
    assert.ok(gap !== undefined);
    assert.match(script, new RegExp(`const SlideGap = ${gap};`), "the script slides by the stylesheet's gap");
    assert.match(rules('.ui-lightbox__figure[data-ui-lightbox-slot="previous"]')[0].body, /--ui-lightbox-slot:\s*-1/);
    assert.match(rules('.ui-lightbox__figure[data-ui-lightbox-slot="next"]')[0].body, /--ui-lightbox-slot:\s*1/);
    assert.match(rules(".ui-lightbox:dir(rtl) .ui-lightbox__stage")[0].body, /--ui-lightbox-way:\s*-1/);
    assert.match(rules(".ui-lightbox__stage[data-ui-lightbox-still] > .ui-lightbox__figure")[0].body, /transition:\s*none/);
});
