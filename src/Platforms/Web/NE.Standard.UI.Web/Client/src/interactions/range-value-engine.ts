// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { OrientationVerticalClass, SliderBubbleClass, SliderClass, SliderInputClass, SliderInputEndClass, SliderInputHeldClass, SliderMinDistanceAttribute, SliderRangeClass, SliderThumbAnchorClass, SliderTrackClass, SliderValueClass } from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import type { PropertyPatchTarget } from "../state/property-state-store.ts";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { PointerDrag } from "./pointer-drag.ts";
import { focusAsLastInput } from "./popup-focus.ts";
import { chooseHandle, holdApart, readRangeBounds, trackFraction, valueAtFraction } from "./range-handles.ts";
import type { RangeHandle } from "./range-handles.ts";

const FractionProperty = "--ui-slider-fraction";
const EndFractionProperty = "--ui-slider-end-fraction";
const BubbleGap = 6;
const ValuePropertyName = "Value";
const EndValuePropertyName = "EndValue";
// The four the fills are computed from: a push to any of them redraws them.
const ReadingPropertyNames = new Set(["Value", "EndValue", "Min", "Max"]);
// The bounds a push may clamp a value by, which the browser does silently.
const BoundPropertyNames = new Set(["Min", "Max", "Step"]);

export type RangeValueEngineOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: PropertyPatchTarget;
};

/** A press on a range slider's track: the two handles, where they stood, and the one it moves — none until a press on both moves. */
type BandDrag = {
    readonly start: HTMLInputElement;
    readonly end: HTMLInputElement;
    readonly from: readonly [string, string];
    readonly pressed: number;
    held: HTMLInputElement | null;
};

export class RangeValueEngine {
    private readonly options: RangeValueEngineOptions;
    private readonly root: ParentNode;

    // The value each range last stood at by the server's push or the reader's own move: what a refused move is put back to.
    private readonly settled = new WeakMap<HTMLInputElement, string>();

    // The value a range stood at when a press began, and the ranges whose press the browser took back for a scroll.
    private readonly pressedFrom = new WeakMap<HTMLInputElement, string>();
    private readonly cancelled = new WeakSet<HTMLInputElement>();

    // The ranges a pushed bound may have clamped, with the value the server holds: reported once the change set is applied, since a
    // report raised inside it would hold the set's own Value push out of the field.
    private readonly owedReports = new Map<HTMLInputElement, unknown>();

    public constructor(options: RangeValueEngineOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);

        // The bubble is fixed, so it is placed against the handle whenever either moves and released after.
        this.root.addEventListener("pointerdown", domEvent => {
            this.notePress(domEvent.target);
            this.placeBubble(domEvent.target);
        }, true);
        this.root.addEventListener("pointercancel", domEvent => this.takeBackPress(domEvent.target), true);
        // Ahead of the value binding, which listens on the root: the change a taken-back press still raises is no move of the reader's.
        (this.root === document ? window : this.root).addEventListener("change", domEvent => this.refuseCancelledChange(domEvent), true);
        this.root.addEventListener("focusin", domEvent => this.placeBubble(domEvent.target), true);
        this.root.addEventListener("focusout", domEvent => this.releaseBubble(domEvent.target), true);

        // Two handles on one track take the pointer through the track: the handle a press lands nearer to is the one it moves, which two
        // native ranges stacked could not tell apart where they meet.
        new PointerDrag<BandDrag>({
            root: this.root,
            resolveHandle: target => target.closest<HTMLElement>(`.${SliderRangeClass} .${SliderTrackClass}`),
            begin: (track, point) => this.beginBandDrag(track, point),
            move: (drag, _delta, point) => this.moveBandDrag(drag, point),
            end: (_track, drag) => this.endBandDrag(drag),
            cancel: (_track, drag) => this.putBandBack(drag),
            takenBack: (_track, drag) => this.putBandBack(drag)
        });

        // The page as drawn: a value off the step or past the bounds the browser has already moved, which the server does not know.
        for (const input of this.root.querySelectorAll<HTMLInputElement>(`.${SliderInputClass}`)) {
            this.settled.set(input, input.value);
            this.reportClamped(input, input.defaultValue);
        }

        // A push moves the fill and readings as a drag does; the browser's silent clamp — of a pushed value, or of the value a pushed
        // Min, Max or Step moved — is reported back through the two-way channel.
        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            // The handler is told about every property a slider has.
            if (!ReadingPropertyNames.has(change.propertyName) && !BoundPropertyNames.has(change.propertyName))
                return;

            // The elements the patch landed on, not every one the id names: a package's clone of a template is patched alone.
            for (const input of componentParts(change.components, `.${SliderInputClass}`) as HTMLInputElement[]) {
                const before = this.settled.get(input) ?? input.defaultValue;

                this.settled.set(input, input.value);
                this.writeReadings(input);

                if (change.propertyName === (isEndInput(input) ? EndValuePropertyName : ValuePropertyName)) {
                    // The value pushed after a bound in the same set is the server's: its own report covers that bound's clamp.
                    this.owedReports.delete(input);
                    this.reportClamped(input, change.value);
                }
                else if (BoundPropertyNames.has(change.propertyName)) {
                    this.oweReport(input, before);
                }
            }
        });
    }

    /** Owes a range the report of a pushed bound's clamp, judged against the value it stood at before the set's first bound. */
    private oweReport(input: HTMLInputElement, before: string): void {
        if (this.owedReports.has(input))
            return;

        if (this.owedReports.size === 0)
            queueMicrotask(() => this.payOwedReports());

        this.owedReports.set(input, before);
    }

    private payOwedReports(): void {
        const owed = [...this.owedReports];

        this.owedReports.clear();

        for (const [input, server] of owed)
            this.reportClamped(input, server);
    }

    private notePress(target: EventTarget | null): void {
        const input = rangeInput(target);

        if (input === null)
            return;

        this.cancelled.delete(input);
        this.pressedFrom.set(input, input.value);
    }

    /**
     * A finger set down on a track moves the value at once, and the browser cancels the press when the finger goes on to scroll the
     * page: that value is put back, since the reader was scrolling, not sliding.
     */
    private takeBackPress(target: EventTarget | null): void {
        const input = rangeInput(target);
        const from = input === null ? undefined : this.pressedFrom.get(input);

        if (input === null || from === undefined)
            return;

        this.pressedFrom.delete(input);

        if (input.value === from)
            return;

        input.value = from;
        this.cancelled.add(input);
        this.settled.set(input, from);
        this.writeReadings(input);
    }

    private refuseCancelledChange(domEvent: Event): void {
        const input = rangeInput(domEvent.target);

        if (input === null || !this.cancelled.has(input))
            return;

        this.cancelled.delete(input);
        domEvent.stopImmediatePropagation();
    }

    /** Reports a value the browser clamped away from the server's, as a move of the reader's is reported. */
    private reportClamped(input: HTMLInputElement, pushed: unknown): void {
        // A range the reader cannot move only shows the clamp: the value stays the server's. By number: "7.50" written is "7.5" read.
        if (pushed === null || pushed === undefined || String(pushed).trim().length === 0 || Number(input.value) === Number(pushed) || isFixed(input))
            return;

        input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SliderInputClass))
            return;

        const input = domEvent.target;

        // A move after a taken-back press is the reader's own, and so is the change it raises.
        this.cancelled.delete(input);

        // A move no key or pointer made (a screen reader's increment) on a range the reader cannot move is put back; its `change`
        // is refused ahead of every engine.
        if (isFixed(input)) {
            input.value = this.settled.get(input) ?? input.defaultValue;
            return;
        }

        // A key that would carry a band's handle past the other stops it there; a key that moved it nowhere raises no change.
        const other = otherHandle(input);

        if (other !== null) {
            const held = heldApart(input, Number(input.value), other);

            if (held !== input.value) {
                input.value = held;

                if (held === (this.settled.get(input) ?? input.defaultValue))
                    this.cancelled.add(input);
            }
        }

        this.settled.set(input, input.value);
        this.writeReadings(input);
    }

    /** A press on a band's track: the nearer handle takes it, at once, and the keyboard with it; a read-only band only takes the focus. */
    private beginBandDrag(track: HTMLElement, point: { readonly x: number; readonly y: number }): BandDrag | null {
        const start = track.querySelector<HTMLInputElement>(`.${SliderInputClass}:not(.${SliderInputEndClass})`);
        const end = track.querySelector<HTMLInputElement>(`.${SliderInputEndClass}`);

        if (start === null || end === null)
            return null;

        const pressed = valueAtFraction(trackFraction(track.getBoundingClientRect(), point, isVertical(track), handleSize(track)), readRangeBounds(start));
        const handle = chooseHandle(pressed, Number(start.value), Number(end.value));

        if (isFixed(start)) {
            focusAsLastInput(handle === "end" ? end : start);
            return null;
        }

        const drag: BandDrag = { start, end, from: [start.value, end.value], pressed, held: null };

        if (handle !== null)
            this.holdHandle(drag, handle, pressed);
        else
            focusAsLastInput(start);

        return drag;
    }

    private moveBandDrag(drag: BandDrag, point: { readonly x: number; readonly y: number }): void {
        const track = drag.start.closest<HTMLElement>(`.${SliderTrackClass}`);

        if (track === null)
            return;

        const value = valueAtFraction(trackFraction(track.getBoundingClientRect(), point, isVertical(track), handleSize(track)), readRangeBounds(drag.start));

        // Both handles under the press: the way the pointer first goes says which, so either can leave the other.
        if (drag.held === null) {
            if (value === drag.pressed)
                return;

            this.holdHandle(drag, value < drag.pressed ? "start" : "end", value);
            return;
        }

        this.moveHandle(drag.held, value);
    }

    private holdHandle(drag: BandDrag, handle: RangeHandle, value: number): void {
        const input = handle === "start" ? drag.start : drag.end;

        drag.held = input;
        input.classList.add(SliderInputHeldClass);
        focusAsLastInput(input);
        this.moveHandle(input, value);
        this.placeBubble(input);
    }

    /** Moves a handle as far toward a value as the other lets it, raising the `input` a native range raises on each step. */
    private moveHandle(input: HTMLInputElement, value: number): void {
        const other = otherHandle(input);
        const next = other === null ? String(value) : heldApart(input, value, other);

        if (input.value === next)
            return;

        input.value = next;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    /** The release commits the handle that moved, once, as a native range's release does. */
    private endBandDrag(drag: BandDrag): void {
        const held = drag.held;

        this.letGo(drag);

        if (held !== null && held.value !== (held === drag.start ? drag.from[0] : drag.from[1]))
            held.dispatchEvent(new Event("change", { bubbles: true }));
    }

    /** Escape, or the browser taking a finger back for a scroll: both handles go back to where the press found them, nothing sent. */
    private putBandBack(drag: BandDrag): void {
        this.letGo(drag);

        for (const [input, from] of [[drag.start, drag.from[0]], [drag.end, drag.from[1]]] as const) {
            if (input.value === from)
                continue;

            input.value = from;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    private letGo(drag: BandDrag): void {
        drag.held?.classList.remove(SliderInputHeldClass);

        if (drag.held !== null)
            this.writeReadings(drag.held);
    }

    private placeBubble(target: EventTarget | null): void {
        const parts = resolveBubbleParts(target);

        if (parts === null)
            return;

        placeAnchoredPopup(parts.anchor, parts.bubble, {
            placement: parts.vertical ? "left" : "top",
            gap: BubbleGap
        });
    }

    private releaseBubble(target: EventTarget | null): void {
        releaseAnchoredPopup(resolveBubbleParts(target)?.bubble);
    }

    /**
     * Writes both readings of a handle's value — the text beside the track and the bubble over the handle — and the fraction placing
     * them; a band's handle its own end's.
     */
    private writeReadings(input: HTMLInputElement): void {
        const end = isEndInput(input);
        const slider = input.closest<HTMLElement>(`.${SliderTrackClass}`)?.parentElement ?? input.parentElement;
        const readings = end
            ? `.${SliderValueClass}--end, .${SliderBubbleClass}--end`
            : `.${SliderValueClass}:not(.${SliderValueClass}--end), .${SliderBubbleClass}:not(.${SliderBubbleClass}--end)`;

        for (const readout of slider?.querySelectorAll<HTMLElement>(readings) ?? [])
            readout.textContent = input.value;

        input.closest<HTMLElement>(`.${SliderTrackClass}`)?.style.setProperty(end ? EndFractionProperty : FractionProperty, String(fractionOf(input)));

        // After the fraction, which moved the bubble's anchor; only a shown bubble is placed, so none is tracked unseen.
        if (input.matches(`:active, :focus-visible, .${SliderInputHeldClass}`))
            this.placeBubble(input);
        else
            this.releaseBubble(input);
    }
}

function rangeInput(target: EventTarget | null): HTMLInputElement | null {
    return target instanceof HTMLInputElement && target.classList.contains(SliderInputClass) ? target : null;
}

function isEndInput(input: Element): boolean {
    return input.classList.contains(SliderInputEndClass);
}

/** A band's other handle, or none for a single slider's. */
function otherHandle(input: HTMLInputElement): HTMLInputElement | null {
    const track = input.closest(`.${SliderRangeClass} .${SliderTrackClass}`);

    return track?.querySelector<HTMLInputElement>(isEndInput(input) ? `.${SliderInputClass}:not(.${SliderInputEndClass})` : `.${SliderInputEndClass}`) ?? null;
}

/** A handle's value held to its side of the other, at the least distance the slider names, as the input's value is written. */
function heldApart(input: HTMLInputElement, value: number, other: HTMLInputElement): string {
    const distance = Number(input.closest(`.${SliderClass}`)?.getAttribute(SliderMinDistanceAttribute) ?? 0);

    return String(holdApart(value, isEndInput(input) ? "end" : "start", Number(other.value), Number.isFinite(distance) ? distance : 0, readRangeBounds(input)));
}

/** Whether the reader may not move a range: read-only, disabled or loading. */
function isFixed(input: HTMLInputElement): boolean {
    return isReadOnly(input) || isInert(input);
}

function isVertical(track: Element): boolean {
    // The slider's own class, not the nearest ancestor carrying it: `ui-orientation--vertical` is shared with the layout panels.
    return track.closest(`.${SliderClass}`)?.classList.contains(OrientationVerticalClass) === true;
}

/** The handle's size along the track, which its anchor is drawn at. */
function handleSize(track: Element): number {
    const rect = track.querySelector(`.${SliderThumbAnchorClass}`)?.getBoundingClientRect();

    return rect === undefined ? 0 : isVertical(track) ? rect.height : rect.width;
}

/** The three elements a bubble needs to be placed: itself, the handle it stands over, and which way that is. */
function resolveBubbleParts(target: EventTarget | null): { readonly bubble: HTMLElement; readonly anchor: HTMLElement; readonly vertical: boolean } | null {
    if (!(target instanceof Element) || !target.classList.contains(SliderInputClass))
        return null;

    const track = target.closest<HTMLElement>(`.${SliderTrackClass}`);
    const end = isEndInput(target);
    const bubble = track?.querySelector<HTMLElement>(end ? `.${SliderBubbleClass}--end` : `.${SliderBubbleClass}:not(.${SliderBubbleClass}--end)`) ?? null;
    const anchor = track?.querySelector<HTMLElement>(end ? `.${SliderThumbAnchorClass}--end` : `.${SliderThumbAnchorClass}:not(.${SliderThumbAnchorClass}--end)`) ?? null;

    if (bubble === null || anchor === null)
        return null;

    return { bubble, anchor, vertical: isVertical(target) };
}

/** Where the handle sits between the input's own bounds, 0 to 1. */
function fractionOf(input: HTMLInputElement): number {
    const { min, max } = readRangeBounds(input);
    const value = Number(input.value);

    if (!Number.isFinite(value) || max <= min)
        return 0;

    return Math.min(1, Math.max(0, (value - min) / (max - min)));
}
