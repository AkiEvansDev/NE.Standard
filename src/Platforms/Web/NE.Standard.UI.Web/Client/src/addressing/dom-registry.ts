import { ComponentIdAttribute, ComponentSelector } from "./dom-attributes";
import { collectDynamicParameters, matchesDynamicParameters, readNumberAttribute, readParameterCount } from "./dynamic-parameters";

export type ComponentResolveResult = {
    readonly element: Element;
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
};

export class DomRegistry {
    private readonly componentsById = new Map<number, Element[]>();
    private readonly staticComponentsById = new Map<number, Element>();

    public constructor(public readonly root: ParentNode) {
        this.rebuild();
    }

    public rebuild(): void {
        this.componentsById.clear();
        this.staticComponentsById.clear();

        const elements = this.root.querySelectorAll<Element>(ComponentSelector);

        for (const element of elements) {
            const componentId = readComponentId(element);

            if (componentId <= 0)
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

    public findAllComponents(componentId: number, dynamicParameters: readonly unknown[]): Element[] {
        if (componentId <= 0)
            return [];

        if (dynamicParameters.length === 0) {
            const staticElement = this.staticComponentsById.get(componentId);
            return staticElement !== undefined ? [staticElement] : [...this.componentsById.get(componentId) ?? []];
        }

        const candidates = this.componentsById.get(componentId) ?? [];
        return candidates.filter(candidate => matchesDynamicParameters(candidate, dynamicParameters));
    }

    public resolveNearestComponent(start: Element, predicate: (componentId: number, element: Element) => boolean): ComponentResolveResult | null {
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
