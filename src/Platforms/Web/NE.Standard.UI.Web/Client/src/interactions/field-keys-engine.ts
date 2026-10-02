// Enter and Escape leave a field — a blur commits it as leaving by pointer does — and hand the keyboard to the holder around it; the
// bubble phase lets a nearer control's own Enter win. Enter in a form field then presses the form's submit button. A text area that
// submits on Enter keeps the focus instead, so the reader writes the next message where the last one was sent from; so does a
// field with `OnEnter`, one line or several, an entry field whose controller takes what was typed and clears it for the next — its
// Enter runs that command and presses no form's button, and in a text area Shift+Enter still breaks the line.

import { cssAttributeValue, FormIdAttribute, SubmitFormIdAttribute } from "../addressing/dom-attributes.ts";
import type { EventRegistration } from "../events/event-descriptor.ts";
import { isCaretInput } from "./caret-fields.ts";
import { isInert } from "./interactive-state.ts";
import { ownDescendants } from "./own-descendants.ts";
import { focusAsLastInput, focusHolderAround } from "./popup-focus.ts";
import { rowKeyTarget, setRowFocus } from "./row-cursor.ts";
import { SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";

// On a text area whose Enter submits its form (`TextAreaComponent.SubmitOnEnter`); Shift+Enter still breaks the line.
const SubmitOnEnterAttribute = "data-ui-submit-on-enter";
// On a field with `OnEnter` (`TextInputComponent.OnEnter`, `TextAreaComponent.OnEnter`): Enter alone commits the value and raises `enter`.
const RunsOnEnterAttribute = "data-ui-runs-on-enter";
const EnterEventName = "enter";
// What Safari's Enter that ends a composition carries in place of `isComposing`.
const ComposingKeyCode = 229;

/** How the pipeline reads a field's `enter`: its command waits for the value the Enter committed, as a code field's `save` does. */
export const FieldEnterEvent: { readonly name: string; readonly registration: Omit<EventRegistration, "name"> } = {
    name: EnterEventName,
    // Not `submitsForm`, unlike `save`: an entry field in a form would otherwise validate and send the whole form at every line.
    registration: { settlesValue: true }
};

export type FieldKeysEngineOptions = {
    readonly root?: ParentNode;
};

export class FieldKeysEngine {
    private readonly root: ParentNode;

    // The browser raises a change only for typed input, so these tell whether any other arrival still needs committing: the value the
    // field held when it took the focus or last committed, and how many changes were raised.
    private committedValue = "";
    private changes = 0;

    // Fields typed into since their last change: a field that keeps the focus may be given, after a pushed clear, the very text it
    // last committed, which the value alone would take for committed.
    private readonly edited = new WeakSet<EventTarget>();

    public constructor(options: FieldKeysEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("focusin", domEvent => {
            if (domEvent.target instanceof HTMLInputElement || domEvent.target instanceof HTMLTextAreaElement)
                this.committedValue = domEvent.target.value;
        });
        this.root.addEventListener("input", domEvent => {
            if (domEvent.target !== null)
                this.edited.add(domEvent.target);
        }, true);
        this.root.addEventListener("change", domEvent => {
            this.changes++;

            if (domEvent.target !== null)
                this.edited.delete(domEvent.target);

            // A text area's alone: an input's text may be rewritten around its change (a number's invariant text), a text area's never.
            if (domEvent.target instanceof HTMLTextAreaElement)
                this.committedValue = domEvent.target.value;
        }, true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent as KeyboardEvent));
    }

    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || isComposing(domEvent) || (domEvent.key !== "Enter" && domEvent.key !== "Escape"))
            return;

        const target = domEvent.target;

        // Enter in a multi-line field is a line break, unless the area runs a command or submits on it; Escape still leaves it.
        if (target instanceof HTMLTextAreaElement) {
            if (domEvent.key === "Escape") {
                domEvent.preventDefault();
                this.leave(target);
            }
            else if (runsOnEnter(target, domEvent)) {
                domEvent.preventDefault();
                this.runEnter(target, domEvent);
            }
            else if (submitsOnEnter(target, domEvent)) {
                domEvent.preventDefault();
                this.commitInPlace(target);
                this.submitForm(target);
            }

            return;
        }

        if (!isCaretInput(target))
            return;

        domEvent.preventDefault();

        // The exception to the leave below: an entry field stays for the next entry, and its command is the Enter, not the form's button.
        if (runsOnEnter(target, domEvent)) {
            this.runEnter(target, domEvent);
            return;
        }

        this.leave(target);

        if (domEvent.key === "Enter")
            this.submitForm(target);
    }

    /** Commits the value where the field stands, then raises `enter`, whose command waits for that value to land. */
    private runEnter(field: HTMLInputElement | HTMLTextAreaElement, domEvent: KeyboardEvent): void {
        // A held key's repeats would add the same entry again before the controller cleared it; a field that takes no typing runs nothing.
        if (domEvent.repeat || field.readOnly || isInert(field))
            return;

        this.commitInPlace(field);
        field.dispatchEvent(new Event(EnterEventName, { bubbles: true }));
    }

    /** The button that submits the field's form, pressed after the field let go of its value. */
    private submitForm(field: HTMLInputElement | HTMLTextAreaElement): void {
        const formId = field.getAttribute(FormIdAttribute);

        if (formId === null || formId.length === 0)
            return;

        const button = this.root.querySelector<HTMLElement>(`[${SubmitFormIdAttribute}="${cssAttributeValue(formId)}"]`);

        if (button !== null && !isInert(button))
            button.click();
    }

    private leave(field: HTMLInputElement | HTMLTextAreaElement): void {
        const changesBefore = this.changes;
        const holder = focusHolderAround(field);

        field.blur();

        if (this.changes === changesBefore)
            this.commit(field);

        this.keepKeyboard(field, holder);
    }

    /** Raises the change a leave would for a value not yet committed, so it is sent before the command a submit runs. */
    private commit(field: HTMLInputElement | HTMLTextAreaElement): void {
        if (field.value !== this.committedValue)
            field.dispatchEvent(new Event("change", { bubbles: true }));
    }

    /** Commits a field that keeps the focus: what was typed since its last change goes, even the text it committed before a clear. */
    private commitInPlace(field: HTMLInputElement | HTMLTextAreaElement): void {
        if (this.edited.has(field))
            field.dispatchEvent(new Event("change", { bubbles: true }));
        else
            this.commit(field);
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

function isComposing(domEvent: KeyboardEvent): boolean {
    // oxlint-disable-next-line typescript/no-deprecated -- Safari's composing Enter is told by nothing else.
    return domEvent.isComposing || domEvent.keyCode === ComposingKeyCode;
}

/** Enter alone, in a field with `OnEnter`: Shift+Enter is a text area's line break, and a chord keeps a field's ordinary rule. */
function runsOnEnter(field: HTMLInputElement | HTMLTextAreaElement, domEvent: KeyboardEvent): boolean {
    return isPlainEnter(domEvent) && field.hasAttribute(RunsOnEnterAttribute);
}

/** Enter alone, in an area that submits on it and could take the typing: Shift+Enter is the line break, other chords the browser's. */
function submitsOnEnter(area: HTMLTextAreaElement, domEvent: KeyboardEvent): boolean {
    return isPlainEnter(domEvent)
        && area.hasAttribute(SubmitOnEnterAttribute)
        && !area.readOnly
        && !isInert(area);
}

/** Enter with no modifier: a chord keeps the field's ordinary rule. */
function isPlainEnter(domEvent: KeyboardEvent): boolean {
    return domEvent.key === "Enter" && !domEvent.shiftKey && !domEvent.ctrlKey && !domEvent.altKey && !domEvent.metaKey;
}
