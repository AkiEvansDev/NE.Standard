using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Items.ItemsView;

internal sealed class ItemsViewExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.items.items-view.example";

    protected override string ComponentRoute => "/items/items-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test, DemoViewKind.Window];
    protected override string Header => "demo.items.items-view.header";
    protected override string HeaderDescription => "demo.items.items-view.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateStaticListGroup())
            .AddChild(CreateWrapGroup());
    }

    private static ContainerComponent CreateStaticListGroup()
    {
        return DemoUI.CreateGroup(null, "Static items (vertical)",
            content => content.AddChild(new ItemsViewComponent()
                .SetSpacing(8)
                .SetWidth(UILayoutLength.Absolute(320))
                .AddItem(new TextItem
                {
                    Id = "note-1",
                    Icon = LucideIcons.Bell,
                    Title = "New message",
                    Description = "You have unread notifications."
                })
                .AddItem(new TextItem
                {
                    Id = "note-2",
                    Icon = LucideIcons.Shield,
                    Title = "Two-factor auth",
                    Description = "Adds an extra layer of security.",
                    BadgeText = "Recommended",
                    BadgeStyle = UIBadgeType.Info
                })
                .AddItem(new TextItem
                {
                    Id = "note-3",
                    Icon = LucideIcons.Star,
                    Title = "Release 2.4",
                    Description = "New features are available.",
                    BadgeText = "New",
                    BadgeStyle = UIBadgeType.Success
                })
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    private static ContainerComponent CreateWrapGroup()
    {
        return DemoUI.CreateGroup(null, "Wrapping layout",
            content => content.AddChild(new ItemsViewComponent()
                .SetLayoutType(UIItemsLayoutType.Wrap)
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .AddItem(new TextItem { Id = "tag-1", Title = "Design" })
                .AddItem(new TextItem { Id = "tag-2", Title = "Engineering" })
                .AddItem(new TextItem { Id = "tag-3", Title = "Product" })
                .AddItem(new TextItem { Id = "tag-4", Title = "Marketing" })
                .AddItem(new TextItem { Id = "tag-5", Title = "Support" })
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }
}
