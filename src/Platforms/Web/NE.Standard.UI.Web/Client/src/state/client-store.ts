import { ComponentNameAttribute } from "../addressing/dom-attributes";
import { logDebug, logWarn } from "../runtime/logger";

const KeyPrefix = "ne.ui";
const BootSlot = "boot";

/** Attributes and styles the boot script writes on a component before the first paint. */
export type ClientBootPatch = {
    readonly selector?: string;
    readonly attributes?: Readonly<Record<string, string | null>>;
    readonly styles?: Readonly<Record<string, string>>;
};

// One log line per component and slot, not per read: a miss is normal for a component nobody named.
const reported = new Set<string>();

/** The small preferences a component keeps in the browser, keyed by the author's own name for it and by nothing else. */
export class ClientStore {
    /** The stored string, or null when there is nothing stored, no name to store it under, or no storage. */
    public read(component: Element, slot: string): string | null {
        const key = this.resolveKey(component, slot);

        if (key === null)
            return null;

        try {
            return window.localStorage.getItem(key);
        }
        catch (error) {
            logWarn("reading client state failed.", { key, error });
            return null;
        }
    }

    /** Stores a value, or removes it when null; `boot` given sets the slot's boot patch, null clears it, omitted leaves it. */
    public write(component: Element, slot: string, value: string | null, boot?: ClientBootPatch | null): void {
        const key = this.resolveKey(component, slot);

        if (key === null)
            return;

        try {
            if (value === null)
                window.localStorage.removeItem(key);
            else
                window.localStorage.setItem(key, value);
        }
        catch (error) {
            // A full or disabled store is not a fault the page can act on; the component simply forgets.
            logWarn("writing client state failed.", { key, error });
        }

        if (boot !== undefined || value === null)
            this.writeBoot(component, slot, value === null ? null : boot ?? null);
    }

    /** One boot record per component, a patch per slot: the shape the boot script reads. */
    private writeBoot(component: Element, slot: string, patch: ClientBootPatch | null): void {
        const key = this.resolveKey(component, BootSlot);

        if (key === null)
            return;

        try {
            const stored = window.localStorage.getItem(key);
            const patches = stored === null ? {} : JSON.parse(stored) as Record<string, ClientBootPatch>;

            if (patch === null)
                delete patches[slot];
            else
                patches[slot] = patch;

            if (Object.keys(patches).length === 0)
                window.localStorage.removeItem(key);
            else
                window.localStorage.setItem(key, JSON.stringify(patches));
        }
        catch (error) {
            logWarn("writing client boot state failed.", { key, error });
        }
    }

    public readJson<TValue>(component: Element, slot: string): TValue | null {
        const raw = this.read(component, slot);

        if (raw === null)
            return null;

        try {
            return JSON.parse(raw) as TValue;
        }
        catch {
            // Unreadable: dropped, so the next write starts from something valid.
            this.write(component, slot, null);
            return null;
        }
    }

    public writeJson(component: Element, slot: string, value: unknown): void {
        this.write(component, slot, value === null || value === undefined ? null : JSON.stringify(value));
    }

    private resolveKey(component: Element, slot: string): string | null {
        const name = component.getAttribute(ComponentNameAttribute);

        if (name === null || name.length === 0) {
            const marker = `${component.tagName}:${slot}`;

            if (!reported.has(marker)) {
                reported.add(marker);
                logDebug("client state is not kept for a component with no authored id.", { slot, component });
            }

            return null;
        }

        return `${KeyPrefix}:${name}:${slot}`;
    }
}
