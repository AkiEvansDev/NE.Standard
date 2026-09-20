// Enter and Escape leave a field, blurring it to commit the value the way leaving by pointer does; listened in the bubble phase
// so a nearer control's own idea of Enter wins. Enter in a form field also presses the form's submit button, value first.

import { FormIdAttribute, SubmitFormIdAttribute } from "../addressing/dom-attributes";
import { isCaretInput } from "./caret-fields";

export type FieldKeysEngineOptions = {
    readonly root?: ParentNode;
};

export class FieldKeysEngine {
    private readonly root: ParentNode;

    // What the field held on focus, and whether leaving raised a change: the browser only raises one for typed input, so any
    // other arrival is committed here.
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
