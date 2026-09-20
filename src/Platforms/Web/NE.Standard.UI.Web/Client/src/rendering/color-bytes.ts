/** A colour channel as a whole byte; what is not a number reads as none of it. */
export function clampByte(value: number): number {
    return Number.isFinite(value) ? Math.min(255, Math.max(0, Math.round(value))) : 0;
}

/** A channel as the two hex digits a colour is written with. */
export function toHexByte(value: number): string {
    return clampByte(value).toString(16).padStart(2, "0").toUpperCase();
}
