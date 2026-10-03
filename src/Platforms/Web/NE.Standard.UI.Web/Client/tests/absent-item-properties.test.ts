// The wire leaves an item's nulls and empty collections out: a property an item does not carry reads as the null it held.

import assert from "node:assert/strict";
import test from "node:test";

import { readItemPropertyPath, resolveItemPropertyKey, tryReadItemProperty } from "../src/items/binding-template-evaluator.ts";

test("a property an item does not carry reads as null, as a null it carries does", () => {
    assert.deepEqual(tryReadItemProperty({ id: "a" }, "Description"), { ok: true, value: null });
    assert.deepEqual(tryReadItemProperty({ id: "a", description: null }, "Description"), { ok: true, value: null });
});

test("what an item does carry is read as before, a false and an empty list included", () => {
    assert.deepEqual(tryReadItemProperty({ selected: false }, "Selected"), { ok: true, value: false });
    assert.deepEqual(tryReadItemProperty({ items: [] }, "Items"), { ok: true, value: [] });
});

test("only a record leaves properties out: nothing, a scalar and a list have none to read", () => {
    assert.equal(tryReadItemProperty(null, "Title").ok, false);
    assert.equal(tryReadItemProperty("text", "Title").ok, false);
    assert.equal(tryReadItemProperty(["a"], "Title").ok, false);
});

test("a path reads null at a property left out, and nothing past it", () => {
    assert.equal(readItemPropertyPath({ id: "a" }, "Owner"), null);
    assert.equal(readItemPropertyPath({ id: "a" }, "Owner.Name"), undefined);
    assert.equal(readItemPropertyPath({ owner: { name: "Ada" } }, "Owner.Name"), "Ada");
});

test("a key the wire wrote in another case is still found, and a key of another length is not mistaken for it", () => {
    assert.equal(resolveItemPropertyKey({ URL: "x" }, "Url"), "URL");
    assert.equal(resolveItemPropertyKey({ urls: "x" }, "Url"), "url");
});
