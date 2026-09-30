// Text put into a field where the reader left its caret, in place of its selection, as typing there would: the caret after it, the
// field's own undo holding it, and its input raised so its binding and validation follow. A field keeps its selection while the
// focus is in a panel beside it, so a press in an emoji flyout inserts where the reader stopped.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { isCaretField } from "../interactions/caret-fields.ts";
import { isInert, isReadOnly } from "../interactions/interactive-state.ts";
import { insertTextAsTyped } from "../interactions/legacy-commands.ts";
import type { InsertTextClientEffect } from "../metadata/metadata-index.ts";
import { logWarn } from "../runtime/logger.ts";

type CaretField = HTMLInputElement | HTMLTextAreaElement;

/** Runs an insertion on the component it addresses: its text, or the key of the row the press came from, into its text field. */
export function applyInsertText(effect: InsertTextClientEffect, component: Element, row: readonly unknown[]): void {
    const text = effect.itemKey === true ? rowKey(row) : effect.text;

    if (typeof text !== "string") {
        logWarn(effect.itemKey === true ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", effect);
        return;
    }

    const field = caretFieldOf(component);

    if (field === null) {
        logWarn("insert text effect target holds no text field.", effect);
        return;
    }

    insertAtCaret(field, text);
}

/** The innermost row's key, as `UIActionArgument.CurrentItemKey` reads it for a command. */
function rowKey(row: readonly unknown[]): string | null {
    const key = row.length === 0 ? null : row[row.length - 1];

    return key === null || key === undefined ? null : String(key);
}

/** The component's own text field: itself, or the first caret field inside it, which stands before any panel its actions hold. */
function caretFieldOf(component: Element): CaretField | null {
    if (isCaretField(component))
        return component;

    for (const candidate of component.querySelectorAll("input, textarea")) {
        if (isCaretField(candidate))
            return candidate;
    }

    return null;
}

/**
 * Puts `text` in place of the field's selection, the caret after it. False when the field takes no typing, or the text does not fit
 * its most length: cut, an emoji's half would be none of it.
 */
export function insertAtCaret(field: CaretField, text: string): boolean {
    if (text.length === 0 || field.readOnly || field.disabled || isInert(field) || isReadOnly(field))
        return false;

    const value = field.value;
    // An email or number input keeps no selection the page can read: the text goes at its end.
    const ranged = field.selectionStart !== null;
    const start = field.selectionStart ?? value.length;
    const end = field.selectionEnd ?? start;

    if (field.maxLength >= 0 && value.length - (end - start) + text.length > field.maxLength)
        return false;

    // The command types into the focused field; the selection is put back, since taking the focus may have moved it.
    if (document.activeElement !== field)
        field.focus({ preventScroll: true });

    if (ranged)
        field.setSelectionRange(start, end);

    // A browser that claims the command and leaves the field as it was gets the plain edit, outside the undo.
    if (document.activeElement === field && insertTextAsTyped(text) && field.value !== value)
        return true;

    if (ranged)
        field.setRangeText(text, start, end, "end");
    else
        field.value = value + text;

    field.dispatchEvent(new Event("input", { bubbles: true }));

    return true;
}
