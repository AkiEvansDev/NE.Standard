import { applyInlineMarkup, inlineMarkupToPlainText } from "../rendering/inline-markup";
import { AnchoredPopupPlacement, isAnchoredPopupPlacement, placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";

// The library's own tooltip, in place of the browser's `title`: one floating element shared by the whole page.

const TooltipAttribute = "data-ui-tooltip";
const PlacementAttribute = "data-ui-tooltip-placement";
const TooltipClass = "ui-tooltip";
const VisibleClass = "ui-tooltip--visible";

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
// Also the record of whether a tooltip is on screen: set only by `show`, cleared only by `close`. Any element, an SVG shape
// included: only its box and its attributes are read.
let anchor: Element | null = null;
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
        if (!isInsideTooltip(event.target))
            hide(true);
    }, true);
    window.addEventListener("blur", () => hide(true));
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
    const related = (event as PointerEvent).relatedTarget;

    // Moving onto a child of the same anchor is not leaving it, and neither is moving onto the tooltip.
    if (related instanceof Node && ((anchor !== null && anchor.contains(related)) || isInsideTooltip(related)))
        return;

    if (isInsideTooltip(event.target) || findAnchor(event.target) === anchor)
        hide(false);
}

// A keyboard user gets the tooltip the moment the control takes focus.
function onFocusIn(event: Event): void {
    const target = findAnchor(event.target);

    if (target === null)
        return;

    show(target);
}

function onFocusOut(event: Event): void {
    if (findAnchor(event.target) === anchor)
        hide(true);
}

function onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape" && anchor !== null)
        hide(true);
}

function isInsideTooltip(target: EventTarget | null): boolean {
    return tooltip !== null && target instanceof Node && tooltip.contains(target);
}

function findAnchor(target: EventTarget | null): Element | null {
    if (!(target instanceof Element))
        return null;

    const element = target.closest(`[${TooltipAttribute}]`);

    if (element === null)
        return null;

    return (element.getAttribute(TooltipAttribute) ?? "").trim().length > 0 ? element : null;
}

function schedule(target: Element): void {
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

function show(target: Element): void {
    const text = (target.getAttribute(TooltipAttribute) ?? "").trim();

    if (text.length === 0 || !target.isConnected)
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
    placeAnchoredPopup(target, element, { placement: readPlacement(target), gap: AnchorGap });
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
