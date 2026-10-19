// The pickers' uploads still on their way, which a submit of the picker's form waits for (docs/FILES.md §7): a picker writes its
// selection id only once its upload answers, and a command read in between would take the form without the file.

// `node --test` loads this module as it is: `.ts` on the value imports.
import { FormIdAttribute } from "../addressing/dom-attributes.ts";

/** Ends one upload's hold on its picker's form; a no-op once a later pick took its slot. */
type UploadHold = () => void;

/** The uploads each picker has on its way, by the slot each fills: the picker's own for a single pick, a square's for a shelf's. */
export class UploadsInFlight {
    private readonly slots = new Map<HTMLElement, Map<object, UploadHold>>();
    private wake: () => void = () => undefined;
    private changed: Promise<void> = this.nextChange();
    // Watching for a held picker leaving the page only while a submit waits: no release comes for it.
    private waiting = 0;
    private removals: MutationObserver | null = null;

    /** Holds the picker's form until the hold answered is called; a second hold on the same slot — a pick replacing one — takes its place. */
    public hold(root: HTMLElement, slot: object = root): UploadHold {
        let slots = this.slots.get(root);

        if (slots === undefined) {
            slots = new Map();
            this.slots.set(root, slots);
        }

        const hold: UploadHold = () => this.release(root, slot, hold);

        slots.set(slot, hold);

        return hold;
    }

    private release(root: HTMLElement, slot: object, hold: UploadHold): void {
        const slots = this.slots.get(root);

        // A root let go of for leaving the page still wakes the waiters: one may be asleep on it.
        if (slots !== undefined) {
            if (slots.get(slot) !== hold)
                return;

            slots.delete(slot);

            if (slots.size === 0)
                this.slots.delete(root);
        }

        this.wakeWaiters();
    }

    private wakeWaiters(): void {
        const wake = this.wake;

        this.changed = this.nextChange();
        wake();
    }

    private nextChange(): Promise<void> {
        return new Promise<void>(resolve => {
            this.wake = resolve;
        });
    }

    /** Lets go of a slot whatever upload fills it: a square taken off the shelf, a preview the controller's answer replaced. */
    public forget(root: HTMLElement, slot: object = root): void {
        this.slots.get(root)?.get(slot)?.();
    }

    /**
     * Resolves, with the pickers it waited for, once no picker of the form has an upload on its way; at once while none has. A picker
     * gone from the page holds nothing, one that leaves while the submit waits included.
     */
    public async whenUploadedAsync(formId: string): Promise<ReadonlySet<HTMLElement>> {
        const waited = new Set<HTMLElement>();

        this.waiting++;

        try {
            while (this.holdsForm(formId, waited)) {
                this.watchRemovals();
                await this.changed;
            }
        }
        finally {
            if (--this.waiting === 0) {
                this.removals?.disconnect();
                this.removals = null;
            }
        }

        return waited;
    }

    /** Whether a picker of the form holds it, each one that does added to `waited`. */
    private holdsForm(formId: string, waited: Set<HTMLElement>): boolean {
        let holds = false;

        for (const root of this.slots.keys()) {
            if (!root.isConnected) {
                this.slots.delete(root);
                continue;
            }

            if (formIdOf(root) === formId) {
                waited.add(root);
                holds = true;
            }
        }

        return holds;
    }

    private watchRemovals(): void {
        if (this.removals !== null || typeof MutationObserver === "undefined")
            return;

        this.removals = new MutationObserver(() => {
            for (const root of this.slots.keys()) {
                if (!root.isConnected) {
                    this.wakeWaiters();
                    return;
                }
            }
        });
        this.removals.observe(document, { childList: true, subtree: true });
    }
}

/** The picker's form, read when asked: a bound `FormId` may have moved it. On the root, or on the field inside it that carries it. */
function formIdOf(root: HTMLElement): string | null {
    const field = root.hasAttribute(FormIdAttribute) ? root : root.querySelector(`[${FormIdAttribute}]`);

    return field?.getAttribute(FormIdAttribute) ?? null;
}

/** The page's: the file and image inputs hold it, a package's field through `uploads.uploadAsync`, the event pipeline waits on it. */
export const uploadsInFlight = new UploadsInFlight();
