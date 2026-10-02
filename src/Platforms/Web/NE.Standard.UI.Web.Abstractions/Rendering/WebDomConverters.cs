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
    public const string TextBadgePlacementClass = "textBadgePlacementClass";
    public const string BadgeStyleClass = "badgeStyleClass";

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

    /// <summary>A search field's appearance as its <c>ui-search__field--*</c> modifier.</summary>
    public const string SearchFieldAppearanceClass = "searchFieldAppearanceClass";
    public const string InputSizeClass = "inputSizeClass";
    public const string TextInputTypeAttribute = "textInputTypeAttribute";
    public const string ColorTextFormatAttribute = "colorTextFormatAttribute";
    public const string ColorInputVariantAttribute = "colorInputVariantAttribute";

    public const string ThemeNameCss = "themeNameCss";
    public const string AlignmentCss = "alignmentCss";
    public const string AlignmentStretchFallbackCss = "alignmentStretchFallbackCss";
    public const string OverflowCss = "overflowCss";
    public const string LayoutLengthCss = "layoutLengthCss";
    public const string ThicknessCss = "thicknessCss";

    /// <summary>A border thickness as <c>WebClassNames.BorderNone</c>: the class when every side is nothing, else none.</summary>
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

    /// <summary>Present, and empty, while a count is above zero; otherwise removed.</summary>
    public const string PositiveFlagAttribute = "positiveFlagAttribute";

    /// <summary>A paragraph's <c>ui-text--max-lines</c> while its <c>MaxLines</c> is above zero; otherwise none.</summary>
    public const string MaxLinesClass = "maxLinesClass";
    public const string ProgressVariantClass = "progressVariantClass";
    public const string ProgressValueText = "progressValueText";

    /// <summary>Inline markup as the plain text a reader sees — for an attribute that repeats a tooltip's words (<c>aria-label</c>).</summary>
    public const string InlineMarkupPlainText = "inlineMarkupPlainText";
    public const string TextAreaResizeCss = "textAreaResizeCss";
    public const string FlyoutPlacementClass = "flyoutPlacementClass";

    public const string PopupPlacementAttribute = "popupPlacementAttribute";

    /// <summary>A tab menu's chosen entries as the tokens <c>WebClassNames.TabMenuEntries</c> writes; none removes the attribute.</summary>
    public const string TabMenuEntriesAttribute = "tabMenuEntriesAttribute";

    /// <summary>A set of days as the space-separated <c>yyyy-MM-dd</c> tokens <c>WebTemporalFormat.Days</c> writes; none removes the attribute.</summary>
    public const string MarkedDaysAttribute = "markedDaysAttribute";

    public const string ResponsiveLayoutLengthBaseCss = "responsiveLayoutLengthBaseCss";
    public const string ResponsiveLayoutLengthSmCss = "responsiveLayoutLengthSmCss";
    public const string ResponsiveLayoutLengthMdCss = "responsiveLayoutLengthMdCss";
    public const string ResponsiveLayoutLengthXlCss = "responsiveLayoutLengthXlCss";
    public const string ResponsiveLayoutLengthXxlCss = "responsiveLayoutLengthXxlCss";

    /// <summary>A component's width tier (<c>WebCssValues.ResponsiveSize</c>): <c>Fill</c> less its margins across.</summary>
    public const string ResponsiveWidthBaseCss = "responsiveWidthBaseCss";
    public const string ResponsiveWidthSmCss = "responsiveWidthSmCss";
    public const string ResponsiveWidthMdCss = "responsiveWidthMdCss";
    public const string ResponsiveWidthXlCss = "responsiveWidthXlCss";
    public const string ResponsiveWidthXxlCss = "responsiveWidthXxlCss";

    /// <summary>A component's height tier (<c>WebCssValues.ResponsiveSize</c>): <c>Fill</c> less its margins down.</summary>
    public const string ResponsiveHeightBaseCss = "responsiveHeightBaseCss";
    public const string ResponsiveHeightSmCss = "responsiveHeightSmCss";
    public const string ResponsiveHeightMdCss = "responsiveHeightMdCss";
    public const string ResponsiveHeightXlCss = "responsiveHeightXlCss";
    public const string ResponsiveHeightXxlCss = "responsiveHeightXxlCss";

    public const string ResponsiveThicknessBaseCss = "responsiveThicknessBaseCss";
    public const string ResponsiveThicknessSmCss = "responsiveThicknessSmCss";
    public const string ResponsiveThicknessMdCss = "responsiveThicknessMdCss";
    public const string ResponsiveThicknessXlCss = "responsiveThicknessXlCss";
    public const string ResponsiveThicknessXxlCss = "responsiveThicknessXxlCss";

    /// <summary>A margin tier's left and right summed (<c>WebCssValues.ThicknessSum</c>), what a <c>Fill</c> width leaves out.</summary>
    public const string ResponsiveThicknessHorizontalBaseCss = "responsiveThicknessHorizontalBaseCss";
    public const string ResponsiveThicknessHorizontalSmCss = "responsiveThicknessHorizontalSmCss";
    public const string ResponsiveThicknessHorizontalMdCss = "responsiveThicknessHorizontalMdCss";
    public const string ResponsiveThicknessHorizontalXlCss = "responsiveThicknessHorizontalXlCss";
    public const string ResponsiveThicknessHorizontalXxlCss = "responsiveThicknessHorizontalXxlCss";

    /// <summary>A margin tier's top and bottom summed (<c>WebCssValues.ThicknessSum</c>), what a <c>Fill</c> height leaves out.</summary>
    public const string ResponsiveThicknessVerticalBaseCss = "responsiveThicknessVerticalBaseCss";
    public const string ResponsiveThicknessVerticalSmCss = "responsiveThicknessVerticalSmCss";
    public const string ResponsiveThicknessVerticalMdCss = "responsiveThicknessVerticalMdCss";
    public const string ResponsiveThicknessVerticalXlCss = "responsiveThicknessVerticalXlCss";
    public const string ResponsiveThicknessVerticalXxlCss = "responsiveThicknessVerticalXxlCss";
    public const string ResponsivePixelsBaseCss = "responsivePixelsBaseCss";
    public const string ResponsivePixelsSmCss = "responsivePixelsSmCss";
    public const string ResponsivePixelsMdCss = "responsivePixelsMdCss";
    public const string ResponsivePixelsXlCss = "responsivePixelsXlCss";
    public const string ResponsivePixelsXxlCss = "responsivePixelsXxlCss";

    public const string GridPlacementBaseColumnCss = "gridPlacementBaseColumnCss";
    public const string GridPlacementBaseRowCss = "gridPlacementBaseRowCss";
    public const string GridPlacementBaseColumnSpanCss = "gridPlacementBaseColumnSpanCss";
    public const string GridPlacementBaseRowSpanCss = "gridPlacementBaseRowSpanCss";
    public const string GridPlacementSmColumnCss = "gridPlacementSmColumnCss";
    public const string GridPlacementSmRowCss = "gridPlacementSmRowCss";
    public const string GridPlacementSmColumnSpanCss = "gridPlacementSmColumnSpanCss";
    public const string GridPlacementSmRowSpanCss = "gridPlacementSmRowSpanCss";
    public const string GridPlacementMdColumnCss = "gridPlacementMdColumnCss";
    public const string GridPlacementMdRowCss = "gridPlacementMdRowCss";
    public const string GridPlacementMdColumnSpanCss = "gridPlacementMdColumnSpanCss";
    public const string GridPlacementMdRowSpanCss = "gridPlacementMdRowSpanCss";
    public const string GridPlacementXlColumnCss = "gridPlacementXlColumnCss";
    public const string GridPlacementXlRowCss = "gridPlacementXlRowCss";
    public const string GridPlacementXlColumnSpanCss = "gridPlacementXlColumnSpanCss";
    public const string GridPlacementXlRowSpanCss = "gridPlacementXlRowSpanCss";
    public const string GridPlacementXxlColumnCss = "gridPlacementXxlColumnCss";
    public const string GridPlacementXxlRowCss = "gridPlacementXxlRowCss";
    public const string GridPlacementXxlColumnSpanCss = "gridPlacementXxlColumnSpanCss";
    public const string GridPlacementXxlRowSpanCss = "gridPlacementXxlRowSpanCss";

    public const string VisibilityBaseAttribute = "visibilityBaseAttribute";
    public const string VisibilitySmAttribute = "visibilitySmAttribute";
    public const string VisibilityMdAttribute = "visibilityMdAttribute";
    public const string VisibilityXlAttribute = "visibilityXlAttribute";
    public const string VisibilityXxlAttribute = "visibilityXxlAttribute";
}
