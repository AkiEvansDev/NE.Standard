// An attach that throws is tried again after each wait in turn and given up once they run out, but one that fails because the
// connection dropped again is left to the reconnect at once, rather than spending the retries on a connection not there yet.

import assert from "node:assert/strict";
import test from "node:test";

import { attachWithRetryAsync, LeftToReconnect } from "../src/transport/attach-retry.ts";

const Answer = { attached: true };
const Delays = [500, 1000, 2000];

/** An attach failing the given number of times before it answers, and the waits spent between its tries. */
function attempts(failures: number): { readonly attach: () => Promise<typeof Answer>; readonly waited: number[]; tries: number } {
    const record = {
        waited: [] as number[],
        tries: 0,
        attach: async () => {
            record.tries++;

            if (record.tries <= failures)
                throw new Error("the hub call failed");

            return Answer;
        }
    };

    return record;
}

/** Runs `body` with the logger's console quiet: the build reads a logged "Error:" line as a failure of its own. */
async function quietly<T>(body: () => Promise<T>): Promise<T> {
    const { warn, error } = console;

    console.warn = () => {};
    console.error = () => {};

    try {
        return await body();
    }
    finally {
        console.warn = warn;
        console.error = error;
    }
}

test("an attach that throws on a live connection is tried again after each wait, and given up once they run out", async () => {
    const recovering = attempts(2);

    assert.equal(await quietly(() => attachWithRetryAsync(recovering.attach, () => false, Delays, async milliseconds => void recovering.waited.push(milliseconds))), Answer);
    assert.deepEqual(recovering.waited, [500, 1000]);

    const failing = attempts(10);

    assert.equal(await quietly(() => attachWithRetryAsync(failing.attach, () => false, Delays, async milliseconds => void failing.waited.push(milliseconds))), null);
    assert.equal(failing.tries, 4);
});

test("an attach failing as the connection drops again is left to the reconnect, not retried into giving the page up", async () => {
    const dropped = attempts(10);
    let reconnecting = false;

    // The first try fails on the live socket; the connection drops during the wait, and the next try finds it reconnecting.
    const outcome = await quietly(() => attachWithRetryAsync(dropped.attach, () => reconnecting, Delays, async milliseconds => {
        dropped.waited.push(milliseconds);
        reconnecting = true;
    }));

    assert.equal(outcome, LeftToReconnect);
    assert.equal(dropped.tries, 2);
    assert.deepEqual(dropped.waited, [500]);
});
