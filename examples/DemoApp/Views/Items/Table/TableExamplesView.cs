using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Controllers.Items.Table;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Items.Table;

/// <summary>
/// What a table is used for, one screen per job: narrowed by a box, opened by a row, a column per kind of cell, chosen rows,
/// a source read a window at a time, and a table that is a card's content.
/// </summary>
internal sealed class TableExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string OpenGroup = nameof(TableExamplesController.OpenGroup);
    private const string ActionGroup = nameof(TableExamplesController.ActionGroup);
    private const string ChosenGroup = nameof(TableExamplesController.ChosenGroup);

    /// <summary>Id of the box the filtered table's rule names; a rule reads a component, not a value.</summary>
    private const string FilterId = "table-examples-filter";

    public static string ViewKey => "demo.items.table.examples";

    protected override string ComponentRoute => "/items/table";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.items.table.header";
    protected override string HeaderDescription => "demo.items.table.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateColumnKindsGroup(), CreateWindowedGroup(), CreateChosenGroup()],
            [CreateFilterGroup(), CreateCardGroup(), CreateOpenGroup()]
        ));
    }

    /// <summary>
    /// The plain table with a box over it, narrowed in the browser against rows it holds whole, as the viewer types.
    /// </summary>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateGroup(null, "Narrowed as you type",
            content => content
                .AddChild(new TextInputComponent(FilterId)
                    .SetPlaceholder("Filter services")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetDebounceMilliseconds(150)
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(CreateDeploymentsTable()
                    .FilterBy(FilterId, IInputComponent.ValueProperty, nameof(DemoDeploymentRow.Service))
                    .SetStriped(true)
                    .SetPlacement(1, 2, 24, 1)
                ),
            note: "All eight rows, because a filter is only worth a box when there are more rows than the reader wants to look through."
        );
    }

    /// <summary>
    /// A row is the control: the pointer says so, and a click hands the row's key to the controller.
    /// </summary>
    private static ContainerComponent CreateOpenGroup()
    {
        return DemoUI.CreateGroup(OpenGroup, "A row that opens",
            content => content.AddChild(CreateDeploymentsTable(rows: 5)
                .SetRowHoverable(true)
                .OnRowClickWithItemKey(nameof(TableExamplesController.OpenRow))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A column is any template bound to the row: a glyph, words, a number against the right edge, a badge, a button.
    /// </summary>
    private static ContainerComponent CreateColumnKindsGroup()
    {
        TextComponent glyph = new TextComponent()
            .BindIcon(nameof(DemoDeploymentRow.Icon), UIBindingScope.Relative)
            .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Primary));

        TextComponent badge = new TextComponent()
            .BindBadgeText(nameof(DemoDeploymentRow.Status), UIBindingScope.Relative)
            .BindBadgeStyle(nameof(DemoDeploymentRow.StatusStyle), UIBindingScope.Relative);

        // The button's click is its own, never the row's: a control inside a row keeps its press.
        ButtonComponent restart = new ButtonComponent()
            .SetType(UIButtonType.Ghost)
            .SetSize(UIButtonSize.Small)
            .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
            .SetTooltip("Restart")
            .OnClick(nameof(TableExamplesController.RestartRow), UIAction.ArgCurrentItemKey("id"));

        return DemoUI.CreateGroup(ActionGroup, "A column per kind of cell",
            content => content.AddChild(new TableComponent()
                .SetItems(DemoDeploymentRow.CreateDeployments())
                .AddColumn("", glyph, UIGridUnit.Absolute(48), UITextAlignment.Center)
                .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
                .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(96), UITextAlignment.End)
                .AddColumn("Status", badge, UIGridUnit.Absolute(120))
                .AddColumn("", restart, UIGridUnit.Absolute(56), UITextAlignment.End)
                .SetShowColumnSeparators(true)
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// Rows chosen with the items view's vocabulary: a mark on the left names the chosen ones, and any number may be chosen.
    /// </summary>
    private static ContainerComponent CreateChosenGroup()
    {
        return DemoUI.CreateGroup(ChosenGroup, "Chosen rows",
            content => content.AddChild(CreateDeploymentsTable(rows: 6)
                .SetSelectionMode(UISelectionMode.Many)
                .SetSelectedKeys(["web-portal", "notifier"])
                .SetSelectionStyle(UISelectionStyle.Marked(UISelectionMark.Left))
                // The row Enter and a double click open, so the group's line says which one that was and what stayed chosen.
                .OnRowOpenWithItemKey(nameof(TableExamplesController.OpenChosenRow))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Ctrl and Shift choose as a file manager's rows do. Enter opens the row the keyboard is on and leaves the group chosen."
        );
    }

    /// <summary>
    /// A hundred thousand rows of which only the window is ever in the page; the columns may be dragged, and the widths stay.
    /// </summary>
    private static ContainerComponent CreateWindowedGroup()
    {
        return DemoUI.CreateGroup(null, "A hundred thousand rows, a window at a time",
            content => content.AddChild(new TableComponent("windowed-rows")
                .BindSource(nameof(TableExamplesController.Source))
                .AddTextColumn("Row", nameof(DemoRowItem.Title), UIGridUnit.Absolute(160))
                .AddTextColumn("Detail", nameof(DemoRowItem.Detail))
                .SetResizableColumns(true)
                .SetShowColumnSeparators(true)
                .SetMaxHeight(UILayoutLength.Absolute(300))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Drag a column's edge in the header to resize it; a double-click on the edge puts the authored width back."
        );
    }

    /// <summary>
    /// A table as a card's content: the card draws the edge, so the table draws none, and its rows run to the card's sides.
    /// </summary>
    private static ContainerComponent CreateCardGroup()
    {
        return DemoUI.CreateGroup(null, "In a card",
            content => content.AddChild(new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Cloud)
                    .SetTitle("Deployments")
                    .SetDescription("The four the card has room to summarise.")
                )
                .SetContent(CreateDeploymentsTable(rows: 4)
                    .SetBorderThickness(UIThickness.Uniform(0))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The four text columns most of the groups share; each group takes as many rows as its point needs.
    /// </summary>
    /// <remarks>One column set on purpose, so what differs between the groups is the behaviour and never the table.</remarks>
    private static TableComponent CreateDeploymentsTable(int rows = 0)
        => new TableComponent()
            .SetItems(rows > 0 ? DemoDeploymentRow.CreateDeployments().GetRange(0, rows) : DemoDeploymentRow.CreateDeployments())
            .AddTextColumn("Service", nameof(DemoDeploymentRow.Service))
            .AddTextColumn("Region", nameof(DemoDeploymentRow.Region))
            .AddTextColumn("Replicas", nameof(DemoDeploymentRow.Replicas), UIGridUnit.Absolute(96), UITextAlignment.End)
            .AddTextColumn("Status", nameof(DemoDeploymentRow.Status), UIGridUnit.Absolute(110));
}
