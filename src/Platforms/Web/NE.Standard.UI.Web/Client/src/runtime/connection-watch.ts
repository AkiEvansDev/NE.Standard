// While SignalR brings a dropped connection back the page says so, on the document element and in a quiet notice, but only past a grace
// a short drop never outlasts, so a blip stays invisible; the notice goes by itself once the connection is back, or gives way to the
// page's "lost" notice once SignalR gives up.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { ConnectionAttribute } from "../addressing/dom-attributes.ts";
import type { NotificationEngine } from "../interactions/notification-engine.ts";
import type { SignalRTransport } from "../transport/signalr-transport.ts";
import { clientStrings } from "./client-strings.ts";

/** How long a dropped connection may be away unseen. */
const ReconnectGraceMilliseconds = 2000;

export type ConnectionWatchOptions = {
    // The document element: the state is the page's, for a stylesheet or a test to read.
    readonly root: Element;
    readonly connection: Pick<SignalRTransport, "onReconnecting" | "onReconnected">;
    readonly notifications: Pick<NotificationEngine, "show" | "dismiss">;
    readonly graceMilliseconds?: number;
};

export class ConnectionWatch {
    private readonly root: Element;
    private readonly notifications: Pick<NotificationEngine, "show" | "dismiss">;
    private readonly graceMilliseconds: number;
    private grace: number | null = null;
    private notice: HTMLElement | null = null;
    private given = false;

    public constructor(options: ConnectionWatchOptions) {
        this.root = options.root;
        this.notifications = options.notifications;
        this.graceMilliseconds = options.graceMilliseconds ?? ReconnectGraceMilliseconds;

        options.connection.onReconnecting(() => this.reconnecting());
        options.connection.onReconnected(() => this.reconnected());
    }

    private reconnecting(): void {
        if (this.given || this.grace !== null || this.notice !== null)
            return;

        this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds);
    }

    private showReconnecting(): void {
        this.grace = null;
        this.root.setAttribute(ConnectionAttribute, "reconnecting");

        // Kept until the connection is back or given up: it says a state, and a toast's own timer would end it mid-reconnect.
        this.notice = this.notifications.show({ message: clientStrings.text("ui.connection.reconnecting"), sticky: true });
    }

    private reconnected(): void {
        if (this.given)
            return;

        this.clear();
        this.root.removeAttribute(ConnectionAttribute);
    }

    private clear(): void {
        if (this.grace !== null) {
            window.clearTimeout(this.grace);
            this.grace = null;
        }

        if (this.notice !== null) {
            this.notifications.dismiss(this.notice);
            this.notice = null;
        }
    }

    /** The connection is given up for good: the page's own notice offers the reload, so this one goes. */
    public lost(): void {
        this.given = true;
        this.clear();
        this.root.setAttribute(ConnectionAttribute, "lost");
    }
}
