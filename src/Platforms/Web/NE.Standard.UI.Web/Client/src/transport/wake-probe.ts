// Mobile and tablet OS sleep or network switches frequently leave WebSockets half-open: the browser reports `Connected`, while
// frames written to the socket silently stall until SignalR's server timeout expires. A bounded probe on wake detects a dead socket
// in a couple of seconds and reopens it immediately.

/** Minimum hidden duration before returning to the foreground triggers a liveness probe; brief tab flickers stay silent. */
export const WakeProbeMinHiddenMilliseconds = 4_000;

/** How long a wake probe may wait before declaring a supposedly connected socket half-open. */
export const WakeProbeTimeoutMilliseconds = 2_000;

export type WakeProbeOptions = {
    readonly isConnected: () => boolean;
    readonly ping: () => Promise<void>;
    readonly onStalled: () => void;
    readonly minHiddenMilliseconds?: number;
    readonly timeoutMilliseconds?: number;
    readonly now?: () => number;
    readonly setTimer?: (callback: () => void, milliseconds: number) => unknown;
    readonly clearTimer?: (handle: unknown) => void;
};

/** Probes a live connection after background sleep or network recovery and triggers recovery if the socket is half-open. */
export class WakeProbe {
    private readonly options: WakeProbeOptions;
    private readonly now: () => number;
    private readonly minHiddenMilliseconds: number;
    private readonly timeoutMilliseconds: number;
    private readonly setTimer: (callback: () => void, milliseconds: number) => unknown;
    private readonly clearTimer: (handle: unknown) => void;

    private hiddenAt: number | null = null;
    private inFlight = false;
    private timer: unknown = null;
    private generation = 0;
    private disposed = false;

    public constructor(options: WakeProbeOptions) {
        this.options = options;
        this.now = options.now ?? Date.now;
        this.minHiddenMilliseconds = options.minHiddenMilliseconds ?? WakeProbeMinHiddenMilliseconds;
        this.timeoutMilliseconds = options.timeoutMilliseconds ?? WakeProbeTimeoutMilliseconds;
        this.setTimer = options.setTimer ?? ((callback, ms) => setTimeout(callback, ms));
        this.clearTimer = options.clearTimer ?? (handle => clearTimeout(handle as ReturnType<typeof setTimeout>));
    }

    /** Records when the page went off screen or lost network, keeping the earliest timestamp across overlapping signals. */
    public noteHidden(): void {
        if (this.disposed)
            return;

        this.hiddenAt ??= this.now();
    }

    /** Probes socket liveness when `force` is set or the page was hidden long enough for the socket to go stale. */
    public wake(force: boolean): void {
        if (this.disposed)
            return;

        const hiddenAt = this.hiddenAt;
        this.hiddenAt = null;

        const shouldProbe = force || (hiddenAt !== null && this.now() - hiddenAt >= this.minHiddenMilliseconds);

        if (!shouldProbe || this.inFlight || !this.options.isConnected())
            return;

        this.startProbe();
    }

    public dispose(): void {
        if (this.disposed)
            return;

        this.disposed = true;
        this.generation++;
        this.inFlight = false;
        this.clearPendingTimer();
    }

    private startProbe(): void {
        const probeId = ++this.generation;
        this.inFlight = true;

        this.timer = this.setTimer(() => {
            this.timer = null;

            if (this.disposed || probeId !== this.generation)
                return;

            this.inFlight = false;

            if (this.options.isConnected())
                this.options.onStalled();
        }, this.timeoutMilliseconds);

        const finish = (): void => {
            if (probeId !== this.generation)
                return;

            this.inFlight = false;
            this.clearPendingTimer();
        };

        void this.options.ping().then(finish, finish);
    }

    private clearPendingTimer(): void {
        if (this.timer === null)
            return;

        const handle = this.timer;
        this.timer = null;
        this.clearTimer(handle);
    }
}
