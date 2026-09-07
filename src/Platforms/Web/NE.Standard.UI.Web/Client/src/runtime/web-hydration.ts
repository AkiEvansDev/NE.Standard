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
};

export function readHydration(documentRoot: ParentNode = document): WebHydrationPayload | null {
    const script = documentRoot.querySelector<HTMLScriptElement>(HydrationSelector);
    const text = script?.textContent?.trim() ?? "";

    if (text.length === 0)
        return null;

    try {
        const parsed = JSON.parse(text) as Partial<WebHydrationPayload>;

        return {
            pageId: parsed.pageId ?? null,
            view: typeof parsed.view === "string" ? parsed.view : null,
            changes: parsed.changes
        };
    }
    catch {
        // Not worth failing a page over: the attach carries the same change set a moment later.
        return null;
    }
}
