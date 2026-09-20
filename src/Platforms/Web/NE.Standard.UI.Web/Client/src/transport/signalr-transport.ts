import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { ServerChangeSet, UICommandExecutionResult, UICommandRequest, WebUIAttachRequest, WebUIAttachResult, WebUIChangeSetRequest, WebUIItemWindowRequest } from "../metadata/metadata-index";
import { logDebug, logError, logWarn } from "../runtime/logger";

// A call waiting behind the attach longer than this is said in the console.
const AttachStallWarningMilliseconds = 500;

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
    private readonly windowId: string;
    private readonly connection: HubConnection;
    private started = false;
    private currentState: UIConnectionState = "Disconnected";

    // A hydrated page is clickable before the connection opens, so every call but the attach waits behind this.
    private attached: Promise<void>;
    private markAttached: () => void = () => { };
    private failAttachGate: (error: unknown) => void = () => { };

    public constructor(windowId: string, options: SignalRTransportOptions = {}) {
        this.windowId = windowId;
        this.attached = this.createAttachGate();

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

    // Only server-initiated effects arrive this way; a client-invoked command gets its effects on the invoke.
    public onCommandResult(handler: (result: UICommandExecutionResult) => void): void {
        this.connection.on("ui.commandResult", (payload: unknown) => handler(payload as UICommandExecutionResult));
    }

    public onReconnecting(handler: (error?: Error) => void): void {
        this.connection.onreconnecting((error?: Error) => {
            this.currentState = "Reconnecting";

            // Nothing may be sent until the runtime re-attaches: the new connection is attached to nothing.
            this.attached = this.createAttachGate();

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
                windowId: this.windowId
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
        try {
            const result = await this.invokeCoreAsync<WebUIAttachResult>("AttachAsync", request);

            this.markAttached();

            return result;
        }
        catch (error) {
            // A gate nobody ever marks attached would hang every later call forever; failing it lets a call already waiting behind it
            // reject, and a fresh gate is armed at once so a retried attach can still succeed.
            this.failAttachGate(error);
            this.attached = this.createAttachGate();

            throw error;
        }
    }

    public async processEventAsync(request: UICommandRequest): Promise<UICommandExecutionResult> {
        return await this.invokeAsync<UICommandExecutionResult>("ProcessEventAsync", request);
    }

    public async processChangeSetAsync(request: WebUIChangeSetRequest): Promise<ServerChangeSet> {
        return await this.invokeAsync<ServerChangeSet>("ProcessChangeSetAsync", request);
    }

    /** Tells the session which theme the client is now in. */
    public async setThemeAsync(theme: string): Promise<void> {
        await this.invokeAsync<void>("SetThemeAsync", { theme });
    }

    public async requestItemWindowAsync(request: WebUIItemWindowRequest): Promise<ServerChangeSet> {
        return await this.invokeAsync<ServerChangeSet>("RequestItemWindowAsync", request);
    }

    private async invokeAsync<TResult>(methodName: string, ...args: unknown[]): Promise<TResult> {
        // A call made before the attach is answered waits in silence; past this long the wait is logged, so a click that
        // seems to go nowhere can be told from one that was never made.
        const stalled = window.setTimeout(() => logWarn("call waiting behind the attach.", { methodName }), AttachStallWarningMilliseconds);

        try {
            await this.attached;
        } finally {
            window.clearTimeout(stalled);
        }

        return await this.invokeCoreAsync<TResult>(methodName, ...args);
    }

    // Rethrown without a log of its own, since every caller already logs the failure in its own words; a bare rethrow here
    // would say the same thing twice.
    private async invokeCoreAsync<TResult>(methodName: string, ...args: unknown[]): Promise<TResult> {
        await this.ensureConnectedAsync();

        return await this.connection.invoke<TResult>(methodName, ...args);
    }

    private createAttachGate(): Promise<void> {
        const gate = new Promise<void>((resolve, reject) => {
            this.markAttached = resolve;
            this.failAttachGate = reject;
        });

        // A gate nobody ends up awaiting (the attach fails before any call queues behind it) must not report as an unhandled
        // rejection; a real waiter still sees the same rejection through its own await.
        gate.catch(() => { });

        return gate;
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
