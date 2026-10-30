// A handler of the connection's reconnecting or closing that throws is logged and passed over: the handlers after it are still told,
// as the reconnected ones are, so a package's mistake leaves the runtime's own notice of a drop or a loss in place.

import assert from "node:assert/strict";
import test from "node:test";
import { installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, removeEventListener: () => undefined, setTimeout, clearTimeout },
    location: { href: "https://app.test/", origin: "https://app.test", protocol: "https:", host: "app.test" }
});

const { SignalRTransport } = await import("../src/transport/signalr-transport.ts");

/** The transport's own state a test sets: whether it was connected, and the connection it starts again. */
type Internals = { connected: boolean; stopping: boolean; connection: unknown; closed(error?: Error): void };

/** Runs `act` with the console's errors kept, and answers them. */
async function errorsOf(act: () => Promise<void>): Promise<unknown[][]> {
    const errors: unknown[][] = [];
    const { error } = console;

    console.error = (...args: unknown[]) => void errors.push(args);

    try {
        await act();
    }
    finally {
        console.error = error;
    }

    return errors;
}

test("a closed connection's handler that throws leaves the next one told", async () => {
    const transport = new SignalRTransport("w1", () => Promise.resolve(), { hubUrl: "https://app.test/_ne/hub" });
    const told: string[] = [];

    transport.onClosed(() => {
        throw new Error("a package's handler");
    });
    transport.onClosed(error => told.push(error?.message ?? ""));

    const errors = await errorsOf(async () => {
        const internals = real<Internals>(transport);

        internals.stopping = true;
        internals.closed(new Error("closed"));
    });

    assert.deepEqual(told, ["closed"]);
    assert.equal(errors.length, 1);
});

test("a reconnecting handler that throws leaves the next one told, and the reconnect runs on", async () => {
    const transport = new SignalRTransport("w1", () => Promise.resolve(), { hubUrl: "https://app.test/_ne/hub" });
    const told: string[] = [];
    let started = 0;

    transport.onReconnecting(() => {
        throw new Error("a package's handler");
    });
    transport.onReconnecting(error => told.push(error?.message ?? ""));
    transport.onReconnected(() => void told.push("back"));

    const errors = await errorsOf(async () => {
        const internals = real<Internals>(transport);

        internals.connected = true;
        internals.connection = { start: () => Promise.resolve(void started++), state: "Connected", connectionId: "c1" };
        internals.closed(new Error("dropped"));
        await new Promise(resolve => setTimeout(resolve, 50));
    });

    assert.deepEqual(told, ["dropped", "back"]);
    assert.equal(started, 1);
    assert.equal(errors.length, 1);
});
