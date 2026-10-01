// `.ts` on the value import: `node --test` runs this module directly.
import { EventBoundaryAttribute } from "../addressing/dom-attributes.ts";

/**
 * Whether an event from `target` stays on its own side of a boundary inside `component`: a menu entry, a split button's end, a tree
 * node's chevron or an open rename field never hands its event to the component holding it.
 */
export function isBehindEventBoundary(target: Element, component: Element): boolean {
    const boundary = target.closest(`[${EventBoundaryAttribute}]`);

    return boundary !== null && boundary !== component && component.contains(boundary);
}
