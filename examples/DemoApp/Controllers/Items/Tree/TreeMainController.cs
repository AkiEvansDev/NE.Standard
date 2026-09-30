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

    public static TreeNode Folder(string id, string title, string? parentId, bool expanded = true)
        => new() { Id = id, Title = title, ParentId = parentId, Kind = FolderKind, IsFolder = true, Icon = DemoIcons.Outline(DemoIcons.Folder), Expanded = expanded };

    public static TreeNode File(string id, string title, string? parentId)
        => new() { Id = id, Title = title, ParentId = parentId, Kind = FileKind, Icon = DemoIcons.Outline(DemoIcons.FileText) };

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
            new() { Id = "incident-report", Title = "incident-report.md", Kind = FileKind, Icon = DemoIcons.Outline(DemoIcons.FileText), CanDrag = false, CanRemove = false },
        ];
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
            if (Items[i].Id == "backups" || IsUnder(Items[i], "backups"))
                index = i + 1;
        }

        Items.Insert(index, DemoStorageTree.File(id, string.Create(CultureInfo.InvariantCulture, $"snapshot-{_added}.tar.gz"), "backups"));
    }

    private bool IsUnder(TreeNode node, string ancestorId)
    {
        for (var parentId = node.ParentId; parentId is not null;)
        {
            if (parentId == ancestorId)
                return true;

            TreeNode? parent = null;

            for (var i = 0; i < Items.Count; i++)
            {
                if (Items[i].Id == parentId)
                    parent = Items[i];
            }

            parentId = parent?.ParentId;
        }

        return false;
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

        node.Title = node.Title?.EndsWith('*') == true ? node.Title.TrimEnd('*') : $"{node.Title}*";
    }
}

internal sealed partial class TreeMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial TreeGroupContext TreeGroup { get; set; } = new();

    [RecursiveMember]
    public partial TreeNodesGroupContext NodesGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleTreeOption(string id)
        => TreeGroup.CycleOption(id);

    [UICommand]
    public void CycleNodesOption(string id)
        => NodesGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
