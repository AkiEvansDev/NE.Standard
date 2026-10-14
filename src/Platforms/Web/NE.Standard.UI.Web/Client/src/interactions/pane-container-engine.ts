// A pane container's panes moved by the viewer (PaneContainerComponentRenderer): a pane carried by its grip to another place trades
// places with the pane standing there, each sliding from where it stood. The layout that results goes to the controller where it is
// bound, else to the browser under the container's authored id; a layout the controller pushes moves the panes the same way. A grip
// is named after its pane's title; the keyboard's lift is a pressed grip that owns its keys, each step of it said to a screen reader.

import { BindLayoutAttribute, OwnsKeysAttribute, PaneAttribute, PaneLayoutAttribute, PanePlaceAttribute } from "../addressing/dom-attributes.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
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
        this.root.addEventListener("scroll", () => this.forgetNearTop(), { capture: true, passive: true });
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

        return { container, grip, pane, origin, start: point, target: null };
    }

    /** A hold whose pane was re-rendered away: removing the focused grip raises no `focusout` to let it down. */
    private dropStaleHold(): void {
        const held = this.held;

        if (held === null || held.pane.isConnected)
            return;

        this.held = null;
        this.settle(held);
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

        place(moves, true);
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
        lift.target?.removeAttribute(TargetAttribute);
        lift.pane.removeAttribute(LiftedAttribute);
        lift.container.removeAttribute(MovingAttribute);
        lift.grip.setAttribute("aria-pressed", "false");
        lift.grip.removeAttribute(OwnsKeysAttribute);
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
        place(moves, animate);
}

/**
 * Puts each pane in its place, then slides it from where it stood: the offset it had first, a drag's included, eased away, and its
 * size from the old place's to the new one's, so its content re-wraps as a window's does rather than stretching or jumping.
 */
function place(moves: ReadonlyMap<HTMLElement, HTMLElement>, animate: boolean): void {
    const first = new Map<HTMLElement, DOMRect>();

    for (const pane of moves.keys())
        first.set(pane, pane.getBoundingClientRect());

    for (const [pane, destination] of moves) {
        pane.style.transform = "";
        destination.append(pane);
    }

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
