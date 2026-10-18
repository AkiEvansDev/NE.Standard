// The overlay bar's room is the padding's floor, never 12 past 12: a region's root keeps it unless its own scroller does (a list's, a
// tree's host), it is a rail or a collapsed panel, or — in a region that scrolls alone — it fills the height; a blurred scroller's
// layer reaches over it; a scroller its own size bounds keeps it always, one that grows with its rows and a popup only while they
// overflow, under less motion too.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(match => ({ selector: match[1].trim(), body: match[2] }));

const keepsRoom = "--ui-scroll-room-y: var(--ui-scrollbar-room);";
const ownScroller = ":not(.ui-items-view, .ui-tree, .ui-menu--rail, .ui-collapsible[data-ui-collapsed]:not([data-ui-folding]))";
const unfilled = ":not([style*=\"--ui-height: var(--ui-fill-height\"])";

/** A selector list's entries, split at its own commas, not those inside a pseudo-class. */
function entries(list: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;

    for (let i = 0; i < list.length; i++) {
        if (list[i] === "(")
            depth++;
        else if (list[i] === ")")
            depth--;
        else if (list[i] === "," && depth === 0) {
            parts.push(list.slice(start, i).trim());
            start = i + 1;
        }
    }

    parts.push(list.slice(start).trim());

    return parts;
}

/** Every selector, one per list entry, of the rules that keep the room down a region's root. */
const regionRoots = rules
    .filter(rule => rule.body.includes(keepsRoom))
    .flatMap(rule => entries(rule.selector))
    .filter(part => part.includes("[data-ui-region") && !part.endsWith(":dir(rtl)"));

test("no region's root keeps the room where a list's or a tree's host keeps its own, nor a rail or a collapsed panel", () => {
    const roots = regionRoots.filter(part => /> \[data-ui-id\][^>]*$/.test(part));

    assert.ok(roots.length >= 8, `found ${roots.length}`);

    for (const root of roots)
        assert.ok(root.includes(`> [data-ui-id]${ownScroller}`), root);

    // A list or a tree whose host does not scroll takes the region's room on that host instead.
    assert.ok(regionRoots.some(part => part.includes("> .ui-items-view") && part.endsWith(".ui-scroll-y--disabled")));
    assert.ok(regionRoots.some(part => part.includes("> .ui-tree") && part.endsWith("> .ui-tree__host.ui-scroll-y--disabled")));
});

const bound = ":not([style*=\"--ui-height\"], [style*=\"--ui-max-height\"])";

test("a list, a tree or a scroll container its own size bounds keeps the room always; one that grows with its rows only while it overflows", () => {
    // Every scroller keeps it, the text area's field too — bounded by its rows.
    const kept = rules.find(rule => rule.body.includes(keepsRoom) && rule.selector.includes(".ui-text-area__field") && rule.selector.startsWith("html[data-ui-overlay-scrollbars]"));

    assert.ok(kept);
    assert.ok(kept.selector.includes(":is(.ui-items-view__host, .ui-items-view > [data-ui-items-host], .ui-tree__host, .ui-scroll):is(.ui-scroll-y--auto, .ui-scroll-y--always)"), kept.selector);

    // One with no Height, MaxHeight or Fill gives it back while it fits and takes it from its own scroll timeline while it overflows.
    const growing = rules.find(rule => rule.body.includes("animation: ui-scroll-room-overflowing") && rule.selector.includes(".ui-items-view"));

    assert.ok(growing);
    assert.equal(growing.selector, `html[data-ui-overlay-scrollbars] :is(.ui-items-view${bound} > :is(.ui-items-view__host, [data-ui-items-host]), .ui-tree${bound} > .ui-tree__host, .ui-scroll${bound}):is(.ui-scroll-y--auto, .ui-scroll-y--always)`);
    assert.match(growing.body, /--ui-scroll-room-y: 0px;/);
    assert.match(growing.body, /animation-timeline: scroll\(self block\);/);
    assert.ok(!growing.selector.includes("ui-text-area"), "a text area's field keeps its room always");

    // Only where the overlay bar is drawn and a scroll timeline runs: elsewhere a growing scroller keeps the room as a bounded one does.
    const at = css.indexOf(growing.selector);
    const gate = css.lastIndexOf("@media", at);

    assert.match(css.slice(gate, at), /^@media \(hover: hover\) and \(forced-colors: none\) \{\s*@supports \(animation-timeline: scroll\(\)\) \{\s*$/);

    // It comes after the hung room's rule, which it matches the weight of, so a growing list in a container's free air keeps none
    // while it fits; while it overflows it keeps what the air lacks, as a bounded one does.
    const hung = rules.find(rule => rule.selector.includes("[style*=\"--ui-scrollbar-air\"] :is(.ui-items-view__host") && rule.body.includes("--ui-scroll-hung:"));

    assert.ok(hung);
    assert.ok(css.indexOf(hung.selector) < at);

    const room = /@keyframes ui-scroll-room-overflowing\s*\{[^}]*\{([^}]*)\}/.exec(css);

    assert.ok(room !== null);
    assert.match(room[1], /--ui-scroll-room-y: calc\(var\(--ui-scrollbar-room\) - var\(--ui-scroll-hung\)\);/);
});

test("a list or a tree that grows with its rows at a region's root takes the region's room on its host", () => {
    assert.ok(regionRoots.some(part => part.endsWith(`> .ui-items-view${bound} > :is(.ui-items-view__host, [data-ui-items-host])`)));
    assert.ok(regionRoots.some(part => part.endsWith(`> .ui-tree${bound} > .ui-tree__host`)));
});

test("a side or a drawer that scrolls alone keeps no room in a root filling its height; the page's bar keeps it on the right side", () => {
    const sides = regionRoots.filter(part => part.includes("[data-ui-scroll-content] > :is([data-ui-region=\"left-side\"]") && part.includes("> [data-ui-id]"));
    const drawers = regionRoots.filter(part => part.includes("[data-ui-side-drawers") && /\[data-ui-region="(left|right)-side"\][^>]* > \[data-ui-id\]/.test(part));
    const pageEdge = regionRoots.filter(part => part.includes("[data-ui-root]:not([data-ui-scroll-content]) > :is([data-ui-region=\"header\"]") && part.includes("> [data-ui-id]"));

    assert.ok(sides.length > 0 && drawers.length > 0 && pageEdge.length > 0);

    for (const part of [...sides, ...drawers])
        assert.ok(part.endsWith(unfilled), part);

    for (const part of pageEdge)
        assert.ok(!part.includes(unfilled), part);
});

test("a blurred scroller's layer reaches over the room its scroller keeps on the bar's side", () => {
    const layer = rules.find(rule => rule.selector === ".ui-scroll[data-ui-surface-image][data-ui-surface-image-blur]:not(.ui-loading, [data-ui-row-drop])::before")?.body ?? "";

    assert.match(layer, /--ui-scroll-room-y: inherit;/);
    assert.match(layer, /--ui-scroll-room-x: inherit;/);
    assert.match(layer, /width: calc\(100% \+ var\(--ui-scroll-room-y\)\);/);
    assert.match(layer, /height: calc\(100% \+ var\(--ui-scroll-room-x\)\);/);
    assert.match(layer, /margin-inline-end: calc\(-100% - var\(--ui-scroll-room-y\)\);/);
});

test("a blurred button group that scrolls keeps its layer over what is in view: its first item, sticky and stretched", () => {
    const layer = rules.find(rule => rule.selector === ".ui-button-group[data-ui-surface-image][data-ui-surface-image-blur]:not(.ui-loading, [data-ui-row-drop])::before")?.body ?? "";

    assert.match(layer, /position: sticky;/);
    assert.match(layer, /inset-inline-start: 0;/);
    assert.match(layer, /flex: none;/);
    assert.match(layer, /align-self: stretch;/);
    assert.doesNotMatch(layer, /position: absolute;/);
    assert.equal(rules.some(rule => rule.selector.startsWith(".ui-button-group[data-ui-surface-image]") && rule.selector.endsWith("::after")), false);
});

test("less motion spares only the strip's fade and a table's edge shades: the room kept by a timeline is one value end to end", () => {
    const exempt = rules.filter(rule => rule.body.includes("animation-duration: auto !important;")).map(rule => rule.selector);

    assert.deepEqual(exempt, [".ui-button-group,\n  .ui-table > .ui-table__scroll::before,\n  .ui-table > .ui-table__scroll::after"]);

    const room = /@keyframes ui-scroll-room-overflowing\s*\{([^}]*)\}/.exec(css);

    assert.ok(room !== null);
    assert.match(room[1], /^\s*from,\s*to\s*\{?/);
});

test("a container's free air after it (ScrollbarAir) is lent, up to the room, to the outermost scroller down its end, past its box", () => {
    const lender = rules.find(rule => rule.selector.endsWith("[style*=\"--ui-scrollbar-air\"]") && rule.body.includes("--ui-scroll-hang:"));

    assert.ok(lender);
    assert.match(lender.body, /--ui-scroll-hang: min\(var\(--ui-scrollbar-air-xxl, .*var\(--ui-scrollbar-air, 0px\)\)+, var\(--ui-scrollbar-room\)\);/);

    const scroller = rules.find(rule => rule.selector.includes("[style*=\"--ui-scrollbar-air\"] :is(.ui-items-view__host") && rule.body.includes("--ui-scroll-hung:"));

    assert.ok(scroller);
    assert.match(scroller.body, /--ui-scroll-room-y: calc\(var\(--ui-scrollbar-room\) - var\(--ui-scroll-hung\)\);/);
    assert.match(scroller.body, /margin-inline-end: calc\(-1 \* var\(--ui-scroll-hung\)\);/);
    assert.match(scroller.body, /border-inline-end: var\(--ui-scroll-hung\) solid transparent;/);
    // A scroll container, a placed child capped at its cell, widens its fill and its cap by what it hangs.
    assert.match(scroller.body, /--ui-fill-width: calc\(100% - var\(--ui-fill-margin-x\) \+ var\(--ui-scroll-hung\)\);/);
    assert.ok(!scroller.selector.includes("ui-text-area"), "a text area's field keeps its room inside its frame");

    // A padded, framed or filled box between stops it: only plain grids and stacks lead down to the scroller.
    const frame = "[style*=\"--ui-border-thickness\"], [style*=\"--ui-surface-color\"], .ui-surface--raised, .ui-surface--flat, .ui-surface--tinted";

    assert.ok(rules.some(rule => rule.selector.includes(`:is([data-ui-id]:not(.ui-container, .ui-stack-panel, .ui-items-view, .ui-tree, .ui-scroll), [data-ui-id][style*="--ui-padding"], [data-ui-id]:is(${frame})) > *`) && rule.body.includes("--ui-scroll-hang: 0px;")));
    assert.ok(rules.some(rule => rule.selector.includes(`[style*="--ui-scrollbar-air"]:is([style*="--ui-padding"], ${frame}) > *`) && rule.body.includes("--ui-scroll-hang: 0px;")));

    // A scroll container framed or filled itself keeps the room inside its edge.
    assert.ok(scroller.selector.includes(`.ui-scroll:not(${frame})`), scroller.selector);

    // A scroller inside it lends nothing on, and the clipping boxes between let the hung room through.
    assert.ok(rules.some(rule => rule.selector.includes("--ui-scrollbar-air") && rule.selector.endsWith("> *") && rule.body.includes("--ui-scroll-hang: 0px;")));
    assert.ok(rules.some(rule => rule.selector.includes("[style*=\"--ui-scrollbar-air\"] :is(.ui-container, .ui-stack-panel)") && rule.body.includes("overflow-clip-margin: var(--ui-scroll-hang);")));
    assert.ok(rules.some(rule => rule.selector.includes("[style*=\"--ui-scrollbar-air\"] :is(.ui-container, .ui-stack-panel)[style*=\"overflow: clip\"]") && rule.body.includes("--ui-scroll-clip-reach: max(6px, var(--ui-scroll-hang));") && rule.body.includes("overflow-clip-margin: var(--ui-scroll-clip-reach);")));

    // Chrome takes no math function in overflow-clip-margin: a calc() or a max() there clips at 0.
    for (const rule of rules.filter(rule => rule.body.includes("overflow-clip-margin:")))
        assert.doesNotMatch(rule.body, /overflow-clip-margin: [^;]*(calc|max|min|clamp)\(/, rule.selector);
});
