// Mirrors the C# WebCssValues/WebClassNames helpers value-for-value, over models read by their camel-cased members, as the wire sends them.

// `.ts` on the imports, and types imported as types: `node --test` runs this module and resolves files literally.
import { BadgeSetAttribute, BadgeTextAttribute, toKebabCase } from "../addressing/dom-attributes.ts";
import type { ResponsiveTier } from "./responsive-tier.ts";
import { resolveResponsiveTier, toResponsiveTier } from "./responsive-tier.ts";
import { toIconClassName, toIconSourceCss } from "./icon-value.ts";
import { clampByte, onColorToken, toHexByte } from "./color-bytes.ts";
import { toSafeImageSource, toSafeLink } from "./url-safety.ts";
import { inlineMarkupToPlainText } from "./inline-markup.ts";

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
const iconShapeTokens = ["default", "circle"];
const textTypeTokens = ["display", "title", "subtitle", "body", "caption", "overline"];
const textAlignmentTokens = ["start", "center", "end", "justify"];
const textWrapTokens = ["nowrap", "wrap"];
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

// The roles with an ink of their own for words; the rest are grounds, edges or already text colours.
const inkVarNames = new Map<string, string>([
    ["primary", "--ui-color-primary-ink"],
    ["accent", "--ui-color-accent-ink"],
    ["info", "--ui-color-info-ink"],
    ["warning", "--ui-color-warning-ink"],
    ["success", "--ui-color-success-ink"],
    ["danger", "--ui-color-danger-ink"]
]);

// The roles text is meant to stand on, each with the text colour that reads on it.
const onColorVarNames = new Map<string, string>([
    ["primary", "--ui-color-on-primary"],
    ["accent", "--ui-color-on-accent"],
    ["info", "--ui-color-on-info"],
    ["warning", "--ui-color-on-warning"],
    ["success", "--ui-color-on-success"],
    ["danger", "--ui-color-on-danger"]
]);

const badgePlacementTokens = ["inline", "trailing"];
const inputAppearanceTokens = ["filled", "outline", "underline", "ghost"];
const buttonSizeTokens = ["small", "medium", "large"];
const inputSizeTokens = ["small", "medium", "large"];
const buttonTokens = ["primary", "accent", "danger", "outline", "ghost", "link", "surface"];
const badgeTypeTokens = ["primary", "accent", "info", "warning", "success", "danger", "surface", "plain"];
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
const dragHandlePlacementTokens = ["end", "start"];
const scrollTokens = ["disabled", "auto", "always"];
const scrollSnapTokens = ["disabled", "proximity", "mandatory"];
const textInputTypeTokens = ["text", "email", "password", "search", "tel", "url"];
const colorTextFormatTokens = ["hex", "rgb"];
const colorInputVariantTokens = ["field", "swatch"];
const imageFitTokens = ["fill", "contain", "cover", "none"];
const imageFitSizeTokens = ["100% 100%", "contain", "cover", "auto"];
const imageShapeTokens = ["default", "circle"];
const backgroundDimModeTokens = ["uniform", "vignette"];
const progressVariantTokens = ["linear", "circular"];
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
    // Nothing stays nothing, so the attribute it writes is removed rather than emptied.
    ["inlineMarkupPlainText", value => value === null || value === undefined ? undefined : inlineMarkupToPlainText(String(value))],
    ["iconSizeClass", value => `ui-icon-size--${toToken(value, iconSizeTokens)}`],
    ["iconShapeClass", value => toToken(value, iconShapeTokens) === "circle" ? "ui-icon--circle" : ""],
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
    ["dragHandlePlacementClass", value => `ui-drag-handle--${toToken(value, dragHandlePlacementTokens)}`],
    ["scrollXClass", value => `ui-scroll-x--${toToken(value, scrollTokens)}`],
    ["scrollYClass", value => `ui-scroll-y--${toToken(value, scrollTokens)}`],
    ["hostViewport", value => toHostViewport(value)],
    ["scrollSnapClass", value => `ui-scroll-snap--${toToken(value, scrollSnapTokens)}`],
    ["inputAppearanceClass", value => `ui-input--${toToken(value, inputAppearanceTokens)}`],
    ["searchFieldAppearanceClass", value => `ui-search__field--${toToken(value, inputAppearanceTokens)}`],
    ["inputSizeClass", value => `ui-input--${toToken(value, inputSizeTokens)}`],
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
    ["borderNoneClass", value => toBorderNoneClass(value)],
    ["radiusCss", value => toRadius(value)],
    ["gridUnitCss", value => toGridUnit(value)],
    ["pixelsCss", value => toPixels(value)],
    ["gridTemplateCss", value => toGridTemplate(value)],
    ["colorVariantCss", value => toColorVariant(value)],
    ["themeColorCss", value => toThemeColor(value)],
    ["themeInkCss", value => toThemeInk(value)],
    ["themeOnColorCss", value => toThemeOnColor(value)],
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
    ["responsiveWidthBaseCss", value => toSize(toResponsiveTier(value, "base"), "horizontal")],
    ["responsiveWidthSmCss", value => toSize(toResponsiveTier(value, "sm"), "horizontal")],
    ["responsiveWidthMdCss", value => toSize(toResponsiveTier(value, "md"), "horizontal")],
    ["responsiveWidthXlCss", value => toSize(toResponsiveTier(value, "xl"), "horizontal")],
    ["responsiveWidthXxlCss", value => toSize(toResponsiveTier(value, "xxl"), "horizontal")],
    ["responsiveHeightBaseCss", value => toSize(toResponsiveTier(value, "base"), "vertical")],
    ["responsiveHeightSmCss", value => toSize(toResponsiveTier(value, "sm"), "vertical")],
    ["responsiveHeightMdCss", value => toSize(toResponsiveTier(value, "md"), "vertical")],
    ["responsiveHeightXlCss", value => toSize(toResponsiveTier(value, "xl"), "vertical")],
    ["responsiveHeightXxlCss", value => toSize(toResponsiveTier(value, "xxl"), "vertical")],
    ["responsiveThicknessBaseCss", value => toThickness(toResponsiveTier(value, "base"))],
    ["responsiveThicknessSmCss", value => toThickness(toResponsiveTier(value, "sm"))],
    ["responsiveThicknessMdCss", value => toThickness(toResponsiveTier(value, "md"))],
    ["responsiveThicknessXlCss", value => toThickness(toResponsiveTier(value, "xl"))],
    ["responsiveThicknessXxlCss", value => toThickness(toResponsiveTier(value, "xxl"))],
    ["responsiveThicknessHorizontalBaseCss", value => toThicknessSum(toResponsiveTier(value, "base"), "horizontal")],
    ["responsiveThicknessHorizontalSmCss", value => toThicknessSum(toResponsiveTier(value, "sm"), "horizontal")],
    ["responsiveThicknessHorizontalMdCss", value => toThicknessSum(toResponsiveTier(value, "md"), "horizontal")],
    ["responsiveThicknessHorizontalXlCss", value => toThicknessSum(toResponsiveTier(value, "xl"), "horizontal")],
    ["responsiveThicknessHorizontalXxlCss", value => toThicknessSum(toResponsiveTier(value, "xxl"), "horizontal")],
    ["responsiveThicknessVerticalBaseCss", value => toThicknessSum(toResponsiveTier(value, "base"), "vertical")],
    ["responsiveThicknessVerticalSmCss", value => toThicknessSum(toResponsiveTier(value, "sm"), "vertical")],
    ["responsiveThicknessVerticalMdCss", value => toThicknessSum(toResponsiveTier(value, "md"), "vertical")],
    ["responsiveThicknessVerticalXlCss", value => toThicknessSum(toResponsiveTier(value, "xl"), "vertical")],
    ["responsiveThicknessVerticalXxlCss", value => toThicknessSum(toResponsiveTier(value, "xxl"), "vertical")],
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
    ["imageShapeClass", value => toToken(value, imageShapeTokens) === "circle" ? "ui-image--circle" : ""],
    ["backgroundImageCss", value => toBackgroundImageCss(value)],
    ["backgroundImageAttribute", value => toBackgroundImageCss(value).length === 0 ? undefined : ""],
    ["imageFitSizeCss", value => toToken(value, imageFitSizeTokens)],
    ["backgroundImageDimCss", value => toBackgroundImageDimCss(value)],
    ["backgroundImageDimModeAttribute", value => toToken(value, backgroundDimModeTokens) === "vignette" ? "vignette" : undefined],
    ["backgroundImageBlurCss", value => isBackgroundImageBlurred(value) ? `${Number(value)}px` : ""],
    ["backgroundImageBlurAttribute", value => isBackgroundImageBlurred(value) ? "" : undefined],
    ["positiveCount", value => toPositiveCount(value)?.toString()],
    ["positiveFlagAttribute", value => toPositiveCount(value) === undefined ? undefined : ""],
    ["maxLinesClass", value => toPositiveCount(value) === undefined ? "" : "ui-text--max-lines"],
    ["progressVariantClass", value => `ui-progress--${toToken(value, progressVariantTokens)}`],
    ["progressValueText", value => toProgressValue(value)],
    ["textAreaResizeCss", value => toToken(value, textAreaResizeTokens)],
    ["flyoutPlacementClass", value => `ui-flyout--${toToken(value, popupPlacementTokens)}`],
    ["popupPlacementAttribute", value => toToken(value, popupPlacementTokens)],
    ["tabMenuEntriesAttribute", value => toTabMenuTokens(value)],
    ["markedDaysAttribute", value => toDayTokens(value)]
]);

// UITabMenuEntries by token and flag bit, in the order WebClassNames.TabMenuEntries writes them.
const tabMenuTokens: readonly (readonly [string, number])[] = [["rename", 1], ["pin", 2], ["close", 4], ["delete", 8]];

/** A tab menu's chosen entries as space-separated tokens, from the flags' names ("Rename, Pin") or their number; none is no attribute. */
function toTabMenuTokens(value: unknown): string | undefined {
    const names = typeof value === "string" ? value.split(",").map(name => name.trim().toLowerCase()) : null;
    const bits = typeof value === "number" ? value : 0;
    const tokens = tabMenuTokens.filter(([token, bit]) => names === null ? (bits & bit) !== 0 : names.includes(token)).map(([token]) => token);

    return tokens.length === 0 ? undefined : tokens.join(" ");
}

/** A set of days as `WebTemporalFormat.Days` writes it: each day's `yyyy-MM-dd`, in order, space-separated; none is no attribute. */
function toDayTokens(value: unknown): string | undefined {
    const days = Array.isArray(value) ? value.filter((day): day is string => typeof day === "string" && day.length > 0).map(day => day.slice(0, 10)) : [];

    return days.length === 0 ? undefined : [...new Set(days)].sort().join(" ");
}

/**
 * A surface's picture as `SurfaceStyleRenderer` reads it at first paint (`WebIconValue.TryReadImage`): the address quoted the way an
 * icon's is, or nothing when none is set or no picture may be fetched from it, so a push is held to the check the first paint is.
 */
function toBackgroundImageCss(value: unknown): string {
    return toIconSourceCss(value);
}

/** A surface's picture's dim as `WebCssValues.BackgroundImageDim` writes it: held to 0–1, nothing for a value that is not a number. */
function toBackgroundImageDimCss(value: unknown): string {
    const dim = typeof value === "number" ? value : Number(value ?? Number.NaN);

    return Number.isNaN(dim) ? "" : String(Math.min(1, Math.max(0, dim)));
}

/** A count of rows or lines a pushed value names, as the first paint takes it: a whole number above zero, else none. */
function toPositiveCount(value: unknown): number | undefined {
    const count = typeof value === "number" ? value : Number(value ?? Number.NaN);

    return Number.isInteger(count) && count > 0 ? count : undefined;
}

/** Whether a surface's picture's blur draws anything, as `WebCssValues.IsBackgroundImageBlurred` judges it: finite and above zero. */
function isBackgroundImageBlurred(value: unknown): boolean {
    const blur = typeof value === "number" ? value : Number(value ?? Number.NaN);

    return Number.isFinite(blur) && blur > 0;
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

/** A horizontal scroll mode as the host's viewport: the parent scrolls for a host that scrolls sideways, nobody for one that does not. */
function toHostViewport(value: unknown): string | undefined {
    return value === null || value === undefined || toToken(value, scrollTokens) === "disabled" ? undefined : "parent";
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

// Mirrors WebCssValues.ResponsiveSize: a component's own Fill is the parent's room less its margins on that axis (core/runtime.less).
function toSize(value: unknown, axis: "horizontal" | "vertical"): string {
    if (value === null || typeof value !== "object") {
        return toLayoutLength(value);
    }

    const kind = (value as { kind?: string | number }).kind;

    if (kind !== "Fill" && kind !== 2) {
        return toLayoutLength(value);
    }

    return axis === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
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

// Mirrors WebCssValues.ThicknessSum: a margin's two sides along an axis, the room a Fill size leaves out.
function toThicknessSum(value: unknown, axis: "horizontal" | "vertical"): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "number") {
        return toPixels(value * 2);
    }

    if (typeof value !== "object") {
        return "";
    }

    const model = value as { top?: number; right?: number; bottom?: number; left?: number };

    return axis === "horizontal" ? toPixels((model.left ?? 0) + (model.right ?? 0)) : toPixels((model.top ?? 0) + (model.bottom ?? 0));
}

// Mirrors WebClassNames.BorderNone: a thickness of nothing on every side says the component draws no edge of its own.
function toBorderNoneClass(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "number") {
        return value === 0 ? "ui-border--none" : "";
    }

    if (typeof value !== "object") {
        return "";
    }

    const model = value as { top?: number; right?: number; bottom?: number; left?: number };

    return (model.top ?? 0) === 0 && (model.right ?? 0) === 0 && (model.bottom ?? 0) === 0 && (model.left ?? 0) === 0
        ? "ui-border--none"
        : "";
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
            return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
        case "right":
            return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
        case "top":
            return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
        case "bottom":
            return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
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

// Mirrors WebCssValues.ThemeInk: a semantic role spent on words is its ink, which reads on the page where the raw role may not.
function toThemeInk(value: unknown): string {
    if (isStyleOnlyThemeColor(value)) {
        const varName = inkVarNames.get(toToken((value as { style: unknown }).style, colorTokens));

        if (varName !== undefined) {
            return `var(${varName})`;
        }
    }

    return toThemeColor(value);
}

// The page's own grounds: no filled ground, so they take back the page's ink from one around them rather than name an on-colour.
const pageGroundTokens = new Set(["background", "surface"]);

// Mirrors WebCssValues.ThemeOnColor: the text colour that reads on a filled ground of this colour, `initial` on the page's own
// grounds, empty where no text is meant to stand.
function toThemeOnColor(value: unknown): string {
    if (value === null || value === undefined || typeof value !== "object") {
        return "";
    }

    if (isColorVariantModel(value)) {
        return isClear(value) ? "initial" : toVariantOnColor(value);
    }

    const model = value as { style?: unknown; light?: unknown; dark?: unknown };
    const light = toVariantOnColor(model.light ?? model.dark);
    const dark = toVariantOnColor(model.dark ?? model.light);

    // A colour of no opacity is no ground at all (`UIThemeColor.Transparent`): it takes back the page's ink, as the page's grounds do.
    if (light.length > 0 && dark.length > 0 && isClear(model.light ?? model.dark) && isClear(model.dark ?? model.light)) {
        return "initial";
    }

    if (light.length > 0 && dark.length > 0) {
        return light === dark ? light : `light-dark(${light}, ${dark})`;
    }

    if (model.style === null || model.style === undefined) {
        return "";
    }

    const token = toToken(model.style, colorTokens);

    if (pageGroundTokens.has(token)) {
        return "initial";
    }

    const varName = onColorVarNames.get(token);
    return varName ? `var(${varName})` : "";
}

function isClear(value: unknown): boolean {
    return toColorVariantBytes(value)?.[3] === 0;
}

function toVariantOnColor(value: unknown): string {
    const bytes = toColorVariantBytes(value);
    return bytes === undefined ? "" : onColorToken(bytes[0], bytes[1], bytes[2], bytes[3]);
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

// Mirrors `BadgeRenderer.BadgeTextFit`, both held to eng/Tests/Shared/badge-fit-corpus.json: the attribute that says a badge has text
// also says how much room it wants. Two cells fit a circle: a narrow character is one, an East Asian wide one or an emoji two.
function toBadgeTextFit(value: unknown): string {
    const text = value === null || value === undefined ? "" : String(value).trim();
    const cells = countCells(text, CompactCells + 1);

    return cells > 0 && cells <= CompactCells ? "compact" : "";
}

const CompactCells = 2;

// Below the combining marks every character is one cell on its own, so the common badge (a count, a word) needs no segmenting.
const SegmentedText = /[\u0300-\uFFFF]/;

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** The cells a text takes, counted per character as the reader sees one, stopping at `limit`. */
function countCells(text: string, limit: number): number {
    if (!SegmentedText.test(text))
        return text.length;

    let cells = 0;

    for (const { segment } of graphemes.segment(text)) {
        if (cells >= limit)
            break;

        cells += isWide(segment) ? 2 : 1;
    }

    return cells;
}

/** Whether a character the reader sees as one is drawn two cells wide: East Asian wide or full-width, or an emoji. */
function isWide(character: string): boolean {
    // The emoji presentation selector makes a symbol a picture, whatever its own width.
    if (character.includes("\uFE0F"))
        return true;

    const first = character.codePointAt(0) ?? 0;

    for (let i = 0; i < WideRanges.length; i += 2) {
        if (first >= WideRanges[i] && first <= WideRanges[i + 1])
            return true;
    }

    return false;
}

// East Asian Wide and Fullwidth (UAX #11) with the emoji drawn as pictures by default, as start/end pairs; the same table as the server's.
const WideRanges: readonly number[] = [
    0x1100, 0x115F, 0x231A, 0x231B, 0x2329, 0x232A, 0x23E9, 0x23EC, 0x23F0, 0x23F0, 0x23F3, 0x23F3,
    0x25FD, 0x25FE, 0x2614, 0x2615, 0x2648, 0x2653, 0x267F, 0x267F, 0x2693, 0x2693, 0x26A1, 0x26A1,
    0x26AA, 0x26AB, 0x26BD, 0x26BE, 0x26C4, 0x26C5, 0x26CE, 0x26CE, 0x26D4, 0x26D4, 0x26EA, 0x26EA,
    0x26F2, 0x26F3, 0x26F5, 0x26F5, 0x26FA, 0x26FA, 0x26FD, 0x26FD, 0x2705, 0x2705, 0x270A, 0x270B,
    0x2728, 0x2728, 0x274C, 0x274C, 0x274E, 0x274E, 0x2753, 0x2755, 0x2757, 0x2757, 0x2795, 0x2797,
    0x27B0, 0x27B0, 0x27BF, 0x27BF, 0x2B1B, 0x2B1C, 0x2B50, 0x2B50, 0x2B55, 0x2B55, 0x2E80, 0x303E,
    0x3041, 0x33FF, 0x3400, 0x4DBF, 0x4E00, 0x9FFF, 0xA000, 0xA4CF, 0xA960, 0xA97F, 0xAC00, 0xD7A3,
    0xF900, 0xFAFF, 0xFE10, 0xFE19, 0xFE30, 0xFE6F, 0xFF00, 0xFF60, 0xFFE0, 0xFFE6, 0x1B000, 0x1B2FF,
    0x1F004, 0x1F004, 0x1F0CF, 0x1F0CF, 0x1F18E, 0x1F18E, 0x1F191, 0x1F19A, 0x1F1E6, 0x1F202, 0x1F210, 0x1F23B,
    0x1F240, 0x1F248, 0x1F250, 0x1F251, 0x1F260, 0x1F265, 0x1F300, 0x1F64F, 0x1F680, 0x1F6FF, 0x1F7E0, 0x1F7EB,
    0x1F90C, 0x1F9FF, 0x1FA70, 0x1FAFF, 0x20000, 0x2FFFD, 0x30000, 0x3FFFD
];

/** Writes a count the page computed into a badge a renderer drew: its text, and the fit the renderer's own patch would write. */
export function writeBadgeCount(badge: Element, count: number): void {
    const text = String(count);
    const words = badge.querySelector(".ui-badge__text");

    if (words !== null)
        words.textContent = text;

    badge.setAttribute(BadgeTextAttribute, toBadgeTextFit(text));
    badge.setAttribute(BadgeSetAttribute, "");
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

    const bytes = toColorVariantBytes(value);

    return bytes === undefined
        ? ""
        : `#${toHexByte(bytes[0])}${toHexByte(bytes[1])}${toHexByte(bytes[2])}${toHexByte(bytes[3])}`;
}

/** A wire-shaped colour variant as its red, green, blue and opacity bytes, adjusted; nothing for what names no colour. */
function toColorVariantBytes(value: unknown): [number, number, number, number] | undefined {
    if (value === null || value === undefined || typeof value !== "object") {
        return undefined;
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
        return undefined;
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

    return [red, green, blue, opacity];
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
