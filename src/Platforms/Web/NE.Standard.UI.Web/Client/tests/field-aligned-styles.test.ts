// A panel standing level with field boxes (StackPanel.AlignWithFieldBoxes, UIForm.Row) stands its content down by a field caption's line
// and the input root's gap under it, then centres it on a band as tall as the fields' box of the size written, in the tiers written and
// fenced below theirs, through the padding's and the least height's chains so an authored Padding or MinHeight still wins.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const Selector = ".ui-stack-panel--field-aligned[data-ui-id]";
const Line = "calc(var(--ui-field-aligned-xxl, var(--ui-field-aligned-xl, var(--ui-field-aligned-md, var(--ui-field-aligned-sm, var(--ui-field-aligned, 0))))) * (var(--ui-text-caption-line-height) + 0.25rem))";
const Box = "var(--ui-field-aligned-box-xxl, var(--ui-field-aligned-box-xl, var(--ui-field-aligned-box-md, var(--ui-field-aligned-box-sm, var(--ui-field-aligned-box, 0px)))))";

/** The declarations of every rule whose selector list is exactly `selector`, top level or inside a media query. */
function declarations(selector: string): string[] {
    const pattern = new RegExp(`(?:^|\\n)\\s*${literal(selector)} \\{([^}]*)\\}`, "g");

    return [...css.matchAll(pattern)].map(match => match[1]);
}

function literal(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("the line is a caption's line and the root's gap per tier, the padding's default rather than a flat padding", () => {
    const [rule] = declarations(Selector);

    assert.ok(rule, "no field-aligned rule");
    assert.match(rule, new RegExp(`padding: var\\(--ui-padding-xxl, .*var\\(--ui-padding, ${literal(Line)} 0 0\\)`));
    assert.doesNotMatch(rule, /padding-top/);
    // Reset, so a panel inside a marked one reads none of its tiers.
    assert.match(rule, /--ui-field-aligned: initial;/);
    assert.match(rule, /--ui-field-aligned-box: initial;/);
});

test("the band under the line is as tall as a field's box of the size written, the least height's default", () => {
    const [rule] = declarations(Selector);

    assert.match(rule, new RegExp(`min-height: var\\(--ui-min-height-xxl, .*var\\(--ui-min-height, calc\\(${literal(Line)} \\+ ${literal(Box)}\\)\\)`));
    // The boxes the renderer names, by a field's Size (ui-input.less: @ui-control-height-sm, @ui-control-height, @ui-control-height-lg).
    assert.match(rule, /--ui-field-box-small: 1\.5rem;/);
    assert.match(rule, /--ui-field-box-medium: 2\.5rem;/);
    assert.match(rule, /--ui-field-box-large: 3rem;/);
    assert.match(css, /\.ui-input--small > :is\([^)]*\) \{\s*min-height: 1\.5rem;/);
    assert.match(css, /\.ui-input--large > :is\([^)]*\) \{\s*min-height: 3rem;/);
});

test("a row's children are centred across the band unless they say otherwise", () => {
    assert.match(declarations(".ui-stack-panel--field-aligned.ui-orientation--horizontal > [data-ui-id]").join(""), /align-self: var\(--ui-align-v, center\);/);
});

test("a column stands its first child alone on the band and the rest under it, as a field's message hangs under its box", () => {
    const column = declarations(".ui-stack-panel--field-aligned.ui-orientation--vertical").join("");

    assert.match(column, /display: grid;/);
    assert.match(column, new RegExp(`grid-template-rows: minmax\\(${literal(Box)}, auto\\);`));
    assert.doesNotMatch(column, /justify-content: center/, "centred together, a control and its note stood the control half the note high");
    assert.match(declarations(".ui-stack-panel.ui-stack-panel--field-aligned.ui-orientation--vertical > [data-ui-id]:first-child").join(""), /align-self: center;/);
    // Across the column HorizontalAlignment is still the child's, on the grid's own axis.
    assert.match(declarations(".ui-stack-panel.ui-stack-panel--field-aligned.ui-orientation--vertical > [data-ui-id]").join(""), /justify-self: var\(--ui-align-h, normal\);/);
});

test("each tier is fenced below its breakpoint, so a row's cells stacked on a phone stand at the top", () => {
    const fences = declarations(Selector).slice(1).join("");

    for (const tier of ["sm", "md", "xl", "xxl"]) {
        assert.match(fences, new RegExp(`--ui-field-aligned-${tier}: initial !important;`), tier);
        assert.match(fences, new RegExp(`--ui-field-aligned-box-${tier}: initial !important;`), tier);
    }
});
