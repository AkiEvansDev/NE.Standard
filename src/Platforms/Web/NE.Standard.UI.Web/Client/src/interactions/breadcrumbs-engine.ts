// Marks the last visible step of a breadcrumb trail as the current page.

import { observeComponents } from "./dom-mutations";
import { ownDescendants } from "./own-descendants";

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

        // Both a new child and a changed class can move which step is last.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: ["class"] }, trails => {
            for (const trail of trails)
                this.apply(trail);
        });
    }

    private applyAll(): void {
        for (const root of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`))
            this.apply(root);
    }

    private apply(root: HTMLElement): void {
        const steps = ownDescendants(root, `.${ItemClass}`, `.${RootClass}`)
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
