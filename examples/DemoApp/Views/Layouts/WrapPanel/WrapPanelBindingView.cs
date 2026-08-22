using System.Collections.Generic;
using DemoApp.Controllers.Layouts.WrapPanel;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.WrapPanel;

internal sealed class WrapPanelBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.wrap-panel.binding";

    protected override string ComponentRoute => "/layouts/wrap-panel";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.layouts.wrap-panel.header";
    protected override string HeaderDescription => "demo.layouts.wrap-panel.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateWrapPanelGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new WrapPanelComponent()
            .AddChild(CreateMarkerBox())
            .AddChild(CreateMarkerBox())
            .AddChild(CreateMarkerBox())
        );
    }

    private static ContainerComponent CreateWrapPanelGroup()
    {
        return DemoUI.CreateGroup(nameof(WrapPanelBindingController.WrapPanelGroup), "Wrap panel",
            content => content.AddChild(new WrapPanelComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .BindHorizontalGap(nameof(WrapPanelGroupContext.HorizontalGap), UIBindingScope.Relative)
                .BindVerticalGap(nameof(WrapPanelGroupContext.VerticalGap), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateMarkerBox())
                .AddChild(CreateMarkerBox())
                .AddChild(CreateMarkerBox())
                .AddChild(CreateMarkerBox())
                .AddChild(CreateMarkerBox())
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Horizontal gap"] = nameof(WrapPanelBindingController.CycleHorizontalGap),
                ["Vertical gap"] = nameof(WrapPanelBindingController.CycleVerticalGap),
            })
        );
    }

    private static ContainerComponent CreateMarkerBox()
        => new ContainerComponent()
            .SetBackground(UIThemeColor.Accent)
            .SetMinWidth(UILayoutLength.Absolute(60))
            .SetMinHeight(UILayoutLength.Absolute(40));
}
