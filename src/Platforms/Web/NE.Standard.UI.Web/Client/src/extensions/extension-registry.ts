import { DomOperationRegistration, DomOperationRegistry } from "../updates/dom-operation-registry";
import { ConverterRegistry, ValueConverterRegistration } from "./converters";
import { EventCatalog, EventDefinitionRegistration, registerBuiltInEvents } from "./events";

export class ExtensionRegistry {
    public readonly converters = new ConverterRegistry();
    public readonly events = new EventCatalog();
    public readonly operations = new DomOperationRegistry();

    public constructor(
        converters?: Iterable<ValueConverterRegistration>,
        events?: Iterable<EventDefinitionRegistration>,
        domOperations?: Iterable<DomOperationRegistration>
    ) {
        registerBuiltInEvents(this.events);

        for (const converter of converters ?? [])
            this.converters.register(converter);

        for (const event of events ?? [])
            this.events.register(event);

        for (const domOperation of domOperations ?? [])
            this.operations.register(domOperation.kind, domOperation.handler);
    }

    public registerConverter(registration: ValueConverterRegistration): void {
        this.converters.register(registration);
    }

    public registerEvent(registration: EventDefinitionRegistration): void {
        this.events.register(registration);
    }

    public registerDomOperation(registration: DomOperationRegistration): void {
        this.operations.register(registration.kind, registration.handler);
    }
}
