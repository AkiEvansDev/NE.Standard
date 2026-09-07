import { ensureElementId } from "../addressing/dom-attributes";
import { AnchoredPopupPlacement, isAnchoredPopupPlacement, placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { observeComponents } from "./dom-mutations";
import { PopupDismissal } from "./popup-dismissal";
import { FocusableSelector, moveFocusInto, restoreFocusTo } from "./popup-focus";

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

export type FlyoutInteractionEngineOptions = {
    readonly root?: ParentNode;
};

export class FlyoutInteractionEngine {
    private readonly root: ParentNode;

    /** Where focus was when each flyout opened, so closing it puts the viewer back where they were. */
    private readonly returnFocus = new WeakMap<HTMLElement, HTMLElement>();

    public constructor(options: FlyoutInteractionEngineOptions = {}) {
        this.root = options.root ?? document;

        // Every flyout, not only the open ones: a closed one still has to say `aria-expanded="false"`.
        for (const flyout of this.root.querySelectorAll<HTMLElement>(`.${FlyoutClass}`))
            this.place(flyout);

        // Both the placement modifier and a server IsOpen patch are class changes, so re-placing keeps both live.
        observeComponents(this.root, `.${FlyoutClass}`, { attributeFilter: ["class"] }, flyouts => {
            for (const flyout of flyouts)
                this.place(flyout);
        });

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("focusout", domEvent => this.handleFocusOut(domEvent), true);

        // The open set is re-read from the document rather than tracked: a server IsOpen patch bypasses this engine.
        new PopupDismissal({
            root: this.root,
            openPopups: () => this.root.querySelectorAll<HTMLElement>(OpenFlyoutSelector),
            canDismiss: (flyout, reason) => !flyout.hasAttribute(reason === "escape" ? NoEscapeCloseAttribute : NoBackdropCloseAttribute),
            close: flyout => this.setOpen(flyout, false)
        });
    }

    private place(flyout: HTMLElement): void {
        const content = flyout.querySelector<HTMLElement>(`:scope > .${ContentClass}`);
        const anchor = flyout.querySelector<HTMLElement>(`:scope > .${AnchorClass}`);

        if (content === null)
            return;

        const open = flyout.classList.contains(OpenClass);

        this.describeAnchor(anchor, content, open);

        if (!open) {
            releaseAnchoredPopup(content);
            restoreFocusTo(this.returnFocus.get(flyout), flyout);
            this.returnFocus.delete(flyout);
            return;
        }

        placeAnchoredPopup(resolveAnchorBox(anchor) ?? flyout, content, { placement: readPlacement(flyout), gap: ContentGap });

        // Not a focus trap: a popover lets Tab leave, and `handleFocusOut` closes it behind the viewer.
        const previous = moveFocusInto(content);

        if (previous !== null)
            this.returnFocus.set(flyout, previous);
    }

    /** Writes what the flyout is and whether it is open onto the focusable control inside the anchor. */
    private describeAnchor(anchor: HTMLElement | null, content: HTMLElement, open: boolean): void {
        if (anchor === null)
            return;

        const target = anchor.querySelector<HTMLElement>(FocusableSelector) ?? anchor;

        target.setAttribute("aria-haspopup", "dialog");
        target.setAttribute("aria-expanded", open ? "true" : "false");
        target.setAttribute("aria-controls", ensureElementId(content, "ui-flyout-content"));
    }

    private handleFocusOut(domEvent: Event): void {
        if (!(domEvent instanceof FocusEvent))
            return;

        const flyout = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(OpenFlyoutSelector) : null;

        if (flyout === null || flyout.hasAttribute(NoBackdropCloseAttribute))
            return;

        // Null when focus leaves the document altogether: switching windows is not leaving the flyout.
        const next = domEvent.relatedTarget;

        if (next === null || (next instanceof Node && flyout.contains(next)))
            return;

        this.setOpen(flyout, false);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const anchor = domEvent.target.closest<HTMLElement>(`.${AnchorClass}`);
        const flyout = anchor?.closest<HTMLElement>(`.${FlyoutClass}`) ?? null;

        if (flyout !== null)
            this.setOpen(flyout, !flyout.classList.contains(OpenClass));
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

/** The component put in the anchor slot, not the slot itself: the slot is a grid cell as wide as its column. */
function resolveAnchorBox(anchor: HTMLElement | null): HTMLElement | null {
    if (anchor === null)
        return null;

    const content = anchor.firstElementChild;

    return content instanceof HTMLElement ? content : anchor;
}

function readPlacement(flyout: HTMLElement): AnchoredPopupPlacement {
    for (const className of flyout.classList) {
        if (!className.startsWith(PlacementClassPrefix))
            continue;

        const placement = className.slice(PlacementClassPrefix.length);

        if (isAnchoredPopupPlacement(placement))
            return placement;
    }

    return DefaultPlacement;
}
