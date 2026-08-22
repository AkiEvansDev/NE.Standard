// TimeInput edits its value in place, as one focusable span per clock unit, instead of opening a picker.
// A clock has three units at most and every one of them fits in two keystrokes, so a popup was a detour —
// and a free-text field that had to be parsed server-side against Format/Culture was a round-trip to find
// out whether what the user typed was a time at all. Segments cannot produce an invalid value.
//
// The segments are built here rather than server-side on purpose: the tokenizer that decides which segments
// exist would otherwise be a third hand-maintained port next to WebTemporalFormat/temporal-format.ts. The
// server renders the same formatted text this replaces, so the swap is invisible.

import { DomRegistry } from "../addressing/dom-registry";
import { getIdValue } from "../metadata/metadata-index";
import { formatTemporal, matchTemporalToken, TemporalCulturePack } from "../rendering/temporal-format";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import {
    clampToRange, defaultMoment, PickerAttributes, readCulturePack, readFormat, readMode, readStep, readValue,
    RootClass, stepFor, TimeUnit, writeValue
} from "./temporal-dom";

const SegmentsClass = "ui-temporal-input__segments";
const SegmentClass = "ui-temporal-input__segment";
const LiteralClass = "ui-temporal-input__segment-literal";
const EmptyModifier = "ui-temporal-input__segment--empty";

const SegmentAttribute = "data-ui-temporal-segment";
const StepDirectionAttribute = "data-ui-temporal-step-direction";
const ReadOnlyAttribute = "data-ui-temporal-readonly";
/** The format the current segment spans were built from, so a live DisplayFormat patch rebuilds them. */
const BuiltFromAttribute = "data-ui-temporal-segments-of";

const EmptyText = "--";

/** `hour12` is the same underlying hour, read and written through a 12-hour dial with a meridiem beside it. */
type SegmentUnit = TimeUnit | "hour12" | "meridiem";

type Part =
    /** `formatted` separates a date token, which the shared formatter renders, from a plain separator. */
    | { readonly kind: "literal"; readonly token: string; readonly formatted: boolean }
    | { readonly kind: "segment"; readonly unit: SegmentUnit; readonly width: number };

/** The digits typed into the focused segment so far. Cleared whenever focus or unit moves. */
type EditState = { unit: SegmentUnit | null; buffer: string };

export type TimeSegmentEngineOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: PropertyPatchEngine;
    readonly dom?: DomRegistry;
};

export class TimeSegmentEngine {
    private readonly root: ParentNode;
    private readonly edits = new WeakMap<HTMLElement, EditState>();

    public constructor(private readonly options: TimeSegmentEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            const componentId = getIdValue(change.reference.componentId);

            for (const component of this.options.dom?.findAllComponents(componentId, change.dynamicParameters) ?? []) {
                this.applyAll(component instanceof HTMLElement && component.classList.contains(RootClass)
                    ? [component]
                    : component.querySelectorAll<HTMLElement>(`.${RootClass}`));
            }
        });

        if (this.root instanceof Node) {
            // Min/Max/DisplayFormat are live-patchable; the first two only re-clamp, but a patched format
            // changes which segments exist at all.
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type !== "attributes" || !PickerAttributes.has(mutation.attributeName ?? ""))
                        continue;

                    if (mutation.target instanceof HTMLElement && mutation.target.classList.contains(RootClass))
                        this.applyAll([mutation.target]);
                }
            });

            observer.observe(this.root, { attributes: true, subtree: true });
        }

        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("wheel", domEvent => this.handleWheel(domEvent), { capture: true, passive: false });
        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("focusout", domEvent => this.handleFocusOut(domEvent), true);

        // Before the click below, and only to keep focus where it is — see handleStepperPress.
        this.root.addEventListener("mousedown", domEvent => this.handleStepperPress(domEvent), true);
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots) {
            if (readMode(root) === "time")
                this.applySegments(root);
        }
    }

    /**
     * Rebuilds the spans only when the format they were built from changed; otherwise it rewrites their text
     * in place, because a rebuild during typing would drop the focus the user is editing through.
     */
    private applySegments(root: HTMLElement): void {
        const container = root.querySelector<HTMLElement>(`.${SegmentsClass}`);

        if (container === null)
            return;

        const format = readFormat(root);
        const culture = readCulturePack(root);
        const value = readValue(root);

        if (container.getAttribute(BuiltFromAttribute) !== format) {
            container.replaceChildren(...parseParts(format).map(part => createPart(part)));
            container.setAttribute(BuiltFromAttribute, format);
        }

        for (const element of container.children) {
            if (!(element instanceof HTMLElement))
                continue;

            const unit = element.getAttribute(SegmentAttribute);

            if (unit === null) {
                element.textContent = renderLiteral(element.dataset.token ?? "", element.dataset.formatted !== undefined, value, culture);
                continue;
            }

            const width = Number(element.dataset.width ?? "2");

            element.textContent = renderSegment(unit as SegmentUnit, width, value, culture);
            element.classList.toggle(EmptyModifier, value === null);
            element.tabIndex = root.hasAttribute(ReadOnlyAttribute) ? -1 : 0;
            writeAria(element, unit as SegmentUnit, value);
        }
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent))
            return;

        const segment = editableSegment(domEvent.target);

        if (segment === null)
            return;

        const root = segment.closest<HTMLElement>(`.${RootClass}`)!;
        const unit = segment.getAttribute(SegmentAttribute) as SegmentUnit;

        if (domEvent.key === "ArrowUp" || domEvent.key === "ArrowDown") {
            domEvent.preventDefault();
            this.resetBuffer(root);
            this.applyStep(root, unit, domEvent.key === "ArrowUp" ? 1 : -1);
            return;
        }

        if (domEvent.key === "ArrowLeft" || domEvent.key === "ArrowRight" || domEvent.key === "Home" || domEvent.key === "End") {
            domEvent.preventDefault();
            this.resetBuffer(root);
            moveFocus(root, segment, domEvent.key);
            return;
        }

        if (domEvent.key === "Backspace" || domEvent.key === "Delete") {
            domEvent.preventDefault();
            this.resetBuffer(root);
            writeValue(root, null);
            this.applySegments(root);
            return;
        }

        if (unit === "meridiem") {
            const meridiem = matchMeridiem(domEvent.key, readCulturePack(root));

            if (meridiem !== null) {
                domEvent.preventDefault();
                this.applyMeridiem(root, meridiem);
            }

            return;
        }

        if (domEvent.key.length === 1 && domEvent.key >= "0" && domEvent.key <= "9") {
            domEvent.preventDefault();
            this.applyDigit(root, segment, unit, domEvent.key);
        }
    }

    private handleWheel(domEvent: Event): void {
        if (!(domEvent instanceof WheelEvent))
            return;

        const segment = editableSegment(domEvent.target);

        // Only the focused segment reacts, or scrolling the page over a form would change values in passing.
        if (segment === null || segment !== document.activeElement)
            return;

        domEvent.preventDefault();

        const root = segment.closest<HTMLElement>(`.${RootClass}`)!;

        this.resetBuffer(root);
        this.applyStep(root, segment.getAttribute(SegmentAttribute) as SegmentUnit, domEvent.deltaY < 0 ? 1 : -1);
    }

    /**
     * Keeps the focused segment focused while the stepper is pressed. Without it the press moved focus to the
     * button, the click below then found no focused segment and fell back to the first one — so the arrows
     * stepped the hour whichever unit the user had actually chosen.
     */
    private handleStepperPress(domEvent: Event): void {
        if (domEvent.target instanceof Element && domEvent.target.closest(`[${StepDirectionAttribute}]`) !== null)
            domEvent.preventDefault();
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const stepper = domEvent.target.closest<HTMLElement>(`[${StepDirectionAttribute}]`);

        if (stepper === null)
            return;

        const root = stepper.closest<HTMLElement>(`.${RootClass}`);

        if (root === null || root.hasAttribute(ReadOnlyAttribute))
            return;

        domEvent.preventDefault();

        // The stepper drives whichever segment has focus, and adopts the first one when nothing does — so a
        // pointer-only user still gets a working control without having to pick a segment first.
        const segment = focusedSegment(root) ?? root.querySelector<HTMLElement>(`.${SegmentClass}`);

        if (segment === null)
            return;

        segment.focus();
        this.resetBuffer(root);
        this.applyStep(root, segment.getAttribute(SegmentAttribute) as SegmentUnit, stepper.getAttribute(StepDirectionAttribute) === "up" ? 1 : -1);
    }

    private handleFocusOut(domEvent: Event): void {
        const segment = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${SegmentClass}`) : null;

        if (segment === null)
            return;

        const root = segment.closest<HTMLElement>(`.${RootClass}`);

        if (root !== null)
            this.resetBuffer(root);
    }

    private applyStep(root: HTMLElement, unit: SegmentUnit, direction: number): void {
        if (unit === "meridiem") {
            const current = readValue(root);

            this.applyMeridiem(root, current !== null && current.getHours() >= 12 ? "am" : "pm");
            return;
        }

        const base = this.baseValue(root);
        const clock = clockUnit(unit);
        const increment = stepFor(readStep(root), clock) * direction;
        const limit = clock === "hour" ? 24 : 60;
        const next = ((unitValue(base, clock) + increment) % limit + limit) % limit;

        this.write(root, withUnit(base, clock, next));
    }

    private applyDigit(root: HTMLElement, segment: HTMLElement, unit: SegmentUnit, digit: string): void {
        const state = this.editState(root);
        const max = unit === "hour" ? 23 : unit === "hour12" ? 12 : 59;
        const minimum = unit === "hour12" ? 1 : 0;

        let typed = (state.unit === unit ? state.buffer : "") + digit;

        // A digit that cannot extend what is already there starts the segment over rather than being refused,
        // which is how every native spinner behaves: "9" then "5" in an hour segment means hour 5.
        if (Number(typed) > max)
            typed = digit;

        const numeric = Number(typed);
        const complete = typed.length >= 2 || numeric * 10 > max;

        state.unit = unit;
        state.buffer = complete ? "" : typed;

        if (numeric >= minimum) {
            const base = this.baseValue(root);

            this.write(root, unit === "hour12"
                ? withUnit(base, "hour", toHour24(numeric, base.getHours() >= 12))
                : withUnit(base, clockUnit(unit), numeric));
        }

        if (complete)
            moveFocus(root, segment, "ArrowRight");
    }

    private applyMeridiem(root: HTMLElement, meridiem: "am" | "pm"): void {
        const base = this.baseValue(root);

        this.write(root, withUnit(base, "hour", toHour24(base.getHours() % 12 === 0 ? 12 : base.getHours() % 12, meridiem === "pm")));
    }

    /** The value edits start from. An empty control seeds the whole clock from now, then edits one unit. */
    private baseValue(root: HTMLElement): Date {
        return readValue(root) ?? defaultMoment(root);
    }

    private write(root: HTMLElement, value: Date): void {
        writeValue(root, clampToRange(root, value));
        this.applySegments(root);
    }

    private editState(root: HTMLElement): EditState {
        let state = this.edits.get(root);

        if (state === undefined) {
            state = { unit: null, buffer: "" };
            this.edits.set(root, state);
        }

        return state;
    }

    private resetBuffer(root: HTMLElement): void {
        const state = this.editState(root);

        state.unit = null;
        state.buffer = "";
    }
}

function parseParts(format: string): Part[] {
    const parts: Part[] = [];

    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token === null) {
            parts.push({ kind: "literal", token: format[index], formatted: false });
            index++;
            continue;
        }

        parts.push(toPart(token));
        index += token.length;
    }

    return parts;
}

function toPart(token: string): Part {
    switch (token) {
        case "HH": return { kind: "segment", unit: "hour", width: 2 };
        case "H": return { kind: "segment", unit: "hour", width: 1 };
        case "hh": return { kind: "segment", unit: "hour12", width: 2 };
        case "h": return { kind: "segment", unit: "hour12", width: 1 };
        case "mm": return { kind: "segment", unit: "minute", width: 2 };
        case "m": return { kind: "segment", unit: "minute", width: 1 };
        case "ss": return { kind: "segment", unit: "second", width: 2 };
        case "s": return { kind: "segment", unit: "second", width: 1 };
        case "tt": return { kind: "segment", unit: "meridiem", width: 0 };
        // A date token in a time-only format is not a segment anything here can edit, so it rides along as
        // text the shared formatter renders.
        default: return { kind: "literal", token, formatted: true };
    }
}

function createPart(part: Part): HTMLElement {
    if (part.kind === "literal") {
        const literal = document.createElement("span");

        literal.className = LiteralClass;
        literal.dataset.token = part.token;

        if (part.formatted)
            literal.dataset.formatted = "";

        return literal;
    }

    const segment = document.createElement("span");

    segment.className = SegmentClass;
    segment.tabIndex = 0;
    segment.setAttribute("role", "spinbutton");
    segment.setAttribute(SegmentAttribute, part.unit);
    segment.dataset.width = String(part.width);

    return segment;
}

// A separator is its own text. Only a date token goes through the formatter — and never a blank one, which
// formatTemporal reads as "no format at all" and answers with a full timestamp.
function renderLiteral(token: string, formatted: boolean, value: Date | null, culture: TemporalCulturePack): string {
    return formatted && value !== null ? formatTemporal(value, token, culture) : token;
}

function renderSegment(unit: SegmentUnit, width: number, value: Date | null, culture: TemporalCulturePack): string {
    if (value === null)
        return EmptyText;

    if (unit === "meridiem")
        return value.getHours() < 12 ? culture.amDesignator : culture.pmDesignator;

    const raw = unit === "hour12"
        ? (value.getHours() % 12 === 0 ? 12 : value.getHours() % 12)
        : unitValue(value, clockUnit(unit));

    return String(raw).padStart(width, "0");
}

function writeAria(segment: HTMLElement, unit: SegmentUnit, value: Date | null): void {
    if (unit === "meridiem" || value === null) {
        segment.removeAttribute("aria-valuenow");
        return;
    }

    segment.setAttribute("aria-valuenow", String(unitValue(value, clockUnit(unit))));
}

function editableSegment(target: EventTarget | null): HTMLElement | null {
    const segment = target instanceof Element ? target.closest<HTMLElement>(`.${SegmentClass}`) : null;

    if (segment === null)
        return null;

    const root = segment.closest<HTMLElement>(`.${RootClass}`);

    return root === null || root.hasAttribute(ReadOnlyAttribute) ? null : segment;
}

function focusedSegment(root: HTMLElement): HTMLElement | null {
    return document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${RootClass}`) === root
        ? document.activeElement.closest<HTMLElement>(`.${SegmentClass}`)
        : null;
}

function moveFocus(root: HTMLElement, segment: HTMLElement, key: string): void {
    const segments = [...root.querySelectorAll<HTMLElement>(`.${SegmentClass}`)];
    const index = segments.indexOf(segment);

    if (index === -1)
        return;

    const target = key === "Home" ? 0
        : key === "End" ? segments.length - 1
            : Math.max(0, Math.min(segments.length - 1, index + (key === "ArrowRight" ? 1 : -1)));

    segments[target].focus();
}

function matchMeridiem(key: string, culture: TemporalCulturePack): "am" | "pm" | null {
    const typed = key.toLowerCase();

    if (typed.length !== 1)
        return null;

    if (typed === "a" || typed === culture.amDesignator.charAt(0).toLowerCase())
        return "am";

    if (typed === "p" || typed === culture.pmDesignator.charAt(0).toLowerCase())
        return "pm";

    return null;
}

function clockUnit(unit: SegmentUnit): TimeUnit {
    return unit === "hour12" || unit === "meridiem" ? "hour" : unit;
}

function unitValue(value: Date, unit: TimeUnit): number {
    return unit === "hour" ? value.getHours() : unit === "minute" ? value.getMinutes() : value.getSeconds();
}

function withUnit(value: Date, unit: TimeUnit, next: number): Date {
    const result = new Date(value);

    if (unit === "hour")
        result.setHours(next);
    else if (unit === "minute")
        result.setMinutes(next);
    else
        result.setSeconds(next);

    return result;
}

function toHour24(hour12: number, pm: boolean): number {
    const base = hour12 % 12;

    return pm ? base + 12 : base;
}
