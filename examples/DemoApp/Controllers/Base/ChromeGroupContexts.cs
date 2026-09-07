using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// The one control with nothing to bind a value to: two glyphs, one for each theme it offers, and the button
/// they are drawn in.
/// </summary>
/// <remarks>Both glyphs are rendered and the stylesheet shows one, so a row may change the glyph the page is not showing.</remarks>
internal sealed partial class ThemeSwitcherGroupContext : TooltipGroupContext
{
    private const string SampleTooltip = "Switch the theme";

    [RecursiveMember]
    public partial string? LightIcon { get; set; } = DemoIcons.Outline(DemoIcons.LightMode);

    [RecursiveMember]
    public partial string? DarkIcon { get; set; } = DemoIcons.Outline(DemoIcons.DarkMode);

    [RecursiveMember]
    public partial UIIconSize? IconSize { get; set; }

    [RecursiveMember]
    public partial UIButtonType? Type { get; set; }

    [RecursiveMember]
    public partial UIButtonSize? Size { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    public ThemeSwitcherGroupContext()
    {
        AddOption(nameof(LightIcon), CycleLightIcon, () => LightIcon);
        AddOption(nameof(DarkIcon), CycleDarkIcon, () => DarkIcon);
        AddOption(nameof(IconSize), CycleIconSize, () => IconSize);
        AddOption(nameof(Type), CycleType, () => Type);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddTooltipOptions(SampleTooltip);
        AddOption(nameof(Background), CycleBackground, () => Background);
    }

    // The outlined drawing first, because that is what a control wears.
    public void CycleLightIcon()
        => SetLastChange(nameof(LightIcon), LightIcon = CycleValue(LightIcon,
            DemoIcons.Outline(DemoIcons.LightMode), DemoIcons.LightMode, DemoImages.Mask(DemoImages.Mark), null));

    public void CycleDarkIcon()
        => SetLastChange(nameof(DarkIcon), DarkIcon = CycleValue(DarkIcon,
            DemoIcons.Outline(DemoIcons.DarkMode), DemoIcons.DarkMode, DemoImages.Mask(DemoImages.Mark), null));

    public void CycleIconSize()
        => SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));

    public void CycleType()
        => SetLastChange(nameof(Type), Type = CycleEnum(Type));

    // The box, where IconSize is the glyph inside it — the two rows read together.
    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(4), UIThickness.Uniform(20), null));

    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background,
            UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));
}
