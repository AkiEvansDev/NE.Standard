// A wheel read in notches rather than events: a mouse wheel sends one event a notch, a trackpad's glide dozens of small ones, and
// a control that stepped once per event would race through its values under a trackpad. Shared by the picker's clock and the
// time segments.

/** How far a wheel turns for one step: a notch of a mouse wheel, or as much of a trackpad's glide. */
export const WheelNotch = 100;

/** A wheel that reports lines rather than pixels turns three of them a notch. */
const WheelLine = WheelNotch / 3;

/** The whole notches a turn makes, signed as `deltaY` is, and what is left over for the next event. */
export type WheelTurn = {
    readonly steps: number;
    readonly carried: number;
};

/** Adds one event's turn to what the last ones left; a turn the other way starts over, since it owes nothing to the last direction. */
export function turnWheel(carried: number, deltaY: number, inPixels: boolean): WheelTurn {
    const turn = inPixels ? deltaY : deltaY * WheelLine;
    const turned = (Math.sign(carried) === Math.sign(turn) ? carried : 0) + turn;
    // `|| 0`: a short turn backwards truncates to -0, which is no step either.
    const steps = Math.trunc(turned / WheelNotch) || 0;

    return { steps, carried: turned - (steps * WheelNotch) };
}
