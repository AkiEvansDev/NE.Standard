// A bound tab as the tabs view's items host holds it: in a wrapper of its own, or bare, and what it refuses read off both.

// With its extensions: the node test runner loads this module as it is.
import { ItemsHostAttribute } from "../addressing/dom-attributes.ts";
import { isItemRefused } from "./interactive-state.ts";

/** A tab's own element: what the strip's engine reads and the tab's events are raised on. */
export const TabItemClass = "ui-tab-item";

/** The items host's child that holds a tab: the tab itself when nothing wraps it, else its wrapper. */
export function rowOf(item: HTMLElement): HTMLElement {
    const parent = item.parentElement;

    return parent !== null && !parent.hasAttribute(ItemsHostAttribute) && parent.closest(`[${ItemsHostAttribute}]`) === parent.parentElement
        ? parent
        : item;
}

/** The items host of the strip a tab stands in; null for anything but a tab. */
export function stripHostOf(target: EventTarget | null): Element | null {
    return target instanceof HTMLElement && target.classList.contains(TabItemClass) ? rowOf(target).parentElement : null;
}

/** Whether a tab refuses a gesture by its mark: on its wrapper, the item's word, or on the tab itself, its template's. */
export function isTabRefused(item: HTMLElement, attribute: string): boolean {
    return isItemRefused(rowOf(item), attribute);
}
