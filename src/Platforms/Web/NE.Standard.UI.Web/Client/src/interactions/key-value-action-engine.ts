// A key-value row that has become its own editor (the list's EnableEditing): the keyboard's Enter and Escape are its save and
// cancel, the input takes focus as the row opens, and a row opened on the client alone starts from the value's own text.

import { RowEditingAttribute, ValueBindingAttribute } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { isCaretField, isCaretInput } from "./caret-fields";
import { observeComponents } from "./dom-mutations";
import { PopupRoleSelector } from "./own-control";

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

        observeComponents(this.root, `.${RowClass}`, { attributeFilter: [RowEditingAttribute] }, rows => this.handleRows(rows));
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

    /**
     * A row that closed lets its draft go. A text field is emptied, so the next open starts from the value's text again rather
     * than a draft the server last echoed; a toggle or a picture returns to the server's last word, which is its own state.
     */
    private close(row: HTMLElement): void {
        for (const bound of row.querySelectorAll<HTMLElement>(`.${ValueInputClass} [${ValueBindingAttribute}]`)) {
            if (isCaretField(bound)) {
                bound.value = "";
                continue;
            }

            const resolved = this.options.dom.resolveNearestComponent(bound, () => true);

            this.options.propertyPatchEngine.restoreBoundValue(bound, resolved?.dynamicParameters ?? []);
        }
    }

    /** The draft is the value's text when the row was opened without the server — a server open has seeded it already. */
    private open(row: HTMLElement): void {
        const field = row.querySelector<HTMLElement>(`.${ValueInputClass} :is(input, textarea, select)`);

        if (field === null)
            return;

        if (isCaretField(field) && field.value.length === 0) {
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
        if (
            domEvent.defaultPrevented ||
            domEvent.isComposing ||
            !(domEvent.target instanceof Element) ||
            (domEvent.key !== "Enter" && domEvent.key !== "Escape")
        )
            return;

        // The key is the row's from its editor and from its save and cancel pair alike; Enter on the pair is the button's own press.
        const cell = domEvent.target.closest<HTMLElement>(`.${ValueInputClass}, .${EditActionClass}`);
        const row = cell?.closest<HTMLElement>(`.${RowClass}`) ?? null;

        if (cell === null || row === null || !row.hasAttribute(RowEditingAttribute) || (domEvent.key === "Enter" && cell.classList.contains(EditActionClass)))
            return;

        // A popup the field opened — a select's list, a picker — owns both keys until it closes; Enter in a multi-line field is a line.
        const popup = domEvent.target.closest(PopupRoleSelector);

        if ((popup !== null && cell.contains(popup)) || (domEvent.key === "Enter" && domEvent.target instanceof HTMLTextAreaElement))
            return;

        const buttons = row.querySelectorAll<HTMLButtonElement>(`.${EditActionClass} button`);
        const target = domEvent.key === "Enter" ? buttons[0] : buttons[buttons.length - 1];

        if (target === undefined)
            return;

        domEvent.preventDefault();

        // The field commits its value on change first, so the save the click raises reads the finished draft.
        if (domEvent.key === "Enter" && domEvent.target instanceof HTMLInputElement)
            domEvent.target.dispatchEvent(new Event("change", { bubbles: true }));

        target.click();
    }
}
