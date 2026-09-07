import { BindingAttributePrefix, cssAttributeValue, toKebabCase } from "./dom-attributes";
import { DomRegistry } from "./dom-registry";
import {
    MetadataIndex,
    UIPropertyAddress,
    WebDomOperation,
    WebRenderBindingMetadata,
    WebRenderPropertyDefinitionMetadata,
    WebRenderPropertyReferenceMetadata,
    getIdValue
} from "../metadata/metadata-index";

export type ResolvedPropertyAddress = {
    readonly componentId: number;
    readonly propertyId: string;
    readonly propertyName: string;
    readonly dynamicParameters: readonly unknown[];
    readonly component: Element;
    readonly definition: WebRenderPropertyDefinitionMetadata;
    readonly address: UIPropertyAddress;
    readonly bindingId: number;
    readonly bindingSelector: string | null;
};

export class AddressResolver {
    public constructor(
        private readonly dom: DomRegistry,
        private readonly metadata: MetadataIndex
    ) {
    }

    public getBindingById(bindingId: number): WebRenderBindingMetadata | undefined {
        return this.metadata.getBindingById(bindingId);
    }

    public getPropertyName(propertyId: string): string | undefined {
        return this.metadata.getPropertyDefinition(propertyId)?.propertyName;
    }

    /** Whether the referenced component has any element on the page at all, regardless of which instance. */
    public hasRenderedComponent(reference: WebRenderPropertyReferenceMetadata): boolean {
        return this.dom.findAllComponents(getIdValue(reference.componentId), []).length > 0;
    }

    public resolveProperties(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[]): ResolvedPropertyAddress[] {
        const componentId = getIdValue(reference.componentId);
        const definition = this.metadata.getPropertyDefinition(reference.propertyId);

        if (componentId <= 0 || definition === undefined)
            return [];

        const components = this.dom.findAllComponents(componentId, dynamicParameters);

        if (components.length === 0)
            return [];

        const bindingId = getIdValue(this.metadata.getBindingByComponentAndPropertyId(componentId, reference.propertyId)?.bindingId);
        const bindingSelector = bindingId > 0
            ? `[${BindingAttributePrefix}${toKebabCase(definition.propertyName)}="${cssAttributeValue(bindingId)}"]`
            : null;

        return components.map(component => ({
            componentId,
            propertyId: reference.propertyId,
            propertyName: definition.propertyName,
            dynamicParameters,
            component,
            definition,
            bindingId,
            bindingSelector,
            address: {
                component: {
                    id: componentId,
                    dynamicParameters: [...dynamicParameters]
                },
                property: {
                    name: definition.propertyName
                }
            }
        }));
    }

    /** Every element the operation lands on, not the first: one property may be rendered onto several elements. */
    public resolveOperationTargets(resolved: ResolvedPropertyAddress, operation: WebDomOperation): Element[] {
        return resolveOperationElements(resolved.component, operation, () => {
            if (resolved.bindingSelector === null)
                return [resolved.component];

            const elements = Array.from(resolved.component.querySelectorAll<Element>(resolved.bindingSelector));

            if (resolved.component.matches(resolved.bindingSelector))
                elements.unshift(resolved.component);

            return elements;
        });
    }
}

/** The elements an operation lands on: the component root, the descendant it names, or the caller's bound elements. */
export function resolveOperationElements(component: Element, operation: WebDomOperation, bound: () => Element[]): Element[] {
    const target = operation.target;

    if (target === "root")
        return [component];

    if (target !== null && target !== undefined && target.trim().length > 0) {
        const element = component.querySelector<Element>(target);

        return element === null ? [] : [element];
    }

    return bound();
}
