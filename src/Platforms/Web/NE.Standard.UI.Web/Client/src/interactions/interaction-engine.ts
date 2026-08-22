import { DomRegistry } from "../addressing/dom-registry";
import { EffectRegistry } from "../effects/effect-registry";
import {
    ClientEffect,
    TargetedClientEffect,
    WebRenderInteractionMetadata,
    WebRenderPropertyReferenceMetadata,
    getIdValue,
    getInteractionActionKind
} from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine";
import { InteractionEvaluator } from "./interaction-evaluator";
import { InteractionIndex } from "./interaction-index";

export type InteractionEventContext = {
    readonly name: string;
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
    readonly domEvent: Event;
};

export type InteractionEngineOptions = {
    readonly effects: EffectRegistry;
    readonly dom: DomRegistry;
};

export class InteractionEngine {
    private applyDepth = 0;

    public constructor(
        private readonly index: InteractionIndex,
        private readonly propertyPatchEngine: PropertyPatchEngine,
        private readonly evaluator: InteractionEvaluator,
        private readonly options: InteractionEngineOptions
    ) {
        this.propertyPatchEngine.addValueChangeHandler(change => this.applyPropertyInteractions(change));
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
    }

    /**
     * An effect interaction has nothing to assign: it runs the same client effect a command would have
     * returned, through the same registry, only without the round trip.
     */
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

        // A property-driven effect interaction fires only while its condition holds; falseValue has no
        // meaning here, so the miss simply does nothing.
        if (this.evaluator.matches(interaction, sourceValue))
            this.options.effects.apply({ effect: withScopeParameters(effect, dynamicParameters), dom: this.options.dom });
    }
}

/**
 * An effect authored inside an item template names its target component but cannot name the row: the author
 * has no key to write at compile time. The scope the interaction fired in supplies it.
 */
function withScopeParameters(effect: ClientEffect, dynamicParameters: readonly unknown[]): ClientEffect {
    if (dynamicParameters.length === 0)
        return effect;

    const target = (effect as TargetedClientEffect).target;

    if (target === undefined || (target.dynamicParameters?.length ?? 0) > 0)
        return effect;

    return { ...effect, target: { ...target, dynamicParameters } };
}

function isValidTarget(target: WebRenderPropertyReferenceMetadata | null | undefined): target is WebRenderPropertyReferenceMetadata {
    return target !== null && target !== undefined && target.propertyId.length > 0;
}
