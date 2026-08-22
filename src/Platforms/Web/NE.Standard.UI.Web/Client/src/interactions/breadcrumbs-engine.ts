// The last step of a trail is the page you are on. CSS can paint that and take the click away, but not say
// it: `aria-current` is an attribute, and which step is last is only known once the collection has arrived.

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

        if (this.root instanceof Node) {
            // Steps arrive with the collection, not with the page, and a step can be hidden by its own
            // Visible — so both a new child and a changed class can move which step is last.
            const observer = new MutationObserver(() => this.applyAll());

            observer.observe(this.root, {
                childList: true,
                subtree: true,
                attributeFilter: ["class"]
            });
        }
    }

    private applyAll(): void {
        for (const root of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`))
            this.apply(root);
    }

    private apply(root: HTMLElement): void {
        const steps = [...root.querySelectorAll<HTMLElement>(`.${ItemClass}`)]
            .filter(item => item.closest(`.${RootClass}`) === root && !item.classList.contains(HiddenClass))
            .map(item => item.querySelector<HTMLElement>(`.${StepClass}`))
            .filter((step): step is HTMLElement => step !== null && !step.classList.contains(HiddenClass));

        const current = steps.length === 0 ? null : steps[steps.length - 1];

        for (const step of steps) {
            const own = step === current;

            step.classList.toggle(CurrentModifier, own);

            if (own) {
                step.setAttribute("aria-current", "page");
                // Out of the tab order as well as out of reach of the pointer, which the class does in CSS:
                // a link to the page you are already on is a keyboard stop that leads nowhere.
                step.setAttribute("tabindex", "-1");
            }
            else {
                step.removeAttribute("aria-current");
                step.removeAttribute("tabindex");
            }
        }
    }
}
