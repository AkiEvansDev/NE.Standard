// Enter and Escape leave a field — a blur commits it as leaving by pointer does — and hand the keyboard to the holder around it; the
// bubble phase lets a nearer control's own Enter win. Enter in a form field then presses the form's submit button.

import { FormIdAttribute, SubmitFormIdAttribute } from "../addressing/dom-attributes.ts";
import { isCaretInput } from "./caret-fields.ts";
import { isInert } from "./interactive-state.ts";
import { ownDescendants } from "./own-descendants.ts";
import { focusAsLastInput, focusHolderAround } from "./popup-focus.ts";
import { rowKeyTarget, setRowFocus } from "./row-cursor.ts";
import { SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";

export type FieldKeysEngineOptions = {
    readonly root?: ParentNode;
};

export class FieldKeysEngine {
    private readonly root: ParentNode;

    // The browser raises a change only for typed input, so these tell whether any other arrival still needs committing.
    private valueOnFocus = "";
    private changes = 0;

    public constructor(options: FieldKeysEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("focusin", domEvent => {
            if (domEvent.target instanceof HTMLInputElement || domEvent.target instanceof HTMLTextAreaElement)
                this.valueOnFocus = domEvent.target.value;
        });
        this.root.addEventListener("change", () => this.changes++, true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent as KeyboardEvent));
    }

    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || domEvent.isComposing || (domEvent.key !== "Enter" && domEvent.key !== "Escape"))
            return;

        const target = domEvent.target;

        // Enter in a multi-line field is a line break; Escape still leaves it.
        if (target instanceof HTMLTextAreaElement && domEvent.key === "Escape") {
            domEvent.preventDefault();
            this.leave(target);
            return;
        }

        if (!isCaretInput(target))
            return;

        domEvent.preventDefault();
        this.leave(target);

        if (domEvent.key === "Enter")
            this.submitForm(target);
    }

    /** The button that submits the field's form, pressed after the field let go of its value. */
    private submitForm(field: HTMLInputElement | HTMLTextAreaElement): void {
        const formId = field.getAttribute(FormIdAttribute);

        if (formId === null || formId.length === 0)
            return;

        const button = this.root.querySelector<HTMLElement>(`[${SubmitFormIdAttribute}="${CSS.escape(formId)}"]`);

        if (button !== null && !isInert(button))
            button.click();
    }

    private leave(field: HTMLInputElement | HTMLTextAreaElement): void {
        const changesBefore = this.changes;
        const holder = focusHolderAround(field);

        field.blur();

        if (this.changes === changesBefore && field.value !== this.valueOnFocus)
            field.dispatchEvent(new Event("change", { bubbles: true }));

        this.keepKeyboard(field, holder);
    }

    /** Gives the keyboard to the holder around the field (a row host's cursor moved to its row), else leaves it blurred. */
    private keepKeyboard(field: HTMLInputElement | HTMLTextAreaElement, holder: HTMLElement | null): void {
        const active = document.activeElement;

        // Nothing moves where the blur or the change already put the focus; with no holder, Tab carries on from the field's place.
        if (holder?.isConnected !== true || (active !== null && active !== document.body))
            return;

        const row = rowKeyTarget(field);

        if (row?.root === holder && row.row !== null)
            setRowFocus(holder, ownDescendants(holder, SelectionRowSelector, SelectionRootSelector), row.row);

        focusAsLastInput(holder);
    }
}
