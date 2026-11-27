// An engine that re-reads whole components answers a batch of mutations by the components they touched: the one a change happened
// inside, or those under a change above them. A list's rows put in one by one are a record each on the same host, and the host is
// looked into once for the batch, not once a row: a conversation's switch puts in a hundred rows under every such engine. An engine
// reading a component's own subtree alone asks for the nodes put in only (`addedOnly`): a row put into a long list is that row's.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// The observers the engines make, so a test can hand them the records a browser would.
const observers: ((records: readonly MutationRecord[]) => void)[] = [];
let queuedRecords: MutationRecord[] = [];

installFakeDom({
    MutationObserver: class {
        public constructor(callback: (records: readonly MutationRecord[]) => void) {
            observers.push(callback);
        }

        public observe(): void {
        }

        public disconnect(): void {
            queuedRecords = [];
        }

        public takeRecords(): MutationRecord[] {
            const drained = queuedRecords;

            queuedRecords = [];

            return drained;
        }
    }
});

const { collectComponents, flushRootMutations, observeComponents, observeMutations } = await import("../src/interactions/dom-mutations.ts");
const { MetadataIndex } = await import("../src/metadata/metadata-index.ts");
const { TimestampEngine } = await import("../src/interactions/timestamp-engine.ts");

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

test("with addedOnly a row put into a long list names the stamps it holds alone: the list is never searched, nor the page swept", () => {
    const { host, searches } = hostOfRows(100);
    const rows = Array.from({ length: 40 }, () => FakeElement.of("ui-items-view__item").append(FakeElement.of("ui-timestamp")));

    host.append(...rows);

    // A row drawn and dropped again before the batch is read names nothing.
    const dropped = FakeElement.of("ui-items-view__item").append(FakeElement.of("ui-timestamp"));
    const records = [...rows, dropped].map(row => added(host, row));

    const found = collectComponents(real<ParentNode>(fakeDocument.body), records, ".ui-timestamp", true);

    assert.equal(searches(), 0);
    assert.deepEqual([...found ?? []], rows.map(row => row.children[0]));
});

test("with addedOnly a node put inside a component still names that component", () => {
    const { host } = hostOfRows(3);
    const stamp = host.children[1].children[0];
    const text = FakeElement.of("ui-timestamp__text");

    stamp.append(text);

    assert.deepEqual([...collectComponents(real<ParentNode>(fakeDocument.body), [added(stamp, text)], ".ui-timestamp", true) ?? []], [stamp]);
});

function added(target: FakeElement, node: FakeElement): MutationRecord {
    return real<MutationRecord>({ type: "childList", target, addedNodes: [node], removedNodes: [] });
}

test("the timestamp engine reads a row put into a list of stamps for that row's stamp alone", () => {
    const { host } = hostOfRows(50);
    const row = FakeElement.of("ui-items-view__item").append(FakeElement.of("ui-timestamp"));
    const read: FakeElement[] = [];

    // Each stamp says when the engine reads it for its text.
    for (const stamp of [...host.children, row].map(each => each.children[0])) {
        const query = stamp.querySelector.bind(stamp);

        stamp.querySelector = (selector: string): FakeElement | null => {
            read.push(stamp);
            return query(selector);
        };
    }

    observers.length = 0;
    new TimestampEngine({ root: real<ParentNode>(fakeDocument.body) });
    read.length = 0;
    host.append(row);
    observers.forEach(observer => observer([added(host, row)]));

    assert.deepEqual(read, [row.children[0]]);
});

test("multiple component and raw observers on the same root share one native MutationObserver and route records by channel", () => {
    const { host } = hostOfRows(2);
    const page = FakeElement.of("page").append(host);
    const stamp = host.children[0].children[0];
    const seenChild: number[] = [];
    const seenAttr: string[] = [];
    const seenRaw: number[] = [];

    fakeDocument.body.replaceChildren(page);
    observers.length = 0;

    const a = observeComponents(real<ParentNode>(page), ".ui-timestamp", { childList: true }, items => seenChild.push([...items].length));
    const b = observeComponents(real<ParentNode>(page), ".ui-timestamp", { attributeFilter: ["data-ui-test-a"] }, items => {
        for (const item of items)
            seenAttr.push(item.className);
    });
    const c = observeMutations(real<ParentNode>(page), { attributeFilter: ["data-ui-test-b"] }, records => seenRaw.push(records.length));

    // Only one native MutationObserver should be created on the root for all subscribers.
    assert.equal(observers.length, 1);

    observers[0]([real<MutationRecord>({ type: "attributes", target: stamp, attributeName: "data-ui-test-a" })]);

    assert.deepEqual(seenChild, []);
    assert.deepEqual(seenAttr, ["ui-timestamp"]);
    assert.deepEqual(seenRaw, []);

    observers[0]([real<MutationRecord>({ type: "attributes", target: stamp, attributeName: "data-ui-test-b" })]);

    assert.deepEqual(seenRaw, [1]);

    a?.disconnect();
    b?.disconnect();
    c?.disconnect();
});

test("reobserving for a later subscriber drains queued records instead of dropping them on disconnect", async () => {
    const { host } = hostOfRows(1);
    const page = FakeElement.of("page").append(host);
    const stamp = host.children[0].children[0];
    const seen: string[] = [];

    fakeDocument.body.replaceChildren(page);
    observers.length = 0;

    const first = observeMutations(real<ParentNode>(page), { attributeFilter: ["data-ui-first"] }, records => {
        for (const record of records)
            seen.push(record.attributeName ?? "");
    });

    queuedRecords = [real<MutationRecord>({ type: "attributes", target: stamp, attributeName: "data-ui-first" })];

    // Adding a subscriber with a new attribute grows the hub options and re-observes; queued records must still arrive.
    const second = observeMutations(real<ParentNode>(page), { attributeFilter: ["data-ui-second"] }, () => undefined);

    await Promise.resolve();

    assert.deepEqual(seen, ["data-ui-first"]);

    first?.disconnect();
    second?.disconnect();
});

test("flushRootMutations drains pending records synchronously, and allowsCoreEngine opens core engines for package views without hardcoding add-on names", () => {
    const { host } = hostOfRows(1);
    const page = FakeElement.of("page").append(host);
    const stamp = host.children[0].children[0];
    const seen: string[] = [];

    fakeDocument.body.replaceChildren(page);
    observers.length = 0;

    const subscription = observeMutations(real<ParentNode>(page), { attributeFilter: ["data-ui-sync"] }, records => {
        for (const record of records)
            seen.push(record.attributeName ?? "");
    });

    queuedRecords = [real<MutationRecord>({ type: "attributes", target: stamp, attributeName: "data-ui-sync" })];
    flushRootMutations(real<ParentNode>(page));

    assert.deepEqual(seen, ["data-ui-sync"]);
    subscription?.disconnect();

    const emptyBase = { propertyDefinitions: [], bindings: [], events: [], interactions: [], items: [], itemsFilterSort: [], validations: [] };
    const coreOnly = new MetadataIndex({ ...emptyBase, componentTypes: ["standard.text", "standard.button"] });
    const withAddon = new MetadataIndex({ ...emptyBase, componentTypes: ["standard.text", "custom.widget"] });
    const unmanifested = new MetadataIndex(emptyBase);

    assert.equal(coreOnly.allowsCoreEngine(["standard.select"]), false);
    assert.equal(coreOnly.allowsCoreEngine(["standard.button"]), true);
    assert.equal(withAddon.allowsCoreEngine(["standard.select"]), true);
    assert.equal(unmanifested.allowsCoreEngine(["standard.select"]), true);
});
