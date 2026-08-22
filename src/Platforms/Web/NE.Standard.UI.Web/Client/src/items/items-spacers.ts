import { WindowSpacerAttribute } from "../addressing/dom-attributes";

export const TopSpacer = "top";
export const BottomSpacer = "bottom";

/**
 * Stands in for the rows a host is not laying out, so its scrollbar measures the whole collection rather than
 * the part on screen. Shared by the two engines that leave rows out — the windowed one, whose missing rows
 * were never sent, and the virtualized one, whose missing rows are held but not laid out.
 */
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

    // Put back at its end every time, not only when it is created. Rows arrive through the ordinary collection
    // insert, which places an item by its index among the *items* — past the last one that means appending to
    // the host, which is behind a bottom spacer that is already there. The rows then sat after the stand-in for
    // the hundred thousand that were never sent, which is a hundred thousand rows further down the page: the
    // window held them, the offsets agreed, and the viewer scrolled through nothing.
    if (position === TopSpacer) {
        if (host.firstChild !== spacer)
            host.insertBefore(spacer, host.firstChild);
    }
    else if (host.lastChild !== spacer) {
        host.appendChild(spacer);
    }

    (spacer as HTMLElement).style.height = `${height}px`;
}
