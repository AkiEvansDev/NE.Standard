using System.Collections.Generic;
using DemoApp.Controllers.Actions.Button;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.Button;

internal sealed class ButtonBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.button.binding";

    protected override string ComponentRoute => "/actions/button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.button.header";
    protected override string HeaderDescription => "demo.actions.button.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateStyleGroup())
            .AddChild(CreateContentGroup())
            .AddChild(CreateBadgeGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new ButtonComponent()
            .ConfigureDefaultContent(c => c.SetTitle("Button"))
        );
    }

    private static ContainerComponent CreateStyleGroup()
    {
        return DemoUI.CreateGroup(nameof(ButtonBindingController.StyleGroup), "Style",
            content => content.AddChild(new ButtonComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .BindType(nameof(ButtonStyleGroupContext.Type), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
                .ConfigureDefaultContent(c => c
                    .SetTitle("Button label")
                    .SetDescription("Supporting caption")
                    .BindTextAlignment(nameof(ButtonStyleGroupContext.TextAlignment), UIBindingScope.Relative)
                )
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Type"] = nameof(ButtonBindingController.CycleType),
                ["Text align"] = nameof(ButtonBindingController.CycleTextAlignment),
            })
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(ButtonBindingController.ContentGroup), "Content",
            content => content.AddChild(new ButtonComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 24, 1)
                .ConfigureDefaultContent(c => c
                    .SetTitle("Button label")
                    .BindIcon(nameof(ButtonContentGroupContext.Icon), UIBindingScope.Relative)
                    .BindIconSize(nameof(ButtonContentGroupContext.IconSize), UIBindingScope.Relative)
                    .BindDescription(nameof(ButtonContentGroupContext.Description), UIBindingScope.Relative)
                    .BindSelectable(nameof(ButtonContentGroupContext.Selectable), UIBindingScope.Relative)
                )
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Icon"] = nameof(ButtonBindingController.ToggleIcon),
                ["Icon size"] = nameof(ButtonBindingController.CycleIconSize),
                ["Description"] = nameof(ButtonBindingController.ToggleDescription),
                ["Selectable"] = nameof(ButtonBindingController.ToggleSelectable),
            })
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(ButtonBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new ButtonComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 24, 1)
                .ConfigureDefaultContent(c => c
                    .SetTitle("Button label")
                    .SetBadgeText("New")
                    .BindBadgePlacement(nameof(ButtonBadgeGroupContext.BadgePlacement), UIBindingScope.Relative)
                    .BindBadgeStyle(nameof(ButtonBadgeGroupContext.BadgeStyle), UIBindingScope.Relative)
                    .BindBadgeIcon(nameof(ButtonBadgeGroupContext.BadgeIcon), UIBindingScope.Relative)
                )
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Badge placement"] = nameof(ButtonBindingController.CycleBadgePlacement),
                ["Badge style"] = nameof(ButtonBindingController.CycleBadgeStyle),
                ["Badge icon"] = nameof(ButtonBindingController.ToggleBadgeIcon),
            })
        );
    }
}
