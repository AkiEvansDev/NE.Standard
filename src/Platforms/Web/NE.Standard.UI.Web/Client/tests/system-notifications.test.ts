// A system notification shown through the browser where it lets the page, and the fallback where it does not — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import type { SystemNotificationRequest, SystemNotificationServices } from "../src/interactions/system-notifications.ts";
import { followClick, showSystemNotification } from "../src/interactions/system-notifications.ts";

const Request: SystemNotificationRequest = {
    title: "New message",
    body: "From Ann",
    tag: "chat:42",
    silent: false,
    requireInteraction: false,
    address: "/chat?id=42",
    windowId: "tab-1",
    bringTo: "/chat?id=42",
    action: "offer-1"
};

type Shown = { title: string; options: NotificationOptions; click?: () => void; closed: boolean };

function browser(permission: NotificationPermission | undefined, options: { worker?: boolean; throws?: boolean } = {}): { services: SystemNotificationServices; shown: Shown[]; focused: number[] } {
    const shown: Shown[] = [];
    const focused: number[] = [];

    return {
        shown,
        focused,
        services: {
            permission: () => permission,
            registration: () => Promise.resolve(options.worker === true
                ? { showNotification: (title: string, notificationOptions?: NotificationOptions) => { shown.push({ title, options: notificationOptions ?? {}, closed: false }); return Promise.resolve(); } }
                : undefined),
            create: (title, notificationOptions) => {
                if (options.throws === true)
                    throw new TypeError("Illegal constructor. Use ServiceWorkerRegistration.showNotification() instead.");

                const entry: Shown = { title, options: notificationOptions, closed: false };

                shown.push(entry);

                return {
                    close: () => { entry.closed = true; },
                    addEventListener: ((_: string, listener: () => void) => { entry.click = listener; }) as Notification["addEventListener"]
                };
            },
            focus: () => focused.push(1)
        }
    };
}

test("without the reader's leave nothing is shown, and the page shows its fallback", async () => {
    for (const permission of ["default", "denied", undefined] as const) {
        const { services, shown } = browser(permission);

        assert.equal(await showSystemNotification(Request, () => undefined, services), false);
        assert.deepEqual(shown, []);
    }
});

test("shown by the page, a click brings it forward, closes the notification and runs its command", async () => {
    const { services, shown, focused } = browser("granted");
    let clicked = 0;

    assert.equal(await showSystemNotification(Request, () => clicked++, services), true);

    const notification = shown[0];

    assert.equal(notification.title, "New message");
    assert.equal(notification.options.tag, "chat:42");
    // One replacing another of its tag is shown again, not swapped in silently.
    assert.equal((notification.options as { renotify?: boolean }).renotify, true);
    assert.deepEqual(notification.options.data, { address: "/chat?id=42", windowId: "tab-1", bringTo: "/chat?id=42", action: "offer-1" });

    notification.click?.();

    assert.equal(focused.length, 1);
    assert.equal(notification.closed, true);
    assert.equal(clicked, 1);
});

test("a registered service worker shows it, so a phone's browser shows it too", async () => {
    const { services, shown } = browser("granted", { worker: true, throws: true });

    assert.equal(await showSystemNotification(Request, () => undefined, services), true);
    assert.equal(shown.length, 1);
});

test("a browser that refuses the page's own notification answers false, for the fallback", async () => {
    const { services } = browser("granted", { throws: true });

    assert.equal(await showSystemNotification(Request, () => undefined, services), false);
});

function follow(click: { bringTo?: string; action?: string }, here: string): { went: string[]; ran: string[] } {
    const went: string[] = [];
    const ran: string[] = [];
    const url = new URL(here, "https://site.test");

    followClick(click, address => went.push(address), id => ran.push(id), url);

    return { went, ran };
}

test("a click brings a page standing elsewhere to the notification's address, through the page's own leave, and runs no command", () => {
    assert.deepEqual(follow({ bringTo: "/chat?id=42", action: "offer-1" }, "/notes"), { went: ["/chat?id=42"], ran: [] });
    assert.deepEqual(follow({ bringTo: "/chat?id=42" }, "/chat?id=7"), { went: ["/chat?id=42"], ran: [] });
});

test("a click on a page already at the address, or naming none, runs the offered command where it stands", () => {
    assert.deepEqual(follow({ bringTo: "/chat?id=42", action: "offer-1" }, "/chat?id=42#m3"), { went: [], ran: ["offer-1"] });
    assert.deepEqual(follow({ action: "offer-1" }, "/notes"), { went: [], ran: ["offer-1"] });
    assert.deepEqual(follow({}, "/notes"), { went: [], ran: [] });
});

test("a fragment the address names counts: the page goes to it", () => {
    assert.deepEqual(follow({ bringTo: "/chat?id=42#m9" }, "/chat?id=42#m3"), { went: ["/chat?id=42#m9"], ran: [] });
});
