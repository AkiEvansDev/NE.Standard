// The page's one relative clock: a relative timestamp and a relative moment in words tick by the same interval, started by the first
// that needs it and stopped once none does.

import assert from "node:assert/strict";
import test from "node:test";

import { needRelativeTicks, RelativeRefreshMilliseconds } from "../src/runtime/relative-clock.ts";

test("every relative text ticks by one interval, which stops once none needs it and starts again for the next", t => {
    t.mock.timers.enable({ apis: ["setInterval"] });

    const schedule = globalThis.setInterval;
    let intervals = 0;

    globalThis.setInterval = ((...args: Parameters<typeof setInterval>) => {
        intervals++;
        return schedule(...args);
    }) as typeof setInterval;
    t.after(() => {
        globalThis.setInterval = schedule;
    });

    let stamps = 0;
    let words = 0;

    needRelativeTicks(() => ++stamps < 3);
    needRelativeTicks(() => ++words < 2);
    assert.equal(intervals, 1, "the second text joins the clock the first started");

    t.mock.timers.tick(RelativeRefreshMilliseconds);
    assert.deepEqual([stamps, words], [1, 1]);

    t.mock.timers.tick(RelativeRefreshMilliseconds);
    assert.deepEqual([stamps, words], [2, 2], "the words answered no, and are ticked no more");

    t.mock.timers.tick(RelativeRefreshMilliseconds);
    t.mock.timers.tick(RelativeRefreshMilliseconds);
    assert.deepEqual([stamps, words], [3, 2], "the timestamps answered no too, and the clock stood");

    needRelativeTicks(() => ++words < 0);
    assert.equal(intervals, 2, "a text needing it again starts it again");

    t.mock.timers.tick(RelativeRefreshMilliseconds);
    assert.equal(words, 3);
});

test("a tick asking again for the ticks it is in is ticked once, and one that throws is dropped", t => {
    t.mock.timers.enable({ apis: ["setInterval"] });

    // The dropped tick's warning would read as a failure in the build's log.
    const warned = t.mock.method(console, "warn", () => {});

    let calls = 0;
    const tick = (): boolean => {
        calls++;
        needRelativeTicks(tick);
        return calls < 2;
    };

    needRelativeTicks(tick);
    needRelativeTicks(() => {
        throw new Error("broken");
    });

    t.mock.timers.tick(RelativeRefreshMilliseconds);
    assert.equal(calls, 1);

    t.mock.timers.tick(RelativeRefreshMilliseconds);
    t.mock.timers.tick(RelativeRefreshMilliseconds);
    assert.equal(calls, 2);
    assert.equal(warned.mock.callCount(), 1);
});
