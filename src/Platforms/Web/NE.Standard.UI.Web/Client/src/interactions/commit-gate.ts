// A field's commit is heard once per value. The browser raises `change` when the reader leaves a field holding another value than
// the one it took the focus with, and knows nothing of the commits an engine raised meanwhile — a debounced pause, Enter in an entry
// field, a clear: the leave raised that value again, and it went to the server and ran the field's `OnChange` a second time. Nor does
// the browser raise `change` on blur for a scripted edit (`setRangeText`, `.value = ...` + `input`), which leaves un-debounced fields
// uncommitted. Every `change` and dirty leave of a caret field is weighed here, ahead of every listener.

import { ComponentSelector } from "../addressing/dom-attributes.ts";
import type { PropertyPatchTarget } from "../state/property-state-store.ts";
import { isCaretField } from "./caret-fields.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";

type CaretField = HTMLInputElement | HTMLTextAreaElement;

export type CommitGateOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: Pick<PropertyPatchTarget, "addValueChangeHandler">;
    /** A field's value as its binding sends it (a number field's invariant text), or its own `.value` when omitted. */
    readonly readValue?: (field: CaretField) => string;
    /** Whether a package's own editor holds the field and commits or restores it on its own (`values.hold`). */
    readonly holdsCommit?: (field: CaretField) => boolean;
};

export class CommitGate {
    private readonly root: ParentNode;
    private readonly readValue: (field: CaretField) => string;
    private readonly holdsCommit: ((field: CaretField) => boolean) | undefined;

    // Each focused or edited caret field's last committed value, its own at focus to begin with; null once a push wrote the field or an
    // edit arrived before focus, whose next commit then goes whatever it holds.
    private readonly committed = new Map<CaretField, string | null>();
    private readonly focused = new WeakSet<CaretField>();
    private readonly dirty = new Set<CaretField>();

    public constructor(options: CommitGateOptions = {}) {
        this.root = options.root ?? document;
        this.readValue = options.readValue ?? (field => field.value);
        this.holdsCommit = options.holdsCommit;

        // On the page's document it listens on the window, capturing: ahead of every engine's listener on the root, none of which may
        // hear a change stopped here, and ahead of NumberInputEngine's blur formatting when a scripted edit commits on focusout.
        const target: EventTarget = this.root === document ? window : this.root;

        target.addEventListener("focusin", domEvent => this.handleFocus(domEvent), true);
        target.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        target.addEventListener("change", domEvent => this.handleChange(domEvent), true);
        target.addEventListener("focusout", domEvent => this.handleFocusOut(domEvent), true);

        options.propertyPatchEngine?.addValueChangeHandler(change => this.forgetPushed(change.components));
    }

    /** Commits dirty caret fields accepted by `shouldCommit`, ahead of a command or route switch that did not blur them. */
    public commitDirty(shouldCommit?: (field: CaretField) => boolean): void {
        for (const field of [...this.dirty]) {
            if (!field.isConnected) {
                this.dirty.delete(field);
                this.committed.delete(field);
                continue;
            }

            if (!this.canCommit(field) || (shouldCommit !== undefined && !shouldCommit(field)))
                continue;

            this.dirty.delete(field);

            if (this.readValue(field) !== this.committed.get(field))
                field.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    private handleFocus(domEvent: Event): void {
        const target = domEvent.target;

        if (!isCaretField(target) || !this.root.contains(target))
            return;

        if (this.focused.has(target))
            return;

        this.pruneRemembered();
        this.focused.add(target);

        if (!this.dirty.has(target))
            this.committed.set(target, this.readValue(target));
    }

    private handleInput(domEvent: Event): void {
        const target = domEvent.target;

        if (!isCaretField(target) || !this.root.contains(target))
            return;

        if (!this.committed.has(target))
            this.committed.set(target, null);

        this.dirty.add(target);
    }

    private handleChange(domEvent: Event): void {
        const target = domEvent.target;

        if (!isCaretField(target) || !this.committed.has(target))
            return;

        this.dirty.delete(target);

        const value = this.readValue(target);

        if (value === this.committed.get(target)) {
            domEvent.stopImmediatePropagation();
            return;
        }

        this.committed.set(target, value);
    }

    private handleFocusOut(domEvent: Event): void {
        const target = domEvent.target;

        if (isCaretField(target) && this.focused.has(target)) {
            // An OS window blur leaves the field as the document's active element; its edit stays open until the focus leaves the field.
            if (document.activeElement === target)
                return;

            this.focused.delete(target);

            if (this.dirty.delete(target))
                this.commitField(target);
        }

        if (this.dirty.size === 0 || !(target instanceof Element))
            return;

        const next = (domEvent as { readonly relatedTarget?: unknown }).relatedTarget;

        for (const field of [...this.dirty]) {
            if (!field.isConnected) {
                this.dirty.delete(field);
                this.committed.delete(field);
                continue;
            }

            if (document.activeElement === field)
                continue;

            const host = field.closest(ComponentSelector);

            if (host !== null && host.contains(target) && !(next instanceof Node && host.contains(next))) {
                this.dirty.delete(field);
                this.commitField(field);
            }
        }
    }

    private commitField(field: CaretField): void {
        if (!this.canCommit(field))
            return;

        if (this.readValue(field) !== this.committed.get(field))
            field.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private canCommit(field: CaretField): boolean {
        return field.isConnected
            && !field.readOnly
            && !field.disabled
            && !isReadOnly(field)
            && !isInert(field)
            && this.holdsCommit?.(field) !== true;
    }

    /** A value pushed into the field: what the server holds is no longer what it last committed. */
    private forgetPushed(components: readonly Element[]): void {
        for (const field of [...this.committed.keys()]) {
            if (!field.isConnected) {
                this.committed.delete(field);
                this.dirty.delete(field);
                continue;
            }

            for (const component of components) {
                if (component.contains(field)) {
                    this.committed.set(field, null);
                    this.dirty.delete(field);
                    break;
                }
            }
        }
    }

    private pruneRemembered(): void {
        for (const field of [...this.committed.keys()]) {
            if (!field.isConnected) {
                this.committed.delete(field);
                this.dirty.delete(field);
            }
        }
    }
}
