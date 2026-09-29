// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import type { AddressResolver } from "../addressing/address-resolver.ts";
import { resolveOperationElements } from "../addressing/operation-targets.ts";
import { ComponentKeyAttribute, ComponentSelector, IntoAttributePrefix, ValueBindingAttribute, toKebabCase } from "../addressing/dom-attributes.ts";
import { readComponentId } from "../addressing/dom-registry.ts";
import { collectDynamicParameters, readParameterCount } from "../addressing/dynamic-parameters.ts";
import { clearElementValue } from "../extensions/value-readers.ts";
import type { ExtensionRegistry } from "../extensions/extension-registry.ts";
import type { WebRenderBindingMetadata, WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index.ts";
import { shownValue } from "../runtime/client-strings.ts";
import { isPhrase } from "../runtime/words.ts";
import { logDebug, logError, logWarn } from "../runtime/logger.ts";
import type { PropertyStateRow, PropertyStateStore } from "../state/property-state-store.ts";
import type { DomOperationRegistry } from "./dom-operation-registry.ts";

export type PropertyValueChange = {
    readonly reference: WebRenderPropertyReferenceMetadata;
    readonly propertyName: string;
    readonly dynamicParameters: readonly unknown[];
    /** The value as the page shows it: a key looked up, a phrase filled. */
    readonly value: unknown;
    readonly local: boolean;
    /** The elements the patch landed on; empty when the component only exists inside an item template. */
    readonly components: readonly Element[];
};

export type PropertyValueChangeHandler = (change: PropertyValueChange) => void;

export class PropertyPatchEngine {
    private readonly addressResolver: AddressResolver;
    private readonly operations: DomOperationRegistry;
    private readonly extensions: ExtensionRegistry;
    private readonly state: PropertyStateStore;
    private readonly valueChangeHandlers = new Set<PropertyValueChangeHandler>();

    // The value engine's, set once it exists: it is built after this engine, which half the page's engines need first.
    private isHeld: (target: Element) => boolean = () => false;
    private restoring = false;

    // Fields rather than parameter properties, which a type-stripping loader cannot run.
    public constructor(addressResolver: AddressResolver, operations: DomOperationRegistry, extensions: ExtensionRegistry, state: PropertyStateStore) {
        this.addressResolver = addressResolver;
        this.operations = operations;
        this.extensions = extensions;
        this.state = state;
    }

    /** Names the elements a pushed value must not be written into: fields holding an edit the server has not taken yet (docs/VALUES.md §4). */
    public setHeldTargets(isHeld: (target: Element) => boolean): void {
        this.isHeld = isHeld;
    }

    public addValueChangeHandler(handler: PropertyValueChangeHandler): () => void {
        this.valueChangeHandlers.add(handler);

        return () => this.valueChangeHandlers.delete(handler);
    }

    public applyPropertyValue(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown, local: boolean): void {
        const resolvedAddresses = this.addressResolver.resolveProperties(reference, dynamicParameters);
        // The words the value shows, looked up once, here; the state below keeps the value itself, so a switch can look it up again.
        const shown = this.shownValue(reference, value);
        let held = false;

        if (resolvedAddresses.length === 0) {
            // Reported only for a component on the page (a template's has no element yet); an item-scoped patch names every variant
            // reading the property, and those not drawing this row are no fault.
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
                const convertedValue = this.extensions.converters.convert(operation.converter, shown);

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
                        if (!local && !this.restoring && this.holdsProperty(target, reference.propertyId)) {
                            held = true;
                            continue;
                        }

                        this.operations.apply({
                            resolved,
                            operation,
                            target,
                            value: shown,
                            convertedValue,
                            local
                        });
                    }
                }
            }
        }

        // A restore changes no state but must still be heard; a held element hears nothing, or its editor would overwrite the reader's value.
        if ((!this.state.set(reference, dynamicParameters, value, rowsOf(resolvedAddresses[0]?.component)) && !this.restoring) || held)
            return;

        this.notifyValueChanged({
            reference,
            propertyName: resolvedAddresses[0]?.propertyName ?? this.addressResolver.getPropertyName(reference.propertyId) ?? "",
            dynamicParameters,
            value: shown,
            local,
            components: resolvedAddresses.map(resolved => resolved.component)
        });
    }

    private shownValue(reference: WebRenderPropertyReferenceMetadata, value: unknown): unknown {
        return shownValue(value, () => this.addressResolver.isTranslatable(reference));
    }

    /** Whether this push is the held edit: only the bound value; an element held with no binding holds every property. */
    private holdsProperty(target: Element, propertyId: string): boolean {
        if (!this.isHeld(target))
            return false;

        const bindingId = target.getAttribute(ValueBindingAttribute);
        const binding = bindingId === null ? undefined : this.addressResolver.getBindingById(Number(bindingId));

        // A read-only pushed mid-edit must still land.
        return binding === undefined || binding.propertyId === propertyId;
    }

    /**
     * Records a value the page already shows — one it sent, or the reader's edit — as the property's latest, telling no handler: the
     * server echoes none, and its old value pushed later would read as no change. The change it made, or null where the state held it.
     */
    public recordValue(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown): PropertyValueChange | null {
        const resolvedAddresses = this.addressResolver.resolveProperties(reference, dynamicParameters);

        if (!this.state.set(reference, dynamicParameters, value, rowsOf(resolvedAddresses[0]?.component)))
            return null;

        return {
            reference,
            propertyName: resolvedAddresses[0]?.propertyName ?? this.addressResolver.getPropertyName(reference.propertyId) ?? "",
            dynamicParameters,
            value: this.shownValue(reference, value),
            local: true,
            components: resolvedAddresses.map(resolved => resolved.component)
        };
    }

    /** Writes every recorded translatable value again in the table's language; the state is unchanged, so no handler hears it. */
    public rewriteWords(): void {
        for (const entry of [...this.state.entries()]) {
            const value = entry.value;
            const translatable = typeof value === "string"
                ? this.addressResolver.isTranslatable(entry.reference)
                : isPhrase(value);

            if (translatable)
                this.applyPropertyValue(entry.reference, entry.dynamicParameters, value, false);
        }
    }

    /** Writes a rendered value (a key or a phrase) on one component element in the table's language; unrecorded, since only its words changed. */
    public rewriteStatic(component: Element, reference: WebRenderPropertyReferenceMetadata, value: unknown): void {
        const resolved = this.addressResolver.resolvePropertyOn(component, reference);

        if (resolved === null)
            return;

        const shown = this.shownValue(reference, value);
        // The element the render marked for the value: the component's own, never a component's inside it of the same property.
        const marked = `[${IntoAttributePrefix}${toKebabCase(resolved.propertyName)}]`;

        for (const operation of resolved.definition.operations) {
            const convertedValue = this.extensions.converters.convert(operation.converter, shown);

            for (const target of resolveOperationElements(component, operation, () => ownMarkedElements(component, marked)))
                this.operations.apply({ resolved, operation, target, value: shown, convertedValue, local: true });
        }
    }

    /** Applies a property to one component element, not every element its id addresses: a part a package drew and keeps in step. */
    public applyToComponent(component: Element, reference: WebRenderPropertyReferenceMetadata, value: unknown): boolean {
        const resolved = this.addressResolver.resolvePropertyOn(component, reference);

        if (resolved === null)
            return false;

        // Local, and not recorded: the state a push restores from is the id's, not the element's.

        const shown = this.shownValue(reference, value);

        for (const operation of resolved.definition.operations) {
            const convertedValue = this.extensions.converters.convert(operation.converter, shown);

            for (const target of this.addressResolver.resolveOperationTargets(resolved, operation))
                this.operations.apply({ resolved, operation, target, value: shown, convertedValue, local: true });
        }

        this.notifyValueChanged({ reference, propertyName: resolved.propertyName, dynamicParameters: [], value: shown, local: true, components: [component] });
        return true;
    }

    /** Writes an element's bound value as a push would, on its component alone; false where no binding writes the element. */
    public writeBoundValue(element: Element, value: unknown): boolean {
        const binding = this.addressResolver.getBindingById(Number(element.getAttribute(ValueBindingAttribute)));
        const component = element.closest(ComponentSelector);

        if (binding === undefined || component === null)
            return false;

        return this.applyToComponent(component, { componentId: binding.componentId, propertyId: binding.propertyId }, value);
    }

    /** Puts an element's bound value back to what the server last pushed, or clears one it never pushed: a draft let go of. */
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
        // One handler that throws is logged and passed over: the others still hear the change, and the patch still lands.
        for (const handler of this.valueChangeHandlers) {
            try {
                handler(change);
            }
            catch (error) {
                logError("a value-change handler failed.", { change, error });
            }
        }
    }
}

/** The elements of a component marked for a property — itself, or its own parts — or the component where none is. */
function ownMarkedElements(component: Element, marked: string): Element[] {
    if (component.matches(marked))
        return [component];

    for (const element of component.querySelectorAll(marked)) {
        if (element.closest(ComponentSelector) === component)
            return [element];
    }

    return [component];
}

/** The rows an element stands in, innermost first, each named as a collection update addresses it; none for a static element. */
function rowsOf(element: Element | undefined): PropertyStateRow[] {
    const rows: PropertyStateRow[] = [];
    let row = element?.closest(`[${ComponentKeyAttribute}]`) ?? null;

    while (row !== null) {
        const owner = row.parentElement?.closest(ComponentSelector) ?? null;
        const host = owner === null ? 0 : readComponentId(owner);
        const key = row.getAttribute(ComponentKeyAttribute);

        if (owner !== null && host > 0 && key !== null)
            rows.push({ host, hostParameters: collectDynamicParameters(owner, readParameterCount(owner)), key });

        row = row.parentElement?.closest(`[${ComponentKeyAttribute}]`) ?? null;
    }

    return rows;
}
