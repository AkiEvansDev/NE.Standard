// A pane container's panes moved by the viewer (PaneContainerComponentRenderer): a pane carried by its grip to another place trades
// places with the pane standing there, each sliding from where it stood. The layout that results goes to the controller where it is
// bound, else to the browser under the container's authored id; a layout the controller pushes moves the panes the same way. A grip
// is named after its pane's title; the keyboard's lift is a pressed grip that owns its keys, each step of it said to a screen reader.

import { BindLayoutAttribute, OwnsKeysAttribute, PaneContainerClass, PaneContainerGripClass, PaneContainerPaneClass, PaneLayoutAttribute, PaneLiftedAttribute, PaneMovingAttribute, PaneNearAttribute, PaneRaisedAttribute, PaneTargetAttribute, TextTypeDisplayClass, TextTypeSubtitleClass, TextTypeTitleClass } from "../addressing/dom-attributes.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import { ClientStore } from "../state/client-store.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { announce, announceMoved } from "./live-announcer.ts";
import type { Point } from "./pane-layout.ts";
import { arrange, arrangePanes, currentLayout, nearestToward, place, placeAt, placesOf, placeToward, readLayout, resolvePaneLayout, shownPlacesOf, slideBack, slideFrames } from "./pane-layout.ts";
import { PointerDrag } from "./pointer-drag.ts";

export { arrangePanes, nearestToward, resolvePaneLayout, slideFrames };

// Where a pane's name is read from: the first title-sized text of its own, which a pane's header (`UIHeaderSize.Pane`) leads with.
const TitleSelector = `.${TextTypeDisplayClass}, .${TextTypeTitleClass}, .${TextTypeSubtitleClass}`;
const LayoutSlot = "panes";

// The band at a pane's top whose pointer shows the grip: 2rem at the default size. Anywhere on the pane, it drew the eye from the work.
const GripZonePixels = 32;

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

        this.arrangeEach(this.root.querySelectorAll<HTMLElement>(`.${PaneContainerClass}`), false);

        // A container that arrives, and a layout the controller pushes; not every change inside a pane, which a streamed reply makes often.
        // A record inside an outer container names the outer one, so the containers nested in it are looked at too.
        observeComponents(this.root, `.${PaneContainerClass}`, { childList: true, attributeFilter: [PaneLayoutAttribute], relevant: isOwnChange }, containers => this.arrangeEach(withNested(containers), true));
    }

    private arrangeEach(containers: Iterable<HTMLElement>, animate: boolean): void {
        for (const container of containers) {
            // A container met for the first time stands as it is put, with no slide from the authored places.
            const first = !this.restored.has(container);

            if (first) {
                this.restored.add(container);
                this.restore(container);

                for (const place of placesOf(container)) {
                    const grip = place.querySelector<HTMLElement>(`:scope > .${PaneContainerPaneClass} > .${PaneContainerGripClass}`);

                    if (grip !== null)
                        nameGrip(grip);
                }
            }

            // A layout pushed while a pane is lifted waits for the put back; a drop keeps the viewer's own.
            if (!container.hasAttribute(PaneMovingAttribute))
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

        pane.setAttribute(PaneLiftedAttribute, "");
        container.setAttribute(PaneMovingAttribute, "");

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
        pane.setAttribute(PaneRaisedAttribute, "");
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

        lift.target?.removeAttribute(PaneTargetAttribute);
        target?.setAttribute(PaneTargetAttribute, "");
        lift.target = target;
    }

    /** Over another place, the two panes trade places; anywhere else the pane slides back to its own. Answers where it now stands, null for back. */
    private put(lift: Lift): HTMLElement | null {
        const target = lift.target;
        const origin = lift.pane.parentElement;
        const other = target?.querySelector<HTMLElement>(`:scope > .${PaneContainerPaneClass}`) ?? null;

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
        lift.target?.removeAttribute(PaneTargetAttribute);
        lift.pane.removeAttribute(PaneLiftedAttribute);
        lift.container.removeAttribute(PaneMovingAttribute);
        lift.grip.setAttribute("aria-pressed", "false");
        lift.grip.removeAttribute(OwnsKeysAttribute);
    }

    /** Back in its place in the page, its offset kept for the slide that follows to start from where it was let go. */
    private lower(lift: Lift): void {
        const { pane, origin } = lift;

        if (this.raised === lift)
            this.raised = null;

        if (!pane.hasAttribute(PaneRaisedAttribute))
            return;

        if (pane.matches(":popover-open"))
            pane.hidePopover();

        pane.removeAttribute("popover");
        pane.removeAttribute(PaneRaisedAttribute);

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

        this.near?.removeAttribute(PaneNearAttribute);
        pane?.setAttribute(PaneNearAttribute, "");
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
    const grip = target.closest<HTMLElement>(`.${PaneContainerGripClass}`);

    return grip?.parentElement?.parentElement?.parentElement?.classList.contains(PaneContainerClass) === true ? grip : null;
}

/** The innermost pane of a pane container the target stands in. */
function ownPane(target: Element): HTMLElement | null {
    const pane = target.closest<HTMLElement>(`.${PaneContainerPaneClass}`);

    return pane?.parentElement?.parentElement?.classList.contains(PaneContainerClass) === true ? pane : null;
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
        return mutation.target instanceof Element && mutation.target.classList.contains(PaneContainerClass);

    for (const node of mutation.addedNodes) {
        if (node instanceof Element && (node.classList.contains(PaneContainerClass) || node.querySelector(`.${PaneContainerClass}`) !== null))
            return true;
    }

    return false;
}

/** The containers given and every pane container inside them, each once. */
function withNested(containers: Iterable<HTMLElement>): Set<HTMLElement> {
    const all = new Set<HTMLElement>();

    for (const container of containers) {
        all.add(container);

        for (const nested of container.querySelectorAll<HTMLElement>(`.${PaneContainerClass}`))
            all.add(nested);
    }

    return all;
}
