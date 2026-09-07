// Closing a popup from outside: a click outside or Escape, judged by composedPath so a re-render during the click cannot lie.
// Escape is one document listener over every dismissal, so it closes the popup opened last and leaves the ones under it.

export type PopupDismissReason = "outside" | "escape" | "blur";

export type PopupDismissalOptions = {
    /** The engine's root; a press or an Escape is always the document's to see. */
    readonly root: ParentNode;
    /** The popups open right now, asked on every press: the engine answers from whatever it tracks. */
    readonly openPopups: () => Iterable<HTMLElement>;
    readonly close: (popup: HTMLElement, reason: PopupDismissReason) => void;
    /** Whether a reason applies to this popup. Default: it does. */
    readonly canDismiss?: (popup: HTMLElement, reason: PopupDismissReason) => boolean;
    /** Whether a press is inside this popup. Default: the popup is on the event's path. */
    readonly isInside?: (popup: HTMLElement, path: readonly EventTarget[]) => boolean;
    /** Closes on the press rather than on the click that follows it; a popup with a text field wants the click. Default false. */
    readonly onPress?: boolean;
    /** Closes when the window loses focus. Default false. */
    readonly onWindowBlur?: boolean;
};

const instances = new Set<PopupDismissal>();

// The order popups were first seen open in, so Escape can tell the newest; a popup seen closed is forgotten and re-numbered when it reopens.
const openOrder = new Map<HTMLElement, number>();
let openSequence = 0;
let escapeInstalled = false;

function installEscape(): void {
    if (escapeInstalled)
        return;

    escapeInstalled = true;

    document.addEventListener("keydown", domEvent => {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Escape")
            return;

        if (dismissNewest())
            domEvent.preventDefault();
    }, true);
}

/** Whether any popup is open right now — what a dialog asks before taking Escape for itself. */
export function hasOpenPopups(): boolean {
    for (const instance of instances) {
        for (const popup of instance.openPopups()) {
            if (popup.isConnected)
                return true;
        }
    }

    return false;
}

/** Closes the most recently opened popup that Escape may close; answers whether one closed. */
function dismissNewest(): boolean {
    const open: { instance: PopupDismissal; popup: HTMLElement }[] = [];

    for (const instance of instances) {
        for (const popup of instance.openPopups())
            open.push({ instance, popup });
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

    open.sort((left, right) => (openOrder.get(right.popup) ?? 0) - (openOrder.get(left.popup) ?? 0));

    for (const { instance, popup } of open) {
        if (instance.dismiss(popup, "escape"))
            return true;
    }

    return false;
}

export class PopupDismissal {
    private readonly options: PopupDismissalOptions;

    /** The popups the press now in progress began inside, so the click that ends it is not read as outside. */
    private readonly pressedInside = new Set<HTMLElement>();

    public constructor(options: PopupDismissalOptions) {
        this.options = options;

        document.addEventListener("pointerdown", domEvent => this.handlePress(domEvent), true);

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

    private handlePress(domEvent: Event): void {
        const path = domEvent.composedPath();

        this.pressedInside.clear();

        for (const popup of [...this.options.openPopups()]) {
            if (this.isInside(popup, path))
                this.pressedInside.add(popup);
            else if (this.options.onPress === true)
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

    /** Closes one popup if the reason applies to it; answers whether it did. */
    public dismiss(popup: HTMLElement, reason: PopupDismissReason): boolean {
        if (this.options.canDismiss?.(popup, reason) === false)
            return false;

        this.options.close(popup, reason);

        return true;
    }

    private isInside(popup: HTMLElement, path: readonly EventTarget[]): boolean {
        return this.options.isInside === undefined ? path.includes(popup) : this.options.isInside(popup, path);
    }
}
