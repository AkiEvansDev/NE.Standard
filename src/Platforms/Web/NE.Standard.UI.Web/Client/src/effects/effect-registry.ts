import { HiddenAttribute } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { DialogEngine } from "../interactions/dialog-engine";
import { NotificationEngine } from "../interactions/notification-engine";
import {
    ClientEffect,
    ClientEffectKindValue,
    DialogClientEffect,
    DownloadFileClientEffect,
    NavigateClientEffect,
    NotificationClientEffect,
    ScrollClientEffect,
    ScrollToClientEffect,
    TargetedClientEffect,
    getClientEffectKind,
    getIdValue,
    getScrollAxis,
    getScrollPosition,
    getScrollToBehavior,
    getScrollToBlock
} from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";

export type EffectContext = {
    readonly effect: ClientEffect;
    readonly dom: DomRegistry;
};

export type EffectRegistryOptions = {
    readonly dialogs?: DialogEngine;
    readonly notifications?: NotificationEngine;
};

export type EffectHandler = (context: EffectContext) => void;

export type EffectRegistration = {
    readonly kind: ClientEffectKindValue;
    readonly handler: EffectHandler;
};

const FocusableSelector = "input, select, textarea, button, a[href], [tabindex]:not([tabindex=\"-1\"])";

export class EffectRegistry {
    private readonly handlers = new Map<string, EffectHandler>();
    private readonly dialogs: DialogEngine | undefined;
    private readonly notifications: NotificationEngine | undefined;

    public constructor(options: EffectRegistryOptions = {}) {
        this.dialogs = options.dialogs;
        this.notifications = options.notifications;

        this.registerDefaults();
    }

    public register(kind: ClientEffectKindValue, handler: EffectHandler): void {
        this.handlers.set(getClientEffectKind(kind), handler);
    }

    public applyAll(effects: readonly ClientEffect[] | null | undefined, dom: DomRegistry): void {
        if (effects === null || effects === undefined)
            return;

        for (const effect of effects)
            this.apply({ effect, dom });
    }

    public apply(context: EffectContext): void {
        const kind = getClientEffectKind(context.effect?.kind);
        const handler = this.handlers.get(kind);

        if (handler === undefined) {
            logWarn("client effect kind is not supported.", { kind: context.effect?.kind, effect: context.effect });
            return;
        }

        handler(context);
    }

    private registerDefaults(): void {
        this.register("Navigate", context => {
            const url = buildNavigationUrl(context.effect as NavigateClientEffect);

            if (url === null) {
                logWarn("navigate effect carries no route.", context.effect);
                return;
            }

            // A full page load, not a client-side route swap: every navigation is a fresh compile plus a fresh
            // attach, and the runtime store still assumes one route per connection id.
            window.location.assign(url);
        });

        this.register("Focus", context => {
            const element = resolveTarget(context);

            if (element === null)
                return;

            focusElement(element);
        });

        this.register("ScrollTo", context => {
            const element = resolveTarget(context);

            if (element === null)
                return;

            const effect = context.effect as ScrollToClientEffect;
            const behavior = getScrollToBehavior(effect.behavior);
            const block = getScrollToBlock(effect.block);

            element.scrollIntoView({
                behavior: behavior === "Smooth" ? "smooth" : "auto",
                block: block === "Unknown" ? "nearest" : (block.toLowerCase() as ScrollLogicalPosition)
            });
        });

        // Scrolls a container, where ScrollTo brings a component into view: a "back to top" names the
        // scroller and a position, and has no component to point at.
        this.register("Scroll", context => {
            const element = resolveTarget(context);

            if (element === null)
                return;

            const effect = context.effect as ScrollClientEffect;
            const vertical = getScrollAxis(effect.axis) !== "Horizontal";
            const scroller = resolveScroller(element, vertical);

            if (scroller === null) {
                logWarn("scroll effect target has no scrollable element.", context.effect);
                return;
            }

            const page = vertical ? scroller.clientHeight : scroller.clientWidth;
            const max = (vertical ? scroller.scrollHeight : scroller.scrollWidth) - page;
            const current = vertical ? scroller.scrollTop : scroller.scrollLeft;
            const position = getScrollPosition(effect.position);

            let next: number;

            switch (position) {
                case "Start": next = 0; break;
                case "End": next = max; break;
                case "Offset": next = effect.offset ?? 0; break;
                case "PageBack": next = current - page; break;
                case "PageForward": next = current + page; break;
                default:
                    logWarn("scroll effect carries an unsupported position.", context.effect);
                    return;
            }

            next = Math.max(0, Math.min(max, next));

            const behavior = getScrollToBehavior(effect.behavior) === "Smooth" ? "smooth" : "auto";

            scroller.scrollTo(vertical ? { top: next, behavior } : { left: next, behavior });
        });

        // Drives the same base-tier hidden attribute a bound Visible property does, rather than a class of its
        // own, so an effect and a later binding update resolve through one mechanism instead of fighting.
        this.register("Show", context => {
            resolveTarget(context)?.removeAttribute(HiddenAttribute);
        });

        this.register("Hide", context => {
            resolveTarget(context)?.setAttribute(HiddenAttribute, "");
        });

        this.register("OpenDialog", context => {
            this.applyDialogEffect(context, "OpenDialog", (dialogs, key) => dialogs.open(key));
        });

        this.register("CloseDialog", context => {
            this.applyDialogEffect(context, "CloseDialog", (dialogs, key) => dialogs.close(key));
        });

        // An anchor with `download`, not a fetch: the browser then owns saving the file and showing its own
        // progress, which is the whole reason the content travels over HTTP instead of the connection.
        this.register("DownloadFile", context => {
            const effect = context.effect as DownloadFileClientEffect;

            if (effect.requestPath === undefined || effect.requestPath.length === 0) {
                logWarn("download effect carries no path.", context.effect);
                return;
            }

            const anchor = document.createElement("a");

            anchor.href = effect.requestPath;
            anchor.download = effect.fileName ?? "";
            anchor.style.display = "none";

            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
        });

        this.register("ShowNotification", context => {
            const effect = context.effect as NotificationClientEffect;

            if (effect.message === undefined || effect.message.length === 0) {
                logWarn("show notification effect carries no message.", context.effect);
                return;
            }

            if (this.notifications === undefined) {
                logWarn("show notification effect arrived but no notification engine is wired up.", effect.message);
                return;
            }

            this.notifications.show({ message: effect.message, severity: effect.severity });
        });
    }

    private applyDialogEffect(context: EffectContext, kind: string, apply: (dialogs: DialogEngine, key: string) => boolean): void {
        const key = (context.effect as DialogClientEffect).dialogKey;

        if (key === undefined || key.length === 0) {
            logWarn(`${kind} effect carries no dialog key.`, context.effect);
            return;
        }

        if (this.dialogs === undefined) {
            logWarn(`${kind} effect arrived but no dialog engine is wired up.`, key);
            return;
        }

        apply(this.dialogs, key);
    }
}

function resolveTarget(context: EffectContext): Element | null {
    const target = (context.effect as TargetedClientEffect).target;

    if (target === undefined || target.id === undefined) {
        // A ClientEffect that reached the client with an empty target is a serialization failure, not a
        // missing element — the discriminator or the converter is wrong.
        logWarn("targeted client effect carries no resolved component address.", context.effect);
        return null;
    }

    const element = context.dom.findComponent(getIdValue(target.id), target.dynamicParameters ?? []);

    if (element === null)
        logWarn("client effect target was not found in the DOM.", context.effect);

    return element;
}

/**
 * The addressed component is often the scroller itself, since overflow sits on the component root — but not
 * always: an items view scrolls its host, which is a child, and naming the view scrolled the page instead
 * because the walk only ever went outwards. Inside first, then out for an author who named a wrapper.
 */
function resolveScroller(element: Element, vertical: boolean): Element | null {
    if (isScrollable(element, vertical))
        return element;

    for (const candidate of element.querySelectorAll("*")) {
        if (isScrollable(candidate, vertical))
            return candidate;
    }

    for (let current = element.parentElement; current !== null; current = current.parentElement) {
        if (isScrollable(current, vertical))
            return current;
    }

    return null;
}

function isScrollable(element: Element, vertical: boolean): boolean {
    const overflow = vertical
        ? getComputedStyle(element).overflowY
        : getComputedStyle(element).overflowX;

    if (overflow !== "auto" && overflow !== "scroll")
        return false;

    return vertical
        ? element.scrollHeight > element.clientHeight
        : element.scrollWidth > element.clientWidth;
}

function focusElement(element: Element): void {
    if (element instanceof HTMLElement && (element.tabIndex >= 0 || element.matches(FocusableSelector))) {
        element.focus();
        return;
    }

    // A component root is usually a plain div; focus the first thing inside it that can actually take focus.
    const focusable = element.querySelector(FocusableSelector);

    if (focusable instanceof HTMLElement) {
        focusable.focus();
        return;
    }

    logWarn("focus effect target has nothing focusable.", element);
}

function buildNavigationUrl(effect: NavigateClientEffect): string | null {
    const route = effect.request?.route;

    if (route === undefined || route === null || route.length === 0)
        return null;

    const parameters = effect.request?.parameters;

    if (parameters === undefined || parameters === null)
        return route;

    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(parameters)) {
        if (value === null || value === undefined)
            continue;

        if (Array.isArray(value)) {
            for (const item of value)
                query.append(key, String(item));

            continue;
        }

        query.append(key, String(value));
    }

    const search = query.toString();

    return search.length === 0 ? route : `${route}?${search}`;
}
