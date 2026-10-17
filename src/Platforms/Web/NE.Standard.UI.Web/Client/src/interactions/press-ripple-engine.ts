// A theme flag's answer to a press: a wave from the point the pointer went down, growing while the pointer is held until it covers
// the pressed thing to its farthest corner, and fading once the pointer lifts — at once on a cancel, as a touch turning into a scroll
// is one. Under a button, an action, a menu or list entry, and a row whose press does something. An icon-only face (an icon button,
// a rail's entry) also shrinks its icon while held, which the stylesheet draws off the held class.
// Cheap: one listener per phase on the root, one rect read at the press, and a wave of its own (press-wave.ts) whose circle's scale
// and whose opacity are all that animates — the two things the compositor runs alone, so a long task (a runtime's page applied)
// leaves the wave growing rather than stopped half-way, as a property drawn by the page's own frames was.
// A finger held for a context menu (long-press.ts) is answered here too, the one owner of the wave: the press's own wave, where it
// has one, is retimed to fill as the menu opens; elsewhere the menu's part grows one from the finger. Either settles as the menu opens
// and goes as a cancelled press's does when the hold is let go. Under reduced motion, or a theme without the ripple, the hold shows
// the wash alone: the wave drawn whole, unmoving.

import { ButtonClass, ComponentIdAttribute, MenuItemClass, NoRowSelectAttribute, PopupRoleSelector, RowEditingAttribute, SelectionAttribute, TreeRowClass, UnselectableAttribute } from "../addressing/dom-attributes.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { isInert, isItemDisabled, isItemRefused } from "./interactive-state.ts";
import { LongPressHoldEndEventName, LongPressHoldEventName } from "./long-press.ts";
import type { LongPressHoldDetail, LongPressHoldEndDetail } from "./long-press.ts";
import { ownControlOf } from "./own-control.ts";
import { PressInkClass, PressWaveClass } from "./press-wave.ts";
import { rowBox, SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";

// A press inside one of these is its own, ahead of the button around it: a tabs view's whole caption (its label a button only for its
// focus), and either part of a split button, washed alone as its hover is. A menu split button is one press, and the pill takes it.
const OwnPressSelector = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)";
const EntrySelector = `.${ButtonClass}, .ui-action, .${MenuItemClass}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${OwnPressSelector}`;
// An expander's header answers a press in its ink alone: the fold opening at once is the answer, and a wave across the band read as a
// button. It is an entry still, so it takes the press from a row around it (ui-expander.less).
const InkOnlySelector = ".ui-expander__header";
const KeyValueRowClass = "ui-key-value-action__row";
const RowSelector = `${SelectionRowSelector}, .${KeyValueRowClass}`;
const TargetSelector = `${EntrySelector}, ${RowSelector}`;

const PressingClass = "ui-pressing";
const HeldClass = "ui-press-held";
// On a held part not positioned of its own while its wave stands on it: any component may own a menu, so the stylesheet cannot list them.
const PlacedClass = "ui-press-placed";

export type PressRippleEngineOptions = {
    readonly root?: ParentNode;
    /** Whether a component raises a click of its own (a row's click command): such a row answers a press though it chooses nothing. */
    readonly clicks?: (component: Element) => boolean;
    /** Whether a press answers with the wave (the theme's `PressRipple`); without it a held finger's hold shows the wash alone. */
    readonly waves?: boolean;
};

type Press = {
    readonly element: HTMLElement;
    readonly wave: HTMLElement;
    // Null for the wash alone, which does not move.
    readonly grow: Animation | null;
    // A hold's own wave, not a press's: let go, it goes as a cancelled press's does.
    readonly hold: boolean;
    // When the circle reaches the frame at the rate it grows now, and that rate.
    fills: number;
    rate: number;
    fade: Animation | null;
};

/** Every element it touches answers only while pressed; off the theme's flag a press draws nothing, and only a held finger is answered. */
export class PressRippleEngine {
    private readonly clicks: (component: Element) => boolean;
    private readonly waves: boolean;
    // By pointer, so a second finger's press and release are its own; one press per element, a new one replacing it.
    private readonly presses = new Map<number, Press>();

    public constructor(options: PressRippleEngineOptions = {}) {
        const root = options.root ?? document;

        this.clicks = options.clicks ?? (() => false);
        this.waves = options.waves ?? true;

        root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent), true);
        root.addEventListener("pointerup", domEvent => this.release(domEvent, false), true);
        root.addEventListener("pointercancel", domEvent => this.release(domEvent, true), true);
        // A press that became a drag is no longer a press, and its wave goes at once rather than fading: the browser draws the dragged
        // row's picture as `dragstart` ends, and a fading wave was drawn into it as a blot behind the row's words.
        root.addEventListener("dragstart", () => this.finishAll(), true);
        root.addEventListener(LongPressHoldEventName, domEvent => this.handleHold(domEvent));
        root.addEventListener(LongPressHoldEndEventName, domEvent => this.handleHoldEnd(domEvent));
    }

    private handlePointerDown(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || domEvent.button !== 0 || !(domEvent.target instanceof Element))
            return;

        // The press this pointer left behind (its release went unheard, off the window) goes before a new one starts.
        this.end(domEvent.pointerId, true);

        // Nothing plays under reduced motion: the press keeps its wash, which is no movement.
        const element = this.pressedElement(domEvent.target);

        if (element === null || !this.moves(element))
            return;

        this.start(domEvent.pointerId, element, domEvent.clientX, domEvent.clientY, motion.ripple, false);
        element.classList.add(HeldClass);
    }

    /** Whether a wave may grow on the element: the theme's flag, and no reduced motion. */
    private moves(element: HTMLElement): boolean {
        return this.waves && typeof element.animate === "function" && !prefersReducedMotion();
    }

    /**
     * Puts a wave on the element round the pointer's point (`x`, `y`), growing over `duration`, or drawn whole for the wash alone
     * where `duration` is null; a wave another pointer left on it goes first.
     */
    private start(pointerId: number, element: HTMLElement, x: number, y: number, duration: number | null, hold: boolean): void {
        for (const [other, press] of this.presses) {
            if (press.element === element)
                this.finish(other, press);
        }

        const bounds = element.getBoundingClientRect();
        const left = x - bounds.left;
        const top = y - bounds.top;
        // To the farthest corner, so the circle reaches every corner of the frame and is never an ellipse.
        const radius = Math.hypot(Math.max(left, bounds.width - left), Math.max(top, bounds.height - top));

        // The wave stands in the padding box, inside the border the rect counts.
        const { wave, ink } = createWave(left - element.clientLeft, top - element.clientTop, radius);

        element.classList.add(PressingClass);
        // Last, after the element's own parts: a script reading its first child (a wrapped row's scope) reads what it did.
        element.append(wave);

        const grow = duration === null ? null : ink.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration, easing: motion.ease, fill: "forwards" });

        this.presses.set(pointerId, { element, wave, grow, hold, fills: performance.now() + (duration ?? 0), rate: 1, fade: null });
    }

    /**
     * A finger held for a context menu: a press's own wave is the hold's, filling as the menu opens; elsewhere the menu's part answers,
     * unless the press there answers in its ink alone. The wash alone, unmoving, where a wave may not grow and the press has no wash.
     */
    private handleHold(domEvent: Event): void {
        const detail = domEvent instanceof CustomEvent ? (domEvent.detail as LongPressHoldDetail | null) : null;
        const part = domEvent.target;

        if (detail === null || !(part instanceof HTMLElement) || isInert(part) || detail.target.closest(InkOnlySelector) !== null)
            return;

        // A wave of the pointer's that is already fading was an earlier press's.
        const press = this.presses.get(detail.pointerId);

        if (press !== undefined && press.fade === null) {
            this.retime(press, performance.now() + detail.duration);
            return;
        }

        const moves = this.moves(part);

        // The press's own wash says as much where no wave grows: a second one over it would read as a deeper press.
        if (!moves && this.pressedElement(detail.target) !== null)
            return;

        this.start(detail.pointerId, part, detail.clientX, detail.clientY, moves ? detail.duration : null, true);

        if (getComputedStyle(part).position === "static")
            part.classList.add(PlacedClass);
    }

    /** Sets the circle growing to reach the frame at `fills`; a wave already there stays. */
    private retime(press: Press, fills: number): void {
        const now = performance.now();
        const left = Math.max(0, press.fills - now) * press.rate;

        if (press.grow === null || left === 0 || fills <= now)
            return;

        press.rate = left / (fills - now);
        press.fills = fills;
        press.grow.updatePlaybackRate(press.rate);
    }

    /** The hold opened its menu, and its wave settles as a released press's; let go, a hold's own goes, a press's grows at its own pace again. */
    private handleHoldEnd(domEvent: Event): void {
        const detail = domEvent instanceof CustomEvent ? (domEvent.detail as LongPressHoldEndDetail | null) : null;
        const press = detail === null ? undefined : this.presses.get(detail.pointerId);

        if (detail === null || press === undefined || press.fade !== null)
            return;

        if (detail.opened || press.hold)
            this.end(detail.pointerId, !detail.opened);
        else
            this.retime(press, performance.now() + Math.max(0, press.fills - performance.now()) * press.rate);
    }

    /** The element a press lands on that answers it with the wave, or null: the nearest one, and only if it takes the press. */
    private pressedElement(target: Element): HTMLElement | null {
        // A tab's close and rename field are presses of their own, with no wave.
        if (target.closest(".ui-tab-item__close, .ui-tab-item__rename") !== null)
            return null;

        const element = target.closest<HTMLElement>(OwnPressSelector) ?? target.closest<HTMLElement>(TargetSelector);

        if (element === null || isInert(element) || element.matches(InkOnlySelector))
            return null;

        // A press in a popup the button holds inside it (a split button's list, the language switcher's) is the entry's, not the button's.
        const popup = target.closest(PopupRoleSelector);

        if (popup !== null && popup !== element && element.contains(popup))
            return null;

        return element.matches(EntrySelector) ? element : this.pressedRow(element, target);
    }

    /** A row whose press does something — chooses it, folds a tree's folder, raises the row's click — and not on a control of its own. */
    private pressedRow(row: HTMLElement, target: Element): HTMLElement | null {
        if (ownControlOf(target, row) !== null || isItemDisabled(row) || row.hasAttribute(RowEditingAttribute))
            return null;

        const root = row.closest(SelectionRootSelector);
        const chooses = root !== null && !row.classList.contains(KeyValueRowClass) && !root.hasAttribute(NoRowSelectAttribute)
            && (root.getAttribute(SelectionAttribute) === "one" || root.getAttribute(SelectionAttribute) === "many");
        const folds = row.classList.contains(TreeRowClass) && isItemRefused(row, UnselectableAttribute);

        if (!chooses && !folds && !this.raisesClick(row, target))
            return null;

        // A wrapped tile's row is display: contents and draws nothing; the tile it wraps takes the wave.
        return rowBox(row);
    }

    /** Whether a component between the press and the row, the row's own included, raises a click. */
    private raisesClick(row: Element, target: Element): boolean {
        for (let current: Element | null = target; current !== null; current = current.parentElement) {
            if (current.hasAttribute(ComponentIdAttribute) && this.clicks(current))
                return true;

            if (current === row)
                return false;
        }

        return false;
    }

    private release(domEvent: Event, cancelled: boolean): void {
        if (!(domEvent instanceof PointerEvent))
            return;

        // A hold's own wave is no press: lifted before the menu opened, it goes as a cancelled one.
        this.end(domEvent.pointerId, cancelled || this.presses.get(domEvent.pointerId)?.hold === true);
    }

    private finishAll(): void {
        for (const [pointerId, press] of [...this.presses])
            this.finish(pointerId, press);
    }

    /**
     * Lets a press go. Released, a wave still growing finishes quickly, so a quick click still shows one, then fades; cancelled, it fades
     * where it stands. The wash alone goes at once.
     */
    private end(pointerId: number, cancelled: boolean): void {
        const press = this.presses.get(pointerId);

        if (press === undefined || press.fade !== null)
            return;

        if (press.grow === null) {
            this.finish(pointerId, press);
            return;
        }

        press.element.classList.remove(HeldClass);

        const now = performance.now();
        const remaining = Math.max(0, press.fills - now);
        const delay = cancelled ? 0 : Math.min(remaining, motion.fast);

        if (delay > 0)
            this.retime(press, now + delay);

        press.fade = press.wave.animate([{ opacity: 1 }, { opacity: 0 }], { duration: motion.normal, delay, easing: motion.exit, fill: "forwards" });
        press.fade.addEventListener("finish", () => this.finish(pointerId, press));
    }

    /**
     * Takes a press's wave away whole: its animations, its element, its classes, and its entry, unless another press of the pointer
     * replaced it.
     */
    private finish(pointerId: number, press: Press): void {
        press.grow?.cancel();
        press.fade?.cancel();
        press.wave.remove();
        press.element.classList.remove(PressingClass, HeldClass, PlacedClass);

        if (this.presses.get(pointerId) === press)
            this.presses.delete(pointerId);
    }
}

/** The wave over the pressed thing's frame, its ink a circle of `radius` round the point (`x`, `y`) of the frame's padding box. */
function createWave(x: number, y: number, radius: number): { readonly wave: HTMLElement; readonly ink: HTMLElement } {
    const wave = document.createElement("span");
    const ink = document.createElement("span");

    wave.className = PressWaveClass;
    wave.setAttribute("aria-hidden", "true");
    ink.className = PressInkClass;
    ink.style.setProperty("left", `${x - radius}px`);
    ink.style.setProperty("top", `${y - radius}px`);
    ink.style.setProperty("width", `${radius * 2}px`);
    ink.style.setProperty("height", `${radius * 2}px`);
    wave.append(ink);

    return { wave, ink };
}
