// What a tab strip does as the choice moves (Tabs and TabsView alike): the line slides over from the caption chosen before, the titles
// keep the width of their bold selves, so the chosen caption turning bold never moves its neighbours, and the page it shows fades in.

import { motion, prefersReducedMotion } from "../rendering/motion.ts";

/** On a caption's title: its own words, which the stylesheet lays out bold and unseen under it (`.ui-tab-caption-reserve()`). */
const CaptionTextAttribute = "data-ui-caption-text";

const TitleSelector = ".ui-text__title";

/** Copies each title's words onto it, where they changed, so the reserved width follows a title a binding rewrote. */
export function reserveCaptionWidth(caption: Element): void {
    for (const title of caption.querySelectorAll(TitleSelector)) {
        const text = title.textContent ?? "";

        if (title.getAttribute(CaptionTextAttribute) !== text)
            title.setAttribute(CaptionTextAttribute, text);
    }
}

/** Slides the line (the caption's `::after`) from where the previous caption's stood into its own place; nothing where either is gone. */
export function slideCaptionMark(previous: Element | null, current: Element | null): void {
    if (previous === null || current === null || previous === current || typeof current.animate !== "function" || prefersReducedMotion())
        return;

    const from = previous.getBoundingClientRect();
    const to = current.getBoundingClientRect();

    if (from.width === 0 || to.width === 0)
        return;

    // Scaled from the line's start (`transform-origin: left` on the mark), so it covers the old caption exactly as it sets out.
    current.animate([{ transform: `translateX(${from.left - to.left}px) scaleX(${from.width / to.width})` }, { transform: "none" }], { duration: motion.normal, easing: motion.ease, pseudoElement: "::after" });
}

/** Fades in the page a moved choice shows, rather than swapping it in at once; nothing on the first fit or under reduced motion. */
export function fadeInPage(page: Element | null): void {
    if (page === null || typeof page.animate !== "function" || prefersReducedMotion())
        return;

    page.animate([{ opacity: 0 }, { opacity: 1 }], { duration: motion.fast, easing: motion.enter });
}
