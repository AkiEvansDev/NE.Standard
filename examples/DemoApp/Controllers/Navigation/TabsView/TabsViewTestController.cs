using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.TabsView;

/// <summary>
/// One open document. A tab model with a body of its own, so the page has something to render per item.
/// </summary>
internal sealed partial class DemoDocumentTab : TabItem
{
    [RecursiveMember]
    public partial string Body { get; set; } = "";
}

internal sealed partial class TabsViewGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string SelectedKey { get; set; } = "readme";

    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentTab> Documents { get; } =
    [
        new() { Id = "readme", Title = "README.md", Icon = LucideIcons.FileText, Order = 1, Closable = false, Body = "The tab that cannot be closed — Closable is a property of the item." },
        new() { Id = "deploy", Title = "deploy.yml", Icon = LucideIcons.Server, Order = 2, Body = "Rename this caption by double-clicking it, or drag it past its neighbour." },
        new() { Id = "notes", Title = "notes.txt", Icon = LucideIcons.Edit, Order = 3, Body = "Closing a tab is a command with the tab's key — the collection is the controller's to change." }
    ];

    private int _counter;

    public void AddTab()
    {
        _counter++;

        DemoDocumentTab document = new()
        {
            Id = $"draft-{_counter}",
            Title = $"draft-{_counter}.txt",
            Icon = LucideIcons.FileText,
            Order = Documents.Count == 0 ? 1 : Documents.Max(document => document.Order ?? 0) + 1,
            Body = "A new document. Its page is the same template, rendered once more."
        };

        Documents.Add(document);
        SelectedKey = document.Id;

        LogEvent($"Opened '{document.Title}'");
    }

    public void CloseTab(string id)
    {
        DemoDocumentTab? document = Documents.FirstOrDefault(candidate => candidate.Id == id);

        if (document is null)
            return;

        _ = Documents.Remove(document);
        LogEvent($"Closed '{document.Title}'");

        // The strip picks its own first tab when the current key is gone, but the controller has to agree —
        // otherwise SelectedKey keeps naming a document nobody has open.
        if (SelectedKey == id)
            SelectedKey = Documents.Count == 0 ? "" : Documents[0].Id;
    }

    public void RenameTab(string id, string title)
    {
        DemoDocumentTab? document = Documents.FirstOrDefault(candidate => candidate.Id == id);

        if (document is not null)
            LogEvent($"Renamed to '{title}'");
    }
}

internal sealed partial class TabsViewTestController() : DemoController
{
    [RecursiveMember]
    public partial TabsViewGroupContext TabsViewGroup { get; set; } = new();

    [UICommand]
    public void AddTab()
        => TabsViewGroup.AddTab();

    [UICommand]
    public void CloseTab(string id)
        => TabsViewGroup.CloseTab(id);

    [UICommand]
    public void RenameTab(string id, string title)
        => TabsViewGroup.RenameTab(id, title);
}
