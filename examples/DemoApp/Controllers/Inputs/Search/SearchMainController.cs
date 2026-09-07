using System;
using System.Collections.Generic;
using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs.Search;

/// <summary>
/// What the user has typed, and the four knobs that decide when that typing becomes a search.
/// </summary>
/// <remarks><c>SearchText</c> is two-way, which is how the command below reads the term.</remarks>
internal sealed partial class SearchTermGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? SearchText { get; set; }

    [RecursiveMember]
    public partial bool AutoSearch { get; set; } = true;

    [RecursiveMember]
    public partial int? DebounceMilliseconds { get; set; }

    [RecursiveMember]
    public partial int? MinSearchLength { get; set; }

    [RecursiveMember]
    public partial UISearchSelectionDisplayMode? SelectionDisplayMode { get; set; } = UISearchSelectionDisplayMode.KeepSearchInput;

    public SearchTermGroupContext()
    {
        AddOption(nameof(SearchText), CycleSearchText, () => SearchText);
        AddOption(nameof(AutoSearch), ToggleAutoSearch, () => AutoSearch);
        AddOption(nameof(DebounceMilliseconds), CycleDebounce, () => DebounceMilliseconds);
        AddOption(nameof(MinSearchLength), CycleMinSearchLength, () => MinSearchLength);
        AddOption(nameof(SelectionDisplayMode), CycleSelectionDisplayMode, () => SelectionDisplayMode);
    }

    // The last step matches nothing on purpose: an empty result is otherwise hard to reach.
    public void CycleSearchText()
        => SetLastChange(nameof(SearchText), SearchText = CycleValue(SearchText, null, "ir", "us-", "atlantis"));

    public void ToggleAutoSearch()
        => SetLastChange(nameof(AutoSearch), AutoSearch = !AutoSearch);

    public void CycleDebounce()
        => SetLastChange(nameof(DebounceMilliseconds), DebounceMilliseconds = CycleValue(DebounceMilliseconds, 400, 1200, null));

    public void CycleMinSearchLength()
        => SetLastChange(nameof(MinSearchLength), MinSearchLength = CycleValue(MinSearchLength, 2, 4, 0, null));

    public void CycleSelectionDisplayMode()
        => SetLastChange(nameof(SelectionDisplayMode), SelectionDisplayMode = CycleEnum(SelectionDisplayMode));
}

/// <summary>
/// The value a search holds — the selected option's key, not the term.
/// </summary>
internal sealed partial class SearchValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; }

    public SearchValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, null, "eu-west-1", "ap-south-1"));
}

/// <summary>
/// The field the term is typed into.
/// </summary>
internal sealed partial class SearchFieldGroupContext : OptionsFieldGroupContext
{
    public SearchFieldGroupContext() : base("Search regions", DemoIcons.Search, DemoIcons.Filter)
    {
        // A search opens with its magnifier already in place, which is what says what the field is for.
        PrefixIcon = DemoIcons.Search;

        AddAppearanceOption();
        AddPlaceholderOption();
        AddAffixIconOptions();
        AddAdornmentOptions();
    }
}

/// <summary>
/// The list the search fills; it has no rows of its own, because the search command is what moves it.
/// </summary>
internal sealed partial class SearchResultsGroupContext : DemoGroupContext
{
    private static readonly (string Id, string Title, string Group)[] Catalogue =
    [
        ("eu-west-1", "Ireland", "Europe"),
        ("eu-central-1", "Frankfurt", "Europe"),
        ("us-east-1", "N. Virginia", "Americas"),
        ("us-west-2", "Oregon", "Americas"),
        ("ap-south-1", "Mumbai", "Asia Pacific"),
        ("ap-northeast-1", "Tokyo", "Asia Pacific"),
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> Options { get; } = [];

    public SearchResultsGroupContext()
    {
        Apply(null);

        AddOption("Matches", ResetResults, () => Options.Count);
    }

    /// <summary>
    /// Puts the unfiltered catalogue back, which is the state a search starts from.
    /// </summary>
    public void ResetResults()
    {
        Apply(null);
        SetLastChange("Matches", Options.Count);
    }

    public void Apply(string? term)
    {
        IEnumerable<(string Id, string Title, string Group)> matches = string.IsNullOrWhiteSpace(term)
            ? Catalogue
            : Catalogue.Where(entry => entry.Title.Contains(term, StringComparison.OrdinalIgnoreCase)
                || entry.Id.Contains(term, StringComparison.OrdinalIgnoreCase));

        Options.Clear();
        Options.AddRange(matches.Select(entry => new OptionItem { Id = entry.Id, Title = entry.Title, Group = entry.Group }));
    }
}

/// <summary>
/// One command per options section, plus the one that answers the search itself.
/// </summary>
internal sealed partial class SearchMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial SearchValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial SearchTermGroupContext TermGroup { get; set; } = new();

    [RecursiveMember]
    public partial SearchFieldGroupContext FieldGroup { get; set; } = new();

    [RecursiveMember]
    public partial SearchResultsGroupContext ResultsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Region");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    /// <summary>
    /// Answers a triggered search, reading the term off the two-way bound <c>SearchText</c>.
    /// </summary>
    [UICommand]
    public void Search()
        => ResultsGroup.Apply(TermGroup.SearchText);

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    /// <summary>
    /// Runs the search itself: writing the term from the server does not raise the control's own event.
    /// </summary>
    [UICommand]
    public void CycleTermOption(string id)
    {
        TermGroup.CycleOption(id);

        if (id == nameof(SearchTermGroupContext.SearchText))
            Search();
    }

    [UICommand]
    public void CycleFieldOption(string id)
        => FieldGroup.CycleOption(id);

    [UICommand]
    public void CycleResultsOption(string id)
        => ResultsGroup.CycleOption(id);

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
