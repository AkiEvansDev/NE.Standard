using DemoApp.Controllers.Inputs.Select;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Select;

/// <summary>
/// What only a live click proves for a custom listbox: that picking an option (and clearing it) reaches
/// the server through the hidden value input, and that a required Select actually blocks a submit — the
/// latter matters because the form scan reads a component's value off that same hidden input rather than
/// off anything the user can see.
/// </summary>
internal sealed class SelectTestView : DemoTestView, IUIViewDefinition
{
    private const string SubmitFormId = "environment-form";

    public static string ViewKey => "demo.inputs.select.test";

    protected override string ComponentRoute => "/inputs/select";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.select.header";
    protected override string HeaderDescription => "demo.inputs.select.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateSelectionGroup())
            .AddChild(CreateSubmitGroup());
    }

    private static ContainerComponent CreateSelectionGroup()
    {
        return DemoUI.CreateGroup(nameof(SelectTestController.SelectionGroup), "Selection and clear",
            content => content.AddChild(new SelectComponent()
                .SetPlaceholder("Pick an environment…")
                .SetAllowEmptySelection(true)
                .SetOptions(CreateEnvironments())
                .BindValue(nameof(SelectSelectionGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(SelectTestController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 130
        );
    }

    private static ContainerComponent CreateSubmitGroup()
    {
        return DemoUI.CreateGroup(nameof(SelectTestController.SubmitGroup), "Validated submit",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new SelectComponent()
                    .SetPlaceholder("Pick an environment…")
                    .SetFormId(SubmitFormId)
                    .SetOptions(CreateEnvironments())
                    .BindValue(nameof(SelectSubmitGroupContext.Environment), UIBindingScope.Relative)
                    .Required("An environment is required.", UIValidationTrigger.Submit)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .OnSubmit(SubmitFormId, nameof(SelectTestController.Submit))
                    .ConfigureDefaultContent(static button => _ = button.SetTitle("Deploy"))
                )
            ),
            static _ => { },
            contentMinHeight: 200
        );
    }

    private static OptionItem[] CreateEnvironments()
        =>
        [
            new OptionItem { Id = "dev", Title = "Development", Icon = LucideIcons.Wrench },
            new OptionItem { Id = "staging", Title = "Staging", Icon = LucideIcons.Upload },
            new OptionItem { Id = "production", Title = "Production", Icon = LucideIcons.BadgeCheck },
        ];
}
