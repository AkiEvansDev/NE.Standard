// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { eventSuppressAttribute, FormIdAttribute, SubmitFormIdAttribute } from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import type { CommandDispatcher } from "../transport/command-dispatcher.ts";
import type { EffectRegistry } from "../effects/effect-registry.ts";
import type { EventCatalog } from "../extensions/events.ts";
import type { InteractionEngine } from "../interactions/interaction-engine.ts";
import { isInert } from "../interactions/interactive-state.ts";
import type { ValidationEngine } from "../interactions/validation-engine.ts";
import type { MetadataIndex, UICommandRequest } from "../metadata/metadata-index.ts";
import { ValueSettleEventNames } from "../updates/value-binding-engine.ts";
import type { ValueBindingEngine } from "../updates/value-binding-engine.ts";
import { isBehindEventBoundary } from "./event-boundary.ts";
import { CommandTurns } from "./command-turns.ts";
import type { CommandTurn } from "./command-turns.ts";
import type { EventCompletionContext, EventDispatchContext, EventRegistration, RegisteredEvent } from "./event-descriptor.ts";
import { EventRegistry } from "./event-registry.ts";
import { EventRequestFactory } from "./event-request-factory.ts";
import { markPending, PendingDelayMilliseconds, PendingEventName } from "./pending-mark.ts";
import { logError } from "../runtime/logger.ts";

export type EventPipelineOptions = {
    readonly root?: ParentNode;
    readonly metadata: MetadataIndex;
    readonly dom: DomRegistry;
    readonly dispatcher: CommandDispatcher;

    /** How a command's answer reaches the page; the host's own entry point, not the update processor. Awaited when it names a staged value. */

    /** Run once the command's effects have been applied, for whatever has to look at the DOM they moved. */
    readonly afterEffects?: () => void;

    readonly interactionEngine: InteractionEngine;
    readonly eventCatalog: EventCatalog;
    readonly effects: EffectRegistry;
    readonly events?: Iterable<EventRegistration>;

    readonly validationEngine?: ValidationEngine;

    readonly valueBinding?: ValueBindingEngine;

    /** Whether a command sent now waits for the connection to attach again; a press then is marked pending at once. */
    readonly isReattaching?: () => boolean;
};

type EventOutcome = Pick<EventCompletionContext, "dispatched" | "success" | "error">;

/** An event the page turned away before it reached the server: nothing ran, and nothing landed. */
const Refused: EventOutcome = { dispatched: false, success: false };

/** The end of a press that shows no pending mark. */
const NoMark = (): void => undefined;

/** A command that left the page and came to nothing — the connection dropped under it — as against a failure before it was sent. */
class DispatchFailure extends Error {
    public readonly reason: unknown;

    public constructor(reason: unknown) {
        super(String(reason));
        this.reason = reason;
    }
}

export class EventPipeline {
    private readonly options: EventPipelineOptions;
    private readonly root: ParentNode;
    private readonly registry: EventRegistry;
    private readonly requestFactory = new EventRequestFactory();
    private readonly turns = new CommandTurns();

    public constructor(options: EventPipelineOptions) {
        this.options = options;
        this.root = options.root ?? document;
        this.registry = new EventRegistry(options.eventCatalog);

        this.addEvent("click");

        for (const event of options.events ?? [])
            this.addEvent(event.name, event);
    }

    /**
     * Registers an event and attaches it where the view raises it. A registration saying how the event is heard — a package's, whose
     * module runs after the view's own events were attached bare — attaches it again, the bare listener left in place but unheard:
     * attaching the view's events later instead would put them after the engines started since, whose order on the root is load-bearing.
     */
    public addEvent<TEvent extends Event = Event>(name: string, registration: Omit<EventRegistration<TEvent>, "name"> = {}): void {
        const registered = this.registry.add(name, registration);
        const hearsAnew = registration.attach !== undefined || registration.domEventName !== undefined || registration.options !== undefined;

        if (this.shouldAttach(registered) && (hearsAnew || !this.registry.isAttached(registered.name)))
            this.attachEvent(registered);
    }

    /**
     * Sends a command no element raised — a notification's action — in turn behind the commands and values before it, and applies
     * its answer's effects as an event's are; refused while the same one is pending. Answers whether the server took it — ran it,
     * failed or not: false for a refusal here or the server's (a busy command among them), which spent nothing.
     */
    public async dispatchCommandAsync(request: UICommandRequest): Promise<boolean> {
        if (this.options.dispatcher.isPending(request))
            return false;

        const turn = this.turns.take();

        try {
            await turn.ahead;
            await this.options.valueBinding?.whenSent();

            // Re-checked after the awaits, as an event's is: the same action pressed twice may have gone while this one waited.
            if (this.options.dispatcher.isPending(request))
                return false;

            const dispatched = this.options.dispatcher.dispatchAsync(request);

            turn.done();

            const result = await dispatched;

            this.options.effects.applyAll(result.command?.effects, this.options.dom);
            this.options.afterEffects?.();

            return result.refused !== true;
        }
        finally {
            turn.done();
        }
    }

    private shouldAttach(event: RegisteredEvent): boolean {
        return this.options.metadata.hasServerEvent(event.name) ||
            this.options.interactionEngine.hasEvent(event.name) ||
            this.options.interactionEngine.hasEvent(`before-${event.name}`) ||
            this.options.interactionEngine.hasEvent(`after-${event.name}`);
    }

    private attachEvent(registered: RegisteredEvent): void {
        const attachment = this.registry.attach(registered.name);

        const dispatch = (domEvent: Event): void => {
            if (!this.registry.isCurrent(registered.name, attachment))
                return;

            void this.handleDomEventAsync(registered.name, domEvent).catch(error => {
                logError("event pipeline failed.", error);
            });
        };

        const definition = this.options.eventCatalog.get(registered.name);
        const context = { root: this.root, dispatch, options: registered.options };

        if (definition !== undefined)
            definition.attach(context);
        else
            this.root.addEventListener(registered.domEventName, dispatch, { capture: true, ...registered.options });
    }

    private async handleDomEventAsync(eventName: string, domEvent: Event): Promise<void> {
        if (!(domEvent.target instanceof Element))
            return;

        const registration = this.registry.get(eventName);

        if (registration === undefined)
            return;

        const resolved = this.options.dom.resolveNearestComponent(
            domEvent.target,
            (componentId, element) => this.shouldHandleComponent(eventName, componentId, element)
        );

        if (resolved === null)
            return;

        if (isInnerBoundaryCrossing(domEvent, resolved.element))
            return;

        if (isBehindEventBoundary(domEvent.target, resolved.element))
            return;

        const serverEvent = this.options.metadata.getEvent(resolved.componentId, eventName);
        const resolvedContext: EventDispatchContext = {
            domEvent,
            metadata: serverEvent,
            component: resolved.element,
            componentId: resolved.componentId,
            dynamicParameters: resolved.dynamicParameters
        };
        // An engine that draws its own elements names the keys itself, in place of the `data-ui-key` chain above the target.
        const context: EventDispatchContext = registration.dynamicParameters === undefined
            ? resolvedContext
            : { ...resolvedContext, dynamicParameters: registration.dynamicParameters(resolvedContext) ?? resolvedContext.dynamicParameters };

        // Told whatever happens, a dropped connection included, or a package awaiting its sent value's answer would wait for ever.
        try {
            registration.started?.(context);

            const outcome = await this.runAsync(eventName, registration, resolved.element, context);

            registration.completed?.({ ...context, ...outcome });
        }
        catch (error) {
            const dispatched = error instanceof DispatchFailure;
            const reason = dispatched ? error.reason : error;

            registration.completed?.({ ...context, dispatched, success: false, error: String(reason) });
            throw reason;
        }
    }

    /** The command the event stands for, from the request to its answer; what it came to is what the registration is told. */
    private async runAsync(eventName: string, registration: RegisteredEvent, element: Element, context: EventDispatchContext): Promise<EventOutcome> {
        // A disabled or loading component raises nothing, whatever raised the event inside it — an engine's own click included.
        if (context.domEvent.target instanceof Element && isInert(context.domEvent.target))
            return Refused;

        this.applyDomPolicy(registration, context);

        const request = this.requestFactory.create(registration, context);

        if (request === null) {
            this.options.interactionEngine.applyEvent({
                name: eventName,
                componentId: context.componentId,
                dynamicParameters: context.dynamicParameters,
                domEvent: context.domEvent
            });

            // Nothing to wait for: an event carrying no command has landed as soon as the page has run it.
            return { dispatched: false, success: true };
        }

        if (this.options.dispatcher.isPending(request)) {
            context.domEvent.preventDefault();
            return Refused;
        }

        const endMark = this.startPendingMark(eventName, element, context);
        // Taken as raised: an .OnChange command waits for its value's answer, and one raised after it must not reach the server first.
        const turn = this.turns.take();

        try {
            return await this.sendInTurnAsync(eventName, registration, element, context, request, turn);
        }
        finally {
            turn.done();
            endMark();
        }
    }

    /**
     * The press's pending mark, from the press to the answer (`pending-mark.ts`): at once while the connection is coming back, which
     * holds the command whatever the server's speed. A press alone: a value's, a drop's or a move's change already stands on the page.
     */
    private startPendingMark(eventName: string, element: Element, context: EventDispatchContext): () => void {
        if (eventName !== PendingEventName || context.metadata?.showsPending === false)
            return NoMark;

        return markPending(element, this.options.isReattaching?.() === true ? 0 : PendingDelayMilliseconds);
    }

    /** Sends the command behind what it waits for — its form's values, its own value's answer, the commands and values before it. */
    private async sendInTurnAsync(eventName: string, registration: RegisteredEvent, element: Element, context: EventDispatchContext, request: UICommandRequest, turn: CommandTurn): Promise<EventOutcome> {
        const submitFormId = element.getAttribute(SubmitFormIdAttribute) ?? (registration.submitsForm === true ? fieldFormId(context) : null);

        if (submitFormId !== null) {
            if (this.options.validationEngine?.runSubmitValidation(submitFormId) === false) {
                context.domEvent.preventDefault();
                this.options.validationEngine.focusFirstInvalid(submitFormId);
                return Refused;
            }

            // After validation and before the command: an OnSubmit field holds its value back until here.
            await this.options.valueBinding?.submitFormAsync(submitFormId);
        }

        if (await this.isRefusedValueEventAsync(registration, element))
            return Refused;

        // Behind every command raised before it, then every value given before it, a large one still being staged included.
        await turn.ahead;
        await this.options.valueBinding?.whenSent();

        // Re-checked after the awaits: the identical request may have been dispatched while this one waited.
        if (this.options.dispatcher.isPending(request))
            return Refused;

        this.options.interactionEngine.applyEvent({
            name: `before-${eventName}`,
            componentId: context.componentId,
            dynamicParameters: context.dynamicParameters,
            domEvent: context.domEvent
        });

        const dispatched = this.options.dispatcher.dispatchAsync(request);

        turn.done();

        const result = await dispatched.catch(error => {
            // Still ended: a spinner the press began must not outlive a command the lost connection took with it.
            this.applyAfterEvent(eventName, context);

            throw new DispatchFailure(error);
        });

        // After the change set, which the transport applied before the result came back: an effect that focuses or scrolls needs the DOM those changes produced.
        this.options.effects.applyAll(result.command?.effects, this.options.dom);
        this.options.afterEffects?.();

        this.applyAfterEvent(eventName, context);

        // A submit the server answered with a field's error (its refusal, the controller's message) takes the reader to that field.
        if (submitFormId !== null)
            this.options.validationEngine?.focusFirstInvalid(submitFormId);

        return { dispatched: true, success: result.command?.success !== false, error: result.command?.error ?? null };
    }

    // An .OnChange command waits for its value's round-trip, never running for one the controller refused; a package says `settlesValue`.
    private async isRefusedValueEventAsync(registration: RegisteredEvent, component: Element): Promise<boolean> {
        if (!ValueSettleEventNames.includes(registration.name) && registration.settlesValue !== true)
            return false;

        await this.options.valueBinding?.whenSettled(component);

        return this.options.validationEngine?.isRefused(component) === true;
    }

    private applyAfterEvent(eventName: string, context: EventDispatchContext): void {
        this.options.interactionEngine.applyEvent({
            name: `after-${eventName}`,
            componentId: context.componentId,
            dynamicParameters: context.dynamicParameters,
            domEvent: context.domEvent
        });
    }

    private shouldHandleComponent(eventName: string, componentId: number, element: Element): boolean {
        // Not a handler rather than a handler that does nothing, so the walk carries on outwards.
        if (element.hasAttribute(eventSuppressAttribute(eventName)))
            return false;

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

/** Whether a captured mouseenter/mouseleave is a move between descendants rather than a crossing of the component's own edge. */
function isInnerBoundaryCrossing(domEvent: Event, component: Element): boolean {
    if (domEvent.type !== "mouseenter" && domEvent.type !== "mouseleave")
        return false;

    const related = (domEvent as MouseEvent).relatedTarget;

    return related instanceof Node && component.contains(related);
}

/** The form of the field an event came from: the target's own, or the first field inside the component that declares one. */
function fieldFormId(context: EventDispatchContext): string | null {
    const target = context.domEvent.target;
    const field = (target instanceof Element ? target.closest(`[${FormIdAttribute}]`) : null) ?? context.component.querySelector(`[${FormIdAttribute}]`);

    return field?.getAttribute(FormIdAttribute) ?? null;
}
