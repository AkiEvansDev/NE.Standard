// What the page reports of itself: read from the browser, carried by the attach, and sent again once a change settles.

import assert from "node:assert/strict";
import test from "node:test";

import type { ClientState, ClientStateSource } from "../src/runtime/client-state.ts";
import { ClientStateReporter, readClientState } from "../src/runtime/client-state.ts";

type Browser = { visibility: DocumentVisibilityState; permission: NotificationPermission | undefined };

function sourceOf(browser: Browser): ClientStateSource {
    return { visibilityState: () => browser.visibility, notificationPermission: () => browser.permission };
}

function settled(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 5));
}

test("a browser without notifications reports them unsupported, and a hidden page as off screen", () => {
    assert.deepEqual(readClientState(sourceOf({ visibility: "hidden", permission: undefined })), { visible: false, notificationPermission: "unsupported" });
    assert.deepEqual(readClientState(sourceOf({ visibility: "visible", permission: "granted" })), { visible: true, notificationPermission: "granted" });
});

test("before the first attach nothing is sent: the attach carries the state", async () => {
    const browser: Browser = { visibility: "visible", permission: "default" };
    const sent: ClientState[] = [];
    const reporter = new ClientStateReporter({ report: state => { sent.push(state); return Promise.resolve(); }, source: sourceOf(browser), settleMilliseconds: 0 });

    browser.visibility = "hidden";
    reporter.changed();
    await settled();

    assert.deepEqual(sent, []);
    assert.deepEqual(reporter.forAttach(), { visible: false, notificationPermission: "default" });
});

test("a burst of changes is sent once, as it settled, and a state the server already holds is not sent", async () => {
    const browser: Browser = { visibility: "visible", permission: "default" };
    const sent: ClientState[] = [];
    const reporter = new ClientStateReporter({ report: state => { sent.push(state); return Promise.resolve(); }, source: sourceOf(browser), settleMilliseconds: 0 });

    reporter.forAttach();

    // Switched away and straight back: the server's state stands.
    browser.visibility = "hidden";
    reporter.changed();
    browser.visibility = "visible";
    reporter.changed();
    await settled();

    assert.deepEqual(sent, []);

    browser.permission = "granted";
    reporter.changed();
    await settled();
    reporter.changed();
    await settled();

    assert.deepEqual(sent, [{ visible: true, notificationPermission: "granted" }]);
});

test("a report lost with its connection fails nothing: the next attach carries the state", async () => {
    const browser: Browser = { visibility: "visible", permission: "default" };
    const reporter = new ClientStateReporter({ report: () => Promise.reject(new Error("connection lost")), source: sourceOf(browser), settleMilliseconds: 0 });

    reporter.forAttach();
    browser.visibility = "hidden";
    reporter.changed();
    await settled();

    assert.deepEqual(reporter.forAttach(), { visible: false, notificationPermission: "default" });
});
