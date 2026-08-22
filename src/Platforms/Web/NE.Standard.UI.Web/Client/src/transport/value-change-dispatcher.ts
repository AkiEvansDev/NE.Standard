import { ServerChangeSet, WebUIValueChangeRequest } from "../metadata/metadata-index";
import { SignalRTransport } from "./signalr-transport";

export class ValueChangeDispatcher {
    public constructor(private readonly transport: SignalRTransport) {
    }

    public async dispatchAsync(update: WebUIValueChangeRequest): Promise<ServerChangeSet> {
        return await this.transport.processChangeSetAsync({ updates: [update] });
    }
}
