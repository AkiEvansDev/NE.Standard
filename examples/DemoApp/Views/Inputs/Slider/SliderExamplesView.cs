using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.Slider;

/// <summary>
/// For a value whose position in a range matters more than its digits; where the digits matter, use a number input.
/// </summary>
internal sealed class SliderExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.slider.examples";

    protected override string ComponentRoute => "/inputs/slider";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.slider.header";
    protected override string HeaderDescription => "demo.inputs.slider.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateUsesGroup(), CreateStepGroup(), CreateStateGroup()],
            [CreateReadoutGroup(), CreateOrientationGroup()]
        ));
    }

    /// <summary>The jobs it is given: a share, a threshold, a limit with a unit at the end of its label.</summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateGroup(null, "Where it is used",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new SliderComponent()
                    .SetTitle("Traffic to the new build")
                    .SetIcon(DemoIcons.Navigation)
                    .SetRange(0, 100)
                    .SetStep(5)
                    .SetValue(25)
                    .SetShowValue()
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Alert when the error rate passes")
                    .SetIcon(DemoIcons.Alert)
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetRange(0, 10)
                    .SetStep(0.1m)
                    .SetValue(2.5m)
                    .SetShowValue()
                    .SetBadgeText("per cent")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Concurrent jobs")
                    .SetRange(1, 32)
                    .SetStep(1)
                    .SetValue(8)
                    .SetShowValue()
                    .SetShowRange()
                )
            ),
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// The two readouts are independent; with the bounds printed, the value moves over the handle instead.
    /// </summary>
    private static ContainerComponent CreateReadoutGroup()
    {
        return DemoUI.CreateGroup(null, "What it writes down",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new SliderComponent()
                    .SetTitle("Neither — a bare track")
                    .SetRange(0, 100)
                    .SetValue(40)
                )
                .AddChild(new SliderComponent()
                    .SetTitle("ShowRange — the ends of the track")
                    .SetRange(0, 100)
                    .SetValue(40)
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("ShowValue — the reading, beside the track")
                    .SetRange(0, 100)
                    .SetValue(40)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Both — the ends take the room, so the reading moves over the handle")
                    .SetRange(0, 100)
                    .SetValue(40)
                    .SetShowValue()
                    .SetShowRange()
                )
            ),
            contentMinHeight: 340
        );
    }

    /// <summary>
    /// <c>Step</c> is what the handle may land on; a coarse step is what makes a slider usable at all.
    /// </summary>
    private static ContainerComponent CreateStepGroup()
    {
        return DemoUI.CreateGroup(null, "Step",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new SliderComponent()
                    .SetTitle("Step = 1")
                    .SetRange(0, 100)
                    .SetStep(1)
                    .SetValue(50)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Step = 25 — quarters, and nothing between them")
                    .SetRange(0, 100)
                    .SetStep(25)
                    .SetValue(50)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Step = 0.1 over a range of ten")
                    .SetRange(0, 10)
                    .SetStep(0.1m)
                    .SetValue(2.5m)
                    .SetShowValue()
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>
    /// Upright, the slider takes a height rather than a width, which is what a level belongs in.
    /// </summary>
    private static ContainerComponent CreateOrientationGroup()
    {
        return DemoUI.CreateGroup(null, "Orientation",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(32)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new SliderComponent()
                    .SetTitle("Left")
                    .SetOrientation(UIOrientation.Vertical)
                    .SetHeight(UILayoutLength.Absolute(160))
                    .SetRange(0, 100)
                    .SetValue(70)
                    .SetShowValue()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Centre")
                    .SetOrientation(UIOrientation.Vertical)
                    .SetHeight(UILayoutLength.Absolute(160))
                    .SetRange(0, 100)
                    .SetValue(45)
                    .SetShowValue()
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Right")
                    .SetOrientation(UIOrientation.Vertical)
                    .SetHeight(UILayoutLength.Absolute(160))
                    .SetRange(0, 100)
                    .SetValue(20)
                    .SetShowValue()
                )
            ),
            contentMinHeight: 260
        );
    }

    /// <summary>
    /// The states, and the same reading in a slider and in a number input side by side.
    /// </summary>
    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States, and the same value as a number",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new SliderComponent()
                    .SetTitle("Read-only")
                    .SetRange(0, 100)
                    .SetValue(72)
                    .SetIsReadOnly(true)
                    .SetShowValue()
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Disabled")
                    .SetRange(0, 100)
                    .SetValue(72)
                    .SetEnabled(false)
                    .SetShowRange()
                )
                .AddChild(new SliderComponent()
                    .SetTitle("Traffic to the new build")
                    .SetRange(0, 100)
                    .SetStep(5)
                    .SetValue(25)
                    .SetShowValue()
                    .SetShowRange()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("The same thing, typed")
                    .SetRange(0, 100)
                    .SetStep(5)
                    .SetValue(25)
                    .SetSuffixText("%")
                    .SetShowStepper()
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("Reach for the slider when **the position in the range** is the answer, and for the number input when **the digits** are.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ),
            contentMinHeight: 400
        );
    }
}
