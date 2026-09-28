// A row key goes into an attribute selector as the inside of a quoted string: whatever it holds must still be one valid string.

import assert from "node:assert/strict";
import test from "node:test";

import { cssAttributeValue } from "../src/addressing/dom-attributes.ts";

test("a quote and a backslash are escaped", () => {
    assert.equal(cssAttributeValue("a\"b\\c"), "a\\\"b\\\\c");
});

test("a newline and other control characters go as hex escapes, so the selector does not end mid-key", () => {
    assert.equal(cssAttributeValue("a\nb"), "a\\a b");
    assert.equal(cssAttributeValue("a\tb\u007f"), "a\\9 b\\7f ");
});

test("a number and an ordinary key are left as they are", () => {
    assert.equal(cssAttributeValue(42), "42");
    assert.equal(cssAttributeValue("order-7/Ω"), "order-7/Ω");
});
