// A theme flag's flourish: a small ripple from the point the pointer pressed, under a button, an action, or a menu item.
// Opt-in and cheap — one listener, two variables and a class — so it costs nothing where it is off.

import { MarkedMenuEntrySelector } from "../addressing/dom-attributes";

const TargetSelector = ".ui-button, .ui-action, .ui-menu-item";
// A menu entry whose ::after is already its mark (a group's chevron, a check's tick) would have the ripple take that mark's
// place, narrowing then widening the menu; those entries do not ripple.
const MarkedSelector = MarkedMenuEntrySelector;
const PressingClass = "ui-pressing";
const XVariable = "--ui-press-x";
const YVariable = "--ui-press-y";

// Matches the Less animation's length: long enough to read as a flash, short enough not to outlast a quick click.
const RippleDurationMs = 250;

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

        if (target === null || target.matches(":disabled, .ui-disabled, [inert]") || target.matches(MarkedSelector))
            return;

        const bounds = target.getBoundingClientRect();

        target.style.setProperty(XVariable, `${domEvent.clientX - bounds.left}px`);
        target.style.setProperty(YVariable, `${domEvent.clientY - bounds.top}px`);

        // A second press before the first ripple finished restarts the animation: the class comes off and back on the next frame.
        target.classList.remove(PressingClass);
        void target.offsetWidth;
        target.classList.add(PressingClass);

        window.setTimeout(() => target.classList.remove(PressingClass), RippleDurationMs);
    }
}
