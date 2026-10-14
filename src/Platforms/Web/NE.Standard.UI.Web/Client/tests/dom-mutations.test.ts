// An engine that re-reads whole components answers a batch of mutations by the components they touched: the one a change happened
// inside, or those under a change above them. A list's rows put in one by one are a record each on the same host, and the host is
// looked into once for the batch, not once a row: a conversation's switch puts in a hundred rows under every such engine.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { collectComponents } = await import("../src/interactions/dom-mutations.ts");

/** A host of `count` rows, each holding a stamp, and how many times the host was searched. */
function hostOfRows(count: number): { readonly host: FakeElement; readonly searches: () => number } {
    const host = FakeElement.of("ui-items-view__host");
    let searches = 0;

    for (let index = 0; index < count; index++)
        host.append(FakeElement.of("ui-items-view__item").append(FakeElement.of("ui-timestamp")));

    const search = host.querySelectorAll.bind(host);

    host.querySelectorAll = (selector: string): FakeElement[] => {
        searches++;
        return search(selector);
    };

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(host);

    return { host, searches: () => searches };
}

function inserted(target: FakeElement): MutationRecord {
    return real<MutationRecord>({ type: "childList", target });
}

test("rows put in one by one on a host have it searched once for the batch, every component under it found", () => {
    const { host, searches } = hostOfRows(20);
    const records = host.children.map(() => inserted(host));

    const found = collectComponents(real<ParentNode>(fakeDocument.body), records, ".ui-timestamp");

    assert.equal(searches(), 1);
    assert.equal(found?.size, 20);
});

test("a change inside a component names that component, without a search under it", () => {
    const { host, searches } = hostOfRows(3);
    const stamp = host.children[1].children[0];

    const found = collectComponents(real<ParentNode>(fakeDocument.body), [inserted(stamp), inserted(stamp)], ".ui-timestamp");

    assert.equal(searches(), 0);
    assert.deepEqual([...found ?? []], [stamp]);
});

test("a batch that touched no component answers none", () => {
    const { host } = hostOfRows(2);

    assert.equal(collectComponents(real<ParentNode>(fakeDocument.body), [inserted(host), inserted(host)], ".ui-menu"), null);
});
