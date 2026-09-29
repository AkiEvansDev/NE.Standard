// A wheel read in pixels and notches rather than events: a control stepping once per event would race under a trackpad's glide.
// Shared by the picker's clock and the time segments, and handed to a package as `wheel`.

/** How far a wheel turns for one step: a notch of a mouse wheel, or as much of a trackpad's glide. */
export const WheelNotch = 100;

/** A wheel that reports lines rather than pixels turns three of them a notch. */
const WheelLine = WheelNotch / 3;

/** The two `deltaMode`s that are not pixels, by their `WheelEvent` numbers. */
const DeltaLine = 1;
const DeltaPage = 2;

/** How far a wheel event turned on each axis, in pixels, signed as the event's deltas are. */
export type WheelPixels = {
    readonly x: number;
    readonly y: number;
};

/** The whole notches a turn makes, signed as `deltaY` is, and what is left over for the next event. */
export type WheelTurn = {
    readonly steps: number;
    readonly carried: number;
};

/** An event's turn in pixels: a line a third of a notch, a page `pagePixels` (a line unless the caller says). */
export function wheelPixels(event: Pick<WheelEvent, "deltaX" | "deltaY" | "deltaMode">, pagePixels: number = WheelLine): WheelPixels {
    const scale = event.deltaMode === DeltaLine ? WheelLine : event.deltaMode === DeltaPage ? pagePixels : 1;

    return { x: event.deltaX * scale, y: event.deltaY * scale };
}

/** Adds one event's turn to what the last ones left; a turn the other way starts over. */
export function turnWheel(carried: number, pixels: number): WheelTurn {
    const turned = (Math.sign(carried) === Math.sign(pixels) ? carried : 0) + pixels;
    // `|| 0`: a short turn backwards truncates to -0, which is no step either.
    const steps = Math.trunc(turned / WheelNotch) || 0;

    return { steps, carried: turned - (steps * WheelNotch) };
}

/** The wheel as a package reaches it: the notch the framework steps by, and an event's turn in pixels. */
export const wheel = {
    notch: WheelNotch,
    pixels: wheelPixels
} as const;
