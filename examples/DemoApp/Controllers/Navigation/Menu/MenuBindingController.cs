using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Navigation.Menu;

internal sealed partial class MenuGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIOrientation Orientation { get; set; } = UIOrientation.Vertical;

    [RecursiveMember]
    public partial bool Collapsed { get; set; }

    [RecursiveMember]
    public partial double Spacing { get; set; } = 2;

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Entries { get; } =
    [
        new MenuItem { Id = "workspace", Kind = UIMenuItemKind.Header, Title = "Workspace" },
        new MenuItem { Id = "overview", Title = "Overview", Icon = LucideIcons.LayoutDashboard, Selected = true, Shortcut = "Ctrl+Alt+O" },
        new MenuItem { Id = "services", Title = "Services", Icon = LucideIcons.Server, Shortcut = "Ctrl+Alt+S" },
        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
        new MenuItem { Id = "settings", Title = "Settings", Icon = LucideIcons.Settings, Shortcut = "Ctrl+Alt+G" }
    ];

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void ToggleCollapsed()
        => SetLastChange(nameof(Collapsed), Collapsed = !Collapsed);

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, 2d, 8d, 16d));

    /// <summary>
    /// Points a second entry at the first one's combination, so the rule can be watched rather than read
    /// about: with two claimants, Ctrl+Alt+O fires neither, and the console says which entries collided.
    /// </summary>
    public void ToggleShortcutClash()
    {
        MenuItem services = Entries[2];

        services.Shortcut = services.Shortcut == "Ctrl+Alt+O" ? "Ctrl+Alt+S" : "Ctrl+Alt+O";
        SetLastChange(nameof(MenuItem.Shortcut), services.Shortcut);
    }

    /// <summary>
    /// Moves the current mark to the next entry, which is what a menu's <c>Selected</c> actually tracks —
    /// a route change, not a click.
    /// </summary>
    public void SelectNext(string id)
    {
        foreach (MenuItem entry in Entries)
            entry.Selected = entry.Id == id;

        SetLastChange(nameof(MenuItem.Selected), id);
    }
}

internal sealed partial class MenuBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial MenuGroupContext MenuGroup { get; set; } = new();

    [UICommand]
    public void CycleOrientation()
        => MenuGroup.CycleOrientation();

    [UICommand]
    public void ToggleCollapsed()
        => MenuGroup.ToggleCollapsed();

    [UICommand]
    public void CycleSpacing()
        => MenuGroup.CycleSpacing();

    [UICommand]
    public void SelectEntry(string id)
        => MenuGroup.SelectNext(id);

    [UICommand]
    public void ToggleShortcutClash()
        => MenuGroup.ToggleShortcutClash();
}
