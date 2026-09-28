// Arrowing between siblings, skipping the ones that are not really there; which element the key moves to, leaving the rest to the caller.

export type RovingAxis = "vertical" | "horizontal" | "both";

export type RovingRequest = {
    readonly key: string;
    readonly items: readonly HTMLElement[];
    readonly current: HTMLElement | null;
    readonly axis: RovingAxis;
    /** Wrap past the ends. Default true. */
    readonly loop?: boolean;
};

/** The element the key moves to, or null when the key is not a navigation key for this axis. */
export function resolveRovingTarget(request: RovingRequest): HTMLElement | null {
    const edge = resolveEdge(request.key);
    const step = resolveStep(request.key, request.axis);

    // The key first: measuring every item for a key that moves nothing is a layout read per item on every keystroke.
    if (edge === null && step === 0)
        return null;

    const items = request.items.filter(isRovingCandidate);

    if (items.length === 0)
        return null;

    if (edge !== null)
        return edge === "first" ? items[0] : items[items.length - 1];

    // An unknown current enters at the near end rather than doing nothing.
    const index = request.current === null ? -1 : items.indexOf(request.current);

    if (index === -1)
        return step > 0 ? items[0] : items[items.length - 1];

    const next = index + step;

    if (next >= 0 && next < items.length)
        return items[next];

    return (request.loop ?? true) ? items[(next + items.length) % items.length] : null;
}

/** Whether the key moves along this axis at all: an arrow of it, Home or End. */
export function isRovingKey(key: string, axis: RovingAxis): boolean {
    return resolveEdge(key) !== null || resolveStep(key, axis) !== 0;
}

/** The arrowing as a package reaches it through the engine context. */
export const rovingFocus = {
    target: resolveRovingTarget,
    applyTabIndex: applyRovingTabIndex
};

/** Leaves exactly one item in the tab order. */
export function applyRovingTabIndex(items: readonly HTMLElement[], active: HTMLElement | null): void {
    for (const item of items)
        item.tabIndex = item === active ? 0 : -1;
}

/** Whether an element can take the caret: rendered, and not disabled. */
export function isRovingCandidate(item: HTMLElement): boolean {
    // Client rects rather than offsetParent, which is also null for the position:fixed of an open context menu.
    if (item.getClientRects().length === 0)
        return false;

    return !item.matches(":disabled, .ui-disabled, [aria-disabled='true']");
}

function resolveEdge(key: string): "first" | "last" | null {
    if (key === "Home")
        return "first";

    return key === "End" ? "last" : null;
}

function resolveStep(key: string, axis: RovingAxis): number {
    if (axis !== "horizontal" && (key === "ArrowDown" || key === "ArrowUp"))
        return key === "ArrowDown" ? 1 : -1;

    if (axis !== "vertical" && (key === "ArrowRight" || key === "ArrowLeft"))
        return key === "ArrowRight" ? 1 : -1;

    return 0;
}
