// A popup a component owns — a select's list, a picker, a flyout, a context menu, a package's popup — opened and closed one way. It
// closes when dismissed, when the keyboard leaves it, and when its owner leaves the page or turns disabled, loading or (an input's)
// read-only, so an open list never takes a choice its field no longer accepts. Anything more an engine does is its own `show`/`hide`.

// `node --test` loads this module as it is: `.ts` on the value imports, `import type` on the rest.
import type { AnchoredPopupOptions } from "./anchored-popup.ts";
import type { PopupDismissReason } from "./popup-dismissal.ts";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup.ts";
import { isFocusable, isInert, isReadOnly } from "./interactive-state.ts";
import { isBehindModal } from "./open-dialogs.ts";
import { PopupDismissal } from "./popup-dismissal.ts";
import { PointerFocusAttribute } from "../addressing/dom-attributes.ts";
import { focusableUntilLeft, focusAsLastInput, focusHolderAround, isPointerLast, moveFocusInto, restoreFocusTo } from "./popup-focus.ts";

/** One popup being opened: whose it is, what it is, and how it stands. */
export type OwnedPopupOpening = {
    /** The component the popup belongs to; its state decides whether the popup may stay. */
    readonly owner: HTMLElement;
    readonly popup: HTMLElement;
    /** Where it is placed; left out for a popup its engine places itself (a context menu, at the pointer). */
    readonly anchor?: Element;
    readonly placement?: AnchoredPopupOptions;
    /** The controls that say through `aria-expanded` whether it is open. */
    readonly openers?: readonly HTMLElement[];
    /** Where focus goes on opening: that element, the popup's first focusable (`true`), or nowhere (the default). */
    readonly focus?: HTMLElement | boolean;
    /** Where focus goes back on closing; by default whatever held it when the popup took it. */
    readonly returnFocus?: () => HTMLElement | null;
};

export type OwnedPopupsOptions = {
    /** Shows the popup — the engine's open class or attribute, and whatever else opening means to it. */
    readonly show: (opening: OwnedPopupOpening) => void;
    /** Hides it, and undoes whatever else the engine set up for it; `reason` says why where the engine did not ask for it. */
    readonly hide: (opening: OwnedPopupOpening, reason?: PopupDismissReason) => void;
    /** One open at a time (the default): opening another closes the first. A flyout may hold another inside it. */
    readonly single?: boolean;
    /** Whether a read-only owner takes its popup away: an input's does (the default); a container's or a strip's does not. */
    readonly closesWhenReadOnly?: boolean;
    /** Whether a press is inside; by default the popup or its owner, whose own press is the engine's toggle. */
    readonly isInside?: (opening: OwnedPopupOpening, path: readonly EventTarget[]) => boolean;
    /** Whether a dismissal applies to this popup; by default every one does. */
    readonly canDismiss?: (opening: OwnedPopupOpening, reason: PopupDismissReason) => boolean;
    /** Closes on the press rather than the click that follows it; see `PopupDismissalOptions`. */
    readonly onPress?: boolean;
    /** Closes when the window loses focus. */
    readonly onWindowBlur?: boolean;
    /** Closes when the keyboard moves the focus outside (the default), so a Tab walks on; `canDismiss` hears it as `focus`. */
    readonly closesOnFocusLeave?: boolean;
};

type OpenPopup = {
    readonly opening: OwnedPopupOpening;
    readonly returnFocus: HTMLElement | null;
};

/** Whether an owner can keep its popup: in the page, answering the reader, and — where it is an input — not read-only. */
export function canKeepPopup(owner: HTMLElement, closesWhenReadOnly: boolean): boolean {
    return owner.isConnected && !isInert(owner) && !(closesWhenReadOnly && isReadOnly(owner));
}

export class OwnedPopups {
    private readonly options: OwnedPopupsOptions;

    // By owner, in the order they opened.
    private readonly entries = new Map<HTMLElement, OpenPopup>();

    public constructor(options: OwnedPopupsOptions) {
        this.options = options;

        new PopupDismissal({
            openPopups: () => [...this.entries.values()].map(entry => entry.opening.popup).filter(popup => popup.isConnected),
            close: (popup, reason) => this.closePopup(popup, reason),
            canDismiss: (popup, reason) => {
                const entry = this.entryOf(popup);

                return entry === null || options.canDismiss === undefined || options.canDismiss(entry.opening, reason);
            },
            isInside: (popup, path) => {
                const entry = this.entryOf(popup);

                return entry === null ? path.includes(popup) : this.isInside(entry.opening, path);
            },
            // By its owner: a list hung at the body's end from a strip inside a modal dialog is the dialog's, not behind it.
            isBehind: popup => isBehindModal(this.entryOf(popup)?.opening.owner ?? popup),
            onPress: options.onPress,
            onWindowBlur: options.onWindowBlur
        });

        if (options.closesOnFocusLeave ?? true)
            document.addEventListener("focusout", domEvent => this.handleFocusLeave(domEvent), true);
    }

    private closePopup(popup: HTMLElement, reason: PopupDismissReason): void {
        const entry = this.entryOf(popup);

        if (entry !== null)
            this.close(entry.opening.owner, reason);
    }

    private entryOf(popup: HTMLElement): OpenPopup | null {
        for (const entry of this.entries.values()) {
            if (entry.opening.popup === popup)
                return entry;
        }

        return null;
    }

    private isInside(opening: OwnedPopupOpening, path: readonly EventTarget[]): boolean {
        return this.options.isInside === undefined ? path.includes(opening.popup) || path.includes(opening.owner) : this.options.isInside(opening, path);
    }

    /** Closes a popup when the keyboard takes the focus out of it or its owner, or lets it go to nothing. */
    private handleFocusLeave(domEvent: Event): void {
        const next = domEvent instanceof FocusEvent ? domEvent.relatedTarget : null;

        // Moved by the pointer, the focus is the dismissal's, after the click.
        if (!(domEvent.target instanceof Node) || isPointerLast() || (next instanceof Element && next.hasAttribute(PointerFocusAttribute)))
            return;

        if (next instanceof Element)
            this.leaveFocus(domEvent.target, next);
        else if (isLetGo(domEvent.target))
            this.letGo(domEvent.target);
    }

    /** Closes every popup the focus moved from `from`, in it or its owner, to `to`, outside it — not into a modal dialog over it. */
    public leaveFocus(from: Node, to: Element): void {
        for (const { opening } of [...this.entries.values()]) {
            const left = opening.popup.contains(from) || opening.owner.contains(from);

            if (left && !this.isInside(opening, pathOf(to)) && !isBehindModal(opening.owner) && this.options.canDismiss?.(opening, "focus") !== false)
                this.close(opening.owner, "focus");
        }
    }

    /** Closes the popups a field in them or their owner let the keyboard go from — Enter's leave: a confirmed value takes its list with it. */
    private letGo(from: Element): void {
        // A holder about to take the keyboard inside the popup keeps it open: the colour pane's own fields hand it to the pane.
        const holder = focusHolderAround(from);

        for (const { opening } of [...this.entries.values()]) {
            const left = opening.popup.contains(from) || opening.owner.contains(from);
            const keptInside = holder !== null && opening.popup.contains(holder);

            // An owner that can no longer keep its popup is the watch's to close, which gives the keyboard to its root.
            if (left && !keptInside && canKeepPopup(opening.owner, this.closesWhenReadOnly) && !isBehindModal(opening.owner) && this.options.canDismiss?.(opening, "focus") !== false)
                this.close(opening.owner, "focus");
        }
    }

    /** The owner whose popup is open, the newest where more than one is. */
    public get current(): HTMLElement | null {
        let last: HTMLElement | null = null;

        for (const owner of this.entries.keys())
            last = owner;

        return last;
    }

    public isOpen(owner: HTMLElement): boolean {
        return this.entries.has(owner);
    }

    /** The popup an owner has open, if it has one. */
    public popupOf(owner: HTMLElement): HTMLElement | null {
        return this.entries.get(owner)?.opening.popup ?? null;
    }

    /** Opens an owner's popup and answers whether it is open; an owner that could not keep it gets none. */
    public open(opening: OwnedPopupOpening): boolean {
        // One already open is only placed again: a class changing on it must not pull the focus back in.
        if (this.entries.get(opening.owner)?.opening.popup === opening.popup) {
            this.reposition(opening.owner);
            return true;
        }

        // Another popup of the same owner — a context menu of another name — takes the first one's place.
        this.close(opening.owner);

        if (!canKeepPopup(opening.owner, this.closesWhenReadOnly))
            return false;

        if (this.options.single ?? true)
            this.closeAll();

        const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        this.entries.set(opening.owner, { opening, returnFocus: previous });
        this.options.show(opening);
        place(opening);
        describe(opening, true);
        watch(this);

        if (opening.focus !== undefined && opening.focus !== false)
            moveFocusInto(opening.popup, opening.focus === true ? null : opening.focus);

        return true;
    }

    private get closesWhenReadOnly(): boolean {
        return this.options.closesWhenReadOnly ?? true;
    }

    private closeAll(): void {
        for (const owner of [...this.entries.keys()])
            this.close(owner);
    }

    /** Measures an open popup against its anchor again — its content or its owner changed size. */
    public reposition(owner: HTMLElement): void {
        const entry = this.entries.get(owner);

        if (entry !== undefined)
            place(entry.opening);
    }

    /** Closes an owner's popup, or the newest when no owner is named; a `reason` is the dismissal's, left out for the engine's own close. */
    public close(owner: HTMLElement | null = this.current, reason?: PopupDismissReason): void {
        const entry = owner === null ? undefined : this.entries.get(owner);

        if (owner === null || entry === undefined)
            return;

        const { opening } = entry;

        this.entries.delete(owner);

        // Before the popup hides: hidden, it has already dropped the focus there is to bring back. Asked only then, since finding a
        // live return may make a component's root focusable for it.
        if (opening.popup.contains(document.activeElement))
            restoreFocusTo(opening.returnFocus === undefined ? entry.returnFocus : opening.returnFocus(), opening.popup);
        this.options.hide(opening, reason);
        describe(opening, false);
        releaseAnchoredPopup(opening.popup);

        if (this.entries.size === 0)
            unwatch(this);
    }

    /** Closes every popup whose owner can no longer keep it; the owners' watch runs it on every change. */
    public closeStranded(): void {
        for (const [owner, { opening }] of [...this.entries]) {
            if (canKeepPopup(owner, this.closesWhenReadOnly))
                continue;

            const active = document.activeElement;
            const held = active === null || active === document.body || opening.popup.contains(active) || owner.contains(active);

            this.close(owner, "owner");

            // The keyboard it held, or one the owner's inert parts dropped, goes to the owner's root, focusable while it refuses.
            if (held && owner.isConnected && !hasLiveFocus())
                focusRoot(owner);
        }
    }
}

/**
 * Whether a focus that went to nothing was let go of on purpose — a field's Enter blurring it — and not lost: the document still has
 * the focus (no window switch), and the element could keep it (not hidden, taken out or turned inert under it).
 */
function isLetGo(element: Node): element is Element {
    return element instanceof Element && element.isConnected && isFocusable(element) && typeof document.hasFocus === "function" && document.hasFocus();
}

/** Whether the focus stands somewhere the keyboard can use: not the body, not inside anything inert. */
function hasLiveFocus(): boolean {
    const active = document.activeElement;

    return active instanceof Element && active !== document.body && isFocusable(active);
}

/** Focuses a component's root, made focusable for it where its markup is not, until the focus leaves it. */
function focusRoot(owner: HTMLElement): void {
    focusableUntilLeft(owner);
    focusAsLastInput(owner);
}

/** A node and every node above it, as an event's path lists them. */
function pathOf(node: Node): Node[] {
    const path: Node[] = [];

    for (let current: Node | null = node; current !== null; current = current.parentNode)
        path.push(current);

    return path;
}

function place(opening: OwnedPopupOpening): void {
    if (opening.anchor !== undefined && opening.placement !== undefined)
        placeAnchoredPopup(opening.anchor, opening.popup, opening.placement);
}

function describe(opening: OwnedPopupOpening, open: boolean): void {
    for (const opener of opening.openers ?? [])
        opener.setAttribute("aria-expanded", open ? "true" : "false");
}

// The owners are watched only while a popup is open: a class, `inert` or `disabled` arriving anywhere above one, or the owner
// taken out of the page, is re-checked once per batch against the few popups that are open.
const watching = new Set<OwnedPopups>();
let observer: MutationObserver | null = null;

function watch(popups: OwnedPopups): void {
    watching.add(popups);

    if (observer !== null || typeof MutationObserver !== "function")
        return;

    observer = new MutationObserver(() => {
        for (const each of [...watching])
            each.closeStranded();
    });

    observer.observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "inert", "disabled", "aria-disabled"] });
}

function unwatch(popups: OwnedPopups): void {
    watching.delete(popups);

    if (watching.size > 0 || observer === null)
        return;

    observer.disconnect();
    observer = null;
}
