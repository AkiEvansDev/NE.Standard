// A pointer dragging a handle — a grid splitter's bar, a table's column edge: the press takes the pointer, the moves are measured
// from where it began, and the release lets go. One gesture for every handle; what the handle does with the distance is the engine's.

import { SplittingAttribute } from "../addressing/dom-attributes";

export type PointerDragOptions<TContext> = {
    readonly root: ParentNode;
    /** The handle the press landed on, or null when the press is not a handle's. */
    readonly resolveHandle: (target: Element) => HTMLElement | null;
    /** What the gesture works on, read afresh at the press; null refuses the press. */
    readonly begin: (handle: HTMLElement) => TContext | null;
    /** The pointer coordinate the gesture measures along. */
    readonly coordinate: (context: TContext) => "clientX" | "clientY";
    /** The distance from where the press began, on every move; every position is one answer, so a hundred moves drift by nothing. */
    readonly move: (context: TContext, delta: number) => void;
    readonly end: (handle: HTMLElement, context: TContext) => void;
};

type Drag<TContext> = {
    readonly handle: HTMLElement;
    readonly context: TContext;
    readonly origin: number;
    readonly pointerId: number;
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
        options.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
    }

    /** Whether a gesture is in progress — a key on the handle waits for it to end. */
    public get active(): boolean {
        return this.drag !== null;
    }

    private handlePointerDown(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || domEvent.button !== 0 || !(domEvent.target instanceof Element))
            return;

        const handle = this.options.resolveHandle(domEvent.target);

        if (handle === null)
            return;

        const context = this.options.begin(handle);

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
        handle.focus({ preventScroll: true });

        this.drag = { handle, context, origin: domEvent[this.options.coordinate(context)], pointerId: domEvent.pointerId };
    }

    private handlePointerMove(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || this.drag === null || domEvent.pointerId !== this.drag.pointerId)
            return;

        const { context, origin } = this.drag;

        this.options.move(context, domEvent[this.options.coordinate(context)] - origin);
    }

    private handlePointerEnd(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || this.drag === null || domEvent.pointerId !== this.drag.pointerId)
            return;

        const { handle, context } = this.drag;

        this.drag = null;
        handle.removeAttribute(SplittingAttribute);

        this.options.end(handle, context);
    }

    /** Escape cancels the gesture in progress: back to the delta the drag began at, then released like any other end. */
    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Escape" || domEvent.defaultPrevented || this.drag === null)
            return;

        domEvent.preventDefault();

        const { handle, context, pointerId } = this.drag;

        this.drag = null;
        this.options.move(context, 0);
        handle.removeAttribute(SplittingAttribute);

        try {
            handle.releasePointerCapture(pointerId);
        }
        catch {
            // Never captured (a synthesized press) or already released — either way there is nothing left to let go of.
        }

        this.options.end(handle, context);
    }
}
