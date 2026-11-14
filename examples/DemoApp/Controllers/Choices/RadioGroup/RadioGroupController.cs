using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;

namespace DemoApp.Controllers.Choices.RadioGroup;

/// <summary>
/// The list a radio group shows, plus the direction its options are laid out in.
/// </summary>
internal sealed partial class RadioOptionsGroupContext : OptionListGroupContext
{
    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; } = UIOrientation.Vertical;

    [RecursiveMember]
    public partial UISize? Size { get; set; } = UISize.Medium;

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    public RadioOptionsGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
    }

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    // Unset is the stylesheet's own gap for the orientation; the rest are what an author would write.
    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 4d, 12d, 24d));
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class RadioGroupController() : DemoStandardController
{
    [RecursiveMember]
    public partial OptionValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial RadioOptionsGroupContext OptionsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Deploy target");
}
