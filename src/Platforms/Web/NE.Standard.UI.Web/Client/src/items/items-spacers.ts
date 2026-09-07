import { WindowSpacerAttribute } from "../addressing/dom-attributes";

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
        (spacer as HTMLElement).style.flex = "0 0 auto";
    }

    // Put back at its end every time, not only when created: a collection insert appends past an existing spacer.
    if (position === TopSpacer) {
        if (host.firstChild !== spacer)
            host.insertBefore(spacer, host.firstChild);
    }
    else if (host.lastChild !== spacer) {
        host.appendChild(spacer);
    }

    (spacer as HTMLElement).style.height = `${height}px`;
}
