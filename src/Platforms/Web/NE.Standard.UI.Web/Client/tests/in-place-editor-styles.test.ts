// A value's text that becomes its editor in place does not move, read back from the compiled stylesheet: every field publishes where
// its text stands (`--ui-field-inset`, its border and start padding), and an editor standing where a value stood is set back by
// exactly that — no constant, no cap — narrowing the padding where its host is short of room.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector is exactly `selector`, one after another. */
function rule(selector: string): string {
    let declarations = "";

    for (let start = css.indexOf(`\n${selector} {`); start >= 0; start = css.indexOf(`\n${selector} {`, start + 1))
        declarations += css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));

    assert.ok(declarations.length > 0, `No rule for ${selector}.`);

    return declarations;
}

const Border = "var(--ui-border-width, 1px)";
const Rows = ".ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .ui-select__trigger";
const Appearances = ":is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)";

test("every appearance and size publishes its text's inset, the start padding it draws and its border", () => {
    assert.match(rule(".ui-input--filled,\n.ui-input--tonal,\n.ui-input--outline"), new RegExp(`--ui-field-inset: calc\\(0\\.75rem \\+ ${escape(Border)}\\);`));
    assert.match(rule(".ui-input--ghost"), new RegExp(`--ui-field-inset: calc\\(0\\.5rem \\+ ${escape(Border)}\\);`));
    assert.match(rule(`.ui-input--ghost > :is(${Rows})`), /padding-left: 0\.5rem;/);
    assert.match(rule(".ui-input--small"), new RegExp(`--ui-field-inset: calc\\(0\\.375rem \\+ ${escape(Border)}\\);`));
    assert.match(rule(`.ui-input--small > :is(${Rows})`), /padding-left: 0\.375rem;/);
    assert.match(rule(".ui-input--underline"), /--ui-field-inset: 0px;/);
    assert.match(rule(".ui-input--underline.ui-input--small"), /--ui-field-inset: 0px;/);
});

test("a key-value row's editor is set back by its inset, uncapped, the inset narrowed to the column gap less a step", () => {
    const setBack = rule(`.ui-key-value-action__value-input > ${Appearances}`);

    assert.match(setBack, /calc\(-1 \* var\(--ui-field-inset, /);
    assert.doesNotMatch(setBack, /min\(/);

    const narrowed = `.ui-key-value-action__value-input > ${Appearances}:not(.ui-input--underline)`;

    assert.match(rule(narrowed), /--ui-field-inset: 0\.5rem;/);
    assert.match(rule(`${narrowed} > :is(${Rows})`), new RegExp(`padding-left: calc\\(0\\.5rem - ${escape(Border)}\\);`));
});

test("a clock's segments give their fill's padding back, so its first digit stands at the field's inset", () => {
    assert.match(rule(".ui-temporal-input__segment"), /padding: 0 2px;/);
    assert.match(rule(".ui-temporal-input__segments"), /margin-inline: -2px;/);
});

test("the rename field laid over a title has no inset of its own, so the title's words stay put", () => {
    for (const field of [".ui-tree-node__rename", ".ui-tab-item__rename"]) {
        assert.match(rule(field), /padding: 0;/);
        assert.match(rule(field), /border: 0;/);
        assert.match(rule(field), /margin: 0;/);
    }
});

function escape(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
