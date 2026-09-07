using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Layouts.Expander;

/// <summary>
/// What the section is made of, and whether it is open; <c>Expanded</c> is two-way, so the header moves the row.
/// </summary>
internal sealed partial class ExpanderSurfaceGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Expanded { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowChevron { get; set; } = true;

    [RecursiveMember]
    public partial UISurfaceStyle? Surface { get; set; } = UISurfaceStyle.Background;

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; } = UIOverflow.Hidden;

    public ExpanderSurfaceGroupContext()
    {
        AddOption(nameof(Expanded), ToggleExpanded, () => Expanded);
        AddOption(nameof(ShowChevron), ToggleShowChevron, () => ShowChevron);
        AddOption(nameof(Surface), CycleSurface, () => Surface);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
    }

    public void ToggleExpanded()
        => SetLastChange(nameof(Expanded), Expanded = !Expanded);

    public void ToggleShowChevron()
        => SetLastChange(nameof(ShowChevron), ShowChevron = !ShowChevron);

    public void CycleSurface()
        => SetLastChange(nameof(Surface), Surface = CycleEnum(Surface));

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(4), UIThickness.Uniform(24), null));

    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background,
            UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}

internal sealed partial class ExpanderMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ExpanderSurfaceGroupContext ExpanderGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext HeaderTextGroup { get; set; } = new("Advanced settings", "Retention, replicas and the burst quota");

    [RecursiveMember]
    public partial TextLayoutGroupContext HeaderGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext HeaderBadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleExpanderOption(string id)
        => ExpanderGroup.CycleOption(id);

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
