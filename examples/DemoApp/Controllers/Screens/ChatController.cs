using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace DemoApp.Controllers.Screens;

/// <summary>A chat as the list draws it: its picture, the name, the last words and when they came, what is unread.</summary>
internal sealed partial class DemoChatItem : TextItem
{
    [RecursiveMember]
    public partial string Avatar { get; set; } = string.Empty;

    [RecursiveMember]
    public partial DateTimeOffset? At { get; set; }

    [RecursiveMember]
    public partial UIVisibility UnreadVisibility { get; set; } = UIVisibility.Collapsed;

    /// <summary>What the search reads: the name and the last words in one string, since a rule reads one property.</summary>
    [RecursiveMember]
    public partial string SearchText { get; set; } = string.Empty;

    /// <summary>The line under the name in the open chat's header: who they are, or how many are in it.</summary>
    [RecursiveMember(false)]
    public string Status { get; init; } = string.Empty;

    /// <summary>Whether the chat is a group, whose messages name their author.</summary>
    [RecursiveMember(false)]
    public bool IsGroup { get; init; }

    /// <summary>Every message of the chat, oldest first: the conversation reads it a window at a time.</summary>
    [RecursiveMember(false)]
    public List<DemoChatMessage> History { get; } = [];

    /// <summary>How many messages are unread, the badge's count.</summary>
    public int Unread { get; set; }
}

/// <summary>
/// A message: its author, words and moment, grouped by the day it was sent so a day header stands over each day's first, and drawn on
/// the reader's side or the other's — the template variant its <see cref="Side"/> names.
/// </summary>
internal sealed partial class DemoChatMessage(string id, string author, string text, DateTimeOffset sent, bool mine) : RecursiveObservable, IBindableGroup
{
    public const string Mine = "mine";
    public const string Theirs = "theirs";

    [RecursiveMember(false)]
    public string Id { get; } = id;

    /// <summary>The author's name over the words, in a group; empty for the reader's own and in a chat of two.</summary>
    [RecursiveMember]
    public partial string Author { get; set; } = author;

    [RecursiveMember]
    public partial string Text { get; set; } = text;

    [RecursiveMember(false)]
    public DateTimeOffset Sent { get; } = sent;

    [RecursiveMember(false)]
    public string Side { get; } = mine ? Mine : Theirs;

    /// <summary>The day it was sent, <c>yyyy-MM-dd</c>: the group, and what a press on its header hands the command.</summary>
    /// <remarks>
    /// A UTC day until the reader's zone is heard (<see cref="KeyDay"/>), then the reader's own, the day the header draws; a change
    /// reaches the row on the page, which moves under the header of its day.
    /// </remarks>
    [RecursiveMember]
    public partial string Group { get; private set; } = sent.UtcDateTime.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    /// <summary>
    /// The message's own actions: pin, edit and delete also stand in its action bar, reply and copy only in its menu; each answers the
    /// key its menu shows, for the message under the list's cursor.
    /// </summary>
    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Actions { get; } = CreateActions();

    /// <summary>Whether the message is pinned; its pin entry offers the other way round.</summary>
    public bool Pinned { get; private set; }

    /// <summary>Groups the message by its day in the reader's zone, which is the day its header draws.</summary>
    public void KeyDay(TimeZoneInfo zone)
        => Group = TimeZoneInfo.ConvertTime(Sent, zone).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    /// <summary>Pins the message or lets it go; the entry's words and glyph change on this row alone, in its menu and its bar alike.</summary>
    public void TogglePin()
    {
        Pinned = !Pinned;

        MenuItem pin = Actions[0];

        pin.Title = Pinned ? "demo.screens.chat.action.unpin" : "demo.screens.chat.action.pin";
        pin.Icon = Pinned ? UIGlyphs.PinOff : UIGlyphs.Pin;
    }

    private static RecursiveCollection<MenuItem> CreateActions()
        =>
        [
            new() { Id = "pin", Title = "demo.screens.chat.action.pin", Icon = UIGlyphs.Pin, InActionBar = true, Shortcut = "P" },
            new() { Id = "edit", Title = "demo.screens.chat.action.edit", Icon = UIGlyphs.Edit, InActionBar = true, Shortcut = "E" },
            new() { Id = "delete", Title = "demo.screens.chat.action.delete", Icon = UIGlyphs.Delete, IconColor = UIThemeColor.Danger, TitleColor = UIThemeColor.Danger, InActionBar = true, Shortcut = "Delete" },
            new() { Id = "rule", Kind = UIMenuItemKind.Separator },
            new() { Id = "reply", Title = "demo.screens.chat.action.reply", Icon = DemoIcons.Outline(DemoIcons.MessageSquare), Shortcut = "R" },
            // C alone: Ctrl+C stays the browser's copy of the words the reader selected in a message.
            new() { Id = "copy", Title = "demo.screens.chat.action.copy", Icon = DemoIcons.Outline(DemoIcons.Copy), Shortcut = "C" }
        ];
}

/// <summary>
/// The open chat's history read from its end backwards, a window at a time, carrying a total and the day of the message above the
/// window, so a day header stands over the first message of each day.
/// </summary>
internal sealed class DemoConversationSource : UIItemSourceBase<DemoChatMessage>
{
    private static readonly TimeSpan OlderHistoryLatency = TimeSpan.FromMilliseconds(400);

    private List<DemoChatMessage> _history = [];

    /// <summary>Shows another chat: its history, from the end.</summary>
    public Task ShowAsync(List<DemoChatMessage> history, CancellationToken cancellationToken)
    {
        _history = history;

        return LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.End, 30), cancellationToken);
    }

    /// <summary>The window that starts at a day's first message, and that message's key; nothing when the chat has none that day.</summary>
    public async Task<string?> ShowDayAsync(DateOnly day, CancellationToken cancellationToken)
    {
        var key = day.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        var index = _history.FindIndex(message => string.Equals(message.Group, key, StringComparison.Ordinal));

        if (index < 0)
            return null;

        await LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.At(index), 30), cancellationToken).ConfigureAwait(false);

        return _history[index].Id;
    }

    /// <summary>
    /// Reads the window the reader holds again where it starts, after the messages were keyed by another day: its first row's header is
    /// measured against the day of the message above it, which only a read says.
    /// </summary>
    public Task RefreshAsync(CancellationToken cancellationToken)
        => LoadWindowAsync(new UIItemWindowRequest(Offset is int offset ? UIItemAnchor.At(offset) : UIItemAnchor.End, Math.Max(30, Items.Count)), cancellationToken);

    /// <summary>A message joins the end of the history, and the window if the reader holds its end.</summary>
    public void Add(DemoChatMessage message)
    {
        _history.Add(message);

        // Only into the window the viewer is holding: a new message must not jump them to the end.
        if (!HasMoreAfter)
            Append(message);
        else if (TotalCount is int total)
            TotalCount = total + 1;
    }

    /// <summary>A message of the window the reader holds; one outside it has no row to act on.</summary>
    public DemoChatMessage? Get(string id)
        => Find(id);

    /// <summary>Takes a message out of the history and out of the window, its row with it, answering where it stood (-1 for nowhere).</summary>
    public int Delete(string id)
    {
        var index = _history.FindIndex(message => string.Equals(message.Id, id, StringComparison.Ordinal));

        if (index < 0)
            return -1;

        _history.RemoveAt(index);
        _ = Remove(id);

        return index;
    }

    /// <summary>A message deleted a moment ago goes back where it stood: into the history, and into the window if the reader holds that stretch.</summary>
    public void Restore(DemoChatMessage message, int index)
    {
        index = Math.Clamp(index, 0, _history.Count);
        _history.Insert(index, message);

        if (TotalCount is int total)
            TotalCount = total + 1;

        if (Offset is not int offset)
            return;

        // Before the window it moves the window's start on by one; past its end, while more follows, it is not the reader's to see yet.
        if (index < offset)
            Offset = offset + 1;
        else if (index < offset + Items.Count || (index == offset + Items.Count && !HasMoreAfter))
            Items.Insert(index - offset, message);
    }

    protected override async Task<UIItemWindow<DemoChatMessage>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken)
    {
        // Older history answers a beat late, as a server's would: what the conversation's ring at its top stands for meanwhile.
        if (request.Anchor.Kind == UIItemAnchorKind.Before)
            await Task.Delay(OlderHistoryLatency, cancellationToken).ConfigureAwait(false);

        var start = request.Anchor.Kind switch
        {
            UIItemAnchorKind.Start => 0,
            UIItemAnchorKind.End => _history.Count - request.Count,
            UIItemAnchorKind.Offset => request.Anchor.Offset,
            UIItemAnchorKind.Before => IndexOf(request.Anchor.Key!) - request.Count,
            UIItemAnchorKind.After => IndexOf(request.Anchor.Key!) + 1,
            _ => 0
        };

        start = Math.Clamp(start, 0, Math.Max(0, _history.Count - 1));

        DemoChatMessage[] items = [.. _history.Skip(start).Take(request.Count)];

        return new UIItemWindow<DemoChatMessage>(items)
        {
            Offset = start,
            TotalCount = _history.Count,
            HasMoreBefore = start > 0,
            HasMoreAfter = start + items.Length < _history.Count,
            // Only the source knows the day of the message just above the window: the window's first row is headed when that differs.
            GroupBefore = start > 0 ? _history[start - 1].Group : null
        };
    }

    private int IndexOf(string key)
        => _history.FindIndex(message => string.Equals(message.Id, key, StringComparison.Ordinal));
}

/// <summary>
/// A chat: its sections on a rail, the chats or the people of the one open, and the conversation of the chat pressed — read a window
/// at a time from its end, a day header over each day, a bar of actions over the message chosen, a composer that grows, sends on
/// Enter and carries attachments, and a calendar that goes to a day. A folder added is one more entry on the rail, so a phone's
/// bottom bar can be seen sharing its width and, past what fits, scrolling.
/// </summary>
internal sealed partial class ChatController : UIControllerBase
{
    /// <summary>The conversation's id, which the day jump and "the newest" scroll.</summary>
    public const string ConversationId = "chat-conversation";

    /// <summary>The composer's id, which the emoji tiles and a quick reply's answer insert into.</summary>
    public const string ComposerId = "chat-composer";

    /// <summary>The "go to a day" dialog's key.</summary>
    public const string DayKey = "chat-day";

    /// <summary>The wallpaper dialog's key.</summary>
    public const string WallpaperKey = "chat-wallpaper";

    private const string You = "You";
    private const string Said = "demo.screens.chat.said";

    private static readonly string[] FolderNames = ["Work", "Family", "Travel", "Reading", "Receipts"];

    private static readonly Dictionary<string, string> QuickReplyWords = new(StringComparer.Ordinal)
    {
        ["on-it"] = "On it, looking now.",
        ["runbook"] = "Runbook: https://docs.orvane.example/runbooks/failover",
        ["resolved"] = "Resolved; writing the summary next."
    };

    /// <summary>What the platform team says, day after day: the long history the conversation reads a window at a time.</summary>
    private static readonly (string Author, string Words)[] TeamTalk =
    [
        ("Priya Nair", "Morning. The retries review is in."),
        ("Alex Warren", "Queue depth is back under a thousand."),
        (You, "Thanks — merging after the build."),
        ("Grace Kim", "db-eu-west-2 is at 71 per cent."),
        ("Sam Ortega", "On call handed over, nothing pending."),
        ("Priya Nair", "Can someone look at CHG-482?"),
        (You, "Looking now."),
        ("Alex Warren", "The index rebuild is off the critical path."),
        ("Grace Kim", "Backups of eu-west moved to their own disk."),
        ("Sam Ortega", "Status page says all green."),
        (You, "Release 482 goes out region by region."),
        ("Priya Nair", "The canary looks healthy."),
        ("Alex Warren", "Rolling on to us-east."),
        ("Grace Kim", "Disk alert threshold set to 80."),
        ("Sam Ortega", "Lunch?"),
        (You, "Five minutes.")
    ];

    private int _folders;
    private int _sent;
    private int _received;
    private DemoChatItem _open;

    // What a delete took, by the message's id, for the toast's Undo to put back: a soft delete. A real store would purge the row once
    // the toast's window has passed; this history lives in memory, so there is nothing to purge.
    private readonly Dictionary<string, (DemoChatItem Chat, DemoChatMessage Message, int Index)> _deleted = new(StringComparer.Ordinal);

    // UTC until the reader's zone is heard, as the page attaches.
    private TimeZoneInfo _zone = TimeZoneInfo.Utc;

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Sections { get; } = [.. CreateSections()];

    [RecursiveMember(false)]
    public RecursiveCollection<DemoChatItem> Chats { get; } = [.. CreateChats(DateTimeOffset.UtcNow)];

    /// <summary>The people, each the chat with them: the name over a phrase of their last words and when, the unread count as the badge.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> People { get; } = [];

    [RecursiveMember(false)]
    public DemoConversationSource Conversation { get; } = new();

    [RecursiveMember]
    public partial UIPhrase? Heading { get; set; } = "Chats";

    [RecursiveMember]
    public partial string? SelectedKey { get; set; }

    [RecursiveMember]
    public partial string OpenName { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string OpenStatus { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string OpenAvatar { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string? Draft { get; set; }

    [RecursiveMember]
    public partial IReadOnlyList<string>? AttachmentIds { get; set; }

    /// <summary>The chats while the rail's Chats is open, the people while People is.</summary>
    [RecursiveMember]
    public partial UIVisibility ChatsVisibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial UIVisibility PeopleVisibility { get; set; } = UIVisibility.Collapsed;

    /// <summary>
    /// The list and the conversation: side by side from the wide breakpoint, one at a time below it — the list until a chat is
    /// pressed, the conversation until its back arrow is.
    /// </summary>
    [RecursiveMember]
    public partial UIResponsive<UIVisibility> ListVisibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> PaneVisibility { get; set; } = UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, xl: UIVisibility.Visible);

    [RecursiveMember]
    public partial DateOnly? JumpDay { get; set; }

    [RecursiveMember]
    public partial DateOnly? FirstDay { get; set; }

    [RecursiveMember]
    public partial DateOnly? LastDay { get; set; }

    [RecursiveMember]
    public partial IReadOnlyCollection<DateOnly>? MessageDays { get; set; }

    /// <summary>The wallpaper dialog's three settings, as the reader moves them: a switch, a dim as a share, a blur in pixels.</summary>
    [RecursiveMember]
    public partial bool WallpaperShown { get; set; } = true;

    [RecursiveMember]
    public partial decimal WallpaperDim { get; set; } = 0.5m;

    [RecursiveMember]
    public partial decimal WallpaperBlur { get; set; }

    /// <summary>What the messages' ground draws from those settings (<see cref="UpdateWallpaper"/>).</summary>
    [RecursiveMember]
    public partial string? WallpaperImage { get; set; } = DemoImages.HarbourSky;

    [RecursiveMember]
    public partial double? WallpaperDimShare { get; set; } = 0.5;

    [RecursiveMember]
    public partial double? WallpaperBlurLength { get; set; }

    /// <summary>Opens on the first chat, so a wide screen shows a conversation beside the list from the start.</summary>
    public ChatController()
    {
        _open = Chats[0];

        foreach (DemoChatItem chat in Chats)
        {
            if (!chat.IsGroup)
                People.Add(new MenuItem { Id = chat.Id, Title = chat.Title, Icon = chat.Avatar, IconShape = UIIconShape.Circle, BadgeStyle = UIBadgeType.Primary, IsContent = true });
        }

        Describe(_open);
        Read(_open);
        RefreshPeople();
    }

    private static MenuItem[] CreateSections()
    {
        MenuItem settings = new() { Id = "settings", Title = "Settings", Icon = DemoIcons.Outline(DemoIcons.Settings) };

        settings.Items.Add(new MenuItem { Id = "profile", Title = "Profile", Icon = DemoIcons.Outline(DemoIcons.User) });
        settings.Items.Add(new MenuItem { Id = "privacy", Title = "Privacy", Icon = DemoIcons.Outline(DemoIcons.Lock) });
        settings.Items.Add(new MenuItem { Id = "demo", Title = "All demos", Icon = DemoIcons.Outline(DemoIcons.Home), Url = "/" });

        return
        [
            new MenuItem { Id = "chats", Title = "Chats", Icon = DemoIcons.Outline(DemoIcons.MessageSquare), BadgeStyle = UIBadgeType.Primary, Selected = true },
            new MenuItem { Id = "people", Title = "People", Icon = DemoIcons.Outline(DemoIcons.Groups) },
            // Empty, not null: a dot on the icon's corner, something new with nothing to count.
            new MenuItem { Id = "activity", Title = "Activity", Icon = DemoIcons.Outline(DemoIcons.Bell), BadgeText = "", BadgeStyle = UIBadgeType.Primary },
            settings
        ];
    }

    private static DemoChatItem[] CreateChats(DateTimeOffset now)
        =>
        [
            Chat("c1", "Robin Hale", DemoImages.Avatar, "Release manager", now.AddMinutes(-2), 2,
                ("Morning! Is the deploy calendar settled?", false), ("Almost. Half the team is in Amsterdam next week.", true), ("The deploy calendar moved to Wednesday.", false), ("Can you take the Friday slot too?", false)),
            Team("c2", "Platform team", DemoImages.HarbourSky, "6 members", now.AddMinutes(-14), 5),
            Chat("c3", "Sam Ortega", Initials("Sam Ortega", "#3fa66b"), "On call this week", now.AddMinutes(-48), 0,
                ("How did 482 go?", true), ("Release 482 is live, nothing pending.", false)),
            Chat("c4", "Mika Laine", DemoImages.NightStreet, "Product design", now.AddHours(-2), 1,
                ("Amsterdam next week, lunch on Tuesday?", false)),
            Chat("c5", "Billing", Initials("Billing", "#e2734b"), "Orvane billing desk", now.AddHours(-5), 0,
                ("Bramble Studio's invoice is attached.", false)),
            Chat("c6", "Priya Nair", Initials("Priya Nair", "#9a6bdb"), "Reviews", now.AddHours(-9), 0,
                ("Could you look at CHG-482?", true), ("Two comments, neither blocking.", false)),
            Chat("c7", "On call", Initials("On call", "#2a9d9f"), "4 members", now.AddDays(-1), 0,
                ("Quiet night. The index rebuild is off the path.", false)),
            Chat("c8", "Design crit", DemoImages.SunsetRuins, "9 members", now.AddDays(-1).AddHours(-3), 0,
                ("The rail reads well at phone width now.", false)),
            Chat("c9", "Ferro Logistics", Initials("Ferro Logistics", "#d9558a"), "Customer", now.AddDays(-2), 0,
                ("Card ending 4411 expires in October.", false)),
            Chat("c10", "Alex Warren", Initials("Alex Warren", "#5b8def"), "Infrastructure", now.AddDays(-3), 0,
                ("The queue drained in two minutes.", false), ("Nice. Closing the incident.", true)),
            Chat("c11", "Release notes", DemoImages.Logo, "Channel", now.AddDays(-4), 0,
                ("481 rolled back, 482 went out clean.", false)),
            Chat("c12", "Office", Initials("Office", "#c4932f"), "12 members", now.AddDays(-5), 0,
                ("The coffee machine is fixed. Truly.", false)),
            Chat("c13", "Grace Kim", Initials("Grace Kim", "#3d8f8a"), "Databases", now.AddDays(-6), 0,
                ("Photos from the offsite are up.", false)),
            Chat("c14", "Orvane Trust CA", Initials("Orvane Trust", "#6b7a8f"), "Certificates", now.AddDays(-8), 0,
                ("The certificate for bramble.example renews in three days.", false))
        ];

    // A person's name and words are theirs, never a key: IsContent keeps them, and the picture's address, as written.
    private static DemoChatItem Chat(string id, string name, string avatar, string status, DateTimeOffset at, int unread, params (string Words, bool Mine)[] lines)
    {
        // A group or a channel speaks with many voices: its messages name their author, and it is nobody to list among the people.
        DemoChatItem chat = Item(id, name, avatar, status, at, unread, isGroup: status.EndsWith("members", StringComparison.Ordinal) || status == "Channel");

        // The lines a few minutes apart, the last at the chat's own moment.
        for (var i = 0; i < lines.Length; i++)
        {
            var author = lines[i].Mine || !chat.IsGroup ? string.Empty : name;

            chat.History.Add(new DemoChatMessage($"{id}-{i}", author, lines[i].Words, at.AddMinutes((i - lines.Length + 1) * 3), lines[i].Mine));
        }

        return Finish(chat);
    }

    /// <summary>
    /// The team's chat, long enough to read a window at a time: sixteen messages a day for a month that ends yesterday, between 06:00
    /// and 12:00 UTC — the same date for a reader anywhere from UTC−6 to UTC+12 — and two this morning.
    /// </summary>
    private static DemoChatItem Team(string id, string name, string avatar, string status, DateTimeOffset at, int unread)
    {
        DemoChatItem chat = Item(id, name, avatar, status, at, unread, isGroup: true);
        DateTimeOffset firstDay = new(DateTime.UtcNow.Date.AddDays(-30), TimeSpan.Zero);
        var count = 0;

        for (var day = 0; day < 30; day++)
        {
            // A quiet day now and then, which the calendar leaves unmarked and refuses.
            if (day % 7 == 5)
                continue;

            for (var i = 0; i < TeamTalk.Length; i++)
            {
                (var author, var words) = TeamTalk[(i + day) % TeamTalk.Length];
                var mine = author == You;

                chat.History.Add(new DemoChatMessage($"{id}-{count++}", mine ? string.Empty : author, words, firstDay.AddDays(day).AddMinutes(360 + (i * 22)), mine));
            }
        }

        chat.History.Add(new DemoChatMessage($"{id}-{count++}", string.Empty, "Retries with jitter are merged.", at.AddMinutes(-6), mine: true));
        chat.History.Add(new DemoChatMessage($"{id}-{count}", "Priya Nair", "The retries review is in.", at, mine: false));

        return Finish(chat);
    }

    private static DemoChatItem Item(string id, string name, string avatar, string status, DateTimeOffset at, int unread, bool isGroup)
        => new()
        {
            Id = id,
            Title = name,
            Avatar = avatar,
            Status = status,
            At = at,
            IsGroup = isGroup,
            Unread = unread,
            BadgeStyle = UIBadgeType.Primary,
            IsContent = true
        };

    /// <summary>The row's last words — in a group, after the author's first name — and unread count, read off the history and the count.</summary>
    private static DemoChatItem Finish(DemoChatItem chat)
    {
        DemoChatMessage message = chat.History[^1];
        var last = message.Author.Length == 0 ? message.Text : $"{message.Author.Split(' ')[0]}: {message.Text}";

        chat.Description = last;
        chat.SearchText = $"{chat.Title} {last}";
        chat.BadgeText = chat.Unread == 0 ? null : chat.Unread.ToString(CultureInfo.InvariantCulture);
        chat.UnreadVisibility = chat.Unread == 0 ? UIVisibility.Collapsed : UIVisibility.Visible;

        return chat;
    }

    /// <summary>
    /// A round picture of a name's initials on its own colour, as a messenger draws someone with no photograph: an SVG of the demo's
    /// own, so it is safe as an image's address.
    /// </summary>
    private static string Initials(string name, string colour)
    {
        var words = name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var letters = (words.Length == 1 ? words[0][..1] : string.Concat(words[0][..1], words[1][..1])).ToUpperInvariant();
        var svg = $"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='{colour}'/>"
            + $"<text x='20' y='20' dy='0.35em' text-anchor='middle' font-family='system-ui, sans-serif' font-size='15' font-weight='600' fill='#fff'>{letters}</text></svg>";

        return "data:image/svg+xml," + Uri.EscapeDataString(svg);
    }

    /// <summary>
    /// Keys every message by the reader's day, then reads the open chat's first window here rather than leaving it to the client, so
    /// the page paints with messages in it.
    /// </summary>
    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        _zone = Context.TimeZone;
        KeyDays();
        Describe(_open);

        // Every chat of the list, not only the open one: a message sent elsewhere into another chat lifts it and counts as unread.
        foreach (DemoChatItem chat in Chats)
            Context.Subscribe(Topic(chat.Id));

        return Conversation.ShowAsync(_open.History, cancellationToken);
    }

    /// <summary>The topic of a chat, which every page listing it subscribes to and a message sent in it is posted to.</summary>
    public static string Topic(string chatId)
        => $"demo-chat:{chatId}";

    private void KeyDays()
    {
        foreach (DemoChatItem chat in Chats)
        {
            foreach (DemoChatMessage message in chat.History)
                message.KeyDay(_zone);
        }
    }

    /// <summary>
    /// Keys the messages again once the page reports the reader's zone: a first visit's render runs before it is known, in UTC, and a
    /// message of the reader's early morning would stand under the day before's header.
    /// </summary>
    protected override async Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        TimeZoneInfo zone = Context.TimeZone;

        if (string.Equals(zone.Id, _zone.Id, StringComparison.Ordinal))
            return;

        _zone = zone;
        KeyDays();
        MarkDays(_open);

        await Conversation.RefreshAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <summary>An entry's press: it becomes the current one, names the page, and People shows the people instead of the chats.</summary>
    [UICommand]
    public void Open(string id)
    {
        foreach (MenuItem section in Sections)
        {
            section.Selected = section.Id == id;

            if (section.Id == id)
                Heading = section.Title;

            foreach (MenuItem child in section.Items)
            {
                child.Selected = child.Id == id;

                if (child.Id == id)
                    Heading = child.Title;
            }
        }

        var people = id == "people";

        ChatsVisibility = people ? UIVisibility.Collapsed : UIVisibility.Visible;
        PeopleVisibility = people ? UIVisibility.Visible : UIVisibility.Collapsed;
        Back();
    }

    /// <summary>A chat's press: it is the current one, read, and its conversation fills the pane — beside the list, or in its place.</summary>
    [UICommand]
    public async Task OpenChatAsync(string id, CancellationToken cancellationToken)
    {
        DemoChatItem? chat = Chats.FirstOrDefault(chat => chat.Id == id);

        if (chat is null)
            return;

        _open = chat;
        Describe(chat);
        Read(chat);
        RefreshPeople();

        ListVisibility = UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, xl: UIVisibility.Visible);
        PaneVisibility = UIVisibility.Visible;

        await Conversation.ShowAsync(chat.History, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>A person's press: the chat with them opens, and the rail goes back to the chats.</summary>
    [UICommand]
    public async Task OpenPersonAsync(string id, CancellationToken cancellationToken)
    {
        Open("chats");

        await OpenChatAsync(id, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>The conversation's back arrow, below the wide breakpoint: the list again.</summary>
    [UICommand]
    public void Back()
    {
        ListVisibility = UIVisibility.Visible;
        PaneVisibility = UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, xl: UIVisibility.Visible);
    }

    /// <summary>The header over the conversation, and the days the calendar offers.</summary>
    private void Describe(DemoChatItem chat)
    {
        SelectedKey = chat.Id;
        OpenName = chat.Title?.ToString() ?? string.Empty;
        OpenStatus = chat.Status;
        OpenAvatar = chat.Avatar;
        Draft = null;
        MarkDays(chat);
    }

    /// <summary>The days the calendar offers: from the chat's first message to the reader's today, the days with messages marked.</summary>
    private void MarkDays(DemoChatItem chat)
    {
        DateOnly[] days = [.. chat.History.Select(static message => DateOnly.ParseExact(message.Group, "yyyy-MM-dd", CultureInfo.InvariantCulture)).Distinct()];

        FirstDay = days[0];
        LastDay = DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, _zone).DateTime);
        MessageDays = days;
        JumpDay = null;
    }

    private void Read(DemoChatItem chat)
    {
        chat.Unread = 0;
        _ = Finish(chat);
        CountUnread();
    }

    /// <summary>The rail's Chats badge: what every chat holds unread.</summary>
    private void CountUnread()
    {
        var unread = Chats.Sum(static chat => chat.Unread);

        Sections[0].BadgeText = unread == 0 ? null : unread.ToString(CultureInfo.InvariantCulture);
    }

    /// <summary>Each person's entry: their chat's last words and moment as a phrase the page writes in its language, and its count.</summary>
    private void RefreshPeople()
    {
        foreach (MenuItem person in People)
        {
            DemoChatItem chat = Chats.First(chat => chat.Id == person.Id);
            DemoChatMessage last = chat.History[^1];

            person.Description = UIPhrase.Of(Said, ("words", last.Text), ("at", new UIMoment(last.Sent, UITimestampFormat.Relative)));
            person.BadgeText = chat.BadgeText;
            person.Selected = chat == _open;
        }
    }

    /// <summary>
    /// Enter in the composer, or its send button: the words and the files on the shelf join the open chat, which rises to the top of
    /// the list, and both empty.
    /// </summary>
    [UICommand]
    public async Task SendAsync(CancellationToken cancellationToken)
    {
        var files = 0;

        foreach (var selectionId in AttachmentIds ?? [])
        {
            if (string.IsNullOrWhiteSpace(selectionId))
                continue;

            UIUploadSelection selection = await Context.Uploads.GetSelectionAsync(Context.Handle, selectionId, cancellationToken).ConfigureAwait(false);
            files += selection.Files.Length;
        }

        var sent = _sent;

        Post(files);

        if (_sent == sent)
            return;

        var chatId = _open.Id;
        var words = _open.History[^1].Text;
        var author = Context.Handle.Session.UserId ?? string.Empty;

        // Every other page listing the chat hears it, each in the order the messages were sent; this one has it already. The demo
        // keeps messages nowhere but in its pages, so a page kept for its tab to come back takes it too rather than catching up then.
        _ = await Context.Services.GetRequiredService<IUIBroadcast>().PostAsync<ChatController>(Topic(chatId), other =>
        {
            if (!ReferenceEquals(other, this))
                other.Hear(chatId, author, words);

            return Task.CompletedTask;
        }, viewersOnly: false, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Posts the draft with a line for the files; nothing when there is neither.</summary>
    internal void Post(int files)
    {
        var words = Draft?.Trim() ?? string.Empty;

        // Enter on an empty composer still runs the command; there is nothing to send then.
        if (words.Length == 0 && files == 0)
            return;

        if (files > 0)
            words = (words.Length == 0 ? string.Empty : words + "\n") + (files == 1 ? "📎 1 file" : string.Create(CultureInfo.InvariantCulture, $"📎 {files} files"));

        _sent++;

        DemoChatMessage message = new(string.Create(CultureInfo.InvariantCulture, $"sent-{_sent}"), string.Empty, words, DateTimeOffset.UtcNow, mine: true);

        message.KeyDay(_zone);
        Conversation.Add(message);
        Draft = null;
        // Empty, not null: an empty list is what clears the shelf.
        AttachmentIds = [];
        Raise(_open);
    }

    /// <summary>
    /// A message another page sent into one of these chats: theirs here, named by its author in a group, joining the conversation if
    /// the chat is open and counted unread if not; the chat rises either way.
    /// </summary>
    internal void Hear(string chatId, string author, string words)
    {
        DemoChatItem? chat = Chats.FirstOrDefault(chat => chat.Id == chatId);

        if (chat is null)
            return;

        _received++;

        DemoChatMessage message = new(string.Create(CultureInfo.InvariantCulture, $"received-{_received}"), chat.IsGroup ? author : string.Empty, words, DateTimeOffset.UtcNow, mine: false);

        message.KeyDay(_zone);

        if (chat == _open)
        {
            Conversation.Add(message);
        }
        else
        {
            chat.History.Add(message);
            chat.Unread++;
        }

        Raise(chat);
        CountUnread();
    }

    /// <summary>The chat written in rises to the top of the list, as a messenger's does, its last words the newest.</summary>
    private void Raise(DemoChatItem chat)
    {
        chat.At = chat.History[^1].Sent;
        _ = Finish(chat);
        RefreshPeople();

        var index = Chats.IndexOf(chat);

        if (index > 0)
            Chats.Move(index, 0);
    }

    /// <summary>Answers with a quick reply's words at the composer's caret; the draft itself is the page's until Send.</summary>
    [UICommand]
    public static UICommandResult InsertQuickReply(string id)
        => QuickReplyWords.TryGetValue(id, out var words) ? UICommandResult.Ok([InsertTextEffect.Literal(ComposerId, words)]) : UICommandResult.Ok();

    /// <summary>The bolt's entries, keyed as <see cref="InsertQuickReply"/> reads them.</summary>
    public static MenuItem[] QuickReplies()
        =>
        [
            new MenuItem { Id = "on-it", Title = "On it", IsContent = true },
            new MenuItem { Id = "runbook", Title = "Link the runbook", IsContent = true },
            new MenuItem { Id = "resolved", Title = "Resolved", IsContent = true }
        ];

    /// <summary>The conversation's own menu: go to a day, the newest, and a message arriving from the other side.</summary>
    public static MenuItem[] ConversationMenu()
        =>
        [
            new MenuItem { Id = "day", Title = "Go to a day", Icon = DemoIcons.Outline(DemoIcons.Calendar), IsContent = true },
            new MenuItem { Id = "newest", Title = "Jump to the newest", Icon = DemoIcons.Outline(DemoIcons.History), IsContent = true },
            new MenuItem { Id = "receive", Title = "Receive a message", Icon = DemoIcons.Outline(DemoIcons.Bell), IsContent = true },
            new MenuItem { Id = "wallpaper", Title = "Wallpaper", Icon = DemoIcons.Outline(DemoIcons.Palette), IsContent = true }
        ];

    [UICommand]
    public async Task<UICommandResult> ConversationActionAsync(string id, CancellationToken cancellationToken)
    {
        switch (id)
        {
            case "day":
                return OpenDayPicker();
            case "newest":
                await Conversation.ShowAsync(_open.History, cancellationToken).ConfigureAwait(false);
                return UICommandResult.Ok([new ScrollEffect(ConversationId, ScrollPosition.End) { Behavior = ScrollToBehavior.Auto }]);
            case "receive":
                Receive();
                return UICommandResult.Ok();
            case "wallpaper":
                return UICommandResult.Ok([new OpenDialogEffect(WallpaperKey)]);
            default:
                return UICommandResult.Ok();
        }
    }

    /// <summary>
    /// A message from the other side; no scroll effect, since the conversation is anchored to its end and a pushed message follows
    /// on its own — unless the reader has scrolled away from it.
    /// </summary>
    private void Receive()
    {
        _received++;

        var author = _open.IsGroup ? "Priya Nair" : string.Empty;
        var words = _received % 2 == 1 ? "Running late, start without me." : "On my way.";

        DemoChatMessage message = new(string.Create(CultureInfo.InvariantCulture, $"received-{_received}"), author, words, DateTimeOffset.UtcNow, mine: false);

        message.KeyDay(_zone);
        Conversation.Add(message);
        Raise(_open);
    }

    /// <summary>
    /// The wallpaper's settings as the messages' ground draws them: the picture or none, the dim as a share, the blur as a length. Only
    /// these values travel; the browser dims and blurs the picture it already has.
    /// </summary>
    [UICommand]
    public void UpdateWallpaper()
    {
        WallpaperImage = WallpaperShown ? DemoImages.HarbourSky : null;
        WallpaperDimShare = (double)WallpaperDim;
        WallpaperBlurLength = (double)WallpaperBlur;
    }

    [UICommand]
    public static UICommandResult OpenDayPicker()
        => UICommandResult.Ok([new OpenDialogEffect(DayKey)]);

    /// <summary>A press on a day header: the calendar opens on that day.</summary>
    [UICommand]
    public UICommandResult ShowDay(string day)
    {
        JumpDay = DateOnly.TryParseExact(day, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly parsed) ? parsed : null;

        return OpenDayPicker();
    }

    /// <summary>
    /// A press on a day is the whole of it: the conversation reads the window at the day's first message and shows that message at its
    /// top, under its day's header, and the dialog closes.
    /// </summary>
    [UICommand]
    public async Task<UICommandResult> GoToDayAsync(CancellationToken cancellationToken)
    {
        var first = JumpDay is DateOnly day ? await Conversation.ShowDayAsync(day, cancellationToken).ConfigureAwait(false) : null;

        // The window is on the page before an effect runs, so the row is there to bring into view.
        return first is null
            ? UICommandResult.Ok([new CloseDialogEffect(DayKey)])
            : UICommandResult.Ok([new CloseDialogEffect(DayKey), new ScrollToItemEffect(ConversationId, first)]);
    }

    /// <summary>
    /// A message's action, from its action bar or its context menu alike: the bar is a view of the menu, so a press names the entry and
    /// the message the same way from either.
    /// </summary>
    [UICommand]
    public UICommandResult MessageAction(string action, string id)
    {
        DemoChatMessage? message = Conversation.Get(id);

        if (message is null)
            return UICommandResult.Ok();

        switch (action)
        {
            case "pin":
                message.TogglePin();
                break;
            case "edit":
                message.Text = message.Text.EndsWith(" (edited)", StringComparison.Ordinal) ? message.Text : message.Text + " (edited)";
                break;
            case "delete":
                return Delete(message);
            case "reply":
                return UICommandResult.Ok([InsertTextEffect.Literal(ComposerId, $"> {message.Text}\n")]);
            case "copy":
                return UICommandResult.Ok([CopyToClipboardEffect.Literal(message.Text), new ShowNotificationEffect("Copied.", UIColorStyle.Info)]);
            default:
                break;
        }

        return UICommandResult.Ok();
    }

    /// <summary>Deletes at once, with no question first, and offers the way back for as long as the toast stands.</summary>
    private UICommandResult Delete(DemoChatMessage message)
    {
        _deleted[message.Id] = (_open, message, Conversation.Delete(message.Id));

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(UIPhrase.Of("demo.screens.chat.deleted"))
            {
                Action = new UINotificationAction(UIPhrase.Of("demo.screens.undo"), nameof(RestoreMessage), message.Id)
            }
        ]);
    }

    /// <summary>The toast's Undo, on no button: the message goes back where it stood, in its own chat even if another is open now.</summary>
    [UICommand]
    public void RestoreMessage(string id)
    {
        if (!_deleted.Remove(id, out (DemoChatItem Chat, DemoChatMessage Message, int Index) deleted) || deleted.Index < 0)
            return;

        if (ReferenceEquals(deleted.Chat, _open))
            Conversation.Restore(deleted.Message, deleted.Index);
        else
            deleted.Chat.History.Insert(Math.Min(deleted.Index, deleted.Chat.History.Count), deleted.Message);
    }

    /// <summary>One more folder on the rail, before the settings.</summary>
    [UICommand]
    public void AddFolder()
    {
        if (_folders == FolderNames.Length)
            return;

        var name = FolderNames[_folders++];

        Sections.Insert(Sections.Count - 1, new MenuItem { Id = $"folder-{_folders}", Title = name, Icon = DemoIcons.Outline(DemoIcons.Folder) });
    }

    /// <summary>The last folder added goes again.</summary>
    [UICommand]
    public void RemoveFolder()
    {
        if (_folders == 0)
            return;

        _folders--;
        Sections.RemoveAt(Sections.Count - 2);
    }
}
