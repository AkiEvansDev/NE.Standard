// A toast's close, read back from the compiled stylesheet: the dialog's ×, a small ghost button (notification-engine.ts) drawing the
// core's cross, square, overhanging its line so the line keeps its height and the cross its middle, giving a little while held as
// every glyph face does; no look of its own left — no fade, no plate.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector is exactly `selector`, joined. */
function declarations(selector: string): string {
    let found = "";

    for (let start = css.indexOf(`\n${selector} {`); start >= 0; start = css.indexOf(`\n${selector} {`, start + 1))
        found += css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));

    return found;
}

test("the close is a square on the first line, overhanging it by as much as the small button is taller", () => {
    const close = declarations(".ui-notification__close");

    assert.match(close, /grid-column: 2;\s*grid-row: 1;/);
    assert.match(close, /aspect-ratio: 1;/);
    assert.match(close, /padding: 0\.25rem;/);
    assert.match(close, /margin: calc\(\(var\(--ui-text-body-line-height\) - 1\.75rem\) \/ 2\);/);
});

test("it draws the core's cross as its whole face, which gives a little while held", () => {
    assert.match(declarations(".ui-notification__close::before"), /content: "\\e5cd" \/ "";[\s\S]*font-size: 1rem;/);
    assert.match(css, /\.ui-notification__close\)::before \{\s*transition: scale/);
    assert.match(css, /\.ui-notification__close\)\.ui-press-held::before \{\s*scale:/);
});

test("no look of its own is left: the ghost button's wash, press and ink are its", () => {
    assert.doesNotMatch(css, /\.ui-notification__close[^{}]*\{[^{}]*(opacity|background-color|border-radius: 999px)/);
});
