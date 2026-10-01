using System.Collections.Generic;
using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What a list does once it is too big to hold: a hundred thousand rows the server never sends whole, in a list and in a table,
/// two thousand rows held whole but laid out thirty at a time, and a window of rows each carrying fields of its own.
/// </summary>
/// <remarks>What differs from the component pages is where the items come from, which is a story rather than a property.</remarks>
internal sealed class ListsView : DemoMechanismView, IUIViewDefinition
{
    /// <summary>
    /// Id of the filter field the list's rule names; the rule resolves server-side, so the value must be bound.
    /// </summary>
    private const string RowsFilterId = "items-view-rows-filter";

    /// <summary>Id of the field the virtualized list's rule names; unbound, since the rule runs in the browser over the values it holds.</summary>
    private const string LocalFilterId = "items-view-local-filter";

    private const string ChecklistGroup = nameof(ListsController.ChecklistGroup);

    public static string ViewKey => "demo.mechanisms.lists";

    protected override string ComponentRoute => "/mechanisms/lists";
    protected override string Header => "demo.mechanisms.lists.header";
    protected override string HeaderDescription => "demo.mechanisms.lists.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateRowsGroup(), CreateTableGroup()], [CreateLocalGroup(), CreateChecklistGroup()]));

    private static ContainerComponent CreateRowsGroup()
    {
        return DemoUI.CreateGroup(nameof(ListsController.RowsGroup), "100 000 rows, 50 at a time",
            content => content
                .AddChild(new TextInputComponent(RowsFilterId)
                    .SetTitle("Filter by title")
                    .BindValue(nameof(ListsController.RowsFilter))
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new ItemsViewComponent()
                    .BindSource(nameof(ListsController.Rows))
                    .SetWindowSize(50)
                    .FilterBy(RowsFilterId, IInputComponent.ValueProperty, nameof(DemoRowItem.Title))
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(260))
                    .SetTemplate(CreateRowTemplate())
                    .SetPlacement(1, 2, 24, 1)
                ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Jump to 50 000"] = nameof(ListsController.JumpToMiddleAsync),
                ["Back to start"] = nameof(ListsController.BackToStartAsync),
            }),
            contentMinHeight: 300,
            // A row needs the group's width: beside a column of controls its detail is cut short.
            controlsBelow: true,
            note: "Scroll, and the rows are read as they are reached. The filter field is bound because the rule is resolved on the server — an unbound value never leaves the browser."
        );
    }

    private static StackPanelComponent CreateRowTemplate()
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(12)
            // A row's name in the body role: a bare text is a heading, too loud for one line of a list.
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoRowItem.Title), UIBindingScope.Relative)
                .AsBody()
                .SetWidth(UILayoutLength.Absolute(120))
                .SetMargin(UIThickness.All(8, 4, 0, 4))
            )
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoRowItem.Detail), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetMargin(UIThickness.All(0, 4, 8, 4))
            );
    }

    /// <summary>
    /// A collection the client holds whole as values, drawing only the rows in view; its rules run over the values.
    /// </summary>
    private static ContainerComponent CreateLocalGroup()
    {
        return DemoUI.CreateGroup(nameof(ListsController.LocalGroup), "2 000 rows held, 30 in the document",
            content => content
                .AddChild(new TextInputComponent(LocalFilterId)
                    .SetTitle("Filter by title")
                    .SetDebounceMilliseconds(150)
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(ListsController.LocalRows))
                    .Virtualized()
                    .FilterBy(LocalFilterId, IInputComponent.ValueProperty, nameof(DemoRowItem.Title))
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(260))
                    .SetTemplate(CreateRowTemplate())
                    .SetPlacement(1, 2, 24, 1)
                ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add a row"] = nameof(ListsController.AddLocalRow),
            }),
            contentMinHeight: 300,
            // A row needs the group's width: beside a column of controls its detail is cut short.
            controlsBelow: true,
            note: "The other half of the feature: the client holds every row's value and draws the rows as they come into view — a few dozen elements stand for two thousand. The filter runs over the values, not the rows."
        );
    }

    /// <summary>
    /// A hundred thousand rows of which only the window is ever in the page; the columns may be dragged, and the widths stay.
    /// </summary>
    private static ContainerComponent CreateTableGroup()
    {
        return DemoUI.CreateExample("A hundred thousand rows, a window at a time",
            new TableComponent("windowed-rows")
                .SetHorizontalScroll(UIScrollMode.Auto)
                .BindSource(nameof(ListsController.TableRows))
                .AddTextColumn("Row", nameof(DemoRowItem.Title), UIGridUnit.Absolute(160))
                .AddTextColumn("Detail", nameof(DemoRowItem.Detail))
                .SetResizableColumns(true)
                .SetShowColumnSeparators(true)
                .SetMaxHeight(UILayoutLength.Absolute(300)),
            note: "Drag a column's edge in the header to resize it; a double-click on the edge puts the authored width back."
        );
    }

    /// <summary>
    /// A field in every row: each checklist adds a line from its own field, by Enter or by the + at its end, and a comment from its own
    /// text area, by Enter while Shift+Enter breaks the line; each command knows the row by its key.
    /// </summary>
    /// <remarks>The checklists are a source's window: the field writes its draft back through the source, and the row's Enter reads it there.</remarks>
    private static ContainerComponent CreateChecklistGroup()
    {
        return DemoUI.CreateExample("A field in every row",
            new ItemsViewComponent()
                .BindSource(nameof(ListsController.Checklists))
                .SetSpacing(16)
                .SetTemplate(UILayout.Stack(4)
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(DemoChecklist.Title), UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Subtitle)
                    )
                    .AddChild(new ItemsViewComponent()
                        .BindItems(nameof(DemoChecklist.Lines), UIBindingScope.Relative)
                        .SetSpacing(2)
                        .SetShowEmptyTemplate(false)
                        .SetTemplate(new TextComponent()
                            .SetIcon(DemoIcons.Check)
                            .SetIconColor(UIThemeColor.Muted)
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .AsBody()
                        )
                    )
                    // Ghost, as a field in a list's row is: the next line of the list rather than a box under it.
                    .AddChild(new TextInputComponent()
                        .SetAppearance(UIInputAppearance.Ghost)
                        .SetSize(UIInputSize.Small)
                        .SetPlaceholder(UIPhrase.Of("demo.inputs.text-input.checklist.placeholder"))
                        .BindValue(nameof(DemoChecklist.Draft), UIBindingScope.Relative, UIBindingMode.TwoWay)
                        .OnEnter(nameof(ListsController.AddChecklistLine), UIAction.ArgCurrentItemKey("id"))
                        .SetTrailingAction(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Add))
                            .SetTooltip(UIPhrase.Of("demo.inputs.text-input.checklist.add"))
                            .OnClick(nameof(ListsController.AddChecklistLine), UIAction.ArgCurrentItemKey("id"))
                        )
                    )
                    .AddChild(new ItemsViewComponent()
                        .BindItems(nameof(DemoChecklist.Comments), UIBindingScope.Relative)
                        .SetSpacing(2)
                        .SetShowEmptyTemplate(false)
                        // A paragraph, not a text: a comment keeps the lines Shift+Enter broke it into.
                        .SetTemplate(new ParagraphComponent()
                            .SetIcon(DemoIcons.MessageSquare)
                            .SetIconColor(UIThemeColor.Muted)
                            .BindDescription(nameof(TextItem.Title), UIBindingScope.Relative)
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                    )
                    .AddChild(new TextAreaComponent()
                        .SetSize(UIInputSize.Small)
                        .SetRows(1)
                        .SetAutoGrow(4)
                        .SetPlaceholder(UIPhrase.Of("demo.inputs.text-input.checklist.comment"))
                        .BindValue(nameof(DemoChecklist.CommentDraft), UIBindingScope.Relative, UIBindingMode.TwoWay)
                        .OnEnter(nameof(ListsController.AddChecklistComment), UIAction.ArgCurrentItemKey("id"))
                    )
                ),
            note: "`OnEnter(command, UIAction.ArgCurrentItemKey(\"id\"))` in the row's template: Enter in a checklist's field adds the line to that checklist and keeps the caret for the next. The field writes its draft through the source's `TryWriteAsync`, and the command runs once that write has landed. The comment box is a text area with `OnEnter`: Enter adds the comment, Shift+Enter breaks its line, and no form is needed. The lines and the comments say nothing while there are none (`SetShowEmptyTemplate(false)`).",
            context: ChecklistGroup
        );
    }
}
