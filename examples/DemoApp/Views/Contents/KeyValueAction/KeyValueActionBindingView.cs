using System.Collections.Generic;
using DemoApp.Controllers.Contents.KeyValueAction;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.KeyValueAction;

internal sealed class KeyValueActionBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.key-value-action.binding";

    protected override string ComponentRoute => "/contents/key-value-action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.contents.key-value-action.header";
    protected override string HeaderDescription => "demo.contents.key-value-action.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateRowGroup())
            .AddChild(CreateItemsGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(CreateList());

    private static ContainerComponent CreateRowGroup()
    {
        return DemoUI.CreateGroup(nameof(KeyValueActionBindingController.RowGroup), "Rows",
            content => content.AddChild(CreateList()
                .BindShowRowSeparators(nameof(KeyValueActionRowGroupContext.ShowRowSeparators), UIBindingScope.Relative)
                .BindStretchValue(nameof(KeyValueActionRowGroupContext.StretchValue), UIBindingScope.Relative)
                .BindShowActions(nameof(KeyValueActionRowGroupContext.ShowActions), UIBindingScope.Relative)
                .BindShowBorder(nameof(KeyValueActionRowGroupContext.ShowBorder), UIBindingScope.Relative)
                .BindRowHoverable(nameof(KeyValueActionRowGroupContext.RowHoverable), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Separators"] = nameof(KeyValueActionBindingController.ToggleShowRowSeparators),
                ["Stretch value"] = nameof(KeyValueActionBindingController.ToggleStretchValue),
                ["Actions"] = nameof(KeyValueActionBindingController.ToggleShowActions),
                ["Border"] = nameof(KeyValueActionBindingController.ToggleShowBorder),
                ["Row hover"] = nameof(KeyValueActionBindingController.ToggleRowHoverable),
            }),
            contentMinHeight: 220
        );
    }

    /// <summary>
    /// A bound <c>Items</c> collection, which renders client-side after attach rather than as server HTML.
    /// One row is composed from four separate templates there (row/key/value/action), so this is the group
    /// that proves the composition, not just the collection plumbing.
    /// </summary>
    private static ContainerComponent CreateItemsGroup()
    {
        return DemoUI.CreateGroup(nameof(KeyValueActionBindingController.ItemsGroup), "Bound items",
            content => content.AddChild(new KeyValueActionComponent()
                .SetRowHoverable(true)
                .BindItems(nameof(KeyValueActionItemsGroupContext.Items), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add"] = nameof(KeyValueActionBindingController.AddItem),
                ["Remove"] = nameof(KeyValueActionBindingController.RemoveItem),
                ["Rename last"] = nameof(KeyValueActionBindingController.RenameLast),
            }),
            contentMinHeight: 220
        );
    }

    private static KeyValueActionComponent CreateList()
        => new KeyValueActionComponent()
            .SetItems(
            [
                Row("commit", "Commit", "a079856", LucideIcons.Copy),
                Row("branch", "Branch", "master", LucideIcons.ExternalLink),
                Row("duration", "Duration", "4 m 12 s", LucideIcons.History),
            ]);

    private static KeyValueActionItem Row(string id, string key, string value, string actionIcon)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value },
            Action = new ButtonItem { Id = id, Icon = actionIcon, Type = UIButtonType.Ghost }
        };
}
