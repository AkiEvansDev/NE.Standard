// What a hub call waits behind: open once attached, pending again through a reconnect, a failed attach and an attach answered with a
// reload, and — once the connection is lost for good — failing every waiting and every later call at once rather than leaving them
// waiting for ever.

import assert from "node:assert/strict";
import test from "node:test";

import { AttachGate } from "../src/transport/attach-gate.ts";

// Settled within the turn or not at all: a gate that should hold is seen still pending after the microtasks run out.
async function settlement(promise: Promise<void>): Promise<string> {
    const settled = promise.then(() => "open", (error: unknown) => `failed: ${(error as Error).message}`);

    return await Promise.race([settled, new Promise<string>(resolve => setTimeout(() => resolve("pending"), 10))]);
}

test("a call waits until the runtime is attached", async () => {
    const gate = new AttachGate();
    const waiting = gate.wait();

    assert.equal(await settlement(waiting), "pending");

    gate.markAttached();

    assert.equal(await settlement(waiting), "open");
});

test("a reconnect holds the calls after it until the next attach", async () => {
    const gate = new AttachGate();

    gate.markAttached();
    gate.rearm();

    const waiting = gate.wait();

    assert.equal(await settlement(waiting), "pending");

    gate.markAttached();

    assert.equal(await settlement(waiting), "open");
});

test("a reconnect during an attach keeps the gate the calls already wait on", async () => {
    const gate = new AttachGate();
    const waiting = gate.wait();

    gate.rearm();
    gate.markAttached();

    assert.equal(await settlement(waiting), "open");
});

test("a failed attach keeps the calls waiting for the retry, and the retry that attaches lets them through", async () => {
    const gate = new AttachGate();
    const waiting = gate.wait();

    gate.rearm();

    assert.equal(await settlement(waiting), "pending");

    const next = gate.wait();

    assert.equal(await settlement(next), "pending");

    gate.markAttached();

    assert.equal(await settlement(waiting), "open");
    assert.equal(await settlement(next), "open");
});

test("a failed re-attach of an attached page holds the calls after it until the retry", async () => {
    const gate = new AttachGate();

    gate.markAttached();
    gate.rearm();

    const waiting = gate.wait();

    assert.equal(await settlement(waiting), "pending");

    gate.markAttached();

    assert.equal(await settlement(waiting), "open");
});

test("an attach answered with a reload, or with a runtime built anew, keeps the gate shut; the page reloads or gives up", async () => {
    for (const answer of [{ reload: true }, { fresh: true }]) {
        const gate = new AttachGate();
        const waiting = gate.wait();

        gate.answered(answer);

        assert.equal(await settlement(waiting), "pending");

        gate.markAttached();
        gate.answered(answer);

        assert.equal(await settlement(gate.wait()), "pending");

        gate.close(new Error("lost"));

        assert.equal(await settlement(gate.wait()), "failed: lost");
    }
});

test("an attach answered for a page that goes on opens the gate", async () => {
    const gate = new AttachGate();
    const waiting = gate.wait();

    gate.answered({ reload: false, fresh: false });

    assert.equal(await settlement(waiting), "open");
});

test("a lost connection fails the calls waiting and every call after, at once", async () => {
    const gate = new AttachGate();
    const waiting = gate.wait();

    gate.close(new Error("lost"));

    assert.equal(await settlement(waiting), "failed: lost");
    assert.equal(await settlement(gate.wait()), "failed: lost");
    assert.equal(gate.failure?.message, "lost");
});

test("nothing opens a lost gate again", async () => {
    const gate = new AttachGate();

    gate.close(new Error("lost"));
    gate.rearm();
    gate.rearm();
    gate.markAttached();
    gate.close(new Error("lost twice"));

    assert.equal(await settlement(gate.wait()), "failed: lost");
});

test("a lost gate nobody waits on reports no unhandled rejection", async () => {
    const unhandled: unknown[] = [];
    const listener = (reason: unknown): void => { unhandled.push(reason); };

    process.on("unhandledRejection", listener);

    try {
        new AttachGate().close(new Error("lost"));
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    finally {
        process.off("unhandledRejection", listener);
    }

    assert.deepEqual(unhandled, []);
});
