// Rules read back from the compiled stylesheet: a select's floor never runs it past the cell it stands in, and a field's actions are
// one compact height whatever stands among them — a split button, padded by its parts alone, or a flyout's anchor.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector list holds `selector` as one of its entries, joined. */
function declarationsOf(selector: string): string {
    const found: string[] = [];

    for (const rule of css.split("}")) {
        const open = rule.indexOf("{");

        if (open >= 0 && rule.slice(0, open).split(",").map(entry => entry.trim()).includes(selector))
            found.push(rule.slice(open + 1));
    }

    return found.join("\n");
}

test("a select's and a slider's floor yields to the room they stand in, as to an authored width", () => {
    for (const root of [".ui-select", ".ui-slider"])
        assert.match(declarationsOf(root), /min-width: [^;]*min\(min\(12rem, 100%\), var\(--ui-width-xxl/);
});

test("a split button among a field's actions keeps no padding of its own; its parts take the compact one", () => {
    for (const host of [".ui-text-input__action", ".ui-text-area__action"]) {
        assert.match(declarationsOf(`${host} > .ui-button`), /min-height: [^;]*1\.75rem/);
        // Padded here too, a split button stood 36px tall to the others' 28 and lifted the whole group off the text's line.
        assert.doesNotMatch(declarationsOf(`${host} > .ui-button`), /padding/);
        assert.match(declarationsOf(`${host} > .ui-button:not(.ui-split-button)`), /padding: [^;]*0\.25rem 0\.5rem\)/);
        assert.match(declarationsOf(`${host} > .ui-button > .ui-split-button__main`), /padding: [^;]*0\.25rem 0\.5rem\)/);
        assert.match(declarationsOf(`${host} > .ui-button[data-ui-text-icon]:not([data-ui-text-title]) > .ui-split-button__main`), /padding: [^;]*0\.25rem\)/);
        assert.match(declarationsOf(`.ui-input--small ${host} > .ui-button > .ui-split-button__main`), /padding: [^;]*0 0\.25rem\)/);
    }
});

test("a flyout among a field's actions has its anchor compacted as the field's other buttons are", () => {
    for (const host of [".ui-text-input__action", ".ui-text-area__action"]) {
        const anchor = `${host} > .ui-flyout > .ui-flyout__anchor > .ui-button`;

        assert.match(declarationsOf(anchor), /min-height: [^;]*1\.75rem/);
        assert.match(declarationsOf(`${anchor}:not(.ui-split-button)`), /padding: [^;]*0\.25rem 0\.5rem\)/);
        assert.match(declarationsOf(`${anchor}.ui-button--ghost`), /color: var\(--ui-text-muted\)/);
    }
});

test("an icon-only split button's root keeps no padding: an icon-only button's own would outrank the root's zero and pad its parts twice", () => {
    assert.match(declarationsOf(".ui-split-button.ui-button[data-ui-text-icon]:not([data-ui-text-title])"), /padding: [^;]*var\(--ui-padding, 0\)\)/);
});
