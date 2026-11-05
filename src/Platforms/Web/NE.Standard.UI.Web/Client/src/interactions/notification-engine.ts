// `.ts` on the value imports: `node --test` loads this module as it is.
import { ButtonClass, EventBoundaryAttribute, NotificationActionClass, NotificationClass, NotificationCloseClass, NotificationConnectionClass, NotificationHostClass, NotificationLeavingClass, NotificationMessageClass, NotificationTitleClass, SmallButtonClass, SmallGhostButtonClasses, TooltipAttribute } from "../addressing/dom-attributes.ts";
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { toButtonVariantClass, toColorToken } from "../rendering/web-dom-converters.ts";
import type { NotificationActionModel } from "../metadata/metadata-index.ts";
import { isOnScreen } from "../state/client-state.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import { logWarn } from "../metadata/logger.ts";
import { isAuthorText, isPhrase } from "../rendering/words.ts";
import type { AuthorText, Phrase } from "../rendering/words.ts";
import { putUpAnnouncer } from "./live-announcer.ts";
import type { LiveAnnouncer, Politeness } from "./live-announcer.ts";
import { bottomBarTop } from "./anchored-popup.ts";
import { isComposing } from "./keyboard-shortcut.ts";
import { findNativeModalDialog } from "./open-dialogs.ts";
import { registerEscapeLayer } from "./popup-dismissal.ts";
import { liveFocusReturn, restoreFocusTo } from "./popup-focus.ts";
import type { ComponentIndex } from "./popup-focus.ts";

const DefaultDurationMs = 5000;

// A toast carrying an action stands longer by default: the reader reads the message before they reach its button (an Undo).
const DefaultActionDurationMs = 8000;

// How far the host stands off the window's bottom: a phone's bottom bar's height, read by `liftAboveBottomBar`.
const LiftProperty = "--ui-notification-lift";

// The severities that carry an accent bar; anything else takes the default border colour.
const AccentedTones = new Set(["info", "success", "warning", "danger", "primary", "accent"]);
const UrgentTones = new Set(["warning", "danger"]);

// What a toast takes that must not reach a package's native modal dialog the host is raised into: its Escape closing the package's
// chooser, a press read as one outside its content.
const ForeignDialogKeptEvents = ["keydown", "keyup", "pointerdown", "pointerup", "mousedown", "mouseup", "click", "dblclick", "contextmenu"];
const keptHosts = new WeakSet<HTMLElement>();

export type NotificationEngineOptions = {
    readonly root?: ParentNode;
    /** The page's components by id (the runtime's `DomRegistry`), through which an opener the page redrew away is found again. */
    readonly dom?: ComponentIndex;
    readonly durationMs?: number;
};

export type NotificationRequest = {
    // A phrase or an author's text is written through the words, marked, so a language switch rewrites an open toast; a plain
    // string is the page's own words already and is shown as written.
    readonly message: string | Phrase | AuthorText;
    // A line over the message, written as it is: a system notification's title, shown here as its fallback.
    readonly title?: Phrase | AuthorText;
    readonly tone?: unknown;
    // Stays until the reader closes it: for a state that is still true after a moment, not an event that happened.
    readonly sticky?: boolean;
    // How long a toast that is not sticky stands, which is its action's window; absent is the engine's default, longer with an action.
    readonly durationMs?: number;
    readonly action?: NotificationAction;
    // The page's own connection notice: on a phone it stands at the bottom, where the thumb is, whatever corner the view asked for.
    readonly connection?: boolean;
};

/**
 * A button under the message that does the one thing the notice asks for, its words written as the message's are; `run` may answer
 * whether the server took it, and one answered false (refused, a busy command among them) is left to press again.
 */
export type NotificationAction = {
    readonly title: string | Phrase | AuthorText;
    readonly variant?: unknown;
    readonly run: () => void | Promise<boolean>;
};

export class NotificationEngine {
    private readonly root: ParentNode;
    private readonly components: ComponentIndex | null;
    private readonly durationMs: number;
    private host: HTMLElement | null = null;
    private readonly announcer: LiveAnnouncer;

    // Where the keyboard stood before it came into each toast: a toast closed with the focus in it gives it back there.
    private readonly focusOrigins = new WeakMap<HTMLElement, HTMLElement>();

    public constructor(options: NotificationEngineOptions = {}) {
        this.root = options.root ?? document;
        this.components = options.dom ?? null;
        this.durationMs = options.durationMs ?? DefaultDurationMs;

        // Up before the first toast: the host is the live region, and one inserted along with its words is not reliably read.
        this.ensureHost();
        this.announcer = putUpAnnouncer(this.root instanceof Document ? this.root.body : this.root);
        // A toast holding the keyboard is nearer than a dialog or a drawer: they leave it the Escape that closes it, theirs the next one.
        registerEscapeLayer(target => target instanceof Element && target.closest(`.${NotificationClass}`) !== null);

        // A native modal `<dialog>` a package opens stands in the top layer over the toasts: they are raised over it as it opens, and
        // back under the page as it closes. Capturing: neither event bubbles.
        for (const type of ["toggle", "close"]) {
            document.addEventListener(type, domEvent => {
                if (domEvent.target instanceof Element && domEvent.target.localName === "dialog")
                    this.raiseHost();
            }, true);
        }

        const refreshLift = (): void => {
            if (this.host !== null && this.host.children.length > 0)
                liftAboveBottomBar(this.host);
        };

        window.addEventListener("resize", refreshLift);
        window.visualViewport?.addEventListener("resize", refreshLift);
    }

    /** Speaks words to a screen reader and shows nothing (AnnounceEffect), through the hidden live regions beside the host. */
    public announce(message: NotificationRequest["message"], politeness?: Politeness): HTMLElement {
        return this.announcer.announce(message, politeness);
    }

    public show(request: NotificationRequest): HTMLElement {
        const tone = toColorToken(request.tone);
        const element = document.createElement("div");

        element.className = AccentedTones.has(tone)
            ? `${NotificationClass} ${NotificationClass}--${tone}`
            : NotificationClass;
        element.classList.toggle(NotificationConnectionClass, request.connection === true);

        // Warning and Danger are urgent: they interrupt a screen reader, as an alert; the rest is spoken politely by the host's live region.
        if (UrgentTones.has(tone))
            element.setAttribute("role", "alert");

        const message = document.createElement("span");

        message.className = NotificationMessageClass;

        if (request.title !== undefined) {
            const title = document.createElement("span");

            title.className = NotificationTitleClass;
            clientStrings.writeValue(title, null, request.title);
            element.append(title);
        }

        if (typeof request.message === "string")
            message.textContent = request.message;
        else
            clientStrings.writeValue(message, null, request.message);

        element.append(message);

        const dismissible = !(request.connection === true && request.sticky === true);

        if (dismissible) {
            const close = document.createElement("button");

            close.type = "button";
            // The dialog's ×: a small ghost button, its wash, its press and its tooltip, named by the same word.
            close.className = `${NotificationCloseClass} ${SmallGhostButtonClasses}`;
            // Marked, so a language switched while the toast stays says the close in the new one; named by the toast, as toasts stand
            // several at once and each has its own ×.
            clientStrings.write(close, "aria-label", "ui.notification.close", { title: request.title ?? request.message });
            clientStrings.write(close, TooltipAttribute, "ui.action.close");
            close.addEventListener("click", () => this.dismiss(element));

            element.append(close);
        }

        // After the cross: the action is drawn on a line of its own under the message, and Tab reads the toast as it is drawn.
        // A passing toast is done once its action went through; a sticky one is a state still true, and stays.
        if (request.action !== undefined)
            element.append(createAction(request.action, request.sticky === true ? null : () => this.dismiss(element)));

        if (dismissible) {
            // Escape on a toast holding the keyboard closes it, as its cross does, the keyboard going back where it came from.
            element.addEventListener("keydown", domEvent => {
                if (domEvent.key !== "Escape" || domEvent.defaultPrevented || isComposing(domEvent))
                    return;

                domEvent.preventDefault();
                this.dismiss(element);
            });
        }

        element.addEventListener("focusin", domEvent => {
            const from = domEvent.relatedTarget;

            if (from instanceof HTMLElement && !element.contains(from))
                this.focusOrigins.set(element, from);
        });

        // A toast raised off screen would pass unread: it waits until the page is on screen, and one dismissed meanwhile never shows.
        whenOnScreen(() => {
            if (element.classList.contains(NotificationLeavingClass))
                return;

            const host = this.ensureHost();

            liftAboveBottomBar(host);
            host.append(element);
            this.raiseHost();

            if (request.sticky !== true)
                this.standFor(element, request);
        });

        return element;
    }

    /** Closes a passing toast once its time is up. */
    private standFor(element: HTMLElement, request: NotificationRequest): void {
        // Paused while hovered or holding the keyboard, so a toast neither vanishes under a reader nor takes the focus down with it.
        const duration = request.durationMs !== undefined && request.durationMs > 0
            ? request.durationMs
            : request.action !== undefined ? DefaultActionDurationMs : this.durationMs;
        let hovered = false;
        let focused = false;
        let timer = window.setTimeout(() => this.dismiss(element), duration);

        const pause = (): void => window.clearTimeout(timer);
        const resume = (): void => {
            if (hovered || focused)
                return;

            window.clearTimeout(timer);
            timer = window.setTimeout(() => this.dismiss(element), duration);
        };

        element.addEventListener("mouseenter", () => {
            hovered = true;
            pause();
        });
        element.addEventListener("mouseleave", () => {
            hovered = false;
            resume();
        });
        element.addEventListener("focusin", () => {
            focused = true;
            pause();
        });
        element.addEventListener("focusout", domEvent => {
            if (domEvent.relatedTarget instanceof Node && element.contains(domEvent.relatedTarget))
                return;

            focused = false;
            resume();
        });
    }

    /** Fades the toast (the stylesheet's leaving animation), then closes the gap it leaves, so the stack slides rather than jumps. */
    public dismiss(element: HTMLElement): void {
        if (element.classList.contains(NotificationLeavingClass))
            return;

        element.classList.add(NotificationLeavingClass);

        // One still waiting for the page to come on screen is marked, and never shows.
        if (!element.isConnected)
            return;

        this.returnFocus(element);

        if (prefersReducedMotion() || typeof element.animate !== "function") {
            element.remove();
            return;
        }

        window.setTimeout(() => collapse(element), motion.fast);
    }

    /** Gives the keyboard back as a toast holding it goes — to where it came from, else the next toast — never to the body. */
    private returnFocus(element: HTMLElement): void {
        if (!element.contains(document.activeElement))
            return;

        const next = [...element.parentElement?.children ?? []].find(other => other !== element && !other.classList.contains(NotificationLeavingClass));
        const target = liveFocusReturn(this.focusOrigins.get(element), this.components) ?? next?.querySelector<HTMLElement>(`.${NotificationCloseClass}`) ?? null;

        restoreFocusTo(target, element);
    }

    private ensureHost(): HTMLElement {
        if (this.host !== null && this.host.isConnected)
            return this.host;

        const container = this.root instanceof Document ? this.root.body : this.root;
        const existing = container.querySelector<HTMLElement>(`.${NotificationHostClass}`);

        const host = existing ?? document.createElement("div");

        host.classList.add(NotificationHostClass);
        host.setAttribute("role", "status");
        host.setAttribute("aria-live", "polite");

        // No event raised on a toast is a component's around the host, which a package's dialog it stands in may sit inside.
        host.setAttribute(EventBoundaryAttribute, "");

        // Kept after its last toast, empty and click-through, since it has to stand in the page before the next one's words arrive.
        if (existing === null)
            container.append(host);

        keepOutOfForeignDialog(host);

        // A manual popover, so it stands in the top layer: over a package's native modal `<dialog>` too, which the z-index cannot reach.
        host.setAttribute("popover", "manual");
        this.host = host;
        this.raiseHost();

        return host;
    }

    /**
     * Shows the host in the top layer again, above all that stands there: inside the open native modal `<dialog>`, where it is neither
     * inert nor painted under it (the overlay scrollbar's layer does the same), else under the page's own container.
     */
    private raiseHost(): void {
        const host = this.host;

        if (host === null || !host.isConnected || typeof host.showPopover !== "function")
            return;

        const parent = findNativeModalDialog(document) ?? (this.root instanceof Document ? this.root.body : this.root);

        if (host.parentElement !== parent)
            parent.append(host);

        if (host.matches(":popover-open"))
            host.hidePopover();

        host.showPopover();
    }
}

/**
 * Stops a toast's keys and presses at the host while it stands in a package's native `<dialog>` (the framework draws none), whose own
 * handlers would take them for its own; under the page's container they go on as any element's.
 */
function keepOutOfForeignDialog(host: HTMLElement): void {
    // Once per host: a host the page already held is found again after a redraw.
    if (keptHosts.has(host))
        return;

    keptHosts.add(host);

    for (const type of ForeignDialogKeptEvents) {
        host.addEventListener(type, domEvent => {
            if (host.parentElement?.localName === "dialog")
                domEvent.stopPropagation();
        });
    }
}

/** Runs `show` now on a page on screen, else once the page comes back on screen. */
function whenOnScreen(show: () => void): void {
    if (isOnScreen(document.visibilityState)) {
        show();
        return;
    }

    const shown = (): void => {
        if (!isOnScreen(document.visibilityState))
            return;

        document.removeEventListener("visibilitychange", shown);
        show();
    };

    document.addEventListener("visibilitychange", shown);
}

/**
 * Stands the stack above a phone's bottom bar, which a toast at the page's bottom covered, its Undo over the bar's entries; read as
 * each toast comes, since the bar steps aside while the on-screen keyboard is up.
 */
function liftAboveBottomBar(host: HTMLElement): void {
    const lift = window.innerHeight - bottomBarTop(window.innerHeight);

    if (lift > 0)
        host.style.setProperty(LiftProperty, `${Math.round(lift)}px`);
    else
        host.style.removeProperty(LiftProperty);
}

/** Slides a faded toast's height, padding, edge and gap to its neighbour down to nothing, then removes it. */
function collapse(element: HTMLElement): void {
    if (!element.isConnected)
        return;

    const style = getComputedStyle(element);
    const gap = element.parentElement === null ? 0 : parseFloat(getComputedStyle(element.parentElement).rowGap) || 0;

    element.style.overflow = "hidden";

    // Measured and slid, as the collapsible's fold is: an auto height is not a length CSS can interpolate.
    const animation = element.animate([
        { height: style.height, paddingTop: style.paddingTop, paddingBottom: style.paddingBottom, borderTopWidth: style.borderTopWidth, borderBottomWidth: style.borderBottomWidth, marginTop: "0px" },
        { height: "0px", paddingTop: "0px", paddingBottom: "0px", borderTopWidth: "0px", borderBottomWidth: "0px", marginTop: `${-gap}px` }
    ], { duration: motion.fast, easing: motion.exit, fill: "forwards" });

    const remove = (): void => element.remove();

    void animation.finished.then(remove, remove);
}

/**
 * The action's button; with `done`, run once and then done — a second press while the toast fades would ask for what the first
 * already did — and without it, pressed as often as the reader likes. An action that answers is done once the server took it, run
 * or failed: refused (a busy command), it can be pressed again while the toast stands, its window the undo's.
 */
function createAction(action: NotificationAction, done: (() => void) | null): HTMLButtonElement {
    const button = document.createElement("button");
    let spent = false;

    button.type = "button";
    button.className = `${NotificationActionClass} ${ButtonClass} ${toButtonVariantClass(action.variant)} ${SmallButtonClass}`;

    if (typeof action.title === "string")
        button.textContent = action.title;
    else
        clientStrings.writeValue(button, null, action.title);

    button.addEventListener("click", () => {
        if (spent)
            return;

        const ran = action.run();

        if (done === null)
            return;

        spent = true;

        if (ran === undefined) {
            done();
            return;
        }

        void ran.then(took => {
            if (took)
                done();
            else
                spent = false;
        }, (error: unknown) => {
            spent = false;
            logWarn("a notification's action failed.", error);
        });
    });

    return button;
}

/**
 * The button a notification effect's action asks for, pressing it running what the server offered under its id; none where the
 * server offered nothing — a command it could not offer is logged there, and the message still shows, without the button.
 */
export function offeredAction(model: NotificationActionModel | null | undefined, runAction: (id: string) => Promise<boolean>): NotificationAction | undefined {
    const id = offeredActionId(model);
    const title = model?.title;

    if (id === undefined)
        return undefined;

    if (!isPhrase(title) && !isAuthorText(title)) {
        logWarn("a notification's action carries no words.", model);
        return undefined;
    }

    return { title, variant: model?.variant, run: () => runAction(id) };
}

/** The id the server offered a notification's action under, or none where it offered nothing. */
export function offeredActionId(model: NotificationActionModel | null | undefined): string | undefined {
    return model !== null && model !== undefined && typeof model.id === "string" && model.id.length > 0 ? model.id : undefined;
}
