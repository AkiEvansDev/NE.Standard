// The framework's service worker as the page finds it: registered by the page at `/_ne/`, where the application turned system
// notifications on (`AddSystemNotifications`), or imported into the application's own worker, which the page then waits for.

import { ServiceWorkerAttribute, ServiceWorkerImportedAttribute } from "../addressing/dom-attributes.ts";
import { logWarn } from "./logger.ts";
import { answerWorker } from "./worker-messages.ts";

/** The scope the framework's own worker takes: the framework's addresses, so it controls no page of the application. */
const FrameworkScope = "/_ne/";

// How long the page waits for the application's own worker to be ready; a notification shown meanwhile is the page's own.
const ReadyMilliseconds = 3000;

type WorkerRegistration = Pick<ServiceWorkerRegistration, "showNotification">;

/**
 * Starts what the shell asked for on `root` — registers the framework's worker, or waits for the application's — and answers how a
 * notification reaches it; none where the shell asked for nothing, or the browser has no workers.
 */
export function startServiceWorker(root: Element, windowId: string, runAction: (id: string) => void): (() => Promise<WorkerRegistration | undefined>) | undefined {
    const path = root.getAttribute(ServiceWorkerAttribute);

    if (path === null || !("serviceWorker" in navigator))
        return undefined;

    const container = navigator.serviceWorker;

    answerWorker(container, windowId, runAction);

    // Asked again each time: the application's worker may be ready by the next notification.
    if (root.hasAttribute(ServiceWorkerImportedAttribute))
        return () => withinReady(container.ready);

    const registered = container.register(path, { scope: FrameworkScope }).then(activated).catch((error: unknown) => {
        logWarn("registering the notification service worker failed; notifications are the page's own.", error);
        return undefined;
    });

    return () => registered;
}

/**
 * The registration once its worker is active: a registration whose worker still installs shows nothing, and the page's first visit
 * waits for it rather than falling back.
 */
function activated(registration: ServiceWorkerRegistration): Promise<ServiceWorkerRegistration> {
    const worker = registration.installing ?? registration.waiting;

    if (registration.active !== null || worker === null)
        return Promise.resolve(registration);

    return new Promise(resolve => {
        worker.addEventListener("statechange", () => {
            if (worker.state === "activated")
                resolve(registration);
        });
    });
}

/** The application's own worker once it is ready, or none where it is not ready in time. */
function withinReady(ready: Promise<ServiceWorkerRegistration>): Promise<WorkerRegistration | undefined> {
    return Promise.race([
        ready,
        new Promise<undefined>(resolve => setTimeout(() => resolve(undefined), ReadyMilliseconds))
    ]);
}
