// The arithmetic of a range slider's two handles: where on the track a press lands, which handle takes it, the step it lands on,
// and how near the other it may stand. No DOM here, so the rules are pinned by tests as they are.

/** A range's bounds and step as its inputs carry them; a range input's own defaults where an attribute is absent. */
export type RangeBounds = {
    readonly min: number;
    readonly max: number;
    /** Zero where any value goes (`step="any"`). */
    readonly step: number;
};

/** Which of the two handles: the band's start or its end. */
export type RangeHandle = "start" | "end";

/** The bounds an input carries: `min` 0, `max` 100 and `step` 1 where it names none, as the browser reads it. */
export function readRangeBounds(input: Element): RangeBounds {
    const min = readNumber(input.getAttribute("min"), 0);
    const max = readNumber(input.getAttribute("max"), 100);
    const step = input.getAttribute("step");

    return { min, max: Math.max(min, max), step: step === "any" ? 0 : Math.max(0, readNumber(step, 1)) };
}

function readNumber(text: string | null, fallback: number): number {
    const value = text === null || text.trim().length === 0 ? Number.NaN : Number(text);

    return Number.isFinite(value) ? value : fallback;
}

/**
 * Where a point stands along a track, 0 to 1, measured between the centres a handle of `handle` pixels can reach, as a range
 * input places its own; upright, the bottom is the start.
 */
export function trackFraction(rect: { readonly left: number; readonly top: number; readonly width: number; readonly height: number }, point: { readonly x: number; readonly y: number }, vertical: boolean, handle: number): number {
    const length = (vertical ? rect.height : rect.width) - handle;

    if (length <= 0)
        return 0;

    const along = vertical ? rect.top + rect.height - point.y : point.x - rect.left;

    return Math.min(1, Math.max(0, (along - handle / 2) / length));
}

/** The value at a fraction of the bounds, on the step. */
export function valueAtFraction(fraction: number, bounds: RangeBounds): number {
    return snapToStep(bounds.min + fraction * (bounds.max - bounds.min), bounds);
}

/** The nearest value on the step inside the bounds, written as exactly as the step and the minimum are (no 0.30000000000000004). */
export function snapToStep(value: number, bounds: RangeBounds): number {
    const clamped = Math.min(bounds.max, Math.max(bounds.min, value));

    if (bounds.step <= 0)
        return clamped;

    let steps = Math.round((clamped - bounds.min) / bounds.step);

    // The last step that still fits: a range whose length is no whole number of steps ends short of its maximum.
    if (bounds.min + steps * bounds.step > bounds.max)
        steps--;

    return roundTo(bounds.min + steps * bounds.step, bounds);
}

function roundTo(value: number, bounds: RangeBounds): number {
    return Number(value.toFixed(Math.min(20, Math.max(decimalsOf(bounds.step), decimalsOf(bounds.min)))));
}

function decimalsOf(value: number): number {
    const text = String(value);
    const exponent = text.indexOf("e-");

    if (exponent >= 0)
        return Number(text.slice(exponent + 2));

    const point = text.indexOf(".");

    return point < 0 ? 0 : text.length - point - 1;
}

/**
 * The handle a press at `value` takes: the nearer one; the one on the press's side where both stand together; none yet where the
 * press lands on both, which the first move decides.
 */
export function chooseHandle(value: number, start: number, end: number): RangeHandle | null {
    if (start === end)
        return value < start ? "start" : value > start ? "end" : null;

    return Math.abs(value - start) < Math.abs(value - end) ? "start" : "end";
}

/**
 * A handle's value held to its side of the other — the start no nearer the end than the least distance, nor the end the start —
 * on a step that keeps it so, and inside the bounds even where they leave the distance no room.
 */
export function holdApart(value: number, handle: RangeHandle, other: number, minDistance: number, bounds: RangeBounds): number {
    const distance = Math.max(0, minDistance);

    if (handle === "start" ? value <= other - distance : value >= other + distance)
        return value;

    const limit = handle === "start" ? other - distance : other + distance;

    if (bounds.step <= 0)
        return clampTo(limit, bounds);

    // Inward to the step: past the limit by a part of a step would bring the handle nearer than allowed.
    const steps = (limit - bounds.min) / bounds.step;
    const onStep = bounds.min + (handle === "start" ? Math.floor(steps + 1e-9) : Math.ceil(steps - 1e-9)) * bounds.step;

    return clampTo(roundTo(onStep, bounds), bounds);
}

function clampTo(value: number, bounds: RangeBounds): number {
    return Math.min(bounds.max, Math.max(bounds.min, value));
}
