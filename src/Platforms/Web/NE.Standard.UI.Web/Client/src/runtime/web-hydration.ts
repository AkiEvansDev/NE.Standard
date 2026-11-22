// `.ts` on the value import and the metadata's types type-only, so `npm test` can load this module directly.
import { HydrationAttribute } from "../addressing/dom-attributes.ts";
import type { ServerChangeSet } from "../metadata/metadata-index";
import { holdsPageWritten } from "../rendering/words.ts";

// What the shell render put in the page: the values it rendered with, and the id of the runtime it read them from.

const HydrationSelector = `script[type='application/json'][${HydrationAttribute}]`;

export type WebHydrationPayload = {
    // The runtime the render prepared for the attach to claim; null where the render reused an existing one.
    readonly pageId: string | null;
    // Where the prepared runtime's updates stood when the render read it: the attach that claims it is sent only what came after.
    readonly sequence: number | null;
    // The compile the page was rendered from; presented at the attach, so a page of another compile is reloaded rather than fed updates.
    readonly view: string | null;
    // The parameters the route keys its runtimes by: an address of the route differing in one is another runtime, gone to in place.
    readonly identity: readonly string[];
    readonly changes: ServerChangeSet | undefined;
    // The table the page translates by — its language and versioned address — fetched before the first change set is applied.
    readonly words: WebPageWords | null;
    // The view's title as it is translated: a plain key, or a phrase when the title takes arguments; null for a page without one.
    readonly title: unknown;
};

type WebPageWords = {
    readonly language: string;
    readonly href: string;
};

/**
 * Whether the render painted a value the page writes itself — a moment, a file size — in words the page is handed: the title, or a value
 * the change set carries — a row the server drew from a controller's list holds its item there and nowhere else, its words marked by
 * nothing.
 */
export function paintsPageWritten(payload: WebHydrationPayload | null): boolean {
    return payload !== null && (holdsPageWritten(payload.title) || holdsPageWritten(payload.changes));
}

/**
 * Schedules initializing items hosts once hydration's change set and its words table have settled, keeping the inbound queue closed
 * until virtualized rows, group headers and empty states are drawn in the page's language rather than before the words table arrives.
 */
export function scheduleHydratedItemsHosts(
    applied: void | Promise<void>,
    isDisposed: () => boolean,
    initialize: () => void,
    setInbound: (next: Promise<void> | null, expected?: Promise<void>) => void,
    onError?: (error: unknown) => void
): void {
    const run = (): void => {
        if (isDisposed())
            return;

        try {
            initialize();
        }
        catch (error) {
            onError?.(error);
        }
    };

    if (applied === undefined) {
        run();
        return;
    }

    const initialized = applied.then(run);

    setInbound(initialized, applied);
    void initialized.then(() => {
        setInbound(null, initialized);
    });
}

/**
 * Schedules rewriting values the page formats itself (`UIMoment`, `UIFileSize`) once hydration's change set and its words table have
 * settled, keeping the inbound queue closed until it runs; skips the rewrite when the page expected a words table that failed to load,
 * so boot-painted words are never overwritten with raw keys.
 */
export function scheduleHydratedPageWritten(
    payload: WebHydrationPayload | null,
    applied: void | Promise<void>,
    hasTable: () => boolean,
    isDisposed: () => boolean,
    rewrite: () => void,
    setInbound: (next: Promise<void> | null, expected?: Promise<void>) => void,
    onError?: (error: unknown) => void
): void {
    const expectsTable = payload?.words !== null && payload?.words !== undefined;
    const run = (): void => {
        if (isDisposed() || (expectsTable && !hasTable()))
            return;

        try {
            rewrite();
        }
        catch (error) {
            onError?.(error);
        }
    };

    if (applied === undefined) {
        run();
        return;
    }

    const rewritten = applied.then(run);

    setInbound(rewritten, applied);
    void rewritten.then(() => {
        setInbound(null, rewritten);
    });
}

export function readHydration(documentRoot: ParentNode = document): WebHydrationPayload | null {
    const script = documentRoot.querySelector<HTMLScriptElement>(HydrationSelector);
    const text = script?.textContent?.trim() ?? "";

    if (text.length === 0)
        return null;

    try {
        const parsed = JSON.parse(text) as Partial<WebHydrationPayload>;
        const words = parsed.words;

        return {
            pageId: parsed.pageId ?? null,
            sequence: typeof parsed.sequence === "number" ? parsed.sequence : null,
            view: typeof parsed.view === "string" ? parsed.view : null,
            identity: Array.isArray(parsed.identity) ? parsed.identity.filter(name => typeof name === "string") : [],
            changes: parsed.changes,
            words: typeof words?.language === "string" && typeof words.href === "string" ? { language: words.language, href: words.href } : null,
            title: parsed.title ?? null
        };
    }
    catch {
        // Not worth failing a page over: the attach carries the same change set a moment later.
        return null;
    }
}
