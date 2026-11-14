namespace DemoApp.Controllers.Base;

/// <summary>
/// The button a switcher is drawn as, the theme's or the language's: its glyph's size, its look, size and padding, its tooltip and
/// its ground. The switcher's own glyphs come first, then <see cref="AddButtonOptions"/>.
/// </summary>
internal abstract partial class SwitcherButtonGroupContext : TooltipGroupContext
{
    [RecursiveMember]
    public partial UISize? IconSize { get; set; }

    [RecursiveMember]
    public partial UIButtonVariant? ButtonVariant { get; set; }

    [RecursiveMember]
    public partial UISize? Size { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    [RecursiveMember]
    public partial UIInputAppearance? FieldVariant { get; set; }

    /// <summary>The button's and field's rows, after the switcher's glyphs.</summary>
    protected void AddButtonOptions(string sampleTooltip)
    {
        AddOption(nameof(IconSize), CycleIconSize, () => IconSize);
        AddOption(nameof(ButtonVariant), CycleButtonVariant, () => ButtonVariant);
        AddOption(nameof(FieldVariant), CycleFieldVariant, () => FieldVariant);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddTooltipOptions(sampleTooltip);
        AddOption(nameof(Background), CycleBackground, () => Background);
    }

    public void CycleIconSize()
        => SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));

    public void CycleButtonVariant()
        => SetLastChange(nameof(ButtonVariant), ButtonVariant = CycleEnum(ButtonVariant));

    public void CycleFieldVariant()
        => SetLastChange(nameof(FieldVariant), FieldVariant = CycleEnum(FieldVariant));

    // The box, where IconSize is the glyph inside it — the two rows read together.
    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(4), UIThickness.Uniform(20), null));

    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background, UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));
}

/// <summary>
/// The one control with nothing to bind a value to: two glyphs, one for each theme it offers, and the button
/// they are drawn in.
/// </summary>
/// <remarks>Both glyphs are rendered and the stylesheet shows one, so a row may change the glyph the page is not showing.</remarks>
internal sealed partial class ThemeSwitcherGroupContext : SwitcherButtonGroupContext
{
    private const string SampleTooltip = "Switch the theme";

    [RecursiveMember]
    public partial string? LightIcon { get; set; } = DemoIcons.Outline(DemoIcons.LightMode);

    [RecursiveMember]
    public partial string? DarkIcon { get; set; } = DemoIcons.Outline(DemoIcons.DarkMode);

    public ThemeSwitcherGroupContext()
    {
        AddOption(nameof(LightIcon), CycleLightIcon, () => LightIcon);
        AddOption(nameof(DarkIcon), CycleDarkIcon, () => DarkIcon);
        AddButtonOptions(SampleTooltip);
    }

    // The outlined drawing first, because that is what a control wears.
    public void CycleLightIcon()
        => SetLastChange(nameof(LightIcon), LightIcon = CycleValue(LightIcon, DemoIcons.Outline(DemoIcons.LightMode), DemoIcons.LightMode, DemoImages.Mask(DemoImages.Mark), null));

    public void CycleDarkIcon()
        => SetLastChange(nameof(DarkIcon), DarkIcon = CycleValue(DarkIcon, DemoIcons.Outline(DemoIcons.DarkMode), DemoIcons.DarkMode, DemoImages.Mask(DemoImages.Mark), null));
}
