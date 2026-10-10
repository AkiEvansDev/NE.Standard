import { EventCatalog } from "../extensions/events";
import { normalizeEventName } from "../metadata/metadata-index";
import { EventRegistration, RegisteredEvent } from "./event-descriptor";

export class EventRegistry {
    private readonly catalog: EventCatalog;
    private readonly registrations = new Map<string, RegisteredEvent>();
    // The latest attachment of each event: a listener of an older one stays on the root but is no longer heard.
    private readonly attachments = new Map<string, object>();

    public constructor(catalog: EventCatalog) {
        this.catalog = catalog;
    }

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

    public isAttached(eventName: string): boolean {
        return this.attachments.has(normalizeEventName(eventName));
    }

    /** Records a new attachment of the event, taking the place of the one before, and answers it for `isCurrent`. */
    public attach(eventName: string): object {
        const attachment = {};

        this.attachments.set(normalizeEventName(eventName), attachment);

        return attachment;
    }

    /** Whether a listener of this attachment is still the event's: one a later attachment replaced hears nothing. */
    public isCurrent(eventName: string, attachment: object): boolean {
        return this.attachments.get(eventName) === attachment;
    }
}
