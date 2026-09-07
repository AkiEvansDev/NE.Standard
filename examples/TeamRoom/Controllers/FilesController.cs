using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
using TeamRoom.Data;
using TeamRoom.Services;

namespace TeamRoom.Controllers;

/// <summary>A file open in the editor: its text as the tab holds it, and whether that differs from what is saved.</summary>
public sealed partial class DocumentTab : TabItem
{
    [RecursiveMember]
    public partial string? Body { get; set; }

    [RecursiveMember]
    public partial bool Dirty { get; set; }

    [RecursiveMember]
    public partial string Status { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public string SavedBody { get; set; } = string.Empty;
}

/// <summary>
/// The folder tree on the left, the open files on the right. An administrator shapes the tree and writes the files; a member reads.
/// </summary>
public sealed partial class FilesController : TeamRoomController
{
    public const string TreeId = "files-tree";
    public const string TabsId = "files-tabs";
    public const string NewFolderAction = "new-folder";
    public const string NewFileAction = "new-file";
    public const string RenameAction = "rename";
    public const string DeleteAction = "delete";

    [RecursiveMember(false)]
    public RecursiveCollection<TreeNode> Nodes { get; } = [];

    [RecursiveMember(false)]
    public RecursiveCollection<DocumentTab> Documents { get; } = [];

    [RecursiveMember]
    public partial string? SelectedNodeKey { get; set; }

    [RecursiveMember]
    public partial string? SelectedDocumentKey { get; set; }

    protected override Task OnAccountReadyAsync(CancellationToken cancellationToken)
    {
        LoadTree();

        return Task.CompletedTask;
    }

    /// <summary>Rebuilds the tree from the database, keeping every fold and the selection where they were.</summary>
    private void LoadTree()
    {
        Dictionary<string, bool?> folds = new(StringComparer.Ordinal);

        foreach (TreeNode node in Nodes)
            folds[node.Id] = node.Expanded;

        Nodes.Clear();

        foreach (NodeRecord record in DocumentStore.ListInWalkingOrder())
        {
            var folder = record.Kind == NodeKinds.Folder;

            Nodes.Add(new TreeNode
            {
                Id = record.Id,
                ParentId = record.ParentId,
                Title = record.Name,
                Kind = record.Kind,
                Icon = AppIcons.Outline(folder ? AppIcons.Folder : AppIcons.File),
                Expanded = folder ? folds.GetValueOrDefault(record.Id, true) : null,
                // A member sees the tree and may not touch it: the abilities are the row's, so the tree itself stays one component.
                CanDrag = IsAdmin ? null : false,
                CanRemove = IsAdmin ? null : false,
                CanRename = IsAdmin ? null : false,
                CanShowContextMenu = IsAdmin ? null : false
            });
        }

        foreach (DocumentTab document in Documents)
        {
            TreeNode? node = FindNode(document.Id);

            if (node is null)
                _ = Documents.Remove(document);
            else
                document.Title = node.Title;
        }
    }

    private TreeNode? FindNode(string id)
    {
        foreach (TreeNode node in Nodes)
        {
            if (node.Id == id)
                return node;
        }

        return null;
    }

    protected override void OnAppEvent(AppEvent appEvent)
    {
        if (appEvent is DocumentsChanged changed)
            Push(() => Reload(changed.NodeId));
    }

    /// <summary>Another page changed the tree or a file: the tree is re-read, and an open, unchanged copy of that file follows the save.</summary>
    private void Reload(string? nodeId)
    {
        LoadTree();

        if (nodeId is null || FindDocument(nodeId) is not { } document)
            return;

        var content = DocumentStore.ReadContent(nodeId);

        if (content is null || document.Dirty)
            return;

        document.SavedBody = content;
        document.Body = content;
    }

    private DocumentTab? FindDocument(string id)
    {
        foreach (DocumentTab document in Documents)
        {
            if (document.Id == id)
                return document;
        }

        return null;
    }

    /// <summary>The editor's text moved: the tab knows whether it still matches what is saved.</summary>
    protected override void OnNotify(RecursiveChange change)
    {
        base.OnNotify(change);

        ArgumentNullException.ThrowIfNull(change);

        RecursivePath path = change.Path;

        if (path.Count == 3
            && path[0].Kind == PathSegmentKind.Property && path[0].Property == nameof(Documents)
            && path[1].Kind == PathSegmentKind.Key
            && path[2].Kind == PathSegmentKind.Property && path[2].Property == nameof(DocumentTab.Body)
            && FindDocument(path[1].Key) is { } document)
        {
            document.Dirty = !string.Equals(document.Body ?? string.Empty, document.SavedBody, StringComparison.Ordinal);
            document.Status = document.Dirty ? "Unsaved changes" : string.Empty;
        }
    }

    [UICommand]
    public UICommandResult OpenNode(string id)
    {
        TreeNode? node = FindNode(id);

        if (node is null || node.Kind != NodeKinds.File)
            return UICommandResult.Ok();

        if (FindDocument(id) is null)
        {
            var content = DocumentStore.ReadContent(id) ?? string.Empty;
            var order = 1d;

            foreach (DocumentTab open in Documents)
                order = Math.Max(order, (open.Order ?? 0) + 1);

            Documents.Add(new DocumentTab
            {
                Id = id,
                Title = node.Title,
                Icon = AppIcons.Outline(AppIcons.File),
                Order = order,
                Body = content,
                SavedBody = content,
                CanRename = false
            });
        }

        SelectedDocumentKey = id;

        return UICommandResult.Ok();
    }

    /// <summary>The tree already wrote the new title through its binding; the database is told, or the title is put back.</summary>
    [UICommand]
    public UICommandResult RenameNode(string id)
    {
        TreeNode? node = FindNode(id);

        if (node is null)
            return UICommandResult.Ok();

        if (!IsAdmin)
        {
            LoadTree();
            return Refuse("Only an administrator renames.");
        }

        var error = DocumentStore.Rename(id, node.Title ?? string.Empty);

        if (error is not null)
        {
            LoadTree();
            return Refuse(error);
        }

        if (FindDocument(id) is { } document)
            document.Title = node.Title;

        return UICommandResult.Ok();
    }

    /// <summary>A drop names where the node landed: a file stands for its folder, and the database decides the rest.</summary>
    [UICommand]
    public UICommandResult MoveNode(string id)
    {
        TreeNode? node = FindNode(id);

        if (node is null)
            return UICommandResult.Ok();

        var target = node.DropTarget;
        node.DropTarget = null;

        if (!IsAdmin)
            return Refuse("Only an administrator moves files.");

        TreeNode? folder = string.IsNullOrEmpty(target) ? null : FindNode(target);

        if (folder is not null && folder.Kind != NodeKinds.Folder)
            folder = folder.ParentId is null ? null : FindNode(folder.ParentId);

        if (folder?.Id == node.ParentId)
            return UICommandResult.Ok();

        var error = DocumentStore.Move(id, folder?.Id);

        return error is null ? UICommandResult.Ok() : Refuse(error);
    }

    [UICommand]
    public UICommandResult DeleteNode(string id)
    {
        if (!IsAdmin)
            return Refuse("Only an administrator deletes.");

        if (FindNode(id) is null)
            return UICommandResult.Ok();

        DocumentStore.Delete(id);

        return UICommandResult.Ok();
    }

    /// <summary>The node's own menu: a new node lands in the folder and opens for its name; the rest are the tree's own gestures.</summary>
    [UICommand]
    public UICommandResult NodeAction(string action, string id)
    {
        if (!IsAdmin)
            return Refuse("Only an administrator changes the tree.");

        TreeNode? node = FindNode(id);

        if (node is null)
            return UICommandResult.Ok();

        switch (action)
        {
            case RenameAction:
                return UICommandResult.Ok([new RenameNodeEffect(TreeId, id)]);

            case DeleteAction:
                return DeleteNode(id);

            case NewFolderAction or NewFileAction:
                var parent = node.Kind == NodeKinds.Folder ? node.Id : node.ParentId;
                return Create(parent, action == NewFolderAction ? NodeKinds.Folder : NodeKinds.File);

            default:
                return UICommandResult.Ok();
        }
    }

    /// <summary>The toolbar's two buttons: a new node at the root, or in the selected folder.</summary>
    [UICommand]
    public UICommandResult RootAction(string action)
    {
        if (!IsAdmin)
            return Refuse("Only an administrator changes the tree.");

        TreeNode? selected = SelectedNodeKey is null ? null : FindNode(SelectedNodeKey);
        var parent = selected is null ? null : selected.Kind == NodeKinds.Folder ? selected.Id : selected.ParentId;

        return Create(parent, action == NewFolderAction ? NodeKinds.Folder : NodeKinds.File);
    }

    private UICommandResult Create(string? parentId, string kind)
    {
        var name = kind == NodeKinds.Folder ? NextName("New folder") : NextName("New file.txt");
        var error = DocumentStore.Create(parentId, kind, name, AccountId, out var id);

        if (error is not null)
            return Refuse(error);

        // The event already rebuilt the tree on every page, this one included, before the command returns.
        LoadTree();

        if (FindNode(parentId ?? string.Empty) is { } parent)
            parent.Expanded = true;

        SelectedNodeKey = id;

        return UICommandResult.Ok([new RenameNodeEffect(TreeId, id)]);
    }

    private string NextName(string stem)
    {
        HashSet<string> taken = new(StringComparer.OrdinalIgnoreCase);

        foreach (TreeNode node in Nodes)
        {
            if (node.Title is not null)
                _ = taken.Add(node.Title);
        }

        if (!taken.Contains(stem))
            return stem;

        var extension = System.IO.Path.GetExtension(stem);
        var bare = stem[..^extension.Length];

        for (var i = 2; ; i++)
        {
            var candidate = string.Create(CultureInfo.InvariantCulture, $"{bare} {i}{extension}");

            if (!taken.Contains(candidate))
                return candidate;
        }
    }

    [UICommand]
    public UICommandResult SaveDocument(string id)
    {
        DocumentTab? document = FindDocument(id);

        if (document is null)
            return UICommandResult.Ok();

        if (!IsAdmin)
            return Refuse("Only an administrator writes files.");

        var body = document.Body ?? string.Empty;

        DocumentStore.SaveContent(id, body, AccountId);
        document.SavedBody = body;
        document.Dirty = false;
        document.Status = $"Saved at {DateTime.Now.ToString("HH:mm", CultureInfo.InvariantCulture)}";

        return UICommandResult.Ok();
    }

    [UICommand]
    public UICommandResult CloseDocument(string id)
    {
        DocumentTab? document = FindDocument(id);

        if (document is null)
            return UICommandResult.Ok();

        var index = Documents.IndexOf(document);

        _ = Documents.Remove(document);

        // The strip would fall back to its first tab; the neighbour is what a reader expects.
        if (SelectedDocumentKey == id)
            SelectedDocumentKey = Documents.Count == 0 ? null : Documents[Math.Min(index, Documents.Count - 1)].Id;

        return document.Dirty ? Notify($"Closed {document.Title} without saving.", UIColorStyle.Warning) : UICommandResult.Ok();
    }
}
