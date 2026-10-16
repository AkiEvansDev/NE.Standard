// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { WindowSpacerAttribute } from "../addressing/dom-attributes.ts";

export const TopSpacer = "top";
export const BottomSpacer = "bottom";
// After the rows of a host that cannot count, while its next rows are on their way: what the reader scrolled to meanwhile.
export const PendingSpacer = "pending";
// Between a virtualized host's row kept drawn out of range for the focus it holds and the rows drawn: the row stands where it belongs.
const FocusSpacer = "focus";

/** Stands in for the rows a host is not laying out, so its scrollbar measures the whole collection. */
export function ensureSpacer(host: Element, position: string, height: number): void {
    let spacer = findSpacer(host, position);

    if (height <= 0) {
        spacer?.remove();
        return;
    }

    spacer ??= createSpacer(position);

    // Put back at its end every time, not only when created: a collection insert appends past an existing spacer.
    if (position === TopSpacer) {
        if (host.firstElementChild !== spacer)
            host.insertBefore(spacer, host.firstElementChild);
    }
    else if (host.lastElementChild !== spacer) {
        host.appendChild(spacer);
    }

    (spacer as HTMLElement).style.height = `${height}px`;
}

/** Among the host's own children rather than by a `:scope >` query, which walks every row's subtree. */
function findSpacer(host: Element, position: string): Element | null {
    for (const child of host.children) {
        if (child.getAttribute(WindowSpacerAttribute) === position)
            return child;
    }

    return null;
}

function createSpacer(position: string): Element {
    const spacer = document.createElement("div");

    spacer.setAttribute(WindowSpacerAttribute, position);
    // The shrink alone: an inline basis would seat a wrapping host's spacer beside the last row's tiles, not on a row of its own.
    spacer.style.flexShrink = "0";

    return spacer;
}

/**
 * The spacer between a row kept drawn out of range for the focus it holds and the rows drawn, sized, for the caller to place; null,
 * and none left on the host, where it stands for no row.
 */
export function focusSpacer(host: Element, height: number): Element | null {
    const spacer = findSpacer(host, FocusSpacer);

    if (height <= 0) {
        spacer?.remove();
        return null;
    }

    const sized = spacer ?? createSpacer(FocusSpacer);

    (sized as HTMLElement).style.height = `${height}px`;

    return sized;
}

/** The sizes measured so far, which the spacers' estimate of an unmeasured row is the mean of. */
export type RunningMean = {
    sum: number;
    count: number;
};

/** Counts a row's size once, however often it is measured again: a changed size replaces its `previous` one in the sum. */
export function addMeasured(mean: RunningMean, previous: number | null, size: number): void {
    if (previous === null) {
        mean.sum += size;
        mean.count++;
    }
    else {
        mean.sum += size - previous;
    }
}
