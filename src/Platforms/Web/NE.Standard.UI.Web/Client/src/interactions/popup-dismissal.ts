// Closing a popup from outside: a click outside or Escape, judged by composedPath so a re-render during the click can't lie.
// Escape is one document listener over every dismissal, closing only one popup: the innermost, else the newest. A popup behind an
// open modal dialog is left alone: a press in the dialog is not outside it, and Escape is the dialog's.

import { addedAmong, observeLine, SightAttributes } from "./element-visibility.ts";
import { escapeClaimant } from "./field-escape.ts";
import { isComposing } from "./keyboard-shortcut.ts";
import { isBehindModal } from "./open-dialogs.ts";
import { onTierChange } from "../rendering/responsive-tier.ts";
import { registerRuntimeCleanup, withoutRuntimeCleanup } from "../runtime/cleanup-scope.ts";

/**
 * Why a popup closed unasked: a press outside, Escape, the window's blur, the keyboard leaving it, or its owner unable to keep it —
 * gone, out of sight, refusing, or the window crossed the phone's width it opened at (owned-popup.ts).
 */
export type PopupDismissReason = "outside" | "escape" | "blur" | "focus" | "owner";

export type PopupDismissalOptions = {
    /** The popups open right now, asked on every press: the engine answers from whatever it tracks. */
    readonly openPopups: () => Iterable<HTMLElement>;
    readonly close: (popup: HTMLElement, reason: PopupDismissReason) => void;
    /** Whether a reason applies to this popup. Default: it does. */
    readonly canDismiss?: (popup: HTMLElement, reason: PopupDismissReason) => boolean;
    /** Whether a press is inside this popup. Default: the popup is on the event's path. */
    readonly isInside?: (popup: HTMLElement, path: readonly EventTarget[]) => boolean;
    /** Whether an open modal dialog stands over this popup. Default: the dialog does not contain it (`isBehindModal`). */
    readonly isBehind?: (popup: HTMLElement) => boolean;
    /** Closes on the press rather than on the click that follows it; a popup with a text field wants the click. Default false. */
    readonly onPress?: boolean;
    /** Closes when the window loses focus. Default false. */
    readonly onWindowBlur?: boolean;
};

const instances = new Set<PopupDismissal>();

// What a press on a stand-in is a press on: the overlay scrollbar's thumb, in a layer of its own, for the scroller it is drawn over.
let pressStandIn: ((path: readonly EventTarget[]) => Element | null) | null = null;

/** Names the element a press on a stand-in (the overlay scrollbar's layer) is a press on, for every dismissal. */
export function setPressStandIn(standIn: ((path: readonly EventTarget[]) => Element | null) | null): void {
    pressStandIn = standIn;

    if (standIn !== null) {
        registerRuntimeCleanup(() => {
            if (pressStandIn === standIn)
                pressStandIn = null;
        });
    }
}

/** The press's path, carried on through the element a stand-in was pressed for: a drag of a list's thumb is a press inside its popup. */
function pressPath(domEvent: Event): readonly EventTarget[] {
    const path = domEvent.composedPath();
    const standsFor = pressStandIn?.(path) ?? null;

    if (standsFor === null)
        return path;

    const carried: EventTarget[] = [...path];

    for (let current: Element | null = standsFor; current !== null; current = current.parentElement)
        carried.push(current);

    return carried;
}

// The order Escape first found popups open in, a tie-break between unrelated popups only; one seen closed is renumbered on reopening.
const openOrder = new Map<HTMLElement, number>();
let openSequence = 0;
let escapeInstalled = false;

const escapeListener = (domEvent: Event): void => {
    // A key already taken — a drag cancelled by it — is not also a popup's, nor is a composition's.
    if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Escape" || domEvent.defaultPrevented || isComposing(domEvent))
        return;

    if (dismissNewest(escapeClaimant(domEvent.target)))
        domEvent.preventDefault();
};

function installEscape(): void {
    if (escapeInstalled)
        return;

    escapeInstalled = true;
    withoutRuntimeCleanup(() => document.addEventListener("keydown", escapeListener, true));
}

// The floating layers no dismissal holds that answer Escape themselves — the action bar over a chosen row — each saying whether a key
// landing on a target is its own.
const escapeLayers: ((target: EventTarget | null) => boolean)[] = [];

/** Counts a floating layer an engine keeps (the action bar) among what a dialog or a drawer leaves Escape to, while it says a key is its own. */
export function registerEscapeLayer(takesEscape: (target: EventTarget | null) => boolean): () => void {
    escapeLayers.push(takesEscape);

    const stop = (): void => {
        const index = escapeLayers.indexOf(takesEscape);

        if (index >= 0)
            escapeLayers.splice(index, 1);
    };

    registerRuntimeCleanup(stop);

    return stop;
}

/**
 * Whether any popup the reader can reach is open right now, or a floating layer takes an Escape landing on `target` — what a dialog or
 * a drawer asks before taking Escape for itself.
 */
export function hasOpenPopups(target: EventTarget | null = null): boolean {
    for (const instance of instances) {
        for (const popup of instance.openPopups()) {
            if (popup.isConnected && !instance.isBehind(popup))
                return true;
        }
    }

    return escapeLayers.some(takesEscape => takesEscape(target));
}

/** Hears a click the refusals stopped before any popup's listener could: a press on a disabled control is still a press outside. */
export function dismissOnRefusedClick(domEvent: Event): void {
    for (const instance of instances)
        instance.hearRefusedClick(domEvent);
}

/**
 * Closes the most recently opened popup that Escape may close; answers whether one closed. Under a claimed key (a rename field, an
 * editing row) only a popup the claimant holds is closed: closing one around it would take the focus away, and the blur would save
 * the draft the key lets go of.
 */
function dismissNewest(claimant: Element | null): boolean {
    const open: { instance: PopupDismissal; popup: HTMLElement }[] = [];

    for (const instance of instances) {
        for (const popup of instance.openPopups()) {
            // One the page redrew away cannot be seen, so it cannot be what Escape is meant for.
            if (popup.isConnected)
                open.push({ instance, popup });
        }
    }

    const seen = new Set(open.map(entry => entry.popup));

    for (const popup of [...openOrder.keys()]) {
        if (!seen.has(popup))
            openOrder.delete(popup);
    }

    for (const { popup } of open) {
        if (!openOrder.has(popup))
            openOrder.set(popup, ++openSequence);
    }

    const ordered = orderForEscape(open, entry => openOrder.get(entry.popup) ?? 0, (outer, inner) => outer.popup.contains(inner.popup));

    for (const { instance, popup } of ordered) {
        if ((claimant === null || claimant.contains(popup)) && instance.dismiss(popup, "escape"))
            return true;
    }

    return false;
}

/** The order Escape tries open popups in: one opened inside another before the one around it, otherwise the newest first. */
export function orderForEscape<T>(entries: readonly T[], sequenceOf: (entry: T) => number, contains: (outer: T, inner: T) => boolean): T[] {
    // A popup inside another (a select's list in a flyout) can only have opened later, whatever its number says.
    const remaining = [...entries].sort((left, right) => sequenceOf(right) - sequenceOf(left));
    const ordered: T[] = [];

    while (remaining.length > 0) {
        // Containment is a tree, so some remaining popup always holds none of the others.
        const index = remaining.findIndex(entry => !remaining.some(other => other !== entry && contains(entry, other)));

        ordered.push(...remaining.splice(index, 1));
    }

    return ordered;
}

export class PopupDismissal {
    private readonly options: PopupDismissalOptions;

    /** The popups the press now in progress began inside, so the click that ends it is not read as outside. */
    private readonly pressedInside = new Set<HTMLElement>();
    private readonly onPointerDown = (domEvent: Event): void => this.handlePress(domEvent);
    private readonly onContextMenu = (domEvent: Event): void => this.handleContextMenu(domEvent);
    private readonly onClick: ((domEvent: Event) => void) | null;
    private readonly onBlur: (() => void) | null;
    private disposed = false;

    public constructor(options: PopupDismissalOptions) {
        this.options = options;
        this.onClick = options.onPress === true ? null : (domEvent: Event): void => this.handleClick(domEvent);
        this.onBlur = options.onWindowBlur === true ? (): void => { this.dismissAll("blur"); } : null;

        withoutRuntimeCleanup(() => {
            document.addEventListener("pointerdown", this.onPointerDown, true);
            // However a context menu is asked for, a list waiting for its click closes first; this listener is in before its engine's.
            document.addEventListener("contextmenu", this.onContextMenu, true);

            if (this.onClick !== null)
                document.addEventListener("click", this.onClick, true);

            if (this.onBlur !== null)
                window.addEventListener("blur", this.onBlur);
        });

        instances.add(this);
        installEscape();
        registerRuntimeCleanup(() => this.dispose());
    }

    public dispose(): void {
        if (this.disposed)
            return;

        this.disposed = true;
        this.pressedInside.clear();
        document.removeEventListener("pointerdown", this.onPointerDown, true);
        document.removeEventListener("contextmenu", this.onContextMenu, true);

        if (this.onClick !== null)
            document.removeEventListener("click", this.onClick, true);

        if (this.onBlur !== null)
            window.removeEventListener("blur", this.onBlur);

        instances.delete(this);

        if (instances.size === 0 && escapeInstalled) {
            document.removeEventListener("keydown", escapeListener, true);
            escapeInstalled = false;
        }
    }

    /** The popups this dismissal is watching, open right now. */
    public openPopups(): HTMLElement[] {
        return [...this.options.openPopups()];
    }

    /** A press other than the primary one closes at once wherever it waits for the click: none follows a right press. */
    private handlePress(domEvent: Event): void {
        const path = pressPath(domEvent);
        const atOnce = this.options.onPress === true || (domEvent instanceof MouseEvent && domEvent.button !== 0);

        this.pressedInside.clear();

        for (const popup of [...this.options.openPopups()]) {
            if (this.isInside(popup, path))
                this.pressedInside.add(popup);
            else if (atOnce)
                this.dismiss(popup, "outside");
        }
    }

    private handleContextMenu(domEvent: Event): void {
        const path = pressPath(domEvent);

        for (const popup of [...this.options.openPopups()]) {
            if (!this.isInside(popup, path))
                this.dismiss(popup, "outside");
        }
    }

    /** A click stopped before it reached this dismissal's own listener, where that listener waits for one. */
    public hearRefusedClick(domEvent: Event): void {
        if (this.options.onPress !== true)
            this.handleClick(domEvent);
    }

    private handleClick(domEvent: Event): void {
        const path = pressPath(domEvent);

        // Copied first: closing one changes what is open.
        for (const popup of [...this.options.openPopups()]) {
            if (this.isInside(popup, path) || this.pressedInside.has(popup))
                continue;

            this.dismiss(popup, "outside");
        }

        this.pressedInside.clear();
    }

    /** Closes every open popup the reason applies to; answers whether any closed. */
    private dismissAll(reason: PopupDismissReason): boolean {
        let dismissed = false;

        for (const popup of [...this.options.openPopups()])
            dismissed = this.dismiss(popup, reason) || dismissed;

        return dismissed;
    }

    /** Whether an open modal dialog stands over the popup, which is then out of the reader's reach. */
    public isBehind(popup: HTMLElement): boolean {
        return this.options.isBehind === undefined ? isBehindModal(popup) : this.options.isBehind(popup);
    }

    /** Closes one popup if the reason applies to it and no modal dialog stands over it; answers whether it did. */
    public dismiss(popup: HTMLElement, reason: PopupDismissReason): boolean {
        if (this.isBehind(popup) || this.options.canDismiss?.(popup, reason) === false)
            return false;

        this.options.close(popup, reason);

        return true;
    }

    private isInside(popup: HTMLElement, path: readonly EventTarget[]): boolean {
        return this.options.isInside === undefined ? path.includes(popup) : this.options.isInside(popup, path);
    }
}

export type WatchedPopups = {
    holding(element: Element): { readonly owner: HTMLElement; readonly popup: HTMLElement } | null;
    owners(): IterableIterator<HTMLElement>;
    closeStranded(moved?: ReadonlySet<HTMLElement>): void;
    closeReformed(): void;
    closeOutOfSight(scrolled: readonly (EventTarget | null)[]): void;
};

// The owners are watched only while a popup is open: `inert`, `disabled` or what puts an element out of sight (`SightAttributes`)
// arriving on an open owner or anything above it, or the owner taken out of the page or moved, is re-checked once per batch against
// the few popups that are open. Only the owners' lines are watched for attributes (`observeLine`), not the page's.
const watching = new Set<WatchedPopups>();
const OwnerStateFilter: string[] = ["inert", "disabled", "aria-disabled", ...SightAttributes];
let observer: MutationObserver | null = null;
let listening = false;
// The scrolls of the frame now under way, judged together once: a scroll fires every frame, and each judgement walks the boxes up.
let scrolledThisFrame: (EventTarget | null)[] | null = null;

/** The open popup of any engine holding `element` — a list hung at the body's end from a strip in a dialog — with its owner, or null. */
export function popupHolding(element: Element | null): { readonly owner: HTMLElement; readonly popup: HTMLElement } | null {
    if (element === null)
        return null;

    for (const each of watching) {
        const found = each.holding(element);

        if (found !== null)
            return found;
    }

    return null;
}

export function watchPopupOwner(popups: WatchedPopups, owner: HTMLElement): void {
    watching.add(popups);
    listenForSight();

    if (typeof MutationObserver !== "function")
        return;

    if (observer === null) {
        withoutRuntimeCleanup(() => {
            observer = new MutationObserver(records => answerChanges(records));
            observer.observe(document, { subtree: true, childList: true });
        });
    }

    if (observer !== null)
        withoutRuntimeCleanup(() => observeLine(observer!, owner, OwnerStateFilter));
}

/**
 * Judges the open popups against a batch of changes: an attribute changed on an owner's line judges them all; a change of the tree
 * alone, only the owners it moved, whose new line is watched as well — the old one stays watched until no popup is open — and the
 * rest only whether they left the page. Never disconnected here: what closing writes is heard in the next batch, not dropped.
 */
function answerChanges(records: readonly MutationRecord[]): void {
    const attributes = records.some(record => record.type === "attributes");
    const moved = addedAmong(records, [...watching].flatMap(each => [...each.owners()]));

    for (const each of [...watching])
        each.closeStranded(attributes ? undefined : moved);

    for (const owner of moved) {
        if (observer !== null && owner.isConnected)
            observeLine(observer, owner, OwnerStateFilter);
    }
}

/**
 * From the first opening on, for the page's life: a tier crossed re-checks the owners — a tier's Visibility hides one with no change in
 * the tree — and closes what the small breakpoint re-forms; a scroll closes what it took out of sight. With none open, none is asked.
 */
function listenForSight(): void {
    if (listening)
        return;

    listening = true;

    withoutRuntimeCleanup(() => {
        onTierChange(() => {
            for (const each of [...watching]) {
                each.closeReformed();
                each.closeStranded();
            }
        });

        // Capturing: an anchor can sit inside any scrolling box, and scroll does not bubble.
        document.addEventListener("scroll", domEvent => {
            if (watching.size === 0)
                return;

            if (scrolledThisFrame !== null) {
                scrolledThisFrame.push(domEvent.target);
                return;
            }

            scrolledThisFrame = [domEvent.target];
            nextFrame(() => {
                const scrolled = scrolledThisFrame ?? [];

                scrolledThisFrame = null;

                for (const each of [...watching])
                    each.closeOutOfSight(scrolled);
            });
        }, { capture: true, passive: true });
    });
}

/** Runs `then` before the next frame is drawn, or at the next task where nothing draws frames. */
function nextFrame(then: () => void): void {
    if (typeof requestAnimationFrame === "function")
        requestAnimationFrame(then);
    else
        setTimeout(then, 0);
}

export function unwatchPopupOwners(popups: WatchedPopups): void {
    watching.delete(popups);

    if (watching.size > 0 || observer === null)
        return;

    observer.disconnect();
    observer = null;
}
