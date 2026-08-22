import { ComponentNameAttribute } from "../addressing/dom-attributes";
import { logDebug, logWarn } from "../runtime/logger";

const KeyPrefix = "ne.ui";

// One line per component and slot, not per read: a store miss is a normal state for a component nobody named,
// and a menu answers scroll, resize and every items patch.
const reported = new Set<string>();

/**
 * The small preferences a component keeps in the browser rather than on the controller: whether a menu is
 * collapsed, which of its groups is open, the order a grid's columns were dragged into. None of it is
 * application data — it is how *this* viewer left *this* component, and asking the server for it would cost a
 * round trip, a property on every controller that hosts the component, and a place to persist it per user.
 *
 * Keyed by the author's own name for the component (`data-ui-name`), deliberately without the route or the
 * view: a sidebar appears in every view of an application and is one component to the person using it, so
 * folding the view into the key would reset it on the first click. A component with no authored id stores
 * nothing — a generated id is a counter and would hand this viewer's state to a different component after the
 * next edit.
 */
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

    /** Stores a value, or removes it when the value is null. */
    public write(component: Element, slot: string, value: string | null): void {
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
            // A full or disabled store is not a fault the page can do anything about, and the component
            // works without it — it simply forgets.
            logWarn("writing client state failed.", { key, error });
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
            // Written by an older shape of the same component, most likely. Dropped rather than kept, so the
            // next write starts from something readable.
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
