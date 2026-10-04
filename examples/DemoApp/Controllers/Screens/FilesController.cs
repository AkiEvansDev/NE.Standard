using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using NE.Standard.UI.Primitives.Recursive;

namespace DemoApp.Controllers.Screens;

/// <summary>A file open in the editor: its text, the language it is highlighted in, and the folder it lives in.</summary>
internal sealed partial class DemoFileDocument : TabItem
{
    [RecursiveMember]
    public partial string? Body { get; set; }

    [RecursiveMember]
    public partial string? Language { get; set; }

    /// <summary>The folder's path, for the status line.</summary>
    [RecursiveMember(false)]
    public string Folder { get; init; } = string.Empty;

    /// <summary>The part of the name a rename may not lose.</summary>
    [RecursiveMember(false)]
    public string Extension { get; init; } = string.Empty;
}

/// <summary>
/// An editor over the operator's files: a tree of folders, the files open in a strip of tabs, and every gesture on the strip —
/// open, close, rename, pin, drag — answered by the controller, which may refuse it.
/// </summary>
internal sealed partial class FilesController : UIControllerBase
{
    /// <summary>The editor's own entry of the tab menu, between the strip's Rename and Pin and its Close.</summary>
    public const string CloseOthersAction = "close-others";

    public const string FolderKind = "folder";

    private static readonly Dictionary<string, (string Title, string Folder, string Language, string Body)> OperatorFiles = new(StringComparer.Ordinal)
    {
        ["incident"] = ("incident-report.md", "incidents", UICodeLanguages.Markdown, "# Slow API in Europe West\n\nA full database disk, 39 minutes, and three follow-ups.\n\n- Resize db-eu-west-2 to Dedicated.\n- Alert on a disk at 80 per cent, not 95.\n- Move the backups off the database's own disk."),
        ["postmortem"] = ("postmortem-481.md", "incidents", UICodeLanguages.Markdown, "# Release 481, rolled back\n\nThe migration took a lock the old workers still held; 482 ships it in two steps."),
        ["health"] = ("health-check.cs", "checks", UICodeLanguages.CSharp, "public HealthStatus Check(Server server)\n    => server.Disk.UsedPercent < 90 ? HealthStatus.Healthy : HealthStatus.Degraded;"),
        ["provision"] = ("provision.sh", "scripts", UICodeLanguages.Bash, "#!/usr/bin/env bash\nset -euo pipefail\n\nmkfs.ext4 /dev/vdb\nmount /dev/vdb /data"),
        ["rotate"] = ("rotate-logs.py", "scripts", UICodeLanguages.Python, "import pathlib\n\nfor log in pathlib.Path('/var/log/orvane').glob('*.log'):\n    if log.stat().st_size > 50_000_000:\n        log.rename(log.with_suffix('.log.1'))"),
        ["server"] = ("server.json", "servers/api-eu-west-1", UICodeLanguages.Json, /*lang=json,strict*/ "{\n  \"plan\": \"standard\",\n  \"region\": \"eu-west\",\n  \"replicas\": 3\n}"),
        ["badges"] = ("badges.less", "status-page", UICodeLanguages.Less, "@import \"tokens.less\";\n\n.badge-degraded { color: @warning; }\n.badge-down { color: @danger; }"),
        ["status"] = ("status.html", "status-page", UICodeLanguages.Html, "<h1>Orvane Cloud status</h1>\n<p>All systems operational.</p>")
    };

    private int _untitled;

    // A tab closed a moment ago, by its id, for the toast's Undo to put back as it was — a new file's words included, which nothing
    // else holds.
    private readonly Dictionary<string, (DemoFileDocument Document, int Index)> _closed = new(StringComparer.Ordinal);

    /// <summary>The tree: every folder and file there is, open or not, each file keyed as its tab is.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> Tree { get; } = [.. CreateTree()];

    /// <summary>The files open in the strip; the first is pinned, and the controller refuses to close it.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<DemoFileDocument> Documents { get; } = [CreateDocument("incident", 1, pinned: true), CreateDocument("health", 2)];

    /// <summary>The open file: the strip's tab and the tree's row at once.</summary>
    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "incident";

    /// <summary>The open file's folder and language, under the editor.</summary>
    [RecursiveMember]
    public partial string Location { get; set; } = "incidents · markdown";

    /// <summary>What the controller last did, under the editor.</summary>
    [RecursiveMember]
    public partial string Status { get; set; } = "Two files open; the report is pinned.";

    private static List<TreeNode> CreateTree()
    {
        List<TreeNode> nodes = [];

        foreach (var folder in OperatorFiles.Values.Select(static file => file.Folder).Distinct(StringComparer.Ordinal))
        {
            // A nested folder is one node per segment, each under the one before.
            string? parent = null;

            foreach (var segment in folder.Split('/'))
            {
                var id = parent is null ? segment : $"{parent}/{segment}";

                if (!nodes.Any(node => node.Id == id))
                    nodes.Add(new TreeNode { Id = id, Title = segment, ParentId = parent, Kind = FolderKind, IsFolder = true, Expanded = true, CanSelect = false, IsContent = true });

                parent = id;
            }

            foreach ((var key, (var title, _, _, _)) in OperatorFiles.Where(entry => entry.Value.Folder == folder))
                nodes.Add(new TreeNode { Id = key, Title = title, ParentId = folder, IsFolder = false, IsContent = true });
        }

        return nodes;
    }

    private static DemoFileDocument CreateDocument(string id, double order, bool pinned = false)
    {
        (var title, var folder, var language, var body) = OperatorFiles[id];

        return new DemoFileDocument
        {
            Id = id,
            Title = title,
            Icon = DemoIcons.Outline(DemoIcons.FileText),
            Order = order,
            CanRemove = true,
            Pinned = pinned,
            Body = body,
            Language = language,
            Folder = folder,
            Extension = Path.GetExtension(title),
            IsContent = true
        };
    }

    /// <summary>A press on a file in the tree: it opens in a tab of its own, or its tab comes forward.</summary>
    [UICommand]
    public void OpenFile(string id)
    {
        if (!OperatorFiles.TryGetValue(id, out (string Title, string Folder, string Language, string Body) file))
            return;

        if (Find(id) is null)
        {
            // Past the last tab, so a new one lands at the end wherever a drag left the rest.
            Documents.Add(CreateDocument(id, NextOrder()));
            Status = $"Opened {file.Title}.";
        }
        else
        {
            Status = $"{file.Title} is already open.";
        }

        Show(id);
    }

    /// <summary>A new file, untitled, open at once: a rename gives it a name.</summary>
    [UICommand]
    public void NewFile()
    {
        _untitled++;

        var id = string.Create(CultureInfo.InvariantCulture, $"untitled-{_untitled}");
        var title = string.Create(CultureInfo.InvariantCulture, $"untitled-{_untitled}.md");

        Documents.Add(new DemoFileDocument
        {
            Id = id,
            Title = title,
            Icon = DemoIcons.Outline(DemoIcons.FileText),
            Order = NextOrder(),
            CanRemove = true,
            Body = string.Empty,
            Language = UICodeLanguages.Markdown,
            Folder = "drafts",
            Extension = ".md",
            IsContent = true
        });

        Status = $"Created {title}: double-click its tab to name it.";
        Show(id);
    }

    private double NextOrder()
        => Documents.Count == 0 ? 1 : Documents.Max(static document => document.Order ?? 0) + 1;

    /// <summary>
    /// Closes a file, or refuses to: whether a tab may go is the controller's answer, not the strip's. A closed tab can be had back
    /// from the toast for as long as it stands.
    /// </summary>
    [UICommand]
    public UICommandResult CloseDocument(string id)
    {
        if (Find(id) is not DemoFileDocument document || !Close(document))
            return UICommandResult.Ok();

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(UIPhrase.Of("demo.screens.files.closed", ("title", document.Title?.Key ?? id)))
            {
                Action = new UINotificationAction(UIPhrase.Of("demo.screens.undo"), nameof(ReopenDocument), id)
            }
        ]);
    }

    /// <summary>Closes a tab unless it is pinned, keeping it for an Undo; answers whether it went.</summary>
    private bool Close(DemoFileDocument document)
    {
        if (document.Pinned == true)
        {
            Status = $"{document.Title} is pinned and stays open.";
            return false;
        }

        var id = document.Id;
        var index = Documents.IndexOf(document);

        _closed[id] = (document, index);

        Documents.RemoveAt(index);
        Status = $"Closed {document.Title}.";

        // The strip would fall back to its first tab; an editor picks the neighbour instead.
        if (string.Equals(SelectedKey, id, StringComparison.Ordinal))
            Show(Documents.Count == 0 ? null : Documents[Math.Min(index, Documents.Count - 1)].Id);

        return true;
    }

    /// <summary>The toast's Undo, on no button: the closed tab comes back where it stood, as it was, and in front.</summary>
    [UICommand]
    public void ReopenDocument(string id)
    {
        if (!_closed.Remove(id, out (DemoFileDocument Document, int Index) closed))
            return;

        // Opened again from the tree meanwhile: it is open already, and only comes forward.
        if (Find(id) is null)
            Documents.Insert(Math.Min(closed.Index, Documents.Count), closed.Document);

        Status = $"Reopened {closed.Document.Title}.";
        Show(id);
    }

    /// <summary>
    /// Normalizes the name the tab already wrote back, applying the rule that a file keeps its extension.
    /// </summary>
    [UICommand]
    public void RenameDocument(string id)
    {
        if (Find(id) is not DemoFileDocument document)
            return;

        var title = document.Title?.Key.Trim() ?? string.Empty;

        if (title.Length == 0)
        {
            document.Title = OperatorFiles.TryGetValue(id, out (string Title, string Folder, string Language, string Body) file) ? file.Title : $"{id}{document.Extension}";
            Status = $"An empty name is refused — back to {document.Title}.";
            return;
        }

        if (!title.EndsWith(document.Extension, StringComparison.OrdinalIgnoreCase))
            title += document.Extension;

        document.Title = title;

        // The tree names the file as its tab does.
        foreach (TreeNode node in Tree)
        {
            if (node.Id == id)
                node.Title = title;
        }

        Status = $"Renamed to {title}.";
    }

    /// <summary>
    /// What an entry the editor appended to the tab menu asks for, by the entry's key and the tab's id; the strip's own entries
    /// are done in the browser and arrive as the document's values.
    /// </summary>
    [UICommand]
    public void TabAction(string entry, string id)
    {
        if (!string.Equals(entry, CloseOthersAction, StringComparison.Ordinal))
            return;

        foreach (DemoFileDocument document in Documents.Where(document => !string.Equals(document.Id, id, StringComparison.Ordinal)).ToArray())
            _ = Close(document);

        Show(id);
    }

    /// <summary>The file chosen, in the strip and the tree, and its place under the editor.</summary>
    private void Show(string? id)
    {
        SelectedKey = id;
        Locate();
    }

    private void Locate()
        => Location = Find(SelectedKey ?? string.Empty) is DemoFileDocument document ? $"{document.Folder} · {document.Language}" : string.Empty;

    private DemoFileDocument? Find(string id)
        => Documents.FirstOrDefault(document => string.Equals(document.Id, id, StringComparison.Ordinal));

    /// <summary>
    /// A press on a tab, a drop and a pin have no command of their own: they write the strip's <c>SelectedKey</c> and the tab's
    /// <c>Order</c> and <c>Pinned</c> back, and the status line hangs off those notifications.
    /// </summary>
    protected override void OnNotify(RecursiveChange change)
    {
        base.OnNotify(change);

        ArgumentNullException.ThrowIfNull(change);

        RecursivePath path = change.Path;

        if (path.Count == 1 && path[0].Kind == PathSegmentKind.Property && string.Equals(path[0].Property, nameof(SelectedKey), StringComparison.Ordinal))
        {
            Locate();
            return;
        }

        if (path.Count != 3
            || path[0].Kind != PathSegmentKind.Property || !string.Equals(path[0].Property, nameof(Documents), StringComparison.Ordinal)
            || path[2].Kind != PathSegmentKind.Property)
        {
            return;
        }

        if (string.Equals(path[2].Property, nameof(TabItem.Order), StringComparison.Ordinal))
            Status = "Order: " + string.Join(" · ", Documents.OrderBy(static document => document.Order).Select(static document => document.Title));
        else if (string.Equals(path[2].Property, nameof(TabItem.Pinned), StringComparison.Ordinal) && path[1].Kind == PathSegmentKind.Key && Find(path[1].Key) is DemoFileDocument document)
            Status = document.Pinned == true ? $"Pinned {document.Title}: it stays open and in its place." : $"Unpinned {document.Title}.";
    }
}
