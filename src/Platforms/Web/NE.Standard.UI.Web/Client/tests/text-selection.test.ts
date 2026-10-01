// A press of the mouse on what the page does not let the reader select takes a selection away, as a press on a page's ground does; a
// press on selectable words is the browser's own, a control or a field keeps the selection, and a finger's tap is left to the browser.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { TextSelectionEngine } = await import("../src/interactions/text-selection-engine.ts");

const root = fakeDocument.body;
const selectable = new Set<FakeElement>();
let collapsed = false;
let cleared = 0;

const selection = {
    get isCollapsed(): boolean {
        return collapsed;
    },
    removeAllRanges(): void {
        cleared++;
        collapsed = true;
    }
};

new TextSelectionEngine({ root: real<ParentNode>(root), selection: () => real<Selection>(selection), selects: element => selectable.has(element as unknown as FakeElement) });

/** A page with a paragraph's words, a row of a list, a button in it and a field, a highlight standing in the paragraph. */
function page(): { words: FakeElement; row: FakeElement; button: FakeElement; field: FakeElement; menuEntry: FakeElement } {
    const words = FakeElement.of("ui-text ui-content-text");
    const button = FakeElement.of("ui-button", {}, "button");
    const row = FakeElement.of("ui-items-view__item").append(FakeElement.of("ui-text"), button);
    const field = FakeElement.of("ui-field", {}, "input");
    const menuEntry = FakeElement.of("ui-menu-item");

    root.children.length = 0;
    root.append(words, row, field, FakeElement.of("ui-context-menu", { role: "menu" }).append(menuEntry));
    selectable.clear();
    selectable.add(words);
    collapsed = false;
    cleared = 0;

    return { words, row, button, field, menuEntry };
}

function press(target: FakeElement, pointerType = "mouse", button = 0): void {
    target.dispatchEvent(Object.assign(new FakeEvent("pointerdown"), { button, pointerType }));
}

test("a press on a row or on the ground around it takes the highlight away", () => {
    const { row } = page();

    press(row.children[0]);
    assert.equal(cleared, 1);

    collapsed = false;
    press(root);
    assert.equal(cleared, 2);
});

test("a press on selectable words is the browser's own: it starts a selection there", () => {
    const { words } = page();

    press(words);
    assert.equal(cleared, 0);
});

test("a control, a field and an open menu keep the highlight, which they may act on", () => {
    const { button, field, menuEntry } = page();

    press(button);
    press(field);
    press(menuEntry);
    assert.equal(cleared, 0);
});

test("a finger's tap, a right press and a selection already gone leave it alone", () => {
    const { row } = page();

    press(row, "touch");
    press(row, "mouse", 2);
    assert.equal(cleared, 0);

    collapsed = true;
    press(row);
    assert.equal(cleared, 0);
});
