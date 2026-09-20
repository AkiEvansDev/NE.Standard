import { applyInlineMarkup, inlineMarkupToPlainText } from "../rendering/inline-markup";
import { AnchoredPopupPlacement, isAnchoredPopupPlacement, placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";

// The library's own tooltip, in place of the browser's `title`: one floating element shared by the whole page.

const TooltipAttribute = "data-ui-tooltip";
const PlacementAttribute = "data-ui-tooltip-placement";
// A control that speaks through a mark inside it (a field with a validation dot at its corner): the tooltip is the mark's,
// drawn against the mark wherever in the control the reader points.
const MarkAttribute = "data-ui-tooltip-mark";
const TooltipClass = "ui-tooltip";
const VisibleClass = "ui-tooltip--visible";
// A control's own popup trigger while its list or panel is open; a disclosure that is merely expanded names no popup.
const OpenSelector = "[aria-haspopup][aria-expanded=\"true\"]";

// The side a tooltip takes when its anchor names none; above, because that covers nothing the reader is about to need.
const DefaultPlacement: AnchoredPopupPlacement = "top";

// Short enough not to be a wait, long enough that crossing a control on the way somewhere else opens nothing.
const ShowDelayMs = 250;
// Long enough to cross the gap between the anchor and the tooltip, where the pointer is over neither.
const HideDelayMs = 200;

// How long after a tooltip was shown the next one opens with no wait, so a row of buttons is not a row of waits.
const RepeatWindowMs = 300;

// The distance the tooltip's own arrow spans, so it bridges the gap to the control instead of floating over it.
const AnchorGap = 7;

let tooltip: HTMLElement | null = null;
// Also the record of whether a tooltip is on screen: set only by `show`, cleared only by `close`. Any element (an SVG shape
// included) works, since only its box and attributes are read.
let anchor: Element | null = null;
// A mark whose control holds the focus: its tooltip is the focus's, and the pointer crossing the page neither replaces nor closes it.
let pinned: Element | null = null;
let showTimer = 0;
let hideTimer = 0;
let lastHiddenAt = 0;
let started = false;

export function startTooltips(root: ParentNode = document): void {
    if (started)
        return;

    started = true;

    const host = root instanceof Document ? root : document;

    // Capture, because a control may stop the event on its own bubble path; over/out rather than enter/leave, which do not bubble.
    host.addEventListener("pointerover", onPointerOver, true);
    host.addEventListener("pointerout", onPointerOut, true);
    host.addEventListener("focusin", onFocusIn, true);
    host.addEventListener("focusout", onFocusOut, true);
    host.addEventListener("keydown", onKeyDown, true);

    // A press outside makes the tooltip stale; a press inside it is the reader following a link.
    host.addEventListener("pointerdown", event => {
        if (pinned === null && !isInsideTooltip(event.target))
            hide(true);
    }, true);
    window.addEventListener("blur", () => {
        pinned = null;
        hide(true);
    });
}

function onPointerOver(event: Event): void {
    // Inside the tooltip itself: the reader is heading for a link in it, so the scheduled close is called off.
    if (isInsideTooltip(event.target)) {
        window.clearTimeout(hideTimer);
        return;
    }

    const target = findAnchor(event.target);

    if (target === null || target === anchor)
        return;

    schedule(target);
}

function onPointerOut(event: Event): void {
    if (pinned !== null)
        return;

    const related = (event as PointerEvent).relatedTarget;

    // Moving onto a child of the same anchor is not leaving it, and neither is moving onto the tooltip.
    if (related instanceof Node && ((anchor !== null && anchor.contains(related)) || isInsideTooltip(related)))
        return;

    if (isInsideTooltip(event.target) || findAnchor(event.target) === anchor)
        hide(false);
}

// A keyboard user gets the tooltip the moment the control takes focus; one that speaks through a mark keeps it for as long
// as focus is in it, since a message about the value typed must not come and go with the pointer crossing the row.
function onFocusIn(event: Event): void {
    const target = findAnchor(event.target);

    if (target === null)
        return;

    pinned = event.target instanceof Element && event.target.closest(`[${MarkAttribute}]`) !== null ? target : null;

    show(target);
}

function onFocusOut(event: Event): void {
    if (findAnchor(event.target) !== anchor)
        return;

    pinned = null;
    hide(true);
}

function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== "Escape" || anchor === null)
        return;

    pinned = null;
    hide(true);
}

function isInsideTooltip(target: EventTarget | null): boolean {
    return tooltip !== null && target instanceof Node && tooltip.contains(target);
}

function findAnchor(target: EventTarget | null): Element | null {
    if (!(target instanceof Element))
        return null;

    const element = target.closest(`[${TooltipAttribute}], [${MarkAttribute}]`);

    if (element === null)
        return null;

    // A tooltip of the control's own — one a controller wrote — is the control's; with none, the mark inside it speaks for it.
    const spoken = element.hasAttribute(TooltipAttribute) ? element : element.querySelector(`[${TooltipAttribute}]`);

    if (spoken === null)
        return null;

    return (spoken.getAttribute(TooltipAttribute) ?? "").trim().length > 0 ? spoken : null;
}

function schedule(target: Element): void {
    if (pinned !== null)
        return;

    window.clearTimeout(hideTimer);
    window.clearTimeout(showTimer);

    // One already on screen belongs to the control just left: it goes at once, and the new one takes its place at once.
    if (anchor !== null) {
        hide(true);
        show(target);
        return;
    }

    const immediate = Date.now() - lastHiddenAt < RepeatWindowMs;

    if (immediate) {
        show(target);
        return;
    }

    showTimer = window.setTimeout(() => show(target), ShowDelayMs);
}

function show(target: Element, words?: string): void {
    const text = (words ?? target.getAttribute(TooltipAttribute) ?? "").trim();

    if (text.length === 0 || !target.isConnected || isOpen(target))
        return;

    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);

    const element = ensureTooltip();

    // Nothing in a tooltip can be pressed, so a fold in it is written open.
    applyInlineMarkup(element, text, { staticFolds: true });
    element.classList.add(VisibleClass);

    anchor = target;

    // The anchor names its tooltip; the element is aria-hidden, so the text is announced once, from the control.
    target.setAttribute("aria-describedby", element.id);
    element.setAttribute("data-ui-tooltip-text", inlineMarkupToPlainText(text));

    // Against the control and centred on it, not at the pointer, so the same control always shows it in the same place.
    placeAnchoredPopup(target, element, { placement: readPlacement(target), gap: AnchorGap, arrow: true });
}

/**
 * Shows a tooltip of the caller's own words against an element, whatever that element says for itself — what a package
 * drawing its own picture needs. No wait: the caller is answering a pointer already where it means to be.
 */
// A control whose own list or panel is open says nothing, however the tooltip was asked for: it stood over the options just opened.
function isOpen(target: Element): boolean {
    return target.matches(OpenSelector) || target.querySelector(OpenSelector) !== null;
}

export function showTooltipWith(target: Element, words: string): void {
    show(target, words);
}

/** Closes the tooltip on screen at once, however it was opened. */
export function closeTooltip(): void {
    hide(true);
}

/** The page's one tooltip as a package reaches it: shown at once with the package's own words, closed by `hide` or by the reader pointing elsewhere. */
export type Tooltips = {
    show(target: Element, words: string): void;
    hide(): void;
};

export const tooltips: Tooltips = { show: showTooltipWith, hide: closeTooltip };

/**
 * Opens an anchor's tooltip and holds it open until focus leaves the control it belongs to — for a mark that appears under
 * the reader's own typing, with no focus event left to open on.
 */
export function pinTooltip(element: Element): void {
    pinned = element;
    show(element);
}

/**
 * Re-reads the tooltip of the element on screen: a message rewritten under the reader (a validation mark's, as the value
 * changes) is redrawn where it stands; one taken away closes it rather than leaving a stale line.
 */
export function updateTooltip(element: Element): void {
    if (anchor !== element)
        return;

    if ((element.getAttribute(TooltipAttribute) ?? "").trim().length === 0) {
        pinned = null;
        hide(true);
        return;
    }

    show(element);
}

function readPlacement(target: Element): AnchoredPopupPlacement {
    const token = target.getAttribute(PlacementAttribute);

    return token !== null && isAnchoredPopupPlacement(token) ? token : DefaultPlacement;
}

function hide(immediate: boolean): void {
    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);

    const close = (): void => {
        // Nothing was on screen, so this call only cancelled a pending open and must not arm the repeat window.
        if (anchor === null)
            return;

        anchor.removeAttribute("aria-describedby");
        anchor = null;

        if (tooltip !== null) {
            tooltip.classList.remove(VisibleClass);
            releaseAnchoredPopup(tooltip);
        }

        lastHiddenAt = Date.now();
    };

    if (immediate)
        close();
    else
        hideTimer = window.setTimeout(close, HideDelayMs);
}

function ensureTooltip(): HTMLElement {
    if (tooltip !== null && tooltip.isConnected)
        return tooltip;

    tooltip = document.createElement("div");
    tooltip.id = "ui-tooltip";
    tooltip.className = TooltipClass;
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("aria-hidden", "true");

    document.body.append(tooltip);

    return tooltip;
}
