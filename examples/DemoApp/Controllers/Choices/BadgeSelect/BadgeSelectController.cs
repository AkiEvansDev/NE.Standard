using System;
using System.Globalization;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;

namespace DemoApp.Controllers.Choices.BadgeSelect;

/// <summary>
/// The labels a ticket carries — their keys in the order chosen — and how many the field takes at most.
/// </summary>
internal sealed partial class BadgeSelectValueGroupContext() : OptionKeysValueGroupContext([["outage", "needs-details"], ["billing"], []]);

/// <summary>
/// The badge select's own surface: the multi-select's field, with each chosen label standing in it as its badge.
/// </summary>
internal sealed partial class BadgeSelectFieldGroupContext : OptionsFieldGroupContext
{
    public BadgeSelectFieldGroupContext() : base("Pick labels", DemoIcons.BadgeCheck, DemoIcons.Filter)
    {
        AddAppearanceOption();
        AddPlaceholderOption();
        AddAffixIconOptions();
        AddAdornmentOptions();
    }
}

/// <summary>
/// The labels on offer, each a badge: a row adds or takes one, another redraws every badge with the next fill.
/// </summary>
/// <remarks>A chosen label's chip is a copy of its option's badge, so the fill row redraws the chips as well as the list.</remarks>
internal sealed partial class BadgeOptionsGroupContext : DemoGroupContext
{
    private static readonly UIBadgeFill?[] FillSteps = [UIBadgeFill.Tinted, UIBadgeFill.Filled, UIBadgeFill.Outline, null];

    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> Options { get; } =
    [
        new() { Id = "outage", BadgeText = "outage", BadgeStyle = UIBadgeType.Danger, BadgeFill = UIBadgeFill.Tinted, Description = "A service is down for the customer" },
        new() { Id = "billing", BadgeText = "billing", BadgeStyle = UIBadgeType.Accent, BadgeFill = UIBadgeFill.Tinted, Description = "An invoice or a charge" },
        new() { Id = "needs-details", BadgeText = "needs details", BadgeStyle = UIBadgeType.Warning, BadgeFill = UIBadgeFill.Tinted, Description = "Logs or steps wanted before work starts" },
        new() { Id = "docs", BadgeText = "docs", BadgeStyle = UIBadgeType.Info, BadgeFill = UIBadgeFill.Tinted, Description = "Answered by a page of the docs" }
    ];

    public BadgeOptionsGroupContext()
    {
        AddOption("Add", AddLabel, () => Options.Count);
        AddOption("Remove", RemoveLabel, () => Options.Count);
        AddOption("Fill", CycleFill, () => Options.Count > 0 ? Options[0].BadgeFill : null);
        AddOption("Disable last", ToggleDisabledLast, () => Options.Count > 0 && Options[^1].Enabled == false);
    }

    public void AddLabel()
    {
        var number = ++_added;

        Options.Add(new OptionItem
        {
            Id = string.Create(CultureInfo.InvariantCulture, $"label-{number}"),
            BadgeText = string.Create(CultureInfo.InvariantCulture, $"label {number}"),
            BadgeStyle = UIBadgeType.Surface,
            BadgeFill = Options.Count > 0 ? Options[0].BadgeFill : UIBadgeFill.Tinted,
            Description = "Added while the page was open"
        });
    }

    /// <summary>
    /// Removing a chosen label is not guarded against: its chip stands as a badge of its key, with no look of its own.
    /// </summary>
    public void RemoveLabel()
    {
        if (Options.Count > 0)
            _ = Options.Remove(Options[^1]);
    }

    public void CycleFill()
    {
        if (Options.Count == 0)
            return;

        UIBadgeFill? fill = FillSteps[(Array.IndexOf(FillSteps, Options[0].BadgeFill) + 1) % FillSteps.Length];

        foreach (OptionItem option in Options)
            option.BadgeFill = fill;
    }

    public void ToggleDisabledLast()
    {
        if (Options.Count == 0)
            return;

        OptionItem last = Options[^1];

        last.Enabled = last.Enabled == false;
    }
}

/// <summary>
/// One command per options section, each dispatching to the row its key names.
/// </summary>
internal sealed partial class BadgeSelectController() : DemoStandardController
{
    [RecursiveMember]
    public partial BadgeSelectValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial BadgeSelectFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial BadgeOptionsGroupContext OptionsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Labels on the ticket");

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
