// Choosing rows in an items view, a table or a tree by click or key; the tree walks its own rows, since its arrows also fold. A
// table acting as a grid walks its cells as well (row-cursor.ts). How a gesture changes the chosen set is `row-selection.ts`'s.

// `.ts` on the value imports: `node --test` runs this module directly.
import {
    ItemsHostAttribute, NoRowOpenAttribute, NoRowSelectAttribute, RowFocusAttribute, RowsRemoveAttribute, SelectedKeyAttribute, SelectedKeysAttribute, SelectionAttribute,
    TableScrollClass, TabOutAttribute, UnremovableAttribute, WindowMoreAfterAttribute, WindowMoreBeforeAttribute, WindowPagedAttribute, WindowPendingAttribute,
    WindowTotalAttribute
} from "../addressing/dom-attributes.ts";
import { readWindowFlag, readWindowNumber, resolveHostMode, windowOffset } from "../items/items-host-mode.ts";
import { readHostScroll, scrollHostTo } from "../items/items-viewport.ts";
import { isFieldKey } from "./caret-fields.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isOwnControlOf, ownControlOf, ownPressControlsOf, soleControlOf } from "./own-control.ts";
import { bringBackToTabOrder, takeOutOfTabOrder } from "./tab-out.ts";
import { FocusableSelector, firstFocusable, focusAsLastInput, isPointerLast, markPointerFocus } from "./popup-focus.ts";
import { isInert, isItemDisabled, isItemRefused } from "./interactive-state.ts";
import type { RowAxis } from "./row-cursor.ts";
import {
    cellAcrossLines, cellAlongRow, cellOf, claimCellKey, columnCellOf, cursorCellOf, cursorColumnOf, dispatchRowEvent, enterRowCursor, focusedRow, hostKeyTarget, isRowKey,
    isSpanningCell, lastSpanningCell, litRow, resolveRowTarget, RowPressEventName, setRowFocus, waitingCursorKey, walksCells
} from "./row-cursor.ts";
import {
    chooseRow, choosesOnEnter, ensureAnchor, gestureOf, hostOf, KeyboardRowsRootSelector as KeyboardRootSelector, keyGestureOf, markSelectedRows, PlainGesture,
    ownRows, rowKey, selectedRows, SelectionRootSelector as RootSelector, SelectionRowSelector as ItemSelector, setAnchor
} from "./row-selection.ts";
import type { HeldRange, SelectionGesture } from "./row-selection.ts";
import { applyHeaderStops, enterHeader, handleHeaderKey, headerTableOf } from "./table-header-group.ts";
import { typeAheadCharacter } from "./type-ahead.ts";

// The keys besides the arrows this engine answers; any other passes without the rows being read.
const ActionKeys = new Set([" ", "Enter", "Delete"]);

const TableRootSelector = ".ui-table";

// The keys a grid's cursor cell answers before its rows do, a typed character besides.
const CellKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", "F2", " "]);

// A host's own boxes: its rows' host and a table's scrolling box, either of which may be the element that scrolls.
const HostBoxSelector = `:scope > [${ItemsHostAttribute}], :scope > .${TableScrollClass}, :scope > .${TableScrollClass} > [${ItemsHostAttribute}]`;

/** A virtualized host's rows past the drawn ones: the keys its rules show, in order, a Shift range over them, and one drawn on demand. */
export type HeldRows = {
    shownKeysOf(host: Element): readonly string[] | null;
    rangeKeysOf(host: Element, from: string, to: string): readonly string[] | null;
    reveal(host: Element, key: string, edge: "start" | "end" | "nearest"): Element | null;
};

export type ItemsSelectionEngineOptions = {
    readonly root?: ParentNode;
    /** Without it a virtualized host is walked over its drawn rows alone — a test's host. */
    readonly rows?: HeldRows;
};

/** The end of a windowed host's collection Home or End is reaching, its window still on its way. */
type WindowEnd = "first" | "last";

export class ItemsSelectionEngine {
    private readonly root: ParentNode;
    private readonly rows: HeldRows | undefined;

    // The host boxes the press under way took out of the focus's way (handlePointerDown).
    private pressedBoxes: HTMLElement[] = [];

    // The roots whose Home or End waits for a window holding that end (reachWindowEnd), until it is drawn or another key comes.
    private readonly windowEnds = new WeakMap<HTMLElement, WindowEnd>();

    public constructor(options: ItemsSelectionEngineOptions = {}) {
        this.root = options.root ?? document;
        this.rows = options.rows;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(RootSelector));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));
        this.root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent), true);
        // A press's focus lands at its mousedown, which a finger's tap raises after its pointerup; a drag or a scroll cancels the pointer,
        // and a finger held for the context menu raises no mouse events at all.
        this.root.addEventListener("mouseup", () => this.restoreBoxes(), true);
        this.root.addEventListener("pointercancel", () => this.restoreBoxes(), true);
        this.root.addEventListener("contextmenu", () => this.restoreBoxes(), true);

        // A pushed key, a re-rendered row and a switched mode all land as mutations with the same answer; a window read ending, too.
        observeComponents(
            this.root,
            RootSelector,
            { childList: true, attributeFilter: [SelectionAttribute, SelectedKeyAttribute, SelectedKeysAttribute, WindowPendingAttribute] },
            roots => this.applyAll(roots)
        );

        // The cursor moved by any engine, a removal or a redraw: the controls of the row it left leave the Tab order, the new row's join it.
        if (this.root instanceof Node) {
            new MutationObserver(records => this.followCursor(records)).observe(this.root, { subtree: true, attributes: true, attributeFilter: [RowFocusAttribute] });
        }
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots)
            this.apply(root);
    }

    /**
     * Marks the chosen rows from whichever keys the mode reads; the root is a tab stop from the renderer, whatever the mode, and the
     * host's one. A row that is one control (a tile that is a button) is pressed through the cursor, and a part of a row that answers a
     * press itself (a grid's chevron or checkbox) is reached by the row's keys, so neither is a stop of its own; a table's header is
     * reached from its rows.
     */
    private apply(root: HTMLElement): void {
        const rows = ownRows(root);

        markSelectedRows(root, rows);

        // The browser makes a scrolling box with no stop inside it a stop of its own.
        for (const box of root.querySelectorAll<HTMLElement>(HostBoxSelector))
            leaveTabOrder(box);

        if (!root.matches(KeyboardRootSelector))
            return;

        if (root.matches(TableRootSelector))
            applyHeaderStops(root);

        for (const row of rows) {
            const control = soleControlOf(row);

            if (control !== null)
                leaveTabOrder(control);

            for (const own of ownPressControlsOf(row))
                leaveTabOrder(own);

            stepRowControls(root, row, row.hasAttribute(RowFocusAttribute));
        }

        const end = this.windowEnds.get(root);

        if (end !== undefined)
            this.settleWindowEnd(root, rows, end);
    }

    /**
     * Lands the cursor on the end Home or End asked a windowed host for, once a window holding it is drawn and no read is under way;
     * a source that cannot count has no end to wait for, so the first window read after the scroll is the end there is.
     */
    private settleWindowEnd(root: HTMLElement, rows: readonly HTMLElement[], end: WindowEnd): void {
        const host = hostOf(root);

        if (host === null || host.hasAttribute(WindowPendingAttribute))
            return;

        const counts = readWindowNumber(host, WindowTotalAttribute) !== null;
        const reached = end === "first"
            ? windowOffset(host) === 0 && !readWindowFlag(host, WindowMoreBeforeAttribute)
            : !readWindowFlag(host, WindowMoreAfterAttribute);

        if (counts && !reached)
            return;

        this.windowEnds.delete(root);

        const target = resolveRowTarget(end === "first" ? "Home" : "End", rows, null, axisOf(root));

        if (target === null)
            return;

        setRowFocus(root, rows, target);

        if (root.getAttribute(SelectionAttribute) === "one")
            chooseRow(root, rows, target, PlainGesture);
    }

    private handleClick(domEvent: Event): void {
        const resolved = this.resolveRow(domEvent, RootSelector);

        if (resolved === null || !(domEvent instanceof MouseEvent))
            return;

        const { root, item } = resolved;
        const rows = ownRows(root);

        // The cursor follows the pointer so the arrows carry on from the clicked row, a grid's from its cell; the host takes the focus, as
        // a file manager's list does.
        setRowFocus(root, rows, item, domEvent.target instanceof Element ? cellOf(item, domEvent.target) : null);
        root.focus({ preventScroll: true });

        // A host choosing by a control of its own (a grid's checkboxes) leaves the click; its keyboard's Shift ranges from the clicked row.
        if (root.hasAttribute(NoRowSelectAttribute)) {
            setAnchor(root, item);
            return;
        }

        // A row that refuses to be chosen leaves the click to whatever else the row does.
        if (chooseRow(root, rows, item, gestureOf(domEvent), this.heldRange(root)))
            domEvent.preventDefault();
    }

    /** The row a press landed in and the host that owns it: a list nested in another's row must not choose the outer one. */
    private resolveRow(domEvent: Event, rootSelector: string): { readonly root: HTMLElement; readonly item: HTMLElement } | null {
        if (!(domEvent.target instanceof Element))
            return null;

        const item = domEvent.target.closest<HTMLElement>(ItemSelector);
        const root = item?.closest<HTMLElement>(RootSelector) ?? null;

        if (item === null || root === null || item.closest(RootSelector) !== root || !root.matches(rootSelector) || isInert(root))
            return null;

        return ownControlOf(domEvent.target, item) === null && !isItemDisabled(item) ? { root, item } : null;
    }

    /** A Shift range over a virtualized host's rows drawn or not, so a range to its far end takes every row between; none in a test's host. */
    private heldRange(root: HTMLElement): HeldRange | undefined {
        const rows = this.rows;
        const host = hostOf(root);

        return rows === undefined || host === null ? undefined : (from, to) => rows.rangeKeysOf(host, from, to);
    }

    /** Opens a row double-clicked anywhere but on its own controls, as Enter does, unless the cell edits on a double click. */
    private handleDoubleClick(domEvent: Event): void {
        const resolved = this.resolveRow(domEvent, KeyboardRootSelector);

        if (resolved === null || (domEvent.target instanceof Element && resolved.item.contains(domEvent.target.closest(`[${NoRowOpenAttribute}]`))))
            return;

        domEvent.preventDefault();
        dispatchRowEvent(resolved.item, "open");
    }

    private handleKeyDown(domEvent: Event): void {
        // Alt with an arrow moves the row itself where the host's rows move (items-reorder-engine.ts), never the cursor.
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.altKey || !(domEvent.target instanceof Element) || isFieldKey(domEvent))
            return;

        // A table's header is a group of its own, walked by its own keys and left by Down for the rows.
        const header = headerTableOf(domEvent.target);

        if (header !== null && !isInert(header)) {
            if (handleHeaderKey(domEvent, header, column => this.enterRows(header, column)))
                domEvent.preventDefault();

            return;
        }

        // The nearest host of any kind, so a tree in a list's row keeps its arrows; a key in a row's control or the host's chrome is theirs.
        const found = hostKeyTarget(domEvent);

        if (found === null)
            return;

        const { root } = found;

        if (!root.matches(KeyboardRootSelector) || isInert(root))
            return;

        if (walksCells(root) && isCellKey(domEvent) && this.handleCellKey(root, domEvent))
            return;

        const axis = axisOf(root);

        if (!ActionKeys.has(domEvent.key) && !isRowKey(domEvent.key, axis))
            return;

        // Any key the rows answer lets go of an end the keyboard was waiting for.
        this.windowEnds.delete(root);

        if (this.reachWindowEnd(root, domEvent)) {
            domEvent.preventDefault();
            return;
        }

        this.bringRowsIn(root, domEvent.key);

        const rows = ownRows(root);
        const current = focusedRow(rows);
        const next = resolveRowTarget(domEvent.key, rows, litRow(rows), axis);

        if (next !== null) {
            domEvent.preventDefault();
            // Up from the row below lands on a grid row's last line: the detail spanning it, where one is open.
            setRowFocus(root, rows, next, domEvent.key === "ArrowUp" && !domEvent.shiftKey && walksCells(root) ? lastSpanningCell(next) : null);

            chooseOnMove(root, rows, current, next, keyGestureOf(root, domEvent), this.heldRange(root));
            return;
        }

        // Up past the first row, or in a table with no row to stand on, goes to its header, as the grid pattern's Up from a top cell does.
        if (domEvent.key === "ArrowUp" && !domEvent.shiftKey && !domEvent.ctrlKey && !domEvent.metaKey && root.matches(TableRootSelector) && enterHeader(root, cursorColumnOf(root))) {
            domEvent.preventDefault();
            return;
        }

        if (current === null || isItemDisabled(current))
            return;

        // A row that is one control is pressed through the cursor, as a listbox of buttons is.
        const control = soleControlOf(current);

        switch (domEvent.key) {
            case " ":
                spaceRow(root, rows, current, control);
                break;
            case "Enter":
                enterRow(root, rows, current, control);
                break;
            case "Delete":
                if (!removeRows(root, rows, current))
                    return;

                break;
            default:
                return;
        }

        domEvent.preventDefault();
    }

    /**
     * A key on a grid's cursor cell: Left and Right, and Home and End, along the row; Up and Down between a row's lines (its cells, and a
     * detail spanning it); Enter, F2 and a typed character on the cell (`actOnCell`). False for a key the rows answer: Up and Down past
     * the row's lines, Ctrl with Home or End for the first or last row, Shift extending the choice, Space choosing the row.
     */
    private handleCellKey(root: HTMLElement, domEvent: KeyboardEvent): boolean {
        this.bringCursorRowIn(root);

        const rows = ownRows(root);
        const row = litRow(rows);

        if (row === null || isItemDisabled(row))
            return false;

        const cell = cursorCellOf(row);
        const plain = !domEvent.ctrlKey && !domEvent.metaKey && !domEvent.shiftKey;

        switch (domEvent.key) {
            case "ArrowLeft":
            case "ArrowRight":
            case "Home":
            case "End": {
                if (!plain)
                    return false;

                const target = cellAlongRow(root, row, cell, domEvent.key);

                if (target !== null)
                    setRowFocus(root, rows, row, target);

                // At the row's end too: the box must not scroll for a key the cursor spent.
                domEvent.preventDefault();

                return true;
            }
            case "ArrowDown":
            case "ArrowUp": {
                const target = plain ? cellAcrossLines(root, row, cell, domEvent.key === "ArrowDown") : null;

                if (target === null)
                    return false;

                domEvent.preventDefault();
                setRowFocus(root, rows, row, target);

                return true;
            }
            default:
                return cell !== null && actOnCell(cell, domEvent);
        }
    }

    /**
     * Home and End in a windowed host whose window does not hold that end of its collection: the host scrolls there, which reads the
     * window, and the cursor lands on the end row once it is drawn (`settleWindowEnd`). False where the drawn rows hold the end.
     */
    private reachWindowEnd(root: HTMLElement, domEvent: KeyboardEvent): boolean {
        const host = domEvent.key === "Home" || domEvent.key === "End" ? hostOf(root) : null;

        // A page stands on its own: its ends are the page's.
        if (host === null || resolveHostMode(host) !== "windowed" || host.hasAttribute(WindowPagedAttribute))
            return false;

        const first = domEvent.key === "Home";
        const held = first ? windowOffset(host) === 0 && !readWindowFlag(host, WindowMoreBeforeAttribute) : !readWindowFlag(host, WindowMoreAfterAttribute);

        if (held)
            return false;

        this.windowEnds.set(root, first ? "first" : "last");
        scrollHostTo(host, first ? 0 : readHostScroll(host).contentHeight);

        return true;
    }

    /**
     * In a virtualized host, draws the rows a key acts on before the walk reads them: the collection's first or last for Home and End,
     * a page past the cursor's row for the page keys, and the cursor's own row where it scrolled away.
     */
    private bringRowsIn(root: HTMLElement, key: string): void {
        const rows = this.rows;
        const host = rows === undefined ? null : hostOf(root);

        if (rows === undefined || host === null)
            return;

        const waiting = waitingCursorKey(root);

        switch (key) {
            case "Home":
            case "End": {
                // Read for these keys alone: the arrows of a key held down are not to copy a list of thousands each.
                const keys = rows.shownKeysOf(host);

                if (keys !== null && keys.length > 0)
                    rows.reveal(host, key === "Home" ? keys[0] : keys[keys.length - 1], "nearest");

                return;
            }
            case "PageDown":
            case "PageUp": {
                const lit = waiting === null ? litRow(ownRows(root)) : null;
                const current = waiting ?? (lit === null ? null : rowKey(lit));

                // The cursor's row at the far edge first, so the page the walk measures is drawn beyond it.
                if (current !== null)
                    rows.reveal(host, current, key === "PageDown" ? "start" : "end");

                return;
            }
            default:
                this.bringCursorRowIn(root);
        }
    }

    /** Draws a virtualized host's cursor row again where it scrolled out of view, for a key that acts on it. */
    private bringCursorRowIn(root: HTMLElement): void {
        const host = this.rows === undefined ? null : hostOf(root);
        const waiting = waitingCursorKey(root);

        if (host !== null && waiting !== null)
            this.rows?.reveal(host, waiting, "nearest");
    }

    /**
     * Down from a table's header: the keyboard back on the table, on the row it stood on, else the first, as an arrow puts it there — a
     * grid's in the column of the caption it left, `column`.
     */
    private enterRows(table: HTMLElement, column: string | null): void {
        const rows = ownRows(table);
        const row = litRow(rows) ?? resolveRowTarget("ArrowDown", rows, null, "vertical");

        table.focus({ preventScroll: true });

        if (row === null)
            return;

        setRowFocus(table, rows, row, columnCellOf(row, column));

        if (table.getAttribute(SelectionAttribute) === "one")
            chooseRow(table, rows, row, PlainGesture);
    }

    /**
     * A host's own box focused all the same (by a script, or a browser focusing a scrolling box by itself) hands the keyboard to the root;
     * the root reached from the keyboard shows its cursor at once; a control of a row taking the focus — pressed, or reached by Tab —
     * brings the cursor to its row, whose controls are the Tab order's.
     */
    private handleFocusIn(domEvent: Event): void {
        const box = domEvent.target instanceof HTMLElement && domEvent.target.matches(`[${ItemsHostAttribute}], .${TableScrollClass}`) ? domEvent.target : null;
        const root = box?.closest<HTMLElement>(RootSelector) ?? null;

        if (box !== null && root !== null && [...root.querySelectorAll(HostBoxSelector)].includes(box)) {
            focusAsLastInput(root);
            return;
        }

        // A press places the cursor on the row it lands on, or leaves none on the host's plain parts.
        if (domEvent.target instanceof HTMLElement && domEvent.target.matches(RootSelector) && domEvent.target.matches(KeyboardRootSelector) && !isInert(domEvent.target) && !isPointerLast()) {
            enterRowCursor(domEvent.target, ownRows(domEvent.target));
            return;
        }

        const row = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(ItemSelector) : null;
        const owner = row?.closest<HTMLElement>(RootSelector) ?? null;

        if (row === null || owner === null || row.hasAttribute(RowFocusAttribute) || !owner.matches(KeyboardRootSelector) || ownControlOf(domEvent.target, row) === null)
            return;

        // The browser brings a focused control into view itself.
        setRowFocus(owner, ownRows(owner), row, domEvent.target instanceof Element ? cellOf(row, domEvent.target) : null, false);
    }

    /**
     * A press in a host's own boxes focuses the root, not them: a box is focusable (`tabindex="-1"`, see `apply`) only to stay out of
     * the Tab order, and focused by the press it handed the focus back to the root mid-press, which cancelled the browser's drag of a
     * row and flashed the keyboard's wash on the cursor's row. The boxes are focusable again once the press's focus has landed.
     */
    private handlePointerDown(domEvent: Event): void {
        this.restoreBoxes();

        const target = domEvent.target instanceof Element ? domEvent.target : null;
        const root = target?.closest<HTMLElement>(RootSelector) ?? null;

        if (target === null || root === null)
            return;

        // The pointer's mark before the press's focus: the browser reads the style as the focus moves, ahead of the focus event, and a
        // root coming back from elsewhere drew the keyboard's wash on its last cursor row for that read, which then faded out. A press
        // that focuses a row's own control instead leaves the mark on an unfocused root, which nothing reads. A root focused already
        // is marked by the press itself (`notePress`), ahead of the click that moves its cursor.
        if (document.activeElement !== root)
            markPointerFocus(root, true);

        for (const box of root.querySelectorAll<HTMLElement>(HostBoxSelector)) {
            if (box.contains(target) && box.getAttribute("tabindex") === "-1") {
                box.removeAttribute("tabindex");
                this.pressedBoxes.push(box);
            }
        }
    }

    /** Puts the boxes a press took out of the focus's way back where `apply` keeps them. */
    private restoreBoxes(): void {
        for (const box of this.pressedBoxes)
            leaveTabOrder(box);

        this.pressedBoxes = [];
    }

    /** Keeps the Tab order on the cursor's row as the mark moves, in a host whose keyboard walks its rows. */
    private followCursor(records: readonly MutationRecord[]): void {
        for (const record of records) {
            const row = record.target;

            if (!(row instanceof HTMLElement) || !row.matches(ItemSelector))
                continue;

            const root = row.closest<HTMLElement>(RootSelector);

            if (root !== null && root.matches(KeyboardRootSelector))
                stepRowControls(root, row, row.hasAttribute(RowFocusAttribute));
        }
    }

}

/**
 * Leaves in the Tab order only the controls of the row the cursor is on, so a host of many rows with buttons is one stop and the lit
 * row's, not one per button; a control taken out keeps the tabindex it had, given back as the cursor comes to its row. A list nested in
 * the row is one control here, its own rows its own host's.
 */
function stepRowControls(root: HTMLElement, row: HTMLElement, cursor: boolean): void {
    if (cursor) {
        for (const control of row.querySelectorAll<HTMLElement>(`[${TabOutAttribute}]`)) {
            if (control.parentElement?.closest(RootSelector) === root)
                bringBackToTabOrder(control);
        }

        return;
    }

    for (const control of row.querySelectorAll<HTMLElement>(FocusableSelector)) {
        if (control.tabIndex >= 0 && control.parentElement?.closest(RootSelector) === root && isOwnControlOf(row, control))
            takeOutOfTabOrder(control);
    }
}

/** Takes an element out of the Tab order, focusable still; written only when it changes, so an observer is not woken for nothing. */
function leaveTabOrder(element: HTMLElement): void {
    if (element.getAttribute("tabindex") !== "-1")
        element.setAttribute("tabindex", "-1");
}

function isCellKey(domEvent: KeyboardEvent): boolean {
    return CellKeys.has(domEvent.key) || typeAheadCharacter(domEvent) !== null;
}

/**
 * Enter, F2, Space or a typed character on a grid's cursor cell: first offered to a package that edits the cell (`ui-cell-key`; never
 * Space, which chooses the row); then Enter and Space press the cell's one control (a detail's chevron, a row's button), and F2 — or
 * Enter on a cell spanning the row, a detail — moves the focus to the cell's first control, which Escape or Enter in a field hands back.
 * False where the key is the row's: Enter and Space on a cell with nothing of its own, and a character no package took.
 */
function actOnCell(cell: HTMLElement, domEvent: KeyboardEvent): boolean {
    const key = domEvent.key;
    const typed = typeAheadCharacter(domEvent) !== null;
    const plain = !domEvent.ctrlKey && !domEvent.metaKey && !domEvent.altKey;

    if (!typed && (!plain || (key !== "Enter" && key !== "F2" && key !== " ")))
        return false;

    if (key !== " " && claimCellKey(cell, domEvent))
        return true;

    const control = soleControlOf(cell);

    if (control !== null && (key === "Enter" || key === " ")) {
        domEvent.preventDefault();
        control.click();
        return true;
    }

    if (key !== "F2" && (key !== "Enter" || !isSpanningCell(cell)))
        return false;

    const first = firstFocusable(cell);

    if (first === null)
        return false;

    domEvent.preventDefault();
    first.focus();

    return true;
}

/**
 * A cursor the keyboard moved, on any host, a tree's too: on a single-choice host it chooses, like a file list; with many, Shift extends
 * the range from the anchor, or from where the cursor stood.
 */
export function chooseOnMove(root: HTMLElement, rows: readonly HTMLElement[], from: HTMLElement | null, next: HTMLElement, gesture: SelectionGesture, heldRange?: HeldRange): void {
    if (root.getAttribute(SelectionAttribute) !== "one" && !gesture.shift)
        return;

    if (gesture.shift)
        ensureAnchor(root, from);

    chooseRow(root, rows, next, gesture, heldRange);
}

/** Space on the cursor's row of any host: toggles it and leaves the rest as they are; a host that chooses nothing presses it. */
export function spaceRow(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement, control: HTMLElement | null): void {
    if (!chooseRow(root, rows, row, { shift: false, ctrl: true }))
        pressRow(row, control);
}

/**
 * Delete on the cursor's row of any host: only a removal the application wired is raised, the chosen group together; the controller
 * decides each. False when nothing is removable, the key then the page's.
 */
export function removeRows(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement): boolean {
    if (!root.hasAttribute(RowsRemoveAttribute))
        return false;

    const removable = removableRows(rows, row);

    for (const each of removable)
        dispatchRowEvent(each, "remove");

    return removable.length > 0;
}

/**
 * Enter on the cursor's row of any host, a tree's too: the keyboard's click and double click. It chooses where the host chooses on
 * Enter — a chosen group under the cursor stands, since Delete reads that same group —, presses the row, and opens it unless the press
 * was the row's one control's.
 */
export function enterRow(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement, control: HTMLElement | null): void {
    if (choosesOnEnter(root) && !selectedRows(rows).includes(row))
        chooseRow(root, rows, row, PlainGesture);

    pressRow(row, control);

    if (control === null)
        dispatchRowEvent(row, "open");
}

/**
 * The row's click from the keyboard: its one control pressed, else the row's own click command raised — through an event only the
 * event pipeline hears, so no engine that reads a pointer's click (a detail's toggle, a popup's dismissal) takes it for one.
 */
export function pressRow(row: HTMLElement, control: HTMLElement | null): void {
    if (control === null)
        dispatchRowEvent(row, RowPressEventName);
    else
        control.click();
}

/** How the host's rows lie for the arrows: a wrap in lines whatever its orientation, a horizontal list both ways, the rest up and down. */
function axisOf(root: HTMLElement): RowAxis {
    if (root.matches(".ui-items-view--wrap"))
        return "grid";

    return root.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}

/** The rows a Delete on `current` removes: every chosen row that allows it when `current` is among them, else `current` alone. */
export function removableRows(rows: readonly HTMLElement[], current: HTMLElement): HTMLElement[] {
    const chosen = selectedRows(rows);
    const group = chosen.includes(current) ? chosen : [current];

    // A row chosen before it was disabled stays chosen, but a disabled row is never acted on.
    return group.filter(row => !isItemRefused(row, UnremovableAttribute) && !isItemDisabled(row));
}
