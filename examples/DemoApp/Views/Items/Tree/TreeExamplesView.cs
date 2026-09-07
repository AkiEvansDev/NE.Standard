using DemoApp.Controllers.Items.Tree;
using DemoApp.Views.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Items.Tree;

/// <summary>
/// What a tree is used for, one screen per job: a project's files with a menu per kind, folders filled in as they open, and a
/// settings tree whose chosen node is the page's state.
/// </summary>
internal sealed class TreeExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string FilesGroup = nameof(TreeExamplesController.FilesGroup);
    private const string LazyGroup = nameof(TreeExamplesController.LazyGroup);
    private const string SettingsGroup = nameof(TreeExamplesController.SettingsGroup);

    public static string ViewKey => "demo.items.tree.examples";

    protected override string ComponentRoute => "/items/tree";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.items.tree.header";
    protected override string HeaderDescription => "demo.items.tree.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateFilesGroup()],
            [CreateLazyGroup(), CreateSettingsGroup()]
        ));
    }

    /// <summary>
    /// A folder and a file open different menus: the kind names the node template, and the template carries the menu. Enter
    /// opens, a double click, F2 or the menu renames, a drag moves — and every change comes back through the controller.
    /// </summary>
    private static ContainerComponent CreateFilesGroup()
    {
        return DemoUI.CreateGroup(FilesGroup, "A project's files",
            content => content.AddChild(new TreeComponent(TreeExamplesController.FilesTreeId)
                .BindItems($"{FilesGroup}.{nameof(TreeFilesGroupContext.Items)}")
                .SetSelectionMode(UISelectionMode.One)
                .SetRenamable(true)
                .SetRenameOnDoubleClick(true)
                .SetDraggable(true)
                .AddNodeKind(DemoProjectTree.FolderKind, node => node
                    .SetIconColor(UIThemeColor.FromColorVariant(ColorName.Photon, ColorAdjustment.Tint, 2))
                    .SetContextMenu(CreateMenu(
                        new MenuItem { Id = TreeFilesGroupContext.NewFileAction, Title = "New file", Icon = DemoIcons.Outline(DemoIcons.File) },
                        new MenuItem { Id = TreeFilesGroupContext.RenameAction, Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                        new MenuItem { Id = TreeFilesGroupContext.DeleteAction, Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close) }
                    ))
                )
                .AddNodeKind(DemoProjectTree.FileKind, node => node
                    .SetContextMenu(CreateMenu(
                        new MenuItem { Id = TreeFilesGroupContext.RenameAction, Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                        new MenuItem { Id = TreeFilesGroupContext.DeleteAction, Title = "Delete", Icon = DemoIcons.Outline(DemoIcons.Close) }
                    ))
                )
                .OnNodeOpenWithItemKey(nameof(TreeExamplesController.OpenNode))
                .OnNodeRenameWithItemKey(nameof(TreeExamplesController.RenameNode))
                .OnNodeMoveWithItemKey(nameof(TreeExamplesController.MoveNode))
                .OnNodeRemoveWithItemKey(nameof(TreeExamplesController.DeleteNode))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Right-click a folder or a file for its menu; Enter opens; a double click or F2 renames; Delete removes; drag a node onto a folder to move it there, or onto the empty ground below to move it to the root. README.md is pinned: it is neither dragged nor removed."
        );
    }

    /// <summary>The menu's entry names the action; the node the menu was opened on is the entry's parent scope.</summary>
    private static MenuComponent CreateMenu(params MenuItem[] entries)
        => new MenuComponent()
            .SetItems(entries)
            .OnItemClick(nameof(TreeExamplesController.NodeAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TreeNode.Id)));

    /// <summary>
    /// A folder that says it has children and holds none asks the controller when it is opened; the children go in under it.
    /// </summary>
    private static ContainerComponent CreateLazyGroup()
    {
        return DemoUI.CreateGroup(LazyGroup, "Filled in as it opens",
            content => content.AddChild(new TreeComponent()
                .BindItems($"{LazyGroup}.{nameof(TreeLazyGroupContext.Items)}")
                .ConfigureDefaultNode(node => node.SetIconColor(UIThemeColor.FromColorVariant(ColorName.Photon, ColorAdjustment.Tint, 2)))
                .OnNodeUnfoldWithItemKey(nameof(TreeExamplesController.LoadChildren))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Every folder here starts empty and claims children; the first unfold asks the controller, which adds them, and the next folder down does the same."
        );
    }

    /// <summary>
    /// The chosen node is state the page reads: the arrows and a click choose, and the key comes back two-way. A heading refuses
    /// the choice (<c>CanSelect</c> false), so a click on it folds it.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateGroup(null, "Settings as a tree",
            content => content
                .AddChild(new TreeComponent()
                    .BindItems($"{SettingsGroup}.{nameof(TreeSettingsGroupContext.Items)}")
                    .SetSelectionMode(UISelectionMode.One)
                    .BindSelectedKey($"{SettingsGroup}.{nameof(TreeSettingsGroupContext.SelectedKey)}")
                    .SetSelectionStyle(UISelectionStyle.Marked(UISelectionMark.Left))
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new TextComponent()
                    .SetTitle("Chosen")
                    .SetTitleType(UITextAppearance.Overline)
                    .SetTitleColor(UIThemeColor.Muted)
                    .BindDescription($"{SettingsGroup}.{nameof(TreeSettingsGroupContext.SelectedKey)}")
                    .SetMargin(UIThickness.All(0, 8, 0, 0))
                    .SetPlacement(1, 2, 24, 1)
                )
        );
    }
}
