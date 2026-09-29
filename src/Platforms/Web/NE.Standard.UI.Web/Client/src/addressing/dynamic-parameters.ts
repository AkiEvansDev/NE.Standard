// With extensions: the node test runner loads this module as is.
import { ComponentKeyAttribute, ComponentParameterCountAttribute } from "./dom-attributes.ts";
import { logWarn } from "../runtime/logger.ts";

export function readParameterCount(element: Element): number {
    return readNumberAttribute(element, ComponentParameterCountAttribute);
}

export function collectDynamicParameters(element: Element, expectedCount: number): unknown[] {
    if (expectedCount <= 0)
        return [];

    const parameters: unknown[] = [];
    let current: Element | null = element;

    while (current !== null && parameters.length < expectedCount) {
        const parameter = readDynamicParameter(current);

        if (parameter !== undefined)
            parameters.push(parameter);

        current = current.parentElement;
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

/** Whether the element's row keys end with `keys`, innermost last, so one in a template matches its inner part; no keys match all. */
export function endsWithDynamicParameters(element: Element, keys: readonly unknown[]): boolean {
    let index = keys.length - 1;
    let current: Element | null = element;

    while (current !== null && index >= 0) {
        const key = readDynamicParameter(current);

        if (key !== undefined) {
            if (key !== String(keys[index] ?? ""))
                return false;

            index--;
        }

        current = current.parentElement;
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

// Keys only: every item collection is keyed, so an element with no key introduces no scope; a positional fallback would misaddress.
function readDynamicParameter(element: Element): unknown {
    return element.getAttribute(ComponentKeyAttribute) ?? undefined;
}
