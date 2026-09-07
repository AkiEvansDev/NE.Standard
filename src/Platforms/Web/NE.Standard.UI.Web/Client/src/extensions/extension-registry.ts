import { RowDecoratorRegistration, RowDecoratorRegistry } from "../items/row-decorators";
import { CollectionSinkRegistration, CollectionSinkRegistry } from "../updates/collection-sinks";
import { DomOperationRegistration, DomOperationRegistry } from "../updates/dom-operation-registry";
import { ConverterRegistry, ValueConverterRegistration } from "./converters";
import { EventCatalog, EventDefinitionRegistration, registerBuiltInEvents } from "./events";
import { ValueReaderRegistration, ValueReaderRegistry } from "./value-readers";

export class ExtensionRegistry {
    public readonly converters = new ConverterRegistry();
    public readonly events = new EventCatalog();
    public readonly operations = new DomOperationRegistry();
    public readonly valueReaders: ValueReaderRegistry;
    public readonly collectionSinks = new CollectionSinkRegistry();
    public readonly rowDecorators = new RowDecoratorRegistry();

    public constructor(
        converters?: Iterable<ValueConverterRegistration>,
        events?: Iterable<EventDefinitionRegistration>,
        domOperations?: Iterable<DomOperationRegistration>,
        valueReaders?: Iterable<ValueReaderRegistration>
    ) {
        registerBuiltInEvents(this.events);
        this.valueReaders = new ValueReaderRegistry(valueReaders);

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

    public registerValueReader(registration: ValueReaderRegistration): void {
        this.valueReaders.register(registration);
    }

    public registerCollectionSink(registration: CollectionSinkRegistration): void {
        this.collectionSinks.register(registration);
    }

    public registerRowDecorator(registration: RowDecoratorRegistration): void {
        this.rowDecorators.register(registration);
    }
}
