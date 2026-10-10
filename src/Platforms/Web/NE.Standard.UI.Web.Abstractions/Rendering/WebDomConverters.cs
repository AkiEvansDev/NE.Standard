namespace NE.Standard.UI.Web.Abstractions.Rendering;

public static class WebDomConverters
{
    public const string ColorClass = "colorClass";
    public const string ThemeColorClass = "themeColorClass";

    /// <summary>
    /// A theme colour as the canonical text <c>UIThemeColor.TryParse</c> reads.
    /// </summary>
    public const string ThemeColorCanonical = "themeColorCanonical";
    public const string IconSizeClass = "iconSizeClass";

    /// <summary>A picture icon's shape as its modifier: <c>ui-icon--circle</c>, or nothing for the default.</summary>
    public const string IconShapeClass = "iconShapeClass";
    public const string TextTypeClass = "textTypeClass";
    public const string TextAppearanceClass = "textAppearanceClass";
    public const string TextAlignmentClass = "textAlignmentClass";
    public const string TextWrapClass = "textWrapClass";

    /// <summary>A button's label alignment as the button's own modifier (<c>ui-button--align-start</c>), which places its label box.</summary>
    public const string ButtonAlignmentClass = "buttonAlignmentClass";

    /// <summary>A badge's placement as its text body's modifier (<c>ui-text--badge-trailing</c>), which the body's layout rules read.</summary>
    public const string TextBadgePlacementHostClass = "textBadgePlacementHostClass";

    /// <summary>A description's role as its text body's modifier (<c>ui-text--description-body</c>); nothing for a sized description.</summary>
    public const string TextDescriptionTypeClass = "textDescriptionTypeClass";
    public const string BadgeStyleClass = "badgeStyleClass";
    public const string BadgeFillClass = "badgeFillClass";

    /// <summary>A badge's <c>ui-badge--colored</c> while its colour draws one (<c>WebCssValues.ThemeColor</c> is not empty); otherwise none.</summary>
    public const string BadgeColoredClass = "badgeColoredClass";

    /// <summary>
    /// How much room a badge's text needs: <c>compact</c> for a count, nothing for a word.
    /// </summary>
    public const string BadgeTextFit = "badgeTextFit";
    public const string ButtonClass = "buttonClass";
    public const string SurfaceStyleClass = "surfaceStyleClass";
    public const string OrientationClass = "orientationClass";
    public const string GroupSeparatorClass = "groupSeparatorClass";
    public const string ItemsViewLayoutClass = "itemsViewLayoutClass";

    /// <summary>Where a row's grip stands, as the root's modifier: <c>ui-drag-handle--start</c> or <c>--end</c>.</summary>
    public const string DragHandlePlacementClass = "dragHandlePlacementClass";
    public const string ScrollXClass = "scrollXClass";
    public const string ScrollYClass = "scrollYClass";
    /// <summary>A horizontal scroll mode as the host's viewport: <c>parent</c> when the mode scrolls, nothing when it is disabled.</summary>
    public const string HostViewport = "hostViewport";
    public const string ScrollSnapClass = "scrollSnapClass";
    public const string ButtonSizeClass = "buttonSizeClass";
    public const string ButtonGroupSizeClass = "buttonGroupSizeClass";
    public const string InputAppearanceClass = "inputAppearanceClass";
    public const string InputSizeClass = "inputSizeClass";
    public const string TextInputTypeAttribute = "textInputTypeAttribute";

    /// <summary>A field's on-screen keyboard as its <c>inputmode</c> token; nothing takes the attribute off.</summary>
    public const string InputModeAttribute = "inputModeAttribute";
    public const string ColorTextFormatAttribute = "colorTextFormatAttribute";
    public const string ColorInputVariantAttribute = "colorInputVariantAttribute";

    public const string ThemeNameCss = "themeNameCss";
    public const string AlignmentCss = "alignmentCss";
    public const string AlignmentStretchFallbackCss = "alignmentStretchFallbackCss";
    public const string OverflowCss = "overflowCss";
    public const string LayoutLengthCss = "layoutLengthCss";
    public const string ThicknessCss = "thicknessCss";

    /// <summary>A border thickness as <c>WebClassNames.BorderNone</c>: the class when every side of every tier is nothing, else none.</summary>
    public const string BorderNoneClass = "borderNoneClass";
    public const string RadiusCss = "radiusCss";
    public const string GridUnitCss = "gridUnitCss";
    public const string PixelsCss = "pixelsCss";
    public const string GridTemplateCss = "gridTemplateCss";
    public const string ColorVariantCss = "colorVariantCss";
    public const string ThemeColorCss = "themeColorCss";
    /// <summary>A foreground colour as inline CSS — only for a variant; a style colour is a class, so the class rule (an ink) is not overridden.</summary>
    public const string ThemeColorInlineCss = "themeColorInlineCss";

    /// <summary>A colour spent on words as inline CSS: a semantic role as its ink (<c>WebCssValues.ThemeInk</c>), anything else as itself.</summary>
    public const string ThemeInkCss = "themeInkCss";

    /// <summary>A theme colour spent on words as inline CSS (<c>WebCssValues.RoleInk</c>); nothing for a raw colour, which the stylesheet shades.</summary>
    public const string RoleInkCss = "roleInkCss";

    /// <summary>
    /// The text colour that reads on a filled ground of this colour (<c>WebCssValues.ThemeOnColor</c>); <c>initial</c> for the page's
    /// own grounds; nothing where there is none.
    /// </summary>
    public const string ThemeOnColorCss = "themeOnColorCss";
    public const string SelectionModeAttribute = "selectionModeAttribute";

    /// <summary>The parts of a <c>UISelectionStyle</c>, one custom property each.</summary>
    public const string SelectionBackgroundCss = "selectionBackgroundCss";
    public const string SelectionForegroundCss = "selectionForegroundCss";
    public const string SelectionMarkColorCss = "selectionMarkColorCss";
    public const string SelectionMarkCss = "selectionMarkCss";

    public const string SelectionFontWeightCss = "selectionFontWeightCss";
    public const string SelectionActionBarBackgroundCss = "selectionActionBarBackgroundCss";
    public const string TextAppearanceFontSizeCss = "textAppearanceFontSizeCss";
    public const string TextAppearanceFontWeightCss = "textAppearanceFontWeightCss";
    public const string TextAppearanceLineHeightCss = "textAppearanceLineHeightCss";
    public const string TextAppearanceLetterSpacingCss = "textAppearanceLetterSpacingCss";
    public const string IconClass = "iconClass";
    public const string IconUrlCss = "iconUrlCss";

    /// <summary>Writes a bound value as a link target only when <c>WebUrlSafety.IsSafeLink</c> allows it.</summary>
    public const string SafeUrl = "safeUrl";

    /// <summary>Writes a bound value as an image source only when <c>WebUrlSafety.IsSafeImageSource</c> allows it.</summary>
    public const string SafeImageSource = "safeImageSource";
    public const string ImageFitClass = "imageFitClass";

    /// <summary>An image's shape as its modifier: <c>ui-image--circle</c>, or nothing for the default.</summary>
    public const string ImageShapeClass = "imageShapeClass";
    public const string BackgroundImageCss = "backgroundImageCss";

    /// <summary>Present, and empty, while a background picture is one the page may load; otherwise removed.</summary>
    public const string BackgroundImageAttribute = "backgroundImageAttribute";
    public const string ImageFitSizeCss = "imageFitSizeCss";

    /// <summary>A background picture's dim as <c>WebCssValues.BackgroundImageDim</c> writes it: a share held to 0–1.</summary>
    public const string BackgroundImageDimCss = "backgroundImageDimCss";

    /// <summary><c>vignette</c> for a dim at the edges alone; the even default removes the attribute.</summary>
    public const string BackgroundImageDimModeAttribute = "backgroundImageDimModeAttribute";

    /// <summary>A background picture's blur as <c>WebCssValues.BackgroundImageBlur</c> writes it; none removes the property.</summary>
    public const string BackgroundImageBlurCss = "backgroundImageBlurCss";

    /// <summary>Present, and empty, while a background picture's blur draws anything; otherwise removed.</summary>
    public const string BackgroundImageBlurAttribute = "backgroundImageBlurAttribute";

    /// <summary>A count of rows or lines as its text while it is above zero, as the first paint writes it; otherwise nothing.</summary>
    public const string PositiveCount = "positiveCount";

    /// <summary>A whole number as its text while it is zero or more (a pause in milliseconds); otherwise nothing.</summary>
    public const string NonNegativeCount = "nonNegativeCount";

    /// <summary>A whole number as its text unless it is zero (a stacking order); otherwise nothing.</summary>
    public const string NonZeroCount = "nonZeroCount";

    /// <summary>A number as its text while it is above zero (a step); otherwise nothing.</summary>
    public const string PositiveNumber = "positiveNumber";

    /// <summary>A number as its text while it is zero or more (an indent); otherwise nothing.</summary>
    public const string NonNegativeNumber = "nonNegativeNumber";

    /// <summary>Present, and empty, while a count is above zero; otherwise removed.</summary>
    public const string PositiveFlagAttribute = "positiveFlagAttribute";

    /// <summary>A paragraph's <c>ui-text--max-lines</c> while its <c>MaxLines</c> is above zero; otherwise none.</summary>
    public const string MaxLinesClass = "maxLinesClass";
    public const string ProgressVariantClass = "progressVariantClass";
    public const string ProgressValueText = "progressValueText";

    /// <summary>Inline markup as the plain text a reader sees — for an attribute that repeats a tooltip's words (<c>aria-label</c>).</summary>
    public const string InlineMarkupPlainText = "inlineMarkupPlainText";

    /// <summary><c>true</c> for true and <c>false</c> for anything else, null included: for an attribute operation that converts null.</summary>
    public const string AriaBooleanAttribute = "ariaBooleanAttribute";

    /// <summary>A field's placeholder, or one blank for none so <c>:placeholder-shown</c> still says the field is empty; converts null.</summary>
    public const string PlaceholderText = "placeholderText";
    public const string TextAreaResizeCss = "textAreaResizeCss";
    public const string FlyoutPlacementClass = "flyoutPlacementClass";

    public const string PopupPlacementAttribute = "popupPlacementAttribute";

    /// <summary>A tab menu's chosen entries as the tokens <c>WebClassNames.TabMenuEntries</c> writes; none removes the attribute.</summary>
    public const string TabMenuEntriesAttribute = "tabMenuEntriesAttribute";

    /// <summary>A set of days as the space-separated <c>yyyy-MM-dd</c> tokens <c>WebTemporalFormat.Days</c> writes; none removes the attribute.</summary>
    public const string MarkedDaysAttribute = "markedDaysAttribute";

    /// <summary>A length tier (<c>WebCssValues.ResponsiveLayoutLength</c>): nothing for <c>Auto</c>, so the stylesheet's default applies.</summary>
    public static readonly WebResponsiveConverters ResponsiveLayoutLengthCss = new("responsiveLayoutLength", "Css");

    /// <summary>A component's width tier (<c>WebCssValues.ResponsiveSize</c>): <c>Fill</c> less its margins across.</summary>
    public static readonly WebResponsiveConverters ResponsiveWidthCss = new("responsiveWidth", "Css");

    /// <summary>A component's height tier (<c>WebCssValues.ResponsiveSize</c>): <c>Fill</c> less its margins down.</summary>
    public static readonly WebResponsiveConverters ResponsiveHeightCss = new("responsiveHeight", "Css");

    /// <summary>A thickness tier (<c>WebCssValues.Thickness</c>): a padding's, a margin's or a border's at that breakpoint.</summary>
    public static readonly WebResponsiveConverters ResponsiveThicknessCss = new("responsiveThickness", "Css");

    /// <summary>A margin tier's left and right summed (<c>WebCssValues.ThicknessSum</c>), what a <c>Fill</c> width leaves out.</summary>
    public static readonly WebResponsiveConverters ResponsiveThicknessHorizontalCss = new("responsiveThicknessHorizontal", "Css");

    /// <summary>A margin tier's top and bottom summed (<c>WebCssValues.ThicknessSum</c>), what a <c>Fill</c> height leaves out.</summary>
    public static readonly WebResponsiveConverters ResponsiveThicknessVerticalCss = new("responsiveThicknessVertical", "Css");

    /// <summary>A corner radius tier (<c>WebCssValues.Radius</c>): a border's or a picture's rounding at that breakpoint.</summary>
    public static readonly WebResponsiveConverters ResponsiveRadiusCss = new("responsiveRadius", "Css");

    /// <summary>A pixel tier (<c>WebCssValues.Pixels</c>): a spacing at that breakpoint.</summary>
    public static readonly WebResponsiveConverters ResponsivePixelsCss = new("responsivePixels", "Css");

    /// <summary>A placement tier's parts, one custom property each (<c>WebResponsiveCss.PlacementColumnVariable</c> and its siblings).</summary>
    public static readonly WebResponsiveConverters GridPlacementColumnCss = new("gridPlacement", "ColumnCss");
    public static readonly WebResponsiveConverters GridPlacementRowCss = new("gridPlacement", "RowCss");
    public static readonly WebResponsiveConverters GridPlacementColumnSpanCss = new("gridPlacement", "ColumnSpanCss");
    public static readonly WebResponsiveConverters GridPlacementRowSpanCss = new("gridPlacement", "RowSpanCss");

    /// <summary>A visibility tier as its attribute: the value in force there, resolved through the narrower tiers; none for visible.</summary>
    public static readonly WebResponsiveConverters VisibilityAttribute = new("visibility", "Attribute");
}
