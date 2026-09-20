using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Interaction;

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
            [CreateQuantityGroup()],
            [CreateFormatGroup()]
        ));

        _ = container.AddChild(CreateBoundsGroup());
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
            )
        );
    }

    /// <summary>
    /// What may be typed follows from the thing being measured, so each row is named by the thing rather than by the flag.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "What may be typed",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new NumberInputComponent()
                    .SetTitle("Replicas — a count, so no decimals and no minus")
                    .SetValue(12)
                    .SetAllowDecimals(false)
                    .SetAllowNegative(false)
                    .SetShowStepper()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Latency budget — decimals, and no trailing zeros to read past")
                    .SetValue(1.500m)
                    .SetSuffixText("ms")
                    .SetAllowDecimals()
                    .SetTrimTrailingZeros()
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Unit price — money, so the second place is always written")
                    .SetValue(1.5m)
                    .SetPrefixText("$")
                    .SetAllowDecimals()
                    .SetDisplayFormat("N2")
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Chamber temperature — the one field that may go below zero")
                    .SetValue(-4)
                    .SetSuffixText("°C")
                    .SetAllowNegative()
                    .SetAllowDecimals()
                )
            ),
            note: "Every rule here is a property; what the page is for is which rule the measured thing asks for."
        );
    }

    /// <summary>
    /// What the field says about a value: the ends it refuses outright, the answer it insists on, and two rules on one field of
    /// which only the stronger ever speaks.
    /// </summary>
    /// <remarks>Full width, three across: the three are read against each other, not down a column.</remarks>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateGroup(null, "What it says about a value",
            content => content.AddChild(DemoUI.CreateRow(24)
                .AddChild(CreateBounded("Both ends — the stepper stops, and so does the typing", new NumberInputComponent()
                    .SetTitle("Replicas")
                    .SetValue(8)
                    .SetRange(1, 64)
                    .SetShowStepper()
                ))
                .AddChild(CreateBounded("Empty is not an answer", new NumberInputComponent()
                    .SetTitle("Replicas")
                    .SetPlaceholder("How many?")
                    .SetShowStepper()
                    .Required("A replica count is required.")
                ))
                .AddChild(CreateBounded("Two rules, and the field says the graver one", new NumberInputComponent()
                    .SetTitle("Monthly budget")
                    .SetPrefixText("$")
                    .SetValue(50)
                    .SetStep(10)
                    .SetShowStepper()
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.GreaterOrEqual, 10, "Under $10 the plan cannot be billed at all.", UIValidationSeverity.Error)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.GreaterOrEqual, 100, "Under $100 the plan costs more to run than it takes.", UIValidationSeverity.Warning)
                ))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "`Min` and `Max` are validated with the value rather than only guarding the stepper: a number pasted past the end is refused too. "
                + "The budget carries two `Validate` rules on the `Change` trigger, so both are answered on every keystroke — type 5 and the error speaks, 50 and the warning does, 150 and neither."
        );
    }

    private static StackPanelComponent CreateBounded(string caption, NumberInputComponent field)
        => DemoUI.CreateCaptionedItem(caption, field.SetWidth(UILayoutLength.Absolute(300)));
}
