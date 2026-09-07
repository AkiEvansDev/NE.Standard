import { ComponentIdAttribute, ComponentSelector, GroupHeaderAttribute } from "./dom-attributes";
import { collectDynamicParameters, matchesDynamicParameters, readNumberAttribute, readParameterCount } from "./dynamic-parameters";

export type ComponentResolveResult = {
    readonly element: Element;
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
};

export class DomRegistry {
    public readonly root: ParentNode;

    private readonly componentsById = new Map<number, Element[]>();
    private readonly staticComponentsById = new Map<number, Element>();

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

    /** The elements matching `selector` that a component addresses: itself when it matches, else the ones inside it. */
    public findComponentParts(componentId: number, dynamicParameters: readonly unknown[], selector: string): HTMLElement[] {
        const parts: HTMLElement[] = [];

        for (const component of this.findAllComponents(componentId, dynamicParameters)) {
            if (component instanceof HTMLElement && component.matches(selector))
                parts.push(component);
            else
                parts.push(...component.querySelectorAll<HTMLElement>(selector));
        }

        return parts;
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

        const candidates = this.componentsById.get(componentId) ?? [];
        return candidates.filter(candidate => matchesDynamicParameters(candidate, dynamicParameters));
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

function isStaticComponentElement(element: Element): boolean {
    return readParameterCount(element) === 0;
}

function containsNode(root: ParentNode, node: Node): boolean {
    return root === node || (root instanceof Node && root.contains(node));
}
