// The framework's floating-panel plumbing for packages, on the core's owned popup: placed, dismissed and closed with its owner as
// every popup is. `onDismiss` hears why whenever the framework closed it. A package's list of choices opens, walks and closes on Tab
// as the core's choice lists do (popup-list.ts).

import type { AnchoredPopupOptions } from "./anchored-popup.ts";
import { OwnedPopups } from "./owned-popup.ts";
import type { OwnedPopupOpening } from "./owned-popup.ts";
import type { PopupDismissReason } from "./popup-dismissal.ts";
import { liveFocusReturn } from "./popup-focus.ts";
import type { ComponentIndex } from "./popup-focus.ts";
import { followPointer, handleChoiceListKey, openChoiceList } from "./popup-list.ts";

export type PopupOptions = AnchoredPopupOptions & {
    /** The component whose state decides whether the popup may stay; by default the anchor, or the popup for a non-HTML anchor. */
    readonly owner?: HTMLElement;
    /** A list or a menu, one stop of the Tab order: Tab inside it closes it, choosing nothing, and goes on from its opener. */
    readonly closesOnTab?: boolean;
    /** A list or a menu that, on a phone, opens as a sheet from the bottom as the core's lists do; unset, it stays beside its anchor. */
    readonly sheetOnPhone?: boolean;
    /** Told when the framework itself closes the popup, and why; a caller's own `close()` does not raise it. */
    readonly onDismiss: (reason: PopupDismissReason) => void;
};

export type ChoiceListOptions = PopupOptions & {
    readonly entries: readonly HTMLElement[];
    /** The entry it opens on, the value chosen; with none, the near end, or the far one where `fromEnd`. */
    readonly checked: HTMLElement | null;
    readonly fromEnd?: boolean;
    /** False leaves the keyboard where it stands — a text's caret under a bar the pointer pressed; by default it goes into the list. */
    readonly focus?: boolean;
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
    openList(anchor: Element, list: HTMLElement, options: ChoiceListOptions): PopupHandle;
    listKey(domEvent: KeyboardEvent, entries: readonly HTMLElement[]): boolean;
    followPointer(entry: HTMLElement, entries: readonly HTMLElement[]): void;
    focusReturn(opener: HTMLElement | null): HTMLElement | null;
};

// What each open popup was opened with, for the reason its `onDismiss` hears, the ones Tab closes and the ones a phone shows as sheets.
const dismissals = new WeakMap<HTMLElement, PopupOptions["onDismiss"]>();
const tabClosed = new WeakSet<HTMLElement>();
const sheets = new WeakSet<HTMLElement>();

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
    onPress: true,
    closesOnTab: ({ popup }) => tabClosed.has(popup),
    sheetOnPhone: ({ popup }) => sheets.has(popup)
});

/** The popups a package opens, their focus going back through the page's component index (`DomRegistry`). */
export function createPopups(components: ComponentIndex): Popups {
    return {
        open: (anchor, popup, options) => openPopup(anchor, popup, options, opening => owned.open(opening)),
        openList,
        listKey: handleChoiceListKey,
        followPointer,
        focusReturn: opener => liveFocusReturn(opener, components)
    };
}

/** Opens a popup through `show`, the plain opening or a choice list's. */
function openPopup(anchor: Element, popup: HTMLElement, options: PopupOptions, show: (opening: OwnedPopupOpening) => boolean): PopupHandle {
    const owner = options.owner ?? (anchor instanceof HTMLElement ? anchor : popup);

    const isOpen = (): boolean => owned.popupOf(owner) === popup;

    dismissals.set(popup, options.onDismiss);

    if (options.closesOnTab === true)
        tabClosed.add(popup);
    else
        tabClosed.delete(popup);

    if (options.sheetOnPhone === true)
        sheets.add(popup);
    else
        sheets.delete(popup);

    // An owner that could not keep it gets none, as a core popup does: the package hears it as the owner's dismissal.
    if (!show({ owner, popup, anchor, placement: options })) {
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
}

/** A package's list of choices: one stop of the Tab order, opened on its checked entry with the keyboard there, closed by Tab. */
function openList(anchor: Element, list: HTMLElement, options: ChoiceListOptions): PopupHandle {
    return openPopup(anchor, list, { ...options, closesOnTab: true }, opening => openChoiceList(owned, opening, options.entries, options.checked, options.fromEnd, options.focus));
}
