import { getIdValue } from "../metadata/metadata-index.ts";
import type { WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index";
import { areValuesEqual } from "./value-equality.ts";

/** A row an entry was written under: the items host's component, the host's own dynamic parameters and the row's key. */
export type PropertyStateRow = {
    readonly host: number;
    // Outermost first; a templated host shares its id with every copy, so these tell one outer row's list from another's.
    readonly hostParameters: readonly unknown[];
    readonly key: string;
};

/** One recorded value with the address it was written at — the value as it came, a translatable key or a phrase included. */
export type PropertyStateEntry = {
    readonly reference: WebRenderPropertyReferenceMetadata;
    readonly dynamicParameters: readonly unknown[];
    readonly value: unknown;
};

type RowState = {
    readonly entries: Set<string>;
    // The hosts drawn inside this row, which leave with it.
    readonly innerScopes: Set<string>;
};

// A row known only by its address — its element was not on the page when the value came (a virtualized row not drawn).
type UnplacedRow = {
    readonly parent: string | null;
    readonly entries: Set<string>;
    readonly children: Set<string>;
};

export class PropertyStateStore {
    private readonly values = new Map<string, PropertyStateEntry>();
    // Rows by host instance, each with the entries written under it, so a row that leaves takes its entries with it.
    private readonly scopes = new Map<string, Map<string, RowState>>();
    // Entries written with no row element, by their keys' path: a leaving row takes them, or a later equal push reads as no change.
    // The path names no host, so a sibling host's row of the same key goes too; its next value merely counts as a first one.
    private readonly unplaced = new Map<string, UnplacedRow>();
    private readonly unplacedPathByEntry = new Map<string, string>();

    public get(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[] = []): unknown {
        return this.values.get(this.createKey(reference, dynamicParameters))?.value;
    }

    public has(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[] = []): boolean {
        return this.values.has(this.createKey(reference, dynamicParameters));
    }

    /** Records a value; `rows` are the rows its element stands in, innermost first. */
    public set(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown, rows: readonly PropertyStateRow[] = []): boolean {
        const key = this.createKey(reference, dynamicParameters);
        const previous = this.values.get(key);

        if (rows.length > 0) {
            this.recordRows(key, rows);
            this.removeUnplaced(key);
        }
        else if (dynamicParameters.length > 0 && !this.unplacedPathByEntry.has(key)) {
            this.recordUnplaced(key, dynamicParameters);
        }

        if (previous !== undefined && areValuesEqual(previous.value, value))
            return false;

        this.values.set(key, { reference, dynamicParameters, value });

        return true;
    }

    /** Every value recorded, with its address: what a language switch writes again from the keys it holds. */
    public entries(): IterableIterator<PropertyStateEntry> {
        return this.values.values();
    }

    /** Forgets what the named rows of one host instance held, once the rows are gone: their next value is a first one again. */
    public forgetRows(host: number, hostParameters: readonly unknown[], keys: Iterable<string>): void {
        const scope = scopeKey(host, hostParameters);

        for (const key of keys) {
            this.forgetRow(scope, key);
            this.forgetUnplaced(pathKey([...hostParameters, key]));
        }
    }

    /** Forgets every row one host instance held: a reset. */
    public forgetHost(host: number, hostParameters: readonly unknown[]): void {
        this.forgetScope(scopeKey(host, hostParameters));

        const node = this.unplaced.get(pathKey(hostParameters));

        for (const child of [...node?.children ?? []])
            this.forgetUnplaced(child);
    }

    public clear(): void {
        this.values.clear();
        this.scopes.clear();
        this.unplaced.clear();
        this.unplacedPathByEntry.clear();
    }

    private recordRows(entry: string, rows: readonly PropertyStateRow[]): void {
        let inner: string | null = null;

        for (const [index, row] of rows.entries()) {
            const scope = scopeKey(row.host, row.hostParameters);
            const state = this.rowState(scope, row.key);

            // The entry belongs to its innermost row; an outer row holds the inner host, and forgetting it forgets that too.
            if (index === 0)
                state.entries.add(entry);

            if (inner !== null)
                state.innerScopes.add(inner);

            inner = scope;
        }
    }

    private forgetRow(scope: string, key: string): void {
        const byKey = this.scopes.get(scope);
        const state = byKey?.get(key);

        if (byKey === undefined || state === undefined)
            return;

        byKey.delete(key);

        for (const entry of state.entries) {
            this.values.delete(entry);
            this.removeUnplaced(entry);
        }

        for (const inner of state.innerScopes)
            this.forgetScope(inner);
    }

    private forgetScope(scope: string): void {
        const byKey = this.scopes.get(scope);

        if (byKey === undefined)
            return;

        for (const key of [...byKey.keys()])
            this.forgetRow(scope, key);

        this.scopes.delete(scope);
    }

    /** Files the entry under its address's full key path, each shorter path a parent of the next, down from the page's. */
    private recordUnplaced(entry: string, dynamicParameters: readonly unknown[]): void {
        let parent = this.unplacedNode(pathKey([]), null);
        let path = "";

        for (let length = 1; length <= dynamicParameters.length; length++) {
            path = pathKey(dynamicParameters.slice(0, length));
            parent.children.add(path);
            parent = this.unplacedNode(path, pathKey(dynamicParameters.slice(0, length - 1)));
        }

        parent.entries.add(entry);
        this.unplacedPathByEntry.set(entry, path);
    }

    private unplacedNode(path: string, parent: string | null): UnplacedRow {
        let node = this.unplaced.get(path);

        if (node === undefined) {
            node = { parent, entries: new Set(), children: new Set() };
            this.unplaced.set(path, node);
        }

        return node;
    }

    /** An entry now placed under a drawn row leaves the unplaced index, and the paths it alone kept go with it. */
    private removeUnplaced(entry: string): void {
        const path = this.unplacedPathByEntry.get(entry);

        if (path === undefined)
            return;

        this.unplacedPathByEntry.delete(entry);
        this.unplaced.get(path)?.entries.delete(entry);
        this.pruneUnplaced(path);
    }

    private pruneUnplaced(path: string): void {
        let current: string | null = path;

        while (current !== null) {
            const node = this.unplaced.get(current);

            if (node === undefined || node.entries.size > 0 || node.children.size > 0 || node.parent === null)
                return;

            this.unplaced.delete(current);
            this.unplaced.get(node.parent)?.children.delete(current);
            current = node.parent;
        }
    }

    /** Forgets the entries under an address path and every path below it: a row that left, with the rows nested in it. */
    private forgetUnplaced(path: string): void {
        const node = this.unplaced.get(path);

        if (node === undefined)
            return;

        for (const entry of node.entries) {
            this.values.delete(entry);
            this.unplacedPathByEntry.delete(entry);
        }

        node.entries.clear();

        for (const child of [...node.children])
            this.forgetUnplaced(child);

        this.pruneUnplaced(path);
    }

    private rowState(scope: string, key: string): RowState {
        let byKey = this.scopes.get(scope);

        if (byKey === undefined) {
            byKey = new Map();
            this.scopes.set(scope, byKey);
        }

        let state = byKey.get(key);

        if (state === undefined) {
            state = { entries: new Set(), innerScopes: new Set() };
            byKey.set(key, state);
        }

        return state;
    }

    private createKey(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[]): string {
        return `${getIdValue(reference.componentId)}:${reference.propertyId}:${serializeDynamicParameters(dynamicParameters)}`;
    }
}

// Parameters compare as text, as the DOM registry matches them: the server may send a number where the DOM holds its digits.
function scopeKey(host: number, hostParameters: readonly unknown[]): string {
    return JSON.stringify([host, ...hostParameters.map(parameter => String(parameter ?? ""))]);
}

// Text, as a scope's parameters are: a key sent as a number and read off the DOM as digits is one row.
function pathKey(parameters: readonly unknown[]): string {
    return JSON.stringify(parameters.map(parameter => String(parameter ?? "")));
}

function serializeDynamicParameters(dynamicParameters: readonly unknown[]): string {
    if (dynamicParameters.length === 0)
        return "";

    try {
        return JSON.stringify(dynamicParameters);
    }
    catch {
        return String(dynamicParameters);
    }
}
