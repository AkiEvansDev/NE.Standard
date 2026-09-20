import { EventAttachContext } from "../extensions/events";
import { UICommandRequest, WebRenderEventMetadata } from "../metadata/metadata-index";

export type EventDispatchContext<TEvent extends Event = Event> = {
    readonly domEvent: TEvent;
    readonly metadata?: WebRenderEventMetadata;
    readonly component: Element;
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
};

/** What became of the command an event raised, told to the registration that asked to hear it. */
export type EventCompletionContext<TEvent extends Event = Event> = EventDispatchContext<TEvent> & {
    /** Whether a command ran on the server at all: false when the event carried none, or was refused before it was sent. */
    readonly dispatched: boolean;
    /** Whether the command answered successfully; true when none ran. */
    readonly success: boolean;
    readonly error?: string | null;
};

export type EventRegistration<TEvent extends Event = Event> = {
    readonly name: string;
    readonly domEventName?: string;
    readonly options?: AddEventListenerOptions;
    readonly preventDefault?: boolean | ((context: EventDispatchContext<TEvent>) => boolean);
    readonly stopPropagation?: boolean | ((context: EventDispatchContext<TEvent>) => boolean);
    /** The command waits for the component's value to reach the server first, as an .OnChange command does. */
    readonly settlesValue?: boolean;
    /** Before the command, the form of the event's field is submitted, as a button's `OnSubmit` does: its held values are sent. */
    readonly submitsForm?: boolean;
    /** The keys the command carries, named by the engine in place of the `data-ui-key` chain above the target; null keeps the chain. */
    dynamicParameters?(context: EventDispatchContext<TEvent>): readonly unknown[] | null;
    /** Told what became of the command this event raised, whatever happens — a dropped connection included. */
    completed?(context: EventCompletionContext<TEvent>): void;
    createRequest?(context: EventDispatchContext<TEvent>): UICommandRequest | null;
    attach?(context: EventAttachContext): void;
};

export type RegisteredEvent = Required<Pick<EventRegistration, "name" | "domEventName">> & Omit<EventRegistration, "name" | "domEventName">;
