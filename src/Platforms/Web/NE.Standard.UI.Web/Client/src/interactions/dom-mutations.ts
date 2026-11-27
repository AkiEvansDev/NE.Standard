import { registerRuntimeCleanup, withoutRuntimeCleanup } from "../runtime/cleanup-scope.ts";
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
    /** Called once for a batch that took nodes out of the tree, so an engine can drop state for elements gone from the page. */
    readonly removed?: () => void;
};

/** Low-level subtree mutation subscription sharing the root's single native `MutationObserver`. */
export type RawMutationSubscriptionInit = {
    readonly childList?: boolean;
    readonly characterData?: boolean;
    readonly attributes?: boolean;
    readonly attributeFilter?: readonly string[];
    /** When true, press-wave records are kept instead of filtered out once at the hub. Default: false. */
    readonly includePressWave?: boolean;
};

type HubSubscriber = {
    readonly childList: boolean;
    readonly characterData: boolean;
    readonly allAttributes: boolean;
    readonly attributeFilter: ReadonlySet<string> | null;
    readonly includePressWave: boolean;
    readonly dispatch: (records: readonly MutationRecord[], hasRemoved: boolean) => void;
};

/** Past this many components in one batch, finding them costs more than sweeping the root for them. */
const SweepThreshold = 32;

// One native MutationObserver per observed root, multiplexing all engines so Blink runs one record fan-out instead of 50+.
const hubs = new WeakMap<ParentNode, RootMutationHub>();

class RootMutationHub {
    private readonly root: ParentNode;
    public readonly ctor: typeof MutationObserver;
    private readonly subscribers = new Set<HubSubscriber>();
    private readonly observer: MutationObserver;
    private childList = false;
    private characterData = false;
    private allAttributes = false;
    private readonly attributeFilter = new Set<string>();
    private observing = false;

    public constructor(root: ParentNode, ctor: typeof MutationObserver) {
        this.root = root;
        this.ctor = ctor;
        this.observer = withoutRuntimeCleanup(() => new ctor(mutations => this.handleMutations(mutations)));
    }

    public add(subscriber: HubSubscriber): () => void {
        this.subscribers.add(subscriber);

        if (this.mergeOptions(subscriber) || !this.observing)
            this.reobserve();

        let active = true;

        return () => {
            if (!active)
                return;

            active = false;
            this.subscribers.delete(subscriber);

            if (this.subscribers.size === 0) {
                this.observer.disconnect?.();
                this.observing = false;

                if (hubs.get(this.root) === this)
                    hubs.delete(this.root);
            }
        };
    }

    private mergeOptions(subscriber: HubSubscriber): boolean {
        let grew = false;

        if (subscriber.childList && !this.childList) {
            this.childList = true;
            grew = true;
        }

        if (subscriber.characterData && !this.characterData) {
            this.characterData = true;
            grew = true;
        }

        if (subscriber.allAttributes && !this.allAttributes) {
            this.allAttributes = true;
            grew = true;
        }
        else if (!this.allAttributes && subscriber.attributeFilter !== null) {
            for (const attribute of subscriber.attributeFilter) {
                if (!this.attributeFilter.has(attribute)) {
                    this.attributeFilter.add(attribute);
                    grew = true;
                }
            }
        }

        return grew;
    }

    private reobserve(): void {
        // Drain queued records before disconnecting so late subscribers growing attributeFilter never drop pending mutations.
        const pending = this.observing ? (this.observer.takeRecords?.() ?? []) : [];

        if (this.observing)
            this.observer.disconnect?.();

        const attributes = this.allAttributes || this.attributeFilter.size > 0;
        const options: MutationObserverInit = {
            subtree: true,
            childList: this.childList,
            characterData: this.characterData,
            attributes,
            ...(!this.allAttributes && this.attributeFilter.size > 0 ? { attributeFilter: [...this.attributeFilter] } : {})
        };

        withoutRuntimeCleanup(() => this.observer.observe(this.root, options));
        this.observing = true;

        if (pending.length > 0)
            queueMicrotask(() => this.handleMutations(pending));
    }

    public flushNow(): void {
        const pending = this.observing ? (this.observer.takeRecords?.() ?? []) : [];

        if (pending.length > 0)
            this.handleMutations(pending);
    }

    private handleMutations(mutations: MutationRecord[]): void {
        if (this.subscribers.size === 0 || mutations.length === 0)
            return;

        const filtered: MutationRecord[] = [];
        const childList: MutationRecord[] = [];
        const characterData: MutationRecord[] = [];
        const allAttributes: MutationRecord[] = [];
        const unnamedAttributes: MutationRecord[] = [];
        const untyped: MutationRecord[] = [];
        const byAttribute = new Map<string, MutationRecord[]>();
        let hasRemoved = false;

        // Filter press-wave records and classify by mutation type/attribute once for every engine on this root.
        for (const mutation of mutations) {
            if (isPressWaveRecord(mutation))
                continue;

            filtered.push(mutation);

            if (mutation.type === "childList") {
                childList.push(mutation);

                if (!hasRemoved && mutation.removedNodes !== undefined && mutation.removedNodes.length > 0)
                    hasRemoved = true;
            }
            else if (mutation.type === "characterData") {
                characterData.push(mutation);
            }
            else if (mutation.type === "attributes") {
                allAttributes.push(mutation);

                const name = mutation.attributeName;

                if (typeof name === "string") {
                    let bucket = byAttribute.get(name);

                    if (bucket === undefined) {
                        bucket = [];
                        byAttribute.set(name, bucket);
                    }

                    bucket.push(mutation);
                }
                else {
                    unnamedAttributes.push(mutation);
                }
            }
            else {
                // Synthetic test records that omit `type` are forwarded to every subscriber on the hub.
                untyped.push(mutation);
            }
        }

        for (const subscriber of [...this.subscribers]) {
            if (!this.subscribers.has(subscriber))
                continue;

            const matched = selectRecordsFor(subscriber, mutations, filtered, childList, characterData, allAttributes, unnamedAttributes, untyped, byAttribute);

            if (matched.length === 0)
                continue;

            try {
                subscriber.dispatch(matched, hasRemoved);
            }
            catch {
                // Keep sibling engines receiving mutations even if one subscriber throws on a partial DOM.
            }
        }
    }
}

function selectRecordsFor(subscriber: HubSubscriber, raw: readonly MutationRecord[], filtered: readonly MutationRecord[], childList: readonly MutationRecord[], characterData: readonly MutationRecord[], allAttributes: readonly MutationRecord[], unnamedAttributes: readonly MutationRecord[], untyped: readonly MutationRecord[], byAttribute: ReadonlyMap<string, readonly MutationRecord[]>): readonly MutationRecord[] {
    if (subscriber.includePressWave)
        return raw;

    // Fast paths for single-channel subscribers (most engines watch only childList or only attributeFilter).
    const wantsAttr = subscriber.allAttributes || subscriber.attributeFilter !== null;

    if (untyped.length === 0) {
        if (subscriber.childList && !subscriber.characterData && !wantsAttr)
            return childList;

        if (!subscriber.childList && subscriber.characterData && !wantsAttr)
            return characterData;

        if (!subscriber.childList && !subscriber.characterData && subscriber.allAttributes)
            return allAttributes;

        if (!subscriber.childList && !subscriber.characterData && subscriber.attributeFilter !== null) {
            if (byAttribute.size === 0 && unnamedAttributes.length === 0)
                return [];

            if (subscriber.attributeFilter.size === 1 && unnamedAttributes.length === 0) {
                const only = subscriber.attributeFilter.values().next().value as string;

                return byAttribute.get(only) ?? [];
            }

            const matched: MutationRecord[] = [...unnamedAttributes];

            for (const name of subscriber.attributeFilter) {
                const bucket = byAttribute.get(name);

                if (bucket !== undefined)
                    matched.push(...bucket);
            }

            return matched;
        }
    }

    const matched: MutationRecord[] = [];

    for (const mutation of filtered) {
        if (mutation.type === "childList" && subscriber.childList)
            matched.push(mutation);
        else if (mutation.type === "characterData" && subscriber.characterData)
            matched.push(mutation);
        else if (mutation.type === "attributes" && (subscriber.allAttributes || typeof mutation.attributeName !== "string" || subscriber.attributeFilter?.has(mutation.attributeName) === true))
            matched.push(mutation);
        else if (mutation.type !== "childList" && mutation.type !== "characterData" && mutation.type !== "attributes")
            matched.push(mutation);
    }

    return matched;
}

function getOrCreateHub(root: ParentNode): RootMutationHub {
    let hub = hubs.get(root);

    if (hub === undefined || hub.ctor !== MutationObserver) {
        hub = new RootMutationHub(root, MutationObserver);
        hubs.set(root, hub);
    }

    return hub;
}

function createObserverHandle(dispose: () => void): MutationObserver {
    registerRuntimeCleanup(dispose);

    return {
        disconnect: dispose,
        observe: () => undefined,
        takeRecords: () => []
    };
}

/** Subscribes to subtree mutations on `root` through its shared `MutationObserver` multiplexer. */
export function observeMutations(root: ParentNode, init: RawMutationSubscriptionInit, handler: (records: readonly MutationRecord[]) => void): MutationObserver | null {
    if (!(root instanceof Node) || typeof MutationObserver !== "function")
        return null;

    const allAttributes = init.attributes === true && init.attributeFilter === undefined;
    const attributeFilter = init.attributeFilter !== undefined && init.attributeFilter.length > 0 ? new Set(init.attributeFilter) : null;
    const dispose = getOrCreateHub(root).add({
        childList: init.childList ?? false,
        characterData: init.characterData ?? false,
        allAttributes,
        attributeFilter,
        includePressWave: init.includePressWave ?? false,
        dispatch: records => handler(records)
    });

    return createObserverHandle(dispose);
}

export function observeComponents(root: ParentNode, selector: string, init: SubtreeObserverInit, handler: (components: Iterable<HTMLElement>) => void): MutationObserver | null {
    if (!(root instanceof Node) || typeof MutationObserver !== "function")
        return null;

    const wantsChildList = (init.childList ?? false) || init.removed !== undefined;
    const attributeFilter = init.attributeFilter !== undefined && init.attributeFilter.length > 0 ? new Set(init.attributeFilter) : null;
    const addedOnly = init.addedOnly ?? false;
    const dispose = getOrCreateHub(root).add({
        childList: wantsChildList,
        characterData: init.characterData ?? false,
        allAttributes: false,
        attributeFilter,
        includePressWave: false,
        dispatch: (matched, hasRemoved) => {
            const records = init.relevant === undefined ? matched : matched.filter(init.relevant);

            if (records.length === 0)
                return;

            const components = collectComponents(root, records, selector, addedOnly);

            if (components !== null)
                handler(components);

            if (init.removed !== undefined && hasRemoved && (init.relevant === undefined || records.some(mutation => mutation.type === "childList" && mutation.removedNodes.length > 0)))
                init.removed();
        }
    });

    return createObserverHandle(dispose);
}

/** Synchronously dispatches any queued `MutationObserver` records on `root` so newly mounted subtrees settle before focus. */
export function flushRootMutations(root: ParentNode): void {
    hubs.get(root)?.flushNow();
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
