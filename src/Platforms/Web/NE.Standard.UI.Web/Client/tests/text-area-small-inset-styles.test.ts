// Read back from the compiled stylesheet: a small text area keeps its box's padding, so its message and the note under it start where
// its words do, not at a small field's narrower inset.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector list is exactly `selector`, joined. */
function declarations(selector: string): string {
    let found = "";

    for (let start = css.indexOf(`\n${selector} {`); start >= 0; start = css.indexOf(`\n${selector} {`, start + 1))
        found += css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));

    return found;
}

test("a small text area's message starts at the area's own inset, its box keeping its padding", () => {
    assert.match(declarations(".ui-text-area__field"), /padding: 0\.5rem 0\.75rem;/);
    assert.match(declarations(".ui-text-area.ui-input--small"), /--ui-field-inset: var\(--ui-text-area-inset\);/);
});

test("the note under a small text area starts there too, by its appearance", () => {
    const boxed = declarations(".ui-text-area:is(.ui-input--filled, .ui-input--outline).ui-input--small + .ui-paragraph--field-note");
    const ghost = declarations(".ui-text-area.ui-input--ghost.ui-input--small + .ui-paragraph--field-note");

    assert.match(boxed, /--ui-field-inset: calc\(0\.75rem \+ var\(--ui-border-width, 1px\)\);/);
    assert.match(ghost, /--ui-field-inset: calc\(0\.5rem \+ var\(--ui-border-width, 1px\)\);/);
    assert.match(declarations(".ui-text-area"), /--ui-text-area-inset: calc\(0\.75rem \+ var\(--ui-border-width, 1px\)\);/);
    assert.match(declarations(".ui-text-area.ui-input--ghost"), /--ui-text-area-inset: calc\(0\.5rem \+ var\(--ui-border-width, 1px\)\);/);
});
