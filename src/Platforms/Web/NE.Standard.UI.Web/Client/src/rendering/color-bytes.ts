/** A colour channel as a whole byte; what is not a number reads as none of it. */
export function clampByte(value: number): number {
    return Number.isFinite(value) ? Math.min(255, Math.max(0, Math.round(value))) : 0;
}

/** A channel as the two hex digits a colour is written with. */
export function toHexByte(value: number): string {
    return clampByte(value).toString(16).padStart(2, "0").toUpperCase();
}

/**
 * The theme's text colour that reads on this colour, judged composited over white as `UIColorContrast.IsLightOverWhite` judges it
 * (WCAG relative luminance): opacity alone can flip the answer.
 */
export function onColorToken(red: number, green: number, blue: number, opacity: number): string {
    const alpha = opacity / 255;
    const over = (channel: number) => (channel * alpha) + (255 * (1 - alpha));

    return relativeLuminance(over(red), over(green), over(blue)) > 0.1791
        ? "var(--ui-color-on-light)"
        : "var(--ui-color-on-dark)";
}

function relativeLuminance(red: number, green: number, blue: number): number {
    return (0.2126 * linearChannel(red)) + (0.7152 * linearChannel(green)) + (0.0722 * linearChannel(blue));
}

function linearChannel(channel: number): number {
    const value = channel / 255;

    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}
