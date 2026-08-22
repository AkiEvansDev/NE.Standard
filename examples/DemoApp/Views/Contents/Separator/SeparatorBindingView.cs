using System.Collections.Generic;
using DemoApp.Controllers.Contents.Separator;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Separator;

internal sealed class SeparatorBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.separator.binding";

    protected override string ComponentRoute => "/contents/separator";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.separator.header";
    protected override string HeaderDescription => "demo.contents.separator.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateOrientationGroup())
            .AddChild(CreateStyleGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new SeparatorComponent());

    private static ContainerComponent CreateOrientationGroup()
    {
        return DemoUI.CreateGroup(nameof(SeparatorBindingController.OrientationGroup), "Orientation",
            content => content.AddChild(new SeparatorComponent()
                .BindOrientation(nameof(SeparatorOrientationGroupContext.Orientation), UIBindingScope.Relative)
                .BindLabel(nameof(SeparatorOrientationGroupContext.Label), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Orientation"] = nameof(SeparatorBindingController.CycleOrientation),
                ["Label"] = nameof(SeparatorBindingController.ToggleLabel),
            })
        );
    }

    private static ContainerComponent CreateStyleGroup()
    {
        return DemoUI.CreateGroup(nameof(SeparatorBindingController.StyleGroup), "Style",
            content => content.AddChild(new SeparatorComponent()
                .SetLabel("Divider")
                .BindColor(nameof(SeparatorStyleGroupContext.Color), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Style"] = nameof(SeparatorBindingController.CycleStyle),
                ["Color"] = nameof(SeparatorBindingController.CycleColor),
            })
        );
    }
}
