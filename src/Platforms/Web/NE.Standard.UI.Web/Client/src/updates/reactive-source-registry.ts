import { getIdValue, WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index";
import { PropertyPatchEngine, PropertyValueChange } from "./property-patch-engine";

export type ReactiveSourceCallback = (change: PropertyValueChange) => void;

export class ReactiveSourceRegistry {
    private readonly watchers = new Map<string, Set<ReactiveSourceCallback>>();

    public constructor(propertyPatchEngine: PropertyPatchEngine) {
        propertyPatchEngine.addValueChangeHandler(change => this.notify(change));
    }

    public watch(source: WebRenderPropertyReferenceMetadata, callback: ReactiveSourceCallback): () => void {
        const key = createSourceKey(getIdValue(source.componentId), source.propertyId);
        let callbacks = this.watchers.get(key);

        if (callbacks === undefined) {
            callbacks = new Set();
            this.watchers.set(key, callbacks);
        }

        callbacks.add(callback);

        return () => {
            callbacks?.delete(callback);
        };
    }

    private notify(change: PropertyValueChange): void {
        const key = createSourceKey(getIdValue(change.reference.componentId), change.reference.propertyId);
        const callbacks = this.watchers.get(key);

        if (callbacks === undefined)
            return;

        for (const callback of callbacks)
            callback(change);
    }
}

function createSourceKey(componentId: number, propertyId: string): string {
    return `${componentId}:${propertyId}`;
}
