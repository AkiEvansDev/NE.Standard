// A table's columns are sized, hidden and ordered by the viewer, kept as client-only state, never bound. Resize, drag-reorder,
// pinning and hiding all work in the authored index order, with the viewer's changes laid over it as a permutation.

import {
    ColumnLimitsAttribute, TableColumnAttribute, TableColumnKeyAttribute, TableDraggingAttribute, TableDropAttribute, TableFixedAttribute,
    TableHiddenAttribute, TableHideBelowAttribute, TableLastAttribute, TableReorderingAttribute, TableScrolledAttribute
} from "../addressing/dom-attributes";
import { currentResponsiveTier, responsiveBreakpoints, ResponsiveTier, responsiveTiers } from "../rendering/responsive-tier";
import { OnceWarner } from "../runtime/logger";
import { ClientStore } from "../state/client-store";
import { observeComponents } from "./dom-mutations";
import { observeSize } from "./element-size";
import { applyGridTrackLimits, formatGridTracks, GridTrack, moveSplit, parseGridTrackLimits, parseGridTracks, pinOffsets, zeroTracks } from "./grid-tracks";
import { PointerDrag } from "./pointer-drag";

const RootClass = "ui-table";
const ReorderableClass = "ui-table--reorderable";
const ScrollClass = "ui-table__scroll";
const ScrollSelector = `:scope > .${ScrollClass}`;
const ResizerSelector = ".ui-table__resizer";
const HeaderCellClass = "ui-table__header-cell";
const PinnedModifierClass = `${HeaderCellClass}--pinned`;
const HeaderCellSelector = `${ScrollSelector} > .ui-table__header > .${HeaderCellClass}`;
const PinnedHeaderSelector = `${HeaderCellSelector}--pinned`;

/** The authored track list (the renderer's variable) and the viewer's, which the stylesheet reads over it. */
const AuthoredVariable = "--ui-table-columns";
const SizedVariable = "--ui-table-sized-columns";
/** Where a pinned column after the first sticks, one variable per column (TableComponentRenderer.PinVariablePrefix). */
const PinVariablePrefix = "--ui-table-pin-";
/** Where the viewer put each column, one variable per column, which the stylesheet hands its cells as `order`. */
const OrderVariablePrefix = "--ui-table-order-";

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

/**
 * A table's columns as a package reaches them: whether a column is hidden, by the viewer's word or the author's tier, and
 * the viewer's word on it, which a chooser writes (null takes it back).
 */
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
    private readonly warner = new OnceWarner();
    private readonly drag: PointerDrag<ResizeContext>;
    private readonly reorder: PointerDrag<ReorderContext>;
    // A drag that moved a column swallows the click that follows it, or a grid would sort by the caption it was dropped on.
    private moved = false;

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

        this.root.addEventListener("pointerdown", () => { this.moved = false; }, true);
        // On the window rather than the root: the event pipeline listens on the root too and was there first, and a listener on the
        // same node runs in add order regardless of what a sibling stops — so the click would reach the sort before being swallowed.
        window.addEventListener("click", domEvent => this.swallowClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("scroll", domEvent => this.handleScroll(domEvent), true);

        // A column hidden below a tier comes and goes with the viewport; the stylesheet's own queries judge the same edges.
        if (typeof matchMedia === "function") {
            for (const tier of responsiveTiers) {
                if (tier !== "base")
                    matchMedia(`(min-width: ${responsiveBreakpoints[tier]}px)`).addEventListener("change", () => this.layoutAll());
            }
        }

        this.restoreEach(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        observeComponents(this.root, `.${RootClass}`, { childList: true }, tables => this.restoreEach(tables));
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

    private layoutAll(): void {
        for (const table of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`))
            this.layout(table);
    }

    /**
     * Writes the tracks in force — the viewer's widths or the authored ones, hidden columns at zero, in the viewer's order — and
     * names on the root what a cell can't say for itself: which columns are hidden, where each stands, which ends the row.
     */
    private layout(table: HTMLElement): void {
        const columns = this.columnsOf(table);
        const hidden = this.hiddenOf(table, columns);
        const places = this.placesOf(table, columns);
        const order = columnsInOrder(places);
        const widths = this.widths.get(table) ?? null;
        const arranged = places.some((place, index) => place !== index);

        if (widths === null && hidden.size === 0 && !arranged)
            table.style.removeProperty(SizedVariable);
        else {
            const tracks = widths ?? this.authoredTracks(table);

            if (tracks !== null) {
                const sized = zeroTracks(tracks, hidden);

                table.style.setProperty(SizedVariable, formatGridTracks(order.map(index => sized[index])));
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

        // The column the row ends with: the last place nothing hides — not the last header cell nor the last index once the
        // viewer has moved or hidden a column. Its edge is the table's own.
        const last = [...order].reverse().find(index => !hidden.has(index));

        if (last === undefined)
            table.removeAttribute(TableLastAttribute);
        else if (table.getAttribute(TableLastAttribute) !== String(last))
            table.setAttribute(TableLastAttribute, String(last));

        // A column the viewer may move is a control the keyboard reaches; one the table already made a tab stop keeps what it has.
        if (table.classList.contains(ReorderableClass)) {
            for (const column of columns) {
                if (!column.anchored && !column.cell.hasAttribute("tabindex"))
                    column.cell.setAttribute("tabindex", "0");
            }
        }

        this.pin(table);
    }

    /** The columns as the header describes them: index, key, the tier below which the author hides each, and whether it ever moves. */
    private columnsOf(table: HTMLElement): Column[] {
        const columns: Column[] = [];

        for (const cell of table.querySelectorAll<HTMLElement>(HeaderCellSelector)) {
            const index = Number(cell.getAttribute(TableColumnAttribute));
            const tier = cell.getAttribute(TableHideBelowAttribute);
            const anchored = cell.classList.contains(PinnedModifierClass) || cell.hasAttribute(TableFixedAttribute);

            if (Number.isInteger(index))
                columns.push({ index, key: cell.getAttribute(TableColumnKeyAttribute) ?? String(index), hideBelow: isTier(tier) ? tier : null, anchored, cell });
        }

        return columns;
    }

    /**
     * Where each column stands, by its authored index: the place the viewer's order gives it, or its own where there is none.
     * A column that never moves keeps its place; the rest fill what's left between them in the order kept.
     */
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

    /** The indices hidden now: the viewer's word where there is one, else the author's tier against the viewport's. */
    private hiddenOf(table: HTMLElement, columns: readonly Column[] = this.columnsOf(table)): Set<number> {
        const choices = this.store.readJson<HiddenChoices>(table, HiddenSlot) ?? {};
        const hidden = new Set<number>();

        for (const column of columns) {
            if (choices[column.key] ?? hiddenByTier(column))
                hidden.add(column.index);
        }

        return hidden;
    }

    private authoredTracks(table: HTMLElement): GridTrack[] | null {
        const template = table.style.getPropertyValue(AuthoredVariable).trim();
        const parsed = template.length === 0 ? null : parseGridTracks(template);

        if (parsed === null)
            this.warner.warn(table, "the table's track list could not be read.", { template });

        return parsed;
    }

    /** Whether the column keyed `key` is hidden now, by the viewer's word or the author's tier. */
    public isColumnHidden(table: Element, key: string): boolean {
        if (!(table instanceof HTMLElement))
            return false;

        const columns = this.columnsOf(table);
        const column = columns.find(candidate => candidate.key === key);

        return column !== undefined && this.hiddenOf(table, columns).has(column.index);
    }

    /**
     * The viewer's word on a column: hidden, shown, or null to let the author's tier decide again; kept in the browser like the
     * widths. A word that matches what the tier says anyway is not kept, so the column still gives way on a narrower screen.
     */
    public setColumnHidden(table: Element, key: string, hidden: boolean | null): void {
        if (!(table instanceof HTMLElement))
            return;

        const choices = this.store.readJson<HiddenChoices>(table, HiddenSlot) ?? {};
        const column = this.columnsOf(table).find(candidate => candidate.key === key);

        if (hidden === null || (column !== undefined && hidden === hiddenByTier(column)))
            delete choices[key];
        else
            choices[key] = hidden;

        this.store.writeJson(table, HiddenSlot, Object.keys(choices).length === 0 ? null : choices);
        this.layout(table);
        this.rememberBoot(table);
    }

    /** Every column's key in the order they stand in now, so a package's own chrome — a chooser's menu — reads the row as the viewer sees it. */
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

    /** The laid-out width of every track, read off the box that carries them — in the order they are laid out, which is the viewer's. */
    private trackSizes(table: HTMLElement): number[] {
        const scroll = table.querySelector<HTMLElement>(ScrollSelector);

        return scroll === null ? [] : getComputedStyle(scroll).gridTemplateColumns.split(" ").map(parseFloat);
    }

    /** The same widths by the column they belong to, which is what every reckoning here is in. */
    private columnSizes(table: HTMLElement, places: readonly number[]): number[] {
        const laid = this.trackSizes(table);

        return places.map(place => laid[place]);
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        if (domEvent.ctrlKey && (domEvent.key === "ArrowLeft" || domEvent.key === "ArrowRight")) {
            this.stepColumn(domEvent, domEvent.key === "ArrowLeft" ? -1 : 1);
            return;
        }

        const handle = domEvent.target.closest<HTMLElement>(ResizerSelector);

        if (handle === null || this.drag.active)
            return;

        let delta: number;

        switch (domEvent.key) {
            case "ArrowLeft":
                delta = -Step;
                break;
            case "ArrowRight":
                delta = Step;
                break;
            default:
                return;
        }

        const context = this.resolveContext(handle);

        if (context === null)
            return;

        domEvent.preventDefault();

        if (this.apply(context, delta))
            this.remember(context.table);
    }

    /**
     * Ctrl and an arrow on a draggable caption moves its column one place that way — the drag's own answer for a reader without
     * a pointer. The keyboard stays on the caption, which moves with its column.
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

        if (from < 0 || to < 0 || to >= movable.length)
            return;

        domEvent.preventDefault();

        // A step to the right lands before the column after the one it passes, which is the end of the row when there is none.
        this.moveColumn(table, index, step < 0 ? movable[to].index : movable[to + 1]?.index ?? null);
        cell.focus({ preventScroll: true });
    }

    /** A double-click on a handle puts the authored widths back and forgets the viewer's. */
    private handleDoubleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const handle = domEvent.target.closest<HTMLElement>(ResizerSelector);
        const table = handle?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (table === null)
            return;

        this.widths.set(table, null);
        this.layout(table);
        this.remember(table);
    }

    /** Moves the boundary after the column `delta` pixels from where the gesture began, within both columns' bounds; answers whether anything moved. */
    private apply(context: ResizeContext, delta: number): boolean {
        // The two columns either side of the handle trade width; the splitter's arithmetic clamps and writes them. The clamp is the
        // author's floor, not the track's, since holding to the track's floor would refuse every drag narrower than authored.
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

        // The places the viewer put the columns in are painted before the first frame, like the widths, or the row would draw
        // once in the authored order and again in the viewer's.
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

    /** A press on a caption the viewer may drag: the table says its columns move, and this column is one that does. Not the handle at its edge. */
    private resolveCaption(target: Element): HTMLElement | null {
        const cell = target.closest<HTMLElement>(`.${HeaderCellClass}`);
        const table = cell?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (cell === null || table === null || !table.classList.contains(ReorderableClass) || target.closest(ResizerSelector) !== null)
            return null;

        return cell.classList.contains(PinnedModifierClass) || cell.hasAttribute(TableFixedAttribute) ? null : cell;
    }

    /** The places a drop may take — the columns in view that move, in the order they stand — and where the dragged one starts from. */
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

    /**
     * Where the column would land if let go now, counted by how many middles the pointer has passed. The line marks the edge it
     * would take; nothing is drawn where it already is.
     */
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

        this.moved = true;
        this.moveColumn(context.table, context.index, rest[context.target]?.index ?? null);
    }

    /**
     * Puts the column before the one at `before`, or at the row's end when there is none, keeping the whole order by key. Columns
     * that never move are written back into their authored places, so a stored order always reads as one.
     */
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

    /** The click a drag ends with is the drag's, not the caption's: a grid would otherwise sort by the column just dropped. */
    private swallowClick(domEvent: Event): void {
        if (!this.moved)
            return;

        this.moved = false;
        domEvent.preventDefault();
        domEvent.stopPropagation();
    }
}

/**
 * The floors of the two columns a drag moved, put back level with what the drag made of them; the drag clamps against the
 * author's floor, not the track's, or no column could ever be made narrower than authored.
 */
function keepColumnFloors(tracks: readonly GridTrack[], moved: GridTrack[], indices: readonly number[]): GridTrack[] {
    for (const index of indices) {
        if (tracks[index].kind === "star" && tracks[index].min === tracks[index].value && moved[index].kind === "star")
            moved[index] = { ...moved[index], min: moved[index].value };
    }

    return moved;
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

/** Whether the author's tier hides the column in the viewport as it is now. */
function hiddenByTier(column: Column): boolean {
    return column.hideBelow !== null && responsiveTiers.indexOf(currentResponsiveTier()) < responsiveTiers.indexOf(column.hideBelow);
}

function isTier(value: string | null): value is ResponsiveTier {
    return value !== null && (responsiveTiers as readonly string[]).includes(value);
}
