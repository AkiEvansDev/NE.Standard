import { BindingAttributePrefix, cssAttributeValue, toKebabCase } from "./dom-attributes";
import { DomRegistry } from "./dom-registry";
import { MetadataIndex, UIPropertyAddress, WebDomOperation, WebRenderPropertyDefinitionMetadata, WebRenderPropertyReferenceMetadata, getIdValue } from "../metadata/metadata-index";

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

    public resolveOperationTarget(resolved: ResolvedPropertyAddress, operation: WebDomOperation): Element | null {
        const target = operation.target;

        if (target === "root")
            return resolved.component;

        if (target !== null && target !== undefined && target.trim().length > 0)
            return resolved.component.querySelector<Element>(target);

        if (resolved.bindingSelector !== null) {
            if (resolved.component.matches(resolved.bindingSelector))
                return resolved.component;

            return resolved.component.querySelector<Element>(resolved.bindingSelector);
        }

        return resolved.component;
    }
}
