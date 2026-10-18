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
/// A release's name and its labels: Enter in the labels field adds one and empties the field, Save takes the form. A press on a label
/// puts it in the field to be renamed: Enter renames it, and Escape drops the rename — the only time Escape is the field's cancel, so
/// a new label half typed survives an Escape.
/// </summary>
internal sealed partial class TextInputLabelsGroupContext : DemoGroupContext
{
    private int _added;
    // The label being renamed, and what the field held before the rename, which the rename's end gives back.
    private string? _renaming;
    private string? _draftBefore;

    [RecursiveMember]
    public partial string? Name { get; set; } = "Release 2.4";

    [RecursiveMember]
    public partial string? Draft { get; set; }

    /// <summary>Whether a rename is under way; the field's <c>CancelOnEscape</c> is bound to it.</summary>
    [RecursiveMember]
    public partial bool Renaming { get; set; }

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

        if (_renaming is not null && Find(_renaming) is TextItem renamed)
        {
            renamed.Title = label;
            LogEvent($"label renamed to \"{label}\"");
            EndRename();
            return;
        }

        _added++;
        Labels.Add(new TextItem { Id = string.Create(CultureInfo.InvariantCulture, $"label-added-{_added}"), Title = label, IsContent = true });
        Draft = null;
        LogEvent($"label \"{label}\" added");
    }

    private TextItem? Find(string id)
    {
        foreach (TextItem label in Labels)
        {
            if (label.Id == id)
                return label;
        }

        return null;
    }

    private void EndRename()
    {
        Draft = _draftBefore;
        _draftBefore = null;
        _renaming = null;
        Renaming = false;
    }

    /// <summary>Puts the label keyed <paramref name="id"/> in the field to be renamed, keeping what the field held for the rename's end.</summary>
    public void RenameLabel(string id)
    {
        if (Find(id) is not TextItem label)
            return;

        if (_renaming is null)
            _draftBefore = Draft;

        _renaming = id;
        Draft = label.Title?.Key;
        Renaming = true;
        LogEvent($"renaming \"{Draft}\"");
    }

    // Escape has already put the label's name back in the field and sent nothing: the rename ends, and the draft before it returns.
    public void DropRename()
    {
        LogEvent("the rename was dropped");
        EndRename();
    }

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
    public void AddLabel()
        => LabelsGroup.AddLabel();

    [UICommand]
    public void RenameLabel(string id)
        => LabelsGroup.RenameLabel(id);

    [UICommand]
    public void DropRename()
        => LabelsGroup.DropRename();

    [UICommand]
    public void SaveRelease()
        => LabelsGroup.Save();
}
