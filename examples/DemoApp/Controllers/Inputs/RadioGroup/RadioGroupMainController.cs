using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.RadioGroup;

/// <summary>
/// The list a radio group shows, plus the direction its options are laid out in.
/// </summary>
internal sealed partial class RadioOptionsGroupContext : OptionListGroupContext
{
    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; } = UIOrientation.Vertical;

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    public RadioOptionsGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
    }

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    // Unset is the stylesheet's own gap for the orientation; the rest are what an author would write.
    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 4d, 12d, 24d));
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class RadioGroupMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial OptionValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial RadioOptionsGroupContext OptionsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Deploy target");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleOptionsOption(string id)
        => OptionsGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);
}
