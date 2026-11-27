import assert from "node:assert/strict";
import test from "node:test";

import { WakeProbe, WakeProbeMinHiddenMilliseconds, WakeProbeTimeoutMilliseconds } from "../src/transport/wake-probe.ts";

type FakeTimer = { readonly ms: number; fire(): void };

function createHarness(options: { connected?: boolean } = {}) {
    let time = 0;
    let connected = options.connected ?? true;
    let pings = 0;
    let stalled = 0;
    let timers: FakeTimer[] = [];
    const pendingPings: { resolve(): void; reject(error: Error): void }[] = [];

    const probe = new WakeProbe({
        isConnected: () => connected,
        ping: () => {
            pings++;

            return new Promise<void>((resolve, reject) => {
                pendingPings.push({ resolve, reject });
            });
        },
        onStalled: () => {
            stalled++;
        },
        now: () => time,
        setTimer: (callback, ms) => {
            const handle: FakeTimer = { ms, fire: callback };

            timers.push(handle);

            return handle;
        },
        clearTimer: handle => {
            timers = timers.filter(item => item !== handle);
        }
    });

    return {
        probe,
        advance: (ms: number) => { time += ms; },
        setConnected: (value: boolean) => { connected = value; },
        pings: () => pings,
        stalled: () => stalled,
        timers: () => timers,
        resolvePing: () => pendingPings.shift()?.resolve(),
        rejectPing: () => pendingPings.shift()?.reject(new Error("closed"))
    };
}

async function flushMicrotasks(): Promise<void> {
    await new Promise(resolve => setImmediate(resolve));
}

test("a brief hide below the threshold does not send a liveness probe", () => {
    const h = createHarness();

    h.probe.noteHidden();
    h.advance(WakeProbeMinHiddenMilliseconds - 1);
    h.probe.wake(false);

    assert.equal(h.pings(), 0);
    assert.equal(h.stalled(), 0);
    assert.equal(h.timers().length, 0);
});

test("a wake after a longer hide probes once and stays quiet when the socket answers in time", async () => {
    const h = createHarness();

    h.probe.noteHidden();
    h.advance(WakeProbeMinHiddenMilliseconds);
    h.probe.wake(false);

    assert.equal(h.pings(), 1);
    assert.equal(h.timers().length, 1);
    assert.equal(h.timers()[0].ms, WakeProbeTimeoutMilliseconds);

    h.resolvePing();
    await flushMicrotasks();

    assert.equal(h.stalled(), 0);
    assert.equal(h.timers().length, 0);
});

test("a half-open socket whose probe stalls past the timeout triggers recovery", () => {
    const h = createHarness();

    h.probe.noteHidden();
    h.advance(WakeProbeMinHiddenMilliseconds);
    h.probe.wake(false);

    assert.equal(h.pings(), 1);

    h.timers()[0].fire();

    assert.equal(h.stalled(), 1);
});

test("a forced wake probes immediately even without a prior hide and deduplicates overlapping wakes", async () => {
    const h = createHarness();

    h.probe.wake(true);
    h.probe.wake(true);

    assert.equal(h.pings(), 1);

    h.resolvePing();
    await flushMicrotasks();

    h.probe.wake(true);

    assert.equal(h.pings(), 2);
});

test("a probe whose connection closes before timeout or whose probe is disposed never triggers stalled recovery", () => {
    const h = createHarness();

    h.probe.wake(true);
    h.setConnected(false);
    h.timers()[0].fire();

    assert.equal(h.stalled(), 0);

    h.setConnected(true);
    h.probe.wake(true);
    const timer = h.timers()[0];
    h.probe.dispose();
    timer.fire();

    assert.equal(h.stalled(), 0);
});
