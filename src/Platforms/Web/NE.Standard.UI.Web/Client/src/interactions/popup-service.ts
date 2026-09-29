// The framework's floating-panel plumbing for packages, on the core's owned popup: placed, dismissed and closed with its owner as
// every popup is. `onDismiss` hears why whenever the framework closed it.

import type { AnchoredPopupOptions } from "./anchored-popup.ts";
import { OwnedPopups } from "./owned-popup.ts";
import type { PopupDismissReason } from "./popup-dismissal.ts";
import { liveFocusReturn } from "./popup-focus.ts";

export type PopupOptions = AnchoredPopupOptions & {
    /** The component whose state decides whether the popup may stay; by default the anchor, or the popup for a non-HTML anchor. */
    readonly owner?: HTMLElement;
    /** Told when the framework itself closes the popup, and why; a caller's own `close()` does not raise it. */
    readonly onDismiss: (reason: PopupDismissReason) => void;
};

/** What opening a popup hands back. */
type PopupHandle = {
    /** Re-measures the popup against its anchor — for content that changed size in a way a `ResizeObserver` would not catch. */
    reposition(): void;
    /** Closes the popup; does not run `onDismiss`, since the caller already knows why. */
    close(): void;
};

export type Popups = {
    open(anchor: Element, popup: HTMLElement, options: PopupOptions): PopupHandle;
    focusReturn(opener: HTMLElement | null): HTMLElement | null;
};

// What each open popup was opened with, for the reason its `onDismiss` hears.
const dismissals = new WeakMap<HTMLElement, PopupOptions["onDismiss"]>();

// On the press: a package's popup is a list to choose from, not text to select. The anchor is inside, its click the toggle; the owner
// is not, as a press elsewhere in a code field moves its caret off the word. One per owner, several side by side.
const owned = new OwnedPopups({
    show: () => undefined,
    hide: ({ popup }, reason) => {
        const onDismiss = dismissals.get(popup);

        dismissals.delete(popup);

        if (reason !== undefined)
            onDismiss?.(reason);
    },
    single: false,
    isInside: ({ popup, anchor }, path) => path.includes(popup) || (anchor !== undefined && path.includes(anchor)),
    onPress: true
});

export const popups: Popups = {
    open(anchor, popup, options) {
        const owner = options.owner ?? (anchor instanceof HTMLElement ? anchor : popup);

        const isOpen = (): boolean => owned.popupOf(owner) === popup;

        dismissals.set(popup, options.onDismiss);

        // An owner that could not keep it gets none, as a core popup does: the package hears it as the owner's dismissal.
        if (!owned.open({ owner, popup, anchor, placement: options })) {
            dismissals.delete(popup);
            queueMicrotask(() => options.onDismiss("owner"));
        }

        return {
            reposition: () => {
                if (isOpen())
                    owned.reposition(owner);
            },
            close: () => {
                if (isOpen())
                    owned.close(owner);
            }
        };
    },
    focusReturn: opener => liveFocusReturn(opener)
};
