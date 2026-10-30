// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import type { EventCatalog } from "../extensions/events.ts";
import { normalizeEventName } from "../metadata/metadata-index.ts";
import type { EventRegistration, RegisteredEvent } from "./event-descriptor.ts";
import { logError } from "../metadata/logger.ts";

export class EventRegistry {
    private readonly catalog: EventCatalog;
    private readonly registrations = new Map<string, RegisteredEvent>();
    // The latest attachment of each event: a listener of an older one stays on the root but is no longer heard.
    private readonly attachments = new Map<string, object>();
    // The names a package registered: each is that package's, as two packages hearing one name would hear each other's raises.
    private readonly claimed = new Set<string>();

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

        if (registration.domEventName !== undefined || registration.attach !== undefined || registration.ownTarget !== undefined) {
            const existing = this.catalog.get(eventName);

            // What the registration leaves unsaid stays the definition's: a built-in fold re-attached is still the folded one's own.
            this.catalog.register({
                name: eventName,
                domEventName: registration.domEventName ?? existing?.domEventName,
                ownTarget: registration.ownTarget ?? existing?.ownTarget,
                attach: registration.attach ?? (registration.domEventName === undefined ? existing?.attach : undefined)
            });
        }

        return registered;
    }

    /**
     * Takes an event name for a package; false, said in the console, where another package took it first, which keeps it. Without it
     * the last package loaded won the name silently, and the first heard nothing.
     */
    public claim(name: string): boolean {
        const eventName = normalizeEventName(name);

        if (!this.claimed.has(eventName)) {
            this.claimed.add(eventName);
            return true;
        }

        logError("Two packages registered one event name; the second registration is refused, the first kept. Name each package's events its own.", { event: eventName });

        return false;
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
