using System.Collections.Generic;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

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

    public void Report(string message)
        => LogEvent(message);
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
        new() { Id = "481", Title = "Web Portal · #481" },
        new() { Id = "482", Title = "Web Portal · #482" },
        new() { Id = "483", Title = "Payments API · #483" }
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
    private const string EnvironmentId = "environment";
    private const string GroupId = "group";
    private const string SortId = "sort";
    private const string PrStatusId = "pr-status";
    private const string AllEnvironmentsId = "environment-all";

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Entries { get; } =
    [
        Select(StatusId, "Status", "Active", ("status-active", "Active", true), ("status-archived", "Archived", false)),
        Select(EnvironmentId, "Environment", "All", (AllEnvironmentsId, "All environments", true), ("environment-cloud", "Cloud", false),
            ("environment-remote", "Remote Control", false), ("environment-slack", "Slack", false)),
        Select(GroupId, "Group by", "None", ("group-none", "None", true), ("group-repository", "Repository", false), ("group-owner", "Owner", false)),
        Select(SortId, "Sort by", "Last activity", ("sort-activity", "Last activity", true), ("sort-name", "Name", false), ("sort-created", "Created", false)),
        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
        new MenuItem { Id = PrStatusId, Kind = UIMenuItemKind.Check, Title = "Show PR status", Checked = true }
    ];

    private static MenuItem Select(string id, string title, string value, params (string Id, string Title, bool Checked)[] choices)
    {
        MenuItem select = new() { Id = id, Kind = UIMenuItemKind.Select, Title = title, Value = value };

        foreach ((var choiceId, var choiceTitle, var isChecked) in choices)
            select.Items.Add(new MenuItem { Id = choiceId, Kind = UIMenuItemKind.Check, Title = choiceTitle, Checked = isChecked });

        return select;
    }

    /// <summary>A click on any entry: a check turns, a choice under a select is taken — alone, or beside the others for the environment.</summary>
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

                if (entry.Id == EnvironmentId)
                    ToggleEnvironment(entry, choice);
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

    /// <summary>"All environments" stands for every other choice: taking it clears them, taking any of them clears it.</summary>
    private static void ToggleEnvironment(MenuItem select, MenuItem choice)
    {
        var all = choice.Id == AllEnvironmentsId;

        choice.Checked = choice.Checked != true;

        foreach (MenuItem other in select.Items)
        {
            if (all && !ReferenceEquals(other, choice))
                other.Checked = false;
            else if (!all && other.Id == AllEnvironmentsId)
                other.Checked = false;
        }

        List<string> chosen = [];

        foreach (MenuItem other in select.Items)
        {
            if (other.Checked == true && other.Id != AllEnvironmentsId)
                chosen.Add(other.Title ?? other.Id);
        }

        if (chosen.Count == 0)
        {
            foreach (MenuItem other in select.Items)
                other.Checked = other.Id == AllEnvironmentsId;
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
            layouts,
            navigation,
            inputs
        ];
    }
}

internal sealed partial class MenuExamplesController() : DemoController
{
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
        new MenuItem { Id = "file", Kind = UIMenuItemKind.Header, Title = "File" },
        new MenuItem { Id = "save", Title = "Save", Icon = DemoIcons.Outline(DemoIcons.Check), Shortcut = "Ctrl+S" },
        new MenuItem { Id = "rename", Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit), Shortcut = "F2" },
        new MenuItem { Id = "export", Title = "Export", Icon = DemoIcons.Outline(DemoIcons.Download), Shortcut = "Ctrl+Shift+E" },
        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
        new MenuItem { Id = "delete", Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close), Shortcut = "Delete" },
        new MenuItem { Id = "archive", Title = "Archive", Icon = DemoIcons.Outline(DemoIcons.History), Enabled = false }
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

    /// <summary>
    /// Reached by a click or by the entry's shortcut, which the command cannot tell apart.
    /// </summary>
    [UICommand]
    public void Run(string id)
        => CommandsGroup.Report($"'{id}' ran");

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
