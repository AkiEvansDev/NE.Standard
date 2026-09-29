// A native drag's marks — the class a dragged element wears, the payload a drag needs to start — for a tree's row and a tab's caption.

/** Marks the element and its companions as dragged, clearing any stale mark first, and gives the drag its payload. */
export function markDragStart(domEvent: Event, scope: Element, element: HTMLElement, draggingClass: string, key: string, companions: Iterable<HTMLElement> = []): void {
    // A drag another listener cancelled ends without dragend, so a stale mark is cleared before the new one is made.
    clearDragMarks(scope, draggingClass);
    element.classList.add(draggingClass);

    for (const companion of companions)
        companion.classList.add(draggingClass);

    if (domEvent instanceof DragEvent && domEvent.dataTransfer !== null) {
        domEvent.dataTransfer.effectAllowed = "move";
        // Firefox starts no drag at all without payload, and the key is what the drop already knows.
        domEvent.dataTransfer.setData("text/plain", key);
    }
}

/** Takes the mark off every element in the scope that wears it. */
export function clearDragMarks(scope: Element, draggingClass: string): void {
    for (const stale of scope.querySelectorAll(`.${draggingClass}`))
        stale.classList.remove(draggingClass);
}
