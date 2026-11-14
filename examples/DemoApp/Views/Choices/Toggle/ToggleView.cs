using DemoApp.Controllers.Base;
using DemoApp.Controllers.Choices.Toggle;
using DemoApp.Views.Base;

namespace DemoApp.Views.Choices.Toggle;

/// <summary>
/// The half of a toggle page that is the same for both: every binding, and the sections they hang from.
/// </summary>
internal abstract class ToggleView : DemoComponentView
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(ToggleController.ValueGroup);
    private const string LabelGroup = nameof(ToggleController.LabelGroup);
    private const string BorderGroup = nameof(ToggleController.BorderGroup);

    protected sealed override ContainerComponent CreateOptions()
    {
        return DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(LabelGroup, "Label"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );
    }

    /// <summary>
    /// Every property either toggle can be bound to, generic over the component so fluent setters keep their type.
    /// </summary>
    protected static T Bind<T>(T toggle)
        where T : CheckboxComponent<T>, IUIComponentDefinition
    {
        return toggle
            .BindStandard()
            .BindValue<ToggleController>(static x => x.ValueGroup.Value)
            .BindIsReadOnly<ToggleController>(static x => x.ValueGroup.IsReadOnly)
            .BindSize<ToggleController>(static x => x.ValueGroup.Size)
            .BindLabel(LabelGroup, hasDescription: true)
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1);
    }
}
