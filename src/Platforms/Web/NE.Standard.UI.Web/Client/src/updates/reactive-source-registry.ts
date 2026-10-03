// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { ValueEndAttribute } from "../addressing/dom-attributes.ts";
import { findOwningComponentId } from "../addressing/dom-registry.ts";
import type { ValueReaderRegistry } from "../extensions/value-readers.ts";
import { getIdValue } from "../metadata/metadata-index.ts";
import type { MetadataIndex, WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "./property-patch-engine.ts";
import { ValueSyncEventNames } from "./value-binding-engine.ts";

export type ReactiveSourceCallback = (change: PropertyValueChange) => void;

/** The property a period's end field holds; every other field of the component writes any of its other sources. */
const EndValuePropertyName = "EndValue";

export type ReactiveSourceEdits = {
    readonly root: ParentNode;
    /** Reads a field the reader edited, as its binding would send it. */
    readonly valueReaders: Pick<ValueReaderRegistry, "readBound">;
    /** Names a source's property, so a period's two fields each record their own end; left out, a field records every source. */
    readonly metadata?: Pick<MetadataIndex, "getPropertyDefinition">;
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
            edits.root.addEventListener(eventName, domEvent => this.applyEditedValue(domEvent, edits), true);
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
    private applyEditedValue(domEvent: Event, edits: ReactiveSourceEdits): void {
        if (!(domEvent.target instanceof Element))
            return;

        const componentId = findOwningComponentId(domEvent.target);
        const sources = componentId === null ? undefined : this.sourcesByComponent.get(componentId);

        if (sources === undefined)
            return;

        const value = edits.valueReaders.readBound(domEvent.target);
        const end = domEvent.target.hasAttribute(ValueEndAttribute);

        for (const source of sources) {
            // A range's start is no source of its end's rule, nor its end of the start's: a band filters by both at once.
            if (edits.metadata !== undefined && (edits.metadata.getPropertyDefinition(source.propertyId)?.propertyName === EndValuePropertyName) !== end)
                continue;

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
