// Where a tab just pinned or unpinned stands until the server, which writes the orders, answers: the pinned tabs kept at the head.

/** One tab of a strip as the pin's arithmetic sees it: whether it is pinned. */
export type StripTab = {
    readonly pinned: boolean;
};

/** Where a tab just pinned or unpinned goes among the others, in strip order: right after the last pinned one, else first. */
export function pinnedBoundary(others: readonly StripTab[]): number {
    let index = 0;

    for (let i = 0; i < others.length; i++) {
        if (others[i].pinned)
            index = i + 1;
    }

    return index;
}
