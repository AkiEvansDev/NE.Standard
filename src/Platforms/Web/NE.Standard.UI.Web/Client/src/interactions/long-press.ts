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
    }

    /** The browser's own `contextmenu` for a press the timer answered is spent; one that comes first answers the press itself. */
    private handleContextMenu(domEvent: Event): void {
        if (raised.has(domEvent))
            return;

        if (this.answered !== null) {
            domEvent.preventDefault();
            domEvent.stopImmediatePropagation();
            return;
        }

        this.cancel();
    }

    /** The click a long press's release may raise is not a press of what was under the finger; the menu's own entries are not it. */
    private handleClick(domEvent: Event): void {
        const pressed = this.answered;
        const target = domEvent.target instanceof Element ? domEvent.target : null;

        if (pressed === null || target === null || !pressed.contains(target) || target.closest(`[${ContextMenuAttribute}]`) !== null)
            return;

        this.answered = null;
        domEvent.preventDefault();
        domEvent.stopImmediatePropagation();
    }
}
