import { normalizeEventName } from "../metadata/metadata-index";

export type EventAttachContext = {
    readonly root: ParentNode;
    readonly dispatch: (domEvent: Event) => void;
};

export type EventDefinition = {
    readonly name: string;
    readonly domEventName: string;
    attach(context: EventAttachContext): void;
};

export type EventDefinitionRegistration = {
    readonly name: string;
    readonly domEventName?: string;
    attach?(context: EventAttachContext): void;
};

export class EventCatalog {
    private readonly definitions = new Map<string, EventDefinition>();

    public register(registration: EventDefinitionRegistration): void {
        const name = normalizeEventName(registration.name);

        if (name.length === 0)
            throw new Error("Event name is required.");

        const domEventName = normalizeEventName(registration.domEventName) || name;

        this.definitions.set(name, {
            name,
            domEventName,
            attach: registration.attach ?? (context => context.root.addEventListener(domEventName, context.dispatch, true))
        });
    }

    public registerNative(name: string, domEventName: string = name): void {
        this.register({ name, domEventName });
    }

    public get(name: string): EventDefinition | undefined {
        return this.definitions.get(normalizeEventName(name));
    }
}

export function registerBuiltInEvents(catalog: EventCatalog): void {
    catalog.registerNative("click");
    catalog.registerNative("change");
    catalog.registerNative("focus");
    catalog.registerNative("blur");
    catalog.registerNative("mouse-enter", "mouseenter");
    catalog.registerNative("mouse-leave", "mouseleave");
    catalog.registerNative("toggle");
    catalog.registerNative("expand");
    catalog.registerNative("collapse");
    catalog.registerNative("open");
    catalog.registerNative("close");
    catalog.registerNative("search");
    catalog.registerNative("rename");
}
