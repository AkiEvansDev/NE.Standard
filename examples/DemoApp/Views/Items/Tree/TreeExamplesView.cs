using DemoApp.Controllers.Items.Tree;
using DemoApp.Views.Base;
using NE.Colors;

namespace DemoApp.Views.Items.Tree;

/// <summary>
/// What a tree is used for, one screen per job: a bucket's objects with a menu per kind, folders filled in as they open, and a
/// settings tree whose chosen node is the page's state.
/// </summary>
internal sealed class TreeExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string FilesFilterId = "tree-examples-filter";
    private const string FilesGroup = nameof(TreeExamplesController.FilesGroup);
    private const string MenuGroup = nameof(TreeExamplesController.MenuGroup);
    private const string LazyGroup = nameof(TreeExamplesController.LazyGroup);
    private const string SettingsGroup = nameof(TreeExamplesController.SettingsGroup);

    public static string ViewKey => "demo.items.tree.examples";

    protected override string ComponentRoute => "/items/tree";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.items.tree.header";
    protected override string HeaderDescription => "demo.items.tree.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreateFilesGroup()], [CreateSettingsGroup(), CreateMenuGroup()]));

        _ = container.AddChild(CreateLazyGroup());
    }

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
                .AddChild(new TreeComponent(TreeExamplesController.FilesTreeId)
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
                        .SetIconColor(UIThemeColor.FromColorVariant(ColorName.Photon, ColorAdjustment.Tint, 2))
                        // The menu's entry names the action; the node the menu was opened on is the entry's parent scope.
                        .SetContextMenu(new MenuComponent()
                            .SetItems(
                            [
                                new MenuItem { Id = TreeFilesGroupContext.NewFileAction, Title = "New object", Icon = DemoIcons.Outline(DemoIcons.File) },
                                new MenuItem { Id = TreeFilesGroupContext.RenameAction, Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                                new MenuItem { Id = TreeFilesGroupContext.DeleteAction, Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close) }
                            ])
                            .OnItemClick(nameof(TreeExamplesController.NodeAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TreeNode.Id)))
                        )
                    )
                    .AddNodeKind(DemoStorageTree.FileKind, node => node
                        .SetContextMenu(new MenuComponent()
                            .SetItems(
                            [
                                new MenuItem { Id = TreeFilesGroupContext.RenameAction, Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                                new MenuItem { Id = TreeFilesGroupContext.DeleteAction, Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close) }
                            ])
                            .OnItemClick(nameof(TreeExamplesController.NodeAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TreeNode.Id)))
                        )
                    )
                    .OnNodeOpenWithItemKey(nameof(TreeExamplesController.OpenNode))
                    .OnNodeRenameWithItemKey(nameof(TreeExamplesController.RenameNode))
                    .OnNodeMoveWithItemKey(nameof(TreeExamplesController.MoveNode))
                    .OnNodeRemoveWithItemKey(nameof(TreeExamplesController.DeleteNode))
                ),
            note: "Type in the box and only the matching objects stay, under the folders that hold them. Right-click a folder or an object for its menu; Enter opens; a double click or F2 renames; Delete removes; drag a node onto a folder to move it there (the folder opens under the drag), or onto the empty ground below to move it to the root. Shift and Ctrl choose several, and they drag and delete together. incident-report.md is pinned: it is neither dragged nor removed. Folders sort first and names alphabetically, whatever was dragged where.",
            context: FilesGroup
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
    /// The other way to a menu: the entries come with the node. One template, one menu bound to each node's own list, and the
    /// press names the entry and the node it was opened on.
    /// </summary>
    private static ContainerComponent CreateMenuGroup()
    {
        return DemoUI.CreateExample("A menu the node names",
            new TreeComponent()
                .BindItems($"{MenuGroup}.{nameof(TreeMenuGroupContext.Items)}")
                .ConfigureDefaultNode(node => node
                    .SetIconColor(UIThemeColor.FromColorVariant(ColorName.Photon, ColorAdjustment.Tint, 2))
                    .SetContextMenu(new MenuComponent()
                        .BindItems(nameof(DemoActionNode.Actions), UIBindingScope.Relative)
                        .OnItemClick(nameof(TreeExamplesController.NodeMenuAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TreeNode.Id)))
                    )
                ),
            note: "Right-click any node: Production cannot be deleted, a paused environment offers Resume, and the entry pressed reaches the controller with the node's key. Two nodes of one kind, two different menus — the list is the item's.",
            context: MenuGroup
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
                .ConfigureDefaultNode(node => node.SetIconColor(UIThemeColor.FromColorVariant(ColorName.Photon, ColorAdjustment.Tint, 2)))
                .OnNodeUnfoldWithItemKey(nameof(TreeExamplesController.LoadChildren)),
            columns: 24,
            note: "Every folder here starts empty and claims children; the first unfold asks the controller, which adds them, and the next folder down does the same.",
            context: LazyGroup
        );
    }
}
