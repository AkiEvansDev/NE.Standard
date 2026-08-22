import { AnchoredPopupPlacement, placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";

const FlyoutClass = "ui-flyout";
const OpenClass = "ui-flyout--open";
const AnchorClass = "ui-flyout__anchor";
const ContentClass = "ui-flyout__content";
const OpenFlyoutSelector = `.${FlyoutClass}.${OpenClass}`;
const NoBackdropCloseAttribute = "data-ui-flyout-no-backdrop-close";
const NoEscapeCloseAttribute = "data-ui-flyout-no-escape-close";

const ContentGap = 4;

const PlacementClassPrefix = `${FlyoutClass}--`;
const DefaultPlacement: AnchoredPopupPlacement = "bottom-start";

const Placements = new Set<string>([
    "top-start", "top", "top-end",
    "bottom-start", "bottom", "bottom-end",
    "left-start", "left", "left-end",
    "right-start", "right", "right-end"
]);

export type FlyoutInteractionEngineOptions = {
    readonly root?: ParentNode;
};

export class FlyoutInteractionEngine {
    private readonly root: ParentNode;

    public constructor(options: FlyoutInteractionEngineOptions = {}) {
        this.root = options.root ?? document;

        for (const flyout of this.root.querySelectorAll<HTMLElement>(OpenFlyoutSelector))
            this.place(flyout);

        if (this.root instanceof Node) {
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type !== "attributes" || mutation.attributeName !== "class")
                        continue;

                    if (mutation.target instanceof HTMLElement && mutation.target.classList.contains(FlyoutClass))
                        this.place(mutation.target);
                }
            });

            observer.observe(this.root, { attributes: true, attributeFilter: ["class"], subtree: true });
        }

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        document.addEventListener("click", domEvent => this.handleOutsideClick(domEvent), true);
    }

    // The placement modifier class only carries FlyoutPlacement; a MutationObserver re-runs this when the
    // server patches it, so a live placement change re-places an already-open flyout.
    private place(flyout: HTMLElement): void {
        const content = flyout.querySelector<HTMLElement>(`:scope > .${ContentClass}`);
        const anchor = flyout.querySelector<HTMLElement>(`:scope > .${AnchorClass}`);

        if (content === null)
            return;

        if (!flyout.classList.contains(OpenClass)) {
            releaseAnchoredPopup(content);
            return;
        }

        placeAnchoredPopup(anchor ?? flyout, content, { placement: readPlacement(flyout), gap: ContentGap });
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const anchor = domEvent.target.closest<HTMLElement>(`.${AnchorClass}`);
        const flyout = anchor?.closest<HTMLElement>(`.${FlyoutClass}`) ?? null;

        if (flyout !== null)
            this.setOpen(flyout, !flyout.classList.contains(OpenClass));
    }

    // Several flyouts can be open at once, and their state lives in the DOM — a server IsOpen patch bypasses
    // this engine entirely — so the open set is re-read from the document rather than tracked in a field.
    // composedPath, not contains: see the same note in SelectInteractionEngine.
    private handleOutsideClick(domEvent: Event): void {
        const path = domEvent.composedPath();

        for (const flyout of this.root.querySelectorAll<HTMLElement>(OpenFlyoutSelector)) {
            if (path.includes(flyout) || flyout.hasAttribute(NoBackdropCloseAttribute))
                continue;

            this.setOpen(flyout, false);
        }
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Escape")
            return;

        for (const flyout of this.root.querySelectorAll<HTMLElement>(OpenFlyoutSelector)) {
            if (flyout.hasAttribute(NoEscapeCloseAttribute))
                continue;

            domEvent.preventDefault();
            this.setOpen(flyout, false);
        }
    }

    private setOpen(flyout: HTMLElement, open: boolean): void {
        if (flyout.classList.contains(OpenClass) === open)
            return;

        flyout.classList.toggle(OpenClass, open);
        this.place(flyout);
        flyout.dispatchEvent(new Event("toggle", { bubbles: true }));
        flyout.dispatchEvent(new Event(open ? "open" : "close", { bubbles: true }));
    }
}

function readPlacement(flyout: HTMLElement): AnchoredPopupPlacement {
    for (const className of flyout.classList) {
        if (!className.startsWith(PlacementClassPrefix))
            continue;

        const placement = className.slice(PlacementClassPrefix.length);

        if (Placements.has(placement))
            return placement as AnchoredPopupPlacement;
    }

    return DefaultPlacement;
}
