// Which open popup Escape tries first: one inside another before the one around it, else the newest — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import { orderForEscape } from "../src/interactions/popup-dismissal.ts";

type Popup = {
    readonly name: string;
    readonly sequence: number;
    readonly parent: Popup | null;
};

function popup(name: string, sequence: number, parent: Popup | null = null): Popup {
    return { name, sequence, parent };
}

function contains(outer: Popup, inner: Popup): boolean {
    for (let current = inner.parent; current !== null; current = current.parent) {
        if (current === outer)
            return true;
    }

    return false;
}

function order(entries: readonly Popup[]): string[] {
    return orderForEscape(entries, entry => entry.sequence, contains).map(entry => entry.name);
}

test("unrelated popups go newest first", () => {
    assert.deepEqual(order([popup("select", 1), popup("picker", 3), popup("menu", 2)]), ["picker", "menu", "select"]);
});

test("a popup inside another goes first, even numbered older", () => {
    // Both first seen by the same Escape: the flyout's dismissal was built last, so it drew the higher number.
    const flyout = popup("flyout", 2);

    assert.deepEqual(order([popup("select", 1, flyout), flyout]), ["select", "flyout"]);
});

test("a chain of popups unwinds from the innermost", () => {
    const flyout = popup("flyout", 3);
    const menu = popup("menu", 1, flyout);

    assert.deepEqual(order([flyout, popup("list", 2, menu), menu, popup("tooltip", 4)]), ["tooltip", "list", "menu", "flyout"]);
});
