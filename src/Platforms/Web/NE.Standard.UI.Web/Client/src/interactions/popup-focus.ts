// Focus into a popup and back out, and the one rule over every focus while the pointer was last: it is marked `data-ui-pointer-focus`,
// so no keyboard mark is drawn for it — but on an editable text entry, whose edge says where typing goes, as `:focus-visible` does.
// A key other than a modifier held alone, or the element losing the focus (but a list's current entry), takes the mark off. The
// focused element's ancestors up to its component root say whose the focus is (`data-ui-focus-within`), which a field's edge and a
// list's quiet read in place of a `:has()`: that made Chrome re-check the page on every focus.

import { ComponentIdAttribute, ComponentSelector, DialogSurfaceClass, FlyoutContentClass, FocusHolderAttribute, FocusWithinAttribute, NestedMenuClass, PointerFocusAttribute, RegionAttribute } from "../addressing/dom-attributes.ts";
import { readComponentId } from "../addressing/dom-registry.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { isCaretField } from "./caret-fields.ts";
import { isFocusable } from "./interactive-state.ts";
import { FieldBoxSelector } from "./own-control.ts";
import { applyRovingTabIndex, isRovingCandidate } from "./roving-focus.ts";
import { cellOf, rowKeyTarget, setRowFocus } from "./row-cursor.ts";
import { ownRows } from "./row-selection.ts";

/** A list's current entry, the keyboard's or the pointer's (`@ui-list-keyboard` frames it while it is not the pointer's). */
const ActiveEntryAttribute = "data-ui-active";

/** What counts as focusable, for every surface that opens a popup. */
export const FocusableSelector = [
    "a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])",
    "textarea:not([disabled])", "[tabindex]:not([tabindex=\"-1\"])"
].join(",");

// Held down on their own, these say nothing of which the reader is using: a Ctrl held for a Ctrl+click is still the pointer.
const ModifierKeys = new Set([
    "Shift", "Control", "Alt", "AltGraph", "Meta", "OS", "Hyper", "Super", "Fn", "FnLock", "Symbol", "SymbolLock", "CapsLock", "NumLock", "ScrollLock"
]);

// Whether the reader's last input was a press of the pointer rather than a key, whether that press was a finger's, and what held the
// focus as that press began.
let pointerLast = false;
let touchLast = false;
let focusedBeforePress: Element | null = null;

// Every element wearing the mark, the focused one or not (a search's current option): the first real key takes it off them all.
const marked = new Set<Element>();

// The ancestors wearing `data-ui-focus-within`, from the focused element's parent up to its component root.
let focusChain: readonly Element[] = [];

// The popups whose focus a pointer's opening took: the focus they give back is the pointer's too (restoreFocusTo).
const openedByPointer = new WeakSet<Element>();

// On the window, capturing: ahead of any engine that stops the press or the key before it reaches the document.
if (typeof window !== "undefined") {
    window.addEventListener("pointerdown", domEvent => notePress(domEvent.target, domEvent.pointerType), true);
    window.addEventListener("keydown", domEvent => noteKey(domEvent), true);
    // The focus event too, which comes before focusin: an element focused by a script after a press (a list taking its one tab stop
    // back) matched `:focus` unmarked in between, and a style read there started the keyboard row's wash, which then faded out.
    // Even this is late, since the browser reads the style once the focus has moved and before the event: a focus the framework
    // makes is marked ahead of it (focusAsLastInput), and a list marks the root a press is about to focus (ItemsSelectionEngine).
    window.addEventListener("focus", domEvent => noteFocus(domEvent.target), true);
    window.addEventListener("focusin", domEvent => noteFocus(domEvent.target), true);
    window.addEventListener("focusout", domEvent => noteBlur(domEvent), true);
}

/** Notes a press; one inside the focused element marks it here, since no focusin follows, or unmarks an editable entry. */
export function notePress(target: EventTarget | null, pointerType = ""): void {
    pointerLast = true;
    touchLast = pointerType === "touch";

    const active = document.activeElement;

    focusedBeforePress = active;

    if (active instanceof Element && active !== document.body && target instanceof Node && active.contains(target))
        markPointerFocus(active, !isEditableEntry(active));

    // A focused element taken off the page fires no focusout: its marks go at the next press or key.
    markFocusWithin(active);
}

/** A key makes the keyboard the last input and takes every mark off; a modifier held alone changes nothing. */
export function noteKey(domEvent: Event): void {
    if (domEvent instanceof KeyboardEvent && ModifierKeys.has(domEvent.key))
        return;

    pointerLast = false;

    for (const element of [...marked])
        markPointerFocus(element, false);

    markFocusWithin(document.activeElement);
}

/** A focus arriving while the pointer was the last input is the pointer's, but for an editable text entry. */
export function noteFocus(target: EventTarget | null): void {
    if (pointerLast && !isEditableEntry(target))
        markPointerFocus(target, true);

    if (target === document.activeElement)
        markFocusWithin(document.activeElement);
}

/**
 * The focus leaving an element takes its pointer's mark off; going nowhere, the marks around it follow once the script that moved it is
 * done: a list drawn again loses its focused entry and focuses the new one, and its marks stand through that rather than go and come back.
 */
export function noteBlur(domEvent: FocusEvent): void {
    // A list's current entry keeps it: a press outside takes the focus while the list fades out, and the entry would wear the keyboard's
    // frame through the fade. A key takes the mark off, as from every other element.
    if (!(domEvent.target instanceof Element && domEvent.target.hasAttribute(ActiveEntryAttribute)))
        markPointerFocus(domEvent.target, false);

    if (domEvent.relatedTarget === null)
        queueMicrotask(() => markFocusWithin(document.activeElement));
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

/** Whether the last input was a finger's press: a screen with no hover, where a long press stands for the right one. */
export function isTouchLast(): boolean {
    return pointerLast && touchLast;
}

/** Puts the pointer's mark on an element, or takes it off; for a current entry the keyboard does not stand on (a search's option). */
export function markPointerFocus(target: EventTarget | null, pointer: boolean): void {
    if (!(target instanceof Element))
        return;

    if (pointer) {
        // A finger alone never presses a key, which is what clears the marks: one on an element gone from the page goes here.
        for (const element of marked) {
            if (!element.isConnected)
                marked.delete(element);
        }

        marked.add(target);
    }
    else
        marked.delete(target);

    if (target.hasAttribute(PointerFocusAttribute) !== pointer)
        target.toggleAttribute(PointerFocusAttribute, pointer);

    if (target === document.activeElement)
        markFocusWithin(target);
}

/**
 * Marks the focused element's ancestors up to its component root `pointer` while it wears the pointer's mark and `keyboard` otherwise,
 * and takes the mark off those it no longer stands in; none for an editable entry, whose field's edge always shows. Only what changes is
 * written: Chrome re-styles a marked element's descendants that a rule reading it names.
 */
function markFocusWithin(focused: Element | null): void {
    const value = focused === null || focused === document.body || isEditableEntry(focused) ? null : focused.hasAttribute(PointerFocusAttribute) ? "pointer" : "keyboard";
    const chain = focused === null || value === null ? [] : focusWithinChain(focused);

    for (const element of focusChain) {
        if (!chain.includes(element))
            element.removeAttribute(FocusWithinAttribute);
    }

    for (const element of chain) {
        if (value !== null && element.getAttribute(FocusWithinAttribute) !== value)
            element.setAttribute(FocusWithinAttribute, value);
    }

    focusChain = chain;
}

/**
 * From an element's parent up to its component root, going on past a component that is part of another — a submenu's menu, one standing
 * in a field's box (a flyout, a split button beside the caret) — to that one's root; never the region or the body, whose whole content a
 * mark would re-style.
 */
function focusWithinChain(element: Element): Element[] {
    const chain: Element[] = [];

    for (let current = element.parentElement; current !== null && current !== document.body && !current.hasAttribute(RegionAttribute); current = current.parentElement) {
        chain.push(current);

        if (current.hasAttribute(ComponentIdAttribute) && !isPartOfAnother(current))
            break;
    }

    return chain;
}

function isPartOfAnother(component: Element): boolean {
    return component.classList.contains(NestedMenuClass) || (component.parentElement?.closest(FieldBoxSelector) ?? null) !== null;
}

/** Focuses an element without scrolling the page out from under the pointer, marked first if the pointer was last (the rule above). */
export function focusAsLastInput(element: HTMLElement): void {
    noteFocus(element);
    focusMarked(element);
}

/** Focuses an element with the marks around it already on, since the browser reads the style before the focus event. */
function focusMarked(element: HTMLElement): void {
    markFocusWithin(element);
    element.focus({ preventScroll: true });
    // An element that took no focus leaves the marks with what holds it.
    markFocusWithin(document.activeElement);
}

/** Gives an entry the focus the pointer moved onto it — a list's current entry following the pointer, as a native menu's does. */
export function focusByPointer(element: HTMLElement): void {
    markPointerFocus(element, true);
    focusMarked(element);
}

/** The first element inside a container the keyboard can stand on: focusable by its markup, laid out, and not inert. */
export function firstFocusable(container: ParentNode): HTMLElement | null {
    for (const candidate of container.querySelectorAll<HTMLElement>(FocusableSelector)) {
        if (isFocusable(candidate))
            return candidate;
    }

    return null;
}

/** The keyboard's reading of a package's container, on the plugin surface as `focus`. */
export const pluginFocus = {
    first: firstFocusable,
    stops: (container: ParentNode): HTMLElement[] => tabStops(container, document.activeElement),
    giveBack: (element: Element): void => giveKeyboardBack(element),
    trapTab
};

/**
 * The places Tab stands on inside a container, in order; the focused element counts even while it cannot take the focus anew. A
 * control taken out of the order (`tabindex="-1"`: a field's picker toggle, a roving list's other entries) is none.
 */
export function tabStops(container: ParentNode, active: Element | null): HTMLElement[] {
    const candidates = [...container.querySelectorAll<HTMLElement>(FocusableSelector)].filter(element => element === active || (element.tabIndex >= 0 && isFocusable(element)));
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

/** Keeps a Tab inside a modal layer — a dialog, a drawer over its backdrop — round from one end to the other; swallowed where it holds no stop. */
export function trapTab(container: HTMLElement, domEvent: KeyboardEvent): void {
    const stops = tabStops(container, document.activeElement);

    if (stops.length === 0) {
        // Nothing to move focus to, but the key is still swallowed or focus walks out of the layer.
        domEvent.preventDefault();
        return;
    }

    const target = wrappedTabStop(container, stops, document.activeElement, domEvent.shiftKey);

    if (target !== null) {
        domEvent.preventDefault();
        target.focus();
    }
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
export const FocusHolderSelector = `.${DialogSurfaceClass}, .${FlyoutContentClass}, [${FocusHolderAttribute}]`;

/** What takes the keyboard when a field lets go: the nearest dialog, flyout, marked holder, or row host whose own row holds it. */
export function focusHolderAround(element: Element): HTMLElement | null {
    const rowHost = rowKeyTarget(element)?.root ?? null;

    for (let current = element.parentElement; current !== null; current = current.parentElement) {
        if ((current === rowHost || current.matches(FocusHolderSelector)) && current.hasAttribute("tabindex") && isFocusable(current))
            return current;
    }

    return null;
}

/**
 * Gives the keyboard back from a field or an editor let go of to the holder around it, read before the let-go where that may take the
 * element off the page: a row host's cursor moves to the element's row, a grid's to its cell. Nothing moves where the focus already went
 * elsewhere; with no holder, Tab carries on from the element's place.
 */
export function giveKeyboardBack(element: Element, holder: HTMLElement | null = focusHolderAround(element)): void {
    const active = document.activeElement;

    if (holder?.isConnected !== true || (active !== null && active !== document.body))
        return;

    const found = rowKeyTarget(element);

    if (found?.root === holder && found.row !== null)
        setRowFocus(holder, ownRows(holder), found.row, cellOf(found.row, element));

    focusAsLastInput(holder);
}

/** Moves the focus into an opened popup — the named element, its first focusable, else the popup itself — and answers what held it, or null if it was inside. */
export function moveFocusInto(popup: HTMLElement, preferred?: HTMLElement | null): HTMLElement | null {
    if (popup.contains(document.activeElement))
        return null;

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const target = preferred ?? firstFocusable(popup);

    if (pointerLast)
        openedByPointer.add(popup);
    else
        openedByPointer.delete(popup);

    // The popup itself, named or for want of a control: focusable for it.
    if ((target === null || target === popup) && !popup.hasAttribute("tabindex"))
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

/** The page's components by id, through which an opener the page redrew away is found again. */
export type ComponentIndex = Pick<DomRegistry, "findEveryComponent">;

/** Where the focus goes back as a surface closes: the opener, the nearest focusable around it, or its component's root — never the body. */
export function liveFocusReturn(opener: HTMLElement | null | undefined, components: ComponentIndex | null = null): HTMLElement | null {
    // An opener the page redrew away is found again by its component; null where nothing of it is left.
    const live = opener === null || opener === undefined ? null : opener.isConnected ? opener : redrawnOpener(opener, components);

    for (let current = live; current !== null; current = current.parentElement) {
        if (current.matches(`${FocusableSelector}, [tabindex]`) && isFocusable(current))
            return current;
    }

    return live === null ? null : focusableComponentRoot(live);
}

/** The component on the page now standing where a redrawn opener's stood: its own, or the nearest one around it. */
function redrawnOpener(opener: HTMLElement, components: ComponentIndex | null): HTMLElement | null {
    if (components === null)
        return null;

    for (let component = opener.closest(ComponentSelector); component !== null; component = component.parentElement?.closest(ComponentSelector) ?? null) {
        // An id a template's rows share names no one element: the next component out is a surer place. The index may not have seen the
        // redraw yet, so only what is on the page counts.
        const matches = components.findEveryComponent(readComponentId(component)).filter(match => match.isConnected);

        if (matches.length === 1 && matches[0] instanceof HTMLElement)
            return matches[0];
    }

    return null;
}

function focusableComponentRoot(element: HTMLElement): HTMLElement | null {
    for (let component = element.closest<HTMLElement>(ComponentSelector); component !== null; component = component.parentElement?.closest<HTMLElement>(ComponentSelector) ?? null) {
        if (!isFocusable(component))
            continue;

        focusableUntilLeft(component);

        return component;
    }

    return null;
}

/** Makes an element the markup does not make focusable take the focus once: until the focus leaves it again. */
export function focusableUntilLeft(element: HTMLElement): void {
    if (element.hasAttribute("tabindex") || element.tabIndex >= 0)
        return;

    element.tabIndex = -1;

    // For the return alone: a root left focusable would take the focus of every press on its padding afterwards. Its own focusout
    // only, not one bubbling from a part of it — the menu inside it the focus is coming back from.
    const release = (domEvent: Event): void => {
        if (domEvent.target !== element)
            return;

        element.removeAttribute("tabindex");
        element.removeEventListener("focusout", release);
    };

    element.addEventListener("focusout", release);
}

/**
 * Puts focus back where it came from, but only while it is still inside what is closing. After a pointer's opening it goes back as the
 * pointer's, whatever key closed the popup: the reader moved no focus by the keyboard, so it brings up no tooltip and no keyboard mark.
 */
export function restoreFocusTo(target: HTMLElement | null | undefined, closing: HTMLElement): void {
    const active = document.activeElement;

    if (target === null || target === undefined || !closing.contains(active))
        return;

    if (wasOpenedByPointer(active, closing))
        markPointerFocus(target, !isEditableEntry(target));

    focusAsLastInput(target);
}

/** Whether the focus stands in a popup a pointer's opening gave it to, up to and including what is closing. */
function wasOpenedByPointer(active: Element | null, closing: HTMLElement): boolean {
    for (let current = active; current !== null; current = current === closing ? null : current.parentElement ?? null) {
        if (openedByPointer.has(current))
            return true;
    }

    return false;
}
