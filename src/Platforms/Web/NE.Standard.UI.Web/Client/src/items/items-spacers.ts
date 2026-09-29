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
        // The shrink alone: an inline basis would seat a wrapping host's spacer beside the last row's tiles, not on a row of its own.
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
