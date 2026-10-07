// A system notification shown through the browser where it lets the page, and the fallback where it does not — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import type { SystemNotificationRequest, SystemNotificationServices } from "../src/interactions/system-notifications.ts";
import { showSystemNotification, whenOnScreen } from "../src/interactions/system-notifications.ts";

const Request: SystemNotificationRequest = {
    title: "New message",
    body: "From Ann",
    tag: "chat:42",
    silent: false,
    requireInteraction: false,
    address: "/chat?id=42",
    windowId: "tab-1",
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
    assert.deepEqual(notification.options.data, { address: "/chat?id=42", windowId: "tab-1", action: "offer-1" });

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

test("a fallback raised off screen waits until the page is on screen", () => {
    const listeners = new Map<string, () => void>();
    const doc = {
        visibilityState: "hidden" as DocumentVisibilityState,
        addEventListener: (name: string, listener: () => void) => listeners.set(name, listener),
        removeEventListener: (name: string) => listeners.delete(name)
    };
    let shown = 0;

    whenOnScreen(() => shown++, doc as unknown as Document);

    assert.equal(shown, 0);

    doc.visibilityState = "visible";
    listeners.get("visibilitychange")?.();

    assert.equal(shown, 1);
    assert.equal(listeners.size, 0);
});
