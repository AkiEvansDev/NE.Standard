using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Controllers.Items.Table;
using DemoApp.Views.Base;

namespace DemoApp.Views.Items.Table;

/// <summary>
/// What a table is used for, one screen per job: narrowed by a box, opened by a row, a column per kind of cell, chosen rows,
/// a source read a window at a time, a table that is a card's content, rows put in order by a drag, and a list in a cell.
/// </summary>
/// <remarks>Most groups share one column set on purpose, so what differs between the groups is the behaviour and never the table.</remarks>
internal sealed class TableExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string OpenGroup = nameof(TableExamplesController.OpenGroup);
    private const string ActionGroup = nameof(TableExamplesController.ActionGroup);
    private const string ChosenGroup = nameof(TableExamplesController.ChosenGroup);
    private const string RolloutGroup = nameof(TableExamplesController.RolloutGroup);
    private const string GripGroup = nameof(TableExamplesController.GripGroup);

    /// <summary>Id of the box the filtered table's rule names; a rule reads a component, not a value.</summary>
    private const string FilterId = "table-examples-filter";
    private const string StatusId = "table-examples-status";

    public static string ViewKey => "demo.items.table.examples";

    protected override string ComponentRoute => "/items/table";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.items.table.header";
    protected override string HeaderDescription => "demo.items.table.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateColumnKindsGroup(), CreateWindowedGroup(), CreateChosenGroup(), CreateRolloutGroup()],
            [CreateFilterGroup(), CreateCardGroup(), CreateOpenGroup(), CreateCellListGroup(), CreateGripGroup()]
            )
        );
    }

    /// <summary>
    /// A column is any template bound to the row: a glyph, words, a number against the right edge, a badge, a button.
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
                .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(96), UITextAlignment.End)
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
                    .OnClick(nameof(TableExamplesController.RestartRow), UIAction.ArgCurrentItemKey("id")),
                    UIGridUnit.Absolute(56), UITextAlignment.End
                )
                .SetShowColumnSeparators(true),
            context: ActionGroup
        );
    }

    /// <summary>
    /// A hundred thousand rows of which only the window is ever in the page; the columns may be dragged, and the widths stay.
    /// </summary>
    private static ContainerComponent CreateWindowedGroup()
    {
        return DemoUI.CreateExample("A hundred thousand rows, a window at a time",
            new TableComponent("windowed-rows")
                .SetHorizontalScroll(UIScrollMode.Auto)
                .BindSource(nameof(TableExamplesController.Source))
                .AddTextColumn("Row", nameof(DemoRowItem.Title), UIGridUnit.Absolute(160))
                .AddTextColumn("Detail", nameof(DemoRowItem.Detail))
                .SetResizableColumns(true)
                .SetShowColumnSeparators(true)
                .SetMaxHeight(UILayoutLength.Absolute(300)),
            note: "Drag a column's edge in the header to resize it; a double-click on the edge puts the authored width back."
        );
    }

    /// <summary>
    /// Rows chosen with the items view's vocabulary: a mark on the left names the chosen ones, and any number may be chosen.
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
                // The row Enter and a double click open, so the group's line says which one that was and what stayed chosen.
                .OnRowOpenWithItemKey(nameof(TableExamplesController.OpenChosenRow)),
            note: "Ctrl and Shift choose as a file manager's rows do. Enter opens the row the keyboard is on and leaves the group chosen.",
            context: ChosenGroup
        );
    }

    /// <summary>
    /// The plain table with a box over it, narrowed in the browser against rows it holds whole, as the viewer types.
    /// </summary>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateExample("Narrowed as you type, and by status",
            UILayout.Stack(0)
                .AddChild(UILayout.Columns(12,
                        new TextInputComponent(FilterId)
                            .SetPlaceholder("Filter services")
                            .SetPrefixIcon(DemoIcons.Search)
                            .SetShowClearButton()
                            .SetDebounceMilliseconds(150),
                        new SelectComponent(StatusId)
                            .SetPlaceholder("Any status")
                            .SetShowClearButton()
                            .SetOptions(
                            [
                                new OptionItem { Id = "Healthy", Title = "Healthy" },
                                new OptionItem { Id = "Degraded", Title = "Degraded" },
                                new OptionItem { Id = "Failing", Title = "Failing" },
                                new OptionItem { Id = "Paused", Title = "Paused" }
                            ])
                    )
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                )
                // Two rules, each active only while its control holds a value; a row passes both or is hidden.
                .AddChild(new TableComponent()
                    .SetHorizontalScroll(UIScrollMode.Auto)
                    .SetItems(DemoDeploymentRow.CreateDeployments())
                    .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                    .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
                    .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(96), UITextAlignment.End)
                    .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110))
                    .FilterBy(FilterId, IInputComponent.ValueProperty, nameof(DemoDeploymentRow.Service))
                    .FilterBy(StatusId, IInputComponent.ValueProperty, nameof(DemoDeploymentRow.Status), UIComparisonOperator.Equal)
                    .SetStriped(true)
                ),
            note: "All eight rows, because a filter is only worth a box when there are more rows than the reader wants to look through. The two rules are ANDed in the browser; the catalogue under Screens runs four of them and three sorts on one list."
        );
    }

    /// <summary>
    /// A table as a card's content: the card draws the edge, so the table draws none, and its rows run to the card's sides.
    /// </summary>
    private static ContainerComponent CreateCardGroup()
    {
        return DemoUI.CreateExample("In a card",
            new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Cloud)
                    .SetTitle("Deployments")
                    .SetDescription("The four the card has room to summarise.")
                )
                .SetContent(new TableComponent()
                    .SetHorizontalScroll(UIScrollMode.Auto)
                    .SetItems(DemoDeploymentRow.CreateDeployments().GetRange(0, 4))
                    .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                    .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
                    .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(96), UITextAlignment.End)
                    .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110))
                    .SetBorderThickness(UIThickness.Uniform(0))
                )
        );
    }

    /// <summary>
    /// A row is the control: the pointer says so, and a click hands the row's key to the controller.
    /// </summary>
    private static ContainerComponent CreateOpenGroup()
    {
        return DemoUI.CreateExample("A row that opens",
            new TableComponent()
                .SetHorizontalScroll(UIScrollMode.Auto)
                .SetItems(DemoDeploymentRow.CreateDeployments().GetRange(0, 5))
                .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
                .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(96), UITextAlignment.End)
                .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110))
                .SetRowHoverable(true)
                .SetStriped(true)
                .OnRowClickWithItemKey(nameof(TableExamplesController.OpenRow)),
            note: "Striped as well, since that is the pair most tables are built from: the pointer's wash answers on a striped row too.",
            context: OpenGroup
        );
    }

    /// <summary>
    /// Rows in the order a release reaches them, put in order by a drag; the columns wear an icon before their caption.
    /// </summary>
    private static ContainerComponent CreateRolloutGroup()
    {
        return DemoUI.CreateExample("Put in order by a drag",
            new TableComponent()
                .SetHorizontalScroll(UIScrollMode.Auto)
                .BindItems(nameof(TableRolloutGroupContext.Rows), UIBindingScope.Relative)
                .AddTextColumn("Service", nameof(DemoDeploymentRow.Service), icon: DemoIcons.Outline(DemoIcons.Server))
                .AddTextColumn("Region", nameof(DemoDeploymentRow.Region), icon: DemoIcons.Outline(DemoIcons.Region))
                .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(120), UITextAlignment.End, icon: DemoIcons.Outline(DemoIcons.Replicas))
                .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110))
                .SetDraggable(true)
                .OnRowMoveWithItemKey(nameof(TableExamplesController.MoveRolloutRow)),
            note: "Drag a row between two others, or put the keyboard on it and press Alt+Up or Alt+Down: the command gets the row's key and the place it takes, and the controller moves it in its RecursiveCollection. A drag is refused while a sort orders the rows. The icons are the columns' own (`icon:`), drawn before the caption.",
            context: RolloutGroup
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
                .OnRowMoveWithItemKey(nameof(TableExamplesController.MoveGripRow)),
            note: "The grip is a column of its own before the author's, not one of them: the columns engine never counts it, and it stays with the pinned Service column as the table scrolls sideways. Only it drags a row; a press on the rest of the row chooses it, and the keyboard moves the chosen row by Alt+Up and Alt+Down. `SetDragHandle(UIDragHandlePlacement.Start)`; the end is the default.",
            context: GripGroup
        );
    }

    /// <summary>
    /// A cell whose template is a list, bound to a collection the row holds: each row shows its own servers.
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
                    .SetTemplate(new TextComponent()
                        .BindBadgeText(nameof(TextItem.Title), UIBindingScope.Relative)
                        .SetBadgeStyle(UIBadgeType.Surface)
                    )
                ),
            note: "The list in the column's template is bound to the row's own collection, so every row lists its servers and no other's."
        );
    }
}
