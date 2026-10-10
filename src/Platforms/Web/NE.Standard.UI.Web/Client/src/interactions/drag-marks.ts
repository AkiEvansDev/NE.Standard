// A native drag's marks — the class a dragged element wears, the payload a drag needs to start, what a drop may do with it — for a
// list's or a table's row, a tree's row and a tab's caption.

// `.ts` on the value imports: file-drop.ts, which `node --test` loads as it is, reads this module.
import { DropBoxedAttribute } from "../addressing/dom-attributes.ts";
import { FieldBoxSelector } from "./own-control.ts";

// A field's box as `@ui-input-field-state` lists it (styles/mixins/field.less): the image input's surface is one too.
const DropBoxSelector = `:scope > :is(${FieldBoxSelector}, .ui-image-input__surface)`;

/** Marks the element and its companions as dragged, clearing any stale mark first, and gives the drag its payload. */
export function markDragStart(domEvent: Event, scope: Element, element: HTMLElement, draggingClass: string, key: string, companions: Iterable<HTMLElement> = [], allowed: DataTransfer["effectAllowed"] = "move"): void {
    // A drag another listener cancelled ends without dragend, so a stale mark is cleared before the new one is made.
    clearDragMarks(scope, draggingClass);
    element.classList.add(draggingClass);

    for (const companion of companions)
        companion.classList.add(draggingClass);

    giveDragPayload(domEvent, key, allowed);
}

/** Takes the mark off every element in the scope that wears it. */
export function clearDragMarks(scope: Element, draggingClass: string): void {
    for (const stale of scope.querySelectorAll(`.${draggingClass}`))
        stale.classList.remove(draggingClass);
}

/** Gives a starting drag its payload and what a drop may do with it, which the browser's cursor shows: the one writer of either. */
export function giveDragPayload(domEvent: Event, key: string, allowed: DataTransfer["effectAllowed"]): void {
    if (!(domEvent instanceof DragEvent) || domEvent.dataTransfer === null)
        return;

    domEvent.dataTransfer.effectAllowed = allowed;
    // Firefox starts no drag at all without payload, and the key is what the drop already knows.
    domEvent.dataTransfer.setData("text/plain", key);
}

/** Whether a `dragleave` left the element altogether, rather than moved between its own parts; a dragover follows such a move. */
export function leftAltogether(domEvent: DragEvent, element: Element): boolean {
    return !(domEvent.relatedTarget instanceof Node && element.contains(domEvent.relatedTarget));
}

/** Says beside a drop's mark that the target draws its field on a box of its own, which then wears the drop's edge alone; off with it. */
export function markDropBoxed(target: Element, marked: boolean): void {
    const boxed = marked && target.querySelector(DropBoxSelector) !== null;

    if (target.hasAttribute(DropBoxedAttribute) !== boxed)
        target.toggleAttribute(DropBoxedAttribute, boxed);
}
