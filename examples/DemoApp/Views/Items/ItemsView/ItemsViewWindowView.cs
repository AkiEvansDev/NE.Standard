using System.Collections.Generic;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Items.ItemsView;

/// <summary>
/// The two shapes of a windowed source, which is the only thing that proves it: a hundred thousand rows the
/// server never sends whole, and a conversation read from its end backwards.
/// </summary>
internal sealed class ItemsViewWindowView : DemoWindowView, IUIViewDefinition
{
    public static string ViewKey => "demo.items.items-view.window";

    protected override string ComponentRoute => "/items/items-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test, DemoViewKind.Window];
    protected override string Header => "demo.items.items-view.header";
    protected override string HeaderDescription => "demo.items.items-view.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateRowsGroup())
            .AddChild(CreateChatGroup())
            .AddChild(CreateLocalGroup());
    }

    /// <summary>
    /// Id of the filter field, which the list's rule names. The rule is resolved on the server, so the field's
    /// value has to be bound — an unbound one lives in the browser and the source would never hear of it.
    /// </summary>
    private const string RowsFilterId = "items-window-rows-filter";

    private static ContainerComponent CreateRowsGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewWindowController.RowsGroup), "100 000 rows, 50 at a time",
            content => content
                .AddChild(new TextInputComponent(RowsFilterId)
                    .SetTitle("Filter by title")
                    .BindValue(nameof(ItemsViewWindowController.RowsFilter))
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new ItemsViewComponent()
                    .BindSource(nameof(ItemsViewWindowController.Rows))
                    .SetWindowSize(50)
                    .FilterBy(RowsFilterId, IInputComponent.ValueProperty, nameof(DemoRowItem.Title))
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(260))
                    .SetItemTemplate(CreateRowTemplate())
                    .SetPlacement(1, 2, 24, 1)
                ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Jump to 50 000"] = nameof(ItemsViewWindowController.JumpToMiddleAsync),
                ["Back to start"] = nameof(ItemsViewWindowController.BackToStartAsync),
            }),
            contentMinHeight: 300
        );
    }

    private static StackPanelComponent CreateRowTemplate()
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(12)
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoRowItem.Title), UIBindingScope.Relative)
                .SetWidth(UILayoutLength.Absolute(120))
                .SetMargin(UIThickness.All(8, 4, 0, 4))
            )
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoRowItem.Detail), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetMargin(UIThickness.All(0, 4, 8, 4))
            );
    }

    private static ContainerComponent CreateChatGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewWindowController.ChatGroup), "A conversation, read backwards",
            content => content.AddChild(new ItemsViewComponent(ItemsViewWindowController.ChatViewId)
                .BindSource(nameof(ItemsViewWindowController.Chat))
                .SetWindowSize(30)
                .VerticalScrollOnly()
                .AnchorToEnd()
                .SetSpacing(4)
                .SetHeight(UILayoutLength.Absolute(260))
                .SetItemTemplate(CreateMessageTemplate())
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Receive a message"] = nameof(ItemsViewWindowController.ReceiveMessage),
                ["Jump to newest"] = nameof(ItemsViewWindowController.JumpToNewest),
            }),
            contentMinHeight: 300
        );
    }

    /// <summary>
    /// The other half of the feature: a collection the client already holds whole, where virtualization saves
    /// the layout rather than the transfer.
    /// </summary>
    private static ContainerComponent CreateLocalGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewWindowController.LocalGroup), "2 000 rows held, 30 laid out",
            content => content.AddChild(new ItemsViewComponent()
                .BindItems(nameof(ItemsViewWindowController.LocalRows))
                .Virtualized()
                .VerticalScrollOnly()
                .SetHeight(UILayoutLength.Absolute(260))
                .SetItemTemplate(CreateRowTemplate())
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add a row"] = nameof(ItemsViewWindowController.AddLocalRow),
            }),
            contentMinHeight: 300
        );
    }

    private static StackPanelComponent CreateMessageTemplate()
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetMargin(UIThickness.All(8, 2, 8, 2))
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoChatMessage.Author), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            )
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoChatMessage.Text), UIBindingScope.Relative)
            );
    }
}
