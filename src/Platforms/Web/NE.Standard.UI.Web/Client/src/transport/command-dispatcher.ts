// With its extension: the node test runner loads this module as is, and the bundler takes either spelling.
import type { UICommandExecutionResult, UICommandRequest } from "../metadata/metadata-index";
import { getIdValue } from "../metadata/metadata-index.ts";
import type { SignalRTransport } from "./signalr-transport";
import { largeValueBody, stageValueAsync } from "./value-staging.ts";

/** The one call the dispatcher makes: a command onto the hub. */
export type CommandSender = Pick<SignalRTransport, "processEventAsync">;

type AwaitedResult = {
    readonly resolve: (result: UICommandExecutionResult) => void;
    readonly reject: (error: unknown) => void;
};

/** Sends a command and answers with its result, refusing the same one while it is pending, a background one until its pushed result. */
export class CommandDispatcher {
    private readonly transport: CommandSender;
    private readonly pendingKeys = new Set<string>();

    // Per connection, which is all a pushed result can reach: the server sends it to the connection that raised the command.
    private nextRequestId = 1;
    private readonly awaited = new Map<number, AwaitedResult>();
    // Settles once the newest command whose keys are being staged has gone onto the hub: every command after it waits behind it.
    private staging: Promise<void> | null = null;

    public constructor(transport: CommandSender) {
        this.transport = transport;
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

        const requestId = this.nextRequestId++;
        // Awaited before the invoke is sent: a command that ends at once can push its result ahead of the answer accepting it.
        const pushed = this.expect(requestId);

        try {
            const answer = await this.sendAsync({ ...normalizedRequest, requestId });

            return answer.accepted === true ? await pushed : answer;
        }
        finally {
            this.awaited.delete(requestId);
            this.pendingKeys.delete(key);
        }
    }

    /**
     * Sends a command onto the hub in the order it was dispatched. Keys too large for the hub's message (a drop of many rows) are staged
     * beside it, as a large value is, and the command carries their token; the commands after it wait for it to go, and one with
     * nothing staged ahead of it leaves at once.
     */
    private sendAsync(request: UICommandRequest): Promise<UICommandExecutionResult> {
        const body = largeValueBody(request.dynamicParameters);

        if (body === null && this.staging === null)
            return this.transport.processEventAsync(request);

        const ahead = this.staging;
        // Posted at once, in parallel with what is ahead: only the order the commands reach the hub in matters.
        const staged = body === null ? null : stageValueAsync(body);
        let markSent = (): void => { };
        const sent = new Promise<void>(resolve => {
            markSent = resolve;
        });

        staged?.catch(() => { });
        this.staging = sent;

        const send = async (): Promise<UICommandExecutionResult> => {
            try {
                await ahead;

                const token = staged === null ? null : await staged;

                return this.transport.processEventAsync(token === null ? request : { ...request, dynamicParameters: [], dynamicParametersToken: token });
            }
            finally {
                // Once the invoke is on its way, or the post failed: either way the next command is free to go.
                markSent();

                if (this.staging === sent)
                    this.staging = null;
            }
        };

        return send();
    }

    private expect(requestId: number): Promise<UICommandExecutionResult> {
        const pushed = new Promise<UICommandExecutionResult>((resolve, reject) => this.awaited.set(requestId, { resolve, reject }));

        // A command answered on its invoke never awaits this; a release must not report it as an unhandled rejection.
        pushed.catch(() => { });

        return pushed;
    }

    /** Ends the pending command a pushed result names; false for a result no command here waits for, which is the caller's to apply. */
    public settle(result: UICommandExecutionResult): boolean {
        const requestId = result.requestId;

        if (requestId === undefined)
            return false;

        const awaited = this.awaited.get(requestId);

        if (awaited === undefined)
            return false;

        this.awaited.delete(requestId);
        awaited.resolve(result);

        return true;
    }

    /** The connection a pushed result would come back on is gone: every command still waiting for one fails with the reason. */
    public release(reason: Error): void {
        const awaited = [...this.awaited.values()];

        this.awaited.clear();

        for (const entry of awaited)
            entry.reject(reason);
    }
}

function createPendingKey(request: UICommandRequest): string {
    return request.action === undefined
        ? `${JSON.stringify(request.eventId)}:${JSON.stringify(request.dynamicParameters ?? [])}`
        : `action:${request.action}`;
}

function normalizeCommandRequest(request: UICommandRequest): UICommandRequest {
    return request.action === undefined
        ? { eventId: getIdValue(request.eventId), dynamicParameters: request.dynamicParameters ?? [] }
        : { eventId: 0, action: request.action, dynamicParameters: [] };
}
