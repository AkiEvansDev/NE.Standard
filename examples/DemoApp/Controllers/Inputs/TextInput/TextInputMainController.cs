using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.TextInput;

/// <summary>
/// The single-line field's own group: its prefix/suffix adornments and its native input type.
/// </summary>
internal sealed partial class TextInputFieldGroupContext : AffixedFieldGroupContext
{
    [RecursiveMember]
    public partial UITextInputType? Type { get; set; } = UITextInputType.Text;

    [RecursiveMember]
    public partial string? PrefixText { get; set; }

    [RecursiveMember]
    public partial string? SuffixText { get; set; }

    public TextInputFieldGroupContext() : base("service-name", DemoIcons.Link, DemoIcons.Search)
    {
        AddAppearanceOption();
        AddPlaceholderOption();
        AddOption(nameof(Type), CycleType, () => Type);
        AddOption(nameof(PrefixText), TogglePrefixText, () => PrefixText);
        AddOption(nameof(SuffixText), ToggleSuffixText, () => SuffixText);
        AddAffixIconOptions();
    }

    // Each control cycles one property and records what it changed.
    public void CycleType()
        => SetLastChange(nameof(Type), Type = CycleEnum(Type));

    public void TogglePrefixText()
        => SetLastChange(nameof(PrefixText), PrefixText = CycleValue(PrefixText, null, "https://example.com"));

    public void ToggleSuffixText()
        => SetLastChange(nameof(SuffixText), SuffixText = CycleValue(SuffixText, null, "seconds"));
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class TextInputMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial TextInputValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextInputFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new();

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
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
