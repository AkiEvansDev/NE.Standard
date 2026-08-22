using DemoApp.Controllers.Inputs.RadioGroup;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.RadioGroup;

/// <summary>
/// A radio group is the one input with no single value-bearing element — it renders N native radios — so
/// both halves of this page are about that: a click on any one of them has to report the group's value
/// back, and a submit scan has to find that value by falling back to whichever radio is currently checked
/// (see <c>readElementValue</c>'s radio branch) rather than reading the group root.
/// </summary>
internal sealed class RadioGroupTestView : DemoTestView, IUIViewDefinition
{
    private const string SubmitFormId = "strategy-form";

    public static string ViewKey => "demo.inputs.radio-group.test";

    protected override string ComponentRoute => "/inputs/radio-group";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.radio-group.header";
    protected override string HeaderDescription => "demo.inputs.radio-group.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateSelectionGroup())
            .AddChild(CreateSubmitGroup());
    }

    private static ContainerComponent CreateSelectionGroup()
    {
        return DemoUI.CreateGroup(nameof(RadioGroupTestController.SelectionGroup), "Selection",
            content => content.AddChild(new RadioGroupComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetOptions(CreateStrategies())
                .BindValue(nameof(RadioGroupSelectionGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(RadioGroupTestController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    private static ContainerComponent CreateSubmitGroup()
    {
        return DemoUI.CreateGroup(nameof(RadioGroupTestController.SubmitGroup), "Validated submit",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new RadioGroupComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetFormId(SubmitFormId)
                    .SetOptions(CreateStrategies())
                    .BindValue(nameof(RadioGroupSubmitGroupContext.Strategy), UIBindingScope.Relative)
                    .Required("Pick a strategy to continue.", UIValidationTrigger.Submit)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .OnSubmit(SubmitFormId, nameof(RadioGroupTestController.Submit))
                    .ConfigureDefaultContent(static button => _ = button.SetTitle("Deploy"))
                )
            ),
            static _ => { },
            contentMinHeight: 190
        );
    }

    private static OptionItem[] CreateStrategies()
        =>
        [
            new OptionItem { Id = "rolling", Title = "Rolling" },
            new OptionItem { Id = "blue-green", Title = "Blue / green" },
            new OptionItem { Id = "recreate", Title = "Recreate" },
        ];
}
