// A sign-in's one-time token is traded for the new key's cookie before the page loads another page, or sends anything else the cookie rides
// on — a staged value, an upload's selection: one ahead of the trade would carry the old key, which names nothing now.

import assert from "node:assert/strict";
import test from "node:test";

import { readSelectionAsync } from "../src/interactions/file-upload.ts";
import { SessionKeyExchange, pageSessionKey, startSessionKeys } from "../src/runtime/session-key.ts";
import { fetchStagedValuesAsync, stageValueAsync } from "../src/transport/value-staging.ts";

/** A trade the test answers by hand, recording the tokens it was asked for. */
function manualTrade(): { readonly traded: string[]; readonly trade: (token: string) => Promise<void>; answer(): void } {
    const traded: string[] = [];
    const waiting: (() => void)[] = [];

    return {
        traded,
        trade: token => {
            traded.push(token);

            return new Promise<void>(resolve => waiting.push(resolve));
        },
        answer: () => waiting.shift()?.()
    };
}

// The microtasks a settled trade's continuations run in.
async function turn(): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 0));
}

test("a load waits for the token being traded", async () => {
    const trade = manualTrade();
    const exchange = new SessionKeyExchange(trade.trade);
    const loads: string[] = [];

    exchange.start("token-1");
    exchange.load(() => loads.push("next page"));

    await turn();

    assert.deepEqual(trade.traded, ["token-1"]);
    assert.deepEqual(loads, []);

    trade.answer();
    await turn();

    assert.deepEqual(loads, ["next page"]);
});

test("with nothing to trade a load goes at once", () => {
    const exchange = new SessionKeyExchange(() => Promise.reject(new Error("nothing should be traded")));
    const loads: string[] = [];

    exchange.load(() => loads.push("next page"));

    assert.deepEqual(loads, ["next page"]);
});

test("a token is traded once, however often it arrives", async () => {
    const trade = manualTrade();
    const exchange = new SessionKeyExchange(trade.trade);

    startSessionKeys(exchange, [{ kind: "SessionKey", token: "token-1" }, { kind: "Navigate" }]);
    exchange.start("token-1");

    await turn();

    assert.deepEqual(trade.traded, ["token-1"]);
});

test("a second sign-in's token is traded after the first, so its cookie is the one kept", async () => {
    const trade = manualTrade();
    const exchange = new SessionKeyExchange(trade.trade);

    exchange.start("token-1");
    exchange.start("token-2");

    await turn();

    assert.deepEqual(trade.traded, ["token-1"]);

    trade.answer();
    await turn();

    assert.deepEqual(trade.traded, ["token-1", "token-2"]);

    const loads: string[] = [];
    exchange.load(() => loads.push("next page"));
    await turn();

    assert.deepEqual(loads, [], "the second token is still being traded");
});

test("a failed trade still lets the page load", async () => {
    const exchange = new SessionKeyExchange(() => Promise.reject(new Error("refused")));
    const loads: string[] = [];
    const error = console.error;

    // The logged failure reads as "error :", which MSBuild's Exec takes for a build error when the build runs these tests.
    console.error = () => {};

    try {
        exchange.start("token-1");
        exchange.load(() => loads.push("next page"));

        await turn();
    }
    finally {
        console.error = error;
    }

    assert.deepEqual(loads, ["next page"]);
});

/** A fetch that holds the trade until the test answers it, recording every address asked and answering the rest at once. */
function heldTradeFetch(): { readonly asked: string[]; answer(): void; restore(): void } {
    const original = globalThis.fetch;
    const asked: string[] = [];
    const held: (() => void)[] = [];

    globalThis.fetch = (async (input: string) => {
        asked.push(input);

        if (input === "/_ne/session/key")
            return await new Promise<Response>(resolve => held.push(() => resolve(new Response(null, { status: 204 }))));

        const body = input === "/_ne/values" ? { token: "staged" } : input.startsWith("/_ne/files/selection/") ? { files: [] } : "a large text";

        return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
    }) as typeof fetch;

    return {
        asked,
        answer: () => held.shift()?.(),
        restore: () => {
            globalThis.fetch = original;
        }
    };
}

test("a staged value is fetched once the token being traded is, as the server stages it under the signed-in session", async () => {
    const fetch = heldTradeFetch();

    try {
        pageSessionKey.start("token-staged-read");

        const fetched = fetchStagedValuesAsync({ updates: [{ kind: "Value", address: {}, valueToken: "abc" }] } as never, "connection 1");

        await turn();

        assert.deepEqual(fetch.asked, ["/_ne/session/key"]);

        fetch.answer();

        assert.deepEqual((await fetched)?.updates, [{ kind: "Value", address: {}, value: "a large text" }]);
        assert.deepEqual(fetch.asked, ["/_ne/session/key", "/_ne/values/abc?instance=connection%201"]);
    }
    finally {
        fetch.restore();
    }
});

test("a value staged from the page, and a selection read back, wait for the token being traded", async () => {
    const fetch = heldTradeFetch();

    try {
        pageSessionKey.start("token-staged-post");

        const staged = stageValueAsync(new TextEncoder().encode("\"text\""));
        const selection = readSelectionAsync("selection-1");

        await turn();

        assert.deepEqual(fetch.asked, ["/_ne/session/key"]);

        fetch.answer();

        assert.equal(await staged, "staged");
        assert.equal(await selection, null);
        assert.deepEqual(fetch.asked, ["/_ne/session/key", "/_ne/values", "/_ne/files/selection/selection-1"]);
    }
    finally {
        fetch.restore();
    }
});

test("with nothing to trade a staged value is fetched at once", async () => {
    const fetch = heldTradeFetch();

    try {
        await fetchStagedValuesAsync({ updates: [{ kind: "Value", address: {}, valueToken: "abc" }] } as never);

        assert.deepEqual(fetch.asked, ["/_ne/values/abc"]);
    }
    finally {
        fetch.restore();
    }
});
