// A pane's grip read back from the compiled stylesheet: pale at rest, and shown by a key's focus alone, not by the focus a drag
// leaves on it, which kept the grip on screen after a pane put back where it stood.

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
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(start + selector.length + 3, css.indexOf("}", start));
}

const grip = ".ui-pane-container__grip";

test("a grip is shown by a key's focus, never by the focus a drag leaves on it", () => {
    assert.doesNotMatch(css, /\.ui-pane-container__grip:focus-visible[,\s{]/, "a bare :focus-visible matches the pointer's focus too");
    assert.match(declarations(`${grip}:focus-visible:not([data-ui-pointer-focus]),\n.ui-pane-container__pane[data-ui-pane-lifted] > ${grip}`) ?? "", /opacity: 1;/);
});

test("a grip is pale at rest, the muted ink only under the pointer", () => {
    assert.match(declarations(grip) ?? "", /color: color-mix\(in srgb, .+ 50%, transparent\);/);
});
