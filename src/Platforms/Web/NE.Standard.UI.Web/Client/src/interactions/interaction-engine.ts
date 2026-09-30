// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { matchesDynamicParameters } from "../addressing/dynamic-parameters.ts";
import type { EffectRegistry } from "../effects/effect-registry.ts";
import type { ValueReaderRegistry } from "../extensions/value-readers.ts";
import { getIdValue, getInteractionActionKind } from "../metadata/metadata-index.ts";
import type {
    ClientEffect,
    MetadataIndex,
    TargetedClientEffect,
    WebRenderInteractionMetadata,
    WebRenderPropertyReferenceMetadata
} from "../metadata/metadata-index.ts";
import { logWarn } from "../runtime/logger.ts";
import { areValuesEqual } from "../state/value-equality.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine.ts";
import { ValueSyncEventNames, resolveWritableBinding } from "../updates/value-binding-engine.ts";
import type { InteractionEvaluator } from "./interaction-evaluator.ts";
import type { InteractionIndex } from "./interaction-index.ts";

export type InteractionEventContext = {
    readonly name: string;
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
    readonly domEvent: Event;
};

export type InteractionEngineOptions = {
    readonly root?: ParentNode;
    readonly effects: EffectRegistry;
    readonly dom: DomRegistry;
    readonly metadata: Pick<MetadataIndex, "getBindingById">;
    /** Reads a field the reader edited, as its binding would send it. */
    readonly valueReaders: Pick<ValueReaderRegistry, "readBound">;
    /** Where a value an event interaction wrote goes next: to the server, when the property is bound to write back. */
    readonly writeBack?: (target: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown) => void;
};

export class InteractionEngine {
    private readonly index: InteractionIndex;
    private readonly propertyPatchEngine: PropertyPatchEngine;
    private readonly evaluator: InteractionEvaluator;
    private readonly options: InteractionEngineOptions;
    private applyDepth = 0;

    // The value each source's rules last ran for, by source and row. A debounced field raises `change` at the reader's pause and the
    // browser raises its own when the reader leaves, with the same value: one edit, run once. A push moving the source resets it,
    // so the reader typing the old value again after it still runs.
    private readonly heard = new Map<string, unknown>();

    // Fields rather than parameter properties, which a type-stripping loader cannot run.
    public constructor(index: InteractionIndex, propertyPatchEngine: PropertyPatchEngine, evaluator: InteractionEvaluator, options: InteractionEngineOptions) {
        this.index = index;
        this.propertyPatchEngine = propertyPatchEngine;
        this.evaluator = evaluator;
        this.options = options;
        this.propertyPatchEngine.addValueChangeHandler(change => this.applyPropertyInteractions(change));

        // The reader's own edit is never pushed back (docs/VALUES.md §3), so a rule reading the field hears it here, as it happens.
        const root = options.root ?? document;

        for (const eventName of ValueSyncEventNames)
            root.addEventListener(eventName, domEvent => this.applyEditedValue(domEvent), true);
    }

    public hasEvent(name: string): boolean {
        return this.index.hasEvent(name);
    }

    public hasEventForComponent(name: string, componentId: number): boolean {
        return this.index.hasEventForComponent(name, componentId);
    }

    public applyEvent(context: InteractionEventContext): void {
        const interactions = this.index.getEventInteractions(context.componentId, context.name);

        for (const interaction of interactions)
            this.applyInteraction(interaction, context.dynamicParameters, true);
    }

    /** Runs the rules reading the field the reader changed, with the value it now holds; a bound field is sent on by the value engine. */
    private applyEditedValue(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const resolved = this.options.dom.resolveNearestComponent(domEvent.target, () => true);

        if (resolved === null)
            return;

        const writable = resolveWritableBinding(domEvent.target, this.options.metadata);
        let interactions: readonly WebRenderInteractionMetadata[];

        if (writable === null)
            interactions = this.index.getValueInteractions(resolved.componentId);
        else if (writable.binding === undefined)
            return;
        else
            interactions = this.index.getPropertyInteractions(getIdValue(writable.binding.componentId), writable.binding.propertyId);

        if (interactions.length === 0)
            return;

        const value = this.options.valueReaders.readBound(domEvent.target);
        const key = sourceKey(interactions[0].source, resolved.dynamicParameters);

        if (this.heard.has(key) && areValuesEqual(this.heard.get(key), value))
            return;

        this.heard.set(key, value);

        // Written back where the target binds so: the page changed that state itself, as an event interaction does.
        for (const interaction of interactions)
            this.applyInteraction(interaction, resolved.dynamicParameters, true, value);
    }

    private applyPropertyInteractions(change: PropertyValueChange): void {
        if (this.applyDepth > 8) {
            logWarn("interaction chain depth limit exceeded.", {
                componentId: getIdValue(change.reference.componentId),
                propertyId: change.reference.propertyId
            });

            return;
        }

        const interactions = this.index.getPropertyInteractions(
            getIdValue(change.reference.componentId),
            change.reference.propertyId
        );

        if (interactions.length > 0)
            this.heard.set(sourceKey(change.reference, change.dynamicParameters), change.value);

        for (const interaction of interactions)
            this.applyInteraction(interaction, change.dynamicParameters, false, change.value);
    }

    private applyInteraction(
        interaction: WebRenderInteractionMetadata,
        dynamicParameters: readonly unknown[],
        local: boolean,
        sourceValue: unknown = true
    ): void {
        if (getInteractionActionKind(interaction.actionKind) === "Effect") {
            this.applyEffectInteraction(interaction, dynamicParameters, sourceValue);
            return;
        }

        const target = interaction.target;

        if (!isValidTarget(target))
            return;

        const nextValue = this.evaluator.evaluate(interaction, sourceValue);

        this.applyDepth++;

        try {
            this.propertyPatchEngine.applyPropertyValue(target, dynamicParameters, nextValue, local);
        }
        finally {
            this.applyDepth--;
        }

        // Only what an event wrote: a property-sourced interaction answering a server change must not echo it back.
        if (local)
            this.options.writeBack?.(target, dynamicParameters, nextValue);
    }

    /** Runs the client effect a command would have returned, without the round trip. */
    private applyEffectInteraction(
        interaction: WebRenderInteractionMetadata,
        dynamicParameters: readonly unknown[],
        sourceValue: unknown
    ): void {
        const effect = interaction.effect;

        if (effect === null || effect === undefined) {
            logWarn("effect interaction carries no effect.", interaction);
            return;
        }

        // Fires only while the condition holds; falseValue has no meaning for an effect.
        if (this.evaluator.matches(interaction, sourceValue))
            this.options.effects.apply({ effect: withScopeParameters(effect, dynamicParameters, this.options.dom), dom: this.options.dom, row: dynamicParameters });
    }
}

/**
 * Supplies the row an effect authored in an item template could not name at compile time: as many of its keys as the target stands
 * in, so a row's press still reaches a field outside the list (an emoji panel's tile inserting into the composer beside it).
 */
function withScopeParameters(effect: ClientEffect, dynamicParameters: readonly unknown[], dom: Pick<DomRegistry, "findComponent">): ClientEffect {
    if (dynamicParameters.length === 0)
        return effect;

    const target = (effect as TargetedClientEffect).target;

    if (target === undefined || (target.dynamicParameters?.length ?? 0) > 0)
        return effect;

    const componentId = getIdValue(target.id);

    for (let depth = dynamicParameters.length; depth >= 0; depth--) {
        const scope = dynamicParameters.slice(0, depth);
        const element = dom.findComponent(componentId, scope);

        // Rowless, `findComponent` answers a templated component by its first row too: only one standing in no row is the target.
        if (element !== null && matchesDynamicParameters(element, scope))
            return depth === 0 ? effect : { ...effect, target: { ...target, dynamicParameters: scope } };
    }

    // Nowhere on the page: the effect says so under the whole row, as it always has.
    return { ...effect, target: { ...target, dynamicParameters } };
}

/** A source and its row, the row's parameters as text: a key sent as a number and read off the DOM as digits is one row. */
function sourceKey(source: WebRenderPropertyReferenceMetadata | null | undefined, dynamicParameters: readonly unknown[]): string {
    return JSON.stringify([getIdValue(source?.componentId), source?.propertyId ?? "", ...dynamicParameters.map(parameter => String(parameter ?? ""))]);
}

function isValidTarget(target: WebRenderPropertyReferenceMetadata | null | undefined): target is WebRenderPropertyReferenceMetadata {
    return target !== null && target !== undefined && target.propertyId.length > 0;
}
