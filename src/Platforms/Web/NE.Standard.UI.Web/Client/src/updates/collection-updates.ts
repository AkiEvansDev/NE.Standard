// Collection DOM mutations, row reconciliation, and server-rendered item registration for `UpdateProcessor`.

import { ComponentKeyAttribute, ComponentSelector, ItemsHostAttribute, WindowSpacerAttribute } from "../addressing/dom-attributes.ts";
import { findOwningComponentAddress, readComponentId } from "../addressing/dom-registry.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { startsWithDynamicParameters } from "../addressing/dynamic-parameters.ts";
import { itemsHostOf } from "../addressing/item-reveal.ts";
import { getRealItemElements } from "../addressing/items-empty-renderer.ts";
import { resolveHostMode } from "../addressing/items-host-mode.ts";
import { getSourceOrder, insertSourceItem, moveSourceItem, removeSourceItems, replaceSourceItem, setSourceOrder } from "../addressing/items-source-order.ts";
import { giveRowCursor, planRowRemoval, restoreWaitingCursor, rowCursorRoot, takeRowCursor } from "../interactions/row-cursor.ts";
import type { HeldRowCursor } from "../interactions/row-cursor.ts";
import type { ItemStackEntry } from "../items/binding-template-evaluator.ts";
import { findSlotRoots } from "../items/composite-slots.ts";
import type { ItemProjections } from "../items/item-projections.ts";
import { renderItemRow } from "../items/items-row-renderer.ts";
import type { ItemsTemplateRegistry } from "../items/items-template-registry.ts";
import type { ItemsTemplateRenderer } from "../items/items-template-renderer.ts";
import type { ItemsVirtualizationEngine } from "../items/items-virtualization-engine.ts";
import { logError, logWarn } from "../metadata/logger.ts";
import { getCollectionUpdateAction, getIdValue, getUpdateKind } from "../metadata/metadata-index.ts";
import type {
    MetadataIndex,
    ServerChangeSet,
    ServerCollectionChangeUIUpdate,
    ServerCollectionItemChange,
    ServerCollectionMoveChange,
    ServerUIUpdate
} from "../metadata/metadata-index.ts";
import type { PropertyStateStore } from "../state/property-state-store.ts";
import { areValuesEqual } from "../state/value-equality.ts";
import type { CollectionRefill } from "./collection-refill.ts";

export type RowRenderContext = {
    readonly metadata: MetadataIndex;
    readonly templates: ItemsTemplateRegistry;
    readonly renderer: ItemsTemplateRenderer;
};

/** Records what every server-rendered row holds, from the render metadata and the pending insert, before anything is applied. */
export function registerServerRenderedItems(dom: DomRegistry, metadata: MetadataIndex, itemsRenderer: ItemsTemplateRenderer, projections: ItemProjections, changeSet?: ServerChangeSet | null): void {
    const rowsByHost = new Map<Element, Map<string, Element>>();
    const rowsOf = (host: Element): Map<string, Element> => {
        let rows = rowsByHost.get(host);

        if (rows === undefined) {
            rows = indexItemElements(host);
            rowsByHost.set(host, rows);
        }

        return rows;
    };

    registerRenderedRows(dom.root, metadata, itemsRenderer, projections, rowsOf);

    for (const update of changeSet?.updates ?? []) {
        if (getUpdateKind(update) !== "CollectionChange")
            continue;

        const insert = update as ServerCollectionChangeUIUpdate;

        if (getCollectionUpdateAction(insert.action) !== "Insert")
            continue;

        const componentId = getIdValue(insert.component?.id);

        for (const host of findItemsHosts(dom, componentId, insert.component?.dynamicParameters ?? [])) {
            const rows = rowsOf(host);

            for (const change of insert.items ?? [])
                registerItemValue(metadata, itemsRenderer, componentId, rows, change.key, change.item);
        }
    }
}

/** The items the render published for the server-drawn rows of every host under `root`. */
export function registerRenderedRows(root: ParentNode, metadata: MetadataIndex, itemsRenderer: ItemsTemplateRenderer, projections: ItemProjections, rowsOf: (host: Element) => ReadonlyMap<string, Element> = host => indexItemElements(host)): void {
    // By the host's whole address: a list inside every row of another is one host per row, each with values of its own.
    for (const host of root.querySelectorAll<Element>(`[${ItemsHostAttribute}]`)) {
        const owner = findOwningComponentAddress(host);

        if (owner === null)
            continue;

        const values = metadata.getItemValues(owner.componentId, owner.dynamicParameters);

        if (!projections.isEmpty)
            projections.mark(owner.componentId, values);

        for (const value of values)
            registerItemValue(metadata, itemsRenderer, owner.componentId, rowsOf(host), value.key, value.item);
    }
}

function registerItemValue(metadata: MetadataIndex, itemsRenderer: ItemsTemplateRenderer, componentId: number, rows: ReadonlyMap<string, Element>, key: string | null | undefined, item: unknown): void {
    if (key === null || key === undefined)
        return;

    const element = rows.get(key) ?? null;

    // A row holding an item keeps it: a re-attach drew it from that item, and the refill must see the difference to redraw it.
    if (element === null || readItemScope(itemsRenderer, element) !== undefined)
        return;

    itemsRenderer.registerItemScope(element, resolveScopeComponentId(element), item);

    const composite = metadata.getItemsTemplateMetadata(componentId)?.composite;

    if (composite === null || composite === undefined)
        return;

    // A drawn row's cells are scopes of their own, as a built row's are, or a language switch finds no item to word a cell from.
    for (const [root, scopeComponentId] of findSlotRoots(element))
        itemsRenderer.registerItemScope(root, scopeComponentId, item);
}

/** The scope a rendered row records; a wrapped item records it on the child inside the key-carrying element. */
export function readItemScope(itemsRenderer: ItemsTemplateRenderer, element: Element): ItemStackEntry | undefined {
    const own = itemsRenderer.getItemScope(element);

    if (own !== undefined)
        return own;

    const child = element.firstElementChild;

    return child === null ? undefined : itemsRenderer.getItemScope(child);
}

/** Lays the host's rows out as the refill lists them, keeping each row whose item did not change. */
export function reconcileHostRows(host: Element, refill: CollectionRefill, context: RowRenderContext, state: PropertyStateStore, forgetHeldRows: (componentId: number, dynamicParameters: readonly unknown[], keys: readonly string[]) => void): void {
    const ancestors = context.renderer.getAncestorStack(host);
    const existing = indexItemElements(host);
    const ordered: Element[] = [];
    // A row redrawn or gone takes its recorded values with it, as a remove or a replace does.
    const forgotten: string[] = [];
    // A redrawn row's keyboard cursor, given to its new row once that stands in the host.
    let cursor: { readonly row: Element; readonly held: HeldRowCursor } | null = null;

    for (const change of refill.items) {
        const key = change.key ?? null;

        if (key === null) {
            logWarn("collection insert carried no item key.", change);
            continue;
        }

        const previous = existing.get(key) ?? null;

        existing.delete(key);

        // Kept only when it is the same item: the key alone does not say the value did not move.
        if (previous !== null && areValuesEqual(readItemScope(context.renderer, previous)?.item, change.item)) {
            ordered.push(previous);
            continue;
        }

        const element = renderItemElement(refill.componentId, change.item, key, ancestors, context);

        // Taken out here: the leftovers below only see keys the new list did not claim, and this one was.
        if (previous !== null) {
            const held = takeRowCursor(previous);

            if (held !== null && element !== null)
                cursor = { row: element, held };

            previous.remove();
            forgotten.push(key);
        }

        if (element !== null)
            ordered.push(element);
    }

    const windowed = resolveHostMode(host) === "windowed";

    for (const [key, leftover] of existing) {
        // A window read elsewhere takes the cursor's row off the page, not out of the source: its key waits on the root, as a
        // virtualized host's does, for the window that draws it again.
        const held = windowed ? takeRowCursor(leftover) : null;

        leftover.remove();
        giveRowCursor(host, null, held);
        forgotten.push(key);
    }

    state.forgetRows(refill.componentId, refill.dynamicParameters, forgotten);
    forgetHeldRows(refill.componentId, refill.dynamicParameters, forgotten);
    placeItemsInOrder(host, ordered);
    // The refill's order is the source order now: merged with the one known, a refill that only reorders would be put back.
    setSourceOrder(host, ordered);

    if (cursor !== null)
        giveRowCursor(host, cursor.row, cursor.held);

    if (windowed) {
        for (const row of ordered)
            restoreWaitingCursor(host, row);
    }
}

/** The same five changes, applied to the values a virtualized host holds rather than to its children. */
export function applyVirtualizedCollectionChange(virtualization: ItemsVirtualizationEngine, host: Element, update: ServerCollectionChangeUIUpdate): void {
    switch (getCollectionUpdateAction(update.action)) {
        case "Insert":
            for (const change of update.items ?? []) {
                if (change.key !== null && change.key !== undefined)
                    virtualization.insert(host, change.key, change.item, change.index ?? null);
            }
            break;
        case "Remove":
            virtualization.remove(host, (update.items ?? []).map(change => change.key).filter((key): key is string => typeof key === "string"));
            break;
        case "Replace":
            for (const change of update.items ?? []) {
                if (change.key !== null && change.key !== undefined)
                    virtualization.replace(host, change.oldKey ?? change.key, change.key, change.item, change.index ?? null);
            }
            break;
        case "Move":
            for (const move of update.moves ?? []) {
                if (move.key !== null && move.key !== undefined)
                    virtualization.move(host, move.key, move.newIndex ?? null);
            }
            break;
        case "Reset":
            virtualization.reset(host);
            break;
        default:
            logWarn("collection update action is not supported.", update);
            break;
    }
}

/** The items host of every instance a collection is addressed to: one, or each row's copy for a template's collection sent once. */
export function findItemsHosts(dom: DomRegistry, componentId: number, dynamicParameters: readonly unknown[]): Element[] {
    const hosts: Element[] = [];

    // The component's own host, not a nested component's under it (a select in a grid's filter row).
    for (const root of dom.findAllComponents(componentId, dynamicParameters)) {
        const host = itemsHostOf(root);

        if (host !== null)
            hosts.push(host);
    }

    return hosts;
}

// Placed by source index, not child index: a sorted or grouped host's children are in another order, and the sync after restores it.
export function applyCollectionInsert(host: Element, componentId: number, items: readonly ServerCollectionItemChange[], context: RowRenderContext): void {
    const ancestors = context.renderer.getAncestorStack(host);
    const order = getSourceOrder(host, getRealItemElements(host));

    for (const change of items) {
        const key = change.key ?? null;

        if (key === null) {
            logWarn("collection insert carried no item key.", change);
            continue;
        }

        const element = renderItemElement(componentId, change.item, key, ancestors, context);

        if (element === null)
            continue;

        placeSourceRow(host, order, element, insertSourceItem(order, element, change.index ?? null));
        // A window growing toward the row the cursor waits for draws it here.
        restoreWaitingCursor(host, element);
    }
}

/** A row drawn from its item; one whose drawing throws is left out, as one that draws nothing is, so the rest of the change lands. */
export function renderItemElement(componentId: number, item: unknown, key: string, ancestors: readonly ItemStackEntry[], context: RowRenderContext): Element | null {
    try {
        return renderItemRow(componentId, item, key, ancestors, context);
    }
    catch (error) {
        logError("drawing an item row failed; the row is left out.", { componentId, key, error });
        return null;
    }
}

export function applyCollectionReplace(host: Element, componentId: number, items: readonly ServerCollectionItemChange[], context: RowRenderContext): void {
    const ancestors = context.renderer.getAncestorStack(host);
    const present = getRealItemElements(host);
    const order = getSourceOrder(host, present);
    const rows = indexItemElements(host, present);

    for (const change of items) {
        const key = change.key ?? null;

        if (key === null) {
            logWarn("collection replace carried no item key.", change);
            continue;
        }

        const existing = rows.get(change.oldKey ?? key) ?? null;
        const element = renderItemElement(componentId, change.item, key, ancestors, context);

        if (element === null)
            continue;

        rows.delete(change.oldKey ?? key);
        rows.set(key, element);

        if (existing !== null) {
            // A row redrawn (its variant or group changed) keeps the keyboard's cursor and focus, as a removal hands them on.
            const held = takeRowCursor(existing);

            replaceSourceItem(order, existing, element);
            existing.replaceWith(element);
            giveRowCursor(host, element, held);
        } else {
            placeSourceRow(host, order, element, insertSourceItem(order, element, change.index ?? null));
        }
    }
}

/** Whether an update is a change to the list a host draws: to the host's own component, at its own row keys. */
export function changesListOf(update: ServerUIUpdate, host: Element): boolean {
    if (getUpdateKind(update) !== "CollectionChange")
        return false;

    const component = (update as ServerCollectionChangeUIUpdate).component;
    const owner = host.closest(ComponentSelector);

    return owner !== null && readComponentId(owner) === getIdValue(component?.id) && startsWithDynamicParameters(owner, component?.dynamicParameters ?? []);
}

// The rows gathered first and taken out together: a list read once, the order filtered once, and the cursor's next row decided past
// every row the change takes away, rather than a splice and a cursor move per row.
export function applyCollectionRemove(host: Element, items: readonly ServerCollectionItemChange[], trimmed: boolean): void {
    const present = getRealItemElements(host);
    const byKey = indexItemElements(host, present);
    const removed = new Set<Element>();

    for (const change of items) {
        const key = change.key ?? null;
        const element = key === null ? null : byKey.get(key) ?? null;

        if (key === null || element === null) {
            logWarn("collection remove did not resolve an item.", change);
            continue;
        }

        byKey.delete(key);
        removed.add(element);
    }

    if (removed.size === 0)
        return;

    const root = rowCursorRoot(host);
    // A window's trim takes rows off the page, not out of the source: the cursor waits for its row, where a delete moves it on.
    const restoreCursor = root === null ? null : trimmed ? planRowTrim(host, removed) : planRowRemoval(root, present, removed);

    removeSourceItems(getSourceOrder(host, present), removed);

    for (const element of removed)
        element.remove();

    restoreCursor?.();
}

/**
 * Before rows a window's trim takes off the page: a callback that leaves the cursor's key waiting on the root once they are gone, as a
 * refill's leftover does, for the window that draws its row again; null if they held nothing of the keyboard.
 */
function planRowTrim(host: Element, removed: ReadonlySet<Element>): (() => void) | null {
    const held: HeldRowCursor[] = [];

    for (const element of removed) {
        const taken = takeRowCursor(element);

        if (taken !== null)
            held.push(taken);
    }

    return held.length === 0 ? null : () => {
        for (const taken of held)
            giveRowCursor(host, null, taken);
    };
}

/** The keys a Move moves. */
export function movedKeysOf(moves: readonly ServerCollectionMoveChange[]): string[] {
    return moves.map(move => move.key).filter((key): key is string => typeof key === "string");
}

export function applyCollectionMove(host: Element, moves: readonly ServerCollectionMoveChange[]): void {
    const present = getRealItemElements(host);
    const order = getSourceOrder(host, present);
    const byKey = indexItemElements(host, present);

    for (const move of moves) {
        const element = move.key === null || move.key === undefined ? null : byKey.get(move.key) ?? null;

        if (element === null) {
            logWarn("collection move did not resolve an item.", move);
            continue;
        }

        const next = moveSourceItem(order, element, move.newIndex ?? null);

        placeSourceRow(host, order, element, next);
    }
}

/** Places a row where `next` in `order` says, and at the end before any trailing window spacer rather than after the host's last child. */
export function placeSourceRow(host: Element, order: readonly Element[], element: Element, next: Element | null): void {
    host.insertBefore(element, next ?? order[order.length - 2]?.nextSibling ?? trailingWindowSpacer(host));
}

/** Puts the items in the order the server sent them, each placed against the item before it rather than a child index. */
function placeItemsInOrder(host: Element, ordered: readonly Element[]): void {
    let previous: Element | null = null;

    for (const element of ordered) {
        const expected: Element | null = previous === null
            ? getRealItemElements(host)[0] ?? trailingWindowSpacer(host)
            : previous.nextElementSibling;

        if (element !== expected)
            host.insertBefore(element, expected);

        previous = element;
    }
}

/** The bottom window spacer at the end of `host`, when it carries one. */
function trailingWindowSpacer(host: Element): Element | null {
    const last = host.lastElementChild;

    return last !== null && last.hasAttribute(WindowSpacerAttribute) && last.getAttribute(WindowSpacerAttribute) !== "top" ? last : null;
}

/** The first items host under `part` not drawn from yet, in the page's order: a list drawn may add hosts of its own under it. */
export function nextHost(part: Element, done: ReadonlySet<Element>): Element | null {
    for (const host of part.querySelectorAll(`[${ItemsHostAttribute}]`)) {
        if (!done.has(host))
            return host;
    }

    return null;
}

/** The compiled component a Dynamic binding parameter names; for a wrapped item that is the child inside the key-carrying wrapper. */
function resolveScopeComponentId(element: Element): number {
    const own = readComponentId(element);

    if (own > 0)
        return own;

    const child = element.firstElementChild;

    return child === null ? 0 : readComponentId(child);
}

/** The row of the key among a host's rows, or null. */
export function findItemElement(present: readonly Element[], key: string): Element | null {
    return present.find(row => row.getAttribute(ComponentKeyAttribute) === key) ?? null;
}

/** The host's rows by key, read once: a lookup per key by selector walks the host's subtree, which is quadratic over a list. */
function indexItemElements(host: Element, present: readonly Element[] = getRealItemElements(host)): Map<string, Element> {
    const rows = new Map<string, Element>();

    for (const element of present) {
        const key = element.getAttribute(ComponentKeyAttribute);

        if (key !== null && !rows.has(key))
            rows.set(key, element);
    }

    return rows;
}
