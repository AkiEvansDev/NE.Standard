// Whether an element answers the reader at all: the one predicate every refusal reads, for a disabled, loading or read-only component.

import { ComponentIdAttribute, DisabledClass } from "../addressing/dom-attributes.ts";
import { BlockedSelector, isInert, isReadOnly } from "../addressing/dom-registry.ts";
import { writeRowIdle } from "../rendering/row-idle.ts";
import { isInSight } from "./element-visibility.ts";

export { isInert, isReadOnly } from "../addressing/dom-registry.ts";

/** A row's component matching the selector, where the row is not one itself: the template's root one or two levels down. */
function itemComponentSelector(matching: string): string {
    return `:scope > [${ComponentIdAttribute}]:is(${matching}), :scope > :not([${ComponentIdAttribute}]) > [${ComponentIdAttribute}]:is(${matching})`;
}

const ItemComponentSelector = itemComponentSelector(BlockedSelector);

// Built once per mark: a gesture reads the refusal of every row it walks.
const RefusalSelectors = new Map<string, string>();

/** Whether an item's row is disabled: the wrapper itself, or the component it wraps. */
export function isItemDisabled(wrapper: Element): boolean {
    return wrapper.matches(BlockedSelector) || wrapper.querySelector(ItemComponentSelector) !== null;
}

/**
 * Whether an item's row refuses a gesture by its mark (`Undraggable`, `Unselectable`, `Unremovable`, `Unrenamable`): on the wrapper,
 * the item's word, or on the component it wraps, the template's — either refusing wins.
 */
export function isItemRefused(wrapper: Element, attribute: string): boolean {
    if (wrapper.hasAttribute(attribute))
        return true;

    let selector = RefusalSelectors.get(attribute);

    if (selector === undefined) {
        selector = itemComponentSelector(`[${attribute}]`);
        RefusalSelectors.set(attribute, selector);
    }

    return wrapper.querySelector(selector) !== null;
}

/** Whether the keyboard can stand on an element: laid out, not natively disabled, not inside anything inert. */
export function isFocusable(element: Element): boolean {
    // A disabled component's root stays focusable — it says so and refuses the press; a roving list passes it over by itself.
    return element.getClientRects().length > 0 && !element.matches(":disabled") && element.closest("[inert]") === null;
}

/** Turns a control off the framework's way: the disabled mark and `aria-disabled`, which the refusals read, and its row's mark. */
export function setDisabled(element: Element, disabled: boolean): void {
    // Never the native `disabled`: it drops the focus, where this keeps the control's place for the keyboard and a screen reader.
    if (element.classList.contains(DisabledClass) !== disabled) {
        element.classList.toggle(DisabledClass, disabled);
        writeRowIdle(element);
    }

    if (disabled)
        element.setAttribute("aria-disabled", "true");
    else
        element.removeAttribute("aria-disabled");
}

/** The predicates, and the one mark, as a package reaches them on the plugin surface as `states`. */
export const componentStates = {
    isInert,
    isInSight,
    isReadOnly,
    setDisabled
} as const;
