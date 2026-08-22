using DemoApp.Controllers.Inputs.Checkbox;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Checkbox;

/// <summary>
/// Covers what only a live click proves for a checkbox: that the two-way <c>Value</c> write reaches the
/// controller and is already applied by the time the change command runs, and that a <c>Required</c> rule
/// renders its message from the client without a server round-trip. Both are silent when broken — the box
/// still toggles visually either way.
/// </summary>
internal sealed class CheckboxTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.checkbox.test";

    protected override string ComponentRoute => "/inputs/checkbox";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.checkbox.header";
    protected override string HeaderDescription => "demo.inputs.checkbox.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateChangeGroup())
            .AddChild(CreateValidationGroup());
    }

    private static ContainerComponent CreateChangeGroup()
    {
        return DemoUI.CreateGroup(nameof(CheckboxTestController.ChangeGroup), "Two-way value and change",
            content => content.AddChild(new CheckboxComponent()
                .SetTitle("Run migrations")
                .BindValue(nameof(CheckboxChangeGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(CheckboxTestController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 110
        );
    }

    /// <summary>
    /// The rule's trigger is <c>Change</c>, so unchecking the box is what surfaces the message. The
    /// checked starting state comes from the bound controller field rather than a <c>SetValue</c> here —
    /// a bound value always wins over the component's own, so writing both would only mislead.
    /// </summary>
    private static ContainerComponent CreateValidationGroup()
    {
        return DemoUI.CreateGroup(nameof(CheckboxTestController.ValidationGroup), "Required rule",
            content => content.AddChild(new CheckboxComponent()
                .SetTitle("I accept the deploy policy")
                .BindValue(nameof(CheckboxValidationGroupContext.Accepted), UIBindingScope.Relative)
                .Required("Accept the policy to continue.")
                .OnChange(nameof(CheckboxTestController.RecordAccepted))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 130
        );
    }
}
