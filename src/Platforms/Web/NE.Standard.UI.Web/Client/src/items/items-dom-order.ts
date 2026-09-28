// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import { WindowSpacerAttribute } from "../addressing/dom-attributes.ts";
import { TopSpacer } from "./items-spacers.ts";

/** Moves only what is out of place: re-inserting a node already in position still detaches it, blurring focus and waking observers. */
export function placeInOrder(host: Element, nodes: readonly Element[]): void {
    let expected: Element | null = host.firstElementChild;

    // The top spacer stands before the rows, not among them: measured against it, every row would be moved in front of it.
    if (expected !== null && expected.getAttribute(WindowSpacerAttribute) === TopSpacer)
        expected = expected.nextElementSibling;

    for (const node of nodes) {
        if (node !== expected)
            host.insertBefore(node, expected);

        expected = node.nextElementSibling;
    }
}
