// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { BindingAttributePrefix, IntoAttributePrefix, cssAttributeValue, toKebabCase } from "./dom-attributes.ts";
import type { DomRegistry } from "./dom-registry.ts";
import { resolveOperationElements } from "./operation-targets.ts";
import { getIdValue } from "../metadata/metadata-index.ts";
import type {
    MetadataIndex,
    UIPropertyAddress,
    WebDomOperation,
    WebRenderBindingMetadata,
    WebRenderPropertyDefinitionMetadata,
    WebRenderPropertyReferenceMetadata
} from "../metadata/metadata-index.ts";

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
    // The element a caller writes through its binding (`PropertyPatchEngine.writeBoundValue`): a target beside the binding's own.
    readonly boundElement?: Element;
};

/** An element and the binding it is written through. */
export type BoundElement = {
    readonly bindingId: number;
    readonly element: Element;
};

export class AddressResolver {
    // Built once per binding and per property, not on every push: a kebab-cased name is a regular expression run.
    private readonly bindingSelectors = new Map<number, string>();
    private readonly intoSelectors = new Map<string, string>();

    private readonly dom: DomRegistry;
    private readonly metadata: MetadataIndex;

    public constructor(dom: DomRegistry, metadata: MetadataIndex) {
        this.dom = dom;
        this.metadata = metadata;
    }

    public getBindingById(bindingId: number): WebRenderBindingMetadata | undefined {
        return this.metadata.getBindingById(bindingId);
    }

    public getPropertyName(propertyId: string): string | undefined {
        return this.metadata.getPropertyDefinition(propertyId)?.propertyName;
    }

    /** Whether a plain string written to the property is a key the page looks up (`MetadataIndex.isTranslatable`). */
    public isTranslatable(reference: WebRenderPropertyReferenceMetadata): boolean {
        return this.metadata.isTranslatable(reference);
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
        const bindingSelector = bindingId > 0 ? this.bindingSelector(bindingId, definition.propertyName) : null;

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
                property: definition.propertyName
            }
        }));
    }

    private bindingSelector(bindingId: number, propertyName: string): string {
        let selector = this.bindingSelectors.get(bindingId);

        if (selector === undefined) {
            selector = `[${BindingAttributePrefix}${toKebabCase(propertyName)}="${cssAttributeValue(bindingId)}"]`;
            this.bindingSelectors.set(bindingId, selector);
        }

        return selector;
    }

    /**
     * The property on one component element the caller holds — a part a package drew, perhaps one of several clones of a template.
     * Given a bound element, it lands where a push of the binding does and on that element; else on the marked or root element.
     */
    public resolvePropertyOn(component: Element, reference: WebRenderPropertyReferenceMetadata, bound?: BoundElement): ResolvedPropertyAddress | null {
        const componentId = getIdValue(reference.componentId);
        const definition = this.metadata.getPropertyDefinition(reference.propertyId);

        if (componentId <= 0 || definition === undefined)
            return null;

        return {
            componentId,
            propertyId: reference.propertyId,
            propertyName: definition.propertyName,
            dynamicParameters: [],
            component,
            definition,
            bindingId: bound?.bindingId ?? 0,
            bindingSelector: bound === undefined ? null : this.bindingSelector(bound.bindingId, definition.propertyName),
            boundElement: bound?.element,
            address: { component: { id: componentId, dynamicParameters: [] }, property: definition.propertyName }
        };
    }

    /** Every element the operation lands on, not the first: one property may be rendered onto several elements. */
    public resolveOperationTargets(resolved: ResolvedPropertyAddress, operation: WebDomOperation): Element[] {
        return resolveOperationElements(resolved.component, operation, () => {
            // An unbound property is patched only as a validation target, whose element the renderer marked; with neither mark, the root's.
            if (resolved.bindingSelector === null) {
                const into = resolved.component.querySelector<Element>(this.intoSelector(resolved.propertyName));

                return [into ?? resolved.component];
            }

            const elements = Array.from(resolved.component.querySelectorAll<Element>(resolved.bindingSelector));

            if (resolved.component.matches(resolved.bindingSelector))
                elements.unshift(resolved.component);

            // An element marked `data-ui-bind-value` for a property of another name carries no attribute of that name.
            if (resolved.boundElement !== undefined && !elements.includes(resolved.boundElement))
                elements.unshift(resolved.boundElement);

            return elements;
        });
    }

    private intoSelector(propertyName: string): string {
        let selector = this.intoSelectors.get(propertyName);

        if (selector === undefined) {
            selector = `[${IntoAttributePrefix}${toKebabCase(propertyName)}]`;
            this.intoSelectors.set(propertyName, selector);
        }

        return selector;
    }
}
