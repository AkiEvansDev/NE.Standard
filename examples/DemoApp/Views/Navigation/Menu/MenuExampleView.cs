using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.Menu;

internal sealed class MenuExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.menu.example";

    protected override string ComponentRoute => "/navigation/menu";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.navigation.menu.header";
    protected override string HeaderDescription => "demo.navigation.menu.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateVerticalGroup())
            .AddChild(CreateCollapsedGroup())
            .AddChild(CreateSubEntriesGroup())
            .AddChild(CreateHorizontalGroup());
    }

    private static ContainerComponent CreateVerticalGroup()
    {
        return DemoUI.CreateGroup(null, "Vertical",
            content => content.AddChild(new MenuComponent()
                .SetItems(CreateItems("Ctrl+,"))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 260
        );
    }

    /// <summary>
    /// The same entries with <c>Collapsed</c> on: titles go, icons stay, and a caption becomes the rule it
    /// visually stood in for.
    /// </summary>
    private static ContainerComponent CreateCollapsedGroup()
    {
        return DemoUI.CreateGroup(null, "Collapsed",
            content => content.AddChild(new MenuComponent()
                .SetCollapsed(true)
                // Hugging its content, the way a collapsed sidebar actually sits: an entry fills its menu, so
                // a stretched collapsed menu would centre each icon across the whole panel.
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetItems(CreateItems())
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 260
        );
    }

    /// <summary>
    /// Sub-entries and the collapse switch, which are the same feature seen twice: expanded they open under
    /// their group and close the group that was open, collapsed they arrive as a panel beside the icon. Both
    /// states are the viewer's and are kept in the browser under the menu's own id.
    /// </summary>
    private static ContainerComponent CreateSubEntriesGroup()
    {
        return DemoUI.CreateGroup(null, "Sub-entries",
            content => content.AddChild(new MenuComponent("demo-menu-sub-entries")
                .SetShowCollapseToggle(true)
                .SetItems(CreateGroupedItems())
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 260
        );
    }

    private static ContainerComponent CreateHorizontalGroup()
    {
        return DemoUI.CreateGroup(null, "Horizontal",
            content => content.AddChild(new MenuComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetItems(CreateHorizontalItems())
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    // The collapsed copy takes no shortcuts: it is the same entries a second time, and two entries claiming
    // one combination void it — which would make this page demonstrate the collision rather than the label.
    private static MenuItem[] CreateItems(string? settingsShortcut = null)
        => [
            new MenuItem { Id = "workspace", Kind = UIMenuItemKind.Header, Title = "Workspace" },
            new MenuItem { Id = "overview", Title = "Overview", Icon = LucideIcons.LayoutDashboard, Url = "#", Selected = true },
            new MenuItem { Id = "services", Title = "Services", Icon = LucideIcons.Server, Url = "#" },
            new MenuItem { Id = "environments", Title = "Environments", Icon = LucideIcons.Boxes, Url = "#", BadgeText = "3" },
            new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
            new MenuItem { Id = "account", Kind = UIMenuItemKind.Header, Title = "Account" },
            new MenuItem { Id = "members", Title = "Members", Icon = LucideIcons.Users, Url = "#" },
            new MenuItem { Id = "settings", Title = "Settings", Icon = LucideIcons.Settings, Url = "#", Shortcut = settingsShortcut }
        ];

    // Sub-entries are ordinary entries: the same model, the same template, one step in. Only the entry that
    // holds them behaves differently — its click opens the group instead of going anywhere.
    private static MenuItem[] CreateGroupedItems()
    {
        MenuItem workspace = new() { Id = "g-workspace", Title = "Workspace", Icon = LucideIcons.LayoutDashboard };

        workspace.Items.Add(new MenuItem { Id = "g-overview", Title = "Overview", Url = "#", Selected = true });
        workspace.Items.Add(new MenuItem { Id = "g-services", Title = "Services", Url = "#" });
        workspace.Items.Add(new MenuItem { Id = "g-environments", Title = "Environments", Url = "#", BadgeText = "3" });

        MenuItem account = new() { Id = "g-account", Title = "Account", Icon = LucideIcons.Users };

        account.Items.Add(new MenuItem { Id = "g-members", Title = "Members", Url = "#" });
        account.Items.Add(new MenuItem { Id = "g-settings", Title = "Settings", Url = "#" });

        return [
            new MenuItem { Id = "g-home", Title = "Home", Icon = LucideIcons.Home, Url = "#" },
            workspace,
            account,
            new MenuItem { Id = "g-help", Title = "Help", Icon = LucideIcons.Help, Url = "#" }
        ];
    }

    private static MenuItem[] CreateHorizontalItems()
        => [
            new MenuItem { Id = "h-overview", Title = "Overview", Url = "#", Selected = true },
            new MenuItem { Id = "h-members", Title = "Members", Url = "#" },
            new MenuItem { Id = "h-services", Title = "Services", Url = "#" },
            new MenuItem { Id = "h-rule", Kind = UIMenuItemKind.Separator },
            new MenuItem { Id = "h-settings", Title = "Settings", Icon = LucideIcons.Settings, Url = "#" }
        ];
}
