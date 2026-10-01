// An items view's or a table's rows put in another order by the reader: dragged between rows, or moved a place by Alt+Up and
// Alt+Down. The row raises `move` with the index it takes and stands there at once; the controller moves it in its collection, and
// the answer says where it stays — the collection's Move leaves it there or puts it where the controller did, and a move the answer
// does not carry puts it back (`PendingMoves`). The tree's drag is the model: the same marks, the same event, the same refusals.
// A grouped view's row moves within its own group: the group is read off the row, so a move across one would regroup it.
// A host dragged by grips (`DragHandle`) lifts a row only by its grip, and the rest of the row keeps its text and presses.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    GroupAttribute, GroupHeaderAttribute, ItemsHostAttribute, NoRowDragAttribute, RowDropAttribute, RowGripClass, RowsDraggableAttribute,
    RowsDragHandleAttribute, UndraggableAttribute
} from "../addressing/dom-attributes.ts";
import { findOwningComponentId } from "../addressing/dom-registry.ts";
import type { EventRegistration } from "../events/event-descriptor.ts";
import { getRealItemElements } from "../items/items-empty-renderer.ts";
import { getActiveSorts, readItemsQuery } from "../items/items-filter-sort.ts";
import { resolveHostMode, windowOffset } from "../items/items-host-mode.ts";
import { getSourceOrder } from "../items/items-source-order.ts";
import type { PendingMove, PendingMoves } from "../items/pending-moves.ts";
import type { MetadataIndex } from "../metadata/metadata-index.ts";
import type { PropertyStateStore } from "../state/property-state-store.ts";
import { clearDragMarks, markDragStart } from "./drag-marks.ts";
import { isInert, isItemDisabled } from "./interactive-state.ts";
import { ownControlOf } from "./own-control.ts";
import { dispatchRowEvent, focusedRow, rowKeyTarget, setRowFocus } from "./row-cursor.ts";
import { hostOf, rowBox, rowKey, SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";

const RootSelector = ".ui-items-view, .ui-table";
const RowSelector = ".ui-items-view__item, .ui-table__row";
const DraggingClass = "ui-row--dragging";
// Written on the marked row's box: how far out from its edge the drop line's middle stands (ui-items-view.less).
const RowDropOffsetVariable = "--ui-row-drop-offset";
const MoveEventName = "move";

/** Where a row lands beside another: before it or after it, along the way the rows run. */
export type DropSide = "before" | "after";

/** A place between rows: the side of the row it is marked on. */
type Place = {
    readonly anchor: HTMLElement;
    readonly side: DropSide;
};

/** How a host's rows run: across (a horizontal list, a wrap's lines) or down, and across from the right in a right-to-left one. */
type Flow = {
    readonly across: boolean;
    readonly rightToLeft: boolean;
};

/** What a row's `move` carries past its keys: the index it takes in its collection. */
type ItemMoveDetail = {
    readonly index: number;
};

/** What a row's move asks of the rows moved ahead: the row put in its new place now, and settled once its command is answered. */
export type MovesAhead = Pick<PendingMoves, "ahead" | "settle">;

/**
 * How the pipeline reads a row's `move`: the index rides after the row's own keys, where `UIAction.ArgEventValue` reads it. Once the
 * pipeline takes it, the row stands at that index ahead of the command, and the command's answer settles it; with no `moves`, the
 * row waits for the server.
 */
export function itemMoveEvent(moves?: MovesAhead): { readonly name: string; readonly registration: Omit<EventRegistration, "name"> } {
    const pending = new WeakMap<Event, PendingMove>();

    return {
        name: MoveEventName,
        registration: {
            // A tree's `move` carries nothing and keeps its chain: its target travels on the node's own two-way value.
            dynamicParameters: context => {
                const index = moveIndexOf(context.domEvent);

                return index === null ? null : [...context.dynamicParameters, index];
            },
            // Not at the drop: a move no command or interaction takes would stand with no answer to put it back.
            started: context => {
                const index = moveIndexOf(context.domEvent);
                const row = index === null || !(context.domEvent.target instanceof Element) ? null : context.domEvent.target.closest<HTMLElement>(RowSelector);
                const host = row?.parentElement ?? null;

                if (moves === undefined || index === null || row === null || host === null || !host.hasAttribute(ItemsHostAttribute))
                    return;

                const move = moves.ahead(host, rowKey(row), index);

                if (move !== null)
                    pending.set(context.domEvent, move);
            },
            completed: context => {
                const move = pending.get(context.domEvent);

                if (move !== undefined)
                    moves?.settle(move);
            }
        }
    };
}

/** The index a row's `move` carries; null for a tree's, which carries none. */
function moveIndexOf(domEvent: Event): number | null {
    const index = domEvent instanceof CustomEvent ? (domEvent.detail as Partial<ItemMoveDetail> | null)?.index : undefined;

    return typeof index === "number" ? index : null;
}

/** The rules and the values the engine reads: whether a sort orders a host, and a virtualized host's whole collection. */
export type ItemsReorderServices = {
    readonly metadata: MetadataIndex;
    readonly state: PropertyStateStore;
    readonly keysOf: (host: Element) => readonly string[] | null;
};

export type ItemsReorderEngineOptions = {
    readonly root?: ParentNode;
    /** Without these no sort is seen and a virtualized host is read as its drawn rows — a test's host. */
    readonly services?: ItemsReorderServices;
};

/** The row in the air, the host it belongs to and the root that lets it move. */
type Drag = {
    readonly root: HTMLElement;
    readonly host: HTMLElement;
    readonly row: HTMLElement;
};

export class ItemsReorderEngine {
    private readonly root: ParentNode;
    private readonly services: ItemsReorderServices | undefined;
    private drag: Drag | null = null;

    // The box a press made draggable, given back its own state once the gesture is over.
    private lifted: HTMLElement | null = null;

    public constructor(options: ItemsReorderEngineOptions = {}) {
        this.root = options.root ?? document;
        this.services = options.services;

        // Draggable only under a press: a row that is always draggable takes the text selection from every cell in it.
        this.root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent), true);
        this.root.addEventListener("pointerup", () => this.release(), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("dragstart", domEvent => this.handleDragStart(domEvent), true);
        this.root.addEventListener("dragover", domEvent => this.handleDragOver(domEvent), true);
        this.root.addEventListener("dragleave", domEvent => this.handleDragLeave(domEvent), true);
        this.root.addEventListener("drop", domEvent => this.handleDrop(domEvent), true);
        this.root.addEventListener("dragend", () => this.endDrag(), true);
    }

    /** A press that lifts a row of a host whose rows move makes the row's box draggable until the gesture ends. */
    private handlePointerDown(domEvent: Event): void {
        this.release();

        if (!(domEvent instanceof PointerEvent) || domEvent.button !== 0 || !(domEvent.target instanceof Element))
            return;

        const found = this.movableRow(domEvent.target);
        const box = found === null ? null : rowBox(found.row);

        if (found === null || box === null)
            return;

        const grip = shownGrip(found.root, found.row);

        if (grip === null ? !liftsWhole(domEvent.target, found.row) : !grip.contains(domEvent.target))
            return;

        // The grip is no stop of its own: a press on it gives the keyboard to the host, on its row, as a click on a row does.
        if (grip !== null) {
            setRowFocus(found.root, shownRows(found.row.parentElement ?? found.root), found.row);
            found.root.focus({ preventScroll: true });
        }

        if (!box.draggable) {
            box.draggable = true;
            this.lifted = box;
        }
    }

    /** Takes back the draggable a press gave, when the gesture that needed it is over. */
    private release(): void {
        if (this.lifted !== null && this.drag === null) {
            this.lifted.draggable = false;
            this.lifted = null;
        }
    }

    /** The nearest row an element stands in, where its host's rows may move now and the row allows it; null otherwise. */
    private movableRow(target: Element): { readonly root: HTMLElement; readonly row: HTMLElement } | null {
        // The nearest row of any host, a tree's included: a press in a nested list's row is that list's, not the row around it.
        const row = target.closest<HTMLElement>(SelectionRowSelector);
        const host = row?.parentElement ?? null;
        const root = host?.closest<HTMLElement>(SelectionRootSelector) ?? null;

        if (row === null || host === null || root === null || !row.matches(RowSelector) || !host.hasAttribute(ItemsHostAttribute) || !root.hasAttribute(RowsDraggableAttribute))
            return null;

        if (isInert(root) || row.hasAttribute(UndraggableAttribute) || isItemDisabled(row) || this.isSorted(root, host))
            return null;

        return { root, row };
    }

    /** Whether a sort orders the host's rows now: a drop would be put back by it, so no row moves. */
    private isSorted(root: HTMLElement, host: HTMLElement): boolean {
        const componentId = findOwningComponentId(root);

        if (this.services === undefined || componentId === null)
            return false;

        return getActiveSorts(this.services.metadata.getItemsFilterSortMetadata(componentId), this.services.state, readItemsQuery(host)).length > 0;
    }

    private handleDragStart(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const found = this.movableRow(domEvent.target);
        const host = found?.row.parentElement ?? null;
        const box = found === null ? null : rowBox(found.row);

        // A drag from inside a row that is not the row's own lift — a picture, a link, a control's text — is left to it.
        if (found === null || host === null || box === null || domEvent.target !== box)
            return;

        this.drag = { root: found.root, host, row: found.row };
        // On the box: a wrap's row has none of its own for the ghost's fade to show on.
        markDragStart(domEvent, found.root, box, DraggingClass, rowKey(found.row));
    }

    /** Over a row of the dragged row's host, or its empty room past the last: the drop is taken and the side it lands on marked. */
    private handleDragOver(domEvent: Event): void {
        const drag = this.drag;

        if (drag === null || !(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element) || !drag.host.contains(domEvent.target))
            return;

        const flow = flowOf(drag);
        const rows = shownRows(drag.host);
        const place = this.placeOf(drag, domEvent.target, domEvent, flow, rows);

        domEvent.preventDefault();

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = "move";

        if (place === null || this.indexOf(drag, place.anchor, place.side) === null)
            markDrop(drag.root, null);
        else
            markDrop(drag.root, place, lineOffset(rows, place, flow));
    }

    /**
     * The row a pointer is over, or the nearest one off the rows, and the side of it the dragged row lands on — one place between two
     * rows of a line, whichever of them the pointer is over or the gap between them.
     */
    private placeOf(drag: Drag, target: Element, point: { readonly clientX: number; readonly clientY: number }, flow: Flow, rows: readonly HTMLElement[]): Place | null {
        // The host's own group header is no row to land beside, nor the room past the last.
        if (target.closest(`[${GroupHeaderAttribute}]`)?.parentElement === drag.host)
            return null;

        let over = target.closest<HTMLElement>(SelectionRowSelector);

        // A row of a list nested in one of the host's rows stands for that row.
        while (over !== null && over.parentElement !== drag.host)
            over = over.parentElement?.closest<HTMLElement>(SelectionRowSelector) ?? null;

        // Off the rows — in the gap a spacing leaves between two as much as in the room past the last — the nearest row: read as past
        // the last row, the gap beside the dragged row flashed the line at the list's end.
        over ??= nearestRow(rows, point);

        if (over === null)
            return null;

        const rect = (rowBox(over) ?? over).getBoundingClientRect();
        const beforeMiddle = flow.across ? point.clientX < rect.left + rect.width / 2 : point.clientY < rect.top + rect.height / 2;

        // Along a row that reads right to left, the start is the right-hand side.
        if (beforeMiddle === flow.rightToLeft)
            return { anchor: over, side: "after" };

        // Before a row is after the one drawn ahead of it, where that one stands in its group and on its line: one place, one line.
        const previous = rows[rows.indexOf(over) - 1];

        return previous !== undefined && sameRun(previous, over, flow) ? { anchor: previous, side: "after" } : { anchor: over, side: "before" };
    }

    /** The index the dragged row takes beside the anchor, or null where it would not move or the anchor is another group's. */
    private indexOf(drag: Drag, anchor: HTMLElement, side: DropSide): number | null {
        if (groupOf(anchor) !== groupOf(drag.row))
            return null;

        const index = movedIndex(this.orderOf(drag.host), rowKey(drag.row), rowKey(anchor), side);

        return index === null ? null : index + windowOffset(drag.host);
    }

    /** Every item's key in the collection's order: the values a virtualized host holds, the source order of a host holding its rows. */
    private orderOf(host: HTMLElement): string[] {
        switch (resolveHostMode(host)) {
            case "virtualized":
                return [...(this.services?.keysOf(host) ?? getRealItemElements(host).map(rowKey))];
            case "windowed":
                // The window's rows stand in the query's order; the offset places them in the whole.
                return getRealItemElements(host).map(rowKey);
            default:
                return getSourceOrder(host, getRealItemElements(host)).map(rowKey);
        }
    }

    /** Leaving the host altogether clears the mark; a move between its rows is followed by a dragover that marks the next place. */
    private handleDragLeave(domEvent: Event): void {
        const drag = this.drag;

        if (drag !== null && domEvent instanceof DragEvent && !(domEvent.relatedTarget instanceof Node && drag.host.contains(domEvent.relatedTarget)))
            markDrop(drag.root, null);
    }

    private handleDrop(domEvent: Event): void {
        const drag = this.drag;

        if (drag === null || !(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element) || !drag.host.contains(domEvent.target))
            return;

        domEvent.preventDefault();

        const place = this.placeOf(drag, domEvent.target, domEvent, flowOf(drag), shownRows(drag.host));
        const index = place === null ? null : this.indexOf(drag, place.anchor, place.side);

        this.endDrag();

        if (index !== null)
            dispatchRowEvent(drag.row, MoveEventName, { index } satisfies ItemMoveDetail);
    }

    private endDrag(): void {
        const drag = this.drag;

        this.drag = null;
        this.release();

        if (drag === null)
            return;

        clearDragMarks(drag.root, DraggingClass);
        markDrop(drag.root, null);
    }

    /** Alt+Up and Alt+Down move the keyboard's row one place past the row drawn beside it, as a drop there would. */
    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !domEvent.altKey || domEvent.ctrlKey || domEvent.metaKey || domEvent.shiftKey)
            return;

        if ((domEvent.key !== "ArrowUp" && domEvent.key !== "ArrowDown") || !(domEvent.target instanceof Element))
            return;

        const found = rowKeyTarget(domEvent.target);

        if (found === null || !found.root.matches(RootSelector) || (found.row !== null && ownControlOf(domEvent.target, found.row) !== null))
            return;

        const host = hostOf(found.root);
        const rows = host === null ? [] : shownRows(host);
        const current = focusedRow(rows);

        if (host === null || current === null || this.movableRow(current) === null)
            return;

        // Taken whether or not the row moves: at an end the keys do nothing rather than walk the cursor or leave the page.
        domEvent.preventDefault();

        const at = rows.indexOf(current);
        const up = domEvent.key === "ArrowUp";
        const anchor = rows[up ? at - 1 : at + 1];
        const index = anchor === undefined ? null : this.indexOf({ root: found.root, host, row: current }, anchor, up ? "before" : "after");

        if (index !== null)
            dispatchRowEvent(current, MoveEventName, { index } satisfies ItemMoveDetail);
    }
}

/**
 * The index the row keyed `key` takes in `order` — every key, in the collection's order — once it is put on `side` of the row keyed
 * `anchor`; null where it stays where it is or either key is not there.
 */
export function movedIndex(order: readonly string[], key: string, anchor: string, side: DropSide): number | null {
    const from = order.indexOf(key);

    if (from < 0 || key === anchor)
        return null;

    const rest = order.filter(candidate => candidate !== key);
    const at = rest.indexOf(anchor);

    if (at < 0)
        return null;

    const index = side === "before" ? at : at + 1;

    return index === from ? null : index;
}

/** The grip a row is lifted by alone, where its host drags by grips and shows it; null where the whole row lifts (a wrapped tile's). */
function shownGrip(root: HTMLElement, row: HTMLElement): HTMLElement | null {
    const grip = root.hasAttribute(RowsDragHandleAttribute) ? row.querySelector<HTMLElement>(`:scope > .${RowGripClass}`) : null;

    return grip !== null && grip.getClientRects().length > 0 ? grip : null;
}

/** Whether a press there lifts a row with no grip: anywhere of the row's own, not a control in it nor a part it is never dragged by. */
function liftsWhole(target: Element, row: HTMLElement): boolean {
    return ownControlOf(target, row) === null && target.closest(`[${NoRowDragAttribute}]`) === null;
}

/** The group a row stands in, the one with no header for a row with none; every row of an ungrouped view is in the same. */
function groupOf(row: Element): string {
    return row.getAttribute(GroupAttribute) ?? "";
}

/** How the host's rows run, read off its root and its direction. */
function flowOf(drag: Drag): Flow {
    const across = drag.root.matches(".ui-orientation--horizontal, .ui-items-view--wrap");

    return { across, rightToLeft: across && getComputedStyle(drag.host).direction === "rtl" };
}

/** Whether two rows drawn one after the other share a place between them: in one group and, across, on one line. */
function sameRun(first: HTMLElement, second: HTMLElement, flow: Flow): boolean {
    if (groupOf(first) !== groupOf(second))
        return false;

    if (!flow.across)
        return true;

    const a = (rowBox(first) ?? first).getBoundingClientRect();
    const b = (rowBox(second) ?? second).getBoundingClientRect();

    return a.top < b.bottom && b.top < a.bottom;
}

/**
 * How far out from the marked edge the line's middle stands: half the gap to the row beyond it, so the line sits in the middle of a
 * spacing and on the edge with none; with no row beyond (the list's ends, a group's), a pixel in, so the line stays inside the row.
 */
function lineOffset(rows: readonly HTMLElement[], place: Place, flow: Flow): number {
    const next = place.side === "after" ? rows[rows.indexOf(place.anchor) + 1] : undefined;

    if (next === undefined || !sameRun(place.anchor, next, flow))
        return -1;

    const box = (rowBox(place.anchor) ?? place.anchor).getBoundingClientRect();
    const beyond = (rowBox(next) ?? next).getBoundingClientRect();
    const gap = !flow.across ? beyond.top - box.bottom : flow.rightToLeft ? box.left - beyond.right : beyond.left - box.right;

    return Math.max(gap, 0) / 2;
}

/** The row whose box stands nearest the point, the first of two as near; null with none. */
function nearestRow(rows: readonly HTMLElement[], point: { readonly clientX: number; readonly clientY: number }): HTMLElement | null {
    let nearest: HTMLElement | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const row of rows) {
        const rect = (rowBox(row) ?? row).getBoundingClientRect();
        const dx = Math.max(rect.left - point.clientX, 0, point.clientX - rect.right);
        const dy = Math.max(rect.top - point.clientY, 0, point.clientY - rect.bottom);
        const distance = dx * dx + dy * dy;

        if (distance < nearestDistance) {
            nearest = row;
            nearestDistance = distance;
        }
    }

    return nearest;
}

/** The host's rows a reader sees, in the order they are drawn: a row a filter hid or a fold took is no place to land beside. */
function shownRows(host: Element): HTMLElement[] {
    return getRealItemElements(host).filter((row): row is HTMLElement => row instanceof HTMLElement && row.matches(RowSelector) && rowBox(row) !== null);
}

/** Marks the side of the row the dragged one lands on, on the row's box, and takes the mark off every other row of the root. */
function markDrop(root: HTMLElement, place: Place | null, offset = 0): void {
    const box = place === null ? null : rowBox(place.anchor);

    for (const marked of root.querySelectorAll<HTMLElement>(`[${RowDropAttribute}]`)) {
        if (marked !== box) {
            marked.removeAttribute(RowDropAttribute);
            marked.style.removeProperty(RowDropOffsetVariable);
        }
    }

    if (box === null || place === null)
        return;

    if (box.getAttribute(RowDropAttribute) !== place.side)
        box.setAttribute(RowDropAttribute, place.side);

    const value = `${offset}px`;

    if (box.style.getPropertyValue(RowDropOffsetVariable) !== value)
        box.style.setProperty(RowDropOffsetVariable, value);
}
