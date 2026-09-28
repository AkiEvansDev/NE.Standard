// The tab menu's arithmetic: which built-in entries a tab is offered, and which rules stand between what shows — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import type { MenuRow, TabMenuTab } from "../src/interactions/tab-menu.ts";
import { CloseEntry, DeleteEntry, PinEntry, RenameEntry, UnpinEntry, readTabMenuChoice, shownRules, tabMenuEntries } from "../src/interactions/tab-menu.ts";
import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

const loose: TabMenuTab = { pinned: false, renamable: true, removable: true };
const pinned: TabMenuTab = { pinned: true, renamable: true, removable: true };

function shown(entries: ReadonlyMap<string, boolean>): string[] {
    return [...entries].filter(([, offered]) => offered).map(([key]) => key);
}

test("a strip that chose nothing offers no built-in entry", () => {
    assert.deepEqual(shown(tabMenuEntries(readTabMenuChoice(null), loose)), []);
    assert.deepEqual(shown(tabMenuEntries(readTabMenuChoice(""), loose)), []);
});

test("the chosen entries show as the tab allows them", () => {
    assert.deepEqual(shown(tabMenuEntries(readTabMenuChoice("rename pin close"), loose)), [RenameEntry, PinEntry, CloseEntry]);
    assert.deepEqual(shown(tabMenuEntries(readTabMenuChoice("rename pin delete"), loose)), [RenameEntry, PinEntry, DeleteEntry]);
});

test("a pinned tab is offered Unpin and no remove entry", () => {
    assert.deepEqual(shown(tabMenuEntries(readTabMenuChoice("rename pin delete"), pinned)), [RenameEntry, UnpinEntry]);
});

test("a tab its item keeps from renaming or removing is offered neither", () => {
    assert.deepEqual(shown(tabMenuEntries(readTabMenuChoice("rename pin close"), { pinned: false, renamable: false, removable: false })), [PinEntry]);
});

test("given Close and Delete both, Delete stands alone", () => {
    assert.deepEqual(shown(tabMenuEntries(readTabMenuChoice("close delete"), loose)), [DeleteEntry]);
});

test("a rule shows only between two shown entries", () => {
    // Rename, Pin, Unpin, rule, Close, Delete: a loose tab with Rename, Pin and Close.
    const rows: MenuRow[] = ["shown", "shown", "hidden", "rule", "shown", "hidden"];

    assert.deepEqual(shownRules(rows), [false, false, false, true, false, false]);
});

test("a group left empty takes its rule with it", () => {
    // A pinned tab: Rename, Unpin, then the rule before a remove entry it is not offered.
    assert.deepEqual(shownRules(["shown", "hidden", "shown", "rule", "hidden", "hidden"]), [false, false, false, false, false, false]);

    // Only the remove entry: no rule leads it.
    assert.deepEqual(shownRules(["hidden", "hidden", "hidden", "rule", "shown", "hidden"]), [false, false, false, false, false, false]);
});

test("the application's entries stand fenced on both sides, and an empty middle leaves one rule", () => {
    // Rename, Pin, Unpin, rule, the application's entry, rule, Close, Delete.
    assert.deepEqual(shownRules(["shown", "shown", "hidden", "rule", "shown", "rule", "shown", "hidden"]), [false, false, false, true, false, true, false, false]);

    // The application's entry hidden: the two rules around it are one.
    assert.deepEqual(shownRules(["shown", "shown", "hidden", "rule", "hidden", "rule", "shown", "hidden"]), [false, false, false, true, false, false, false, false]);

    // No built-in entry above: the application's entry leads, with its rule down to the remove entry.
    assert.deepEqual(shownRules(["hidden", "hidden", "hidden", "rule", "shown", "rule", "shown", "hidden"]), [false, false, false, false, false, true, false, false]);
});

test("the chosen entries arrive as the flags' names or their number and leave as tokens", () => {
    const convert = webDomConverters.get("tabMenuEntriesAttribute")!;

    assert.equal(convert("Rename, Pin, Delete"), "rename pin delete");
    assert.equal(convert("Close"), "close");
    assert.equal(convert(1 | 2 | 4), "rename pin close");
    assert.equal(convert("None"), undefined);
    assert.equal(convert(0), undefined);
});
