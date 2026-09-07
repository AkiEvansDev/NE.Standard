// Enter and Escape leave a field the caret is in: the focus goes back to the page, and the blur commits what was typed the way
// leaving by the pointer does. In the bubble phase and only when nothing nearer took the key, so a control with its own idea of
// Enter (a row's editor, a picker, a select's search) keeps it. Enter in a field that belongs to a form is also the form's
// button: the value lands first, then the button is pressed the way a pointer would.

import { FormIdAttribute, SubmitFormIdAttribute } from "../addressing/dom-attributes";
import { isCaretInput } from "./caret-fields";

export type FieldKeysEngineOptions = {
    readonly root?: ParentNode;
};

export class FieldKeysEngine {
    private readonly root: ParentNode;

    // What the field held when the caret came in, and whether leaving it raised a change: the browser raises one only for a value
    // the reader typed, so a value that arrived any other way is committed here.
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

        if (button !== null && !button.hasAttribute("inert") && !(button as HTMLButtonElement).disabled)
            button.click();
    }

    private leave(field: HTMLInputElement | HTMLTextAreaElement): void {
        const changesBefore = this.changes;

        field.blur();

        if (this.changes === changesBefore && field.value !== this.valueOnFocus)
            field.dispatchEvent(new Event("change", { bubbles: true }));
    }
}
