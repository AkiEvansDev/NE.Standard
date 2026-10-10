// A write on the page that hides what holds the focus — a message's × collapsing the message — leaves the browser to drop the focus
// to the body: Tab goes on from where it stood, but a screen reader is left nowhere. The focus is handed on instead: to the control
// that opened an editor put away, else to the next stop after what was hidden, else the one before it, else the content region;
// inside an open dialog, flyout, side drawer or other focus holder, within it.

import { RegionAttribute } from "../addressing/dom-attributes.ts";
import { KeyValueActionClass, KeyValueEditActionClass, KeyValueRowClass, KeyValueValueInputClass } from "./field-escape.ts";
import { FocusableSelector, FocusHolderSelector, focusAsLastInput, focusableUntilLeft, tabStops } from "./popup-focus.ts";

/** What holds the focus, the page's body aside: what a write about to run may hide. */
export function focusedElement(): Element | null {
    const active = document.activeElement;

    return active === null || active === document.body ? null : active;
}

/**
 * Hands the focus on from an element a write just hid while it held the focus; nothing while it is still shown, gone from the page,
 * or once something else has taken the focus (a popup giving it back to its opener). A `hidden` Visibility keeps its room and fades,
 * shown until the fade ends, when the browser drops the focus to the body: the focus is handed on then.
 */
export function handFocusOnIfHidden(focused: Element): HTMLElement | null {
    const active = document.activeElement;

    if (!focused.isConnected || (active !== focused && active !== document.body))
        return null;

    if (isShown(focused)) {
        afterFades(focused, () => handFocusOnIfHidden(focused));
        return null;
    }

    // The outermost of what is no longer shown: the component the write hid, not the button inside it that held the focus.
    let hidden = focused;

    while (hidden.parentElement !== null && !isShown(hidden.parentElement))
        hidden = hidden.parentElement;

    const target = editorOpenerOf(hidden) ?? nextStopAround(hidden) ?? contentRegion();

    if (target !== null)
        focusAsLastInput(target);

    return target;
}

function isShown(element: Element): boolean {
    return element.checkVisibility({ visibilityProperty: true });
}

/** Runs `then` once every visibility fade running on the element or around it has ended; nothing where none runs. */
function afterFades(element: Element, then: () => void): void {
    if (typeof document.getAnimations !== "function")
        return;

    const fades = document.getAnimations().filter(animation => isVisibilityFade(animation) && fadeTarget(animation)?.contains(element) === true);

    // A fade cut short (shown again before it ended) rejects: nothing is handed on.
    if (fades.length > 0)
        void Promise.all(fades.map(fade => fade.finished)).then(then, () => undefined);
}

function isVisibilityFade(animation: Animation): boolean {
    return (animation as Partial<CSSTransition>).transitionProperty === "visibility";
}

function fadeTarget(animation: Animation): Element | null {
    const effect = animation.effect as Partial<KeyframeEffect> | null;

    return effect?.target ?? null;
}

/**
 * A key-value row's editor put away — its Save answered, its Cancel pressed — gives the keyboard back to the row's Edit that opened it,
 * as `giveKeyboardBack` gives a field's to its holder; null for any other part.
 */
function editorOpenerOf(hidden: Element): HTMLElement | null {
    const row = hidden.closest(`.${KeyValueValueInputClass}, .${KeyValueEditActionClass}`)?.closest(`.${KeyValueRowClass}`) ?? null;
    const opener = row?.querySelector(`.${KeyValueActionClass}`)?.querySelector<HTMLElement>(FocusableSelector) ?? null;

    return opener !== null && isShown(opener) ? opener : null;
}

/** The first stop after the hidden element, else the last one before it, within the layer it stands in. */
function nextStopAround(hidden: Element): HTMLElement | null {
    const stops = tabStops(hidden.closest(FocusHolderSelector) ?? document, null).filter(stop => !hidden.contains(stop));
    const next = stops.find(stop => (hidden.compareDocumentPosition(stop) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0);
    const before = stops.filter(stop => (hidden.compareDocumentPosition(stop) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);

    return next ?? before[before.length - 1] ?? null;
}

/** The content region, focusable until the focus leaves it: where a page with no other stop keeps the reader. */
function contentRegion(): HTMLElement | null {
    const region = document.querySelector<HTMLElement>(`[${RegionAttribute}="content"]`);

    if (region === null)
        return null;

    focusableUntilLeft(region);

    return region;
}
