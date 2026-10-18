using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;

namespace DemoApp.Controllers.Choices.MultiSelect;

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
internal sealed partial class MultiSelectController() : DemoStandardController
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
}
