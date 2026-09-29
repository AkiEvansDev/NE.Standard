// A closing row lets its draft go: its editor fires one event on the row, and every engine holding a draft inside lets it go.

export const DraftDroppedEventName = "ui-draft-dropped";

/** Says, to everything inside the element, that the draft it holds is no longer wanted. */
export function dispatchDraftDropped(element: Element): void {
    element.dispatchEvent(new Event(DraftDroppedEventName, { bubbles: true }));
}
