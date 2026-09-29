// A type-only import, so `npm test` can load this module directly: node --test resolves value imports literally.
import type { ServerChangeSet } from "../metadata/metadata-index";

// What the shell render put in the page: the values it rendered with, and the id of the runtime it read them from.

const HydrationSelector = "script[type='application/json'][data-ui-hydration]";

export type WebHydrationPayload = {
    // The runtime the render prepared for the attach to claim; null where the render reused an existing one.
    readonly pageId: string | null;
    // The compile the page was rendered from; presented at the attach, so a page of another compile is reloaded rather than fed updates.
    readonly view: string | null;
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
            view: typeof parsed.view === "string" ? parsed.view : null,
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
