import { ComponentKeyAttribute, ComponentParameterCountAttribute } from "./dom-attributes";
import { logWarn } from "../runtime/logger";

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

export function readNumberAttribute(element: Element, name: string): number {
    const value = element.getAttribute(name);

    if (value === null || value.trim().length === 0)
        return 0;

    const result = Number(value);

    return Number.isInteger(result) ? result : 0;
}

// Keys only: every item collection is keyed (docs/PROJECT.md §5), so an element that carries no key
// introduces no scope. A positional fallback here would send a number the binding model does not accept and
// would address the wrong item the moment the collection shifts.
function readDynamicParameter(element: Element): unknown | undefined {
    return element.getAttribute(ComponentKeyAttribute) ?? undefined;
}
