import { isPressWaveRecord } from "./press-wave.ts";

/** What an engine watches the document with when its answer to a mutation is to re-read whole components. */
export type SubtreeObserverInit = {
    readonly childList?: boolean;
    readonly characterData?: boolean;
    readonly attributeFilter?: readonly string[];
    /** Which records the engine answers at all; the rest are skipped before their components are looked for. Default: every one. */
    readonly relevant?: (mutation: MutationRecord) => boolean;
    /**
     * Whether nodes put in name only the component they landed in, else the components they are or hold — never the rest of the
     * host they joined: for an engine reading a component's own subtree alone, not its siblings or its host. Default: false.
     */
    readonly addedOnly?: boolean;
};

/** Past this many components in one batch, finding them costs more than sweeping the root for them. */
const SweepThreshold = 32;

export function observeComponents(root: ParentNode, selector: string, init: SubtreeObserverInit, handler: (components: Iterable<HTMLElement>) => void): MutationObserver | null {
    if (!(root instanceof Node))
        return null;

    const observer = new MutationObserver(mutations => {
        // A press's wave put in or taken out changes nothing a component is read for.
        const records = mutations.filter(mutation => !isPressWaveRecord(mutation) && (init.relevant?.(mutation) ?? true));
        const components = collectComponents(root, records, selector, init.addedOnly ?? false);

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

export function collectComponents(root: ParentNode, mutations: readonly MutationRecord[], selector: string, addedOnly = false): Set<HTMLElement> | null {
    const components = new Set<HTMLElement>();
    // A list's rows put in one by one are a record each on the same host: it is looked into once, not once a row.
    const searched = new Set<Element>();

    for (const mutation of mutations) {
        // A characterData record names the text node itself, which has no `closest` of its own.
        const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;

        if (target === null)
            continue;

        // A row put into a long list is that row's alone: every stamp of the list read again per row is the cost this spares.
        if (addedOnly && mutation.type === "childList" && target.closest(selector) === null) {
            collectAdded(mutation.addedNodes, selector, components);
            continue;
        }

        if (searched.has(target))
            continue;

        searched.add(target);

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

/** The components among nodes put in, and under them; a node gone again before the batch is read (drawn and dropped) is passed over. */
function collectAdded(nodes: NodeList, selector: string, components: Set<HTMLElement>): void {
    for (const node of nodes) {
        if (!(node instanceof Element) || !node.isConnected)
            continue;

        if (node instanceof HTMLElement && node.matches(selector))
            components.add(node);

        for (const component of node.querySelectorAll<HTMLElement>(selector))
            components.add(component);
    }
}

/** Whether a record happened inside a part (a tab's page) rather than elsewhere in its component, judged by the nearer of the two. */
export function happenedInside(mutation: MutationRecord, partSelector: string, rootSelector: string): boolean {
    const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;

    return target?.closest(`${partSelector}, ${rootSelector}`)?.matches(partSelector) === true;
}
