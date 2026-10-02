using System;
using System.Collections.Generic;
using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.Search;

/// <summary>
/// What the user has typed, and the three knobs that decide when that typing becomes a search.
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
    public partial UIInputAppearance? SearchFieldAppearance { get; set; }

    public SearchTermGroupContext()
    {
        AddOption(nameof(SearchText), CycleSearchText, () => SearchText);
        AddOption(nameof(AutoSearch), ToggleAutoSearch, () => AutoSearch);
        AddOption(nameof(DebounceMilliseconds), CycleDebounce, () => DebounceMilliseconds);
        AddOption(nameof(MinSearchLength), CycleMinSearchLength, () => MinSearchLength);
        AddOption(nameof(SearchFieldAppearance), CycleSearchFieldAppearance, () => SearchFieldAppearance);
    }

    // The last step matches nothing on purpose: an empty result is otherwise hard to reach.
    public void CycleSearchText()
        => SetLastChange(nameof(SearchText), SearchText = CycleValue(SearchText, null, "am", "eu-", "atlantis"));

    public void ToggleAutoSearch()
        => SetLastChange(nameof(AutoSearch), AutoSearch = !AutoSearch);

    public void CycleDebounce()
        => SetLastChange(nameof(DebounceMilliseconds), DebounceMilliseconds = CycleValue(DebounceMilliseconds, 400, 1200, null));

    public void CycleMinSearchLength()
        => SetLastChange(nameof(MinSearchLength), MinSearchLength = CycleValue(MinSearchLength, 2, 4, 0, null));

    public void CycleSearchFieldAppearance()
        => SetLastChange(nameof(SearchFieldAppearance), SearchFieldAppearance = CycleEnum(SearchFieldAppearance));
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
        AddSizeOption();
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, null, "eu-west", "ap-south"));
}

/// <summary>
/// The field the term is typed into.
/// </summary>
internal sealed partial class SearchFieldGroupContext : OptionsFieldGroupContext
{
    public SearchFieldGroupContext() : base("Search regions", DemoIcons.Search, DemoIcons.Filter)
    {
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
        ("eu-west", "Amsterdam", "Europe"),
        ("eu-central", "Frankfurt", "Europe"),
        ("eu-north", "Stockholm", "Europe"),
        ("us-east", "Ashburn", "Americas"),
        ("ap-south", "Singapore", "Asia Pacific"),
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
/// One search box's state: what is typed, what the server answered, and what was picked out of it.
/// </summary>
/// <remarks>One per box on the page: the boxes differ only in when they ask.</remarks>
internal sealed partial class SearchListContext : RecursiveObservable
{
    private static readonly ServiceEntry[] Catalogue =
    [
        new("billing", "Billing", "12 replicas · eu-west", "Healthy", UIBadgeType.Success, DemoIcons.Shield),
        new("panel", "Panel", "4 replicas · eu-west", "Healthy", UIBadgeType.Success, DemoIcons.LayoutDashboard),
        new("dns", "DNS", "2 replicas · eu-west", "Degraded", UIBadgeType.Warning, DemoIcons.Search),
        new("mail-relay", "Mail Relay", "1 replica · us-east", "Paused", UIBadgeType.Surface, DemoIcons.Mail),
        new("metrics", "Metrics", "3 replicas · us-east", "Healthy", UIBadgeType.Success, DemoIcons.FileText)
    ];

    [RecursiveMember]
    public partial string? SearchText { get; set; }

    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> Results { get; } = [];

    public SearchListContext()
    {
        Apply(null);
    }

    /// <summary>
    /// The answer to a term: the list is what the server sends back, not a client-side filter.
    /// </summary>
    public void Apply(string? term)
    {
        IEnumerable<ServiceEntry> matches = string.IsNullOrWhiteSpace(term)
            ? Catalogue
            : Catalogue.Where(entry => entry.Title.Contains(term, StringComparison.OrdinalIgnoreCase)
                || entry.Id.Contains(term, StringComparison.OrdinalIgnoreCase));

        Results.Clear();
        Results.AddRange(matches.Select(entry => new OptionItem
        {
            Id = entry.Id,
            Icon = entry.Icon,
            Title = entry.Title,
            Description = entry.Description,
            BadgeText = entry.Badge,
            BadgeStyle = entry.BadgeStyle
        }));
    }

    private readonly record struct ServiceEntry(string Id, string Title, string Description, string Badge, UIBadgeType BadgeStyle, string Icon);
}

/// <summary>
/// One command per options section, plus the one that answers the preview's search and the one the examples' boxes share.
/// </summary>
internal sealed partial class SearchController() : DemoStandardController
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

    [RecursiveMember]
    public partial SearchListContext ServicesList { get; set; } = new();

    [RecursiveMember]
    public partial SearchListContext PickList { get; set; } = new();

    [RecursiveMember]
    public partial SearchListContext MinLengthList { get; set; } = new();

    [RecursiveMember]
    public partial SearchListContext ManualList { get; set; } = new();

    /// <summary>
    /// Answers a triggered search, reading the term off the two-way bound <c>SearchText</c>.
    /// </summary>
    [UICommand]
    public void Search()
        => ResultsGroup.Apply(TermGroup.SearchText);

    /// <summary>
    /// One command for every example box, told which list to answer for by a literal argument; the term arrives through the two-way
    /// bound <c>SearchText</c>, which is committed whether the box asked for the search or a button did.
    /// </summary>
    [UICommand]
    public void SearchList(string list)
    {
        SearchListContext context = ResolveList(list);

        context.Apply(context.SearchText);
    }

    private SearchListContext ResolveList(string list)
        => list switch
        {
            nameof(PickList) => PickList,
            nameof(MinLengthList) => MinLengthList,
            nameof(ManualList) => ManualList,
            _ => ServicesList
        };

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
