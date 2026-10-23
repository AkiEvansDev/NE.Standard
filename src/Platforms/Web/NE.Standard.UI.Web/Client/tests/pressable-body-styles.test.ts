// A button's body by its size and what it holds, read back from the compiled stylesheet: one rule (mixins/pressable.less) reaches a
// button's root and a split button's main part alike, so the main part's padding, alignment, icon gap and busy fade are never restated.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector list is exactly `selector`, joined; empty where there is none. */
function declarations(selector: string): string {
    const pattern = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`, "g");

    return [...css.matchAll(pattern)].map(match => match[1]).join("");
}

// From a modifier on the root down to the body: nothing for a button, the main part for a split button.
const paths = ["", ".ui-split-button > .ui-split-button__main"];

test("both shapes take the padding of each size from the one rule", () => {
    assert.match(declarations(".ui-button"), /padding: var\(--ui-padding-xxl, .*0\.5rem 1rem\)/);
    assert.match(declarations(".ui-split-button__main"), /padding: var\(--ui-padding-xxl, .*0\.5rem 1rem\)/);

    for (const path of paths) {
        assert.match(declarations(`.ui-button--small${path}`), /0\.25rem 0\.5rem\)/, `small${path}`);
        assert.match(declarations(`.ui-button--large${path}`), /0\.75rem 1\.5rem\)/, `large${path}`);
    }
});

test("both shapes align, gap and fade their label by the same rules", () => {
    for (const path of paths) {
        const content = `${path} > .ui-button__content`;

        assert.match(declarations(`.ui-button.ui-button--align-start${path}`), /justify-content: flex-start;/, path);
        assert.match(declarations(`.ui-button.ui-button--align-end${path}`), /justify-content: flex-end;/, path);
        assert.match(declarations(`.ui-button${content}.ui-text--align-justify`), /justify-content: stretch;/, path);
        assert.match(declarations(`.ui-button[data-ui-text-description]${path} > .ui-text--align-center`), /text-align: start;/, path);
        assert.match(declarations(`.ui-button[data-ui-text-icon]:not([data-ui-text-title])${content}`), /gap: 0;/, path);
        assert.match(declarations(`.ui-button.ui-loading:not([data-ui-text-icon])${content},\n.ui-button[data-ui-pending]:not([data-ui-text-icon])${content}`), /opacity: 0\.35;/, path);
    }
});
