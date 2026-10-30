// Captures event listeners and DOM observers attached synchronously while a runtime constructs its built-in engines,
// plus explicit disposers registered by shared helpers, so `WebUIRuntime.dispose()` tears them down in reverse order.

type AnyTarget = {
    addEventListener?: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
    removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
};

let activeScope: CleanupScope | null = null;

function swapActiveScope(next: CleanupScope | null): CleanupScope | null {
    const previous = activeScope;

    activeScope = next;
    return previous;
}

/** Registers a teardown callback with the currently constructing runtime's `CleanupScope`, if one is active. */
export function registerRuntimeCleanup(dispose: () => void): void {
    activeScope?.add(dispose);
}

/** Runs `action` outside any active `CleanupScope`, for module-level lazy singletons that manage their own lifetime. */
export function withoutRuntimeCleanup<T>(action: () => T): T {
    const previous = swapActiveScope(null);

    try {
        return action();
    }
    finally {
        swapActiveScope(previous);
    }
}

export class CleanupScope {
    private readonly cleanups: (() => void)[] = [];
    private readonly observed = new WeakSet<object>();

    public add(dispose: () => void): void {
        this.cleanups.push(dispose);
    }

    public enter(extraTargets: readonly unknown[]): () => void {
        const previous = swapActiveScope(this);
        const restores: (() => void)[] = [];
        let left = false;

        this.patchEventTargets(extraTargets, restores);
        this.patchObserver((globalThis as { MutationObserver?: { prototype?: { observe?: (...args: unknown[]) => unknown; disconnect?: () => void } } }).MutationObserver, restores);
        this.patchObserver((globalThis as { ResizeObserver?: { prototype?: { observe?: (...args: unknown[]) => unknown; disconnect?: () => void } } }).ResizeObserver, restores);

        return () => {
            if (left)
                return;

            left = true;

            for (const restore of restores.reverse())
                restore();

            swapActiveScope(previous);
        };
    }

    public run<T>(extraTargets: readonly unknown[], action: () => T): T {
        const leave = this.enter(extraTargets);

        try {
            return action();
        }
        finally {
            leave();
        }
    }

    public dispose(): void {
        for (const cleanup of this.cleanups.splice(0).reverse()) {
            try {
                cleanup();
            }
            catch {
                // Best-effort teardown on a detached or partially mocked host.
            }
        }
    }

    private patchEventTargets(extraTargets: readonly unknown[], restores: (() => void)[]): void {
        const prototypes = new Set<AnyTarget>();
        const globalEventTarget = (globalThis as { EventTarget?: { prototype?: AnyTarget } }).EventTarget?.prototype;

        if (globalEventTarget !== undefined && typeof globalEventTarget.addEventListener === "function")
            prototypes.add(globalEventTarget);

        for (const candidate of extraTargets) {
            if (typeof candidate !== "object" || candidate === null)
                continue;

            const target = candidate as AnyTarget;

            if (typeof target.addEventListener !== "function")
                continue;

            if (globalEventTarget !== undefined && Object.prototype.isPrototypeOf.call(globalEventTarget, target))
                continue;

            const owner = findAddEventListenerHolder(target);

            if (owner !== null)
                prototypes.add(owner);
        }

        for (const holder of prototypes)
            patchEventTargetHolder(holder, restores);
    }

    private patchObserver(ctor: { prototype?: { observe?: (...args: unknown[]) => unknown; disconnect?: () => void } } | undefined, restores: (() => void)[]): void {
        const prototype = ctor?.prototype;
        const originalObserve = prototype?.observe;

        if (prototype === undefined || typeof originalObserve !== "function")
            return;

        prototype.observe = function (this: { disconnect?: () => void }, ...args: unknown[]): unknown {
            if (activeScope !== null && !activeScope.observed.has(this) && typeof this.disconnect === "function") {
                activeScope.observed.add(this);
                activeScope.add(() => this.disconnect?.());
            }

            return originalObserve.apply(this, args);
        };

        restores.push(() => {
            prototype.observe = originalObserve;
        });
    }
}

function patchEventTargetHolder(holder: AnyTarget, restores: (() => void)[]): void {
    const originalAdd = holder.addEventListener;
    const hasOwn = Object.hasOwn(holder, "addEventListener");

    if (typeof originalAdd !== "function")
        return;

    holder.addEventListener = function (this: AnyTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        originalAdd.call(this, type, listener, options);

        if (activeScope !== null && listener !== null && typeof this.removeEventListener === "function") {
            const remove = this.removeEventListener;

            activeScope.add(() => remove.call(this, type, listener, options));
        }
    };

    restores.push(() => {
        if (hasOwn)
            holder.addEventListener = originalAdd;
        else
            delete holder.addEventListener;
    });
}

function findAddEventListenerHolder(target: AnyTarget): AnyTarget | null {
    for (let current: object | null = target; current !== null; current = Reflect.getPrototypeOf(current)) {
        if (Object.hasOwn(current, "addEventListener"))
            return current;
    }

    return target;
}
