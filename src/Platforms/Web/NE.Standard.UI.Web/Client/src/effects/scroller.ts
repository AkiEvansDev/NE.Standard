// Which box a Scroll effect moves, apart from the effect registry so a test loads it alone.

// `.ts` on the value import: a test loads this module as it is.
import { canScroll } from "../interactions/element-visibility.ts";

/**
 * The scroller of the addressed element: itself, else one inside it, else the nearest outside it — one that overflows now before one
 * that only could (a list still short enough to show whole, where scrolling it is a no-op until it grows). The element's own box wins
 * over one outside it that overflows: a short chat feed on a long page scrolls nothing, rather than the page.
 */
export function resolveScroller(element: Element, vertical: boolean): Element | null {
    const own = firstScroller([element, ...element.querySelectorAll("*")], vertical);

    if (own !== null)
        return own;

    const outside: Element[] = [];

    for (let current = element.parentElement; current !== null; current = current.parentElement)
        outside.push(current);

    return firstScroller(outside, vertical) ?? pageScroller(vertical);
}

/**
 * The document's own scroll, where nothing around the element scrolls but the page does — a phone's page, whose regions scroll with
 * the document (`core/runtime.less`); null on a page that shows all it holds.
 */
function pageScroller(vertical: boolean): Element | null {
    const page = typeof document === "undefined" ? null : document.scrollingElement ?? null;

    return page !== null && overflows(page, vertical) ? page : null;
}

/** The first candidate that overflows along the axis, else the first whose overflow could scroll, else null. */
function firstScroller(candidates: Iterable<Element>, vertical: boolean): Element | null {
    let fallback: Element | null = null;

    for (const candidate of candidates) {
        if (!canScroll(candidate, vertical))
            continue;

        if (overflows(candidate, vertical))
            return candidate;

        fallback ??= candidate;
    }

    return fallback;
}

function overflows(element: Element, vertical: boolean): boolean {
    return vertical
        ? element.scrollHeight > element.clientHeight
        : element.scrollWidth > element.clientWidth;
}
