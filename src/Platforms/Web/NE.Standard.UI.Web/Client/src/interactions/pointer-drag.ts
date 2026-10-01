// A pointer dragging a handle (a grid splitter's bar, a table's column edge, a picture under the crop's frame): press takes the
// pointer, moves are measured from where it began, release lets go; where the engine asks, a second finger makes it a pinch. One
// gesture for every handle; what it does with the distance is the engine's.

import { SplittingAttribute } from "../addressing/dom-attributes.ts";
import { isInert } from "./interactive-state.ts";

type Point = { readonly x: number; readonly y: number };

/** A pinch's step since the last move: how much farther apart the two pointers are, their midpoint now, and how far it moved. */
export type PinchStep = {
    readonly factor: number;
    readonly center: Point;
    readonly shift: Point;
};

export type PointerDragOptions<TContext> = {
    readonly root: ParentNode;
    /** The handle the press landed on, or null when the press is not a handle's. */
    readonly resolveHandle: (target: Element) => HTMLElement | null;
    /** What the gesture works on, read at the press, or null to refuse it; `point` is where it landed, for a gesture measured by position. */
    readonly begin: (handle: HTMLElement, point: { readonly x: number; readonly y: number }) => TContext | null;
    /** The pointer coordinate the gesture measures along; omitted when a gesture reads the pointer's own position instead of a delta. */
    readonly coordinate?: (context: TContext) => "clientX" | "clientY";
    /** The distance from the press along `coordinate` (zero without one), so moves don't drift, and the pointer's own position. */
    readonly move: (context: TContext, delta: number, point: { readonly x: number; readonly y: number }) => void;
    readonly end: (handle: HTMLElement, context: TContext) => void;
    /**
     * A second pointer pressed on the handle mid-drag, step by step; left out, a second pointer is passed over. Once either lifts,
     * the one left drags on, `move` measured afresh from where it stands.
     */
    readonly pinch?: (context: TContext, step: PinchStep) => void;
};

type Drag<TContext> = {
    readonly handle: HTMLElement;
    readonly context: TContext;
    origin: number;
    originPoint: Point;
    pointerId: number;
    /** Where the dragging pointer stands now, which a pinch measures from. */
    point: Point;
    second: { readonly pointerId: number; point: Point } | null;
};

export class PointerDrag<TContext> {
    private readonly options: PointerDragOptions<TContext>;
    private drag: Drag<TContext> | null = null;

    public constructor(options: PointerDragOptions<TContext>) {
        this.options = options;

        options.root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent), true);
        options.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), true);
        options.root.addEventListener("pointerup", domEvent => this.handlePointerEnd(domEvent), true);
        options.root.addEventListener("pointercancel", domEvent => this.handlePointerEnd(domEvent), true);
        // On the window, first to hear a key: Escape mid-drag cancels the drag rather than closing the popup the handle is in.
        window.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
    }

    /** Whether a gesture is in progress — a key on the handle waits for it to end. */
    public get active(): boolean {
        return this.drag !== null;
    }

    private handlePointerDown(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || domEvent.button !== 0 || !(domEvent.target instanceof Element))
            return;

        // One gesture at a time: a second finger taking over would leave the first handle marked and its end never run.
        if (this.drag !== null) {
            this.takeSecondPointer(this.drag, domEvent.target, domEvent);
            return;
        }

        const handle = this.options.resolveHandle(domEvent.target);

        // A disabled handle is hit-testable (its tooltip shows) but moves nothing.
        if (handle === null || isInert(handle))
            return;

        const context = this.options.begin(handle, { x: domEvent.clientX, y: domEvent.clientY });

        if (context === null)
            return;

        // The press is the gesture's: no text selection starts under a drag, and the pointer stays with the handle when it leaves it.
        domEvent.preventDefault();

        try {
            handle.setPointerCapture(domEvent.pointerId);
        }
        catch {
            // A pointer the browser does not hold (a synthesized event): the moves still arrive through the root's own listener.
        }

        handle.setAttribute(SplittingAttribute, "");

        // Focused so the arrows can carry on from where the drag ends; popup-focus.ts marks it as the pointer's, so no ring shows.
        if (handle.tabIndex >= 0)
            handle.focus({ preventScroll: true });

        const point = { x: domEvent.clientX, y: domEvent.clientY };

        this.drag = {
            handle,
            context,
            origin: this.options.coordinate === undefined ? 0 : domEvent[this.options.coordinate(context)],
            originPoint: point,
            pointerId: domEvent.pointerId,
            point,
            second: null
        };
    }

    /** A second finger on the handle turns the drag into a pinch, where the engine takes one. */
    private takeSecondPointer(drag: Drag<TContext>, target: Element, domEvent: PointerEvent): void {
        if (this.options.pinch === undefined || drag.second !== null || domEvent.pointerId === drag.pointerId || !drag.handle.contains(target))
            return;

        domEvent.preventDefault();

        try {
            drag.handle.setPointerCapture(domEvent.pointerId);
        }
        catch {
            // As the first pointer's: the moves still arrive through the root's own listener.
        }

        drag.second = { pointerId: domEvent.pointerId, point: { x: domEvent.clientX, y: domEvent.clientY } };
    }

    private handlePointerMove(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || this.drag === null)
            return;

        const drag = this.drag;
        const point = { x: domEvent.clientX, y: domEvent.clientY };

        if (drag.second !== null && (domEvent.pointerId === drag.pointerId || domEvent.pointerId === drag.second.pointerId)) {
            const first = drag.point;
            const second = drag.second.point;

            if (domEvent.pointerId === drag.pointerId)
                drag.point = point;
            else
                drag.second.point = point;

            this.options.pinch?.(drag.context, pinchStep(first, second, drag.point, drag.second.point));
            return;
        }

        if (domEvent.pointerId !== drag.pointerId)
            return;

        const { context, origin } = drag;
        const delta = this.options.coordinate === undefined ? 0 : domEvent[this.options.coordinate(context)] - origin;

        drag.point = point;
        this.options.move(context, delta, point);
    }

    private handlePointerEnd(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || this.drag === null)
            return;

        const drag = this.drag;

        // One finger of a pinch lifting: the other drags on, measured from where it stands.
        if (drag.second !== null && (domEvent.pointerId === drag.pointerId || domEvent.pointerId === drag.second.pointerId)) {
            if (domEvent.pointerId === drag.pointerId) {
                drag.pointerId = drag.second.pointerId;
                drag.point = drag.second.point;
            }

            drag.second = null;
            drag.originPoint = drag.point;
            drag.origin = this.options.coordinate?.(drag.context) === "clientY" ? drag.point.y : drag.point.x;
            return;
        }

        if (domEvent.pointerId !== drag.pointerId)
            return;

        const { handle, context } = drag;

        this.drag = null;
        handle.removeAttribute(SplittingAttribute);

        this.options.end(handle, context);
    }

    /** Escape cancels the gesture in progress: back to the delta the drag began at, then released like any other end. */
    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Escape" || domEvent.defaultPrevented || this.drag === null)
            return;

        domEvent.preventDefault();

        const { handle, context, pointerId, originPoint, second } = this.drag;

        this.drag = null;
        this.options.move(context, 0, originPoint);
        handle.removeAttribute(SplittingAttribute);

        for (const held of second === null ? [pointerId] : [pointerId, second.pointerId]) {
            try {
                handle.releasePointerCapture(held);
            }
            catch {
                // Never captured (a synthesized press) or already released — either way there is nothing left to let go of.
            }
        }

        this.options.end(handle, context);
    }
}

function pinchStep(firstBefore: Point, secondBefore: Point, first: Point, second: Point): PinchStep {
    const before = Math.hypot(secondBefore.x - firstBefore.x, secondBefore.y - firstBefore.y);
    const after = Math.hypot(second.x - first.x, second.y - first.y);
    const center = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };

    return {
        factor: before > 0 && after > 0 ? after / before : 1,
        center,
        shift: { x: center.x - ((firstBefore.x + secondBefore.x) / 2), y: center.y - ((firstBefore.y + secondBefore.y) / 2) }
    };
}
