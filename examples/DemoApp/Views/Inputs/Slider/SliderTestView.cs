using System.Collections.Generic;
using DemoApp.Controllers.Inputs.Slider;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Slider;

/// <summary>
/// One scenario, and it is the one that cannot be seen in markup: a controller pushing a value outside
/// the slider's bounds. The browser clamps a range input silently, so what has to be checked here is that
/// the clamped value comes back — press "Push 500", then "What does the server hold?" and the answer must
/// be the maximum, not 500.
/// </summary>
internal sealed class SliderTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.slider.test";

    protected override string ComponentRoute => "/inputs/slider";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.slider.header";
    protected override string HeaderDescription => "demo.inputs.slider.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChild(CreateClampGroup());

    private static ContainerComponent CreateClampGroup()
    {
        return DemoUI.CreateGroup(nameof(SliderTestController.ClampGroup), "Out-of-range value",
            content => content.AddChild(new SliderComponent()
                .SetRange(1, 16)
                .SetStep(1)
                .SetShowValue()
                .SetShowRange()
                .BindValue(nameof(SliderClampGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(SliderTestController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Push 500"] = nameof(SliderTestController.PushAbove),
                ["Push -40"] = nameof(SliderTestController.PushBelow),
                ["What does the server hold?"] = nameof(SliderTestController.RecordChange),
            }),
            contentMinHeight: 150
        );
    }
}
