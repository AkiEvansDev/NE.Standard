import { EventDispatchContext, RegisteredEvent } from "./event-descriptor";
import { UICommandRequest, getIdValue } from "../metadata/metadata-index";

export class EventRequestFactory {
    public create(registration: RegisteredEvent, context: EventDispatchContext): UICommandRequest | null {
        if (registration.createRequest !== undefined)
            return registration.createRequest(context);

        if (context.metadata === undefined)
            return null;

        return {
            eventId: getIdValue(context.metadata.eventId),
            dynamicParameters: [...context.dynamicParameters]
        };
    }
}
