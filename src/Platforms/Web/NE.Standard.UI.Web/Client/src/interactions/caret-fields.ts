// Which native fields hold a caret: the ones Enter and Escape leave, and the ones a closing editor empties rather than restores.
// One list, so the two engines that ask never drift apart.

const CaretInputTypes = new Set(["text", "search", "number", "password", "email", "url", "tel"]);

/** A single-line input the caret sits in; a checkbox, a radio, a file, a range or a hidden input is not one. */
export function isCaretInput(element: EventTarget | null): element is HTMLInputElement {
    return element instanceof HTMLInputElement && CaretInputTypes.has(element.type);
}

/** A field the caret sits in: a caret input or a multi-line field. */
export function isCaretField(element: EventTarget | null): element is HTMLInputElement | HTMLTextAreaElement {
    return isCaretInput(element) || element instanceof HTMLTextAreaElement;
}
