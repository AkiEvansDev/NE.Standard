using System.Collections.Generic;
using DemoApp.Controllers.Actions.CommandBar;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.CommandBar;

internal sealed class CommandBarBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.command-bar.binding";

    protected override string ComponentRoute => "/actions/command-bar";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.command-bar.header";
    protected override string HeaderDescription => "demo.actions.command-bar.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateCommandBarGroup())
            .AddChild(CreateItemsGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(CreateBar());

    private static ContainerComponent CreateCommandBarGroup()
    {
        return DemoUI.CreateGroup(nameof(CommandBarBindingController.CommandBarGroup), "Command bar",
            content => content.AddChild(CreateBar()

                // Bounded so a bound Wrap has something to wrap against.
                .SetMaxWidth(UILayoutLength.Absolute(300))
                .BindOrientation(nameof(CommandBarGroupContext.Orientation), UIBindingScope.Relative)
                .BindWrap(nameof(CommandBarGroupContext.Wrap), UIBindingScope.Relative)
                .BindSpacing(nameof(CommandBarGroupContext.Spacing), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Orientation"] = nameof(CommandBarBindingController.CycleOrientation),
                ["Wrap"] = nameof(CommandBarBindingController.ToggleWrap),
                ["Spacing"] = nameof(CommandBarBindingController.CycleSpacing),
            }),
            contentMinHeight: 200
        );
    }

    /// <summary>
    /// A bound <c>Items</c> collection, which renders client-side after attach rather than as server HTML —
    /// the path that exercises Insert/Remove and in-place item mutation.
    /// </summary>
    private static ContainerComponent CreateItemsGroup()
    {
        return DemoUI.CreateGroup(nameof(CommandBarBindingController.ItemsGroup), "Bound items",
            content => content.AddChild(new CommandBarComponent()
                .SetSpacing(8)
                .SetWrap(true)
                .BindItems(nameof(CommandBarItemsGroupContext.Items), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add"] = nameof(CommandBarBindingController.AddItem),
                ["Remove"] = nameof(CommandBarBindingController.RemoveItem),
                ["Rename last"] = nameof(CommandBarBindingController.RenameLast),
            }),
            contentMinHeight: 200
        );
    }

    private static CommandBarComponent CreateBar()
        => new CommandBarComponent()
            .SetItems(
            [
                new ButtonItem { Id = "save", Icon = LucideIcons.Save, Title = "Save", Type = UIButtonType.Primary },
                new ButtonItem { Id = "undo", Icon = LucideIcons.Undo, Title = "Undo", Type = UIButtonType.Outline },
                new ButtonItem { Id = "redo", Icon = LucideIcons.Redo, Title = "Redo", Type = UIButtonType.Outline },
                new ButtonItem { Id = "run", Icon = LucideIcons.Play, Title = "Run", Type = UIButtonType.Ghost },
            ]);
}
