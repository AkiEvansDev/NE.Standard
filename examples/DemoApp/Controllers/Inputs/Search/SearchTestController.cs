using System;
using System.Collections.Generic;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Search;

/// <summary>
/// Server-side search over a bound <c>Options</c> collection — the shape a real remote search takes, and
/// the one that exercises client-rendered options end to end: the query arrives as a command, the
/// controller rebuilds the collection, and the popup is re-rendered from the templates client-side.
/// </summary>
internal sealed partial class SearchQueryGroupContext : DemoGroupContext
{
    private static readonly (string Id, string Title, string Description, string Icon)[] Catalog =
    [
        ("api", "nova-api", "Public REST surface", LucideIcons.Send),
        ("web", "nova-web", "Dashboard front end", LucideIcons.ExternalLink),
        ("worker", "nova-worker", "Background jobs", LucideIcons.History),
        ("gateway", "nova-gateway", "Edge routing", LucideIcons.Upload),
        ("scheduler", "nova-scheduler", "Cron and retries", LucideIcons.History),
        ("registry", "nova-registry", "Artifact storage", LucideIcons.Download),
    ];

    [RecursiveMember]
    public partial string? SearchText { get; set; }

    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> Options { get; } = [];

    public SearchQueryGroupContext()
    {
        Apply(null);
    }

    public void Search()
    {
        Apply(SearchText);
        LogEvent($"search -> \"{SearchText}\" ({Options.Count} match(es))");
    }

    public void RecordSelection()
        => LogEvent($"selected -> \"{Value}\"");

    /// <summary>
    /// Rebuilds the collection in place — removing what no longer matches and adding what does, rather
    /// than clearing and refilling — so the client receives ordinary Remove/Insert changes and the
    /// options that stay never re-render.
    /// </summary>
    private void Apply(string? query)
    {
        List<(string Id, string Title, string Description, string Icon)> matches = [];

        foreach ((var id, var title, var description, var icon) in Catalog)
        {
            if (string.IsNullOrWhiteSpace(query) || title.Contains(query, StringComparison.OrdinalIgnoreCase))
                matches.Add((id, title, description, icon));
        }

        for (var i = Options.Count - 1; i >= 0; i--)
        {
            if (!matches.Exists(match => string.Equals(match.Id, Options[i].Id, StringComparison.Ordinal)))
                Options.RemoveAt(i);
        }

        for (var i = 0; i < matches.Count; i++)
        {
            (var id, var title, var description, var icon) = matches[i];

            if (Options.Count > i && string.Equals(Options[i].Id, id, StringComparison.Ordinal))
                continue;

            Options.Insert(i, new OptionItem
            {
                Id = id,
                Title = title,
                Description = description,
                Icon = icon
            });
        }
    }
}

internal sealed partial class SearchTestController() : DemoController
{
    [RecursiveMember]
    public partial SearchQueryGroupContext QueryGroup { get; set; } = new();

    [UICommand]
    public void Search()
        => QueryGroup.Search();

    [UICommand]
    public void RecordSelection()
        => QueryGroup.RecordSelection();
}
