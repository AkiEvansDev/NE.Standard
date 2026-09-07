// Keeps one section of an accordion open at a time; the sections stay ordinary <details>.

import { observeComponents } from "./dom-mutations";

const RootClass = "ui-accordion";
const SectionSelector = "details";

export type AccordionEngineOptions = {
    readonly root?: ParentNode;
};

export class AccordionEngine {
    private readonly root: ParentNode;

    public constructor(options: AccordionEngineOptions = {}) {
        this.root = options.root ?? document;

        // On click rather than on the queued `toggle`, so both transitions start in the same frame.
        this.root.addEventListener("click", domEvent => this.handleSummaryClick(domEvent), true);

        // Still the toggle, for a section opened from anywhere else; capture, because it does not bubble.
        this.root.addEventListener("toggle", domEvent => this.handleToggle(domEvent), true);

        this.normalizeAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        observeComponents(this.root, `.${RootClass}`, { childList: true }, accordions => this.normalizeAll(accordions));
    }

    /** Leaves the first open section open and closes the rest. */
    private normalizeAll(accordions: Iterable<HTMLElement>): void {
        for (const accordion of accordions) {
            let seen = false;

            for (const section of this.sectionsOf(accordion)) {
                if (!section.open)
                    continue;

                if (seen)
                    section.open = false;
                else
                    seen = true;
            }
        }
    }

    private handleSummaryClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const summary = domEvent.target.closest("summary");
        const section = summary?.parentElement;

        // Only a section that is about to open: clicking the open one just closes it.
        if (!(section instanceof HTMLDetailsElement) || section.open)
            return;

        this.closeSiblings(section);
    }

    private handleToggle(domEvent: Event): void {
        const section = domEvent.target;

        if (!(section instanceof HTMLDetailsElement) || !section.open)
            return;

        this.closeSiblings(section);
    }

    private closeSiblings(section: HTMLDetailsElement): void {
        const accordion = section.parentElement;

        // Direct children only: a nested accordion must not close the outer one's sections.
        if (accordion === null || !accordion.classList.contains(RootClass))
            return;

        for (const sibling of this.sectionsOf(accordion)) {
            if (sibling !== section && sibling.open)
                sibling.open = false;
        }
    }

    private sectionsOf(accordion: HTMLElement): HTMLDetailsElement[] {
        return [...accordion.querySelectorAll<HTMLDetailsElement>(`:scope > ${SectionSelector}`)];
    }
}
