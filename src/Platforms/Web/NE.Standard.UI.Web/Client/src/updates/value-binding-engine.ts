import { BindingAttributePrefix, ComponentSelector, ValueBindingAttribute } from "../addressing/dom-attributes";
import { ComponentResolveResult, DomRegistry } from "../addressing/dom-registry";
import { ValueReaderRegistry, clearElementValue } from "../extensions/value-readers";
import { DraftDroppedEventName } from "../interactions/draft-events";
import { MetadataIndex, ServerChangeSet, WebBindingMode, WebRenderPropertyReferenceMetadata, getBindingMode } from "../metadata/metadata-index";
import { logError, logWarn } from "../runtime/logger";
import { ValueChangeDispatcher } from "../transport/value-change-dispatcher";

const ClearAttribute = "data-ui-clear";
const FormIdAttribute = "data-ui-form-id";

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

export type ValueBindingEngineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly dispatcher: ValueChangeDispatcher;
    // The runtime's, not the update processor's: a value the server answered can move a windowed host, whose spacers are laid out after the change set.
    readonly applyChanges: (changes: ServerChangeSet | undefined) => void | Promise<void>;
    readonly valueReaders: ValueReaderRegistry;
    /** Records a value this client sent as the property's latest, so a push of an older value is still a change. */
    readonly recordSent: (reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown) => void;
};

export class ValueBindingEngine {
    private readonly options: ValueBindingEngineOptions;
    private readonly root: ParentNode;
    private readonly pendingSyncByComponent = new WeakMap<Element, Promise<void>>();

    // Elements, not values: an `OnSubmit` value is read at submit time, so a later edit still travels. An element a package holds
    // is here too, until its value is sent.
    private readonly bufferedElements = new Set<Element>();

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

        // Held from the first keystroke, not the first `change`, which waits for blur: a push before then must not overwrite the edit.
        this.root.addEventListener("input", domEvent => this.holdEdited(domEvent), true);
        this.root.addEventListener(DraftDroppedEventName, domEvent => this.releaseDropped(domEvent));
        this.root.addEventListener("click", domEvent => this.handleClear(domEvent), true);
    }

    private holdEdited(domEvent: Event): void {
        // A field with no form is left to `change`, which says once that it can never be submitted, not at every keystroke.
        if (!(domEvent.target instanceof Element) || this.bufferedElements.has(domEvent.target) || !domEvent.target.hasAttribute(FormIdAttribute))
            return;

        if (this.resolveWritableBinding(domEvent.target)?.buffered === true)
            this.bufferValue(domEvent.target);
    }

    /** A draft let go of is held no longer: the fields inside it take the server's values again. */
    private releaseDropped(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        for (const element of [...this.bufferedElements]) {
            if (domEvent.target.contains(element))
                this.bufferedElements.delete(element);
        }
    }

    /** Lets go of every edit a form holds, and answers the fields that held one, for the caller to put the server's values back into. */
    public releaseForm(formId: string): Element[] {
        const released: Element[] = [];

        for (const element of [...this.bufferedElements]) {
            if (element.getAttribute(FormIdAttribute) !== formId)
                continue;

            this.bufferedElements.delete(element);
            released.push(element);
        }

        return released;
    }

    /** Holds an element's value as the reader's until it is sent, whatever its binding mode: a package's editor with unsaved work. */
    public hold(element: Element): void {
        this.bufferedElements.add(element);
    }

    /** Lets a held element go; true when it was held, for the caller to put the server's value back into it. */
    public release(element: Element): boolean {
        return this.bufferedElements.delete(element);
    }

    /** Whether an element holds an `OnSubmit` value its form has not sent yet; a value the server pushes is not written into it. */
    public isHeld(element: Element): boolean {
        return this.bufferedElements.has(element);
    }

    // A clear affordance is a click on a separate element, not a "change" on the field.
    private handleClear(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const trigger = domEvent.target.closest(`[${ClearAttribute}]`);

        if (trigger === null)
            return;

        const componentRoot = trigger.closest(ComponentSelector);

        // A field nobody binds still clears: the value element is the field's own control, and the change it dispatches is what
        // a rule or interaction reading the field listens for.
        const target = componentRoot?.querySelector(`[${ValueBindingAttribute}]`) ?? componentRoot?.querySelector("input, textarea, select");

        if (target === null || target === undefined)
            return;

        clearElementValue(target);
        target.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private async handleValueEventAsync(domEvent: Event): Promise<void> {
        if (!(domEvent.target instanceof Element))
            return;

        const writable = this.resolveWritableBinding(domEvent.target);

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

        this.bufferedElements.add(element);
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

            const writable = this.resolveWritableBinding(element);

            if (writable !== null)
                pending.push(this.syncValueAsync(element, writable.bindingId));
        }

        await Promise.all(pending);
    }

    /** The binding this element writes back through, read off the element: one element carries one writable value. */
    private resolveWritableBinding(element: Element): { readonly bindingId: string; readonly buffered: boolean } | null {
        const value = element.getAttribute(ValueBindingAttribute);

        if (value !== null) {
            const bound = this.options.metadata.getBindingById(Number(value));

            return { bindingId: value, buffered: bound !== undefined && isBufferedMode(bound.mode) };
        }

        for (const attribute of Array.from(element.attributes)) {
            if (!attribute.name.startsWith(BindingAttributePrefix))
                continue;

            const binding = this.options.metadata.getBindingById(Number(attribute.value));

            if (binding !== undefined && isWritableMode(binding.mode))
                return { bindingId: attribute.value, buffered: isBufferedMode(binding.mode) };
        }

        return null;
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
        const changes = await this.options.dispatcher.dispatchAsync({
            componentId: resolved.componentId,
            propertyName,
            dynamicParameters: resolved.dynamicParameters,
            value
        });

        // Before the answer is applied: a value the server's answer carries is newer than the one sent.
        this.options.recordSent(binding, resolved.dynamicParameters, value);
        await this.options.applyChanges(changes);
    }

    /**
     * Sends a value an interaction wrote on the client, when the property is bound to write back — the same trip a field's
     * change makes, so state the page changed by itself is the server's state too.
     */
    public async syncPropertyAsync(componentId: number, propertyId: string, dynamicParameters: readonly unknown[], value: unknown): Promise<void> {
        const binding = this.options.metadata.getBindingByComponentAndPropertyId(componentId, propertyId);

        if (binding === undefined || !isWritableMode(binding.mode) || isBufferedMode(binding.mode))
            return;

        const propertyName = this.options.metadata.getPropertyDefinition(propertyId)?.propertyName;

        if (propertyName === undefined)
            return;

        const changes = await this.options.dispatcher.dispatchAsync({ componentId, propertyName, dynamicParameters, value });

        this.options.recordSent({ componentId, propertyId }, dynamicParameters, value);
        await this.options.applyChanges(changes);
    }

    /** Resolves once this component's in-flight value sync has been applied; a no-op if there is none. */
    public async whenSettled(component: Element): Promise<void> {
        await this.pendingSyncByComponent.get(component);
    }
}
