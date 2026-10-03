// `.ts` on the value import and `import type` on the rest: `node --test` runs this module and resolves files literally.
import type { CollectionUpdateActionName, ServerCollectionChangeUIUpdate } from "../metadata/metadata-index";
import { getCollectionUpdateAction } from "../metadata/metadata-index.ts";

// A component naming a sink (`data-ui-collection-sink`) takes its bound collection as values, not rows (a chart's points, a canvas's
// nodes): the sink gets every change the items machinery would turn into rows.

/** One item of a change: its key, where it sits in the source order, and the value the server sent. */
type CollectionChangeItem = {
    readonly key: string | null;
    /** On a replace: the key the item had before, when it changed. */
    readonly oldKey: string | null;
    readonly index: number | null;
    readonly item: unknown;
};

type CollectionChangeMove = {
    readonly key: string | null;
    readonly oldIndex: number | null;
    readonly newIndex: number | null;
};

export type CollectionChange = {
    readonly action: CollectionUpdateActionName | "Unknown";
    /** The component the collection is bound on. */
    readonly component: Element;
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
    readonly items: readonly CollectionChangeItem[];
    readonly moves: readonly CollectionChangeMove[];
};

export type CollectionSinkHandler = (change: CollectionChange) => void;

/** A sink by the kind a renderer wrote in `data-ui-collection-sink`. */
export type CollectionSinkRegistration = {
    readonly kind: string;
    readonly handler: CollectionSinkHandler;
};

export class CollectionSinkRegistry {
    private readonly handlers = new Map<string, CollectionSinkHandler>();

    public register(registration: CollectionSinkRegistration): void {
        this.handlers.set(registration.kind, registration.handler);
    }

    /** Hands the change to the sink of its kind; false when none is registered. */
    public dispatch(kind: string, change: CollectionChange): boolean {
        const handler = this.handlers.get(kind);

        if (handler === undefined)
            return false;

        handler(change);

        return true;
    }
}

export function toCollectionChange(
    update: ServerCollectionChangeUIUpdate,
    component: Element,
    componentId: number,
    dynamicParameters: readonly unknown[]
): CollectionChange {
    return {
        action: getCollectionUpdateAction(update.action),
        component,
        componentId,
        dynamicParameters,
        items: (update.items ?? []).map(item => ({
            key: item.key ?? null,
            oldKey: item.oldKey ?? null,
            index: item.index ?? null,
            item: item.item ?? null
        })),
        moves: (update.moves ?? []).map(move => ({
            key: move.key ?? null,
            oldIndex: move.oldIndex ?? null,
            newIndex: move.newIndex ?? null
        }))
    };
}
