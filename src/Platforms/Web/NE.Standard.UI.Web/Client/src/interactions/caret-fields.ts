// Which native fields hold a caret — the ones Enter and Escape leave, and a closing editor empties — as one list for every engine, and
// the one rule over a key landing in a field that takes typing: it is the field's, and no host around it (a row cursor, a list, a menu,
// a grid's detail) acts on it — but Tab, and the Escape or single-line Enter that let go of the field (field-keys-engine.ts).

// `.ts` on the value import: `node --test` loads this module as it is.
import { escapeIsClaimed } from "./field-escape.ts";
import { isComposing, isPlainKey, shortcutWords } from "./keyboard-shortcut.ts";

const CaretInputTypes = new Set(["text", "search", "number", "password", "email", "url", "tel"]);

// What a caret does with Ctrl or ⌘ held too: a word's jump, the line's ends, a word's delete. Any other chord is the page's registry's.
const CaretChordKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown", "Backspace", "Delete"]);

// What a field does itself with Ctrl or ⌘: select all, the clipboard, undo and redo — by the key's place, as the browser takes them
// under any layout.
const FieldChordCodes = new Set(["KeyA", "KeyC", "KeyV", "KeyX", "KeyZ", "KeyY", "Insert"]);

const FunctionKeyPattern = /^F\d{1,2}$/;

/** A single-line input the caret sits in; a checkbox, a radio, a file, a range or a hidden input is not one. */
export function isCaretInput(element: EventTarget | null): element is HTMLInputElement {
    return element instanceof HTMLInputElement && CaretInputTypes.has(element.type);
}

/** A field the caret sits in: a caret input or a multi-line field. */
export function isCaretField(element: EventTarget | null): element is HTMLInputElement | HTMLTextAreaElement {
    return isCaretInput(element) || element instanceof HTMLTextAreaElement;
}

/**
 * Whether an element takes typing: a caret field or an editable region (any of `contenteditable`'s values, and inside one) — what brings
 * a phone's keyboard up, what keeps a long press for the caret, and what an unmodified shortcut leaves alone. Not a checkbox or a slider.
 */
export function takesTyping(element: EventTarget | null): boolean {
    return isCaretField(element) || (element instanceof HTMLElement && element.isContentEditable);
}

/**
 * Whether a key is the field's it landed in: one that types, moves the caret or the selection, or deletes, in a field that takes
 * typing, its own select-all, clipboard, undo and redo, and every key of a composition. Not Tab, Escape, a single-line field's Enter, a
 * function key, or a chord the field has no use for.
 */
export function isFieldKey(domEvent: KeyboardEvent): boolean {
    const target = domEvent.target;

    if (!takesTyping(target))
        return false;

    if (isComposing(domEvent))
        return true;

    const key = domEvent.key;

    if (key === "Tab" || key === "Escape" || FunctionKeyPattern.test(key) || domEvent.altKey)
        return false;

    // A multi-line field's Enter breaks the line, or is its own command (a composer's); a single-line one's lets go of the field.
    if (key === "Enter")
        return !isCaretInput(target);

    return domEvent.ctrlKey || domEvent.metaKey ? CaretChordKeys.has(key) || FieldChordCodes.has(domEvent.code) : true;
}

/** The keys as a package reads them, on the plugin surface as `shortcuts`: a chord's words and match, and whose a key is. */
export const pluginShortcutWords = { ...shortcutWords, isFieldKey, isPlainKey, isEscapeClaimed: escapeIsClaimed };
