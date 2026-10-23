// A dropped connection is started again until the server would have let the page's runtime go: the first try at once, then waits
// that double up to a cap, each drawn at random below it (full jitter) so a server coming back is not met by every page at once.
// The browser saying the network is back, or the page coming on screen, cuts the wait short.

/** How long a detached runtime is kept by default (`UIPersistenceOptions.DisconnectedRetention`): past it, a reconnect finds it gone. */
export const DefaultReconnectWindowMilliseconds = 10 * 60_000;

const BaseDelayMilliseconds = 1000;
const MaxDelayMilliseconds = 30_000;

export type ReconnectBackoffOptions = {
    // How long after the drop a try may still start; none past it.
    readonly windowMilliseconds?: number;
    readonly baseMilliseconds?: number;
    readonly maxMilliseconds?: number;
    // A number in [0, 1); the tests' own in place of Math.random.
    readonly random?: () => number;
};

/** The wait before try `attempt` (0 first) of a reconnect `elapsed` milliseconds after the drop; null once the window is spent. */
export function nextReconnectDelay(attempt: number, elapsed: number, options: ReconnectBackoffOptions = {}): number | null {
    if (elapsed >= (options.windowMilliseconds ?? DefaultReconnectWindowMilliseconds))
        return null;

    if (attempt === 0)
        return 0;

    const ceiling = Math.min(options.maxMilliseconds ?? MaxDelayMilliseconds, (options.baseMilliseconds ?? BaseDelayMilliseconds) * 2 ** (attempt - 1));

    return Math.floor((options.random ?? Math.random)() * ceiling);
}

export type ReconnectLoopOptions = ReconnectBackoffOptions & {
    // One try: settles once the connection is open again, fails when this try did not open it.
    readonly start: () => Promise<void>;
    // A reconnect that follows one whose connection closed again before the page attached goes on where that one stopped: the window
    // from the first drop (`now()`'s clock), the backoff from its next try, or a server that takes the connection and drops it at once
    // is met by back-to-back tries for ever.
    readonly startedAt?: number;
    readonly firstAttempt?: number;
    readonly now?: () => number;
    readonly setTimer?: (callback: () => void, milliseconds: number) => unknown;
    readonly clearTimer?: (handle: unknown) => void;
};

/** One reconnect: tries in turn until one opens the connection or the window is spent; `wake` starts the next try now. */
export class ReconnectLoop {
    private readonly options: ReconnectLoopOptions;
    private timer: unknown = null;
    private resume: (() => void) | null = null;
    private stopped = false;
    private attempts = 0;

    public constructor(options: ReconnectLoopOptions) {
        this.options = options;
    }

    /** The try a reconnect following this one starts from: one past the last this one made. */
    public get nextAttempt(): number {
        return this.attempts;
    }

    /** True once a try opened the connection; false once the window is spent or the loop was stopped. */
    public async runAsync(): Promise<boolean> {
        const now = this.options.now ?? Date.now;
        const started = this.options.startedAt ?? now();

        for (let attempt = this.options.firstAttempt ?? 0; ; attempt++) {
            const delay = nextReconnectDelay(attempt, now() - started, this.options);

            if (delay === null || this.stopped)
                return false;

            await this.waitAsync(delay);

            if (this.stopped)
                return false;

            this.attempts = attempt + 1;

            try {
                await this.options.start();
                return !this.stopped;
            }
            catch {
                // The next try's wait says it; the caller logs the drop once rather than every failed try.
            }
        }
    }

    private waitAsync(milliseconds: number): Promise<void> {
        if (milliseconds <= 0)
            return Promise.resolve();

        return new Promise<void>(resolve => {
            this.resume = resolve;
            this.timer = (this.options.setTimer ?? ((callback, ms) => setTimeout(callback, ms)))(() => this.finishWait(), milliseconds);
        });
    }

    private finishWait(): void {
        if (this.timer !== null) {
            (this.options.clearTimer ?? (handle => clearTimeout(handle as ReturnType<typeof setTimeout>)))(this.timer);
            this.timer = null;
        }

        const resume = this.resume;

        this.resume = null;
        resume?.();
    }

    /** Ends the wait under way: the network is back or the page is on screen, and a try now is likelier to work than the timer's. */
    public wake(): void {
        this.finishWait();
    }

    /** Gives up: the wait under way ends and no try follows. */
    public stop(): void {
        this.stopped = true;
        this.finishWait();
    }
}
