using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

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
/// <remarks><c>Grouped</c> takes effect only after a reload: grouping is decided at render and the collection patch adds no header.</remarks>
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

    [RecursiveMember(false)]
    public RecursiveCollection<DemoServiceItem> Items { get; } =
    [
        CreateService("payments-api", "Payments API", "12 replicas · eu-west-1", "Europe", "Healthy", UIBadgeType.Success, DemoIcons.Shield),
        CreateService("web-portal", "Web Portal", "4 replicas · eu-west-1", "Europe", "Healthy", UIBadgeType.Success, DemoIcons.LayoutDashboard),
        CreateService("search-indexer", "Search Indexer", "2 replicas · eu-central-1", "Europe", "Degraded", UIBadgeType.Warning, DemoIcons.Search),
        CreateService("mail-relay", "Mail Relay", "1 replica · us-east-1", "Americas", "Paused", UIBadgeType.Surface, DemoIcons.Mail),
        CreateService("report-builder", "Report Builder", "3 replicas · us-east-1", "Americas", "Healthy", UIBadgeType.Success, DemoIcons.FileText),
        CreateService("notifier", "Notifier", "2 replicas · us-east-1", "Americas", "Healthy", UIBadgeType.Success, DemoIcons.Bell),
        CreateService("scheduler", "Scheduler", "1 replica · ap-south-1", "Asia Pacific", "Healthy", UIBadgeType.Success, DemoIcons.Clock),
        CreateService("audit-log", "Audit Log", "2 replicas · ap-south-1", "Asia Pacific", "Healthy", UIBadgeType.Success, DemoIcons.History),
    ];

    public ItemsViewGroupContext()
    {
        AddOption(nameof(LayoutType), CycleLayoutType, () => LayoutType);
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(HorizontalScroll), CycleHorizontalScroll, () => HorizontalScroll);
        AddOption(nameof(VerticalScroll), CycleVerticalScroll, () => VerticalScroll);
        AddOption(nameof(ScrollSnap), CycleScrollSnap, () => ScrollSnap);
        AddOption(nameof(ScrollAnchor), CycleScrollAnchor, () => ScrollAnchor);
        AddOption(nameof(SelectionMode), CycleSelectionMode, () => SelectionMode);
        AddOption(nameof(SelectedKey), CycleSelectedKey, () => SelectedKey);
        AddOption(nameof(SelectedKeys), CycleSelectedKeys, () => SelectedKeys is null ? null : string.Join(", ", SelectedKeys));
        AddOption(nameof(SelectionStyle), CycleSelectionStyle, () => SelectionStyle);
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
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, null, "payments-api", "search-indexer"));

    public void CycleSelectedKeys()
        => SetLastChange(nameof(SelectedKeys), SelectedKeys = CycleValue(SelectedKeys, null, ["web-portal", "mail-relay"], ["scheduler"]));

    // A mark on the left, a solid ground, and a ground with its own ink: the three shapes the object has.
    public void CycleSelectionStyle()
        => SetLastChange(nameof(SelectionStyle), SelectionStyle = CycleValue(SelectionStyle, null,
            UISelectionStyle.Marked(UISelectionMark.Left),
            UISelectionStyle.Ground(UIThemeColor.Accent),
            new UISelectionStyle(UIThemeColor.Primary, UIThemeColor.OnPrimary, UISelectionMark.None, null)
        ));

    public void AddService()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"service-{++_added}");

        Items.Add(CreateService(id, string.Create(CultureInfo.InvariantCulture, $"Service {_added}"), "added while the page was open", "Added", "New", UIBadgeType.Info, DemoIcons.Star));
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

    private static DemoServiceItem CreateService(string id, string title, string description, string region, string badge, UIBadgeType badgeStyle, string icon)
        => new() { Id = id, Icon = icon, Title = title, Description = description, BadgeText = badge, BadgeStyle = badgeStyle, Group = region, Region = region };
}
