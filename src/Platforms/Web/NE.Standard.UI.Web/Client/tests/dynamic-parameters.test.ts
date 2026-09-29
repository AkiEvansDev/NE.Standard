// Which rows an element stands in, read off the `data-ui-key`s above it: a word the server recorded for an item names the keys from
// the innermost, the whole chain on the page or only the inner rows' inside a template — over a stand-in for the DOM that knows
// attributes and parents, which is all the walk reads.

import assert from "node:assert/strict";
import test from "node:test";

import { endsWithDynamicParameters } from "../src/addressing/dynamic-parameters.ts";

class FakeElement {
    public readonly parentElement: FakeElement | null;
    private readonly key: string | null;

    public constructor(parentElement: FakeElement | null, key: string | null = null) {
        this.parentElement = parentElement;
        this.key = key;
    }

    public getAttribute(name: string): string | null {
        return name === "data-ui-key" ? this.key : null;
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
