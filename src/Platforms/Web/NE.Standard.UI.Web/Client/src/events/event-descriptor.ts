import { EventAttachContext } from "../extensions/events";
import { UICommandRequest, WebRenderEventMetadata } from "../metadata/metadata-index";

export type EventDispatchContext<TEvent extends Event = Event> = {
    readonly domEvent: TEvent;
    readonly metadata?: WebRenderEventMetadata;
    readonly component: Element;
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
};

export type EventRegistration<TEvent extends Event = Event> = {
    readonly name: string;
    readonly domEventName?: string;
    readonly options?: AddEventListenerOptions;
    readonly preventDefault?: boolean | ((context: EventDispatchContext<TEvent>) => boolean);
    readonly stopPropagation?: boolean | ((context: EventDispatchContext<TEvent>) => boolean);
    /** The command waits for the component's value to reach the server first, as an .OnChange command does. */
    readonly settlesValue?: boolean;
    /** The keys the command carries, named by the engine in place of the `data-ui-key` chain above the target; null keeps the chain. */
    dynamicParameters?(context: EventDispatchContext<TEvent>): readonly unknown[] | null;
    createRequest?(context: EventDispatchContext<TEvent>): UICommandRequest | null;
    attach?(context: EventAttachContext): void;
};

export type RegisteredEvent = Required<Pick<EventRegistration, "name" | "domEventName">> & Omit<EventRegistration, "name" | "domEventName">;
