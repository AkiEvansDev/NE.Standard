using DemoApp.Controllers.Actions.Action;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.Action;

internal sealed class ActionTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.action.test";

    protected override string ComponentRoute => "/actions/action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.action.header";
    protected override string HeaderDescription => "demo.actions.action.description";

    protected override void DrawContent(WrapPanelComponent container)
        => container.AddChild(CreateClickGroup());

    /// <summary>
    /// The whole point of the control is that the row itself is the command, so what this verifies is that a
    /// click anywhere across it — title, description or the trailing side — reaches the server.
    /// </summary>
    private static ContainerComponent CreateClickGroup()
    {
        return DemoUI.CreateGroup(nameof(ActionTestController.TestGroup), "Row click",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new ActionComponent()
                    .OnClick(nameof(ActionTestController.OpenDisplay))
                    .SetAction("Display", "Monitors, brightness, night light", LucideIcons.Monitor)
                    .SetTrailingText("2 monitors")
                )
                .AddChild(new ActionComponent()
                    .OnClick(nameof(ActionTestController.OpenStorage))
                    .SetAction("Storage", "Storage space, drives, configuration rules", LucideIcons.Database)
                )
            ),
            static _ => { }
        );
    }
}
