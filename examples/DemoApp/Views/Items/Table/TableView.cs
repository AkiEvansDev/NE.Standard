using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.Table;
using DemoApp.Views.Base;

namespace DemoApp.Views.Items.Table;

/// <summary>
/// One table over a bound collection and every property that can be bound to it; then what a table is used for: a column per kind
/// of cell, chosen rows that open, rows put in order by a grip, and a list in a cell.
/// </summary>
/// <remarks>
/// The table is capped at a height it does not fill, so <c>VerticalScroll</c> has something to do. Most examples share one column set
/// on purpose, so what differs between them is the behaviour and never the table. A filter is the items view's, a table in a card the
/// card's, and a hundred thousand rows the large lists'.
/// </remarks>
internal sealed class TableView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TableGroup = nameof(TableController.TableGroup);
    private const string ItemsGroup = nameof(TableController.ItemsGroup);
    private const string BorderGroup = nameof(TableController.BorderGroup);
    private const string ActionGroup = nameof(TableController.ActionGroup);
    private const string ChosenGroup = nameof(TableController.ChosenGroup);
    private const string PressedGroup = nameof(TableController.PressedGroup);
    private const string GripGroup = nameof(TableController.GripGroup);

    public static string ViewKey => "demo.items.table";

    protected override string ComponentRoute => "/items/table";
    protected override string Header => "demo.items.table.header";
    protected override string HeaderDescription => "demo.items.table.description";
    protected override (string Route, string Label)? ComposedIn => ("/mechanisms/lists", "demo.nav.mechanisms.lists");

    // The table is named, so the widths a viewer drags are kept in the browser between visits.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TableComponent("deployments")
            .BindItems($"{ItemsGroup}.{nameof(TableRowsGroupContext.Items)}")
            .AddTextColumn("Service", nameof(DemoDeploymentRow.Service), UIGridUnit.Auto(min: 112))
            .AddTextColumn("Region", nameof(DemoDeploymentRow.Region), UIGridUnit.Auto(min: 88))
            .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(110), UITextAlignment.End)
            .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(120))
            // Sideways on a phone, rather than the name and the region squeezed to nothing beside the two fixed columns.
            .SetHorizontalScroll(UIScrollMode.Auto)
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
            .BindDraggable($"{TableGroup}.{nameof(TableGroupContext.Draggable)}")
            .BindDragHandle($"{TableGroup}.{nameof(TableGroupContext.DragHandle)}")
            .BindDragHandlePlacement($"{TableGroup}.{nameof(TableGroupContext.DragHandlePlacement)}")
            .OnRowMoveWithItemKey(nameof(TableController.MoveRow))
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetMaxHeight(UILayoutLength.Absolute(240))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 320);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TableGroup, "Table", nameof(TableController.CycleTableOption)),
            DemoUI.CreateOptionSection(ItemsGroup, "Rows", nameof(TableController.CycleItemsOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(TableController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // Two stacks of two, as tall as each other: in pairs, each short table left a hole beside the tall one next to it.
        => [DemoUI.CreateHalf(CreateColumnKindsGroup(), CreateCellListGroup()), DemoUI.CreateHalf(CreateChosenGroup(), CreatePressedGroup(), CreateGripGroup())];

    /// <summary>
    /// A column is any template bound to the row: a glyph, words, a number against the right edge, a badge, a button; a caption may wear
    /// an icon of its own.
    /// </summary>
    private static ContainerComponent CreateColumnKindsGroup()
    {
        return DemoUI.CreateExample("A column per kind of cell",
            new TableComponent()
                .SetHorizontalScroll(UIScrollMode.Auto)
                .SetItems(DemoDeploymentRow.CreateDeployments())
                .AddColumn("", new TextComponent()
                    .BindIcon(nameof(DemoDeploymentRow.Icon), UIBindingScope.Relative)
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Primary)),
                    UIGridUnit.Absolute(48), UITextAlignment.Center
                )
                .AddTextColumn("Service", nameof(DemoDeploymentRow.Service), icon: DemoIcons.Outline(DemoIcons.Server))
                .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(120), UITextAlignment.End, icon: DemoIcons.Outline(DemoIcons.Replicas))
                .AddColumn("Status", new TextComponent()
                    .BindBadgeText(nameof(DemoDeploymentRow.Status), UIBindingScope.Relative)
                    .BindBadgeStyle(nameof(DemoDeploymentRow.StatusStyle), UIBindingScope.Relative),
                    UIGridUnit.Absolute(120)
                )
                // The button's click is its own, never the row's: a control inside a row keeps its press.
                .AddColumn("", new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                    .SetTooltip("Restart")
                    .OnClick(nameof(TableController.RestartRow), UIAction.ArgCurrentItemKey("id")),
                    UIGridUnit.Absolute(56), UITextAlignment.End
                )
                .SetShowColumnSeparators(true),
            note: "The icons are the columns' own (`icon:`), drawn before the caption.",
            context: ActionGroup
        );
    }

    /// <summary>
    /// Rows chosen with the items view's vocabulary: a mark on the left names the chosen ones, and any number may be chosen. A row is also
    /// the control that opens it, so the pointer's wash says so; striped as well, since that is the pair most tables are built from.
    /// </summary>
    private static ContainerComponent CreateChosenGroup()
    {
        return DemoUI.CreateExample("Chosen rows",
            new TableComponent()
                .SetHorizontalScroll(UIScrollMode.Auto)
                .SetItems(DemoDeploymentRow.CreateDeployments().GetRange(0, 6))
                .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
                .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(96), UITextAlignment.End)
                .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110))
                .SetSelectionMode(UISelectionMode.Many)
                .SetSelectedKeys(["panel", "status-page"])
                .SetSelectionStyle(UISelectionStyle.Marked(UISelectionMark.Left))
                .SetRowHoverable(true)
                .SetStriped(true)
                // The row Enter and a double click open, so the group's line says which one that was and what stayed chosen.
                .OnRowOpenWithItemKey(nameof(TableController.OpenChosenRow)),
            note: "Ctrl and Shift choose as a file manager's rows do. Enter or a double click opens the row and leaves the group chosen; the pointer's wash answers on a striped row too.",
            context: ChosenGroup
        );
    }

    /// <summary>
    /// Rows that do something on a press without being chosen: a grid to a reader, one stop of the Tab order, Enter or Space on the
    /// keyboard's row running the row's click as the pointer's press does.
    /// </summary>
    private static ContainerComponent CreatePressedGroup()
    {
        return DemoUI.CreateExample("Rows that open on a press",
            new TableComponent()
                .SetHorizontalScroll(UIScrollMode.Auto)
                .SetItems(DemoDeploymentRow.CreateDeployments().GetRange(0, 5))
                .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
                .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(96), UITextAlignment.End)
                .SetRowHoverable(true)
                .SetResizableColumns(true)
                .OnRowClickWithItemKey(nameof(TableController.OpenPressedRow)),
            note: "Nothing is chosen here: a click on a row, or Enter or Space on the keyboard's cell, runs the row's click. The table is one stop of the Tab order and a grid to the keyboard: the arrows walk its cells, Home and End the row's ends, Ctrl+Home and Ctrl+End the first and last row, Page Up and Page Down a page; Up from the first row goes to the caption of the cell's column, where Shift with Left or Right sizes a column, and Down comes back.",
            context: PressedGroup
        );
    }

    /// <summary>
    /// The same rows moved by a grip in a narrow column before the first (<c>DragHandle</c> at the start), which stays with the pinned
    /// first column; a press on the rest of the row chooses it rather than lifting it.
    /// </summary>
    private static ContainerComponent CreateGripGroup()
    {
        return DemoUI.CreateExample("Put in order by a grip",
            new TableComponent()
                .SetHorizontalScroll(UIScrollMode.Auto)
                .BindItems(nameof(TableRolloutGroupContext.Rows), UIBindingScope.Relative)
                .AddTextColumn("Service", nameof(DemoDeploymentRow.Service), UIGridUnit.Absolute(140), pinned: true)
                .AddTextColumn("Region", nameof(DemoDeploymentRow.Region), UIGridUnit.Absolute(160))
                .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(120), UITextAlignment.End)
                .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110))
                .SetSelectionMode(UISelectionMode.One)
                .SetDraggable(true)
                .SetDragHandle(UIDragHandlePlacement.Start)
                .OnRowMoveWithItemKey(nameof(TableController.MoveGripRow)),
            note: "The grip is a column of its own before the author's, not one of them: the columns engine never counts it, and it stays with the pinned Service column as the table scrolls sideways. Only it drags a row; a press on the rest of the row chooses it, and the keyboard moves the chosen row by Alt+Up and Alt+Down. `SetDragHandle(UIDragHandlePlacement.Start)`; the end is the default.",
            context: GripGroup
        );
    }

    /// <summary>
    /// A cell whose template is a list, bound to a collection the row holds: each row shows its own servers, whose names the reader
    /// may select and copy, as a table's words are not by default.
    /// </summary>
    private static ContainerComponent CreateCellListGroup()
    {
        return DemoUI.CreateExample("A list in a cell",
            new TableComponent()
                .SetHorizontalScroll(UIScrollMode.Auto)
                .SetItems(
                [
                    new DemoServiceServers { Id = "billing", Service = "Billing", Servers = { new TextItem { Id = "api-eu-west-1", Title = "api-eu-west-1" }, new TextItem { Id = "api-eu-west-2", Title = "api-eu-west-2" }, new TextItem { Id = "db-eu-west-1", Title = "db-eu-west-1" } } },
                    new DemoServiceServers { Id = "dns", Service = "DNS", Servers = { new TextItem { Id = "web-eu-west-1", Title = "web-eu-west-1" } } },
                    new DemoServiceServers { Id = "metrics", Service = "Metrics", Servers = { new TextItem { Id = "api-us-east-1", Title = "api-us-east-1" }, new TextItem { Id = "db-us-east-2", Title = "db-us-east-2" } } }
                ])
                .AddTextColumn("Service", nameof(DemoServiceServers.Service), UIGridUnit.Absolute(120))
                .AddColumn("Servers", new ItemsViewComponent()
                    .BindItems(nameof(DemoServiceServers.Servers), UIBindingScope.Relative)
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetLayoutType(UIItemsLayoutType.Wrap)
                    .SetSpacing(4)
                    // Stretched to the cell's line, a list starts its chips at the line's top, above the row's other words.
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetTemplate(new TextComponent()
                        .BindBadgeText(nameof(TextItem.Title), UIBindingScope.Relative)
                        .SetBadgeStyle(UIBadgeType.Surface)
                    )
                )
                .SetTextSelectable(true),
            note: "The list in the column's template is bound to the row's own collection, so every row lists its servers and no other's. A table's words are not selected by default; `SetTextSelectable(true)` lets the reader select and copy these."
        );
    }
}
