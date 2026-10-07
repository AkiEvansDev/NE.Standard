// What the framework's service worker (worker.ts) and a page say to each other about a system notification's click.

/** The worker asks a page which tab it is; the page answers its window id on the port it was handed. */
export const WindowQueryMessage = "ne:which-window";

/** The worker brought the page forward; the page runs the command the notification offered. */
export const NotificationClickMessage = "ne:notification-click";

/** What a system notification carries for its click: the tab that showed it, where to go without it, and the offered command. */
export type NotificationClickData = {
    readonly address?: string;
    readonly windowId?: string;
    readonly action?: string;
};

/** The page's own side: answers the worker's question and runs a click's command once its page is in front. */
export function answerWorker(container: Pick<ServiceWorkerContainer, "addEventListener" | "startMessages">, windowId: string, runAction: (id: string) => void): void {
    container.addEventListener("message", domEvent => {
        const message = domEvent.data as { readonly kind?: unknown; readonly action?: unknown } | null;

        if (message?.kind === WindowQueryMessage)
            domEvent.ports[0]?.postMessage(windowId);
        else if (message?.kind === NotificationClickMessage && typeof message.action === "string")
            runAction(message.action);
    });

    // A worker's messages wait until the page says it listens; a listener added this way does not say it.
    container.startMessages();
}
