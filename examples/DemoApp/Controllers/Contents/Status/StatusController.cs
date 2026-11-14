using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Status;

/// <summary>
/// A status view's mark, words and spacing, bound through <see cref="StatusComponent{T}.Mark"/> and <see cref="StatusComponent{T}.Words"/>.
/// </summary>
internal sealed partial class StatusGroupContext : DemoGroupContext
{
    private const string SampleTitle = "Nothing at this address";
    private const string AlternateTitle = "This project was moved";
    private const string SampleDescription = "The page was moved or the link was mistyped.";

    [RecursiveMember]
    public partial string? Icon { get; set; } = DemoIcons.Outline(DemoIcons.Search);

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Info);

    [RecursiveMember]
    public partial string? Title { get; set; } = SampleTitle;

    [RecursiveMember]
    public partial string? Description { get; set; } = SampleDescription;

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    public StatusGroupContext()
    {
        AddOption(nameof(Icon), CycleIcon, () => Icon);
        AddOption(nameof(Color), CycleColor, () => Color);
        AddOption(nameof(Title), CycleTitle, () => Title);
        AddOption(nameof(Description), ToggleDescription, () => Description);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
    }

    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon, DemoIcons.Outline(DemoIcons.Search), DemoIcons.Outline(DemoIcons.Lock), DemoIcons.Outline(DemoIcons.Alert), DemoIcons.Outline(DemoIcons.Check)));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.FromStyle(UIColorStyle.Info), UIThemeColor.FromStyle(UIColorStyle.Warning), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Success)));

    public void CycleTitle()
        => SetLastChange(nameof(Title), Title = CycleValue(Title, SampleTitle, AlternateTitle));

    public void ToggleDescription()
        => SetLastChange(nameof(Description), Description = CycleValue(Description, null, SampleDescription));

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, 8d, 24d, null));
}

/// <summary>
/// One status, and the properties bound to its mark, words and stack.
/// </summary>
internal sealed partial class StatusController() : DemoStandardController
{
    [RecursiveMember]
    public partial StatusGroupContext StatusGroup { get; set; } = new();
}
