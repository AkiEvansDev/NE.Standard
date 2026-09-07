// A splitter re-divides its container's tracks on the client and keeps the viewer's division in the browser: the
// container's Columns/Rows are not bindable, and a drag is nobody's application state.

import { ColumnLimitsAttribute, RowLimitsAttribute, SplitterStepAttribute } from "../addressing/dom-attributes";
import { currentResponsiveTier, ResponsiveTier, responsiveTiers, responsiveVariable } from "../rendering/responsive-tier";
import { OnceWarner } from "../runtime/logger";
import { ClientBootPatch, ClientStore } from "../state/client-store";
import { observeComponents } from "./dom-mutations";
import { PointerDrag } from "./pointer-drag";
import {
    applyGridTrackLimits,
    formatGridTracks,
    GridSplitRuns,
    GridTrack,
    moveSplit,
    parseGridTrackLimits,
    parseGridTracks,
    resolveSplitRuns,
    splitPercent
} from "./grid-tracks";

const RootClass = "ui-grid-splitter";
const ContainerClass = "ui-container";
const VerticalClass = "ui-orientation--vertical";
const DefaultStep = 16;

/** One axis of a container: what the renderer wrote, what a drag writes over it, and where the viewer's copy is kept. */
type SplitAxis = {
    readonly slot: "columns" | "rows";
    /** The authored template, `ContainerComponentRenderer`'s variable. */
    readonly authored: string;
    /** The viewer's family, one custom property per tier over the authored one in the stylesheet's chain. */
    readonly split: string;
    readonly limits: string;
    readonly computed: "gridTemplateColumns" | "gridTemplateRows";
    readonly lineStart: "gridColumnStart" | "gridRowStart";
    readonly coordinate: "clientX" | "clientY";
    readonly decrease: string;
    readonly increase: string;
};

const Columns: SplitAxis = {
    slot: "columns",
    authored: "--ui-columns",
    split: "--ui-split-columns",
    limits: ColumnLimitsAttribute,
    computed: "gridTemplateColumns",
    lineStart: "gridColumnStart",
    coordinate: "clientX",
    decrease: "ArrowLeft",
    increase: "ArrowRight"
};

const Rows: SplitAxis = {
    slot: "rows",
    authored: "--ui-rows",
    split: "--ui-split-rows",
    limits: RowLimitsAttribute,
    computed: "gridTemplateRows",
    lineStart: "gridRowStart",
    coordinate: "clientY",
    decrease: "ArrowUp",
    increase: "ArrowDown"
};

/** The viewer's templates by tier, as stored: the shape the boot script writes back as styles. */
type StoredSplit = Partial<Record<ResponsiveTier, string>>;

/** What a splitter knows about its place when a gesture starts. */
type SplitContext = {
    readonly container: HTMLElement;
    readonly axis: SplitAxis;
    readonly tracks: readonly GridTrack[];
    readonly sizes: readonly number[];
    readonly runs: GridSplitRuns;
    readonly tier: ResponsiveTier;
};

export type GridSplitterEngineOptions = {
    readonly root?: ParentNode;
};

export class GridSplitterEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();

    // Restored per container and axis, not per run: the store is the viewer's word, and it is applied once.
    private readonly restored = new WeakMap<Element, Set<string>>();
    private readonly warner = new OnceWarner();
    private readonly drag: PointerDrag<SplitContext>;

    public constructor(options: GridSplitterEngineOptions = {}) {
        this.root = options.root ?? document;

        this.drag = new PointerDrag<SplitContext>({
            root: this.root,
            resolveHandle: target => target.closest<HTMLElement>(`.${RootClass}`),
            begin: splitter => this.resolveContext(splitter),
            coordinate: context => context.axis.coordinate,
            move: (context, delta) => {
                this.apply(context, delta);
            },
            end: (splitter, context) => {
                this.remember(context);
                this.reportPosition(splitter);
            }
        });

        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);

        this.prepareEach(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        observeComponents(this.root, `.${RootClass}`, { childList: true }, splitters => this.prepareEach(splitters));
    }

    private prepareEach(splitters: Iterable<HTMLElement>): void {
        for (const splitter of splitters) {
            const container = containerOf(splitter);

            if (container === null)
                continue;

            this.restore(container, axisOf(splitter));
            this.reportPosition(splitter);
        }
    }

    /** Applies the viewer's stored division where the boot script did not — a first run after an update, a page with no head script. */
    private restore(container: HTMLElement, axis: SplitAxis): void {
        let axes = this.restored.get(container);

        if (axes === undefined) {
            axes = new Set();
            this.restored.set(container, axes);
        }

        if (axes.has(axis.slot))
            return;

        axes.add(axis.slot);

        const stored = this.store.readJson<StoredSplit>(container, axis.slot);

        if (stored === null)
            return;

        for (const tier of responsiveTiers) {
            const template = stored[tier];
            const variable = responsiveVariable(axis.split, tier);

            if (template !== undefined && container.style.getPropertyValue(variable).length === 0)
                container.style.setProperty(variable, template);
        }
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        const splitter = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (splitter === null || this.drag.active)
            return;

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
        }
    }

    /** A double-click puts the authored layout back on this axis, at every width, and forgets the viewer's division. */
    private handleDoubleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const splitter = domEvent.target.closest<HTMLElement>(`.${RootClass}`);
        const container = splitter === null ? null : containerOf(splitter);

        if (splitter === null || container === null)
            return;

        const axis = axisOf(splitter);

        for (const tier of responsiveTiers)
            container.style.removeProperty(responsiveVariable(axis.split, tier));

        this.store.write(container, axis.slot, null);
        this.reportPosition(splitter);
    }

    /** Writes the division `delta` pixels from where the gesture began; answers whether anything moved. */
    private apply(context: SplitContext, delta: number): boolean {
        const moved = moveSplit(context.tracks, context.sizes, context.runs, delta);

        if (moved === null)
            return false;

        context.container.style.setProperty(responsiveVariable(context.axis.split, context.tier), formatGridTracks(moved));

        return true;
    }

    /** Keeps every tier's division and the boot patch that paints it before the next page's first frame. */
    private remember(context: SplitContext): void {
        const { container, axis } = context;
        const stored: StoredSplit = {};
        const styles: Record<string, string> = {};

        for (const tier of responsiveTiers) {
            const variable = responsiveVariable(axis.split, tier);
            const template = container.style.getPropertyValue(variable).trim();

            if (template.length > 0) {
                stored[tier] = template;
                styles[variable] = template;
            }
        }

        const patch: ClientBootPatch = { styles };

        this.store.write(container, axis.slot, Object.keys(stored).length === 0 ? null : JSON.stringify(stored), patch);
    }

    /** Everything a gesture needs, read afresh: the tracks in force at this width, their laid-out sizes, and the runs either side. */
    private resolveContext(splitter: HTMLElement): SplitContext | null {
        const container = containerOf(splitter);

        if (container === null) {
            this.warner.warn(splitter, "a grid splitter must be a direct child of a container.");
            return null;
        }

        const axis = axisOf(splitter);
        const tier = currentResponsiveTier();
        const template = resolveTemplate(container, axis, tier);
        const parsed = template === null ? null : parseGridTracks(template);

        if (parsed === null) {
            this.warner.warn(splitter, "the container's track list could not be read.", { template });
            return null;
        }

        const tracks = applyGridTrackLimits(parsed, parseGridTrackLimits(container.getAttribute(axis.limits)));
        const sizes = readSizes(container, axis);
        const index = readTrackIndex(splitter, axis);

        if (index === null || index >= tracks.length || sizes.length < tracks.length) {
            this.warner.warn(splitter, "the splitter's track could not be found in its container.", { index, tracks: tracks.length, sizes: sizes.length });
            return null;
        }

        if (tracks[index].kind === "star")
            this.warner.warn(splitter, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");

        const siblings = ownSplitters(container, axis)
            .map(sibling => readTrackIndex(sibling, axis))
            .filter((value): value is number => value !== null && value !== index);
        const runs = resolveSplitRuns(index, siblings, tracks.length);

        if (runs === null) {
            this.warner.warn(splitter, "a grid splitter at the container's edge has nothing on one side to move.");
            return null;
        }

        return { container, axis, tracks, sizes, runs, tier };
    }

    /** `aria-valuenow`: the share the run before the bar holds, as the layout stands. */
    private reportPosition(splitter: HTMLElement): void {
        const container = containerOf(splitter);

        if (container === null)
            return;

        const axis = axisOf(splitter);
        const index = readTrackIndex(splitter, axis);
        const sizes = readSizes(container, axis);
        const siblings = ownSplitters(container, axis)
            .map(sibling => readTrackIndex(sibling, axis))
            .filter((value): value is number => value !== null && value !== index);
        const runs = index === null ? null : resolveSplitRuns(index, siblings, sizes.length);

        if (runs === null)
            return;

        splitter.setAttribute("aria-valuemin", "0");
        splitter.setAttribute("aria-valuemax", "100");
        splitter.setAttribute("aria-valuenow", String(splitPercent(sizes, runs)));
    }
}

function containerOf(splitter: HTMLElement): HTMLElement | null {
    const parent = splitter.parentElement;

    return parent !== null && parent.classList.contains(ContainerClass) ? parent : null;
}

/** The splitter's own class, not the nearest ancestor carrying it: `ui-orientation--vertical` is shared with the layout panels. */
function axisOf(splitter: HTMLElement): SplitAxis {
    return splitter.classList.contains(VerticalClass) ? Columns : Rows;
}

/** The template in force at this tier: the viewer's for this tier or the nearest narrower one, else the authored. */
function resolveTemplate(container: HTMLElement, axis: SplitAxis, tier: ResponsiveTier): string | null {
    for (let position = responsiveTiers.indexOf(tier); position >= 0; position--) {
        const own = container.style.getPropertyValue(responsiveVariable(axis.split, responsiveTiers[position])).trim();

        if (own.length > 0)
            return own;
    }

    const authored = container.style.getPropertyValue(axis.authored).trim();

    return authored.length > 0 ? authored : null;
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

function ownSplitters(container: HTMLElement, axis: SplitAxis): HTMLElement[] {
    const splitters: HTMLElement[] = [];

    for (const child of container.children) {
        if (child instanceof HTMLElement && child.classList.contains(RootClass) && axisOf(child) === axis)
            splitters.push(child);
    }

    return splitters;
}

function readStep(splitter: HTMLElement): number {
    const step = Number(splitter.getAttribute(SplitterStepAttribute));

    return Number.isFinite(step) && step > 0 ? step : DefaultStep;
}
