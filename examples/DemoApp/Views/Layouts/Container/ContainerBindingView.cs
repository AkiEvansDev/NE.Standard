using System.Collections.Generic;
using DemoApp.Controllers.Layouts.Container;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.Container;

internal sealed class ContainerBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.container.binding";

    protected override string ComponentRoute => "/layouts/container";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Binding];
    protected override string Header => "demo.layouts.container.header";
    protected override string HeaderDescription => "demo.layouts.container.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateContainerGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new ContainerComponent()
            .SetBackground(UIThemeColor.Primary)
            .SetMinWidth(UILayoutLength.Absolute(24))
            .SetMinHeight(UILayoutLength.Absolute(24))
        );
    }

    private static ContainerComponent CreateContainerGroup()
    {
        return DemoUI.CreateGroup(nameof(ContainerBindingController.ContainerGroup), "Container",
            // An explicit height, because nothing below it has one: the group's content box is an auto row,
            // and a container sizes to its children, so the whole preview collapsed to the thickness of its
            // own border and the placement being cycled had nothing to move inside.
            content => content.AddChild(new ContainerComponent()
                .SetHeight(UILayoutLength.Absolute(176))
                .SetBorderThickness(UIThickness.Uniform(1))
                .SetBorderColor(UIThemeColor.Border)
                .AddRow(UIGridUnit.Star())
                .SetPlacement(1, 1, 24, 1)
                .BindPadding(nameof(ContainerGroupContext.Padding), UIBindingScope.Relative)
                .AddChild(new ContainerComponent()
                    .BindBackground(nameof(ContainerGroupContext.Background), UIBindingScope.Relative)
                    .BindBorderColor(nameof(ContainerGroupContext.BorderColor), UIBindingScope.Relative)
                    .BindBorderThickness(nameof(ContainerGroupContext.BorderThickness), UIBindingScope.Relative)
                    .BindBorderRadius(nameof(ContainerGroupContext.BorderRadius), UIBindingScope.Relative)
                    .BindPlacement(nameof(ContainerGroupContext.Placement), UIBindingScope.Relative)
                )
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Placement"] = nameof(ContainerBindingController.CyclePlacement),
                ["Padding"] = nameof(ContainerBindingController.CyclePadding),
                ["Background"] = nameof(ContainerBindingController.CycleBackground),
                ["Border color"] = nameof(ContainerBindingController.CycleBorderColor),
                ["Border thickness"] = nameof(ContainerBindingController.CycleBorderThickness),
                ["Border radius"] = nameof(ContainerBindingController.CycleBorderRadius),
            })
        );
    }
}
