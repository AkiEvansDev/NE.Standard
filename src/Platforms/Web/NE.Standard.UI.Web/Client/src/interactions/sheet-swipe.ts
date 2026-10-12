// A sheet's swipe down, for a list shown as a phone's sheet and a dialog's bottom sheet alike: from its handle, or — a finger — from
// anywhere at the top of its scroll, the sheet follows the drag, closes past a third of its height or on a flick, and short of that
// springs back. The stylesheet moves it by `--ui-sheet-drag` and drops its transition while `data-ui-sheet-dragging` is on.

import { FlickSpeed, followSwipe, SwipeSlop } from "./swipe-follow.ts";

/** On a sheet while a finger or the pointer drags it: its transform follows at once, with no transition. */
const SheetDraggingAttribute = "data-ui-sheet-dragging";

const DragProperty = "--ui-sheet-drag";

// The band at a sheet's top its handle stands in, where the pointer's press drags too; a finger's drags from anywhere.
const HandleBand = 24;

/** How much of its height a sheet must be dragged down to close when let go slowly. */
const CloseShare = 1 / 3;

/** Whether a drag let go `offset` pixels down a sheet `height` pixels tall, moving down at `speed` px/ms, closes it. */
export function swipeCloses(offset: number, height: number, speed: number): boolean {
    return offset > height * CloseShare || (speed > FlickSpeed && offset > SwipeSlop);
}

/**
 * Lets `sheet` be swiped down, `close` running when a swipe lets it go far or fast enough; `scroller` is the box whose scroll must be
 * at its top for a drag to start, the sheet itself where it scrolls. Answers the detach.
 */
export function followSwipeDown(sheet: HTMLElement, scroller: HTMLElement, close: () => void): () => void {
    sheet.style.removeProperty(DragProperty);
    sheet.removeAttribute(SheetDraggingAttribute);

    const detach = followSwipe(sheet, {
        axis: "y",
        oneWay: true,
        // A finger moving down at the top of the scroll is the sheet's, not the page's overscroll or a pull to refresh.
        holdsTouch: true,
        begins: domEvent => scroller.scrollTop <= 0 && (domEvent.pointerType === "touch" || domEvent.clientY - sheet.getBoundingClientRect().top <= HandleBand),
        start: domEvent => {
            sheet.setAttribute(SheetDraggingAttribute, "");
            capture(sheet, domEvent.pointerId);
        },
        follow: offset => sheet.style.setProperty(DragProperty, `${offset}px`),
        end: (offset, speed, letGo) => {
            sheet.removeAttribute(SheetDraggingAttribute);

            // The closed rule slides it on from where the finger left it; a cancelled drag or a short one springs back.
            if (letGo && swipeCloses(offset, sheet.getBoundingClientRect().height, speed))
                close();
            else
                sheet.style.setProperty(DragProperty, "0px");
        }
    });

    return () => {
        detach();
        sheet.removeAttribute(SheetDraggingAttribute);
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
