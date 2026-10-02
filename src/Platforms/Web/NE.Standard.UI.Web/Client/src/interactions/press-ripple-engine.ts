// A theme flag's answer to a press: a wave from the point the pointer went down, growing while the pointer is held until it covers
// the pressed thing to its farthest corner, and fading once the pointer lifts — at once on a cancel, as a touch turning into a scroll
// is one. Under a button, an action, a menu or list entry, and a row whose press does something. An icon-only face (an icon button,
// a rail's entry) also shrinks its icon while held, which the stylesheet draws off the held class.
// Cheap: one listener per phase on the root, one rect read at the press, and two registered properties animated on the element.

import { ButtonClass, ComponentIdAttribute, MenuItemClass, NoRowSelectAttribute, PopupRoleSelector, RowEditingAttribute, SelectionAttribute, TreeRowClass, UnselectableAttribute } from "../addressing/dom-attributes.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { isInert, isItemDisabled } from "./interactive-state.ts";
import { ownControlOf } from "./own-control.ts";
import { rowBox, SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";

const EntrySelector = `.${ButtonClass}, .ui-action, .${MenuItemClass}, .ui-select__option, .ui-language-switcher__choice`;
const KeyValueRowClass = "ui-key-value-action__row";
const RowSelector = `${SelectionRowSelector}, .${KeyValueRowClass}`;
const TargetSelector = `${EntrySelector}, ${RowSelector}`;

const PressingClass = "ui-pressing";
const HeldClass = "ui-press-held";
const XVariable = "--ui-press-x";
const YVariable = "--ui-press-y";
// Registered in styles/mixins/ripple.less, so they animate as a length and a number, and not inherited: a frame restyles one element.
const RadiusVariable = "--ui-ripple-radius";
const OpacityVariable = "--ui-ripple-opacity";

export type PressRippleEngineOptions = {
    readonly root?: ParentNode;
    /** Whether a component raises a click of its own (a row's click command): such a row answers a press though it chooses nothing. */
    readonly clicks?: (component: Element) => boolean;
};

type Press = {
    readonly element: HTMLElement;
    readonly started: number;
    readonly grow: Animation;
    fade: Animation | null;
};

/** Started only where the page's theme carries the flag; every element it touches otherwise never sees it. */
export class PressRippleEngine {
    private readonly clicks: (component: Element) => boolean;
    // By pointer, so a second finger's press and release are its own; one press per element, a new one replacing it.
    private readonly presses = new Map<number, Press>();

    public constructor(options: PressRippleEngineOptions = {}) {
        const root = options.root ?? document;

        this.clicks = options.clicks ?? (() => false);

        root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent), true);
        root.addEventListener("pointerup", domEvent => this.release(domEvent, false), true);
        root.addEventListener("pointercancel", domEvent => this.release(domEvent, true), true);
        // A press that became a drag is no longer a press; a mouse's drag raises no cancel.
        root.addEventListener("dragstart", () => this.cancelAll(), true);
    }

    private handlePointerDown(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || domEvent.button !== 0 || !(domEvent.target instanceof Element))
            return;

        // The press this pointer left behind (its release went unheard, off the window) goes before a new one starts.
        this.end(domEvent.pointerId, true);

        // Nothing plays under reduced motion: the press keeps its wash, which is no movement.
        const element = this.pressedElement(domEvent.target);

        if (element === null || typeof element.animate !== "function" || prefersReducedMotion())
            return;

        for (const [pointerId, press] of this.presses) {
            if (press.element === element)
                this.finish(pointerId, press);
        }

        const bounds = element.getBoundingClientRect();
        const x = domEvent.clientX - bounds.left;
        const y = domEvent.clientY - bounds.top;
        // To the farthest corner, so the circle reaches every corner of the frame and is never an ellipse.
        const radius = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y));

        element.style.setProperty(XVariable, `${x}px`);
        element.style.setProperty(YVariable, `${y}px`);
        element.classList.add(PressingClass, HeldClass);

        const grow = element.animate([{ [RadiusVariable]: "0px" }, { [RadiusVariable]: `${radius}px` }], { duration: motion.ripple, easing: motion.ease, fill: "forwards" });

        this.presses.set(domEvent.pointerId, { element, started: performance.now(), grow, fade: null });
    }

    /** The element a press lands on that answers it with the wave, or null: the nearest one, and only if it takes the press. */
    private pressedElement(target: Element): HTMLElement | null {
        const element = target.closest<HTMLElement>(TargetSelector);

        if (element === null || isInert(element))
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
        const folds = row.classList.contains(TreeRowClass) && row.hasAttribute(UnselectableAttribute);

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
        if (domEvent instanceof PointerEvent)
            this.end(domEvent.pointerId, cancelled);
    }

    private cancelAll(): void {
        for (const pointerId of [...this.presses.keys()])
            this.end(pointerId, true);
    }

    /**
     * Lets a press go. Released, a wave still growing finishes quickly, so a quick click still shows one, then fades; cancelled, it fades
     * where it stands.
     */
    private end(pointerId: number, cancelled: boolean): void {
        const press = this.presses.get(pointerId);

        if (press === undefined || press.fade !== null)
            return;

        press.element.classList.remove(HeldClass);

        const remaining = Math.max(0, motion.ripple - (performance.now() - press.started));
        let delay = 0;

        if (!cancelled && remaining > 0) {
            delay = Math.min(remaining, motion.fast);
            press.grow.updatePlaybackRate(remaining / delay);
        }

        press.fade = press.element.animate([{ [OpacityVariable]: 1 }, { [OpacityVariable]: 0 }], { duration: motion.normal, delay, easing: motion.exit, fill: "forwards" });
        press.fade.addEventListener("finish", () => this.finish(pointerId, press));
    }

    /** Takes a press's wave away whole: its animations, its class, and its entry, unless another press of the pointer replaced it. */
    private finish(pointerId: number, press: Press): void {
        press.grow.cancel();
        press.fade?.cancel();
        press.element.classList.remove(PressingClass, HeldClass);

        if (this.presses.get(pointerId) === press)
            this.presses.delete(pointerId);
    }
}
