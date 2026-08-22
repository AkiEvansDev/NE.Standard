using System.Collections.Generic;
using DemoApp.Controllers.Navigation.Menu;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.Menu;

internal sealed class MenuBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.menu.binding";

    protected override string ComponentRoute => "/navigation/menu";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.navigation.menu.header";
    protected override string HeaderDescription => "demo.navigation.menu.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateMenuGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new MenuComponent().SetItems(CreateEntries()));

    /// <summary>
    /// The entries are bound rather than declared, so this is also where a menu built from controller state
    /// is exercised: the click command moves <c>Selected</c> server-side and every entry re-renders from it.
    /// </summary>
    private static ContainerComponent CreateMenuGroup()
    {
        return DemoUI.CreateGroup(nameof(MenuBindingController.MenuGroup), "Menu",
            content => content.AddChild(new MenuComponent()
                .BindItems(nameof(MenuGroupContext.Entries), UIBindingScope.Relative)
                .BindOrientation(nameof(MenuGroupContext.Orientation), UIBindingScope.Relative)
                .BindCollapsed(nameof(MenuGroupContext.Collapsed), UIBindingScope.Relative)
                .BindSpacing(nameof(MenuGroupContext.Spacing), UIBindingScope.Relative)
                .OnItemClickWithItemKey(nameof(MenuBindingController.SelectEntry))
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Orientation"] = nameof(MenuBindingController.CycleOrientation),
                ["Collapsed"] = nameof(MenuBindingController.ToggleCollapsed),
                ["Spacing"] = nameof(MenuBindingController.CycleSpacing),
                ["Shortcut clash"] = nameof(MenuBindingController.ToggleShortcutClash),
            })
        );
    }

    private static NE.Standard.UI.Components.BuiltIns.Models.MenuItem[] CreateEntries()
        => [
            new() { Id = "overview", Title = "Overview", Selected = true },
            new() { Id = "services", Title = "Services" }
        ];
}
