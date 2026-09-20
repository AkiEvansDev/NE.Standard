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

    // The value engine's, set once it exists: it is built after this engine, which half the page's engines need first.
    private isHeld: (target: Element) => boolean = () => false;
    private restoring = false;

    public constructor(
        private readonly addressResolver: AddressResolver,
        private readonly operations: DomOperationRegistry,
        private readonly extensions: ExtensionRegistry,
        private readonly state: PropertyStateStore
    ) {
    }

    /** Names the elements a pushed value must not be written into: fields holding an edit their form has not sent (docs/VALUES.md §4). */
    public setHeldTargets(isHeld: (target: Element) => boolean): void {
        this.isHeld = isHeld;
    }

    public addValueChangeHandler(handler: PropertyValueChangeHandler): () => void {
        this.valueChangeHandlers.add(handler);

        return () => this.valueChangeHandlers.delete(handler);
    }

    public applyPropertyValue(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown, local: boolean): void {
        const resolvedAddresses = this.addressResolver.resolveProperties(reference, dynamicParameters);
        let held = false;

        if (resolvedAddresses.length === 0) {
            // Only worth reporting for a component that is on the page, since one inside an item template has no element yet. An
            // item-scoped patch names every template variant that reads the property, but only one draws this row — the rest
            // have nothing to patch, which is not a fault.
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
                        // Still recorded in the state below, so going back to the server's value finds the latest one.
                        if (!local && !this.restoring && this.isHeld(target)) {
                            held = true;
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
        }

        // A restore changes no state, but a component that redraws from a value change has to hear the value it shows now; a
        // held one hears nothing until let go, or its editor would overwrite the reader's value with the pushed one.
        if ((!this.state.set(reference, dynamicParameters, value) && !this.restoring) || held)
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
     * A value this client sent to the server, recorded as the property's latest, since the server doesn't echo it back to its
     * writer — without it, the server later pushing its old value would read as no change and never redraw.
     */
    public recordSentValue(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown): void {
        this.state.set(reference, dynamicParameters, value);
    }

    /**
     * Applies a property to one component element rather than every element its id addresses — for a part a package drew and
     * keeps in step itself. Local, and left out of the state a push restores from, since that state is the id's, not the element's.
     */
    public applyToComponent(component: Element, reference: WebRenderPropertyReferenceMetadata, value: unknown): boolean {
        const resolved = this.addressResolver.resolvePropertyOn(component, reference);

        if (resolved === null)
            return false;

        for (const operation of resolved.definition.operations) {
            const convertedValue = this.extensions.converters.convert(operation.converter, value);

            for (const target of this.addressResolver.resolveOperationTargets(resolved, operation))
                this.operations.apply({ resolved, operation, target, value, convertedValue, local: true });
        }

        this.notifyValueChanged({ reference, propertyName: resolved.propertyName, dynamicParameters: [], value, local: true, components: [component] });
        return true;
    }

    /**
     * Puts an element's bound value back to what the server last pushed — home for a draft the reader let go of; a value
     * the server never pushed is cleared instead, since what the element shows was the reader's alone.
     */
    public restoreBoundValue(element: Element, dynamicParameters: readonly unknown[]): void {
        const binding = this.addressResolver.getBindingById(Number(element.getAttribute(ValueBindingAttribute)));

        if (binding === undefined)
            return;

        const reference: WebRenderPropertyReferenceMetadata = { componentId: binding.componentId, propertyId: binding.propertyId };

        if (!this.state.has(reference, dynamicParameters)) {
            clearElementValue(element);
            return;
        }

        // A restore is the reader letting the edit go, so it is written even into a field that holds one.
        this.restoring = true;

        try {
            this.applyPropertyValue(reference, dynamicParameters, this.state.get(reference, dynamicParameters), false);
        }
        finally {
            this.restoring = false;
        }
    }

    private notifyValueChanged(change: PropertyValueChange): void {
        for (const handler of this.valueChangeHandlers)
            handler(change);
    }
}
