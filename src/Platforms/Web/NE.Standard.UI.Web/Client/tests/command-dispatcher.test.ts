// A command stays pending until it has answered: on its invoke, or — a background command, accepted at once — by the result
// the server pushes later under the request's id. A connection lost meanwhile ends the wait instead of leaving it for ever.

import assert from "node:assert/strict";
import test from "node:test";

import type { UICommandExecutionResult, UICommandRequest } from "../src/metadata/metadata-index.ts";
import { CommandDispatcher } from "../src/transport/command-dispatcher.ts";

type Invoke = { readonly request: UICommandRequest; readonly answer: (result: UICommandExecutionResult) => void };

// The hub as a list of the invokes it holds, each answered when the test says so.
function createHub(): { readonly invokes: Invoke[]; processEventAsync(request: UICommandRequest): Promise<UICommandExecutionResult> } {
    const invokes: Invoke[] = [];

    return {
        invokes,
        processEventAsync(request) {
            return new Promise(resolve => invokes.push({ request, answer: resolve }));
        }
    };
}

const request: UICommandRequest = { eventId: 7, dynamicParameters: [] };
const accepted: UICommandExecutionResult = { command: { success: true }, changes: { updates: [] }, accepted: true };

// Settled within the turn or not at all: a dispatch that should wait is seen still pending after the microtasks run out.
async function settlement(promise: Promise<UICommandExecutionResult>): Promise<string> {
    const settled = promise.then(result => `result:${result.command?.success}`, (error: unknown) => `failed: ${(error as Error).message}`);

    return await Promise.race([settled, new Promise<string>(resolve => setTimeout(() => resolve("pending"), 10))]);
}

test("a command answered on its invoke ends with that answer, and its request carries an id", async () => {
    const hub = createHub();
    const dispatcher = new CommandDispatcher(hub);
    const dispatch = dispatcher.dispatchAsync(request);

    assert.equal(typeof hub.invokes[0].request.requestId, "number");

    hub.invokes[0].answer({ command: { success: false } });

    assert.equal(await settlement(dispatch), "result:false");
    assert.equal(dispatcher.isPending(request), false);
});

test("an accepted command stays pending until the result pushed under its id", async () => {
    const hub = createHub();
    const dispatcher = new CommandDispatcher(hub);
    const dispatch = dispatcher.dispatchAsync(request);

    hub.invokes[0].answer(accepted);

    assert.equal(await settlement(dispatch), "pending");
    assert.equal(dispatcher.isPending(request), true);

    assert.equal(dispatcher.settle({ command: { success: true }, requestId: hub.invokes[0].request.requestId }), true);

    assert.equal(await settlement(dispatch), "result:true");
    assert.equal(dispatcher.isPending(request), false);
});

test("a result pushed ahead of the answer accepting it still ends the command", async () => {
    const hub = createHub();
    const dispatcher = new CommandDispatcher(hub);
    const dispatch = dispatcher.dispatchAsync(request);

    assert.equal(dispatcher.settle({ command: { success: true }, requestId: hub.invokes[0].request.requestId }), true);

    hub.invokes[0].answer(accepted);

    assert.equal(await settlement(dispatch), "result:true");
});

test("a pushed result no command waits for is left to the caller", () => {
    const dispatcher = new CommandDispatcher(createHub());

    assert.equal(dispatcher.settle({ command: { success: true }, requestId: 99 }), false);
    assert.equal(dispatcher.settle({ command: { success: true } }), false);
});

test("a lost connection ends an accepted command still waiting, and frees it to be pressed again", async () => {
    const hub = createHub();
    const dispatcher = new CommandDispatcher(hub);
    const dispatch = dispatcher.dispatchAsync(request);

    hub.invokes[0].answer(accepted);
    dispatcher.release(new Error("connection lost"));

    assert.equal(await settlement(dispatch), "failed: connection lost");
    assert.equal(dispatcher.isPending(request), false);

    // Its result, pushed too late to a connection now gone, is no longer this command's.
    assert.equal(dispatcher.settle({ command: { success: true }, requestId: hub.invokes[0].request.requestId }), false);
});

test("a release does not fail a command answered on its invoke", async () => {
    const hub = createHub();
    const dispatcher = new CommandDispatcher(hub);
    const dispatch = dispatcher.dispatchAsync(request);

    dispatcher.release(new Error("connection lost"));
    hub.invokes[0].answer({ command: { success: true } });

    assert.equal(await settlement(dispatch), "result:true");
});

test("an offered action is sent by its id alone, and the same one is refused while it is pending", async () => {
    const hub = createHub();
    const dispatcher = new CommandDispatcher(hub);
    const action: UICommandRequest = { eventId: 0, action: "a1", dynamicParameters: ["ignored"] };
    const dispatch = dispatcher.dispatchAsync(action);

    assert.deepEqual({ ...hub.invokes[0].request, requestId: undefined }, { eventId: 0, action: "a1", dynamicParameters: [], requestId: undefined });
    assert.equal(dispatcher.isPending(action), true);
    assert.equal(dispatcher.isPending({ eventId: 0, action: "a2", dynamicParameters: [] }), false);
    assert.equal(dispatcher.isPending({ eventId: 0, dynamicParameters: [] }), false);
    await assert.rejects(dispatcher.dispatchAsync(action), /already pending/);

    hub.invokes[0].answer({ command: { success: true } });

    assert.equal(await settlement(dispatch), "result:true");
    assert.equal(dispatcher.isPending(action), false);
});

test("keys too large for the hub are staged beside it, the command carries their token, and a command after it waits behind it", async () => {
    const posts: { readonly resolve: (token: string) => void; readonly body: string }[] = [];
    const realFetch = globalThis.fetch;

    globalThis.fetch = ((_url: string, init: { readonly body: Uint8Array }) => new Promise(resolve => posts.push({
        body: new TextDecoder().decode(init.body),
        resolve: token => resolve(new Response(JSON.stringify({ token })))
    }))) as typeof fetch;

    try {
        const hub = createHub();
        const dispatcher = new CommandDispatcher(hub);
        // A drop of a thousand rows, as one text after the target's keys.
        const drop = JSON.stringify(Array.from({ length: 1000 }, (_, index) => `00000000-0000-0000-0000-${String(index).padStart(12, "0")}`));
        const large: UICommandRequest = { eventId: 7, dynamicParameters: ["target", drop] };
        const first = dispatcher.dispatchAsync(large);
        const second = dispatcher.dispatchAsync({ eventId: 8, dynamicParameters: [] });

        await new Promise(resolve => setImmediate(resolve));

        assert.equal(posts.length, 1);
        assert.deepEqual(JSON.parse(posts[0].body), ["target", drop]);
        assert.equal(hub.invokes.length, 0, "nothing goes onto the hub while the keys are being staged");
        assert.equal(dispatcher.isPending(large), true);

        posts[0].resolve("t1");
        await new Promise(resolve => setImmediate(resolve));

        assert.deepEqual(hub.invokes.map(invoke => ({ ...invoke.request, requestId: undefined })), [
            { eventId: 7, dynamicParameters: [], dynamicParametersToken: "t1", requestId: undefined },
            { eventId: 8, dynamicParameters: [], requestId: undefined }
        ]);

        hub.invokes[0].answer({ command: { success: true } });
        hub.invokes[1].answer({ command: { success: true } });

        assert.equal(await settlement(first), "result:true");
        assert.equal(await settlement(second), "result:true");
    }
    finally {
        globalThis.fetch = realFetch;
    }
});
