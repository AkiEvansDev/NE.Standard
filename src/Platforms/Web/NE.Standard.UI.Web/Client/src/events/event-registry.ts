import { EventCatalog } from "../extensions/events";
import { normalizeEventName } from "../metadata/metadata-index";
import { EventRegistration, RegisteredEvent } from "./event-descriptor";

export class EventRegistry {
    private readonly registrations = new Map<string, RegisteredEvent>();
    private readonly attachedEvents = new Set<string>();

    public constructor(private readonly catalog: EventCatalog) { }

    public add<TEvent extends Event = Event>(name: string, registration: Omit<EventRegistration<TEvent>, "name"> = {}): RegisteredEvent {
        const eventName = normalizeEventName(name);

        if (eventName.length === 0)
            throw new Error("Event name is required.");

        const domEventName = normalizeEventName(registration.domEventName) || this.catalog.get(eventName)?.domEventName || eventName;

        const registered = {
            ...registration,
            name: eventName,
            domEventName
        } as RegisteredEvent;

        this.registrations.set(eventName, registered);

        if (registration.domEventName !== undefined || registration.attach !== undefined) {
            this.catalog.register({
                name: eventName,
                domEventName: registration.domEventName,
                attach: registration.attach
            });
        }

        return registered;
    }

    public get(eventName: string): RegisteredEvent | undefined {
        return this.registrations.get(normalizeEventName(eventName));
    }

    public markAttached(eventName: string): boolean {
        const normalized = normalizeEventName(eventName);

        if (this.attachedEvents.has(normalized))
            return false;

        this.attachedEvents.add(normalized);
        return true;
    }
}
