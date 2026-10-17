// A finger held still on a part with a context menu stands for the right press. iOS Safari sends no `contextmenu` for it, so the press
// is timed here and a `contextmenu` raised for it; where the browser sends its own as well (Android), whichever comes first opens the
// menu and the other is spent, so the menu opens once. A long press is never also a click. On a part that drags as well, holding still
// opens the menu and moving on without lifting closes it, the drag going on: the browser's own drag, which starts before the time is
// up (Android's, at about 400 ms), opens the menu as it starts. The same hold, given an `answer`, does something else — a control's
// tooltip words (tooltip-engine.ts) — timed, spent and cancelled by a second finger alike. Given a part to show it on, a hold past a
// moment says it is being read: `ui-long-press-hold` there, then `ui-long-press-hold-end` as it opens the menu or is let go, which the
// press ripple engine answers.

// `.ts` on the value import: `node --test` loads this module as it is.
import { ContextMenuAttribute, SplittingAttribute } from "../addressing/dom-attributes.ts";

const LongPressDelay = 500;
// A tap and a scroll's start are over before it: only a finger meaning to hold is shown its hold.
const HoldShownDelay = 150;
/** How far the finger may drift, in pixels, and still be held still: past it the press is a scroll, a pan or a drag. */
const LongPressSlop = 10;

// The `contextmenu` events raised here, which the context menu engine reads as a finger's opening.
const raised = new WeakSet<Event>();

/** Raised on the part a finger is held on once the hold is shown, with the time left until it opens the menu. */
export const LongPressHoldEventName = "ui-long-press-hold";

/** Raised where a shown hold ended: the menu it asked for opened, or the finger let go, moved on or became a scroll. */
export const LongPressHoldEndEventName = "ui-long-press-hold-end";

export type LongPressHoldDetail = {
    readonly pointerId: number;
    /** What the finger went down on, inside the part. */
    readonly target: Element;
    readonly clientX: number;
    readonly clientY: number;
    /** Milliseconds until the hold opens the menu. */
    readonly duration: number;
};

export type LongPressHoldEndDetail = {
    readonly pointerId: number;
    readonly opened: boolean;
};

/** Whether a `contextmenu` is the one this module raised for a long press. */
export function isLongPressOpening(domEvent: Event): boolean {
    return raised.has(domEvent);
}

type Press = {
    readonly pointerId: number;
    readonly x: number;
    readonly y: number;
    readonly target: Element;
    readonly timer: ReturnType<typeof setTimeout>;
    readonly shown: ReturnType<typeof setTimeout> | null;
};

export type LongPressOptions = {
    readonly root: ParentNode;
    /** Where the click a long press's release may still raise is caught first, ahead of every engine listening on the root. */
    readonly first?: Pick<EventTarget, "addEventListener">;
    /** Whether a finger held there asks for anything at all: nothing is timed elsewhere. */
    readonly holds: (target: Element) => boolean;
    /**
     * What a held finger does other than a menu (a tooltip's words), answering whether it did anything; the browser's own `contextmenu`
     * for the held part, coming first, does it at once and is spent. Left out, the hold raises a `contextmenu` where the finger went down.
     */
    readonly answer?: (target: Element) => boolean;
    /** Closes the menu a long press opened, as a press outside it would: the finger moved on to drag what it held. */
    readonly closeMenu?: () => void;
    /** The part a held finger shows its hold on, or null; left out, a hold shows nothing. */
    readonly shows?: (target: Element) => Element | null;
};

export class LongPress {
    private readonly root: ParentNode;
    private readonly holds: (target: Element) => boolean;
    private readonly answer: ((target: Element) => boolean) | undefined;
    private readonly closeMenu: () => void;
    private readonly shows: ((target: Element) => Element | null) | undefined;
    private press: Press | null = null;

    // The part showing the hold, until it opens or is let go.
    private shown: { readonly pointerId: number; readonly part: Element } | null = null;

    // What the press a menu opened for went down on, until the next press: its own `contextmenu` and its click are spent.
    private answered: Element | null = null;

    // Where the finger stood as the menu opened, and whether it has slid past the slop since: a slide to an entry chooses it.
    private openedAt: { readonly pointerId: number; readonly x: number; readonly y: number } | null = null;
    private slid = false;

    // The menu opened as the browser's own drag of the held part began: the drag's moves past the slop take it away.
    private dragging = false;

    public constructor(options: LongPressOptions) {
        this.root = options.root;
        this.holds = options.holds;
        this.answer = options.answer;
        this.closeMenu = options.closeMenu ?? (() => undefined);
        this.shows = options.shows;

        // Capturing, and registered before the context menu engine's own listener, so a spent `contextmenu` never reaches it.
        options.root.addEventListener("pointerdown", domEvent => this.handleDown(domEvent), true);
        options.root.addEventListener("pointermove", domEvent => this.handleMove(domEvent), true);
        options.root.addEventListener("pointerup", () => this.cancel(), true);
        options.root.addEventListener("pointercancel", () => this.cancel(), true);
        options.root.addEventListener("contextmenu", domEvent => this.handleContextMenu(domEvent), true);
        options.root.addEventListener("dragstart", domEvent => this.handleDragStart(domEvent), true);
        options.root.addEventListener("dragover", domEvent => this.handleDragOver(domEvent), true);
        options.root.addEventListener("dragend", () => this.endDrag(), true);
        options.root.addEventListener("drop", () => this.endDrag(), true);
        (options.first ?? options.root).addEventListener("click", domEvent => this.handleClick(domEvent), true);
    }

    private handleDown(domEvent: Event): void {
        const pointer = domEvent as Partial<PointerEvent>;

        this.answered = null;
        this.openedAt = null;
        this.slid = false;
        this.dragging = false;

        // A second finger is a pinch, not a held press.
        if (this.press !== null) {
            this.cancel();
            return;
        }

        if (pointer.pointerType !== "touch" || !(domEvent.target instanceof Element) || !this.holds(domEvent.target))
            return;

        const target = domEvent.target;
        const x = pointer.clientX ?? 0;
        const y = pointer.clientY ?? 0;
        const shown = this.shows === undefined ? null : setTimeout(() => this.showHold(), HoldShownDelay);

        this.press = { pointerId: pointer.pointerId ?? 0, x, y, target, timer: setTimeout(() => this.fireHeld(), LongPressDelay), shown };
    }

    /** Held past a tap: the part answers, from where the finger went down, for the time left until the menu opens. */
    private showHold(): void {
        const press = this.press;
        const part = press === null || !press.target.isConnected ? null : this.shows?.(press.target) ?? null;

        if (press === null || part === null)
            return;

        const detail: LongPressHoldDetail = { pointerId: press.pointerId, target: press.target, clientX: press.x, clientY: press.y, duration: LongPressDelay - HoldShownDelay };

        this.shown = { pointerId: press.pointerId, part };
        part.dispatchEvent(new CustomEvent<LongPressHoldDetail>(LongPressHoldEventName, { bubbles: true, detail }));
    }

    /** The shown hold is over; the root hears it where its part has left the page, so its answer is never left behind. */
    private endHold(opened: boolean): void {
        const shown = this.shown;

        if (shown === null)
            return;

        this.shown = null;

        const detail: LongPressHoldEndDetail = { pointerId: shown.pointerId, opened };

        (shown.part.isConnected ? shown.part : this.root).dispatchEvent(new CustomEvent<LongPressHoldEndDetail>(LongPressHoldEndEventName, { bubbles: true, detail }));
    }

    private handleMove(domEvent: Event): void {
        const pointer = domEvent as Partial<PointerEvent>;
        const press = this.press;
        const opened = this.openedAt;

        if (opened !== null && pointer.pointerId === opened.pointerId && Math.hypot((pointer.clientX ?? opened.x) - opened.x, (pointer.clientY ?? opened.y) - opened.y) > LongPressSlop) {
            this.slid = true;

            // A handle's drag holds the pointer from its press (pointer-drag.ts): the slide is the drag's, and the menu goes.
            if ((this.answered?.closest(`[${SplittingAttribute}]`) ?? null) !== null)
                this.leaveMenuToDrag();
        }

        if (press === null || pointer.pointerId !== press.pointerId)
            return;

        if (Math.hypot((pointer.clientX ?? press.x) - press.x, (pointer.clientY ?? press.y) - press.y) > LongPressSlop)
            this.cancel();
    }

    /** The finger moved on to drag what it held: the menu goes, the drag goes on over the page under it. */
    private leaveMenuToDrag(): void {
        this.dragging = false;
        this.openedAt = null;
        this.closeMenu();
    }

    /** The press is no longer a hold: nothing is timed, and a hold shown goes. */
    private cancel(): void {
        this.forget();
        this.endHold(false);
    }

    private forget(): void {
        if (this.press === null)
            return;

        clearTimeout(this.press.timer);

        if (this.press.shown !== null)
            clearTimeout(this.press.shown);

        this.press = null;
    }

    /** Held long enough: the menu is asked for where the finger went down, as a right press there asks for it. */
    private fireHeld(): void {
        const press = this.press;

        this.forget();

        if (press !== null)
            this.fire(press);
    }

    private fire(press: Press): void {
        if (!press.target.isConnected) {
            this.endHold(false);
            return;
        }

        // Not a menu: nothing to slide to or to leave for a drag, only the browser's menu and the release's click to spend.
        if (this.answer !== undefined) {
            this.answered = this.answer(press.target) ? press.target : null;
            this.endHold(this.answered !== null);
            return;
        }

        const opening = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2, clientX: press.x, clientY: press.y });

        raised.add(opening);
        press.target.dispatchEvent(opening);

        // Spent only where a menu took it: with none, the browser's own menu, where it sends one, is the reader's as before.
        this.answered = opening.defaultPrevented ? press.target : null;
        this.openedAt = this.answered === null ? null : { pointerId: press.pointerId, x: press.x, y: press.y };
        this.endHold(this.answered !== null);
    }

    /** The browser's own `contextmenu` for a press the timer answered is spent; one that comes first answers the press itself. */
    private handleContextMenu(domEvent: Event): void {
        if (raised.has(domEvent))
            return;

        // Only the one for what the finger held: a `contextmenu` raised anywhere else (a keyboard's menu key, a script) is not it.
        if (this.answered !== null && domEvent.target instanceof Node && this.answered.contains(domEvent.target)) {
            domEvent.preventDefault();
            domEvent.stopImmediatePropagation();
            return;
        }

        const press = this.press;

        // The browser's own menu for the press a hold answers otherwise (Android's, at about the same time) does it now and is spent.
        if (this.answer !== undefined && press !== null && domEvent.target instanceof Node && press.target.contains(domEvent.target)) {
            domEvent.preventDefault();
            this.forget();
            this.fire(press);
            return;
        }

        // The browser's own for the held part (Android's, at about 400 ms) opens the menu itself: the hold shown ends as an opening if a
        // menu took it, read once every listener has heard it.
        if (press !== null && this.shown !== null && domEvent.target instanceof Node && press.target.contains(domEvent.target)) {
            this.forget();
            setTimeout(() => this.endHold(domEvent.defaultPrevented));
            return;
        }

        this.cancel();
    }

    /**
     * The browser's own drag of the part a finger holds still — begun before the time is up, and cancelling the pointer — opens the
     * menu as it starts; a drag an engine refused leaves the press to its timer. Read once every engine has heard the `dragstart`.
     */
    private handleDragStart(domEvent: Event): void {
        const press = this.press;
        const dragged = domEvent.target;

        if (press === null || !(dragged instanceof Node) || !(dragged.contains(press.target) || press.target.contains(dragged)))
            return;

        setTimeout(() => {
            if (domEvent.defaultPrevented)
                return;

            if (this.press === press)
                this.forget();

            this.fire(press);
            this.dragging = this.openedAt !== null;
        });
    }

    /** The browser's drag moved past the slop from where the menu opened. */
    private handleDragOver(domEvent: Event): void {
        const at = domEvent as Partial<DragEvent>;
        const opened = this.openedAt;

        if (!this.dragging || opened === null || at.clientX === undefined || at.clientY === undefined)
            return;

        if (Math.hypot(at.clientX - opened.x, at.clientY - opened.y) > LongPressSlop)
            this.leaveMenuToDrag();
    }

    /** Let go where it began, the drag leaves the menu open. */
    private endDrag(): void {
        this.dragging = false;
    }

    /**
     * The click a long press's release may raise presses nothing, wherever it lands — on what was under the finger, or on the menu that
     * just opened there (a canvas that takes every touch for itself sends it over the menu, which took it for a press outside an entry
     * and closed). A finger that slid to an entry after the menu opened chooses it.
     */
    private handleClick(domEvent: Event): void {
        const target = domEvent.target instanceof Element ? domEvent.target : null;

        if (this.answered === null || target === null || (this.slid && target.closest(`[${ContextMenuAttribute}]`) !== null))
            return;

        this.answered = null;
        domEvent.preventDefault();
        domEvent.stopImmediatePropagation();
    }
}
