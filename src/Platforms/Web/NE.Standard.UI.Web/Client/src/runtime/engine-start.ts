// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { formatMilliseconds, isDebugEnabled, logDebug, logError } from "./logger.ts";

// An engine quicker than this starts without a line of its own; the debug log names only the ones worth looking at.
const SlowEngineStartMilliseconds = 2;

/** Starts one engine; one that throws is logged by name and the page goes on without it, so it cannot keep the rest from starting. */
export function startEngine<TContext>(name: string, start: (context: TContext) => unknown, context: TContext): void {
    const started = isDebugEnabled() ? performance.now() : -1;

    try {
        start(context);
    }
    catch (error) {
        logError(`the ${name} engine failed to start; the page goes on without it.`, error);
    }

    if (started >= 0) {
        const elapsed = performance.now() - started;

        if (elapsed >= SlowEngineStartMilliseconds)
            logDebug(`the ${name} engine took ${formatMilliseconds(elapsed)} to start.`);
    }
}

/** What a package's engine is called in the console: its function's own name, when it has one. */
export function nameOfPackageEngine(start: (...args: never[]) => unknown): string {
    return start.name.length > 0 ? `"${start.name}" package` : "package";
}
