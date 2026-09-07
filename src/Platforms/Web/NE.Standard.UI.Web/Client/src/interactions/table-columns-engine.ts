// A table's columns are sized by the viewer at the handle in each header cell, and the widths stay in the browser: the
// columns are not bindable, and a drag is nobody's application state. A handle moves the boundary between its column and
// the next, as a splitter does, so the table's width and its last column's right edge never move.

import { ColumnLimitsAttribute, TableColumnAttribute } from "../addressing/dom-attributes";
import { OnceWarner } from "../runtime/logger";
import { ClientStore } from "../state/client-store";
import { observeComponents } from "./dom-mutations";
import { applyGridTrackLimits, formatGridTracks, GridTrack, moveSplit, parseGridTrackLimits, parseGridTracks } from "./grid-tracks";
import { PointerDrag } from "./pointer-drag";

const RootClass = "ui-table";
const ResizerSelector = ".ui-table__resizer";

/** The authored track list (the renderer's variable) and the viewer's, which the stylesheet reads over it. */
const AuthoredVariable = "--ui-table-columns";
const SizedVariable = "--ui-table-sized-columns";
const ColumnsSlot = "columns";

// Narrower than this and a column is a line; the authored floor wins when it is higher.
const MinimumWidth = 32;
const Step = 16;

/** What a handle knows about its table when a gesture starts. */
type ResizeContext = {
    readonly table: HTMLElement;
    readonly index: number;
    readonly tracks: readonly GridTrack[];
    readonly sizes: readonly number[];
};

export type TableColumnsEngineOptions = {
    readonly root?: ParentNode;
};

export class TableColumnsEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();
    private readonly restored = new WeakSet<Element>();
    private readonly warner = new OnceWarner();
    private readonly drag: PointerDrag<ResizeContext>;

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

        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);

        this.restoreEach(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        observeComponents(this.root, `.${RootClass}`, { childList: true }, tables => this.restoreEach(tables));
    }

    private restoreEach(tables: Iterable<HTMLElement>): void {
        for (const table of tables) {
            if (this.restored.has(table))
                continue;

            this.restored.add(table);
            this.restore(table);
        }
    }

    /** Applies the viewer's stored widths where the boot script did not — a first run after an update, a page with no head script. */
    private restore(table: HTMLElement): void {
        const stored = this.store.read(table, ColumnsSlot);

        if (stored !== null && table.style.getPropertyValue(SizedVariable).length === 0)
            table.style.setProperty(SizedVariable, stored);
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

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

    /** A double-click on a handle puts the authored widths back and forgets the viewer's. */
    private handleDoubleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const handle = domEvent.target.closest<HTMLElement>(ResizerSelector);
        const table = handle?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (table === null)
            return;

        table.style.removeProperty(SizedVariable);
        this.store.write(table, ColumnsSlot, null);
    }

    /** Moves the boundary after the column `delta` pixels from where the gesture began, within both columns' bounds; answers whether anything moved. */
    private apply(context: ResizeContext, delta: number): boolean {
        // The two columns either side of the handle trade width; the splitter's arithmetic clamps and writes them.
        const bounded = context.tracks.map((track, index) => index === context.index || index === context.index + 1
            ? { ...track, min: Math.max(MinimumWidth, track.min ?? 0) }
            : track);
        const moved = moveSplit(bounded, context.sizes, { before: [context.index], after: [context.index + 1] }, delta);

        if (moved === null)
            return false;

        context.table.style.setProperty(SizedVariable, formatGridTracks(moved));

        return true;
    }

    /** Keeps the widths and the boot patch that paints them before the next page's first frame. */
    private remember(table: HTMLElement): void {
        const template = table.style.getPropertyValue(SizedVariable).trim();

        if (template.length === 0) {
            this.store.write(table, ColumnsSlot, null);
            return;
        }

        this.store.write(table, ColumnsSlot, template, { styles: { [SizedVariable]: template } });
    }

    /** Everything a gesture needs, read afresh: the tracks in force, their laid-out sizes and the column the handle sizes. */
    private resolveContext(handle: HTMLElement): ResizeContext | null {
        const table = handle.closest<HTMLElement>(`.${RootClass}`);

        if (table === null)
            return null;

        const template = table.style.getPropertyValue(SizedVariable).trim() || table.style.getPropertyValue(AuthoredVariable).trim();
        const parsed = template.length === 0 ? null : parseGridTracks(template);

        if (parsed === null) {
            this.warner.warn(table, "the table's track list could not be read.", { template });
            return null;
        }

        const tracks = applyGridTrackLimits(parsed, parseGridTrackLimits(table.getAttribute(ColumnLimitsAttribute)));
        const sizes = getComputedStyle(table).gridTemplateColumns.split(" ").map(parseFloat).filter(size => Number.isFinite(size));
        const index = Number(handle.getAttribute(TableColumnAttribute));

        // The last column's edge is the table's own; it has no neighbour to trade width with.
        if (!Number.isInteger(index) || index < 0 || index >= tracks.length - 1 || sizes.length < tracks.length) {
            this.warner.warn(table, "the handle's column could not be found in its table.", { index, tracks: tracks.length, sizes: sizes.length });
            return null;
        }

        return { table, index, tracks, sizes };
    }
}
