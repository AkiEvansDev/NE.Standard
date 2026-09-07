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
/// One search box's state: what is typed, what the server answered, and what was picked out of it.
/// </summary>
/// <remarks>One per box on the page: the boxes differ only in how they show a selection.</remarks>
internal sealed partial class SearchExamplesListContext : RecursiveObservable
{
    private static readonly ServiceEntry[] Catalogue =
    [
        new("payments-api", "Payments API", "12 replicas · eu-west-1", "Healthy", UIBadgeType.Success, DemoIcons.Shield),
        new("web-portal", "Web Portal", "4 replicas · eu-west-1", "Healthy", UIBadgeType.Success, DemoIcons.LayoutDashboard),
        new("search-indexer", "Search Indexer", "2 replicas · eu-central-1", "Degraded", UIBadgeType.Warning, DemoIcons.Search),
        new("mail-relay", "Mail Relay", "1 replica · us-east-1", "Paused", UIBadgeType.Surface, DemoIcons.Mail),
        new("report-builder", "Report Builder", "3 replicas · us-east-1", "Healthy", UIBadgeType.Success, DemoIcons.FileText)
    ];

    [RecursiveMember]
    public partial string? SearchText { get; set; }

    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> Results { get; } = [];

    public SearchExamplesListContext()
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
/// The three boxes on the Search examples page, and the one command all of them search through.
/// </summary>
internal sealed partial class SearchExamplesController() : DemoController
{
    [RecursiveMember]
    public partial SearchExamplesListContext ServicesList { get; set; } = new();

    [RecursiveMember]
    public partial SearchExamplesListContext KeepTextList { get; set; } = new();

    [RecursiveMember]
    public partial SearchExamplesListContext ReplaceTextList { get; set; } = new();

    /// <summary>
    /// One command for every box, told which list to answer for by a literal argument; the term arrives through
    /// the two-way bound <c>SearchText</c>.
    /// </summary>
    [UICommand]
    public void Search(string list)
    {
        SearchExamplesListContext context = Resolve(list);

        context.Apply(context.SearchText);
    }

    private SearchExamplesListContext Resolve(string list)
        => list switch
        {
            nameof(KeepTextList) => KeepTextList,
            nameof(ReplaceTextList) => ReplaceTextList,
            _ => ServicesList
        };
}
