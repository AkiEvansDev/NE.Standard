using System.Collections.Generic;
using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What a list does once it is too big to hold: two thousand rows held whole but drawn a few at a time, as rows and as tiles, and
/// filtered in the page, a hundred thousand the server never sends whole — in a list, filtered on the server, in a table, a page at
/// a time — and a window of rows each carrying fields of its own; one behaviour to a section.
/// </summary>
/// <remarks>
/// What differs from the component pages is where the items come from, which is a story rather than a property. The page is words,
/// not samples: every title, note, caption and line is a key, in each of the demo's languages; the rows are data.
/// </remarks>
internal sealed class ListsView : DemoMechanismView, IUIViewDefinition
{
    private const string Words = "demo.mechanisms.lists.";

    /// <summary>Id of the field the page-side filter names; unbound, since the rule runs in the browser over the values it holds.</summary>
    private const string LocalFilterId = "lists-local-filter";

    /// <summary>Id of the field the server-side filter names; bound, since the rule resolves on the server.</summary>
    private const string ServerFilterId = "lists-server-filter";

    /// <summary>Id of the paged list, which its pager is aimed at.</summary>
    private const string PagedListId = "lists-paged";

    public static string ViewKey => "demo.mechanisms.lists";

    protected override string ComponentRoute => "/mechanisms/lists";
    protected override string Header => "demo.mechanisms.lists.header";
    protected override string HeaderDescription => "demo.mechanisms.lists.description";

    // Read across, two to a row: held whole, its tiles alone across the page for the width they fill, then read a window at a time,
    // then a page at a time, then fields in rows.
    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(
            CreateLocalGroup(),
            CreateLocalFilterGroup(),
            CreateLocalTilesGroup(),
            CreateWindowGroup(),
            CreateServerFilterGroup(),
            CreateTableGroup(),
            CreatePagedGroup(),
            CreateChecklistGroup()
        );

    private static ContainerComponent CreateLocalGroup()
        => DemoUI.CreateExample(Words + "local.title",
            new ItemsViewComponent()
                .BindItems(nameof(ListsController.LocalRows))
                .Virtualized()
                .VerticalScrollOnly()
                .SetHeight(UILayoutLength.Absolute(260))
                .SetTemplate(CreateRowTemplate()),
            note: Words + "local.note",
            context: nameof(ListsController.LocalGroup),
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                [Words + "local.add"] = nameof(ListsController.AddLocalRow)
            }),
            // A row needs the group's width: beside a column of controls its detail is cut short.
            controlsBelow: true,
            controller: [DemoCode.Of<DemoRowItem>(), DemoCode.Of<ListsController>(nameof(ListsController.LocalGroup), nameof(ListsController.LocalRows), nameof(ListsController.AddLocalRow))],
            words: true
        );

    /// <summary>A row's name and its detail, the template every list on the page shares.</summary>
    private static StackPanelComponent CreateRowTemplate()
        => new StackPanelComponent()
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

    private static ContainerComponent CreateLocalFilterGroup()
        => DemoUI.CreateExample(Words + "local-filter.title",
            UILayout.Stack(8)
                .AddChild(new TextInputComponent(LocalFilterId)
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetTitle("demo.mechanisms.lists.filter")
                    .SetDebounceMilliseconds(150)
                )
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(ListsController.LocalRows))
                    .Virtualized()
                    .FilterBy(LocalFilterId, IInputComponent.ValueProperty, nameof(DemoRowItem.Title))
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(260))
                    .SetTemplate(CreateRowTemplate())
                ),
            note: Words + "local-filter.note",
            controller: [DemoCode.Of<ListsController>(nameof(ListsController.LocalRows))],
            words: true
        );

    /// <summary>The same rows as tiles: a wrapping host keeps only the lines in view, as many tiles to a line as fit it.</summary>
    private static ContainerComponent CreateLocalTilesGroup()
        => DemoUI.CreateExample(Words + "tiles.title",
            new ItemsViewComponent()
                .BindItems(nameof(ListsController.LocalRows))
                .Virtualized()
                .SetLayoutType(UIItemsLayoutType.Wrap)
                .SetSpacing(8)
                .VerticalScrollOnly()
                .SetHeight(UILayoutLength.Absolute(260))
                .SetTemplate(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Tinted)
                    .SetPadding(UIThickness.Uniform(8))
                    .SetWidth(UILayoutLength.Absolute(96))
                    .SetHeight(UILayoutLength.Absolute(56))
                    .SetContent(new TextComponent()
                        .BindTitle(nameof(DemoRowItem.Title), UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Caption)
                    )
                ),
            columns: 24,
            note: Words + "tiles.note",
            controller: [DemoCode.Of<ListsController>(nameof(ListsController.LocalRows))],
            words: true
        );

    private static ContainerComponent CreateWindowGroup()
        => DemoUI.CreateExample(Words + "window.title",
            new ItemsViewComponent()
                .BindSource(nameof(ListsController.Rows))
                .SetWindowSize(50)
                .VerticalScrollOnly()
                .SetHeight(UILayoutLength.Absolute(260))
                .SetTemplate(CreateRowTemplate()),
            note: Words + "window.note",
            context: nameof(ListsController.RowsGroup),
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                [Words + "window.jump"] = nameof(ListsController.JumpToMiddleAsync),
                [Words + "window.start"] = nameof(ListsController.BackToStartAsync)
            }),
            controlsBelow: true,
            controller: [DemoCode.Of<DemoRowsSource>(nameof(DemoRowsSource.TotalRows), nameof(DemoRowsSource.Latency), "GetWindowAsync"), DemoCode.Of<ListsController>(nameof(ListsController.RowsGroup), nameof(ListsController.Rows), "OnInitializeAsync", nameof(ListsController.JumpToMiddleAsync), nameof(ListsController.BackToStartAsync))],
            words: true
        );

    private static ContainerComponent CreateServerFilterGroup()
        => DemoUI.CreateExample(Words + "server-filter.title",
            UILayout.Stack(8)
                .AddChild(new TextInputComponent(ServerFilterId)
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetTitle("demo.mechanisms.lists.filter")
                    .BindValue(nameof(ListsController.RowsFilter))
                )
                .AddChild(new ItemsViewComponent()
                    .BindSource(nameof(ListsController.FilteredRows))
                    .SetWindowSize(50)
                    .FilterBy(ServerFilterId, IInputComponent.ValueProperty, nameof(DemoRowItem.Title))
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(260))
                    .SetTemplate(CreateRowTemplate())
                ),
            note: Words + "server-filter.note",
            controller: [DemoCode.Of<DemoRowsSource>("Match", "KeyOf", "Matches"), DemoCode.Of<ListsController>(nameof(ListsController.RowsFilter), nameof(ListsController.FilteredRows))],
            words: true
        );

    private static ContainerComponent CreateTableGroup()
        => DemoUI.CreateExample(Words + "table.title",
            new TableComponent("lists-table")
                .SetHorizontalScroll(UIScrollMode.Auto)
                .BindSource(nameof(ListsController.TableRows))
                .AddTextColumn("demo.mechanisms.lists.table.row", nameof(DemoRowItem.Title), UIGridUnit.Absolute(160))
                .AddTextColumn("demo.mechanisms.lists.table.detail", nameof(DemoRowItem.Detail))
                .SetResizableColumns(true)
                .SetShowColumnSeparators(true)
                .SetMaxHeight(UILayoutLength.Absolute(300)),
            note: Words + "table.note",
            controller: [DemoCode.Of<ListsController>(nameof(ListsController.TableRows))],
            words: true
        );

    private static ContainerComponent CreatePagedGroup()
        => DemoUI.CreateExample(Words + "paged.title",
            UILayout.Stack(8)
                .AddChild(new ItemsViewComponent(PagedListId)
                    .BindSource(nameof(ListsController.PagedRows))
                    .SetWindowSize(ListsController.PageSize)
                    .SetPaging(true)
                    .VerticalScrollOnly()
                    .SetHeight(UILayoutLength.Absolute(260))
                    .SetTemplate(CreateRowTemplate())
                )
                .AddChild(new PagerComponent()
                    .SetTarget(PagedListId)
                    .SetHorizontalAlignment(UIAlignment.End)
                ),
            note: Words + "paged.note",
            context: nameof(ListsController.PagedGroup),
            controller: [DemoCode.Of<DemoRowsSource>(nameof(DemoRowsSource.WindowRead)), DemoCode.Of<ListsController>(nameof(ListsController.PageSize), nameof(ListsController.PagedGroup), nameof(ListsController.PagedRows), "OnNavigatedAsync", "WritePageAsync")],
            words: true
        );

    /// <summary>The checklists are a source's window: the field writes its draft back through the source, and the row's Enter reads it there.</summary>
    private static ContainerComponent CreateChecklistGroup()
        => DemoUI.CreateExample(Words + "checklist.title",
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
                        .SetAppearance(UIInputAppearance.Ghost)
                        .SetSize(UIInputSize.Small)
                        .SetRows(1)
                        .SetAutoGrow(4)
                        .SetPlaceholder(UIPhrase.Of("demo.inputs.text-input.checklist.comment"))
                        .BindValue(nameof(DemoChecklist.CommentDraft), UIBindingScope.Relative, UIBindingMode.TwoWay)
                        .OnEnter(nameof(ListsController.AddChecklistComment), UIAction.ArgCurrentItemKey("id"))
                    )
                ),
            note: Words + "checklist.note",
            columns: 24,
            context: nameof(ListsController.ChecklistGroup),
            controller: [DemoCode.Of<DemoChecklist>(), DemoCode.Of<DemoChecklistSource>(), DemoCode.Of<ListsController>(nameof(ListsController.ChecklistGroup), nameof(ListsController.Checklists), nameof(ListsController.AddChecklistLine), nameof(ListsController.AddChecklistComment))],
            words: true
        );
}
