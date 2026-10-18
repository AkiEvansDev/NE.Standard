// A text's unsized picture icon under IconAlignment.Content is a tile of a definite size, read back from the compiled stylesheet:
// square, as tall as the title's line and one description line as the description draws it, centred on a block that runs on. As tall
// as the whole block it was circular — its width narrowed the words that set its height — and at a phone's width the words spilled
// under the next block.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

const Tile = ".ui-text__icon:is(.ui-icon--image, [data-ui-icon-failed]):not(.ui-icon-size--small, .ui-icon-size--medium, .ui-icon-size--large)";

/** Every rule as its selector and its declarations. */
const rules = Array.from(css.matchAll(/(?:^|\n)([^{}@\n][^{}]*)\{([^}]*)\}/g), match => ({ selector: match[1].trim(), body: match[2] }));

/** The declarations of the one rule whose selector ends with `end` and holds every one of `parts`. */
function tileRule(end: string, ...parts: string[]): string {
    const found = rules.filter(rule => rule.selector.endsWith(end) && parts.every(part => rule.selector.includes(part)));

    assert.equal(found.length, 1, `${parts.join(" ")} ${end}: ${found.length} rules`);

    return found[0].body;
}

test("the tile is a square the title's line tall, centred on its block, never stretched to it", () => {
    const tile = tileRule(`.ui-text--icon-content > ${Tile}`);

    assert.match(tile, /align-self: center;/);
    assert.match(tile, /height: 1lh;/);
    assert.match(tile, /line-height: inherit;/);
    assert.match(tile, /aspect-ratio: 1;/);
    assert.equal(rules.some(rule => rule.selector.endsWith(Tile) && rule.body.includes("align-self: stretch;")), false);
});

test("a description adds one line as it draws it: tight under a title, run on less its half-leading, or a line of its own", () => {
    for (const role of ["display", "title", "subtitle", "body", "caption", "overline"]) {
        const line = `var(--ui-text-${role}-line-height)`;
        const size = `var(--ui-text-${role}-font-size)`;
        const end = `.ui-text--icon-content.ui-text--description-${role} > ${Tile}`;

        assert.ok(tileRule(end, ":not(.ui-text--wrap)").includes(`height: calc(1lh + 1.2 * ${size});`), role);
        assert.ok(tileRule(end, ".ui-text--wrap.ui-text--icon-content").includes(`height: calc(1lh + (${line} + ${size}) / 2);`), role);
        assert.ok(tileRule(end, ":not(:is([data-ui-text-title]").includes(`height: ${line};`), role);
    }
});
