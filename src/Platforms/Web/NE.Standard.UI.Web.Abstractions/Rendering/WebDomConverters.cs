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
    public const string ScrollXClass = "scrollXClass";
    public const string ScrollYClass = "scrollYClass";
    public const string ScrollSnapClass = "scrollSnapClass";
    public const string ButtonSizeClass = "buttonSizeClass";
    public const string ButtonGroupSizeClass = "buttonGroupSizeClass";
    public const string InputAppearanceClass = "inputAppearanceClass";
    public const string TextInputTypeAttribute = "textInputTypeAttribute";
    public const string ColorTextFormatAttribute = "colorTextFormatAttribute";
    public const string ColorInputVariantAttribute = "colorInputVariantAttribute";

    public const string ThemeNameCss = "themeNameCss";
    public const string AlignmentCss = "alignmentCss";
    public const string AlignmentStretchFallbackCss = "alignmentStretchFallbackCss";
    public const string OverflowCss = "overflowCss";
    public const string LayoutLengthCss = "layoutLengthCss";
    public const string ThicknessCss = "thicknessCss";
    public const string RadiusCss = "radiusCss";
    public const string GridUnitCss = "gridUnitCss";
    public const string PixelsCss = "pixelsCss";
    public const string GridTemplateCss = "gridTemplateCss";
    public const string ColorVariantCss = "colorVariantCss";
    public const string ThemeColorCss = "themeColorCss";
    /// <summary>A foreground colour as inline CSS — only for a variant; a style colour is a class, so the class rule (an ink) is not overridden.</summary>
    public const string ThemeColorInlineCss = "themeColorInlineCss";
    public const string SelectionModeAttribute = "selectionModeAttribute";

    /// <summary>
    /// The four halves of a <c>UISelectionStyle</c>, one custom property each.
    /// </summary>
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
    public const string BackgroundImageCss = "backgroundImageCss";
    public const string ImageFitSizeCss = "imageFitSizeCss";
    public const string ProgressVariantClass = "progressVariantClass";
    public const string ProgressValueText = "progressValueText";
    public const string SearchSelectionModeClass = "searchSelectionModeClass";
    public const string TextAreaResizeCss = "textAreaResizeCss";
    public const string FlyoutPlacementClass = "flyoutPlacementClass";

    public const string PopupPlacementAttribute = "popupPlacementAttribute";

    public const string ResponsiveLayoutLengthBaseCss = "responsiveLayoutLengthBaseCss";
    public const string ResponsiveLayoutLengthSmCss = "responsiveLayoutLengthSmCss";
    public const string ResponsiveLayoutLengthMdCss = "responsiveLayoutLengthMdCss";
    public const string ResponsiveLayoutLengthXlCss = "responsiveLayoutLengthXlCss";
    public const string ResponsiveLayoutLengthXxlCss = "responsiveLayoutLengthXxlCss";
    public const string ResponsiveThicknessBaseCss = "responsiveThicknessBaseCss";
    public const string ResponsiveThicknessSmCss = "responsiveThicknessSmCss";
    public const string ResponsiveThicknessMdCss = "responsiveThicknessMdCss";
    public const string ResponsiveThicknessXlCss = "responsiveThicknessXlCss";
    public const string ResponsiveThicknessXxlCss = "responsiveThicknessXxlCss";
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
