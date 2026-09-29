// A key-value row that has become its own editor (the list's EnableEditing): Enter and Escape are its save and cancel, the
// input takes focus on open, and a client-only open starts from the value's own text.

import { PopupRoleSelector, RowEditingAttribute, ValueBindingAttribute } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { isCaretField, isCaretInput } from "./caret-fields";
import { observeComponents } from "./dom-mutations";
import { dispatchDraftDropped } from "./draft-events";
import { isInert } from "./interactive-state";

const RowClass = "ui-key-value-action__row";
const ValueClass = "ui-key-value-action__value";
const ValueInputClass = "ui-key-value-action__value-input";
const EditActionClass = "ui-key-value-action__edit-action";
const TitleClass = "ui-text__title";

export type KeyValueActionEngineOptions = {
    readonly root?: ParentNode;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
};

export class KeyValueActionEngine {
    private readonly options: KeyValueActionEngineOptions;
    private readonly root: ParentNode;

    public constructor(options: KeyValueActionEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        // A row may be rendered already editing — one the server added open — so rows are read as they arrive, and once at the start.
        this.handleRows(this.root.querySelectorAll<HTMLElement>(`.${RowClass}`));
        observeComponents(this.root, `.${RowClass}`, { childList: true, attributeFilter: [RowEditingAttribute] }, rows => this.handleRows(rows));
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent as KeyboardEvent), true);
    }

    private handleRows(rows: Iterable<HTMLElement>): void {
        for (const row of rows) {
            if (row.hasAttribute(RowEditingAttribute))
                this.open(row);
            else
                this.close(row);
        }
    }

    /** Lets a closed row's draft go: a text field emptied, anything else back to the server's value. */
    private close(row: HTMLElement): void {
        for (const bound of row.querySelectorAll<HTMLElement>(`.${ValueInputClass} [${ValueBindingAttribute}]`)) {
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
    }

    /** Focuses an opened row's field, seeding a client-only open's draft with the value's text. */
    private open(row: HTMLElement): void {
        const field = row.querySelector<HTMLElement>(`.${ValueInputClass} :is(input, textarea, select)`);

        if (field === null)
            return;

        // A server open has seeded it already; only the bound field takes it, as a search's visible box is a query over a hidden input.
        if (isCaretField(field) && field.value.length === 0 && field.hasAttribute(ValueBindingAttribute)) {
            const text = row.querySelector<HTMLElement>(`.${ValueClass} .${TitleClass}`)?.textContent?.trim() ?? "";

            if (text.length > 0) {
                field.value = text;
                field.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }

        field.focus({ preventScroll: true });

        if (isCaretInput(field))
            field.select();
    }

    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || domEvent.isComposing || !(domEvent.target instanceof Element) || (domEvent.key !== "Enter" && domEvent.key !== "Escape"))
            return;

        // The key is the row's from its editor and from its save and cancel pair alike; Enter on the pair is the button's own press.
        const editing = editingCellOf(domEvent.target);

        if (editing === null || (domEvent.key === "Enter" && editing.cell.classList.contains(EditActionClass)))
            return;

        const { cell, row } = editing;

        // A popup the field opened owns both keys until it closes, wherever they land; Enter in a multi-line field is a line break.
        const popup = domEvent.target.closest(PopupRoleSelector);
        const openList = cell.querySelector("[role='listbox']");

        if ((popup !== null && cell.contains(popup)) || (openList !== null && openList.getClientRects().length > 0) || (domEvent.key === "Enter" && domEvent.target instanceof HTMLTextAreaElement))
            return;

        const buttons = row.querySelectorAll<HTMLButtonElement>(`.${EditActionClass} button`);
        const target = domEvent.key === "Enter" ? buttons[0] : buttons[buttons.length - 1];

        if (target === undefined)
            return;

        domEvent.preventDefault();

        // A Save still loading (or disabled) is not pressed twice by a second Enter; the key is spent either way.
        if (isInert(target))
            return;

        // The field commits its value on change first, so the save the click raises reads the finished draft.
        if (domEvent.key === "Enter" && domEvent.target instanceof HTMLInputElement)
            domEvent.target.dispatchEvent(new Event("change", { bubbles: true }));

        target.click();
    }
}

/** Whether a key landed in a key-value row's open editor, whose Enter and Escape are the row's save and cancel. */
export function isInEditingRow(target: EventTarget | null): boolean {
    return editingCellOf(target) !== null;
}

/** The editor cell a key landed in (the field, or its save and cancel pair) and its row, while the row is editing. */
function editingCellOf(target: EventTarget | null): { readonly cell: HTMLElement; readonly row: HTMLElement } | null {
    if (!(target instanceof Element))
        return null;

    const cell = target.closest<HTMLElement>(`.${ValueInputClass}, .${EditActionClass}`);
    const row = cell?.closest<HTMLElement>(`.${RowClass}`) ?? null;

    return cell === null || row === null || !row.hasAttribute(RowEditingAttribute) ? null : { cell, row };
}
