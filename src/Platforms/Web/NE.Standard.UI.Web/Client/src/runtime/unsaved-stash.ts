// What the reader typed and the server never took survives a reload the page has to make — its runtime gone, a session the server no
// longer holds, the connection lost: kept in the tab's own storage under the tab, the address and the compile of the view, and put
// back into the same fields once the reloaded page is attached, as the reader's edits. A reload onto another compile of the view
// finds nothing: its ids may name other fields. Storage a browser refuses (a private window, a full quota) keeps nothing, and the
// reload goes on as before.

// `.ts` on the value import: `node --test` loads this module as it is.
import { logWarn } from "./logger.ts";
import type { UnsavedValue } from "../updates/value-binding-engine.ts";

const KeyPrefix = "ne.unsaved:";

/** How long a carried-over value waits for its page: a reload is seconds, and a tab come back to an hour later is another visit. */
const StashLifetimeMilliseconds = 30 * 60_000;

/** Which page a stash is for: the tab, the address and the compile of its view. */
export type StashedPage = {
    readonly windowId: string;
    readonly address: string;
    readonly view: string | null;
};

type Stash = {
    readonly saved: number;
    readonly values: readonly UnsavedValue[];
};

export type UnsavedStashOptions = {
    readonly storage?: () => Storage | null;
    readonly now?: () => number;
};

export class UnsavedStash {
    private readonly storage: () => Storage | null;
    private readonly now: () => number;

    public constructor(options: UnsavedStashOptions = {}) {
        this.storage = options.storage ?? (() => window.sessionStorage);
        this.now = options.now ?? Date.now;
    }

    /**
     * Keeps the values for the page's reload, over what an earlier load of it kept and has not been given back yet, a field's newer
     * value winning. None leaves that earlier stash as it is: a load that never attached (its connection lost again, another reload)
     * holds nothing of its own, and the values it was carrying would otherwise be gone.
     */
    public save(page: StashedPage, values: readonly UnsavedValue[]): void {
        if (values.length === 0)
            return;

        try {
            const storage = this.storage();

            if (storage === null)
                return;

            const now = this.now();
            const kept = readStash(storage.getItem(keyOf(page)) ?? "", now);
            const fields = new Set(values.map(fieldOf));
            const merged = [...kept.filter(value => !fields.has(fieldOf(value))), ...values];

            storage.setItem(keyOf(page), JSON.stringify({ saved: now, values: merged } satisfies Stash));
        }
        catch (error) {
            logWarn("the unsaved values could not be kept for the reload.", error);
        }
    }

    /** The values an earlier load of this page kept, taken out of the storage; none once they are older than their lifetime. */
    public take(page: StashedPage): UnsavedValue[] {
        try {
            const storage = this.storage();

            if (storage === null)
                return [];

            this.dropExpired(storage);

            const text = storage.getItem(keyOf(page));

            if (text === null)
                return [];

            storage.removeItem(keyOf(page));

            return readStash(text, this.now());
        }
        catch (error) {
            logWarn("the unsaved values kept for the reload could not be read.", error);
            return [];
        }
    }

    // A stash for an address the tab never came back to would otherwise stay as long as the tab.
    private dropExpired(storage: Storage): void {
        const expired: string[] = [];

        for (let index = 0; index < storage.length; index++) {
            const key = storage.key(index);

            if (key !== null && key.startsWith(KeyPrefix) && readStash(storage.getItem(key) ?? "", this.now()).length === 0)
                expired.push(key);
        }

        for (const key of expired)
            storage.removeItem(key);
    }
}

function keyOf(page: StashedPage): string {
    return `${KeyPrefix}${page.windowId}:${page.view ?? ""}:${page.address}`;
}

/** One field of one row: two values with the same one are the same field's, the later standing for both. */
function fieldOf(value: UnsavedValue): string {
    return `${value.bindingId}:${JSON.stringify(value.dynamicParameters)}`;
}

/** The stash's values while they are within their lifetime; none for one expired or not a stash. */
function readStash(text: string, now: number): UnsavedValue[] {
    let stash: unknown;

    try {
        stash = JSON.parse(text);
    }
    catch {
        return [];
    }

    if (typeof stash !== "object" || stash === null)
        return [];

    const { saved, values } = stash as Partial<Stash>;

    if (typeof saved !== "number" || now - saved > StashLifetimeMilliseconds || now < saved || !Array.isArray(values))
        return [];

    return values.filter(isUnsavedValue);
}

function isUnsavedValue(value: unknown): value is UnsavedValue {
    if (typeof value !== "object" || value === null)
        return false;

    const candidate = value as Partial<UnsavedValue>;

    return typeof candidate.bindingId === "string" && Array.isArray(candidate.dynamicParameters) && "value" in candidate;
}
