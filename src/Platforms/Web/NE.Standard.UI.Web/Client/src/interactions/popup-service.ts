// The framework's floating-panel plumbing for packages: placed by `anchored-popup.ts`, closed by `popup-dismissal.ts` the same
// way the framework's own popups close. One shared dismissal instance tracks every popup opened here, across every package.

import { AnchoredPopupOptions, placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { PopupDismissReason, PopupDismissal } from "./popup-dismissal";

export type PopupOptions = AnchoredPopupOptions & {
    /** Told when the framework itself closes the popup — an outside press or Escape; a caller's own `close()` does not raise it. */
    readonly onDismiss: (reason: PopupDismissReason) => void;
};

/** What opening a popup hands back. */
export type PopupHandle = {
    /** Re-measures the popup against its anchor — for content that changed size in a way a `ResizeObserver` would not catch. */
    reposition(): void;
    /** Closes the popup; does not run `onDismiss`, since the caller already knows why. */
    close(): void;
};

export type Popups = {
    open(anchor: Element, popup: HTMLElement, options: PopupOptions): PopupHandle;
};

type TrackedPopup = {
    readonly anchor: Element;
    readonly options: PopupOptions;
};

const open = new Map<HTMLElement, TrackedPopup>();

// Closes on the press, not the click that follows: a package's popup here is a list to choose from, not a field to select
// text in. The anchor counts as inside, since its own click is the toggle.
new PopupDismissal({
    openPopups: () => open.keys(),
    close: (popup, reason) => dismiss(popup, reason),
    isInside: (popup, path) => path.includes(popup) || path.includes(open.get(popup)!.anchor),
    onPress: true
});

function dismiss(popup: HTMLElement, reason: PopupDismissReason): void {
    const tracked = open.get(popup);

    if (tracked === undefined)
        return;

    stopTracking(popup);
    tracked.options.onDismiss(reason);
}

function stopTracking(popup: HTMLElement): void {
    open.delete(popup);
    releaseAnchoredPopup(popup);
}

export const popups: Popups = {
    open(anchor, popup, options) {
        open.set(popup, { anchor, options });
        placeAnchoredPopup(anchor, popup, options);

        return {
            reposition: () => placeAnchoredPopup(anchor, popup, options),
            close: () => stopTracking(popup)
        };
    }
};
