using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Recursive;

namespace DemoApp.Controllers.Navigation.TabsView;

/// <summary>
/// An editor: the operator's files, the ones open in the strip, and the four gestures the strip allows.
/// </summary>
internal sealed partial class EditorGroupContext : DemoGroupContext
{
    private static readonly Dictionary<string, (string Title, string Folder, string Icon, string Body)> OperatorFiles = new(StringComparer.Ordinal)
    {
        ["incident"] = ("incident-report.md", "incidents", DemoIcons.FileText, "Slow API in Europe West: a full database disk, 39 minutes, and three follow-ups."),
        ["health"] = ("health-check.cs", "checks", DemoIcons.File, "public HealthStatus Check(Server server)\n    => server.Disk.UsedPercent < 90 ? HealthStatus.Healthy : HealthStatus.Degraded;"),
        ["provision"] = ("provision.sh", "scripts", DemoIcons.File, "#!/usr/bin/env bash\nset -euo pipefail\n\nmkfs.ext4 /dev/vdb\nmount /dev/vdb /data"),
        ["server"] = ("server.json", "servers/api-eu-west-1", DemoIcons.Settings, /*lang=json,strict*/ "{\n  \"plan\": \"standard\",\n  \"region\": \"eu-west\"\n}"),
        ["badges"] = ("badges.less", "status-page", DemoIcons.Palette, "@import \"tokens.less\";\n.badge-degraded { color: @warning; }"),
        ["status"] = ("status.html", "status-page", DemoIcons.Link, "<h1>Orvane Cloud status</h1>\n<p>All systems operational.</p>")
    };

    /// <summary>The file tree — every file there is, open or not.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Files { get; } =
    [
        .. OperatorFiles.Select(static entry => new TextItem
        {
            Id = entry.Key,
            Title = entry.Value.Title,
            Description = entry.Value.Folder,
            Icon = DemoIcons.Outline(entry.Value.Icon)
        })
    ];

    /// <summary>The files open in the strip; the first is pinned and the controller refuses to close it.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Documents { get; } = [CreateDocument("incident", 1, pinned: true), CreateDocument("health", 2)];

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "incident";

    /// <summary>
    /// Opens a file, or switches to it when it is already open.
    /// </summary>
    public void Open(string id)
    {
        if (!OperatorFiles.TryGetValue(id, out (string Title, string Folder, string Icon, string Body) file))
            return;

        if (Find(id) is null)
        {
            // Past the last tab, so a new document lands at the end wherever a drag left the rest.
            var order = Documents.Count == 0 ? 1 : Documents.Max(static document => document.Order ?? 0) + 1;

            Documents.Add(CreateDocument(id, order));
            LogEvent($"opened {file.Title}");
        }
        else
        {
            LogEvent($"{file.Title} is already open — switched to it");
        }

        SelectedKey = id;
    }

    /// <summary>The editor's own entry of the tab menu, between the strip's Rename and Pin and its Close.</summary>
    public const string CloseOthersAction = "close-others";

    /// <summary>
    /// What an entry the editor appended to the tab menu asks for, by the entry's key and the tab's id; the strip's own entries
    /// are done in the browser and arrive as the document's values.
    /// </summary>
    public void Act(string action, string id)
    {
        if (string.Equals(action, CloseOthersAction, StringComparison.Ordinal))
            CloseOthers(id);
        else
            LogEvent($"unknown tab action '{action}'");
    }

    private void CloseOthers(string id)
    {
        foreach (DemoDocumentItem document in Documents.Where(document => !string.Equals(document.Id, id, StringComparison.Ordinal)).ToArray())
            Close(document.Id);

        SelectedKey = id;
    }

    /// <summary>
    /// Closes a document, or refuses to: whether a tab may go is the controller's answer, not the strip's.
    /// </summary>
    public void Close(string id)
    {
        if (Find(id) is not DemoDocumentItem document)
            return;

        if (document.Pinned == true)
        {
            LogEvent($"{document.Title} is pinned and stays open");
            return;
        }

        var index = Documents.IndexOf(document);

        Documents.RemoveAt(index);
        LogEvent($"closed {document.Title}");

        // The strip would fall back to its first tab; an editor picks the neighbour instead.
        if (string.Equals(SelectedKey, id, StringComparison.Ordinal))
            SelectedKey = Documents.Count == 0 ? null : Documents[Math.Min(index, Documents.Count - 1)].Id;
    }

    /// <summary>
    /// Normalizes the name the caption already wrote back, applying the rule that a file keeps its extension.
    /// </summary>
    public void Rename(string id)
    {
        if (Find(id) is not DemoDocumentItem document)
            return;

        var title = document.Title?.Trim() ?? string.Empty;

        if (title.Length == 0)
        {
            document.Title = OperatorFiles[id].Title;
            LogEvent($"an empty name is refused — back to {document.Title}");
            return;
        }

        if (!title.EndsWith(document.Extension, StringComparison.OrdinalIgnoreCase))
            title += document.Extension;

        document.Title = title;
        LogEvent($"renamed to {title}");
    }

    /// <summary>A pin or an unpin from the tab menu, read off the state the strip wrote back.</summary>
    public void ReportPin(string id)
    {
        if (Find(id) is DemoDocumentItem document)
            LogEvent(document.Pinned == true ? $"pinned {document.Title}" : $"unpinned {document.Title}");
    }

    /// <summary>The strip after a drop or a pin, read off the orders the strip wrote back.</summary>
    public void ReportOrder()
        => LogEvent("order: " + string.Join(" · ", Documents.OrderBy(static document => document.Order).Select(static document => document.Title)));

    private DemoDocumentItem? Find(string id)
        => Documents.FirstOrDefault(document => string.Equals(document.Id, id, StringComparison.Ordinal));

    private static DemoDocumentItem CreateDocument(string id, double order, bool pinned = false)
    {
        (var title, _, var icon, var body) = OperatorFiles[id];

        DemoDocumentItem document = new()
        {
            Id = id,
            Title = title,
            Icon = DemoIcons.Outline(icon),
            Order = order,
            CanRemove = true,
            Body = body,
            Extension = Path.GetExtension(title),
            Pinned = pinned
        };

        return document;
    }
}

/// <summary>
/// A strip the controller walks: four steps nobody closes or drags, driven by the server as readily as by a click.
/// </summary>
internal sealed partial class DriveGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Steps { get; } =
    [
        CreateStep("order", 1, "Order", "api-eu-west-1 on the Standard plan in eu-west. Nothing to do here."),
        CreateStep("disk", 2, "Disk", "80 GB created and the image written — 41 seconds on the last run."),
        CreateStep("boot", 3, "Boot", "Booted on the first try, with the firewall rules applied."),
        CreateStep("health", 4, "Health check", "Waits for the health check to pass, then hands the server to the customer.")
    ];

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "order";

    public void Move(int offset)
    {
        DemoDocumentItem[] ordered = [.. Steps.OrderBy(static step => step.Order)];

        var index = Array.FindIndex(ordered, step => string.Equals(step.Id, SelectedKey, StringComparison.Ordinal));
        var target = Math.Clamp(index + offset, 0, ordered.Length - 1);

        if (target == index)
        {
            LogEvent(offset > 0 ? "already on the last step" : "already on the first step");
            return;
        }

        SelectedKey = ordered[target].Id;
        LogEvent($"now on {ordered[target].Title}");
    }

    private static DemoDocumentItem CreateStep(string id, double order, string title, string body)
        => new() { Id = id, Title = title, Order = order, CanRemove = false, Body = body };
}

internal sealed partial class TabsViewScenariosController() : DemoController
{
    [RecursiveMember]
    public partial EditorGroupContext EditorGroup { get; set; } = new();

    [RecursiveMember]
    public partial DriveGroupContext DriveGroup { get; set; } = new();

    [UICommand]
    public void OpenFile(string id)
        => EditorGroup.Open(id);

    [UICommand]
    public void CloseDocument(string id)
        => EditorGroup.Close(id);

    [UICommand]
    public void RenameDocument(string id)
        => EditorGroup.Rename(id);

    public const string EditorTabsId = "editor-tabs";

    /// <summary>
    /// An entry the editor appended to the strip's tab menu, with the entry's key and the tab's id.
    /// </summary>
    [UICommand]
    public void TabAction(string entry, string id)
        => EditorGroup.Act(entry, id);

    [UICommand]
    public void NextStep()
        => DriveGroup.Move(1);

    [UICommand]
    public void PreviousStep()
        => DriveGroup.Move(-1);

    /// <summary>
    /// A drop and a pin have no command of their own: they write the tab's <c>Order</c> and <c>Pinned</c> back, and this hangs
    /// off those notifications.
    /// </summary>
    protected override void OnNotify(RecursiveChange change)
    {
        base.OnNotify(change);

        ArgumentNullException.ThrowIfNull(change);

        RecursivePath path = change.Path;

        if (path.Count != 4
            || path[0].Kind != PathSegmentKind.Property || !string.Equals(path[0].Property, nameof(EditorGroup), StringComparison.Ordinal)
            || path[1].Kind != PathSegmentKind.Property || !string.Equals(path[1].Property, nameof(EditorGroupContext.Documents), StringComparison.Ordinal)
            || path[3].Kind != PathSegmentKind.Property)
        {
            return;
        }

        if (string.Equals(path[3].Property, nameof(TabItem.Order), StringComparison.Ordinal))
            EditorGroup.ReportOrder();
        else if (string.Equals(path[3].Property, nameof(TabItem.Pinned), StringComparison.Ordinal) && path[2].Kind == PathSegmentKind.Key)
            EditorGroup.ReportPin(path[2].Key);
    }
}
