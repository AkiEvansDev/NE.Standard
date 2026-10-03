import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { ServerChangeSet, ThemeColorsModel, UICommandExecutionResult, UICommandRequest, WebUIAttachRequest, WebUIAttachResult, WebUIChangeSetRequest, WebUIItemWindowRequest } from "../metadata/metadata-index";
import { isDebugEnabled, logDebug, logElapsed, logError, logWarn } from "../runtime/logger";
import { AttachGate, ConnectionDropped } from "./attach-gate";
import { ChangeSink, InboundOrder } from "./inbound-order";

// A call waiting behind the attach longer than this is said in the console.
const AttachStallWarningMilliseconds = 500;

export type SignalRTransportOptions = {
    readonly hubUrl?: string;
    readonly reconnectDelays?: readonly number[];
};

function withoutChanges(result: UICommandExecutionResult): UICommandExecutionResult {
    const { changes: _, ...rest } = result;

    return rest;
}

function noChanges(): ServerChangeSet {
    return {};
}

export class SignalRTransport {
    private readonly windowId: string;
    private readonly connection: HubConnection;
    private started = false;

    // A hydrated page is clickable before the connection opens, so every call but the attach waits behind this.
    private readonly gate = new AttachGate();

    // Pushes and the answers that carry changes, applied in the order they arrived.
    private readonly inbound: InboundOrder;

    /** `applyChanges` takes every change set an answer carries, in its turn; the answer resolves once it has, without them. */
    public constructor(windowId: string, applyChanges: ChangeSink, options: SignalRTransportOptions = {}) {
        this.windowId = windowId;
        this.inbound = new InboundOrder(applyChanges);

        this.connection = new HubConnectionBuilder()
            .withUrl(options.hubUrl ?? "/_ne/hub")
            .withAutomaticReconnect([...(options.reconnectDelays ?? [0, 1000, 3000, 10000, 30000])])
            .configureLogging(LogLevel.Warning)
            .build();
    }

    public get instanceId(): string | null {
        return this.connection.connectionId ?? null;
    }

    /** Whether the connection dropped and the automatic reconnect is still trying to bring it back. */
    public get isReconnecting(): boolean {
        return this.connection.state === HubConnectionState.Reconnecting;
    }

    public onChanges(handler: (changes: ServerChangeSet) => void): void {
        this.connection.on("ui.changes", this.inbound.pushed((payload: unknown) => handler(payload as ServerChangeSet)));
    }

    // Effects raised outside a command, a Direct runtime's command effects, and a background command's whole result, by its request id.
    public onCommandResult(handler: (result: UICommandExecutionResult) => void): void {
        this.connection.on("ui.commandResult", this.inbound.pushed((payload: unknown) => handler(payload as UICommandExecutionResult)));
    }

    public onReconnecting(handler: (error?: Error) => void): void {
        this.connection.onreconnecting((error?: Error) => {
            // Nothing may be sent until the runtime re-attaches: the new connection is attached to nothing.
            this.gate.rearm();

            handler(error);
        });
    }

    public onReconnected(handler: () => void | Promise<void>): void {
        this.connection.onreconnected(() => {
            void Promise.resolve(handler()).catch(error => {
                logError("reattach after reconnect failed.", error);
            });
        });
    }

    public onClosed(handler: (error?: Error) => void): void {
        this.connection.onclose((error?: Error) => {
            this.started = false;
            handler(error);
        });
    }

    public async startAsync(): Promise<void> {
        if (this.started || this.connection.state !== HubConnectionState.Disconnected)
            return;

        try {
            await this.connection.start();
            this.started = true;

            logDebug("SignalR connected.", {
                connectionId: this.connection.connectionId,
                windowId: this.windowId
            });
        }
        catch (error) {
            this.started = false;
            logError("SignalR connection failed.", error);
            throw error;
        }
    }

    public async stopAsync(): Promise<void> {
        if (this.connection.state === HubConnectionState.Disconnected)
            return;

        await this.connection.stop();
        this.started = false;
    }

    /** Gives the connection up for good: every call waiting and every later one fails with the reason instead of waiting. */
    public close(reason: Error): void {
        this.gate.close(reason);
        void this.stopAsync().catch(error => logWarn("stopping the lost connection failed.", error));
    }

    public async attachAsync(request: WebUIAttachRequest): Promise<WebUIAttachResult> {
        try {
            const result = await this.invokeCoreAsync<WebUIAttachResult>("AttachAsync", [request]);

            // A runtime built since the page attached is not the page's: a value waiting meanwhile would land in it, so the page reloads with nothing sent.
            if (result.fresh !== true)
                this.gate.markAttached();

            return result;
        }
        catch (error) {
            // A gate never marked attached would hang every call: failing it rejects the waiting ones and re-arms it for a retried attach.
            this.gate.failAttach(error);

            throw error;
        }
    }

    /** The command's result once its changes are applied, without them. */
    public async processEventAsync(request: UICommandRequest): Promise<UICommandExecutionResult> {
        return await this.invokeAsync<UICommandExecutionResult>("ProcessEventAsync", [request], invoked => this.inbound.answered(invoked, result => result.changes, withoutChanges));
    }

    /** Asks the controller about leaving for `target` while the page holds unsaved work: its answer once its changes are applied, without them. */
    public async requestLeaveAsync(target: string): Promise<UICommandExecutionResult> {
        return await this.invokeAsync<UICommandExecutionResult>("RequestLeaveAsync", [{ target }], invoked => this.inbound.answered(invoked, result => result.changes, withoutChanges));
    }

    /** Tells the controller the reader went back or forward to another entry of this route: its answer once its changes are applied, without them. */
    public async navigateInPlaceAsync(parameters: Record<string, unknown> | null): Promise<UICommandExecutionResult> {
        return await this.invokeAsync<UICommandExecutionResult>("NavigateInPlaceAsync", [{ parameters }], invoked => this.inbound.answered(invoked, result => result.changes, withoutChanges));
    }

    /** Settles once the answer's changes are applied; `before` runs just ahead of them. Fails with `ConnectionDropped` under a reconnect. */
    public async processChangeSetAsync(request: WebUIChangeSetRequest, before?: () => void): Promise<void> {
        try {
            await this.invokeAsync<ServerChangeSet>("ProcessChangeSetAsync", [request], invoked => this.inbound.answered(invoked, changes => changes, noChanges, before));
        }
        catch (error) {
            // Said apart from a refusal, so the values go again once the page is attached; a connection given up is no reconnect.
            if (this.isReconnecting && this.gate.failure === null)
                throw new ConnectionDropped(error);

            throw error;
        }
    }

    /** Resolves once the runtime is attached and calls go through; fails once the connection is given up. */
    public whenAttached(): Promise<void> {
        return this.gate.wait();
    }

    /** Tells the session which theme the client is now in. */
    public async setThemeAsync(theme: string): Promise<void> {
        await this.invokeAsync<void>("SetThemeAsync", [{ theme }]);
    }

    /** Tells the session the reader's own colours, or none for the application's palette; answers the stylesheet they make. */
    public async setThemeColorsAsync(colors: ThemeColorsModel | null): Promise<string> {
        const answer = await this.invokeAsync<{ readonly css?: string }>("SetThemeColorsAsync", [{ colors }]);

        return answer?.css ?? "";
    }

    /** Tells the session the language the page switches to; answers where that language's words are. */
    public async setLanguageAsync(language: string): Promise<{ readonly language: string; readonly href: string }> {
        return await this.invokeAsync<{ readonly language: string; readonly href: string }>("SetLanguageAsync", [{ language }]);
    }

    /** Asks for the words of keys the page's table lacked, in one language; answers the ones the server has, plural forms among them. */
    public async translateAsync(language: string, keys: readonly string[]): Promise<Readonly<Record<string, string>>> {
        const answer = await this.invokeAsync<{ readonly words?: Readonly<Record<string, string>> }>("TranslateAsync", [{ language, keys }]);

        return answer?.words ?? {};
    }

    /** Settles once the window's rows are applied. */
    public async requestItemWindowAsync(request: WebUIItemWindowRequest): Promise<void> {
        await this.invokeAsync<ServerChangeSet>("RequestItemWindowAsync", [request], invoked => this.inbound.answered(invoked, changes => changes, noChanges));
    }

    private async invokeAsync<TResult>(methodName: string, args: readonly unknown[], answered?: (invoked: Promise<TResult>) => Promise<TResult>): Promise<TResult> {
        // A long wait behind the attach is logged, so a click that seems to go nowhere can be told from one never made.
        const stalled = window.setTimeout(() => logWarn("call waiting behind the attach.", { methodName }), AttachStallWarningMilliseconds);

        try {
            await this.gate.wait();
        } finally {
            window.clearTimeout(stalled);
        }

        return await this.invokeCoreAsync<TResult>(methodName, args, answered);
    }

    // Rethrown without a log of its own: every caller already logs the failure in its own words.
    private async invokeCoreAsync<TResult>(methodName: string, args: readonly unknown[], answered?: (invoked: Promise<TResult>) => Promise<TResult>): Promise<TResult> {
        // A connection given up is not started again by a call: the reader has been offered a reload instead.
        const lost = this.gate.failure;

        if (lost !== null)
            throw lost;

        await this.ensureConnectedAsync();

        const started = isDebugEnabled() ? performance.now() : -1;
        const invoked = this.connection.invoke<TResult>(methodName, ...args);
        const result = await (answered === undefined ? invoked : answered(invoked));

        // To the answer applied, so the time is what the reader waited for: the server's work, the wire, and the page's update.
        if (started >= 0)
            logElapsed(`${methodName} answered`, started);

        return result;
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
