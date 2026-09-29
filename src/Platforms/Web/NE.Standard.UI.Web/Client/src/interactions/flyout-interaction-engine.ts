import { ensureElementId, FlyoutContentClass } from "../addressing/dom-attributes";
import { AnchoredPopupPlacement, isAnchoredPopupPlacement } from "./anchored-popup";
import { observeComponents } from "./dom-mutations";
import { OwnedPopups } from "./owned-popup";
import { FocusableSelector } from "./popup-focus";

const FlyoutClass = "ui-flyout";
const OpenClass = "ui-flyout--open";
const AnchorClass = "ui-flyout__anchor";
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

    // Several at once: a flyout may open inside another. `close` is raised only for the client's own take-down, not a server patch's.
    private readonly flyouts = new OwnedPopups({
        show: ({ owner }) => owner.classList.add(OpenClass),
        hide: ({ owner }, reason) => this.markClosed(owner, reason !== "owner"),
        single: false,
        closesWhenReadOnly: false,
        canDismiss: ({ owner }, reason) => !owner.hasAttribute(reason === "escape" ? NoEscapeCloseAttribute : NoBackdropCloseAttribute)
    });

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
    }

    /** Follows the flyout's open class, whoever set it: an open one placed, its focus taken in once as it opens; a closed one taken down. */
    private place(flyout: HTMLElement): void {
        const content = flyout.querySelector<HTMLElement>(`:scope > .${FlyoutContentClass}`);
        const anchor = flyout.querySelector<HTMLElement>(`:scope > .${AnchorClass}`);

        if (content === null)
            return;

        const opener = describeAnchor(anchor, content);

        if (!flyout.classList.contains(OpenClass)) {
            this.flyouts.close(flyout);
            opener?.setAttribute("aria-expanded", "false");
            return;
        }

        // Not a focus trap: Tab may leave, closing it unless `canDismiss` keeps it; one that may not stay open is taken down again.
        const open = this.flyouts.open({
            owner: flyout,
            popup: content,
            anchor: resolveAnchorBox(anchor) ?? flyout,
            placement: { placement: readPlacement(flyout), gap: ContentGap },
            openers: opener === null ? [] : [opener],
            focus: true
        });

        if (!open)
            this.markClosed(flyout);
    }

    /** Takes the open class off a flyout the client closes, and says so the way a toggle does; `close` only where it can run. */
    private markClosed(flyout: HTMLElement, raisesClose = true): void {
        if (!flyout.classList.contains(OpenClass))
            return;

        flyout.classList.remove(OpenClass);
        announce(flyout, false, raisesClose);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const anchor = domEvent.target.closest<HTMLElement>(`.${AnchorClass}`);
        const flyout = anchor?.closest<HTMLElement>(`.${FlyoutClass}`) ?? null;

        if (flyout === null)
            return;

        if (this.flyouts.isOpen(flyout)) {
            this.flyouts.close(flyout);
            return;
        }

        flyout.classList.add(OpenClass);
        this.place(flyout);

        if (this.flyouts.isOpen(flyout))
            announce(flyout, true);
    }
}

/** Writes what the flyout is onto the focusable control inside the anchor, and answers with that control. */
function describeAnchor(anchor: HTMLElement | null, content: HTMLElement): HTMLElement | null {
    if (anchor === null)
        return null;

    const target = anchor.querySelector<HTMLElement>(FocusableSelector) ?? anchor;

    target.setAttribute("aria-haspopup", "dialog");
    target.setAttribute("aria-controls", ensureElementId(content, "ui-flyout-content"));

    return target;
}

/** Raises a flyout's `toggle` for its two-way IsOpen, and its `open`/`close` for the application's handlers where asked. */
function announce(flyout: HTMLElement, open: boolean, raisesCommand = true): void {
    flyout.dispatchEvent(new Event("toggle", { bubbles: true }));

    // Not when its owner turned disabled or loading: the `close` a disabled component raised would be refused.
    if (raisesCommand)
        flyout.dispatchEvent(new Event(open ? "open" : "close", { bubbles: true }));
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
