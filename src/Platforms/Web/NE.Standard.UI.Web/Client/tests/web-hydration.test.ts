// The client's own copy of the values the page was rendered with, and what an unreadable payload costs.

import assert from "node:assert/strict";
import test from "node:test";

import { paintsMoment, readHydration } from "../src/runtime/web-hydration.ts";

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

test("where the prepared runtime stood is read back, and a render that prepared none says nothing", () => {
    assert.equal(readHydration(pageWith("{\"pageId\":\"abc\",\"sequence\":42,\"changes\":{\"updates\":[]}}"))?.sequence, 42);
    assert.equal(readHydration(pageWith("{\"pageId\":null,\"sequence\":null,\"changes\":{\"updates\":[]}}"))?.sequence, null);
    assert.equal(readHydration(pageWith("{\"pageId\":\"abc\",\"sequence\":\"42\"}"))?.sequence, null);
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

test("a row the server drew from a controller's list holds its moment in the change set, which the page writes again after it", () => {
    // As the render hands it over: the insert over the rows it drew, a row's description a phrase with a moment.
    const row = { id: "1", when: { key: "app.sent", arguments: { at: { moment: "2026-09-30T12:33:00.000Z" } } } };
    const drawn = readHydration(pageWith(JSON.stringify({ pageId: "abc", changes: { updates: [{ kind: "CollectionChange", action: "Insert", items: [{ index: 0, key: "1", item: row }] }] } })));
    const plain = readHydration(pageWith(JSON.stringify({ pageId: "abc", changes: { updates: [{ kind: "CollectionChange", action: "Insert", items: [{ index: 0, key: "1", item: { id: "1", when: "Sent" } }] }] } })));

    assert.equal(paintsMoment(drawn), true);
    assert.equal(paintsMoment(plain), false);
    assert.equal(paintsMoment(null), false);
});

test("a title with a moment is one to write again too", () => {
    assert.equal(paintsMoment(readHydration(pageWith(JSON.stringify({ pageId: "abc", title: { key: "page.at", arguments: { at: { moment: "2026-09-30T12:33:00.000Z" } } } })))), true);
});
