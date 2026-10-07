// Which values travel beside the hub — past 8 KB of JSON, counted in UTF-8 bytes rather than characters — and how a value the server
// staged is fetched back into its update.

import assert from "node:assert/strict";
import test from "node:test";

import { LargeValueBytes, fetchStagedValuesAsync, hasStagedValues, largeValueBody } from "../src/transport/value-staging.ts";

test("a value within the threshold goes inline", () => {
    assert.equal(largeValueBody("short"), null);
    assert.equal(largeValueBody(undefined), null);
    // The JSON string's two quotes bring it to the threshold exactly.
    assert.equal(largeValueBody("x".repeat(LargeValueBytes - 2)), null);
});

test("a value past the threshold is staged as its JSON", () => {
    const body = largeValueBody("x".repeat(LargeValueBytes - 1));

    assert.notEqual(body, null);
    assert.equal(new TextDecoder().decode(body!), JSON.stringify("x".repeat(LargeValueBytes - 1)));
});

test("the threshold is bytes, so a text of fewer characters in a wider script is staged", () => {
    // Cyrillic is two bytes a character: half the threshold in characters is past it in bytes.
    assert.notEqual(largeValueBody("я".repeat(LargeValueBytes / 2)), null);
});

test("an object is measured by its whole JSON", () => {
    const nodes = Array.from({ length: 200 }, (_, index) => ({ id: `node-${index}`, x: index, y: index, title: "A node" }));

    assert.notEqual(largeValueBody({ nodes }), null);
});

test("a change set naming no staged value is left as it is", async () => {
    const changes = { updates: [{ kind: "Value", address: {}, value: "short" }] };

    assert.equal(hasStagedValues(changes as never), false);
    assert.equal(await fetchStagedValuesAsync(changes as never), changes);
});

test("a staged value is fetched into its update, and the token is gone", async () => {
    const original = globalThis.fetch;
    const asked: string[] = [];

    globalThis.fetch = (async (url: string) => {
        asked.push(url);
        return new Response(JSON.stringify("a large text"), { status: 200, headers: { "Content-Type": "application/json" } });
    }) as typeof fetch;

    try {
        const changes = { updates: [{ kind: "Value", address: {}, valueToken: "abc" }, { kind: "Value", address: {}, value: 1 }] };
        const resolved = await fetchStagedValuesAsync(changes as never);

        assert.equal(hasStagedValues(changes as never), true);
        assert.deepEqual(asked, ["/_ne/values/abc"]);
        assert.deepEqual(resolved?.updates, [{ kind: "Value", address: {}, value: "a large text" }, { kind: "Value", address: {}, value: 1 }]);
    }
    finally {
        globalThis.fetch = original;
    }
});

test("a staged value is fetched as the connection it was sent to, so the read is that tab's own", async () => {
    const original = globalThis.fetch;
    const asked: string[] = [];

    globalThis.fetch = (async (url: string) => {
        asked.push(url);
        return new Response(JSON.stringify("a large text"), { status: 200, headers: { "Content-Type": "application/json" } });
    }) as typeof fetch;

    try {
        await fetchStagedValuesAsync({ updates: [{ kind: "Value", address: {}, valueToken: "abc" }] } as never, "connection 1");

        assert.deepEqual(asked, ["/_ne/values/abc?instance=connection%201"]);
    }
    finally {
        globalThis.fetch = original;
    }
});

test("a staged value that never arrives fails once its time is up, rather than holding every change set behind it", async () => {
    const original = globalThis.fetch;

    globalThis.fetch = ((_url: string, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
    })) as typeof fetch;

    // The timeout's own timer does not hold the process open, and the stand-in fetch holds nothing: without this, a runner may end
    // the test as pending before the time is up.
    const alive = setTimeout(() => { }, 60_000);

    try {
        const changes = { updates: [{ kind: "Value", address: {}, valueToken: "abc" }] };

        await assert.rejects(fetchStagedValuesAsync(changes as never, null, 10));
    }
    finally {
        clearTimeout(alive);
        globalThis.fetch = original;
    }
});
