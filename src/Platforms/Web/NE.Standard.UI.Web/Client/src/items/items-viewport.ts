// The element a host's rows are seen through. A host scrolls itself unless it says `data-ui-host-viewport="parent"`, in which
// case its parent scrolls (a wide table's root, so header and rows move together), and engines read the scroll there, in the
// host's own coordinates — a top of 0 is the host's first row.

import { HostViewportAttribute, ItemsHostAttribute } from "../addressing/dom-attributes";

/** Where the host's rows stand in their viewport. */
export type HostScroll = {
    /** How far the viewport has scrolled past the host's top; negative while the host is still below the top edge. */
    readonly top: number;
    /** The viewport's height. */
    readonly height: number;
    /** The height of everything the host holds. */
    readonly contentHeight: number;
};

export function viewportOf(host: Element): Element {
    return host.hasAttribute(HostViewportAttribute) ? host.parentElement ?? host : host;
}

/** The host a scroll event is about: the target itself, or the host the target scrolls for. */
export function hostOfScrollTarget(target: EventTarget | null): Element | null {
    if (!(target instanceof Element))
        return null;

    if (target.hasAttribute(ItemsHostAttribute))
        return target;

    return target.querySelector(`:scope > [${ItemsHostAttribute}][${HostViewportAttribute}]`);
}

export function readHostScroll(host: Element): HostScroll {
    const viewport = viewportOf(host);

    if (viewport === host)
        return { top: host.scrollTop, height: host.clientHeight, contentHeight: host.scrollHeight };

    return { top: viewport.scrollTop - hostOffset(host, viewport), height: viewport.clientHeight, contentHeight: host.scrollHeight };
}

/** Scrolls the host's viewport so that `top`, in the host's coordinates, is at the viewport's top edge. */
export function scrollHostTo(host: Element, top: number): void {
    const viewport = viewportOf(host);

    viewport.scrollTop = viewport === host ? top : top + hostOffset(host, viewport);
}

/** Where the host's top stands in the viewport's scroll range. */
function hostOffset(host: Element, viewport: Element): number {
    return host.getBoundingClientRect().top - viewport.getBoundingClientRect().top - viewport.clientTop + viewport.scrollTop;
}
