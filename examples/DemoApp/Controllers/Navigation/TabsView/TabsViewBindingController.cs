using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.TabsView;

internal sealed partial class TabsViewBindingGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string SelectedKey { get; set; } = "overview";

    [RecursiveMember(false)]
    public RecursiveCollection<TabItem> Tabs { get; } =
    [
        new() { Id = "overview", Title = "Overview", Icon = LucideIcons.LayoutDashboard, Order = 1, Closable = false },
        new() { Id = "members", Title = "Members", Icon = LucideIcons.Users, Order = 2 },
        new() { Id = "settings", Title = "Settings", Icon = LucideIcons.Settings, Order = 3 }
    ];

    private int _counter;

    public void SelectNext()
    {
        var index = Tabs.ToList().FindIndex(tab => tab.Id == SelectedKey);

        SelectedKey = Tabs[(index + 1) % Tabs.Count].Id;
        SetLastChange(nameof(SelectedKey), SelectedKey);
    }

    public void AddTab()
    {
        _counter++;

        TabItem tab = new()
        {
            Id = $"extra-{_counter}",
            Title = $"Extra {_counter}",
            Icon = LucideIcons.FileText,
            Order = Tabs.Max(candidate => candidate.Order ?? 0) + 1
        };

        Tabs.Add(tab);
        SetLastChange(nameof(Tabs), tab.Title ?? "");
    }

    public void CloseTab(string id)
    {
        TabItem? tab = Tabs.FirstOrDefault(candidate => candidate.Id == id);

        if (tab is null)
            return;

        _ = Tabs.Remove(tab);
        SetLastChange(nameof(Tabs), $"closed {tab.Title}");

        if (SelectedKey == id && Tabs.Count > 0)
            SelectedKey = Tabs[0].Id;
    }

    /// <summary>
    /// The same value a drag writes, driven from the server instead — the strip is sorted on it either way.
    /// </summary>
    public void MoveSelectedToEnd()
    {
        TabItem? tab = Tabs.FirstOrDefault(candidate => candidate.Id == SelectedKey);

        if (tab is null)
            return;

        tab.Order = Tabs.Max(candidate => candidate.Order ?? 0) + 1;
        SetLastChange(nameof(TabItem.Order), tab.Order?.ToString() ?? "");
    }

    public void ToggleClosable()
    {
        TabItem? tab = Tabs.FirstOrDefault(candidate => candidate.Id == SelectedKey);

        if (tab is null)
            return;

        tab.Closable = tab.Closable != true;
        SetLastChange(nameof(TabItem.Closable), tab.Closable?.ToString() ?? "");
    }
}

internal sealed partial class TabsViewBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial TabsViewBindingGroupContext TabsViewGroup { get; set; } = new();

    [UICommand]
    public void SelectNext()
        => TabsViewGroup.SelectNext();

    [UICommand]
    public void AddTab()
        => TabsViewGroup.AddTab();

    [UICommand]
    public void CloseTab(string id)
        => TabsViewGroup.CloseTab(id);

    [UICommand]
    public void MoveSelectedToEnd()
        => TabsViewGroup.MoveSelectedToEnd();

    [UICommand]
    public void ToggleClosable()
        => TabsViewGroup.ToggleClosable();
}
