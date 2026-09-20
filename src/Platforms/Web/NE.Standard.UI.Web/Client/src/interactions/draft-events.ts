// A row that closes lets its draft go: the closing editor fires one event on the row, and every engine holding a draft inside
// lets it go on hearing it.

export const DraftDroppedEventName = "ui-draft-dropped";

/** Says, to everything inside the element, that the draft it holds is no longer wanted. */
export function dispatchDraftDropped(element: Element): void {
    element.dispatchEvent(new Event(DraftDroppedEventName, { bubbles: true }));
}
