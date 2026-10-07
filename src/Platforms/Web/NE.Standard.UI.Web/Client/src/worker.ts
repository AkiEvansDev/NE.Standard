// The framework's service worker (`AddSystemNotifications`): it shows a page's system notification — a phone's browser shows none a
// page raised itself — and takes its click, bringing the page that showed it forward and running its command there, or opening its
// address where that page is gone. Registered at `/_ne/`, where it controls no page of the application; an application with a
// worker of its own imports this one into it instead. Types declared here: the worker's own library cannot share the page's.

import { NotificationClickMessage, WindowQueryMessage } from "./runtime/worker-messages.ts";
import type { NotificationClickData } from "./runtime/worker-messages.ts";

type WindowClientLike = {
    readonly url: string;
    focus(): Promise<unknown>;
    postMessage(message: unknown, transfer?: Transferable[]): void;
};

type WorkerScope = {
    readonly clients: {
        matchAll(options: { type: "window"; includeUncontrolled: boolean }): Promise<readonly WindowClientLike[]>;
        openWindow(url: string): Promise<unknown>;
    };
    addEventListener(type: "notificationclick", listener: (event: NotificationClickEvent) => void): void;
    addEventListener(type: "install", listener: () => void): void;
    skipWaiting(): Promise<void>;
};

type NotificationClickEvent = {
    readonly notification: { readonly data: unknown; close(): void };
    waitUntil(work: Promise<unknown>): void;
};

declare const self: WorkerScope;

// How long a page has to say which tab it is; one that does not answer is passed over.
const AnswerMilliseconds = 1000;

// A new version takes over at once: it holds no state, and a click waits for no page.
self.addEventListener("install", () => void self.skipWaiting());

self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(openPage(event.notification.data as NotificationClickData | null));
});

/** Brings the page the notification came from forward and runs its command there; with that page gone, opens its address. */
async function openPage(data: NotificationClickData | null): Promise<void> {
    if (data === null || typeof data.windowId !== "string")
        return;

    const pages = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const page = await findPage(pages, data.windowId);

    if (page === null) {
        // Only a path of this site: the page checked it as it showed the notification, and a worker opens nothing else.
        if (typeof data.address === "string" && data.address.startsWith("/") && !data.address.startsWith("//"))
            await self.clients.openWindow(data.address);

        return;
    }

    await page.focus();

    // A client's message has no target origin to name: the worker reaches only pages of its own.
    if (typeof data.action === "string")
        page.postMessage({ kind: NotificationClickMessage, action: data.action }, []);
}

/** The page whose tab is `windowId`, asked of each page at once; none where no page answers in time. */
function findPage(pages: readonly WindowClientLike[], windowId: string): Promise<WindowClientLike | null> {
    return new Promise(resolve => {
        let waiting = pages.length;
        const timer = setTimeout(() => resolve(null), AnswerMilliseconds);
        const settle = (page: WindowClientLike | null): void => {
            if (page !== null || --waiting <= 0) {
                clearTimeout(timer);
                resolve(page);
            }
        };

        if (waiting === 0) {
            settle(null);
            return;
        }

        for (const page of pages) {
            const channel = new MessageChannel();

            channel.port1.addEventListener("message", answer => settle(answer.data === windowId ? page : null));
            // A port listened to by addEventListener delivers nothing until started.
            channel.port1.start();
            page.postMessage({ kind: WindowQueryMessage }, [channel.port2]);
        }
    });
}
