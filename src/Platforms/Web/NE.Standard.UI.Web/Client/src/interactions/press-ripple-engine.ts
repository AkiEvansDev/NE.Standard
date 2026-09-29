// A theme flag's flourish: a small ripple from the point the pointer pressed, under a button, an action, or a menu item.
// On unless the theme turns it off, and cheap — one listener, two variables and a class.

import { ButtonClass, MarkedMenuEntrySelector, MenuItemClass, PopupRoleSelector } from "../addressing/dom-attributes";
import { motion, prefersReducedMotion } from "../rendering/motion";
import { isInert } from "./interactive-state";

const TargetSelector = `.${ButtonClass}, .ui-action, .${MenuItemClass}`;
// An entry whose ::after is already its mark (a chevron, a tick) would lose it to the ripple and jump in width.
const MarkedSelector = MarkedMenuEntrySelector;
const PressingClass = "ui-pressing";
const XVariable = "--ui-press-x";
const YVariable = "--ui-press-y";

export type PressRippleEngineOptions = {
    readonly root?: ParentNode;
};

/** Started only where the page's theme carries the flag; every element it touches otherwise never sees it. */
export class PressRippleEngine {
    private readonly root: ParentNode;

    public constructor(options: PressRippleEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent), true);
    }

    private handlePointerDown(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || domEvent.button !== 0 || !(domEvent.target instanceof Element))
            return;

        const target = domEvent.target.closest<HTMLElement>(TargetSelector);

        // Nothing plays under reduced motion, and the clip the ripple needs would still cut an overhang for its length.
        if (target === null || isInert(target) || target.matches(MarkedSelector) || prefersReducedMotion())
            return;

        // A press in a popup the button holds inside it (a split button's list, the language switcher's) is the entry's, not the button's.
        const popup = domEvent.target.closest(PopupRoleSelector);

        if (popup !== null && popup !== target && target.contains(popup))
            return;

        const bounds = target.getBoundingClientRect();

        target.style.setProperty(XVariable, `${domEvent.clientX - bounds.left}px`);
        target.style.setProperty(YVariable, `${domEvent.clientY - bounds.top}px`);

        // A second press before the first ripple finished restarts the animation: the class comes off and back on the next frame.
        target.classList.remove(PressingClass);
        void target.offsetWidth;
        target.classList.add(PressingClass);

        window.setTimeout(() => target.classList.remove(PressingClass), motion.ripple);
    }
}
