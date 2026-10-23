// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { BindingAttributePrefix, ComponentSelector, cssAttributeValue, FormIdAttribute, SecretFieldAttribute, ValueBindingAttribute } from "../addressing/dom-attributes.ts";
import type { ComponentResolveResult, DomRegistry } from "../addressing/dom-registry.ts";
import { clearElementValue } from "../extensions/value-readers.ts";
import type { ValueReaderRegistry } from "../extensions/value-readers.ts";
import { isCaretField } from "../interactions/caret-fields.ts";
import { DraftDroppedEventName } from "../interactions/draft-events.ts";
import { isInert, isReadOnly } from "../interactions/interactive-state.ts";
import { focusAsLastInput } from "../interactions/popup-focus.ts";
import { getBindingMode } from "../metadata/metadata-index.ts";
import type { MetadataIndex, WebBindingMode, WebRenderBindingMetadata, WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index.ts";
import { logError, logWarn } from "../runtime/logger.ts";
import { areValuesEqual } from "../state/value-equality.ts";
import { ValueConflict } from "../transport/value-change-dispatcher.ts";
import type { UnchangedSince, ValueChangeDispatcher } from "../transport/value-change-dispatcher.ts";

const ClearAttribute = "data-ui-clear";
// The field a clear empties where the bound value is not what the reader edits: a date's text, which its engine reads into the value.
const ClearTargetAttribute = "data-ui-clear-target";

export const ValueSyncEventNames: readonly string[] = ["change", "toggle"];

// The pipeline's longer list: each of these is a `toggle` read again, so a command on one waits for that sync.
export const ValueSettleEventNames: readonly string[] = [...ValueSyncEventNames, "expand", "collapse", "open", "close"];

/** Every mode the runtime accepts a client value for. */
function isWritableMode(mode: WebBindingMode | undefined): boolean {
    const name = getBindingMode(mode);

    return name === "TwoWay" || name === "OneWayToSource" || name === "OnSubmit";
}

function isBufferedMode(mode: WebBindingMode | undefined): boolean {
    return getBindingMode(mode) === "OnSubmit";
}

/** The binding an element's own value goes through; `binding` is undefined where its id names none the metadata knows. */
export type WritableBinding = {
    readonly bindingId: string;
    readonly binding: WebRenderBindingMetadata | undefined;
    readonly buffered: boolean;
};

/** The binding an element writes back through, read off the element: one element carries one writable value; null when it has none. */
export function resolveWritableBinding(element: Element, metadata: Pick<MetadataIndex, "getBindingById">): WritableBinding | null {
    const value = element.getAttribute(ValueBindingAttribute);

    if (value !== null) {
        const bound = metadata.getBindingById(Number(value));

        return { bindingId: value, binding: bound, buffered: bound !== undefined && isBufferedMode(bound.mode) };
    }

    for (const name of element.getAttributeNames()) {
        if (!name.startsWith(BindingAttributePrefix))
            continue;

        const bindingId = element.getAttribute(name) ?? "";
        const binding = metadata.getBindingById(Number(bindingId));

        if (binding !== undefined && isWritableMode(binding.mode))
            return { bindingId, binding, buffered: isBufferedMode(binding.mode) };
    }

    return null;
}

export type ValueBindingEngineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly dispatcher: ValueChangeDispatcher;
    // The runtime's, not the update processor's: a value the server answered can move a windowed host, whose spacers are laid out after the change set.
    readonly valueReaders: ValueReaderRegistry;
    /** Records a value this client sent as the property's latest, so a push of an older value is still a change. */
    readonly recordSent: (reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown) => void;
    /** Whether the page refuses a field's value before it goes — one past its bounds stays the reader's, refused in words. */
    readonly refuses?: (element: Element) => boolean;
    /** The property's latest value the page holds (`PropertyStateStore`), undefined where it holds none. */
    readonly readRecorded?: (reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[]) => unknown;
    /** Marks a field whose value was not sent because another writer changed it during a drop (`ValueConflict`), or takes the mark off. */
    readonly markConflict?: (component: Element, conflicting: boolean) => void;
};

/** A field's value the server has not taken, by its binding and row, as a reload carries it over (`unsaved-stash.ts`). */
export type UnsavedValue = {
    readonly bindingId: string;
    readonly dynamicParameters: readonly unknown[];
    readonly value: unknown;
    // The server's value the edit started from, where the page held one: another after the reload was written meanwhile.
    readonly start?: unknown;
    // Held over another writer's value already (`ValueConflict`): put back held and marked, never sent unasked.
    readonly conflicted?: boolean;
};

/** A form's buffered fields and the values they held when read. */
export type FormValues = ReadonlyMap<Element, unknown>;

/** A form as a submit read it at its press: the buffered values it sends, and its text fields' words, kept until `close`. */
export type PressedForm = {
    readonly values: FormValues;
    /** Ends the press's hold on its text fields' words: the submit's answer has been applied, or it sends nothing. */
    close(): void;
};

export class ValueBindingEngine {
    private readonly options: ValueBindingEngineOptions;
    private readonly root: ParentNode;
    private readonly pendingSyncByComponent = new WeakMap<Element, Promise<void>>();

    // Elements, not values: an `OnSubmit` value is read at submit, so a later edit still travels; a package's held element too, until sent.
    private readonly bufferedElements = new Set<Element>();

    // Fields with a send not yet answered, by the number of their latest: a push meanwhile (an attach's snapshot too) is recorded but not
    // written over the edit. The latest's answer lets go, since a value it replaced while waiting settles only after that answer is applied.
    private readonly unanswered = new Map<Element, number>();
    private sends = 0;

    // The text fields of a submit still waiting or unanswered, by their words at its press and the press: a push is laid under what the
    // reader typed since rather than over it (docs/VALUES.md §3).
    private readonly pressedText = new Map<Element, { readonly text: string; readonly press: object }>();

    // Fields typed in since their last send: a reload carries what they hold over though no `change` has sent it yet.
    private readonly typed = new Set<Element>();

    // Fields holding a value that waited out a drop and was not sent over another writer's, by their component, which wears the mark.
    private readonly conflicted = new Map<Element, Element>();

    // An attach's snapshot is being applied: a field the reader is typing in holds its words against it (`holdTypedDuring`).
    private holdingTyped = false;

    public constructor(options: ValueBindingEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        for (const eventName of ValueSyncEventNames) {
            this.root.addEventListener(eventName, domEvent => {
                void this.handleValueEventAsync(domEvent).catch(error => {
                    logError("value binding engine failed.", error);
                });
            }, true);
        }

        // Held from the first keystroke, not the `change` that waits for blur: a push before then must not overwrite the edit.
        this.root.addEventListener("input", domEvent => this.holdEdited(domEvent), true);
        this.root.addEventListener(DraftDroppedEventName, domEvent => this.releaseDropped(domEvent));
        this.root.addEventListener("click", domEvent => this.handleClear(domEvent), true);

        // The clear takes no focus on its press: it hides once the field is empty, and a focus on it would fall to the page's body.
        this.root.addEventListener("mousedown", domEvent => {
            if (domEvent.target instanceof Element && domEvent.target.closest(`[${ClearAttribute}]`) !== null)
                domEvent.preventDefault();
        }, true);
    }

    private holdEdited(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        // Any field with a writable value, not only `data-ui-bind-value`: a text input writes through its `data-ui-bind-<id>`.
        if (!this.typed.has(domEvent.target) && resolveWritableBinding(domEvent.target, this.options.metadata) !== null) {
            // A row taken off the page takes its field out of the set too, or a long list typed in would keep every row alive.
            for (const element of this.typed) {
                if (!element.isConnected)
                    this.typed.delete(element);
            }

            this.typed.add(domEvent.target);
        }

        // A field with no form is left to `change`, which says once that it can never be submitted, not at every keystroke.
        if (this.bufferedElements.has(domEvent.target) || !domEvent.target.hasAttribute(FormIdAttribute))
            return;

        if (resolveWritableBinding(domEvent.target, this.options.metadata)?.buffered === true)
            this.bufferValue(domEvent.target);
    }

    /** A draft let go of is held no longer: the fields inside it take the server's values again. */
    private releaseDropped(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        for (const element of [...this.bufferedElements]) {
            if (domEvent.target.contains(element) || !element.isConnected) {
                this.bufferedElements.delete(element);
                this.endConflict(element);
            }
        }
    }

    /** Lets go of every edit a form holds, and answers the fields that held one, for the caller to put the server's values back into. */
    public releaseForm(formId: string): Element[] {
        const released: Element[] = [];

        for (const element of [...this.bufferedElements]) {
            // A field its row took off the page is let go of here too, rather than held for a submit that can never reach it.
            if (!element.isConnected) {
                this.bufferedElements.delete(element);
                this.endConflict(element);
                continue;
            }

            if (element.getAttribute(FormIdAttribute) !== formId)
                continue;

            this.bufferedElements.delete(element);
            this.endConflict(element);
            released.push(element);
        }

        return released;
    }

    /** Holds an element's value as the reader's until it is sent, whatever its binding mode: a package's editor with unsaved work. */
    public hold(element: Element): void {
        this.pruneDetached();
        this.bufferedElements.add(element);
    }

    /** Lets a held element go; true when it was held, for the caller to put the server's value back into it. */
    public release(element: Element): boolean {
        this.endConflict(element);

        return this.bufferedElements.delete(element);
    }

    /**
     * Whether an element holds a value the server has not taken yet (unsent or unanswered); a push is not written into it. While an
     * attach's snapshot is applied, a field the reader is typing in holds its uncommitted words too.
     */
    public isHeld(element: Element): boolean {
        return this.bufferedElements.has(element) || this.unanswered.has(element) || (this.holdingTyped && this.isBeingTyped(element));
    }

    private isBeingTyped(element: Element): boolean {
        return this.typed.has(element) && element.isConnected && document.activeElement === element;
    }

    /**
     * Applies an attach's snapshot with the field the reader is typing in held: the snapshot is the server's whole page again, and its
     * value of that field is what the reader is typing over, not news. A push outside a snapshot still lands, a later write winning.
     */
    public holdTypedDuring(apply: () => void): void {
        this.holdingTyped = true;

        try {
            apply();
        }
        finally {
            this.holdingTyped = false;
        }
    }

    /**
     * Whether a push of its bound value is kept out of the field: one it holds (`isHeld`), or a text field of a pressed submit the reader
     * typed on since the press — the push laid under the words added at the end, or left out where the press's words were edited; either
     * way the result is the reader's edit, sent as a TwoWay one is, held as an OnSubmit one is.
     */
    public holdsPush(element: Element, value: unknown): boolean {
        const pressed = this.pressedText.get(element);

        if (pressed === undefined || !isCaretField(element))
            return this.isHeld(element);

        const typed = this.options.valueReaders.readBound(element);

        if (typed === pressed.text || typeof typed !== "string")
            return this.isHeld(element);

        if (typed.startsWith(pressed.text) && (typeof value === "string" || value === null || value === undefined)) {
            const pushed = value ?? "";

            writeKeepingCaretFromEnd(element, pushed + typed.slice(pressed.text.length));
            this.pressedText.set(element, { text: pushed, press: pressed.press });
            // As the reader's typing: a counter or a growing text area follows the words.
            element.dispatchEvent(new Event("input", { bubbles: true }));
        }

        this.commitTyped(element);

        return true;
    }

    /** Sends the reader's words as a change sends them, past the commit gate, which may hold them as committed already. */
    private commitTyped(element: Element): void {
        const writable = resolveWritableBinding(element, this.options.metadata);

        if (writable === null)
            return;

        if (writable.buffered) {
            this.endConflict(element);
            this.bufferValue(element);
            return;
        }

        void this.syncValueAsync(element, writable.bindingId).catch(error => logError("value binding engine failed.", error));
    }

    // A clear affordance is a click on a separate element, not a "change" on the field.
    private handleClear(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const trigger = domEvent.target.closest(`[${ClearAttribute}]`);

        if (trigger === null)
            return;

        const componentRoot = trigger.closest(ComponentSelector);

        // An unbound field still clears its own control: its change is what a rule or interaction reading the field listens for.
        const target = componentRoot?.querySelector(`[${ClearTargetAttribute}]`)
            ?? componentRoot?.querySelector(`[${ValueBindingAttribute}]`)
            ?? componentRoot?.querySelector("input, textarea, select");

        if (target === null || target === undefined || isUneditable(target))
            return;

        clearElementValue(target);
        // An edit as the reader's own: its "input" runs the Change rules even where the change is the value last committed, which
        // the commit gate keeps from every listener.
        target.dispatchEvent(new Event("input", { bubbles: true }));
        target.dispatchEvent(new Event("change", { bubbles: true }));

        // The caret stays in the field, or arrives there from a clear pressed while it was elsewhere, so typing goes on at once.
        if (isCaretField(target) && document.activeElement !== target)
            focusAsLastInput(target);
    }

    private async handleValueEventAsync(domEvent: Event): Promise<void> {
        if (!(domEvent.target instanceof Element))
            return;

        // Whatever raised it, an engine's clamp included: a field the reader may not change sends nothing. A `toggle` still goes, as
        // a flyout closing because it turned disabled says so.
        if (domEvent.type === "change" && (isReadOnly(domEvent.target) || isInert(domEvent.target)))
            return;

        const writable = resolveWritableBinding(domEvent.target, this.options.metadata);

        if (writable === null)
            return;

        // Not sent, and an OnSubmit field's error stops its form's submit: the controller keeps the last value it took.
        if (domEvent.type === "change" && this.options.refuses?.(domEvent.target) === true)
            return;

        if (writable.buffered) {
            // The reader's next edit: held for the next submit as any edit is, the conflict over.
            this.endConflict(domEvent.target);
            this.bufferValue(domEvent.target);
            return;
        }

        // A value sent is held no longer: a package held it only while it was unsent.
        this.bufferedElements.delete(domEvent.target);
        await this.syncValueAsync(domEvent.target, writable.bindingId);
    }

    /** Holds an `OnSubmit` value back until its form is submitted; a field with no form id could never be submitted. */
    private bufferValue(element: Element): void {
        if (element.getAttribute(FormIdAttribute) === null) {
            logWarn("value binding engine: an OnSubmit value has no form to be submitted with.", { element: element.tagName });
            return;
        }

        if (!this.bufferedElements.has(element))
            this.pruneDetached();

        this.bufferedElements.add(element);
    }

    /** Lets go of held fields their rows took off the page: a set of elements would otherwise keep every removed row alive. */
    private pruneDetached(): void {
        for (const element of this.bufferedElements) {
            if (!element.isConnected)
                this.bufferedElements.delete(element);
        }

        for (const element of this.conflicted.keys()) {
            if (!element.isConnected)
                this.conflicted.delete(element);
        }
    }

    /**
     * A form as it stands at a submit's press: its buffered values, which a submit that waits for its pickers' uploads sends, and its
     * text fields' words, which a push until `close` is laid under rather than over (`holdsPush`).
     */
    public pressForm(formId: string): PressedForm {
        const values = new Map<Element, unknown>();
        const press = {};
        const fields: Element[] = [];

        for (const element of this.bufferedElements) {
            if (element.isConnected && element.getAttribute(FormIdAttribute) === formId && !this.conflicted.has(element))
                values.set(element, this.options.valueReaders.readBound(element));
        }

        for (const field of this.root.querySelectorAll(`[${FormIdAttribute}="${cssAttributeValue(formId)}"]`)) {
            const text = isCaretField(field) && field.hasAttribute(ValueBindingAttribute) ? this.options.valueReaders.readBound(field) : null;

            if (typeof text === "string") {
                this.pressedText.set(field, { text, press });
                fields.push(field);
            }
        }

        return {
            values,
            close: () => {
                // A later press of the same form keeps its own words.
                for (const field of fields) {
                    if (this.pressedText.get(field)?.press === press)
                        this.pressedText.delete(field);
                }
            }
        };
    }

    /**
     * Writes back every buffered value of this form in one pass, before the submit command runs. Given the values read at the press,
     * those go rather than the fields' own, but for the ones `readsNow` names — a picker's, whose upload the submit waited for.
     */
    public async submitFormAsync(formId: string, pressed?: FormValues, readsNow?: (element: Element) => boolean): Promise<void> {
        const pending: Promise<void>[] = [];

        for (const element of [...this.bufferedElements]) {
            // Held over another writer's value, it goes only with the reader's next edit of it; the submit is refused (`conflictedField`).
            if (element.getAttribute(FormIdAttribute) !== formId || this.conflicted.has(element))
                continue;

            const current = pressed === undefined || readsNow?.(element) === true;

            // First edited while the submit waited: the next submit's.
            if (pressed !== undefined && !current && !pressed.has(element))
                continue;

            const value = pressed === undefined || current ? this.options.valueReaders.readBound(element) : pressed.get(element);

            // An edit made while the submit waited stays the reader's, held for the next submit: the press's value goes.
            if (current || !element.isConnected || areValuesEqual(value, this.options.valueReaders.readBound(element)))
                this.bufferedElements.delete(element);

            if (!element.isConnected)
                continue;

            const writable = resolveWritableBinding(element, this.options.metadata);

            if (writable !== null)
                pending.push(this.syncValueAsync(element, writable.bindingId, value));
        }

        await Promise.all(pending);
    }

    private async syncValueAsync(element: Element, bindingIdText: string, value: unknown = this.options.valueReaders.readBound(element)): Promise<void> {
        const binding = this.options.metadata.getBindingById(Number(bindingIdText));
        const propertyName = binding === undefined
            ? undefined
            : this.options.metadata.getPropertyDefinition(binding.propertyId)?.propertyName;

        if (binding === undefined || propertyName === undefined) {
            logWarn("value binding engine: binding metadata not found.", { bindingIdText });
            return;
        }

        const resolved = this.options.dom.resolveNearestComponent(element, () => true);

        if (resolved === null)
            return;

        this.typed.delete(element);

        // Sent now by the reader's next edit, over another writer's value deliberately: the conflict is said no longer.
        this.endConflict(element);

        // Published before it is awaited, so a command raised by the same edit can wait on it.
        const sync = this.dispatchAndApplyAsync(element, propertyName, resolved, binding, value);

        this.pendingSyncByComponent.set(resolved.element, sync);

        try {
            await sync;
        } finally {
            // Only our own entry: a later edit may already have replaced it with a newer sync.
            if (this.pendingSyncByComponent.get(resolved.element) === sync)
                this.pendingSyncByComponent.delete(resolved.element);
        }
    }

    private async dispatchAndApplyAsync(element: Element, propertyName: string, resolved: ComponentResolveResult, binding: WebRenderPropertyReferenceMetadata, value: unknown): Promise<void> {
        const send = this.holdUnanswered(element);
        const answer = (): void => this.releaseUnanswered(element, send);

        try {
            // Let go and recorded just before the answer is applied: a value the server's answer carries is newer than the one sent.
            await this.options.dispatcher.dispatchAsync({
                componentId: resolved.componentId,
                propertyName,
                dynamicParameters: resolved.dynamicParameters,
                value
            }, () => {
                answer();
                this.options.recordSent(binding, resolved.dynamicParameters, value);
            }, this.unchangedSince(binding, resolved.dynamicParameters));
        }
        catch (error) {
            if (!(error instanceof ValueConflict))
                throw error;

            this.holdConflicted(element, resolved.element);
        }
        finally {
            answer();
        }
    }

    /**
     * The reader's words stay in the field, held from the server's value, and the field says why. Only the reader's next edit of the
     * field sends them; a submit of its form leaves them out and is refused (`conflictedField`).
     */
    private holdConflicted(element: Element, component: Element): void {
        this.bufferedElements.add(element);
        this.conflicted.set(element, component);
        this.options.markConflict?.(component, true);
    }

    /** Takes a field out of its conflict, and its mark off: the reader edited it, or its edit was let go of. */
    private endConflict(element: Element): void {
        const marked = this.conflicted.get(element);

        if (marked === undefined)
            return;

        this.conflicted.delete(element);
        this.options.markConflict?.(marked, false);
    }

    /** The component of a field of the form held over another writer's value, which refuses the form's submit; null where none is. */
    public conflictedField(formId: string): Element | null {
        for (const [element, component] of this.conflicted) {
            if (element.isConnected && element.getAttribute(FormIdAttribute) === formId)
                return component;
        }

        return null;
    }

    /**
     * What the edit started from — the server's value the page held when it was sent — weighed again after a drop: unchanged where the
     * server still holds it, or holds one of the reader's own values (a dropped send reached it after all); none where the page held no
     * value.
     */
    private unchangedSince(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[]): UnchangedSince | undefined {
        const read = this.options.readRecorded;
        const start = read?.(reference, dynamicParameters);

        if (read === undefined || start === undefined)
            return undefined;

        return own => {
            const now = read(reference, dynamicParameters);

            return now === undefined || areValuesEqual(now, start) || own.some(value => areValuesEqual(now, value));
        };
    }

    private holdUnanswered(element: Element): number {
        const send = ++this.sends;

        this.unanswered.set(element, send);

        return send;
    }

    /** Lets the field go once its latest send is answered; an earlier one's answer leaves it held for the value still on its way. */
    private releaseUnanswered(element: Element, send: number): void {
        if (this.unanswered.get(element) === send)
            this.unanswered.delete(element);
    }

    /** Sends a value an interaction wrote, when its property binds back, so state the page changed itself is the server's too. */
    public async syncPropertyAsync(componentId: number, propertyId: string, dynamicParameters: readonly unknown[], value: unknown): Promise<void> {
        const binding = this.options.metadata.getBindingByComponentAndPropertyId(componentId, propertyId);

        if (binding === undefined || !isWritableMode(binding.mode) || isBufferedMode(binding.mode))
            return;

        const propertyName = this.options.metadata.getPropertyDefinition(propertyId)?.propertyName;

        if (propertyName === undefined)
            return;

        await this.options.dispatcher.dispatchAsync({ componentId, propertyName, dynamicParameters, value }, () => this.options.recordSent({ componentId, propertyId }, dynamicParameters, value));
    }

    /** Resolves once this component's in-flight value sync has been applied; a no-op if there is none. */
    public async whenSettled(component: Element): Promise<void> {
        await this.pendingSyncByComponent.get(component);
    }

    /** Resolves once every value sent so far, any component's, has been handed to the hub — a large one after its staging. */
    public whenSent(): Promise<void> {
        return this.options.dispatcher.whenSent();
    }

    /**
     * Every value a field holds that the server has not taken — unsent, unanswered, held over another writer's, or typed in and not
     * committed yet — for a reload to carry over. A password and a value that is not plain JSON (a picker's uploads) are left out.
     */
    public unsavedValues(): UnsavedValue[] {
        const values: UnsavedValue[] = [];
        const fields = new Set<Element>([...this.bufferedElements, ...this.unanswered.keys(), ...this.typed]);

        for (const element of fields) {
            if (!element.isConnected || isSensitive(element))
                continue;

            const writable = resolveWritableBinding(element, this.options.metadata);
            const resolved = this.options.dom.resolveNearestComponent(element, () => true);

            if (writable === null || writable.binding === undefined || resolved === null)
                continue;

            const value = this.options.valueReaders.readBound(element);

            if (!isPlainValue(value))
                continue;

            const start = this.options.readRecorded?.(writable.binding, resolved.dynamicParameters);

            // Typed and left as the server has it, or written over by a push since: nothing of the reader's to carry over.
            if (!this.isHeld(element) && areValuesEqual(value, start))
                continue;

            values.push({
                bindingId: writable.bindingId,
                dynamicParameters: resolved.dynamicParameters,
                value,
                ...(start !== undefined && isPlainValue(start) ? { start } : {}),
                ...(this.conflicted.has(element) ? { conflicted: true } : {})
            });
        }

        return values;
    }

    /**
     * Puts carried-over values back into their fields and has each go as the reader's edit: written, then `input` and `change` raised,
     * so a TwoWay field sends it, an OnSubmit field holds it and the field's rules judge it. One whose field another writer changed
     * since the edit started, or that was held over another's already, is written but held and marked, as a value that waited out a
     * drop is (`ValueConflict`). A field gone, closed to the reader, or already holding the value is left as it is; answers how many
     * were put back.
     */
    public restoreUnsaved(values: readonly UnsavedValue[], write: (element: Element, bindingId: number, value: unknown) => boolean): number {
        let restored = 0;

        for (const unsaved of values) {
            const field = this.findField(unsaved);
            const binding = this.options.metadata.getBindingById(Number(unsaved.bindingId));

            if (field === null || binding === undefined || isReadOnly(field.element) || isInert(field.element) || isSensitive(field.element))
                continue;

            if (areValuesEqual(this.options.valueReaders.readBound(field.element), unsaved.value) || !write(field.element, Number(unsaved.bindingId), unsaved.value))
                continue;

            restored++;

            if (unsaved.conflicted === true || this.changedSince(unsaved, binding)) {
                this.holdConflicted(field.element, field.component);
                continue;
            }

            field.element.dispatchEvent(new Event("input", { bubbles: true }));
            field.element.dispatchEvent(new Event("change", { bubbles: true }));
        }

        return restored;
    }

    /** The field whose writable value goes through the binding, in the row the keys name; a control or a `data-ui-bind-value` element. */
    private findField(unsaved: UnsavedValue): { readonly element: Element; readonly component: Element } | null {
        for (const element of this.root.querySelectorAll(`input, textarea, select, [${ValueBindingAttribute}]`)) {
            if (resolveWritableBinding(element, this.options.metadata)?.bindingId !== unsaved.bindingId)
                continue;

            const resolved = this.options.dom.resolveNearestComponent(element, () => true);

            if (resolved !== null && areValuesEqual(resolved.dynamicParameters, unsaved.dynamicParameters))
                return { element, component: resolved.element };
        }

        return null;
    }

    /** Whether the server now holds neither what the carried-over edit started from nor the edit itself; false where either is unknown. */
    private changedSince(unsaved: UnsavedValue, binding: WebRenderPropertyReferenceMetadata): boolean {
        const now = this.options.readRecorded?.(binding, unsaved.dynamicParameters);

        return "start" in unsaved && now !== undefined && !areValuesEqual(now, unsaved.start) && !areValuesEqual(now, unsaved.value);
    }
}

// A password, a one-time code or a card's field never goes into the tab's storage, which outlives the page. Matched per token:
// `autocomplete` is a list ("section-pay billing cc-number").
const SensitiveAutocompleteToken = /password$|^one-time-code$|^cc-/;

function isSensitive(element: Element): boolean {
    // What the field is, not its type now: a password shown in the clear has type "text" and keeps the renderer's mark.
    if (element.hasAttribute(SecretFieldAttribute) || (element as HTMLInputElement).type === "password")
        return true;

    return (element.getAttribute("autocomplete") ?? "").toLowerCase().split(/\s+/).some(token => SensitiveAutocompleteToken.test(token));
}

/** Whether a value is what a reload can carry in the tab's storage and put back: a string, number, flag or null, or a list of them. */
function isPlainValue(value: unknown): boolean {
    const plain = (item: unknown): boolean => item === null || typeof item === "string" || typeof item === "boolean" || (typeof item === "number" && Number.isFinite(item));

    return plain(value) || (Array.isArray(value) && value.every(plain));
}

/** Writes a field's words, a caret the reader holds in it kept as far from the end as it was. */
function writeKeepingCaretFromEnd(field: HTMLInputElement | HTMLTextAreaElement, text: string): void {
    const fromEnd = document.activeElement === field && typeof field.selectionEnd === "number" ? field.value.length - field.selectionEnd : null;

    field.value = text;

    if (fromEnd !== null) {
        const caret = Math.max(0, text.length - fromEnd);

        field.setSelectionRange(caret, caret);
    }
}

/** A field the reader may not change: its clear affordance must not change it either. */
function isUneditable(element: Element): boolean {
    return element.matches(":disabled") || ((element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) && element.readOnly);
}
