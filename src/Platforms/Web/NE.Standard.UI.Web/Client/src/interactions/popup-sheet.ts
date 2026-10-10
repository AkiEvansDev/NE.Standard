// A list popup on a phone, as one sheet from the bottom instead of beside its anchor: full width over a veil a press on closes it,
// in the top layer over the bottom bar and any dialog, modal — the keyboard inside, the rest of the page hidden from a screen reader,
// Tab kept in where the list does not close on it — and swiped down to close. A list opened from a sheet's entry stands over it at
// its height, slid in from the side, a row on top naming the entry it came from leading back. Which popups are sheets, and when, is
// their owned popup's (`OwnedPopupsOptions.sheetOnPhone`); the look is ui-sheet.less's.

// `node --test` loads this module as it is: `.ts` on the value imports.
import { isSheet, liftIntoTopLayer, lowerIntoPlace, SheetAttribute } from "./anchored-popup.ts";
import { focusAsLastInput, trapTab } from "./popup-focus.ts";
import { entryWords } from "./search-terms.ts";
import { followSwipeDown } from "./sheet-swipe.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import type { ClientStringKey } from "../runtime/client-strings.ts";
import { finishTransitions } from "../rendering/motion.ts";
import { SheetBreakpointQuery } from "../rendering/responsive-tier.ts";

/** On a sheet a nested list stands over, which steps aside as the nested one slides in. */
const SheetCoveredAttribute = "data-ui-sheet-covered";

const ScrimClass = "ui-sheet-scrim";
// On the veil once its sheets have gone under a press still going on: unseen, it takes the rest of that press.
const ScrimLeavingAttribute = "data-ui-sheet-scrim-leaving";
// How long a press's click may trail its release before the veil stops waiting for it.
const ClickWait = 400;
const BackClass = "ui-sheet__back";
const BackKey: ClientStringKey = "ui.sheet.back";

export type SheetOpening = {
    /** What the popup opened from; inside another sheet, the popup is that sheet's nested list. */
    readonly anchor?: Element;
    /** Closes the popup through its owner, for a swipe, the back row, or the screen growing past a phone's. */
    readonly close: () => void;
    /** Keeps Tab inside it: a panel's. A list that closes on Tab lets the Tab close it. */
    readonly trapsTab: boolean;
};

type OpenSheet = {
    readonly popup: HTMLElement;
    readonly parent: OpenSheet | null;
    readonly opening: SheetOpening;
    readonly detachSwipe: () => void;
    readonly back: HTMLElement | null;
    /** What this sheet hid from a screen reader, to give back as it closes. */
    hidden: HTMLElement[];
};

// In the order they opened: a nested sheet after the one it stands over.
const sheets: OpenSheet[] = [];
let scrim: HTMLElement | null = null;
let listening = false;
let pressing = false;

/** Shows an opened popup as a sheet; one already shown as a sheet stays as it is. */
export function presentSheet(popup: HTMLElement, opening: SheetOpening): void {
    if (sheetOf(popup) !== null)
        return;

    const parentPopup = opening.anchor?.closest<HTMLElement>(`[${SheetAttribute}]`) ?? null;
    const parent = parentPopup === null ? null : sheetOf(parentPopup);

    // What an anchored opening wrote inline would hold it beside its anchor still.
    popup.style.removeProperty("top");
    popup.style.removeProperty("left");
    popup.style.removeProperty("min-width");

    const wasSheet = isSheet(popup);

    popup.setAttribute(SheetAttribute, parent === null ? "root" : "nested");

    // Drawn in its own look a moment ago (its engine's open class, styled before this), it would slide from there to its closed place
    // and the opening would cut that short where it stands: it is put at its closed place at once — the mark and the popover, which
    // its closed rule names together — and the opening slides from there. One still sliding out as a sheet turns back where it is.
    if (!wasSheet) {
        popup.setAttribute("popover", "manual");
        finishTransitions(popup);
    }

    let back: HTMLElement | null = null;

    // The last opening's row, still sliding out as this one came.
    popup.querySelector(`:scope > .${BackClass}`)?.remove();

    if (parent !== null) {
        // As tall as the sheet it covers, taller only where its own entries need it.
        popup.style.minHeight = `${parent.popup.getBoundingClientRect().height}px`;
        parent.popup.setAttribute(SheetCoveredAttribute, "");
        back = createBackRow(opening);
        popup.prepend(back);
    }

    showScrim();
    liftIntoTopLayer(popup);

    const sheet: OpenSheet = {
        popup,
        parent,
        opening,
        back,
        hidden: [],
        detachSwipe: followSwipeDown(popup, popup, () => closeOutward(popup))
    };

    sheets.push(sheet);
    listen();

    // After its engine has put the keyboard where it wants it: a sheet is modal, so the keyboard is inside it before the page is hidden.
    queueMicrotask(() => settle(sheet));
}

function sheetOf(popup: HTMLElement): OpenSheet | null {
    return sheets.find(sheet => sheet.popup === popup) ?? null;
}

/** The row atop a nested list: the entry it opened from, a press going back to the list under it. */
function createBackRow(opening: SheetOpening): HTMLElement {
    const row = document.createElement("button");
    const words = opening.anchor === undefined ? "" : entryWords(opening.anchor).trim();

    row.type = "button";
    row.className = BackClass;
    row.tabIndex = -1;
    row.textContent = words;
    clientStrings.write(row, "aria-label", BackKey, { entry: words });
    // On the row itself, so nothing around it (a context menu closing on a click inside) hears the press as an entry's.
    row.addEventListener("click", domEvent => {
        domEvent.stopPropagation();
        opening.close();
    });

    return row;
}

/** The veil under every open sheet, in the top layer just before the first: a press on it is a press outside. */
function showScrim(): void {
    if (scrim === null) {
        scrim = document.createElement("div");
        scrim.className = ScrimClass;
        scrim.setAttribute("aria-hidden", "true");
        // A press on the veil moves no focus: the sheet keeps it, or gives it back to its opener as the press closes it.
        scrim.addEventListener("mousedown", domEvent => domEvent.preventDefault());
    }

    if (scrim.parentElement === null)
        document.body.appendChild(scrim);

    scrim.removeAttribute(ScrimLeavingAttribute);
    // Lifted as a popup is, so the popover's own box comes off it the same way; shown again, it stands under the sheet that follows.
    liftIntoTopLayer(scrim);
}

/** A swipe closes the sheet and every one under it: the reader put the whole stack away. */
function closeOutward(popup: HTMLElement): void {
    for (let sheet = sheetOf(popup); sheet !== null; sheet = sheet.parent)
        sheet.opening.close();
}

/** One listener each over every sheet: the press under the veil, Tab kept inside a panel's, the screen grown past a phone's closing them all. */
function listen(): void {
    if (listening)
        return;

    listening = true;

    window.addEventListener("pointerdown", () => {
        pressing = true;
    }, true);
    window.addEventListener("pointerup", endPress, true);
    window.addEventListener("pointercancel", endPress, true);

    // A panel's alone: a list's Tab closes it (owned-popup.ts), choosing nothing.
    window.addEventListener("keydown", domEvent => {
        const top = sheets.at(-1);

        if (domEvent.key === "Tab" && !domEvent.defaultPrevented && top !== undefined && top.opening.trapsTab && domEvent.target instanceof Node && top.popup.contains(domEvent.target))
            trapTab(top.popup, domEvent);
    }, true);

    matchMedia(SheetBreakpointQuery).addEventListener("change", () => {
        for (const sheet of sheets.filter(each => each.parent === null))
            sheet.opening.close();
    });
}

/** The press under a leaving veil is over: the veil goes with its click, or a little after its release where none follows. */
function endPress(): void {
    pressing = false;

    if (scrim?.hasAttribute(ScrimLeavingAttribute) !== true)
        return;

    const leave = (): void => {
        if (scrim?.hasAttribute(ScrimLeavingAttribute) === true && sheets.length === 0) {
            scrim.removeAttribute(ScrimLeavingAttribute);
            scrim.hidePopover();
        }
    };

    // Not at the click's own capture: the veil takes it first, as a press outside the sheet.
    window.addEventListener("click", () => window.setTimeout(leave), { once: true });
    window.setTimeout(leave, ClickWait);
}

/** The keyboard into a sheet its engine left it outside of, then the page behind it hidden from a screen reader. */
function settle(sheet: OpenSheet): void {
    if (!sheets.includes(sheet))
        return;

    const { popup } = sheet;

    if (!popup.contains(document.activeElement)) {
        if (!popup.hasAttribute("tabindex"))
            popup.tabIndex = -1;

        focusAsLastInput(popup);
    }

    sheet.hidden = hideAround(popup);
}

/**
 * Hides from a screen reader everything beside the sheet on its way up to the body — what aria-modal does for a dialog's role, which
 * a menu or a listbox does not take — and answers what it hid; anything hidden already is left as it is.
 */
export function hideAround(popup: Element): HTMLElement[] {
    const hidden: HTMLElement[] = [];

    for (let node: Element = popup; node.parentElement !== null && node !== document.body; node = node.parentElement) {
        for (const sibling of node.parentElement.children) {
            if (sibling === node || sibling === scrim || !(sibling instanceof HTMLElement) || sibling.getAttribute("aria-hidden") === "true")
                continue;

            sibling.setAttribute("aria-hidden", "true");
            hidden.push(sibling);
        }
    }

    return hidden;
}

/** Gives the page back to a screen reader before the keyboard goes back to it: a sheet's and the nested ones' over it. */
export function revealAround(popup: HTMLElement): void {
    const sheet = sheetOf(popup);

    if (sheet === null)
        return;

    for (const each of [...sheets].reverse()) {
        if (each === sheet || isOver(each, sheet)) {
            for (const element of each.hidden)
                element.removeAttribute("aria-hidden");

            each.hidden = [];
        }
    }
}

function isOver(sheet: OpenSheet, under: OpenSheet): boolean {
    for (let parent = sheet.parent; parent !== null; parent = parent.parent) {
        if (parent === under)
            return true;
    }

    return false;
}

/** Puts a closed popup's sheet away — the nested ones over it first — sliding out before it takes back its own place. */
export function releaseSheet(popup: HTMLElement): void {
    const sheet = sheetOf(popup);

    if (sheet === null)
        return;

    for (const nested of sheets.filter(each => each.parent === sheet)) {
        nested.opening.close();

        // An owner that had already let it go closes nothing: the sheet goes all the same.
        releaseSheet(nested.popup);
    }

    revealAround(popup);
    sheets.splice(sheets.indexOf(sheet), 1);
    sheet.detachSwipe();
    sheet.parent?.popup.removeAttribute(SheetCoveredAttribute);

    if (sheets.length === 0)
        hideScrim();

    // The attribute stays through the slide out, which its closed rule draws; one opened again meanwhile is the new opening's.
    lowerIntoPlace(popup, () => {
        if (sheetOf(popup) !== null)
            return;

        popup.removeAttribute(SheetAttribute);
        popup.removeAttribute(SheetCoveredAttribute);
        popup.style.removeProperty("min-height");
        popup.style.removeProperty("--ui-sheet-drag");
        sheet.back?.remove();
    });
}

/**
 * Takes the veil away — after the press that closed its sheets, if one is going on: a finger lifted after the veil went would raise
 * its mouse events and its click on whatever the page has under it.
 */
function hideScrim(): void {
    if (scrim?.matches(":popover-open") !== true)
        return;

    if (pressing)
        scrim.setAttribute(ScrimLeavingAttribute, "");
    else
        scrim.hidePopover();
}
