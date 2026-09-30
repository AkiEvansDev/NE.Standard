// An attach that throws is tried again after a growing wait, so a hub call failing on a live socket needs no reload; one that fails
// because the connection dropped again is left to the reconnect, which attaches again itself once the connection is back.

// `.ts` on the value import: `node --test` loads this module as it is.
import { logError, logWarn } from "../runtime/logger.ts";

/** An attach left to the reconnect under way, which attaches again itself. */
export const LeftToReconnect = "reconnecting";

/** What an attach came to: its answer, null once every retry failed, or left to the reconnect. */
export type AttachOutcome<TAnswer> = TAnswer | null | typeof LeftToReconnect;

/** Tries the attach, and again after each of `delays`; `reconnecting` says whether the connection is between a drop and its return. */
export async function attachWithRetryAsync<TAnswer extends object>(attach: () => Promise<TAnswer>, reconnecting: () => boolean, delays: readonly number[], wait: (milliseconds: number) => Promise<void>): Promise<AttachOutcome<TAnswer>> {
    for (let attempt = 0; ; attempt++) {
        try {
            return await attach();
        }
        catch (error) {
            // Every retry would fail at once until the connection is back, and giving up closes the page for good seconds before it is.
            if (reconnecting()) {
                logWarn("attaching the runtime failed as the connection dropped again; the reconnect attaches.", error);
                return LeftToReconnect;
            }

            if (attempt >= delays.length) {
                logError("attaching the runtime failed after retrying; giving up.", error);
                return null;
            }

            logWarn("attaching the runtime failed; retrying.", { attempt: attempt + 1, error });
            await wait(delays[attempt]);
        }
    }
}
