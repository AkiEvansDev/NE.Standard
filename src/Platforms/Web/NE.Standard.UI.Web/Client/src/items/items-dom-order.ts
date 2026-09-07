/** Moves only what is out of place: re-inserting a node already in position still detaches it, blurring focus and waking observers. */
export function placeInOrder(host: Element, nodes: readonly Element[]): void {
    let expected: Element | null = host.firstElementChild;

    for (const node of nodes) {
        if (node !== expected)
            host.insertBefore(node, expected);

        expected = node.nextElementSibling;
    }
}
