// A popup list of choices — a language switcher's languages, a pager's page sizes, a strip's overflow: one stop of the Tab order,
// opened on its checked entry, the arrows, Home and End walking it round, a typed letter reaching an entry it begins, the pointer
// moving its current entry as in a native menu. Tab closing it to go on from its opener is its owned popup's (`closesOnTab`).

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import type { OwnedPopupOpening, OwnedPopups } from "./owned-popup.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { focusByPointer, focusOpenedList } from "./popup-focus.ts";
import { applyRovingTabIndex, moveRovingFocus, isRovingCandidate, isRovingKey, resolveRovingTarget } from "./roving-focus.ts";
import { entryWords } from "./search-terms.ts";
import { TypeAhead, typeAheadCharacter } from "./type-ahead.ts";

const typeAhead = new TypeAhead();

/**
 * Opens a choice list on `checked`, as a select's list opens on its value; with none checked, as any popup list opens, at the near end
 * or the far one. `focus` false leaves the keyboard where it stands (a text's caret under a bar the pointer pressed), the checked entry
 * the list's one stop. False where its owner could not keep it.
 */
export function openChoiceList(popups: OwnedPopups, opening: Omit<OwnedPopupOpening, "focus">, entries: readonly HTMLElement[], checked: HTMLElement | null, fromEnd = false, focus = true): boolean {
    // The list's one stop: its checked entry, else — the keyboard staying outside — its first, which the arrows would reach first.
    const stop = checked ?? (focus ? null : entries.find(isRovingCandidate) ?? null);

    if (stop !== null)
        applyRovingTabIndex(entries, stop);

    const opened = popups.open({ ...opening, focus: focus && checked !== null ? checked : false });

    if (opened && focus && checked === null)
        focusOpenedList(opening.popup, entries, fromEnd);

    return opened;
}

/**
 * A key in an open choice list: the arrows, Home and End move its current entry and are the list's even where nothing moved, so its
 * owner's own arrows stay out; a typed character moves it to the next entry its words begin with, taken whether or not one does.
 * False for any other key.
 */
export function handleChoiceListKey(domEvent: KeyboardEvent, entries: readonly HTMLElement[]): boolean {
    const current = domEvent.target instanceof HTMLElement && entries.includes(domEvent.target) ? domEvent.target : null;
    const character = typeAheadCharacter(domEvent);

    if (character !== null) {
        domEvent.preventDefault();
        moveRovingFocus(entries, typeAheadEntry(entries, current, character));
        return true;
    }

    if (!isRovingKey(domEvent.key, "vertical") || !isPlainKey(domEvent))
        return false;

    const next = resolveRovingTarget({ key: domEvent.key, items: entries, current, axis: "vertical" });

    if (next !== null)
        domEvent.preventDefault();

    moveRovingFocus(entries, next);

    return true;
}

/** Type-ahead as a package reads it, on the plugin surface as `typeAhead`: the character a key types, and the entry it reaches. */
export const pluginTypeAhead = {
    character: typeAheadCharacter,
    entry: typeAheadEntry
};

/** The entry a typed character reaches in a list of choices or a menu, by the words it shows, or null where none begins with them. */
export function typeAheadEntry(entries: readonly HTMLElement[], current: HTMLElement | null, character: string): HTMLElement | null {
    const candidates = entries.filter(isRovingCandidate);
    const owner = candidates[0]?.parentElement;

    if (owner === undefined || owner === null)
        return null;

    return typeAhead.next({ owner, character, entries: candidates, current, words: entryWords, context: owner });
}

/** The pointer takes the keyboard's place on an entry of an open list, so one entry is current and the arrows go on from it. */
export function followPointer(entry: HTMLElement, entries: readonly HTMLElement[]): void {
    if (entry === document.activeElement || !isRovingCandidate(entry))
        return;

    applyRovingTabIndex(entries, entry);
    focusByPointer(entry);
}
