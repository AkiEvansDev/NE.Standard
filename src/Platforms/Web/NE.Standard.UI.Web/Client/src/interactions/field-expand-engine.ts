// Client-side full-height modal editor for `TextAreaComponent` and `CodeInputComponent` (`SetExpandable`, `ExpandFieldEffect`).
// Promotes the live field root into a page dialog while leaving a height-preserving placeholder in place and bridging logical
// ancestors (`setLogicalParent`) so bindings, undo history, carets, completions, forms, and row parameters keep working unchanged.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    CommitInPlaceEventName, ensureElementId, FieldExpandableAttribute, FieldExpandActionsClass, FieldExpandAppearanceAttribute,
    FieldExpandAttribute, FieldExpandAttrsAttribute, FieldExpandBodyClass, FieldExpandCloseClass, FieldExpandDialogClass,
    FieldExpandedAttribute, FieldExpandHeaderClass, FieldExpandPlaceholderClass, FieldExpandSurfaceClass, FieldExpandTitleClass,
    FieldExpandWidthAttribute, InputFilledClass, InputGhostClass, InputHeaderActionClass, InputHeaderClass, InputHeaderRowClass,
    InputOutlineClass, InputUnderlineClass, SmallGhostButtonClasses, TextAreaGrowAttribute, TextIconAttribute, TextTitleClass,
    TextTypeSubtitleClass, TooltipAttribute, WordsAttribute
} from "../addressing/dom-attributes.ts";
import { setLogicalParent } from "../addressing/dynamic-parameters.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import type { DialogEngine } from "./dialog-engine.ts";
import { isFocusable, isInert } from "./interactive-state.ts";
import { buildPageDialog } from "./page-dialog.ts";
import { focusAsLastInput, isTouchLast } from "./popup-focus.ts";

const ExpandDialogKey = FieldExpandDialogClass;
const AppearanceClasses: readonly string[] = [InputFilledClass, InputOutlineClass, InputGhostClass, InputUnderlineClass];

type DialogParts = {
    readonly dialog: HTMLElement;
    readonly surface: HTMLElement;
    readonly title: HTMLElement;
    readonly actions: HTMLElement;
    readonly close: HTMLButtonElement;
    readonly body: HTMLElement;
};

type MovedAction = {
    readonly element: HTMLElement;
    readonly container: HTMLElement;
    readonly nextSibling: Element | null;
};

type ExpandSession = {
    readonly dialogs: Pick<DialogEngine, "open" | "close" | "dismiss"> & Partial<Pick<DialogEngine, "onBeforeClose">>;
    readonly fieldRoot: HTMLElement;
    readonly placeholder: HTMLElement;
    readonly textarea: HTMLTextAreaElement | null;
    readonly hadGrow: boolean;
    readonly savedTextareaWidth: string;
    readonly savedTextareaHeight: string;
    readonly savedAttributes: ReadonlyMap<string, boolean>;
    readonly savedAppearance: string | null;
    readonly appliedAppearance: string | null;
    readonly movedActions: readonly MovedAction[];
    collapsing: boolean;
};

export type FieldExpandEngineOptions = {
    readonly root?: ParentNode;
    readonly dialogs: DialogEngine;
};

let dialogParts: DialogParts | null = null;
let activeSession: ExpandSession | null = null;

export class FieldExpandEngine {
    private readonly root: ParentNode;
    private readonly dialogs: DialogEngine;

    public constructor(options: FieldExpandEngineOptions) {
        this.root = options.root ?? document;
        this.dialogs = options.dialogs;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent));
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const trigger = domEvent.target.closest<HTMLElement>(`[${FieldExpandAttribute}]`);

        if (trigger === null || isInert(trigger))
            return;

        const fieldRoot = trigger.closest<HTMLElement>(`[${FieldExpandableAttribute}]`);

        if (fieldRoot === null || isInert(fieldRoot))
            return;

        domEvent.preventDefault();
        expandField(this.dialogs, fieldRoot, this.root);
    }
}

/** Opens the modal editor for an expandable field root; answers whether `fieldRoot` is an expandable input. */
export function expandField(
    dialogs: Pick<DialogEngine, "open" | "close" | "dismiss"> & Partial<Pick<DialogEngine, "onBeforeClose">>,
    fieldRoot: Element,
    root: ParentNode = typeof document !== "undefined" ? document : fieldRoot
): boolean {
    if (!(fieldRoot instanceof HTMLElement) || !fieldRoot.hasAttribute(FieldExpandableAttribute))
        return false;

    if (isInert(fieldRoot))
        return true;

    if (activeSession?.fieldRoot === fieldRoot)
        return true;

    if (activeSession !== null) {
        activeSession.dialogs.close(ExpandDialogKey);
        collapseActive();
    }

    const parts = ensureDialog();
    const host = root instanceof Element ? root : document.body;
    const widthStyle = fieldRoot.getAttribute(FieldExpandWidthAttribute) ?? "";

    if (widthStyle.length > 0)
        parts.surface.setAttribute("style", widthStyle);
    else
        parts.surface.removeAttribute("style");

    const textarea = fieldRoot.querySelector<HTMLTextAreaElement>("textarea");
    writeDialogTitle(parts.title, fieldRoot, textarea);

    if (!parts.dialog.isConnected || parts.dialog.parentElement !== host) {
        parts.dialog.setAttribute("hidden", "");
        host.append(parts.dialog);
    }

    dialogs.onBeforeClose?.(ExpandDialogKey, () => collapseActive());

    // Opened before moving `fieldRoot` into `parts.body` so `DialogEngine` records the opener (even when it is the field's own `⤢` button).
    if (!dialogs.open(ExpandDialogKey))
        return true;

    const placeholder = document.createElement("div");
    placeholder.className = FieldExpandPlaceholderClass;

    const measuredHeight = fieldRoot.offsetHeight;

    if (measuredHeight > 0)
        placeholder.style.setProperty("height", `${measuredHeight}px`);

    fieldRoot.parentElement?.insertBefore(placeholder, fieldRoot);
    parts.body.append(fieldRoot);
    setLogicalParent(fieldRoot, placeholder);

    const movedActions = moveHeaderActionsIntoDialog(fieldRoot, parts.actions, parts.close);
    const savedAttributes = applyExpandedAttributes(fieldRoot);
    const { savedAppearance, appliedAppearance } = applyExpandedAppearance(fieldRoot);
    const hadGrow = textarea?.hasAttribute(TextAreaGrowAttribute) === true;
    const savedTextareaWidth = textarea?.style.getPropertyValue("width") ?? "";
    const savedTextareaHeight = textarea?.style.getPropertyValue("height") ?? "";

    if (textarea !== null) {
        if (hadGrow)
            textarea.removeAttribute(TextAreaGrowAttribute);

        textarea.style.removeProperty("width");
        textarea.style.removeProperty("height");
    }

    fieldRoot.setAttribute(FieldExpandedAttribute, "");

    activeSession = {
        dialogs,
        fieldRoot,
        placeholder,
        textarea,
        hadGrow,
        savedTextareaWidth,
        savedTextareaHeight,
        savedAttributes,
        savedAppearance,
        appliedAppearance,
        movedActions,
        collapsing: false
    };

    if (!isTouchLast() && textarea !== null && isFocusable(textarea))
        focusAsLastInput(textarea);

    return true;
}

function collapseActive(): void {
    const session = activeSession;

    if (session === null || session.collapsing)
        return;

    session.collapsing = true;
    activeSession = null;

    const { fieldRoot, placeholder, textarea, hadGrow, savedTextareaWidth, savedTextareaHeight, savedAttributes, savedAppearance, appliedAppearance, movedActions } = session;

    if (textarea !== null)
        textarea.dispatchEvent(new Event(CommitInPlaceEventName, { bubbles: true }));

    // Keep `document.activeElement` inside the closing dialog surface while `fieldRoot` moves back, so `DialogEngine.close` restores focus cleanly.
    if (dialogParts !== null && typeof document !== "undefined" && fieldRoot.contains(document.activeElement))
        dialogParts.surface.focus({ preventScroll: true });

    for (const [attribute, hadAttribute] of savedAttributes)
        fieldRoot.toggleAttribute(attribute, hadAttribute);

    if (appliedAppearance !== null) {
        fieldRoot.classList.remove(appliedAppearance);

        if (savedAppearance !== null)
            fieldRoot.classList.add(savedAppearance);
    }

    fieldRoot.removeAttribute(FieldExpandedAttribute);

    if (textarea !== null) {
        if (hadGrow) {
            textarea.setAttribute(TextAreaGrowAttribute, "");
        }
        else {
            if (savedTextareaWidth.length > 0)
                textarea.style.setProperty("width", savedTextareaWidth);
            else
                textarea.style.removeProperty("width");

            if (savedTextareaHeight.length > 0)
                textarea.style.setProperty("height", savedTextareaHeight);
            else
                textarea.style.removeProperty("height");
        }
    }

    restoreHeaderActions(movedActions);
    setLogicalParent(fieldRoot, null);

    if (placeholder.isConnected && placeholder.parentElement !== null) {
        placeholder.parentElement.insertBefore(fieldRoot, placeholder);
        placeholder.remove();
    }
    else {
        fieldRoot.remove();
        placeholder.remove();
    }
}

function ensureDialog(): DialogParts {
    if (dialogParts !== null)
        return dialogParts;

    const title = document.createElement("h2");
    title.className = `${FieldExpandTitleClass} ${TextTypeSubtitleClass}`;
    const titleId = ensureElementId(title, "field-expand-title");

    const { dialog, surface } = buildPageDialog({
        key: ExpandDialogKey,
        className: FieldExpandDialogClass,
        surfaceClassName: FieldExpandSurfaceClass,
        role: "dialog",
        labelledBy: titleId,
        closesOnEscapeAndBackdrop: true
    });

    const header = document.createElement("div");
    header.className = FieldExpandHeaderClass;

    const actions = document.createElement("div");
    actions.className = FieldExpandActionsClass;

    const close = document.createElement("button");
    close.type = "button";
    close.className = `${FieldExpandCloseClass} ${SmallGhostButtonClasses}`;
    close.setAttribute(TextIconAttribute, "");
    clientStrings.write(close, "aria-label", "ui.action.close");
    clientStrings.write(close, TooltipAttribute, "ui.action.close");

    close.addEventListener("click", () => {
        activeSession?.dialogs.dismiss(ExpandDialogKey);
    });

    actions.append(close);
    header.append(title, actions);

    const body = document.createElement("div");
    body.className = FieldExpandBodyClass;

    surface.append(header, body);

    // Fallback cleanup when `DialogEngine.onBeforeClose` is absent (for example a minimal test stub that flips `hidden` directly).
    if (typeof MutationObserver === "function") {
        new MutationObserver(() => {
            if (activeSession !== null && dialog.hasAttribute("hidden"))
                collapseActive();
        }).observe(dialog, { attributes: true, attributeFilter: ["hidden"] });
    }

    dialogParts = { dialog, surface, title, actions, close, body };
    return dialogParts;
}

function writeDialogTitle(title: HTMLElement, fieldRoot: HTMLElement, textarea: HTMLTextAreaElement | null): void {
    const captionSelector = `:scope > .${InputHeaderClass} .${TextTitleClass}, :scope > .${InputHeaderRowClass} > .${InputHeaderClass} .${TextTitleClass}`;
    const captionText = fieldRoot.querySelector<HTMLElement>(captionSelector)?.textContent?.trim() ?? "";

    if (captionText.length > 0) {
        title.removeAttribute(WordsAttribute);
        title.textContent = captionText;
        return;
    }

    const fallback = (textarea?.getAttribute("aria-label") ?? textarea?.getAttribute("placeholder") ?? "").trim();

    if (fallback.length > 0) {
        title.removeAttribute(WordsAttribute);
        title.textContent = fallback;
        return;
    }

    clientStrings.write(title, null, "ui.input.expand");
}

function moveHeaderActionsIntoDialog(fieldRoot: HTMLElement, actionsHost: HTMLElement, closeButton: HTMLElement): MovedAction[] {
    const headerActionBox = fieldRoot.querySelector<HTMLElement>(`:scope > .${InputHeaderRowClass} > .${InputHeaderActionClass}`);

    if (headerActionBox === null)
        return [];

    const moved: MovedAction[] = [];

    for (const child of [...headerActionBox.children]) {
        if (!(child instanceof HTMLElement) || child.hasAttribute(FieldExpandAttribute))
            continue;

        moved.push({ element: child, container: headerActionBox, nextSibling: child.nextElementSibling });
        actionsHost.insertBefore(child, closeButton);
        setLogicalParent(child, headerActionBox);
    }

    return moved;
}

function restoreHeaderActions(moved: readonly MovedAction[]): void {
    for (let index = moved.length - 1; index >= 0; index--) {
        const { element, container, nextSibling } = moved[index];

        setLogicalParent(element, null);

        if (!container.isConnected)
            continue;

        if (nextSibling !== null && nextSibling.parentElement === container)
            container.insertBefore(element, nextSibling);
        else
            container.insertBefore(element, container.querySelector(`[${FieldExpandAttribute}]`));
    }
}

function applyExpandedAttributes(fieldRoot: HTMLElement): Map<string, boolean> {
    const saved = new Map<string, boolean>();
    const raw = fieldRoot.getAttribute(FieldExpandAttrsAttribute);

    if (raw === null || raw.length === 0)
        return saved;

    let parsed: unknown;

    try {
        parsed = JSON.parse(raw);
    }
    catch {
        return saved;
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
        return saved;

    for (const [attribute, enabled] of Object.entries(parsed as Record<string, unknown>)) {
        if (typeof enabled !== "boolean")
            continue;

        saved.set(attribute, fieldRoot.hasAttribute(attribute));
        fieldRoot.toggleAttribute(attribute, enabled);
    }

    return saved;
}

function applyExpandedAppearance(fieldRoot: HTMLElement): { readonly savedAppearance: string | null; readonly appliedAppearance: string | null } {
    const target = fieldRoot.getAttribute(FieldExpandAppearanceAttribute);

    if (target === null || target.length === 0 || !AppearanceClasses.includes(target))
        return { savedAppearance: null, appliedAppearance: null };

    const current = AppearanceClasses.find(name => fieldRoot.classList.contains(name)) ?? null;

    if (current === target)
        return { savedAppearance: null, appliedAppearance: null };

    if (current !== null)
        fieldRoot.classList.remove(current);

    fieldRoot.classList.add(target);
    return { savedAppearance: current, appliedAppearance: target };
}
