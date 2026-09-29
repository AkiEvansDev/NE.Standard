// Closing a popup from outside: a click outside or Escape, judged by composedPath so a re-render during the click can't lie.
// Escape is one document listener over every dismissal, closing only one popup: the innermost, else the newest. A popup behind an
// open modal dialog is left alone: a press in the dialog is not outside it, and Escape is the dialog's.

import { isBehindModal } from "./open-dialogs.ts";

/** Why a popup closed unasked: a press outside, Escape, the window's blur, the keyboard leaving it, or its owner unable to keep it. */
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

// The order Escape first found popups open in, a tie-break between unrelated popups only; one seen closed is renumbered on reopening.
const openOrder = new Map<HTMLElement, number>();
let openSequence = 0;
let escapeInstalled = false;

function installEscape(): void {
    if (escapeInstalled)
        return;

    escapeInstalled = true;

    document.addEventListener("keydown", domEvent => {
        // A key already taken — a drag cancelled by it — is not also a popup's.
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Escape" || domEvent.defaultPrevented)
            return;

        if (dismissNewest())
            domEvent.preventDefault();
    }, true);
}

/** Whether any popup the reader can reach is open right now — what a dialog asks before taking Escape for itself. */
export function hasOpenPopups(): boolean {
    for (const instance of instances) {
        for (const popup of instance.openPopups()) {
            if (popup.isConnected && !instance.isBehind(popup))
                return true;
        }
    }

    return false;
}

/** Closes the most recently opened popup that Escape may close; answers whether one closed. */
function dismissNewest(): boolean {
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
        if (instance.dismiss(popup, "escape"))
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

    public constructor(options: PopupDismissalOptions) {
        this.options = options;

        document.addEventListener("pointerdown", domEvent => this.handlePress(domEvent), true);
        // However a context menu is asked for, a list waiting for its click closes first; this listener is in before its engine's.
        document.addEventListener("contextmenu", domEvent => this.handleContextMenu(domEvent), true);

        if (options.onPress !== true)
            document.addEventListener("click", domEvent => this.handleClick(domEvent), true);

        if (options.onWindowBlur === true)
            window.addEventListener("blur", () => this.dismissAll("blur"));

        instances.add(this);
        installEscape();
    }

    /** The popups this dismissal is watching, open right now. */
    public openPopups(): HTMLElement[] {
        return [...this.options.openPopups()];
    }

    /** A press other than the primary one closes at once wherever it waits for the click: none follows a right press. */
    private handlePress(domEvent: Event): void {
        const path = domEvent.composedPath();
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
        const path = domEvent.composedPath();

        for (const popup of [...this.options.openPopups()]) {
            if (!this.isInside(popup, path))
                this.dismiss(popup, "outside");
        }
    }

    private handleClick(domEvent: Event): void {
        const path = domEvent.composedPath();

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
