// With extensions: the node test runner loads this module as is.
import { ComponentKeyAttribute, ComponentParameterCountAttribute, GroupAnchorAttribute, ItemsHostAttribute } from "./dom-attributes.ts";
import { logWarn } from "../metadata/logger.ts";

const logicalParents = new WeakMap<Element, Element>();

/** Gives a portaled element (an expanded field or its moved header action) the logical parent it left behind in the page's tree. */
export function setLogicalParent(element: Element, parent: Element | null): void {
    if (parent === null)
        logicalParents.delete(element);
    else
        logicalParents.set(element, parent);
}

/** The element's logical parent when portaled, else its DOM `parentElement`. */
export function logicalParentOf(element: Element): Element | null {
    return logicalParents.get(element) ?? element.parentElement;
}

/** `element.closest(selector)` walking across `logicalParentOf` boundaries when a subtree is portaled into a modal overlay. */
export function closestLogical<TElement extends Element = Element>(element: Element, selector: string): TElement | null {
    let current: Element | null = element;

    while (current !== null) {
        const matched = typeof current.matches === "function" ? current.matches(selector) : current.closest(selector) === current;

        if (matched)
            return current as TElement;

        current = logicalParentOf(current);
    }

    return null;
}

export function readParameterCount(element: Element): number {
    return readNumberAttribute(element, ComponentParameterCountAttribute);
}

export function collectDynamicParameters(element: Element, expectedCount: number): unknown[] {
    if (expectedCount <= 0)
        return [];

    const parameters: unknown[] = [];
    let current: Element | null = element;
    let host: Element | null = null;

    while (current !== null && parameters.length < expectedCount) {
        const parameter = readDynamicParameter(current);

        if (parameter !== undefined) {
            const own = closestLogical(current, ItemsHostSelector);

            if (own === null || own !== host)
                parameters.push(parameter);

            host = own;
        }

        current = logicalParentOf(current);
    }

    parameters.reverse();

    if (parameters.length !== expectedCount) {
        logWarn("dynamic parameter count mismatch.", {
            expectedCount,
            actualCount: parameters.length,
            element
        });
    }

    return parameters;
}

export function matchesDynamicParameters(element: Element, expectedParameters: readonly unknown[]): boolean {
    const actualCount = readParameterCount(element);

    if (actualCount !== expectedParameters.length)
        return false;

    if (actualCount === 0)
        return true;

    const actualParameters = collectDynamicParameters(element, actualCount);

    if (actualParameters.length !== expectedParameters.length)
        return false;

    for (let i = 0; i < expectedParameters.length; i++) {
        if (String(actualParameters[i] ?? "") !== String(expectedParameters[i] ?? ""))
            return false;
    }

    return true;
}

/** Whether the element's row keys begin with `expectedParameters`, outermost first, so an outer row addresses copies inside nested lists. */
export function startsWithDynamicParameters(element: Element, expectedParameters: readonly unknown[]): boolean {
    if (expectedParameters.length === 0)
        return true;

    const actualCount = readParameterCount(element);

    if (actualCount < expectedParameters.length)
        return false;

    const actualParameters = collectDynamicParameters(element, actualCount);

    if (actualParameters.length < expectedParameters.length)
        return false;

    for (let i = 0; i < expectedParameters.length; i++) {
        if (String(actualParameters[i] ?? "") !== String(expectedParameters[i] ?? ""))
            return false;
    }

    return true;
}

/** Whether the element's row keys end with `keys`, innermost last, so one in a template matches its inner part; no keys match all. */
export function endsWithDynamicParameters(element: Element, keys: readonly unknown[]): boolean {
    let index = keys.length - 1;
    let current: Element | null = element;
    let host: Element | null = null;

    while (current !== null && index >= 0) {
        const key = readDynamicParameter(current);

        if (key !== undefined) {
            const own = closestLogical(current, ItemsHostSelector);

            if (own === null || own !== host) {
                if (key !== String(keys[index] ?? ""))
                    return false;

                index--;
            }

            host = own;
        }

        current = logicalParentOf(current);
    }

    return index < 0;
}

export function readNumberAttribute(element: Element, name: string): number {
    const value = element.getAttribute(name);

    if (value === null || value.trim().length === 0)
        return 0;

    const result = Number(value);

    return Number.isInteger(result) ? result : 0;
}

// One key per list: a composite's cell and a menu's submenu repeat their row's key inside the row, under the row's own host, which
// a list nested in another's row would read twice (a submenu's list in a row's context menu, looked for under its entry's key twice).
const ItemsHostSelector = `[${ItemsHostAttribute}]`;

// Keys only: every item collection is keyed, so an element with no key introduces no scope; a positional fallback would misaddress.
// A group header stands in the row it is drawn from, as the server renders it.
function readDynamicParameter(element: Element): unknown {
    return element.getAttribute(ComponentKeyAttribute) ?? element.getAttribute(GroupAnchorAttribute) ?? undefined;
}
