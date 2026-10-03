// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { SliderMinDistanceAttribute } from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { getIdValue } from "../metadata/metadata-index.ts";
import type { PropertyPatchEngine } from "../updates/property-patch-engine.ts";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { PointerDrag } from "./pointer-drag.ts";
import { focusAsLastInput } from "./popup-focus.ts";
import { chooseHandle, holdApart, readRangeBounds, trackFraction, valueAtFraction } from "./range-handles.ts";
import type { RangeHandle } from "./range-handles.ts";

const RangeInputClass = "ui-slider__input";
const EndInputClass = "ui-slider__input--end";
const HeldInputClass = "ui-slider__input--held";
const RangeValueClass = "ui-slider__value";
const RangeBubbleClass = "ui-slider__bubble";
const RangeTrackClass = "ui-slider__track";
const RangeAnchorClass = "ui-slider__thumb-anchor";
const SliderClass = "ui-slider";
const RangeSliderClass = "ui-slider--range";
const VerticalClass = "ui-orientation--vertical";
const FractionProperty = "--ui-slider-fraction";
const EndFractionProperty = "--ui-slider-end-fraction";
const BubbleGap = 6;
const ValuePropertyName = "Value";
const EndValuePropertyName = "EndValue";
// The four the fills are computed from: a push to any of them redraws them.
const ReadingPropertyNames = new Set(["Value", "EndValue", "Min", "Max"]);

export type RangeValueEngineOptions = {
    readonly root?: ParentNode;

    readonly propertyPatchEngine?: PropertyPatchEngine;
    readonly dom?: DomRegistry;
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
            resolveHandle: target => target.closest<HTMLElement>(`.${RangeSliderClass} .${RangeTrackClass}`),
            begin: (track, point) => this.beginBandDrag(track, point),
            move: (drag, _delta, point) => this.moveBandDrag(drag, point),
            end: (_track, drag) => this.endBandDrag(drag),
            cancel: (_track, drag) => this.putBandBack(drag),
            takenBack: (_track, drag) => this.putBandBack(drag)
        });

        // A push moves the fill and readings as a drag does; the browser's silent clamp is reported back through the two-way channel.
        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            // The handler is told about every property a slider has.
            if (!ReadingPropertyNames.has(change.propertyName))
                return;

            const componentId = getIdValue(change.reference.componentId);

            for (const component of this.options.dom?.findAllComponents(componentId, change.dynamicParameters) ?? []) {
                for (const input of component.querySelectorAll<HTMLInputElement>(`.${RangeInputClass}`)) {
                    this.settled.set(input, input.value);
                    this.writeReadings(input);

                    if (change.propertyName === (isEndInput(input) ? EndValuePropertyName : ValuePropertyName))
                        this.reportClamped(input, change.value);
                }
            }
        });
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

    private reportClamped(input: HTMLInputElement, pushed: unknown): void {
        // A range the reader cannot move only shows the clamp: the value stays the server's.
        if (pushed === null || pushed === undefined || input.value === String(pushed) || isFixed(input))
            return;

        input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(RangeInputClass))
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
        const start = track.querySelector<HTMLInputElement>(`.${RangeInputClass}:not(.${EndInputClass})`);
        const end = track.querySelector<HTMLInputElement>(`.${EndInputClass}`);

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
        const track = drag.start.closest<HTMLElement>(`.${RangeTrackClass}`);

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
        input.classList.add(HeldInputClass);
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
        drag.held?.classList.remove(HeldInputClass);

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
        const slider = input.closest<HTMLElement>(`.${RangeTrackClass}`)?.parentElement ?? input.parentElement;
        const readings = end
            ? `.${RangeValueClass}--end, .${RangeBubbleClass}--end`
            : `.${RangeValueClass}:not(.${RangeValueClass}--end), .${RangeBubbleClass}:not(.${RangeBubbleClass}--end)`;

        for (const readout of slider?.querySelectorAll<HTMLElement>(readings) ?? [])
            readout.textContent = input.value;

        input.closest<HTMLElement>(`.${RangeTrackClass}`)?.style.setProperty(end ? EndFractionProperty : FractionProperty, String(fractionOf(input)));

        // After the fraction, which moved the bubble's anchor; only a shown bubble is placed, so none is tracked unseen.
        if (input.matches(`:active, :focus-visible, .${HeldInputClass}`))
            this.placeBubble(input);
        else
            this.releaseBubble(input);
    }
}

function rangeInput(target: EventTarget | null): HTMLInputElement | null {
    return target instanceof HTMLInputElement && target.classList.contains(RangeInputClass) ? target : null;
}

function isEndInput(input: Element): boolean {
    return input.classList.contains(EndInputClass);
}

/** A band's other handle, or none for a single slider's. */
function otherHandle(input: HTMLInputElement): HTMLInputElement | null {
    const track = input.closest(`.${RangeSliderClass} .${RangeTrackClass}`);

    return track?.querySelector<HTMLInputElement>(isEndInput(input) ? `.${RangeInputClass}:not(.${EndInputClass})` : `.${EndInputClass}`) ?? null;
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
    return track.closest(`.${SliderClass}`)?.classList.contains(VerticalClass) === true;
}

/** The handle's size along the track, which its anchor is drawn at. */
function handleSize(track: Element): number {
    const rect = track.querySelector(`.${RangeAnchorClass}`)?.getBoundingClientRect();

    return rect === undefined ? 0 : isVertical(track) ? rect.height : rect.width;
}

/** The three elements a bubble needs to be placed: itself, the handle it stands over, and which way that is. */
function resolveBubbleParts(target: EventTarget | null): { readonly bubble: HTMLElement; readonly anchor: HTMLElement; readonly vertical: boolean } | null {
    if (!(target instanceof Element) || !target.classList.contains(RangeInputClass))
        return null;

    const track = target.closest<HTMLElement>(`.${RangeTrackClass}`);
    const end = isEndInput(target);
    const bubble = track?.querySelector<HTMLElement>(end ? `.${RangeBubbleClass}--end` : `.${RangeBubbleClass}:not(.${RangeBubbleClass}--end)`) ?? null;
    const anchor = track?.querySelector<HTMLElement>(end ? `.${RangeAnchorClass}--end` : `.${RangeAnchorClass}:not(.${RangeAnchorClass}--end)`) ?? null;

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
