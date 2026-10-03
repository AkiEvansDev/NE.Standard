// A field's commit is heard once per value. The browser raises `change` when the reader leaves a field holding another value than
// the one it took the focus with, and knows nothing of the commits an engine raised meanwhile — a debounced pause, Enter in an entry
// field, a clear: the leave raised that value again, and it went to the server and ran the field's `OnChange` a second time. The
// browser's own rule, widened to those commits: every `change` of the field the focus is in is weighed here, ahead of every listener.

import type { PropertyPatchEngine } from "../updates/property-patch-engine.ts";
import { isCaretField } from "./caret-fields.ts";

type CaretField = HTMLInputElement | HTMLTextAreaElement;

export type CommitGateOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: Pick<PropertyPatchEngine, "addValueChangeHandler">;
};

export class CommitGate {
    private readonly root: ParentNode;

    // The caret field the focus is in, or last was: a leave's change, Enter's commit after the blur and a pause ending after the leave
    // all come once it has lost the focus.
    private field: CaretField | null = null;

    // The value that field last committed, its own at the focus to begin with; null once a push wrote the field, whose next commit
    // then goes whatever it holds.
    private committed: string | null = null;

    public constructor(options: CommitGateOptions = {}) {
        this.root = options.root ?? document;

        // On the page's document it listens on the window, capturing: ahead of every engine's listener on the root, none of which may
        // hear a change stopped here. On another root, on that root, as the refusals do.
        const target: EventTarget = this.root === document ? window : this.root;

        target.addEventListener("focusin", domEvent => this.handleFocus(domEvent), true);
        target.addEventListener("change", domEvent => this.handleChange(domEvent), true);

        options.propertyPatchEngine?.addValueChangeHandler(change => this.forgetPushed(change.components));
    }

    private handleFocus(domEvent: Event): void {
        const target = domEvent.target;

        if (!isCaretField(target) || !this.root.contains(target))
            return;

        this.field = target;
        this.committed = target.value;
    }

    private handleChange(domEvent: Event): void {
        const field = this.field;

        if (field === null || domEvent.target !== field)
            return;

        if (field.value === this.committed) {
            domEvent.stopImmediatePropagation();
            return;
        }

        this.committed = field.value;
    }

    /** A value pushed into the field: what the server holds is no longer what it last committed. */
    private forgetPushed(components: readonly Element[]): void {
        const field = this.field;

        if (field === null)
            return;

        for (const component of components) {
            if (component.contains(field)) {
                this.committed = null;
                return;
            }
        }
    }
}
