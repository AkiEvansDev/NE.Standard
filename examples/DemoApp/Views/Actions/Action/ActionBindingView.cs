using System.Collections.Generic;
using DemoApp.Controllers.Actions.Action;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.Action;

internal sealed class ActionBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.action.binding";

    protected override string ComponentRoute => "/actions/action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.action.header";
    protected override string HeaderDescription => "demo.actions.action.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateTrailingGroup())
            .AddChild(CreateContentGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new ActionComponent()
            .SetAction("Action", "Row description")
        );
    }

    private static ContainerComponent CreateTrailingGroup()
    {
        return DemoUI.CreateGroup(nameof(ActionBindingController.TrailingGroup), "Trailing",
            content => content.AddChild(new ActionComponent()
                .SetAction("Time zone", "The right-hand side is what makes it an action")
                .SetPlacement(1, 1, 24, 1)
                .BindTrailingText(nameof(ActionTrailingGroupContext.TrailingText), UIBindingScope.Relative)
                .BindTrailingIcon(nameof(ActionTrailingGroupContext.TrailingIcon), UIBindingScope.Relative)
                .BindType(nameof(ActionTrailingGroupContext.Type), UIBindingScope.Relative)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Trailing text"] = nameof(ActionBindingController.ToggleTrailingText),
                ["Trailing icon"] = nameof(ActionBindingController.ToggleTrailingIcon),
                ["Type"] = nameof(ActionBindingController.CycleType),
            })
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(ActionBindingController.ContentGroup), "Content",
            content => content.AddChild(new ActionComponent()
                .SetPlacement(1, 1, 24, 1)
                .ConfigureDefaultContent(c => c
                    .SetTitle("Display")
                    .BindIcon(nameof(ActionContentGroupContext.Icon), UIBindingScope.Relative)
                    .BindDescription(nameof(ActionContentGroupContext.Description), UIBindingScope.Relative)
                )
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Icon"] = nameof(ActionBindingController.ToggleIcon),
                ["Description"] = nameof(ActionBindingController.ToggleDescription),
            })
        );
    }
}
