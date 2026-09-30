// Focus into a popup and back out, and the one rule over every focus while the pointer was last: it is marked `data-ui-pointer-focus`,
// so no keyboard mark is drawn for it — but on an editable text entry, whose edge says where typing goes, as `:focus-visible` does.
// A key other than a modifier held alone, or the element losing the focus, takes the mark off.

import { ComponentIdAttribute, ComponentSelector, DialogSurfaceClass, FlyoutContentClass, FocusHolderAttribute, PointerFocusAttribute } from "../addressing/dom-attributes.ts";
import { isCaretField } from "./caret-fields.ts";
import { isFocusable } from "./interactive-state.ts";
import { applyRovingTabIndex, isRovingCandidate } from "./roving-focus.ts";
import { rowKeyTarget } from "./row-cursor.ts";

/** What counts as focusable, for every surface that opens a popup. */
export const FocusableSelector = [
    "a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])",
    "textarea:not([disabled])", "[tabindex]:not([tabindex=\"-1\"])"
].join(",");

// Held down on their own, these say nothing of which the reader is using: a Ctrl held for a Ctrl+click is still the pointer.
const ModifierKeys = new Set([
    "Shift", "Control", "Alt", "AltGraph", "Meta", "OS", "Hyper", "Super", "Fn", "FnLock", "Symbol", "SymbolLock", "CapsLock", "NumLock", "ScrollLock"
]);

// Whether the reader's last input was a press of the pointer rather than a key, and what held the focus as that press began.
let pointerLast = false;
let focusedBeforePress: Element | null = null;

// Every element wearing the mark, the focused one or not (a search's current option): the first real key takes it off them all.
const marked = new Set<Element>();

// On the window, capturing: ahead of any engine that stops the press or the key before it reaches the document.
if (typeof window !== "undefined") {
    window.addEventListener("pointerdown", domEvent => notePress(domEvent.target), true);
    window.addEventListener("keydown", domEvent => noteKey(domEvent), true);
    window.addEventListener("focusin", domEvent => noteFocus(domEvent.target), true);
    window.addEventListener("focusout", domEvent => markPointerFocus(domEvent.target, false), true);
}

/** Notes a press; one inside the focused element marks it here, since no focusin follows, or unmarks an editable entry. */
export function notePress(target: EventTarget | null): void {
    pointerLast = true;

    const active = document.activeElement;

    focusedBeforePress = active;

    if (active instanceof Element && active !== document.body && target instanceof Node && active.contains(target))
        markPointerFocus(active, !isEditableEntry(active));
}

/** A key makes the keyboard the last input and takes every mark off; a modifier held alone changes nothing. */
export function noteKey(domEvent: Event): void {
    if (domEvent instanceof KeyboardEvent && ModifierKeys.has(domEvent.key))
        return;

    pointerLast = false;

    for (const element of [...marked])
        markPointerFocus(element, false);
}

/** A focus arriving while the pointer was the last input is the pointer's, but for an editable text entry. */
export function noteFocus(target: EventTarget | null): void {
    if (pointerLast && !isEditableEntry(target))
        markPointerFocus(target, true);
}

/** Where typing goes: a caret field or a time segment the reader may change, or an editable region. */
function isEditableEntry(target: EventTarget | null): boolean {
    if (isCaretField(target))
        return !target.readOnly && !target.disabled;

    return target instanceof HTMLElement && (target.isContentEditable || (target.getAttribute("role") === "spinbutton" && target.getAttribute("aria-readonly") !== "true"));
}

/** What held the focus as the pointer's last press began, before the browser moved it; null once a key came after. */
export function focusBeforePress(): HTMLElement | null {
    // A right press on something that takes no focus drops it to the body before the context menu opens.
    return pointerLast && focusedBeforePress instanceof HTMLElement && focusedBeforePress !== document.body ? focusedBeforePress : null;
}

/** Whether the reader's last input was the pointer's: what a list asks before it draws the keyboard's mark on an entry. */
export function isPointerLast(): boolean {
    return pointerLast;
}

/** Puts the pointer's mark on an element, or takes it off; for a current entry the keyboard does not stand on (a search's option). */
export function markPointerFocus(target: EventTarget | null, pointer: boolean): void {
    if (!(target instanceof Element))
        return;

    if (pointer)
        marked.add(target);
    else
        marked.delete(target);

    if (target.hasAttribute(PointerFocusAttribute) !== pointer)
        target.toggleAttribute(PointerFocusAttribute, pointer);
}

/** Focuses an element without scrolling the page out from under the pointer; the focus rule above marks it if the pointer was last. */
export function focusAsLastInput(element: HTMLElement): void {
    element.focus({ preventScroll: true });
}

/** Gives an entry the focus the pointer moved onto it — a list's current entry following the pointer, as a native menu's does. */
export function focusByPointer(element: HTMLElement): void {
    markPointerFocus(element, true);
    element.focus({ preventScroll: true });
}

/** The first element inside a container the keyboard can stand on: focusable by its markup, laid out, and not inert. */
export function firstFocusable(container: ParentNode): HTMLElement | null {
    for (const candidate of container.querySelectorAll<HTMLElement>(FocusableSelector)) {
        if (isFocusable(candidate))
            return candidate;
    }

    return null;
}

/** The places Tab stands on inside a container, in order; the focused element counts even while it cannot take the focus anew. */
export function tabStops(container: ParentNode, active: Element | null): HTMLElement[] {
    const candidates = [...container.querySelectorAll<HTMLElement>(FocusableSelector)].filter(element => isFocusable(element) || element === active);
    const groups = new Map<string, HTMLElement>();

    // A radio group is one stop, as the browser walks it: its checked radio, or its first while none is.
    for (const candidate of candidates) {
        const name = radioName(candidate);

        if (name === null)
            continue;

        const stop = groups.get(name);

        if (stop === undefined || (!isChecked(stop) && isChecked(candidate)))
            groups.set(name, candidate);
    }

    return candidates.filter(candidate => {
        const name = radioName(candidate);

        return name === null || groups.get(name) === candidate;
    });
}

/** A radio's group name; null for anything else, and for a radio in no group, which is a stop of its own. */
function radioName(element: Element): string | null {
    return element instanceof HTMLInputElement && element.type === "radio" && element.name !== "" ? element.name : null;
}

function isChecked(element: HTMLElement): boolean {
    return element instanceof HTMLInputElement && element.checked;
}

/**
 * Where Tab goes in a modal layer when the browser's own move would leave it: round to the other end, or back in from outside —
 * the focus fallen to the page's body as its element was drawn again, or left there by a press on the layer's padding. Null where
 * the browser's move stays inside.
 */
export function wrappedTabStop(container: Element, stops: readonly HTMLElement[], active: Element | null, backwards: boolean): HTMLElement | null {
    const first = stops[0];
    const last = stops[stops.length - 1];

    if (active === null || !container.contains(active))
        return backwards ? last : first;

    if (!backwards && isSameStop(active, last))
        return first;

    return backwards && isSameStop(active, first) ? last : null;
}

function isSameStop(element: Element, stop: HTMLElement): boolean {
    return element === stop || (radioName(element) !== null && radioName(element) === radioName(stop));
}

// A layer that takes the keyboard back from a field in it: a dialog's surface, a flyout's panel, a layer a package marks. A mark
// rather than `role="application"`, which takes a screen reader out of browse mode for all inside.
const FocusHolderSelector = `.${DialogSurfaceClass}, .${FlyoutContentClass}, [${FocusHolderAttribute}]`;

/** What takes the keyboard when a field lets go: the nearest dialog, flyout, marked holder, or row host whose own row holds it. */
export function focusHolderAround(element: Element): HTMLElement | null {
    const rowHost = rowKeyTarget(element)?.root ?? null;

    for (let current = element.parentElement; current !== null; current = current.parentElement) {
        if ((current === rowHost || current.matches(FocusHolderSelector)) && current.hasAttribute("tabindex") && isFocusable(current))
            return current;
    }

    return null;
}

/** Moves the focus into an opened popup — the named element, its first focusable, else the popup itself — and answers what held it, or null if it was inside. */
export function moveFocusInto(popup: HTMLElement, preferred?: HTMLElement | null): HTMLElement | null {
    if (popup.contains(document.activeElement))
        return null;

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const target = preferred ?? firstFocusable(popup);

    if (target === null && !popup.hasAttribute("tabindex"))
        popup.tabIndex = -1;

    focusAsLastInput(target ?? popup);

    return previous;
}

/**
 * Moves the focus into a surface opened afresh (a dialog shown again) as `moveFocusInto` does, its scroll back at the start first and
 * the element taking the focus brought into view inside it; the page itself never scrolls for it.
 */
export function moveFocusIntoFromStart(surface: HTMLElement, preferred?: HTMLElement | null): HTMLElement | null {
    surface.scrollTop = 0;
    surface.scrollLeft = 0;

    const target = preferred ?? firstFocusable(surface);

    if (target !== null)
        revealWithin(surface, target);

    return moveFocusInto(surface, target);
}

/** Scrolls a box down by the least that shows an element inside it, or to the element's top where it is taller than the box. */
function revealWithin(box: Element, element: Element): void {
    const top = box.getBoundingClientRect().top + box.clientTop;
    const bottom = top + box.clientHeight;
    const rect = element.getBoundingClientRect();

    if (rect.bottom > bottom)
        box.scrollTop += Math.min(rect.bottom - bottom, rect.top - top);
}

/**
 * Gives an opened list the keyboard: a key's opening lights its first entry (its last for `fromEnd`); the pointer's lights none — the
 * list holds the focus with no entry a tab stop, so the first arrow enters at the near end, as a native menu's does.
 */
export function focusOpenedList(list: HTMLElement, entries: readonly HTMLElement[], fromEnd = false): void {
    if (pointerLast) {
        applyRovingTabIndex(entries, null);

        if (!list.hasAttribute("tabindex"))
            list.tabIndex = -1;

        focusAsLastInput(list);
        return;
    }

    const candidates = entries.filter(isRovingCandidate);
    const target = (fromEnd ? candidates[candidates.length - 1] : candidates[0]) ?? null;

    if (target === null)
        return;

    applyRovingTabIndex(entries, target);
    focusAsLastInput(target);
}

/** Where the focus goes back as a surface closes: the opener, the nearest focusable around it, or its component's root — never the body. */
export function liveFocusReturn(opener: HTMLElement | null | undefined, root: ParentNode = document): HTMLElement | null {
    // An opener the page redrew away is found again by its component; null where nothing of it is left.
    const live = opener === null || opener === undefined ? null : opener.isConnected ? opener : redrawnOpener(opener, root);

    for (let current = live; current !== null; current = current.parentElement) {
        if (current.matches(`${FocusableSelector}, [tabindex]`) && isFocusable(current))
            return current;
    }

    return live === null ? null : focusableComponentRoot(live);
}

/** The component on the page now standing where a redrawn opener's stood: its own, or the nearest one around it. */
function redrawnOpener(opener: HTMLElement, root: ParentNode): HTMLElement | null {
    for (let component = opener.closest(ComponentSelector); component !== null; component = component.parentElement?.closest(ComponentSelector) ?? null) {
        // An id a template's rows share names no one element: the next component out is a surer place.
        const matches = root.querySelectorAll<HTMLElement>(`[${ComponentIdAttribute}="${component.getAttribute(ComponentIdAttribute)}"]`);

        if (matches.length === 1)
            return matches[0];
    }

    return null;
}

function focusableComponentRoot(element: HTMLElement): HTMLElement | null {
    for (let component = element.closest<HTMLElement>(ComponentSelector); component !== null; component = component.parentElement?.closest<HTMLElement>(ComponentSelector) ?? null) {
        if (!isFocusable(component))
            continue;

        if (!component.hasAttribute("tabindex")) {
            component.tabIndex = -1;

            // For the return alone: a root left focusable would take the focus of every press on its padding afterwards. Its own
            // focusout only, not one bubbling from a part of it — the menu inside it the focus is coming back from.
            const release = (domEvent: Event): void => {
                if (domEvent.target !== component)
                    return;

                component.removeAttribute("tabindex");
                component.removeEventListener("focusout", release);
            };

            component.addEventListener("focusout", release);
        }

        return component;
    }

    return null;
}

/** Puts focus back where it came from, but only while it is still inside what is closing. */
export function restoreFocusTo(target: HTMLElement | null | undefined, closing: HTMLElement): void {
    if (target !== null && target !== undefined && closing.contains(document.activeElement))
        focusAsLastInput(target);
}
