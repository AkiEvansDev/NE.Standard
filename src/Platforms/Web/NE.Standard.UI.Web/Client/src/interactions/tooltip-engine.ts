// `node --test` loads this module as it is (the validation engine's test): `.ts` on the value imports.
import {
    PointerFocusAttribute, TooltipAttribute, TooltipMarkAttribute as MarkAttribute, TooltipPlacementAttribute as PlacementAttribute, TooltipPressAttribute as PressAttribute
} from "../addressing/dom-attributes.ts";
import { applyInlineMarkup, inlineMarkupToPlainText } from "../rendering/inline-markup.ts";
import type { AnchoredPopupPlacement } from "./anchored-popup.ts";
import { carryPopupGround, isAnchoredPopupPlacement, placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup.ts";
import { isClippedOut } from "./element-visibility.ts";

// The library's own tooltip, in place of the browser's `title`: one floating element shared by the whole page.

// A control speaking through a mark inside it (a validation dot, `data-ui-tooltip-mark`) shows the mark's tooltip, drawn against the mark.
const TooltipClass = "ui-tooltip";
const TooltipId = "ui-tooltip";
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
// Also the record of whether a tooltip is on screen; any element works, an SVG shape too, since only its box and attributes are read.
let anchor: Element | null = null;
// The element naming the tooltip in its `aria-describedby`: the one inside the anchor the focus stands on, as a field's own input.
let described: Element | null = null;
// A mark whose control holds the focus: its tooltip is the focus's, and the pointer crossing the page neither replaces nor closes it.
let pinned: Element | null = null;
// A control a press opened (a caption's badge): its tooltip stays, whatever the pointer crosses, until the next press anywhere.
let held: Element | null = null;
let showTimer = 0;
// What the pending timer will show: a caller naming the same target again while it waits updates the words, not the wait.
let scheduled: { readonly target: Element; words: string | undefined } | null = null;
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
    host.addEventListener("scroll", onScroll, true);
    host.addEventListener("pointerdown", onPointerDown, true);
    host.addEventListener("click", onClick, true);
    window.addEventListener("blur", () => {
        pinned = null;
        hide(true);
    });
}

function onPointerOver(event: Event): void {
    dropOrphan();

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

/** Closes a tooltip whose control the page redrew away, since no pointerout comes for a removed element. */
function dropOrphan(): void {
    if (anchor === null || anchor.isConnected)
        return;

    pinned = null;
    hide(true);
}

/** Closes a tooltip whose control the scroll just took out of sight, where it would float against nothing the reader sees. */
function onScroll(event: Event): void {
    dropOrphan();

    if (anchor === null)
        return;

    // Only a scroll of a box around the anchor, or of the page, can move it out of sight.
    const scrolled = event.target;

    if (scrolled instanceof Node && !(scrolled instanceof Document) && !scrolled.contains(anchor))
        return;

    if (isClippedOut(anchor)) {
        pinned = null;
        hide(true);
    }
}

function onPointerOut(event: Event): void {
    if (pinned !== null || held !== null)
        return;

    const related = (event as PointerEvent).relatedTarget;
    // The one on screen, else the one waiting to open: leaving either calls it off.
    const current = anchor ?? scheduled?.target ?? null;

    // Moving onto a child of the same anchor is not leaving it, and neither is moving onto the tooltip.
    if (related instanceof Node && ((current !== null && current.contains(related)) || isInsideTooltip(related)))
        return;

    if (isInsideTooltip(event.target) || (current !== null && event.target instanceof Node && current.contains(event.target)))
        hide(false);
}

// A keyboard focus opens the control's tooltip at once.
function onFocusIn(event: Event): void {
    // A focus the pointer gave opens nothing of its own: the pointer's hover does, after its wait.
    if (event.target instanceof Element && event.target.hasAttribute(PointerFocusAttribute))
        return;

    const target = findAnchor(event.target);

    if (target === null)
        return;

    // A mark's message about the value typed must not come and go with the pointer crossing the row.
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

// A press outside makes the tooltip stale; a press inside it is the reader following a link.
function onPointerDown(event: Event): void {
    if (isInsideTooltip(event.target))
        return;

    const target = findAnchor(event.target);

    // A control whose words are all it holds shows them on a press, the only way a touch can ask; a second press takes them away.
    if (target !== null && target.hasAttribute(PressAttribute)) {
        if (held === target) {
            hide(true);
            return;
        }

        pinned = null;
        hide(true);
        show(target);
        held = anchor;
        return;
    }

    if (pinned === null)
        hide(true);
}

// The press on a control whose words are all it holds asked for them and nothing else: a checkbox's label around it would tick the box,
// and a field's caption would hand the focus to the field, which closes them.
function onClick(event: Event): void {
    if (findAnchor(event.target)?.hasAttribute(PressAttribute) === true)
        event.preventDefault();
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

function schedule(target: Element, words?: string): void {
    if (pinned !== null || held !== null)
        return;

    window.clearTimeout(hideTimer);

    // Asked again for the target already waiting: the newest words, at the end of the same wait.
    if (scheduled !== null && scheduled.target === target) {
        scheduled.words = words;
        return;
    }

    window.clearTimeout(showTimer);
    scheduled = null;

    // One already on screen belongs to the control just left: it goes at once, and the new one takes its place at once.
    if (anchor !== null) {
        hide(true);
        show(target, words);
        return;
    }

    const immediate = Date.now() - lastHiddenAt < RepeatWindowMs;

    if (immediate) {
        show(target, words);
        return;
    }

    scheduled = { target, words };
    showTimer = window.setTimeout(() => {
        const pending = scheduled;

        scheduled = null;

        if (pending !== null)
            show(pending.target, pending.words);
    }, ShowDelayMs);
}

function show(target: Element, words?: string): void {
    const text = (words ?? target.getAttribute(TooltipAttribute) ?? "").trim();

    // A control scrolled out of its box (a field at the top of a dialog scrolled down) would have its words float outside the box.
    if (text.length === 0 || !target.isConnected || isOpen(target) || isClippedOut(target))
        return;

    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);
    scheduled = null;

    const element = ensureTooltip();

    // Nothing in a tooltip can be pressed, so a fold in it is written open.
    applyInlineMarkup(element, text, { staticFolds: true });
    element.classList.add(VisibleClass);

    anchor = target;

    // The control names its tooltip; the element is aria-hidden, so the text is announced once, from the control.
    describe(describedElement(target));
    element.setAttribute("data-ui-tooltip-text", inlineMarkupToPlainText(text));

    carryPopupGround(target, element);

    // Against the control and centred on it, not at the pointer, so the same control always shows it in the same place.
    placeAnchoredPopup(target, element, { placement: readPlacement(target), gap: AnchorGap, arrow: true });
}

// A control whose own list or panel is open says nothing, however the tooltip was asked for: it stood over the options just opened.
function isOpen(target: Element): boolean {
    return target.matches(OpenSelector) || target.querySelector(OpenSelector) !== null;
}

/** The element a screen reader stands on for the anchor: the focused one inside it (a field's own input), else the anchor itself. */
function describedElement(target: Element): Element {
    const active = document.activeElement;

    return active !== null && target.contains(active) ? active : target;
}

/** Adds the tooltip to what an element is described by, beside its own descriptions, and takes it off the one that named it before. */
function describe(element: Element): void {
    // Taken over from another control without closing between (a focus, a pin, a package's words): that one stops naming it.
    if (described !== null && described !== element)
        undescribe();

    const ids = describedBy(element);

    if (!ids.includes(TooltipId))
        element.setAttribute("aria-describedby", [...ids, TooltipId].join(" "));

    described = element;
}

/** Takes the tooltip off what its element is described by, leaving the element's own descriptions as they were. */
function undescribe(): void {
    if (described === null)
        return;

    const ids = describedBy(described).filter(id => id !== TooltipId);

    if (ids.length === 0)
        described.removeAttribute("aria-describedby");
    else
        described.setAttribute("aria-describedby", ids.join(" "));

    described = null;
}

function describedBy(element: Element): string[] {
    return (element.getAttribute("aria-describedby") ?? "").split(" ").filter(id => id.length > 0);
}

/** How a package's tooltip opens. */
export type TooltipShowOptions = {
    /** Wait as a hover does, for words following a passing pointer (a chart's crosshair); unset opens at once. */
    readonly delay?: boolean;
};

/** Shows a tooltip of the caller's own words against an element, whatever the element says for itself. */
function showTooltipWith(target: Element, words: string, options?: TooltipShowOptions): void {
    // Already on screen for this target: the words change in place, with no wait.
    if (options?.delay === true && anchor !== target)
        schedule(target, words);
    else
        show(target, words);
}

/** Closes the tooltip on screen at once, however it was opened. */
function closeTooltip(): void {
    hide(true);
}

/** The page's one tooltip as a package reaches it: shown with the package's own words, closed by `hide` or by the reader pointing elsewhere. */
export type Tooltips = {
    show(target: Element, words: string, options?: TooltipShowOptions): void;
    hide(): void;
};

export const tooltips: Tooltips = { show: showTooltipWith, hide: closeTooltip };

/** Opens an anchor's tooltip until focus leaves its control — for a mark appearing under typing, with no focus event to open on. */
export function pinTooltip(element: Element): void {
    pinned = element;
    show(element);
}

/** Redraws the tooltip on screen from its element's words where it stands; words taken away close it. */
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
    scheduled = null;

    const close = (): void => {
        // Nothing was on screen, so this call only cancelled a pending open and must not arm the repeat window.
        if (anchor === null)
            return;

        undescribe();
        anchor = null;
        held = null;

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
    tooltip.id = TooltipId;
    tooltip.className = TooltipClass;
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("aria-hidden", "true");

    document.body.append(tooltip);

    return tooltip;
}
