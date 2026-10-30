// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { formatMilliseconds, isDebugEnabled, logDebug, logError } from "../metadata/logger.ts";

// An engine quicker than this starts without a line of its own; the debug log names only the ones worth looking at.
const SlowEngineStartMilliseconds = 2;

/** What an engine may return to clean up its work when the runtime is disposed. */
export type EngineDisposable = (() => void) | { readonly dispose?: () => void };

/** Starts one engine; one that throws is logged by name and the page goes on without it, so it cannot keep the rest from starting. */
export function startEngine<TContext>(name: string, start: (context: TContext) => unknown, context: TContext): (() => void) | null {
    const started = isDebugEnabled() ? performance.now() : -1;
    let startedEngine: unknown;

    try {
        startedEngine = start(context);
    }
    catch (error) {
        logError(`the ${name} engine failed to start; the page goes on without it.`, error);
        return null;
    }

    if (started >= 0) {
        const elapsed = performance.now() - started;

        if (elapsed >= SlowEngineStartMilliseconds)
            logDebug(`the ${name} engine took ${formatMilliseconds(elapsed)} to start.`);
    }

    return toDisposer(name, startedEngine);
}

/** What a package's engine is called in the console: its function's own name, when it has one. */
export function nameOfPackageEngine(start: (...args: never[]) => unknown): string {
    return start.name.length > 0 ? `"${start.name}" package` : "package";
}

function toDisposer(name: string, value: unknown): (() => void) | null {
    if (typeof value === "function")
        return () => runDisposer(name, value as () => void);

    if (typeof value === "object" && value !== null && "dispose" in value && typeof value.dispose === "function") {
        const disposable = value as { dispose(): void };

        return () => runDisposer(name, () => disposable.dispose());
    }

    return null;
}

function runDisposer(name: string, dispose: () => void): void {
    try {
        dispose();
    }
    catch (error) {
        logError(`the ${name} engine failed to dispose.`, error);
    }
}
