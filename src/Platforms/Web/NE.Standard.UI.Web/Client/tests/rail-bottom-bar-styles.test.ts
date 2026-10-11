// The drawers and the bottom bar read back from the compiled stylesheet: below the drawer breakpoint a side marked a bar is no drawer
// but a row of the page's own after the footer, standing at the viewport's bottom, the boxes around its rail stepping aside; the rail
// lies along it as a horizontal rail does, through the same rules, its current entry marked on the edge toward the content. Wider, the
// sides are drawers where the view names a wider width, a pinned side standing in its column; a modeless side's drawer has no veil.

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
    return mediaBlocks("@media (max-width: 767.98px) {");
}

/** Every block of a query, one after another. */
function mediaBlocks(opening: string): string {
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

const closedLeft = `${shell} > [data-ui-region="left-side"]:where(:not([data-ui-bottom-bar]))`;
const closedDrawers = `${closedLeft},\n  ${shell} > [data-ui-region="right-side"]`;
const openDrawers = [
    `${shell}[data-ui-drawer-open="left-side"] > [data-ui-region="left-side"]`,
    `${shell}[data-ui-drawer-open="right-side"] > [data-ui-region="right-side"]`
];

// A tablet's band, between the medium and the extra-large breakpoints: the roots naming a wider width, a side there unpinned.
const tablet = mediaBlocks("@media (min-width: 768px) and (max-width: 1279.98px) {");
const wider = '[data-ui-root]:is([data-ui-side-drawers="xl"], [data-ui-side-drawers="xxl"], [data-ui-side-drawers="always"])';
const columns = '[data-ui-root]:not([data-ui-side-drawers="xl"], [data-ui-side-drawers="xxl"], [data-ui-side-drawers="always"])';

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
    assert.ok(open >= Math.max(...splitList(closedDrawers).map(weight)), "the closed drawer's visibility would win: an opened drawer stays hidden");
    assert.ok(open >= weight(closedLeft), "the closed drawer's transform would win: an opened drawer stays off the screen");
    assert.ok(weight(`${shell} > [data-ui-region="left-side"]:not([data-ui-bottom-bar])`) > weight(closedLeft), "the weighing tells the bare exception apart");
});

test("the bar is a row of the page's own after the footer, standing at the viewport's bottom on the page's ground", () => {
    const bar = declarations(phone, `${shell} > [data-ui-region="left-side"][data-ui-bottom-bar]`) ?? "";

    assert.match(bar, /position: sticky;\s*bottom: 0;/);
    assert.match(bar, /grid-column: 1 \/ -1;\s*grid-row: 4;/, "not after the footer, the content's end would scroll under it");
    assert.match(bar, /overflow: visible;/, "a scrolling side's own overflow would clip the bar");
    assert.match(bar, /var\(--ui-color-background\);/);
    assert.match(declarations(phone, `${shell} > [data-ui-bottom-bar] [data-ui-id]:not(.ui-menu--rail, .ui-menu--rail *)`) ?? "", /display: contents;/);
});

test("the rail along the bar is the page's width, its ground under the home bar, its entries in one row", () => {
    assert.match(declarations(phone, barRail) ?? "", /width: auto;\s*padding: var\(--ui-padding-xxl, var\(--ui-padding-xl, var\(--ui-padding-md, var\(--ui-padding-sm, var\(--ui-padding, 0 0 env\(safe-area-inset-bottom, 0px\)\)\)\)\)\);/);
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

test("a page's own drawer button shows only where its side is a drawer: not where the sides are columns, nor pinned, nor the bar's", () => {
    const hidden = [
        `${columns} [data-ui-id][data-ui-drawer-toggle]`,
        `${columns} [data-ui-drawer-pin]`,
        `${wider}[data-ui-left-bar] [data-ui-id][data-ui-drawer-toggle="left-side"]`
    ];

    const pinned = [
        `${wider}[data-ui-pinned-left-side] [data-ui-id][data-ui-drawer-toggle="left-side"]`,
        `${wider}[data-ui-pinned-right-side] [data-ui-id][data-ui-drawer-toggle="right-side"]`
    ];

    assert.match(declarations(tablet, hidden.join(",\n  ")) ?? "", /display: none !important;/);
    assert.match(declarations(tablet, pinned.join(",\n  ")) ?? "", /display: none !important;/);
    assert.match(phone, /\[data-ui-root\]\[data-ui-side-drawers\]\[data-ui-left-bar\] \[data-ui-id\]\[data-ui-drawer-toggle="left-side"\] \{\s*display: none !important;/);
    assert.match(declarations(phone, "[data-ui-drawer-pin]") ?? "", /display: none !important;/, "a phone's sides are drawers whatever is pinned");
    assert.doesNotMatch(phone, /\[data-ui-pinned-(left|right)-side\] \[data-ui-id\]\[data-ui-drawer-toggle/, "on a phone a pinned side is a drawer, opened by the page's own button");
    assert.match(declarations(css, '[data-ui-root][data-ui-left-bar] [data-ui-drawer-pin="left-side"]') ?? "", /display: none !important;/, "the bottom bar stands as a bar whatever is pinned");
});

test("on a tablet the sides are drawers where the view names a wider width, and a pinned side keeps its column", () => {
    assert.match(declarations(tablet, `${wider}:not([data-ui-pinned-left-side]) > [data-ui-region="left-side"]:where(:not([data-ui-bottom-bar]))`) ?? "", /transform: translateX\(-100%\);/);
    assert.match(tablet, /:not\(\[data-ui-pinned-right-side\]\) > \[data-ui-region="right-side"\] \{\s*right: 0;\s*transform: translateX\(100%\);/);
    assert.match(declarations(tablet, `${wider}:not([data-ui-pinned-left-side])[data-ui-drawer-open="left-side"] > [data-ui-region="left-side"],\n  ${wider}:not([data-ui-pinned-right-side])[data-ui-drawer-open="right-side"] > [data-ui-region="right-side"]`) ?? "", /visibility: visible;\s*transform: none;/);
    assert.match(mediaBlocks("@media (min-width: 1536px) {"), /\[data-ui-root\]\[data-ui-side-drawers="always"\]:not\(\[data-ui-pinned-left-side\]\) > \[data-ui-region="left-side"\]/, "always is a drawer on the widest screen too");
});

test("a modeless side's open drawer leaves the page unveiled", () => {
    const veiled = '[data-ui-root][data-ui-drawer-open="left-side"]:not([data-ui-drawer-modeless~="left-side"]) > .ui-shell__drawer-backdrop,\n[data-ui-root][data-ui-drawer-open="right-side"]:not([data-ui-drawer-modeless~="right-side"]) > .ui-shell__drawer-backdrop';

    assert.match(declarations(css, veiled) ?? "", /display: block;\s*opacity: 1;/);
});

test("the document and a filled page are read off the shell's marks: the gutter dropped, the regions' own scroll kept on a phone", () => {
    assert.match(declarations(css, "html[data-ui-scroll-content]") ?? "", /scrollbar-gutter: auto;/);
    assert.match(declarations(phone, "[data-ui-root][data-ui-scroll-content]:not([data-ui-content-fills])") ?? "", /height: auto;\s*min-height: 100dvh;\s*overflow: visible;/);
    assert.match(declarations(phone, '[data-ui-root][data-ui-scroll-content]:not([data-ui-content-fills]) > [data-ui-region="content"]') ?? "", /overflow: visible;\s*scrollbar-gutter: auto;/);
});
