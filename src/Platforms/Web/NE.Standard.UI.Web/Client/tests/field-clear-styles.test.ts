// When a field's clear shows, read back from the compiled stylesheet: one rule (mixins/field.less, .ui-field-clear-host()) hides
// every clearable field's clear under a root without the clearable mark, under a disabled or read-only one, and while the field is
// empty by its own sign, so no member of the family shows its cross where another hides it.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const styles = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles");
const source = resolve(styles, "../ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

// Each clearable field's root, the path from it to its clear, and the selector that says it is empty.
const hosts: readonly (readonly [string, string, string])[] = [
    [".ui-text-input", " .ui-text-input__clear", ".ui-text-input__field:placeholder-shown ~ .ui-text-input__clear"],
    [".ui-number-input", " .ui-number-input__clear", ".ui-number-input__field:placeholder-shown ~ .ui-number-input__clear"],
    [".ui-temporal-input", " .ui-temporal-input__clear", ".ui-temporal-input__field:placeholder-shown ~ .ui-temporal-input__clear"],
    [".ui-select:not(.ui-multi-select)", " .ui-select__trigger .ui-select__clear", ".ui-select:not(.ui-multi-select):is(:not([data-ui-select-value]), [data-ui-select-value='']) .ui-select__trigger .ui-select__clear"],
    [".ui-multi-select", " > .ui-select__trigger > .ui-select__clear", ".ui-multi-select > .ui-select__trigger > .ui-multi-select__chips:not([data-ui-select-chips]) ~ .ui-select__clear"]
];

function literal(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("each clearable field hides its clear unless asked for, on a disabled or read-only field, and while it is empty", () => {
    for (const [root, clear, empty] of hosts) {
        const selectors = [`${root}:not([data-ui-clearable])${clear}`, `${root}:is(.ui-disabled, .ui-readonly)${clear}`, empty];
        const rule = new RegExp(`(?:^|\\n)${selectors.map(literal).join(",\\n")} \\{\\s*display: none;\\s*\\}`);

        assert.match(css, rule, root);
    }
});

test("no rule shows a clear by the mark: it shows by default and only the one rule hides it", () => {
    const marks = css.split("[data-ui-clearable]").length - 1;

    assert.equal(marks, hosts.length);
    assert.equal(css.split(":not([data-ui-clearable])").length - 1, marks);
});

test("every stylesheet drawing a field's clear takes the one rule", () => {
    const components = resolve(styles, "components");

    for (const file of readdirSync(components)) {
        const text = readFileSync(resolve(components, file), "utf8");

        if (/\.ui-field-clear\(\)|\.ui-select__clear \{/.test(text))
            assert.ok(text.includes(".ui-field-clear-host("), file);
    }
});
