const LogPrefix = "NE.Standard.UI";
const LevelStorageKey = "ne.ui:log";

/** What the client writes to the console. `warn` is the default: a shipped page says nothing until it has something to report. */
export type LogLevel = "debug" | "warn" | "error" | "silent";

const Order: Readonly<Record<LogLevel, number>> = { debug: 0, warn: 1, error: 2, silent: 3 };

let level: LogLevel = readStoredLevel();

/** Sets what reaches the console, and remembers it for the pages that follow — kept in storage since every navigation is a fresh document. */
export function setLogLevel(next: LogLevel): void {
    level = next;

    try {
        if (next === "warn")
            localStorage.removeItem(LevelStorageKey);
        else
            localStorage.setItem(LevelStorageKey, next);
    }
    catch {
        // No storage: the level holds for this page and no longer.
    }
}

export function getLogLevel(): LogLevel {
    return level;
}

export function logWarn(message: string, data?: unknown): void {
    if (Order[level] <= Order.warn)
        logTo(console.warn, message, data);
}

export function logError(message: string, data?: unknown): void {
    if (Order[level] <= Order.error)
        logTo(console.error, message, data);
}

export function logDebug(message: string, data?: unknown): void {
    if (Order[level] <= Order.debug)
        logTo(console.debug, message, data);
}

/** Whether debug lines reach the console; a measurement taken only for one reads this first. */
export function isDebugEnabled(): boolean {
    return Order[level] <= Order.debug;
}

/** Says at the debug level how long something took since `started`, a `performance.now()` reading. */
export function logElapsed(message: string, started: number, data?: unknown): void {
    if (Order[level] <= Order.debug)
        logTo(console.debug, `${message} in ${formatMilliseconds(performance.now() - started)}.`, data);
}

/** A duration as the debug lines write it: `12.3 ms`. */
export function formatMilliseconds(milliseconds: number): string {
    return `${milliseconds.toFixed(1)} ms`;
}

/** One warning per subject: a fault that would otherwise repeat for every gesture on a broken element says itself once. */
export class OnceWarner {
    private readonly warned = new WeakSet<object>();

    public warn(subject: object, message: string, data?: unknown): void {
        if (this.warned.has(subject))
            return;

        this.warned.add(subject);
        logWarn(message, { subject, ...(data === undefined ? {} : { data }) });
    }
}

function readStoredLevel(): LogLevel {
    try {
        const stored = localStorage.getItem(LevelStorageKey);

        if (stored !== null && stored in Order)
            return stored as LogLevel;
    }
    catch {
        // No storage, a private window or a thumbnail: the default stands.
    }

    return "warn";
}

function logTo(write: (message: string, data?: unknown) => void, message: string, data: unknown): void {
    if (data === undefined)
        write(`${LogPrefix} ${message}`);
    else
        write(`${LogPrefix} ${message}`, data);
}
