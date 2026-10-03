// A reset and the inserts right after it on one host, read as one "the collection is now exactly this", which the page reconciles
// by key rather than drawing again. A controller's Clear() and its Adds arrive as a reset and an insert per item: read off the first
// insert alone, the refill dropped the rows the rest brought back and drew them anew, the reader's row and a press under way with them.

// `node --test` loads this module as it is: `.ts` on the value imports, `import type` on the rest.
import { getCollectionUpdateAction, getIdValue, getUpdateKind } from "../metadata/metadata-index.ts";
import type { ServerCollectionChangeUIUpdate, ServerCollectionItemChange, ServerUIUpdate } from "../metadata/metadata-index";
import { areValuesEqual } from "../state/value-equality.ts";

/** A host's collection as it now stands, whole. */
export type CollectionRefill = {
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
    readonly items: readonly ServerCollectionItemChange[];
};

/** A refill read off a change set, and how many of its updates it stands for, the reset included. */
export type ReadRefill = CollectionRefill & {
    readonly length: number;
};

/** The refill starting at `index` of a change set: a reset and every insert right after it on the same host; null where none does. */
export function readCollectionRefill(updates: readonly ServerUIUpdate[], index: number): ReadRefill | null {
    const reset = asCollectionChange(updates[index], "Reset");

    if (reset === null)
        return null;

    const componentId = getIdValue(reset.component?.id);
    const dynamicParameters = reset.component?.dynamicParameters ?? [];

    if (componentId <= 0)
        return null;

    let items: readonly ServerCollectionItemChange[] | null = null;
    // Copied only once a second insert follows: the common refill is one insert, taken as it came.
    let rows: ServerCollectionItemChange[] | null = null;
    let next = index + 1;

    for (; next < updates.length; next++) {
        const insert = asCollectionChange(updates[next], "Insert");

        if (insert === null || getIdValue(insert.component?.id) !== componentId || !areValuesEqual(dynamicParameters, insert.component?.dynamicParameters ?? []))
            break;

        if (items === null) {
            items = insert.items ?? [];
            continue;
        }

        rows ??= [...items];

        // At its index in the collection as the inserts before it left it, as a host places a row; past the end, or with none, last.
        for (const change of insert.items ?? [])
            rows.splice(typeof change.index === "number" && change.index >= 0 && change.index < rows.length ? change.index : rows.length, 0, change);

        items = rows;
    }

    return items === null ? null : { componentId, dynamicParameters, items, length: next - index };
}

function asCollectionChange(update: ServerUIUpdate | undefined, action: "Reset" | "Insert"): ServerCollectionChangeUIUpdate | null {
    if (update === undefined || getUpdateKind(update) !== "CollectionChange")
        return null;

    const change = update as ServerCollectionChangeUIUpdate;

    return getCollectionUpdateAction(change.action) === action ? change : null;
}
