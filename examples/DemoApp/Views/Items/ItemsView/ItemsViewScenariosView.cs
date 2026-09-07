using System.Collections.Generic;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Items.ItemsView;

/// <summary>
/// What a list does once it is too big to hold: a hundred thousand rows the server never sends whole, a
/// conversation read from its end backwards, and two thousand rows held whole but laid out thirty at a time.
/// </summary>
/// <remarks>What differs from the other pages is where the items come from, which is a story rather than a property.</remarks>
internal sealed class ItemsViewScenariosView : DemoScenariosView, IUIViewDefinition
{
    /// <summary>
    /// Id of the filter field the list's rule names; the rule resolves server-side, so the value must be bound.
    /// </summary>
    private const string RowsFilterId = "items-view-rows-filter";

    /// <summary>Id of the field the virtualized list's rule names; unbound, since the rule runs in the browser over the values it holds.</summary>
    private const string LocalFilterId = "items-view-local-filter";

    public static string ViewKey => "demo.items.items-view.scenarios";

    protected override string ComponentRoute => "/items/items-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.items.items-view.header";
    protected override string HeaderDescription => "demo.items.items-view.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateRowsGroup(), CreateLocalGroup()],
            [CreateChatGroup()]
        ));
    }

    private static ContainerComponent CreateRowsGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewScenariosController.RowsGroup), "100 000 rows, 50 at a time",
            content => content
                .AddChild(new TextInputComponent(RowsFilterId)
                    .SetTitle("Filter by title")
                    .BindValue(nameof(ItemsViewScenariosController.RowsFilter))
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new ItemsViewComponent()
                    .BindSource(nameof(ItemsViewScenariosController.Rows))
                    .SetWindowSize(50)
                    .FilterBy(RowsFilterId, IInputComponent.ValueProperty, nameof(DemoRowItem.Title))
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(260))
                    .SetTemplate(CreateRowTemplate())
                    .SetPlacement(1, 2, 24, 1)
                ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Jump to 50 000"] = nameof(ItemsViewScenariosController.JumpToMiddleAsync),
                ["Back to start"] = nameof(ItemsViewScenariosController.BackToStartAsync),
            }),
            contentMinHeight: 300,
            note: "Scroll, and the rows are read as they are reached. The filter field is bound because the rule is resolved on the server — an unbound value never leaves the browser."
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
        return DemoUI.CreateGroup(nameof(ItemsViewScenariosController.ChatGroup), "A conversation, read backwards",
            content => content.AddChild(new ItemsViewComponent(ItemsViewScenariosController.ChatViewId)
                .BindSource(nameof(ItemsViewScenariosController.Chat))
                .SetWindowSize(30)
                .VerticalScrollOnly()
                .AnchorToEnd()
                .SetSpacing(4)
                .SetHeight(UILayoutLength.Absolute(260))
                .SetTemplate(CreateMessageTemplate())
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Receive a message"] = nameof(ItemsViewScenariosController.ReceiveMessage),
                ["Jump to newest"] = nameof(ItemsViewScenariosController.JumpToNewest),
            }),
            contentMinHeight: 300,
            note: "The window is anchored at the end, so the newest message is what the reader lands on and older ones are read going up."
        );
    }

    /// <summary>
    /// A collection the client holds whole as values, drawing only the rows in view; its rules run over the values.
    /// </summary>
    private static ContainerComponent CreateLocalGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewScenariosController.LocalGroup), "2 000 rows held, 30 in the document",
            content => content
                .AddChild(new TextInputComponent(LocalFilterId)
                    .SetTitle("Filter by title")
                    .SetDebounceMilliseconds(150)
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(ItemsViewScenariosController.LocalRows))
                    .Virtualized()
                    .FilterBy(LocalFilterId, IInputComponent.ValueProperty, nameof(DemoRowItem.Title))
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(260))
                    .SetTemplate(CreateRowTemplate())
                    .SetPlacement(1, 2, 24, 1)
                ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add a row"] = nameof(ItemsViewScenariosController.AddLocalRow),
            }),
            contentMinHeight: 300,
            note: "The other half of the feature: the client holds every row's value and draws the rows as they come into view — a few dozen elements stand for two thousand. The filter runs over the values, not the rows."
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
