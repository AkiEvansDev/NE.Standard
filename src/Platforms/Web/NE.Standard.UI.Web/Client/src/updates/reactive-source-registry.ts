// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { findOwningComponentId } from "../addressing/dom-registry.ts";
import type { ValueReaderRegistry } from "../extensions/value-readers.ts";
import { getIdValue } from "../metadata/metadata-index.ts";
import type { WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "./property-patch-engine.ts";
import { ValueSyncEventNames } from "./value-binding-engine.ts";

export type ReactiveSourceCallback = (change: PropertyValueChange) => void;

export type ReactiveSourceEdits = {
    readonly root: ParentNode;
    /** Reads a field the reader edited, as its binding would send it. */
    readonly valueReaders: Pick<ValueReaderRegistry, "readBound">;
};

/** Tells a watcher its source changed: by a push or an interaction through the patch engine, or by the reader's own edit. */
export class ReactiveSourceRegistry {
    private readonly watchers = new Map<string, Set<ReactiveSourceCallback>>();
    private readonly sourcesByComponent = new Map<number, WebRenderPropertyReferenceMetadata[]>();
    private readonly propertyPatchEngine: PropertyPatchEngine;

    public constructor(propertyPatchEngine: PropertyPatchEngine, edits?: ReactiveSourceEdits) {
        this.propertyPatchEngine = propertyPatchEngine;
        propertyPatchEngine.addValueChangeHandler(change => this.notify(change));

        if (edits === undefined)
            return;

        for (const eventName of ValueSyncEventNames)
            edits.root.addEventListener(eventName, domEvent => this.applyEditedValue(domEvent, edits.valueReaders), true);
    }

    public watch(source: WebRenderPropertyReferenceMetadata, callback: ReactiveSourceCallback): () => void {
        const componentId = getIdValue(source.componentId);
        const key = createSourceKey(componentId, source.propertyId);
        let callbacks = this.watchers.get(key);

        if (callbacks === undefined) {
            callbacks = new Set();
            this.watchers.set(key, callbacks);

            const sources = this.sourcesByComponent.get(componentId) ?? [];

            sources.push(source);
            this.sourcesByComponent.set(componentId, sources);
        }

        callbacks.add(callback);

        return () => {
            callbacks?.delete(callback);
        };
    }

    /**
     * Records the reader's edit of a watched source and tells its watchers alone. Not a patch: the edit is never pushed back
     * (docs/VALUES.md §3), and a patch would reach every value-change handler — the interaction engine, which hears the edit
     * itself, would run the field's interactions a second time.
     */
    private applyEditedValue(domEvent: Event, valueReaders: Pick<ValueReaderRegistry, "readBound">): void {
        if (!(domEvent.target instanceof Element))
            return;

        const componentId = findOwningComponentId(domEvent.target);
        const sources = componentId === null ? undefined : this.sourcesByComponent.get(componentId);

        if (sources === undefined)
            return;

        const value = valueReaders.readBound(domEvent.target);

        for (const source of sources) {
            const change = this.propertyPatchEngine.recordValue(source, [], value);

            if (change !== null)
                this.notify(change);
        }
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
