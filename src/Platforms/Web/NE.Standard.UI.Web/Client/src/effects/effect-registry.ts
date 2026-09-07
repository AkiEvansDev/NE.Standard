import { ValueKindAttribute, VisibilityTierAttributes } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { ValueReaderRegistry, toDomString } from "../extensions/value-readers";
import { DialogEngine } from "../interactions/dialog-engine";
import { FocusableSelector } from "../interactions/popup-focus";
import { NotificationEngine } from "../interactions/notification-engine";
import {
    ClientEffect,
    ClientEffectKindValue,
    CopyToClipboardClientEffect,
    DialogClientEffect,
    DownloadFileClientEffect,
    NavigateClientEffect,
    NotificationClientEffect,
    ScrollClientEffect,
    ScrollToClientEffect,
    SetThemeClientEffect,
    TargetedClientEffect,
    getClientEffectKind,
    getIdValue,
    getScrollAxis,
    getScrollPosition,
    getScrollToBehavior,
    getScrollToBlock,
    getThemeMode
} from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";

export type EffectContext = {
    readonly effect: ClientEffect;
    readonly dom: DomRegistry;
};

export type EffectRegistryOptions = {
    readonly dialogs?: DialogEngine;
    readonly notifications?: NotificationEngine;
    // Reads the value a copy effect names a component for; left out where nothing on the page holds one.
    readonly valueReaders?: ValueReaderRegistry;
    // How the chosen theme reaches the session; left out where there is no connection to report it on.
    readonly reportTheme?: (mode: ThemeName) => void;
};

/** What the document declares, which has a third value the enum does not: no preference. */
export type ThemeName = "light" | "dark" | "auto";

const ThemeAttribute = "data-ui-theme";

export type EffectHandler = (context: EffectContext) => void;

export type EffectRegistration = {
    readonly kind: ClientEffectKindValue;
    readonly handler: EffectHandler;
};

export class EffectRegistry {
    private readonly handlers = new Map<string, EffectHandler>();
    private readonly dialogs: DialogEngine | undefined;
    private readonly notifications: NotificationEngine | undefined;
    private readonly valueReaders: ValueReaderRegistry | undefined;
    private readonly reportTheme: ((mode: ThemeName) => void) | undefined;

    public constructor(options: EffectRegistryOptions = {}) {
        this.dialogs = options.dialogs;
        this.notifications = options.notifications;
        this.valueReaders = options.valueReaders;
        this.reportTheme = options.reportTheme;

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
        const handler = kind.length === 0 ? undefined : this.handlers.get(kind);

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

            // A full page load, not a client-side route swap: the runtime store assumes one route per connection id.
            window.location.assign(url);
        });

        // On the document element: the theme is the page's, not a component's.
        this.register("SetTheme", context => {
            const mode = getThemeMode((context.effect as SetThemeClientEffect).mode);
            const theme: ThemeName = mode === "Unknown" ? "auto" : mode.toLowerCase() as ThemeName;

            if (document.documentElement.getAttribute(ThemeAttribute) !== theme)
                document.documentElement.setAttribute(ThemeAttribute, theme);

            // Reported whether or not the attribute moved: the session can still remember the other theme.
            this.reportTheme?.(theme);
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

        // Scrolls a container, where ScrollTo brings a component into view.
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

        // The three drive the same attributes a bound Visibility property does, every tier, so an effect and a later binding do not fight.
        this.register("Show", context => {
            applyVisibility(resolveTarget(context), null);
        });

        this.register("Hide", context => {
            applyVisibility(resolveTarget(context), "hidden");
        });

        this.register("Collapse", context => {
            applyVisibility(resolveTarget(context), "collapsed");
        });

        // Best effort: the clipboard API wants a secure context and a focused document, so a refusal falls back to the selection command.
        this.register("CopyToClipboard", context => {
            const text = resolveClipboardText(context, this.valueReaders);

            if (text === null)
                return;

            void copyText(text).catch(error => logWarn("copy to clipboard failed.", error));
        });

        this.register("OpenDialog", context => {
            this.applyDialogEffect(context, "OpenDialog", (dialogs, key) => dialogs.open(key));
        });

        this.register("CloseDialog", context => {
            this.applyDialogEffect(context, "CloseDialog", (dialogs, key) => dialogs.close(key));
        });

        // An anchor with `download`, not a fetch: the browser then owns saving the file and its progress.
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

function applyVisibility(target: Element | null, value: string | null): void {
    if (target === null)
        return;

    for (const attribute of VisibilityTierAttributes) {
        if (value === null)
            target.removeAttribute(attribute);
        else
            target.setAttribute(attribute, value);
    }
}

function resolveTarget(context: EffectContext): Element | null {
    const target = (context.effect as TargetedClientEffect).target;

    if (target === undefined || target.id === undefined) {
        // An empty target is a serialization failure, not a missing element.
        logWarn("targeted client effect carries no resolved component address.", context.effect);
        return null;
    }

    const element = context.dom.findComponent(getIdValue(target.id), target.dynamicParameters ?? []);

    if (element === null)
        logWarn("client effect target was not found in the DOM.", context.effect);

    return element;
}

/** The nearest scroller to the addressed element: itself first, then inside it, then outwards. */
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

function resolveClipboardText(context: EffectContext, valueReaders: ValueReaderRegistry | undefined): string | null {
    const effect = context.effect as CopyToClipboardClientEffect;

    if (typeof effect.text === "string")
        return effect.text;

    const element = resolveTarget(context);

    if (element === null)
        return null;

    if (valueReaders === undefined) {
        logWarn("copy to clipboard effect names a component but no value reader is wired up.", context.effect);
        return null;
    }

    const holder = resolveValueHolder(element);

    if (holder === null) {
        logWarn("copy to clipboard effect target holds no value.", context.effect);
        return null;
    }

    return toDomString(valueReaders.read(holder));
}

const NativeValueSelector = "input, textarea, select";

/** The element a component keeps its value on: the root when it names a kind or is a field itself, else the first field inside it. */
function resolveValueHolder(element: Element): Element | null {
    if (element.hasAttribute(ValueKindAttribute) || element.matches(NativeValueSelector))
        return element;

    return element.querySelector(`[${ValueKindAttribute}], ${NativeValueSelector}`);
}

async function copyText(text: string): Promise<void> {
    if (navigator.clipboard !== undefined) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        }
        catch {
            // Refused: the selection command below still works while the gesture that raised the effect is recent.
        }
    }

    if (!copyBySelection(text))
        throw new Error("neither the clipboard API nor the selection command took the text.");
}

function copyBySelection(text: string): boolean {
    const holder = document.createElement("textarea");

    holder.value = text;
    holder.setAttribute("readonly", "");
    holder.style.position = "fixed";
    holder.style.opacity = "0";

    document.body.appendChild(holder);
    holder.select();

    try {
        return document.execCommand("copy");
    }
    catch {
        return false;
    }
    finally {
        holder.remove();
    }
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
