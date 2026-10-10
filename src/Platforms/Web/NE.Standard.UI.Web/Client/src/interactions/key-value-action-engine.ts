// A key-value row that has become its own editor (the list's EnableEditing): F2 opens it as its Edit does, Enter and Escape are its
// save and cancel, the input takes focus on open, and a client-only open starts from the value's own text; once it closes the keyboard
// goes back to its Edit (focus-handoff.ts). An open row is a form of its own, so an
// error in its field stops its save as an error stops a form's submit; a cancel sends nothing of the draft it lets go of. The row's
// rules judge the value it shows — at load, as it opens and once it closes — so a saved value's warning stays on its dot.

import { BoxedEditorAttribute, FormIdAttribute, PopupRoleSelector, RowEditingAttribute, SubmitFormIdAttribute, ValueBindingAttribute } from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import type { PropertyPatchEngine } from "../updates/property-patch-engine.ts";
import { isCaretField, isCaretInput } from "./caret-fields.ts";
import { observeComponents } from "./dom-mutations.ts";
import { dispatchDraftDropped } from "./draft-events.ts";
import { editingCellOf, KeyValueActionClass, KeyValueEditActionClass, KeyValueRowClass, KeyValueValueInputClass } from "./field-escape.ts";
import { isComposing, isPlainKey } from "./keyboard-shortcut.ts";
import { FocusableSelector } from "./popup-focus.ts";
import { isInert } from "./interactive-state.ts";
import type { ShownValueValidation } from "./validation-engine.ts";

const ValueClass = "ui-key-value-action__value";
const EditableClass = "ui-key-value-action--editable";
const TitleClass = "ui-text__title";
// The name of the form an open row is: its fields' and its Save's, so the pipeline weighs the row's rules before the save runs.
const RowFormPrefix = "ui-row-form-";
// An editor drawing a field box, by its appearance: the cell sets it down onto the row's line (ui-key-value-action.less).
const BoxedEditorSelector = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)";

export type KeyValueActionEngineOptions = {
    readonly root?: ParentNode;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly validation: ShownValueValidation;
};

export class KeyValueActionEngine {
    private readonly options: KeyValueActionEngineOptions;
    private readonly root: ParentNode;
    // The rows open now: a change inside an open row (its message's words on every key) re-reads it, and only a row that has just
    // opened takes the focus and selects its text — else every key reselected the field and the next one replaced what was typed.
    private readonly openRows = new WeakSet<HTMLElement>();
    // The rows closed now: a row is closed once, as it closes or is first seen, not on every change inside it — its dot drawn is one.
    private readonly closedRows = new WeakSet<HTMLElement>();
    private readonly rowForms = new WeakMap<HTMLElement, string>();
    private formCount = 0;

    public constructor(options: KeyValueActionEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        // A row may be rendered already editing — one the server added open — so rows are read as they arrive, and once at the start;
        // a page that loads with rows open takes no focus for them, or the last one would pull the focus and the view down to itself.
        this.handleRows(this.root.querySelectorAll<HTMLElement>(`.${KeyValueRowClass}`), false);
        observeComponents(this.root, `.${KeyValueRowClass}`, { childList: true, attributeFilter: [RowEditingAttribute] }, rows => this.handleRows(rows, true));
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent as KeyboardEvent), true);

        // Cancel takes no focus on its press: the field keeps it, so no leave commits the draft the press is letting go of.
        this.root.addEventListener("mousedown", domEvent => {
            if (domEvent.target instanceof Element && isCancel(domEvent.target))
                domEvent.preventDefault();
        }, true);

        // On the page's window, capturing, as the commit gate listens: ahead of every engine that would send the value.
        const changes: EventTarget = this.root === document ? window : this.root;

        changes.addEventListener("change", domEvent => holdClosedRowChange(domEvent), true);
    }

    private handleRows(rows: Iterable<HTMLElement>, focus: boolean): void {
        for (const row of rows) {
            if (!row.hasAttribute(RowEditingAttribute)) {
                if (!this.closedRows.has(row)) {
                    this.openRows.delete(row);
                    this.closedRows.add(row);
                    this.close(row);
                }

                continue;
            }

            this.closedRows.delete(row);

            // On every change inside the open row, as a field drawn into it anew has not joined its form yet, nor said its box.
            this.joinForm(row);
            markBoxedEditor(row);

            if (!this.openRows.has(row)) {
                this.openRows.add(row);
                this.open(row, focus);
                this.judge(row);
            }
        }
    }

    /** Names the open row's fields and its Save as one form; a field already in a form of its author's stays in that one. */
    private joinForm(row: HTMLElement): void {
        const save = row.querySelector<HTMLElement>(`.${KeyValueEditActionClass} button`);

        if (save === null)
            return;

        let form = this.rowForms.get(row);

        if (form === undefined) {
            form = `${RowFormPrefix}${++this.formCount}`;
            this.rowForms.set(row, form);
        }

        for (const field of row.querySelectorAll(`.${KeyValueValueInputClass} [${ValueBindingAttribute}]:not([${FormIdAttribute}])`))
            field.setAttribute(FormIdAttribute, form);

        save.setAttribute(SubmitFormIdAttribute, form);
    }

    /** A closed row is no form: its fields leave it, so a save elsewhere never weighs a row nobody is editing. */
    private leaveForm(row: HTMLElement): void {
        const form = this.rowForms.get(row);

        if (form === undefined)
            return;

        for (const element of row.querySelectorAll(`[${FormIdAttribute}="${form}"], [${SubmitFormIdAttribute}="${form}"]`)) {
            element.removeAttribute(FormIdAttribute);
            element.removeAttribute(SubmitFormIdAttribute);
        }
    }

    /** Lets a closed row's draft go: a text field emptied, anything else back to the server's value. */
    private close(row: HTMLElement): void {
        this.leaveForm(row);

        for (const bound of row.querySelectorAll<HTMLElement>(`.${KeyValueValueInputClass} [${ValueBindingAttribute}]`)) {
            if (isCaretField(bound)) {
                // Empty, so the next open starts from the value's text.
                bound.value = "";
                continue;
            }

            const resolved = this.options.dom.resolveNearestComponent(bound, () => true);

            this.options.propertyPatchEngine.restoreBoundValue(bound, resolved?.dynamicParameters ?? []);
        }

        // A client-chosen picture's preview is not a bound value, so it is told separately.
        dispatchDraftDropped(row);
        this.judge(row);
    }

    /** Judges the row's fields by their rules against the value the row shows; an emptied text field stands for the value's text. */
    private judge(row: HTMLElement): void {
        const text = valueText(row);

        for (const bound of row.querySelectorAll<HTMLElement>(`.${KeyValueValueInputClass} [${ValueBindingAttribute}]`))
            this.options.validation.judgeShown(bound, isCaretField(bound) && bound.value.length === 0 ? text : null);
    }

    /** Seeds a client-only open's draft with the value's text and, for a row opened after the load, focuses its field. */
    private open(row: HTMLElement, focus: boolean): void {
        const field = row.querySelector<HTMLElement>(`.${KeyValueValueInputClass} :is(input, textarea, select)`);

        if (field === null)
            return;

        // A server open has seeded it already; only the bound field takes it, as a search's visible box is a query over a hidden input.
        if (isCaretField(field) && field.value.length === 0 && field.hasAttribute(ValueBindingAttribute)) {
            const text = valueText(row);

            if (text.length > 0) {
                field.value = text;
                field.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }

        if (!focus)
            return;

        field.focus({ preventScroll: true });

        if (isCaretInput(field))
            field.select();
    }

    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.key === "F2" && !domEvent.defaultPrevented && isPlainKey(domEvent)) {
            openByKey(domEvent);
            return;
        }

        if (domEvent.defaultPrevented || isComposing(domEvent) || !(domEvent.target instanceof Element) || (domEvent.key !== "Enter" && domEvent.key !== "Escape"))
            return;

        // The key is the row's from its editor and from its save and cancel pair alike; Enter on the pair is the button's own press.
        const editing = editingCellOf(domEvent.target);

        if (editing === null || (domEvent.key === "Enter" && editing.cell.classList.contains(KeyValueEditActionClass)))
            return;

        const { cell, row } = editing;

        // A popup the field opened owns both keys until it closes, wherever they land; Enter in a multi-line field is a line break.
        const popup = domEvent.target.closest(PopupRoleSelector);
        const openList = cell.querySelector("[role='listbox']");

        if ((popup !== null && cell.contains(popup)) || (openList !== null && openList.getClientRects().length > 0) || (domEvent.key === "Enter" && domEvent.target instanceof HTMLTextAreaElement))
            return;

        const buttons = row.querySelectorAll<HTMLButtonElement>(`.${KeyValueEditActionClass} button`);
        const target = domEvent.key === "Enter" ? buttons[0] : buttons[buttons.length - 1];

        if (target === undefined)
            return;

        domEvent.preventDefault();

        // A Save still loading (or disabled) is not pressed twice by a second Enter; the key is spent either way.
        if (isInert(target))
            return;

        // The field commits its value on change first, so the save the click raises reads the finished draft; then the focus goes to
        // Save as a press on it takes it, so the rules a blur runs have judged the draft before the save weighs them.
        if (domEvent.key === "Enter" && domEvent.target instanceof HTMLInputElement) {
            domEvent.target.dispatchEvent(new Event("change", { bubbles: true }));
            target.focus({ preventScroll: true });
        }

        target.click();
    }
}

/** Marks the open row's input cell whose editor draws a field box (`data-ui-boxed-editor`); one without lays out as it stands. */
function markBoxedEditor(row: HTMLElement): void {
    for (const cell of row.querySelectorAll(`:scope > .${KeyValueValueInputClass}`)) {
        const boxed = cell.querySelector(BoxedEditorSelector) !== null;

        if (cell.hasAttribute(BoxedEditorAttribute) !== boxed)
            cell.toggleAttribute(BoxedEditorAttribute, boxed);
    }
}

/** F2 in a closed row of a list that edits in place opens its editor, as its Edit does: the key the tree's and the tabs' rename takes. */
function openByKey(domEvent: KeyboardEvent): void {
    const row = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${KeyValueRowClass}`) : null;
    const edit = row === null || row.hasAttribute(RowEditingAttribute) || row.closest(`.${EditableClass}`) === null
        ? null
        : row.querySelector(`.${KeyValueActionClass}`)?.querySelector<HTMLElement>(FocusableSelector) ?? null;

    if (edit === null || isInert(edit))
        return;

    domEvent.preventDefault();
    edit.click();
}

/** The text a row shows for its value, which a client-only open starts its draft from. */
function valueText(row: HTMLElement): string {
    return row.querySelector<HTMLElement>(`.${ValueClass} .${TitleClass}`)?.textContent?.trim() ?? "";
}

/**
 * Stops the browser's own change from a field whose row has closed: it left as the row hid it, with a draft the reader let go of,
 * and sent, a number's draft would come back from the server into the closed row and stand in its next open.
 */
function holdClosedRowChange(domEvent: Event): void {
    if (!domEvent.isTrusted || !(domEvent.target instanceof Element))
        return;

    const row = domEvent.target.closest(`.${KeyValueValueInputClass}`)?.closest(`.${KeyValueRowClass}`) ?? null;

    if (row !== null && !row.hasAttribute(RowEditingAttribute))
        domEvent.stopImmediatePropagation();
}

/** Whether an element is inside a row's Cancel, the last of its save and cancel pair. */
function isCancel(element: Element): boolean {
    const button = element.closest(`.${KeyValueEditActionClass} button`);
    const buttons = button?.closest(`.${KeyValueEditActionClass}`)?.querySelectorAll(`button`);

    return button !== null && buttons !== undefined && buttons[buttons.length - 1] === button;
}
