// A validation message kept as it came (a rule's, a bound message's, the refusal's key) and its words in the page's language.

// `node --test` loads this module as it is: `.ts` on the value imports.
import { InvalidClass as ErrorClass, ListTriggerClass, PopupRoleSelector, TooltipAttribute, TooltipMarkAttribute, TooltipPlacementAttribute as PlacementAttribute, TooltipPressAttribute, TooltipSeverityAttribute, ValidationInfoClass, ValidationMarkClass, ValidationMessageAttribute as MessageAttribute, ValidationMessageMarkerClass, ValidationWarningClass } from "../addressing/dom-attributes.ts";
import { getInteractionOperator, getValidationSeverity } from "../metadata/metadata-index.ts";
import type { WebRenderValidationMetadata, WebValidationSeverityName } from "../metadata/metadata-index.ts";
import { escapeInlineMarkup } from "../rendering/inline-markup.ts";
import { clientStrings, forgetWords } from "../rendering/client-strings.ts";
import type { AuthorText, Phrase } from "../rendering/words.ts";
import { isAuthorText, isPhrase } from "../rendering/words.ts";
import { evaluateOperator } from "./interaction-evaluator.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { numberBoundRefusal, NumberRootSelector, refusesNumber } from "./number-input-engine.ts";
import { temporalBoundRefusal, refusesTemporal, TemporalRootSelector } from "./temporal-dom.ts";
import { pinTooltip, updateTooltip } from "./tooltip-engine.ts";

// Right edge on the mark: it sits at a field's corner at the end of a cell, where a centred tooltip would hang off the page.
const MarkerPlacement = "top-end";
// The copy's words stand beside its dot, after the value they speak of: above, they covered the row over it.
const MirrorPlacement = "right";
const MarkerHostProperty = "--ui-validation-marker-host";
const PresentationProperty = "--ui-validation-presentation";
const SeverityColorProperty = "--ui-validation-color";

/** The native controls a field reads its value through, which carry `aria-invalid` for the reader; a popup's own fields are not the field. */
export const FieldControlSelector = `input:not([type='hidden']), textarea, select, .${ListTriggerClass}[role='combobox'], [role='spinbutton']`;

/** Highest first, which is the order two messages on one field are settled in. */
export const SeverityRank: Readonly<Record<WebValidationSeverityName, number>> = { Error: 0, Warning: 1, Info: 2 };

const SeverityClass: Readonly<Record<WebValidationSeverityName, string>> = { Error: ErrorClass, Warning: ValidationWarningClass, Info: ValidationInfoClass };

/** A field the server rendered a message on, which is how such a field is found before any patch names it. */
export const RenderedSelector = `.${ErrorClass}, .${ValidationWarningClass}, .${ValidationInfoClass}`;
const SeverityColor: Readonly<Record<WebValidationSeverityName, string>> = { Error: "danger", Warning: "warning", Info: "info" };

/** A severity as the plugin surface spells it. */
export type FieldMarkSeverity = "error" | "warning" | "info";

/** A package's mark's words: a key filled from its arguments, or an author's text. */
export type FieldMarkWords = Phrase | AuthorText;

/** What a mark's tooltip wears for its severity (`data-ui-tooltip-severity`). */
export const TooltipSeverity: Readonly<Record<WebValidationSeverityName, FieldMarkSeverity>> = { Error: "error", Warning: "warning", Info: "info" };

const MirrorSeverityClass: Readonly<Record<WebValidationSeverityName, string>> = {
    Error: `${ValidationMarkClass}--error`,
    Warning: `${ValidationMarkClass}--warning`,
    Info: `${ValidationMarkClass}--info`
};

export const MarkSeverity: Readonly<Record<FieldMarkSeverity, WebValidationSeverityName>> = { error: "Error", warning: "Warning", info: "Info" };

/** A message and its severity, the words kept unresolved so they are read again in the next language. */
export type ValidationDisplay = {
    readonly message: unknown;
    readonly severity: WebValidationSeverityName;
    /** The words are shown as written, never looked up: a refusal the input's author marked content. */
    readonly content?: boolean;
};

/** A bound message: its words as they came — the author's text (`{text}`, or a bare string) or a phrase — and its severity. */
export function readValidationMessage(value: unknown): ValidationDisplay | undefined {
    if (value === null || typeof value !== "object")
        return undefined;

    const record = value as { readonly severity?: unknown; readonly message?: unknown };
    const message = record.message;
    const spoken = isPhrase(message) || isAuthorText(message) || (typeof message === "string" && message.length > 0);

    return spoken ? { message, severity: toSeverityName(record.severity) } : undefined;
}

/** What a message says in the page's language: looked up as a plain value, a phrase filled, content as written. */
export function messageWords(display: ValidationDisplay): string {
    const message = display.message;

    if (display.content === true)
        return String(message ?? "");

    const words = clientStrings.resolve(isPhrase(message) || isAuthorText(message) ? message : String(message ?? ""), true);

    return typeof words === "string" ? words : "";
}

/** A severity by name; one the page does not know is an error. */
export function toSeverityName(value: unknown): WebValidationSeverityName {
    const name = getValidationSeverity(value as never);

    return name === "Unknown" ? "Error" : name;
}

/**
 * Whether the number field or temporal control an element stands in refuses what it holds by its own bounds and format: what the
 * page refuses in words, and the server would. A field the reader cannot change, and any other element, refuses nothing.
 */
export function isRefusedValue(element: Element, read: (field: Element) => unknown): boolean {
    const temporal = element.closest<HTMLElement>(TemporalRootSelector);
    const root = temporal ?? element.closest(NumberRootSelector);

    if (root === null || isReadOnly(root) || isInert(root))
        return false;

    return temporal === null ? refusesNumber(root, read) : refusesTemporal(temporal);
}

/**
 * Whether a value passes a rule as validation judges it, against what the rule compares with: every rule but `Required` passes on an
 * empty value, so a field left empty — tabbed through, never typed in — says only that it is required. An interaction's rules read
 * the shared evaluator as it is.
 */
export function passesRule(value: unknown, rule: Pick<WebRenderValidationMetadata, "operator">, comparand: unknown): boolean {
    if (getInteractionOperator(rule.operator) !== "Required" && isEmptyValue(value))
        return true;

    return evaluateOperator(value, rule.operator, comparand);
}

/** Nothing given: what `Required` refuses, but a toggle's `false`, which is a value a rule may judge. */
function isEmptyValue(value: unknown): boolean {
    return value !== false && !evaluateOperator(value, "Required", null);
}

/** The words a field's value past its bounds is refused in: a number field's, a temporal control's or a calendar's; null for any other. */
export function boundRefusalOf(element: Element, read: (field: Element) => unknown, end?: boolean): Phrase | null {
    if (element.matches(TemporalRootSelector))
        return temporalBoundRefusal(element as HTMLElement, end);

    return end === true ? null : numberBoundRefusal(element, read);
}

export function isSameWords(standing: unknown, words: Phrase | null): boolean {
    if (standing === undefined || words === null)
        return standing === undefined && words === null;

    return isPhrase(standing) && standing.key === words.key && JSON.stringify(standing.args) === JSON.stringify(words.args);
}

export function renderedSeverity(element: Element): WebValidationSeverityName {
    if (element.classList.contains(ValidationWarningClass))
        return "Warning";

    return element.classList.contains(ValidationInfoClass) ? "Info" : "Error";
}

export function applyValidationState(mirrors: WeakMap<HTMLElement, HTMLElement>, element: Element, display: ValidationDisplay | undefined): void {
    for (const className of Object.values(SeverityClass))
        element.classList.toggle(className, display !== undefined && SeverityClass[display.severity] === className);

    markInvalid(element, display?.severity === "Error");

    const htmlElement = element as HTMLElement;

    if (display === undefined)
        htmlElement.style.removeProperty(SeverityColorProperty);
    else
        htmlElement.style.setProperty(SeverityColorProperty, `var(--ui-color-${SeverityColor[display.severity]}-ink)`);

    // The field's own line before any inside it: a composite field (a code field's find box) holds fields with lines of their own.
    const messageTarget = element.querySelector<HTMLElement>(`:scope > [${MessageAttribute}]`) ?? element.querySelector<HTMLElement>(`[${MessageAttribute}]`);

    if (messageTarget === null)
        return;

    // Words marked content are written as they came and carry no mark, so a language switch leaves them alone.
    if (display?.content === true) {
        forgetWords(messageTarget, null);
        messageTarget.textContent = String(display.message ?? "");
    }
    else {
        clientStrings.writeValue(messageTarget, null, display?.message ?? null);
    }

    applyPresentation(mirrors, htmlElement, messageTarget, display);
}

/** Says on the field's native controls what `ui-invalid` says to the eye: only an error, since a warning leaves the value acceptable. */
export function markInvalid(element: Element, invalid: boolean): void {
    for (const control of element.querySelectorAll(FieldControlSelector)) {
        const popup = control.closest(PopupRoleSelector);

        if (popup !== null && element.contains(popup))
            continue;

        if (invalid)
            control.setAttribute("aria-invalid", "true");
        else
            control.removeAttribute("aria-invalid");
    }
}

/** Reads where the stylesheet put the message — a line, or a mark speaking in a tooltip while the field holds focus. */
export function applyPresentation(mirrors: WeakMap<HTMLElement, HTMLElement>, root: HTMLElement, message: HTMLElement, display: ValidationDisplay | undefined): void {
    const style = getComputedStyle(message);
    const presentation = style.getPropertyValue(PresentationProperty).trim();
    const marker = display !== undefined && presentation === "marker";

    message.classList.toggle(ValidationMessageMarkerClass, marker);

    // A line or a mark alike leaves its copy in the value's cell, for the row once it closes; words sent elsewhere leave none.
    applyMarkerMirror(mirrors, root, presentation === "elsewhere" ? undefined : display, message.textContent ?? "", style.getPropertyValue(MarkerHostProperty).trim());

    if (display !== undefined && marker) {
        // The line's own words, which the page wrote in its language — as text: the tooltip reads markup, and a message may quote
        // the reader's value or a pattern.
        message.setAttribute(TooltipAttribute, escapeInlineMarkup(message.textContent ?? ""));
        message.setAttribute(PlacementAttribute, MarkerPlacement);
        message.setAttribute(TooltipSeverityAttribute, TooltipSeverity[display.severity]);
        root.setAttribute(TooltipMarkAttribute, "");

        // A mark appearing as the reader types has no focus event coming to open it: it speaks straight away.
        if (root.contains(document.activeElement))
            pinTooltip(message);
        else
            updateTooltip(message);

        return;
    }

    message.removeAttribute(TooltipAttribute);
    message.removeAttribute(PlacementAttribute);
    message.removeAttribute(TooltipSeverityAttribute);
    root.removeAttribute(TooltipMarkAttribute);

    // The mark may be the one on screen: with nothing left to say it closes rather than standing over the field with a stale line.
    updateTooltip(message);
}

/** Copies the mark of a field sharing its cell with the value it edits into the value's cell; only one of the two is shown. */
function applyMarkerMirror(mirrors: WeakMap<HTMLElement, HTMLElement>, root: HTMLElement, display: ValidationDisplay | undefined, words: string, hostClassName: string): void {
    const existing = mirrors.get(root);
    const host = display === undefined || hostClassName.length === 0 ? null : findMarkerHost(root, hostClassName);

    if (display === undefined || host === null) {
        if (existing !== undefined)
            removeMarkerMirror(existing);

        mirrors.delete(root);
        return;
    }

    const mirror = existing ?? document.createElement("span");

    // The mark's own text, hidden as the field's is: a reader on the value's line hears it there, not from a hidden field.
    mirror.className = `${ValidationMarkClass} ${MirrorSeverityClass[display.severity]}`;
    mirror.textContent = words;
    mirror.setAttribute(TooltipAttribute, escapeInlineMarkup(words));
    mirror.setAttribute(PlacementAttribute, MirrorPlacement);
    mirror.setAttribute(TooltipSeverityAttribute, TooltipSeverity[display.severity]);
    mirror.setAttribute(TooltipPressAttribute, "");

    if (mirror.parentElement !== host) {
        removeMarkerMirror(mirror);
        host.append(mirror);
    }

    // The whole value speaks through its dot, so the dot need not be aimed at: a hover anywhere on it, and a press, a touch's one way.
    host.setAttribute(TooltipMarkAttribute, "");
    mirrors.set(root, mirror);
    updateTooltip(mirror);
}

/** Takes a copy out of its cell, and the cell's word for it with the last one. */
function removeMarkerMirror(mirror: HTMLElement): void {
    const host = mirror.parentElement;

    mirror.remove();

    if (host !== null && host.querySelector(`:scope > .${ValidationMarkClass}`) === null)
        host.removeAttribute(TooltipMarkAttribute);
}

/** The cell stands beside one of the field's own ancestors — a row of the same list — which is as far up as the search goes. */
function findMarkerHost(root: HTMLElement, className: string): HTMLElement | null {
    for (let node = root.parentElement; node !== null; node = node.parentElement) {
        const host = node.querySelector<HTMLElement>(`:scope > .${className}`);

        if (host !== null)
            return host;
    }

    return null;
}
