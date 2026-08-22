import { AddressResolver } from "../addressing/address-resolver";
import { ExtensionRegistry } from "../extensions/extension-registry";
import { WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { PropertyStateStore } from "../state/property-state-store";
import { DomOperationRegistry } from "./dom-operation-registry";

export type PropertyValueChange = {
    readonly reference: WebRenderPropertyReferenceMetadata;
    readonly propertyName: string;
    readonly dynamicParameters: readonly unknown[];
    readonly value: unknown;
    readonly local: boolean;
    /** The elements the patch landed on — empty when the component only exists inside an item template. */
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
            // A component that exists only inside an item template has no element until an item is cloned, and
            // the value below is exactly what that clone reads — so this is the designed path, not a failure.
            // Only a component that *is* on the page but whose instance did not match is worth reporting.
            if (this.addressResolver.hasRenderedComponent(reference)) {
                logWarn("property address could not be resolved.", {
                    reference,
                    dynamicParameters,
                    value,
                    local
                });
            }
        }
        else {
            // Converted once per operation rather than once per address: every resolved instance of the
            // same component shares one property definition, so the result is identical for all of them.
            for (const operation of resolvedAddresses[0].definition.operations) {
                const convertedValue = this.extensions.converters.convert(operation.converter, value);

                for (const resolved of resolvedAddresses) {
                    const target = this.addressResolver.resolveOperationTarget(resolved, operation);

                    if (target === null) {
                        logWarn("property operation target was not found.", {
                            reference,
                            operation
                        });
                        continue;
                    }

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

    private notifyValueChanged(change: PropertyValueChange): void {
        for (const handler of this.valueChangeHandlers)
            handler(change);
    }
}
