const LogPrefix = "NE.Standard.UI";

export function logWarn(message: string, data?: unknown): void {
    logTo(console.warn, message, data);
}

export function logError(message: string, data?: unknown): void {
    logTo(console.error, message, data);
}

export function logDebug(message: string, data?: unknown): void {
    logTo(console.debug, message, data);
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

function logTo(write: (message: string, data?: unknown) => void, message: string, data: unknown): void {
    if (data === undefined)
        write(`${LogPrefix} ${message}`);
    else
        write(`${LogPrefix} ${message}`, data);
}
