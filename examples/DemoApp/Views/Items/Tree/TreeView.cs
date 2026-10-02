using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.Tree;
using DemoApp.Views.Base;

namespace DemoApp.Views.Items.Tree;

/// <summary>
/// One tree over a bound collection of nodes and every property that can be bound to it; then what a tree is used for: a bucket's
/// objects with a menu per kind, notes opened on a press, a settings tree whose chosen node is the page's state, and folders filled
/// in as they open.
/// </summary>
/// <remarks>
/// The tree is capped at a height it does not fill, so <c>VerticalScroll</c> has something to do. A menu whose entries come with each
/// item is the items view's feed.
/// </remarks>
internal sealed class TreeView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TreeGroup = nameof(TreeController.TreeGroup);
    private const string NodesGroup = nameof(TreeController.NodesGroup);
    private const string BorderGroup = nameof(TreeController.BorderGroup);
    private const string FilesFilterId = "tree-examples-filter";
    private const string FilesGroup = nameof(TreeController.FilesGroup);
    private const string LazyGroup = nameof(TreeController.LazyGroup);
    private const string SettingsGroup = nameof(TreeController.SettingsGroup);
    private const string NotesGroup = nameof(TreeController.NotesGroup);

    public static string ViewKey => "demo.items.tree";

    protected override string ComponentRoute => "/items/tree";
    protected override string Header => "demo.items.tree.header";
    protected override string HeaderDescription => "demo.items.tree.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/files", "demo.nav.screens.files");

    // The tree is named, so the fold a viewer chooses is kept in the browser between visits.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TreeComponent("bucket-objects")
            .BindItems($"{NodesGroup}.{nameof(TreeNodesGroupContext.Items)}")
            // A folder's glyph in the warm yellow of a file list; a file keeps the primary ink.
            .AddNodeKind(DemoStorageTree.FolderKind, node => node.SetIconColor(DemoIcons.Warm))
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSurface($"{TreeGroup}.{nameof(TreeGroupContext.Surface)}")
            .BindIndent($"{TreeGroup}.{nameof(TreeGroupContext.Indent)}")
            .BindRenamable($"{TreeGroup}.{nameof(TreeGroupContext.Renamable)}")
            .BindRenameOnDoubleClick($"{TreeGroup}.{nameof(TreeGroupContext.RenameOnDoubleClick)}")
            .BindRemovable($"{TreeGroup}.{nameof(TreeGroupContext.Removable)}")
            .BindShowFoldChevron($"{TreeGroup}.{nameof(TreeGroupContext.ShowFoldChevron)}")
            .BindRowHoverable($"{TreeGroup}.{nameof(TreeGroupContext.RowHoverable)}")
            .BindVerticalScroll($"{TreeGroup}.{nameof(TreeGroupContext.VerticalScroll)}")
            .BindSelectionMode($"{TreeGroup}.{nameof(TreeGroupContext.SelectionMode)}")
            .BindSelectedKey($"{TreeGroup}.{nameof(TreeGroupContext.SelectedKey)}")
            .BindSelectedKeys($"{TreeGroup}.{nameof(TreeGroupContext.SelectedKeys)}")
            .BindSelectionStyle($"{TreeGroup}.{nameof(TreeGroupContext.SelectionStyle)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetMaxHeight(UILayoutLength.Absolute(260))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 320);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TreeGroup, "Tree", nameof(TreeController.CycleTreeOption)),
            DemoUI.CreateOptionSection(NodesGroup, "Nodes", nameof(TreeController.CycleNodesOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(TreeController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // The bucket beside the two short trees stacked, as tall together; the notes across the page, beside their actions.
        => [CreateFilesGroup(), DemoUI.CreateHalf(CreateSettingsGroup(), CreateLazyGroup()), CreateNotesGroup()];

    /// <summary>
    /// A folder and a file open different menus: the kind names the node template, and the template carries the menu. Enter
    /// opens, a double click, F2 or the menu renames, a drag moves — and every change comes back through the controller. A box
    /// over the tree narrows it the way a list is narrowed, and the sort rules order every folder's children alike.
    /// </summary>
    private static ContainerComponent CreateFilesGroup()
    {
        return DemoUI.CreateExample("A bucket's objects",
            UILayout.Stack(0)
                .AddChild(new TextInputComponent(FilesFilterId)
                    .SetPlaceholder("Filter objects")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetShowClearButton()
                    .SetDebounceMilliseconds(150)
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                )
                .AddChild(new TreeComponent(TreeController.FilesTreeId)
                    .BindItems($"{FilesGroup}.{nameof(TreeFilesGroupContext.Items)}")
                    // A node stays while it or something under it matches, and its folders stand open for as long as the box holds a word.
                    .FilterBy(FilesFilterId, IInputComponent.ValueProperty, nameof(TreeNode.Title))
                    // One order for every folder's children: folders first, then by name — the same whatever a drag or a rename did.
                    .SortBy(nameof(TreeNode.Kind), UIItemsSortDirection.Descending)
                    .SortBy(nameof(TreeNode.Title), UIItemsSortDirection.Ascending, priority: 1)
                    // Many, so several nodes go together: Shift takes a range, Ctrl adds one, and a drag or Delete on a chosen node takes them all.
                    .SetSelectionMode(UISelectionMode.Many)
                    .SetRenamable(true)
                    .SetRenameOnDoubleClick(true)
                    .SetDraggable(true)
                    .AddNodeKind(DemoStorageTree.FolderKind, node => node
                        .SetIconColor(DemoIcons.Warm)
                        // The menu's entry names the action; the node the menu was opened on is the entry's parent scope.
                        .SetContextMenu(new MenuComponent()
                            .SetItems(
                            [
                                new MenuItem { Id = TreeFilesGroupContext.NewFileAction, Title = "New object", Icon = DemoIcons.Outline(DemoIcons.File) },
                                new MenuItem { Id = TreeFilesGroupContext.RenameAction, Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                                new MenuItem { Id = TreeFilesGroupContext.DeleteAction, Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close) }
                            ])
                            .OnItemClick(nameof(TreeController.NodeAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TreeNode.Id)))
                        )
                    )
                    .AddNodeKind(DemoStorageTree.FileKind, node => node
                        .SetContextMenu(new MenuComponent()
                            .SetItems(
                            [
                                new MenuItem { Id = TreeFilesGroupContext.RenameAction, Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                                new MenuItem { Id = TreeFilesGroupContext.DeleteAction, Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close) }
                            ])
                            .OnItemClick(nameof(TreeController.NodeAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TreeNode.Id)))
                        )
                    )
                    .OnNodeOpenWithItemKey(nameof(TreeController.OpenNode))
                    .OnNodeRenameWithItemKey(nameof(TreeController.RenameNode))
                    .OnNodeMoveWithItemKey(nameof(TreeController.MoveNode))
                    .OnNodeRemoveWithItemKey(nameof(TreeController.DeleteNode))
                ),
            note: "Type in the box and only the matching objects stay, under the folders that hold them. Right-click or long-press a folder or an object for its menu; Enter opens; a double click or F2 renames; Delete removes; drag a node onto a folder to move it there (the folder opens under the drag), or onto the empty ground below to move it to the root. Shift and Ctrl choose several, and they drag and delete together. incident-report.md is pinned: it is neither dragged nor removed. Folders sort first and names alphabetically, whatever was dragged where.",
            context: FilesGroup
        );
    }

    /// <summary>
    /// A press on a note runs a command, which opens the note beside the tree and answers with an effect; the selection follows the
    /// press first, as in a list. A folder refuses the choice (<c>CanSelect</c> false), so a press folds it and the chosen row is always
    /// the open note. Emptied, the tree shows its own empty template.
    /// </summary>
    private static ContainerComponent CreateNotesGroup()
    {
        return DemoUI.CreateExample("Opened on a press",
            UILayout.Columns(16,
                new TreeComponent()
                    .BindItems($"{NotesGroup}.{nameof(TreeNotesGroupContext.Items)}")
                    .SetSelectionMode(UISelectionMode.One)
                    .BindSelectedKey($"{NotesGroup}.{nameof(TreeNotesGroupContext.SelectedKey)}")
                    .AddNodeKind(DemoStorageTree.FolderKind, node => node.SetIconColor(DemoIcons.Warm))
                    .ConfigureDefaultEmptyTemplate(empty => empty
                        .SetIcon(DemoIcons.Outline(DemoIcons.FileText))
                        .SetTitle("No notes")
                        .SetDescription("Bring them back from the actions.")
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                    .SetDraggable(true)
                    .OnNodeClickWithItemKey(nameof(TreeController.OpenNote))
                    .OnNodeMoveWithItemKey(nameof(TreeController.MoveNote)),
                new TextComponent()
                    .BindTitle($"{NotesGroup}.{nameof(TreeNotesGroupContext.OpenTitle)}")
                    .AsBody()
                    .BindDescription($"{NotesGroup}.{nameof(TreeNotesGroupContext.OpenText)}")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetWrapMode(UITextWrapMode.Wrap)
            ),
            note: "Press a note: the command opens it beside the tree and its answer shows a notification. A folder is never chosen: a press on it only folds it, so the chosen row is always the open note. Drag a note between two others or onto a folder, or move it with Alt and an arrow — Up and Down among its neighbours, Left out of its folder, Right into the folder above: the move carries the place, and the controller puts it there. Clear the notes and the tree shows its empty template; bring them back and it goes.",
            context: NotesGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Clear the notes"] = nameof(TreeController.ClearNotes),
                ["Bring them back"] = nameof(TreeController.RefillNotes)
            }),
            // Across the page: the tree and the open note keep their room beside the column of controls, which at half the page cut
            // both to a few letters.
            columns: 24
        );
    }

    /// <summary>
    /// The chosen node is state the page reads: the arrows and a click choose, and the key comes back two-way. A heading refuses
    /// the choice (<c>CanSelect</c> false), so a click on it folds it.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateExample("Settings as a tree",
            UILayout.Stack(0)
                .AddChild(new TreeComponent()
                    .BindItems($"{SettingsGroup}.{nameof(TreeSettingsGroupContext.Items)}")
                    .SetSelectionMode(UISelectionMode.One)
                    .BindSelectedKey($"{SettingsGroup}.{nameof(TreeSettingsGroupContext.SelectedKey)}")
                    .SetSelectionStyle(UISelectionStyle.Marked(UISelectionMark.Left))
                )
                .AddChild(UIText.Label("Chosen")
                    .BindDescription($"{SettingsGroup}.{nameof(TreeSettingsGroupContext.SelectedKey)}")
                    .SetMargin(UIThickness.All(0, 8, 0, 0))
                )
        );
    }

    /// <summary>
    /// A folder that says it has children and holds none asks the controller when it is opened; the children go in under it.
    /// </summary>
    private static ContainerComponent CreateLazyGroup()
    {
        return DemoUI.CreateExample("Filled in as it opens",
            new TreeComponent()
                .BindItems($"{LazyGroup}.{nameof(TreeLazyGroupContext.Items)}")
                .ConfigureDefaultNode(node => node.SetIconColor(DemoIcons.Warm))
                .OnNodeUnfoldWithItemKey(nameof(TreeController.LoadChildren)),
            note: "Every folder here starts empty and claims children; the first unfold asks the controller, which adds them, and the next folder down does the same.",
            context: LazyGroup
        );
    }
}
