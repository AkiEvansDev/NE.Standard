// Which rows an element stands in, read off the `data-ui-key`s above it: a word the server recorded for an item names the keys from
// the innermost, the whole chain on the page or only the inner rows' inside a template — over a stand-in for the DOM that knows
// attributes and parents, which is all the walk reads. A row's key repeated inside the row, on a menu's submenu, counts once.

import assert from "node:assert/strict";
import test from "node:test";

import { collectDynamicParameters, endsWithDynamicParameters } from "../src/addressing/dynamic-parameters.ts";

class FakeElement {
    public readonly parentElement: FakeElement | null;
    private readonly key: string | null;
    private readonly host: boolean;

    public constructor(parentElement: FakeElement | null, key: string | null = null, host = false) {
        this.parentElement = parentElement;
        this.key = key;
        this.host = host;
    }

    public getAttribute(name: string): string | null {
        return name === "data-ui-key" ? this.key : name === "data-ui-items-host" && this.host ? "" : null;
    }

    /** The items host it stands in or is: the one selector the walk asks for. */
    public closest(selector: string): FakeElement | null {
        assert.equal(selector, "[data-ui-items-host]");

        return this.host ? this : this.parentElement?.closest(selector) ?? null;
    }
}

/** An option's caption in a grid's row: the row keyed, the option inside it keyed, the caption inside the option. */
function captionIn(rowKey: string | null, optionKey: string): Element {
    const row = rowKey === null ? null : new FakeElement(null, rowKey);
    const option = new FakeElement(new FakeElement(row), optionKey);

    return new FakeElement(option) as unknown as Element;
}

test("the whole chain of keys matches the element standing in those rows", () => {
    assert.equal(endsWithDynamicParameters(captionIn("row-1", "trial"), ["row-1", "trial"]), true);
    assert.equal(endsWithDynamicParameters(captionIn("row-2", "trial"), ["row-1", "trial"]), false);
});

test("the inner keys alone match that option in every row's copy, and in the template itself", () => {
    assert.equal(endsWithDynamicParameters(captionIn("row-1", "active"), ["active"]), true);
    assert.equal(endsWithDynamicParameters(captionIn("row-2", "active"), ["active"]), true);
    assert.equal(endsWithDynamicParameters(captionIn(null, "active"), ["active"]), true);
    assert.equal(endsWithDynamicParameters(captionIn("row-1", "trial"), ["active"]), false);
});

test("a chain longer than the rows around the element does not match", () => {
    assert.equal(endsWithDynamicParameters(captionIn(null, "trial"), ["row-1", "trial"]), false);
});

test("no keys match every element, and keys compare as the text the page reads", () => {
    assert.equal(endsWithDynamicParameters(captionIn("row-1", "trial"), []), true);
    assert.equal(endsWithDynamicParameters(captionIn("7", "1"), [7, 1]), true);
});

/** A submenu's entry in a row's context menu: the row in a list, the entry in the menu's list, its submenu keyed as the entry. */
function submenuEntryIn(rowKey: string, entryKey: string): Element {
    const row = new FakeElement(new FakeElement(null, null, true), rowKey);
    const entry = new FakeElement(new FakeElement(new FakeElement(row), null, true), entryKey);
    const submenu = new FakeElement(entry, entryKey);

    return new FakeElement(new FakeElement(submenu)) as unknown as Element;
}

test("a row's key repeated inside the row counts once: a submenu in a row's menu is addressed by the row and its entry", () => {
    assert.deepEqual(collectDynamicParameters(submenuEntryIn("e3", "save"), 2), ["e3", "save"]);
    assert.equal(endsWithDynamicParameters(submenuEntryIn("e3", "save"), ["e3", "save"]), true);
    assert.equal(endsWithDynamicParameters(submenuEntryIn("e3", "save"), ["save", "save"]), false);
});

test("the same key at two levels of nested lists is two keys", () => {
    const outer = new FakeElement(new FakeElement(null, null, true), "a");
    const inner = new FakeElement(new FakeElement(outer, null, true), "a");

    assert.deepEqual(collectDynamicParameters(new FakeElement(inner) as unknown as Element, 2), ["a", "a"]);
});
