using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.RadioGroup;

internal sealed partial class RadioGroupLayoutGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIOrientation Orientation { get; set; } = UIOrientation.Vertical;

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));
}

internal sealed partial class RadioGroupBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial OptionsValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial RadioGroupLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial OptionsCollectionGroupContext OptionsGroup { get; set; } = new();

    [UICommand]
    public void CycleValue()
        => ValueGroup.CycleValue();

    [UICommand]
    public void ToggleIsReadOnly()
        => ValueGroup.ToggleIsReadOnly();

    [UICommand]
    public void CycleOrientation()
        => LayoutGroup.CycleOrientation();

    [UICommand]
    public void AddOption()
        => OptionsGroup.AddOption();

    [UICommand]
    public void RemoveOption()
        => OptionsGroup.RemoveOption();

    [UICommand]
    public void RenameSelected()
        => OptionsGroup.RenameSelected();

    [UICommand]
    public void SelectFirst()
        => OptionsGroup.SelectFirst();
}

internal sealed partial class RadioGroupSelectionGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; }

    public void RecordChange()
        => LogEvent($"change -> \"{Value}\"");
}

internal sealed partial class RadioGroupSubmitGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Strategy { get; set; }

    public void Submit()
        => LogEvent($"submitted -> \"{Strategy}\"");
}

internal sealed partial class RadioGroupTestController() : DemoController
{
    [RecursiveMember]
    public partial RadioGroupSelectionGroupContext SelectionGroup { get; set; } = new();

    [RecursiveMember]
    public partial RadioGroupSubmitGroupContext SubmitGroup { get; set; } = new();

    [UICommand]
    public void RecordChange()
        => SelectionGroup.RecordChange();

    [UICommand]
    public void Submit()
        => SubmitGroup.Submit();
}
