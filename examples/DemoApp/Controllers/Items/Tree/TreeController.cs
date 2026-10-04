using System;
using System.Collections.Generic;
using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Items.Tree;

/// <summary>
/// The nodes the tree pages start from: two object-storage buckets and what they hold, folders first, in walking order.
/// </summary>
internal static class DemoStorageTree
{
    public const string FolderKind = "folder";
    public const string FileKind = "file";

    // No icon of their own: a node that says whether it is a folder wears the tree's file dress, a folder open while unfolded.
    public static TreeNode Folder(string id, string title, string? parentId, bool expanded = true)
        => new() { Id = id, Title = title, ParentId = parentId, Kind = FolderKind, IsFolder = true, Expanded = expanded };

    public static TreeNode File(string id, string title, string? parentId)
        => new() { Id = id, Title = title, ParentId = parentId, Kind = FileKind, IsFolder = false };

    public static List<TreeNode> Create()
        =>
        [
            Folder("backups", "backups-eu-west", null),
            Folder("backups-db", "db-eu-west-1", "backups"),
            File("db-snapshot-21", "snapshot-0921.tar.gz", "backups-db"),
            File("db-snapshot-22", "snapshot-0922.tar.gz", "backups-db"),
            Folder("backups-api", "api-eu-west-1", "backups", expanded: false),
            File("api-snapshot-21", "snapshot-0921.tar.gz", "backups-api"),
            File("api-snapshot-22", "snapshot-0922.tar.gz", "backups-api"),
            File("manifest", "manifest.json", "backups"),
            Folder("status", "status-page", null, expanded: false),
            File("status-html", "status.html", "status"),
            // Pinned: neither dragged nor removed, whatever the tree allows; a heading elsewhere refuses the choice the same way.
            new() { Id = "incident-report", Title = "incident-report.md", Kind = FileKind, IsFolder = false, CanDrag = false, CanRemove = false },
        ];

    /// <summary>
    /// Moves a node into the folder its <c>DropTarget</c> names — a file stands for its folder — as the <paramref name="index"/>th node
    /// there, and says what it did; a node never goes under itself. Null when no node has the key.
    /// </summary>
    public static string? Move(RecursiveCollection<TreeNode> items, string id, int index)
    {
        TreeNode? node = Find(items, id);

        if (node is null)
            return null;

        TreeNode? folder = FolderOf(items, node.DropTarget);

        node.DropTarget = null;

        if (folder is not null && (folder == node || IsUnder(items, folder, id)))
            return $"Refused: {folder.Title} is inside {node.Title}";

        MoveSubtree(items, node, folder, index);

        return $"Moved {node.Title} into {folder?.Title ?? "the root"}";
    }

    /// <summary>The folder a drop names, or the folder of the file it names; null for the top level.</summary>
    public static TreeNode? FolderOf(RecursiveCollection<TreeNode> items, string? id)
    {
        TreeNode? node = string.IsNullOrEmpty(id) ? null : Find(items, id);

        return node is null || node.Kind == FolderKind ? node : node.ParentId is null ? null : Find(items, node.ParentId);
    }

    /// <summary>
    /// Lifts a node and everything under it out of the flat list and puts it back as the <paramref name="index"/>th node of the folder
    /// <paramref name="folder"/> (the top level when null), in walking order; past the folder's last node, after its last descendant.
    /// </summary>
    public static void MoveSubtree(RecursiveCollection<TreeNode> items, TreeNode node, TreeNode? folder, int index)
    {
        List<TreeNode> subtree = Subtree(items, node);

        for (var i = subtree.Count - 1; i >= 0; i--)
            _ = items.Remove(subtree[i]);

        node.ParentId = folder?.Id;

        var position = AfterLastDescendant(items, folder);
        var seen = 0;

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i].ParentId != folder?.Id)
                continue;

            if (seen++ == index)
            {
                position = i;
                break;
            }
        }

        for (var i = 0; i < subtree.Count; i++)
            items.Insert(position + i, subtree[i]);
    }

    /// <summary>A node and everything under it, in walking order.</summary>
    public static List<TreeNode> Subtree(RecursiveCollection<TreeNode> items, TreeNode node)
    {
        List<TreeNode> subtree = [];

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] == node || IsUnder(items, items[i], node.Id))
                subtree.Add(items[i]);
        }

        return subtree;
    }

    /// <summary>The index past a folder's last descendant in the flat list; the list's end for the top level.</summary>
    public static int AfterLastDescendant(RecursiveCollection<TreeNode> items, TreeNode? folder)
    {
        if (folder is null)
            return items.Count;

        var index = items.IndexOf(folder) + 1;

        while (index < items.Count && IsUnder(items, items[index], folder.Id))
            index++;

        return index;
    }

    /// <summary>Whether a node sits under the one keyed <paramref name="ancestorId"/>, by the parent keys the nodes carry.</summary>
    public static bool IsUnder(RecursiveCollection<TreeNode> items, TreeNode node, string ancestorId)
    {
        for (var parentId = node.ParentId; parentId is not null; parentId = Find(items, parentId)?.ParentId)
        {
            if (parentId == ancestorId)
                return true;
        }

        return false;
    }

    public static TreeNode? Find(RecursiveCollection<TreeNode> items, string id)
    {
        for (var i = 0; i < items.Count; i++)
        {
            if (items[i].Id == id)
                return items[i];
        }

        return null;
    }
}

/// <summary>
/// The properties that answer for the whole tree: its step, its chrome, and which rows are chosen.
/// </summary>
internal sealed partial class TreeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UISurfaceStyle? Surface { get; set; } = UISurfaceStyle.Background;

    [RecursiveMember]
    public partial double? Indent { get; set; } = 16;

    [RecursiveMember]
    public partial bool Renamable { get; set; } = true;

    [RecursiveMember]
    public partial bool RenameOnDoubleClick { get; set; }

    [RecursiveMember]
    public partial bool Removable { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowFoldChevron { get; set; } = true;

    [RecursiveMember]
    public partial bool RowHoverable { get; set; } = true;

    [RecursiveMember]
    public partial UIScrollMode? VerticalScroll { get; set; }

    [RecursiveMember]
    public partial UISelectionMode? SelectionMode { get; set; } = UISelectionMode.One;

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "manifest";

    [RecursiveMember]
    public partial IReadOnlyList<string>? SelectedKeys { get; set; }

    [RecursiveMember]
    public partial UISelectionStyle? SelectionStyle { get; set; }

    public TreeGroupContext()
    {
        AddOption(nameof(Surface), CycleSurface, () => Surface);
        AddOption(nameof(Indent), CycleIndent, () => Indent);
        AddOption(nameof(Renamable), ToggleRenamable, () => Renamable);
        AddOption(nameof(RenameOnDoubleClick), ToggleRenameOnDoubleClick, () => RenameOnDoubleClick);
        AddOption(nameof(Removable), ToggleRemovable, () => Removable);
        AddOption(nameof(ShowFoldChevron), ToggleShowFoldChevron, () => ShowFoldChevron);
        AddOption(nameof(RowHoverable), ToggleRowHoverable, () => RowHoverable);
        AddOption(nameof(VerticalScroll), CycleVerticalScroll, () => VerticalScroll);
        AddOption(nameof(SelectionMode), CycleSelectionMode, () => SelectionMode);
        AddOption(nameof(SelectedKey), CycleSelectedKey, () => SelectedKey);
        AddOption(nameof(SelectedKeys), CycleSelectedKeys, () => SelectedKeys is null ? null : string.Join(", ", SelectedKeys));
        AddOption(nameof(SelectionStyle), CycleSelectionStyle, () => SelectionStyle);
    }

    public void CycleSurface()
        => SetLastChange(nameof(Surface), Surface = CycleEnum(Surface));

    public void CycleIndent()
        => SetLastChange(nameof(Indent), Indent = CycleValue(Indent, 16d, 24d, 8d));

    // F2 on the row the keyboard is on, or a menu entry that returns a RenameNodeEffect.
    public void ToggleRenamable()
        => SetLastChange(nameof(Renamable), Renamable = !Renamable);

    // With it on, a double click opens the field instead of raising open; Enter still opens.
    public void ToggleRenameOnDoubleClick()
        => SetLastChange(nameof(RenameOnDoubleClick), RenameOnDoubleClick = !RenameOnDoubleClick);

    // Off, the Delete key raises nothing on any node, whatever the node says.
    public void ToggleRemovable()
        => SetLastChange(nameof(Removable), Removable = !Removable);

    // Off, no chevron and no square for one: a folder folds from the keyboard, a click chooses it.
    public void ToggleShowFoldChevron()
        => SetLastChange(nameof(ShowFoldChevron), ShowFoldChevron = !ShowFoldChevron);

    public void ToggleRowHoverable()
        => SetLastChange(nameof(RowHoverable), RowHoverable = !RowHoverable);

    // Read against the preview's height cap: with Auto the rows scroll inside the tree.
    public void CycleVerticalScroll()
        => SetLastChange(nameof(VerticalScroll), VerticalScroll = CycleEnum(VerticalScroll));

    // The mode picks which of the two key rows the tree reads; the arrows choose a row only with One.
    public void CycleSelectionMode()
        => SetLastChange(nameof(SelectionMode), SelectionMode = CycleEnum(SelectionMode));

    public void CycleSelectedKey()
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, null, "manifest", "db-snapshot-21"));

    public void CycleSelectedKeys()
        => SetLastChange(nameof(SelectedKeys), SelectedKeys = CycleValue(SelectedKeys, null, ["db-snapshot-21", "db-snapshot-22"], ["incident-report"]));

    public void CycleSelectionStyle()
        => SetLastChange(nameof(SelectionStyle), SelectionStyle = CycleValue(SelectionStyle, null, UISelectionStyle.Marked(UISelectionMark.Left), UISelectionStyle.Ground(UIThemeColor.Accent), new UISelectionStyle(UIThemeColor.Primary, UIThemeColor.OnPrimary, UISelectionMark.None, null)));
}

/// <summary>
/// The nodes themselves: each option prints the collection's state, and pressing it moves the collection.
/// </summary>
internal sealed partial class TreeNodesGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> Items { get; } = [.. DemoStorageTree.Create()];

    public TreeNodesGroupContext()
    {
        AddOption("Add a snapshot to backups", AddFile, () => Items.Count);
        AddOption("Remove the last node", RemoveLast, () => Items.Count);
        AddOption("Rename the last node", RenameLast, () => Items.Count == 0 ? null : Items[^1].Title);
    }

    /// <summary>
    /// A new snapshot goes in after the last node under the backups bucket, so the list stays in walking order.
    /// </summary>
    public void AddFile()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"file-{++_added}");
        var index = 0;

        for (var i = 0; i < Items.Count; i++)
        {
            if (Items[i].Id == "backups" || DemoStorageTree.IsUnder(Items, Items[i], "backups"))
                index = i + 1;
        }

        Items.Insert(index, DemoStorageTree.File(id, string.Create(CultureInfo.InvariantCulture, $"snapshot-{_added}.tar.gz"), "backups"));
    }

    public void RemoveLast()
    {
        if (Items.Count > 0)
            _ = Items.Remove(Items[^1]);
    }

    /// <summary>
    /// Mutates the last node's title in place, which shows a node's binding is live.
    /// </summary>
    public void RenameLast()
    {
        if (Items.Count == 0)
            return;

        TreeNode node = Items[^1];

        var title = node.Title?.Key ?? string.Empty;

        node.Title = title.EndsWith('*') ? title.TrimEnd('*') : $"{title}*";
    }
}

/// <summary>
/// A bucket's objects with a menu per kind: a folder takes a new object, an object is renamed or deleted, either opens.
/// </summary>
internal sealed partial class TreeFilesGroupContext : DemoGroupContext
{
    /// <summary>The kind the tree offers its nodes as, which the attachments take a copy of.</summary>
    public const string ObjectKind = "object";
    public const string RenameAction = "rename";
    public const string DeleteAction = "delete";
    public const string NewFileAction = "new-file";

    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> Items { get; } = [.. DemoStorageTree.Create()];

    [RecursiveMember]
    public partial string? Attachments { get; set; }

    public TreeFilesGroupContext()
    {
        // One folder switched off: it is not chosen, dragged, dropped into or deleted, and does not open under a drag.
        DemoStorageTree.Find(Items, "status")!.Enabled = false;
    }

    public void Open(string id)
        => LogEvent($"Opened {TitleOf(id)}");

    private string TitleOf(string id)
        => DemoStorageTree.Find(Items, id)?.Title?.ToString() ?? id;

    /// <summary>The objects a drop carried, a line each in the attachments: they are no list of objects, so they take a copy and the tree keeps its nodes.</summary>
    public void Attach(UIDrop drop)
    {
        foreach (var key in drop.Keys)
        {
            if (DemoStorageTree.Find(Items, key) is not null)
                Attachments = string.IsNullOrEmpty(Attachments) ? TitleOf(key) : $"{Attachments}\n{TitleOf(key)}";
        }

        LogEvent($"Attached {string.Join(", ", drop.Keys)}");
    }

    /// <summary>The rename already wrote the node's <c>Title</c> through its two-way binding; the controller only says so — or puts it back.</summary>
    public void Rename(string id)
    {
        TreeNode? node = DemoStorageTree.Find(Items, id);

        if (node is not null)
            LogEvent($"Renamed to {node.Title}");
    }

    /// <summary>A node goes with everything under it; a pinned one stays, and the refusal is said.</summary>
    public void Delete(string id)
    {
        TreeNode? node = DemoStorageTree.Find(Items, id);

        if (node is null)
            return;

        if (node.CanRemove == false)
        {
            LogEvent($"Refused: {node.Title} is pinned");
            return;
        }

        for (var i = Items.Count - 1; i >= 0; i--)
        {
            if (Items[i] == node || DemoStorageTree.IsUnder(Items, Items[i], id))
                Items.RemoveAt(i);
        }

        LogEvent($"Deleted {node.Title}");
    }

    /// <summary>A new object goes in right after its folder; its key comes back so the caller can open it for a rename.</summary>
    public string? AddFile(string folderId)
    {
        TreeNode? folder = DemoStorageTree.Find(Items, folderId);

        if (folder is null)
            return null;

        var fileId = string.Create(CultureInfo.InvariantCulture, $"new-file-{++_added}");

        Items.Insert(Items.IndexOf(folder) + 1, DemoStorageTree.File(fileId, string.Create(CultureInfo.InvariantCulture, $"new-object-{_added}.json"), folderId));
        LogEvent($"Added an object to {folder.Title}");

        return fileId;
    }

    /// <summary>
    /// The move named the folder the node lands in and its place there; the controller decides. A file stands for its folder, a node
    /// cannot go under itself, and a move is the subtree lifted out and put back at its place, in walking order — though the sort
    /// rules order every folder's nodes on the page whatever place was asked.
    /// </summary>
    public void Move(string id, int index)
    {
        if (DemoStorageTree.Move(Items, id, index) is string said)
            LogEvent(said);
    }
}

/// <summary>
/// Two buckets' trees and a list of files to review, all offering their items as one kind: a node dragged into the other tree goes there
/// with everything under it, a file dragged into the list becomes one of its rows, drawn as a list draws it, and a row dragged into a
/// folder of either tree is a file there again. Ctrl (⌥ on a Mac) copies instead.
/// </summary>
/// <remarks>Nothing beside a tree moves ahead of the answer: the page waits for these moves.</remarks>
internal sealed partial class TreeTransferGroupContext : DemoGroupContext
{
    public const string DragKind = "file";
    public const string EuWest = "transfer-eu-west";
    public const string UsEast = "transfer-us-east";
    public const string Review = "transfer-review";

    private int _copies;

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> EuWestNodes { get; } =
    [
        DemoStorageTree.Folder("eu-db", "db", null),
        DemoStorageTree.File("eu-db-0921", "snapshot-0921.tar.gz", "eu-db"),
        DemoStorageTree.File("eu-db-0922", "snapshot-0922.tar.gz", "eu-db"),
        DemoStorageTree.Folder("eu-logs", "logs", null),
        DemoStorageTree.File("eu-logs-api", "api-0922.log", "eu-logs"),
        DemoStorageTree.File("eu-manifest", "manifest.json", null),
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> UsEastNodes { get; } =
    [
        DemoStorageTree.Folder("us-db", "db", null),
        DemoStorageTree.File("us-db-0920", "snapshot-0920.tar.gz", "us-db"),
        DemoStorageTree.Folder("us-logs", "logs", null),
        DemoStorageTree.File("us-logs-web", "web-0922.log", "us-logs"),
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> ReviewFiles { get; } = [];

    /// <summary>Moves a node within its own tree, into the folder its <c>DropTarget</c> names; never under itself.</summary>
    public void Move(string tree, string id, int index)
    {
        if (NodesOf(tree) is RecursiveCollection<TreeNode> nodes && DemoStorageTree.Move(nodes, id, index) is string said)
            LogEvent($"{said} in {Name(tree)}");
    }

    /// <summary>The nodes of the tree a key names; null for any other, whose drop then moves nothing.</summary>
    private RecursiveCollection<TreeNode>? NodesOf(string? tree)
        => tree switch
        {
            EuWest => EuWestNodes,
            UsEast => UsEastNodes,
            _ => null
        };

    private static string Name(string? tree)
        => tree == UsEast ? "us-east" : "eu-west";

    /// <summary>Takes what a drop carried into a folder of the tree: nodes of the other tree with everything under them, or rows of the list as files.</summary>
    public void DropIntoTree(UIDrop drop, string tree)
    {
        if (NodesOf(tree) is not RecursiveCollection<TreeNode> target)
            return;

        TreeNode? folder = DemoStorageTree.FolderOf(target, drop.Folder);
        var copy = drop.Effect == UIDropEffect.Copy;

        if (drop.Source == Review)
        {
            foreach (var key in drop.Keys)
            {
                TextItem? row = RowOf(key);

                // The page's word is checked against the list: a key no longer in it moves nothing.
                if (row is null)
                    continue;

                if (!copy)
                    _ = ReviewFiles.Remove(row);

                target.Insert(DemoStorageTree.AfterLastDescendant(target, folder), DemoStorageTree.File(copy ? CopyId(key) : key, row.Title?.ToString() ?? key, folder?.Id));
            }
        }
        else if (drop.Source != tree && NodesOf(drop.Source) is RecursiveCollection<TreeNode> source)
        {
            foreach (TreeNode node in TopNodes(source, drop.Keys))
            {
                List<TreeNode> subtree = DemoStorageTree.Subtree(source, node);

                if (!copy)
                {
                    foreach (TreeNode moved in subtree)
                        _ = source.Remove(moved);
                }
                else
                {
                    subtree = Copied(subtree);
                }

                subtree[0].ParentId = folder?.Id;

                var at = DemoStorageTree.AfterLastDescendant(target, folder);

                for (var i = 0; i < subtree.Count; i++)
                    target.Insert(at + i, subtree[i]);
            }
        }
        else
        {
            return;
        }

        LogEvent($"{string.Join(", ", drop.Keys)} {(copy ? "copied" : "moved")} into {Name(tree)}{(folder is null ? "" : $" / {folder.Title}")}");
    }

    private TextItem? RowOf(string id)
    {
        foreach (TextItem row in ReviewFiles)
        {
            if (row.Id == id)
                return row;
        }

        return null;
    }

    private string CopyId(string id)
        => string.Create(CultureInfo.InvariantCulture, $"{id}-copy-{++_copies}");

    /// <summary>The dragged nodes, less those already carried by a dragged folder above them.</summary>
    private static List<TreeNode> TopNodes(RecursiveCollection<TreeNode> nodes, IReadOnlyList<string> keys)
    {
        List<TreeNode> top = [];

        foreach (var key in keys)
        {
            TreeNode? node = DemoStorageTree.Find(nodes, key);
            var carried = false;

            foreach (var other in keys)
                carried |= other != key && node is not null && DemoStorageTree.IsUnder(nodes, node, other);

            if (node is not null && !carried)
                top.Add(node);
        }

        return top;
    }

    /// <summary>A copy of a subtree under keys of its own, each node under its copied parent.</summary>
    private List<TreeNode> Copied(List<TreeNode> subtree)
    {
        Dictionary<string, string> ids = [];
        List<TreeNode> copies = [];

        foreach (TreeNode node in subtree)
        {
            ids[node.Id] = CopyId(node.Id);

            TreeNode copy = node.Kind == DemoStorageTree.FolderKind
                ? DemoStorageTree.Folder(ids[node.Id], node.Title?.ToString() ?? node.Id, null)
                : DemoStorageTree.File(ids[node.Id], node.Title?.ToString() ?? node.Id, null);

            copy.ParentId = node.ParentId is not null && ids.TryGetValue(node.ParentId, out var parentId) ? parentId : null;
            copies.Add(copy);
        }

        return copies;
    }

    /// <summary>Takes the files a drop carried from a tree into the list, from the place it asked for, each saying where it came from; a folder stays in its tree.</summary>
    public void DropForReview(UIDrop drop)
    {
        if (NodesOf(drop.Source) is not RecursiveCollection<TreeNode> source)
            return;

        var copy = drop.Effect == UIDropEffect.Copy;
        var at = Math.Clamp(drop.Index ?? ReviewFiles.Count, 0, ReviewFiles.Count);

        foreach (var key in drop.Keys)
        {
            TreeNode? node = DemoStorageTree.Find(source, key);

            if (node is null)
                continue;

            if (node.Kind == DemoStorageTree.FolderKind)
            {
                LogEvent($"Refused: {node.Title} is a folder, and only files are reviewed");
                continue;
            }

            TreeNode? parent = node.ParentId is null ? null : DemoStorageTree.Find(source, node.ParentId);

            ReviewFiles.Insert(at++, new TextItem
            {
                Id = copy ? CopyId(key) : key,
                IsContent = true,
                Icon = DemoIcons.Outline(DemoIcons.File),
                Title = node.Title,
                Description = $"From {Name(drop.Source)}{(parent is null ? "" : $" / {parent.Title}")}"
            });

            if (!copy)
                _ = source.Remove(node);
        }

        LogEvent($"{string.Join(", ", drop.Keys)} {(copy ? "copied" : "moved")} to review");
    }

    /// <summary>Moves a row within the list, as a drag between two of its rows asked.</summary>
    public void MoveReview(string id, int index)
    {
        TextItem? row = RowOf(id);

        if (row is null)
            return;

        ReviewFiles.Move(ReviewFiles.IndexOf(row), index);
        LogEvent($"{row.Title} -> place {index + 1} to review");
    }
}

/// <summary>
/// Folders that say they have children and hold none until they are opened: the controller fills them in on demand.
/// </summary>
internal sealed partial class TreeLazyGroupContext : DemoGroupContext
{
    private int _loads;

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> Items { get; } =
    [
        Lazy("backups-eu-west", "backups-eu-west"),
        Lazy("backups-us-east", "backups-us-east"),
        Lazy("snapshots-ap-south", "snapshots-ap-south"),
    ];

    private static TreeNode Lazy(string id, string title, string? parentId = null)
        => new() { Id = id, Title = title, ParentId = parentId, Kind = DemoStorageTree.FolderKind, IsFolder = true, HasChildren = true };

    /// <summary>Three objects and one more folder to open, put right after the folder that asked.</summary>
    public void Load(string id)
    {
        var index = 0;

        for (var i = 0; i < Items.Count; i++)
        {
            if (Items[i].Id == id)
                index = i + 1;
        }

        var load = ++_loads;
        List<TreeNode> children =
        [
            Lazy(string.Create(CultureInfo.InvariantCulture, $"{id}-sub-{load}"), string.Create(CultureInfo.InvariantCulture, $"batch-{load}"), id),
            DemoStorageTree.File(string.Create(CultureInfo.InvariantCulture, $"{id}-a-{load}"), string.Create(CultureInfo.InvariantCulture, $"snapshot-{load}.tar.gz"), id),
            DemoStorageTree.File(string.Create(CultureInfo.InvariantCulture, $"{id}-b-{load}"), string.Create(CultureInfo.InvariantCulture, $"manifest-{load}.json"), id),
            DemoStorageTree.File(string.Create(CultureInfo.InvariantCulture, $"{id}-c-{load}"), "checksums.txt", id),
        ];

        for (var i = 0; i < children.Count; i++)
            Items.Insert(index + i, children[i]);

        LogEvent($"Loaded {children.Count} nodes into {id}");
    }
}

/// <summary>
/// Notes in folders, one open beside the tree: a press on a note opens it, and the press is a command like any other, so its answer
/// carries an effect. Cleared, the tree shows its empty template; refilled, the template goes.
/// </summary>
internal sealed partial class TreeNotesGroupContext : DemoGroupContext
{
    private const string NothingOpen = "Nothing open";
    private const string PressANote = "Press a note in the tree.";

    private static readonly Dictionary<string, string> Texts = new(StringComparer.Ordinal)
    {
        ["groceries"] = "Oat milk, lemons, basil and a loaf of rye.",
        ["gifts"] = "A field guide to mushrooms for Mira; tickets for the harbour boat.",
        ["release"] = "Freeze on Thursday, notes by Friday, ship on Monday morning.",
        ["retro"] = "Keep the smaller reviews; drop the second stand-up."
    };

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> Items { get; } = [.. Create()];

    [RecursiveMember]
    public partial string? SelectedKey { get; set; }

    [RecursiveMember]
    public partial string OpenTitle { get; set; } = NothingOpen;

    [RecursiveMember]
    public partial string OpenText { get; set; } = PressANote;

    private static List<TreeNode> Create()
        =>
        [
            Folder("home", "Home"),
            DemoStorageTree.File("groceries", "Groceries", "home"),
            DemoStorageTree.File("gifts", "Gift ideas", "home"),
            Folder("work", "Work"),
            DemoStorageTree.File("release", "Release plan", "work"),
            DemoStorageTree.File("retro", "Retro", "work")
        ];

    // A folder only holds notes: it takes no selection, so a press folds it and the chosen row is always the open note.
    private static TreeNode Folder(string id, string title)
    {
        TreeNode folder = DemoStorageTree.Folder(id, title, null);

        folder.CanSelect = false;

        return folder;
    }

    /// <summary>
    /// A note dragged between two others, onto a folder, or moved by Alt with an arrow stands where it was put: the folder its
    /// <c>DropTarget</c> names, at the index the move carries. A folder stays at the top level.
    /// </summary>
    public void Move(string id, int index)
    {
        TreeNode? node = DemoStorageTree.Find(Items, id);

        if (node is null)
            return;

        var target = node.DropTarget;

        node.DropTarget = null;

        TreeNode? folder = string.IsNullOrEmpty(target) ? null : DemoStorageTree.Find(Items, target);

        // A folder stays at the top level; a note goes into a folder.
        if (node.Kind == DemoStorageTree.FolderKind ? folder is not null : folder is null)
            return;

        DemoStorageTree.MoveSubtree(Items, node, folder, index);
        LogEvent($"Moved {node.Title} to {folder?.Title ?? "the top"}, place {index + 1}");
    }

    /// <summary>A note opens beside the tree and says so; a folder only holds notes, and a press on it only folds it.</summary>
    public UICommandResult Open(string id)
    {
        TreeNode? note = null;

        foreach (TreeNode node in Items)
        {
            if (node.Id == id)
                note = node;
        }

        if (note is null || !Texts.TryGetValue(id, out var text))
            return UICommandResult.Ok();

        var title = note.Title?.ToString() ?? id;

        OpenTitle = title;
        OpenText = text;
        LogEvent($"Pressed {title}");

        return UICommandResult.Ok([new ShowNotificationEffect($"Opened {title}.", UIColorStyle.Info)]);
    }

    public void Clear()
    {
        Items.Clear();
        SelectedKey = null;
        OpenTitle = NothingOpen;
        OpenText = PressANote;
        LogEvent("Cleared the notes");
    }

    public void Refill()
    {
        if (Items.Count > 0)
            return;

        foreach (TreeNode node in Create())
            Items.Add(node);

        LogEvent("Brought the notes back");
    }
}

/// <summary>
/// A settings tree whose chosen node is the page's state: the key travels two-way, so the page can show it.
/// </summary>
internal sealed partial class TreeSettingsGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "appearance-theme";

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> Items { get; } =
    [
        Section("general", "General", DemoIcons.Settings),
        Leaf("general-startup", "Startup", "general"),
        Leaf("general-language", "Language", "general"),
        Section("appearance", "Appearance", DemoIcons.Palette),
        Leaf("appearance-theme", "Theme", "appearance"),
        Leaf("appearance-density", "Density", "appearance"),
        Section("notifications", "Notifications", DemoIcons.Bell),
        Leaf("notifications-mail", "Mail", "notifications"),
        Leaf("notifications-desktop", "Desktop", "notifications"),
    ];

    // A heading is not a setting: it cannot be chosen, and a click on it folds it instead.
    private static TreeNode Section(string id, string title, string icon)
        => new() { Id = id, Title = title, Icon = DemoIcons.Outline(icon), Expanded = true, CanSelect = false };

    private static TreeNode Leaf(string id, string title, string parentId)
        => new() { Id = id, Title = title, ParentId = parentId };
}

/// <summary>
/// One tree and every property that can be bound to it, and the examples' trees that answer: a bucket's objects, two buckets and a
/// list trading files, notes opened on a press, a settings tree and folders filled in as they open.
/// </summary>
internal sealed partial class TreeController() : DemoStandardController
{
    public const string FilesTreeId = "examples-files-tree";

    [RecursiveMember]
    public partial TreeGroupContext TreeGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeNodesGroupContext NodesGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeFilesGroupContext FilesGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeTransferGroupContext TransferGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeLazyGroupContext LazyGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeSettingsGroupContext SettingsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeNotesGroupContext NotesGroup { get; set; } = new();

    [UICommand]
    public void CycleTreeOption(string id)
        => TreeGroup.CycleOption(id);

    [UICommand]
    public void CycleNodesOption(string id)
        => NodesGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);

    [UICommand]
    public void OpenNode(string id)
        => FilesGroup.Open(id);

    [UICommand]
    public void RenameNode(string id)
        => FilesGroup.Rename(id);

    /// <summary>A menu entry: rename hands the field back to the client, a new object is added and handed back the same way, a delete is done here.</summary>
    [UICommand]
    public UICommandResult NodeAction(string action, string id)
    {
        if (action == TreeFilesGroupContext.RenameAction)
            return UICommandResult.Ok([new RenameNodeEffect(FilesTreeId, id)]);

        if (action == TreeFilesGroupContext.NewFileAction)
        {
            var fileId = FilesGroup.AddFile(id);

            return fileId is null ? UICommandResult.Ok() : UICommandResult.Ok([new RenameNodeEffect(FilesTreeId, fileId)]);
        }

        FilesGroup.Delete(id);

        return UICommandResult.Ok();
    }

    [UICommand]
    public void AttachObjects(UIDrop drop)
        => FilesGroup.Attach(drop);

    [UICommand]
    public void MoveNode(string id, int index)
        => FilesGroup.Move(id, index);

    [UICommand]
    public void MoveTransferNode(string tree, string id, int index)
        => TransferGroup.Move(tree, id, index);

    [UICommand]
    public void DropIntoTree(UIDrop drop, string tree)
        => TransferGroup.DropIntoTree(drop, tree);

    [UICommand]
    public void DropForReview(UIDrop drop)
        => TransferGroup.DropForReview(drop);

    [UICommand]
    public void MoveReviewFile(string id, int index)
        => TransferGroup.MoveReview(id, index);

    [UICommand]
    public void MoveNote(string id, int index)
        => NotesGroup.Move(id, index);

    [UICommand]
    public void DeleteNode(string id)
        => FilesGroup.Delete(id);

    [UICommand]
    public void LoadChildren(string id)
        => LazyGroup.Load(id);

    [UICommand]
    public UICommandResult OpenNote(string id)
        => NotesGroup.Open(id);

    [UICommand]
    public void ClearNotes()
        => NotesGroup.Clear();

    [UICommand]
    public void RefillNotes()
        => NotesGroup.Refill();
}
