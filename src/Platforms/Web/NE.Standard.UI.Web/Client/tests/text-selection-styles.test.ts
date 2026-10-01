// Text selection read back from the compiled stylesheet: one rule set in runtime.less. The page selects nothing but reading words
// (`.ui-content-text`: a Text's or a Paragraph's body, a validation message) and a field's value; a row's or a pressable surface's
// reading words are its caption; a control, a row dragged by itself and, on a touch screen, a menu's owner never select; and a
// component's TextSelectable (`data-ui-text-select`) is the custom property its subtree reads, so the nearest one that says wins.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css.replace(/\/\*[\s\S]*?\*\//g, "");

type CssRule = { readonly conditions: readonly string[]; readonly selector: string; readonly body: string; readonly order: number };

const rules = rulesOf(css);

/** Every style rule with the at-rules it stands in, one entry per selector of its list, in the stylesheet's order. */
function rulesOf(text: string): CssRule[] {
    const found: CssRule[] = [];
    const conditions: string[] = [];
    let index = 0;

    while (index < text.length) {
        const open = text.indexOf("{", index);
        const close = text.indexOf("}", index);

        if (close >= 0 && (open < 0 || close < open)) {
            conditions.pop();
            index = close + 1;
            continue;
        }

        if (open < 0)
            break;

        const head = text.slice(index, open).split(";").pop()!.trim();

        if (head.startsWith("@")) {
            conditions.push(head);
            index = open + 1;
            continue;
        }

        const end = text.indexOf("}", open);

        for (const selector of selectorsOf(head))
            found.push({ conditions: [...conditions], selector, body: text.slice(open + 1, end), order: open });

        index = end + 1;
    }

    return found;
}

/** A selector list split on its top-level commas only, so `:is(a, b)` stays one selector. */
function selectorsOf(list: string): string[] {
    const selectors: string[] = [];
    let depth = 0;
    let current = "";

    for (const character of list) {
        if (character === "(" || character === "[")
            depth++;
        else if (character === ")" || character === "]")
            depth--;

        if (character === "," && depth === 0) {
            selectors.push(current.trim());
            current = "";
        }
        else
            current += character;
    }

    selectors.push(current.trim());

    return selectors.filter(selector => selector.length > 0);
}

/** The one rule outside any at-rule whose selector matches `test`. */
function only(test: (selector: string) => boolean, conditions: readonly string[] = []): CssRule {
    const matching = rules.filter(rule => test(rule.selector) && rule.conditions.join("|") === conditions.join("|") && rule.body.includes("user-select"));

    assert.equal(matching.length, 1, `Expected one selection rule, found ${matching.map(rule => rule.selector).join(" ; ") || "none"}.`);

    return matching[0];
}

function selects(rule: CssRule, value: string): void {
    assert.match(rule.body, new RegExp(`-webkit-user-select: ${escape(value)};`), rule.selector);
    assert.match(rule.body, new RegExp(`(^|[^-])user-select: ${escape(value)};`), rule.selector);
}

function escape(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const ControlHosts = ":is(.ui-button, .ui-action, .ui-tabs__strip, .ui-tabs-view__host, .ui-tab-item, .ui-menu, .ui-context-menu, .ui-action-bar, .ui-tree__row, .ui-table__header, .ui-select__trigger, .ui-select__popup, .ui-command-bar, .ui-button-group, .ui-split-button, .ui-breadcrumbs, .ui-collapsible__toggle, .ui-expander__header, .ui-key-value-action__action)";
const Editable = ':is(input, textarea, [contenteditable=""], [contenteditable="true"])';

test("the page selects nothing by itself, the prefixed property too", () => {
    selects(only(selector => selector === "body"), "none");
});

test("reading words select unless a TextSelectable around them says otherwise", () => {
    selects(only(selector => selector === ".ui-content-text"), "var(--ui-text-select, text)");
});

test("TextSelectable is a custom property the subtree reads, so the nearest component that says wins", () => {
    assert.match(rules.find(rule => rule.selector === '[data-ui-text-select="true"]')!.body, /--ui-text-select: text;/);
    assert.match(rules.find(rule => rule.selector === '[data-ui-text-select="false"]')!.body, /--ui-text-select: none;/);
    selects(only(selector => selector === "[data-ui-text-select]"), "var(--ui-text-select)");
});

test("reading words in a row or a pressable surface are its caption, which TextSelectable still reaches", () => {
    const row = only(selector => selector === ":is(.ui-items-view__item, .ui-table__row, .ui-surface--clickable, .ui-key-value-action) .ui-content-text");

    selects(row, "var(--ui-text-select, none)");
});

test("a control's words never select, nor reading words or a TextSelectable inside one", () => {
    selects(only(selector => selector === ControlHosts), "none");
    selects(only(selector => selector === `${ControlHosts} :is(.ui-content-text, [data-ui-text-select])`), "none");

    const own = only(selector => selector === ControlHosts);
    const switched = only(selector => selector === "[data-ui-text-select]");

    // Equal weight, so the order decides: the control after the switch, which a TextSelectable on a button's own root must not undo.
    assert.ok(own.order > switched.order);
});

test("a row dragged by itself never selects, but for a part a press never drags it by, which the place and the switch decide", () => {
    const dragged = rules.filter(rule => rule.selector.startsWith(":is(.ui-items-view[data-ui-rows-draggable]") && rule.body.includes("user-select"));

    assert.equal(dragged.length, 3);
    selects(dragged.find(rule => rule.selector.endsWith(".ui-table__row:not([data-ui-undraggable]))"))!, "none");
    selects(dragged.find(rule => rule.selector.endsWith(":not([data-ui-no-row-drag] *)"))!, "none");
    selects(dragged.find(rule => rule.selector.endsWith(") [data-ui-no-row-drag]"))!, "var(--ui-text-select, none)");
});

test("on a touch screen a long press on a menu's owner opens the menu: nothing in it selects and it shows no callout", () => {
    const touch = ["@media (hover: none) and (pointer: coarse)"];

    selects(only(selector => selector === "[data-ui-context-menu-owner]", touch), "none");
    selects(only(selector => selector === "[data-ui-context-menu-owner] :is(.ui-content-text, [data-ui-text-select])", touch), "none");
    assert.match(rules.find(rule => rule.selector === "[data-ui-context-menu-owner]" && rule.conditions.length === 0)!.body, /-webkit-touch-callout: none;/);
});

test("a field's value always selects and keeps its callout, after every rule it could tie with", () => {
    const field = only(selector => selector === Editable);

    selects(field, "text");
    assert.match(field.body, /-webkit-touch-callout: default;/);

    for (const selector of [ControlHosts, ".ui-content-text", "[data-ui-text-select]", "body"])
        assert.ok(only(other => other === selector).order < field.order, selector);

    assert.equal(rules.some(rule => rule.order > field.order && /(^|\s|,)(input|textarea)(\s|,|\)|$)/.test(rule.selector) && rule.body.includes("user-select")), false);
});

test("outside the one rule set only a drag's own surface refuses selection: a glyph, a control's base, a grip, the crop stage", () => {
    const owners = new Set(rules.filter(rule => rule.body.includes("user-select")).map(rule => rule.selector));
    const expected = new Set([
        "body",
        '[data-ui-text-select]',
        ".ui-content-text",
        ":is(.ui-items-view__item, .ui-table__row, .ui-surface--clickable, .ui-key-value-action) .ui-content-text",
        ControlHosts,
        `${ControlHosts} :is(.ui-content-text, [data-ui-text-select])`,
        "[data-ui-context-menu-owner]",
        "[data-ui-context-menu-owner] :is(.ui-content-text, [data-ui-text-select])",
        Editable,
        ".ui-image-crop__stage"
    ]);

    for (const selector of owners) {
        if (selector.startsWith(":is(.ui-items-view[data-ui-rows-draggable]") || selector.endsWith("> .ui-row__grip") || expected.has(selector))
            continue;

        // A glyph drawn by `.ui-glyph()` on a pseudo-element, or a control the pointer works through `.ui-interactive-base()`.
        const rule = rules.find(other => other.selector === selector && other.body.includes("user-select"))!;

        assert.match(rule.body, /user-select: none;/, selector);
        assert.ok(/::?(before|after)$/.test(selector) || rule.body.includes("touch-action: manipulation;"), `Unexpected selection rule: ${selector}`);
    }
});
