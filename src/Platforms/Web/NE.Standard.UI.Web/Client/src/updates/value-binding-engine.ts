// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { BindingAttributePrefix, ComponentSelector, FormIdAttribute, ValueBindingAttribute } from "../addressing/dom-attributes.ts";
import type { ComponentResolveResult, DomRegistry } from "../addressing/dom-registry.ts";
import { clearElementValue } from "../extensions/value-readers.ts";
import type { ValueReaderRegistry } from "../extensions/value-readers.ts";
import { isCaretField } from "../interactions/caret-fields.ts";
import { DraftDroppedEventName } from "../interactions/draft-events.ts";
import { focusAsLastInput } from "../interactions/popup-focus.ts";
import { getBindingMode } from "../metadata/metadata-index.ts";
import type { MetadataIndex, WebBindingMode, WebRenderBindingMetadata, WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index.ts";
import { logError, logWarn } from "../runtime/logger.ts";
import type { ValueChangeDispatcher } from "../transport/value-change-dispatcher.ts";

const ClearAttribute = "data-ui-clear";

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
};

export class ValueBindingEngine {
    private readonly options: ValueBindingEngineOptions;
    private readonly root: ParentNode;
    private readonly pendingSyncByComponent = new WeakMap<Element, Promise<void>>();

    // Elements, not values: an `OnSubmit` value is read at submit, so a later edit still travels; a package's held element too, until sent.
    private readonly bufferedElements = new Set<Element>();

    // Fields with sends not yet answered, by count: a push meanwhile (an attach's snapshot too) is recorded but not written over the edit.
    private readonly unanswered = new Map<Element, number>();

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
        // A field with no form is left to `change`, which says once that it can never be submitted, not at every keystroke.
        if (!(domEvent.target instanceof Element) || this.bufferedElements.has(domEvent.target) || !domEvent.target.hasAttribute(FormIdAttribute))
            return;

        if (resolveWritableBinding(domEvent.target, this.options.metadata)?.buffered === true)
            this.bufferValue(domEvent.target);
    }

    /** A draft let go of is held no longer: the fields inside it take the server's values again. */
    private releaseDropped(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        for (const element of [...this.bufferedElements]) {
            if (domEvent.target.contains(element) || !element.isConnected)
                this.bufferedElements.delete(element);
        }
    }

    /** Lets go of every edit a form holds, and answers the fields that held one, for the caller to put the server's values back into. */
    public releaseForm(formId: string): Element[] {
        const released: Element[] = [];

        for (const element of [...this.bufferedElements]) {
            // A field its row took off the page is let go of here too, rather than held for a submit that can never reach it.
            if (!element.isConnected) {
                this.bufferedElements.delete(element);
                continue;
            }

            if (element.getAttribute(FormIdAttribute) !== formId)
                continue;

            this.bufferedElements.delete(element);
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
        return this.bufferedElements.delete(element);
    }

    /** Whether an element holds a value the server has not taken yet (unsent or unanswered); a push is not written into it. */
    public isHeld(element: Element): boolean {
        return this.bufferedElements.has(element) || this.unanswered.has(element);
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
        const target = componentRoot?.querySelector(`[${ValueBindingAttribute}]`) ?? componentRoot?.querySelector("input, textarea, select");

        if (target === null || target === undefined || isUneditable(target))
            return;

        clearElementValue(target);
        target.dispatchEvent(new Event("change", { bubbles: true }));

        // The caret stays in the field, or arrives there from a clear pressed while it was elsewhere, so typing goes on at once.
        if (isCaretField(target) && document.activeElement !== target)
            focusAsLastInput(target);
    }

    private async handleValueEventAsync(domEvent: Event): Promise<void> {
        if (!(domEvent.target instanceof Element))
            return;

        const writable = resolveWritableBinding(domEvent.target, this.options.metadata);

        if (writable === null)
            return;

        if (writable.buffered) {
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
    }

    /** Writes back every buffered value of this form in one pass, before the submit command runs. */
    public async submitFormAsync(formId: string): Promise<void> {
        const pending: Promise<void>[] = [];

        for (const element of [...this.bufferedElements]) {
            if (element.getAttribute(FormIdAttribute) !== formId)
                continue;

            this.bufferedElements.delete(element);

            if (!element.isConnected)
                continue;

            const writable = resolveWritableBinding(element, this.options.metadata);

            if (writable !== null)
                pending.push(this.syncValueAsync(element, writable.bindingId));
        }

        await Promise.all(pending);
    }

    private async syncValueAsync(element: Element, bindingIdText: string): Promise<void> {
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

        // Published before it is awaited, so a command raised by the same edit can wait on it.
        const sync = this.dispatchAndApplyAsync(element, propertyName, resolved, binding);

        this.pendingSyncByComponent.set(resolved.element, sync);

        try {
            await sync;
        } finally {
            // Only our own entry: a later edit may already have replaced it with a newer sync.
            if (this.pendingSyncByComponent.get(resolved.element) === sync)
                this.pendingSyncByComponent.delete(resolved.element);
        }
    }

    private async dispatchAndApplyAsync(element: Element, propertyName: string, resolved: ComponentResolveResult, binding: WebRenderPropertyReferenceMetadata): Promise<void> {
        const value = this.options.valueReaders.readBound(element);
        let answered = false;
        const answer = (): void => {
            if (answered)
                return;

            answered = true;
            this.releaseUnanswered(element);
        };

        this.holdUnanswered(element);

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
            });
        }
        finally {
            answer();
        }
    }

    private holdUnanswered(element: Element): void {
        this.unanswered.set(element, (this.unanswered.get(element) ?? 0) + 1);
    }

    private releaseUnanswered(element: Element): void {
        const count = this.unanswered.get(element) ?? 0;

        if (count <= 1)
            this.unanswered.delete(element);
        else
            this.unanswered.set(element, count - 1);
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
}

/** A field the reader may not change: its clear affordance must not change it either. */
function isUneditable(element: Element): boolean {
    return element.matches(":disabled") || ((element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) && element.readOnly);
}
