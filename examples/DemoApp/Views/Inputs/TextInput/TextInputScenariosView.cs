using DemoApp.Controllers.Inputs.TextInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.TextInput;

/// <summary>
/// What only a live keyboard shows: when a typed value reaches the server, what <c>TrimInput</c> sends, and
/// whether a failing rule stops a submit.
/// </summary>
internal sealed class TextInputScenariosView : DemoScenariosView, IUIViewDefinition
{
    private const string SubmitFormId = "deploy-form";

    public static string ViewKey => "demo.inputs.text-input.scenarios";

    protected override string ComponentRoute => "/inputs/text-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.inputs.text-input.header";
    protected override string HeaderDescription => "demo.inputs.text-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateChangeGroup(), CreateSubmitGroup()],
            [CreateTrimGroup(), CreateFilterGroup()]
        ));
    }

    /// <summary>
    /// A two-way value syncs on the native <c>change</c> event — on blur or Enter, not per keystroke.
    /// </summary>
    private static ContainerComponent CreateChangeGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputScenariosController.ChangeGroup), "Commit on change",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Service name")
                .BindValue(nameof(TextInputChangeGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(TextInputScenariosController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 120,
            note: "Type into the field and nothing is logged until focus leaves it: a two-way value syncs on commit, not per keystroke, and that gap is the behaviour rather than a delay."
        );
    }

    /// <summary>
    /// <c>DebounceMilliseconds</c> commits the value a moment after the viewer pauses, through the same two-way path.
    /// </summary>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputScenariosController.FilterGroup), "Filter as you type",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextInputComponent()
                    .SetTitle("Find a service")
                    .SetPlaceholder("Type a few letters")
                    .SetPrefixIcon(DemoIcons.Outline(DemoIcons.Search))
                    .SetShowClearButton()
                    .SetDebounceMilliseconds(250)
                    .BindValue(nameof(TextInputFilterGroupContext.Query), UIBindingScope.Relative)
                    .OnChange(nameof(TextInputScenariosController.Filter))
                )
                .AddChild(new ItemsViewComponent()
                    .SetSpacing(4)
                    .BindItems(nameof(TextInputFilterGroupContext.Services), UIBindingScope.Relative)
                )
            ),
            contentMinHeight: 260,
            note: "The value commits a quarter of a second after the last keystroke, and the controller answers with the list — nothing is filtered in the browser."
        );
    }

    /// <summary>
    /// Trimming happens client-side, before the value is sent; the clear button takes the same path.
    /// </summary>
    private static ContainerComponent CreateTrimGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputScenariosController.TrimGroup), "Trim and clear",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Service name (padded)")
                .SetTrimInput()
                .SetShowClearButton()
                .BindValue(nameof(TextInputTrimGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(TextInputScenariosController.RecordTrimmedChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 120,
            note: "The padding is trimmed in the browser before the value is sent, and the clear button writes an empty value through the same binding."
        );
    }

    /// <summary>
    /// Only a <c>Submit</c>-trigger rule gates the button; a <c>Change</c>/<c>Blur</c> error does not stop a submit.
    /// </summary>
    /// <remarks>The second field is bound <c>OnSubmit</c>, so its value reaches the controller with the command.</remarks>
    private static ContainerComponent CreateSubmitGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputScenariosController.SubmitGroup), "Validated submit",
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
                        .BindValidation(nameof(TextInputSubmitGroupContext.EmailValidation), UIBindingScope.Relative)
                        .Required("An owner email is required.", UIValidationTrigger.Submit)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur)
                        .Regex("@example\\.com$", "An outside address gets the weekly digest only.", UIValidationTrigger.Blur, UIValidationSeverity.Warning)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Notes (sent on submit only)")
                        .SetFormId(SubmitFormId)
                        .BindValue(nameof(TextInputSubmitGroupContext.Notes), UIBindingScope.Relative, UIBindingMode.OnSubmit)
                        .Required("A line for the reviewer helps.", UIValidationTrigger.Blur, UIValidationSeverity.Info)
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .OnSubmit(SubmitFormId, nameof(TextInputScenariosController.Submit))
                        .SetTitle("Save owner")
                    )
                );
            },
            contentMinHeight: 200,
            note: "Only an error on the Submit trigger stops the press; a warning or an info says its piece and lets the command through. The server has its say too: owner@example.com is already taken, and the refusal comes back as a message on the field."
        );
    }
}
