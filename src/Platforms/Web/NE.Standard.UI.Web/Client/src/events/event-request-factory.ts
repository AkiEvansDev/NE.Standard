import { EventDispatchContext, RegisteredEvent } from "./event-descriptor";
import { UICommandRequest, toSerializedIdValue } from "../metadata/metadata-index";

export class EventRequestFactory {
    public create(registration: RegisteredEvent, context: EventDispatchContext): UICommandRequest | null {
        if (registration.createRequest !== undefined)
            return registration.createRequest(context);

        if (context.metadata === undefined)
            return null;

        return {
            eventId: toSerializedIdValue(context.metadata.eventId),
            dynamicParameters: [...context.dynamicParameters]
        };
    }
}
