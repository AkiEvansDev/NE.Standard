// A value too large for the hub goes beside it both ways (docs/VALUES.md §2): posted as JSON and named by the returned token, or
// arriving as a token and fetched before it is applied.

import type { ServerChangeSet, ServerCollectionChangeUIUpdate, ServerCollectionItemChange, ServerValueUIUpdate } from "../metadata/metadata-index";
import { pageSessionKey } from "../state/session-key.ts";

const StagePath = "/_ne/values";

/** The hub's message cap (docs/VALUES.md §1): a message past it closes the connection. */
export const HubMessageBytes = 32 * 1024;

/** Bytes of JSON past which a value is staged: a quarter of the hub's cap (room for the envelope), inside a TCP initial window. */
export const LargeValueBytes = HubMessageBytes / 4;

/** How long a staged value's trip may take; everything after it waits for it, so a hang would stall the page silently. */
const StagedValueTimeoutMilliseconds = 30_000;

/** The value's JSON as bytes when it is too large to travel inline, or null when it goes inline. */
export function largeValueBody(value: unknown): Uint8Array | null {
    const json = JSON.stringify(value);

    // At most three UTF-8 bytes a character (a surrogate pair is four for two), so a short text is answered without encoding it.
    if (json === undefined || json.length * 3 <= LargeValueBytes)
        return null;

    const bytes = new TextEncoder().encode(json);

    return bytes.byteLength > LargeValueBytes ? bytes : null;
}

/** Whether a change set names a value or collection slice the server staged, which has to be fetched before the change set can be applied. */
export function hasStagedValues(changes: ServerChangeSet | undefined): boolean {
    return changes?.updates?.some(update =>
        typeof (update as ServerValueUIUpdate).valueToken === "string"
        || typeof (update as ServerCollectionChangeUIUpdate).itemsToken === "string"
    ) === true;
}

/**
 * The change set with every staged value or collection slice fetched into its update; the same change set when it names none.
 * `instanceId` is the connection the set arrived on: the server lets a staged payload go once each connection it was sent to has
 * read it, so a second read by one tab never spends another's.
 */
export async function fetchStagedValuesAsync(changes: ServerChangeSet | undefined, instanceId: string | null = null, timeoutMilliseconds = StagedValueTimeoutMilliseconds): Promise<ServerChangeSet | undefined> {
    if (changes === undefined || !hasStagedValues(changes))
        return changes;

    // Staged under the session as the server holds it: once a sign-in moved it, the new id, which only the traded cookie names.
    await pageSessionKey.settled();

    const reader = instanceId === null ? "" : `?instance=${encodeURIComponent(instanceId)}`;

    const updates = await Promise.all((changes.updates ?? []).map(async update => {
        const valueToken = (update as ServerValueUIUpdate).valueToken;

        if (typeof valueToken === "string") {
            const response = await fetch(`${StagePath}/${encodeURIComponent(valueToken)}${reader}`, { credentials: "same-origin", signal: AbortSignal.timeout(timeoutMilliseconds) });

            if (!response.ok)
                throw new Error(`Fetching a staged value failed with status ${response.status}.`);

            const { valueToken: _, ...rest } = update as ServerValueUIUpdate;

            return { ...rest, value: await response.json() as unknown };
        }

        const itemsToken = (update as ServerCollectionChangeUIUpdate).itemsToken;

        if (typeof itemsToken === "string") {
            const response = await fetch(`${StagePath}/${encodeURIComponent(itemsToken)}${reader}`, { credentials: "same-origin", signal: AbortSignal.timeout(timeoutMilliseconds) });

            if (!response.ok)
                throw new Error(`Fetching staged collection items failed with status ${response.status}.`);

            const { itemsToken: _, ...rest } = update as ServerCollectionChangeUIUpdate;

            return { ...rest, items: await response.json() as readonly ServerCollectionItemChange[] };
        }

        return update;
    }));

    return { ...changes, updates };
}

/** Stages the JSON and answers the token a hub update carries in place of the value. */
export async function stageValueAsync(body: Uint8Array): Promise<string> {
    // Taken by the hub under the session its page holds: once a sign-in moved it, the new id, which only the traded cookie names.
    await pageSessionKey.settled();

    const response = await fetch(StagePath, {
        method: "POST",
        body: body as BufferSource,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        signal: AbortSignal.timeout(StagedValueTimeoutMilliseconds)
    });

    if (!response.ok)
        throw new Error(`Staging a large value failed with status ${response.status}.`);

    const token = (await response.json() as { token?: string } | null)?.token;

    if (token === undefined || token.length === 0)
        throw new Error("Staging a large value answered with no token.");

    return token;
}
