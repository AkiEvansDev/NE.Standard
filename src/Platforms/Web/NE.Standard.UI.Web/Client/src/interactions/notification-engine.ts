import { toColorToken } from "../rendering/web-dom-converters";

const HostClass = "ui-notification-host";
const NotificationClass = "ui-notification";
const LeavingClass = "ui-notification--leaving";
const MessageClass = "ui-notification__message";
const CloseClass = "ui-notification__close";

const DefaultDurationMs = 5000;
const LeaveDurationMs = 160;

// The severities that carry an accent bar; anything else takes the default border colour.
const AccentedSeverities = new Set(["info", "success", "warning", "danger", "primary", "accent"]);

export type NotificationEngineOptions = {
    readonly root?: ParentNode;
    readonly durationMs?: number;
};

export type NotificationRequest = {
    readonly message: string;
    readonly severity?: unknown;
};

export class NotificationEngine {
    private readonly root: ParentNode;
    private readonly durationMs: number;
    private host: HTMLElement | null = null;

    public constructor(options: NotificationEngineOptions = {}) {
        this.root = options.root ?? document;
        this.durationMs = options.durationMs ?? DefaultDurationMs;
    }

    public show(request: NotificationRequest): HTMLElement {
        const severity = toColorToken(request.severity);
        const element = document.createElement("div");

        element.className = AccentedSeverities.has(severity)
            ? `${NotificationClass} ${NotificationClass}--${severity}`
            : NotificationClass;

        // Only Danger interrupts a screen reader; anything else would talk over the user for a routine toast.
        element.setAttribute("role", severity === "danger" ? "alert" : "status");
        element.setAttribute("aria-live", severity === "danger" ? "assertive" : "polite");

        const message = document.createElement("span");

        message.className = MessageClass;
        message.textContent = request.message;

        const close = document.createElement("button");

        close.type = "button";
        close.className = CloseClass;
        close.setAttribute("aria-label", "Close");
        close.textContent = "×";
        close.addEventListener("click", () => this.dismiss(element));

        element.append(message, close);
        this.ensureHost().append(element);

        let timer = window.setTimeout(() => this.dismiss(element), this.durationMs);

        // Auto-dismiss pauses while hovered, so a toast cannot vanish out from under someone reading it.
        element.addEventListener("mouseenter", () => window.clearTimeout(timer));
        element.addEventListener("mouseleave", () => {
            timer = window.setTimeout(() => this.dismiss(element), this.durationMs);
        });

        return element;
    }

    public dismiss(element: HTMLElement): void {
        if (!element.isConnected || element.classList.contains(LeavingClass))
            return;

        element.classList.add(LeavingClass);

        window.setTimeout(() => {
            element.remove();

            // A toast has no authored component and so no compiled node to render into the shell: the host is
            // built on demand and removed once empty, rather than sitting in the page permanently.
            if (this.host !== null && this.host.childElementCount === 0) {
                this.host.remove();
                this.host = null;
            }
        }, LeaveDurationMs);
    }

    private ensureHost(): HTMLElement {
        if (this.host !== null && this.host.isConnected)
            return this.host;

        const container = this.root instanceof Document ? this.root.body : this.root;
        const existing = container.querySelector<HTMLElement>(`.${HostClass}`);

        if (existing !== null) {
            this.host = existing;
            return existing;
        }

        const host = document.createElement("div");

        host.className = HostClass;
        container.append(host);
        this.host = host;

        return host;
    }
}
