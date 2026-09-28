// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { WindowSpacerAttribute } from "../addressing/dom-attributes.ts";

export const TopSpacer = "top";
export const BottomSpacer = "bottom";

/** Stands in for the rows a host is not laying out, so its scrollbar measures the whole collection. */
export function ensureSpacer(host: Element, position: string, height: number): void {
    let spacer = host.querySelector(`:scope > [${WindowSpacerAttribute}="${position}"]`);

    if (height <= 0) {
        spacer?.remove();
        return;
    }

    if (spacer === null) {
        spacer = document.createElement("div");
        spacer.setAttribute(WindowSpacerAttribute, position);
        // The shrink alone, not the basis: a wrapping host gives a spacer the whole row via its stylesheet, and an inline basis
        // would seat it beside the tiles in the last row and stretch that row to its height.
        (spacer as HTMLElement).style.flexShrink = "0";
    }

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
