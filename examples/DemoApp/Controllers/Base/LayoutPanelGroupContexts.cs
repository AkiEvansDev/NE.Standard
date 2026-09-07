using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// A line of things, and the three questions it answers: which way it runs, how much air is between them, and
/// what happens when the line is longer than the room.
/// </summary>
internal sealed partial class StackPanelGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; }

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    [RecursiveMember]
    public partial bool Wrap { get; set; }

    public StackPanelGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(Wrap), ToggleWrap, () => Wrap);
    }

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 4d, 12d, 32d));

    // Only says anything across a row, and only once the row runs out of width.
    public void ToggleWrap()
        => SetLastChange(nameof(Wrap), Wrap = !Wrap);
}

/// <summary>
/// The air in a panel that wraps by construction: one value for the whole grid, and a second for its rows
/// when a grid of tiles wants more between them than between its columns.
/// </summary>
internal sealed partial class WrapPanelGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    [RecursiveMember]
    public partial UIResponsive<double>? LineSpacing { get; set; }

    public WrapPanelGroupContext()
    {
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(LineSpacing), CycleLineSpacing, () => LineSpacing);
    }

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 4d, 16d, 40d));

    // Starts unset: that is the value that shows the fallback to Spacing.
    public void CycleLineSpacing()
        => SetLastChange(nameof(LineSpacing), LineSpacing = CycleValue(LineSpacing, null, 4d, 16d, 40d));
}

/// <summary>
/// A viewport over more than fits: which ways it may be scrolled, and where a scroll comes to rest.
/// </summary>
/// <remarks><c>ScrollAnchor</c> is not a row here: it is about content that grows, which the Scenarios page shows.</remarks>
internal sealed partial class ScrollGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIScrollMode? HorizontalScroll { get; set; }

    [RecursiveMember]
    public partial UIScrollMode? VerticalScroll { get; set; }

    [RecursiveMember]
    public partial UIScrollSnapMode? ScrollSnap { get; set; }

    public ScrollGroupContext()
    {
        AddOption(nameof(HorizontalScroll), CycleHorizontalScroll, () => HorizontalScroll);
        AddOption(nameof(VerticalScroll), CycleVerticalScroll, () => VerticalScroll);
        AddOption(nameof(ScrollSnap), CycleScrollSnap, () => ScrollSnap);
    }

    // Auto is a bar when the content needs one, Always is a bar that is always there, Disabled cuts the content.
    public void CycleHorizontalScroll()
        => SetLastChange(nameof(HorizontalScroll), HorizontalScroll = CycleEnum(HorizontalScroll));

    public void CycleVerticalScroll()
        => SetLastChange(nameof(VerticalScroll), VerticalScroll = CycleEnum(VerticalScroll));

    // Proximity stops on a tile's edge when the scroll ended near one; Mandatory never stops between two.
    public void CycleScrollSnap()
        => SetLastChange(nameof(ScrollSnap), ScrollSnap = CycleEnum(ScrollSnap));
}

/// <summary>
/// A panel that hangs off something else: whether it is showing, which side of the anchor it hangs on, and
/// the two ways it may be dismissed.
/// </summary>
internal sealed partial class FlyoutGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool IsOpen { get; set; }

    [RecursiveMember]
    public partial UIPopupPlacement? FlyoutPlacement { get; set; }

    [RecursiveMember]
    public partial bool CloseOnBackdrop { get; set; } = true;

    [RecursiveMember]
    public partial bool CloseOnEscape { get; set; } = true;

    public FlyoutGroupContext()
    {
        AddOption(nameof(IsOpen), ToggleIsOpen, () => IsOpen);
        AddOption(nameof(FlyoutPlacement), CycleFlyoutPlacement, () => FlyoutPlacement);
        AddOption(nameof(CloseOnBackdrop), ToggleCloseOnBackdrop, () => CloseOnBackdrop);
        AddOption(nameof(CloseOnEscape), ToggleCloseOnEscape, () => CloseOnEscape);
    }

    // Two-way: pressing the anchor writes back through the same path, so the row follows the panel.
    public void ToggleIsOpen()
        => SetLastChange(nameof(IsOpen), IsOpen = !IsOpen);

    // All twelve, walked whole: a placement is a side plus an end, easier to see than to read.
    public void CycleFlyoutPlacement()
        => SetLastChange(nameof(FlyoutPlacement), FlyoutPlacement = CycleEnum(FlyoutPlacement));

    public void ToggleCloseOnBackdrop()
        => SetLastChange(nameof(CloseOnBackdrop), CloseOnBackdrop = !CloseOnBackdrop);

    public void ToggleCloseOnEscape()
        => SetLastChange(nameof(CloseOnEscape), CloseOnEscape = !CloseOnEscape);
}
