// Marks a trail's last step as the current page, and writes on each wrapper the tiers its step is collapsed in and the tiers no shown
// step follows it in, which the stylesheet hides the wrapper and drops its separator by; the render writes both for the first paint.
// A step Visibility collapses keeps its place and mark (the step before it is still a page above); only `ui-hidden` takes one out.

import { StepCollapsedAttribute, StepEndAttribute, VisibilityTierAttributes } from "../addressing/dom-attributes.ts";
import { responsiveTiers } from "../rendering/responsive-tier.ts";
import { observeComponents } from "./dom-mutations.ts";
import { ownDescendants } from "./own-descendants.ts";

const RootClass = "ui-breadcrumbs";
const ItemClass = "ui-breadcrumbs__item";
const StepClass = "ui-breadcrumb";
const CurrentModifier = "ui-breadcrumb--current";
const HiddenClass = "ui-hidden";

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

        markSteps(items);

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

/**
 * Writes on each wrapper the tiers its step is collapsed in, and the tiers in which no step after it shows — neither taken out nor
 * collapsed there — walking the trail from its end.
 */
function markSteps(items: readonly HTMLElement[]): void {
    const shownAfter = responsiveTiers.map(() => false);

    for (let index = items.length - 1; index >= 0; index--) {
        const item = items[index];
        const collapsed = responsiveTiers.map((_, tier) => isCollapsedAt(item, tier));

        writeTiers(item, StepCollapsedAttribute, responsiveTiers.filter((_, tier) => collapsed[tier]));
        writeTiers(item, StepEndAttribute, responsiveTiers.filter((_, tier) => !shownAfter[tier]));

        if (item.classList.contains(HiddenClass))
            continue;

        for (let tier = 0; tier < responsiveTiers.length; tier++)
            shownAfter[tier] ||= !collapsed[tier];
    }
}

/** Whether the step in a wrapper is collapsed at a tier, read off whatever the wrapper holds — a step, or a template's own root. */
function isCollapsedAt(item: HTMLElement, tier: number): boolean {
    for (const child of item.children) {
        if (child.getAttribute(VisibilityTierAttributes[tier]) === "collapsed")
            return true;
    }

    return false;
}

/** Written only when they change, since the engine watches the trail. */
function writeTiers(item: HTMLElement, attribute: string, tiers: readonly string[]): void {
    const value = tiers.join(" ");

    if (value.length === 0)
        item.removeAttribute(attribute);
    else if (item.getAttribute(attribute) !== value)
        item.setAttribute(attribute, value);
}
