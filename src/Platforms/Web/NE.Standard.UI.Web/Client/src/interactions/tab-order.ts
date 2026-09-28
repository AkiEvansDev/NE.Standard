// Where a tab moved in its strip stands: an order between its new neighbours, so no other tab is renumbered — unless the tab after
// it carries no order, which the strip's sort puts ahead of every order. A drop and the tab menu's pin both take their orders here.

/** One tab of a strip as the order arithmetic sees it: its order, if it carries one, and whether it is pinned. */
export type StripTab = {
    readonly order: number | null;
    readonly pinned: boolean;
};

/**
 * The orders to write once the tab at `index` stands there in `tabs`, the strip in its new order, by place: the moved tab's alone,
 * between its neighbours; or, where the tab after it carries no order, every place whose order differs from its index — a tab
 * without an order sorts ahead of any number, so no order of the moved tab's own could keep it before that one.
 */
export function ordersAfterMove(tabs: readonly StripTab[], index: number): ReadonlyMap<number, number> {
    const next = tabs[index + 1];

    if (next === undefined || next.order !== null)
        return new Map([[index, orderBetween(tabs[index - 1]?.order ?? null, next?.order ?? null)]]);

    const orders = new Map<number, number>();

    tabs.forEach((tab, place) => {
        if (tab.order !== place)
            orders.set(place, place);
    });

    return orders;
}

/** The order a tab takes between two neighbours, either of which may be missing or carry none. */
export function orderBetween(previous: number | null, next: number | null): number {
    if (previous === null && next === null)
        return 0;

    if (previous === null)
        return next! - 1;

    if (next === null)
        return previous + 1;

    return (previous + next) / 2;
}

/**
 * Where a tab just pinned or unpinned goes among the strip's other tabs, given in strip order: right after the last pinned one, or
 * first when none is — the pinned tabs are the strip's head either way.
 */
export function pinnedBoundary(others: readonly StripTab[]): number {
    let index = 0;

    for (let i = 0; i < others.length; i++) {
        if (others[i].pinned)
            index = i + 1;
    }

    return index;
}
