// A menu button with its chevron off (ShowChevron false) is its main part alone, read back from the compiled stylesheet: no end part,
// the main part rounded on both sides and, with an icon alone, square and padded as an icon button is; a split button keeps its end.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector list is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const match = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`).exec(css);

    return match?.[1] ?? null;
}

const NoChevron = ".ui-split-button--no-chevron[data-ui-split-mode=\"menu\"]";

test("a menu button without its chevron draws no end part and rounds its main part on both sides", () => {
    assert.match(declarations(`${NoChevron} > .ui-split-button__toggle`) ?? "", /display: none;/);
    assert.match(declarations(`${NoChevron} > .ui-split-button__main`) ?? "", /border-radius: inherit;/);
});

test("with an icon alone it is square, padded as an icon button", () => {
    assert.match(declarations(`${NoChevron}.ui-button[data-ui-text-icon]:not([data-ui-text-title])`) ?? "", /aspect-ratio: 1;/);
    assert.match(declarations(`${NoChevron}[data-ui-text-icon]:not([data-ui-text-title]) > .ui-split-button__main`) ?? "", /padding:/);
});

test("the main part keeps its tight end only where a chevron follows it", () => {
    assert.match(declarations(".ui-split-button[data-ui-split-mode=\"menu\"]:not(.ui-split-button--no-chevron) > .ui-split-button__main") ?? "", /padding-right:/);
    assert.equal(declarations(".ui-split-button[data-ui-split-mode=\"menu\"] > .ui-split-button__main"), null);
});
