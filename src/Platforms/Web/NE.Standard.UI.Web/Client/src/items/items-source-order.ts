// The order the source holds a host's items in, kept apart from the host's children, which stop showing it once a sort or a
// group order is applied and have to be able to come back to it.

const orderByHost = new WeakMap<Element, Element[]>();

/** The host's items in source order, given the items it holds now; ones it gained by a whole-host render are taken as they stand. */
export function getSourceOrder(host: Element, present: readonly Element[]): Element[] {
    const known = orderByHost.get(host);
    const order = known === undefined ? [...present] : mergeSourceOrder(known, present);

    orderByHost.set(host, order);

    return order;
}

/** Keeps the known order of what is still present; anything present but unknown means the host was rebuilt, and its order is the truth. */
export function mergeSourceOrder<T>(known: readonly T[], present: readonly T[]): T[] {
    const presentSet = new Set(present);
    const kept = known.filter(item => presentSet.has(item));

    return kept.length === present.length ? kept : [...present];
}

/** Records an item at a source index; null appends. Returns the item that now follows it, which is where it goes in an unsorted host. */
export function insertSourceItem(order: Element[], element: Element, index: number | null): Element | null {
    const at = index === null || index > order.length ? order.length : index;

    order.splice(at, 0, element);

    return order[at + 1] ?? null;
}

export function removeSourceItem(order: Element[], element: Element): void {
    const at = order.indexOf(element);

    if (at >= 0)
        order.splice(at, 1);
}

/** Moves an item to a source index and returns the item that now follows it. */
export function moveSourceItem(order: Element[], element: Element, newIndex: number | null): Element | null {
    removeSourceItem(order, element);

    return insertSourceItem(order, element, newIndex);
}

/** Swaps one item for another in place, so a replaced row keeps its position when the sort comes off. */
export function replaceSourceItem(order: Element[], existing: Element, element: Element): void {
    const at = order.indexOf(existing);

    if (at >= 0)
        order[at] = element;
}

export function resetSourceOrder(host: Element): void {
    orderByHost.delete(host);
}
