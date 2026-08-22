using DemoApp.Controllers.Inputs.TextInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.TextInput;

/// <summary>
/// Three things about a text field that only a live keyboard can show: when a typed value actually
/// reaches the server, what the server receives once <c>TrimInput</c> is on, and whether a failing
/// validation rule stops a submit from dispatching. None of them is visible in the rendered HTML.
/// </summary>
internal sealed class TextInputTestView : DemoTestView, IUIViewDefinition
{
    private const string SubmitFormId = "deploy-form";

    public static string ViewKey => "demo.inputs.text-input.test";

    protected override string ComponentRoute => "/inputs/text-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.text-input.header";
    protected override string HeaderDescription => "demo.inputs.text-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateChangeGroup())
            .AddChild(CreateTrimGroup())
            .AddChild(CreateSubmitGroup());
    }

    /// <summary>
    /// A two-way value syncs on the native <c>change</c> event — on commit (blur, Enter), not per
    /// keystroke. Type into this field and nothing is logged until focus leaves it; that gap is the
    /// behavior under test, not a delay.
    /// </summary>
    private static ContainerComponent CreateChangeGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputTestController.ChangeGroup), "Commit on change",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Service name")
                .BindValue(nameof(TextInputChangeGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(TextInputTestController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    /// <summary>
    /// Trimming happens client-side, before the value is sent. The field starts with padding on both
    /// sides, so committing it once reports the trimmed length — and the clear button next to it takes
    /// the same path, writing an empty value through the same binding.
    /// </summary>
    private static ContainerComponent CreateTrimGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputTestController.TrimGroup), "Trim and clear",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Service name (padded)")
                .SetTrimInput()
                .SetShowClearButton()
                .BindValue(nameof(TextInputTrimGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(TextInputTestController.RecordTrimmedChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    /// <summary>
    /// The field carries two rules on two different triggers, which is the point of the group: only the
    /// <c>Submit</c>-trigger rule gates the button (<c>ValidationEngine.runSubmitValidation</c> evaluates
    /// that trigger and no other), while the <c>Blur</c> rule is purely a live message as you leave the
    /// field. A <c>Change</c>/<c>Blur</c> rule showing an error does <em>not</em> stop a submit — put the
    /// rule that must block dispatch on <c>Submit</c>.
    /// <para>
    /// The second field is bound <c>OnSubmit</c>: typing in it sends nothing, and its value reaches the
    /// controller in the same round trip as the command — after validation, before the command runs.
    /// </para>
    /// </summary>
    private static ContainerComponent CreateSubmitGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputTestController.SubmitGroup), "Validated submit",
            content =>
            {
                _ = content.AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(new TextInputComponent()
                        .SetTitle("Owner email")
                        .SetFormId(SubmitFormId)
                        .BindValue(nameof(TextInputSubmitGroupContext.Email), UIBindingScope.Relative)
                        .Required("An owner email is required.", UIValidationTrigger.Submit)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Notes (sent on submit only)")
                        .SetFormId(SubmitFormId)
                        .BindValue(nameof(TextInputSubmitGroupContext.Notes), UIBindingScope.Relative, UIBindingMode.OnSubmit)
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .OnSubmit(SubmitFormId, nameof(TextInputTestController.Submit))
                        .ConfigureDefaultContent(static button => _ = button.SetTitle("Save owner"))
                    )
                );
            },
            static _ => { },
            contentMinHeight: 200
        );
    }
}
