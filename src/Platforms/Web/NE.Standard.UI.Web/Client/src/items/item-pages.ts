// A paged host's window read as pages: where it stands, which page a pager's button asks for, and which page numbers it shows.

import { ComponentKeyAttribute, WindowMoreAfterAttribute, WindowOffsetAttribute, WindowSizeAttribute, WindowTotalAttribute } from "../addressing/dom-attributes.ts";
import { readWindowFlag, readWindowNumber } from "./items-host-mode.ts";

// What a page holds when the host names no size — one the author never set — and no rows are on the page to read it off.
const DefaultPageSize = 50;

// The pages shown either side of the current one, and so the places the numbers take: the ends, their neighbours or an ellipsis, the run.
const Siblings = 1;
const Places = 2 * Siblings + 5;

/** What the host says about its window. */
export type PageState = {
    readonly offset: number;
    readonly count: number;
    readonly size: number;
    readonly total: number | null;
    readonly moreAfter: boolean;
};

/** A place in a pager's strip of numbers: a page by its number, or an ellipsis for the pages left out. */
export type PageMark = number | "gap";

/** The page as the host describes it; a host naming no size pages by the rows it holds, so a page never steps by a number nobody chose. */
export function readPageState(host: Element): PageState {
    let count = 0;

    for (const child of host.children) {
        if (child.hasAttribute(ComponentKeyAttribute))
            count++;
    }

    const size = readWindowNumber(host, WindowSizeAttribute) ?? 0;

    return {
        offset: readWindowNumber(host, WindowOffsetAttribute) ?? 0,
        count,
        size: size > 0 ? size : count > 0 ? count : DefaultPageSize,
        total: readWindowNumber(host, WindowTotalAttribute),
        moreAfter: readWindowFlag(host, WindowMoreAfterAttribute)
    };
}

/** The page the window shows, counted from 1. */
export function currentPage(state: PageState): number {
    return Math.floor(state.offset / state.size) + 1;
}

/** How many pages the source holds; null for a source that does not count, whose pages end where it says there are no more. */
export function pageCount(state: PageState): number | null {
    return state.total === null ? null : Math.max(1, Math.ceil(state.total / state.size));
}

/**
 * Where the window a button asks for starts — `first`, `previous`, `next`, `last`, or a page's number — or null where it leads nowhere:
 * past an end, or to the page on show. Previous and last land on a page boundary, so the viewer steps through the pages first counts from.
 */
export function pageOffset(state: PageState, page: string): number | null {
    switch (page) {
        case "first":
            return state.offset > 0 ? 0 : null;
        case "previous":
            return state.offset > 0 ? Math.max(0, (Math.ceil(state.offset / state.size) - 1) * state.size) : null;
        case "next":
            return state.moreAfter ? state.offset + state.count : null;
        case "last": {
            // With no count there is no last page to name: the next one is as far as the pager can say.
            if (state.total === null)
                return state.moreAfter ? state.offset + state.count : null;

            const lastStart = Math.max(0, Math.floor((state.total - 1) / state.size) * state.size);

            return state.offset < lastStart ? lastStart : null;
        }
        default: {
            const number = Number(page);
            const count = pageCount(state);

            if (!Number.isInteger(number) || number < 1 || (count !== null && number > count) || number === currentPage(state))
                return null;

            return (number - 1) * state.size;
        }
    }
}

/**
 * The numbers a pager shows: every page where they fit in seven places, else the first and the last, the current one with one
 * either side, and an ellipsis for each run left out — always seven places, so the strip keeps its width as the pages turn. An
 * ellipsis never stands for one page: that page is shown instead.
 */
export function pageNumbers(current: number, count: number): PageMark[] {
    if (count <= Places)
        return range(1, count);

    // The run around the current page, held off the ends so the ends' neighbours and an ellipsis always fit.
    const start = Math.max(Math.min(current - Siblings, count - 2 * Siblings - 2), 3);
    const end = Math.min(Math.max(current + Siblings, 2 * Siblings + 3), count - 2);

    return [
        1,
        start > 3 ? "gap" : 2,
        ...range(start, end),
        end < count - 2 ? "gap" : count - 1,
        count
    ];
}

/** The numbers for a source that does not count: the pages up to the current one and the next where there is one, then an ellipsis. */
export function openPageNumbers(current: number, moreAfter: boolean): PageMark[] {
    const marks = pageNumbers(current, moreAfter ? current + 1 : current);

    return moreAfter ? [...marks, "gap"] : marks;
}

function range(from: number, to: number): number[] {
    const numbers: number[] = [];

    for (let number = from; number <= to; number++)
        numbers.push(number);

    return numbers;
}
