// A write on the page that hides what holds the focus — a message's × collapsing the message — leaves the browser to drop the focus
// to the body: Tab goes on from where it stood, but a screen reader is left nowhere. The focus is handed on instead: to the next stop
// after what was hidden, else the one before it, else the content region; inside an open dialog or flyout, within it.

import { DialogSurfaceClass, FlyoutContentClass, RegionAttribute } from "../addressing/dom-attributes.ts";
import { focusAsLastInput, focusableUntilLeft, tabStops } from "./popup-focus.ts";

const LayerSelector = `.${DialogSurfaceClass}, .${FlyoutContentClass}`;

/** What holds the focus, the page's body aside: what a write about to run may hide. */
export function focusedElement(): Element | null {
    const active = document.activeElement;

    return active === null || active === document.body ? null : active;
}

/**
 * Hands the focus on from an element a write just hid while it held the focus; nothing while it is still shown, gone from the page,
 * or once something else has taken the focus (a popup giving it back to its opener).
 */
export function handFocusOnIfHidden(focused: Element): HTMLElement | null {
    const active = document.activeElement;

    if (!focused.isConnected || (active !== focused && active !== document.body) || isShown(focused))
        return null;

    // The outermost of what is no longer shown: the component the write hid, not the button inside it that held the focus.
    let hidden = focused;

    while (hidden.parentElement !== null && !isShown(hidden.parentElement))
        hidden = hidden.parentElement;

    const target = nextStopAround(hidden) ?? contentRegion();

    if (target !== null)
        focusAsLastInput(target);

    return target;
}

function isShown(element: Element): boolean {
    return element.checkVisibility({ visibilityProperty: true });
}

/** The first stop after the hidden element, else the last one before it, within the layer it stands in. */
function nextStopAround(hidden: Element): HTMLElement | null {
    const stops = tabStops(hidden.closest(LayerSelector) ?? document, null).filter(stop => !hidden.contains(stop));
    const next = stops.find(stop => (hidden.compareDocumentPosition(stop) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0);
    const before = stops.filter(stop => (hidden.compareDocumentPosition(stop) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);

    return next ?? before[before.length - 1] ?? null;
}

/** The content region, focusable until the focus leaves it, as the skip link makes it: where a page with no other stop keeps the reader. */
function contentRegion(): HTMLElement | null {
    const region = document.querySelector<HTMLElement>(`[${RegionAttribute}="content"]`);

    if (region === null)
        return null;

    focusableUntilLeft(region);

    return region;
}
