import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { ServerChangeSet, ThemeColorsModel, UICommandExecutionResult, UICommandRequest, WebUIAttachRequest, WebUIAttachResult, WebUIChangeSetRequest, WebUIItemWindowRequest } from "../metadata/metadata-index";
import type { ClientState } from "../runtime/client-state";
import { isDebugEnabled, logDebug, logElapsed, logError, logWarn } from "../runtime/logger";
import { AttachGate, CommandExpired, ConnectionDropped, pressAllowance } from "./attach-gate";
import { ChangeSink, InboundOrder } from "./inbound-order";
import { DefaultReconnectWindowMilliseconds, ReconnectLoop } from "./reconnect-loop";

// A call waiting behind the attach longer than this is said in the console.
const AttachStallWarningMilliseconds = 500;

// A press that waited across a drop longer than this, from its raising, is dropped: the page it was made on is that old by the time it
// would run.
const CommandWaitMilliseconds = 10_000;

export type SignalRTransportOptions = {
    readonly hubUrl?: string;
    // How long after a drop the page keeps trying to reconnect, until an attach has said how long the server keeps the runtime.
    readonly reconnectWindowMilliseconds?: number;
};

function withoutChanges(result: UICommandExecutionResult): UICommandExecutionResult {
    const { changes: _, ...rest } = result;

    return rest;
}

function noChanges(): ServerChangeSet {
    return {};
}

/** The runtime a push names as its sender: the id an attach answered with, or none. */
function readRuntime(runtime: unknown): string | null {
    return typeof runtime === "string" ? runtime : null;
}

export class SignalRTransport {
    private readonly windowId: string;
    private readonly connection: HubConnection;
    private started = false;
    private connected = false;
    private stopping = false;

    // The reconnect under way after a drop; null while the connection is up or given up.
    private reconnect: ReconnectLoop | null = null;
    private reconnectWindow: number;
    // Where the next reconnect goes on from: the first drop since the page last attached (`Date.now()`) and the try after the last made.
    // Reset only by an attach, so a connection the server takes and drops again before one does not start the backoff over.
    private reconnectSince: number | null = null;
    private reconnectAttempt = 0;
    // When the latest drop happened (`performance.now()`): a press raised before it and sent after it waited across it.
    private droppedAt = Number.NEGATIVE_INFINITY;
    private readonly reconnectingHandlers: ((error?: Error) => void)[] = [];
    private readonly reconnectedHandlers: (() => void | Promise<void>)[] = [];
    private readonly closedHandlers: ((error?: Error) => void)[] = [];
    private readonly expiredHandlers: (() => void)[] = [];
    // The presses waiting behind the gate with no bound yet, told of a drop that comes meanwhile (`waitBoundedAsync`).
    private readonly dropWatchers = new Set<() => void>();

    // A hydrated page is clickable before the connection opens, so every call but the attach waits behind this.
    private readonly gate = new AttachGate();

    // Pushes and the answers that carry changes, applied in the order they arrived.
    private readonly inbound: InboundOrder;

    /** `applyChanges` takes every change set an answer carries, in its turn; the answer resolves once it has, without them. */
    public constructor(windowId: string, applyChanges: ChangeSink, options: SignalRTransportOptions = {}) {
        this.windowId = windowId;
        this.inbound = new InboundOrder(applyChanges);
        this.reconnectWindow = options.reconnectWindowMilliseconds ?? DefaultReconnectWindowMilliseconds;

        // Not SignalR's automatic reconnect: its retries end after a fixed list and cannot be woken, so `reconnectAsync` runs its own.
        // A socket that drops and comes straight back keeps the connection, its calls and what was sent meanwhile (stateful reconnect).
        this.connection = new HubConnectionBuilder()
            .withUrl(options.hubUrl ?? "/_ne/hub")
            .withStatefulReconnect()
            .configureLogging(LogLevel.Warning)
            .build();
        this.connection.onclose(error => this.closed(error));

        // The network back or the page on screen again: a try now beats the rest of a wait of up to half a minute.
        window.addEventListener("online", () => this.reconnect?.wake());
        window.addEventListener("pageshow", () => this.reconnect?.wake());
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible")
                this.reconnect?.wake();
        });
    }

    /** A connection closed under the page is started again until the server's retention runs out; one the page closed is said closed. */
    private closed(error?: Error): void {
        this.started = false;

        if (this.stopping || this.gate.failure !== null || !this.connected) {
            for (const handler of this.closedHandlers)
                handler(error);

            return;
        }

        void this.reconnectAsync(error);
    }

    private async reconnectAsync(error?: Error): Promise<void> {
        this.reconnectSince ??= Date.now();

        const loop = new ReconnectLoop({ start: () => this.connection.start(), windowMilliseconds: this.reconnectWindow, startedAt: this.reconnectSince, firstAttempt: this.reconnectAttempt });

        this.reconnect = loop;
        this.droppedAt = performance.now();

        for (const dropped of [...this.dropWatchers])
            dropped();

        this.dropWatchers.clear();

        // Nothing may be sent until the runtime re-attaches: the new connection is attached to nothing.
        this.gate.rearm();

        for (const handler of this.reconnectingHandlers)
            handler(error);

        const back = await loop.runAsync();

        this.reconnect = null;
        this.reconnectAttempt = loop.nextAttempt;

        if (back) {
            this.started = true;

            for (const handler of this.reconnectedHandlers) {
                void Promise.resolve(handler()).catch(failure => {
                    logError("reattach after reconnect failed.", failure);
                });
            }

            return;
        }

        // Stopped by the page, which has said the connection is lost already.
        if (this.gate.failure !== null)
            return;

        logWarn("reconnecting gave up: the server would have let the page's runtime go by now.", error);

        for (const handler of this.closedHandlers)
            handler(error ?? new Error("the connection to the server did not come back."));
    }

    public get instanceId(): string | null {
        return this.connection.connectionId ?? null;
    }

    /** Whether the connection dropped and the reconnect is still trying to bring it back. */
    public get isReconnecting(): boolean {
        return this.reconnect !== null;
    }

    /** Whether a call made now waits for the page to attach again after a drop or a move to another runtime (`AttachGate.reattaching`). */
    public get isReattaching(): boolean {
        return this.gate.reattaching;
    }

    /** A change set pushed, with the runtime that sent it; none from a host that does not say. */
    public onChanges(handler: (changes: ServerChangeSet, runtime: string | null) => void): void {
        this.connection.on("ui.changes", this.inbound.pushed((payload: unknown, sender?: unknown) => handler(payload as ServerChangeSet, readRuntime(sender))));
    }

    // Effects raised outside a command, a Direct runtime's command effects, and a background command's whole result, by its request id.
    public onCommandResult(handler: (result: UICommandExecutionResult, runtime: string | null) => void): void {
        this.connection.on("ui.commandResult", this.inbound.pushed((payload: unknown, sender?: unknown) => handler(payload as UICommandExecutionResult, readRuntime(sender))));
    }

    /** The connection dropped — not a socket that came straight back, which keeps it — and the reconnect starts. */
    public onReconnecting(handler: (error?: Error) => void): void {
        this.reconnectingHandlers.push(handler);
    }

    /** The connection is open again: a new one, attached to nothing yet. */
    public onReconnected(handler: () => void | Promise<void>): void {
        this.reconnectedHandlers.push(handler);
    }

    /** The connection is gone for good: the reconnect ran out of time, or the page closed it. */
    public onClosed(handler: (error?: Error) => void): void {
        this.closedHandlers.push(handler);
    }

    /** A press dropped for waiting behind a reattach longer than it may (`CommandExpired`). */
    public onCommandExpired(handler: () => void): void {
        this.expiredHandlers.push(handler);
    }

    public async startAsync(): Promise<void> {
        if (this.started || this.connection.state !== HubConnectionState.Disconnected)
            return;

        try {
            await this.connection.start();
            this.started = true;
            this.connected = true;

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
        this.reconnect?.stop();

        if (this.connection.state === HubConnectionState.Disconnected)
            return;

        this.stopping = true;

        try {
            await this.connection.stop();
        }
        finally {
            this.stopping = false;
        }

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

            // A runtime built since the page attached, or a page the server will not attach as it stands, reloads with nothing sent.
            this.gate.answered(result);

            // Attached: a drop from here is a new one, tried at once and given the whole window.
            this.reconnectSince = null;
            this.reconnectAttempt = 0;

            // The reconnect tries for as long as the server keeps the runtime after a drop, where the server says how long.
            if (typeof result.retentionMilliseconds === "number" && result.retentionMilliseconds > 0)
                this.reconnectWindow = result.retentionMilliseconds;

            return result;
        }
        catch (error) {
            // A gate never opened would hang every call: shut until the retried attach, and giving up closes it. Whoever waits keeps
            // waiting — failed here, a value among them would be dropped, though the retry a moment later attaches.
            this.gate.rearm();

            throw error;
        }
    }

    /**
     * The command's result once its changes are applied, without them. `raisedAt`: when the reader pressed (`performance.now()`), so a
     * press held behind values across a drop is bounded too.
     */
    public async processEventAsync(request: UICommandRequest, raisedAt: number = performance.now()): Promise<UICommandExecutionResult> {
        return await this.invokeAsync<UICommandExecutionResult>("ProcessEventAsync", [request], invoked => this.inbound.answered(invoked, result => result.changes, withoutChanges), raisedAt);
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

    /** Holds every call but the attach until an attach is answered, as a reconnect does: the page is going to another runtime. */
    public holdCalls(): void {
        this.gate.rearm();
    }

    /** Tells the runtime what the page is now: on screen or not, and what the browser lets it show. */
    public async reportClientStateAsync(state: ClientState): Promise<void> {
        await this.invokeAsync<void>("ReportClientStateAsync", [state]);
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

    /** `raisedAt`, a press's: one that waits across a drop is dropped as stale once `CommandWaitMilliseconds` old (`pressAllowance`). */
    private async invokeAsync<TResult>(methodName: string, args: readonly unknown[], answered?: (invoked: Promise<TResult>) => Promise<TResult>, raisedAt?: number): Promise<TResult> {
        // A long wait behind the attach is logged, so a click that seems to go nowhere can be told from one never made.
        const stalled = window.setTimeout(() => logWarn("call waiting behind the attach.", { methodName }), AttachStallWarningMilliseconds);

        try {
            const allowance = raisedAt === undefined ? null : pressAllowance(raisedAt, performance.now(), this.droppedAt, this.gate.reattaching, CommandWaitMilliseconds);

            // An open gate lets the call through at once, before any drop could come: no bound to keep.
            await (raisedAt === undefined || (allowance === null && !this.gate.isPending) ? this.gate.wait() : this.waitBoundedAsync(methodName, allowance));
        } finally {
            window.clearTimeout(stalled);
        }

        return await this.invokeCoreAsync<TResult>(methodName, args, answered);
    }

    /**
     * Waits behind the gate for the `allowance` left (`pressAllowance`); with none yet — the press waits for the page's first attach and
     * nothing has dropped since it — a drop that comes while it waits bounds it from then, `CommandWaitMilliseconds`.
     */
    private async waitBoundedAsync(methodName: string, allowance: number | null): Promise<void> {
        let expiry = 0;
        let fail: () => void = () => { };
        const expired = new Promise<never>((_, reject) => {
            fail = () => reject(new CommandExpired(methodName, CommandWaitMilliseconds));
        });
        const dropped = (): void => {
            expiry = window.setTimeout(fail, CommandWaitMilliseconds);
        };

        if (allowance === null)
            this.dropWatchers.add(dropped);
        else if (allowance <= 0)
            // Already past its bound: dropped without waiting, though the gate may be open by now.
            fail();
        else
            expiry = window.setTimeout(fail, allowance);

        try {
            // The expiry first: one already past its bound loses no race to a gate already open.
            await Promise.race([expired, this.gate.wait()]);
        }
        catch (error) {
            if (error instanceof CommandExpired) {
                for (const handler of this.expiredHandlers)
                    handler();
            }

            throw error;
        }
        finally {
            window.clearTimeout(expiry);
            this.dropWatchers.delete(dropped);
        }
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

        // Between a drop and its return only the reconnect starts the connection: a second start would race it.
        if (this.reconnect !== null)
            throw new Error("the connection to the server is reconnecting.");

        if (this.connection.state === HubConnectionState.Disconnected) {
            this.started = false;
            await this.startAsync();
            return;
        }

        throw new Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
    }
}
