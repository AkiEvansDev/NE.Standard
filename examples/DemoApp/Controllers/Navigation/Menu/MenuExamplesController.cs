using System;
using System.Collections.Generic;
using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Navigation.Menu;

/// <summary>
/// A menu whose entries are the controller's: which one is current follows the click, and what the click did
/// is written under the group.
/// </summary>
/// <remarks>One class for the top bar and the command list; only the entries each is given differ.</remarks>
internal sealed partial class MenuListGroupContext(IEnumerable<MenuItem> entries) : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Entries { get; } = [.. entries];

    /// <summary>
    /// Marks the pressed entry as current and clears the rest; the menu enforces nothing about that.
    /// </summary>
    public void Select(string id)
    {
        foreach (MenuItem entry in Entries)
        {
            if (entry.Kind is UIMenuItemKind.Header or UIMenuItemKind.Separator)
                continue;

            entry.Selected = entry.Id == id;
        }

        LogEvent($"'{id}' is the current page");
    }
}

internal sealed partial class DemoDeployItem : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; init; } = "";

    [RecursiveMember]
    public partial string Title { get; set; } = "";
}

/// <summary>
/// The rows a context menu opens on, and the record of what was chosen on which.
/// </summary>
internal sealed partial class ContextMenuGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDeployItem> Deploys { get; } =
    [
        new() { Id = "481", Title = "Panel · #481" },
        new() { Id = "482", Title = "Panel · #482" },
        new() { Id = "483", Title = "Billing · #483" }
    ];

    public void Record(string action, string target)
        => LogEvent($"{action} on {target}");
}

/// <summary>
/// A settings menu: selects whose choices fly out beside them, checks that turn in place. One group of choices takes one at a
/// time, one takes several; the controller is what enforces either, the menu only shows the marks.
/// </summary>
internal sealed partial class FiltersGroupContext : DemoGroupContext
{
    private const string StatusId = "status";
    private const string RegionId = "region";
    private const string GroupId = "group";
    private const string SortId = "sort";
    private const string UsageId = "usage";
    private const string AllRegionsId = "region-all";

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Entries { get; } =
    [
        Select(StatusId, "Status", "Running", ("status-running", "Running", true), ("status-stopped", "Stopped", false)),
        Select(RegionId, "Region", "All", (AllRegionsId, "All regions", true), ("region-eu-west", "Europe West", false), ("region-eu-central", "Europe Central", false), ("region-us-east", "US East", false)),
        Select(GroupId, "Group by", "None", ("group-none", "None", true), ("group-plan", "Plan", false), ("group-region", "Region", false)),
        Select(SortId, "Sort by", "Last activity", ("sort-activity", "Last activity", true), ("sort-name", "Name", false), ("sort-created", "Created", false)),
        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
        new MenuItem { Id = UsageId, Kind = UIMenuItemKind.Check, Title = "Show usage", Checked = true }
    ];

    private static MenuItem Select(string id, string title, string value, params (string Id, string Title, bool Checked)[] choices)
    {
        MenuItem select = new() { Id = id, Kind = UIMenuItemKind.Select, Title = title, Value = value };

        foreach ((var choiceId, var choiceTitle, var isChecked) in choices)
            select.Items.Add(new MenuItem { Id = choiceId, Kind = UIMenuItemKind.Check, Title = choiceTitle, Checked = isChecked });

        return select;
    }

    /// <summary>A click on any entry: a check turns, a choice under a select is taken — alone, or beside the others for the region.</summary>
    public void Apply(string id)
    {
        foreach (MenuItem entry in Entries)
        {
            if (entry.Id == id && entry.Kind == UIMenuItemKind.Check)
            {
                entry.Checked = entry.Checked != true;
                LogEvent($"'{entry.Title}' is {(entry.Checked == true ? "on" : "off")}");
                return;
            }

            foreach (MenuItem choice in entry.Items)
            {
                if (choice.Id != id)
                    continue;

                if (entry.Id == RegionId)
                    ToggleRegion(entry, choice);
                else
                    ChooseOne(entry, choice);

                LogEvent($"'{entry.Title}' is now '{entry.Value}'");
                return;
            }
        }
    }

    private static void ChooseOne(MenuItem select, MenuItem choice)
    {
        foreach (MenuItem other in select.Items)
            other.Checked = ReferenceEquals(other, choice);

        select.Value = choice.Title;
    }

    /// <summary>"All regions" stands for every other choice: taking it clears them, taking any of them clears it.</summary>
    private static void ToggleRegion(MenuItem select, MenuItem choice)
    {
        var all = choice.Id == AllRegionsId;

        choice.Checked = choice.Checked != true;

        foreach (MenuItem other in select.Items)
        {
            if (all && !ReferenceEquals(other, choice))
                other.Checked = false;
            else if (!all && other.Id == AllRegionsId)
                other.Checked = false;
        }

        List<string> chosen = [];

        foreach (MenuItem other in select.Items)
        {
            if (other.Checked == true && other.Id != AllRegionsId)
                chosen.Add(other.Title?.ToString() ?? other.Id);
        }

        if (chosen.Count == 0)
        {
            foreach (MenuItem other in select.Items)
                other.Checked = other.Id == AllRegionsId;
        }

        select.Value = chosen.Count == 0 ? "All" : chosen.Count == 1 ? chosen[0] : $"{chosen.Count} chosen";
    }
}

/// <summary>
/// The menus on the Examples page that report: the top bar, the command list, the settings menu, and the two context menus.
/// </summary>
/// <summary>
/// A sidebar whose sections are the controller's: the first ones are in the HTML the server sends, and one added later is a row
/// the client builds, sub-entries and all.
/// </summary>
internal sealed partial class SidebarGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Entries { get; } = [.. CreateEntries()];

    /// <summary>
    /// Appends a section with two pages, open as it arrives.
    /// </summary>
    public void AddSection()
    {
        var number = ++_added;
        MenuItem section = new() { Id = $"reports-{number}", Title = $"Reports {number}", Icon = DemoIcons.Outline(DemoIcons.List), Expanded = true };

        section.Items.Add(new MenuItem { Id = $"reports-{number}/weekly", Title = "Weekly", Url = "/navigation/menu/examples" });
        section.Items.Add(new MenuItem { Id = $"reports-{number}/monthly", Title = "Monthly", Url = "/navigation/menu/examples" });

        Entries.Add(section);
        LogEvent($"section 'Reports {number}' added");
    }

    private static MenuItem[] CreateEntries()
    {
        MenuItem layouts = new() { Id = "layouts", Title = "Layouts", Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard) };

        layouts.Items.Add(new MenuItem { Id = "/layouts/surface", Title = "Surface", Url = "/layouts/surface" });
        layouts.Items.Add(new MenuItem { Id = "/layouts/card", Title = "Card", Url = "/layouts/card" });
        layouts.Items.Add(new MenuItem { Id = "/layouts/expander", Title = "Expander", Url = "/layouts/expander" });

        // Open in the HTML the server sends, so the trail to where you are is there on the first paint.
        MenuItem navigation = new() { Id = "navigation", Title = "Navigation", Icon = DemoIcons.Outline(DemoIcons.Navigation), Expanded = true };

        navigation.Items.Add(new MenuItem { Id = "/navigation/menu", Title = "Menu", Url = "/navigation/menu/examples", Selected = true });

        MenuItem inputs = new() { Id = "inputs", Title = "Inputs", Icon = DemoIcons.Outline(DemoIcons.Sliders) };

        inputs.Items.Add(new MenuItem { Id = "/inputs/text-input", Title = "Text Input", Url = "/inputs/text-input" });
        inputs.Items.Add(new MenuItem { Id = "/inputs/select", Title = "Select", Url = "/inputs/select" });

        return
        [
            new MenuItem { Id = "/", Title = "Home", Icon = DemoIcons.Outline(DemoIcons.Home), Url = "/" },
            // A count on a top-level entry: folded, the badge stands on the icon's corner.
            new MenuItem { Id = "/screens/inbox", Title = "Inbox", Icon = DemoIcons.Outline(DemoIcons.Mail), Url = "/screens/inbox", BadgeText = "4", BadgeStyle = UIBadgeType.Primary },
            layouts,
            navigation,
            inputs
        ];
    }
}

/// <summary>
/// A messenger's folder rail: a count on Chat, a label too long for the rail, a dot on Profile, a group of two, and the current
/// entry the controller moves.
/// </summary>
/// <remarks>Three rails show the same entries, so a push lands on each at once.</remarks>
internal sealed partial class RailGroupContext : DemoGroupContext
{
    private static readonly string[] Order = ["chat", "archive", "profile", "admin/people", "admin/audit"];

    private int _unread = 19;

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Entries { get; } = [.. CreateEntries()];

    private static MenuItem[] CreateEntries()
    {
        MenuItem admin = new() { Id = "admin", Title = "Administration", Icon = DemoIcons.Outline(DemoIcons.Admin) };

        admin.Items.Add(new MenuItem { Id = "admin/people", Title = "People", Icon = DemoIcons.Outline(DemoIcons.Groups) });
        admin.Items.Add(new MenuItem { Id = "admin/audit", Title = "Audit log", Icon = DemoIcons.Outline(DemoIcons.History) });

        return
        [
            new MenuItem { Id = "chat", Title = "Chat", Icon = DemoIcons.Outline(DemoIcons.MessageSquare), BadgeText = "19", BadgeStyle = UIBadgeType.Primary, Selected = true },
            new MenuItem { Id = "archive", Title = "Archived conversations", Icon = DemoIcons.Outline(DemoIcons.Folder) },
            // Empty, not null: a dot on the icon's corner, something new with nothing to count.
            new MenuItem { Id = "profile", Title = "Profile", Icon = DemoIcons.Outline(DemoIcons.User), BadgeText = "" },
            admin
        ];
    }

    /// <summary>One more unread message on Chat.</summary>
    public void PushCount()
    {
        _unread++;
        Find("chat")!.BadgeText = _unread.ToString(CultureInfo.InvariantCulture);
        LogEvent($"Chat has {_unread} unread");
    }

    /// <summary>The current mark moves to the next entry, into the group and out of it again.</summary>
    public void MoveSelection()
    {
        var current = Array.FindIndex(Order, id => Find(id)?.Selected == true);

        Select(Order[(current + 1) % Order.Length]);
    }

    /// <summary>Marks the entry as current and clears the rest, the group's sub-entries too.</summary>
    public void Select(string id)
    {
        foreach (MenuItem entry in Entries)
        {
            entry.Selected = entry.Id == id;

            foreach (MenuItem child in entry.Items)
                child.Selected = child.Id == id;
        }

        LogEvent($"'{id}' is the current entry");
    }

    private MenuItem? Find(string id)
    {
        foreach (MenuItem entry in Entries)
        {
            if (entry.Id == id)
                return entry;

            foreach (MenuItem child in entry.Items)
            {
                if (child.Id == id)
                    return child;
            }
        }

        return null;
    }
}

/// <summary>
/// A messenger's contact list: each name over the conversation's last words and when they came, the unread count as the badge.
/// </summary>
/// <remarks>
/// The last words are a phrase: the words the person wrote as they are, and the moment in words, which the page keeps current and
/// writes in its language.
/// </remarks>
internal sealed partial class ContactsGroupContext : DemoGroupContext
{
    private const string Said = "demo.navigation.menu.contact.said";

    private int _pushed;
    private int _robinUnread = 5;

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Contacts { get; } = [.. CreateContacts(DateTimeOffset.UtcNow)];

    private static MenuItem[] CreateContacts(DateTimeOffset now)
        =>
        [
            CreateContact("grace", "Grace Kim", "I'll watch the disk until the resize lands.", now.AddMinutes(-2), "2", selected: true),
            CreateContact("alex", "Alex Warren", "The queue drained in two minutes.", now.AddMinutes(-47), null),
            CreateContact("robin", "Robin Hale", "See you at eight", now.AddHours(-26), "5")
        ];

    // The person's name and words are theirs, never a key: IsContent keeps them as written.
    private static MenuItem CreateContact(string id, string name, string words, DateTimeOffset at, string? unread, bool selected = false)
        => new()
        {
            Id = id,
            Title = name,
            Icon = DemoIcons.Outline(DemoIcons.UserRound),
            Description = LastWords(words, at),
            BadgeText = unread,
            BadgeStyle = UIBadgeType.Primary,
            Selected = selected,
            IsContent = true
        };

    private static UIPhrase LastWords(string words, DateTimeOffset at)
        => UIPhrase.Of(Said, ("words", words), ("at", new UIMoment(at, UITimestampFormat.Relative)));

    /// <summary>A new message from Robin: new last words, just now, and one more unread.</summary>
    public void PushMessage()
    {
        _pushed++;
        _robinUnread++;

        foreach (MenuItem contact in Contacts)
        {
            if (contact.Id != "robin")
                continue;

            contact.Description = LastWords(_pushed % 2 == 1 ? "Running late, start without me." : "On my way.", DateTimeOffset.UtcNow);
            contact.BadgeText = _robinUnread.ToString(CultureInfo.InvariantCulture);
        }

        LogEvent("Robin wrote again");
    }

    /// <summary>Opening a conversation makes it current and reads it: its badge goes.</summary>
    public void Open(string id)
    {
        foreach (MenuItem contact in Contacts)
        {
            contact.Selected = contact.Id == id;

            if (contact.Id == id)
                contact.BadgeText = null;
        }

        if (id == "robin")
            _robinUnread = 0;

        LogEvent($"the conversation with '{id}' is open");
    }
}

internal sealed partial class MenuExamplesController() : DemoController
{
    [RecursiveMember]
    public partial RailGroupContext RailGroup { get; set; } = new();

    [RecursiveMember]
    public partial ContactsGroupContext ContactsGroup { get; set; } = new();

    [RecursiveMember]
    public partial SidebarGroupContext SidebarGroup { get; set; } = new();

    [RecursiveMember]
    public partial MenuListGroupContext TopBarGroup { get; set; } = new(
    [
        new MenuItem { Id = "overview", Title = "Overview", Selected = true },
        new MenuItem { Id = "deploys", Title = "Deploys", BadgeText = "3" },
        new MenuItem { Id = "logs", Title = "Logs" },
        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
        new MenuItem { Id = "settings", Title = "Settings", Icon = DemoIcons.Outline(DemoIcons.Settings) }
    ]);

    [RecursiveMember]
    public partial MenuListGroupContext CommandsGroup { get; set; } = new(
    [
        new MenuItem { Id = "server", Kind = UIMenuItemKind.Header, Title = "Server" },
        new MenuItem { Id = "snapshot", Title = "Take a snapshot", Icon = DemoIcons.Outline(DemoIcons.History), Shortcut = "Ctrl+S" },
        new MenuItem { Id = "rename", Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit), Shortcut = "F2" },
        new MenuItem { Id = "export", Title = "Download the config", Icon = DemoIcons.Outline(DemoIcons.Download), Shortcut = "Ctrl+Shift+E" },
        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
        new MenuItem { Id = "delete", Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close), Shortcut = "Delete" },
        new MenuItem { Id = "resize", Title = "Resize", Icon = DemoIcons.Outline(DemoIcons.Sliders), Enabled = false }
    ]);

    [RecursiveMember]
    public partial ContextMenuGroupContext ContextGroup { get; set; } = new();

    [RecursiveMember]
    public partial FiltersGroupContext FiltersGroup { get; set; } = new();

    [UICommand]
    public void Navigate(string id)
        => TopBarGroup.Select(id);

    [UICommand]
    public void AddSection()
        => SidebarGroup.AddSection();

    [UICommand]
    public void SelectRailEntry(string id)
        => RailGroup.Select(id);

    [UICommand]
    public void PushRailCount()
        => RailGroup.PushCount();

    [UICommand]
    public void MoveRailSelection()
        => RailGroup.MoveSelection();

    [UICommand]
    public void OpenContact(string id)
        => ContactsGroup.Open(id);

    [UICommand]
    public void PushContactMessage()
        => ContactsGroup.PushMessage();

    /// <summary>
    /// Reached by a click or by the entry's shortcut, which the command cannot tell apart.
    /// </summary>
    [UICommand]
    public void Run(string id)
        => CommandsGroup.LogEvent($"'{id}' ran");

    /// <summary>
    /// A check's click or a select's choice: the entry's own key, which the context turns into the mark or the value.
    /// </summary>
    [UICommand]
    public void Filter(string id)
        => FiltersGroup.Apply(id);

    /// <summary>
    /// One command for the whole menu, told which entry by its key.
    /// </summary>
    [UICommand]
    public void RunCardAction(string entry)
        => ContextGroup.Record(entry, "the card");

    /// <summary>
    /// Takes both scopes the click sits in: the row from the enclosing bound collection, and the menu entry.
    /// </summary>
    [UICommand]
    public void Promote(string row, string entry)
        => ContextGroup.Record(entry, $"deploy {row}");
}
