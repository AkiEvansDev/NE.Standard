using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Items.ItemsView;

/// <summary>
/// One entry of a feed drawn two ways; which one is a value on the entry, so a controller can swap it.
/// </summary>
internal sealed partial class DemoFeedItem : TextItem
{
    /// <summary>The template variant key — <c>note</c> or <c>image</c>.</summary>
    [RecursiveMember]
    public partial string Kind { get; set; } = FeedGroupContext.NoteKind;

    [RecursiveMember]
    public partial string? Source { get; set; }
}

/// <summary>
/// The feed, and the one thing the page does to it: the newest entry changes kind.
/// </summary>
internal sealed partial class FeedGroupContext : DemoGroupContext
{
    public const string NoteKind = "note";
    public const string ImageKind = "image";

    private int _posted;

    [RecursiveMember(false)]
    public RecursiveCollection<DemoFeedItem> Entries { get; } =
    [
        new() { Id = "e1", Title = "Robin", Description = "The staging deploy is stuck on the health check again." },
        new() { Id = "e2", Title = "Alex", Description = "Same pair as Tuesday. Rolling back to 480 while I look." },
        new() { Id = "e3", Title = "Robin", Kind = ImageKind, Source = DemoImages.HarbourSky, Description = "The dashboard at 09:14, before the rollback." },
        new() { Id = "e4", Title = "Alex", Description = "481 is green. Eight of eight, four minutes twelve." }
    ];

    public void Post()
    {
        _posted++;

        Entries.Add(new DemoFeedItem
        {
            Id = string.Create(CultureInfo.InvariantCulture, $"posted-{_posted}"),
            Title = "You",
            Description = string.Create(CultureInfo.InvariantCulture, $"Note {_posted}, posted while the page was open.")
        });

        LogEvent($"posted entry {_posted}");
    }

    /// <summary>
    /// Writes the entry's <c>Kind</c>, the host's template key, so the row is redrawn without touching the collection.
    /// </summary>
    public void FlipNewest()
    {
        if (Entries.Count == 0)
            return;

        DemoFeedItem newest = Entries[^1];
        var toImage = newest.Kind != ImageKind;

        newest.Kind = toImage ? ImageKind : NoteKind;
        newest.Source = toImage ? DemoImages.MeteorShore : null;

        LogEvent($"{newest.Id} is now a {newest.Kind}");
    }
}

/// <summary>
/// The one group on the Examples page with state: a feed whose entries change shape.
/// </summary>
internal sealed partial class ItemsViewExamplesController() : DemoController
{
    [RecursiveMember]
    public partial FeedGroupContext FeedGroup { get; set; } = new();

    [UICommand]
    public void PostNote()
        => FeedGroup.Post();

    [UICommand]
    public void FlipNewest()
        => FeedGroup.FlipNewest();
}
