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
    createRequest?(context: EventDispatchContext<TEvent>): UICommandRequest | null;
    attach?(context: EventAttachContext): void;
};

export type RegisteredEvent = Required<Pick<EventRegistration, "name" | "domEventName">> & Omit<EventRegistration, "name" | "domEventName">;
