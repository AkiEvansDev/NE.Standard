// Enter and Escape leave a field — a blur commits it as leaving by pointer does — and hand the keyboard to the holder around it; the
// bubble phase lets a nearer control's own Enter win. Enter in a form field then presses the form's submit button. A text area that
// submits on Enter keeps the focus instead, so the reader writes the next message where the last one was sent from; so does a
// field with `OnEnter`, one line or several, an entry field whose controller takes what was typed and clears it for the next — its
// Enter runs that command and presses no form's button, and in a text area Shift+Enter still breaks the line. A field with `OnEscape`
// takes Escape as a cancel: it goes back to the value it last committed, sending nothing typed since, leaves as any field does, and
// then raises `escape`.

import { CommitInPlaceEventName, ComponentSelector, cssAttributeValue, FormIdAttribute, RunsOnEnterAttribute, SubmitFormIdAttribute, SubmitOnEnterAttribute } from "../addressing/dom-attributes.ts";
import type { EventRegistration } from "../events/event-descriptor.ts";
import type { PropertyPatchTarget } from "../state/property-state-store.ts";
import { isCaretInput } from "./caret-fields.ts";
import { dropWaiting } from "./debounced-commit-engine.ts";
import { isCancellingField } from "./field-escape.ts";
import { isComposing, isPlainKey } from "./keyboard-shortcut.ts";
import { isInert } from "./interactive-state.ts";
import { focusHolderAround, giveKeyboardBack } from "./popup-focus.ts";

const EnterEventName = "enter";
const EscapeEventName = "escape";

/** How the pipeline reads a field's `enter`: its command waits for the value the Enter committed, as a code field's `save` does. */
export const FieldEnterEvent: { readonly name: string; readonly registration: Omit<EventRegistration, "name"> } = {
    name: EnterEventName,
    // Not `submitsForm`, unlike `save`: an entry field in a form would otherwise validate and send the whole form at every line.
    registration: { settlesValue: true }
};

export type FieldKeysEngineOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: Pick<PropertyPatchTarget, "addValueChangeHandler" | "writeBoundValue">;
    /** Clears uncommitted dirty and buffered state on `field` before `CancelOnEscape` blurs it. */
    readonly discardDraft?: (field: HTMLInputElement | HTMLTextAreaElement) => void;
};

export class FieldKeysEngine {
    private readonly root: ParentNode;

    // Per-field snapshots so switching focus between fields (or opening a find input inside an expanded editor) never cross-contaminates state.
    private readonly committedOnFocus = new WeakMap<HTMLInputElement | HTMLTextAreaElement, string>();
    private readonly lastCommitted = new WeakMap<HTMLInputElement | HTMLTextAreaElement, string>();
    private readonly trackedFields = new Set<HTMLInputElement | HTMLTextAreaElement>();
    private changes = 0;

    // Fields typed into since their last change: a field that keeps the focus may be given, after a pushed clear, the very text it
    // last committed, which the value alone would take for committed.
    private readonly edited = new WeakSet<EventTarget>();

    private readonly propertyPatchEngine: FieldKeysEngineOptions["propertyPatchEngine"];
    private readonly discardDraft: FieldKeysEngineOptions["discardDraft"];

    public constructor(options: FieldKeysEngineOptions = {}) {
        this.root = options.root ?? document;
        this.propertyPatchEngine = options.propertyPatchEngine;
        this.discardDraft = options.discardDraft;

        this.root.addEventListener("focusin", domEvent => {
            if (domEvent.target instanceof HTMLInputElement || domEvent.target instanceof HTMLTextAreaElement) {
                this.pruneTracked();
                this.trackedFields.add(domEvent.target);

                if (!this.edited.has(domEvent.target)) {
                    this.committedOnFocus.set(domEvent.target, domEvent.target.value);
                    this.lastCommitted.set(domEvent.target, domEvent.target.value);
                }
                else if (!this.lastCommitted.has(domEvent.target)) {
                    this.lastCommitted.set(domEvent.target, domEvent.target.defaultValue);
                }
            }
        });
        this.root.addEventListener("input", domEvent => {
            if (domEvent.target !== null)
                this.edited.add(domEvent.target);
        }, true);
        this.root.addEventListener("change", domEvent => {
            this.changes++;

            if (domEvent.target instanceof HTMLInputElement || domEvent.target instanceof HTMLTextAreaElement) {
                this.edited.delete(domEvent.target);
                this.lastCommitted.set(domEvent.target, domEvent.target.value);

                // A text area's alone: an input's text may be rewritten around its change (a number's invariant text), a text area's never.
                if (domEvent.target instanceof HTMLTextAreaElement)
                    this.committedOnFocus.set(domEvent.target, domEvent.target.value);
            }
            else if (domEvent.target !== null) {
                this.edited.delete(domEvent.target);
            }
        }, true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent as KeyboardEvent));
        this.root.addEventListener(CommitInPlaceEventName, domEvent => {
            if (domEvent.target instanceof HTMLInputElement || domEvent.target instanceof HTMLTextAreaElement)
                this.commitInPlace(domEvent.target);
        });

        // A value pushed into a tracked field is what the server holds now: a cancel goes back to it. Not the page's own echo of what
        // is being typed (a local change while the field holds an edit), which is no commit: taken for one, the cancel had nothing to undo.
        options.propertyPatchEngine?.addValueChangeHandler(change => {
            for (const field of [...this.trackedFields]) {
                if (!field.isConnected) {
                    this.trackedFields.delete(field);
                    continue;
                }

                if (!(change.local && this.edited.has(field)) && change.components.some(component => component.contains(field))) {
                    this.lastCommitted.set(field, field.value);

                    if (!this.edited.has(field))
                        this.committedOnFocus.set(field, field.value);
                }
            }
        });
    }

    private pruneTracked(): void {
        for (const field of this.trackedFields) {
            if (!field.isConnected)
                this.trackedFields.delete(field);
        }
    }

    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || isComposing(domEvent) || (domEvent.key !== "Enter" && domEvent.key !== "Escape"))
            return;

        const target = domEvent.target;

        // Enter in a multi-line field is a line break, unless the area runs a command or submits on it; Escape still leaves it.
        if (target instanceof HTMLTextAreaElement) {
            if (domEvent.key === "Escape") {
                domEvent.preventDefault();

                if (isCancellingField(target))
                    this.runEscape(target, domEvent);
                else
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

        if (domEvent.key === "Escape" && isCancellingField(target)) {
            this.runEscape(target, domEvent);
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

    /**
     * Puts back the value the field last committed — a waiting pause's commit dropped, nothing typed since sent and no change raised —
     * leaves it as Escape does, then raises `escape`.
     */
    private runEscape(field: HTMLInputElement | HTMLTextAreaElement, domEvent: KeyboardEvent): void {
        if (domEvent.repeat)
            return;

        dropWaiting(field);
        this.edited.delete(field);

        const restored = this.lastCommitted.get(field);

        if (restored !== undefined && field.value !== restored)
            this.putBack(field, restored);

        this.committedOnFocus.set(field, field.value);
        this.lastCommitted.set(field, field.value);
        this.discardDraft?.(field);

        const holder = focusHolderAround(field);

        field.blur();
        giveKeyboardBack(field, holder);
        field.dispatchEvent(new Event(EscapeEventName, { bubbles: true }));
    }

    /** Writes the value as a push would where the field is bound, so what follows a value (a growing area's height) follows this one. */
    private putBack(field: HTMLInputElement | HTMLTextAreaElement, value: string): void {
        this.propertyPatchEngine?.writeBoundValue(field, value);

        // A field no binding writes takes the words itself.
        if (field.value !== value)
            field.value = value;
    }

    /** The button that submits the field's form, pressed after the field let go of its value. */
    private submitForm(field: HTMLInputElement | HTMLTextAreaElement): void {
        const formId = field.getAttribute(FormIdAttribute) ?? field.closest(ComponentSelector)?.getAttribute(FormIdAttribute) ?? null;

        if (formId === null || formId.length === 0)
            return;

        const button = this.root.querySelector<HTMLElement>(`[${SubmitFormIdAttribute}="${cssAttributeValue(formId)}"]`);

        if (button !== null && !isInert(button))
            button.click();
    }

    private leave(field: HTMLInputElement | HTMLTextAreaElement): void {
        const changesBefore = this.changes;
        const snapshot = this.committedOnFocus.get(field);
        // Read before the blur, which formats a number field at rest and would make its text differ from the edit text it took on focus.
        const dirty = this.edited.has(field) || (snapshot !== undefined && field.value !== snapshot);
        const holder = focusHolderAround(field);

        field.blur();

        if (this.changes === changesBefore && dirty)
            field.dispatchEvent(new Event("change", { bubbles: true }));

        giveKeyboardBack(field, holder);
    }

    /** Commits a field that keeps the focus: what was typed since its last change goes, even the text it committed before a clear. */
    private commitInPlace(field: HTMLInputElement | HTMLTextAreaElement): void {
        if (field.readOnly || isInert(field))
            return;

        const snapshot = this.committedOnFocus.get(field);

        if (this.edited.has(field) || (snapshot !== undefined && field.value !== snapshot))
            field.dispatchEvent(new Event("change", { bubbles: true }));
    }
}

/** Enter alone, in a field with `OnEnter`: Shift+Enter is a text area's line break, and on a touch keyboard Enter in a text area inserts a newline. */
function runsOnEnter(field: HTMLInputElement | HTMLTextAreaElement, domEvent: KeyboardEvent): boolean {
    if (field instanceof HTMLTextAreaElement && isTouchTextArea())
        return false;

    return isPlainEnter(domEvent) && field.hasAttribute(RunsOnEnterAttribute);
}

/** Enter alone, in an area that submits on it and could take the typing: Shift+Enter (or Enter on a touch keyboard) is the line break. */
function submitsOnEnter(area: HTMLTextAreaElement, domEvent: KeyboardEvent): boolean {
    return !isTouchTextArea()
        && isPlainEnter(domEvent)
        && area.hasAttribute(SubmitOnEnterAttribute)
        && !area.readOnly
        && !isInert(area);
}

function isTouchTextArea(): boolean {
    return typeof window !== "undefined"
        && typeof window.matchMedia === "function"
        && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/** Enter with no modifier: a chord keeps the field's ordinary rule. */
function isPlainEnter(domEvent: KeyboardEvent): boolean {
    return domEvent.key === "Enter" && isPlainKey(domEvent);
}
