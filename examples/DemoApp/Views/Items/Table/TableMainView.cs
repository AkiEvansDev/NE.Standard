using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.Table;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Items.Table;

/// <summary>
/// One table over a bound collection, and every property that can be bound to it.
/// </summary>
/// <remarks>The table is capped at a height it does not fill, so <c>VerticalScroll</c> has something to do.</remarks>
internal sealed class TableMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TableGroup = nameof(TableMainController.TableGroup);
    private const string ItemsGroup = nameof(TableMainController.ItemsGroup);
    private const string BorderGroup = nameof(TableMainController.BorderGroup);

    public static string ViewKey => "demo.items.table.main";

    protected override string ComponentRoute => "/items/table";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.items.table.header";
    protected override string HeaderDescription => "demo.items.table.description";

    // The table is named, so the widths a viewer drags are kept in the browser between visits.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TableComponent("deployments")
            .BindItems($"{ItemsGroup}.{nameof(TableRowsGroupContext.Items)}")
            .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
            .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
            .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(110), UITextAlignment.End)
            .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(120))
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSurface($"{TableGroup}.{nameof(TableGroupContext.Surface)}")
            .BindShowHeader($"{TableGroup}.{nameof(TableGroupContext.ShowHeader)}")
            .BindStriped($"{TableGroup}.{nameof(TableGroupContext.Striped)}")
            .BindShowColumnSeparators($"{TableGroup}.{nameof(TableGroupContext.ShowColumnSeparators)}")
            .BindShowRowSeparators($"{TableGroup}.{nameof(TableGroupContext.ShowRowSeparators)}")
            .BindRowHoverable($"{TableGroup}.{nameof(TableGroupContext.RowHoverable)}")
            .BindResizableColumns($"{TableGroup}.{nameof(TableGroupContext.ResizableColumns)}")
            .BindVerticalScroll($"{TableGroup}.{nameof(TableGroupContext.VerticalScroll)}")
            .BindSelectionMode($"{TableGroup}.{nameof(TableGroupContext.SelectionMode)}")
            .BindSelectedKey($"{TableGroup}.{nameof(TableGroupContext.SelectedKey)}")
            .BindSelectedKeys($"{TableGroup}.{nameof(TableGroupContext.SelectedKeys)}")
            .BindSelectionStyle($"{TableGroup}.{nameof(TableGroupContext.SelectionStyle)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetMaxHeight(UILayoutLength.Absolute(240))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 320);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TableGroup, "Table", nameof(TableMainController.CycleTableOption)),
            DemoUI.CreateOptionSection(ItemsGroup, "Rows", nameof(TableMainController.CycleItemsOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(TableMainController.CycleBorderOption))
        );
}
