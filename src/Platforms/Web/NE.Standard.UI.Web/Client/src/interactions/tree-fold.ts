import {
    NonItemAttribute, TreeExpandedAttribute, TreeLoadingClass, TreeLoadingRingClass, TreeParentAttribute, TreeRowFoldedClass
} from "../addressing/dom-attributes.ts";
import { findOwningComponentId } from "../addressing/dom-registry.ts";
import type { MetadataIndex, WebRenderItemsFilterSortMetadata } from "../metadata/metadata-index.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { LegacyTreeFoldSlots, TreeFoldSlot, TreeFoldVersion } from "../rendering/tree-boot-fold.ts";
import type { ClientStore } from "../state/client-store.ts";
import type { PropertyStateStore } from "../state/property-state-store.ts";
import { getActiveSorts, hasActiveFilters, readItemsQuery } from "./interaction-evaluator.ts";
import type { ActiveSort, ItemsQuery } from "./interaction-evaluator.ts";
import { rowKey } from "./row-selection.ts";
import { nodeOf } from "./tree-drop.ts";

export const DepthVariable = "--ui-tree-depth";
export const ExpandedSlot = "expanded";
// The folders a tree's stored fold keeps that are not on the page, at most: past it, those folded or unfolded longest ago go first.
const AbsentFoldKeys = 200;

/**
 * The viewer's fold by node key: true unfolded, false folded; a node not in it keeps its authored start. In the order folded or unfolded
 * last, stored as its pairs: a record would put keys that read as numbers first.
 */
export type StoredFold = Map<string, boolean>;

export type Placement = {
    readonly row: HTMLElement;
    readonly depth: number;
    readonly shown: boolean;
    readonly expanded: boolean;
    /** Shown under the fold the server rendered, so the boot patch can name only the rows the viewer's fold disagrees on. */
    readonly authoredShown: boolean;
};

/** The rules on a tree, resolved once per walk: whether any filter is in force, and the sorts to order siblings by. */
export type TreeRules = {
    readonly config: WebRenderItemsFilterSortMetadata | undefined;
    readonly query: ItemsQuery | null;
    readonly filtering: boolean;
    readonly sorts: readonly ActiveSort[];
};

/** What a walk that applies rules reads: the rules by component, their sources' values, and each row's item. */
export type TreeRuleServices = {
    readonly metadata: MetadataIndex;
    readonly state: PropertyStateStore;
    readonly renderer: { getItemValue(element: Element): unknown };
    readonly compareItems: (left: unknown, right: unknown, activeSorts: readonly ActiveSort[]) => number;
    readonly itemMatchesFilters: (config: WebRenderItemsFilterSortMetadata | undefined, item: unknown, state: PropertyStateStore, query: ItemsQuery | null) => boolean;
};

/** Whether the server rendered this node open: the authored fold, which the boot patch is measured against. */
export function authoredExpandedOf(placement: Placement): boolean {
    return nodeOf(placement.row)?.hasAttribute(TreeExpandedAttribute) === true;
}

/**
 * Writes the fold the next page paints before the runtime walks (`tree-boot-fold.ts`): the folders the viewer holds open or folded
 * where that differs from the authored fold, and those not on the page, as the viewer left them.
 */
export function writeBootFold(tree: HTMLElement, stored: StoredFold, placed: Map<string, Placement>, writtenBoot: WeakMap<Element, string>, store: ClientStore): void {
    if (stored.size === 0)
        return;

    const open: string[] = [];
    const closed: string[] = [];

    for (const [key, expanded] of stored) {
        const placement = placed.get(key);

        if (placement === undefined || authoredExpandedOf(placement) !== expanded)
            (expanded ? open : closed).push(key);
    }

    const written = JSON.stringify([open, closed]);
    const previous = writtenBoot.get(tree);

    if (previous === written)
        return;

    writtenBoot.set(tree, written);
    store.writeBoot(tree, TreeFoldSlot, open.length + closed.length === 0 ? null : { fold: { version: TreeFoldVersion, open, closed } });

    // The selectors per row of the shape before, once a page: the boot script no longer reads them.
    if (previous === undefined) {
        for (const slot of LegacyTreeFoldSlots)
            store.writeBoot(tree, slot, null);
    }
}

/** The rules on this tree, or null when none is in force — the common case, which costs one lookup. */
export function resolveTreeRules(tree: HTMLElement, host: HTMLElement | null, services: TreeRuleServices | undefined): TreeRules | null {
    const componentId = findOwningComponentId(tree);

    if (services === undefined || host === null || componentId === null)
        return null;

    const config = services.metadata.getItemsFilterSortMetadata(componentId);
    const query = readItemsQuery(host);

    if (config === undefined && query === null)
        return null;

    const sorts = getActiveSorts(config, services.state, query);
    const filtering = hasActiveFilters(config, services.state, query);

    return filtering || sorts.length > 0 ? { config, query, filtering, sorts } : null;
}

/** The rows in walking order, each group of siblings sorted, moved in the host only when the order changed. */
export function orderTreeRows(host: HTMLElement | null, rows: HTMLElement[], rules: TreeRules, services: TreeRuleServices | undefined): HTMLElement[] {
    if (rules.sorts.length === 0 || services === undefined)
        return rows;

    const renderer = services.renderer;
    const keys = new Set(rows.map(rowKey));
    const byParent = new Map<string, HTMLElement[]>();

    for (const row of rows) {
        const declared = nodeOf(row)?.getAttribute(TreeParentAttribute) ?? "";
        const parent = keys.has(declared) ? declared : "";
        const group = byParent.get(parent);

        if (group === undefined)
            byParent.set(parent, [row]);
        else
            group.push(row);
    }

    const ordered: HTMLElement[] = [];
    const visit = (parent: string): void => {
        const group = byParent.get(parent);

        if (group === undefined)
            return;

        group.sort((left, right) => services.compareItems(renderer.getItemValue(left), renderer.getItemValue(right), rules.sorts));

        for (const row of group) {
            ordered.push(row);
            visit(rowKey(row));
        }
    };

    visit("");

    if (ordered.length !== rows.length || ordered.every((row, index) => row === rows[index]))
        return ordered.length === rows.length ? ordered : rows;

    if (host === null)
        return rows;

    // The rows of waiting go with their nodes: taken out here and put back by the walk that follows.
    for (const placeholder of host.querySelectorAll(`:scope > .${TreeLoadingClass}`))
        placeholder.remove();

    for (const row of ordered)
        host.appendChild(row);

    return ordered;
}

/** The keys of the rows a filter keeps: every match and its ancestors, in one pass from the end. */
export function matchingTreeRows(rows: readonly HTMLElement[], rules: TreeRules, services: TreeRuleServices | undefined): Set<string> {
    const kept = new Set<string>();

    if (services === undefined)
        return kept;

    const state = services.state;
    const renderer = services.renderer;

    for (let index = rows.length - 1; index >= 0; index--) {
        const row = rows[index];
        const key = rowKey(row);
        const value = renderer.getItemValue(row);

        // Fail open: a row whose value never reached the client cannot be judged, and hiding it would silently empty the tree.
        const matches = value === undefined || services.itemMatchesFilters(rules.config, value, state, rules.query);

        if (matches || kept.has(key)) {
            kept.add(key);

            const parent = nodeOf(row)?.getAttribute(TreeParentAttribute) ?? "";

            if (parent.length > 0)
                kept.add(parent);
        }
    }

    return kept;
}

/** One row of waiting under a node that asked for its children, in the children's place; gone the moment they arrive. */
export function placeLoadingRow(row: HTMLElement, depth: number, loading: boolean, shown: boolean): void {
    const next = row.nextElementSibling;
    const existing = next instanceof HTMLElement && next.classList.contains(TreeLoadingClass) ? next : null;

    if (!loading) {
        existing?.remove();
        return;
    }

    const placeholder = existing ?? createLoadingRow();

    placeholder.style.setProperty(DepthVariable, String(depth));
    placeholder.classList.toggle(TreeRowFoldedClass, !shown);

    if (existing === null)
        row.after(placeholder);
}

/**
 * Lets go of the folders folded or unfolded longest ago once more than `AbsentFoldKeys` of those kept are not on the page; one on the
 * page is always kept. A folder not on the page may stand under one not loaded yet, or be gone for good, and the page cannot tell
 * which: a count bounds what the boot script reads before the first paint without guessing.
 */
export function pruneFold(stored: StoredFold, rows: readonly HTMLElement[]): void {
    if (stored.size <= AbsentFoldKeys)
        return;

    const onPage = new Set(rows.map(rowKey));
    let absent = 0;

    for (const key of stored.keys()) {
        if (!onPage.has(key))
            absent++;
    }

    for (const key of [...stored.keys()]) {
        if (absent <= AbsentFoldKeys)
            return;

        if (!onPage.has(key)) {
            stored.delete(key);
            absent--;
        }
    }
}

/** The stored fold: its pairs in the order kept, or a record of the shape before, read in the order it gives. */
export function readStoredFold(value: unknown): StoredFold {
    const entries: unknown[] = Array.isArray(value) ? value : value !== null && typeof value === "object" ? Object.entries(value) : [];
    const fold: StoredFold = new Map();

    for (const entry of entries) {
        if (Array.isArray(entry) && typeof entry[0] === "string" && typeof entry[1] === "boolean")
            fold.set(entry[0], entry[1]);
    }

    return fold;
}

/** Fades in the rows an unfold brought back, to each row's own opacity, as a menu section's content does. */
export function revealRows(rows: readonly HTMLElement[]): void {
    if (rows.length === 0 || prefersReducedMotion())
        return;

    for (const row of rows)
        row.animate([{ opacity: 0, offset: 0 }], { duration: motion.fast, easing: motion.enter });
}

function createLoadingRow(): HTMLElement {
    const placeholder = document.createElement("div");
    const ring = document.createElement("span");

    placeholder.className = TreeLoadingClass;
    // No node: a collection index past it (an insert, a move) must not count it.
    placeholder.setAttribute(NonItemAttribute, "");
    placeholder.setAttribute("aria-hidden", "true");
    ring.className = TreeLoadingRingClass;
    placeholder.append(ring, clientStrings.text("ui.tree.loading"));

    return placeholder;
}
