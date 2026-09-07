using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.Menu;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;

namespace DemoApp.Views.Navigation.Menu;

/// <summary>
/// One menu, and every property that can be bound to it.
/// </summary>
/// <remarks>Two panes: bound entries follow the controller, and only set entries can carry a nested group.</remarks>
internal sealed class MenuMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string MenuGroup = nameof(MenuMainController.MenuGroup);

    /// <summary>The set pane's id, which keys its collapsed state and open group in the browser.</summary>
    private const string SetMenuId = "demo-menu-preview";

    public static string ViewKey => "demo.navigation.menu.main";

    protected override string ComponentRoute => "/navigation/menu";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.navigation.menu.header";
    protected override string HeaderDescription => "demo.navigation.menu.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(600,
            ("Bound entries", frame => frame.AddChild(Bind(new MenuComponent())
                .BindItems($"{MenuGroup}.{nameof(MenuGroupContext.Entries)}")
                .OnItemClickWithItemKey(nameof(MenuMainController.Choose))
                .SetPlacement(1, 1, 24, 1)
            )),
            ("Set entries, with a group", frame => frame.AddChild(Bind(new MenuComponent(SetMenuId))
                .SetShowCollapseToggle(true)
                .SetItems(CreateSetEntries())
                .SetPlacement(1, 1, 24, 1)
            ))
        );

    private static MenuComponent Bind(MenuComponent menu)
        => menu
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindOrientation($"{MenuGroup}.{nameof(MenuGroupContext.Orientation)}")
            .BindSpacing($"{MenuGroup}.{nameof(MenuGroupContext.Spacing)}")
            .BindExpanded($"{MenuGroup}.{nameof(MenuGroupContext.Expanded)}")
            .BindSelectionStyle($"{MenuGroup}.{nameof(MenuGroupContext.SelectionStyle)}");

    /// <summary>
    /// The shape a sidebar has: a group open on the page it holds, one closed, and an entry outside both.
    /// </summary>
    private static MenuItem[] CreateSetEntries()
    {
        MenuItem environments = new()
        {
            Id = "environments",
            Title = "Environments",
            Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard),
            Expanded = true
        };

        environments.Items.Add(new MenuItem { Id = "production", Title = "Production", Selected = true });
        environments.Items.Add(new MenuItem { Id = "staging", Title = "Staging" });

        MenuItem access = new() { Id = "access", Title = "Access", Icon = DemoIcons.Outline(DemoIcons.Lock) };

        access.Items.Add(new MenuItem { Id = "members", Title = "Members", BadgeText = "8" });
        access.Items.Add(new MenuItem { Id = "tokens", Title = "Tokens" });

        return
        [
            environments,
            access,
            new MenuItem { Id = "billing", Title = "Billing", Icon = DemoIcons.Outline(DemoIcons.FileText) }
        ];
    }

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(MenuGroup, "Menu", nameof(MenuMainController.CycleMenuGroupOption))
        );
}
