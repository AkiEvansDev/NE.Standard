// A gesture's change made on the page ahead of its command and kept until the command's answer: a row's move, rows dropped into
// another list. The event registration's half of it; the ledger that makes and settles the change is the caller's.

// Types imported as types: `node --test` loads this module as it is.
import type { EventRegistration } from "./event-descriptor.ts";

/**
 * The `started` and `completed` of an event whose change stands on the page ahead of its command: made as the pipeline takes the
 * event, not at the gesture — one no command or interaction takes would stand with no answer to put it back — and settled once the
 * command is answered, whatever the answer.
 */
export function aheadOfAnswer<T>(ahead: (domEvent: Event) => T | null, settle: (made: T) => void): Required<Pick<EventRegistration, "started" | "completed">> {
    const pending = new WeakMap<Event, T>();

    return {
        started: context => {
            const made = ahead(context.domEvent);

            if (made !== null)
                pending.set(context.domEvent, made);
        },
        completed: context => {
            const made = pending.get(context.domEvent);

            if (made === undefined)
                return;

            pending.delete(context.domEvent);
            settle(made);
        }
    };
}
