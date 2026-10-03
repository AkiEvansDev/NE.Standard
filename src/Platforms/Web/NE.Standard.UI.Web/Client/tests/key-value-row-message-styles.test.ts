// An open key-value row is a form, read back from the compiled stylesheet: its field's message is a line under the field, not a
// corner mark, and the row stands its key, field and save and cancel pair in its first line, so the line grows the row below them
// and nothing above it moves; the closed row's dot is kept by the engine (validation-mark.test.ts).

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const Editing = ".ui-key-value-action__row[data-ui-row-editing]";
const Appearances = ":is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)";

/** The declarations of the first rule whose selector is exactly `selector`. */
function declarations(selector: string): string {
    const start = css.indexOf(`\n${selector} {`);

    assert.ok(start >= 0, `No rule for ${selector}.`);

    return css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("an open row's field speaks in a line, a table cell's in a mark, and the row still names the cell its dot goes to", () => {
    assert.match(declarations(".ui-table__cell [data-ui-validation-message],\n.ui-validation--marker > .ui-validation-message"), /--ui-validation-presentation: marker;/);
    assert.doesNotMatch(css, /\.ui-key-value-action__value-input \[data-ui-validation-message\][^{]*\{\s*--ui-validation-presentation: marker;/);
    assert.match(declarations(".ui-key-value-action__value-input [data-ui-validation-message]"), /--ui-validation-marker-host: ui-key-value-action__value;/);
});

test("an open row stands its cells in its first line, so a message line under the field moves neither the key nor the buttons", () => {
    const row = declarations(Editing);

    assert.match(row, /--ui-key-value-line: calc\(1\.75rem \+ 2px\);/);
    assert.match(row, /align-items: start;/);

    const sides = declarations(`${Editing} > :is(.ui-key-value-action__key, .ui-key-value-action__edit-action)`);

    assert.match(sides, /display: grid;/);
    assert.match(sides, /align-content: center;/);
    assert.match(sides, /min-height: var\(--ui-key-value-line\);/);
    assert.match(declarations(`${Editing} > .ui-key-value-action__value-input:has( > ${Appearances})`), /padding-top: calc\(\(var\(--ui-key-value-line\) - 1\.75rem\) \/ 2\);/);
    assert.match(declarations(`.ui-key-value-action__value-input > ${Appearances}`), /align-self: flex-start;/);
});
