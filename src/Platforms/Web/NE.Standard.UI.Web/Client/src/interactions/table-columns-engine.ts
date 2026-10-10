// A table's columns sized, hidden and ordered by the viewer: client-only state, laid over the authored order as a permutation.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    ColumnLimitsAttribute, DragHandleStartClass, RowsDraggableAttribute, RowsDragHandleAttribute, TableColumnAttribute, TableColumnKeyAttribute, TableDraggingAttribute, TableDropAttribute, TableFixedAttribute,
    TableHeaderClass, TableHiddenAttribute, TableHideBelowAttribute, TableLastAttribute, TableReorderingAttribute, TableResizerClass, TableRowClass,
    TableScrollbarAttribute, TableScrollClass as ScrollClass, TableScrolledAttribute, TableStartsHiddenAttribute
} from "../addressing/dom-attributes.ts";
import { currentResponsiveTier, responsiveTierQuery, responsiveTiers } from "../rendering/responsive-tier.ts";
import type { ResponsiveTier } from "../rendering/responsive-tier.ts";
import { OnceWarner } from "../runtime/logger.ts";
import { ClientStore } from "../state/client-store.ts";
import { observeComponents } from "./dom-mutations.ts";
import { observeSize } from "./element-size.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { applyGridTrackLimits, bigStep, formatGridTracks, moveSplit, parseGridTrackLimits, parseGridTracks, pinOffsets, zeroTracks } from "./grid-tracks.ts";
import type { GridTrack } from "./grid-tracks.ts";
import { PointerDrag, swallowReleaseClick } from "./pointer-drag.ts";
import { trackInnerPointer } from "./surface-press-engine.ts";
import { OrderVariablePrefix, stampColumnIndices } from "./table-column-layout.ts";

const RootClass = "ui-table";
const ReorderableClass = "ui-table--reorderable";
const ScrollXAutoClass = "ui-scroll-x--auto";
const ScrollXAlwaysClass = "ui-scroll-x--always";
const ScrollSelector = `:scope > .${ScrollClass}`;
const ResizerSelector = `.${TableResizerClass}`;
const HeaderCellClass = "ui-table__header-cell";
const PinnedModifierClass = `${HeaderCellClass}--pinned`;
const HeaderCellSelector = `${ScrollSelector} > .${TableHeaderClass} > .${HeaderCellClass}`;
const PinnedHeaderSelector = `${HeaderCellSelector}--pinned`;
const HostClass = "ui-table__host";
const HostSelector = `${ScrollSelector} > .${HostClass}`;
const TablePartSelector = `.${RootClass}, .${TableRowClass}, [${TableColumnAttribute}]`;

/** The authored track list (the renderer's variable) and the viewer's, which the stylesheet reads over it. */
const AuthoredVariable = "--ui-table-columns";
const StickyTopVariable = "--ui-table-sticky-top";
const StickyBottomVariable = "--ui-table-sticky-bottom";
const SizedVariable = "--ui-table-sized-columns";
/** Where a pinned column after the first sticks, one variable per column (TableComponentRenderer.PinVariablePrefix). */
const PinVariablePrefix = "--ui-table-pin-";

/** The column indices ui-table.less has rules for; a column past them is written on its own cells, which the boot patch cannot paint. */
const StyledColumns = 64;
/** On a cell of a column past the styled ones: hidden, or the one ending the row. */
const CellHiddenAttribute = "data-ui-table-cell-hidden";
const CellLastAttribute = "data-ui-table-cell-last";

/** Where the columns stand, which are hidden and which ends the row, as the last layout left them. */
type ColumnState = {
    readonly places: readonly number[];
    readonly hidden: ReadonlySet<number>;
    readonly last: number;
};

/** The viewer's widths, hidden columns and order, and the boot patch that paints all three before the runtime runs. */
const ColumnsSlot = "columns";
const HiddenSlot = "hidden";
const OrderSlot = "order";
const LayoutSlot = "layout";

// Narrower than this and a column is a line; the authored floor wins when it is higher.
const MinimumWidth = 32;
const Step = 16;

/** One column as the header describes it. */
type Column = {
    readonly index: number;
    readonly key: string;
    readonly hideBelow: ResponsiveTier | null;
    /** The author starts the column hidden at every width. */
    readonly startsHidden: boolean;
    /** A pinned column and one the control owns keep the places they were written in: no drag moves them, and none is dropped among them. */
    readonly anchored: boolean;
    readonly cell: HTMLElement;
};

/** The viewer's own word on a column, by key: hidden or shown, over whatever the author said. */
type HiddenChoices = Record<string, boolean>;

/** What a dragged column knows: where the press began, the places along the row a drop may take, and the one it would take now. */
type ReorderContext = {
    readonly table: HTMLElement;
    readonly index: number;
    readonly origin: number;
    readonly places: readonly Column[];
    readonly from: number;
    target: number;
};

/** What a handle knows about its table when a gesture starts. */
type ResizeContext = {
    readonly table: HTMLElement;
    readonly index: number;
    /** The next column that is not hidden, which the handle's column trades width with. */
    readonly after: number;
    readonly tracks: readonly GridTrack[];
    readonly sizes: readonly number[];
    /** The floors the author set, by index — not the ones the tracks carry, which are the authored widths themselves. */
    readonly floors: ReadonlyMap<number, number>;
};

export type TableColumnsEngineOptions = {
    readonly root?: ParentNode;
};

/** A table's columns as a package reaches them: whether each is hidden, and the viewer's word on it. */
export type TableColumns = {
    isColumnHidden(table: Element, key: string): boolean;
    setColumnHidden(table: Element, key: string, hidden: boolean | null): void;
    columnOrder(table: Element): string[];
};

export class TableColumnsEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();
    private readonly restored = new WeakSet<Element>();
    // The widths in force, without the hidden columns' zeros: null for the authored ones.
    private readonly widths = new WeakMap<Element, GridTrack[] | null>();
    // The order in force, by key, without the columns that never move: null for the authored one.
    private readonly orders = new WeakMap<Element, string[] | null>();
    // The viewer's word on hidden columns, read from the store once per table and kept in step with every write to it.
    private readonly hiddenChoices = new WeakMap<Element, HiddenChoices>();
    // Each table's column state as last laid out, and the one last written onto the cells of its columns past the styled ones.
    private readonly columnStates = new WeakMap<Element, ColumnState>();
    private readonly stampedStates = new WeakMap<Element, string>();
    private readonly indexedStates = new WeakMap<Element, string>();
    private readonly warner = new OnceWarner();
    private readonly drag: PointerDrag<ResizeContext>;
    private readonly reorder: PointerDrag<ReorderContext>;

    public constructor(options: TableColumnsEngineOptions = {}) {
        this.root = options.root ?? document;

        this.drag = new PointerDrag<ResizeContext>({
            root: this.root,
            resolveHandle: target => target.closest<HTMLElement>(ResizerSelector),
            begin: handle => this.resolveContext(handle),
            coordinate: () => "clientX",
            move: (context, delta) => this.apply(context, delta),
            end: (_, context) => this.remember(context.table)
        });

        this.reorder = new PointerDrag<ReorderContext>({
            root: this.root,
            resolveHandle: target => this.resolveCaption(target),
            begin: (handle, point) => this.beginReorder(handle, point.x),
            coordinate: () => "clientX",
            move: (context, delta) => this.aimDrop(context, delta),
            end: (handle, context) => this.endReorder(handle, context)
        });

        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);

        // The edge overhangs the next caption and is its own caption's child: a package's caption wash stays off under it by this mark.
        trackInnerPointer(this.root, ["hover", "press"], target => {
            const caption = target.closest(ResizerSelector)?.parentElement ?? null;

            return caption === null ? [] : [caption];
        });

        // A column hidden below a tier comes and goes with the viewport; the stylesheet's own queries judge the same edges.
        if (typeof matchMedia === "function") {
            for (const tier of responsiveTiers) {
                if (tier !== "base")
                    matchMedia(responsiveTierQuery(tier)).addEventListener("change", () => this.layoutAll());
            }
        }

        this.restoreEach(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        // A table arriving is restored; rows arriving bring cells past the styled columns to write; a cell's content brings neither.
        observeComponents(this.root, `.${RootClass}`, { childList: true, relevant: addsTableParts }, tables => {
            for (const table of tables) {
                if (this.restored.has(table)) {
                    this.stampUnstyledColumns(table, true);
                    this.indexColumns(table, true);
                }
            }

            this.restoreEach(tables);
        });

        // The sideways-scroll mode decides how a content column is written; only the table's own class says it, not a cell's.
        observeComponents(this.root, `.${RootClass}`, { attributeFilter: ["class"], relevant: mutation => mutation.target instanceof Element && mutation.target.classList.contains(RootClass) }, tables => {
            for (const table of tables) {
                if (this.restored.has(table))
                    this.layout(table);
            }
        });

        // A host holding a gutter keeps its box when the scrollbar goes, so rows leaving or filtered out say it may have.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: ["class", "hidden"], relevant: changesHostRows }, tables => {
            for (const table of tables) {
                const host = table.querySelector<HTMLElement>(HostSelector);

                if (host !== null && table.hasAttribute(TableScrollbarAttribute))
                    this.markScrollbar(table, host);
            }
        });
    }

    private restoreEach(tables: Iterable<HTMLElement>): void {
        for (const table of tables) {
            if (this.restored.has(table))
                continue;

            this.restored.add(table);
            this.restore(table);
            this.layout(table);

            // A content or star track changes with the table's width, and the pinned columns after it move with it.
            observeSize(table, () => this.pin(table));

            const scroll = table.querySelector<HTMLElement>(ScrollSelector);

            // The rows that stick over the others in a box scrolling both ways, measured whenever the box changes.
            if (scroll !== null)
                observeSize(scroll, () => markStickyRows(table, scroll));

            const host = table.querySelector<HTMLElement>(HostSelector);

            // A scrollbar coming changes the host's content box, whether rows arrived or the table was resized.
            if (host !== null) {
                this.markScrollbar(table, host);
                observeSize(host, () => this.markScrollbar(table, host));
            }
        }
    }

    /** Reads the viewer's widths and order, if the table still has the columns they were kept for; anything else forgets them. */
    private restore(table: HTMLElement): void {
        const columns = this.columnsOf(table);
        const stored = this.store.read(table, ColumnsSlot);
        const parsed = stored === null ? null : parseGridTracks(stored);

        if (parsed !== null && parsed.length !== columns.length) {
            this.store.write(table, ColumnsSlot, null);
            this.store.writeBoot(table, LayoutSlot, null);
            this.widths.set(table, null);
        }
        else
            this.widths.set(table, parsed);

        const order = this.store.readJson<string[]>(table, OrderSlot);

        // An order kept for other columns says nothing about these: it is the whole set in one arrangement or it is nothing.
        if (order !== null && !isArrangementOf(order, columns)) {
            this.store.write(table, OrderSlot, null);
            this.orders.set(table, null);
            return;
        }

        this.orders.set(table, order);
    }

    /** Names on the root whether the rows' host scrolls vertically, so the stylesheet keeps the last caption over its values. */
    private markScrollbar(table: HTMLElement, host: HTMLElement): void {
        // Overflow, not the host's box: once marked, the host keeps the gutter whether a scrollbar stands in it or not.
        const overflowY = getComputedStyle(host).overflowY;

        table.toggleAttribute(TableScrollbarAttribute, overflowY === "scroll" || (overflowY === "auto" && host.scrollHeight > host.clientHeight));
    }

    private layoutAll(): void {
        for (const table of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`))
            this.layout(table);
    }

    /** Writes the tracks in force and names on the root which columns are hidden, where each stands and which ends the row. */
    private layout(table: HTMLElement): void {
        const columns = this.columnsOf(table);
        const hidden = this.hiddenOf(table, columns);
        const places = this.placesOf(table, columns);
        const order = columnsInOrder(places);
        const widths = this.widths.get(table) ?? null;
        const arranged = places.some((place, index) => place !== index);
        // Scrolling sideways, a content column fits its content: `auto` leaves an ellipsis cell nothing, and the table never scrolls.
        const wide = table.classList.contains(ScrollXAutoClass) || table.classList.contains(ScrollXAlwaysClass);

        if (widths === null && hidden.size === 0 && !arranged && !wide)
            table.style.removeProperty(SizedVariable);
        else {
            const tracks = widths ?? this.authoredTracks(table);

            if (tracks !== null) {
                const sized = zeroTracks(tracks, hidden);

                table.style.setProperty(SizedVariable, formatGridTracks(order.map(index => sized[index]), wide ? "max-content" : "auto"));
            }
        }

        for (let index = 0; index < places.length; index++) {
            if (arranged)
                table.style.setProperty(`${OrderVariablePrefix}${index}`, String(places[index]));
            else
                table.style.removeProperty(`${OrderVariablePrefix}${index}`);
        }

        const names = [...hidden].sort((a, b) => a - b).join(" ");

        if (names.length === 0)
            table.removeAttribute(TableHiddenAttribute);
        else if (table.getAttribute(TableHiddenAttribute) !== names)
            table.setAttribute(TableHiddenAttribute, names);

        // The last place nothing hides — not the last header cell nor the last index once the viewer moved or hid a column.
        const last = [...order].reverse().find(index => !hidden.has(index));

        if (last === undefined)
            table.removeAttribute(TableLastAttribute);
        else if (table.getAttribute(TableLastAttribute) !== String(last))
            table.setAttribute(TableLastAttribute, String(last));

        this.columnStates.set(table, { places, hidden, last: last ?? -1 });
        this.stampUnstyledColumns(table, false);
        this.indexColumns(table, false);

        // A column the viewer may move is a control the keyboard reaches through the header's group, not the Tab order; one the table
        // already made a stop keeps what it has.
        if (table.classList.contains(ReorderableClass)) {
            for (const column of columns) {
                if (!column.anchored && !column.cell.hasAttribute("tabindex"))
                    column.cell.setAttribute("tabindex", "-1");
            }
        }

        this.pin(table);
    }

    /** Writes onto every cell of a column past the styled ones its place, and whether it is hidden or ends the row. */
    private stampUnstyledColumns(table: HTMLElement, rowsArrived: boolean): void {
        const state = this.columnStates.get(table);

        if (state === undefined || state.places.length <= StyledColumns)
            return;

        const signature = `${state.places.join(",")}|${[...state.hidden].join(",")}|${state.last}`;

        // A resize lays out on every pointer move; rows arriving were never written.
        if (!rowsArrived && this.stampedStates.get(table) === signature)
            return;

        this.stampedStates.set(table, signature);

        for (const cell of table.querySelectorAll<HTMLElement>(`[${TableColumnAttribute}]`)) {
            const index = Number(cell.getAttribute(TableColumnAttribute));

            // A nested table's cells are its own to write.
            if (!(index >= StyledColumns) || cell.closest(`.${RootClass}`) !== table)
                continue;

            cell.style.order = String(state.places[index] ?? index);
            cell.toggleAttribute(CellHiddenAttribute, state.hidden.has(index));
            cell.toggleAttribute(CellLastAttribute, index === state.last);
        }
    }

    /** Writes where each cell stands among the columns shown; rows arriving under the same layout are written alone. */
    private indexColumns(table: HTMLElement, rowsArrived: boolean): void {
        const state = this.columnStates.get(table);

        if (state === undefined)
            return;

        const signature = `${state.places.join(",")}|${[...state.hidden].join(",")}`;
        const same = this.indexedStates.get(table) === signature;

        if (same && !rowsArrived)
            return;

        this.indexedStates.set(table, signature);
        stampColumnIndices(table, columnsInOrder(state.places), state.hidden, same);
    }

    /** The columns as the header describes them: index, key, where the author hides each, and whether it ever moves. */
    private columnsOf(table: HTMLElement): Column[] {
        const columns: Column[] = [];

        for (const cell of table.querySelectorAll<HTMLElement>(HeaderCellSelector)) {
            const index = Number(cell.getAttribute(TableColumnAttribute));
            const tier = cell.getAttribute(TableHideBelowAttribute);
            const anchored = cell.classList.contains(PinnedModifierClass) || cell.hasAttribute(TableFixedAttribute);

            if (Number.isInteger(index))
                columns.push({ index, key: cell.getAttribute(TableColumnKeyAttribute) ?? String(index), hideBelow: isTier(tier) ? tier : null, startsHidden: cell.hasAttribute(TableStartsHiddenAttribute), anchored, cell });
        }

        return columns;
    }

    /** Where each column stands, by authored index: anchored ones keep theirs, the rest fill the gaps in the viewer's order. */
    private placesOf(table: HTMLElement, columns: readonly Column[]): number[] {
        const places: number[] = [];

        for (const column of columns)
            places[column.index] = column.index;

        const order = this.orders.get(table) ?? null;

        if (order === null)
            return places;

        const byKey = new Map(columns.map(column => [column.key, column]));
        const free = columns.filter(column => !column.anchored).map(column => column.index);
        let slot = 0;

        for (const key of order) {
            const column = byKey.get(key);

            if (column !== undefined && !column.anchored)
                places[column.index] = free[slot++];
        }

        return places;
    }

    /** The indices hidden now: the viewer's word where there is one, else the author's — hidden outright, or by a tier against the viewport's. */
    private hiddenOf(table: HTMLElement, columns: readonly Column[] = this.columnsOf(table)): Set<number> {
        const choices = this.choicesOf(table);
        const hidden = new Set<number>();

        for (const column of columns) {
            if (choices[column.key] ?? hiddenByAuthor(column))
                hidden.add(column.index);
        }

        return hidden;
    }

    private choicesOf(table: HTMLElement): HiddenChoices {
        let choices = this.hiddenChoices.get(table);

        if (choices === undefined) {
            choices = this.store.readJson<HiddenChoices>(table, HiddenSlot) ?? {};
            this.hiddenChoices.set(table, choices);
        }

        return choices;
    }

    private authoredTracks(table: HTMLElement): GridTrack[] | null {
        const template = table.style.getPropertyValue(AuthoredVariable).trim();
        const parsed = template.length === 0 ? null : parseGridTracks(template);

        if (parsed === null)
            this.warner.warn(table, "the table's track list could not be read.", { template });

        return parsed;
    }

    /** Whether the column keyed `key` is hidden now, by the viewer's word or the author's. */
    public isColumnHidden(table: Element, key: string): boolean {
        if (!(table instanceof HTMLElement))
            return false;

        const columns = this.columnsOf(table);
        const column = columns.find(candidate => candidate.key === key);

        return column !== undefined && this.hiddenOf(table, columns).has(column.index);
    }

    /** Sets the viewer's word on a column — hidden, shown, or null for the author's — kept in the browser like the widths. */
    public setColumnHidden(table: Element, key: string, hidden: boolean | null): void {
        if (!(table instanceof HTMLElement))
            return;

        const choices = { ...this.choicesOf(table) };
        const column = this.columnsOf(table).find(candidate => candidate.key === key);

        // A word the author says anyway is not kept, so the column still gives way on a narrower screen.
        if (hidden === null || (column !== undefined && hidden === hiddenByAuthor(column)))
            delete choices[key];
        else
            choices[key] = hidden;

        this.hiddenChoices.set(table, choices);
        this.store.writeJson(table, HiddenSlot, Object.keys(choices).length === 0 ? null : choices);
        this.layout(table);
        this.rememberBoot(table);
    }

    /** Every column's key in the order the viewer sees, for a package's own chrome such as a chooser. */
    public columnOrder(table: Element): string[] {
        if (!(table instanceof HTMLElement))
            return [];

        const columns = this.columnsOf(table);
        const byIndex = new Map(columns.map(column => [column.index, column]));

        return columnsInOrder(this.placesOf(table, columns)).map(index => byIndex.get(index)?.key ?? "").filter(key => key.length > 0);
    }

    /** Writes where each pinned column after the first sticks: the laid-out widths before it, read after every change to them. */
    private pin(table: HTMLElement): void {
        const pinned = table.querySelectorAll(PinnedHeaderSelector).length;

        if (pinned < 2)
            return;

        const sizes = this.trackSizes(table);
        const offsets = pinOffsets(sizes, pinned);

        for (let i = 1; i < offsets.length; i++)
            table.style.setProperty(`${PinVariablePrefix}${i}`, `${offsets[i]}px`);
    }

    /** A table scrolled sideways says so on its root, for the shadow under its last pinned column; the box inside it is the scroller. */
    private handleScroll(domEvent: Event): void {
        const scroll = domEvent.target;

        if (!(scroll instanceof HTMLElement) || !scroll.classList.contains(ScrollClass))
            return;

        const table = scroll.closest<HTMLElement>(`.${RootClass}`);

        table?.toggleAttribute(TableScrolledAttribute, scroll.scrollLeft > 0);
    }

    /**
     * The laid-out width of every column's track, read off the box that carries them — in the order they are laid out, which is the
     * viewer's; a start grip's track, which is no column's, left out.
     */
    private trackSizes(table: HTMLElement): number[] {
        const scroll = table.querySelector<HTMLElement>(ScrollSelector);
        const sizes = scroll === null ? [] : getComputedStyle(scroll).gridTemplateColumns.split(" ").map(parseFloat);

        return leadsWithGrip(table) ? sizes.slice(1) : sizes;
    }

    /** The same widths by the column they belong to, which is what every reckoning here is in. */
    private columnSizes(table: HTMLElement, places: readonly number[]): number[] {
        const laid = this.trackSizes(table);

        return places.map(place => laid[place]);
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        // Alt with an arrow moves the thing, as a row's or a node's does.
        if (domEvent.altKey && isPlainKey(domEvent, { alt: true }) && (domEvent.key === "ArrowLeft" || domEvent.key === "ArrowRight")) {
            this.stepColumn(domEvent, domEvent.key === "ArrowLeft" ? -1 : 1);
            return;
        }

        // The handle itself, or Shift with an arrow on its caption: the header's keyboard stands on the captions (table-header-group.ts).
        const own = domEvent.target.closest<HTMLElement>(ResizerSelector);
        const handle = own ?? (domEvent.shiftKey ? captionHandle(domEvent.target) : null);

        if (handle === null || this.drag.active || !isPlainKey(domEvent, { shift: own === null }))
            return;

        // The double-click's twin: Enter on the handle, and on its caption — whose Enter is its sort — Shift with Backspace, the sizing
        // chord's "take it back".
        if ((own !== null && domEvent.key === "Enter") || (own === null && domEvent.key === "Backspace")) {
            domEvent.preventDefault();
            this.reset(handle);
            return;
        }

        const page = domEvent.key === "PageUp" || domEvent.key === "PageDown";

        if (!page && domEvent.key !== "ArrowLeft" && domEvent.key !== "ArrowRight")
            return;

        const context = this.resolveContext(handle);

        if (context === null)
            return;

        // PageUp widens, as it raises a range's value.
        const size = page ? bigStep(Step, context.sizes.reduce((total, width) => total + width, 0)) : Step;

        domEvent.preventDefault();

        if (this.apply(context, domEvent.key === "ArrowRight" || domEvent.key === "PageUp" ? size : -size))
            this.remember(context.table);
    }

    /**
     * Alt and an arrow on a draggable caption moves its column one place, the keyboard staying on the caption; taken at the row's end
     * too, where it moves nothing, or Alt+Left would take the page back.
     */
    private stepColumn(domEvent: KeyboardEvent, step: number): void {
        const cell = domEvent.target instanceof Element ? this.resolveCaption(domEvent.target) : null;
        const table = cell?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (cell === null || table === null || this.reorder.active)
            return;

        const movable = this.movableColumns(table);
        const index = Number(cell.getAttribute(TableColumnAttribute));
        const from = movable.findIndex(column => column.index === index);
        const to = from + step;

        if (from < 0)
            return;

        domEvent.preventDefault();

        if (to < 0 || to >= movable.length)
            return;

        // A step to the right lands before the column after the one it passes, which is the end of the row when there is none.
        this.moveColumn(table, index, step < 0 ? movable[to].index : movable[to + 1]?.index ?? null);
        cell.focus({ preventScroll: true });
    }

    private handleDoubleClick(domEvent: Event): void {
        const handle = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(ResizerSelector) : null;

        if (handle !== null)
            this.reset(handle);
    }

    /** Puts the authored widths back and forgets the viewer's. */
    private reset(handle: HTMLElement): void {
        const table = handle.closest<HTMLElement>(`.${RootClass}`);

        if (table === null)
            return;

        this.widths.set(table, null);
        this.layout(table);
        this.remember(table);
    }

    /** Moves the boundary after the column `delta` pixels from where the gesture began, within both columns' bounds; answers whether anything moved. */
    private apply(context: ResizeContext, delta: number): boolean {
        // The author's floor, not the track's: the track's would refuse every drag narrower than authored.
        const bounded = context.tracks.map((track, index) => index === context.index || index === context.after
            ? { ...track, min: Math.max(MinimumWidth, context.floors.get(index) ?? 0) }
            : track);
        const moved = moveSplit(bounded, context.sizes, { before: [context.index], after: [context.after] }, delta);

        if (moved === null)
            return false;

        this.widths.set(context.table, keepColumnFloors(context.tracks, moved, [context.index, context.after]));
        this.layout(context.table);

        return true;
    }

    /** Keeps the widths, and the boot patch that paints them and the hidden columns before the next page's first frame. */
    private remember(table: HTMLElement): void {
        const widths = this.widths.get(table) ?? null;

        this.store.write(table, ColumnsSlot, widths === null ? null : formatGridTracks(widths), null);
        this.rememberBoot(table);
    }

    private rememberBoot(table: HTMLElement): void {
        const template = table.style.getPropertyValue(SizedVariable).trim();
        const hidden = table.getAttribute(TableHiddenAttribute);
        const styles: Record<string, string> = {};

        if (template.length > 0)
            styles[SizedVariable] = template;

        // The viewer's order is painted before the first frame too, or the row would draw twice.
        for (const name of table.style) {
            if (name.startsWith(OrderVariablePrefix))
                styles[name] = table.style.getPropertyValue(name);
        }

        if (Object.keys(styles).length === 0 && hidden === null) {
            this.store.writeBoot(table, LayoutSlot, null);
            return;
        }

        this.store.writeBoot(table, LayoutSlot, { styles, attributes: { [TableHiddenAttribute]: hidden, [TableLastAttribute]: table.getAttribute(TableLastAttribute) } });
    }

    /** Everything a gesture needs, read afresh: the widths in force, their laid-out sizes, the column the handle sizes and the visible one after it. */
    private resolveContext(handle: HTMLElement): ResizeContext | null {
        const table = handle.closest<HTMLElement>(`.${RootClass}`);

        if (table === null)
            return null;

        const widths = this.widths.get(table) ?? this.authoredTracks(table);

        if (widths === null)
            return null;

        const limits = parseGridTrackLimits(table.getAttribute(ColumnLimitsAttribute));
        const tracks = applyGridTrackLimits(widths, limits);
        const floors = new Map<number, number>();
        const columns = this.columnsOf(table);
        const places = this.placesOf(table, columns);
        const sizes = this.columnSizes(table, places).filter(size => Number.isFinite(size));
        for (const limit of limits) {
            if (limit.min !== undefined)
                floors.set(limit.index, limit.min);
        }

        const index = Number(handle.getAttribute(TableColumnAttribute));
        const hidden = this.hiddenOf(table, columns);
        const order = columnsInOrder(places);
        // The column the handle trades width with is the next one along the row as the viewer sees it, not the next index.
        let place = (places[index] ?? -1) + 1;

        while (place < order.length && hidden.has(order[place]))
            place++;

        const after = place < order.length ? order[place] : -1;

        // The last visible column's edge is the table's own; it has no neighbour to trade width with.
        if (!Number.isInteger(index) || index < 0 || after < 0 || sizes.length < tracks.length) {
            this.warner.warn(table, "the handle's column could not be found in its table.", { index, tracks: tracks.length, sizes: sizes.length });
            return null;
        }

        return { table, index, after, tracks, sizes, floors };
    }

    /** The caption a press landed on, if its column is one the viewer may drag; not the handle at its edge. */
    private resolveCaption(target: Element): HTMLElement | null {
        const cell = target.closest<HTMLElement>(`.${HeaderCellClass}`);
        const table = cell?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (cell === null || table === null || !table.classList.contains(ReorderableClass) || target.closest(ResizerSelector) !== null)
            return null;

        return cell.classList.contains(PinnedModifierClass) || cell.hasAttribute(TableFixedAttribute) ? null : cell;
    }

    /** The places a drop may take and where the dragged column starts from. */
    private beginReorder(cell: HTMLElement, origin: number): ReorderContext | null {
        const table = cell.closest<HTMLElement>(`.${RootClass}`);
        const index = Number(cell.getAttribute(TableColumnAttribute));

        if (table === null || !Number.isInteger(index))
            return null;

        const places = this.movableColumns(table);
        const from = places.findIndex(column => column.index === index);

        // One column that moves is a column with nowhere to go.
        if (from < 0 || places.length < 2)
            return null;

        table.setAttribute(TableReorderingAttribute, "");
        cell.setAttribute(TableDraggingAttribute, "");

        return { table, index, origin, places, from, target: from };
    }

    /** The columns the viewer may drag, in view and in the order they stand. */
    private movableColumns(table: HTMLElement): Column[] {
        const columns = this.columnsOf(table);
        const hidden = this.hiddenOf(table, columns);
        const byIndex = new Map(columns.map(column => [column.index, column]));
        const movable: Column[] = [];

        for (const index of columnsInOrder(this.placesOf(table, columns))) {
            const column = byIndex.get(index);

            if (column !== undefined && !column.anchored && !hidden.has(index))
                movable.push(column);
        }

        return movable;
    }

    /** Aims the drop by how many column middles the pointer has passed, and marks the edge it would take. */
    private aimDrop(context: ReorderContext, delta: number): void {
        const at = context.origin + delta;
        let passed = 0;

        while (passed < context.places.length && at > middleOf(context.places[passed]))
            passed++;

        context.target = Math.min(Math.max(passed > context.from ? passed - 1 : passed, 0), context.places.length - 1);

        clearDropMarks(context.table);

        if (context.target === context.from)
            return;

        const rest = context.places.filter((_, place) => place !== context.from);
        const before = rest[context.target];

        if (before !== undefined)
            before.cell.setAttribute(TableDropAttribute, "before");
        else
            rest[rest.length - 1].cell.setAttribute(TableDropAttribute, "after");
    }

    private endReorder(cell: HTMLElement, context: ReorderContext): void {
        cell.removeAttribute(TableDraggingAttribute);
        context.table.removeAttribute(TableReorderingAttribute);
        clearDropMarks(context.table);

        if (context.target === context.from)
            return;

        const rest = context.places.filter((_, place) => place !== context.from);

        // A drag that moved a column is no press of the caption it was dropped on, which a grid would sort by.
        swallowReleaseClick();
        this.moveColumn(context.table, context.index, rest[context.target]?.index ?? null);
    }

    /** Puts the column before the one at `before`, or at the row's end, and keeps the whole order by key. */
    private moveColumn(table: HTMLElement, index: number, before: number | null): void {
        const columns = this.columnsOf(table);
        const byIndex = new Map(columns.map(column => [column.index, column]));
        const movable = columnsInOrder(this.placesOf(table, columns)).filter(place => byIndex.get(place)?.anchored === false);
        const from = movable.indexOf(index);

        if (from < 0)
            return;

        movable.splice(from, 1);

        const at = before === null ? -1 : movable.indexOf(before);

        movable.splice(at < 0 ? movable.length : at, 0, index);

        const arranged: string[] = [];
        let slot = 0;

        // Anchored columns go back into their authored places, so a stored order always reads as one.
        for (let place = 0; place < columns.length; place++) {
            const anchored = byIndex.get(place);

            arranged.push(anchored?.anchored === true ? anchored.key : byIndex.get(movable[slot++])?.key ?? "");
        }

        const authored = arranged.every((key, place) => key === byIndex.get(place)?.key);

        this.orders.set(table, authored ? null : arranged);
        this.store.write(table, OrderSlot, authored ? null : JSON.stringify(arranged));
        this.layout(table);
        this.rememberBoot(table);
    }
}

/**
 * The height of the table's own rows above its rows' host (the header) and below it (a package's footer), which stick over the rows in
 * a box scrolling both ways: the box keeps a row the keyboard brings into view clear of them (`scroll-padding`, ui-table.less).
 */
function markStickyRows(table: HTMLElement, scroll: HTMLElement): void {
    let top = 0;
    let bottom = 0;
    let passed = false;

    for (const child of scroll.children) {
        if (child.matches(`.${HostClass}`))
            passed = true;
        else if (!(child instanceof HTMLElement) || child.getAttribute("role") !== "row")
            continue;
        else if (passed)
            bottom += child.offsetHeight;
        else
            top += child.offsetHeight;
    }

    table.style.setProperty(StickyTopVariable, `${top}px`);
    table.style.setProperty(StickyBottomVariable, `${bottom}px`);
}

/** The resize handle of the caption a key landed on, where it shows; null for a key elsewhere or a column that does not size. */
function captionHandle(target: Element): HTMLElement | null {
    const handle = target.matches(`.${HeaderCellClass}`) ? target.querySelector<HTMLElement>(`:scope > ${ResizerSelector}`) : null;

    return handle !== null && handle.getClientRects().length > 0 ? handle : null;
}

/** Whether the rows' grips stand in a track before the columns' (`DragHandle` at the start, shown): a track no column owns. */
export function leadsWithGrip(table: Element): boolean {
    return table.hasAttribute(RowsDraggableAttribute) && table.hasAttribute(RowsDragHandleAttribute) && table.classList.contains(DragHandleStartClass);
}

/** Puts the floors of the two columns a drag moved back level with their new widths, as the drag clamped to the author's floor. */
function keepColumnFloors(tracks: readonly GridTrack[], moved: GridTrack[], indices: readonly number[]): GridTrack[] {
    for (const index of indices) {
        if (tracks[index].kind === "star" && tracks[index].min === tracks[index].value && moved[index].kind === "star")
            moved[index] = { ...moved[index], min: moved[index].value };
    }

    return moved;
}

/** Whether a record brought a table, a row or a cell: what the columns are laid out over, as opposed to what a cell shows. */
function addsTableParts(mutation: MutationRecord): boolean {
    for (const node of mutation.addedNodes) {
        if (node instanceof Element && (node.matches(TablePartSelector) || node.querySelector(TablePartSelector) !== null))
            return true;
    }

    return false;
}

/** Whether a record added or removed a row of a table's host, or changed whether one is shown. */
function changesHostRows(mutation: MutationRecord): boolean {
    const target = mutation.type === "childList" ? mutation.target : mutation.target.parentElement;

    return target instanceof Element && target.classList.contains(HostClass);
}

/** The authored index standing at each place along the row, read off the places every column holds. */
function columnsInOrder(places: readonly number[]): number[] {
    const order: number[] = [];

    for (let index = 0; index < places.length; index++)
        order[places[index]] = index;

    return order;
}

/** Whether a stored order is these columns in some arrangement: every key once, and no other. */
function isArrangementOf(order: readonly string[], columns: readonly Column[]): boolean {
    if (order.length !== columns.length)
        return false;

    const keys = new Set(columns.map(column => column.key));

    return order.every(key => keys.delete(key)) && keys.size === 0;
}

/** The middle of a column's header cell, which a drop is measured against. */
function middleOf(column: Column): number {
    const rect = column.cell.getBoundingClientRect();

    return rect.left + rect.width / 2;
}

function clearDropMarks(table: HTMLElement): void {
    for (const marked of table.querySelectorAll(`[${TableDropAttribute}]`))
        marked.removeAttribute(TableDropAttribute);
}

/** Whether the author hides the column in the viewport as it is now: at every width, or below its tier. */
export function hiddenByAuthor(column: Pick<Column, "startsHidden" | "hideBelow">): boolean {
    return column.startsHidden || (column.hideBelow !== null && responsiveTiers.indexOf(currentResponsiveTier()) < responsiveTiers.indexOf(column.hideBelow));
}

function isTier(value: string | null): value is ResponsiveTier {
    return value !== null && (responsiveTiers as readonly string[]).includes(value);
}
