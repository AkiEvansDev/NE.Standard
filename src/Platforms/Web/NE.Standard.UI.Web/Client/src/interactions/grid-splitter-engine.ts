// A splitter re-divides its container's tracks on the client and keeps the viewer's division in the browser: the
// container's Columns/Rows are not bindable. A bound Position also gives the share to the controller and takes it from there.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { BindPositionAttribute, ColumnLimitsAttribute, ContainerClass, GridSplitterClass, HiddenClass, OrientationVerticalClass, RowLimitsAttribute, SplitEdgeAttribute, SplitFoldedAttribute, SplitterPositionAttribute, SplitterStepAttribute, TierOrientationAttribute, VisibilityTierAttributes, writeAttribute } from "../addressing/dom-attributes.ts";
import { currentResponsiveTier, onTierChange, resolveTier, responsiveTiers, responsiveVariable } from "../rendering/responsive-tier.ts";
import type { ResponsiveTier } from "../rendering/responsive-tier.ts";
import { fitTierClasses } from "../rendering/tier-class.ts";
import { OnceWarner } from "../metadata/logger.ts";
import { ClientStore } from "../state/client-store.ts";
import type { ClientBootPatch } from "../state/client-store.ts";
import { observeComponents } from "./dom-mutations.ts";
import { observeSize } from "./element-size.ts";
import { isInert } from "./interactive-state.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { PointerDrag } from "./pointer-drag.ts";
import {
    applyGridTrackLimits,
    bigStep,
    coversNoRoom,
    FoldPixels,
    formatGridTracks,
    moveSplit,
    narrowRunTracks,
    parseGridTrackLimits,
    parseGridTracks,
    releaseDelta,
    parseShare,
    resolveSplitRuns,
    shareDelta,
    splitPercent,
    splitShare
} from "./grid-tracks.ts";
import type { GridSplitRuns, GridTrack, SplitMove } from "./grid-tracks.ts";

const DefaultStep = 16;

// A drag follows the pointer, under a side's floor too, and the side folds or springs back as it is let go (settle); a step (a key, a
// share) does not stop under the fold's width or the side's floor: it folds the side or opens it to the larger of the two.
const DragMove: SplitMove = { sliver: 0, passFloors: true };
const StepMove: SplitMove = { sliver: FoldPixels, passFloors: true };

/** One axis of a container: what the renderer wrote, what a drag writes over it, and where the viewer's copy is kept. */
type SplitAxis = {
    readonly slot: "columns" | "rows";
    /** The authored template, `ContainerComponentRenderer`'s variable. */
    readonly authored: string;
    /** The stylesheet's default template when no `--ui-<axis>` property is set (`ui-container.less`). */
    readonly defaultTemplate: string;
    /** The viewer's family, one custom property per tier over the authored one in the stylesheet's chain. */
    readonly split: string;
    readonly limits: string;
    readonly computed: "gridTemplateColumns" | "gridTemplateRows";
    readonly lineStart: "gridColumnStart" | "gridRowStart";
    readonly lineEnd: "gridColumnEnd" | "gridRowEnd";
    readonly coordinate: "clientX" | "clientY";
    readonly decrease: string;
    readonly increase: string;
};

const Columns: SplitAxis = {
    slot: "columns",
    authored: "--ui-columns",
    defaultTemplate: "repeat(24, minmax(0, 1fr))",
    split: "--ui-split-columns",
    limits: ColumnLimitsAttribute,
    computed: "gridTemplateColumns",
    lineStart: "gridColumnStart",
    lineEnd: "gridColumnEnd",
    coordinate: "clientX",
    decrease: "ArrowLeft",
    increase: "ArrowRight"
};

const Rows: SplitAxis = {
    slot: "rows",
    authored: "--ui-rows",
    defaultTemplate: "minmax(0, 1fr)",
    split: "--ui-split-rows",
    limits: RowLimitsAttribute,
    computed: "gridTemplateRows",
    lineStart: "gridRowStart",
    lineEnd: "gridRowEnd",
    coordinate: "clientY",
    decrease: "ArrowUp",
    increase: "ArrowDown"
};

/** The viewer's templates by tier, as stored: pure viewer divisions without wider-tier fence overrides. */
type StoredSplit = Partial<Record<ResponsiveTier, string>>;

/** What a splitter knows about its place when a gesture starts. */
type SplitContext = {
    readonly splitter: HTMLElement;
    readonly container: HTMLElement;
    readonly axis: SplitAxis;
    readonly tracks: readonly GridTrack[];
    readonly sizes: readonly number[];
    readonly runs: GridSplitRuns;
    readonly tier: ResponsiveTier;
    /** The tier's own viewer division as the gesture found it: what Escape mid-drag puts back. */
    readonly before: string | undefined;
};

export type GridSplitterEngineOptions = {
    readonly root?: ParentNode;
};

export class GridSplitterEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();

    // Restored per container and axis, not per run: the store is the viewer's word, and it is applied once.
    private readonly restored = new WeakMap<Element, Set<string>>();
    private readonly splits = new WeakMap<HTMLElement, { columns: StoredSplit; rows: StoredSplit }>();
    private readonly warner = new OnceWarner();
    private readonly drag: PointerDrag<SplitContext>;

    // The width a bound bar was last placed at: another tier has tracks of its own, which the same share is placed on once.
    private readonly placedTiers = new WeakMap<HTMLElement, ResponsiveTier>();

    // A bar with a share the page did not show yet, and what stops watching its box.
    private readonly waiting = new WeakMap<HTMLElement, () => void>();

    public constructor(options: GridSplitterEngineOptions = {}) {
        this.root = options.root ?? document;

        this.drag = new PointerDrag<SplitContext>({
            root: this.root,
            resolveHandle: target => target.closest<HTMLElement>(`.${GridSplitterClass}`),
            begin: splitter => this.resolveContext(splitter),
            coordinate: context => context.axis.coordinate,
            // The bar follows the pointer all the way, a side too narrow for its panes showing none of them; let go there, it folds.
            move: (context, delta) => {
                if (this.apply(context, delta, DragMove))
                    this.reportPosition(context.splitter, context.tracks);
            },
            end: (splitter, context) => {
                this.settle(splitter);
                this.remember(context);
                this.reportPosition(splitter);
                this.writeBack(splitter, context);
            },
            cancel: (splitter, context) => this.putBack(splitter, context)
        });

        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);

        this.prepareEach(this.root.querySelectorAll<HTMLElement>(`.${GridSplitterClass}`));

        observeComponents(this.root, `.${GridSplitterClass}`, { childList: true, addedOnly: true }, splitters => this.prepareEach(splitters));

        // A share the controller pushed; none on a bound bar puts the authored tracks back.
        observeComponents(this.root, `.${GridSplitterClass}`, { attributeFilter: [SplitterPositionAttribute] }, splitters => this.takeEach(splitters));

        // Another width may bring another tier's tracks or turn a cross-axis bar: a folded pane is measured again, and given back once
        // its tracks have room; a bound bar is placed on the new tier's tracks at its share.
        onTierChange(() => this.handleTierChange());
        window.addEventListener("resize", () => this.reportEach());
    }

    private prepareEach(splitters: Iterable<HTMLElement>): void {
        const tier = currentResponsiveTier();

        for (const splitter of splitters) {
            const container = containerOf(splitter);

            if (container === null)
                continue;

            syncSplitterOrientation(splitter, tier);

            for (const axis of axesOf(splitter))
                this.restore(container, axis);

            this.place(splitter);
            this.reportPosition(splitter);
        }
    }

    private handleTierChange(): void {
        const tier = currentResponsiveTier();

        for (const splitter of this.root.querySelectorAll<HTMLElement>(`.${GridSplitterClass}`))
            syncSplitterOrientation(splitter, tier);

        this.reportEach();
    }

    /** Applies the viewer's stored division where the boot script did not, and fences wider tiers whose tracks or axis change. */
    private restore(container: HTMLElement, axis: SplitAxis): void {
        let axes = this.restored.get(container);

        if (axes === undefined) {
            axes = new Set();
            this.restored.set(container, axes);
        }

        if (axes.has(axis.slot))
            return;

        axes.add(axis.slot);

        const axisSplits = this.axisSplits(container, axis);
        const stored = this.store.readJson<StoredSplit>(container, axis.slot);

        if (stored !== null) {
            for (const tier of responsiveTiers) {
                const template = stored[tier];

                if (typeof template === "string" && template.length > 0)
                    axisSplits[tier] = template;
            }
        }
        else {
            for (const tier of responsiveTiers) {
                const existing = container.style.getPropertyValue(responsiveVariable(axis.split, tier)).trim();

                if (existing.length > 0)
                    axisSplits[tier] = existing;
            }
        }

        if (Object.keys(axisSplits).length > 0)
            this.syncAxisStyles(container, axis);
    }

    private axisSplits(container: HTMLElement, axis: SplitAxis): StoredSplit {
        let pair = this.splits.get(container);

        if (pair === undefined) {
            pair = { columns: {}, rows: {} };
            this.splits.set(container, pair);
        }

        return pair[axis.slot];
    }

    /**
     * Writes the viewer's divisions onto `container.style` and fences wider tiers that define new authored tracks or carry no active
     * splitter on `axis`, so a narrow tier's split never leaks upward into a breakpoint with a different layout.
     */
    private syncAxisStyles(container: HTMLElement, axis: SplitAxis): void {
        const splits = this.axisSplits(container, axis);
        let inSplitChain: string | undefined;
        let fenced = false;

        for (const tier of responsiveTiers) {
            const variable = responsiveVariable(axis.split, tier);
            const own = splits[tier];

            if (own !== undefined) {
                container.style.setProperty(variable, own);
                inSplitChain = own;
                fenced = false;
                continue;
            }

            if (inSplitChain === undefined) {
                container.style.removeProperty(variable);
                continue;
            }

            const hasOwnAuthored = tier !== "base" && container.style.getPropertyValue(responsiveVariable(axis.authored, tier)).trim().length > 0;
            const hasSplitter = ownSplitters(container, axis, tier).length > 0;

            if (fenced || hasOwnAuthored || !hasSplitter) {
                const authored = resolveAuthoredTemplate(container, axis, tier) ?? axis.defaultTemplate;

                fenced = true;

                if (authored !== inSplitChain) {
                    container.style.setProperty(variable, authored);
                    inSplitChain = authored;
                }
                else
                    container.style.removeProperty(variable);
            }
            else
                container.style.removeProperty(variable);
        }
    }

    /** Whether a viewer division applies at `tier` without an intervening authored track change or axis switch. */
    private hasViewerSplit(container: HTMLElement, axis: SplitAxis, tier: ResponsiveTier): boolean {
        const splits = this.axisSplits(container, axis);

        for (let position = responsiveTiers.indexOf(tier); position >= 0; position--) {
            const candidate = responsiveTiers[position];

            if (splits[candidate] !== undefined)
                return true;

            if (candidate !== "base" && container.style.getPropertyValue(responsiveVariable(axis.authored, candidate)).trim().length > 0)
                return false;

            if (ownSplitters(container, axis, candidate).length === 0)
                return false;
        }

        return false;
    }

    /**
     * Moves the bar to the share its `Position` holds, at the width in force, and keeps that division as a drag's is kept, so the
     * next page paints it first. Within a pixel the bar already stands there: the share a drag wrote back comes round to this too.
     * Unbound, the share is the authored starting division, and a division the viewer left at this width stands over it.
     */
    private place(splitter: HTMLElement): void {
        const share = readShareAttribute(splitter);

        if (share === null)
            return;

        // A bar the page does not show (a hidden tab, a folded panel, a width that hides it) has no track to find.
        if (splitter.getClientRects().length === 0) {
            this.waitForBox(splitter);
            return;
        }

        this.stopWaiting(splitter);

        const context = this.resolveContext(splitter);

        if (context === null)
            return;

        this.placedTiers.set(splitter, context.tier);

        if (!splitter.hasAttribute(BindPositionAttribute) && this.hasViewerSplit(context.container, context.axis, context.tier))
            return;

        const delta = shareDelta(context.sizes, context.runs, share);

        if (Math.abs(delta) >= 1 && this.apply(context, delta))
            this.remember(context);
    }

    /** Places a hidden bar once it has a box; it stops watching once placed, removed, or left with no share. */
    private waitForBox(splitter: HTMLElement): void {
        if (this.waiting.has(splitter))
            return;

        this.waiting.set(splitter, observeSize(splitter, () => {
            if (!splitter.isConnected || readShareAttribute(splitter) === null)
                this.stopWaiting(splitter);
            else if (splitter.getClientRects().length > 0) {
                this.place(splitter);
                this.reportPosition(splitter);
            }
        }));
    }

    private stopWaiting(splitter: HTMLElement): void {
        this.waiting.get(splitter)?.();
        this.waiting.delete(splitter);
    }

    private takeEach(splitters: Iterable<HTMLElement>): void {
        for (const splitter of splitters) {
            if (readShareAttribute(splitter) === null && splitter.hasAttribute(BindPositionAttribute))
                this.reset(splitter, false);
            else
                this.place(splitter);

            this.reportPosition(splitter);
        }
    }

    private reportEach(): void {
        const tier = currentResponsiveTier();

        for (const splitter of this.root.querySelectorAll<HTMLElement>(`.${GridSplitterClass}`)) {
            // A placed bar on the tracks of a tier it was not placed at yet; one not placed for want of a box waits for it (waitForBox).
            if (this.placedTiers.has(splitter) && this.placedTiers.get(splitter) !== tier)
                this.place(splitter);

            this.reportPosition(splitter);
        }
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element) || !isPlainKey(domEvent))
            return;

        const splitter = domEvent.target.closest<HTMLElement>(`.${GridSplitterClass}`);

        if (splitter === null || this.drag.active || isInert(splitter))
            return;

        // The double-click's twin, so no gesture is the pointer's alone.
        if (domEvent.key === "Enter") {
            domEvent.preventDefault();
            this.reset(splitter);
            return;
        }

        const context = this.resolveContext(splitter);

        if (context === null)
            return;

        const step = readStep(splitter);
        const room = context.sizes.reduce((total, size) => total + size, 0);
        let delta: number;

        switch (domEvent.key) {
            case context.axis.decrease:
                delta = -step;
                break;
            case context.axis.increase:
                delta = step;
                break;
            case "PageUp":
            case "PageDown":
                delta = bigStep(step, room) * pageDirection(domEvent.key, context.axis);
                break;
            case "Home":
                delta = -room;
                break;
            case "End":
                delta = room;
                break;
            default:
                return;
        }

        domEvent.preventDefault();

        if (this.apply(context, delta)) {
            this.remember(context);
            this.reportPosition(splitter);
            this.writeBack(splitter, context);
        }
    }

    /**
     * Puts the authored layout back on the active axis (or every axis a bound bar spans) and forgets the viewer's division — an unbound
     * bar's authored share included, which it then stands at again; a bound bar tells the controller, unless the controller is who said so.
     */
    private reset(splitter: HTMLElement, tell = true): void {
        const container = containerOf(splitter);

        if (container === null)
            return;

        const bound = splitter.hasAttribute(BindPositionAttribute);
        const axes = bound ? axesOf(splitter) : [axisOf(splitter)];

        for (const axis of axes) {
            const splits = this.axisSplits(container, axis);

            for (const key of Object.keys(splits) as ResponsiveTier[])
                delete splits[key];

            this.syncAxisStyles(container, axis);
            this.store.write(container, axis.slot, null);
        }

        this.placedTiers.delete(splitter);

        if (!bound)
            this.place(splitter);

        this.reportPosition(splitter);

        if (tell && bound && splitter.hasAttribute(SplitterPositionAttribute)) {
            splitter.removeAttribute(SplitterPositionAttribute);
            splitter.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    /** A bound bar tells the controller the share it now stands at, as laid out; one that did not move tells nothing. */
    private writeBack(splitter: HTMLElement, context: SplitContext): void {
        if (!splitter.hasAttribute(BindPositionAttribute))
            return;

        const share = formatShare(splitShare(readSizes(context.container, context.axis), context.runs));

        if (splitter.getAttribute(SplitterPositionAttribute) === share)
            return;

        splitter.setAttribute(SplitterPositionAttribute, share);
        this.placedTiers.set(splitter, context.tier);
        splitter.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private handleDoubleClick(domEvent: Event): void {
        const splitter = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${GridSplitterClass}`) : null;

        if (splitter !== null)
            this.reset(splitter);
    }

    /** A side the bar was let go under `FoldPixels` from folds to nothing; one let go under its floor springs back to it. */
    private settle(splitter: HTMLElement): void {
        const context = this.resolveContext(splitter);
        const delta = context === null ? 0 : releaseDelta(context.tracks, context.sizes, context.runs, FoldPixels);

        if (context !== null && delta !== 0)
            this.apply(context, delta, DragMove);
    }

    /** Escape mid-drag: the division the drag found, nothing kept in the browser or told to the controller. */
    private putBack(splitter: HTMLElement, context: SplitContext): void {
        const splits = this.axisSplits(context.container, context.axis);

        if (context.before === undefined)
            delete splits[context.tier];
        else
            splits[context.tier] = context.before;

        this.syncAxisStyles(context.container, context.axis);
        this.reportPosition(splitter);
    }

    /** Writes the division `delta` pixels from where the gesture began, a step's by default; answers whether anything moved. */
    private apply(context: SplitContext, delta: number, move = StepMove): boolean {
        const moved = moveSplit(context.tracks, context.sizes, context.runs, delta, move);

        if (moved === null)
            return false;

        this.axisSplits(context.container, context.axis)[context.tier] = formatGridTracks(moved);
        this.syncAxisStyles(context.container, context.axis);

        return true;
    }

    /** Keeps every tier's viewer division and the boot patch (viewer divisions plus wider-tier fences) that paints it before the first frame. */
    private remember(context: SplitContext): void {
        const { container, axis } = context;
        const splits = this.axisSplits(container, axis);
        const styles: Record<string, string> = {};

        for (const tier of responsiveTiers) {
            const variable = responsiveVariable(axis.split, tier);
            const template = container.style.getPropertyValue(variable).trim();

            if (template.length > 0)
                styles[variable] = template;
        }

        const patch: ClientBootPatch = { styles };

        this.store.write(container, axis.slot, Object.keys(splits).length === 0 ? null : JSON.stringify(splits), patch);
    }

    /** Everything a gesture needs, read afresh: the tracks in force at this width, their laid-out sizes, and the runs either side. */
    private resolveContext(splitter: HTMLElement): SplitContext | null {
        const container = containerOf(splitter);

        if (container === null) {
            this.warner.warn(splitter, "a grid splitter must be a direct child of a container.");
            return null;
        }

        const tier = currentResponsiveTier();

        if (splitterCollapsedAt(splitter, tier))
            return null;

        const axis = axisOf(splitter, tier);

        this.restore(container, axis);

        const template = resolveTemplate(container, axis, tier);
        const parsed = template === null ? null : parseGridTracks(template);

        if (parsed === null) {
            this.warner.warn(splitter, "the container's track list could not be read.", { template });
            return null;
        }

        const tracks = applyGridTrackLimits(parsed, parseGridTrackLimits(container.getAttribute(axis.limits), tier));
        const sizes = readSizes(container, axis);
        const index = readTrackIndex(splitter, axis);

        if (index === null || index >= tracks.length || sizes.length < tracks.length) {
            this.warner.warn(splitter, "the splitter's track could not be found in its container.", { index, tracks: tracks.length, sizes: sizes.length });
            return null;
        }

        if (tracks[index].kind === "star")
            this.warner.warn(splitter, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");

        const siblings = ownSplitters(container, axis, tier)
            .map(sibling => readTrackIndex(sibling, axis))
            .filter((value): value is number => value !== null && value !== index);
        const runs = resolveSplitRuns(index, siblings, tracks.length);

        if (runs === null) {
            this.warner.warn(splitter, "a grid splitter at the container's edge has nothing on one side to move.");
            return null;
        }

        return { splitter, container, axis, tracks, sizes, runs, tier, before: this.axisSplits(container, axis)[tier] };
    }

    /**
     * `aria-valuenow`: the share the run before the bar holds, as the layout stands; while a drag holds the gesture's `tracks`, a side
     * under the fold's width or its floor shows nothing.
     */
    private reportPosition(splitter: HTMLElement, tracks?: readonly GridTrack[]): void {
        const container = containerOf(splitter);

        if (container === null)
            return;

        const tier = currentResponsiveTier();

        syncSplitterOrientation(splitter, tier);

        if (splitterCollapsedAt(splitter, tier)) {
            writeAttribute(splitter, SplitEdgeAttribute, null);
            foldEmptyPanes(container, null);
            return;
        }

        const axis = axisOf(splitter, tier);
        const index = readTrackIndex(splitter, axis);
        const sizes = readSizes(container, axis);
        const siblings = ownSplitters(container, axis, tier)
            .map(sibling => readTrackIndex(sibling, axis))
            .filter((value): value is number => value !== null && value !== index);
        const runs = index === null ? null : resolveSplitRuns(index, siblings, sizes.length);

        if (runs === null) {
            writeAttribute(splitter, SplitEdgeAttribute, null);
            foldEmptyPanes(container, null);
            return;
        }

        splitter.setAttribute("aria-valuemin", "0");
        splitter.setAttribute("aria-valuemax", "100");
        splitter.setAttribute("aria-valuenow", String(splitPercent(sizes, runs)));

        const edge = runIsEmpty(sizes, runs.before) ? "before" : runIsEmpty(sizes, runs.after) ? "after" : null;

        writeAttribute(splitter, SplitEdgeAttribute, edge);

        foldEmptyPanes(container, tracks === undefined ? null : { axis, tracks: narrowRunTracks(tracks, sizes, runs, FoldPixels) });
    }
}

function runIsEmpty(sizes: readonly number[], run: readonly number[]): boolean {
    return run.every(index => (sizes[index] ?? 0) < 1);
}

/**
 * Marks each child whose tracks on either split axis are all nothing, or, on the axis a drag moves, all in a side it has taken under
 * `FoldPixels` or its floor (`narrow`): squeezed to no width its words stood one a line and stretched
 * the row to their height (`ui-container.less` takes the marked child away). Both axes at once, or a bar between rows cleared what
 * one between columns had marked. Measured on the tracks, not on the child, so a folded child is found again once a drag or another
 * width gives its tracks room; a splitter only across its own axis, since its own track is as wide as the bar it shows.
 */
function foldEmptyPanes(container: HTMLElement, narrow: { readonly axis: SplitAxis; readonly tracks: ReadonlySet<number> } | null): void {
    const tier = currentResponsiveTier();
    const axes = [Columns, Rows]
        .filter(axis => ownSplitters(container, axis, tier).length > 0)
        .map(axis => ({ axis, sizes: readSizes(container, axis) }));

    for (const child of container.children) {
        if (!(child instanceof HTMLElement))
            continue;

        const style = getComputedStyle(child);
        const own = child.classList.contains(GridSplitterClass) && !splitterCollapsedAt(child, tier) ? axisOf(child, tier) : null;
        const folded = axes.some(({ axis, sizes }) => axis !== own && coversNoRoom(style[axis.lineStart], style[axis.lineEnd], sizes, narrow?.axis === axis ? narrow.tracks : undefined));

        if (folded !== child.hasAttribute(SplitFoldedAttribute))
            child.toggleAttribute(SplitFoldedAttribute, folded);
    }
}

function containerOf(splitter: HTMLElement): HTMLElement | null {
    const parent = splitter.parentElement;

    return parent !== null && parent.classList.contains(ContainerClass) ? parent : null;
}

function syncSplitterOrientation(splitter: HTMLElement, tier: ResponsiveTier): void {
    if (splitter.hasAttribute(TierOrientationAttribute))
        fitTierClasses(splitter, tier);

    splitter.setAttribute("aria-orientation", axisOf(splitter, tier) === Columns ? "vertical" : "horizontal");
}

function splitterCollapsedAt(splitter: HTMLElement, tier: ResponsiveTier): boolean {
    return splitter.classList.contains(HiddenClass) || splitter.getAttribute(VisibilityTierAttributes[responsiveTiers.indexOf(tier)]) === "collapsed";
}

/** The splitter's axis at `tier`: read from `data-ui-tier-orientation` when tiered, else from its own class. */
function axisOf(splitter: HTMLElement, tier: ResponsiveTier = currentResponsiveTier()): SplitAxis {
    const classes = splitter.getAttribute(TierOrientationAttribute)?.split(" ").filter(name => name.length > 0);

    if (classes !== undefined && classes.length === responsiveTiers.length)
        return classes[responsiveTiers.indexOf(tier)] === OrientationVerticalClass ? Columns : Rows;

    return splitter.classList.contains(OrientationVerticalClass) ? Columns : Rows;
}

/** Every axis `splitter` can occupy across breakpoints. */
function axesOf(splitter: HTMLElement): SplitAxis[] {
    const classes = splitter.getAttribute(TierOrientationAttribute)?.split(" ").filter(name => name.length > 0);

    if (classes === undefined || classes.length !== responsiveTiers.length)
        return [axisOf(splitter)];

    const axes = new Set<SplitAxis>(classes.map(name => name === OrientationVerticalClass ? Columns : Rows));

    return [...axes];
}

/** The template in force at this tier: `--ui-split-<axis>` (including wider-tier fences), else the authored `--ui-<axis>` cascade. */
function resolveTemplate(container: HTMLElement, axis: SplitAxis, tier: ResponsiveTier): string | null {
    const own = resolveTier(tier, candidate => container.style.getPropertyValue(responsiveVariable(axis.split, candidate)).trim() || undefined);

    if (own !== undefined)
        return own;

    return resolveAuthoredTemplate(container, axis, tier);
}

/** The authored template in force at `tier`, resolved across `--ui-<axis>` tiers; null when none was written. */
function resolveAuthoredTemplate(container: HTMLElement, axis: SplitAxis, tier: ResponsiveTier): string | null {
    return resolveTier(tier, candidate => container.style.getPropertyValue(responsiveVariable(axis.authored, candidate)).trim() || undefined) ?? null;
}

/** Every track's laid-out size: a grid container's computed template is the used sizes, in pixels. */
function readSizes(container: HTMLElement, axis: SplitAxis): number[] {
    return getComputedStyle(container)[axis.computed].split(" ").map(parseFloat).filter(size => Number.isFinite(size));
}

/** The 0-based track a splitter occupies, from the grid line its placement resolved to at this width. */
function readTrackIndex(splitter: HTMLElement, axis: SplitAxis): number | null {
    const line = Number(getComputedStyle(splitter)[axis.lineStart]);

    return Number.isInteger(line) && line >= 1 ? line - 1 : null;
}

function ownSplitters(container: HTMLElement, axis: SplitAxis, tier: ResponsiveTier = currentResponsiveTier()): HTMLElement[] {
    const splitters: HTMLElement[] = [];

    for (const child of container.children) {
        if (child instanceof HTMLElement && child.classList.contains(GridSplitterClass) && !splitterCollapsedAt(child, tier) && axisOf(child, tier) === axis)
            splitters.push(child);
    }

    return splitters;
}

/** Which way a page key moves the bar: up or down as its name says across rows, PageUp toward the end across columns, as a range's. */
function pageDirection(key: string, axis: SplitAxis): number {
    if (axis.increase === "ArrowDown")
        return key === "PageDown" ? 1 : -1;

    return key === "PageUp" ? 1 : -1;
}

/** The share the bar's `Position` holds, or null for none. */
function readShareAttribute(splitter: HTMLElement): number | null {
    return parseShare(splitter.getAttribute(SplitterPositionAttribute));
}

/** Four places: a tenth of a pixel on a wide screen, and one text for one division, so a bar that did not move sends nothing. */
function formatShare(share: number): string {
    return String(Math.round(share * 10000) / 10000);
}

function readStep(splitter: HTMLElement): number {
    const step = Number(splitter.getAttribute(SplitterStepAttribute));

    return Number.isFinite(step) && step > 0 ? step : DefaultStep;
}
