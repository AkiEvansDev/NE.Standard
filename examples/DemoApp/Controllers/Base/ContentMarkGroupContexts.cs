using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// A glyph standing on its own: which one, what colour it takes, and how big it is drawn.
/// </summary>
/// <remarks><c>Size</c> is the text ladder; <c>Width</c> is a different question and stays the standard group's row.</remarks>
internal sealed partial class IconGroupContext : TooltipGroupContext
{
    private const string SampleTooltip = "Starred by the team";

    [RecursiveMember]
    public partial string? Icon { get; set; } = DemoIcons.Star;

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    [RecursiveMember]
    public partial UIIconSize? Size { get; set; }

    public IconGroupContext()
    {
        AddOption(nameof(Icon), CycleIcon, () => Icon);
        AddOption(nameof(Color), CycleColor, () => Color);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddTooltipOptions(SampleTooltip);
    }

    // The readings of one string, in order: a glyph, its outlined drawing, a picture, and a tinted picture.
    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon,
            DemoIcons.Star, DemoIcons.Outline(DemoIcons.Star), DemoImages.Logo, DemoImages.Mask(DemoImages.Mark), null));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color,
            UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.Muted, null));

    // Size is the ladder that goes with text; Width drives the drawing itself and is the standard section's row.
    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));
}

/// <summary>
/// A photograph in a box: which picture, what happens when the two shapes disagree, and what to draw when the
/// source does not load.
/// </summary>
internal sealed partial class ImageGroupContext : TooltipGroupContext
{
    private const string SampleAltText = "A harbour at dusk";
    private const string SampleTooltip = "Taken on the 4th";
    private const string MissingSource = "/images/there-is-no-such-file.jpg";

    [RecursiveMember]
    public partial string? Source { get; set; } = DemoImages.HarbourSky;

    [RecursiveMember]
    public partial UIImageFit? Fit { get; set; }

    [RecursiveMember]
    public partial UICornerRadius? CornerRadius { get; set; }

    [RecursiveMember]
    public partial string? AltText { get; set; } = SampleAltText;

    public ImageGroupContext()
    {
        AddOption(nameof(Source), CycleSource, () => Source);
        AddOption(nameof(Fit), CycleFit, () => Fit);
        AddOption(nameof(CornerRadius), CycleCornerRadius, () => CornerRadius);
        AddOption(nameof(AltText), ToggleAltText, () => AltText);
        AddTooltipOptions(SampleTooltip);
    }

    // A landscape, a portrait and a square for Fit to settle, then a path that does not resolve for FallbackSource.
    public void CycleSource()
        => SetLastChange(nameof(Source), Source = CycleValue(Source,
            DemoImages.HarbourSky, DemoImages.MeteorShore, DemoImages.Avatar, MissingSource, null));

    public void CycleFit()
        => SetLastChange(nameof(Fit), Fit = CycleEnum(Fit));

    public void CycleCornerRadius()
        => SetLastChange(nameof(CornerRadius), CornerRadius = CycleValue(CornerRadius,
            UICornerRadius.Uniform(8), UICornerRadius.Top(24), UICornerRadius.Uniform(999), null));

    public void ToggleAltText()
        => SetLastChange(nameof(AltText), AltText = CycleValue(AltText, null, SampleAltText));
}
