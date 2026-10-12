// `node --test` loads this module as it is (the validation engine's test): `.ts` on the value imports.
import { ComponentIdAttribute, ComponentSelector, GroupHeaderAttribute, ensureElementId } from "./dom-attributes.ts";
import { collectDynamicParameters, matchesDynamicParameters, readNumberAttribute, readParameterCount } from "./dynamic-parameters.ts";

const GroupHeaderSelector = `[${GroupHeaderAttribute}]`;

// Past this many subtrees changed without a lookup between, reading them one by one is no cheaper than reading the page once.
const MaxChangedScopes = 64;

// The fewest elements patches add before the ones taken off the page are dropped, so a small page does not sweep on every patch.
const MinPruneCount = 256;

export type ComponentResolveResult = {
    readonly element: Element;
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
};

/** The elements matching `selector` in the components given: each component itself when it matches, else the ones inside it. */
export function componentParts(components: Iterable<Element>, selector: string): HTMLElement[] {
    const parts: HTMLElement[] = [];

    for (const component of components) {
        if (component instanceof HTMLElement && component.matches(selector))
            parts.push(component);
        else
            parts.push(...component.querySelectorAll<HTMLElement>(selector));
    }

    return parts;
}

/**
 * The page's components by id. A change confined to one subtree (`invalidate(scope)`) is read on the next lookup from that subtree
 * alone; a lookup answers exactly what a rebuild over the page would, never an element taken off it.
 */
export class DomRegistry {
    public readonly root: ParentNode;

    // In document order once settled; may still hold an element taken off the page, which every lookup passes over.
    private readonly componentsById = new Map<number, Element[]>();
    private readonly staticComponentsById = new Map<number, Element>();

    // A templated component's instances by row-key text, built per id on first keyed lookup: a filter would walk ancestors per row.
    private readonly keyedComponentsById = new Map<number, Map<string, Element[]>>();

    // Every element the index holds, so reading a changed subtree again adds only what it has not seen.
    private readonly indexed = new Set<Element>();

    // The subtrees changed since the last lookup, and the ids a patch added to out of document order: both settled on demand.
    private readonly changedScopes = new Set<Element>();
    private readonly unsettledIds = new Set<number>();

    // Elements patches added since the index last dropped those taken off the page; past its size then, the next patch drops them.
    private patchedSincePrune = 0;
    private prunedSize = 0;

    private stale = false;

    public constructor(root: ParentNode) {
        this.root = root;
        this.rebuild();
    }

    /** Marks the index as no longer matching the page: the whole page, or only `scope`'s subtree, read again on first use. */
    public invalidate(scope?: Element): void {
        if (this.stale)
            return;

        if (scope === undefined || this.changedScopes.size >= MaxChangedScopes) {
            this.stale = true;
            this.changedScopes.clear();
            return;
        }

        this.changedScopes.add(scope);
    }

    public rebuild(): void {
        this.stale = false;

        this.componentsById.clear();
        this.staticComponentsById.clear();
        this.keyedComponentsById.clear();
        this.indexed.clear();
        this.changedScopes.clear();
        this.unsettledIds.clear();

        const elements = this.root.querySelectorAll<Element>(ComponentSelector);

        // Group headers stand for a bucket, not an item, and must stay out of the index or they answer to the anchor item's patches.
        const hasGroupHeaders = this.root.querySelector(GroupHeaderSelector) !== null;

        for (const element of elements) {
            const componentId = readComponentId(element);

            if (componentId <= 0)
                continue;

            if (hasGroupHeaders && element.closest(GroupHeaderSelector) !== null)
                continue;

            let bucket = this.componentsById.get(componentId);

            if (bucket === undefined) {
                bucket = [];
                this.componentsById.set(componentId, bucket);
            }

            bucket.push(element);
            this.indexed.add(element);

            if (!this.staticComponentsById.has(componentId) && isStaticComponentElement(element))
                this.staticComponentsById.set(componentId, element);
        }

        this.patchedSincePrune = 0;
        this.prunedSize = this.indexed.size;
    }

    public findComponent(componentId: number, dynamicParameters: readonly unknown[]): Element | null {
        return this.findAllComponents(componentId, dynamicParameters)[0] ?? null;
    }

    /** The element's own id, or one out of the page's single run of generated ids — what an `aria-` attribute points at. */
    public ensureId(element: Element, prefix: string): string {
        return ensureElementId(element, prefix);
    }

    /** The elements matching `selector` that a component addresses: itself when it matches, else the ones inside it. */
    public findComponentParts(componentId: number, dynamicParameters: readonly unknown[], selector: string): HTMLElement[] {
        return componentParts(this.findAllComponents(componentId, dynamicParameters), selector);
    }

    /** Every element of a component, a package's clones included, where `findAllComponents` answers a rowless one by its first alone. */
    public findEveryComponent(componentId: number): Element[] {
        if (componentId <= 0)
            return [];

        this.sync();

        return [...this.liveComponents(componentId)];
    }

    public findAllComponents(componentId: number, dynamicParameters: readonly unknown[]): Element[] {
        if (componentId <= 0)
            return [];

        this.sync();

        if (dynamicParameters.length === 0) {
            const staticElement = this.staticComponentsById.get(componentId);

            if (staticElement !== undefined && this.holds(staticElement) && !this.unsettledIds.has(componentId))
                return [staticElement];

            const live = this.liveComponents(componentId);
            const settled = this.staticComponentsById.get(componentId);

            return settled !== undefined ? [settled] : [...live];
        }

        const indexed = this.keyedComponents(componentId).get(parameterPathKey(dynamicParameters)) ?? [];

        // Checked against the page, since an engine may move a row without invalidating the index; a miss reads the instances as they stand.
        if (indexed.length > 0 && indexed.every(candidate => this.holds(candidate) && matchesDynamicParameters(candidate, dynamicParameters)))
            return [...indexed];

        const found = this.liveComponents(componentId).filter(candidate => matchesDynamicParameters(candidate, dynamicParameters));

        // A stale hit, or instances the map does not know (a row that took another key): it is built again at the next keyed lookup.
        if (indexed.length > 0 || found.length > 0)
            this.keyedComponentsById.delete(componentId);

        return found;
    }

    /** Brings the index level with the page before a lookup: a rebuild when it was marked whole, else the changed subtrees read. */
    private sync(): void {
        if (this.stale) {
            this.rebuild();
            return;
        }

        if (this.changedScopes.size === 0)
            return;

        for (const scope of this.changedScopes) {
            // A subtree taken off the page since took its components with it: the lookups pass them over.
            if (this.holds(scope))
                this.addComponentsIn(scope);
        }

        this.changedScopes.clear();

        if (this.patchedSincePrune > Math.max(this.prunedSize, MinPruneCount))
            this.prune();
    }

    /** Indexes the components of a changed subtree the index has not seen; the ones it holds stay where they are. */
    private addComponentsIn(scope: Element): void {
        // A subtree inside a group header holds nothing the index keeps.
        if (scope.closest(GroupHeaderSelector) !== null)
            return;

        const hasGroupHeaders = scope.querySelector(GroupHeaderSelector) !== null;

        if (scope.matches(ComponentSelector))
            this.addComponent(scope, false);

        for (const element of scope.querySelectorAll<Element>(ComponentSelector))
            this.addComponent(element, hasGroupHeaders);
    }

    private addComponent(element: Element, hasGroupHeaders: boolean): void {
        const componentId = readComponentId(element);

        if (componentId <= 0)
            return;

        // A row the subtree moved may stand in other rows now, and out of document order: settled on the id's next lookup. Its keyed
        // map stays: a lookup checks a hit against the page and drops the map on a miss, so one row read again does not cost every id
        // in the subtree its map.
        if (this.indexed.has(element)) {
            this.unsettledIds.add(componentId);
            return;
        }

        if (hasGroupHeaders && element.closest(GroupHeaderSelector) !== null)
            return;

        this.indexed.add(element);
        this.patchedSincePrune++;
        this.keyedComponentsById.delete(componentId);

        const bucket = this.componentsById.get(componentId);

        if (bucket === undefined) {
            this.componentsById.set(componentId, [element]);

            if (isStaticComponentElement(element))
                this.staticComponentsById.set(componentId, element);
        } else {
            bucket.push(element);
            this.unsettledIds.add(componentId);
        }
    }

    /** Drops every element taken off the page, for the ids no lookup has asked for since. */
    private prune(): void {
        for (const [componentId, bucket] of this.componentsById)
            this.settle(componentId, bucket);

        this.patchedSincePrune = 0;
        this.prunedSize = this.indexed.size;
    }

    /** An id's elements on the page, in document order. */
    private liveComponents(componentId: number): readonly Element[] {
        const bucket = this.componentsById.get(componentId);

        if (bucket === undefined)
            return [];

        this.settle(componentId, bucket);

        return bucket;
    }

    /** Drops a bucket's elements taken off the page, and puts it back in document order where a patch added to it. */
    private settle(componentId: number, bucket: Element[]): void {
        let kept = 0;

        for (let index = 0; index < bucket.length; index++) {
            const element = bucket[index];

            if (this.holds(element))
                bucket[kept++] = element;
            else
                this.indexed.delete(element);
        }

        const dropped = kept < bucket.length;
        const unsettled = this.unsettledIds.delete(componentId);

        if (dropped) {
            bucket.length = kept;
            this.keyedComponentsById.delete(componentId);
        }

        if (unsettled && !isInDocumentOrder(bucket))
            bucket.sort(compareDocumentOrder);

        if (bucket.length === 0) {
            this.componentsById.delete(componentId);
            this.staticComponentsById.delete(componentId);
        } else if (dropped || unsettled) {
            this.settleStatic(componentId, bucket);
        }
    }

    /** The id's first rowless element in document order, as a rebuild picks it. */
    private settleStatic(componentId: number, bucket: readonly Element[]): void {
        for (const element of bucket) {
            if (isStaticComponentElement(element)) {
                this.staticComponentsById.set(componentId, element);
                return;
            }
        }

        this.staticComponentsById.delete(componentId);
    }

    private keyedComponents(componentId: number): Map<string, Element[]> {
        let keyed = this.keyedComponentsById.get(componentId);

        if (keyed !== undefined)
            return keyed;

        keyed = new Map<string, Element[]>();

        for (const candidate of this.liveComponents(componentId)) {
            const count = readParameterCount(candidate);

            if (count === 0)
                continue;

            const parameters = collectDynamicParameters(candidate, count);

            if (parameters.length !== count)
                continue;

            const key = parameterPathKey(parameters);
            const bucket = keyed.get(key);

            if (bucket === undefined)
                keyed.set(key, [candidate]);
            else
                bucket.push(candidate);
        }

        this.keyedComponentsById.set(componentId, keyed);

        return keyed;
    }

    private holds(element: Element): boolean {
        return containsNode(this.root, element);
    }

    public resolveNearestComponent(start: Element, predicate: (componentId: number, element: Element) => boolean): ComponentResolveResult | null {
        this.sync();

        let current: Element | null = start;

        while (current !== null) {
            const component: Element | null = current.closest<Element>(ComponentSelector);

            if (component === null || !containsNode(this.root, component))
                return null;

            const componentId = readComponentId(component);

            if (componentId > 0 && predicate(componentId, component)) {
                const expectedCount = readParameterCount(component);

                return {
                    element: component,
                    componentId,
                    dynamicParameters: collectDynamicParameters(component, expectedCount)
                };
            }

            current = component.parentElement;
        }

        return null;
    }
}

export function readComponentId(element: Element): number {
    return readNumberAttribute(element, ComponentIdAttribute);
}

export function findOwningComponentId(element: Element): number | null {
    const owner = element.closest<Element>(ComponentSelector);
    const componentId = owner === null ? 0 : readComponentId(owner);

    return componentId > 0 ? componentId : null;
}

/** The component an element stands in, and the keys of the rows that component stands in — its address, as the server names it. */
export function findOwningComponentAddress(element: Element): { readonly componentId: number; readonly dynamicParameters: readonly unknown[] } | null {
    const owner = element.closest<Element>(ComponentSelector);
    const componentId = owner === null ? 0 : readComponentId(owner);

    return owner === null || componentId <= 0
        ? null
        : { componentId, dynamicParameters: collectDynamicParameters(owner, readParameterCount(owner)) };
}

// Parameters compare as text, as `matchesDynamicParameters` compares them: a key the server sends as a number is the DOM's digits.
function parameterPathKey(parameters: readonly unknown[]): string {
    return JSON.stringify(parameters.map(parameter => String(parameter ?? "")));
}

function isStaticComponentElement(element: Element): boolean {
    return readParameterCount(element) === 0;
}

function precedes(element: Element, other: Element): boolean {
    return (element.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

function compareDocumentOrder(left: Element, right: Element): number {
    return left === right ? 0 : precedes(left, right) ? -1 : 1;
}

function isInDocumentOrder(elements: readonly Element[]): boolean {
    for (let index = 1; index < elements.length; index++) {
        if (!precedes(elements[index - 1], elements[index]))
            return false;
    }

    return true;
}

function containsNode(root: ParentNode, node: Node): boolean {
    return root === node || (root instanceof Node && root.contains(node));
}
