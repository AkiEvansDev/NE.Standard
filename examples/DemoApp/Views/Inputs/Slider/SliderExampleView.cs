using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Slider;

/// <summary>
/// Every slider here carries its own <c>Title</c>: the label surface lives on <c>InputComponentBase</c>,
/// so a slider is captioned like any other input rather than by a <c>TextComponent</c> beside it.
/// </summary>
internal sealed class SliderExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.slider.example";

    protected override string ComponentRoute => "/inputs/slider";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.slider.header";
    protected override string HeaderDescription => "demo.inputs.slider.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateResourcesGroup())
            .AddChild(CreateReadoutGroup())
            .AddChild(CreateStateGroup());
    }

    private static ContainerComponent CreateResourcesGroup()
    {
        return DemoUI.CreateGroup(null, "Resource limits",
            content => content.AddChild(CreateStack()
                .AddChild(new SliderComponent()
                    .SetTitle("CPU cores")
                    .SetRange(1, 16)
                    .SetStep(1)
                    .SetValue(4)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Memory (GB)")
                    .SetRange(1, 64)
                    .SetStep(1)
                    .SetValue(16)
                    .SetShowValue()
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Traffic share")
                    .SetRange(0, 100)
                    .SetStep(5)
                    .SetValue(25)
                    .SetShowValue()
                )
            ),
            static _ => { },
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// <c>ShowValue</c> updates while dragging (<c>RangeValueEngine</c> echoes the live value before it
    /// commits); <c>ShowRange</c> is static bound text. Worth separating, since only one of the two moves.
    /// </summary>
    private static ContainerComponent CreateReadoutGroup()
    {
        return DemoUI.CreateGroup(null, "Readouts",
            content => content.AddChild(CreateStack()
                .AddChild(new SliderComponent().SetTitle("Neither").SetValue(40))
                .AddChild(new SliderComponent().SetTitle("Value only").SetValue(40).SetShowValue())
                .AddChild(new SliderComponent().SetTitle("Range only").SetValue(40).SetShowRange())
                .AddChild(new SliderComponent().SetTitle("Both").SetValue(40).SetShowValue().SetShowRange())
            ),
            static _ => { },
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(new SliderComponent()
                    .SetTitle("Vertical")
                    .SetOrientation(UIOrientation.Vertical)
                    .SetValue(60)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Read-only")
                    .SetValue(70)
                    .SetShowValue()
                    .SetIsReadOnly(true)
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Disabled")
                    .SetValue(30)
                    .SetShowValue()
                    .SetEnabled(false)
                )
            ),
            static _ => { },
            contentMinHeight: 380
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(16)
            .SetPlacement(1, 1, 24, 1);

}
