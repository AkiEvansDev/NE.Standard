import { getIdValue, getInteractionSourceKind, MetadataIndex, normalizeEventName, WebRenderInteractionMetadata } from "../metadata/metadata-index";

export class InteractionIndex {
    private readonly eventInteractions = new Map<string, WebRenderInteractionMetadata[]>();
    private readonly eventNames = new Set<string>();
    private readonly eventComponentIdsByName = new Map<string, Set<number>>();
    private readonly propertyInteractions = new Map<string, WebRenderInteractionMetadata[]>();

    public constructor(metadata: MetadataIndex) {
        for (const interaction of metadata.metadata.interactions)
            this.addInteraction(interaction);
    }

    public hasEvent(eventName: string): boolean {
        return this.eventNames.has(normalizeEventName(eventName));
    }

    public getSourceEventNames(): ReadonlySet<string> {
        const names = new Set<string>();

        for (const name of this.eventNames) {
            if (!isLifecycleEventName(name))
                names.add(name);
        }

        return names;
    }

    public hasEventForComponent(eventName: string, componentId: number): boolean {
        return this.eventComponentIdsByName.get(normalizeEventName(eventName))?.has(componentId) === true;
    }

    public getEventInteractions(componentId: number, eventName: string): readonly WebRenderInteractionMetadata[] {
        return this.eventInteractions.get(createEventKey(componentId, eventName)) ?? [];
    }

    public getPropertyInteractions(componentId: number, propertyId: string): readonly WebRenderInteractionMetadata[] {
        return this.propertyInteractions.get(createPropertyKey(componentId, propertyId)) ?? [];
    }

    private addInteraction(interaction: WebRenderInteractionMetadata): void {
        if (isEventInteraction(interaction)) {
            const componentId = getIdValue(interaction.sourceEvent?.componentId);
            const eventName = normalizeEventName(interaction.sourceEvent?.eventName);

            if (componentId > 0 && eventName.length > 0) {
                let bucket = this.eventInteractions.get(createEventKey(componentId, eventName));

                if (bucket === undefined) {
                    bucket = [];
                    this.eventInteractions.set(createEventKey(componentId, eventName), bucket);
                }

                bucket.push(interaction);
                this.eventNames.add(eventName);

                let componentIds = this.eventComponentIdsByName.get(eventName);

                if (componentIds === undefined) {
                    componentIds = new Set<number>();
                    this.eventComponentIdsByName.set(eventName, componentIds);
                }

                componentIds.add(componentId);
            }

            return;
        }

        if (isPropertyInteraction(interaction)) {
            const componentId = getIdValue(interaction.source?.componentId);
            const propertyId = interaction.source?.propertyId ?? "";

            if (componentId > 0 && propertyId.length > 0) {
                let bucket = this.propertyInteractions.get(createPropertyKey(componentId, propertyId));

                if (bucket === undefined) {
                    bucket = [];
                    this.propertyInteractions.set(createPropertyKey(componentId, propertyId), bucket);
                }

                bucket.push(interaction);
            }
        }
    }
}

function isEventInteraction(interaction: WebRenderInteractionMetadata): boolean {
    return getInteractionSourceKind(interaction.sourceKind) === "Event";
}

function isPropertyInteraction(interaction: WebRenderInteractionMetadata): boolean {
    return getInteractionSourceKind(interaction.sourceKind) === "Property";
}

function isLifecycleEventName(eventName: string): boolean {
    return eventName.startsWith("before-") || eventName.startsWith("after-");
}

function createEventKey(componentId: number, eventName: string): string {
    return `${componentId}:${normalizeEventName(eventName)}`;
}

function createPropertyKey(componentId: number, propertyId: string): string {
    return `${componentId}:${propertyId}`;
}
