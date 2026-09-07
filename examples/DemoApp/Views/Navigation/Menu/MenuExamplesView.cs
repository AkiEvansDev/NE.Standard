using System.Collections.Generic;
using DemoApp.Controllers.Navigation.Menu;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Navigation.Menu;

/// <summary>
/// The places a menu is put, and the two things it is besides a list of pages: a list of commands, and the
/// panel a right-click opens.
/// </summary>
/// <remarks>A context menu is this same component, set on another through <c>SetContextMenu</c> rather than placed in the tree.</remarks>
internal sealed class MenuExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string SidebarGroup = nameof(MenuExamplesController.SidebarGroup);
    private const string TopBarGroup = nameof(MenuExamplesController.TopBarGroup);
    private const string CommandsGroup = nameof(MenuExamplesController.CommandsGroup);
    private const string ContextGroup = nameof(MenuExamplesController.ContextGroup);
    private const string FiltersGroup = nameof(MenuExamplesController.FiltersGroup);

    /// <summary>The sidebar's authored id, which keys its collapsed state and open section.</summary>
    private const string SidebarId = "demo-menu-examples-sidebar";

    public static string ViewKey => "demo.navigation.menu.examples";

    protected override string ComponentRoute => "/navigation/menu";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.navigation.menu.header";
    protected override string HeaderDescription => "demo.navigation.menu.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateSidebarGroup(), CreateCommandsGroup(), CreateFiltersGroup()],
            [CreateTopBarGroup(), CreateContextGroup(), CreateRowsGroup()]
        ));
    }

    /// <summary>
    /// This demo's own pages in sections that open and close, on a rail that folds to its icons. The entries are the controller's,
    /// and a section added live is a row the client builds, its sub-entries included.
    /// </summary>
    private static ContainerComponent CreateSidebarGroup()
    {
        return DemoUI.CreateGroup(SidebarGroup, "A sidebar with sections",
            content => content.AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(new MenuComponent(SidebarId)
                    .SetShowCollapseToggle(true)
                    .SetMinWidth(UILayoutLength.Absolute(200))
                    .BindItems(nameof(SidebarGroupContext.Entries), UIBindingScope.Relative)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add a section"] = nameof(MenuExamplesController.AddSection)
            })
        );
    }

    /// <summary>
    /// Entries that run something rather than go somewhere, each with the key that fires it without the menu.
    /// </summary>
    private static ContainerComponent CreateCommandsGroup()
    {
        return DemoUI.CreateGroup(CommandsGroup, "Commands, and the keys that fire them",
            content => content.AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(280))
                .SetContent(new MenuComponent()
                    .BindItems(nameof(MenuListGroupContext.Entries), UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(MenuExamplesController.Run))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// Settings as entries: a select shows its value and opens its choices beside it, a check turns in place. The same entries
    /// once as a list and once dropped from a button, since a filter bar is where they are usually found.
    /// </summary>
    private static ContainerComponent CreateFiltersGroup()
    {
        return DemoUI.CreateGroup(FiltersGroup, "Selects and checks",
            content => content
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(280))
                    .SetContent(new MenuComponent()
                        .BindItems(nameof(FiltersGroupContext.Entries), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(MenuExamplesController.Filter))
                    )
                    .SetPlacement(1, 1, 12, 1)
                )
                .AddChild(new SplitButtonComponent()
                    .SetMode(UISplitButtonMode.Menu)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Sliders))
                    .SetTitle("Filters")
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .BindItems(nameof(FiltersGroupContext.Entries), UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(MenuExamplesController.Filter))
                    .SetPlacement(13, 1, 12, 1)
                ),
            contentMinHeight: 260,
            note: "Kind = Select carries Value and its Items as the choices; Kind = Check carries Checked. Both click the entry command with their key, and the controller answers on the bound items."
        );
    }

    /// <summary>
    /// A row of pages across the top of a screen, with the current mark following the click.
    /// </summary>
    private static ContainerComponent CreateTopBarGroup()
    {
        return DemoUI.CreateGroup(TopBarGroup, "A bar across the top",
            content => content.AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(24)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .AddChild(new TextComponent()
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Payments API")
                        .SetTitleType(UITextAppearance.Subtitle)
                    )
                    .AddChild(new MenuComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        // No gap along a bar: the entries' hover grounds would show a sliver of the bar between them.
                        .SetSpacing(0)
                        .BindItems(nameof(MenuListGroupContext.Entries), UIBindingScope.Relative)
                        .OnItemClickWithItemKey(nameof(MenuExamplesController.Navigate))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A menu on one ordinary component, through one <c>SetContextMenu</c> and nothing placed in the tree.
    /// </summary>
    private static ContainerComponent CreateContextGroup()
    {
        return DemoUI.CreateGroup(ContextGroup, "As a context menu on one component",
            content => content.AddChild(new CardComponent()
                .SetPlacement(1, 1, 24, 1)
                .SetContextMenu(new MenuComponent().SetItems(
                [
                    new MenuItem { Id = "card-actions", Kind = UIMenuItemKind.Header, Title = "Card" },
                    new MenuItem { Id = "rename", Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                    new MenuItem { Id = "duplicate", Title = "Duplicate", Icon = DemoIcons.Outline(DemoIcons.Copy) }
                ]).SetSurface(UISurfaceStyle.Background).OnItemClickWithItemKey(nameof(MenuExamplesController.RunCardAction), "entry"))
                .SetContent(new TextComponent()
                    .SetTitle("Right-click this card")
                    .SetDescription("The menu is set on the card itself — it compiles with the card and opens where the pointer is; Surface = Background puts it on the page's ground.")
                )
            ),
            contentMinHeight: 120
        );
    }

    /// <summary>
    /// The menu lives in the row template, so it compiles once and still receives the row that was right-clicked.
    /// </summary>
    private static ContainerComponent CreateRowsGroup()
    {
        return DemoUI.CreateGroup(ContextGroup, "As a context menu on every row of a list",
            content => content.AddChild(new ItemsViewComponent()
                .BindItems(nameof(ContextMenuGroupContext.Deploys), UIBindingScope.Relative)
                .SetSpacing(8)
                .SetPlacement(1, 1, 24, 1)
                .SetTemplate(CreateRowTemplate())
            ),
            contentMinHeight: 160
        );
    }

    private static ActionComponent CreateRowTemplate()
    {
        return new ActionComponent()
            .SetTrailingText("right-click")
            .SetContextMenu(new MenuComponent()
                .SetItems(
                [
                    new MenuItem { Id = "promote", Title = "Promote to production", Icon = DemoIcons.Outline(DemoIcons.Upload) },
                    new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
                    new MenuItem { Id = "rollback", Title = "Roll back", Icon = DemoIcons.Outline(DemoIcons.Undo) }
                ])
                // Both scopes at once: Parent reaches past the menu's item scope to the row.
                .OnItemClick(
                    nameof(MenuExamplesController.Promote),
                    UIAction.ArgParent("row", nameof(DemoDeployItem.Id)),
                    UIAction.ArgCurrentItemKey("entry")
                )
            )
            .BindTitle(nameof(DemoDeployItem.Title), UIBindingScope.Relative);
    }
}
