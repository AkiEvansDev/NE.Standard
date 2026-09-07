using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.NumberInput;

/// <summary>
/// Money, a count, a percentage or a limit: what the value is allowed to be, and how it is written down.
/// </summary>
internal sealed class NumberInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.number-input.examples";

    protected override string ComponentRoute => "/inputs/number-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.number-input.header";
    protected override string HeaderDescription => "demo.inputs.number-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateQuantityGroup(), CreateBoundsGroup()],
            [CreateFormatGroup(), CreateFieldGroup()]
        ));
    }

    /// <summary>
    /// What the affixes are for: a unit belongs beside the number rather than in it.
    /// </summary>
    private static ContainerComponent CreateQuantityGroup()
    {
        return DemoUI.CreateGroup(null, "A number with a unit",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new NumberInputComponent()
                    .SetTitle("Replicas")
                    .SetValue(12)
                    .SetRange(1, 64)
                    .SetStep(1)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Request timeout")
                    .SetValue(30)
                    .SetSuffixText("seconds")
                    .SetStep(5)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Monthly budget")
                    .SetValue(2400)
                    .SetPrefixText("$")
                    .SetAllowThousandsSeparator()
                    .SetStep(100)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Error budget spent")
                    .SetIcon(DemoIcons.Alert)
                    .SetValue(41.5m)
                    .SetSuffixText("%")
                    .SetRange(0, 100)
                    .SetAllowDecimals()
                    .SetStep(0.5m)
                )
            ),
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// The Format properties change what may be typed and how it is written back, not the value itself.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "What may be typed",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new NumberInputComponent()
                    .SetTitle("Whole numbers only")
                    .SetValue(12)
                    .SetAllowDecimals(false)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Decimals, trailing zeros trimmed")
                    .SetValue(1.500m)
                    .SetAllowDecimals()
                    .SetTrimTrailingZeros()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Decimals, two places written out")
                    .SetValue(1.5m)
                    .SetAllowDecimals()
                    .SetDisplayFormat("N2")
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("A temperature, so negatives are allowed")
                    .SetValue(-4)
                    .SetSuffixText("°C")
                    .SetAllowNegative()
                    .SetAllowDecimals()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("A count, so they are not")
                    .SetValue(3)
                    .SetAllowNegative(false)
                    .SetShowStepper()
                )
            ),
            contentMinHeight: 400
        );
    }

    /// <summary>
    /// <c>Min</c>/<c>Max</c> are validated with the value rather than only guarding the stepper.
    /// </summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateGroup(null, "Bounds",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new NumberInputComponent()
                    .SetTitle("Between 1 and 64")
                    .SetValue(8)
                    .SetRange(1, 64)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("At least 1")
                    .SetValue(1)
                    .SetMin(1)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Required")
                    .SetPlaceholder("How many?")
                    .SetShowStepper()
                    .Required("A replica count is required.")
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>The field's own surface: the two appearances, affix glyphs, and the states.</summary>
    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateGroup(null, "The field it sits in",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new NumberInputComponent()
                    .SetTitle("Filled")
                    .SetValue(12)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetValue(12)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("With an affix glyph")
                    .SetPrefixIcon(DemoIcons.Clock)
                    .SetValue(30)
                    .SetSuffixText("s")
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Read-only")
                    .SetValue(64)
                    .SetIsReadOnly(true)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Disabled")
                    .SetValue(0)
                    .SetEnabled(false)
                )
            ),
            contentMinHeight: 400
        );
    }
}
