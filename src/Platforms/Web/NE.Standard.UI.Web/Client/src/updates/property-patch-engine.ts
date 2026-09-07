import { AddressResolver } from "../addressing/address-resolver";
import { ValueBindingAttribute } from "../addressing/dom-attributes";
import { clearElementValue } from "../extensions/value-readers";
import { ExtensionRegistry } from "../extensions/extension-registry";
import { WebRenderBindingMetadata, WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index";
import { logDebug, logWarn } from "../runtime/logger";
import { PropertyStateStore } from "../state/property-state-store";
import { DomOperationRegistry } from "./dom-operation-registry";

export type PropertyValueChange = {
    readonly reference: WebRenderPropertyReferenceMetadata;
    readonly propertyName: string;
    readonly dynamicParameters: readonly unknown[];
    readonly value: unknown;
    readonly local: boolean;
    /** The elements the patch landed on; empty when the component only exists inside an item template. */
    readonly components: readonly Element[];
};

export type PropertyValueChangeHandler = (change: PropertyValueChange) => void;

export class PropertyPatchEngine {
    private readonly valueChangeHandlers = new Set<PropertyValueChangeHandler>();

    public constructor(
        private readonly addressResolver: AddressResolver,
        private readonly operations: DomOperationRegistry,
        private readonly extensions: ExtensionRegistry,
        private readonly state: PropertyStateStore
    ) {
    }

    public addValueChangeHandler(handler: PropertyValueChangeHandler): () => void {
        this.valueChangeHandlers.add(handler);

        return () => this.valueChangeHandlers.delete(handler);
    }

    public applyPropertyValue(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown, local: boolean): void {
        const resolvedAddresses = this.addressResolver.resolveProperties(reference, dynamicParameters);

        if (resolvedAddresses.length === 0) {
            // Only worth reporting for a component that is on the page: one inside an item template has no element yet. And an
            // item-scoped patch names every template variant that reads the property, while the row is drawn by one of them —
            // the variants that do not draw this row have nothing to patch, which is not a fault.
            if (this.addressResolver.hasRenderedComponent(reference)) {
                const details = { reference, dynamicParameters, value, local };

                if (dynamicParameters.length > 0 && typeof (reference as WebRenderBindingMetadata).itemTemplate === "string")
                    logDebug("item-scoped property address names a template variant that does not draw this row.", details);
                else
                    logWarn("property address could not be resolved.", details);
            }
        }
        else {
            // Converted once per operation, not per address: every instance shares one property definition.
            for (const operation of resolvedAddresses[0].definition.operations) {
                const convertedValue = this.extensions.converters.convert(operation.converter, value);

                for (const resolved of resolvedAddresses) {
                    const targets = this.addressResolver.resolveOperationTargets(resolved, operation);

                    if (targets.length === 0) {
                        if (operation.optional !== true) {
                            logWarn("property operation target was not found.", {
                                reference,
                                operation
                            });
                        }

                        continue;
                    }

                    for (const target of targets) {
                        this.operations.apply({
                            resolved,
                            operation,
                            target,
                            value,
                            convertedValue,
                            local
                        });
                    }
                }
            }
        }

        if (!this.state.set(reference, dynamicParameters, value))
            return;

        this.notifyValueChanged({
            reference,
            propertyName: resolvedAddresses[0]?.propertyName ?? this.addressResolver.getPropertyName(reference.propertyId) ?? "",
            dynamicParameters,
            value,
            local,
            components: resolvedAddresses.map(resolved => resolved.component)
        });
    }

    /**
     * Puts an element's bound value back to what the server last pushed — the way home for a draft the reader let go of; a
     * value the server never pushed is cleared instead, since what the element shows was the reader's alone.
     */
    public restoreBoundValue(element: Element, dynamicParameters: readonly unknown[]): void {
        const binding = this.addressResolver.getBindingById(Number(element.getAttribute(ValueBindingAttribute)));

        if (binding === undefined)
            return;

        const reference: WebRenderPropertyReferenceMetadata = { componentId: binding.componentId, propertyId: binding.propertyId };

        if (this.state.has(reference, dynamicParameters))
            this.applyPropertyValue(reference, dynamicParameters, this.state.get(reference, dynamicParameters), false);
        else
            clearElementValue(element);
    }

    private notifyValueChanged(change: PropertyValueChange): void {
        for (const handler of this.valueChangeHandlers)
            handler(change);
    }
}
