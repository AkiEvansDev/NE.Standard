import { DomRegistry } from "../addressing/dom-registry";
import { getIdValue } from "../metadata/metadata-index";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";

const RangeInputClass = "ui-slider__input";
const RangeValueClass = "ui-slider__value";
const RangeBubbleClass = "ui-slider__bubble";
const RangeTrackClass = "ui-slider__track";
const RangeAnchorClass = "ui-slider__thumb-anchor";
const SliderClass = "ui-slider";
const VerticalClass = "ui-orientation--vertical";
const FractionProperty = "--ui-slider-fraction";
const BubbleGap = 6;
const ValuePropertyName = "Value";

export type RangeValueEngineOptions = {
    readonly root?: ParentNode;

    readonly propertyPatchEngine?: PropertyPatchEngine;
    readonly dom?: DomRegistry;
};

export class RangeValueEngine {
    private readonly options: RangeValueEngineOptions;
    private readonly root: ParentNode;

    public constructor(options: RangeValueEngineOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);

        // The bubble is fixed, so it is placed against the handle whenever either moves and released after.
        this.root.addEventListener("pointerdown", domEvent => this.placeBubble(domEvent.target), true);
        this.root.addEventListener("focusin", domEvent => this.placeBubble(domEvent.target), true);
        this.root.addEventListener("focusout", domEvent => this.releaseBubble(domEvent.target), true);

        // A range input silently clamps what it is handed, so the browser's clamp is reported back through the two-way channel.
        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            // This component's Value and nothing else: the handler is told about every property a slider has.
            if (change.propertyName !== ValuePropertyName)
                return;

            const componentId = getIdValue(change.reference.componentId);

            for (const component of this.options.dom?.findAllComponents(componentId, change.dynamicParameters) ?? [])
                this.reportClamped(component.querySelector<HTMLInputElement>(`.${RangeInputClass}`), change.value);
        });
    }

    private reportClamped(input: HTMLInputElement | null, pushed: unknown): void {
        if (input === null || pushed === null || pushed === undefined || input.value === String(pushed))
            return;

        this.writeReadings(input);

        input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(RangeInputClass))
            return;

        this.writeReadings(domEvent.target);
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

    /** Writes both readings of the value — the text beside the track and the bubble over the handle — and the fraction placing them. */
    private writeReadings(input: HTMLInputElement): void {
        const slider = input.closest<HTMLElement>(`.${RangeTrackClass}`)?.parentElement ?? input.parentElement;

        for (const readout of slider?.querySelectorAll<HTMLElement>(`.${RangeValueClass}, .${RangeBubbleClass}`) ?? [])
            readout.textContent = input.value;

        input.closest<HTMLElement>(`.${RangeTrackClass}`)?.style.setProperty(FractionProperty, String(fractionOf(input)));

        // After the fraction, which is what moved the anchor the bubble stands over.
        this.placeBubble(input);
    }
}

/** The three elements a bubble needs to be placed: itself, the handle it stands over, and which way that is. */
function resolveBubbleParts(target: EventTarget | null): { readonly bubble: HTMLElement; readonly anchor: HTMLElement; readonly vertical: boolean } | null {
    if (!(target instanceof Element) || !target.classList.contains(RangeInputClass))
        return null;

    const track = target.closest<HTMLElement>(`.${RangeTrackClass}`);
    const bubble = track?.querySelector<HTMLElement>(`.${RangeBubbleClass}`) ?? null;
    const anchor = track?.querySelector<HTMLElement>(`.${RangeAnchorClass}`) ?? null;

    if (bubble === null || anchor === null)
        return null;

    // The slider's own class, not the nearest ancestor carrying it: `ui-orientation--vertical` is shared with the layout panels.
    const slider = target.closest<HTMLElement>(`.${SliderClass}`);

    return { bubble, anchor, vertical: slider !== null && slider.classList.contains(VerticalClass) };
}

/** Where the handle sits between the input's own bounds, 0 to 1. */
function fractionOf(input: HTMLInputElement): number {
    const min = Number(input.min === "" ? 0 : input.min);
    const max = Number(input.max === "" ? 100 : input.max);
    const value = Number(input.value);

    if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(value) || max <= min)
        return 0;

    return Math.min(1, Math.max(0, (value - min) / (max - min)));
}
