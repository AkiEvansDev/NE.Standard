// The collections of hosts inside an item template (a select's options in every row), kept as last sent so a row built later is
// drawn with them: the server sends such a collection once, to no row, and a row built later would clone an empty host.

// `node --test` loads this module as it is: `.ts` on the value imports, `import type` on the rest.
import { getCollectionUpdateAction, getIdValue } from "../metadata/metadata-index.ts";
import type { ServerCollectionChangeUIUpdate, ServerCollectionItemChange } from "../metadata/metadata-index";

/** One held row: its key and the item it stands for. */
export type HeldRow = {
    readonly key: string;
    readonly item: unknown;
};

export class HeldCollections {
    // By component: only a collection addressed to no row is held, which is the one every row's copy of the host shares.
    private readonly collections = new Map<number, HeldRow[]>();
    // A row's host emptied for the collection it shares and not drawn from it yet, by that collection's component.
    private readonly waiting = new WeakMap<object, number>();

    /** The collection as it now stands, in order: a refill replaces what was held. */
    public hold(componentId: number, items: readonly ServerCollectionItemChange[]): void {
        this.collections.set(componentId, toRows(items));
    }

    /** One change applied to the held collection, as a host applies it to its rows; a change to a collection not held starts one. */
    public apply(update: ServerCollectionChangeUIUpdate): void {
        const componentId = getIdValue(update.component?.id);
        let rows = this.collections.get(componentId);

        if (rows === undefined) {
            rows = [];
            this.collections.set(componentId, rows);
        }

        switch (getCollectionUpdateAction(update.action)) {
            case "Insert":
                for (const change of update.items ?? [])
                    insertRow(rows, change);
                break;
            case "Remove":
                for (const change of update.items ?? [])
                    removeRow(rows, change.key);
                break;
            case "Replace":
                for (const change of update.items ?? [])
                    replaceRow(rows, change);
                break;
            case "Move":
                for (const move of update.moves ?? [])
                    moveRow(rows, move.key, move.newIndex);
                break;
            case "Reset":
                rows.length = 0;
                break;
            default:
                break;
        }
    }

    /** The rows held for a component, or none where nothing was. */
    public get(componentId: number): readonly HeldRow[] | undefined {
        return this.collections.get(componentId);
    }

    /** A row's host, just emptied, is to be drawn from the collection held for `componentId` once the row is on the page. */
    public markWaiting(host: object, componentId: number): void {
        this.waiting.set(host, componentId);
    }

    /** Whether a host waits to be drawn: a change to its collection passes it by, since the held rows have taken it already. */
    public isWaiting(host: object): boolean {
        return this.waiting.has(host);
    }

    /** The rows a waiting host is drawn from, as they stand now with every change since it was emptied, the host no longer waiting. */
    public takeWaiting(host: object): readonly HeldRow[] | undefined {
        const componentId = this.waiting.get(host);

        if (componentId === undefined)
            return undefined;

        this.waiting.delete(host);

        return this.collections.get(componentId);
    }
}

function toRows(items: readonly ServerCollectionItemChange[]): HeldRow[] {
    const rows: HeldRow[] = [];

    for (const change of items) {
        if (typeof change.key === "string")
            rows.push({ key: change.key, item: change.item });
    }

    return rows;
}

// At its index, as a host places a row by source index; past the end, or with none, at the end.
function insertRow(rows: HeldRow[], change: ServerCollectionItemChange): void {
    if (typeof change.key !== "string")
        return;

    removeRow(rows, change.key);
    rows.splice(clampIndex(change.index, rows.length), 0, { key: change.key, item: change.item });
}

function removeRow(rows: HeldRow[], key: string | null | undefined): void {
    const at = rows.findIndex(row => row.key === key);

    if (at >= 0)
        rows.splice(at, 1);
}

// In the old row's place; a row the collection did not hold goes where the change says, as an insert.
function replaceRow(rows: HeldRow[], change: ServerCollectionItemChange): void {
    if (typeof change.key !== "string")
        return;

    const at = rows.findIndex(row => row.key === (change.oldKey ?? change.key));

    if (at < 0) {
        insertRow(rows, change);
        return;
    }

    rows[at] = { key: change.key, item: change.item };
}

function moveRow(rows: HeldRow[], key: string | null | undefined, newIndex: number | null | undefined): void {
    const at = rows.findIndex(row => row.key === key);

    if (at < 0)
        return;

    const [row] = rows.splice(at, 1);

    rows.splice(clampIndex(newIndex, rows.length), 0, row);
}

function clampIndex(index: number | null | undefined, length: number): number {
    return typeof index === "number" && index >= 0 && index < length ? index : length;
}
