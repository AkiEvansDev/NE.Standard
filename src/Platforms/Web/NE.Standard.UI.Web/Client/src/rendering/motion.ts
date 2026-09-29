// The stylesheet's motion for script animations: a Web Animation reads no stylesheet, and preferences.less cannot stop it.

/** The motion tokens of `core/tokens.less` — `@ui-motion-*` — which `MotionSyncTests` holds equal; durations in milliseconds. */
export const motion = {
    fast: 120,
    normal: 200,
    ripple: 250,
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    enter: "cubic-bezier(0, 0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)"
} as const;

/** Whether the reader asked the system for less motion; a script then puts things at their end at once, as the stylesheet does. */
export function prefersReducedMotion(): boolean {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Ends an element's running transitions at their end at once: a popup swapped for another leaves no fade behind the new one. */
export function finishTransitions(element: Element): void {
    if (typeof element.getAnimations !== "function")
        return;

    // Transitions alone: a running keyframe animation may have no end to finish at.
    for (const animation of element.getAnimations()) {
        if (typeof CSSTransition === "function" && animation instanceof CSSTransition)
            animation.finish();
    }
}
