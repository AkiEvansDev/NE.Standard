// A dropped connection is tried again at once, then after waits drawn at random below a ceiling that doubles up to half a minute,
// until the server's retention is spent; the network coming back or the page coming on screen starts the next try at once, and a
// loop stopped tries no more.

import assert from "node:assert/strict";
import test from "node:test";

import { DefaultReconnectWindowMilliseconds, nextReconnectDelay, ReconnectLoop } from "../src/transport/reconnect-loop.ts";

test("the first try is at once, and each wait after it stays below a ceiling that doubles up to half a minute", () => {
    const highest = { random: () => 0.999999 };

    assert.equal(nextReconnectDelay(0, 0, highest), 0);
    assert.equal(nextReconnectDelay(1, 0, highest), 999);
    assert.equal(nextReconnectDelay(2, 0, highest), 1999);
    assert.equal(nextReconnectDelay(3, 0, highest), 3999);
    assert.equal(nextReconnectDelay(12, 0, highest), 29_999);
});

test("each wait is drawn at random below its ceiling, so pages dropped together do not come back together", () => {
    assert.equal(nextReconnectDelay(4, 0, { random: () => 0 }), 0);
    assert.equal(nextReconnectDelay(4, 0, { random: () => 0.5 }), 4000);
});

test("no try starts once the server would have let the runtime go", () => {
    assert.equal(nextReconnectDelay(5, DefaultReconnectWindowMilliseconds - 1, { random: () => 0 }), 0);
    assert.equal(nextReconnectDelay(5, DefaultReconnectWindowMilliseconds), null);
    assert.equal(nextReconnectDelay(1, 60_000, { windowMilliseconds: 60_000 }), null);
});

/** A loop over a clock the test moves: each timer is kept until the test fires it. */
function createLoop(failures: number, windowMilliseconds = 60_000): { readonly loop: ReconnectLoop; readonly timers: { readonly ms: number; fire(): void }[]; tries: number; time: number } {
    const state = {
        timers: [] as { readonly ms: number; fire(): void }[],
        tries: 0,
        time: 0,
        loop: null as unknown as ReconnectLoop
    };

    state.loop = new ReconnectLoop({
        windowMilliseconds,
        random: () => 0.5,
        now: () => state.time,
        start: async () => {
            state.tries++;

            if (state.tries <= failures)
                throw new Error("offline");
        },
        setTimer: (callback, ms) => {
            const timer = { ms, fire: callback };

            state.timers.push(timer);

            return timer;
        },
        clearTimer: handle => {
            state.timers = state.timers.filter(timer => timer !== handle);
        }
    });

    return state;
}

async function turn(): Promise<void> {
    await new Promise(resolve => setImmediate(resolve));
}

test("a loop tries until one try opens the connection", async () => {
    const state = createLoop(2);
    const run = state.loop.runAsync();

    await turn();
    assert.equal(state.tries, 1);
    assert.deepEqual(state.timers.map(timer => timer.ms), [500]);

    state.timers[0].fire();
    await turn();
    assert.equal(state.tries, 2);
    assert.deepEqual(state.timers.map(timer => timer.ms), [1000]);

    state.timers[0].fire();

    assert.equal(await run, true);
    assert.equal(state.tries, 3);
});

test("waking the loop starts the next try at once, without its wait", async () => {
    const state = createLoop(1);
    const run = state.loop.runAsync();

    await turn();
    assert.equal(state.timers.length, 1);

    state.loop.wake();

    assert.equal(await run, true);
    assert.equal(state.tries, 2);
    assert.equal(state.timers.length, 0);
});

test("a loop gives up once its window is spent", async () => {
    const state = createLoop(Number.POSITIVE_INFINITY, 1000);
    const run = state.loop.runAsync();

    await turn();
    state.time = 1000;
    state.timers[0].fire();

    assert.equal(await run, false);
    assert.equal(state.tries, 2);
});

test("a stopped loop tries no more", async () => {
    const state = createLoop(Number.POSITIVE_INFINITY);
    const run = state.loop.runAsync();

    await turn();
    state.loop.stop();

    assert.equal(await run, false);
    assert.equal(state.tries, 1);
});

test("a reconnect after one whose connection closed again before the page attached goes on with its backoff and its window", async () => {
    const timers: number[] = [];
    let time = 0;
    let tries = 0;
    const first = new ReconnectLoop({ random: () => 0.5, now: () => time, start: async () => { tries++; }, setTimer: (_callback, ms) => timers.push(ms) });

    assert.equal(await first.runAsync(), true);
    assert.equal(first.nextAttempt, 1);

    // The server took the connection and dropped it at once: the next try waits, rather than following back to back.
    const fireAtOnce = (callback: () => void, ms: number): number => {
        timers.push(ms);
        callback();
        return 0;
    };
    const second = new ReconnectLoop({ random: () => 0.5, now: () => time, startedAt: 0, firstAttempt: first.nextAttempt, start: async () => { tries++; }, setTimer: fireAtOnce });

    assert.equal(await second.runAsync(), true);
    assert.deepEqual(timers, [500]);
    assert.equal(second.nextAttempt, 2);

    // Its window counts from the first drop, so a connection dropped again and again still gives up.
    time = 60_000;

    const third = new ReconnectLoop({ windowMilliseconds: 60_000, now: () => time, startedAt: 0, firstAttempt: second.nextAttempt, start: async () => { tries++; } });

    assert.equal(await third.runAsync(), false);
    assert.equal(tries, 2);
});
