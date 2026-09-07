import { ServerChangeSet, WebUIValueChangeRequest } from "../metadata/metadata-index";
import { SignalRTransport } from "./signalr-transport";

export class ValueChangeDispatcher {
    private readonly transport: SignalRTransport;

    public constructor(transport: SignalRTransport) {
        this.transport = transport;
    }

    public async dispatchAsync(update: WebUIValueChangeRequest): Promise<ServerChangeSet> {
        return await this.transport.processChangeSetAsync({ updates: [update] });
    }
}
