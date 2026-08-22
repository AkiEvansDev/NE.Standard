using System.Collections.Generic;
using DemoApp.Controllers.Layouts.StackPanel;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.StackPanel;

internal sealed class StackPanelBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.stack-panel.binding";

    protected override string ComponentRoute => "/layouts/stack-panel";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.layouts.stack-panel.header";
    protected override string HeaderDescription => "demo.layouts.stack-panel.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateStackPanelGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new StackPanelComponent()
            .SetSpacing(8)
            .AddChild(CreateMarkerBox())
            .AddChild(CreateMarkerBox())
            .AddChild(CreateMarkerBox())
        );
    }

    private static ContainerComponent CreateStackPanelGroup()
    {
        return DemoUI.CreateGroup(nameof(StackPanelBindingController.StackPanelGroup), "Stack panel",
            // The outline is what makes Wrap and Overflow legible: without it the panel's 300px edge is
            // invisible, so a box being clipped, wrapped or shrunk all look the same. The padding is part of
            // the same point — flush against the boxes the outline has nothing to show.
            content => content.AddChild(new StackPanelComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetPadding(UIThickness.Uniform(8))
                .SetBorderThickness(UIThickness.Uniform(1))
                .SetBorderColor(UIThemeColor.Border)
                .SetHorizontalAlignment(UIAlignment.Center)
                .BindOrientation(nameof(StackPanelGroupContext.Orientation), UIBindingScope.Relative)
                .BindSpacing(nameof(StackPanelGroupContext.Spacing), UIBindingScope.Relative)
                .BindWrap(nameof(StackPanelGroupContext.Wrap), UIBindingScope.Relative)
                .BindOverflow(nameof(StackPanelGroupContext.Overflow), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateMarkerBox())
                .AddChild(CreateMarkerBox())
                .AddChild(CreateMarkerBox())
                .AddChild(CreateMarkerBox())
                .AddChild(CreateMarkerBox())
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Orientation"] = nameof(StackPanelBindingController.CycleOrientation),
                ["Spacing"] = nameof(StackPanelBindingController.CycleSpacing),
                ["Wrap"] = nameof(StackPanelBindingController.ToggleWrap),
                ["Overflow"] = nameof(StackPanelBindingController.CycleOverflow),
            })
        );
    }

    private static ContainerComponent CreateMarkerBox()
        => new ContainerComponent()
            .SetBackground(UIThemeColor.Accent)
            .SetMinWidth(UILayoutLength.Absolute(60))
            .SetMinHeight(UILayoutLength.Absolute(40));
}
