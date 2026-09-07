using System.Collections.Generic;
using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Items.Tree;

/// <summary>
/// A project's files with a menu per kind: a folder takes a new file, a file is renamed or deleted, either opens.
/// </summary>
internal sealed partial class TreeFilesGroupContext : DemoGroupContext
{
    public const string RenameAction = "rename";
    public const string DeleteAction = "delete";
    public const string NewFileAction = "new-file";

    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> Items { get; } = [.. DemoProjectTree.Create()];

    public void Open(string id)
        => LogEvent($"Opened {TitleOf(id)}");

    /// <summary>The rename already wrote the node's <c>Title</c> through its two-way binding; the controller only says so — or puts it back.</summary>
    public void Rename(string id)
    {
        TreeNode? node = Find(id);

        if (node is not null)
            LogEvent($"Renamed to {node.Title}");
    }

    /// <summary>A node goes with everything under it; a pinned one stays, and the refusal is said.</summary>
    public void Delete(string id)
    {
        TreeNode? node = Find(id);

        if (node is null)
            return;

        if (node.CanRemove == false)
        {
            LogEvent($"Refused: {node.Title} is pinned");
            return;
        }

        for (var i = Items.Count - 1; i >= 0; i--)
        {
            if (Items[i] == node || IsUnder(Items[i], id))
                Items.RemoveAt(i);
        }

        LogEvent($"Deleted {node.Title}");
    }

    /// <summary>A new file goes in right after its folder; its key comes back so the caller can open it for a rename.</summary>
    public string? AddFile(string folderId)
    {
        TreeNode? folder = Find(folderId);

        if (folder is null)
            return null;

        var fileId = string.Create(CultureInfo.InvariantCulture, $"new-file-{++_added}");

        Items.Insert(Items.IndexOf(folder) + 1, DemoProjectTree.File(fileId, string.Create(CultureInfo.InvariantCulture, $"NewFile{_added}.cs"), folderId));
        LogEvent($"Added a file to {folder.Title}");

        return fileId;
    }

    /// <summary>
    /// The drop named where the node landed; the controller decides. A file stands for its folder, a node cannot go under itself,
    /// and a move is the subtree lifted out and put back after the folder's last descendant, in walking order.
    /// </summary>
    public void Move(string id)
    {
        TreeNode? node = Find(id);

        if (node is null)
            return;

        var target = node.DropTarget;

        node.DropTarget = null;

        TreeNode? folder = string.IsNullOrEmpty(target) ? null : Find(target);

        if (folder is not null && folder.Kind != DemoProjectTree.FolderKind)
            folder = folder.ParentId is null ? null : Find(folder.ParentId);

        if (folder is not null && (folder == node || IsUnder(folder, id)))
        {
            LogEvent($"Refused: {folder.Title} is inside {node.Title}");
            return;
        }

        if (folder?.Id == node.ParentId)
            return;

        List<TreeNode> subtree = [];

        for (var i = 0; i < Items.Count; i++)
        {
            if (Items[i] == node || IsUnder(Items[i], id))
                subtree.Add(Items[i]);
        }

        for (var i = subtree.Count - 1; i >= 0; i--)
            _ = Items.Remove(subtree[i]);

        node.ParentId = folder?.Id;

        var index = Items.Count;

        if (folder is not null)
        {
            index = Items.IndexOf(folder) + 1;

            while (index < Items.Count && IsUnder(Items[index], folder.Id))
                index++;
        }

        for (var i = 0; i < subtree.Count; i++)
            Items.Insert(index + i, subtree[i]);

        LogEvent($"Moved {node.Title} into {folder?.Title ?? "the root"}");
    }

    public TreeNode? Find(string id)
    {
        for (var i = 0; i < Items.Count; i++)
        {
            if (Items[i].Id == id)
                return Items[i];
        }

        return null;
    }

    private string TitleOf(string id)
        => Find(id)?.Title ?? id;

    private bool IsUnder(TreeNode node, string ancestorId)
    {
        for (var parentId = node.ParentId; parentId is not null; parentId = Find(parentId)?.ParentId)
        {
            if (parentId == ancestorId)
                return true;
        }

        return false;
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
        Lazy("packages", "packages"),
        Lazy("node-modules", "node_modules"),
        Lazy("artifacts", "artifacts"),
    ];

    private static TreeNode Lazy(string id, string title, string? parentId = null)
        => new() { Id = id, Title = title, ParentId = parentId, Kind = DemoProjectTree.FolderKind, Icon = DemoIcons.Outline(DemoIcons.Folder), HasChildren = true };

    /// <summary>Three files and one more folder to open, put right after the folder that asked.</summary>
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
            Lazy(string.Create(CultureInfo.InvariantCulture, $"{id}-sub-{load}"), string.Create(CultureInfo.InvariantCulture, $"folder-{load}"), id),
            DemoProjectTree.File(string.Create(CultureInfo.InvariantCulture, $"{id}-a-{load}"), string.Create(CultureInfo.InvariantCulture, $"index-{load}.js"), id),
            DemoProjectTree.File(string.Create(CultureInfo.InvariantCulture, $"{id}-b-{load}"), string.Create(CultureInfo.InvariantCulture, $"package-{load}.json"), id),
            DemoProjectTree.File(string.Create(CultureInfo.InvariantCulture, $"{id}-c-{load}"), "LICENSE", id),
        ];

        for (var i = 0; i < children.Count; i++)
            Items.Insert(index + i, children[i]);

        LogEvent($"Loaded {children.Count} nodes into {id}");
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

internal sealed partial class TreeExamplesController : DemoController
{
    public const string FilesTreeId = "examples-files-tree";

    [RecursiveMember]
    public partial TreeFilesGroupContext FilesGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeLazyGroupContext LazyGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeSettingsGroupContext SettingsGroup { get; set; } = new();

    [UICommand]
    public void OpenNode(string id)
        => FilesGroup.Open(id);

    [UICommand]
    public void RenameNode(string id)
        => FilesGroup.Rename(id);

    /// <summary>A menu entry: rename hands the field back to the client, a new file is added and handed back the same way, a delete is done here.</summary>
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
    public void MoveNode(string id)
        => FilesGroup.Move(id);

    [UICommand]
    public void DeleteNode(string id)
        => FilesGroup.Delete(id);

    [UICommand]
    public void LoadChildren(string id)
        => LazyGroup.Load(id);
}
