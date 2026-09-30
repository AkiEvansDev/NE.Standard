// A press on a field box's own empty space — its padding, or the gap a caption inside leaves before a value sized to its text —
// focuses the box's text field with the caret at the end, so the box answers as one field wherever it is pressed.

import { EventBoundaryAttribute, PopupRoleSelector } from "../addressing/dom-attributes.ts";
import { isCaretField } from "./caret-fields.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { FieldBoxSelector } from "./own-control.ts";

// What inside a box is a control of its own (a stepper, a clear, a picker's toggle), or a popup one of its actions opened (a flyout,
// a split button's list): its press stays its own, and the field keeps the caret the reader left there for an insertion.
const OwnPartSelector = `button, a, input, select, textarea, label, [tabindex], [contenteditable], ${PopupRoleSelector}, [${EventBoundaryAttribute}]`;
// The box's text field: the framework's field class on a caret input or a multi-line field.
const FieldSelector = ":scope > input.ui-field, :scope > textarea.ui-field";

export type FieldBoxPressEngineOptions = {
    readonly root?: ParentNode;
};

export class FieldBoxPressEngine {
    public constructor(options: FieldBoxPressEngineOptions = {}) {
        const root = options.root ?? document;

        root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent as PointerEvent));
    }

    private handlePointerDown(domEvent: PointerEvent): void {
        if (domEvent.defaultPrevented || domEvent.button !== 0 || !(domEvent.target instanceof Element))
            return;

        const box = domEvent.target.closest(FieldBoxSelector);

        if (box === null || (domEvent.target !== box && domEvent.target.closest(OwnPartSelector) !== null))
            return;

        const field = box.querySelector(FieldSelector);

        // A read-only field offers no caret (the file input's names open its picker instead), and an inert one takes no press.
        if (!isCaretField(field) || field.readOnly || isInert(field) || isReadOnly(field))
            return;

        // Taken, or the press would move the focus to the box and begin a selection there.
        domEvent.preventDefault();
        field.focus({ preventScroll: true });

        const end = field.value.length;

        field.setSelectionRange(end, end);
    }
}
