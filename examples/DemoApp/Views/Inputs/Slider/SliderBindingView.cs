using System.Collections.Generic;
using DemoApp.Controllers.Inputs.Slider;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Slider;

internal sealed class SliderBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.slider.binding";

    protected override string ComponentRoute => "/inputs/slider";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.slider.header";
    protected override string HeaderDescription => "demo.inputs.slider.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateValueGroup())
            .AddChild(CreateRangeGroup())
            .AddChild(CreateReadoutGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new SliderComponent().SetValue(40).SetShowValue());

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(SliderBindingController.ValueGroup), "Value",
            content => content.AddChild(new SliderComponent()
                .SetShowValue()
                .BindValue(nameof(SliderValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(SliderValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(SliderBindingController.CycleValue),
                ["Read-only"] = nameof(SliderBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 120
        );
    }

    /// <summary>
    /// Min/Max/Step are live-patched here, unlike <c>NumberInputComponent</c>'s, which its renderer
    /// resolves once for the stepper buttons — so cycling them there would do nothing and this group has
    /// no counterpart on that page.
    /// </summary>
    private static ContainerComponent CreateRangeGroup()
    {
        return DemoUI.CreateGroup(nameof(SliderBindingController.RangeGroup), "Range",
            content => content.AddChild(new SliderComponent()
                .SetValue(40)
                .SetShowValue()
                .SetShowRange()
                .BindMin(nameof(SliderRangeGroupContext.Min), UIBindingScope.Relative)
                .BindMax(nameof(SliderRangeGroupContext.Max), UIBindingScope.Relative)
                .BindStep(nameof(SliderRangeGroupContext.Step), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Min"] = nameof(SliderBindingController.CycleMin),
                ["Max"] = nameof(SliderBindingController.CycleMax),
                ["Step"] = nameof(SliderBindingController.CycleStep),
            }),
            contentMinHeight: 140
        );
    }

    private static ContainerComponent CreateReadoutGroup()
    {
        return DemoUI.CreateGroup(nameof(SliderBindingController.ReadoutGroup), "Layout and readouts",
            content => content.AddChild(new SliderComponent()
                .SetValue(60)
                .BindOrientation(nameof(SliderReadoutGroupContext.Orientation), UIBindingScope.Relative)
                .BindShowValue(nameof(SliderReadoutGroupContext.ShowValue), UIBindingScope.Relative)
                .BindShowRange(nameof(SliderReadoutGroupContext.ShowRange), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Orientation"] = nameof(SliderBindingController.CycleOrientation),
                ["Show value"] = nameof(SliderBindingController.ToggleShowValue),
                ["Show range"] = nameof(SliderBindingController.ToggleShowRange),
            }),
            contentMinHeight: 220
        );
    }
}
