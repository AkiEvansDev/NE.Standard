// The client's own copy of the values the page was rendered with, and what an unreadable payload costs.

import assert from "node:assert/strict";
import test from "node:test";

import { readHydration } from "../src/runtime/web-hydration.ts";

function pageWith(json: string | null): ParentNode {
    const script = json === null
        ? null
        : { textContent: json };

    return { querySelector: () => script } as unknown as ParentNode;
}

test("the values the render put in the page are read back", () => {
    const payload = readHydration(pageWith("{\"pageId\":\"abc\",\"changes\":{\"updates\":[]}}"));

    assert.equal(payload?.pageId, "abc");
    assert.deepEqual(payload?.changes, { updates: [] });
});

test("the compile the page was rendered from is read back, and a page without one presents none", () => {
    assert.equal(readHydration(pageWith("{\"pageId\":\"abc\",\"view\":\"0123456789abcdef\",\"changes\":{\"updates\":[]}}"))?.view, "0123456789abcdef");
    assert.equal(readHydration(pageWith("{\"pageId\":\"abc\",\"changes\":{\"updates\":[]}}"))?.view, null);
});

test("a render that read a runtime it did not build hands nothing over", () => {
    const payload = readHydration(pageWith("{\"pageId\":null,\"changes\":{\"updates\":[]}}"));

    assert.equal(payload?.pageId, null);
});

test("a payload this client cannot read costs the page nothing", () => {
    assert.equal(readHydration(pageWith("{not json")), null);
});

test("a page that hydrates nothing has no payload", () => {
    assert.equal(readHydration(pageWith(null)), null);
});
