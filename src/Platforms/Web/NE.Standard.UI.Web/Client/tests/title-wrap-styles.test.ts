// A wrapping title breaks only between words: "Servers" in a narrow row read "Serv / ers", which reads as two words. A single word
// longer than its line ends in an ellipsis instead.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("a wrapping title breaks between words and cuts a word longer than its line", () => {
    const rule = /\.ui-text--title-wrap[^{]*> \.ui-text__title \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(rule, /overflow-wrap: normal;/, "a title breaks inside a word");
    assert.match(rule, /overflow: hidden;/);
    assert.match(rule, /text-overflow: ellipsis;/, "a word longer than its line runs past the title's box");
    assert.doesNotMatch(rule, /anywhere|break-all/);
});
