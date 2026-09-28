namespace DemoApp.Controllers.Base;

/// <summary>
/// What a grid puts between and around the cells it lays out: the air between them, the room inside its edge, the
/// ground behind the cells, and what happens to a child wider than the columns it was given.
/// </summary>
/// <remarks>Not the card's surface context: a container has no <c>Surface</c> style and nothing to click.</remarks>
internal sealed partial class ContainerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    [RecursiveMember]
    public partial string? BackgroundImage { get; set; }

    [RecursiveMember]
    public partial UIImageFit? BackgroundImageFit { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; }

    public ContainerGroupContext()
    {
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
        AddOption(nameof(BackgroundImage), CycleBackgroundImage, () => BackgroundImage);
        AddOption(nameof(BackgroundImageFit), CycleBackgroundImageFit, () => BackgroundImageFit);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
    }

    // The last value is a responsive one: close on a phone, wider from xl up, where the tiles stand side by side.
    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, 8d, 24d, UIResponsive<double>.Create(8, xl: 24), null));

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(8), UIThickness.Uniform(24), null));

    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background, UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));

    // Only says anything once a child is wider than its columns, which one of the preview's tiles is.
    public void CycleBackgroundImage()
        => SetLastChange(nameof(BackgroundImage), BackgroundImage = CycleValue(BackgroundImage, DemoImages.HarbourSky, DemoImages.Mark, null));

    public void CycleBackgroundImageFit()
        => SetLastChange(nameof(BackgroundImageFit), BackgroundImageFit = CycleEnum(BackgroundImageFit));

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}
