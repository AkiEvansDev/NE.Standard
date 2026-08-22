using DemoApp.Controllers.Navigation.ContextMenu;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.ContextMenu;

internal sealed class ContextMenuTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.context-menu.test";

    protected override string ComponentRoute => "/navigation/context-menu";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Test];
    protected override string Header => "demo.navigation.context-menu.header";
    protected override string HeaderDescription => "demo.navigation.context-menu.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateSingleGroup())
            .AddChild(CreateRowGroup());
    }

    /// <summary>
    /// A menu on one ordinary component — the whole authoring cost is one <c>SetContextMenu</c>.
    /// </summary>
    private static ContainerComponent CreateSingleGroup()
    {
        return DemoUI.CreateGroup(nameof(ContextMenuTestController.TestGroup), "On a single component",
            content => content.AddChild(new CardComponent()
                .SetPlacement(1, 1, 24, 1)
                .SetContextMenu(new MenuComponent().SetItems(
                [
                    new MenuItem { Id = "card-actions", Kind = UIMenuItemKind.Header, Title = "Card" },
                    new MenuItem { Id = "rename", Title = "Rename", Icon = LucideIcons.Edit },
                    new MenuItem { Id = "duplicate", Title = "Duplicate", Icon = LucideIcons.Copy }
                ]).OnItemClickWithItemKey(nameof(ContextMenuTestController.Rename)))
                .SetContent(new TextComponent()
                    .SetTitle("Right-click this card")
                    .SetDescription("The menu is a MenuComponent set on the card itself — nothing is placed in the tree.")
                )
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    /// <summary>
    /// The case the design was chosen for: the menu lives in the row template, so it compiles once and its
    /// commands still receive the row that was actually right-clicked.
    /// </summary>
    private static ContainerComponent CreateRowGroup()
    {
        return DemoUI.CreateGroup(nameof(ContextMenuTestController.TestGroup), "On every row of a list",
            content => content.AddChild(new ItemsViewComponent()
                .BindItems(nameof(ContextMenuTestGroupContext.Deploys), UIBindingScope.Relative)
                .SetSpacing(8)
                .SetPlacement(1, 1, 24, 1)
                .SetItemTemplate(CreateRowTemplate())
            ),
            static _ => { },
            contentMinHeight: 200
        );
    }

    private static ActionComponent CreateRowTemplate()
    {
        return new ActionComponent()
            .SetTrailingText("right-click")
            .SetContextMenu(new MenuComponent()
                .SetItems(
                [
                    new MenuItem { Id = "promote", Title = "Promote to production", Icon = LucideIcons.Upload },
                    new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
                    new MenuItem { Id = "rollback", Title = "Roll back", Icon = LucideIcons.Undo }
                ])
                // Both scopes at once: Parent reaches past the menu's own item scope to the row, while the
                // entry's key comes from the click site itself.
                .OnItemClick(
                    nameof(ContextMenuTestController.Promote),
                    UIAction.ArgParent("row", nameof(DemoDeployItem.Id)),
                    UIAction.ArgCurrentItemKey("entry")
                )
            )
            .ConfigureDefaultContent(c => _ = c.BindTitle(nameof(DemoDeployItem.Title), UIBindingScope.Relative));
    }
}
