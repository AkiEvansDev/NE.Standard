// Items in the air between hosts: what a list, a table or a tree offering its rows as a kind (`DragKind`) hands a drop target while
// a drag lasts — one drag at a time on a page, so one record, set as the drag starts and cleared as it ends. The hosts' own engines
// start it; item-drag-engine.ts reads it where the drag goes.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { DragEffectsAttribute, DragKindAttribute, DragSourceAttribute, UndraggableAttribute } from "../addressing/dom-attributes.ts";
import { isItemDisabled, isItemRefused } from "./interactive-state.ts";
import { rowBox, rowKey, selectedRows } from "./row-selection.ts";

// The type a drag of offered items carries beside its text: a drag without it — a file from the desktop, or one whose end never
// reached the page because its row was drawn again meanwhile — is not the items in the air.
const ItemDragType = "application/x-ne-items";

/** What a drop does with the items: they leave the source, or the target takes a copy. */
export type ItemDropEffect = "move" | "copy";

/** Items offered as a kind, from one host: its root and items host, the rows and their keys, and what a drop may do with them. */
export type ItemDrag = {
    readonly kind: string;
    readonly root: HTMLElement;
    readonly host: HTMLElement;
    readonly rows: readonly HTMLElement[];
    readonly keys: readonly string[];
    readonly effects: ReadonlySet<ItemDropEffect>;
    /** The id the view gave the source host, or null for one given none. */
    readonly source: string | null;
};

let current: ItemDrag | null = null;
// What the engine that started the drag does as it ends — its marks off, its lift given back — run once, whoever ends it.
let ending: (() => void) | null = null;

/** The items a host offers from the given rows, or null where it offers none (no kind, or neither effect allowed). */
export function offeredItems(root: HTMLElement, host: HTMLElement, rows: readonly HTMLElement[]): ItemDrag | null {
    const kind = root.getAttribute(DragKindAttribute);
    const effects = new Set((root.getAttribute(DragEffectsAttribute) ?? "").split(" ").filter((effect): effect is ItemDropEffect => effect === "move" || effect === "copy"));

    if (kind === null || kind.length === 0 || effects.size === 0 || rows.length === 0)
        return null;

    return { kind, root, host, rows, keys: rows.map(rowKey), effects, source: root.getAttribute(DragSourceAttribute) };
}

/** The rows a drag of the row carries: where the row is chosen, the chosen ones that may be lifted, in the order drawn; else the row alone. */
export function carriedRows(row: HTMLElement, shown: readonly HTMLElement[]): HTMLElement[] {
    const chosen = selectedRows(shown);

    return chosen.includes(row) ? chosen.filter(other => other === row || isLiftable(other)) : [row];
}

/** Whether a row may be dragged at all: not refused (`Undraggable`, by its item or its template) and not disabled. */
export function isDraggableRow(row: HTMLElement): boolean {
    return !isItemRefused(row, UndraggableAttribute) && !isItemDisabled(row);
}

/** Whether a row may be lifted now: draggable, and drawn — one folded away would move unseen. */
export function isLiftable(row: HTMLElement): boolean {
    return isDraggableRow(row) && rowBox(row) !== null;
}

/** What a drag of a host's rows allows: the effects it offers them for, and a move wherever its rows also move among themselves. */
export function allowedEffect(drag: ItemDrag | null, movesOwn: boolean): DataTransfer["effectAllowed"] {
    const copy = drag?.effects.has("copy") === true;
    const move = movesOwn || drag?.effects.has("move") === true;

    return copy && move ? "copyMove" : copy ? "copy" : "move";
}

/** Starts a drag of the given items, or of none, which clears what an earlier drag left; `end` is the starting engine's own end. */
export function beginItemsDrag(domEvent: Event, drag: ItemDrag | null, end: (() => void) | null = null): void {
    current = drag;
    ending = drag === null ? null : end;

    if (drag !== null && domEvent instanceof DragEvent && domEvent.dataTransfer !== null)
        domEvent.dataTransfer.setData(ItemDragType, drag.kind);
}

/** The items a drag event carries: the offered items in the air, where the drag is theirs; null for any other drag. */
export function currentItemDrag(domEvent: DragEvent): ItemDrag | null {
    return current !== null && domEvent.dataTransfer?.types.includes(ItemDragType) === true ? current : null;
}

/**
 * Ends the drag in the air and runs the starting engine's end: at dragend, or at the drop, before a transfer takes the source's rows
 * off the page — a dragend fired at a row no longer on it never reaches a listener, and the row would come back still faded.
 */
export function endItemDrag(): void {
    const end = ending;

    current = null;
    ending = null;
    end?.();
}
