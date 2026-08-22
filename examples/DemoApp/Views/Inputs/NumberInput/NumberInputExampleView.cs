using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.NumberInput;

internal sealed class NumberInputExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.number-input.example";

    protected override string ComponentRoute => "/inputs/number-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.number-input.header";
    protected override string HeaderDescription => "demo.inputs.number-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateCapacityGroup())
            .AddChild(CreateFormatGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>The ordinary case: bounded numbers with a unit and a stepper.</summary>
    private static ContainerComponent CreateCapacityGroup()
    {
        return DemoUI.CreateGroup(null, "Capacity",
            content => content.AddChild(CreateStack()
                .AddChild(new NumberInputComponent()
                    .SetTitle("Replicas")
                    .SetIcon(LucideIcons.Upload)
                    .SetRange(1, 20)
                    .SetStep(1)
                    .SetAllowDecimals(false)
                    .SetShowStepper()
                    .SetValue(3)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Request timeout")
                    .SetSuffixText("s")
                    .SetRange(1, 300)
                    .SetStep(5)
                    .SetShowStepper()
                    .SetValue(30)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Monthly budget")
                    .SetPrefixText("$")
                    .SetRange(0, 100000)
                    .SetValue(2500)
                    .SetBadgeText("billing")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
            ),
            static _ => { },
            contentMinHeight: 300
        );
    }

    /// <summary>
    /// The formatting switches are what a native <c>&lt;input type="number"&gt;</c> cannot offer — see
    /// <c>NumberInputComponentRenderer</c>'s note on why this is a text input driven by
    /// <c>NumberInputEngine</c> instead.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "Formatting",
            content => content.AddChild(CreateStack()
                .AddChild(new NumberInputComponent()
                    .SetTitle("Grouped thousands")
                    .SetValue(1250000)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Ungrouped")
                    .SetAllowThousandsSeparator(false)
                    .SetValue(1250000)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Trailing zeros trimmed on blur")
                    .SetTrimTrailingZeros()
                    .SetValue(12.500m)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Whole numbers only")
                    .SetAllowDecimals(false)
                    .SetAllowNegative(false)
                    .SetValue(42)
                )
            ),
            static _ => { },
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(new NumberInputComponent()
                    .SetTitle("Read-only")
                    .SetValue(8)
                    .SetIsReadOnly(true)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Disabled")
                    .SetValue(8)
                    .SetEnabled(false)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Required")
                    .Required("A replica count is required.")
                )
            ),
            static _ => { },
            contentMinHeight: 300
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetPlacement(1, 1, 24, 1);
}
