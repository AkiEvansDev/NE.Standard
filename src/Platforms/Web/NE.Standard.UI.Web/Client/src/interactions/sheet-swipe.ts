// A sheet's swipe down, for a list shown as a phone's sheet and a dialog's bottom sheet alike: from its handle, or — a finger — from
// anywhere at the top of its scroll, the sheet follows the drag, closes past a third of its height or on a flick, and short of that
// springs back. The stylesheet moves it by `--ui-sheet-drag` and drops its transition while `data-ui-sheet-dragging` is on.

import { swallowReleaseClick } from "./pointer-drag.ts";

/** On a sheet while a finger or the pointer drags it: its transform follows at once, with no transition. */
const SheetDraggingAttribute = "data-ui-sheet-dragging";

const DragProperty = "--ui-sheet-drag";

// How far a press travels before it is a drag rather than a tap; the browser's own slop for a scroll is about the same.
const Slop = 6;

// The band at a sheet's top its handle stands in, where the pointer's press drags too; a finger's drags from anywhere.
const HandleBand = 24;

/** How much of its height a sheet must be dragged down to close when let go slowly. */
const CloseShare = 1 / 3;

/** The speed, in pixels a millisecond, at which a sheet let go anywhere closes: a flick. */
const FlickSpeed = 0.5;

/** Whether a drag let go `offset` pixels down a sheet `height` pixels tall, moving down at `speed` px/ms, closes it. */
export function swipeCloses(offset: number, height: number, speed: number): boolean {
    return offset > height * CloseShare || (speed > FlickSpeed && offset > Slop);
}

type Sample = { readonly y: number; readonly time: number };

type Drag = {
    readonly pointerId: number;
    readonly startX: number;
    readonly startY: number;
    moving: boolean;
    previous: Sample;
    last: Sample;
};

/**
 * Lets `sheet` be swiped down, `close` running when a swipe lets it go far or fast enough; `scroller` is the box whose scroll must be
 * at its top for a drag to start, the sheet itself where it scrolls. Answers the detach.
 */
export function followSwipeDown(sheet: HTMLElement, scroller: HTMLElement, close: () => void): () => void {
    let drag: Drag | null = null;

    sheet.style.removeProperty(DragProperty);
    sheet.removeAttribute(SheetDraggingAttribute);

    const press = (domEvent: PointerEvent): void => {
        drag = null;

        if (!domEvent.isPrimary || domEvent.button !== 0 || scroller.scrollTop > 0)
            return;

        if (domEvent.pointerType !== "touch" && domEvent.clientY - sheet.getBoundingClientRect().top > HandleBand)
            return;

        const sample = { y: domEvent.clientY, time: domEvent.timeStamp };

        drag = { pointerId: domEvent.pointerId, startX: domEvent.clientX, startY: domEvent.clientY, moving: false, previous: sample, last: sample };
    };

    const move = (domEvent: PointerEvent): void => {
        if (drag === null || domEvent.pointerId !== drag.pointerId)
            return;

        const down = domEvent.clientY - drag.startY;
        const across = Math.abs(domEvent.clientX - drag.startX);

        if (!drag.moving) {
            // Across, or up: a scroll of the list or of a strip in it, not the sheet's.
            if ((across > Slop && across > Math.abs(down)) || down < -Slop) {
                drag = null;
                return;
            }

            if (down <= Slop)
                return;

            drag.moving = true;
            sheet.setAttribute(SheetDraggingAttribute, "");
            capture(sheet, domEvent.pointerId);
        }

        drag.previous = drag.last;
        drag.last = { y: domEvent.clientY, time: domEvent.timeStamp };
        sheet.style.setProperty(DragProperty, `${Math.max(0, down)}px`);
    };

    const release = (domEvent: PointerEvent): void => {
        if (drag === null || domEvent.pointerId !== drag.pointerId)
            return;

        const ended = drag;

        drag = null;

        if (!ended.moving)
            return;

        // A drag let go over an entry is no press of it.
        swallowReleaseClick();
        sheet.removeAttribute(SheetDraggingAttribute);

        const offset = Math.max(0, domEvent.clientY - ended.startY);
        const elapsed = ended.last.time - ended.previous.time;
        const speed = elapsed > 0 ? (ended.last.y - ended.previous.y) / elapsed : 0;

        // The closed rule slides it on from where the finger left it; a cancelled drag or a short one springs back.
        if (domEvent.type === "pointerup" && swipeCloses(offset, sheet.getBoundingClientRect().height, speed))
            close();
        else
            sheet.style.setProperty(DragProperty, "0px");
    };

    // Not passive: a finger moving down at the top of the scroll is the sheet's, not the page's overscroll or a pull to refresh.
    const holdTouch = (domEvent: TouchEvent): void => {
        const touch = domEvent.touches[0];

        if (drag !== null && domEvent.cancelable && touch !== undefined && (drag.moving || touch.clientY > drag.startY))
            domEvent.preventDefault();
    };

    sheet.addEventListener("pointerdown", press);
    sheet.addEventListener("pointermove", move);
    sheet.addEventListener("pointerup", release);
    sheet.addEventListener("pointercancel", release);
    sheet.addEventListener("touchmove", holdTouch, { passive: false });

    return () => {
        drag = null;
        sheet.removeAttribute(SheetDraggingAttribute);
        sheet.removeEventListener("pointerdown", press);
        sheet.removeEventListener("pointermove", move);
        sheet.removeEventListener("pointerup", release);
        sheet.removeEventListener("pointercancel", release);
        sheet.removeEventListener("touchmove", holdTouch);
    };
}

/** Keeps the drag's moves on the sheet once it leaves it; a pointer the browser already let go of has nothing to capture. */
function capture(sheet: HTMLElement, pointerId: number): void {
    try {
        sheet.setPointerCapture(pointerId);
    }
    catch {
        // Released already: the drag goes on from the moves that still reach the sheet.
    }
}
