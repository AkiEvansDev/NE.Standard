using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Select;

/// <summary>
/// The dropdown's own surface: what the trigger looks like, and what it says with nothing selected.
/// </summary>
internal sealed partial class SelectFieldGroupContext : OptionsFieldGroupContext
{
    public SelectFieldGroupContext() : base("Pick a region", DemoIcons.Navigation, DemoIcons.Filter)
    {
        AddAppearanceOption();
        AddPlaceholderOption();
        AddAffixIconOptions();
        AddAdornmentOptions();
    }
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class SelectMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial OptionValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial SelectFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial OptionListGroupContext OptionsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Region");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleFieldOption(string id)
        => FieldGroup.CycleOption(id);

    [UICommand]
    public void CycleOptionsOption(string id)
        => OptionsGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
