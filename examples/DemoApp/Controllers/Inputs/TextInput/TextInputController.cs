using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.TextInput;

/// <summary>
/// The single-line field's own group: its prefix/suffix adornments, its native input type and the keyboard it asks a phone for.
/// </summary>
internal sealed partial class TextInputFieldGroupContext : AffixedFieldGroupContext
{
    [RecursiveMember]
    public partial UITextInputType? Type { get; set; } = UITextInputType.Text;

    [RecursiveMember]
    public partial UIInputMode? InputMode { get; set; }

    [RecursiveMember]
    public partial string? PrefixText { get; set; }

    [RecursiveMember]
    public partial string? SuffixText { get; set; }

    public TextInputFieldGroupContext() : base("service-name", DemoIcons.Link, DemoIcons.Search)
    {
        AddAppearanceOption();
        AddPlaceholderOption();
        AddOption(nameof(Type), CycleType, () => Type);
        AddOption(nameof(InputMode), CycleInputMode, () => InputMode);
        AddOption(nameof(PrefixText), TogglePrefixText, () => PrefixText);
        AddOption(nameof(SuffixText), ToggleSuffixText, () => SuffixText);
        AddAffixIconOptions();
    }

    // Each control cycles one property and records what it changed.
    public void CycleType()
        => SetLastChange(nameof(Type), Type = CycleEnum(Type));

    public void CycleInputMode()
        => SetLastChange(nameof(InputMode), InputMode = CycleEnum(InputMode));

    public void TogglePrefixText()
        => SetLastChange(nameof(PrefixText), PrefixText = CycleValue(PrefixText, null, "https://orvane.example"));

    public void ToggleSuffixText()
        => SetLastChange(nameof(SuffixText), SuffixText = CycleValue(SuffixText, null, "seconds"));
}

/// <summary>
/// A release's name and its labels: Enter in the labels field adds one and empties the field, Save takes the form.
/// </summary>
internal sealed partial class TextInputLabelsGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember]
    public partial string? Name { get; set; } = "Release 2.4";

    [RecursiveMember]
    public partial string? Draft { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Labels { get; } =
    [
        new() { Id = "label-0", Title = "billing", IsContent = true },
        new() { Id = "label-1", Title = "eu-west", IsContent = true }
    ];

    public void AddLabel()
    {
        var label = Draft?.Trim();

        // Enter on an empty field still runs the command; there is nothing to add then.
        if (string.IsNullOrEmpty(label))
            return;

        _added++;
        Labels.Add(new TextItem { Id = string.Create(CultureInfo.InvariantCulture, $"label-added-{_added}"), Title = label, IsContent = true });
        Draft = null;
        LogEvent($"label \"{label}\" added");
    }

    // Escape has already put the field back and sent nothing: the draft is still what it was.
    public void DropLabel()
        => LogEvent("the label typed was dropped");

    public void Save()
        => LogEvent($"saved \"{Name}\" with {Labels.Count} labels");
}

/// <summary>
/// One command per options section, each dispatching to the row its key names; and the labels field's Enter and its form's button.
/// </summary>
internal sealed partial class TextInputController() : DemoStandardController
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

    [RecursiveMember]
    public partial TextInputLabelsGroupContext LabelsGroup { get; set; } = new();

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

    [UICommand]
    public void AddLabel()
        => LabelsGroup.AddLabel();

    [UICommand]
    public void DropLabel()
        => LabelsGroup.DropLabel();

    [UICommand]
    public void SaveRelease()
        => LabelsGroup.Save();
}
