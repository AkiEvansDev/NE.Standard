using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Navigation.ButtonGroup;

/// <summary>
/// The strip's own rows: which segment is current, how big the strip is, what the current segment wears, and the
/// ground and inset behind the segments.
/// </summary>
/// <remarks><c>SelectedKey</c> is two-way, so the row follows a press on the strip as well as driving it.</remarks>
internal sealed partial class SegmentGroupContext : DemoGroupContext
{
    public const string ListKey = "list";
    public const string BoardKey = "board";
    public const string TimelineKey = "timeline";

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = ListKey;

    [RecursiveMember]
    public partial UIButtonSize? Size { get; set; }

    [RecursiveMember]
    public partial UISelectionStyle? SelectionStyle { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    public SegmentGroupContext()
    {
        AddOption(nameof(SelectedKey), CycleSelectedKey, () => SelectedKey);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(SelectionStyle), CycleSelectionStyle, () => SelectionStyle);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
    }

    public void CycleSelectedKey()
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, ListKey, BoardKey, TimelineKey));

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    // The strip's own look is a primary fill; the cycle keeps the ground and recolours the ink, then swaps the fill for a line.
    public void CycleSelectionStyle()
        => SetLastChange(nameof(SelectionStyle), SelectionStyle = CycleValue(SelectionStyle, null,
            UISelectionStyle.Ground(UIThemeColor.Accent),
            new UISelectionStyle(UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Primary), null, null, Bold: true),
            new UISelectionStyle(UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.OnSurface), UISelectionMark.Bottom, UIThemeColor.Primary)));

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(2), UIThickness.Uniform(4), null));

    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background,
            UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));
}

internal sealed partial class ButtonGroupMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial SegmentGroupContext SegmentGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleSegmentOption(string id)
        => SegmentGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
