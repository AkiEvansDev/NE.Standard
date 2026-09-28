using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.MultiSelect;

/// <summary>
/// The multi-select's own surface: the select's field, with a chip per chosen option inside it.
/// </summary>
internal sealed partial class MultiSelectFieldGroupContext : OptionsFieldGroupContext
{
    public MultiSelectFieldGroupContext() : base("Pick regions", DemoIcons.Navigation, DemoIcons.Filter)
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
internal sealed partial class MultiSelectMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial OptionKeysValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial MultiSelectFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial OptionListGroupContext OptionsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Regions");

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
