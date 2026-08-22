using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Select;

internal sealed partial class SelectPlaceholderGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Placeholder { get; set; } = "Pick an environment…";

    public void CyclePlaceholder()
        => SetLastChange(nameof(Placeholder), Placeholder = CycleValue(Placeholder, "Pick an environment…", "Where should this go?", null));
}

internal sealed partial class SelectBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial OptionsValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial SelectPlaceholderGroupContext PlaceholderGroup { get; set; } = new();

    [RecursiveMember]
    public partial OptionsCollectionGroupContext OptionsGroup { get; set; } = new();

    [UICommand]
    public void CycleValue()
        => ValueGroup.CycleValue();

    [UICommand]
    public void ToggleIsReadOnly()
        => ValueGroup.ToggleIsReadOnly();

    [UICommand]
    public void CyclePlaceholder()
        => PlaceholderGroup.CyclePlaceholder();

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
