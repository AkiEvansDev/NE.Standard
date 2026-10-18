using System.Globalization;

namespace DemoApp.Controllers.Base;

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
internal sealed partial class ItemsViewGroupContext : DraggableSelectionGroupContext
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

    [RecursiveMember(false)]
    public RecursiveCollection<DemoServiceItem> Items { get; } = [.. DemoSamples.Services()];

    public ItemsViewGroupContext()
        : base(["billing", "dns"], [["panel", "mail-relay"], ["scheduler"]])
    {
        AddOption(nameof(LayoutType), CycleLayoutType, () => LayoutType);
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(HorizontalScroll), CycleHorizontalScroll, () => HorizontalScroll);
        AddOption(nameof(VerticalScroll), CycleVerticalScroll, () => VerticalScroll);
        AddOption(nameof(ScrollSnap), CycleScrollSnap, () => ScrollSnap);
        AddOption(nameof(ScrollAnchor), CycleScrollAnchor, () => ScrollAnchor);
        AddSelectionOptions();
        AddDragOptions();
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

    public void MoveService(string id, int index)
        => MoveByKey(Items, id, index);

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
