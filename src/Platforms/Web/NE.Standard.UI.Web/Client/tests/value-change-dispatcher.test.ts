// Values reach the hub in the order they were given, a large one staged beside the hub included; a small value with nothing
// ahead of it goes at once, a value that could not be staged is dropped without holding up the ones behind it, and the values
// given while a change set is in flight go together in the next, a field given twice keeping only its latest value. A change set
// the connection dropped under goes again once the page is attached, each field once with its latest value, a large one staged anew.
// A change set stays within the hub's message limit, the rest waiting for the next; one the server closed the connection over twice
// is dropped rather than sent for ever; and values waiting behind an attach that failed go once its retry attaches.

import assert from "node:assert/strict";
import test from "node:test";

import type { WebUIChangeSetRequest } from "../src/metadata/metadata-index.ts";
import { AttachGate, ConnectionDropped } from "../src/transport/attach-gate.ts";
import { LargeValueBytes } from "../src/transport/value-staging.ts";
import { ValueChangeDispatcher } from "../src/transport/value-change-dispatcher.ts";

type Post = { readonly resolve: (token: string) => void; readonly fail: (status: number) => void };

// The hub as a list of what reached it, in order: a value by its own text, a staged one by its token.
function createHub(): { readonly sent: string[]; processChangeSetAsync(request: WebUIChangeSetRequest): Promise<void>; whenAttached(): Promise<void> } {
    const sent: string[] = [];

    return {
        sent,
        processChangeSetAsync(request) {
            for (const update of request.updates)
                sent.push(describe(update));

            return Promise.resolve();
        },
        whenAttached: () => Promise.resolve()
    };
}

function describe(update: WebUIChangeSetRequest["updates"][number]): string {
    return update.valueToken !== undefined ? `token:${update.valueToken}` : String(update.value);
}

type HeldHub = {
    readonly sets: string[][];
    /** Each change set's message as the hub reads it, in bytes. */
    readonly sizes: number[];
    answer(): void;
    /** The connection drops under the oldest change set in flight, and calls wait for the next attach. */
    drop(): void;
    /** The server closes the connection over an error under the oldest change set in flight, as it does past its message limit. */
    dropByServer(): void;
    attach(): void;
    processChangeSetAsync(request: WebUIChangeSetRequest, before?: () => void): Promise<void>;
    whenAttached(): Promise<void>;
};

// A hub whose answers wait until the test gives them, recording each change set as one entry as it reaches the hub.
function createHeldHub(): HeldHub {
    const sets: string[][] = [];
    const sizes: number[] = [];
    const answers: { readonly answer: () => void; readonly drop: (cause: Error) => void }[] = [];
    // Calls waiting for the attach, as the transport's gate holds them; none while attached.
    let waiting: (() => void)[] | null = null;

    const invoke = (request: WebUIChangeSetRequest, before?: () => void): Promise<void> => {
        sets.push(request.updates.map(describe));
        sizes.push(new TextEncoder().encode(JSON.stringify(request)).byteLength);

        return new Promise<void>((resolve, reject) => answers.push({
            answer: () => {
                before?.();
                resolve();
            },
            drop: cause => reject(new ConnectionDropped(cause))
        }));
    };

    return {
        sets,
        sizes,
        answer: () => answers.shift()?.answer(),
        drop: () => {
            waiting = [];
            answers.shift()?.drop(new Error("the socket closed"));
        },
        dropByServer: () => {
            waiting = [];
            answers.shift()?.drop(new Error("Server returned an error on close: Connection closed with an error."));
        },
        attach: () => {
            const resumed = waiting ?? [];

            waiting = null;

            for (const resume of resumed)
                resume();
        },
        processChangeSetAsync(request, before) {
            if (waiting === null)
                return invoke(request, before);

            const held = waiting;

            return new Promise<void>(resume => held.push(resume)).then(() => invoke(request, before));
        },
        whenAttached: () => waiting === null ? Promise.resolve() : new Promise<void>(resume => waiting?.push(resume))
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

test("a change set the connection dropped under goes again once the page is attached, and its callers settle then", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);
    const answered: string[] = [];

    const first = dispatcher.dispatchAsync(value("a"), () => answered.push("a"));
    const other = dispatcher.dispatchAsync(value("x", 2), () => answered.push("x"));

    hub.drop();
    await settle();

    // Nothing goes while the connection is away; the dropped value waits ahead of the one given behind it.
    assert.deepEqual(hub.sets, [["a"]]);

    hub.attach();
    await settle();

    assert.deepEqual(hub.sets, [["a"], ["a", "x"]]);

    hub.answer();
    await Promise.all([first, other]);

    assert.deepEqual(answered, ["a", "x"]);
});

test("a field given again while its dropped value waits goes once, with the newer value, which settles both callers", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);

    const first = dispatcher.dispatchAsync(value("1"));
    const second = dispatcher.dispatchAsync(value("2"));

    hub.drop();
    hub.attach();
    await settle();

    assert.deepEqual(hub.sets, [["1"], ["2"]]);

    hub.answer();
    await Promise.all([first, second]);
});

test("a large value the connection dropped under is staged again after the attach, since the server takes a token once", async () => {
    const hub = createHeldHub();
    const { posts, restore } = holdPosts();

    try {
        const dispatcher = new ValueChangeDispatcher(hub);
        const sent = dispatcher.dispatchAsync(value(large));

        await settle();
        posts[0].resolve("t1");
        await settle();

        hub.drop();
        await settle();

        // No POST while the server may be the one that went away.
        assert.equal(posts.length, 1);

        // A command given meanwhile waits for the value staged again, as for any value given before it.
        let commandSent = false;
        const command = dispatcher.whenSent().then(() => {
            commandSent = true;
        });

        hub.attach();
        await settle();
        assert.equal(commandSent, false);

        posts[1].resolve("t2");
        await command;

        assert.deepEqual(hub.sets, [["token:t1"], ["token:t2"]]);

        hub.answer();
        await sent;
    }
    finally {
        restore();
    }
});

test("a change set refused on a live connection is not sent again", async () => {
    const hub = createHub();
    const dispatcher = new ValueChangeDispatcher({ ...hub, processChangeSetAsync: () => Promise.reject(new Error("refused")) });

    await assert.rejects(dispatcher.dispatchAsync(value("a")), /refused/);
});

test("values given together go in change sets within the hub's message limit, and a command given after them waits for the last", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);
    // Each under the size that stages a value, so each travels inline; six together are past the hub's 32 KB.
    const text = "x".repeat(7 * 1024);
    const sent = [1, 2, 3, 4, 5, 6].map(id => dispatcher.dispatchAsync(value(text, id)));
    let commandSent = false;
    const command = dispatcher.whenSent().then(() => {
        commandSent = true;
    });

    hub.answer();
    await settle();

    assert.equal(hub.sets.length, 2);
    assert.equal(commandSent, false);

    hub.answer();
    await command;

    assert.deepEqual(hub.sets.map(set => set.length), [1, 3, 2]);
    assert.ok(hub.sizes.every(size => size < 24 * 1024 + 512), `change sets of ${hub.sizes.join(", ")} bytes`);

    hub.answer();
    await Promise.all(sent);
});

test("a command waits for a field's value given before it, though a later value of the field moved it behind the others", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);
    const text = "x".repeat(7 * 1024);

    void dispatcher.dispatchAsync(value("first", 9));
    void dispatcher.dispatchAsync(value("a1", 1));

    let commandSent = false;
    const command = dispatcher.whenSent().then(() => {
        commandSent = true;
    });

    void dispatcher.dispatchAsync(value(`${text}b`, 2));
    void dispatcher.dispatchAsync(value(`${text}c`, 3));
    void dispatcher.dispatchAsync(value(`${text}d`, 4));
    void dispatcher.dispatchAsync(value(`${text}e`, 5));
    void dispatcher.dispatchAsync(value("a2", 1));

    hub.answer();
    await settle();

    // Three large ones fill a change set; the field given before the command waits for the next, and so does the command.
    assert.deepEqual(hub.sets.at(-1)?.map(update => update.at(-1)), ["b", "c", "d"]);
    assert.equal(commandSent, false);

    hub.answer();
    await command;

    assert.deepEqual(hub.sets.at(-1)?.map(update => update.at(-1)), ["e", "2"]);
});

test("a change set the server closed the connection over goes again once, and the second time it is dropped, not sent for ever", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);
    const poison = dispatcher.dispatchAsync(value("poison"));

    hub.dropByServer();
    hub.attach();
    await settle();

    assert.deepEqual(hub.sets, [["poison"], ["poison"]]);

    hub.dropByServer();
    hub.attach();

    await assert.rejects(poison, /Server returned an error on close/);
    await settle();

    assert.deepEqual(hub.sets, [["poison"], ["poison"]]);

    // The queue goes on behind it.
    const next = dispatcher.dispatchAsync(value("next", 2));

    hub.answer();
    await next;

    assert.deepEqual(hub.sets.at(-1), ["next"]);
});

test("a value the server closed the connection under once goes again and lands", async () => {
    const hub = createHeldHub();
    const dispatcher = new ValueChangeDispatcher(hub);
    const first = dispatcher.dispatchAsync(value("a"));

    hub.dropByServer();
    hub.attach();
    await settle();

    hub.answer();
    await first;

    assert.deepEqual(hub.sets, [["a"], ["a"]]);
});

test("a value waiting behind an attach that failed goes once the retry attaches, and once only", async () => {
    const gate = new AttachGate();
    const sets: string[][] = [];
    // The transport as it waits behind the gate; the attach and its retry are the test's.
    const dispatcher = new ValueChangeDispatcher({
        processChangeSetAsync: async request => {
            await gate.wait();
            sets.push(request.updates.map(describe));
        },
        whenAttached: () => gate.wait()
    });
    const sent = dispatcher.dispatchAsync(value("typed during the reconnect"));

    gate.rearm();
    await settle();

    assert.deepEqual(sets, []);

    gate.markAttached();
    await sent;
    await settle();

    assert.deepEqual(sets, [["typed during the reconnect"]]);
});
