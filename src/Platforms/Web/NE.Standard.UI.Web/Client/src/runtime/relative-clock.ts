// The one clock a relative moment is written again by — a relative timestamp's and a relative moment in words alike: running while
// anything shown needs it, stopped once nothing does.

// `.ts` on the value import: `node --test` runs this module and resolves files literally.
import { logWarn } from "./logger.ts";

/** How often a relative text is written again: past "now" its smallest unit is a minute, so it is never more than a quarter behind. */
export const RelativeRefreshMilliseconds = 15_000;

/** Writes relative texts again on a tick; answers whether it still shows one, and so needs the next tick. */
export type RelativeTick = () => boolean;

const ticks = new Set<RelativeTick>();
let timer: ReturnType<typeof setInterval> | null = null;

/** Ticks `tick` every 15 s until it answers false, starting the clock if it stood; a tick already ticking is not ticked twice. */
export function needRelativeTicks(tick: RelativeTick): void {
    ticks.add(tick);

    if (timer === null)
        timer = setInterval(tickAll, RelativeRefreshMilliseconds);
}

function tickAll(): void {
    // A copy: a tick may ask again for the ticks it is in, which is no second one.
    for (const tick of [...ticks]) {
        let needed = false;

        try {
            needed = tick();
        }
        catch (error) {
            logWarn("a relative tick failed; it is ticked no more.", error);
        }

        if (!needed)
            ticks.delete(tick);
    }

    if (ticks.size === 0 && timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}
