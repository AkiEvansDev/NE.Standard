namespace DemoApp.Controllers.Base;

/// <summary>
/// What makes a word a link: where it points; everything else it carries is the shared text body.
/// </summary>
internal sealed partial class LinkGroupContext : DemoGroupContext
{
    private const string SampleUrl = "https://docs.orvane.example/rollout";

    [RecursiveMember]
    public partial string? Url { get; set; } = SampleUrl;

    public LinkGroupContext()
    {
        AddOption(nameof(Url), ToggleUrl, () => Url);
    }

    // With no address the word is still drawn, but goes nowhere.
    public void ToggleUrl()
        => SetLastChange(nameof(Url), Url = CycleValue(Url, null, SampleUrl));
}

/// <summary>
/// A rule between things, and the one thing that turns it into a heading: a word in the middle of it.
/// </summary>
internal sealed partial class SeparatorGroupContext : DemoGroupContext
{
    private const string SampleTitle = "Danger zone";

    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; }

    [RecursiveMember]
    public partial string? Title { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    /// <summary>
    /// Which way the preview stacks what the rule stands between — the opposite of the rule's own orientation.
    /// </summary>
    [RecursiveMember]
    public partial UIOrientation PreviewOrientation { get; set; } = UIOrientation.Vertical;

    public SeparatorGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Title), ToggleTitle, () => Title);
        AddOption(nameof(Color), CycleColor, () => Color);
    }

    public void CycleOrientation()
    {
        SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

        PreviewOrientation = Orientation == UIOrientation.Vertical ? UIOrientation.Horizontal : UIOrientation.Vertical;
    }

    public void ToggleTitle()
        => SetLastChange(nameof(Title), Title = CycleValue(Title, null, SampleTitle));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.Muted, UIThemeColor.FromStyle(UIColorStyle.Danger), null));
}
