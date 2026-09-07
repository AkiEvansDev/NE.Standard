/** The matching descendants that belong to this root rather than to one of the same kind nested inside it. */
export function ownDescendants(root: HTMLElement, selector: string, rootSelector: string): HTMLElement[] {
    const own: HTMLElement[] = [];

    for (const element of root.querySelectorAll<HTMLElement>(selector)) {
        if (element.closest(rootSelector) === root)
            own.push(element);
    }

    return own;
}
