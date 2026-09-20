// A pointer dragging a handle (a grid splitter's bar, a table's column edge): press takes the pointer, moves are measured from
// where it began, release lets go. One gesture for every handle; what it does with the distance is the engine's.

import { PointerFocusAttribute, SplittingAttribute } from "../addressing/dom-attributes";

export type PointerDragOptions<TContext> = {
    readonly root: ParentNode;
    /** The handle the press landed on, or null when the press is not a handle's. */
    readonly resolveHandle: (target: Element) => HTMLElement | null;
    /** What the gesture works on, read afresh at the press; null refuses the press. `point` is where the press landed, for a gesture measured by position rather than distance. */
    readonly begin: (handle: HTMLElement, point: { readonly x: number; readonly y: number }) => TContext | null;
    /** The pointer coordinate the gesture measures along; omitted when a gesture reads the pointer's own position instead of a delta. */
    readonly coordinate?: (context: TContext) => "clientX" | "clientY";
    /**
     * The distance from where the press began along `coordinate`, zero when `coordinate` is omitted; each position is one answer,
     * so moves don't drift. `point` is the pointer's own position, for a gesture measured against a rectangle, not an origin.
     */
    readonly move: (context: TContext, delta: number, point: { readonly x: number; readonly y: number }) => void;
    readonly end: (handle: HTMLElement, context: TContext) => void;
};

type Drag<TContext> = {
    readonly handle: HTMLElement;
    readonly context: TContext;
    readonly origin: number;
    readonly originPoint: { readonly x: number; readonly y: number };
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
        options.root.addEventListener("focusout", domEvent => unmarkPointerFocus(domEvent.target), true);
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

        // Focused so the arrows can carry on from where the drag ends, and marked as the pointer's doing, since a script-given focus
        // reads as the keyboard's to the browser and would stay lit after release; removed on a key or blur, so a handle with no
        // focus (a colour square) is never marked, or nothing would remove it.
        if (handle.tabIndex >= 0) {
            handle.setAttribute(PointerFocusAttribute, "");
            handle.focus({ preventScroll: true });
        }

        this.drag = {
            handle,
            context,
            origin: this.options.coordinate === undefined ? 0 : domEvent[this.options.coordinate(context)],
            originPoint: { x: domEvent.clientX, y: domEvent.clientY },
            pointerId: domEvent.pointerId
        };
    }

    private handlePointerMove(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || this.drag === null || domEvent.pointerId !== this.drag.pointerId)
            return;

        const { context, origin } = this.drag;
        const delta = this.options.coordinate === undefined ? 0 : domEvent[this.options.coordinate(context)] - origin;

        this.options.move(context, delta, { x: domEvent.clientX, y: domEvent.clientY });
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
        // A key on the handle is the keyboard's turn: the handle shows its focus from here on.
        unmarkPointerFocus(domEvent.target);

        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Escape" || domEvent.defaultPrevented || this.drag === null)
            return;

        domEvent.preventDefault();

        const { handle, context, pointerId, originPoint } = this.drag;

        this.drag = null;
        this.options.move(context, 0, originPoint);
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

function unmarkPointerFocus(target: EventTarget | null): void {
    if (target instanceof Element && target.hasAttribute(PointerFocusAttribute))
        target.removeAttribute(PointerFocusAttribute);
}
