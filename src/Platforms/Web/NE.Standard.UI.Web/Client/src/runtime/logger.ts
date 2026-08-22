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

function logTo(write: (message: string, data?: unknown) => void, message: string, data: unknown): void {
    if (data === undefined)
        write(`${LogPrefix} ${message}`);
    else
        write(`${LogPrefix} ${message}`, data);
}
