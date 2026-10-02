// A calendar drawn in place, read back from the compiled stylesheet: never wider than the grid a date input's popup draws, whatever
// room its layout gives it, since the layouts' own cap would let it fill that room.

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
    const match = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`).exec(css);

    return match?.[1] ?? null;
}

/** Where a rule whose selector list is exactly `selector` starts in the stylesheet, or -1. */
function position(selector: string): number {
    return css.search(new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{`));
}

test("the calendar in place is capped at its least width, the popup grid's floor", () => {
    assert.match(declarations(".ui-calendar[data-ui-id]") ?? "", /max-width: min-content;/);
    assert.match(declarations(".ui-temporal-input__calendar") ?? "", /min-width: 15rem;/);
});

test("the cap comes after the layouts' cap at their room, as specific as it, so it wins", () => {
    const layoutCap = /\n(:is\([^{]*\.ui-stack-panel[^{]*\) > \[data-ui-id\]) \{[^}]*max-width:/.exec(css);

    assert.ok(layoutCap, "the layouts' cap rule");
    assert.ok(position(".ui-calendar[data-ui-id]") > position(layoutCap[1]));
});

test("the calendar's own rule leaves the width to the cap, not to an authored MaxWidth", () => {
    assert.doesNotMatch(declarations(".ui-calendar") ?? "", /max-width/);
});
