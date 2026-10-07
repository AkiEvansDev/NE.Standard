/** A call the connection dropped under while SignalR reconnects: the server may or may not have taken it, and the next attach opens again. */
export class ConnectionDropped extends Error {
    /** The server closed the connection over an error of its own (a message past its size limit): the call may be what it choked on. */
    public readonly byServerError: boolean;

    public constructor(cause: unknown) {
        super("the connection to the server dropped under the call; it is reconnecting.", { cause });
        this.name = "ConnectionDropped";
        // SignalR's own wording for a close message that carries the server's error, as against a socket that went away.
        this.byServerError = cause instanceof Error && cause.message.startsWith("Server returned an error on close");
    }
}

/** What every hub call but the attach waits behind: open when attached, pending while reconnecting, failing every call once closed. */
export class AttachGate {
    private gate: Promise<void>;
    private pending = false;
    private open: () => void = () => { };
    private fail: (error: unknown) => void = () => { };
    private closedBy: Error | null = null;

    public constructor() {
        this.gate = this.arm();
    }

    /** Why the gate is closed for good; null while it can still open. */
    public get failure(): Error | null {
        return this.closedBy;
    }

    public wait(): Promise<void> {
        return this.gate;
    }

    public markAttached(): void {
        this.pending = false;
        this.open();
    }

    /** A reconnect under way: nothing may be sent until the runtime attaches the new connection. */
    public rearm(): void {
        // A gate still pending is kept: replacing it would leave whoever waits on it waiting for ever.
        if (this.closedBy !== null || this.pending)
            return;

        this.gate = this.arm();
    }

    /** An attach answered: open for a page that goes on, shut for one that reloads, whose calls would land in a runtime not its own. */
    public answered(answer: { readonly fresh?: boolean; readonly reload?: boolean }): void {
        if (answer.fresh === true || answer.reload === true)
            this.rearm();
        else
            this.markAttached();
    }

    /** The connection is gone for good: whoever waits, and whoever asks later, fails with this. */
    public close(error: Error): void {
        if (this.closedBy !== null)
            return;

        this.closedBy = error;
        this.pending = false;
        this.fail(error);

        const closed = Promise.reject(error);

        closed.catch(() => { });
        this.gate = closed;
    }

    private arm(): Promise<void> {
        const gate = new Promise<void>((resolve, reject) => {
            this.open = resolve;
            this.fail = reject;
        });

        this.pending = true;

        // A gate nobody ends up awaiting must not report as an unhandled rejection; a real waiter still sees the rejection.
        gate.catch(() => { });

        return gate;
    }
}
