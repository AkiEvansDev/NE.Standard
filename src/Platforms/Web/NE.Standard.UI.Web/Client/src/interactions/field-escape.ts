// Whose Escape is it? A closer — a popup, a dialog, a side drawer, an action bar — asks `escapeIsClaimed` and leaves a claimed key to
// what claims it: a composition, a rename field, a field whose Escape is its cancel (`OnEscape`), a key-value row's open editor, and
// whatever a package marks as owning its keys, `data-ui-owns-keys` (a grid's cell editor). A popup the claimant holds itself (its
// select's list) is nearer still, so the popups ask `escapeClaimant`. A claimer asks only `isComposing` (keyboard-shortcut.ts). Apart
// from the engines, so the closers need nothing of their imports.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { OwnsKeysAttribute, RowEditingAttribute } from "../addressing/dom-attributes.ts";
import { isInRenameField } from "./inline-rename.ts";
import { isInert } from "./interactive-state.ts";
import { isComposing } from "./keyboard-shortcut.ts";

const RunsOnEscapeAttribute = "data-ui-runs-on-escape";

// A key-value row and the parts of its open editor, which key-value-action-engine.ts reads by the same names.
export const KeyValueRowClass = "ui-key-value-action__row";
export const KeyValueValueInputClass = "ui-key-value-action__value-input";
export const KeyValueEditActionClass = "ui-key-value-action__edit-action";
// A row's own action: its Edit, where the list edits in place (`EnableEditing`).
export const KeyValueActionClass = "ui-key-value-action__action";

/** Whether something nearer the focus than a closer takes this Escape: a closer leaves the key alone, closing nothing. */
export function escapeIsClaimed(domEvent: KeyboardEvent): boolean {
    return isComposing(domEvent) || escapeClaimant(domEvent.target) !== null;
}

/** The element whose own Escape this is — the field, the row's open editor cell, the marked box — or null for an unclaimed key. */
export function escapeClaimant(target: EventTarget | null): Element | null {
    if (!(target instanceof Element))
        return null;

    if (isInRenameField(target) || isCancellingField(target))
        return target;

    // Read with `closest`, so a composed editor (a select's trigger, a date's parts) marks its whole box once.
    return target.closest(`[${OwnsKeysAttribute}]`) ?? editingCellOf(target)?.cell ?? null;
}

/** Whether a key landed in a field whose Escape is its own cancel; a read-only or inert one keeps Escape's ordinary leave. */
export function isCancellingField(target: EventTarget | null): target is HTMLInputElement | HTMLTextAreaElement {
    return target instanceof Element
        && target.hasAttribute(RunsOnEscapeAttribute)
        && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        && !target.readOnly
        && !isInert(target);
}

/** The editor cell a key landed in (the field, or its save and cancel pair) and its row, while the row is editing. */
export function editingCellOf(target: EventTarget | null): { readonly cell: HTMLElement; readonly row: HTMLElement } | null {
    if (!(target instanceof Element))
        return null;

    const cell = target.closest<HTMLElement>(`.${KeyValueValueInputClass}, .${KeyValueEditActionClass}`);
    const row = cell?.closest<HTMLElement>(`.${KeyValueRowClass}`) ?? null;

    return cell === null || row === null || !row.hasAttribute(RowEditingAttribute) ? null : { cell, row };
}
