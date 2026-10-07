// A value too large for the hub goes beside it both ways (docs/VALUES.md §2): posted as JSON and named by the returned token, or
// arriving as a token and fetched before it is applied.

import type { ServerChangeSet, ServerValueUIUpdate } from "../metadata/metadata-index";

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

/** Whether a change set names a value the server staged, which has to be fetched before the change set can be applied. */
export function hasStagedValues(changes: ServerChangeSet | undefined): boolean {
    return changes?.updates?.some(update => typeof (update as ServerValueUIUpdate).valueToken === "string") === true;
}

/**
 * The change set with every staged value fetched into its update; the same change set when it names none. `instanceId` is the
 * connection the set arrived on: the server lets a value go once each connection it was sent to has read it, so a second read by one
 * tab never spends another's.
 */
export async function fetchStagedValuesAsync(changes: ServerChangeSet | undefined, instanceId: string | null = null, timeoutMilliseconds = StagedValueTimeoutMilliseconds): Promise<ServerChangeSet | undefined> {
    if (changes === undefined || !hasStagedValues(changes))
        return changes;

    // Only a value update carries a token, so the token alone says which updates to fetch.
    const updates = await Promise.all((changes.updates ?? []).map(async update => {
        const token = (update as ServerValueUIUpdate).valueToken;

        if (typeof token !== "string")
            return update;

        const reader = instanceId === null ? "" : `?instance=${encodeURIComponent(instanceId)}`;
        const response = await fetch(`${StagePath}/${encodeURIComponent(token)}${reader}`, { credentials: "same-origin", signal: AbortSignal.timeout(timeoutMilliseconds) });

        if (!response.ok)
            throw new Error(`Fetching a staged value failed with status ${response.status}.`);

        const { valueToken: _, ...rest } = update as ServerValueUIUpdate;

        return { ...rest, value: await response.json() as unknown };
    }));

    return { ...changes, updates };
}

/** Stages the JSON and answers the token a hub update carries in place of the value. */
export async function stageValueAsync(body: Uint8Array): Promise<string> {
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
