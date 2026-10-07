// A notification of the operating system's, shown through the browser: by the service worker the application registered where it
// did, else by the page itself (`new Notification`), which a phone's browser refuses — answered false, and the page shows its fallback.

import { browserNotificationPermission } from "../runtime/client-state.ts";
import type { NotificationClick, NotificationClickData } from "../runtime/worker-messages.ts";

/** What the system shows, its words already in the page's language, and what a click on it does. */
export type SystemNotificationRequest = {
    readonly title: string;
    readonly body?: string;
    // The key a later one with the same replaces this by: every page sent one shows it once.
    readonly tag: string;
    readonly icon?: string;
    readonly silent: boolean;
    readonly requireInteraction: boolean;
    // Where a click goes once the page is gone, and which page it brings forward while it is open.
    readonly address: string;
    readonly windowId: string;
    // The address the notification named itself, where a click brings the page that showed it; none leaves that page where it stands.
    readonly bringTo?: string;
    // The command a click runs once the page is in front, offered for one press.
    readonly action?: string;
};

/** What the browser offers for it; a test stands in for the browser's own. */
export type SystemNotificationServices = {
    readonly permission: () => NotificationPermission | undefined;
    // The application's service worker that shows it, where one is registered: a phone's browser shows none without it.
    readonly registration: () => Promise<Pick<ServiceWorkerRegistration, "showNotification"> | undefined>;
    readonly create: (title: string, options: NotificationOptions) => Pick<Notification, "close" | "addEventListener">;
    readonly focus: () => void;
};

/** The browser's own, showing through `registration` where a service worker is registered, else through the page. */
export function browserNotifications(registration?: SystemNotificationServices["registration"]): SystemNotificationServices {
    return {
        permission: browserNotificationPermission,
        registration: registration ?? (() => Promise.resolve(undefined)),
        create: (title, options) => new Notification(title, options),
        focus: () => window.focus()
    };
}

/**
 * Shows the notification where the browser lets the page, answering whether it showed; `click` runs once the page is in front, when
 * the page itself showed it — the service worker's click reaches the page as a message instead.
 */
export async function showSystemNotification(request: SystemNotificationRequest, click: () => void, services: SystemNotificationServices = browserNotifications()): Promise<boolean> {
    if (services.permission() !== "granted")
        return false;

    const data: NotificationClickData = { address: request.address, windowId: request.windowId, bringTo: request.bringTo, action: request.action };
    // `renotify`, which the DOM's types leave out: one replacing another of its tag is shown and sounded again, not swapped in
    // silently — a second message in a chat is news too.
    const options: NotificationOptions & { readonly renotify?: boolean } = {
        body: request.body,
        tag: request.tag,
        renotify: request.tag.length > 0 && !request.silent,
        icon: request.icon,
        silent: request.silent,
        requireInteraction: request.requireInteraction,
        data
    };

    try {
        const registration = await services.registration();

        if (registration !== undefined) {
            await registration.showNotification(request.title, options);
            return true;
        }

        const notification = services.create(request.title, options);

        notification.addEventListener("click", () => {
            services.focus();
            notification.close();
            click();
        });

        return true;
    }
    catch {
        // A phone's browser throws on `new Notification`, and a worker may refuse: the page shows its fallback instead.
        return false;
    }
}

/**
 * Follows a click once its page is in front: to the address the notification named where the page stands elsewhere — through the
 * page's own leave, so unsaved work is asked about first — else the command it offered, which belongs to the page it was shown on.
 */
export function followClick(click: NotificationClick, navigate: (url: string) => void, runAction: (id: string) => void, here: Pick<Location, "origin" | "pathname" | "search" | "hash"> = window.location): void {
    if (click.bringTo !== undefined && isElsewhere(click.bringTo, here)) {
        navigate(click.bringTo);
        return;
    }

    if (click.action !== undefined)
        runAction(click.action);
}

/** Whether the page stands somewhere other than `address`; a fragment counts only where the address names one. */
function isElsewhere(address: string, here: Pick<Location, "origin" | "pathname" | "search" | "hash">): boolean {
    const target = new URL(address, here.origin);

    return target.pathname !== here.pathname || target.search !== here.search || (target.hash !== "" && target.hash !== here.hash);
}
