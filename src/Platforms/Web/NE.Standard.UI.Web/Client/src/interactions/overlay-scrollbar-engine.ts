// The theme's overlay scrollbars (`data-ui-overlay-scrollbars`, UITheme.OverlayScrollbars): where a pointer hovers, no scroller draws
// a bar or keeps room for one (core/scrollbar.less), and this draws a thin thumb per axis over the edge of the scroller the pointer is
// over — and of one that moves while the pointer is elsewhere, until it settles — which the pointer may drag. Wheel, keys and touch
// scroll natively; the thumb is only the sight of where the reader is, and a handle. One layer for the page, in the top layer, so a
// popover's list shows its thumb too — inside an open modal <dialog> while one of its scrollers is shown, since the page outside it
// is inert and painted under it; each thumb is clipped to what can be seen of its scroller.

// `.ts` on the value imports: `node --test` loads this module directly.
import { setPressStandIn } from "./popup-dismissal.ts";
import { releaseScrollHolds } from "./scroll-anchor-engine.ts";

const LayerClass = "ui-overlay-scrollbar";
const BoxClass = "ui-overlay-scrollbar__box";
const ThumbClass = "ui-overlay-scrollbar__thumb";
const ShownClass = "ui-overlay-scrollbar--shown";
const HeldClass = "ui-overlay-scrollbar__thumb--held";

// Where the bars are drawn over the content: a pointer that hovers, and no forced colours, which keep the platform's own bar
// (core/scrollbar.less reads the same condition).
const OverlayQuery = "(hover: hover) and (forced-colors: none)";

// A scroller that draws no bar on purpose — a strip whose ends say it scrolls, a wheel's column — says so here, and gets no thumb.
const ThumbProperty = "--ui-overlay-thumb";

// The thumb's strip, which takes the pointer, wider than the bar the stylesheet draws in it; off the scroller's ends by `Inset`.
const Strip = 12;
const Inset = 2;
const LeastThumb = 24;
// How long a scroller moved under no pointer keeps its thumb, and one the pointer left.
const SettleDelay = 900;
// A wheel's line, where the wheel counts in lines rather than pixels.
const WheelLine = 16;

type Axis = "y" | "x";

type Box = { readonly left: number; readonly top: number; readonly right: number; readonly bottom: number; readonly width: number; readonly height: number };

type Track = { readonly start: number; readonly length: number; readonly thumb: number; readonly max: number };

/** Where a thumb stands on the viewport. */
type ThumbBox = { readonly left: number; readonly top: number; readonly width: number; readonly height: number };

type Placement = { readonly view: Box; readonly thumb: ThumbBox };

type Drag = {
    readonly axis: Axis;
    readonly scroller: Element;
    readonly pointerId: number;
    readonly from: number;
    readonly scroll: number;
    readonly ratio: number;
    readonly rtl: boolean;
};

type Bar = { readonly box: HTMLElement; readonly thumb: HTMLElement; scroller: Element | null };

export class OverlayScrollbarEngine {
    private readonly doc: Document;
    private readonly layer: HTMLElement;
    private readonly bars: Record<Axis, Bar>;
    private readonly media: MediaQueryList;
    private readonly resized = new ResizeObserver(() => this.schedule());
    // Rows put in or taken out anywhere in the scroller change how much it holds, though no box the observer above watches changes.
    private readonly changed = new MutationObserver(() => this.schedule());
    private active: boolean;
    private target: Element | null = null;
    // Where the pointer last stood: what lies under it changes when a page scrolls under a still pointer.
    private point: { readonly x: number; readonly y: number } | null = null;
    // What the next frame picks from: the element the pointer moved onto, or whatever stands under it now.
    private pickTarget = false;
    private repick = false;
    private hovered = false;
    private drag: Drag | null = null;
    private frame = 0;
    private settle = 0;

    public constructor(doc: Document = document) {
        this.doc = doc;
        this.layer = doc.createElement("div");
        this.layer.className = LayerClass;
        this.layer.setAttribute("aria-hidden", "true");
        this.layer.setAttribute("popover", "manual");
        this.bars = { y: this.createBar(doc, "y"), x: this.createBar(doc, "x") };
        // A press on a thumb keeps the focus where it was, as a press on a native bar does: a field's editor stays open.
        this.layer.addEventListener("mousedown", domEvent => domEvent.preventDefault());
        this.layer.addEventListener("contextmenu", domEvent => domEvent.preventDefault());
        doc.body.append(this.layer);

        // A press on a thumb is a press on its scroller, which a popup around the scroller counts as inside it. Its click comes before
        // the next frame, so the thumb still stands for the scroller it was pressed for (`release` picks again only on the frame).
        setPressStandIn(path => path.includes(this.bars.y.thumb) ? this.bars.y.scroller : path.includes(this.bars.x.thumb) ? this.bars.x.scroller : null);

        // Followed live: a tablet docked to a keyboard and a mouse starts to hover, and its bars go over the content with it.
        this.media = window.matchMedia(OverlayQuery);
        this.active = this.media.matches;
        this.media.addEventListener("change", () => this.follow());

        if (this.active)
            this.raise();

        doc.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), { capture: true, passive: true });
        doc.documentElement.addEventListener("pointerleave", () => this.leave());
        doc.addEventListener("scroll", domEvent => this.handleScroll(domEvent), { capture: true, passive: true });
        window.addEventListener("resize", () => this.schedule());
    }

    private createBar(doc: Document, axis: Axis): Bar {
        const box = doc.createElement("div");
        const thumb = doc.createElement("div");

        box.className = `${BoxClass} ${BoxClass}--${axis}`;
        thumb.className = `${ThumbClass} ${ThumbClass}--${axis}`;
        box.append(thumb);
        this.layer.append(box);

        thumb.addEventListener("pointerdown", domEvent => this.grab(domEvent, axis));
        thumb.addEventListener("pointermove", domEvent => this.pull(domEvent));
        thumb.addEventListener("pointerup", domEvent => this.release(domEvent));
        thumb.addEventListener("pointercancel", domEvent => this.release(domEvent));
        // Capture taken away with no release — the thumb hidden under the press, the window left — ends the drag all the same.
        thumb.addEventListener("lostpointercapture", domEvent => this.lose(domEvent));
        // A wheel over the thumb is the scroller's: the layer is no ancestor of it, so the browser would scroll nothing.
        thumb.addEventListener("wheel", domEvent => this.forwardWheel(domEvent, axis), { passive: false });

        return { box, thumb, scroller: null };
    }

    /** The overlay starts or stops as the pointer's hover and the forced colours come and go. */
    private follow(): void {
        this.active = this.media.matches;
        this.drag = null;
        this.target = null;
        this.hovered = false;
        this.forget();

        if (this.active) {
            this.raise();
            this.schedule();
        }
        else if (this.layer.matches(":popover-open")) {
            this.layer.hidePopover();
        }
    }

    /** Into the top layer again, above whatever popover opened since: one whose list scrolls is under the pointer. */
    private raise(): void {
        if (typeof this.layer.showPopover !== "function")
            return;

        if (this.layer.matches(":popover-open"))
            this.layer.hidePopover();

        this.layer.showPopover();
    }

    /**
     * The layer stands in the open modal dialog that holds the scroller, where it is neither inert nor painted under the dialog, and
     * in the body otherwise; a popover's scroller raises it above the popover.
     */
    private place(scroller: Element | null): void {
        // No thumb to show: the layer stays where it stands.
        if (scroller === null)
            return;

        const modal = scroller.closest("dialog:modal");
        const host = modal ?? this.doc.body;

        if (this.layer.parentElement !== host) {
            host.append(this.layer);

            // Shown in the closed dialog the layer would not be drawn at all.
            modal?.addEventListener("close", () => this.leaveDialog(modal), { once: true });
            this.raise();
            return;
        }

        if (scroller.closest(":popover-open") !== null)
            this.raise();
    }

    private leaveDialog(modal: Element): void {
        if (this.layer.parentElement !== modal)
            return;

        this.forget();
        this.doc.body.append(this.layer);

        if (this.active)
            this.raise();

        this.schedule();
    }

    private handlePointerMove(domEvent: PointerEvent): void {
        if (!this.active || domEvent.pointerType !== "mouse" || this.drag !== null)
            return;

        const target = domEvent.target instanceof Element ? domEvent.target : null;

        this.point = { x: domEvent.clientX, y: domEvent.clientY };

        // Over a thumb, the scroller it stands for stays the one.
        if (target === this.target || (target !== null && this.layer.contains(target)))
            return;

        // Picked on the frame: reading what scrolls here, on the move itself, would lay the page out under every move.
        this.target = target;
        this.pickTarget = true;
        this.schedule();
    }

    private handleScroll(domEvent: Event): void {
        if (!this.active)
            return;

        const scroller = domEvent.target instanceof Element ? domEvent.target : document.scrollingElement;

        if (scroller === null)
            return;

        if (scroller === this.bars.y.scroller || scroller === this.bars.x.scroller) {
            this.schedule();

            if (!this.hovered && this.drag === null)
                this.settleLater();

            return;
        }

        // Something around the shown scrollers moved — a page carrying on a wheel the scroller had no more room for — and them with it,
        // and under a still pointer another element may stand now: both are read again on the next frame.
        if (this.hovered || this.drag !== null) {
            this.repick = this.hovered && this.drag === null;
            this.schedule();
            return;
        }

        // A scroller moved by keys or by a script while the pointer is elsewhere shows where it went, until it settles.
        this.pick(canScroll(scroller, "y") ? scroller : null, canScroll(scroller, "x") ? scroller : null, false);
        this.settleLater();
        this.schedule();
    }

    private pick(y: Element | null, x: Element | null, hovered: boolean): void {
        const moved = y !== this.bars.y.scroller || x !== this.bars.x.scroller;

        this.hovered = hovered && (y !== null || x !== null);

        if (moved) {
            this.forget();
            this.bars.y.scroller = y;
            this.bars.x.scroller = x;

            for (const scroller of y === x ? [y] : [y, x]) {
                if (scroller === null)
                    continue;

                this.resized.observe(scroller);
                this.changed.observe(scroller, { childList: true, subtree: true });

                // What the scroller holds grows without the scroller changing its own size: a feed's reply streaming in.
                if (scroller.firstElementChild !== null)
                    this.resized.observe(scroller.firstElementChild);
            }

            this.place(y ?? x);
        }

        if (this.hovered) {
            window.clearTimeout(this.settle);
            this.settle = 0;
        }
        else if (hovered && this.drag === null) {
            this.settleLater();
        }
    }

    /** No scroller shown, and nothing of one watched; the next frame takes the thumbs away. */
    private forget(): void {
        this.resized.disconnect();
        this.changed.disconnect();
        this.bars.y.scroller = null;
        this.bars.x.scroller = null;
    }

    private leave(): void {
        this.target = null;

        if (this.drag === null) {
            this.hovered = false;
            this.settleLater();
        }
    }

    private settleLater(): void {
        window.clearTimeout(this.settle);
        this.settle = window.setTimeout(() => {
            this.settle = 0;

            if (this.hovered || this.drag !== null)
                return;

            this.forget();
            this.schedule();
        }, SettleDelay);
    }

    private schedule(): void {
        if (this.frame === 0)
            this.frame = window.requestAnimationFrame(() => this.drawFrame());
    }

    private drawFrame(): void {
        this.frame = 0;

        if (!this.active)
            return;

        // A dialog it stood in, taken off the page with it.
        if (!this.layer.isConnected) {
            this.doc.body.append(this.layer);
            this.raise();
        }

        if (this.repick)
            this.pickAt(this.point === null ? null : document.elementFromPoint(this.point.x, this.point.y));
        else if (this.pickTarget)
            this.pickAt(this.target);

        this.repick = false;
        this.pickTarget = false;

        // Both read, then both written: a write between the reads would lay the page out again for the second.
        const y = this.measure("y");
        const x = this.measure("x");

        this.apply(this.bars.y, y);
        this.apply(this.bars.x, x);
    }

    /** What the pointer stands over, as a move there finds it; over a thumb, the scroller it stands for stays the one. */
    private pickAt(under: Element | null): void {
        if (under !== null && this.layer.contains(under))
            return;

        this.target = under;
        this.pick(nearestScroller(under, "y"), nearestScroller(under, "x"), true);
    }

    private measure(axis: Axis): Placement | null {
        const scroller = this.bars[axis].scroller;

        if (scroller === null || !scroller.isConnected || !canScroll(scroller, axis))
            return null;

        const view = visibleBox(scroller);

        if (view === null)
            return null;

        const both = this.bars[axis === "y" ? "x" : "y"].scroller === scroller;

        return { view, thumb: thumbBox(scroller, axis, clientBox(scroller), both) };
    }

    private apply(bar: Bar, placement: Placement | null): void {
        if (placement === null) {
            bar.box.classList.remove(ShownClass);
            return;
        }

        const { view, thumb } = placement;

        Object.assign(bar.box.style, { left: `${view.left}px`, top: `${view.top}px`, width: `${view.width}px`, height: `${view.height}px` });
        Object.assign(bar.thumb.style, { left: `${thumb.left - view.left}px`, top: `${thumb.top - view.top}px`, width: `${thumb.width}px`, height: `${thumb.height}px` });
        bar.box.classList.add(ShownClass);
    }

    private grab(domEvent: PointerEvent, axis: Axis): void {
        const scroller = this.bars[axis].scroller;

        if (domEvent.button !== 0 || scroller === null)
            return;

        const rtl = axis === "x" && isRightToLeft(scroller);
        const track = trackOf(scroller, axis, clientBox(scroller), this.bars[axis === "y" ? "x" : "y"].scroller === scroller, rtl);
        const room = track.length - track.thumb;

        // The reader moves the list: a list held at its end, or a row held in view, lets go, as under the reader's own wheel.
        releaseScrollHolds(scroller);

        this.bars[axis].thumb.setPointerCapture(domEvent.pointerId);
        this.bars[axis].thumb.classList.add(HeldClass);
        this.drag = {
            axis,
            scroller,
            pointerId: domEvent.pointerId,
            from: axis === "y" ? domEvent.clientY : domEvent.clientX,
            scroll: position(scroller, axis),
            ratio: room > 0 ? track.max / room : 0,
            rtl
        };
    }

    private pull(domEvent: PointerEvent): void {
        const drag = this.drag;

        if (drag === null || domEvent.pointerId !== drag.pointerId || !drag.scroller.isConnected)
            return;

        const moved = (drag.axis === "y" ? domEvent.clientY : domEvent.clientX) - drag.from;

        if (drag.axis === "y")
            drag.scroller.scrollTop = dragScroll(drag.scroll, moved, drag.ratio, false);
        else
            drag.scroller.scrollLeft = dragScroll(drag.scroll, moved, drag.ratio, drag.rtl);
    }

    private release(domEvent: PointerEvent): void {
        if (this.drag === null || domEvent.pointerId !== this.drag.pointerId)
            return;

        this.endDrag();

        // Let go off the scroller, the pointer is over something else: what it is over decides again, on the frame — after the click
        // the release raises, which is still the press on the scroller the thumb stood for.
        this.point = { x: domEvent.clientX, y: domEvent.clientY };
        this.repick = true;
        this.schedule();
    }

    private lose(domEvent: PointerEvent): void {
        if (this.drag === null || domEvent.pointerId !== this.drag.pointerId)
            return;

        this.endDrag();
        this.hovered = false;
        this.settleLater();
    }

    private endDrag(): void {
        if (this.drag !== null)
            this.bars[this.drag.axis].thumb.classList.remove(HeldClass);

        this.drag = null;
    }

    private forwardWheel(domEvent: WheelEvent, axis: Axis): void {
        const scroller = this.bars[axis].scroller;

        // Ctrl with a wheel, or a pinch on a touchpad, is the browser's zoom, not a scroll.
        if (scroller === null || domEvent.ctrlKey)
            return;

        const along: Axis = Math.abs(domEvent.deltaY) >= Math.abs(domEvent.deltaX) ? "y" : "x";
        const left = domEvent.deltaX * wheelUnit(domEvent, scroller, "x");
        const top = domEvent.deltaY * wheelUnit(domEvent, scroller, "y");
        // At its end, the wheel carries on to what scrolls around it, as a wheel over the scroller itself does.
        const moved = scrollerWithRoom(scroller, along, along === "y" ? top : left);

        domEvent.preventDefault();

        if (moved === null)
            return;

        releaseScrollHolds(moved);
        moved.scrollBy({ left, top });
    }
}

/** The nearest element at or above `start` that scrolls along `axis`: the document's scroller at the top. */
function nearestScroller(start: Element | null, axis: Axis): Element | null {
    for (let current = start; current !== null; current = current.parentElement) {
        if (canScroll(current, axis))
            return current;
    }

    return null;
}

/** The scroller at or around `scroller` that can still move `delta` along `axis`; null where none can. */
function scrollerWithRoom(scroller: Element, axis: Axis, delta: number): Element | null {
    for (let current: Element | null = scroller; current !== null; current = nearestScroller(current.parentElement, axis)) {
        if (canScroll(current, axis) && hasRoom(current, axis, delta))
            return current;
    }

    return null;
}

function hasRoom(scroller: Element, axis: Axis, delta: number): boolean {
    const max = axis === "y" ? scroller.scrollHeight - scroller.clientHeight : scroller.scrollWidth - scroller.clientWidth;
    const at = position(scroller, axis);
    // A right-to-left scroller runs its horizontal offset from its right end: a wheel to the right goes back towards it.
    const onward = axis === "x" && isRightToLeft(scroller) ? delta < 0 : delta > 0;

    return delta !== 0 && (onward ? at < max - 1 : at > 0);
}

function wheelUnit(domEvent: WheelEvent, scroller: Element, axis: Axis): number {
    if (domEvent.deltaMode === WheelEvent.DOM_DELTA_LINE)
        return WheelLine;

    if (domEvent.deltaMode === WheelEvent.DOM_DELTA_PAGE)
        return axis === "y" ? scroller.clientHeight : scroller.clientWidth;

    return 1;
}

/**
 * Whether the element scrolls along `axis` now: more to show than it shows, and an overflow that lets the reader move it — and no
 * thumb refused by its stylesheet (`--ui-overlay-thumb: none`).
 */
export function canScroll(element: Element, axis: Axis): boolean {
    const more = axis === "y" ? element.scrollHeight - element.clientHeight : element.scrollWidth - element.clientWidth;

    if (more <= 1)
        return false;

    // The document's scroller scrolls the viewport, whose overflow is the root's unless the root's is visible.
    const page = element === document.scrollingElement;
    const style = getComputedStyle(page ? document.documentElement : element);
    const overflow = axis === "y" ? style.overflowY : style.overflowX;

    if (page)
        return overflow !== "hidden" && overflow !== "clip";

    return (overflow === "auto" || overflow === "scroll") && style.getPropertyValue(ThumbProperty).trim() !== "none";
}

/**
 * The scroller's scrollport on the viewport: its padding box, the borders off it — scaled by any transform around it (a canvas's
 * zoom), which its own client sizes leave out and its box on the viewport takes in.
 */
export function clientBox(scroller: Element): Box {
    if (scroller === document.scrollingElement)
        return box(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);

    const rect = scroller.getBoundingClientRect();
    const laidOut = scroller instanceof HTMLElement ? scroller : null;
    const scaleX = scaleOf(rect.width, laidOut?.offsetWidth);
    const scaleY = scaleOf(rect.height, laidOut?.offsetHeight);
    const left = rect.left + scroller.clientLeft * scaleX;
    const top = rect.top + scroller.clientTop * scaleY;

    return box(left, top, left + scroller.clientWidth * scaleX, top + scroller.clientHeight * scaleY);
}

/** How much a transform scales a box laid out `laidOut` wide to `drawn` on the viewport; 1 where there is no layout size to compare. */
function scaleOf(drawn: number, laidOut: number | undefined): number {
    return laidOut === undefined || laidOut <= 0 || drawn <= 0 ? 1 : drawn / laidOut;
}

/**
 * What can be seen of the scroller: its scrollport cut by every box above it that clips, and by the viewport; null where nothing. A
 * fixed box or one in the top layer (a popup's list, a modal dialog) is cut by none of the boxes around it in the document.
 */
export function visibleBox(scroller: Element): Box | null {
    let seen = clientBox(scroller);

    for (let current: Element | null = scroller; current !== null && current !== document.documentElement; current = current.parentElement) {
        const style = getComputedStyle(current);

        if (current !== scroller && (style.overflowX !== "visible" || style.overflowY !== "visible"))
            seen = cut(seen, clientBox(current));

        if (style.position === "fixed" || current.matches(":popover-open, dialog:modal"))
            break;
    }

    seen = cut(seen, box(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight));

    return seen.width > 0 && seen.height > 0 ? seen : null;
}

/** Where the thumb along `axis` stands over the scroller's scrollport `client`, for how far it has scrolled. */
export function thumbBox(scroller: Element, axis: Axis, client: Box, both: boolean): ThumbBox {
    const rtl = isRightToLeft(scroller);
    const track = trackOf(scroller, axis, client, both, rtl);
    const along = track.max > 0 ? (position(scroller, axis) / track.max) * (track.length - track.thumb) : 0;

    if (axis === "y")
        return { left: rtl ? client.left : client.right - Strip, top: track.start + along, width: Strip, height: track.thumb };

    // A right-to-left scroller starts at its right end, and its thumb runs back from there.
    return { left: rtl ? track.start + track.length - track.thumb - along : track.start + along, top: client.bottom - Strip, width: track.thumb, height: Strip };
}

function trackOf(scroller: Element, axis: Axis, client: Box, both: boolean, rtl: boolean): Track {
    // Where the scroller scrolls both ways the two thumbs keep clear of each other's corner: the vertical one's side, the bottom's end.
    const start = (axis === "y" ? client.top : client.left) + Inset + (both && rtl && axis === "x" ? Strip : 0);
    const length = (axis === "y" ? client.height : client.width) - 2 * Inset - (both ? Strip : 0);
    const shown = axis === "y" ? scroller.clientHeight : scroller.clientWidth;
    const whole = axis === "y" ? scroller.scrollHeight : scroller.scrollWidth;

    return { start, length, thumb: Math.min(length, Math.max(LeastThumb, (length * shown) / whole)), max: whole - shown };
}

/**
 * The scroll a drag puts the scroller at: where it stood, plus how far the pointer moved times the scroll a pixel of the track stands
 * for. A right-to-left scroller counts its horizontal offset back from zero, and a move to the right goes back towards its start.
 */
export function dragScroll(from: number, moved: number, ratio: number, rtl: boolean): number {
    return rtl ? -(from - moved * ratio) : from + moved * ratio;
}

/** How far the scroller is along `axis`: a right-to-left scroller counts its horizontal offset back from zero. */
function position(scroller: Element, axis: Axis): number {
    return axis === "y" ? scroller.scrollTop : Math.abs(scroller.scrollLeft);
}

function isRightToLeft(scroller: Element): boolean {
    return getComputedStyle(scroller).direction === "rtl";
}

function box(left: number, top: number, right: number, bottom: number): Box {
    return { left, top, right, bottom, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
}

function cut(a: Box, b: Box): Box {
    return box(Math.max(a.left, b.left), Math.max(a.top, b.top), Math.min(a.right, b.right), Math.min(a.bottom, b.bottom));
}
