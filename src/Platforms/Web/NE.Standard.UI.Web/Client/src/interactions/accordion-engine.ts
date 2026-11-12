// Keeps one section of an accordion open at a time; the sections stay ordinary <details>.

import { AccordionClass, HiddenClass, ItemsHostAttribute, ItemsViewAccordionClass, ItemsViewItemClass } from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";

const AccordionSelector = `.${AccordionClass}, .${ItemsViewAccordionClass}`;
const SectionSelector = "details";
const DirectSectionSelector = `:scope > ${SectionSelector}`;
const ItemsSectionSelector = `:scope > [${ItemsHostAttribute}] > .${ItemsViewItemClass} > ${SectionSelector}`;

export type AccordionEngineOptions = {
    readonly root?: ParentNode;
};

export class AccordionEngine {
    private readonly root: ParentNode;
    private readonly seenSections = new WeakSet<HTMLDetailsElement>();

    public constructor(options: AccordionEngineOptions = {}) {
        this.root = options.root ?? document;

        // On click rather than on the queued `toggle`, so both transitions start in the same frame.
        this.root.addEventListener("click", domEvent => this.handleSummaryClick(domEvent), true);

        // Still the toggle, for a section opened from anywhere else; capture, because it does not bubble.
        this.root.addEventListener("toggle", domEvent => this.handleToggle(domEvent), true);

        this.normalizeAll(this.root.querySelectorAll<HTMLElement>(AccordionSelector));

        observeComponents(this.root, AccordionSelector, { childList: true, attributeFilter: ["class", "hidden"], addedOnly: true }, accordions => this.normalizeAll(accordions));
    }

    /** Leaves the first newly added open section (or the existing open one) open and closes the rest. */
    private normalizeAll(accordions: Iterable<HTMLElement>): void {
        for (const accordion of accordions) {
            const addedOpen: HTMLDetailsElement[] = [];
            const existingOpen: HTMLDetailsElement[] = [];

            for (const section of this.sectionsOf(accordion)) {
                const isNew = !this.seenSections.has(section);
                this.seenSections.add(section);

                if (isSectionHidden(section)) {
                    if (section.open)
                        section.open = false;

                    continue;
                }

                if (!section.open)
                    continue;

                if (isNew)
                    addedOpen.push(section);
                else
                    existingOpen.push(section);
            }

            const kept = addedOpen[0] ?? existingOpen[0];

            if (kept === undefined)
                continue;

            for (const section of [...addedOpen, ...existingOpen]) {
                if (section !== kept)
                    section.open = false;
            }
        }
    }

    private handleSummaryClick(domEvent: Event): void {
        if (domEvent.defaultPrevented || !(domEvent.target instanceof Element))
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
        const accordion = this.accordionOf(section);

        if (accordion === null)
            return;

        for (const sibling of this.sectionsOf(accordion)) {
            if (sibling !== section && sibling.open)
                sibling.open = false;
        }
    }

    private accordionOf(section: HTMLDetailsElement): HTMLElement | null {
        const parent = section.parentElement;

        // Direct children only: a nested accordion must not close the outer one's sections.
        if (parent === null)
            return null;

        if (parent.classList.contains(AccordionClass))
            return parent;

        if (parent.classList.contains(ItemsViewItemClass) && parent.parentElement?.hasAttribute(ItemsHostAttribute) === true) {
            const view = parent.parentElement.parentElement;

            if (view !== null && view.classList.contains(ItemsViewAccordionClass))
                return view;
        }

        return null;
    }

    private sectionsOf(accordion: HTMLElement): HTMLDetailsElement[] {
        return [...accordion.querySelectorAll<HTMLDetailsElement>(accordion.classList.contains(AccordionClass) ? DirectSectionSelector : ItemsSectionSelector)];
    }
}

function isSectionHidden(section: HTMLDetailsElement): boolean {
    if (section.classList.contains(HiddenClass) || section.hasAttribute("hidden"))
        return true;

    const parent = section.parentElement;

    return parent !== null && parent.classList.contains(ItemsViewItemClass) && (parent.classList.contains(HiddenClass) || parent.hasAttribute("hidden"));
}
