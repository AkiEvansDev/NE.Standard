// What the framework's service worker (worker.ts) and a page say to each other about a system notification's click.

/** The worker asks a page which tab it is; the page answers its window id on the port it was handed. */
export const WindowQueryMessage = "ne:which-window";

/** The worker brought the page forward; the page follows the click (`NotificationClick`). */
export const NotificationClickMessage = "ne:notification-click";

/** What a click asks of the page it brought forward: the address the notification named, and the command it offered. */
export type NotificationClick = {
    readonly bringTo?: string;
    readonly action?: string;
};

/**
 * What a system notification carries for its click: the tab that showed it, where to go without it, the address it named itself —
 * where a click brings that tab — and the offered command.
 */
export type NotificationClickData = NotificationClick & {
    readonly address?: string;
    readonly windowId?: string;
};

/** The page's own side: answers the worker's question and follows a click once its page is in front. */
export function answerWorker(container: Pick<ServiceWorkerContainer, "addEventListener" | "startMessages">, windowId: string, click: (click: NotificationClick) => void): void {
    container.addEventListener("message", domEvent => {
        const message = domEvent.data as { readonly kind?: unknown; readonly action?: unknown; readonly bringTo?: unknown } | null;

        if (message?.kind === WindowQueryMessage)
            domEvent.ports[0]?.postMessage(windowId);
        else if (message?.kind === NotificationClickMessage)
            click({
                bringTo: typeof message.bringTo === "string" ? message.bringTo : undefined,
                action: typeof message.action === "string" ? message.action : undefined
            });
    });

    // A worker's messages wait until the page says it listens; a listener added this way does not say it.
    container.startMessages();
}
