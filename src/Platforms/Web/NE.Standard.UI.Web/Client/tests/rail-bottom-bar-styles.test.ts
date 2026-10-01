// The bottom bar read back from the compiled stylesheet: below the drawer breakpoint a side marked a bar is no drawer but a row of the
// page's own after the footer, standing at the viewport's bottom, the boxes around its rail stepping aside; the rail lies along it as a
// horizontal rail does, through the same rules, its current entry marked on the edge toward the content.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** Every block of the phone's query, the drawer breakpoint's, one after another. */
function phoneBlocks(): string {
    const opening = "@media (max-width: 767.98px) {";
    let blocks = "";

    for (let start = css.indexOf(opening); start >= 0; start = css.indexOf(opening, start + 1)) {
        let depth = 0;
        let end = start + opening.length - 1;

        do {
            if (css[end] === "{")
                depth++;
            else if (css[end] === "}")
                depth--;

            end++;
        } while (depth > 0);

        blocks += css.slice(start + opening.length, end - 1);
    }

    return blocks;
}

/** The declarations of the first rule in `text` whose selector list is exactly `selector`, or null. */
function declarations(text: string, selector: string): string | null {
    const match = new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`).exec(text);

    return match?.[1] ?? null;
}

const phone = phoneBlocks();
const shell = "[data-ui-root][data-ui-side-drawers]";
const barRail = `${shell} > [data-ui-bottom-bar] .ui-menu--rail`;
const horizontalRail = ".ui-menu--rail.ui-orientation--horizontal";

const closedDrawers = `${shell} > :is([data-ui-region="left-side"]:where(:not([data-ui-bottom-bar])), [data-ui-region="right-side"])`;
const closedLeft = `${shell} > [data-ui-region="left-side"]:where(:not([data-ui-bottom-bar]))`;
const openDrawers = [
    '[data-ui-root][data-ui-drawer-open="left-side"] > [data-ui-region="left-side"]',
    '[data-ui-root][data-ui-drawer-open="right-side"] > [data-ui-region="right-side"]'
];

/**
 * A selector's weight in attributes and classes — all these selectors carry — so two rules can be weighed: `:where` weighs nothing,
 * `:is` and `:not` weigh their heaviest argument.
 */
function weight(selector: string): number {
    let total = 0;

    for (let at = 0; at < selector.length; at++) {
        const group = /^:(where|is|not)\(/.exec(selector.slice(at));

        if (group !== null) {
            const open = at + group[0].length - 1;
            const close = closingOf(selector, open);

            if (group[1] !== "where")
                total += Math.max(...splitList(selector.slice(open + 1, close)).map(weight));

            at = close;
        }
        else if (selector[at] === "[") {
            total++;
            at = selector.indexOf("]", at);
        }
        else if (selector[at] === ".") {
            total++;
        }
    }

    return total;
}

/** Where the bracket opened at `open` closes. */
function closingOf(text: string, open: number): number {
    let depth = 0;

    for (let at = open; at < text.length; at++) {
        if (text[at] === "(")
            depth++;
        else if (text[at] === ")" && --depth === 0)
            return at;
    }

    return text.length;
}

/** A selector list's members, split on its top-level commas. */
function splitList(list: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;

    for (let at = 0; at < list.length; at++) {
        if (list[at] === "(" || list[at] === "[")
            depth++;
        else if (list[at] === ")" || list[at] === "]")
            depth--;
        else if (list[at] === "," && depth === 0) {
            parts.push(list.slice(start, at).trim());
            start = at + 1;
        }
    }

    parts.push(list.slice(start).trim());

    return parts;
}

test("a side marked a bar is left out of the drawers", () => {
    assert.notEqual(declarations(phone, closedDrawers), null);
    assert.match(declarations(phone, closedLeft) ?? "", /transform: translateX\(-100%\);/);
});

test("an open drawer's rule still outweighs the closed ones the bar's exception is written into", () => {
    assert.match(declarations(phone, openDrawers.join(",\n  ")) ?? "", /visibility: visible;\s*transform: none;/);

    // As heavy is enough: the open rule comes after the closed ones.
    const open = Math.min(...openDrawers.map(weight));

    assert.ok(phone.indexOf(openDrawers[0]) > phone.indexOf(closedLeft));
    assert.ok(open >= weight(closedDrawers), "the closed drawer's visibility would win: an opened drawer stays hidden");
    assert.ok(open >= weight(closedLeft), "the closed drawer's transform would win: an opened drawer stays off the screen");
    assert.ok(weight(`${shell} > [data-ui-region="left-side"]:not([data-ui-bottom-bar])`) > open, "the weighing tells the bare exception apart");
});

test("the bar is a row of the page's own after the footer, standing at the viewport's bottom on the page's ground", () => {
    const bar = declarations(phone, `${shell} > [data-ui-region="left-side"][data-ui-bottom-bar]`) ?? "";

    assert.match(bar, /position: sticky;\s*bottom: 0;/);
    assert.match(bar, /grid-column: 1;\s*grid-row: 4;/, "not after the footer, the content's end would scroll under it");
    assert.match(bar, /overflow: visible;/, "a scrolling side's own overflow would clip the bar");
    assert.match(bar, /var\(--ui-color-background\);/);
    assert.match(declarations(phone, `${shell} > [data-ui-bottom-bar] [data-ui-id]:has(.ui-menu--rail)`) ?? "", /display: contents;/);
});

test("the rail along the bar is the page's width, its ground under the home bar, its entries in one row", () => {
    assert.match(declarations(phone, barRail) ?? "", /width: auto;\s*padding-bottom: env\(safe-area-inset-bottom, 0px\);/);
    assert.match(declarations(phone, `${barRail} > .ui-menu__host`) ?? "", /flex-direction: row;\s*flex-wrap: nowrap;\s*align-items: stretch;/);
});

test("the bar and a horizontal rail share one layout: entries share the length down to a press's width, then the bar scrolls", () => {
    for (const rail of [barRail, horizontalRail]) {
        const text = rail === barRail ? phone : css;

        assert.match(declarations(text, `${rail} > .ui-menu__host`) ?? "", /overflow-x: auto;/, rail);
        assert.match(declarations(text, `${rail} > .ui-menu__host > .ui-menu__item`) ?? "", /flex: 1 1 0;\s*min-width: var\(--ui-menu-bar-entry-width\);/, rail);
    }
});

test("the bar's current entry is marked on its top edge, toward the content", () => {
    assert.match(declarations(phone, `${barRail} > .ui-menu__host > .ui-menu__item > .ui-menu-item--selected`) ?? "", /inset 0 2px 0 0/);
});

test("the bar's hairline is the rail's, under its entries, so the current entry's line lies over it rather than below it", () => {
    const bar = declarations(phone, `${shell} > [data-ui-region="left-side"][data-ui-bottom-bar]`) ?? "";

    assert.doesNotMatch(bar, /border-top/, "a border on the side stands above the rail's box: the entry's line would lie a pixel under it");
    assert.match(declarations(phone, barRail) ?? "", /box-shadow: inset 0 1px 0 0 var\(--ui-color-border\);/);
    assert.doesNotMatch(declarations(phone, barRail) ?? "", /padding-top|border-top/, "the entries would start below the hairline");
});
