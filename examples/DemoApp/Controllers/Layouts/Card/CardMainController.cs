using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Layouts.Card;

/// <summary>
/// What the card is made of and how much room it leaves inside.
/// </summary>
internal sealed partial class CardSurfaceGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UISurfaceStyle? Surface { get; set; } = UISurfaceStyle.Background;

    [RecursiveMember]
    public partial bool Clickable { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    [RecursiveMember]
    public partial string? BackgroundImage { get; set; }

    [RecursiveMember]
    public partial UIImageFit? BackgroundImageFit { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; } = UIOverflow.Hidden;

    public CardSurfaceGroupContext()
    {
        AddOption(nameof(Surface), CycleSurface, () => Surface);
        AddOption(nameof(Clickable), ToggleClickable, () => Clickable);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
        AddOption(nameof(BackgroundImage), CycleBackgroundImage, () => BackgroundImage);
        AddOption(nameof(BackgroundImageFit), CycleBackgroundImageFit, () => BackgroundImageFit);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
    }

    public void CycleSurface()
        => SetLastChange(nameof(Surface), Surface = CycleEnum(Surface));

    public void ToggleClickable()
        => SetLastChange(nameof(Clickable), Clickable = !Clickable);

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(4), UIThickness.Uniform(24), null));

    // Background says which colour, Surface says what is done with it; the null step shows the fallback.
    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background,
            UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));

    // A picture over the fill: the fit says how much of it the surface shows.
    public void CycleBackgroundImage()
        => SetLastChange(nameof(BackgroundImage), BackgroundImage = CycleValue(BackgroundImage, DemoImages.HarbourSky, DemoImages.Mark, null));

    public void CycleBackgroundImageFit()
        => SetLastChange(nameof(BackgroundImageFit), BackgroundImageFit = CycleEnum(BackgroundImageFit));

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}

internal sealed partial class CardMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial CardSurfaceGroupContext CardGroup { get; set; } = new();

    // The header is a TextComponent, so it takes the same three contexts a field's label does.
    [RecursiveMember]
    public partial TextContentGroupContext HeaderTextGroup { get; set; } = new("Web Portal · #482", "Fix circular progress anti-aliasing");

    [RecursiveMember]
    public partial TextLayoutGroupContext HeaderGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext HeaderBadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleCardOption(string id)
        => CardGroup.CycleOption(id);

    [UICommand]
    public void CycleHeaderOption(string id)
        => HeaderGroup.CycleOption(id);

    [UICommand]
    public void CycleHeaderTextOption(string id)
        => HeaderTextGroup.CycleOption(id);

    [UICommand]
    public void CycleHeaderBadgeOption(string id)
        => HeaderBadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
