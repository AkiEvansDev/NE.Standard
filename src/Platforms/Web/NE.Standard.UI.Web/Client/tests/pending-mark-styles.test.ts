// The pending mark's look, read off the compiled stylesheet: a press waiting on a late answer wears the loading look — a button its
// ring in the icon's place or over a fading label, a row or a card the veil and the ring — and an author's loading is never marked over.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The bodies of the rules whose selector list names `selector`, by the list's text: a selector with `:not()` holds commas of its own. */
function bodiesOf(selector: string): string[] {
    return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
        .filter(match => match[1].split(/,\s*\n/).some(part => part.trim() === selector))
        .map(match => match[2]);
}

test("a waiting row or card wears the loading veil and ring, and the progress cursor shows on whatever is marked", () => {
    const veiled = "[data-ui-pending]:not(.ui-loading, .ui-disabled, .ui-button, .ui-tab-item, .ui-icon, .ui-file-tile, [data-ui-input-prefix-icon])";

    assert.ok(bodiesOf(veiled).some(body => body.includes("position: relative;")), "the veil has nothing to stand in");
    assert.ok(bodiesOf(`${veiled}::after`).some(body => body.includes("background: color-mix(in srgb, var(--ui-color-background) 65%, transparent);")), "no veil, or not the loading one");
    assert.ok(bodiesOf(`${veiled}::before`).some(body => /animation: ui-spin\b/.test(body)), "no ring over the veil");
    assert.ok(bodiesOf("[data-ui-pending]:not(.ui-loading)").some(body => body.includes("cursor: progress !important")), "no progress cursor");
});

test("a waiting button wears its loading look: the ring in its icon's place, or over a label that fades", () => {
    const ringed = (selector: string): boolean => bodiesOf(selector).some(body => /animation: ui-spin\b/.test(body));

    assert.ok(ringed(".ui-button[data-ui-pending][data-ui-text-icon] .ui-text__icon::before"), "a button's icon does not turn into the ring");
    assert.ok(ringed(".ui-button[data-ui-pending]:not([data-ui-text-icon])::before"), "a button with no icon shows no ring");
    assert.ok(bodiesOf(".ui-button[data-ui-pending]:not([data-ui-text-icon]) > .ui-button__content").some(body => body.includes("opacity: 0.35")), "a button's label does not fade under the ring");
});
