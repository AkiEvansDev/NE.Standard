using DemoApp.Controllers.Actions.CommandBar;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.CommandBar;

/// <summary>
/// Covers the one thing only a live click can prove: that an item-click command receives the right
/// argument. Both kinds resolve from the click site's own dynamic-parameter stack, so a mismatch between
/// the compiled binding and the rendered item shows up as a wrong value or a dispatch failure, never as a
/// build error.
/// </summary>
internal sealed class CommandBarTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.command-bar.test";

    protected override string ComponentRoute => "/actions/command-bar";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.command-bar.header";
    protected override string HeaderDescription => "demo.actions.command-bar.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateGroup(
                nameof(CommandBarTestController.ItemGroup),
                "Argument: the whole item",
                bar => bar.OnItemClickWithItem(nameof(CommandBarTestController.ClickWithItem))
            ))
            .AddChild(CreateGroup(
                nameof(CommandBarTestController.KeyGroup),
                "Argument: the item key",
                bar => bar.OnItemClickWithItemKey(nameof(CommandBarTestController.ClickWithKey))
            ));
    }

    private static ContainerComponent CreateGroup(string context, string title, System.Action<CommandBarComponent> configure)
    {
        return DemoUI.CreateGroup(context, title,
            content =>
            {
                CommandBarComponent bar = new CommandBarComponent()
                    .SetSpacing(8)
                    .SetWrap(true)
                    .BindItems(nameof(CommandBarArgumentGroupContext.Items), UIBindingScope.Relative)
                    .SetPlacement(1, 1, 24, 1);

                configure(bar);

                _ = content.AddChild(bar);
            },
            static _ => { },
            contentMinHeight: 120
        );
    }
}
