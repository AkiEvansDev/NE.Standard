import { EventRegistration } from "../events/event-descriptor";
import { ValueConverterRegistration } from "../extensions/converters";
import { EventDefinitionRegistration } from "../extensions/events";
import { SignalRTransportOptions } from "../transport/signalr-transport";
import { DomOperationRegistration } from "../updates/dom-operation-registry";

export type WebUIRuntimeOptions = {
    readonly root?: ParentNode;
    readonly tabIdStorageKey?: string;
    readonly handlerGlobalKey?: string;
    readonly signalR?: SignalRTransportOptions;
    readonly events?: Iterable<EventRegistration>;
    readonly eventDefinitions?: Iterable<EventDefinitionRegistration>;
    readonly converters?: Iterable<ValueConverterRegistration>;
    readonly domOperations?: Iterable<DomOperationRegistration>;
};
