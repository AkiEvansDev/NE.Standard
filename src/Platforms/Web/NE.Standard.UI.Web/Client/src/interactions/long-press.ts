// A finger held still on a part with a context menu stands for the right press. iOS Safari sends no `contextmenu` for it, so the press
// is timed here and a `contextmenu` raised for it; where the browser sends its own as well (Android), whichever comes first opens the
// menu and the other is spent, so the menu opens once. A long press is never also a click.

// `.ts` on the value import: `node --test` loads this module as it is.
import { ContextMenuAttribute } from "../addressing/dom-attributes.ts";

const LongPressDelay = 500;
/** How far the finger may drift, in pixels, and still be held still: past it the press is a scroll, a pan or a drag. */
const LongPressSlop = 10;

// The `contextmenu` events raised here, which the context menu engine reads as a finger's opening.
const raised = new WeakSet<Event>();

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
};

export type LongPressOptions = {
    readonly root: ParentNode;
    /** Where the click a long press's release may still raise is caught first, ahead of every engine listening on the root. */
    readonly first?: Pick<EventTarget, "addEventListener">;
    /** Whether a press there may open a menu at all: nothing is timed elsewhere. */
    readonly opensMenu: (target: Element) => boolean;
};

export class LongPress {
    private readonly opensMenu: (target: Element) => boolean;
    private press: Press | null = null;

    // What the press a menu opened for went down on, until the next press: its own `contextmenu` and its click are spent.
    private answered: Element | null = null;

    // Where the finger stood as the menu opened, and whether it has slid past the slop since: a slide to an entry chooses it.
    private openedAt: { readonly pointerId: number; readonly x: number; readonly y: number } | null = null;
    private slid = false;

    public constructor(options: LongPressOptions) {
        this.opensMenu = options.opensMenu;

        // Capturing, and registered before the context menu engine's own listener, so a spent `contextmenu` never reaches it.
        options.root.addEventListener("pointerdown", domEvent => this.handleDown(domEvent), true);
        options.root.addEventListener("pointermove", domEvent => this.handleMove(domEvent), true);
        options.root.addEventListener("pointerup", () => this.cancel(), true);
        options.root.addEventListener("pointercancel", () => this.cancel(), true);
        options.root.addEventListener("contextmenu", domEvent => this.handleContextMenu(domEvent), true);
        (options.first ?? options.root).addEventListener("click", domEvent => this.handleClick(domEvent), true);
    }

    private handleDown(domEvent: Event): void {
        const pointer = domEvent as Partial<PointerEvent>;

        this.answered = null;
        this.openedAt = null;
        this.slid = false;

        // A second finger is a pinch, not a held press.
        if (this.press !== null) {
            this.cancel();
            return;
        }

        if (pointer.pointerType !== "touch" || !(domEvent.target instanceof Element) || !this.opensMenu(domEvent.target))
            return;

        const target = domEvent.target;
        const x = pointer.clientX ?? 0;
        const y = pointer.clientY ?? 0;

        this.press = { pointerId: pointer.pointerId ?? 0, x, y, target, timer: setTimeout(() => this.fire(), LongPressDelay) };
    }

    private handleMove(domEvent: Event): void {
        const pointer = domEvent as Partial<PointerEvent>;
        const press = this.press;
        const opened = this.openedAt;

        if (opened !== null && pointer.pointerId === opened.pointerId && Math.hypot((pointer.clientX ?? opened.x) - opened.x, (pointer.clientY ?? opened.y) - opened.y) > LongPressSlop)
            this.slid = true;

        if (press === null || pointer.pointerId !== press.pointerId)
            return;

        if (Math.hypot((pointer.clientX ?? press.x) - press.x, (pointer.clientY ?? press.y) - press.y) > LongPressSlop)
            this.cancel();
    }

    private cancel(): void {
        if (this.press === null)
            return;

        clearTimeout(this.press.timer);
        this.press = null;
    }

    /** Held long enough: the menu is asked for where the finger went down, as a right press there asks for it. */
    private fire(): void {
        const press = this.press;

        this.press = null;

        if (press === null || !press.target.isConnected)
            return;

        const opening = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2, clientX: press.x, clientY: press.y });

        raised.add(opening);
        press.target.dispatchEvent(opening);

        // Spent only where a menu took it: with none, the browser's own menu, where it sends one, is the reader's as before.
        this.answered = opening.defaultPrevented ? press.target : null;
        this.openedAt = this.answered === null ? null : { pointerId: press.pointerId, x: press.x, y: press.y };
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

        this.cancel();
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
