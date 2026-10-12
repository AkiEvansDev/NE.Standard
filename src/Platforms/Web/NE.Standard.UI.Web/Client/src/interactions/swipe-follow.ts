// A drag of a part along one axis that the part follows and then settles: a sheet swiped down (sheet-swipe.ts), the lightbox's strip
// swiped across (lightbox.ts). One follower decides when a press becomes a drag of this kind rather than a tap or a scroll the other
// way, samples the speed it is let go at, and keeps the click its release raises from pressing what it ends over; what the part does
// with the offset is its own.

import { swallowReleaseClick } from "./pointer-drag.ts";

// How far a press travels before it is a drag rather than a tap; the browser's own slop for a scroll is about the same.
export const SwipeSlop = 6;

/** The speed, in pixels a millisecond, at which a drag let go is a flick, carried on however short it was. */
export const FlickSpeed = 0.5;

export type SwipeFollower = {
    /** `y` down the page, `x` across it. */
    readonly axis: "x" | "y";

    /** Only toward the axis's end (a sheet goes down, never up): a press moving the other way is no drag of this kind. */
    readonly oneWay?: boolean;

    /**
     * Not passive: a finger held on the part keeps its moves from the page — no overscroll, no pull to refresh — while it drags, or
     * as it starts the drag's way.
     */
    readonly holdsTouch?: boolean;

    /** Whether a press may start a drag here; the place to settle whatever the part still has under way. */
    readonly begins: (domEvent: PointerEvent) => boolean;

    /** The press became a drag: the part follows at once from here on. */
    readonly start: (domEvent: PointerEvent) => void;

    /** Where the drag stands, along the axis from where it was pressed (never below 0 one way). */
    readonly follow: (offset: number) => void;

    /** The drag let go — `letGo` false where the browser cancelled it — at `offset`, moving at `speed` px/ms along the axis. */
    readonly end: (offset: number, speed: number, letGo: boolean) => void;
};

type Sample = { readonly at: number; readonly time: number };

type Drag = {
    readonly pointerId: number;
    readonly startAlong: number;
    readonly startAcross: number;
    moving: boolean;
    previous: Sample;
    last: Sample;
};

/** Lets `element` be dragged as `follower` says; answers the detach. */
export function followSwipe(element: HTMLElement, follower: SwipeFollower): () => void {
    const along = (point: { readonly clientX: number; readonly clientY: number }): number => follower.axis === "y" ? point.clientY : point.clientX;
    const across = (point: { readonly clientX: number; readonly clientY: number }): number => follower.axis === "y" ? point.clientX : point.clientY;
    const offsetOf = (point: { readonly clientX: number; readonly clientY: number }, drag: Drag): number => {
        const offset = along(point) - drag.startAlong;

        return follower.oneWay === true ? Math.max(0, offset) : offset;
    };

    let drag: Drag | null = null;

    const press = (domEvent: PointerEvent): void => {
        drag = null;

        if (!domEvent.isPrimary || domEvent.button !== 0 || !follower.begins(domEvent))
            return;

        const sample = { at: along(domEvent), time: domEvent.timeStamp };

        drag = { pointerId: domEvent.pointerId, startAlong: along(domEvent), startAcross: across(domEvent), moving: false, previous: sample, last: sample };
    };

    const move = (domEvent: PointerEvent): void => {
        if (drag === null || domEvent.pointerId !== drag.pointerId)
            return;

        if (!drag.moving) {
            const forward = along(domEvent) - drag.startAlong;
            const aside = Math.abs(across(domEvent) - drag.startAcross);

            // The other way across, or back where only one way drags: a scroll of the page or of a strip in it, not this part's.
            if ((aside > SwipeSlop && aside > Math.abs(forward)) || (follower.oneWay === true && forward < -SwipeSlop)) {
                drag = null;
                return;
            }

            if ((follower.oneWay === true ? forward : Math.abs(forward)) <= SwipeSlop)
                return;

            drag.moving = true;
            follower.start(domEvent);
        }

        drag.previous = drag.last;
        drag.last = { at: along(domEvent), time: domEvent.timeStamp };
        follower.follow(offsetOf(domEvent, drag));
    };

    const release = (domEvent: PointerEvent): void => {
        if (drag === null || domEvent.pointerId !== drag.pointerId)
            return;

        const ended = drag;

        drag = null;

        if (!ended.moving)
            return;

        // A drag let go over an entry or the backdrop is no press of it.
        swallowReleaseClick();

        const elapsed = ended.last.time - ended.previous.time;
        const speed = elapsed > 0 ? (ended.last.at - ended.previous.at) / elapsed : 0;

        follower.end(offsetOf(domEvent, ended), speed, domEvent.type === "pointerup");
    };

    const holdTouch = (domEvent: TouchEvent): void => {
        const touch = domEvent.touches[0];

        if (drag === null || !domEvent.cancelable || touch === undefined)
            return;

        const forward = along(touch) - drag.startAlong;

        if (drag.moving || (follower.oneWay === true ? forward > 0 : forward !== 0))
            domEvent.preventDefault();
    };

    element.addEventListener("pointerdown", press);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", release);
    element.addEventListener("pointercancel", release);

    if (follower.holdsTouch === true)
        element.addEventListener("touchmove", holdTouch, { passive: false });

    return () => {
        drag = null;
        element.removeEventListener("pointerdown", press);
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerup", release);
        element.removeEventListener("pointercancel", release);
        element.removeEventListener("touchmove", holdTouch);
    };
}
