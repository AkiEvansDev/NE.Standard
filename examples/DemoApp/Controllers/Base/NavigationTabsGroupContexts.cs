using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// A strip of captions over pages the view already knows: which page is showing, and the three things a
/// caption can carry beyond its word.
/// </summary>
/// <remarks><c>SelectedKey</c> is two-way, so the row follows a click on the strip as well as driving it.</remarks>
internal sealed partial class TabsGroupContext : DemoGroupContext
{
    public const string OverviewKey = "overview";
    public const string ActivityKey = "activity";
    public const string SettingsKey = "settings";

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = OverviewKey;

    [RecursiveMember]
    public partial string? OverviewIcon { get; set; }

    [RecursiveMember]
    public partial string? ActivityBadge { get; set; } = "3";

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> SettingsVisible { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial UISelectionStyle? SelectionStyle { get; set; }

    [RecursiveMember]
    public partial bool ShowOverflow { get; set; } = true;

    public TabsGroupContext()
    {
        AddOption(nameof(SelectedKey), CycleSelectedKey, () => SelectedKey);
        AddOption(nameof(SelectionStyle), CycleSelectionStyle, () => SelectionStyle);
        AddOption(nameof(ShowOverflow), ToggleShowOverflow, () => ShowOverflow);
        AddOption(nameof(OverviewIcon), CycleOverviewIcon, () => OverviewIcon);
        AddOption(nameof(ActivityBadge), CycleActivityBadge, () => ActivityBadge);
        AddOption(nameof(SettingsVisible), ToggleSettingsVisible, () => SettingsVisible.Base);
    }

    public void CycleSelectedKey()
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, OverviewKey, ActivityKey, SettingsKey));

    // A tab's own look is a semibold caption over a primary line; the cycle takes the weight off, then recolours the line.
    public void CycleSelectionStyle()
        => SetLastChange(nameof(SelectionStyle), SelectionStyle = CycleValue(SelectionStyle, null,
            new UISelectionStyle(null, null, null, null, Bold: false),
            UISelectionStyle.Marked(UISelectionMark.Bottom, UIThemeColor.Accent),
            new UISelectionStyle(null, UIThemeColor.FromStyle(UIColorStyle.Primary), null, null, Bold: true)));

    // Off, the captions past the strip's room wrap onto the next line instead of going behind the "…" list.
    public void ToggleShowOverflow()
        => SetLastChange(nameof(ShowOverflow), ShowOverflow = !ShowOverflow);

    public void CycleOverviewIcon()
        => SetLastChange(nameof(OverviewIcon), OverviewIcon = CycleIconValue(OverviewIcon, DemoIcons.LayoutDashboard));

    public void CycleActivityBadge()
        => SetLastChange(nameof(ActivityBadge), ActivityBadge = CycleValue(ActivityBadge, "3", "12", null));

    // A hidden caption is drawn nowhere and skipped by the arrows, but the key still names its page.
    public void ToggleSettingsVisible()
        => SetLastChange(nameof(SettingsVisible), SettingsVisible = SettingsVisible.Base == UIVisibility.Collapsed
            ? UIVisibility.Visible
            : UIVisibility.Collapsed);
}

/// <summary>
/// One open document in a tabs view: the tab's own model plus the text its page shows, and whether it may be
/// closed from the strip at all.
/// </summary>
internal sealed partial class DemoDocumentItem : TabItem
{
    [RecursiveMember]
    public partial string? Body { get; set; }

    /// <summary>Where the document came from — a path, or an address for a page that is one.</summary>
    [RecursiveMember]
    public partial string? Address { get; set; }

    /// <summary>The part of the name a rename may not lose.</summary>
    [RecursiveMember(false)]
    public string Extension { get; init; } = string.Empty;

    /// <summary>The tab's own menu, one per document: the pin entry says what pressing it does, so its word follows <c>Pinned</c>.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Actions { get; } = [];
}

/// <summary>
/// A strip whose tabs come from a collection: which one is showing, and the two gestures the strip allows on
/// every tab at once.
/// </summary>
/// <remarks>The collection is the controller's, because the page's second section acts on one of its items.</remarks>
internal sealed partial class TabsViewGroupContext : DemoGroupContext
{
    public const string ReadmeKey = "readme";
    public const string ProgramKey = "program";
    public const string SettingsKey = "settings";

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = ReadmeKey;

    [RecursiveMember]
    public partial bool Renamable { get; set; } = true;

    [RecursiveMember]
    public partial bool Draggable { get; set; } = true;

    [RecursiveMember]
    public partial bool Removable { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowOverflow { get; set; } = true;

    public TabsViewGroupContext()
    {
        AddOption(nameof(SelectedKey), CycleSelectedKey, () => SelectedKey);
        AddOption(nameof(Renamable), ToggleRenamable, () => Renamable);
        AddOption(nameof(Draggable), ToggleDraggable, () => Draggable);
        AddOption(nameof(Removable), ToggleRemovable, () => Removable);
        AddOption(nameof(ShowOverflow), ToggleShowOverflow, () => ShowOverflow);
    }

    public void CycleSelectedKey()
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, ReadmeKey, ProgramKey, SettingsKey));

    public void ToggleRenamable()
        => SetLastChange(nameof(Renamable), Renamable = !Renamable);

    public void ToggleDraggable()
        => SetLastChange(nameof(Draggable), Draggable = !Draggable);

    // Off, no tab shows a close and the strip keeps no room for one.
    public void ToggleRemovable()
        => SetLastChange(nameof(Removable), Removable = !Removable);

    // Off, the captions past the strip's room wrap onto the next line instead of going behind the "…" list.
    public void ToggleShowOverflow()
        => SetLastChange(nameof(ShowOverflow), ShowOverflow = !ShowOverflow);
}

/// <summary>
/// The properties of one tab — the first one — driven from the page: whether it can be closed, where it sits,
/// and whether it is there at all.
/// </summary>
/// <remarks>Every row acts on the item; a drag writes <c>Order</c> back through it, so the row prints what the last drop left.</remarks>
internal sealed partial class TabsViewItemGroupContext : DemoGroupContext
{
    private readonly DemoDocumentItem _document;

    public TabsViewItemGroupContext(DemoDocumentItem document)
    {
        _document = document;

        AddOption(nameof(TabItem.CanRemove), ToggleCanRemove, () => _document.CanRemove);
        AddOption(nameof(TabItem.Pinned), TogglePinned, () => _document.Pinned);
        AddOption(nameof(TabItem.Order), CycleOrder, () => _document.Order);
        AddOption(nameof(TabItem.Visibility), ToggleVisible, () => _document.Visibility?.Base);
    }

    public void ToggleCanRemove()
        => SetLastChange(nameof(TabItem.CanRemove), _document.CanRemove = _document.CanRemove == false);

    // The pin is drawn, the close goes and a drag leaves the tab where it is; whether a close from elsewhere is refused is the controller's.
    public void TogglePinned()
        => SetLastChange(nameof(TabItem.Pinned), _document.Pinned = _document.Pinned != true);

    // The strip is sorted on the number, so the tab moves and nothing else is renumbered.
    public void CycleOrder()
        => SetLastChange(nameof(TabItem.Order), _document.Order = CycleValue(_document.Order, 1d, 2.5d, 4d));

    // Collapsed, not Hidden: an unopenable tab should leave no gap in the strip.
    public void ToggleVisible()
        => SetLastChange(nameof(TabItem.Visibility), _document.Visibility = _document.Visibility?.Base == UIVisibility.Collapsed
            ? UIVisibility.Visible
            : UIVisibility.Collapsed);
}
