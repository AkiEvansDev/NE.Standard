// Read back from the compiled stylesheet: a note under a switch or a checkbox (UIForm.Field) starts with the label's words, past the
// box and the row's gap at every size, rather than under the box's edge — the inset the box's own width is written with, never a
// number of its own beside it.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(match => ({ selectors: match[1].split(",").map(part => part.trim()), body: match[2] }));

/** The value `property` takes in the rule one of whose selectors is exactly `selector`, or null. */
function valueOf(selector: string, property: string): string | null {
    for (const rule of rules) {
        if (!rule.selectors.includes(selector))
            continue;

        const match = new RegExp(`(?:^|;|\\s)${property.replace(/[-]/g, "\\-")}:\\s*([^;]+);`).exec(rule.body);

        if (match)
            return match[1].trim();
    }

    return null;
}

test("a note under a switch or a checkbox starts past the box and the row's gap, at each size", () => {
    for (const [root, box] of [
        [".ui-switch", ".ui-switch__box"],
        [".ui-switch.ui-input--small", ".ui-switch.ui-input--small > .ui-switch__box"],
        [".ui-switch.ui-input--large", ".ui-switch.ui-input--large > .ui-switch__box"],
        [".ui-checkbox", ".ui-checkbox__box"],
        [".ui-checkbox.ui-input--small", ".ui-checkbox.ui-input--small > .ui-checkbox__box"],
        [".ui-checkbox.ui-input--large", ".ui-checkbox.ui-input--large > .ui-checkbox__box"]
    ]) {
        const width = valueOf(box, "width");

        assert.ok(width, box);
        assert.equal(valueOf(`${root} + .ui-paragraph--field-note`, "--ui-field-inset"), `calc(${width} + 0.5rem)`, root);
        assert.equal(valueOf(`${root} + .ui-paragraph--field-note`, "--ui-field-note-end"), "0px", root);
    }

    // The switch the demo measured: a 36 px track and an 8 px gap, the 44 px its note was set in by hand.
    assert.equal(valueOf(".ui-switch__box", "width"), "2.25rem");
    assert.equal(valueOf(".ui-checkbox__box", "width"), "1.125rem");
});

test("the row's gap the inset counts is the toggle row's own", () => {
    assert.match(rules.find(rule => rule.selectors.includes(".ui-switch"))?.body ?? "", /gap: 0\.25rem 0\.5rem;/);
});

test("the note reads the inset as a field's note does, a toggle's at its start only", () => {
    assert.equal(valueOf(".ui-paragraph--field-note > .ui-text__body", "padding-inline"), "var(--ui-field-inset, 0px) var(--ui-field-note-end, var(--ui-field-inset, 0px))");
});
