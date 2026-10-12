// The pictures a `ShowImageEffect` shows full size over the page. A page dialog (page-dialog.ts), as the leave question and the crop
// are, so the dialog engine opens it, traps the focus in it, gives the focus back, and closes it on Escape or a press on its backdrop —
// and the backdrop is everything round the picture: the surface takes no press of its own (`pointer-events: none` in ui-lightbox.less),
// so a press in the bands beside a picture of another shape than the window's lands on the backdrop. The picture, its arrows, the ×
// and the caption take theirs.
//
// A set is a strip of three: the picture shown and its two neighbours a window's width and a gap to either side. A step slides the
// strip by that pitch (`--ui-lightbox-shift`), the way the step goes whichever picture it lands on round the set's end; once it is
// there, the middle figure takes the picture that slid in and the strip goes back under it with no movement, so the middle figure —
// and its arrows, which may hold the focus — never moves in the document.

// `node --test` loads this module as it is: `.ts` on the value imports, and types imported as types.
import { ImageFailedAttribute, ItemsHostAttribute } from "../addressing/dom-attributes.ts";
import { afterTransitions, motion, prefersReducedMotion } from "../rendering/motion.ts";
import { readImageSource } from "../rendering/url-safety.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { logWarn } from "../runtime/logger.ts";
import type { AuthorText, Phrase } from "../runtime/words.ts";
import type { DialogEngine } from "./dialog-engine.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { buildPageDialog, PageDialogParts } from "./page-dialog.ts";
import { FlickSpeed, followSwipe, SwipeSlop } from "./swipe-follow.ts";

const LightboxKey = "ui-lightbox";
const TitleId = "ui-lightbox-title";
const Parts = new PageDialogParts("data-ui-lightbox-part");

/** On the lightbox while it shows a set, which its arrows and counter walk; a single picture shows neither. */
const SetAttribute = "data-ui-lightbox-set";

/** A figure's place in the strip: `previous`, `current` or `next`, which the stylesheet sets a pitch apart. */
const SlotAttribute = "data-ui-lightbox-slot";

/** On the stage while the strip follows a finger or goes back under a picture that slid in: it moves at once, with no transition. */
const StillAttribute = "data-ui-lightbox-still";

/** How far the strip stands off its rest, in pixels: a finger's drag, or a step's whole pitch. */
const ShiftProperty = "--ui-lightbox-shift";

/** The gap between two pictures of the strip, in pixels; ui-lightbox.less's `@ui-lightbox-slide-gap`. */
const SlideGap = 16;

/** How much of the window's width a swipe let go slowly must cover to turn to the next picture. */
const TurnShare = 1 / 5;

/** One picture: its address as the page may fetch it, and its words, a phrase, the author's text, or the page's own (an `alt`). */
export type LightboxPicture = {
    readonly source: string;
    readonly caption?: Phrase | AuthorText;
    readonly altText?: Phrase | AuthorText | string;
};

type LightboxParts = {
    readonly dialog: HTMLElement;
    readonly stage: HTMLElement;
    readonly current: HTMLElement;
    readonly picture: HTMLImageElement;
    readonly previousPicture: HTMLImageElement;
    readonly nextPicture: HTMLImageElement;
    readonly neighbours: readonly HTMLElement[];
    readonly count: HTMLElement;
    readonly countRoom: HTMLElement;
    readonly caption: HTMLElement;
};

type Showing = {
    readonly pictures: readonly LightboxPicture[];
    index: number;
};

/** A step under way: its way, and whether the picture it slid in already stands in the middle figure. */
type Turn = {
    readonly by: number;
    landed: boolean;
};

// Built once and kept, with its listeners: a page that took it off the body gets it back.
let parts: LightboxParts | null = null;
let showing: Showing | null = null;
let turning: Turn | null = null;

/** Shows `pictures` from the one at `start`, over everything open; answers whether there was a picture to show. */
export function showLightbox(dialogs: DialogEngine, pictures: readonly LightboxPicture[], start: number): boolean {
    const safe = pictures.filter(picture => readImageSource(picture.source) !== null);

    if (safe.length === 0) {
        logWarn("show image effect carries no picture the page may fetch.", pictures);
        return false;
    }

    parts ??= buildLightbox(dialogs);

    // At the body's end at every opening: the open dialog last in the document is the one on top, so a lightbox opened from a dialog
    // stands over it, and Escape and the backdrop are its own. Not while it is open: moved, it would drop the focus it holds.
    if (parts.dialog.hasAttribute("hidden") || !parts.dialog.isConnected)
        document.body.append(parts.dialog);

    // A picture the page refused before the one asked for moves the start back by one.
    const skipped = pictures.slice(0, Math.max(0, start)).filter(picture => readImageSource(picture.source) === null).length;

    turning = null;
    showing = { pictures: safe, index: clampIndex(start - skipped, safe.length) };
    parts.dialog.toggleAttribute(SetAttribute, safe.length > 1);

    for (const neighbour of parts.neighbours)
        neighbour.hidden = safe.length < 2;

    restStrip(parts);
    present(parts, showing);

    return dialogs.open(LightboxKey);
}

/**
 * The pictures a component shows when the effect runs: the `<img>` it is or holds first, and with `rows` the same component's in
 * its list's other drawn rows, in their order; null for one that shows none.
 */
export function picturesOnPage(target: Element, rows: boolean, everyElementOf: (element: Element) => readonly Element[]): { readonly pictures: LightboxPicture[]; readonly start: number } | null {
    const own = pictureOf(target);

    if (own === null)
        return null;

    const host = target.closest(`[${ItemsHostAttribute}]`);

    if (!rows || host === null)
        return { pictures: [own], start: 0 };

    const pictures: LightboxPicture[] = [];
    let start = 0;

    // A row of a nested list stands in its own host: only the rows beside the target's, not those of every message.
    for (const element of [...everyElementOf(target)].filter(candidate => candidate.closest(`[${ItemsHostAttribute}]`) === host).sort(inDocumentOrder)) {
        const picture = element === target ? own : pictureOf(element);

        if (picture === null)
            continue;

        if (element === target)
            start = pictures.length;

        pictures.push(picture);
    }

    return { pictures, start };
}

function pictureOf(element: Element): LightboxPicture | null {
    const image = element.matches("img") ? element : element.querySelector("img");

    // A picture standing in for one that is missing or failed has nothing to show full size.
    if (image === null || image.closest(`[${ImageFailedAttribute}]`) !== null)
        return null;

    // What the page drew, a fallback included, as the browser reads it; before it loads, the address it was given.
    const drawn = (image as Partial<HTMLImageElement>).currentSrc;
    const source = readImageSource(typeof drawn === "string" && drawn.length > 0 ? drawn : image.getAttribute("src") ?? "");

    return source === null ? null : { source, altText: image.getAttribute("alt") ?? "" };
}

function inDocumentOrder(first: Element, second: Element): number {
    return first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

function clampIndex(index: number, count: number): number {
    return Math.min(Math.max(0, Math.trunc(Number.isFinite(index) ? index : 0)), count - 1);
}

function buildLightbox(dialogs: DialogEngine): LightboxParts {
    const { dialog, surface } = buildPageDialog({
        key: LightboxKey,
        className: "ui-lightbox",
        surfaceClassName: "ui-lightbox__surface",
        role: "dialog",
        labelledBy: TitleId,
        closesOnEscapeAndBackdrop: true
    });

    const title = Parts.element("h2", "ui-lightbox__title");
    const close = button("ui-lightbox__close", "close");
    const stage = Parts.element("div", "ui-lightbox__stage");
    const [previousFigure, previousPicture] = figure("previous");
    const [current, picture] = figure("current");
    const [nextFigure, nextPicture] = figure("next");
    const nav = Parts.element("div", "ui-lightbox__nav");
    const previous = button("ui-lightbox__step ui-lightbox__step--previous", "previous");
    const next = button("ui-lightbox__step ui-lightbox__step--next", "next");
    const counter = Parts.element("span", "ui-lightbox__counter ui-text-type--caption");
    // The counter's words for the set's last picture, unseen beneath the shown ones: the counter holds the width of its widest, so
    // "9 of 10" going to "10 of 10" moves neither arrow, whatever the language writes round the numbers.
    const countRoom = Parts.element("span", "ui-lightbox__count-room");
    const count = Parts.element("span", "ui-lightbox__count");
    const caption = Parts.element("p", "ui-lightbox__caption ui-text-type--body", "caption");

    title.id = TitleId;
    count.setAttribute("aria-live", "polite");
    countRoom.setAttribute("aria-hidden", "true");
    clientStrings.write(title, null, "ui.lightbox.label");
    clientStrings.write(close, "aria-label", "ui.action.close");
    clientStrings.write(previous, "aria-label", "ui.lightbox.previous");
    clientStrings.write(next, "aria-label", "ui.lightbox.next");

    counter.append(countRoom, count);
    nav.append(previous, counter, next);
    current.append(nav);
    stage.append(previousFigure, current, nextFigure);
    // The × first: the dialog engine puts the focus on the first control, and a reader who only looks closes it with Enter.
    surface.append(title, close, stage, caption);

    dialog.addEventListener("click", domEvent => {
        switch (Parts.pressed(domEvent)) {
            case "close":
                dialogs.dismiss(LightboxKey);
                break;
            case "previous":
                turn(-1);
                break;
            case "next":
                turn(1);
                break;
        }
    });

    dialog.addEventListener("keydown", domEvent => {
        if (domEvent.defaultPrevented || !isPlainKey(domEvent) || showing === null || showing.pictures.length < 2)
            return;

        const by = domEvent.key === "ArrowLeft" ? -1 : domEvent.key === "ArrowRight" ? 1 : 0;

        if (by === 0)
            return;

        domEvent.preventDefault();
        turn(isRightToLeft(dialog) ? -by : by);
    });

    followTurns(dialog, stage);

    return { dialog, stage, current, picture, previousPicture, nextPicture, neighbours: [previousFigure, nextFigure], count, countRoom, caption };
}

/** A figure of the strip and its picture; a neighbour is the screen reader's to pass over, as it stands off the screen. */
function figure(slot: "previous" | "current" | "next"): [HTMLElement, HTMLImageElement] {
    const holder = Parts.element("div", "ui-lightbox__figure");
    const picture = Parts.element("img", "ui-lightbox__picture", slot === "current" ? "picture" : undefined) as HTMLImageElement;

    holder.setAttribute(SlotAttribute, slot);
    picture.decoding = "async";
    picture.draggable = false;
    // A picture that cannot be drawn leaves its room empty rather than show the browser's broken mark.
    picture.addEventListener("error", () => picture.setAttribute(ImageFailedAttribute, ""));

    if (slot !== "current")
        holder.setAttribute("aria-hidden", "true");

    holder.append(picture);

    return [holder, picture];
}

/** A control of the lightbox's own, a glyph on the backdrop rather than a framework button. */
function button(className: string, part: string): HTMLButtonElement {
    const pressable = Parts.element("button", className, part) as HTMLButtonElement;

    pressable.type = "button";

    return pressable;
}

/**
 * Turns the set by `by`, round past either end: the strip slides a pitch the step's way — the next picture in from the end the page
 * reads toward — from wherever a finger left it; a step asked while one slides lands that one at once first.
 */
function turn(by: number): void {
    if (parts === null || showing === null || showing.pictures.length < 2)
        return;

    const lightbox = parts;

    settleTurn(lightbox);

    if (prefersReducedMotion()) {
        advance(lightbox, by);
        restStrip(lightbox);
        present(lightbox, showing);
        return;
    }

    const step: Turn = { by, landed: false };
    const way = isRightToLeft(lightbox.dialog) ? -1 : 1;

    turning = step;
    lightbox.stage.removeAttribute(StillAttribute);
    lightbox.stage.style.setProperty(ShiftProperty, `${-by * way * pitch(lightbox.stage)}px`);

    afterTransitions(lightbox.current, motion.normal + 100, () => land(lightbox, step));
}

/** The strip's step: the stage's width and the gap, which a neighbour stands off the middle by. */
function pitch(stage: HTMLElement): number {
    return stage.getBoundingClientRect().width + SlideGap;
}

/** Lands a turn that slid all the way: the middle figure takes the picture that slid in, then the strip goes back under it. */
function land(lightbox: LightboxParts, step: Turn): void {
    if (turning !== step || step.landed)
        return;

    advance(lightbox, step.by);
    step.landed = true;

    // The picture is the neighbour's, decoded already; waited for all the same, so the middle never shows a frame of nothing.
    const decoded = typeof lightbox.picture.decode === "function" ? lightbox.picture.decode().catch(() => undefined) : null;

    if (decoded === null)
        settleTurn(lightbox);
    else
        void decoded.then(() => {
            if (turning === step)
                settleTurn(lightbox);
        });
}

/** Ends a turn under way at once, landed or not: the set at its picture, the strip at rest under it. */
function settleTurn(lightbox: LightboxParts): void {
    const step = turning;

    if (step === null || showing === null)
        return;

    turning = null;

    if (!step.landed)
        advance(lightbox, step.by);

    restStrip(lightbox);
    present(lightbox, showing);
}

/** Moves the set's index by `by` and puts its picture in the middle figure. */
function advance(lightbox: LightboxParts, by: number): void {
    if (showing === null)
        return;

    const count = showing.pictures.length;

    showing.index = (((showing.index + by) % count) + count) % count;
    showPicture(lightbox.picture, showing.pictures[showing.index].source);
}

/** The strip back at rest at once, with no movement. */
function restStrip(lightbox: LightboxParts): void {
    lightbox.stage.setAttribute(StillAttribute, "");
    lightbox.stage.style.setProperty(ShiftProperty, "0px");
    // Read, so the rest is laid out with no transition before the next move may run one.
    void lightbox.stage.getBoundingClientRect();
}

function present(lightbox: LightboxParts, shown: Showing): void {
    const count = shown.pictures.length;
    const picture = shown.pictures[shown.index];

    showPicture(lightbox.picture, picture.source);
    showPicture(lightbox.previousPicture, shown.pictures[(shown.index + count - 1) % count].source);
    showPicture(lightbox.nextPicture, shown.pictures[(shown.index + 1) % count].source);
    clientStrings.writeValue(lightbox.picture, "alt", picture.altText ?? picture.caption ?? "");
    clientStrings.writeValue(lightbox.caption, null, picture.caption ?? "");
    lightbox.caption.hidden = picture.caption === undefined;
    clientStrings.write(lightbox.count, null, "ui.lightbox.counter", { index: shown.index + 1, count });
    clientStrings.write(lightbox.countRoom, null, "ui.lightbox.counter", { index: count, count });
}

/** Points a picture at an address, leaving one already there alone: written again, the browser would fetch and decode it anew. */
function showPicture(picture: HTMLImageElement, source: string): void {
    if (picture.getAttribute("src") === source)
        return;

    picture.removeAttribute(ImageFailedAttribute);
    picture.src = source;
}

function isRightToLeft(element: Element): boolean {
    return getComputedStyle(element).direction === "rtl";
}

/**
 * A finger's swipe across the lightbox turns the set: the strip follows it, the neighbour coming in from the side it is dragged
 * away from; let go past a fifth of the window or on a flick it slides on the same way, short of that it springs back. A tap is left
 * to the click — on the backdrop, the dialog engine's close.
 */
function followTurns(dialog: HTMLElement, stage: HTMLElement): void {
    followSwipe(dialog, {
        axis: "x",
        begins: domEvent => {
            if (domEvent.pointerType !== "touch" || parts === null || showing === null || showing.pictures.length < 2)
                return false;

            // A finger on a picture still sliding lands it, and drags the one it lands on.
            settleTurn(parts);
            return true;
        },
        start: () => stage.setAttribute(StillAttribute, ""),
        follow: offset => stage.style.setProperty(ShiftProperty, `${offset}px`),
        end: (offset, speed, letGo) => {
            if (letGo && swipeTurns(offset, window.innerWidth, speed)) {
                // A finger moving the picture leftward brings the next one in, as a page is turned; rightward where the page reads so.
                turn((isRightToLeft(dialog) ? offset > 0 : offset < 0) ? 1 : -1);
                return;
            }

            stage.removeAttribute(StillAttribute);
            stage.style.setProperty(ShiftProperty, "0px");
        }
    });
}

/** Whether a swipe let go `offset` pixels across a window `width` wide, at `speed` px/ms, turns to the next or the previous picture. */
function swipeTurns(offset: number, width: number, speed: number): boolean {
    return Math.abs(offset) > width * TurnShare || (Math.abs(speed) > FlickSpeed && Math.abs(offset) > SwipeSlop);
}
