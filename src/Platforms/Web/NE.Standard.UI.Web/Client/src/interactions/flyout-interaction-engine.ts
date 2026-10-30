// `node --test` loads this module as it is: `.ts` on the value imports, `import type` on the rest.
import { ensureElementId, FlyoutAnchorClass, FlyoutClass, FlyoutContentClass, FlyoutContentIdPrefix, FlyoutNoBackdropCloseAttribute, FlyoutNoEscapeCloseAttribute, FlyoutOpenClass } from "../addressing/dom-attributes.ts";
import type { AnchoredPopupPlacement } from "./anchored-popup.ts";
import { isAnchoredPopupPlacement } from "./anchored-popup.ts";
import { observeComponents } from "./dom-mutations.ts";
import { addedAmong, isInSight, observeLine, SightAttributes } from "./element-visibility.ts";
import { isInert } from "./interactive-state.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { FocusableSelector, isPointerLast } from "./popup-focus.ts";
import { onTierChange } from "../rendering/responsive-tier.ts";

const PlacementClassPrefix = `${FlyoutClass}--`;
// What a waiting flyout's line is watched for.
const SightFilter: string[] = [...SightAttributes];
const DefaultPlacement: AnchoredPopupPlacement = "bottom-start";

export type FlyoutInteractionEngineOptions = {
    readonly root?: ParentNode;
};

export class FlyoutInteractionEngine {
    private readonly root: ParentNode;

    // The open flyouts whose owner is only out of sight — a tab's page not shown, a closed dialog, a fold, a tier's Visibility: open
    // still, to their IsOpen and the server, each placed once it is in sight again. Watched only while one waits.
    private readonly waiting = new Set<HTMLElement>();
    private sightWatch: MutationObserver | null = null;
    private tiersWatched = false;

    // Several at once: a flyout may open inside another. `close` is raised only for a person's dismissal — the anchor pressed, a press
    // outside, Escape, the keyboard leaving — never for the page taking it down, nor a server patch.
    private readonly flyouts = new OwnedPopups({
        show: ({ owner }) => owner.classList.add(FlyoutOpenClass),
        // Taken down for its owner (gone, refusing, its anchor scrolled out of sight): one only out of sight stays open, waiting; the rest
        // tell their two-way IsOpen alone.
        hide: ({ owner }, reason) => {
            if (reason === "owner" && isOnlyOutOfSight(owner))
                this.wait(owner);
            else
                this.markClosed(owner, reason !== "owner");
        },
        single: false,
        closesWhenReadOnly: false,
        canDismiss: ({ owner }, reason) => !owner.hasAttribute(reason === "escape" ? FlyoutNoEscapeCloseAttribute : FlyoutNoBackdropCloseAttribute)
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

    /**
     * Follows the flyout's open class, whoever set it: an open one placed, its focus taken in once as it opens — not one placed again as
     * it comes back in sight, which the reader did not open now; a closed one taken down.
     */
    private place(flyout: HTMLElement): void {
        const content = flyout.querySelector<HTMLElement>(`:scope > .${FlyoutContentClass}`);
        const anchor = flyout.querySelector<HTMLElement>(`:scope > .${FlyoutAnchorClass}`);

        if (content === null)
            return;

        const opener = describeAnchor(anchor, content);

        if (!flyout.classList.contains(FlyoutOpenClass)) {
            this.waiting.delete(flyout);
            this.flyouts.close(flyout);
            opener?.setAttribute("aria-expanded", "false");
            return;
        }

        // Not a focus trap: Tab may leave, closing it unless `canDismiss` keeps it; one that may not stay open is taken down again.
        const open = this.flyouts.open({
            owner: flyout,
            popup: content,
            anchor: resolveAnchorBox(anchor) ?? flyout,
            placement: { placement: readPlacement(flyout) },
            openers: opener === null ? [] : [opener],
            namedBy: opener,
            // A press gives it to the panel itself, as the side drawer does: its first field focused at once lit its edge and raised a
            // phone's on-screen keyboard unasked. A key gives it to the first control.
            focus: !this.waiting.has(flyout) && (isPointerLast() ? content : true)
        });

        if (open)
            this.waiting.delete(flyout);
        else if (isOnlyOutOfSight(flyout))
            this.wait(flyout);
        else
            this.markClosed(flyout, false);
    }

    /** Keeps an open flyout whose owner is only out of sight open, to be placed once it is in sight again. */
    private wait(flyout: HTMLElement): void {
        this.waiting.add(flyout);

        if (!this.tiersWatched) {
            this.tiersWatched = true;
            // A tier's Visibility shows a flyout again with no change in the tree.
            onTierChange(() => this.placeWaiting());
        }

        if (typeof MutationObserver !== "function")
            return;

        if (this.sightWatch === null) {
            this.sightWatch = new MutationObserver(records => this.placeWaiting(records));
            this.sightWatch.observe(document, { subtree: true, childList: true });
        }

        observeLine(this.sightWatch, flyout, SightFilter);
    }

    /**
     * Places every waiting flyout back in sight, the keyboard left where it is; one closed or gone meanwhile waits no more. After a
     * change of the tree alone, only a flyout it moved can have come in sight, its new line watched from then.
     */
    private placeWaiting(records?: readonly MutationRecord[]): void {
        const moved = records === undefined || records.some(record => record.type === "attributes") ? null : addedAmong(records, [...this.waiting]);

        for (const flyout of [...this.waiting]) {
            if (!flyout.isConnected || !flyout.classList.contains(FlyoutOpenClass)) {
                this.waiting.delete(flyout);
                continue;
            }

            if (moved?.has(flyout) === true && this.sightWatch !== null)
                observeLine(this.sightWatch, flyout, SightFilter);

            if ((moved === null || moved.has(flyout)) && isInSight(flyout))
                this.place(flyout);
        }

        if (this.waiting.size === 0) {
            this.sightWatch?.disconnect();
            this.sightWatch = null;
        }
    }

    /** Takes the open class off a flyout the client closes, and says so the way a toggle does; `close` only for a person's dismissal. */
    private markClosed(flyout: HTMLElement, raisesClose = true): void {
        if (!flyout.classList.contains(FlyoutOpenClass))
            return;

        flyout.classList.remove(FlyoutOpenClass);
        announce(flyout, false, raisesClose);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const anchor = domEvent.target.closest<HTMLElement>(`.${FlyoutAnchorClass}`);
        const flyout = anchor?.closest<HTMLElement>(`.${FlyoutClass}`) ?? null;

        if (flyout === null)
            return;

        if (this.flyouts.isOpen(flyout)) {
            this.flyouts.close(flyout);
            return;
        }

        flyout.classList.add(FlyoutOpenClass);
        this.place(flyout);

        if (this.flyouts.isOpen(flyout))
            announce(flyout, true);
    }
}

/** Whether a flyout is only out of sight — on the page and answering the reader, but drawn by nothing — rather than gone or refusing. */
function isOnlyOutOfSight(flyout: HTMLElement): boolean {
    return flyout.isConnected && !isInert(flyout) && !isInSight(flyout);
}

/** Writes what the flyout is onto the focusable control inside the anchor, and answers with that control. */
function describeAnchor(anchor: HTMLElement | null, content: HTMLElement): HTMLElement | null {
    if (anchor === null)
        return null;

    const target = anchor.querySelector<HTMLElement>(FocusableSelector) ?? anchor;

    target.setAttribute("aria-haspopup", "dialog");
    target.setAttribute("aria-controls", ensureElementId(content, FlyoutContentIdPrefix));

    return target;
}

/** Raises a flyout's `toggle` for its two-way IsOpen, and its `open`/`close` for the application's handlers where asked. */
function announce(flyout: HTMLElement, open: boolean, raisesCommand = true): void {
    flyout.dispatchEvent(new Event("toggle", { bubbles: true }));

    // Only for a person's dismissal: the page taking the flyout down (its owner gone, refusing, scrolled away) is no close of theirs.
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
