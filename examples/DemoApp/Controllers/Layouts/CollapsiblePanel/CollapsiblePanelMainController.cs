using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Layouts.CollapsiblePanel;

/// <summary>
/// Whether the panel is folded, and what it paints around its content; the viewer's own switch is separate.
/// </summary>
internal sealed partial class CollapsiblePanelGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Expanded { get; set; } = true;

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    public CollapsiblePanelGroupContext()
    {
        AddOption(nameof(Expanded), ToggleExpanded, () => Expanded);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
    }

    public void ToggleExpanded()
        => SetLastChange(nameof(Expanded), Expanded = !Expanded);

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(8), UIThickness.Uniform(24), null));

    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background,
            UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));
}

internal sealed partial class CollapsiblePanelMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial CollapsiblePanelGroupContext PanelGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CyclePanelOption(string id)
        => PanelGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
