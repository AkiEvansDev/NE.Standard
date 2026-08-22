import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { ServerChangeSet, UICommandExecutionResult, UICommandRequest, WebUIAttachRequest, WebUIAttachResult, WebUIChangeSetRequest, WebUIItemWindowRequest } from "../metadata/metadata-index";
import { logDebug, logError } from "../runtime/logger";

export type SignalRTransportOptions = {
    readonly hubUrl?: string;
    readonly reconnectDelays?: readonly number[];
};

export type UIConnectionState =
    | "Disconnected"
    | "Connecting"
    | "Connected"
    | "Reconnecting";

export class SignalRTransport {
    private readonly connection: HubConnection;
    private started = false;
    private currentState: UIConnectionState = "Disconnected";

    public constructor(private readonly tabId: string, options: SignalRTransportOptions = {}) {
        this.connection = new HubConnectionBuilder()
            .withUrl(options.hubUrl ?? "/_ui/hub")
            .withAutomaticReconnect([...(options.reconnectDelays ?? [0, 1000, 3000, 10000, 30000])])
            .configureLogging(LogLevel.Warning)
            .build();
    }

    public get instanceId(): string | null {
        return this.connection.connectionId ?? null;
    }

    public get state(): UIConnectionState {
        return this.currentState;
    }

    public onChanges(handler: (changes: ServerChangeSet) => void): void {
        this.connection.on("ui.changes", (payload: unknown) => handler(payload as ServerChangeSet));
    }

    // Only server-initiated effects arrive this way (a background command, a scheduled task, a service
    // pushing mid-command). A client-invoked command gets its effects back on the invoke itself.
    public onCommandResult(handler: (result: UICommandExecutionResult) => void): void {
        this.connection.on("ui.commandResult", (payload: unknown) => handler(payload as UICommandExecutionResult));
    }

    public onReconnecting(handler: (error?: Error) => void): void {
        this.connection.onreconnecting((error?: Error) => {
            this.currentState = "Reconnecting";
            handler(error);
        });
    }

    public onReconnected(handler: () => void | Promise<void>): void {
        this.connection.onreconnected(() => {
            this.currentState = "Connected";
            void Promise.resolve(handler()).catch(error => {
                logError("reattach after reconnect failed.", error);
            });
        });
    }

    public onClosed(handler: (error?: Error) => void): void {
        this.connection.onclose((error?: Error) => {
            this.currentState = "Disconnected";
            this.started = false;
            handler(error);
        });
    }

    public async startAsync(): Promise<void> {
        if (this.started || this.connection.state !== HubConnectionState.Disconnected)
            return;

        try {
            this.currentState = "Connecting";
            await this.connection.start();
            this.started = true;
            this.currentState = "Connected";

            logDebug("SignalR connected.", {
                connectionId: this.connection.connectionId,
                tabId: this.tabId
            });
        }
        catch (error) {
            this.started = false;
            this.currentState = "Disconnected";
            logError("SignalR connection failed.", error);
            throw error;
        }
    }

    public async stopAsync(): Promise<void> {
        if (this.connection.state === HubConnectionState.Disconnected)
            return;

        await this.connection.stop();
        this.started = false;
        this.currentState = "Disconnected";
    }

    public async attachAsync(request: WebUIAttachRequest): Promise<WebUIAttachResult> {
        return await this.invokeAsync<WebUIAttachResult>("AttachAsync", request);
    }

    public async processEventAsync(request: UICommandRequest): Promise<UICommandExecutionResult> {
        return await this.invokeAsync<UICommandExecutionResult>("ProcessEventAsync", request);
    }

    public async processChangeSetAsync(request: WebUIChangeSetRequest): Promise<ServerChangeSet> {
        return await this.invokeAsync<ServerChangeSet>("ProcessChangeSetAsync", request);
    }

    public async requestItemWindowAsync(request: WebUIItemWindowRequest): Promise<ServerChangeSet> {
        return await this.invokeAsync<ServerChangeSet>("RequestItemWindowAsync", request);
    }

    private async invokeAsync<TResult>(methodName: string, ...args: unknown[]): Promise<TResult> {
        await this.ensureConnectedAsync();

        try {
            return await this.connection.invoke<TResult>(methodName, ...args);
        }
        catch (error) {
            logError("SignalR invocation failed.", {
                methodName,
                error
            });
            throw error;
        }
    }

    private async ensureConnectedAsync(): Promise<void> {
        if (this.connection.state === HubConnectionState.Connected)
            return;

        if (this.connection.state === HubConnectionState.Disconnected) {
            this.started = false;
            await this.startAsync();
            return;
        }

        throw new Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
    }
}
