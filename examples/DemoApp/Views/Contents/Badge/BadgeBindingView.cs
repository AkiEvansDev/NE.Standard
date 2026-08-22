using System.Collections.Generic;
using DemoApp.Controllers.Contents.Badge;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Badge;

internal sealed class BadgeBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.badge.binding";

    protected override string ComponentRoute => "/contents/badge";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.badge.header";
    protected override string HeaderDescription => "demo.contents.badge.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateStyleGroup())
            .AddChild(CreateContentGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new BadgeComponent()
            .SetText("Badge")
        );
    }

    private static ContainerComponent CreateStyleGroup()
    {
        return DemoUI.CreateGroup(nameof(BadgeBindingController.StyleGroup), "Style",
            content => content.AddChild(new BadgeComponent()
                .SetText("Status")
                .BindStyle(nameof(BadgeStyleGroupContext.Style), UIBindingScope.Relative)
                .BindColor(nameof(BadgeStyleGroupContext.Color), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Style"] = nameof(BadgeBindingController.CycleStyle),
                ["Color"] = nameof(BadgeBindingController.CycleColor),
            })
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(BadgeBindingController.ContentGroup), "Content",
            content => content.AddChild(new BadgeComponent()
                .SetText("Status")
                .BindIcon(nameof(BadgeContentGroupContext.Icon), UIBindingScope.Relative)
                .BindIconColor(nameof(BadgeContentGroupContext.IconColor), UIBindingScope.Relative)
                .BindIconSize(nameof(BadgeContentGroupContext.IconSize), UIBindingScope.Relative)
                .BindTextType(nameof(BadgeContentGroupContext.TextType), UIBindingScope.Relative)
                .BindTooltip(nameof(BadgeContentGroupContext.Tooltip), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Icon"] = nameof(BadgeBindingController.ToggleIcon),
                ["Icon style"] = nameof(BadgeBindingController.CycleIconColor),
                ["Icon size"] = nameof(BadgeBindingController.CycleIconSize),
                ["Text type"] = nameof(BadgeBindingController.CycleTextType),
                ["Tooltip"] = nameof(BadgeBindingController.ToggleTooltip),
            })
        );
    }
}
