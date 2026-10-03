// A dropped connection SignalR is bringing back is said on the page only once it outlasts a grace, so a blip stays invisible: the
// document element carries `data-ui-connection="reconnecting"` and a quiet notice says so, both gone by themselves once the connection
// is back; a connection given up says `lost`, and its notice gives way to the page's own, which offers the reload.

import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// Before the page's window takes the timers, so it takes the mocked ones.
mock.timers.enable({ apis: ["setTimeout"] });

installFakeDom({ window: { addEventListener: () => undefined, setTimeout, clearTimeout } });

const { ConnectionWatch } = await import("../src/runtime/connection-watch.ts");
const { NotificationEngine } = await import("../src/interactions/notification-engine.ts");
const { clientStrings } = await import("../src/runtime/client-strings.ts");

clientStrings.register({ "ui.connection.reconnecting": "Reconnecting…" });

/** The transport as the watch hears it: the reconnect's two events, raised by the test. */
class FakeConnection {
    private readonly reconnectingHandlers: (() => void)[] = [];
    private readonly reconnectedHandlers: (() => void | Promise<void>)[] = [];

    public onReconnecting(handler: () => void): void {
        this.reconnectingHandlers.push(handler);
    }

    public onReconnected(handler: () => void | Promise<void>): void {
        this.reconnectedHandlers.push(handler);
    }

    public drop(): void {
        for (const handler of this.reconnectingHandlers)
            handler();
    }

    public back(): void {
        for (const handler of this.reconnectedHandlers)
            void handler();
    }
}

function page(): { readonly html: FakeElement; readonly connection: FakeConnection; readonly watch: InstanceType<typeof ConnectionWatch> } {
    const html = new FakeElement("html");
    const connection = new FakeConnection();

    fakeDocument.body.children.length = 0;

    const notifications = new NotificationEngine({ root: real<ParentNode>(fakeDocument.body) });
    const watch = new ConnectionWatch({ root: real<Element>(html), connection, notifications });

    return { html, connection, watch };
}

function notices(): FakeElement[] {
    return fakeDocument.body.querySelectorAll(".ui-notification");
}

test("a connection back within the grace leaves the page as it was", () => {
    const { html, connection } = page();

    connection.drop();
    mock.timers.tick(1900);
    connection.back();
    mock.timers.tick(5000);

    assert.equal(html.getAttribute("data-ui-connection"), null);
    assert.equal(notices().length, 0);
});

test("a reconnect past the grace marks the page and shows the notice until the connection is back", () => {
    const { html, connection } = page();

    connection.drop();
    mock.timers.tick(1999);

    assert.equal(html.getAttribute("data-ui-connection"), null);

    mock.timers.tick(1);

    assert.equal(html.getAttribute("data-ui-connection"), "reconnecting");
    assert.equal(notices().length, 1);
    assert.equal(notices()[0].textContent, "Reconnecting…");

    // A toast's own timer would end it while SignalR still tries: it says a state, not an event.
    mock.timers.tick(30000);

    assert.equal(notices().length, 1);

    connection.back();

    assert.equal(html.getAttribute("data-ui-connection"), null);
    assert.equal(notices().filter(notice => !notice.classList.contains("ui-notification--leaving")).length, 0);
});

test("a connection given up while reconnecting says lost, and the reconnecting notice goes", () => {
    const { html, connection, watch } = page();

    connection.drop();
    mock.timers.tick(2000);
    watch.lost();

    assert.equal(html.getAttribute("data-ui-connection"), "lost");
    assert.equal(notices().filter(notice => !notice.classList.contains("ui-notification--leaving")).length, 0);

    // Nothing brings a connection given up back.
    connection.back();

    assert.equal(html.getAttribute("data-ui-connection"), "lost");
});

test("a connection given up within the grace never shows the reconnecting notice", () => {
    const { html, connection, watch } = page();

    connection.drop();
    mock.timers.tick(500);
    watch.lost();
    mock.timers.tick(5000);

    assert.equal(html.getAttribute("data-ui-connection"), "lost");
    assert.equal(notices().length, 0);
});

test("a second drop after the connection came back is said again", () => {
    const { html, connection } = page();

    connection.drop();
    mock.timers.tick(2000);
    connection.back();
    connection.drop();
    mock.timers.tick(2000);

    assert.equal(html.getAttribute("data-ui-connection"), "reconnecting");
    assert.equal(notices().filter(notice => !notice.classList.contains("ui-notification--leaving")).length, 1);
});
