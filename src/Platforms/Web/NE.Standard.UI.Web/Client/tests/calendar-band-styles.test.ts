// A period's band read back from the compiled stylesheet: one strip under the days, across the grid's gap, from an end's middle to
// the other's, rounded where a week breaks it.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector is exactly `selector`, joined. */
function declarationsOf(selector: string): string {
    const found: string[] = [];
    let at = css.indexOf(`\n${selector} {`);

    while (at >= 0) {
        found.push(css.slice(at + selector.length + 3, css.indexOf("}", at)));
        at = css.indexOf(`\n${selector} {`, at + 1);
    }

    return found.join("\n");
}

const day = ".ui-temporal-input__day";
const banded = `${day}:is(${day}--within, ${day}--preview, ${day}--period-start, ${day}--period-end, ${day}--preview-start)`;

test("the band lies under the days, in the grid's own stacking context, across the gap", () => {
    assert.match(declarationsOf(".ui-temporal-input__days"), /isolation: isolate;/);
    assert.match(declarationsOf(`${banded}::before`), /z-index: -1;[\s\S]*inset-inline: -1px;[\s\S]*background: var\(--ui-temporal-day-tint\);/);
});

test("an end's band starts at its middle, outranking a week's rounded edge", () => {
    assert.match(declarationsOf(`.ui-temporal-input__days > ${day}:is(${day}--period-start, ${day}--preview-start)::before`), /inset-inline-start: 50%;/);
    assert.match(declarationsOf(`.ui-temporal-input__days > ${day}:is(${day}--period-end, ${day}--preview-end)::before`), /inset-inline-end: 50%;/);
    assert.match(declarationsOf(`${banded}:nth-child(7n + 1)::before`), /inset-inline-start: 0;[\s\S]*border-start-start-radius/);
});

test("a day within keeps no tinted pill of its own", () => {
    assert.doesNotMatch(css, /\.ui-temporal-input__day--within[^{]*\{[^}]*background-image/);
});
