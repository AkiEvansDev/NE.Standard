using DemoApp.Controllers.Inputs.NumberInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.NumberInput;

/// <summary>
/// The seam worth clicking: this field is a text input the client formats for display — grouping commas
/// in, stripping them on focus, trimming trailing zeros on blur — while the value that travels to the
/// server has to stay a clean number throughout. Type into it, use the stepper, and the log line shows
/// what the controller actually received.
/// </summary>
internal sealed class NumberInputTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.number-input.test";

    protected override string ComponentRoute => "/inputs/number-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.number-input.header";
    protected override string HeaderDescription => "demo.inputs.number-input.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChild(CreateCommitGroup());

    private static ContainerComponent CreateCommitGroup()
    {
        return DemoUI.CreateGroup(nameof(NumberInputTestController.CommitGroup), "Commit and formatting",
            content => content.AddChild(new NumberInputComponent()
                .SetTitle("Replicas")
                .SetRange(1, 5000)
                .SetStep(1)
                .SetShowStepper()
                .SetTrimTrailingZeros()
                .BindValue(nameof(NumberCommitGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(NumberInputTestController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 130
        );
    }
}
