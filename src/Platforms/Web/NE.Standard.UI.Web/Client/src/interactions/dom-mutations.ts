/** What an engine watches the document with when its answer to a mutation is to re-read whole components. */
export type SubtreeObserverInit = {
    readonly childList?: boolean;
    readonly characterData?: boolean;
    readonly attributeFilter?: readonly string[];
};

/** Past this many components in one batch, finding them costs more than sweeping the root for them. */
const SweepThreshold = 32;

export function observeComponents(
    root: ParentNode,
    selector: string,
    init: SubtreeObserverInit,
    handler: (components: Iterable<HTMLElement>) => void
): MutationObserver | null {
    if (!(root instanceof Node))
        return null;

    const observer = new MutationObserver(mutations => {
        const components = collectComponents(root, mutations, selector);

        if (components !== null)
            handler(components);
    });

    observer.observe(root, {
        subtree: true,
        childList: init.childList ?? false,
        characterData: init.characterData ?? false,
        attributes: init.attributeFilter !== undefined,
        ...(init.attributeFilter === undefined ? {} : { attributeFilter: [...init.attributeFilter] })
    });

    return observer;
}

function collectComponents(root: ParentNode, mutations: readonly MutationRecord[], selector: string): Set<HTMLElement> | null {
    const components = new Set<HTMLElement>();

    for (const mutation of mutations) {
        // A characterData record names the text node itself, which has no `closest` of its own.
        const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;

        if (target === null)
            continue;

        // The component the change happened inside first; only a change above one has to be looked into.
        const owner = target.closest<HTMLElement>(selector);

        if (owner !== null) {
            components.add(owner);
            continue;
        }

        for (const component of target.querySelectorAll<HTMLElement>(selector))
            components.add(component);

        if (components.size > SweepThreshold)
            return new Set(root.querySelectorAll<HTMLElement>(selector));
    }

    return components.size === 0 ? null : components;
}
