// An input's caption row is one caption line whatever stands in it, so a badge taller than the line never moves the field away
// from its caption; a caption's badge with words is a tab stop, asking for help under the pointer and suppressing the browser ring.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement } from "./fake-dom.ts";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the first rule whose selector list is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector} {`);

    return start < 0 ? null : css.slice(start + selector.length + 3, css.indexOf("}", start));
}

/** The selector list of the first rule whose selector list includes `needle` and whose body matches `body`. */
function selectorListWith(needle: string, body: RegExp): string {
    for (const block of css.split("}")) {
        const brace = block.indexOf("{");

        if (brace < 0)
            continue;

        const selectors = block.slice(0, brace).trim();
        const ruleBody = block.slice(brace + 1);

        if (selectors.includes(needle) && body.test(ruleBody))
            return selectors;
    }

    assert.fail(`No rule with '${needle}' matched ${body}`);
}

test("an input's caption row is exactly one line of its caption, a badge centred on it", () => {
    const row = declarations(".ui-input__header > .ui-text__body > .ui-text__header") ?? "";

    assert.match(row, /height: 1lh;/);
    // One line: a long caption ellipsises rather than dropping its required mark or its badge onto a second line inside the first.
    assert.match(row, /flex-wrap: nowrap;/);
    // Centred, so a taller badge overflows the line evenly above and below instead of pushing the field down.
    assert.match(declarations(".ui-text__header") ?? "", /align-items: center;/);
});

test("an input's caption opens and marks required whether direct or wrapped in .ui-input__header-row", () => {
    const headerGridSelectors = selectorListWith("> .ui-input__header-row > .ui-input__header", /display:\s*grid;/);
    const requiredShownSelectors = selectorListWith("> .ui-input__header-row > .ui-input__header .ui-input__required", /display:\s*block;/);

    assert.match(declarations(".ui-input__required") ?? "", /display:\s*none;/);

    // Wrapped in `.ui-input__header-row` (SetHeaderAction / SetExpandable) with a title: both header and `*` match.
    const requiredInWrapped = FakeElement.of("ui-input__required");
    const wrappedHeader = FakeElement.of("ui-input__header ui-text").append(FakeElement.of("ui-text__body").append(FakeElement.of("ui-text__header").append(requiredInWrapped)));

    FakeElement.of("ui-code-input", { "data-ui-id": "1", "data-ui-text-title": "" }).append(FakeElement.of("ui-input__header-row").append(wrappedHeader));
    assert.equal(wrappedHeader.matches(headerGridSelectors), true);
    assert.equal(requiredInWrapped.matches(requiredShownSelectors), true);

    // Wrapped in `.ui-input__header-row` with an icon alone (even inside a titled outer card): header opens, `*` stays hidden.
    const iconOnlyRequired = FakeElement.of("ui-input__required");
    const iconOnlyHeader = FakeElement.of("ui-input__header ui-text").append(FakeElement.of("ui-text__body").append(FakeElement.of("ui-text__header").append(iconOnlyRequired)));
    const iconOnlyField = FakeElement.of("ui-text-area", { "data-ui-id": "2", "data-ui-text-icon": "" }).append(FakeElement.of("ui-input__header-row").append(iconOnlyHeader));

    FakeElement.of("ui-card", { "data-ui-id": "card", "data-ui-text-title": "" }).append(FakeElement.of("ui-card__body").append(iconOnlyField));
    assert.equal(iconOnlyHeader.matches(headerGridSelectors), true);
    assert.equal(iconOnlyRequired.matches(requiredShownSelectors), false);

    // Inside caption (`TitlePlacement.Inside`) with a title: `*` matches despite `.ui-text-input__row` between root and header.
    const insideRequired = FakeElement.of("ui-input__required");
    const insideHeader = FakeElement.of("ui-input__header ui-text").append(FakeElement.of("ui-text__body").append(FakeElement.of("ui-text__header").append(insideRequired)));

    FakeElement.of("ui-text-input ui-input--title-inside", { "data-ui-id": "3", "data-ui-text-title": "" }).append(FakeElement.of("ui-text-input__row").append(insideHeader));
    assert.equal(insideRequired.matches(requiredShownSelectors), true);
});

test("a caption's badge with words asks for help under the pointer and suppresses the browser focus ring", () => {
    const badge = ".ui-text__badge[data-ui-tooltip-press][data-ui-tooltip]";

    assert.match(declarations(badge) ?? "", /cursor: help;/);
    assert.match(css, /\.ui-text__badge\[data-ui-tooltip-press\]\[data-ui-tooltip\]:focus-visible:not\(\[data-ui-pointer-focus\]\) \{\s*outline: none;/);
});
