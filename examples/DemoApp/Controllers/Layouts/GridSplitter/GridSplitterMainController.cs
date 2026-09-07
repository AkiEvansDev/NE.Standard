using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.GridSplitter;

/// <summary>
/// What a splitter says about itself: how far an arrow key moves it, and the colour of its line at rest.
/// </summary>
/// <remarks>The position is not here: it is the viewer's, kept in the browser, and no controller sees it.</remarks>
internal sealed partial class GridSplitterGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial double? Step { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    public GridSplitterGroupContext()
    {
        AddOption(nameof(Step), CycleStep, () => Step);
        AddOption(nameof(Color), CycleColor, () => Color);
    }

    public void CycleStep()
        => SetLastChange(nameof(Step), Step = CycleValue(Step, 4d, 48d, null));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.Primary, UIThemeColor.Accent, UIThemeColor.Muted, null));
}

internal sealed partial class GridSplitterMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial GridSplitterGroupContext SplitterGroup { get; set; } = new();

    [UICommand]
    public void CycleSplitterOption(string id)
        => SplitterGroup.CycleOption(id);
}
