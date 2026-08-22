// Mirrors the C# WebCssValues/WebClassNames helpers value-for-value: a property rendered server-side and the
// same property live-patched here must produce identical output. WebDomConvertersSyncTests pins the names.
//
// Every model below is read by its camel-cased member only. This file used to read `model.foo ?? model.Foo`
// throughout, against a PascalCase payload that neither channel ever sends; WebWireJson now sets the naming
// policy on both rather than inheriting it from two separate defaults, and WebWireJsonTests pins it.

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
const inputAppearanceTokens = ["filled", "underline"];
const buttonTokens = ["primary", "accent", "danger", "outline", "ghost", "link"];
const badgeTypeTokens = ["primary", "accent", "info", "warning", "success", "danger", "surface"];
const themeTokens = ["light", "dark", "auto"];
const alignmentTokens = ["start", "center", "end", "stretch"];
const overflowTokens = ["hidden", "visible"];
const orientationTokens = ["horizontal", "vertical"];
const itemsViewLayoutTokens = ["stack", "wrap"];
const scrollTokens = ["disabled", "auto", "always"];
const scrollSnapTokens = ["disabled", "proximity", "mandatory"];
const skeletonVariantTokens = ["text", "card", "circle"];
const textInputTypeTokens = ["text", "email", "password", "search", "tel", "url"];
const imageFitTokens = ["default", "fill", "contain", "cover", "none"];
const progressVariantTokens = ["linear", "circular"];
const searchSelectionModeTokens = ["keep", "replace"];
const textAreaResizeTokens = ["none", "vertical", "horizontal", "both"];
const flyoutPlacementTokens = [
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
    ["iconSizeClass", value => `ui-icon-size--${toToken(value, iconSizeTokens)}`],
    ["textTypeClass", value => `ui-text-type--${toToken(value, textTypeTokens)}`],
    ["textAppearanceClass", value => toTextAppearanceClass(value)],
    ["textAlignmentClass", value => `ui-text--align-${toToken(value, textAlignmentTokens)}`],
    ["textWrapClass", value => `ui-text--${toToken(value, textWrapTokens)}`],
    ["textBadgePlacementClass", value => `ui-text__badge--${toToken(value, badgePlacementTokens)}`],
    ["buttonContentBadgePlacementClass", value => `ui-button-content__badge--${toToken(value, badgePlacementTokens)}`],
    ["buttonContentTextAlignmentClass", value => `ui-button-content--align-${toToken(value, textAlignmentTokens)}`],
    ["badgeStyleClass", value => `ui-badge-style--${toToken(value, badgeTypeTokens)}`],
    ["buttonClass", value => `ui-button--${toToken(value, buttonTokens)}`],
    ["orientationClass", value => `ui-orientation--${toToken(value, orientationTokens)}`],
    ["itemsViewLayoutClass", value => `ui-items-view--${toToken(value, itemsViewLayoutTokens)}`],
    ["scrollXClass", value => `ui-scroll-x--${toToken(value, scrollTokens)}`],
    ["scrollYClass", value => `ui-scroll-y--${toToken(value, scrollTokens)}`],
    ["scrollSnapClass", value => `ui-scroll-snap--${toToken(value, scrollSnapTokens)}`],
    ["skeletonVariantClass", value => `ui-preview-${toToken(value, skeletonVariantTokens)}`],
    ["inputAppearanceClass", value => `ui-input--${toToken(value, inputAppearanceTokens)}`],
    ["inputBadgePlacementClass", value => `ui-input__badge--${toToken(value, badgePlacementTokens)}`],
    ["textInputTypeAttribute", value => toToken(value, textInputTypeTokens)],
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
    ["visibleHiddenBaseAttribute", value => toHiddenAttribute(value, "base")],
    ["visibleHiddenSmAttribute", value => toHiddenAttribute(value, "sm")],
    ["visibleHiddenMdAttribute", value => toHiddenAttribute(value, "md")],
    ["visibleHiddenXlAttribute", value => toHiddenAttribute(value, "xl")],
    ["visibleHiddenXxlAttribute", value => toHiddenAttribute(value, "xxl")],
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
    ["progressVariantClass", value => `ui-progress--${toToken(value, progressVariantTokens)}`],
    ["progressPercentText", value => `${toProgressPercent(value)}%`],
    ["searchSelectionModeClass", value => `ui-search-mode--${toToken(value, searchSelectionModeTokens)}`],
    ["textAreaResizeCss", value => toToken(value, textAreaResizeTokens)],
    ["flyoutPlacementClass", value => `ui-flyout--${toToken(value, flyoutPlacementTokens)}`]
]);

// Mirrors the NE.Colors package — ColorName (declared value) and ColorVariant's RGB table — in one place, so
// the by-name and by-value lookups below cannot drift apart. ColorPaletteSyncTests pins it against it.
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

function toToken(value: unknown, numericTokens?: readonly string[]): string {
    if (typeof value === "string") {
        return enumNames.get(value) ?? toKebabCase(value);
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

    if (kind === "Auto" || kind === 0) {
        return "auto";
    }

    if (kind === "Absolute" || kind === 1) {
        return toPixels(lengthValue);
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
        minValue?: number | null };
    const unit = model.unit;
    const unitValue = model.value ?? 1;
    const minValue = model.minValue;

    if (unit === "Absolute" || unit === 1) {
        return toPixels(unitValue);
    }

    if (unit === "Star" || unit === 0) {
        return toGridUnit(unitValue);
    }

    if (unit === "Auto" || unit === 2) {
        return minValue !== null && minValue !== undefined ? `minmax(${minValue}px, auto)` : "auto";
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

    // An explicit light/dark pair wins; a style token is the fallback, resolved to its theme variable so it
    // follows the active theme instead of being frozen at patch time.
    const style = model.style;
    if (style === null || style === undefined) {
        return "";
    }

    const varName = styleVarNames.get(toToken(style, colorTokens));
    return varName ? `var(${varName})` : "";
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

function isColorVariantModel(value: unknown): boolean {
    if (value === null || typeof value !== "object") {
        return false;
    }

    const model = value as { name?: unknown };
    return model.name !== undefined;
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
        opacity?: number };

    const name = toColorVariantName(model.name);
    const color = name === null ? undefined : colorVariants.get(name);

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
    const icon = String(value ?? "").trim();

    if (icon.length === 0) {
        return "";
    }

    let result = "ui-icon-glyph--";

    for (const character of icon) {
        if (isAsciiLetterOrDigit(character)) {
            result += character.toLowerCase();
            continue;
        }

        if (character === "-" || character === "_" || character === "." || character === " ") {
            if (!result.endsWith("-")) {
                result += "-";
            }
        }
    }

    return result.length === "ui-icon-glyph--".length ? "" : result;
}

function isAsciiLetterOrDigit(value: string): boolean {
    const code = value.charCodeAt(0);

    return (code >= 48 && code <= 57)
        || (code >= 65 && code <= 90)
        || (code >= 97 && code <= 122);
}

function toProgressPercent(value: unknown): number {
    const numberValue = typeof value === "number" ? value : Number(value ?? 0);

    return Math.round(Math.min(100, Math.max(0, numberValue)));
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

function toResponsiveTier(value: unknown, tier: "base" | "sm" | "md" | "xl" | "xxl"): unknown {
    if (value === null || value === undefined) {
        return undefined;
    }

    const model = typeof value === "object" ? value as Record<string, unknown> : undefined;

    if (model === undefined || !("base" in model || "Base" in model)) {
        return tier === "base" ? value : undefined;
    }

    const pascalTier = tier.charAt(0).toUpperCase() + tier.slice(1);

    return model[tier] ?? model[pascalTier];
}

function toHiddenAttribute(value: unknown, tier: "base" | "sm" | "md" | "xl" | "xxl"): string | undefined {
    return toResponsiveTier(value, tier) === false ? "" : undefined;
}

function clampByte(value: number): number {
    return Math.min(255, Math.max(0, Math.round(value)));
}

function toHexByte(value: number): string {
    return clampByte(value).toString(16).padStart(2, "0").toUpperCase();
}

function toKebabCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/_/g, "-")
        .toLowerCase();
}
