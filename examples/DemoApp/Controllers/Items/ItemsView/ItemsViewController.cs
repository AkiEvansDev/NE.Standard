using System;
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
    public partial string Kind { get; set; } = RowMenusGroupContext.NoteKind;

    [RecursiveMember]
    public partial string? Source { get; set; }

    /// <summary>The entries of the row's context menu, which differ by kind: a flip changes them with the template.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Menu { get; } = [];
}

/// <summary>
/// Rows whose menus are their own: files that open on a press and carry their actions in a bar, a delete taking the row away; and a
/// feed, with what the page does to it — a note or a picture posted at its end, and the newest entry changing kind — and the entries at its
/// top and its foot, which the page writes back as the reader scrolls.
/// </summary>
internal sealed partial class RowMenusGroupContext : DemoGroupContext
{
    public const string NoteKind = "note";
    public const string ImageKind = "image";

    private static readonly string[] Pictures = [DemoImages.NightStreet, DemoImages.SunsetRuins, DemoImages.MeteorShore, DemoImages.HarbourSky];
    private static readonly PathSegment TopEntrySegment = PathSegment.ForProperty(nameof(TopEntry));
    private static readonly PathSegment BottomEntrySegment = PathSegment.ForProperty(nameof(BottomEntry));

    private int _posted;

    /// <summary>The key of the feed's entry at its top, as the page writes it; followed as it lands into the line under the feed.</summary>
    [RecursiveMember(false)]
    public string? TopEntry
    {
        get;
        set
        {
            if (SetRecursiveProperty(ref field, value, TopEntrySegment))
                InView = DescribeInView();
        }
    }

    /// <summary>The key of the feed's entry at its foot, as the page writes it; followed the same way.</summary>
    [RecursiveMember(false)]
    public string? BottomEntry
    {
        get;
        set
        {
            if (SetRecursiveProperty(ref field, value, BottomEntrySegment))
                InView = DescribeInView();
        }
    }

    [RecursiveMember]
    public partial string InView { get; set; } = "In view: not reported yet";

    private string DescribeInView()
        => $"In view: {TopEntry ?? "nothing"} to {BottomEntry ?? "nothing"}";

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Files { get; } =
    [
        new() { Id = "q3-report", IsContent = true, Icon = DemoIcons.Outline(DemoIcons.FileText), Title = "Q3 report.pdf", Description = "2.4 MB · edited yesterday" },
        new() { Id = "roadmap", IsContent = true, Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard), Title = "Roadmap 2027.board", Description = "Shared with the platform team" },
        new() { Id = "logo", IsContent = true, Icon = DemoIcons.Outline(DemoIcons.Palette), Title = "Logo, final.svg", Description = "18 KB · edited last week" },
        new() { Id = "contracts", IsContent = true, Icon = DemoIcons.Outline(DemoIcons.Folder), Title = "Contracts", Description = "12 files" }
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<DemoFeedItem> Entries { get; } =
    [
        WithMenu(new() { Id = "e1", Title = "Robin", Description = "The staging deploy is stuck on the health check again." }),
        WithMenu(new() { Id = "e2", Title = "Alex", Description = "Same pair as Tuesday. Rolling back to 480 while I look." }),
        WithMenu(new() { Id = "e3", Title = "Robin", Kind = ImageKind, Source = DemoImages.HarbourSky, Description = "The status page's banner at 09:14, before the rollback." }),
        WithMenu(new() { Id = "e4", Title = "Alex", Description = "481 is green. Eight of eight, four minutes twelve." })
    ];

    public void Post()
    {
        _posted++;

        Entries.Add(WithMenu(new DemoFeedItem
        {
            Id = string.Create(CultureInfo.InvariantCulture, $"posted-{_posted}"),
            Title = "You",
            Description = string.Create(CultureInfo.InvariantCulture, $"Note {_posted}, posted while the page was open.")
        }));

        LogEvent($"posted entry {_posted}");
    }

    /// <summary>
    /// Posts a picture whose size the row does not know: it is drawn before the picture arrives and grows when it does.
    /// </summary>
    /// <remarks>A fresh address each time, as a new upload has, so the browser cannot answer it from its cache before the first paint.</remarks>
    public void PostPicture()
    {
        _posted++;

        Entries.Add(WithMenu(new DemoFeedItem
        {
            Id = string.Create(CultureInfo.InvariantCulture, $"posted-{_posted}"),
            Title = "You",
            Kind = ImageKind,
            Source = string.Create(CultureInfo.InvariantCulture, $"{Pictures[_posted % Pictures.Length]}?post={_posted}"),
            Description = string.Create(CultureInfo.InvariantCulture, $"Picture {_posted}, at its own proportions.")
        }));

        LogEvent($"posted picture {_posted}");
    }

    /// <summary>An entry of a file's menu, pressed in its bar or its menu alike.</summary>
    public void ActOnFile(string action, string id)
    {
        if (action != "delete")
        {
            LogEvent($"{action} on {id}");
            return;
        }

        for (var i = 0; i < Files.Count; i++)
        {
            if (Files[i].Id != id)
                continue;

            Files.RemoveAt(i);
            LogEvent($"Deleted {id}");
            return;
        }
    }

    /// <summary>What a press on an entry of a feed row's context menu did.</summary>
    public void Act(string action, string id)
        => LogEvent($"{action} on {id}");

    /// <summary>Fills the entry's context menu for its kind: a note is copied or pinned, a picture opened or saved.</summary>
    private static DemoFeedItem WithMenu(DemoFeedItem entry)
    {
        entry.Menu.Clear();

        if (string.Equals(entry.Kind, ImageKind, StringComparison.Ordinal))
        {
            // The standard entries from the presets, in the framework's words; the one with choices of its own written by hand.
            entry.Menu.Add(UIMenuItems.Open());
            entry.Menu.Add(new MenuItem
            {
                Id = "save",
                IsContent = true,
                Title = "Save the picture",
                Icon = DemoIcons.Outline(DemoIcons.Upload),
                Items =
                {
                    new MenuItem { Id = "as-png", IsContent = true, Title = "As PNG" },
                    new MenuItem { Id = "as-jpeg", IsContent = true, Title = "As JPEG" }
                }
            });
        }
        else
        {
            entry.Menu.Add(UIMenuItems.Copy());
            entry.Menu.Add(UIMenuItems.Pin());
        }

        return entry;
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

        // In place, with the kind: the row redrawn in the other template opens the other menu.
        _ = WithMenu(newest);

        LogEvent($"{newest.Id} is now a {newest.Kind}, and its menu with it");
    }
}

/// <summary>
/// A service of the grouped list: its region is its group until it is pinned, and its place in the first order is where an unpin
/// puts it back.
/// </summary>
internal sealed partial class DemoPinnableService : TextItem, IBindableGroup
{
    [RecursiveMember]
    public partial string? Group { get; set; }

    [RecursiveMember(false)]
    public string Region { get; init; } = string.Empty;

    [RecursiveMember(false)]
    public int Order { get; init; }

    [RecursiveMember]
    public partial UIVisibility PinVisibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial UIVisibility UnpinVisibility { get; set; } = UIVisibility.Collapsed;

    public bool IsPinned
        => Group == PinnedServicesGroupContext.PinnedGroup;

    public void SetPinned(bool pinned)
    {
        Group = pinned ? PinnedServicesGroupContext.PinnedGroup : Region;
        PinVisibility = pinned ? UIVisibility.Collapsed : UIVisibility.Visible;
        UnpinVisibility = pinned ? UIVisibility.Visible : UIVisibility.Collapsed;
    }
}

/// <summary>
/// Services bucketed by region, any of which may be pinned: a pinned row goes to the head under a group the list did not hold before,
/// which stands first because the source has it first; unpinned, it goes back to its region, where it stood.
/// </summary>
internal sealed partial class PinnedServicesGroupContext : DemoGroupContext
{
    public const string PinnedGroup = "Pinned";

    [RecursiveMember(false)]
    public RecursiveCollection<DemoPinnableService> Services { get; } =
    [
        Service(0, "billing", "Billing", "12 replicas · eu-west", "Europe West", "Healthy", UIBadgeType.Success, DemoIcons.Shield),
        Service(1, "panel", "Panel", "4 replicas · eu-west", "Europe West", "Healthy", UIBadgeType.Success, DemoIcons.LayoutDashboard),
        Service(2, "dns", "DNS", "2 replicas · eu-west", "Europe West", "Degraded", UIBadgeType.Warning, DemoIcons.Link),
        Service(3, "mail-relay", "Mail Relay", "1 replica · us-east", "US East", "Paused", UIBadgeType.Surface, DemoIcons.Mail),
        Service(4, "metrics", "Metrics", "3 replicas · us-east", "US East", "Healthy", UIBadgeType.Success, DemoIcons.FileText),
        Service(5, "status-page", "Status Page", "2 replicas · us-east", "US East", "Healthy", UIBadgeType.Success, DemoIcons.Bell),
        Service(6, "scheduler", "Scheduler", "1 replica · ap-south", "Asia South", "Healthy", UIBadgeType.Success, DemoIcons.Clock),
        Service(7, "audit-log", "Audit Log", "2 replicas · ap-south", "Asia South", "Healthy", UIBadgeType.Success, DemoIcons.History)
    ];

    private static DemoPinnableService Service(int order, string id, string title, string description, string region, string badge, UIBadgeType badgeStyle, string icon)
        => new() { Id = id, IsContent = true, Order = order, Icon = icon, Title = title, Description = description, BadgeText = badge, BadgeStyle = badgeStyle, Group = region, Region = region };

    /// <summary>Pins the service keyed <paramref name="id"/> at the list's head, or takes its pin off and puts it back in its region.</summary>
    public void TogglePin(string id)
    {
        var from = IndexOf(id);

        if (from < 0)
            return;

        DemoPinnableService service = Services[from];
        var pin = !service.IsPinned;

        // Out and back in rather than a move: the row lands under another group, and an insert is what a source sends for that.
        Services.RemoveAt(from);
        service.SetPinned(pin);
        Services.Insert(pin ? 0 : HomeOf(service), service);

        LogEvent(pin ? $"{id} pinned" : $"{id} back under {service.Region}");
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

    /// <summary>Where an unpinned service goes back to: before the first unpinned one that followed it in the first order.</summary>
    private int HomeOf(DemoPinnableService service)
    {
        for (var i = 0; i < Services.Count; i++)
        {
            if (!Services[i].IsPinned && Services[i].Order > service.Order)
                return i;
        }

        return Services.Count;
    }

    public void Open(string id)
        => LogEvent($"Opened {id}");
}

/// <summary>
/// Two lists put in order. A deploy queue whose order the controller keeps: the running deploy stays first, so a row dropped above it
/// lands second, and a frozen deploy does not move at all. And a failover's steps, put in order by the grip at each row's end, so the
/// commands in the rows stay there to be selected and copied.
/// </summary>
/// <remarks>The page moves a dropped row at once; this answer is what it settles on, or goes back from.</remarks>
internal sealed partial class DeployQueueGroupContext : DemoGroupContext
{
    public const string FrozenId = "dns-97";

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Deploys { get; } =
    [
        new() { Id = "billing-482", IsContent = true, Icon = DemoIcons.Upload, Title = "billing #482", Description = "Running now", BadgeText = "running", BadgeStyle = UIBadgeType.Info, CanDrag = false },
        new() { Id = "panel-311", IsContent = true, Icon = DemoIcons.Upload, Title = "panel #311", Description = "Queued by Robin" },
        new() { Id = FrozenId, IsContent = true, Icon = DemoIcons.Upload, Title = "dns #97", Description = "Held until the zone audit ends", BadgeText = "frozen", BadgeStyle = UIBadgeType.Warning },
        new() { Id = "metrics-58", IsContent = true, Icon = DemoIcons.Upload, Title = "metrics #58", Description = "Queued by Alex" },
        new() { Id = "mail-12", IsContent = true, Icon = DemoIcons.Upload, Title = "mail #12", Description = "Queued by Robin" }
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Steps { get; } =
    [
        new() { Id = "freeze", IsContent = true, Icon = DemoIcons.Lock, Title = "Freeze deploys", Description = "deployctl freeze --all" },
        new() { Id = "drain", IsContent = true, Icon = DemoIcons.Server, Title = "Drain eu-west", Description = "kubectl drain eu-west-1 --ignore-daemonsets" },
        new() { Id = "promote", IsContent = true, Icon = DemoIcons.Upload, Title = "Promote the replica", Description = "pg_ctl promote -D /var/lib/postgresql" },
        new() { Id = "dns", IsContent = true, Icon = DemoIcons.Link, Title = "Point DNS at us-east", Description = "dnsctl set api.example.com us-east" },
        new() { Id = "thaw", IsContent = true, Icon = DemoIcons.BadgeCheck, Title = "Thaw deploys", Description = "deployctl thaw --all" }
    ];

    /// <summary>Moves the deploy keyed <paramref name="id"/> where the queue's rules allow, which may not be where the drop asked.</summary>
    public void Move(string id, int index)
    {
        var from = -1;

        for (var i = 0; i < Deploys.Count; i++)
        {
            if (Deploys[i].Id != id)
                continue;

            from = i;
            break;
        }

        if (from < 0)
            return;

        // The frozen row stays draggable on purpose: the refusal is the controller's, so the page shows the row go back.
        if (id == FrozenId)
        {
            LogEvent($"{id} is frozen and stays at place {from + 1}");
            return;
        }

        var target = Math.Max(index, 1);

        Deploys.Move(from, target);
        LogEvent(target == index ? $"{id} -> place {target + 1}" : $"{id} asked for place {index + 1}; the running deploy keeps it, so place {target + 1}");
    }

    /// <summary>Moves the step keyed <paramref name="id"/> to <paramref name="index"/>, as the drop asked.</summary>
    public void MoveStep(string id, int index)
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
/// A board of three lists whose cards move between them: each list offers its cards as one kind and takes that kind back, so a card
/// dragged (or cut and pasted) from one list into another moves there, and the notes beside them take a copy of a card's title. The
/// routines beside the board lend copies only: a routine dragged onto the board is a new card there, and the routine stays.
/// </summary>
/// <remarks>The page moves a card between two lists at once; the controller's moves are the answer it keeps, or goes back from.</remarks>
internal sealed partial class BoardGroupContext : DemoGroupContext
{
    /// <summary>The kind every list offers its cards as and takes back, and the notes take a copy of.</summary>
    public const string CardKind = "card";
    public const string Todo = "board-todo";
    public const string Doing = "board-doing";
    public const string Done = "board-done";
    public const string Routines = "board-routines";
    public const string TodoTitle = "To do";
    public const string DoingTitle = "In progress";
    public const string DoneTitle = "Done";
    public const string RoutinesTitle = "Routines";

    private int _copies;

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> TodoCards { get; } =
    [
        new() { Id = "rotate-keys", IsContent = true, Title = "Rotate the API keys", Description = "Before the audit" },
        new() { Id = "status-copy", IsContent = true, Title = "Rewrite the status page copy", Description = "Shorter, plainer" },
        new() { Id = "alert-noise", IsContent = true, Title = "Quiet the disk alerts", Description = "Three a night, none real" }
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> DoingCards { get; } =
    [
        new() { Id = "dns-audit", IsContent = true, Title = "Audit the DNS zone", Description = "Half the records checked" }
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> DoneCards { get; } =
    [
        new() { Id = "backup-test", IsContent = true, Title = "Restore last night's backup", Description = "It worked" }
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> RoutineCards { get; } =
    [
        new() { Id = "rotate-certificates", IsContent = true, Title = "Rotate the TLS certificates", Description = "Every ninety days" },
        new() { Id = "restore-drill", IsContent = true, Title = "Run a restore drill", Description = "Monthly, on a staging copy" },
        new() { Id = "access-review", IsContent = true, Title = "Review who has access", Description = "Every quarter" }
    ];

    [RecursiveMember]
    public partial string? Notes { get; set; }

    /// <summary>Moves a card within its own list, as a drag between two of its rows asked.</summary>
    public void Move(string list, string id, int index)
    {
        if (CardsOf(list) is not RecursiveCollection<TextItem> cards)
            return;

        var from = IndexOf(cards, id);

        if (from < 0)
            return;

        cards.Move(from, index);
        LogEvent($"{id} -> place {index + 1} in {TitleOf(list)}");
    }

    /// <summary>The cards of the list a key names; null for any other, whose drop then moves nothing.</summary>
    private RecursiveCollection<TextItem>? CardsOf(string? list)
        => list switch
        {
            Todo => TodoCards,
            Doing => DoingCards,
            Done => DoneCards,
            _ => null
        };

    /// <summary>The cards a drop may come from: a list of the board, or the routines, which no drop goes into.</summary>
    private RecursiveCollection<TextItem>? SourceOf(string? list)
        => list == Routines ? RoutineCards : CardsOf(list);

    private static int IndexOf(RecursiveCollection<TextItem> cards, string id)
    {
        for (var i = 0; i < cards.Count; i++)
        {
            if (cards[i].Id == id)
                return i;
        }

        return -1;
    }

    private static string TitleOf(string list)
        => list switch
        {
            Todo => TodoTitle,
            Doing => DoingTitle,
            _ => DoneTitle
        };

    /// <summary>Takes the cards a drop carried into the list, from the index it asked for: moved out of their list, or copied.</summary>
    public void Drop(UIDrop drop, string list)
    {
        if (CardsOf(list) is not RecursiveCollection<TextItem> target || SourceOf(drop.Source) is not RecursiveCollection<TextItem> source)
            return;

        var at = Math.Clamp(drop.Index ?? target.Count, 0, target.Count);
        // The routines lend copies only (`DragEffects.Copy`); the board holds to that whatever a drop says.
        var move = drop.Effect == UIDropEffect.Move && !ReferenceEquals(source, RoutineCards);

        foreach (var key in drop.Keys)
        {
            var from = IndexOf(source, key);

            // The page's word is checked against the board: a key no longer in its list moves nothing.
            if (from < 0)
                continue;

            TextItem card = source[from];

            if (move)
            {
                source.RemoveAt(from);
                target.Insert(at++, card);
            }
            else
            {
                target.Insert(at++, new TextItem { Id = string.Create(CultureInfo.InvariantCulture, $"{card.Id}-copy-{++_copies}"), IsContent = true, Title = card.Title, Description = card.Description });
            }
        }

        LogEvent($"{string.Join(", ", drop.Keys)} {(move ? "moved" : "copied")} to {TitleOf(list)}");
    }

    /// <summary>Writes the cards a drop carried into the notes, a line each: the notes take a copy and the cards stay where they are.</summary>
    public void Note(UIDrop drop)
    {
        if (SourceOf(drop.Source) is not RecursiveCollection<TextItem> source)
            return;

        foreach (var key in drop.Keys)
        {
            var from = IndexOf(source, key);

            if (from >= 0)
                Notes = string.IsNullOrEmpty(Notes) ? $"• {source[from].Title}" : $"{Notes}\n• {source[from].Title}";
        }

        LogEvent($"{string.Join(", ", drop.Keys)} noted");
    }
}

/// <summary>
/// One list and every property that can be bound to the host around it, and the examples with state: services pinned at the head of
/// their grouped list, rows put in order, a board whose lists trade cards, and rows whose menus are their own.
/// </summary>
internal sealed partial class ItemsViewController() : DemoStandardController
{
    [RecursiveMember]
    public partial ItemsViewGroupContext ItemsGroup { get; set; } = new();

    [RecursiveMember]
    public partial RowMenusGroupContext RowMenusGroup { get; set; } = new();

    [RecursiveMember]
    public partial PinnedServicesGroupContext ServicesGroup { get; set; } = new();

    [RecursiveMember]
    public partial DeployQueueGroupContext OrderGroup { get; set; } = new();

    [RecursiveMember]
    public partial BoardGroupContext BoardGroup { get; set; } = new();

    [UICommand]
    public void MoveItem(string id, int index)
        => ItemsGroup.MoveService(id, index);

    /// <summary>A press on a file's row: the bar over it is not the row, so its presses never come here.</summary>
    [UICommand]
    public void OpenFile(string id)
        => RowMenusGroup.LogEvent($"Opened {id}");

    [UICommand]
    public void FileAction(string action, string id)
        => RowMenusGroup.ActOnFile(action, id);

    [UICommand]
    public void TogglePin(string id)
        => ServicesGroup.TogglePin(id);

    /// <summary>Enter on the keyboard's row, or a double click: a row's open, apart from its press.</summary>
    [UICommand]
    public void OpenService(string id)
        => ServicesGroup.Open(id);

    [UICommand]
    public void MoveStep(string id, int index)
        => OrderGroup.MoveStep(id, index);

    [UICommand]
    public void MoveDeploy(string id, int index)
        => OrderGroup.Move(id, index);

    [UICommand]
    public void MoveCard(string list, string id, int index)
        => BoardGroup.Move(list, id, index);

    [UICommand]
    public void DropCards(UIDrop drop, string list)
        => BoardGroup.Drop(drop, list);

    [UICommand]
    public void NoteCards(UIDrop drop)
        => BoardGroup.Note(drop);

    [UICommand]
    public void PostNote()
        => RowMenusGroup.Post();

    [UICommand]
    public void PostPicture()
        => RowMenusGroup.PostPicture();

    [UICommand]
    public void FlipNewest()
        => RowMenusGroup.FlipNewest();

    [UICommand]
    public void FeedMenuAction(string action, string id)
        => RowMenusGroup.Act(action, id);
}
