// `node --test` loads this module as it is (the validation engine's test): `.ts` on the value imports.
import { ComponentIdAttribute, ComponentSelector, GroupHeaderAttribute, ensureElementId } from "./dom-attributes.ts";
import { collectDynamicParameters, matchesDynamicParameters, readNumberAttribute, readParameterCount } from "./dynamic-parameters.ts";

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

export class DomRegistry {
    public readonly root: ParentNode;

    private readonly componentsById = new Map<number, Element[]>();
    private readonly staticComponentsById = new Map<number, Element>();

    // A templated component's instances by row-key text, built per id on first keyed lookup: a filter would walk ancestors per row.
    private readonly keyedComponentsById = new Map<number, Map<string, Element[]>>();

    private stale = false;

    public constructor(root: ParentNode) {
        this.root = root;
        this.rebuild();
    }

    /** Marks the index as no longer matching the page; the rebuild happens on first use. */
    public invalidate(): void {
        this.stale = true;
    }

    public rebuild(): void {
        this.stale = false;

        this.componentsById.clear();
        this.staticComponentsById.clear();
        this.keyedComponentsById.clear();

        const elements = this.root.querySelectorAll<Element>(ComponentSelector);

        // Group headers stand for a bucket, not an item, and must stay out of the index or they answer to the anchor item's patches.
        const hasGroupHeaders = this.root.querySelector(`[${GroupHeaderAttribute}]`) !== null;

        for (const element of elements) {
            const componentId = readComponentId(element);

            if (componentId <= 0)
                continue;

            if (hasGroupHeaders && element.closest(`[${GroupHeaderAttribute}]`) !== null)
                continue;

            let bucket = this.componentsById.get(componentId);

            if (bucket === undefined) {
                bucket = [];
                this.componentsById.set(componentId, bucket);
            }

            bucket.push(element);

            if (!this.staticComponentsById.has(componentId) && isStaticComponentElement(element))
                this.staticComponentsById.set(componentId, element);
        }
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

        if (this.stale)
            this.rebuild();

        return [...this.componentsById.get(componentId) ?? []];
    }

    public findAllComponents(componentId: number, dynamicParameters: readonly unknown[]): Element[] {
        if (componentId <= 0)
            return [];

        if (this.stale)
            this.rebuild();

        if (dynamicParameters.length === 0) {
            const staticElement = this.staticComponentsById.get(componentId);
            return staticElement !== undefined ? [staticElement] : [...this.componentsById.get(componentId) ?? []];
        }

        const indexed = this.keyedComponents(componentId).get(parameterPathKey(dynamicParameters)) ?? [];

        // Checked against the page, since an engine may move a row without invalidating the index; a miss reads the instances as they stand.
        if (indexed.length > 0 && indexed.every(candidate => matchesDynamicParameters(candidate, dynamicParameters)))
            return [...indexed];

        const candidates = this.componentsById.get(componentId) ?? [];
        const found = candidates.filter(candidate => matchesDynamicParameters(candidate, dynamicParameters));

        if (indexed.length > 0)
            this.keyedComponentsById.delete(componentId);

        return found;
    }

    private keyedComponents(componentId: number): Map<string, Element[]> {
        let keyed = this.keyedComponentsById.get(componentId);

        if (keyed !== undefined)
            return keyed;

        keyed = new Map<string, Element[]>();

        for (const candidate of this.componentsById.get(componentId) ?? []) {
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

    public resolveNearestComponent(start: Element, predicate: (componentId: number, element: Element) => boolean): ComponentResolveResult | null {
        if (this.stale)
            this.rebuild();

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

function containsNode(root: ParentNode, node: Node): boolean {
    return root === node || (root instanceof Node && root.contains(node));
}
