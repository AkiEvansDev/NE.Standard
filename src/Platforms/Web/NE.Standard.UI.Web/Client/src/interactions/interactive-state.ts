// Whether an element answers the reader at all: the one predicate every refusal reads, for a disabled, loading or read-only component.

import { ComponentIdAttribute, DisabledClass, LoadingClass, ReadOnlyClass } from "../addressing/dom-attributes.ts";

/** What takes the reader's press away from everything inside it: a disabled or loading component, or anything inert. */
const BlockedSelector = `.${DisabledClass}, .${LoadingClass}, [inert]`;

/** A row's component, where the row is not one itself: the template's root one or two levels down. */
const ItemComponentSelector = `:scope > [${ComponentIdAttribute}]:is(${BlockedSelector}), :scope > :not([${ComponentIdAttribute}]) > [${ComponentIdAttribute}]:is(${BlockedSelector})`;

/** Whether an element takes no press, key or caret: itself disabled, or inside a component that is disabled, loading or inert. */
export function isInert(element: Element): boolean {
    return element.closest(BlockedSelector) !== null || element.matches(":disabled, [aria-disabled='true']");
}

/** Whether an item's row is disabled: the wrapper itself, or the component it wraps. */
export function isItemDisabled(wrapper: Element): boolean {
    return wrapper.matches(BlockedSelector) || wrapper.querySelector(ItemComponentSelector) !== null;
}

/** Whether the keyboard can stand on an element: laid out, not natively disabled, not inside anything inert. */
export function isFocusable(element: Element): boolean {
    // A disabled component's root stays focusable — it says so and refuses the press; a roving list passes it over by itself.
    return element.getClientRects().length > 0 && !element.matches(":disabled") && element.closest("[inert]") === null;
}

/** The nearer of an element's own component root and a read-only mark: an outer component's mark stops at the inner root. */
const ReadOnlyScopeSelector = `[${ComponentIdAttribute}], .${ReadOnlyClass}`;

/** Whether an element belongs to an input the reader may look at but not change, by its own component's mark. */
export function isReadOnly(element: Element): boolean {
    // Not an outer one's: a select in a read-only code field's status bar answers for itself.
    return element.closest(ReadOnlyScopeSelector)?.matches(`.${ReadOnlyClass}`) === true;
}

/** Turns a control off the framework's way: the disabled mark and `aria-disabled`, which the refusals read. */
function setDisabled(element: Element, disabled: boolean): void {
    // Never the native `disabled`: it drops the focus, where this keeps the control's place for the keyboard and a screen reader.
    if (element.classList.contains(DisabledClass) !== disabled)
        element.classList.toggle(DisabledClass, disabled);

    if (disabled)
        element.setAttribute("aria-disabled", "true");
    else
        element.removeAttribute("aria-disabled");
}

/** The predicates, and the one mark, as a package reaches them on the plugin surface as `states`. */
export const componentStates = {
    isInert,
    isReadOnly,
    setDisabled
} as const;
