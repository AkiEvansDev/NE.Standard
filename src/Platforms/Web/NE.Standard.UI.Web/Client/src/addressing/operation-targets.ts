// Where a property's operation lands on a component, apart from how the component was found.

import { ComponentSelector } from "./dom-attributes.ts";
import type { WebDomOperation } from "../metadata/metadata-index.ts";

/** The elements an operation lands on: the component root, the element its selector names, or the caller's bound elements. */
export function resolveOperationElements(component: Element, operation: WebDomOperation, bound: () => Element[]): Element[] {
    const target = operation.target;

    if (target === "root")
        return [component];

    if (target !== null && target !== undefined && target.trim().length > 0) {
        // The root itself first, where the selector names it: an icon-only button's name lands on the button its tooltip names.
        if (component.matches(target))
            return [component];

        // The component's own part, not the first match under it: a grid's filter-band select has its own items host that must be skipped.
        for (const element of component.querySelectorAll<Element>(target)) {
            if (element.closest(ComponentSelector) === component)
                return [element];
        }

        return [];
    }

    return bound();
}
