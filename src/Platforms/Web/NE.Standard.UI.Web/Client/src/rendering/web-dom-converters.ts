// Mirrors the C# WebCssValues/WebClassNames helpers value-for-value, over models read by their camel-cased members, as the wire sends them.

// `.ts` on the imports, and types imported as types: `node --test` runs this module and resolves files literally.
import { BadgeColoredClass, ExpanderQuietClass, IconCircleClass, ImageCircleClass, TextAreaGrowClass, TextMaxLinesClass, toKebabCase } from "../addressing/dom-attributes.ts";
import { clampByte, onColorToken, toHexByte } from "./color-bytes.ts";
import {
    enumNames, isBackgroundImageBlurred, isTiered, toBackgroundImageCss, toBackgroundImageDimCss, toBadgeTitleFit, toBorderEdge,
    toCount, toDayTokens, toFiniteNumber, toGridPlacementPart, toGridTemplate, toGridTrackLimits, toGridUnit,
    toItemsQueryAttribute, toLayoutLength, toOptionalPixels, toPadding, toPixels, toPositiveCount, toProgressValue,
    toRadius, toResponsiveFixedColumns, toResponsiveGridTemplate, toResponsiveSize, toSelectedKeysAttribute, toSelectionFontWeight, toSelectionMark,
    toSelectionStylePart, toSize, toTabMenuTokens, toTextAppearanceClass, toTextAppearanceField, toThickness,
    toThicknessSum, toUniqueSelectedKeysAttribute, toWindowAggregatesAttribute
} from "./converter-values.ts";
import { isIconClassName, toIconClassName, toIconSourceCss } from "./icon-value.ts";
import { inlineMarkupToPlainText } from "./inline-markup.ts";
import type { ResponsiveTier } from "./responsive-tier.ts";
import { currentResponsiveTier, resolveResponsiveTier, responsiveTiers, toResponsiveTier } from "./responsive-tier.ts";
import { toSafeImageSource, toSafeLink } from "./url-safety.ts";

export { writeBadgeCount, writeBadgeWords } from "./converter-values.ts";

export type WebDomConverter = (value: unknown) => string | undefined;

/** The converter naming something by words read as inline markup: their plain text (`WebDomConverters.InlineMarkupPlainText`). */
export const InlineMarkupPlainTextConverter = "inlineMarkupPlainText";

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
    "overlay",
    "mark"
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
    ["muted", "--ui-text-muted"],
    ["selected", "--ui-color-selected"],
    ["focus-ring", "--ui-color-focus-ring"],
    ["border", "--ui-color-border"],
    ["shadow", "--ui-color-shadow"],
    ["overlay", "--ui-color-overlay"],
    ["mark", "--ui-color-mark"]
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
    ["danger", "--ui-color-on-danger"],
    // Muted's ground is the muted text colour, which the surface reads on.
    ["muted", "--ui-color-surface"]
]);

const badgePlacementTokens = ["inline", "trailing"];
const borderEdgeTokens = ["none", "left", "top", "right", "bottom"];
const inputAppearanceTokens = ["filled", "outline", "underline", "ghost"];
const buttonSizeTokens = ["small", "medium", "large"];
const inputSizeTokens = ["small", "medium", "large"];
const buttonTokens = ["primary", "accent", "danger", "outline", "ghost", "link", "surface"];

/** A button's variant class from a `UIButtonVariant` name or number, defaulting to the Surface variant. */
export function toButtonVariantClass(value: unknown): string {
    const token = toToken(value, buttonTokens);

    return `ui-button--${buttonTokens.includes(token) ? token : "surface"}`;
}
const badgeVariantTokens = ["primary", "accent", "info", "warning", "success", "danger", "surface", "plain"];
const badgeFillTokens = ["filled", "tinted", "outline"];
const themeTokens = ["light", "dark"];
const loadingStyleTokens = ["ring", "dots"];
const alignmentTokens = ["start", "center", "end", "stretch"];
const overflowTokens = ["clip", "visible"];
const visibilityTokens = ["visible", "hidden", "collapsed"];
const surfaceStyleTokens = ["background", "surface", "tinted"];
const orientationTokens = ["horizontal", "vertical"];
const groupSeparatorTokens = ["none", "gap", "rule"];
const selectionModeTokens = ["none", "one", "many"];
const selectionMarkTokens = ["none", "left", "right", "top", "bottom"];
const itemsViewLayoutTokens = ["stack", "wrap"];
const dragHandlePlacementTokens = ["end", "start"];
const scrollTokens = ["disabled", "auto", "always"];
const scrollSnapTokens = ["disabled", "proximity", "mandatory"];
const textInputTypeTokens = ["text", "email", "password", "search", "tel", "url"];
const inputModeTokens = ["text", "numeric", "decimal", "tel", "email", "url", "search"];
const colorTextFormatTokens = ["hex", "rgb"];
const imageFitTokens = ["fill", "contain", "cover", "none"];
const imageFitSizeTokens = ["100% 100%", "contain", "cover", "auto"];
const imageShapeTokens = ["default", "circle"];
const expanderVariantTokens = ["card", "quiet"];
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

/** Whether a class is one a class converter can write. */
export type ClassFamily = (className: string) => boolean;

// Every class each class converter can write, declared with it below: the class operation's first write clears the member the server
// painted, which it never wrote itself.
const classFamilies = new Map<string, ClassFamily>();

/** The family of classes a converter writes, for the class operation's first write; none for a converter that writes no class. */
export function getClassFamily(converterName: string): ClassFamily | undefined {
    return classFamilies.get(converterName);
}

/** A class converter writing `prefix` and a token of `tokens`, whose family is exactly those classes. */
function tokenClass(name: string, prefix: string, tokens: readonly string[]): [string, WebDomConverter] {
    return familyClass(name, toTokenClassFamily(prefix, tokens), value => `${prefix}${toToken(value, tokens)}`);
}

/**
 * A token class of a layout value that may differ by breakpoint (TierClassRenderer): the class of the width the window has now, which
 * tier-class.ts keeps as the width changes; a bare value is its own at every width, with no tier read.
 */
function tierTokenClass(name: string, prefix: string, tokens: readonly string[]): [string, WebDomConverter] {
    return familyClass(name, toTokenClassFamily(prefix, tokens), value => `${prefix}${toToken(isTiered(value) ? resolveResponsiveTier(value, currentResponsiveTier()) : value, tokens)}`);
}

/** Every tier's token class narrowest first, as the family's attribute lists them, or nothing (no attribute) where the tiers agree. */
function tierClassList(name: string, prefix: string, tokens: readonly string[]): [string, WebDomConverter] {
    return [name, value => {
        const classes = responsiveTiers.map(tier => `${prefix}${toToken(resolveResponsiveTier(value, tier), tokens)}`);

        return classes.every(className => className === classes[0]) ? undefined : classes.join(" ");
    }];
}

function toTokenClassFamily(prefix: string, tokens: readonly string[]): ClassFamily {
    return toClassFamily(tokens.map(token => `${prefix}${token}`));
}

// An exact set, never a prefix: `ui-button--` is shared by a button's kind and its size, which are two properties on one element.
function toClassFamily(classNames: readonly string[]): ClassFamily {
    const members = new Set(classNames);

    return className => members.has(className);
}

function familyClass(name: string, family: ClassFamily, convert: WebDomConverter): [string, WebDomConverter] {
    classFamilies.set(name, family);

    return [name, convert];
}

/** One converter per breakpoint tier, named `{prefix}{Tier}{suffix}` as `WebResponsiveConverters` names them on the server. */
function tierConverters(prefix: string, suffix: string, convert: (value: unknown, tier: ResponsiveTier) => string | undefined): [string, WebDomConverter][] {
    return responsiveTiers.map(tier => [`${prefix}${tier[0].toUpperCase()}${tier.slice(1)}${suffix}`, value => convert(value, tier)]);
}

export const webDomConverters = new Map<string, WebDomConverter>([
    tokenClass("colorClass", "ui-color--", colorTokens),
    familyClass("themeColorClass", toTokenClassFamily("ui-color--", colorTokens), value => toThemeColorClass(value)),
    familyClass("iconClass", isIconClassName, value => toIconClassName(value)),
    ["iconUrlCss", value => toIconSourceCss(value)],
    ["safeUrl", value => toSafeLink(value)],
    ["safeImageSource", value => toSafeImageSource(value)],
    // Nothing stays nothing, so the attribute it writes is removed rather than emptied.
    [InlineMarkupPlainTextConverter, value => {
        if (value === null || value === undefined)
            return undefined;

        const plain = inlineMarkupToPlainText(String(value));

        return plain.trim().length === 0 ? undefined : plain;
    }],
    // A two-state ARIA attribute the first paint writes for no value too: anything but true is "false".
    ["ariaBooleanAttribute", value => value === true ? "true" : "false"],
    // One blank where there is none, so `:placeholder-shown` still says the field is empty (TextInputComponentRenderer).
    ["placeholderText", value => typeof value === "string" && value.length > 0 ? value : " "],
    ["emptyText", value => value === null || value === undefined ? "" : String(value)],
    ["nonEmptyText", value => typeof value === "string" && value.length > 0 ? value : undefined],
    ["nonBlankText", value => typeof value === "string" && value.trim().length > 0 ? value : undefined],
    ["trimmedText", value => typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined],
    ["drawnIcon", value => typeof value === "string" && toIconClassName(value).length > 0 ? value : undefined],
    ["finiteNumber", value => toFiniteNumber(value, () => true)?.toString()],
    tierTokenClass("iconSizeClass", "ui-icon-size--", iconSizeTokens),
    tierClassList("iconSizeTierClasses", "ui-icon-size--", iconSizeTokens),
    // The same size as the attribute a component root carries for its own glyph (data-ui-icon-size), which a glyph edge reads.
    ["iconSizeAttribute", value => toToken(value, iconSizeTokens)],
    familyClass("iconShapeClass", toClassFamily([IconCircleClass]), value => toToken(value, iconShapeTokens) === "circle" ? IconCircleClass : ""),
    tokenClass("textTypeClass", "ui-text-type--", textTypeTokens),
    familyClass("textAppearanceClass", toTokenClassFamily("ui-text-type--", textTypeTokens), value => toTextAppearanceClass(value, "ui-text-type--", role => toToken(role, textTypeTokens))),
    // The description's role again on its text body, as TextAppearanceRenderer writes it: nothing for a sized description.
    familyClass("textDescriptionTypeClass", toTokenClassFamily("ui-text--description-", textTypeTokens), value => toTextAppearanceClass(value, "ui-text--description-", role => toToken(role, textTypeTokens))),
    tokenClass("textAlignmentClass", "ui-text--align-", textAlignmentTokens),
    tokenClass("textWrapClass", "ui-text--", textWrapTokens),
    tokenClass("buttonAlignmentClass", "ui-button--align-", textAlignmentTokens),
    tokenClass("textBadgePlacementHostClass", "ui-text--badge-", badgePlacementTokens),
    tokenClass("badgeVariantClass", "ui-badge-variant--", badgeVariantTokens),
    tokenClass("badgeFillClass", "ui-badge-fill--", badgeFillTokens),
    // Mirrors BadgeRenderer: coloured only by a colour that draws, never by one with no variable of its own (default, muted).
    familyClass("badgeColoredClass", toClassFamily([BadgeColoredClass]), value => toThemeColor(value).length > 0 ? BadgeColoredClass : ""),
    ["badgeTitleFit", value => toBadgeTitleFit(value)],
    tokenClass("buttonVariantClass", "ui-button--", buttonTokens),
    tokenClass("surfaceStyleClass", "ui-surface--", surfaceStyleTokens),
    tierTokenClass("orientationClass", "ui-orientation--", orientationTokens),
    tierClassList("orientationTierClasses", "ui-orientation--", orientationTokens),
    tokenClass("groupSeparatorClass", "ui-command-bar--separator-", groupSeparatorTokens),
    ["selectionModeAttribute", value => toToken(value, selectionModeTokens)],
    ["selectionBackgroundCss", value => toThemeColor(toSelectionStylePart(value, "background"))],
    ["selectionForegroundCss", value => toThemeColor(toSelectionStylePart(value, "foreground"))],
    ["selectionMarkColorCss", value => toThemeColor(toSelectionStylePart(value, "markColor"))],
    ["selectionMarkCss", value => {
        const mark = toSelectionStylePart(value, "mark");

        return mark === null || mark === undefined ? "" : toSelectionMark(toToken(mark, selectionMarkTokens));
    }],
    ["selectionFontWeightCss", value => toSelectionFontWeight(toSelectionStylePart(value, "bold"))],
    ["selectionActionBarBackgroundCss", value => toThemeColor(toSelectionStylePart(value, "actionBarBackground"))],
    tierTokenClass("itemsViewLayoutClass", "ui-items-view--", itemsViewLayoutTokens),
    tierClassList("itemsViewLayoutTierClasses", "ui-items-view--", itemsViewLayoutTokens),
    tokenClass("dragHandlePlacementClass", "ui-drag-handle--", dragHandlePlacementTokens),
    tokenClass("scrollXClass", "ui-scroll-x--", scrollTokens),
    tokenClass("scrollYClass", "ui-scroll-y--", scrollTokens),
    ["hostViewport", value => value === null || value === undefined || toToken(value, scrollTokens) === "disabled" ? undefined : "parent"],
    tokenClass("scrollSnapClass", "ui-scroll-snap--", scrollSnapTokens),
    tokenClass("inputAppearanceClass", "ui-input--", inputAppearanceTokens),
    tierTokenClass("inputSizeClass", "ui-input--", inputSizeTokens),
    tierClassList("inputSizeTierClasses", "ui-input--", inputSizeTokens),
    tierTokenClass("buttonSizeClass", "ui-button--", buttonSizeTokens),
    tierClassList("buttonSizeTierClasses", "ui-button--", buttonSizeTokens),
    tierTokenClass("buttonGroupSizeClass", "ui-button-group--", buttonSizeTokens),
    tierClassList("buttonGroupSizeTierClasses", "ui-button-group--", buttonSizeTokens),
    ["textInputTypeAttribute", value => toToken(value, textInputTypeTokens)],
    ["inputModeAttribute", value => toToken(value, inputModeTokens)],
    ["colorTextFormatAttribute", value => toToken(value, colorTextFormatTokens)],
    ["themeNameCss", value => toToken(value, themeTokens)],
    ["loadingStyleAttribute", value => toToken(value, loadingStyleTokens)],
    ["alignmentCss", value => toToken(value, alignmentTokens)],
    ["overflowCss", value => toToken(value, overflowTokens)],
    ["layoutLengthCss", value => toLayoutLength(value)],
    ["thicknessCss", value => toThickness(value)],
    familyClass("borderEdgeClass", toTokenClassFamily("ui-border--", borderEdgeTokens), value => {
        const edge = toBorderEdge(value);

        return edge === undefined ? "" : `ui-border--${edge}`;
    }),
    ["radiusCss", value => toRadius(value)],
    ["gridUnitCss", value => toGridUnit(value)],
    ["pixelsCss", value => toPixels(value)],
    ["gridTemplateCss", value => toGridTemplate(value)],
    ["colorVariantCss", value => toColorVariant(value)],
    ["themeColorCss", value => toThemeColor(value)],
    ["themeInkCss", value => toThemeInk(value)],
    ["roleInkCss", value => toRoleInk(value)],
    ["themeOnColorCss", value => toThemeOnColor(value)],
    ["themeGroundCss", value => toThemeGround(value)],
    // Mirrors ThemeColorRenderer: a style colour is a class (an ink), so it writes no inline colour that would override the class.
    ["themeColorInlineCss", value => isStyleOnlyThemeColor(value) ? "" : toThemeColor(value)],
    ["themeColorCanonical", value => toThemeColorCanonical(value)],
    ["textAppearanceFontSizeCss", value => toTextAppearanceField(value, "size")],
    ["textAppearanceFontWeightCss", value => toTextAppearanceField(value, "weight")],
    ["textAppearanceLineHeightCss", value => toTextAppearanceField(value, "lineHeight")],
    ["textAppearanceLetterSpacingCss", value => toTextAppearanceField(value, "letterSpacing")],
    ...tierConverters("responsiveLayoutLength", "Css", (value, tier) => toLayoutLength(toResponsiveTier(value, tier))),
    ...tierConverters("responsiveWidth", "Css", (value, tier) => toResponsiveSize(value, tier, "horizontal")),
    ...tierConverters("responsiveHeight", "Css", (value, tier) => toResponsiveSize(value, tier, "vertical")),
    ...tierConverters("responsiveWidthBound", "Css", (value, tier) => toSize(toResponsiveTier(value, tier), "horizontal")),
    ...tierConverters("responsiveHeightBound", "Css", (value, tier) => toSize(toResponsiveTier(value, tier), "vertical")),
    ...tierConverters("responsiveThickness", "Css", (value, tier) => toThickness(toResponsiveTier(value, tier))),
    ...tierConverters("responsivePadding", "Css", (value, tier) => toPadding(toResponsiveTier(value, tier))),
    ...tierConverters("responsiveThicknessHorizontal", "Css", (value, tier) => toThicknessSum(toResponsiveTier(value, tier), "horizontal")),
    ...tierConverters("responsiveThicknessVertical", "Css", (value, tier) => toThicknessSum(toResponsiveTier(value, tier), "vertical")),
    ...tierConverters("responsiveRadius", "Css", (value, tier) => toRadius(toResponsiveTier(value, tier))),
    ...tierConverters("responsivePixels", "Css", (value, tier) => toOptionalPixels(toResponsiveTier(value, tier))),
    ...tierConverters("responsiveAlignment", "Css", (value, tier) => toOptionalToken(toResponsiveTier(value, tier), alignmentTokens)),
    ...tierConverters("visibility", "Attribute", (value, tier) => toVisibilityAttribute(value, tier)),
    ...tierConverters("gridPlacement", "ColumnCss", (value, tier) => toGridPlacementPart(toResponsiveTier(value, tier), "column")),
    ...tierConverters("gridPlacement", "RowCss", (value, tier) => toGridPlacementPart(toResponsiveTier(value, tier), "row")),
    ...tierConverters("gridPlacement", "ColumnSpanCss", (value, tier) => toGridPlacementPart(toResponsiveTier(value, tier), "columnSpan")),
    ...tierConverters("gridPlacement", "RowSpanCss", (value, tier) => toGridPlacementPart(toResponsiveTier(value, tier), "rowSpan")),
    ...tierConverters("responsiveGridTemplate", "Css", (value, tier) => toResponsiveGridTemplate(value, tier)),
    ...tierConverters("responsiveFixedColumns", "Css", (value, tier) => toResponsiveFixedColumns(value, tier)),
    ["gridTrackLimitsAttribute", value => toGridTrackLimits(value)],
    tokenClass("imageFitClass", "ui-image-fit--", imageFitTokens),
    familyClass("expanderVariantClass", toClassFamily([ExpanderQuietClass]), value => toToken(value, expanderVariantTokens) === "quiet" ? ExpanderQuietClass : ""),
    familyClass("imageShapeClass", toClassFamily([ImageCircleClass]), value => toToken(value, imageShapeTokens) === "circle" ? ImageCircleClass : ""),
    ["backgroundImageCss", value => toBackgroundImageCss(value)],
    ["backgroundImageAttribute", value => toBackgroundImageCss(value).length === 0 ? undefined : ""],
    ["imageFitSizeCss", value => toToken(value, imageFitSizeTokens)],
    ["backgroundImageDimCss", value => toBackgroundImageDimCss(value)],
    ["backgroundImageDimModeAttribute", value => toToken(value, backgroundDimModeTokens) === "vignette" ? "vignette" : undefined],
    ["backgroundImageBlurCss", value => isBackgroundImageBlurred(value) ? `${Number(value)}px` : ""],
    ["backgroundImageBlurAttribute", value => isBackgroundImageBlurred(value) ? "" : undefined],
    ["positiveCount", value => toPositiveCount(value)?.toString()],
    ["nonNegativeCount", value => toCount(value, count => count >= 0)?.toString()],
    ["nonZeroCount", value => toCount(value, count => count !== 0)?.toString()],
    ["positiveNumber", value => toFiniteNumber(value, number => number > 0)?.toString()],
    ["nonNegativeNumber", value => toFiniteNumber(value, number => number >= 0)?.toString()],
    ["share", value => toFiniteNumber(value, number => number >= 0 && number <= 1)?.toString()],
    ["positiveFlagAttribute", value => toPositiveCount(value) === undefined ? undefined : ""],
    familyClass("maxLinesClass", toClassFamily([TextMaxLinesClass]), value => toPositiveCount(value) === undefined ? "" : TextMaxLinesClass),
    familyClass("textAreaGrowClass", toClassFamily([TextAreaGrowClass]), value => toPositiveCount(value) === undefined ? "" : TextAreaGrowClass),
    tokenClass("progressVariantClass", "ui-progress--", progressVariantTokens),
    ["progressValueText", value => toProgressValue(value)],
    ["textAreaResizeCss", value => toToken(value, textAreaResizeTokens)],
    tokenClass("flyoutPlacementClass", "ui-flyout--", popupPlacementTokens),
    ["popupPlacementAttribute", value => toToken(value, popupPlacementTokens)],
    ["selectPlacementAttribute", value => toPopupPlacementWithoutDefault(value, "bottom-start")],
    ["splitPlacementAttribute", value => toPopupPlacementWithoutDefault(value, "bottom-end")],
    ["selectedKeysAttribute", value => toSelectedKeysAttribute(value)],
    ["uniqueSelectedKeysAttribute", value => toUniqueSelectedKeysAttribute(value)],
    ["itemsQueryAttribute", value => toItemsQueryAttribute(value)],
    ["windowAggregatesAttribute", value => toWindowAggregatesAttribute(value)],
    ["tabMenuEntriesAttribute", value => toTabMenuTokens(value)],
    ["markedDaysAttribute", value => toDayTokens(value)]
]);

/** The Surface word an element's class names, or null: what `menu-surface.ts` marks the popup a menu fills with. */
export function surfaceStyleWord(element: Element): string | null {
    const toClass = webDomConverters.get("surfaceStyleClass");

    return surfaceStyleTokens.find((_, index) => element.classList.contains(toClass?.(index) ?? "")) ?? null;
}

// Mirrors the NE.Colors palette in one place, so the by-name and by-value lookups below cannot drift apart.
const colorPalette: readonly (readonly [number, string, number, number, number])[] = [
    [0, "IronFog", 120, 120, 120],
    [1, "SilverNight", 100, 120, 140],
    [2, "BronzeDusk", 140, 120, 120],
    [10, "StellarRed", 180, 40, 40],
    [11, "NebulaRose", 240, 80, 120],
    [12, "LunarPink", 240, 140, 180],
    [13, "PulsarMagenta", 200, 60, 160],
    [20, "SolarAmber", 200, 100, 40],
    [21, "NebulaLemon", 240, 240, 80],
    [22, "LunarYellow", 240, 240, 160],
    [23, "SolarGold", 230, 180, 30],
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
    [overflowTokens, new Map([["Hidden", "clip"]])],
    [imageFitSizeTokens, new Map([["Fill", "100% 100%"], ["None", "auto"]])]
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

function toPopupPlacementWithoutDefault(value: unknown, defaultToken: string): string | undefined {
    const token = toToken(value, popupPlacementTokens);

    return token === defaultToken ? undefined : token;
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

// Mirrors WebCssValues.RoleInk: a theme colour's words are its ink; a raw colour's are the stylesheet's (`.ui-raw-ink()`), so none inline.
function toRoleInk(value: unknown): string {
    if (value === null || value === undefined || typeof value !== "object" || isColorVariantModel(value))
        return "";

    const model = value as { light?: unknown; dark?: unknown };

    return model.light == null && model.dark == null ? toThemeInk(value) : "";
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
        if (isClear(value)) {
            return "initial";
        }

        const light = toVariantOnColor(value, 255);
        const dark = toVariantOnColor(value, 0);
        return light === dark ? light : `light-dark(${light}, ${dark})`;
    }

    const model = value as { style?: unknown; light?: unknown; dark?: unknown };
    const light = toVariantOnColor(model.light ?? model.dark, 255);
    const dark = toVariantOnColor(model.dark ?? model.light, 0);

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

// Mirrors WebCssValues.ThemeGround: the ground a surface of this colour names, `inherit` for one of no opacity, which is no ground,
// so the one around it shows through rather than a surface style naming the transparent fill.
function toThemeGround(value: unknown): string {
    if (value !== null && typeof value === "object") {
        const model = value as { light?: unknown; dark?: unknown };
        const clear = isColorVariantModel(value) ? isClear(value) : isClear(model.light ?? model.dark) && isClear(model.dark ?? model.light);

        if (clear) {
            return "inherit";
        }
    }

    return toThemeColor(value);
}

function isClear(value: unknown): boolean {
    return toColorVariantBytes(value)?.[3] === 0;
}

function toVariantOnColor(value: unknown, ground = 255): string {
    const bytes = toColorVariantBytes(value);
    return bytes === undefined ? "" : onColorToken(bytes[0], bytes[1], bytes[2], bytes[3], ground);
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
        rgb?: number | null
    } | undefined;

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
        rgb?: number | null
    };

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

/** A tier's own token, or nothing — the property taken off — where the tier is unset. */
function toOptionalToken(value: unknown, tokens: readonly string[]): string {
    return value === null || value === undefined ? "" : toToken(value, tokens);
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
