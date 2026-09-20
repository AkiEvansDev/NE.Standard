import { ServerChangeSet, WebUIValueChangeRequest } from "../metadata/metadata-index";
import { SignalRTransport } from "./signalr-transport";
import { largeValueBody, stageValueAsync } from "./value-staging";

export class ValueChangeDispatcher {
    private readonly transport: SignalRTransport;

    public constructor(transport: SignalRTransport) {
        this.transport = transport;
    }

    /** Sends one value; a large one is staged beside the hub first and the update carries its token instead. */
    public async dispatchAsync(update: WebUIValueChangeRequest): Promise<ServerChangeSet> {
        const body = largeValueBody(update.value);

        if (body === null)
            return await this.transport.processChangeSetAsync({ updates: [update] });

        const valueToken = await stageValueAsync(body);

        return await this.transport.processChangeSetAsync({
            updates: [{ componentId: update.componentId, propertyName: update.propertyName, dynamicParameters: update.dynamicParameters, valueToken }]
        });
    }
}
