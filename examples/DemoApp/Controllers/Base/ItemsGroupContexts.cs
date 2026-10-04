using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace DemoApp.Controllers.Base;

/// <summary>A release as the tiles draw it: the text body plus the picture across the top.</summary>
internal sealed partial class DemoReleaseItem : TextItem
{
    [RecursiveMember]
    public partial string Picture { get; set; } = string.Empty;
}

/// <summary>
/// One row of the lists on the items pages: a text item that also belongs to a group, so the same model is
/// drawn by the default text template and bucketed by the default group template.
/// </summary>
internal sealed partial class DemoServiceItem : TextItem, IBindableGroup
{
    [RecursiveMember]
    public partial string? Group { get; set; }

    /// <summary>Where the service runs — what the group is set back to after it has been cleared.</summary>
    [RecursiveMember(false)]
    public string Region { get; init; } = string.Empty;
}

/// <summary>
/// A template over a collection, and the properties that say how the copies are laid out and scrolled.
/// </summary>
internal sealed partial class ItemsViewGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember]
    public partial UIItemsLayoutType? LayoutType { get; set; }

    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; }

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIScrollMode? HorizontalScroll { get; set; }

    [RecursiveMember]
    public partial UIScrollMode? VerticalScroll { get; set; }

    [RecursiveMember]
    public partial UIScrollSnapMode? ScrollSnap { get; set; }

    [RecursiveMember]
    public partial UIScrollAnchor? ScrollAnchor { get; set; }

    [RecursiveMember]
    public partial UISelectionMode? SelectionMode { get; set; }

    [RecursiveMember]
    public partial string? SelectedKey { get; set; }

    [RecursiveMember]
    public partial IReadOnlyList<string>? SelectedKeys { get; set; }

    [RecursiveMember]
    public partial UISelectionStyle? SelectionStyle { get; set; }

    [RecursiveMember]
    public partial bool Draggable { get; set; }

    [RecursiveMember]
    public partial bool DragHandle { get; set; }

    [RecursiveMember]
    public partial UIDragHandlePlacement? DragHandlePlacement { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<DemoServiceItem> Items { get; } = [.. DemoSamples.Services()];

    public ItemsViewGroupContext()
    {
        AddOption(nameof(LayoutType), CycleLayoutType, () => LayoutType);
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(HorizontalScroll), CycleHorizontalScroll, () => HorizontalScroll);
        AddOption(nameof(VerticalScroll), CycleVerticalScroll, () => VerticalScroll);
        AddOption(nameof(ScrollSnap), CycleScrollSnap, () => ScrollSnap);
        AddOption(nameof(ScrollAnchor), CycleScrollAnchor, () => ScrollAnchor);
        AddOption(nameof(SelectionMode), CycleSelectionMode, () => SelectionMode);
        AddOption(nameof(SelectedKey), CycleSelectedKey, () => SelectedKey);
        AddOption(nameof(SelectedKeys), CycleSelectedKeys, () => SelectedKeys is null ? null : string.Join(", ", SelectedKeys));
        AddOption(nameof(SelectionStyle), CycleSelectionStyle, () => SelectionStyle);
        AddOption(nameof(Draggable), ToggleDraggable, () => Draggable);
        AddOption(nameof(DragHandle), ToggleDragHandle, () => DragHandle);
        AddOption(nameof(DragHandlePlacement), CycleDragHandlePlacement, () => DragHandlePlacement);
        AddOption("Add", AddService, () => Items.Count);
        AddOption("Remove", RemoveService, () => Items.Count);
        AddOption("Grouped", ToggleGrouped, () => Items.Count > 0 && Items[0].Group is not null);
    }

    // Stack is one line of copies along the orientation; Wrap places them on the twenty-four-column grid.
    public void CycleLayoutType()
        => SetLastChange(nameof(LayoutType), LayoutType = CycleEnum(LayoutType));

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 4d, 12d, 24d));

    // Inside the scroll: the rows run on through it, so the last one ends that far above the view's foot.
    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(8), UIThickness.All(0, 0, 0, 48), null));

    public void CycleHorizontalScroll()
        => SetLastChange(nameof(HorizontalScroll), HorizontalScroll = CycleEnum(HorizontalScroll));

    // On by default: a list taller than its room scrolls inside the host rather than growing the page.
    public void CycleVerticalScroll()
        => SetLastChange(nameof(VerticalScroll), VerticalScroll = CycleEnum(VerticalScroll));

    public void CycleScrollSnap()
        => SetLastChange(nameof(ScrollSnap), ScrollSnap = CycleEnum(ScrollSnap));

    // Read against the Add row: with End, a copy appended while the viewer is at the bottom stays in sight.
    public void CycleScrollAnchor()
        => SetLastChange(nameof(ScrollAnchor), ScrollAnchor = CycleEnum(ScrollAnchor));

    // The mode picks which of the two key rows the list reads; the other shows a value nothing looks at.
    public void CycleSelectionMode()
        => SetLastChange(nameof(SelectionMode), SelectionMode = CycleEnum(SelectionMode));

    public void CycleSelectedKey()
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, null, "billing", "dns"));

    public void CycleSelectedKeys()
        => SetLastChange(nameof(SelectedKeys), SelectedKeys = NextSelectedKeys(SelectedKeys));

    // By what a step holds, not by reference: a list the view writes back as the viewer chooses is a new one.
    private static string[]? NextSelectedKeys(IReadOnlyList<string>? current)
    {
        string[][] steps = [["panel", "mail-relay"], ["scheduler"]];

        if (current is null)
            return steps[0];

        var index = Array.FindIndex(steps, step => step.SequenceEqual(current));

        return index < 0 ? steps[0] : index + 1 < steps.Length ? steps[index + 1] : null;
    }

    // A mark on the left, a solid ground, and a ground with its own ink: the three shapes the object has.
    public void CycleSelectionStyle()
        => SetLastChange(nameof(SelectionStyle), SelectionStyle = CycleValue(SelectionStyle, null, UISelectionStyle.Marked(UISelectionMark.Left), UISelectionStyle.Ground(UIThemeColor.Accent), new UISelectionStyle(UIThemeColor.Primary, UIThemeColor.OnPrimary, UISelectionMark.None, null)));

    public void ToggleDraggable()
        => SetLastChange(nameof(Draggable), Draggable = !Draggable);

    // Read with Draggable: on its own the grip is drawn but not shown.
    public void ToggleDragHandle()
        => SetLastChange(nameof(DragHandle), DragHandle = !DragHandle);

    // Where the grip stands, End unset; read with DragHandle on.
    public void CycleDragHandlePlacement()
        => SetLastChange(nameof(DragHandlePlacement), DragHandlePlacement = CycleEnum(DragHandlePlacement));

    /// <summary>Moves the row a drop named to the place it asked for; the page moved it ahead, and this is the answer that keeps it.</summary>
    public void MoveService(string id, int index)
    {
        for (var i = 0; i < Items.Count; i++)
        {
            if (Items[i].Id != id)
                continue;

            Items.Move(i, index);
            LogEvent($"{id} -> place {index + 1}");
            return;
        }
    }

    public void AddService()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"service-{++_added}");

        Items.Add(DemoSamples.Service(id, string.Create(CultureInfo.InvariantCulture, $"Service {_added}"), "added while the page was open", "Added", "New", UIBadgeType.Info, DemoIcons.Star));
    }

    public void RemoveService()
    {
        if (Items.Count > 0)
            _ = Items.Remove(Items[^1]);
    }

    /// <summary>
    /// Writes the group onto every item or clears it from all of them; the group is the item's property.
    /// </summary>
    public void ToggleGrouped()
    {
        var grouped = Items.Count > 0 && Items[0].Group is not null;

        for (var i = 0; i < Items.Count; i++)
            Items[i].Group = grouped ? null : Items[i].Region;
    }
}
