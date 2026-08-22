using System.Collections.Generic;
using DemoApp.Controllers.Contents.Icon;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Icon;

internal sealed class IconBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.icon.binding";

    protected override string ComponentRoute => "/contents/icon";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.icon.header";
    protected override string HeaderDescription => "demo.contents.icon.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateStyleGroup())
            .AddChild(CreateContentGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new IconComponent()
            .SetIcon(LucideIcons.Star)
            .SetSize(UIIconSize.Large)
        );
    }

    private static ContainerComponent CreateStyleGroup()
    {
        return DemoUI.CreateGroup(nameof(IconBindingController.StyleGroup), "Style",
            content => content.AddChild(new IconComponent()
                .SetIcon(LucideIcons.Star)
                .BindColor(nameof(IconStyleGroupContext.Color), UIBindingScope.Relative)
                .BindSize(nameof(IconStyleGroupContext.Size), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Style"] = nameof(IconBindingController.CycleStyle),
                ["Size"] = nameof(IconBindingController.CycleSize),
            })
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(IconBindingController.ContentGroup), "Content",
            content => content.AddChild(new IconComponent()
                .SetSize(UIIconSize.Large)
                .BindIcon(nameof(IconContentGroupContext.Icon), UIBindingScope.Relative)
                .BindTooltip(nameof(IconContentGroupContext.Tooltip), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Icon"] = nameof(IconBindingController.CycleIcon),
                ["Tooltip"] = nameof(IconBindingController.ToggleTooltip),
            })
        );
    }
}
