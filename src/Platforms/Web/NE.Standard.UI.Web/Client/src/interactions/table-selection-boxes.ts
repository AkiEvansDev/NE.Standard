// A table's column of checkboxes (`SelectionMode.Many`): the chosen rows are the host's own (`SelectedKeys`), and the row and header
// boxes stay in step with them. While the column is there (`NoRowSelectAttribute`), a click on a row is its open or its detail's.

import { ComponentKeyAttribute, ensureElementId, HiddenClass, RowNameIdPrefix, SelectedAttribute, TableBoxOffAttribute, TableClass, TableRowClass, TableSelectAllAttribute, TableSelectAttribute, UnselectableAttribute } from "../addressing/dom-attributes.ts";
import { isInert, setDisabled } from "./interactive-state.ts";

const TableRootSelector = `.${TableClass}`;
const SelectCellSelector = `[${TableSelectAttribute}]`;
const SelectAllSelector = `[${TableSelectAllAttribute}]`;
const CheckboxSelector = "input";

export type TableBoxTarget = {
    readonly table: HTMLElement;
    /** Null for the header's select-all box; the row's element for a row's box. */
    readonly row: HTMLElement | null;
    readonly checked: boolean;
};

/** Resolves a `change` event on a row's or the header's checkbox in a table's selection column. */
export function tableBoxTarget(domEvent: Event): TableBoxTarget | null {
    const box = domEvent.target instanceof Element ? domEvent.target.closest<HTMLInputElement>(CheckboxSelector) : null;
    const table = box?.closest<HTMLElement>(TableRootSelector) ?? null;

    if (box === null || table === null)
        return null;

    if (box.closest(SelectAllSelector)?.closest(TableRootSelector) === table)
        return { table, row: null, checked: box.checked };

    const cell = box.closest(SelectCellSelector);
    const row = cell !== null && cell.closest(TableRootSelector) === table ? cell.closest<HTMLElement>(`.${TableRowClass}`) : null;

    return row !== null && row.closest(TableRootSelector) === table ? { table, row, checked: box.checked } : null;
}

/** The choosable row of a selection checkbox cell, or null when `cell` is not one or its row refuses the choice. */
export function tableSelectCellRow(cell: HTMLElement): HTMLElement | null {
    if (!cell.matches(SelectCellSelector))
        return null;

    const row = cell.closest<HTMLElement>(`.${TableRowClass}`);
    const table = row?.closest<HTMLElement>(TableRootSelector) ?? null;

    return row !== null && table !== null && canChooseTableRow(row) ? row : null;
}

/** Whether the viewer can choose the row: it does not refuse it (`CanSelect`), and neither it nor the table is disabled. */
export function canChooseTableRow(row: HTMLElement): boolean {
    return !row.hasAttribute(UnselectableAttribute) && !isInert(row);
}

/** The table's own header select-all cell, or null when the table drew no selection column. */
export function ownTableSelectAll(table: HTMLElement): HTMLElement | null {
    return ownTableFirst(table, SelectAllSelector);
}

/** Keeps a table's row and header checkboxes in step with the chosen rows: each row's box whether it is chosen, the header's how many of the shown ones are. */
export function syncTableBoxes(root: HTMLElement, rows: readonly HTMLElement[], heldChoosableKeys: readonly string[] | null = null, selectedKeys: ReadonlySet<string> | null = null): void {
    if (!root.classList.contains(TableClass))
        return;

    const all = ownTableFirst<HTMLInputElement>(root, `${SelectAllSelector} ${CheckboxSelector}`);

    if (all === null && ownTableFirst(root, SelectCellSelector) === null)
        return;

    let shown = 0;
    let chosen = 0;

    // A hidden row's box is kept in step too, so it is right the moment a filter lets the row back.
    for (const row of rows) {
        const selected = row.hasAttribute(SelectedAttribute);
        const box = ownTableFirst<HTMLInputElement>(root, `${SelectCellSelector} ${CheckboxSelector}`, row);
        const choosable = canChooseTableRow(row);

        if (choosable && !row.classList.contains(HiddenClass)) {
            shown++;

            if (selected)
                chosen++;
        }

        if (box === null)
            continue;

        nameByRow(box, row);

        if (box.checked !== selected)
            box.checked = selected;

        // A row that refuses the choice says so on its box, rather than ticking under the press and unticking again.
        turnOffBox(box, !choosable);
    }

    if (heldChoosableKeys !== null && selectedKeys !== null) {
        shown = 0;
        chosen = 0;

        if (!isInert(root)) {
            const blockedDrawn = new Set<string>();

            for (const row of rows) {
                if (!canChooseTableRow(row) || row.classList.contains(HiddenClass)) {
                    const key = row.getAttribute(ComponentKeyAttribute);

                    if (key !== null && key.length > 0)
                        blockedDrawn.add(key);
                }
            }

            for (const key of heldChoosableKeys) {
                if (blockedDrawn.has(key))
                    continue;

                shown++;

                if (selectedKeys.has(key))
                    chosen++;
            }
        }
    }

    if (all !== null) {
        all.checked = chosen > 0 && chosen === shown;
        // Neither none nor all: the third state a box can only be put into from script.
        all.indeterminate = chosen > 0 && chosen < shown;
        turnOffBox(all, shown === 0);
    }
}

/** The table's first own match inside `within`, a nested table's left to it. */
function ownTableFirst<T extends HTMLElement = HTMLElement>(table: HTMLElement, selector: string, within: ParentNode = table): T | null {
    for (const element of within.querySelectorAll<T>(selector)) {
        if (element.closest(TableRootSelector) === table)
            return element;
    }

    return null;
}

/**
 * A row's box named by its own words and the row's header cells — "Select row SUB-001001" — rather than the same words in every row;
 * a row with no header cell, or a box with no words, keeps its own name alone.
 */
function nameByRow(control: HTMLElement, row: HTMLElement): void {
    const headers = [...row.children].filter(cell => cell.getAttribute("role") === "rowheader");

    if (headers.length === 0 || !control.hasAttribute("aria-label")) {
        control.removeAttribute("aria-labelledby");
        return;
    }

    const ids = [control, ...headers].map(element => ensureElementId(element, RowNameIdPrefix)).join(" ");

    if (control.getAttribute("aria-labelledby") !== ids)
        control.setAttribute("aria-labelledby", ids);
}

/** A box turned off on its input, never its root (which would drop a focus it holds); the root is marked for its pointer. */
function turnOffBox(box: HTMLInputElement, off: boolean): void {
    setDisabled(box, off);

    const root = box.parentElement;

    if (root !== null && root.hasAttribute(TableBoxOffAttribute) !== off)
        root.toggleAttribute(TableBoxOffAttribute, off);
}
