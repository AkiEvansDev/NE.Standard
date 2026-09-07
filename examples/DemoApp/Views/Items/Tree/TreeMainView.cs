using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.Tree;
using DemoApp.Views.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Items.Tree;

/// <summary>
/// One tree over a bound collection of nodes, and every property that can be bound to it.
/// </summary>
/// <remarks>The tree is capped at a height it does not fill, so <c>VerticalScroll</c> has something to do.</remarks>
internal sealed class TreeMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TreeGroup = nameof(TreeMainController.TreeGroup);
    private const string NodesGroup = nameof(TreeMainController.NodesGroup);
    private const string BorderGroup = nameof(TreeMainController.BorderGroup);

    public static string ViewKey => "demo.items.tree.main";

    protected override string ComponentRoute => "/items/tree";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.items.tree.header";
    protected override string HeaderDescription => "demo.items.tree.description";

    // The tree is named, so the fold a viewer chooses is kept in the browser between visits.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TreeComponent("project-files")
            .BindItems($"{NodesGroup}.{nameof(TreeNodesGroupContext.Items)}")
            // A folder's glyph in the warm yellow of a file list; a file keeps the primary ink.
            .AddNodeKind(DemoProjectTree.FolderKind, node => node.SetIconColor(UIThemeColor.FromColorVariant(ColorName.Photon, ColorAdjustment.Tint, 2)))
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
            DemoUI.CreateOptionSection(TreeGroup, "Tree", nameof(TreeMainController.CycleTreeOption)),
            DemoUI.CreateOptionSection(NodesGroup, "Nodes", nameof(TreeMainController.CycleNodesOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(TreeMainController.CycleBorderOption))
        );
}
