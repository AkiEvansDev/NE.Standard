using System.Globalization;
using DemoApp.Controllers.Base;

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
        new() { Id = "e3", Title = "Robin", Kind = ImageKind, Source = DemoImages.HarbourSky, Description = "The status page's banner at 09:14, before the rollback." },
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
/// The order a release reaches the services in, which a drag changes; the status page stays first, whatever is dropped above it.
/// </summary>
internal sealed partial class RolloutOrderGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Services { get; } =
    [
        new() { Id = "status-page", IsContent = true, Icon = DemoIcons.Bell, Title = "Status Page", Description = "First, always: it says the rollout is on", BadgeText = "pinned", BadgeStyle = UIBadgeType.Surface, CanDrag = false },
        new() { Id = "panel", IsContent = true, Icon = DemoIcons.LayoutDashboard, Title = "Panel", Description = "4 replicas · eu-west" },
        new() { Id = "dns", IsContent = true, Icon = DemoIcons.Link, Title = "DNS", Description = "2 replicas · eu-west" },
        new() { Id = "metrics", IsContent = true, Icon = DemoIcons.FileText, Title = "Metrics", Description = "3 replicas · us-east" },
        new() { Id = "billing", IsContent = true, Icon = DemoIcons.Shield, Title = "Billing", Description = "12 replicas · eu-west" }
    ];

    /// <summary>
    /// Moves the row keyed <paramref name="id"/> to <paramref name="index"/>, as the drop asked; nothing moved on the page until now.
    /// </summary>
    public void Move(string id, int index)
    {
        var from = IndexOf(id);

        if (from < 0)
            return;

        // The pinned row cannot be dragged, but another can be dropped above it; the controller has the last word.
        if (index == 0)
        {
            LogEvent($"{id} stays after the status page");
            return;
        }

        Services.Move(from, index);
        LogEvent($"{id} -> place {index + 1}");
    }

    private int IndexOf(string id)
    {
        for (var i = 0; i < Services.Count; i++)
        {
            if (Services[i].Id == id)
                return i;
        }

        return -1;
    }
}

/// <summary>
/// A failover's steps in the order they are run, put in order by the grip at each row's end: the commands in the rows stay there to
/// be selected and copied.
/// </summary>
internal sealed partial class RunbookGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Steps { get; } =
    [
        new() { Id = "freeze", IsContent = true, Icon = DemoIcons.Lock, Title = "Freeze deploys", Description = "deployctl freeze --all" },
        new() { Id = "drain", IsContent = true, Icon = DemoIcons.Server, Title = "Drain eu-west", Description = "kubectl drain eu-west-1 --ignore-daemonsets" },
        new() { Id = "promote", IsContent = true, Icon = DemoIcons.Upload, Title = "Promote the replica", Description = "pg_ctl promote -D /var/lib/postgresql" },
        new() { Id = "dns", IsContent = true, Icon = DemoIcons.Link, Title = "Point DNS at us-east", Description = "dnsctl set api.example.com us-east" },
        new() { Id = "thaw", IsContent = true, Icon = DemoIcons.BadgeCheck, Title = "Thaw deploys", Description = "deployctl thaw --all" }
    ];

    /// <summary>Moves the step keyed <paramref name="id"/> to <paramref name="index"/>, as the drop asked.</summary>
    public void Move(string id, int index)
    {
        for (var i = 0; i < Steps.Count; i++)
        {
            if (Steps[i].Id != id)
                continue;

            Steps.Move(i, index);
            LogEvent($"{id} -> step {index + 1}");
            return;
        }
    }
}

/// <summary>
/// The groups on the Examples page with state: a feed whose entries change shape, and lists put in order by a drag.
/// </summary>
internal sealed partial class ItemsViewExamplesController() : DemoController
{
    [RecursiveMember]
    public partial FeedGroupContext FeedGroup { get; set; } = new();

    [RecursiveMember]
    public partial RolloutOrderGroupContext OrderGroup { get; set; } = new();

    [RecursiveMember]
    public partial RunbookGroupContext RunbookGroup { get; set; } = new();

    [UICommand]
    public void MoveService(string id, int index)
        => OrderGroup.Move(id, index);

    [UICommand]
    public void MoveStep(string id, int index)
        => RunbookGroup.Move(id, index);

    [UICommand]
    public void PostNote()
        => FeedGroup.Post();

    [UICommand]
    public void FlipNewest()
        => FeedGroup.FlipNewest();
}
