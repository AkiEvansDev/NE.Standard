import { BindingAttributePrefix, ComponentSelector } from "../addressing/dom-attributes";
import { ComponentResolveResult, DomRegistry } from "../addressing/dom-registry";
import { clearElementValue, readBoundElementValue } from "../extensions/value-readers";
import { MetadataIndex, WebBindingMode, getBindingMode } from "../metadata/metadata-index";
import { logError, logWarn } from "../runtime/logger";
import { ValueChangeDispatcher } from "../transport/value-change-dispatcher";
import { UpdateProcessor } from "./update-processor";

const ValueBindingAttribute = "data-ui-bind-value";
const ClearAttribute = "data-ui-clear";
const FormIdAttribute = "data-ui-form-id";

export const ValueSyncEventNames: readonly string[] = ["change", "toggle"];

/**
 * Every mode the runtime accepts a client value for. `OneWayToSource` is the write-only half of `TwoWay`:
 * the server never pushes it back, so the value the element starts with is the one it was rendered with.
 * `OnSubmit` writes back too, but the write is held until the form it belongs to is submitted.
 */
function isWritableMode(mode: WebBindingMode): boolean {
    const name = getBindingMode(mode);

    return name === "TwoWay" || name === "OneWayToSource" || name === "OnSubmit";
}

function isBufferedMode(mode: WebBindingMode): boolean {
    return getBindingMode(mode) === "OnSubmit";
}

export type ValueBindingEngineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly dispatcher: ValueChangeDispatcher;
    readonly updateProcessor: UpdateProcessor;
};

export class ValueBindingEngine {
    private readonly root: ParentNode;
    private readonly pendingSyncByComponent = new WeakMap<Element, Promise<void>>();

    // An `OnSubmit` binding does not push on change: the element is remembered here and written back when
    // the form it carries is submitted. Elements, not values — the value is read at submit time, so an edit
    // made after the last change event still travels.
    private readonly bufferedElements = new Set<Element>();

    public constructor(private readonly options: ValueBindingEngineOptions) {
        this.root = options.root ?? document;

        for (const eventName of ValueSyncEventNames) {
            this.root.addEventListener(eventName, domEvent => {
                void this.handleValueEventAsync(domEvent).catch(error => {
                    logError("value binding engine failed.", error);
                });
            }, true);
        }

        this.root.addEventListener("click", domEvent => this.handleClear(domEvent), true);
    }

    // A clear affordance is a click on a separate element, not a "change" on the field, so it needs its own
    // path to push the empty value back.
    private handleClear(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const trigger = domEvent.target.closest(`[${ClearAttribute}]`);

        if (trigger === null)
            return;

        const componentRoot = trigger.closest(ComponentSelector);
        const bound = componentRoot?.querySelector(`[${ValueBindingAttribute}]`);

        if (bound === null || bound === undefined)
            return;

        clearElementValue(bound);
        bound.dispatchEvent(new Event("change", { bubbles: true }));
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

        await this.syncValueAsync(domEvent.target, writable.bindingId);
    }

    /**
     * Holds an `OnSubmit` value back until its form is submitted. A field with no form id can never be
     * submitted, so it is refused at compile time rather than silently buffered forever — this warns only if
     * one reaches the client anyway (a plugin renderer that forgot to emit the attribute).
     */
    private bufferValue(element: Element): void {
        if (element.getAttribute(FormIdAttribute) === null) {
            logWarn("value binding engine: an OnSubmit value has no form to be submitted with.", { element: element.tagName });
            return;
        }

        this.bufferedElements.add(element);
    }

    /**
     * Writes back every buffered value belonging to this form, in one pass before the submit command runs, so
     * the controller sees the whole form rather than the field that happened to change last.
     */
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

    /**
     * The binding this element writes back through. `Value` is an element's value wherever it has one;
     * otherwise the element's one *writable* binding is it — one element carries one writable value, which is
     * the rule the renderers are written to (docs/PROJECT.md §7).
     *
     * Read off the element rather than matched against a list of known attributes: that list had to gain an
     * entry for every component that made a second property writable, and nothing failed when it did not —
     * the value simply never went back.
     */
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

        if (propertyName === undefined) {
            logWarn("value binding engine: binding metadata not found.", { bindingIdText });
            return;
        }

        const resolved = this.options.dom.resolveNearestComponent(element, () => true);

        if (resolved === null)
            return;

        // Published before it is awaited: a command raised by the same edit calls whenSettled to wait for the
        // value's answer, and must not run for a value the controller refused.
        const sync = this.dispatchAndApplyAsync(element, propertyName, resolved);

        this.pendingSyncByComponent.set(resolved.element, sync);

        try {
            await sync;
        } finally {
            // Only clear our own entry — a later edit may already have replaced it with a newer sync.
            if (this.pendingSyncByComponent.get(resolved.element) === sync)
                this.pendingSyncByComponent.delete(resolved.element);
        }
    }

    private async dispatchAndApplyAsync(element: Element, propertyName: string, resolved: ComponentResolveResult): Promise<void> {
        const changes = await this.options.dispatcher.dispatchAsync({
            componentId: resolved.componentId,
            propertyName,
            dynamicParameters: resolved.dynamicParameters,
            value: readBoundElementValue(element)
        });

        this.options.updateProcessor.applyChangeSet(changes);
    }

    /** Resolves once this component's in-flight value sync has been applied; a no-op if there is none. */
    public async whenSettled(component: Element): Promise<void> {
        await this.pendingSyncByComponent.get(component);
    }
}
