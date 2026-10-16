// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import type { EventDispatchContext, RegisteredEvent } from "./event-descriptor.ts";
import { getIdValue } from "../metadata/metadata-index.ts";
import type { UICommandRequest } from "../metadata/metadata-index.ts";

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
