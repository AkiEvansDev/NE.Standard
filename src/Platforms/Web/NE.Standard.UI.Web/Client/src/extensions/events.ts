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

// Capture: `toggle` does not bubble, so only a capturing listener on an ancestor sees it.
function attachDetailsState(context: EventAttachContext, open: boolean): void {
    context.root.addEventListener("toggle", domEvent => {
        if (domEvent.target instanceof HTMLDetailsElement && domEvent.target.open === open)
            context.dispatch(domEvent);
    }, true);
}

export function registerBuiltInEvents(catalog: EventCatalog): void {
    catalog.registerNative("click");
    catalog.registerNative("change");
    catalog.registerNative("focus");
    catalog.registerNative("blur");
    catalog.registerNative("mouse-enter", "mouseenter");
    catalog.registerNative("mouse-leave", "mouseleave");
    catalog.registerNative("toggle");

    // `<details>` has one event for both directions, so these two are that event read twice.
    catalog.register({ name: "expand", domEventName: "toggle", attach: context => attachDetailsState(context, true) });
    catalog.register({ name: "collapse", domEventName: "toggle", attach: context => attachDetailsState(context, false) });
    catalog.registerNative("open");
    catalog.registerNative("close");
    catalog.registerNative("search");
    catalog.registerNative("rename");
    // A tree node unfolded before its children are in the list; raised by tree-engine.ts on the row.
    catalog.registerNative("unfold");
    // A tree node dropped on another; the node's drop target says where.
    catalog.registerNative("move");
    // The Delete key on a tree node.
    catalog.registerNative("remove");
}
