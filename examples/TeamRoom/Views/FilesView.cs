using TeamRoom.Controllers;
using TeamRoom.Data;

namespace TeamRoom.Views;

/// <summary>
/// Two panes with a splitter between: the tree, and the files open from it.
/// </summary>
public sealed class FilesView : TeamRoomView, IUIViewDefinition
{
    public static string ViewKey => "teamroom.files";

    protected override string PageTitle => "Files";

    protected override string PageDescription => "What the team keeps written down.";

    // Side by side from the medium width up, where the shell's sides stop folding into drawers; below it one above the other, the
    // tree as tall as its rows and the editor taking the page's width and the height left, with no splitter to drag.
    protected override IVisualComponent CreatePage()
        => new ContainerComponent("files-panes")
            .SetColumn(1, UIGridUnit.Absolute(280, min: 200, max: 520))
            .SetColumn(2, UIGridUnit.Auto())
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetOverflow(UIOverflow.Hidden)
            .SetHeight(UILayoutLength.Fill())
            .AddChild(CreateTreePane().SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 1, 2)))
            .AddChild(new GridSplitterComponent()
                .SetVisibility(UIResponsive<UIVisibility>.Create(UIVisibility.Collapsed, md: UIVisibility.Visible))
                .SetPlacement(2, 1, 1, 2)
            )
            .AddChild(CreateEditorPane().SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(3, 1, 22, 2)));

    private static StackPanelComponent CreateTreePane()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(8)
            .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 0, 0, 8), md: UIThickness.All(0, 0, 8, 0)))
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(4)
                .BindVisibility(nameof(TeamRoomController.AdminVisibility))
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetIcon(AppIcons.Outline(AppIcons.NewFolder))
                    .SetTitle("Folder")
                    .OnClick(nameof(FilesController.RootAction), UIAction.Arg("action", FilesController.NewFolderAction))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetIcon(AppIcons.Outline(AppIcons.NewFile))
                    .SetTitle("File")
                    .OnClick(nameof(FilesController.RootAction), UIAction.Arg("action", FilesController.NewFileAction))
                )
            )
            .AddChild(new TreeComponent(FilesController.TreeId)
                .BindItems(nameof(FilesController.Nodes))
                .SetSelectionMode(UISelectionMode.One)
                .BindSelectedKey(nameof(FilesController.SelectedNodeKey))
                .SetRenamable(true)
                .SetDraggable(true)
                .SetRowHoverable(true)
                .AddNodeKind(NodeKinds.Folder, static node => node
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                    .SetContextMenu(CreateNodeMenu(
                        new MenuItem { Id = FilesController.NewFolderAction, Title = "New folder", Icon = AppIcons.Outline(AppIcons.NewFolder) },
                        new MenuItem { Id = FilesController.NewFileAction, Title = "New file", Icon = AppIcons.Outline(AppIcons.NewFile) },
                        new MenuItem { Id = "rule", Kind = UIMenuItemKind.Separator },
                        new MenuItem { Id = FilesController.RenameAction, Title = "Rename", Icon = AppIcons.Outline(AppIcons.Rename) },
                        new MenuItem { Id = FilesController.DeleteAction, Title = "Delete", Icon = AppIcons.Outline(AppIcons.Delete) }
                        )
                    )
                )
                .AddNodeKind(NodeKinds.File, static node => node
                    .SetContextMenu(CreateNodeMenu(
                        new MenuItem { Id = FilesController.RenameAction, Title = "Rename", Icon = AppIcons.Outline(AppIcons.Rename) },
                        new MenuItem { Id = FilesController.DeleteAction, Title = "Delete", Icon = AppIcons.Outline(AppIcons.Delete) }
                        )
                    )
                )
                .OnNodeOpenWithItemKey(nameof(FilesController.OpenNode))
                .OnNodeRenameWithItemKey(nameof(FilesController.RenameNode))
                .OnNodeMoveWithItemKey(nameof(FilesController.MoveNode))
                .OnNodeRemoveWithItemKey(nameof(FilesController.DeleteNode))
            );

    /// <summary>The entry's key is the action, the node's key comes from the row the menu opened on.</summary>
    private static MenuComponent CreateNodeMenu(params MenuItem[] entries)
        => new MenuComponent()
            .SetItems(entries)
            .OnItemClick(nameof(FilesController.NodeAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TreeNode.Id)));

    private static TabsViewComponent CreateEditorPane()
        => new TabsViewComponent(FilesController.TabsId)
            .BindItems(nameof(FilesController.Documents))
            .BindSelectedKey(nameof(FilesController.SelectedDocumentKey))
            .SetDraggable(true)
            .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.Uniform(0), md: UIThickness.All(8, 0, 0, 0)))
            .OnItemRemove(nameof(FilesController.CloseDocument))
            // A row for the toolbar and a star row for the editor, so the text reaches the bottom of the pane rather than stopping at a
            // row count with the page's own ground under it.
            .SetPageTemplate(new ContainerComponent()
                .SetRow(1, UIGridUnit.Auto())
                .AddRow(UIGridUnit.Star())
                .SetPadding(UIThickness.All(0, 8, 0, 0))
                .SetHeight(UILayoutLength.Fill())
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(12)
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                    .SetPlacement(1, 1, 24, 1)
                    .BindVisibility(nameof(TeamRoomController.AdminVisibility))
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetSize(UIButtonSize.Small)
                        .SetIcon(AppIcons.Outline(AppIcons.Save))
                        .SetTitle("Save")
                        .BindEnabled(nameof(DocumentTab.Dirty), UIBindingScope.Relative)
                        .OnClick(nameof(FilesController.SaveDocument), UIAction.ArgCurrentItemKey("id"))
                    )
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(DocumentTab.Status), UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
                // The code field: highlighted by the file's extension, committed as the author types, Ctrl+S saves — the same command the
                // button runs. Ghost, the package's own default: the editor is the page here, not a box standing on it.
                .AddChild(new CodeInputComponent()
                    .BindValue(nameof(DocumentTab.Body), UIBindingScope.Relative)
                    .BindLanguage(nameof(DocumentTab.Language), UIBindingScope.Relative)
                    .BindIsReadOnly(nameof(TeamRoomController.IsReader))
                    .SetDebounceMilliseconds(400)
                    .SetHeight(UILayoutLength.Fill())
                    .OnSave(nameof(FilesController.SaveDocument), UIAction.ArgCurrentItemKey("id"))
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                    .SetPlacement(1, 2, 24, 1)
                )
            );
}
