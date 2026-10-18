// A pane container's panes moved by the viewer (PaneContainerComponentRenderer): a pane carried by its grip to another place trades
// places with the pane standing there, each sliding from where it stood. The layout that results goes to the controller where it is
// bound, else to the browser under the container's authored id; a layout the controller pushes moves the panes the same way. A grip
// is named after its pane's title; the keyboard's lift is a pressed grip that owns its keys, each step of it said to a screen reader.

import { BindLayoutAttribute, OwnsKeysAttribute, PaneAttribute, PaneCellsAttribute, PaneColumnsAttribute, PaneKeepsSizeAttribute, PaneLayoutAttribute, PanePlaceAttribute, PaneRowsAttribute } from "../addressing/dom-attributes.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { responsiveTiers, responsiveVariable } from "../rendering/responsive-tier.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { ClientStore } from "../state/client-store.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { announce, announceMoved } from "./live-announcer.ts";
import { PointerDrag } from "./pointer-drag.ts";

const RootClass = "ui-pane-container";
const PlaceClass = "ui-pane-container__place";
const PaneClass = "ui-pane-container__pane";
const GripClass = "ui-pane-container__grip";
const LiftedAttribute = "data-ui-pane-lifted";
const TargetAttribute = "data-ui-pane-target";
const MovingAttribute = "data-ui-pane-moving";
const NearAttribute = "data-ui-pane-near";
// On a lifted pane stood in the top layer (`raise`), for the stylesheet to take the popover's own box off it.
const RaisedAttribute = "data-ui-pane-raised";
// Where a pane's name is read from: the first title-sized text of its own, which a pane's header (`UIHeaderSize.Pane`) leads with.
const TitleSelector = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle";
const LayoutSlot = "panes";
const Separator = ",";

// The band at a pane's top whose pointer shows the grip: 2rem at the default size. Anywhere on the pane, it drew the eye from the work.
const GripZonePixels = 32;

type Point = { readonly x: number; readonly y: number };

/** A pane on its way: where it came from, where the pointer took it, and the place it would trade with. */
type Lift = {
    readonly container: HTMLElement;
    readonly grip: HTMLElement;
    readonly pane: HTMLElement;
    readonly origin: HTMLElement;
    readonly start: Point;
    target: HTMLElement | null;
};

export type PaneContainerEngineOptions = {
    readonly root?: ParentNode;
};

export class PaneContainerEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();
    private readonly drag: PointerDrag<Lift>;

    // Put back from the browser once per container: the stored layout is the viewer's word, and an unbound one has no other.
    private readonly restored = new WeakSet<Element>();

    // A lift the keyboard holds: the grip keeps the focus, the arrows choose the place and Space or Enter puts the pane there.
    private held: Lift | null = null;

    // The lift whose pane stands in the top layer, held where its place is as the page scrolls under it.
    private raised: Lift | null = null;

    // The pane whose top the pointer is over, its grip shown.
    private near: HTMLElement | null = null;

    // The top of the pane under the pointer, measured as the pointer comes onto another element and again after a scroll or a
    // resize, rather than on every move: a move during a streamed reply would lay the page out for it.
    private nearTop: { readonly pane: HTMLElement; readonly top: number } | null = null;

    public constructor(options: PaneContainerEngineOptions = {}) {
        this.root = options.root ?? document;

        this.drag = new PointerDrag<Lift>({
            root: this.root,
            resolveHandle: target => ownGrip(target),
            begin: (grip, point) => this.lift(grip, point),
            move: (lift, _delta, point) => this.follow(lift, point),
            end: (_grip, lift) => this.put(lift),
            cancel: (_grip, lift) => this.putBack(lift),
            takenBack: (_grip, lift) => this.putBack(lift)
        });

        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("focusout", domEvent => this.handleFocusOut(domEvent), true);
        // The pane's title may have changed since the grip was named: it is named again as the keyboard reaches it.
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent), true);
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), { passive: true });
        this.root.addEventListener("pointerout", domEvent => this.handlePointerOut(domEvent), { passive: true });
        this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: true });
        this.root.addEventListener("scroll", () => this.handleScroll(), { capture: true, passive: true });
        window.addEventListener("resize", () => this.forgetNearTop());

        this.arrangeEach(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`), false);

        // A container that arrives, and a layout the controller pushes; not every change inside a pane, which a streamed reply makes often.
        // A record inside an outer container names the outer one, so the containers nested in it are looked at too.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: [PaneLayoutAttribute], relevant: isOwnChange }, containers => this.arrangeEach(withNested(containers), true));
    }

    private arrangeEach(containers: Iterable<HTMLElement>, animate: boolean): void {
        for (const container of containers) {
            // A container met for the first time stands as it is put, with no slide from the authored places.
            const first = !this.restored.has(container);

            if (first) {
                this.restored.add(container);
                this.restore(container);

                for (const place of placesOf(container)) {
                    const grip = place.querySelector<HTMLElement>(`:scope > .${PaneClass} > .${GripClass}`);

                    if (grip !== null)
                        nameGrip(grip);
                }
            }

            // A layout pushed while a pane is lifted waits for the put back; a drop keeps the viewer's own.
            if (!container.hasAttribute(MovingAttribute))
                arrange(container, readLayout(container), animate && !first);
        }
    }

    /** An unbound container takes the layout this viewer left it in; a bound one has the controller's. */
    private restore(container: HTMLElement): void {
        if (container.hasAttribute(BindLayoutAttribute))
            return;

        const stored = this.store.read(container, LayoutSlot);

        if (stored !== null)
            container.setAttribute(PaneLayoutAttribute, stored);
    }

    private lift(grip: HTMLElement, point: Point): Lift | null {
        this.dropStaleHold();

        const pane = grip.parentElement;
        const origin = pane?.parentElement;
        const container = origin?.parentElement;

        if (this.held !== null || pane === null || origin === null || origin === undefined || container === null || container === undefined || shownPlacesOf(container).length < 2)
            return null;

        // A slide still playing would hold the pane against the pointer until it ends.
        if (typeof pane.getAnimations === "function") {
            for (const animation of pane.getAnimations())
                animation.cancel();
        }

        pane.setAttribute(LiftedAttribute, "");
        container.setAttribute(MovingAttribute, "");

        const lift: Lift = { container, grip, pane, origin, start: point, target: null };

        this.raise(lift);

        return lift;
    }

    /** A hold whose pane was re-rendered away: removing the focused grip raises no `focusout` to let it down. */
    private dropStaleHold(): void {
        const held = this.held;

        if (held === null || held.pane.isConnected)
            return;

        this.held = null;
        this.settle(held);
    }

    /**
     * Stands the pane in the top layer at the box it stood in, out of every box that clips round it — its container's, a scroller's —
     * which cut it flat as it went; its place keeps its size meanwhile, so nothing beside it moves.
     */
    private raise(lift: Lift): void {
        const { pane, origin } = lift;

        if (typeof pane.showPopover !== "function")
            return;

        const box = origin.getBoundingClientRect();

        origin.style.minWidth = `${box.width}px`;
        origin.style.minHeight = `${box.height}px`;
        pane.style.left = `${box.left}px`;
        pane.style.top = `${box.top}px`;
        pane.style.width = `${box.width}px`;
        pane.style.height = `${box.height}px`;
        pane.setAttribute("popover", "manual");
        pane.setAttribute(RaisedAttribute, "");
        pane.showPopover();
        this.raised = lift;
    }

    /** The pane follows the pointer, over the page, and the place under the pointer is marked as the one it would trade with. */
    private follow(lift: Lift, point: Point): void {
        lift.pane.style.transform = `translate(${point.x - lift.start.x}px, ${point.y - lift.start.y}px)`;
        this.mark(lift, placeAt(lift.container, lift.origin, point));
    }

    private mark(lift: Lift, target: HTMLElement | null): void {
        if (lift.target === target)
            return;

        lift.target?.removeAttribute(TargetAttribute);
        target?.setAttribute(TargetAttribute, "");
        lift.target = target;
    }

    /** Over another place, the two panes trade places; anywhere else the pane slides back to its own. Answers where it now stands, null for back. */
    private put(lift: Lift): HTMLElement | null {
        const target = lift.target;
        const origin = lift.pane.parentElement;
        const other = target?.querySelector<HTMLElement>(`:scope > .${PaneClass}`) ?? null;

        // The pane trades from where it stands now, and a place it already stands in is no target.
        if (target === null || origin === null || other === lift.pane || !lift.container.isConnected) {
            this.putBack(lift);
            return null;
        }

        this.settle(lift);

        const moves = new Map<HTMLElement, HTMLElement>([[lift.pane, target]]);

        if (other !== null)
            moves.set(other, origin);

        place(lift.container, moves, true);
        this.keep(lift.container);

        return target;
    }

    /** Back to its own place; then a layout pushed during the lift, held back till now, moves the panes (nothing, where none came). */
    private putBack(lift: Lift): void {
        this.settle(lift);
        slideBack(lift.pane);

        if (lift.container.isConnected)
            arrange(lift.container, readLayout(lift.container), true);
    }

    /** Takes the lift's marks off, the keyboard's on the grip too, the pane's offset left for its slide to start from. */
    private settle(lift: Lift): void {
        this.lower(lift);
        lift.target?.removeAttribute(TargetAttribute);
        lift.pane.removeAttribute(LiftedAttribute);
        lift.container.removeAttribute(MovingAttribute);
        lift.grip.setAttribute("aria-pressed", "false");
        lift.grip.removeAttribute(OwnsKeysAttribute);
    }

    /** Back in its place in the page, its offset kept for the slide that follows to start from where it was let go. */
    private lower(lift: Lift): void {
        const { pane, origin } = lift;

        if (this.raised === lift)
            this.raised = null;

        if (!pane.hasAttribute(RaisedAttribute))
            return;

        if (pane.matches(":popover-open"))
            pane.hidePopover();

        pane.removeAttribute("popover");
        pane.removeAttribute(RaisedAttribute);

        for (const property of ["left", "top", "width", "height"] as const)
            pane.style[property] = "";

        origin.style.minWidth = "";
        origin.style.minHeight = "";
    }

    /** Writes the layout the panes now stand in, and gives it to whoever keeps it: the controller where bound, else the browser. */
    private keep(container: HTMLElement): void {
        const layout = currentLayout(container);

        container.setAttribute(PaneLayoutAttribute, layout);

        if (container.hasAttribute(BindLayoutAttribute))
            container.dispatchEvent(new Event("change", { bubbles: true }));
        else
            this.store.write(container, LayoutSlot, layout);
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element) || !isPlainKey(domEvent))
            return;

        this.dropStaleHold();

        const grip = ownGrip(domEvent.target);

        if (grip === null || this.drag.active)
            return;

        const held = this.held;

        if (held === null) {
            if (domEvent.key !== " " && domEvent.key !== "Enter")
                return;

            domEvent.preventDefault();
            this.hold(grip);
            return;
        }

        if (held.pane !== grip.parentElement)
            return;

        const direction = Directions[domEvent.key];

        if (direction !== undefined) {
            domEvent.preventDefault();

            const target = placeToward(held.container, held.origin, held.target ?? held.origin, direction) ?? held.target;

            if (target !== null && target !== held.target)
                announce({ key: "ui.pane.target", args: placeNumber(held.container, target) });

            this.mark(held, target);
            return;
        }

        if (domEvent.key === " " || domEvent.key === "Enter") {
            domEvent.preventDefault();
            this.held = null;

            const placed = this.put(held);

            if (placed === null)
                announce({ key: "ui.pane.back" });
            else {
                const { index, count } = placeNumber(held.container, placed);

                announceMoved(index, count);
            }

            grip.focus({ preventScroll: true });
            return;
        }

        // Ahead of a dialog or a flyout around the pane: the held grip owns its keys (`escapeIsClaimed`), so neither closes on it.
        if (domEvent.key === "Escape") {
            domEvent.preventDefault();
            this.held = null;
            this.putBack(held);
            announce({ key: "ui.pane.back" });
        }
    }

    /** The keyboard lifts the pane: the grip pressed and owning its keys until the pane is put down, and a screen reader told how. */
    private hold(grip: HTMLElement): void {
        this.held = this.lift(grip, { x: 0, y: 0 });

        if (this.held === null)
            return;

        grip.setAttribute("aria-pressed", "true");
        grip.setAttribute(OwnsKeysAttribute, "");
        announce({ key: "ui.pane.lifted" });
    }

    /** Focus leaving a held grip lets the pane down where it stood: nothing moves without the key that says so. */
    private handleFocusOut(domEvent: Event): void {
        const held = this.held;

        if (held === null || !(domEvent.target instanceof Element) || domEvent.target.parentElement !== held.pane)
            return;

        this.held = null;
        this.putBack(held);
    }

    private handleFocusIn(domEvent: Event): void {
        const grip = domEvent.target instanceof Element ? ownGrip(domEvent.target) : null;

        if (grip !== null)
            nameGrip(grip);
    }

    /** A mouse or a pen over a pane's top band marks the pane, which shows its grip (`ui-pane-container.less`); a touch has no hover. */
    private handlePointerMove(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || domEvent.pointerType === "touch")
            return;

        const pane = domEvent.target instanceof Element ? ownPane(domEvent.target) : null;

        if (pane === null) {
            this.markNear(null);
            return;
        }

        let near = this.nearTop;

        if (near?.pane !== pane) {
            near = { pane, top: pane.getBoundingClientRect().top };
            this.nearTop = near;
        }

        this.markNear(domEvent.clientY - near.top < GripZonePixels ? pane : null);
    }

    /** A scroll moves the place under a raised pane, which goes with it, as it did standing in the page. */
    private handleScroll(): void {
        this.forgetNearTop();

        const raised = this.raised;

        if (raised === null)
            return;

        const box = raised.origin.getBoundingClientRect();

        raised.pane.style.left = `${box.left}px`;
        raised.pane.style.top = `${box.top}px`;
    }

    private forgetNearTop(): void {
        this.nearTop = null;
    }

    private markNear(pane: HTMLElement | null): void {
        if (pane === this.near)
            return;

        this.near?.removeAttribute(NearAttribute);
        pane?.setAttribute(NearAttribute, "");
        this.near = pane;
    }

    /** The pointer leaving the page leaves no pane marked. */
    private handlePointerOut(domEvent: Event): void {
        if (domEvent instanceof PointerEvent && domEvent.relatedTarget === null)
            this.markNear(null);
    }
}

const Directions: Readonly<Record<string, Point>> = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }
};

/** A grip of a pane of a pane container, not some other control's inside a pane. */
function ownGrip(target: Element): HTMLElement | null {
    const grip = target.closest<HTMLElement>(`.${GripClass}`);

    return grip?.parentElement?.parentElement?.parentElement?.classList.contains(RootClass) === true ? grip : null;
}

/** The innermost pane of a pane container the target stands in. */
function ownPane(target: Element): HTMLElement | null {
    const pane = target.closest<HTMLElement>(`.${PaneClass}`);

    return pane?.parentElement?.parentElement?.classList.contains(RootClass) === true ? pane : null;
}

/** Names a grip after its pane's title, "Move the panel" where the pane has none; written only when the words change. */
function nameGrip(grip: HTMLElement): void {
    const pane = grip.parentElement;
    const title = pane === null ? null : paneTitle(pane);
    const key = title === null ? "ui.pane.move" : "ui.pane.grip";
    const args = title === null ? null : { name: title };

    if (grip.getAttribute("aria-label") !== clientStrings.translate(key, args))
        clientStrings.write(grip, "aria-label", key, args);
}

/** The words of the pane's first title-sized text, not one of a pane container nested in it; null where it has none. */
function paneTitle(pane: HTMLElement): string | null {
    for (const title of pane.querySelectorAll(TitleSelector)) {
        const words = ownPane(title) === pane ? title.textContent?.trim() ?? "" : "";

        if (words.length > 0)
            return words;
    }

    return null;
}

/** Where a place stands among the shown ones, 1-based, and how many there are. */
function placeNumber(container: HTMLElement, place: HTMLElement): { readonly index: number; readonly count: number } {
    const places = shownPlacesOf(container);

    return { index: places.indexOf(place) + 1, count: places.length };
}

/** A record of the container itself, or of a container that arrived: not one from deep inside a pane. */
function isOwnChange(mutation: MutationRecord): boolean {
    if (mutation.type === "attributes")
        return mutation.target instanceof Element && mutation.target.classList.contains(RootClass);

    for (const node of mutation.addedNodes) {
        if (node instanceof Element && (node.classList.contains(RootClass) || node.querySelector(`.${RootClass}`) !== null))
            return true;
    }

    return false;
}

/** The containers given and every pane container inside them, each once. */
function withNested(containers: Iterable<HTMLElement>): Set<HTMLElement> {
    const all = new Set<HTMLElement>();

    for (const container of containers) {
        all.add(container);

        for (const nested of container.querySelectorAll<HTMLElement>(`.${RootClass}`))
            all.add(nested);
    }

    return all;
}

function placesOf(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(`:scope > .${PlaceClass}`));
}

/** The places a pane can be carried to: not one a splitter folded away (`data-ui-split-folded`), which has no box to aim at. */
function shownPlacesOf(container: HTMLElement): HTMLElement[] {
    return placesOf(container).filter(place => place.getClientRects().length > 0);
}

function readLayout(container: HTMLElement): string | null {
    return container.getAttribute(PaneLayoutAttribute);
}

/** The panes' names in the order of their places, as they stand. */
function currentLayout(container: HTMLElement): string {
    return placesOf(container)
        .map(place => place.querySelector(`:scope > .${PaneClass}`)?.getAttribute(PaneAttribute) ?? "")
        .join(Separator);
}

/** Moves each pane to the place the layout gives it, sliding from where it stood where `animate` says so. */
function arrange(container: HTMLElement, layout: string | null, animate: boolean): void {
    const places = placesOf(container);
    const names = resolvePaneLayout(places.map(place => place.getAttribute(PanePlaceAttribute) ?? ""), layout);
    const panes = new Map<string, HTMLElement>();
    const moves = new Map<HTMLElement, HTMLElement>();

    for (const place of places) {
        const pane = place.querySelector<HTMLElement>(`:scope > .${PaneClass}`);
        const name = pane?.getAttribute(PaneAttribute);

        if (pane !== null && pane !== undefined && name !== null && name !== undefined)
            panes.set(name, pane);
    }

    places.forEach((destination, index) => {
        const pane = panes.get(names[index]);

        if (pane !== undefined && pane.parentElement !== destination)
            moves.set(pane, destination);
    });

    if (moves.size > 0)
        place(container, moves, animate);
}

/**
 * Puts each pane in its place, then slides it from where it stood: the offset it had first, a drag's included, eased away, and its
 * size from the old place's to the new one's, so its content re-wraps as a window's does rather than stretching or jumping. A pane that
 * keeps its size lays the places and tracks again first (`carrySizes`), so the slide ends where it does.
 */
function place(container: HTMLElement, moves: ReadonlyMap<HTMLElement, HTMLElement>, animate: boolean): void {
    const first = new Map<HTMLElement, DOMRect>();

    for (const pane of moves.keys())
        first.set(pane, pane.getBoundingClientRect());

    for (const [pane, destination] of moves) {
        pane.style.transform = "";
        destination.append(pane);
    }

    carrySizes(container);

    if (!animate || prefersReducedMotion())
        return;

    // Over the panes around them while they slide, the one carried over the one it displaced: the moves list it first.
    let layer = moves.size + 1;

    for (const [pane, before] of first) {
        const frames = typeof pane.animate === "function" ? slideFrames(before, pane.getBoundingClientRect()) : null;
        const zIndex = String(layer--);

        if (frames !== null)
            pane.animate(frames.map(frame => ({ ...frame, zIndex })), { duration: motion.normal + 60, easing: motion.ease });
    }
}

/** A lifted pane's way back to its own place, from wherever the drag left it. */
function slideBack(pane: HTMLElement): void {
    const offset = pane.style.transform;

    pane.style.transform = "";

    if (offset.length === 0 || offset === "translate(0px, 0px)" || prefersReducedMotion() || typeof pane.animate !== "function")
        return;

    pane.animate([{ transform: offset }, { transform: "none" }], { duration: motion.normal, easing: motion.ease });
}

/**
 * The slide from one box to another: the offset between their corners and the size from the old to the new; null when nothing moves.
 * A sized grid item stands at its cell's start, the corner the offset is measured to.
 */
export function slideFrames(before: Pick<DOMRect, "left" | "top" | "width" | "height">, after: Pick<DOMRect, "left" | "top" | "width" | "height">): Keyframe[] | null {
    const dx = before.left - after.left;
    const dy = before.top - after.top;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(after.width - before.width) < 0.5 && Math.abs(after.height - before.height) < 0.5)
        return null;

    return [
        { transform: `translate(${dx}px, ${dy}px)`, width: `${before.width}px`, height: `${before.height}px` },
        { transform: "none", width: `${after.width}px`, height: `${after.height}px` }
    ];
}

/**
 * Which pane stands at each place, given the names of the panes added at each place: the name the layout gives that place where it
 * names a pane not placed already, and the places left open filled with the panes it left out in the order they were added — as
 * `UIPaneLayout.Resolve` does on the server.
 */
export function resolvePaneLayout(added: readonly string[], layout: string | null): string[] {
    const known = new Set(added);
    const placed = new Set<string>();
    const names: (string | null)[] = added.map(() => null);
    const given = layout === null || layout.length === 0 ? [] : layout.split(Separator).map(name => name.trim());

    for (let i = 0; i < names.length && i < given.length; i++) {
        if (known.has(given[i]) && !placed.has(given[i])) {
            names[i] = given[i];
            placed.add(given[i]);
        }
    }

    const left = added.filter(name => !placed.has(name));

    return names.map(name => name ?? left.shift() ?? "");
}

/** A place's cells on the grid, 1-based, as `UIGridPlacement` holds them. */
type PaneCells = { readonly column: number; readonly row: number; readonly columnSpan: number; readonly rowSpan: number };

/** A place as the arrangement reads it: the name of the pane added at it, its cells per tier (null where a tier sets none), and whether that pane keeps its size. */
export type PanePlaceCells = { readonly name: string; readonly cells: readonly (PaneCells | null)[]; readonly keepsSize: boolean };

/** One tier's places once panes keep their sizes, and the tracks' authored indices in their new order, null where none moved. */
export type PaneArrangement = { readonly cells: PaneCells[]; readonly columnOrder: number[] | null; readonly rowOrder: number[] | null };

/**
 * Where each place stands at a tier once its pane keeps its own size, and the order the tracks then stand in — as
 * `UIPaneLayout.Arrange` does on the server: a run of places side by side along an axis, the same cells across it, each starting where
 * the one before ends, whose panes all come from that run, one of them keeping its size, is laid again with each pane's own tracks in
 * the order the panes stand. A pane without the option takes what is left, its own tracks; anywhere else each pane takes its place's size.
 */
export function arrangePanes(places: readonly PanePlaceCells[], standing: readonly string[], tier: number, columns: number, rows: number, columnsCarry: boolean, rowsCarry: boolean): PaneArrangement {
    const cells = places.map(place => cellsAt(place.cells, tier));
    const columnOrder = columnsCarry ? carry(places, standing, cells, columns, true) : null;
    const rowOrder = rowsCarry ? carry(places, standing, cells, rows, false) : null;

    return { cells, columnOrder, rowOrder };
}

/** The cells in force at a tier: its own, or the nearest narrower one set. */
function cellsAt(tiers: readonly (PaneCells | null)[], tier: number): PaneCells {
    for (let candidate = tier; candidate > 0; candidate--) {
        const cells = tiers[candidate];

        if (cells !== null && cells !== undefined)
            return cells;
    }

    return tiers[0] ?? { column: 1, row: 1, columnSpan: 24, rowSpan: 1 };
}

/** Lays each run along one axis again; the tracks' authored indices in their new order, or null where none moved. */
function carry(places: readonly PanePlaceCells[], standing: readonly string[], cells: PaneCells[], count: number, columns: boolean): number[] | null {
    const authored = [...cells];
    const home = new Map(places.map((place, index) => [place.name, index]));
    const seen = authored.map(() => false);
    let order: number[] | null = null;

    for (let first = 0; first < authored.length; first++) {
        if (seen[first])
            continue;

        // A band: the places with the same cells across the axis, in the order they stand along it.
        const band: number[] = [];

        for (let i = first; i < authored.length; i++) {
            if (!seen[i] && sameAcross(authored[i], authored[first], columns)) {
                seen[i] = true;
                band.push(i);
            }
        }

        band.sort((a, b) => along(authored[a], columns).start - along(authored[b], columns).start);

        let start = 0;

        for (let i = 1; i <= band.length; i++) {
            if (i < band.length && along(authored[band[i]], columns).start === end(authored[band[i - 1]], columns))
                continue;

            if (i - start > 1)
                order = carryRun(band.slice(start, i), places, standing, home, authored, cells, count, columns, order);

            start = i;
        }
    }

    return order;
}

/** One run laid again with each pane's own tracks, where every pane in it comes from it and one keeps its size. */
function carryRun(run: readonly number[], places: readonly PanePlaceCells[], standing: readonly string[], home: ReadonlyMap<string, number>, authored: readonly PaneCells[], cells: PaneCells[], count: number, columns: boolean, order: number[] | null): number[] | null {
    const homes: number[] = [];
    let keeps = false;
    let moved = false;

    for (const index of run) {
        const from = home.get(standing[index]);

        if (from === undefined || !run.includes(from))
            return order;

        homes.push(from);
        keeps ||= places[from].keepsSize;
        moved ||= from !== index;
    }

    const runStart = along(authored[run[0]], columns).start;
    const runEnd = end(authored[run[run.length - 1]], columns);

    if (!keeps || !moved || runEnd - 1 > count || cutsIntoRun(run, authored, columns, runStart, runEnd))
        return order;

    const next = order ?? Array.from({ length: count }, (_, index) => index);
    let offset = runStart;

    run.forEach((index, at) => {
        const { start, span } = along(authored[homes[at]], columns);

        for (let j = 0; j < span; j++)
            next[offset - 1 + j] = start - 1 + j;

        cells[index] = columns ? { ...authored[index], column: offset, columnSpan: span } : { ...authored[index], row: offset, rowSpan: span };
        offset += span;
    });

    return next;
}

/** Whether a place outside the run stands in part of its tracks: a new order would resize it. */
function cutsIntoRun(run: readonly number[], authored: readonly PaneCells[], columns: boolean, runStart: number, runEnd: number): boolean {
    return authored.some((cells, index) => {
        const start = along(cells, columns).start;
        const stop = end(cells, columns);

        return !run.includes(index) && start < runEnd && stop > runStart && (start > runStart || stop < runEnd);
    });
}

function along(cells: PaneCells, columns: boolean): { readonly start: number; readonly span: number } {
    return columns ? { start: cells.column, span: cells.columnSpan } : { start: cells.row, span: cells.rowSpan };
}

function sameAcross(a: PaneCells, b: PaneCells, columns: boolean): boolean {
    return columns ? a.row === b.row && a.rowSpan === b.rowSpan : a.column === b.column && a.columnSpan === b.columnSpan;
}

/** The first track past the cells along the axis. */
function end(cells: PaneCells, columns: boolean): number {
    const { start, span } = along(cells, columns);

    return start + span;
}

/**
 * Lays the places and the tracks again for the panes as they now stand, where a pane keeps its size: every tier's cells on each place
 * and, where any tier orders the tracks anew, every tier's tracks on the container (one left unwritten would read a narrower tier's).
 * A container with no such pane carries nothing (`PaneContainerComponentRenderer` writes the tracks only for one that has).
 */
function carrySizes(container: HTMLElement): void {
    const columns = readJsonList<string>(container.getAttribute(PaneColumnsAttribute));
    const rows = readJsonList<string>(container.getAttribute(PaneRowsAttribute));

    if (columns === null && rows === null)
        return;

    const places = placesOf(container);
    const keeps = new Set(places.flatMap(place => {
        const pane = place.querySelector<HTMLElement>(`:scope > .${PaneClass}`);

        return pane?.hasAttribute(PaneKeepsSizeAttribute) === true ? [pane.getAttribute(PaneAttribute) ?? ""] : [];
    }));
    const data: PanePlaceCells[] = places.map(place => {
        const name = place.getAttribute(PanePlaceAttribute) ?? "";

        return { name, cells: readJsonList<PaneCells | null>(place.getAttribute(PaneCellsAttribute), toCells) ?? [], keepsSize: keeps.has(name) };
    });
    const standing = places.map(place => place.querySelector(`:scope > .${PaneClass}`)?.getAttribute(PaneAttribute) ?? "");
    const columnOrders: (number[] | null)[] = [];
    const rowOrders: (number[] | null)[] = [];

    responsiveTiers.forEach((name, tier) => {
        const arrangement = arrangePanes(data, standing, tier, columns?.length ?? 0, rows?.length ?? 0, columns !== null, rows !== null);

        places.forEach((place, index) => {
            const cells = arrangement.cells[index];

            place.style.setProperty(responsiveVariable("--ui-placement-column", name), String(cells.column));
            place.style.setProperty(responsiveVariable("--ui-placement-row", name), String(cells.row));
            place.style.setProperty(responsiveVariable("--ui-placement-column-span", name), String(cells.columnSpan));
            place.style.setProperty(responsiveVariable("--ui-placement-row-span", name), String(cells.rowSpan));
        });

        columnOrders.push(arrangement.columnOrder);
        rowOrders.push(arrangement.rowOrder);
    });

    writeTrackOrder(container, "--ui-pane-columns", columns, columnOrders);
    writeTrackOrder(container, "--ui-pane-rows", rows, rowOrders);
}

function writeTrackOrder(container: HTMLElement, variable: string, tracks: readonly string[] | null, orders: readonly (number[] | null)[]): void {
    const moved = tracks !== null && orders.some(order => order !== null);

    responsiveTiers.forEach((name, tier) => {
        if (moved)
            container.style.setProperty(responsiveVariable(variable, name), (orders[tier] ?? tracks.map((_, index) => index)).map(index => tracks[index]).join(" "));
        else
            container.style.removeProperty(responsiveVariable(variable, name));
    });
}

/** A JSON list off an attribute, each entry passed through `map`; null when there is none or it does not read as a list. */
function readJsonList<T>(text: string | null, map: (entry: unknown) => T = entry => entry as T): T[] | null {
    if (text === null)
        return null;

    try {
        const value: unknown = JSON.parse(text);

        return Array.isArray(value) ? value.map(map) : null;
    }
    catch {
        return null;
    }
}

/** A tier's cells as the renderer writes them, `[column, row, columnSpan, rowSpan]`, or null where the tier sets none. */
function toCells(entry: unknown): PaneCells | null {
    return Array.isArray(entry) && entry.length === 4 ? { column: Number(entry[0]), row: Number(entry[1]), columnSpan: Number(entry[2]), rowSpan: Number(entry[3]) } : null;
}

/** The place under the point, other than the pane's own: the one a drop there trades with. */
function placeAt(container: HTMLElement, origin: HTMLElement, point: Point): HTMLElement | null {
    for (const candidate of shownPlacesOf(container)) {
        if (candidate === origin)
            continue;

        const box = candidate.getBoundingClientRect();

        if (point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom)
            return candidate;
    }

    return null;
}

/** The nearest place from `from` in a direction, its centre on that side, other than the pane's own; null when none is. */
function placeToward(container: HTMLElement, origin: HTMLElement, from: HTMLElement, direction: Point): HTMLElement | null {
    const boxes = shownPlacesOf(container).map(candidate => ({ place: candidate, box: candidate.getBoundingClientRect() }));
    const start = boxes.find(entry => entry.place === from)?.box;

    if (start === undefined)
        return null;

    const index = nearestToward(
        center(start),
        boxes.map(entry => entry.place === origin || entry.place === from ? null : center(entry.box)),
        direction
    );

    return index === null ? null : boxes[index].place;
}

function center(box: DOMRect): Point {
    return { x: box.left + (box.width / 2), y: box.top + (box.height / 2) };
}

/**
 * The index of the centre nearest `from` that lies the given way from it, a step along the way counting less than one across it, so
 * a place straight ahead wins over a nearer one to the side; null where none lies that way. A null centre is not a candidate.
 */
export function nearestToward(from: Point, centers: readonly (Point | null)[], direction: Point): number | null {
    let best: number | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    centers.forEach((candidate, index) => {
        if (candidate === null)
            return;

        const along = ((candidate.x - from.x) * direction.x) + ((candidate.y - from.y) * direction.y);
        const across = Math.abs(((candidate.x - from.x) * direction.y) - ((candidate.y - from.y) * direction.x));

        if (along <= 0.5)
            return;

        const score = along + (across * 2);

        if (score < bestScore) {
            bestScore = score;
            best = index;
        }
    });

    return best;
}
