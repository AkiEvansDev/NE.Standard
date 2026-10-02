using System.Collections.Generic;
using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What a list does once it is too big to hold: a hundred thousand rows the server never sends whole, in a list and in a table,
/// two thousand rows held whole but laid out thirty at a time, and a window of rows each carrying fields of its own.
/// </summary>
/// <remarks>
/// What differs from the component pages is where the items come from, which is a story rather than a property. The page is words,
/// not samples: every title, note, caption and line is a key, in each of the demo's languages; the rows are data.
/// </remarks>
internal sealed class ListsView : DemoMechanismView, IUIViewDefinition
{
    /// <summary>
    /// Id of the filter field the list's rule names; the rule resolves server-side, so the value must be bound.
    /// </summary>
    private const string RowsFilterId = "items-view-rows-filter";

    /// <summary>Id of the field the virtualized list's rule names; unbound, since the rule runs in the browser over the values it holds.</summary>
    private const string LocalFilterId = "items-view-local-filter";

    private const string ChecklistGroup = nameof(ListsController.ChecklistGroup);
    private const string Words = "demo.mechanisms.lists.";

    public static string ViewKey => "demo.mechanisms.lists";

    protected override string ComponentRoute => "/mechanisms/lists";
    protected override string Header => "demo.mechanisms.lists.header";
    protected override string HeaderDescription => "demo.mechanisms.lists.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateRowsGroup(), CreateTableGroup()], [CreateLocalGroup(), CreateChecklistGroup()]));

    private static ContainerComponent CreateRowsGroup()
    {
        return DemoUI.CreateGroup(nameof(ListsController.RowsGroup), Words + "rows.title",
            content => content
                .AddChild(new TextInputComponent(RowsFilterId)
                    .SetTitle(Words + "filter")
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
                [Words + "rows.jump"] = nameof(ListsController.JumpToMiddleAsync),
                [Words + "rows.start"] = nameof(ListsController.BackToStartAsync),
            }),
            contentMinHeight: 300,
            // A row needs the group's width: beside a column of controls its detail is cut short.
            controlsBelow: true,
            note: Words + "rows.note",
            words: true
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
        return DemoUI.CreateGroup(nameof(ListsController.LocalGroup), Words + "local.title",
            content => content
                .AddChild(new TextInputComponent(LocalFilterId)
                    .SetTitle(Words + "filter")
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
                [Words + "local.add"] = nameof(ListsController.AddLocalRow),
            }),
            contentMinHeight: 300,
            // A row needs the group's width: beside a column of controls its detail is cut short.
            controlsBelow: true,
            note: Words + "local.note",
            words: true
        );
    }

    /// <summary>
    /// A hundred thousand rows of which only the window is ever in the page; the columns may be dragged, and the widths stay.
    /// </summary>
    private static ContainerComponent CreateTableGroup()
    {
        return DemoUI.CreateExample(Words + "table.title",
            new TableComponent("windowed-rows")
                .SetHorizontalScroll(UIScrollMode.Auto)
                .BindSource(nameof(ListsController.TableRows))
                .AddTextColumn("demo.mechanisms.lists.table.row", nameof(DemoRowItem.Title), UIGridUnit.Absolute(160))
                .AddTextColumn("demo.mechanisms.lists.table.detail", nameof(DemoRowItem.Detail))
                .SetResizableColumns(true)
                .SetShowColumnSeparators(true)
                .SetMaxHeight(UILayoutLength.Absolute(300)),
            note: Words + "table.note",
            words: true
        );
    }

    /// <summary>
    /// A field in every row: each checklist adds a line from its own field, by Enter or by the + at its end, and a comment from its own
    /// text area, by Enter while Shift+Enter breaks the line; each command knows the row by its key.
    /// </summary>
    /// <remarks>The checklists are a source's window: the field writes its draft back through the source, and the row's Enter reads it there.</remarks>
    private static ContainerComponent CreateChecklistGroup()
    {
        return DemoUI.CreateExample(Words + "checklist.title",
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
            note: Words + "checklist.note",
            context: ChecklistGroup,
            words: true
        );
    }
}
