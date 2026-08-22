import { UICommandExecutionResult, UICommandRequest, toSerializedIdValue } from "../metadata/metadata-index";
import { SignalRTransport } from "./signalr-transport";

export class CommandDispatcher {
    private readonly pendingKeys = new Set<string>();

    public constructor(private readonly transport: SignalRTransport) {
    }

    public isPending(request: UICommandRequest): boolean {
        return this.pendingKeys.has(createPendingKey(normalizeCommandRequest(request)));
    }

    public async dispatchAsync(request: UICommandRequest): Promise<UICommandExecutionResult> {
        const normalizedRequest = normalizeCommandRequest(request);
        const key = createPendingKey(normalizedRequest);

        if (this.pendingKeys.has(key))
            throw new Error("Command is already pending.");

        this.pendingKeys.add(key);

        try {
            return await this.transport.processEventAsync(normalizedRequest);
        }
        finally {
            this.pendingKeys.delete(key);
        }
    }
}

function createPendingKey(request: UICommandRequest): string {
    return `${JSON.stringify(request.eventId)}:${JSON.stringify(request.dynamicParameters ?? [])}`;
}

function normalizeCommandRequest(request: UICommandRequest): UICommandRequest {
    return {
        eventId: toSerializedIdValue(request.eventId),
        dynamicParameters: request.dynamicParameters ?? []
    };
}
