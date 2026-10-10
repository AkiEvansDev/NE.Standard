// The gaps inside one unit read back from the compiled stylesheet: a description that runs on and a field's message start at their
// words, not at a half-leading above them, and a toggle's or a radio group's message starts where its words do.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const trim = "margin-top: calc((1em - 1lh) / 2);";

/** The rule blocks whose selector list contains `part`. */
function rules(part: string): string[] {
    const found: string[] = [];

    for (let at = css.indexOf(part); at >= 0; at = css.indexOf(part, at + 1)) {
        const open = css.indexOf("{", at), close = css.indexOf("}", at);

        if (open < close)
            found.push(css.slice(css.lastIndexOf("}", at) + 1, close));
    }

    return found;
}

test("a description that runs on under a title takes back the leading above its first line", () => {
    const wrap = rules(".ui-text--wrap > .ui-text__body > .ui-text__description").filter(rule => rule.includes(trim));
    const fold = rules(".ui-text__description[data-ui-folds]").filter(rule => rule.includes(trim));

    assert.ok(wrap.length > 0, "a wrapping description under a title keeps its leading above");
    assert.ok(fold.length > 0, "a description with a fold under a title keeps its leading above");
    assert.ok(wrap.every(rule => rule.includes("[data-ui-text-title][data-ui-text-description]")), "the trim reaches a description with no title over it");
});

test("a field's message stands a gap under the field, not a gap and a half-leading", () => {
    const own = rules("\n.ui-validation-message {").find(rule => rule.includes("padding:"));

    assert.ok(own, "no rule for the message line");
    assert.ok(own.includes(trim), "the message line keeps the leading above its first line");
});

test("a toggle's and a radio group's message start where their words do, not at a field's inset", () => {
    for (const host of [".ui-checkbox > .ui-validation-message", ".ui-switch > .ui-validation-message", ".ui-radio-group > .ui-validation-message"]) {
        const found = rules(host);

        assert.ok(found.length > 0, `no rule for ${host}`);
        assert.ok(found.some(rule => rule.includes("padding-inline: 0;")), `${host} keeps the field's inset`);
    }
});
