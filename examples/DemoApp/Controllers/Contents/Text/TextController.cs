using System;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Text;

/// <summary>
/// A text block's layout, plus whether its title opens an inline rename box on double-click, F2 or <see cref="RenameItemEffect"/>.
/// </summary>
internal sealed partial class RenamableTextLayoutGroupContext : SelectableTextLayoutGroupContext
{
    [RecursiveMember]
    public partial bool? Renamable { get; set; }

    public RenamableTextLayoutGroupContext()
    {
        AddOption(nameof(Renamable), CycleRenamable, () => Renamable);
    }

    public void CycleRenamable()
        => SetLastChange(nameof(Renamable), Renamable = CycleValue(Renamable, null, true, false));
}

/// <summary>
/// Three inline-renamable text blocks: one bound two-way and also opened by a button's <see cref="RenameItemEffect"/>, one built with
/// <c>UIText.Editable</c>, and one whose command refuses the reserved name <c>production</c> and restores the previous title.
/// </summary>
internal sealed partial class TextRenameGroupContext : DemoGroupContext
{
    private string _acceptedEnvironment = "staging";

    [RecursiveMember]
    public partial string? Heading { get; set; } = "Q4 infrastructure budget";

    [RecursiveMember]
    public partial string? PresetTitle { get; set; } = "eu-north-1 · billing replica";

    [RecursiveMember]
    public partial string? Environment { get; set; } = "staging";

    internal void ValidateEnvironment()
    {
        var trimmed = Environment?.Trim();

        if (string.IsNullOrEmpty(trimmed) || string.Equals(trimmed, "production", StringComparison.OrdinalIgnoreCase))
        {
            Environment = _acceptedEnvironment;
            LogEvent($"refused '{trimmed}' — kept '{_acceptedEnvironment}'");
            return;
        }

        _acceptedEnvironment = trimmed;
        Environment = trimmed;
        LogEvent($"renamed environment to '{trimmed}'");
    }
}

/// <summary>
/// One text component, and every property that can be bound to it.
/// </summary>
internal sealed partial class TextController() : DemoStandardController
{
    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Two-factor authentication", "Adds a second step when signing in from a new device.");

    [RecursiveMember]
    public partial RenamableTextLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextRenameGroupContext RenameGroup { get; set; } = new();

    [UICommand]
    public void ValidateEnvironment()
        => RenameGroup.ValidateEnvironment();
}
