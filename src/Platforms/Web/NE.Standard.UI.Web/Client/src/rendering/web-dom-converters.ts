// Mirrors the C# WebCssValues/WebClassNames helpers value-for-value, over models read by their camel-cased members, as the wire sends them.

// `.ts` on the imports, and types imported as types: `node --test` runs this module and resolves files literally.
import { toKebabCase } from "../addressing/dom-attributes.ts";
import type { ResponsiveTier } from "./responsive-tier.ts";
import { resolveResponsiveTier, toResponsiveTier } from "./responsive-tier.ts";
import { iconImageClassName, readIconSource, toCssUrl, toIconGlyphClassName, toIconSourceCss } from "./icon-value.ts";
import { toSafeImageSource, toSafeLink } from "./url-safety.ts";

export type WebDomConverter = (value: unknown) => string | undefined;

const enumNames = new Map<string, string>([
    ["Default", "default"],
    ["Primary", "primary"],
    ["Accent", "accent"],
    ["Background", "background"],
    ["Surface", "surface"],
    ["OnPrimary", "on-primary"],
    ["OnAccent", "on-accent"],
    ["OnBackground", "on-background"],
    ["OnSurface", "on-surface"],
    ["Info", "info"],
    ["Warning", "warning"],
    ["Success", "success"],
    ["Danger", "danger"],
    ["OnInfo", "on-info"],
    ["OnWarning", "on-warning"],
    ["OnSuccess", "on-success"],
    ["OnDanger", "on-danger"],
    ["Muted", "muted"],
    ["Selected", "selected"],
    ["FocusRing", "focus-ring"],
    ["Border", "border"],
    ["Shadow", "shadow"],
    ["Overlay", "overlay"],
    ["Small", "small"],
    ["Medium", "medium"],
    ["Large", "large"],
    ["Display", "display"],
    ["Title", "title"],
    ["Subtitle", "subtitle"],
    ["Body", "body"],
    ["Caption", "caption"],
    ["Overline", "overline"],
    ["Start", "start"],
    ["Center", "center"],
    ["End", "end"],
    ["Justify", "justify"],
    ["NoWrap", "nowrap"],
    ["Wrap", "wrap"],
    ["WrapEllipsis", "wrap-ellipsis"],
    ["Inline", "inline"],
    ["Trailing", "trailing"],
    ["Outline", "outline"],
    ["Ghost", "ghost"],
    ["Link", "link"],
    ["Light", "light"],
    ["Dark", "dark"],
    ["Auto", "auto"],
    ["Disabled", "disabled"],
    ["Always", "always"],
    ["Proximity", "proximity"],
    ["Mandatory", "mandatory"],
    ["Stretch", "stretch"],
    ["Horizontal", "horizontal"],
    ["Vertical", "vertical"],
    ["Text", "text"],
    ["Card", "card"],
    ["Raised", "raised"],
    ["Circle", "circle"],
    ["KeepSearchInput", "keep"],
    ["ReplaceWithSelectedItem", "replace"],
    ["None", "none"],
    ["Both", "both"],
    ["BottomStart", "bottom-start"],
    ["Bottom", "bottom"],
    ["BottomEnd", "bottom-end"],
    ["TopStart", "top-start"],
    ["Top", "top"],
    ["TopEnd", "top-end"],
    ["LeftStart", "left-start"],
    ["Left", "left"],
    ["LeftEnd", "left-end"],
    ["RightStart", "right-start"],
    ["Right", "right"],
    ["RightEnd", "right-end"],
    ["Hidden", "hidden"],
    ["Show", "visible"]
]);

const colorTokens = [
    "default",
    "primary",
    "accent",
    "background",
    "surface",
    "on-primary",
    "on-accent",
    "on-background",
    "on-surface",
    "info",
    "warning",
    "success",
    "danger",
    "on-info",
    "on-warning",
    "on-success",
    "on-danger",
    "muted",
    "selected",
    "focus-ring",
    "border",
    "shadow",
    "overlay"
];

export function toColorToken(value: unknown): string {
    return toToken(value, colorTokens);
}

const iconSizeTokens = ["small", "medium", "large"];
const textTypeTokens = ["display", "title", "subtitle", "body", "caption", "overline"];
const textAlignmentTokens = ["start", "center", "end", "justify"];
const textWrapTokens = ["nowrap", "wrap", "wrap-ellipsis"];
const styleVarNames = new Map<string, string>([
    ["primary", "--ui-color-primary"],
    ["accent", "--ui-color-accent"],
    ["background", "--ui-color-background"],
    ["surface", "--ui-color-surface"],
    ["on-primary", "--ui-color-on-primary"],
    ["on-accent", "--ui-color-on-accent"],
    ["on-background", "--ui-color-on-background"],
    ["on-surface", "--ui-color-on-surface"],
    ["info", "--ui-color-info"],
    ["warning", "--ui-color-warning"],
    ["success", "--ui-color-success"],
    ["danger", "--ui-color-danger"],
    ["on-info", "--ui-color-on-info"],
    ["on-warning", "--ui-color-on-warning"],
    ["on-success", "--ui-color-on-success"],
    ["on-danger", "--ui-color-on-danger"],
    ["selected", "--ui-color-selected"],
    ["focus-ring", "--ui-color-focus-ring"],
    ["border", "--ui-color-border"],
    ["shadow", "--ui-color-shadow"],
    ["overlay", "--ui-color-overlay"]
]);

const badgePlacementTokens = ["inline", "trailing"];
const inputAppearanceTokens = ["filled", "outline", "underline", "ghost"];
const buttonSizeTokens = ["small", "medium", "large"];
const buttonTokens = ["primary", "accent", "danger", "outline", "ghost", "link", "surface"];
const badgeTypeTokens = ["primary", "accent", "info", "warning", "success", "danger", "surface"];
const themeTokens = ["light", "dark"];
const alignmentTokens = ["start", "center", "end", "stretch"];
const overflowTokens = ["clip", "visible"];
const visibilityTokens = ["visible", "hidden", "collapsed"];
const surfaceStyleTokens = ["background", "raised", "tinted"];
const orientationTokens = ["horizontal", "vertical"];
const groupSeparatorTokens = ["none", "gap", "rule"];
const selectionModeTokens = ["none", "one", "many"];
const selectionMarkTokens = ["none", "left", "right", "top", "bottom"];
const itemsViewLayoutTokens = ["stack", "wrap"];
const scrollTokens = ["disabled", "auto", "always"];
const scrollSnapTokens = ["disabled", "proximity", "mandatory"];
const textInputTypeTokens = ["text", "email", "password", "search", "tel", "url"];
const colorTextFormatTokens = ["hex", "rgb"];
const colorInputVariantTokens = ["field", "swatch"];
const imageFitTokens = ["fill", "contain", "cover", "none"];
const imageFitSizeTokens = ["100% 100%", "contain", "cover", "auto"];
const progressVariantTokens = ["linear", "circular"];
const searchSelectionModeTokens = ["keep", "replace"];
const textAreaResizeTokens = ["none", "vertical", "horizontal", "both"];
const popupPlacementTokens = [
    "bottom-start", "bottom", "bottom-end",
    "top-start", "top", "top-end",
    "left-start", "left", "left-end",
    "right-start", "right", "right-end"
];

const colorAdjustmentTokens = ["None", "Shade", "Tint"];

export const webDomConverters = new Map<string, WebDomConverter>([
    ["colorClass", value => `ui-color--${toToken(value, colorTokens)}`],
    ["themeColorClass", value => toThemeColorClass(value)],
    ["iconClass", value => toIconClassName(value)],
    ["iconUrlCss", value => toIconSourceCss(value)],
    ["safeUrl", value => toSafeLink(value)],
    ["safeImageSource", value => toSafeImageSource(value)],
    ["iconSizeClass", value => `ui-icon-size--${toToken(value, iconSizeTokens)}`],
    ["textTypeClass", value => `ui-text-type--${toToken(value, textTypeTokens)}`],
    ["textAppearanceClass", value => toTextAppearanceClass(value)],
    ["textAlignmentClass", value => `ui-text--align-${toToken(value, textAlignmentTokens)}`],
    ["textWrapClass", value => `ui-text--${toToken(value, textWrapTokens)}`],
    ["textBadgePlacementClass", value => `ui-text__badge--${toToken(value, badgePlacementTokens)}`],
    ["badgeStyleClass", value => `ui-badge-style--${toToken(value, badgeTypeTokens)}`],
    ["badgeTextFit", value => toBadgeTextFit(value)],
    ["buttonClass", value => `ui-button--${toToken(value, buttonTokens)}`],
    ["surfaceStyleClass", value => `ui-surface--${toToken(value, surfaceStyleTokens)}`],
    ["orientationClass", value => `ui-orientation--${toToken(value, orientationTokens)}`],
    ["groupSeparatorClass", value => `ui-command-bar--separator-${toToken(value, groupSeparatorTokens)}`],
    ["selectionModeAttribute", value => toToken(value, selectionModeTokens)],
    ["selectionBackgroundCss", value => toThemeColor(toSelectionStylePart(value, "background"))],
    ["selectionForegroundCss", value => toThemeColor(toSelectionStylePart(value, "foreground"))],
    ["selectionMarkColorCss", value => toThemeColor(toSelectionStylePart(value, "markColor"))],
    ["selectionMarkCss", value => toSelectionMark(toSelectionStylePart(value, "mark"))],
    ["selectionFontWeightCss", value => toSelectionFontWeight(toSelectionStylePart(value, "bold"))],
    ["itemsViewLayoutClass", value => `ui-items-view--${toToken(value, itemsViewLayoutTokens)}`],
    ["scrollXClass", value => `ui-scroll-x--${toToken(value, scrollTokens)}`],
    ["scrollYClass", value => `ui-scroll-y--${toToken(value, scrollTokens)}`],
    ["scrollSnapClass", value => `ui-scroll-snap--${toToken(value, scrollSnapTokens)}`],
    ["inputAppearanceClass", value => `ui-input--${toToken(value, inputAppearanceTokens)}`],
    ["buttonSizeClass", value => `ui-button--${toToken(value, buttonSizeTokens)}`],
    ["buttonGroupSizeClass", value => `ui-button-group--${toToken(value, buttonSizeTokens)}`],
    ["textInputTypeAttribute", value => toToken(value, textInputTypeTokens)],
    ["colorTextFormatAttribute", value => toToken(value, colorTextFormatTokens)],
    ["colorInputVariantAttribute", value => toToken(value, colorInputVariantTokens)],
    ["themeNameCss", value => toToken(value, themeTokens)],
    ["alignmentCss", value => toToken(value, alignmentTokens)],
    ["alignmentStretchFallbackCss", value => toToken(value, alignmentTokens) === "stretch" ? "start" : ""],
    ["overflowCss", value => toToken(value, overflowTokens)],
    ["layoutLengthCss", value => toLayoutLength(value)],
    ["thicknessCss", value => toThickness(value)],
    ["radiusCss", value => toRadius(value)],
    ["gridUnitCss", value => toGridUnit(value)],
    ["pixelsCss", value => toPixels(value)],
    ["gridTemplateCss", value => toGridTemplate(value)],
    ["colorVariantCss", value => toColorVariant(value)],
    ["themeColorCss", value => toThemeColor(value)],
    // Mirrors ThemeColorRenderer: a style colour is a class (an ink), so it writes no inline colour that would override the class.
    ["themeColorInlineCss", value => isStyleOnlyThemeColor(value) ? "" : toThemeColor(value)],
    ["themeColorCanonical", value => toThemeColorCanonical(value)],
    ["textAppearanceFontSizeCss", value => toTextAppearanceField(value, "size")],
    ["textAppearanceFontWeightCss", value => toTextAppearanceField(value, "weight")],
    ["textAppearanceLineHeightCss", value => toTextAppearanceField(value, "lineHeight")],
    ["textAppearanceLetterSpacingCss", value => toTextAppearanceField(value, "letterSpacing")],
    ["responsiveLayoutLengthBaseCss", value => toLayoutLength(toResponsiveTier(value, "base"))],
    ["responsiveLayoutLengthSmCss", value => toLayoutLength(toResponsiveTier(value, "sm"))],
    ["responsiveLayoutLengthMdCss", value => toLayoutLength(toResponsiveTier(value, "md"))],
    ["responsiveLayoutLengthXlCss", value => toLayoutLength(toResponsiveTier(value, "xl"))],
    ["responsiveLayoutLengthXxlCss", value => toLayoutLength(toResponsiveTier(value, "xxl"))],
    ["responsiveThicknessBaseCss", value => toThickness(toResponsiveTier(value, "base"))],
    ["responsiveThicknessSmCss", value => toThickness(toResponsiveTier(value, "sm"))],
    ["responsiveThicknessMdCss", value => toThickness(toResponsiveTier(value, "md"))],
    ["responsiveThicknessXlCss", value => toThickness(toResponsiveTier(value, "xl"))],
    ["responsiveThicknessXxlCss", value => toThickness(toResponsiveTier(value, "xxl"))],
    ["responsivePixelsBaseCss", value => toOptionalPixels(toResponsiveTier(value, "base"))],
    ["responsivePixelsSmCss", value => toOptionalPixels(toResponsiveTier(value, "sm"))],
    ["responsivePixelsMdCss", value => toOptionalPixels(toResponsiveTier(value, "md"))],
    ["responsivePixelsXlCss", value => toOptionalPixels(toResponsiveTier(value, "xl"))],
    ["responsivePixelsXxlCss", value => toOptionalPixels(toResponsiveTier(value, "xxl"))],
    ["visibilityBaseAttribute", value => toVisibilityAttribute(value, "base")],
    ["visibilitySmAttribute", value => toVisibilityAttribute(value, "sm")],
    ["visibilityMdAttribute", value => toVisibilityAttribute(value, "md")],
    ["visibilityXlAttribute", value => toVisibilityAttribute(value, "xl")],
    ["visibilityXxlAttribute", value => toVisibilityAttribute(value, "xxl")],
    ["gridPlacementBaseColumnCss", value => toResponsiveGridPlacementPart(value, "base", "column")],
    ["gridPlacementBaseRowCss", value => toResponsiveGridPlacementPart(value, "base", "row")],
    ["gridPlacementBaseColumnSpanCss", value => toResponsiveGridPlacementPart(value, "base", "columnSpan")],
    ["gridPlacementBaseRowSpanCss", value => toResponsiveGridPlacementPart(value, "base", "rowSpan")],
    ["gridPlacementSmColumnCss", value => toResponsiveGridPlacementPart(value, "sm", "column")],
    ["gridPlacementSmRowCss", value => toResponsiveGridPlacementPart(value, "sm", "row")],
    ["gridPlacementSmColumnSpanCss", value => toResponsiveGridPlacementPart(value, "sm", "columnSpan")],
    ["gridPlacementSmRowSpanCss", value => toResponsiveGridPlacementPart(value, "sm", "rowSpan")],
    ["gridPlacementMdColumnCss", value => toResponsiveGridPlacementPart(value, "md", "column")],
    ["gridPlacementMdRowCss", value => toResponsiveGridPlacementPart(value, "md", "row")],
    ["gridPlacementMdColumnSpanCss", value => toResponsiveGridPlacementPart(value, "md", "columnSpan")],
    ["gridPlacementMdRowSpanCss", value => toResponsiveGridPlacementPart(value, "md", "rowSpan")],
    ["gridPlacementXlColumnCss", value => toResponsiveGridPlacementPart(value, "xl", "column")],
    ["gridPlacementXlRowCss", value => toResponsiveGridPlacementPart(value, "xl", "row")],
    ["gridPlacementXlColumnSpanCss", value => toResponsiveGridPlacementPart(value, "xl", "columnSpan")],
    ["gridPlacementXlRowSpanCss", value => toResponsiveGridPlacementPart(value, "xl", "rowSpan")],
    ["gridPlacementXxlColumnCss", value => toResponsiveGridPlacementPart(value, "xxl", "column")],
    ["gridPlacementXxlRowCss", value => toResponsiveGridPlacementPart(value, "xxl", "row")],
    ["gridPlacementXxlColumnSpanCss", value => toResponsiveGridPlacementPart(value, "xxl", "columnSpan")],
    ["gridPlacementXxlRowSpanCss", value => toResponsiveGridPlacementPart(value, "xxl", "rowSpan")],
    ["imageFitClass", value => `ui-image-fit--${toToken(value, imageFitTokens)}`],
    ["backgroundImageCss", value => toBackgroundImageCss(value)],
    ["imageFitSizeCss", value => toToken(value, imageFitSizeTokens)],
    ["progressVariantClass", value => `ui-progress--${toToken(value, progressVariantTokens)}`],
    ["progressValueText", value => toProgressValue(value)],
    ["searchSelectionModeClass", value => `ui-search-mode--${toToken(value, searchSelectionModeTokens)}`],
    ["textAreaResizeCss", value => toToken(value, textAreaResizeTokens)],
    ["flyoutPlacementClass", value => `ui-flyout--${toToken(value, popupPlacementTokens)}`],
    ["popupPlacementAttribute", value => toToken(value, popupPlacementTokens)]
]);

/** A surface's picture: the address quoted the way an icon's is, or nothing when none is set. */
function toBackgroundImageCss(value: unknown): string {
    const source = String(value ?? "").trim();

    return source.length === 0 ? "" : toCssUrl(source);
}

// Mirrors the NE.Colors palette in one place, so the by-name and by-value lookups below cannot drift apart.
const colorPalette: readonly (readonly [number, string, number, number, number])[] = [
    [0, "IronFog", 120, 120, 120],
    [1, "SilverNight", 100, 120, 140],
    [2, "BronzeDusk", 140, 120, 120],
    [10, "StellarRed", 180, 40, 40],
    [11, "NebulaRose", 240, 80, 120],
    [12, "LunarPink", 240, 140, 180],
    [20, "SolarAmber", 200, 100, 40],
    [21, "NebulaGold", 240, 240, 80],
    [22, "LunarYellow", 240, 240, 160],
    [30, "EclipseOlive", 100, 120, 60],
    [31, "NebulaLime", 160, 180, 80],
    [32, "LunarSage", 200, 220, 160],
    [40, "AuroraGreen", 40, 120, 40],
    [41, "NebulaMint", 100, 160, 100],
    [42, "LunarFern", 140, 180, 140],
    [50, "AstralTeal", 0, 110, 100],
    [51, "NebulaCyan", 40, 180, 180],
    [52, "LunarMoss", 120, 200, 200],
    [60, "QuantumBlue", 40, 80, 160],
    [61, "NebulaAqua", 80, 140, 200],
    [62, "LunarAzure", 160, 180, 220],
    [70, "NovaPurple", 80, 60, 180],
    [71, "NebulaViolet", 160, 100, 200],
    [72, "LunarLavender", 180, 160, 220],
    [80, "Comet", 80, 200, 80],
    [81, "Flare", 220, 80, 80],
    [82, "Ember", 220, 120, 80],
    [83, "Photon", 240, 220, 120],
    [84, "Vortex", 180, 140, 250],
    [85, "Halo", 180, 180, 250]
];

const colorVariants = new Map<string, [number, number, number]>(
    colorPalette.map(([, name, red, green, blue]) => [name, [red, green, blue]])
);

const colorVariantNamesByValue = new Map<number, string>(
    colorPalette.map(([value, name]) => [value, name])
);

// Where a member name means something else in one table than in another: `Hidden` is `hidden` for UIVisibility, `clip` for UIOverflow.
const tokenNameOverrides = new Map<readonly string[], ReadonlyMap<string, string>>([
    [overflowTokens, new Map([["Hidden", "clip"]])]
]);

function toToken(value: unknown, numericTokens?: readonly string[]): string {
    if (typeof value === "string") {
        return (numericTokens === undefined ? undefined : tokenNameOverrides.get(numericTokens)?.get(value))
            ?? enumNames.get(value)
            ?? toKebabCase(value);
    }

    if (typeof value === "number" && numericTokens !== undefined) {
        return numericTokens[value] ?? String(value);
    }

    return String(value ?? "");
}

function toLayoutLength(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "number") {
        return toPixels(value);
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as { kind?: string | number; value?: number };
    const kind = model.kind;
    const lengthValue = model.value ?? 0;

    // Nothing, not "auto": a responsive custom property carrying `auto` wins the var() chain and drops the default.
    if (kind === "Auto" || kind === 0) {
        return "";
    }

    if (kind === "Absolute" || kind === 1) {
        return toPixels(lengthValue);
    }

    if (kind === "Fill" || kind === 2) {
        return "100%";
    }

    return "";
}

function toThickness(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "number") {
        return `${value}px ${value}px ${value}px ${value}px`;
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as { top?: number; right?: number; bottom?: number; left?: number };
    const top = model.top ?? 0;
    const right = model.right ?? 0;
    const bottom = model.bottom ?? 0;
    const left = model.left ?? 0;

    return `${top}px ${right}px ${bottom}px ${left}px`;
}

function toRadius(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "number") {
        return toPixels(value);
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as {
        topLeft?: number;
        topRight?: number;
        bottomRight?: number;
        bottomLeft?: number };
    const topLeft = model.topLeft ?? 0;
    const topRight = model.topRight ?? 0;
    const bottomRight = model.bottomRight ?? 0;
    const bottomLeft = model.bottomLeft ?? 0;

    if (topLeft === topRight && topLeft === bottomRight && topLeft === bottomLeft) {
        return toPixels(topLeft);
    }

    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
}

function toGridUnit(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "number") {
        return value <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${value}fr)`;
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as {
        unit?: string | number;
        value?: number;
        minValue?: number | null;
        maxValue?: number | null };
    const unit = model.unit;
    const unitValue = model.value ?? 1;
    const minValue = model.minValue;
    const maxValue = model.maxValue;

    // Mirrors WebCssValues.GridUnit: a fixed track's bounds and a star's ceiling are the splitter's clamp, not the layout's.
    if (unit === "Absolute" || unit === 1) {
        return toPixels(unitValue);
    }

    if (unit === "Star" || unit === 0) {
        const floor = minValue !== null && minValue !== undefined && minValue > 0 ? `${minValue}px` : "0";

        return unitValue <= 0 ? `minmax(${floor}, 1fr)` : `minmax(${floor}, ${unitValue}fr)`;
    }

    if (unit === "Auto" || unit === 2) {
        if (minValue !== null && minValue !== undefined) {
            return `minmax(${minValue}px, auto)`;
        }

        return maxValue !== null && maxValue !== undefined ? `fit-content(${maxValue}px)` : "auto";
    }

    return "";
}

function toGridTemplate(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (!Array.isArray(value)) {
        return toGridUnit(value);
    }

    if (value.length === 0) {
        return "none";
    }

    if (value.length === 1) {
        return toGridUnit(value[0]);
    }

    const first = JSON.stringify(value[0]);
    const isRepeat = value.every(unit => JSON.stringify(unit) === first);

    if (isRepeat) {
        return `repeat(${value.length}, ${toGridUnit(value[0])})`;
    }

    return value.map(unit => toGridUnit(unit)).join(" ");
}

function toResponsiveGridPlacementPart(value: unknown, tier: "base" | "sm" | "md" | "xl" | "xxl", part: "column" | "row" | "columnSpan" | "rowSpan"): string {
    return toGridPlacementPart(toResponsiveTier(value, tier), part);
}

function toGridPlacementPart(value: unknown, part: "column" | "row" | "columnSpan" | "rowSpan"): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as {
        column?: number;
        row?: number;
        columnSpan?: number;
        rowSpan?: number };

    switch (part) {
        case "column":
            return String(model.column ?? "");
        case "row":
            return String(model.row ?? "");
        case "columnSpan":
            return String(model.columnSpan ?? "");
        case "rowSpan":
            return String(model.rowSpan ?? "");
        default:
            return "";
    }
}

function toSelectionStylePart(value: unknown, part: "background" | "foreground" | "mark" | "markColor" | "bold"): unknown {
    if (value === null || value === undefined || typeof value !== "object")
        return null;

    return (value as Record<string, unknown>)[part] ?? null;
}

// The same weights `WebCssValues.SelectionFontWeight` writes; unset leaves the control its own.
function toSelectionFontWeight(value: unknown): string {
    if (value === null || value === undefined)
        return "";

    return value === true ? "600" : "400";
}

// The same `box-shadow` `WebCssValues.SelectionMark` writes: an inset line two pixels wide on one edge.
function toSelectionMark(value: unknown): string {
    if (value === null || value === undefined)
        return "";

    switch (toToken(value, selectionMarkTokens)) {
        case "left":
            return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
        case "right":
            return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
        case "top":
            return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
        case "bottom":
            return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
        default:
            return "none";
    }
}

function toThemeColor(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (typeof value !== "object") {
        return String(value);
    }

    if (isColorVariantModel(value)) {
        return toColorVariant(value);
    }

    const model = value as { style?: unknown; light?: unknown; dark?: unknown };
    const light = toColorVariant(model.light);
    const dark = toColorVariant(model.dark);
    const effectiveLight = light.length > 0 ? light : dark;
    const effectiveDark = dark.length > 0 ? dark : light;

    if (effectiveLight.length > 0 && effectiveDark.length > 0) {
        return effectiveLight === effectiveDark
            ? effectiveLight
            : `light-dark(${effectiveLight}, ${effectiveDark})`;
    }

    // An explicit light/dark pair wins; a style token resolves to its theme variable so it follows the theme.
    const style = model.style;
    if (style === null || style === undefined) {
        return "";
    }

    const varName = styleVarNames.get(toToken(style, colorTokens));
    return varName ? `var(${varName})` : "";
}

function isStyleOnlyThemeColor(value: unknown): boolean {
    if (value === null || value === undefined || typeof value !== "object" || isColorVariantModel(value))
        return false;

    const model = value as { style?: unknown; light?: unknown; dark?: unknown };

    return model.light == null && model.dark == null && model.style != null;
}

function toThemeColorClass(value: unknown): string {
    if (value === null || value === undefined || typeof value !== "object") {
        return "";
    }

    const model = value as { style?: unknown; light?: unknown; dark?: unknown };

    if (model.light != null || model.dark != null) {
        return "";
    }

    const style = model.style;
    return style == null ? "" : `ui-color--${toToken(style, colorTokens)}`;
}

// Mirrors `BadgeComponentRenderer.BadgeTextFit`: the attribute that says a badge has text also says how much room it wants.
function toBadgeTextFit(value: unknown): string {
    const text = value === null || value === undefined ? "" : String(value).trim();
    return text.length > 0 && text.length <= 2 ? "compact" : "";
}

function toTextAppearanceClass(value: unknown): string {
    if (value === null || value === undefined || typeof value !== "object") {
        return "";
    }

    const model = value as { size?: number | null; role?: unknown };

    if (model.size != null) {
        return "";
    }

    const role = model.role;
    return role == null ? "" : `ui-text-type--${toToken(role, textTypeTokens)}`;
}

function toTextAppearanceField(value: unknown, field: "size" | "weight" | "lineHeight" | "letterSpacing"): string {
    if (value === null || value === undefined || typeof value !== "object") {
        return "";
    }

    const model = value as {
        size?: number | null;
        weight?: number | null;
        lineHeight?: number | null;
        letterSpacing?: number | null };

    if (model.size == null) {
        return "";
    }

    switch (field) {
        case "size":
            return toPixels(model.size);
        case "weight": {
            const weight = model.weight;
            return weight == null ? "" : String(weight);
        }
        case "lineHeight": {
            const lineHeight = model.lineHeight;
            return lineHeight == null ? "" : toPixels(lineHeight);
        }
        case "letterSpacing": {
            const letterSpacing = model.letterSpacing;
            return letterSpacing == null ? "" : toPixels(letterSpacing);
        }
        default:
            return "";
    }
}

/** The canonical text a colour input writes back, in the form `UIThemeColor.TryParse` reads. */
function toThemeColorCanonical(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (typeof value !== "object") {
        return "";
    }

    const model = value as { style?: string | number; light?: unknown; dark?: unknown };

    const style = toColorStyleName(model.style);

    if (style !== null) {
        return `@${style}`;
    }

    const variant = (model.light ?? model.dark) as {
        name?: string | number;
        adjustment?: string | number;
        factor?: number;
        opacity?: number;
        rgb?: number | null } | undefined;

    if (variant === undefined || variant === null) {
        return "";
    }

    if (typeof variant.rgb === "number") {
        const opacity = variant.opacity ?? 255;
        const hex = `#${toHexByte((variant.rgb >> 16) & 0xFF)}${toHexByte((variant.rgb >> 8) & 0xFF)}${toHexByte(variant.rgb & 0xFF)}`;

        return opacity === 255 ? hex : `${hex}${toHexByte(opacity)}`;
    }

    const name = toColorVariantName(variant.name);

    if (name === null) {
        return "";
    }

    return `${name}/${toColorAdjustmentName(variant.adjustment) ?? "None"}/${variant.factor ?? 0}/${variant.opacity ?? 255}`;
}

function isColorVariantModel(value: unknown): boolean {
    if (value === null || typeof value !== "object") {
        return false;
    }

    const model = value as { name?: unknown; rgb?: unknown };
    return model.name !== undefined || model.rgb !== undefined;
}

function toColorVariant(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (typeof value !== "object") {
        return String(value);
    }

    const model = value as {
        name?: string | number;
        adjustment?: string | number;
        factor?: number;
        opacity?: number;
        rgb?: number | null };

    // An explicit colour stands in place of the name and is adjusted exactly like a named one.
    const explicit = typeof model.rgb === "number"
        ? [(model.rgb >> 16) & 0xFF, (model.rgb >> 8) & 0xFF, model.rgb & 0xFF] as [number, number, number]
        : undefined;

    const name = toColorVariantName(model.name);
    const color = explicit ?? (name === null ? undefined : colorVariants.get(name));

    if (!color) {
        return "";
    }

    const adjustment = toColorAdjustmentName(model.adjustment);
    const factor = (model.factor ?? 0) / 10;
    const opacity = model.opacity ?? 255;

    let [red, green, blue] = color;

    if (adjustment === "Shade") {
        red = clampByte(red * (1 - factor));
        green = clampByte(green * (1 - factor));
        blue = clampByte(blue * (1 - factor));
    } else if (adjustment === "Tint") {
        red = clampByte(red + ((255 - red) * factor));
        green = clampByte(green + ((255 - green) * factor));
        blue = clampByte(blue + ((255 - blue) * factor));
    }

    return `#${toHexByte(red)}${toHexByte(green)}${toHexByte(blue)}${toHexByte(opacity)}`;
}

/** A role by the name `UIThemeColor.TryParse` reads, from the number it travels as. */
function toColorStyleName(value: string | number | undefined): string | null {
    if (typeof value === "string") {
        const name = value.trim();
        return name.length === 0 ? null : name;
    }

    if (typeof value !== "number") {
        return null;
    }

    const token = colorTokens[value];

    return token === undefined
        ? null
        : token.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

function toColorVariantName(value: string | number | undefined): string | null {
    if (typeof value === "number") {
        return colorVariantNamesByValue.get(value) ?? null;
    }

    if (typeof value === "string") {
        const name = value.trim();
        return name.length === 0 ? null : name;
    }

    return null;
}

function toColorAdjustmentName(value: string | number | undefined): string {
    if (typeof value === "number") {
        return colorAdjustmentTokens[value] ?? "None";
    }

    if (typeof value === "string") {
        const adjustment = value.trim();
        return adjustment.length === 0 ? "None" : adjustment;
    }

    return "None";
}

function toIconClassName(value: unknown): string {
    const image = readIconSource(value);

    if (image !== null) {
        return image.tinted ? "" : iconImageClassName;
    }

    return toIconGlyphClassName(value);
}

// The reading is the value, never a percentage: a converter is handed one property and cannot see Min and Max.
function toProgressValue(value: unknown): string {
    if (value === null || value === undefined || value === "")
        return "";

    const numberValue = typeof value === "number" ? value : Number(value);

    return Number.isFinite(numberValue) ? String(numberValue) : "";
}

function toPixels(value: unknown): string {
    const numberValue = typeof value === "number"
        ? value
        : Number(value ?? 0);

    return `${numberValue}px`;
}

function toOptionalPixels(value: unknown): string {
    return value === null || value === undefined ? "" : toPixels(value);
}

// Mirrors `WebComponentRendererBase.RenderVisibilityTier`: a tier resolves to its own value or the nearest narrower one set.
function toVisibilityAttribute(value: unknown, tier: ResponsiveTier): string | undefined {
    const resolved = resolveResponsiveTier(value, tier);

    if (resolved === null || resolved === undefined) {
        return undefined;
    }

    const token = toToken(resolved, visibilityTokens);

    return token === "visible" ? undefined : token;
}

function clampByte(value: number): number {
    return Math.min(255, Math.max(0, Math.round(value)));
}

function toHexByte(value: number): string {
    return clampByte(value).toString(16).padStart(2, "0").toUpperCase();
}

