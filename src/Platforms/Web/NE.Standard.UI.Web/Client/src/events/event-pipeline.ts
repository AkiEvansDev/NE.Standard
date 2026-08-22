import { SubmitFormIdAttribute } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { CommandDispatcher } from "../transport/command-dispatcher";
import { EffectRegistry } from "../effects/effect-registry";
import { EventCatalog } from "../extensions/events";
import { InteractionEngine } from "../interactions/interaction-engine";
import { ValidationEngine } from "../interactions/validation-engine";
import { MetadataIndex } from "../metadata/metadata-index";
import { ServerChangeSet } from "../metadata/metadata-index";
import { ValueBindingEngine, ValueSyncEventNames } from "../updates/value-binding-engine";
import { EventDispatchContext, EventRegistration, RegisteredEvent } from "./event-descriptor";
import { EventRegistry } from "./event-registry";
import { EventRequestFactory } from "./event-request-factory";
import { logError } from "../runtime/logger";

export type EventPipelineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly dispatcher: CommandDispatcher;

    /**
     * How a command's answer reaches the page. Deliberately the host's own entry point rather than the update
     * processor: a change set that moved a windowed or virtualized collection also has to move the spacers
     * standing for the rows nobody sent, and calling the processor straight from here skipped that for every
     * command a button fires.
     */
    readonly applyChanges: (changes: ServerChangeSet | undefined) => void;

    /** Run once the command's effects have been applied, for whatever has to look at the DOM they moved. */
    readonly afterEffects?: () => void;

    readonly interactionEngine: InteractionEngine;
    readonly eventCatalog: EventCatalog;
    readonly effects: EffectRegistry;
    readonly events?: Iterable<EventRegistration>;
    
    readonly validationEngine?: ValidationEngine;
    
    readonly valueBinding?: ValueBindingEngine;
};

export class EventPipeline {
    private readonly root: ParentNode;
    private readonly registry: EventRegistry;
    private readonly requestFactory = new EventRequestFactory();

    public constructor(private readonly options: EventPipelineOptions) {
        this.root = options.root ?? document;
        this.registry = new EventRegistry(options.eventCatalog);

        this.addEvent("click");

        for (const event of options.events ?? [])
            this.addEvent(event.name, event);
    }

    public addEvent<TEvent extends Event = Event>(name: string, registration: Omit<EventRegistration<TEvent>, "name"> = {}): void {
        const registered = this.registry.add(name, registration);

        if (this.shouldAttach(registered))
            this.attachEvent(registered);
    }

    private shouldAttach(event: RegisteredEvent): boolean {
        return this.options.metadata.hasServerEvent(event.name) ||
            this.options.interactionEngine.hasEvent(event.name) ||
            this.options.interactionEngine.hasEvent(`before-${event.name}`) ||
            this.options.interactionEngine.hasEvent(`after-${event.name}`);
    }

    private attachEvent(registered: RegisteredEvent): void {
        if (!this.registry.markAttached(registered.name))
            return;

        const dispatch = (domEvent: Event): void => {
            void this.handleDomEventAsync(registered.name, domEvent).catch(error => {
                logError("event pipeline failed.", error);
            });
        };

        const definition = this.options.eventCatalog.get(registered.name);

        if (definition !== undefined)
            definition.attach({ root: this.root, dispatch });
        else
            this.root.addEventListener(registered.domEventName, dispatch, true);
    }

    private async handleDomEventAsync(eventName: string, domEvent: Event): Promise<void> {
        if (!(domEvent.target instanceof Element))
            return;

        const registration = this.registry.get(eventName);

        if (registration === undefined)
            return;

        const resolved = this.options.dom.resolveNearestComponent(
            domEvent.target,
            componentId => this.shouldHandleComponent(eventName, componentId)
        );

        if (resolved === null)
            return;

        const serverEvent = this.options.metadata.getEvent(resolved.componentId, eventName);
        const context: EventDispatchContext = {
            domEvent,
            metadata: serverEvent,
            component: resolved.element,
            componentId: resolved.componentId,
            dynamicParameters: resolved.dynamicParameters
        };

        this.applyDomPolicy(registration, context);

        const request = this.requestFactory.create(registration, context);

        if (request === null) {
            this.options.interactionEngine.applyEvent({
                name: eventName,
                componentId: context.componentId,
                dynamicParameters: context.dynamicParameters,
                domEvent
            });
            return;
        }

        if (this.options.dispatcher.isPending(request)) {
            domEvent.preventDefault();
            return;
        }

        const submitFormId = resolved.element.getAttribute(SubmitFormIdAttribute);

        if (submitFormId !== null) {
            if (this.options.validationEngine?.runSubmitValidation(submitFormId) === false) {
                domEvent.preventDefault();
                return;
            }

            // After validation and before the command: an OnSubmit field holds its value back until here, and
            // the command has to run against the form the user is looking at.
            await this.options.valueBinding?.submitFormAsync(submitFormId);
        }

        if (await this.isRefusedValueEventAsync(eventName, resolved.element))
            return;

        // Checked after the awaits above, not before them: the identical request may have been dispatched
        // while this one was waiting on validation or on the value sync.
        if (this.options.dispatcher.isPending(request))
            return;

        this.options.interactionEngine.applyEvent({
            name: `before-${eventName}`,
            componentId: context.componentId,
            dynamicParameters: context.dynamicParameters,
            domEvent
        });

        const result = await this.options.dispatcher.dispatchAsync(request);

        this.options.applyChanges(result.changes);

        // After the change set: an effect that focuses or scrolls to a component needs the DOM those changes
        // just produced.
        this.options.effects.applyAll(result.command?.effects, this.options.dom);
        this.options.afterEffects?.();

        this.options.interactionEngine.applyEvent({
            name: `after-${eventName}`,
            componentId: context.componentId,
            dynamicParameters: context.dynamicParameters,
            domEvent
        });
    }

    // An .OnChange command must not run for a value the controller never took, so it waits for that value's
    // own round-trip and stands down if the server answered with a validation refusal.
    private async isRefusedValueEventAsync(eventName: string, component: Element): Promise<boolean> {
        if (!ValueSyncEventNames.includes(eventName))
            return false;

        await this.options.valueBinding?.whenSettled(component);

        return this.options.validationEngine?.isRefused(component) === true;
    }

    private shouldHandleComponent(eventName: string, componentId: number): boolean {
        return this.options.metadata.hasServerEventForComponent(eventName, componentId) ||
            this.options.interactionEngine.hasEventForComponent(eventName, componentId) ||
            this.options.interactionEngine.hasEventForComponent(`before-${eventName}`, componentId) ||
            this.options.interactionEngine.hasEventForComponent(`after-${eventName}`, componentId);
    }

    private applyDomPolicy(registration: RegisteredEvent, context: EventDispatchContext): void {
        if (shouldApplyPolicy(registration.preventDefault, context))
            context.domEvent.preventDefault();

        if (shouldApplyPolicy(registration.stopPropagation, context))
            context.domEvent.stopPropagation();
    }
}

function shouldApplyPolicy(
    policy: boolean | ((context: EventDispatchContext) => boolean) | undefined,
    context: EventDispatchContext
): boolean {
    if (policy === undefined)
        return false;

    return typeof policy === "function" ? policy(context) : policy;
}
