// The theme's overlay scrollbars (`data-ui-overlay-scrollbars`, UITheme.OverlayScrollbars): where a pointer hovers, no scroller draws
// the platform's bar (core/scrollbar.less, where the framework's scrollers keep this one's room), and this draws a thin thumb per axis
// over the edge of the scroller the pointer is over — and of one the reader's keys move while the pointer is elsewhere — which the
// pointer may drag. As the platforms' own overlay bars, it shows while the reader scrolls, until the scroll settles, and while the
// pointer nears the edge it stands at, not all the while the pointer rests over the words: a feed being read keeps its words clear. A
// script's scroll (a list held at its end as a reply streams in) shows nothing. Wheel, keys and touch scroll natively; the thumb is only
// the sight of where the reader is, and a handle. One layer for the page, in the top layer, so a popover's list shows its thumb too —
// inside an open modal <dialog> while one of its scrollers is shown, since the page outside it is inert and painted under it; each
// thumb is clipped to what can be seen of its scroller.

// `.ts` on the value imports: `node --test` loads this module directly.
import { setPressStandIn } from "./popup-dismissal.ts";
import { isComposing } from "./keyboard-shortcut.ts";
import { releaseScrollHolds } from "./scroll-anchor-engine.ts";

const LayerClass = "ui-overlay-scrollbar";
const BoxClass = "ui-overlay-scrollbar__box";
const ThumbClass = "ui-overlay-scrollbar__thumb";
const ShownClass = "ui-overlay-scrollbar--shown";
const HeldClass = "ui-overlay-scrollbar__thumb--held";
const ArrowClass = "ui-overlay-scrollbar__arrow";
const NearClass = "ui-overlay-scrollbar--near";

// Where the bars are drawn over the content: a pointer that hovers, and no forced colours, which keep the platform's own bar
// (core/scrollbar.less reads the same condition).
const OverlayQuery = "(hover: hover) and (forced-colors: none)";

// A scroller that draws no bar on purpose — a strip whose ends say it scrolls, a wheel's column — says so here, and gets no thumb.
const ThumbProperty = "--ui-overlay-thumb";

// What a scroller hangs of the bar's room past its box, as a transparent end border, where its upright thumb stands (core/scrollbar.less).
const HungProperty = "--ui-scroll-hung";

// The thumb's strip, which takes the pointer, wider than the bar the stylesheet draws in it; off the scroller's ends by `Inset`.
const Strip = 12;
const Inset = 2;
const LeastThumb = 24;
// The arrows at the track's ends, each a strip square, and the least track that keeps them: a shorter scroller's thumb runs end to end.
const Arrow = 12;
const ArrowedLeast = 80;
// What an arrow's press scrolls, and how soon and how often a held one repeats, near a platform bar's line and repeat.
const ArrowStep = 40;
const RepeatDelay = 400;
const RepeatEvery = 50;
// How far past the strip a pointer nearing the edge brings the thumb in.
const Approach = 16;
// How long a scroll keeps its thumb shown after it settles, and a scroller the pointer left stays the one.
const SettleDelay = 900;
// How soon after the reader's wheel or key a scroll counts as theirs, rather than a script's.
const InputWindow = 400;
// A wheel's line, where the wheel counts in lines rather than pixels.
const WheelLine = 16;

type Axis = "y" | "x";

type Box = { readonly left: number; readonly top: number; readonly right: number; readonly bottom: number; readonly width: number; readonly height: number };

type Track = { readonly start: number; readonly length: number; readonly thumb: number; readonly max: number; readonly arrow: number };

/** Where a thumb stands on the viewport. */
type ThumbBox = { readonly left: number; readonly top: number; readonly width: number; readonly height: number };

/** Where the arrows stand on the viewport, back (up or left) and forward; null where the track is too short to keep them. */
type Arrows = { readonly back: ThumbBox; readonly forward: ThumbBox } | null;

type Placement = { readonly view: Box; readonly thumb: ThumbBox; readonly arrows: Arrows; readonly rtl: boolean };

type Drag = {
    readonly axis: Axis;
    readonly scroller: Element;
    readonly pointerId: number;
    readonly from: number;
    readonly scroll: number;
    readonly ratio: number;
    readonly rtl: boolean;
};

type Point = { readonly x: number; readonly y: number };

/** `view`, the scroller's seen box as the last frame measured it, and `rtl` its side, answer whether the pointer nears the bar between frames. */
type Bar = { readonly axis: Axis; readonly box: HTMLElement; readonly thumb: HTMLElement; readonly back: HTMLElement; readonly forward: HTMLElement; scroller: Element | null; view: Box | null; rtl: boolean; near: boolean };

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
    private point: Point | null = null;
    // What the next frame picks from: the element the pointer moved onto, or whatever stands under it now.
    private pickTarget = false;
    private repick = false;
    private hovered = false;
    private drag: Drag | null = null;
    // The axis whose arrow is held, and its repeat's timer.
    private stepping: Axis | null = null;
    private repeat = 0;
    private frame = 0;
    private settle = 0;
    // The reader is scrolling: the thumbs show until it settles.
    private scrolling = false;
    private fade = 0;
    // When the reader last turned a wheel or pressed a key, which a scroll soon after is taken to come from.
    private inputAt = Number.NEGATIVE_INFINITY;

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
        setPressStandIn(path => path.includes(this.bars.y.box) ? this.bars.y.scroller : path.includes(this.bars.x.box) ? this.bars.x.scroller : null);

        // Followed live: a tablet docked to a keyboard and a mouse starts to hover, and its bars go over the content with it.
        this.media = window.matchMedia(OverlayQuery);
        this.active = this.media.matches;
        this.media.addEventListener("change", () => this.follow());

        if (this.active)
            this.raise();

        doc.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), { capture: true, passive: true });
        doc.documentElement.addEventListener("pointerleave", () => this.leave());
        doc.addEventListener("scroll", domEvent => this.handleScroll(domEvent), { capture: true, passive: true });
        doc.addEventListener("wheel", domEvent => this.noteInput(domEvent), { capture: true, passive: true });
        doc.addEventListener("keydown", domEvent => this.noteInput(domEvent), { capture: true, passive: true });
        // On the window, first to hear a key, as a handle's drag (pointer-drag.ts): Escape mid-drag puts the scroller back rather than
        // closing the popup it scrolls in. A drag of its own, not that one: the thumb lives on a layer over the page, and a capture
        // taken away with no release ends it.
        window.addEventListener("keydown", domEvent => this.cancelDrag(domEvent), true);
        window.addEventListener("resize", () => this.schedule());
    }

    private createBar(doc: Document, axis: Axis): Bar {
        const box = doc.createElement("div");
        const thumb = doc.createElement("div");
        const back = this.createArrow(doc, axis, -1);
        const forward = this.createArrow(doc, axis, 1);

        box.className = `${BoxClass} ${BoxClass}--${axis}`;
        thumb.className = `${ThumbClass} ${ThumbClass}--${axis}`;
        box.append(back, thumb, forward);
        this.layer.append(box);

        thumb.addEventListener("pointerdown", domEvent => this.grab(domEvent, axis));
        thumb.addEventListener("pointermove", domEvent => this.pull(domEvent));
        thumb.addEventListener("pointerup", domEvent => this.release(domEvent));
        thumb.addEventListener("pointercancel", domEvent => this.release(domEvent));
        // Capture taken away with no release — the thumb hidden under the press, the window left — ends the drag all the same.
        thumb.addEventListener("lostpointercapture", domEvent => this.lose(domEvent));
        // A wheel over the thumb is the scroller's: the layer is no ancestor of it, so the browser would scroll nothing.
        thumb.addEventListener("wheel", domEvent => this.forwardWheel(domEvent, axis), { passive: false });

        return { axis, box, thumb, back, forward, scroller: null, view: null, rtl: false, near: false };
    }

    /** An arrow at one end of the track: a press scrolls a step towards it, and a held one goes on. */
    private createArrow(doc: Document, axis: Axis, direction: -1 | 1): HTMLElement {
        const arrow = doc.createElement("div");

        arrow.className = `${ArrowClass} ${ArrowClass}--${direction < 0 ? "back" : "forward"}`;
        arrow.addEventListener("pointerdown", domEvent => this.step(domEvent, axis, direction));
        arrow.addEventListener("pointerup", () => this.stopStepping());
        arrow.addEventListener("pointercancel", () => this.stopStepping());
        arrow.addEventListener("lostpointercapture", () => this.stopStepping());
        arrow.addEventListener("wheel", domEvent => this.forwardWheel(domEvent, axis), { passive: false });

        return arrow;
    }

    /** The overlay starts or stops as the pointer's hover and the forced colours come and go. */
    private follow(): void {
        this.active = this.media.matches;
        this.drag = null;
        this.stopStepping();
        this.target = null;
        this.hovered = false;
        this.scrolling = false;
        this.bars.y.near = false;
        this.bars.x.near = false;
        window.clearTimeout(this.fade);
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
        this.approach();

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
            // A scroll under way goes on showing, however it carries on (a smooth one, a fling).
            if (this.scrolling || this.drag !== null || this.readerScrolled(domEvent))
                this.flash();

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

        // A scroller the reader's keys moved while the pointer is elsewhere shows where it went, until it settles; a script's, nothing.
        if (!this.readerScrolled(domEvent))
            return;

        this.pick(canScroll(scroller, "y") ? scroller : null, canScroll(scroller, "x") ? scroller : null, false);
        this.flash();
        this.settleLater();
        this.schedule();
    }

    private noteInput(domEvent: Event): void {
        this.inputAt = domEvent.timeStamp;
    }

    /** Whether the scroll came soon after the reader's wheel or key, rather than from a script. */
    private readerScrolled(domEvent: Event): boolean {
        return domEvent.timeStamp - this.inputAt < InputWindow;
    }

    /** The thumbs show while the reader scrolls, and fade once the scroll has settled. */
    private flash(): void {
        this.scrolling = true;
        window.clearTimeout(this.fade);
        this.fade = window.setTimeout(() => {
            this.fade = 0;
            this.scrolling = false;
            this.paint();
        }, SettleDelay);
        this.paint();
    }

    /** Whether the pointer nears each bar, on the box the last frame measured; read on every move, so it lays nothing out. */
    private approach(): void {
        let changed = false;

        for (const bar of [this.bars.y, this.bars.x]) {
            const near = this.point !== null && bar.view !== null && nearsBar(this.point, bar.view, bar.axis, bar.rtl);

            changed ||= near !== bar.near;
            bar.near = near;
        }

        if (changed)
            this.paint();
    }

    /**
     * Each measured thumb shown or faded as the reader scrolls, nears it or holds it; its arrows only as the pointer nears it or holds
     * one of its parts, as a platform's overlay bar shows them, so a wheel's scroll shows the thumb alone.
     */
    private paint(): void {
        for (const bar of [this.bars.y, this.bars.x]) {
            const held = this.drag?.axis === bar.axis || this.stepping === bar.axis;

            bar.box.classList.toggle(ShownClass, bar.view !== null && (this.scrolling || bar.near || held));
            bar.box.classList.toggle(NearClass, bar.view !== null && (bar.near || held));
        }
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
        this.point = null;
        this.approach();

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

        // The page may have moved the bars under a still pointer.
        this.approach();
        this.paint();
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

        const client = axis === "y" ? barBox(scroller) : clientBox(scroller);

        return { view, thumb: thumbBox(scroller, axis, client, both), arrows: arrowBoxes(scroller, axis, client, both), rtl: isRightToLeft(scroller) };
    }

    /** Where the thumb stands; whether it shows is paint's. */
    private apply(bar: Bar, placement: Placement | null): void {
        bar.view = placement?.view ?? null;

        if (placement === null)
            return;

        const { view, thumb, arrows } = placement;

        bar.rtl = placement.rtl;
        Object.assign(bar.box.style, { left: `${view.left}px`, top: `${view.top}px`, width: `${view.width}px`, height: `${view.height}px` });
        placeIn(bar.thumb, thumb, view);
        bar.back.hidden = arrows === null;
        bar.forward.hidden = arrows === null;

        if (arrows !== null) {
            placeIn(bar.back, arrows.back, view);
            placeIn(bar.forward, arrows.forward, view);
        }
    }

    /** A press on an arrow: a step at once, then on and on while it is held, as a platform bar's arrow repeats. */
    private step(domEvent: PointerEvent, axis: Axis, direction: -1 | 1): void {
        const scroller = this.bars[axis].scroller;

        if (domEvent.button !== 0 || scroller === null || this.drag !== null)
            return;

        // The reader moves the list: a list held at its end, or a row held in view, lets go, as under the reader's own wheel.
        releaseScrollHolds(scroller);

        (domEvent.currentTarget as HTMLElement).setPointerCapture(domEvent.pointerId);
        this.stopStepping();
        this.stepping = axis;

        const once = (): void => {
            if (!scroller.isConnected) {
                this.stopStepping();
                return;
            }

            // Physical, as the arrow stands: a right-to-left strip's left arrow shows more of its left too.
            scroller.scrollBy(axis === "y" ? { top: direction * ArrowStep } : { left: direction * ArrowStep });
            this.flash();
        };

        once();
        this.repeat = window.setTimeout(() => {
            this.repeat = window.setInterval(once, RepeatEvery);
        }, RepeatDelay);
    }

    private stopStepping(): void {
        // One list of timers holds both: the delay before the repeat, or the repeat.
        window.clearTimeout(this.repeat);
        window.clearInterval(this.repeat);
        this.repeat = 0;

        if (this.stepping === null)
            return;

        this.stepping = null;
        this.paint();
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

    /** Escape mid-drag: the scroller back where the press found it, the thumb let go. */
    private cancelDrag(domEvent: KeyboardEvent): void {
        const drag = this.drag;

        if (drag === null || domEvent.key !== "Escape" || domEvent.defaultPrevented || isComposing(domEvent))
            return;

        domEvent.preventDefault();

        if (drag.axis === "y")
            drag.scroller.scrollTop = dragScroll(drag.scroll, 0, drag.ratio, false);
        else
            drag.scroller.scrollLeft = dragScroll(drag.scroll, 0, drag.ratio, drag.rtl);

        // Let go before the capture is released, so the `lostpointercapture` it raises finds no drag to end again.
        this.endDrag();

        try {
            this.bars[drag.axis].thumb.releasePointerCapture(drag.pointerId);
        }
        catch {
            // Already released, or never held (a synthesized press): there is nothing to let go of.
        }
    }

    private endDrag(): void {
        if (this.drag !== null)
            this.bars[this.drag.axis].thumb.classList.remove(HeldClass);

        this.drag = null;
        this.paint();
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

/**
 * Whether the pointer stands near enough the bar along `axis` to bring it in: over the strip at the edge it stands at in `view` (the
 * left one in a right-to-left scroller), or a little short of it.
 */
export function nearsBar(point: Point, view: Box, axis: Axis, rtl: boolean): boolean {
    const reach = Strip + Approach;

    if (axis === "x")
        return point.x >= view.left && point.x <= view.right && point.y <= view.bottom && point.y > view.bottom - reach;

    if (point.y < view.top || point.y > view.bottom)
        return false;

    return rtl ? point.x >= view.left && point.x < view.left + reach : point.x <= view.right && point.x > view.right - reach;
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

/** The scrollport with the room the scroller hangs past it taken in: where its upright bar stands. */
export function barBox(scroller: Element): Box {
    const client = clientBox(scroller);

    if (scroller === document.scrollingElement)
        return client;

    const hung = Number.parseFloat(getComputedStyle(scroller).getPropertyValue(HungProperty));

    if (!(hung > 0))
        return client;

    return isRightToLeft(scroller) ? box(client.left - hung, client.top, client.right, client.bottom) : box(client.left, client.top, client.right + hung, client.bottom);
}

/**
 * What can be seen of the scroller and the room it hangs past it: cut by every box above it that clips, as far as it clips — along an
 * axis it clips, past its `overflow-clip-margin` where it clips with `clip` — and by the viewport; null where nothing. A fixed box or
 * one in the top layer (a popup's list, a modal dialog) is cut by none of the boxes around it in the document.
 */
export function visibleBox(scroller: Element): Box | null {
    let seen = barBox(scroller);

    for (let current: Element | null = scroller; current !== null && current !== document.documentElement; current = current.parentElement) {
        const style = getComputedStyle(current);

        if (current !== scroller && (style.overflowX !== "visible" || style.overflowY !== "visible"))
            seen = cut(seen, clipBox(current, style));

        if (style.position === "fixed" || current.matches(":popover-open, dialog:modal"))
            break;
    }

    seen = cut(seen, box(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight));

    return seen.width > 0 && seen.height > 0 ? seen : null;
}

/** What a box clips its content to: its padding box along an axis it clips, widened by its clip margin where that is `clip`. */
function clipBox(element: Element, style: CSSStyleDeclaration): Box {
    const client = clientBox(element);
    // The margin's reference box is the padding box unless it names another, which nothing here does.
    const margin = Number.parseFloat((style.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0;
    const x = style.overflowX === "visible" ? Number.POSITIVE_INFINITY : style.overflowX === "clip" ? margin : 0;
    const y = style.overflowY === "visible" ? Number.POSITIVE_INFINITY : style.overflowY === "clip" ? margin : 0;

    return box(client.left - x, client.top - y, client.right + x, client.bottom + y);
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

/** Where the arrows stand at the ends of the thumb's track, in the thumb's strip; null where the track keeps none. */
export function arrowBoxes(scroller: Element, axis: Axis, client: Box, both: boolean): Arrows {
    const rtl = isRightToLeft(scroller);
    const track = trackOf(scroller, axis, client, both, rtl);

    if (track.arrow === 0)
        return null;

    if (axis === "y") {
        const left = rtl ? client.left : client.right - Strip;

        return { back: { left, top: track.start - Arrow, width: Strip, height: Arrow }, forward: { left, top: track.start + track.length, width: Strip, height: Arrow } };
    }

    const top = client.bottom - Strip;

    return { back: { left: track.start - Arrow, top, width: Arrow, height: Strip }, forward: { left: track.start + track.length, top, width: Arrow, height: Strip } };
}

/**
 * The room an arrow takes at each end of the track: kept whether the arrows show or not, so the thumb at an end stands clear of a
 * rounded corner rather than running into it; none on a track too short to give it.
 */
function arrowRoom(client: Box, axis: Axis, both: boolean, stuck: number): number {
    return (axis === "y" ? client.height : client.width) - stuck - 2 * Inset - (both ? Strip : 0) >= ArrowedLeast ? Arrow : 0;
}

function trackOf(scroller: Element, axis: Axis, client: Box, both: boolean, rtl: boolean): Track {
    const stuck = axis === "y" ? stuckRows(scroller) : { top: 0, bottom: 0 };
    const arrow = arrowRoom(client, axis, both, stuck.top + stuck.bottom);
    // Where the scroller scrolls both ways the two thumbs keep clear of each other's corner: the vertical one's side, the bottom's end.
    const start = (axis === "y" ? client.top + stuck.top : client.left) + Inset + arrow + (both && rtl && axis === "x" ? Strip : 0);
    const length = (axis === "y" ? client.height - stuck.top - stuck.bottom : client.width) - 2 * Inset - 2 * arrow - (both ? Strip : 0);
    const shown = axis === "y" ? scroller.clientHeight : scroller.clientWidth;
    const whole = axis === "y" ? scroller.scrollHeight : scroller.scrollWidth;

    return { start, length, thumb: Math.min(length, Math.max(LeastThumb, (length * shown) / whole)), max: whole - shown, arrow };
}

/**
 * What sticks over the scroller's top and bottom — a table's header, a package's totals — as its `scroll-padding` says for the rows
 * the keyboard brings into view (ui-table.less): the upright bar runs beside the rows that scroll, not beside what stays.
 */
function stuckRows(scroller: Element): { readonly top: number; readonly bottom: number } {
    if (scroller === document.scrollingElement)
        return { top: 0, bottom: 0 };

    const style = getComputedStyle(scroller);

    return { top: Number.parseFloat(style.scrollPaddingTop) || 0, bottom: Number.parseFloat(style.scrollPaddingBottom) || 0 };
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

/** Stands `part` at `at`, a box on the viewport, inside the bar's box at `view`. */
function placeIn(part: HTMLElement, at: ThumbBox, view: Box): void {
    Object.assign(part.style, { left: `${at.left - view.left}px`, top: `${at.top - view.top}px`, width: `${at.width}px`, height: `${at.height}px` });
}

function box(left: number, top: number, right: number, bottom: number): Box {
    return { left, top, right, bottom, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
}

function cut(a: Box, b: Box): Box {
    return box(Math.max(a.left, b.left), Math.max(a.top, b.top), Math.min(a.right, b.right), Math.min(a.bottom, b.bottom));
}
