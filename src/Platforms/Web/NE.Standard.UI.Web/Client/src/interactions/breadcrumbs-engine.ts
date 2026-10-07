// Marks a trail's last step as the current page, and writes on each wrapper the tiers its step is collapsed in, so the stylesheet
// drops the separator before a collapsed tail with one `:has()` — a `:has()` inside a `:has()` is dropped whole by the browser.
// A step Visibility collapses keeps its place and mark (the step before it is still a page above); only `ui-hidden` takes one out.

import { VisibilityTierAttributes } from "../addressing/dom-attributes.ts";
import { responsiveTiers } from "../rendering/responsive-tier.ts";
import { observeComponents } from "./dom-mutations.ts";
import { ownDescendants } from "./own-descendants.ts";

const RootClass = "ui-breadcrumbs";
const ItemClass = "ui-breadcrumbs__item";
const StepClass = "ui-breadcrumb";
const CurrentModifier = "ui-breadcrumb--current";
const HiddenClass = "ui-hidden";
/** Client-only: on a step's wrapper, the tiers its step is collapsed in — `base`, `sm`, `md`, `xl`, `xxl`. */
const CollapsedTiersAttribute = "data-ui-step-collapsed";

export type BreadcrumbsEngineOptions = {
    readonly root?: ParentNode;
};

export class BreadcrumbsEngine {
    private readonly root: ParentNode;

    public constructor(options: BreadcrumbsEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll();

        // A new child, a changed class and a step's Visibility can each move which step is last or which one shows a mark.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: ["class", ...VisibilityTierAttributes] }, trails => {
            for (const trail of trails)
                this.apply(trail);
        });
    }

    private applyAll(): void {
        for (const root of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`))
            this.apply(root);
    }

    private apply(root: HTMLElement): void {
        const items = ownDescendants(root, `.${ItemClass}`, `.${RootClass}`);

        for (const item of items)
            markCollapsedTiers(item);

        const steps = items
            .filter(item => !item.classList.contains(HiddenClass))
            .map(item => item.querySelector<HTMLElement>(`.${StepClass}`))
            .filter((step): step is HTMLElement => step !== null && !step.classList.contains(HiddenClass));

        const current = steps.length === 0 ? null : steps[steps.length - 1];

        for (const step of steps) {
            const own = step === current;

            step.classList.toggle(CurrentModifier, own);

            if (own) {
                step.setAttribute("aria-current", "page");
                // Out of the tab order too: a link to the current page is a keyboard stop that leads nowhere.
                step.setAttribute("tabindex", "-1");
            }
            else {
                step.removeAttribute("aria-current");
                step.removeAttribute("tabindex");
            }
        }
    }
}

/** Writes the tiers a wrapper's step is collapsed in; written only when they change, since the engine watches the trail. */
function markCollapsedTiers(item: HTMLElement): void {
    const step = item.querySelector<HTMLElement>(`:scope > .${StepClass}`);
    const tiers = step === null ? "" : responsiveTiers.filter((_, index) => step.getAttribute(VisibilityTierAttributes[index]) === "collapsed").join(" ");

    if (tiers.length === 0)
        item.removeAttribute(CollapsedTiersAttribute);
    else if (item.getAttribute(CollapsedTiersAttribute) !== tiers)
        item.setAttribute(CollapsedTiersAttribute, tiers);
}
