// A text's title beside a badge with words, read back from the compiled stylesheet: short of room, the title gives way first, down to
// its own width or half the line, and only then do the badge's words ellipsise; a glyph or a count keeps its shape, and beside a count
// the title still gives way fully, as a browser that cannot reckon with an intrinsic size has it give way alone.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

const withWords = ":is([data-ui-text-badge-text] > .ui-text, [data-ui-text-badge-text] > :not([data-ui-id]) > .ui-text, [data-ui-text-badge-text].ui-text) > .ui-text__body > .ui-text__header";

/** The `@supports (flex-basis: calc-size(…))` block's own text. */
function intrinsicBlock(): string {
    const marker = "@supports (flex-basis: calc-size(max-content, size)) {";
    const at = css.indexOf(marker);

    assert.ok(at >= 0, "No block for an intrinsic flex basis.");

    return css.slice(at, css.indexOf("\n}", at));
}

/** The declarations of the block's rule for `part` beside a badge with text. */
function part(selector: string): string {
    const block = intrinsicBlock();
    const at = block.indexOf(`${withWords} > ${selector} {`);

    assert.ok(at >= 0, `No rule for ${selector}.`);

    return block.slice(block.indexOf("{", at) + 1, block.indexOf("}", at));
}

/** A rule's flex-shrink factor. */
function shrink(declarations: string): number {
    const factor = /flex-shrink: ([\d.]+);/.exec(declarations)?.[1];

    assert.ok(factor !== undefined, "No flex-shrink.");

    return Number(factor);
}

const title = part(".ui-text__title");
const words = part(".ui-text__badge[data-ui-badge-text]:not([data-ui-badge-text=\"compact\"])");

test("beside a badge with words the title starts from its own width or half the line, whichever is less, and grows as before", () => {
    assert.match(title, /flex-basis: calc-size\(max-content, min\(size, 50%\)\);/);
    assert.match(css, /\n\.ui-text__title \{\s*display: none;\s*flex: 1 1 auto;\s*min-width: 0;/, "its growth and its ellipsis are the title's own rule");
});

test("a badge with words then gives way, its words ellipsising and taking all but a sliver of the shortfall; a count stays round", () => {
    assert.match(words, /min-width: 0;/);
    assert.ok(shrink(words) >= 1000 * shrink(title), `the words (${shrink(words)}) against the title (${shrink(title)})`);
    assert.match(css, /\n\.ui-text__badge \{\s*display: none;\s*flex: 0 0 auto;/, "anywhere else the badge keeps its width");
    assert.match(css, /\.ui-badge__text \{[^}]*min-width: 0;/);
});

test("beside a count, which the root's mark does not tell from words, the title gives way fully rather than pushing the count out", () => {
    // A whole factor: flex shrinks items whose factors sum under one by that share of the shortfall only.
    assert.ok(shrink(title) >= 1, `the title's factor ${shrink(title)}`);
});
