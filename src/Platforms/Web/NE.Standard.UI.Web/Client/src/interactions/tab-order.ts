// Where a moved tab stands: an order between its new neighbours, so no other tab is renumbered; for a drop and the tab menu's pin.

/** One tab of a strip as the order arithmetic sees it: its order, if it carries one, and whether it is pinned. */
export type StripTab = {
    readonly order: number | null;
    readonly pinned: boolean;
};

/** The orders to write, by place, once the tab at `index` stands there in `tabs`, the strip in its new order. */
export function ordersAfterMove(tabs: readonly StripTab[], index: number): ReadonlyMap<number, number> {
    const next = tabs[index + 1];

    if (next === undefined || next.order !== null)
        return new Map([[index, orderBetween(tabs[index - 1]?.order ?? null, next?.order ?? null)]]);

    // A tab with no order sorts ahead of any number, so no order of the moved tab's own keeps it before one: every place is renumbered.
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

/** Where a tab just pinned or unpinned goes among the others, in strip order: right after the last pinned one, else first. */
export function pinnedBoundary(others: readonly StripTab[]): number {
    let index = 0;

    for (let i = 0; i < others.length; i++) {
        if (others[i].pinned)
            index = i + 1;
    }

    return index;
}
