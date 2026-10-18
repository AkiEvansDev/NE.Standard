using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.GridSplitter;

/// <summary>
/// What a splitter says about itself: how far an arrow key moves it, the colour of its line at rest, and where it stands.
/// </summary>
/// <remarks>Both preview bars bind the one position, so a drag of either moves the other; the examples' bars are unbound, kept in the browser.</remarks>
internal sealed partial class GridSplitterGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial double? Step { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    [RecursiveMember]
    public partial double? Position { get; set; }

    public GridSplitterGroupContext()
    {
        AddOption(nameof(Step), CycleStep, () => Step);
        AddOption(nameof(Color), CycleColor, () => Color);
        AddOption(nameof(Position), CyclePosition, () => Position);
    }

    public void CycleStep()
        => SetLastChange(nameof(Step), Step = CycleValue(Step, 4d, 48d, null));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.Primary, UIThemeColor.Accent, UIThemeColor.Muted, null));

    public void CyclePosition()
        => SetLastChange(nameof(Position), Position = CycleValue(Position, 0.25, 0.75, null));
}

internal sealed partial class GridSplitterController() : DemoStandardController
{
    [RecursiveMember]
    public partial GridSplitterGroupContext SplitterGroup { get; set; } = new();
}
