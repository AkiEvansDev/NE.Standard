// Values reach the hub in the order they were given, a large one staged beside the hub included; a small value with nothing
// ahead of it goes at once, a value that could not be staged is dropped without holding up the ones behind it, and the values
// given while a change set is in flight go together in the next, a field given twice keeping only its latest value.

import assert from "node:assert/strict";
import test from "node:test";

import type { WebUIChangeSetRequest } from "../src/metadata/metadata-index.ts";
import { LargeValueBytes } from "../src/transport/value-staging.ts";
import { ValueChangeDispatcher } from "../src/transport/value-change-dispatcher.ts";

type Post = { readonly resolve: (token: string) => void; readonly fail: (status: number) => void };

// The hub as a list of what reached it, in order: a value by its own text, a staged one by its token.
function createHub(): { readonly sent: string[]; processChangeSetAsync(request: WebUIChangeSetRequest): Promise<void> } {
    const sent: string[] = [];

    return {
        sent,
        processChangeSetAsync(request) {
            for (const update of request.updates)
                sent.push(describe(update));

            return Promise.resolve();
        }
    };
}

function describe(update: WebUIChangeSetRequest["updates"][number]): string {
    return update.valueToken !== undefined ? `token:${update.valueToken}` : String(update.value);
}

// A hub whose answers wait until the test gives them, recording each change set as one entry.
function createHeldHub(): { readonly sets: string[][]; answer(): void; processChangeSetAsync(request: WebUIChangeSetRequest, before?: () => void): Promise<void> } {
    const sets: string[][] = [];
    const answers: (() => void)[] = [];

    return {
        sets,
        answer: () => answers.shift()?.(),
        processChangeSetAsync(request, before) {
            sets.push(request.updates.map(describe));

            return new Promise<void>(resolve => answers.push(() => {
                before?.();
                resolve();
            }));
        }
    };
}

// Every POST to the staging endpoint waits until the test answers it, in whatever order the test chooses.
function holdPosts(): { readonly posts: Post[]; restore(): void } {
    const original = globalThis.fetch;
    const posts: Post[] = [];

    globalThis.fetch = ((_url: string) => new Promise<Response>(resolve => {
        posts.push({
            resolve: token => resolve(new Response(JSON.stringify({ token }), { status: 200, headers: { "Content-Type": "application/json" } })),
            fail: status => resolve(new Response(null, { status }))
        });
    })) as typeof fetch;

    return { posts, restore: () => { globalThis.fetch = original; } };
}

function value(text: string, componentId = 1): { componentId: number; propertyName: string; dynamicParameters: unknown[]; value: string } {
    return { componentId, propertyName: "Value", dynamicParameters: [], value: text };
}

const large = "x".repeat(LargeValueBytes);

async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 5));
}

test("a small value with nothing ahead of it goes onto the hub at once", () => {
    const hub = createHub();
    const dispatcher = new ValueChangeDispatcher(hub);

    void dispatcher.dispatchAsync(value("a"));

    assert.deepEqual(hub.sent, ["a"]);
});

test("a small value waits for the large one given before it", async () => {
    const hub = createHub();
    const { posts, restore } = holdPosts();

    try {
        const dispatcher = new ValueChangeDispatcher(hub);
        const first = dispatcher.dispatchAsync(value(large));
        const second = dispatcher.dispatchAsync(value("small"));

        await settle();
        assert.deepEqual(hub.sent, []);

        posts[0].resolve("t1");
        await Promise.all([first, second]);

        assert.deepEqual(hub.sent, ["token:t1", "small"]);
    }
    finally {
        restore();
    }
});

test("two staged values reach the hub in the order they were given, whichever post answers first", async () => {
    const hub = createHub();
    const { posts, restore } = holdPosts();

    try {
        const dispatcher = new ValueChangeDispatcher(hub);
        const first = dispatcher.dispatchAsync(value(large));
        const second = dispatcher.dispatchAsync(value(`${large}y`));

        await settle();
        assert.equal(posts.length, 2);

        posts[1].resolve("t2");
        await settle();
        assert.deepEqual(hub.sent, []);

        posts[0].resolve("t1");
        await Promise.all([first, second]);

        assert.deepEqual(hub.sent, ["token:t1", "token:t2"]);
    }
    finally {
        restore();
    }
});

test("a command waits until every value given before it has been handed to the hub", async () => {
    const hub = createHub();
    const { posts, restore } = holdPosts();

    try {
        const dispatcher = new ValueChangeDispatcher(hub);
        let commandSent = false;

        void dispatcher.dispatchAsync(value(large));
        const command = dispatcher.whenSent().then(() => {
            commandSent = true;
            hub.sent.push("command");
        });

        await settle();
        assert.equal(commandSent, false);

        posts[0].resolve("t1");
        await command;

        assert.deepEqual(hub.sent, ["token:t1", "command"]);
    }
    finally {
        restore();
    }
});

test("a value that could not be staged is dropped, and the values behind it go on", async () => {
    const hub = createHub();
    const { posts, restore } = holdPosts();

    try {
        const dispatcher = new ValueChangeDispatcher(hub);
        const failed = dispatcher.dispatchAsync(value(large));
        const next = dispatcher.dispatchAsync(value("after"));

        await settle();
        posts[0].fail(413);

        await assert.rejects(failed, /413/);
        await next;

        assert.deepEqual(hub.sent, ["after"]);
    }
    finally {
        restore();
    }
});

test("the queue empties once the last value is handed over, and a small value then goes at once again", async () => {
    const hub = createHub();
    const { posts, restore } = holdPosts();

    try {
        const dispatcher = new ValueChangeDispatcher(hub);
        const staged = dispatcher.dispatchAsync(value(large));

        await settle();
        posts[0].resolve("t1");
        await staged;
        await settle();

        void dispatcher.dispatchAsync(value("later"));

        assert.deepEqual(hub.sent, ["token:t1", "later"]);
    }
    finally {
        restore();
    }
});

test("a field given again while a change set is in flight goes once, with its latest value, and every caller settles", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);
    const answered: string[] = [];

    const first = dispatcher.dispatchAsync(value("1"), () => answered.push("1"));
    const second = dispatcher.dispatchAsync(value("2"), () => answered.push("2"));
    const third = dispatcher.dispatchAsync(value("3"), () => answered.push("3"));

    assert.deepEqual(hub.sets, [["1"]]);

    hub.answer();
    await first;
    await settle();

    assert.deepEqual(hub.sets, [["1"], ["3"]]);

    hub.answer();
    await Promise.all([second, third]);

    // The value a later one replaced was never sent, so nothing records it as the server's.
    assert.deepEqual(answered, ["1", "3"]);
});

test("values of different fields given meanwhile keep the order of their latest values", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);

    void dispatcher.dispatchAsync(value("x", 9));
    void dispatcher.dispatchAsync(value("a1", 1));
    void dispatcher.dispatchAsync(value("b1", 2));
    void dispatcher.dispatchAsync(value("a2", 1));

    hub.answer();
    await settle();

    assert.deepEqual(hub.sets, [["x"], ["b1", "a2"]]);
});

test("a command given while values wait goes after they are handed over", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);
    let commandSent = false;

    void dispatcher.dispatchAsync(value("a"));
    void dispatcher.dispatchAsync(value("b", 2));

    const command = dispatcher.whenSent().then(() => {
        commandSent = true;
    });

    await settle();
    assert.equal(commandSent, false);

    hub.answer();
    await command;

    assert.deepEqual(hub.sets, [["a"], ["b"]]);
});
