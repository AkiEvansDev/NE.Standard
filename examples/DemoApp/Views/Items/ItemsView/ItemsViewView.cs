using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Views.Base;

namespace DemoApp.Views.Items.ItemsView;

/// <summary>
/// One list drawn by the built-in text template and every property that can be bound to the host around it; then what a template
/// over a collection is used for, one job per group.
/// </summary>
/// <remarks>
/// The list is capped at a height it does not fill, so <c>VerticalScroll</c> has something to do. Most lists here are author-declared
/// data; the ones a controller answers for are moved, posted to or flipped by it. A source too large to send whole is on the large
/// lists' page, a moment in words on the Words page.
/// </remarks>
internal sealed class ItemsViewView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ItemsGroup = nameof(ItemsViewController.ItemsGroup);
    private const string RowMenusGroup = nameof(ItemsViewController.RowMenusGroup);
    private const string OrderGroup = nameof(ItemsViewController.OrderGroup);
    private const string QueueGroup = nameof(ItemsViewController.QueueGroup);
    private const string BoardGroup = nameof(ItemsViewController.BoardGroup);

    /// <summary>Ids of the controls the narrowed list's rules name; a rule reads a component, not a value.</summary>
    private const string FilterId = "items-examples-filter";
    private const string RegionId = "items-examples-region";
    private const string SortId = "items-examples-sort";

    /// <summary>One menu for every file, the same list each row's bar is a view of; the press names the entry and the row it stands in.</summary>
    private static readonly MenuItem[] FileActions =
    [
        new() { Id = "share", Title = "demo.items.items-view.action.share", Icon = DemoIcons.Outline(DemoIcons.Link), InActionBar = true },
        new() { Id = "download", Title = "demo.items.items-view.action.download", Icon = DemoIcons.Outline(DemoIcons.Download), InActionBar = true },
        new() { Id = "rename", Title = "demo.items.items-view.action.rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
        new() { Id = "copy-link", Title = "demo.items.items-view.action.copy-link", Icon = DemoIcons.Outline(DemoIcons.Copy) },
        new() { Id = "rule", Kind = UIMenuItemKind.Separator },
        new() { Id = "delete", Title = "demo.items.items-view.action.delete", Icon = UIGlyphs.Delete, IconColor = UIThemeColor.Danger, TitleColor = UIThemeColor.Danger, InActionBar = true }
    ];

    public static string ViewKey => "demo.items.items-view";

    protected override string ComponentRoute => "/items/items-view";
    protected override string Header => "demo.items.items-view.header";
    protected override string HeaderDescription => "demo.items.items-view.description";
    protected override (string Route, string Label)? ComposedIn => ("/mechanisms/lists", "demo.nav.mechanisms.lists");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ItemsViewComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindItems($"{ItemsGroup}.{nameof(ItemsViewGroupContext.Items)}")
            .BindLayoutType($"{ItemsGroup}.{nameof(ItemsViewGroupContext.LayoutType)}")
            .BindOrientation($"{ItemsGroup}.{nameof(ItemsViewGroupContext.Orientation)}")
            .BindSpacing($"{ItemsGroup}.{nameof(ItemsViewGroupContext.Spacing)}")
            .BindPadding($"{ItemsGroup}.{nameof(ItemsViewGroupContext.Padding)}")
            .BindHorizontalScroll($"{ItemsGroup}.{nameof(ItemsViewGroupContext.HorizontalScroll)}")
            .BindVerticalScroll($"{ItemsGroup}.{nameof(ItemsViewGroupContext.VerticalScroll)}")
            .BindScrollSnap($"{ItemsGroup}.{nameof(ItemsViewGroupContext.ScrollSnap)}")
            .BindScrollAnchor($"{ItemsGroup}.{nameof(ItemsViewGroupContext.ScrollAnchor)}")
            .BindSelectionMode($"{ItemsGroup}.{nameof(ItemsViewGroupContext.SelectionMode)}")
            .BindSelectedKey($"{ItemsGroup}.{nameof(ItemsViewGroupContext.SelectedKey)}")
            .BindSelectedKeys($"{ItemsGroup}.{nameof(ItemsViewGroupContext.SelectedKeys)}")
            .BindSelectionStyle($"{ItemsGroup}.{nameof(ItemsViewGroupContext.SelectionStyle)}")
            .BindDraggable($"{ItemsGroup}.{nameof(ItemsViewGroupContext.Draggable)}")
            .BindDragHandle($"{ItemsGroup}.{nameof(ItemsViewGroupContext.DragHandle)}")
            .BindDragHandlePlacement($"{ItemsGroup}.{nameof(ItemsViewGroupContext.DragHandlePlacement)}")
            .OnItemMoveWithItemKey(nameof(ItemsViewController.MoveItem))
            // One line per row: the properties are the exhibit here, the richer rows are in the examples below.
            .SetTemplate(new TextComponent().SetTitleType(UITextAppearance.Body).BindTitle(nameof(TextItem.Title), UIBindingScope.Relative))
            // Room for every row at the default spacing: at 240 the last row stood cut by four pixels, a scroll that read as a fault.
            .SetMaxHeight(UILayoutLength.Absolute(264))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 320);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ItemsGroup, "Items", nameof(ItemsViewController.CycleItemsGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateStripGroup(), .. DemoUI.CreateColumns([CreateFilterGroup(), CreateTilesGroup()], [CreateGroupedGroup(), CreateQueueGroup()]), CreateOrderGroup(), CreateBoardGroup(), CreateRowMenusGroup()];

    /// <summary>
    /// A row of cards that scrolls sideways and stops on a card; the host is the scroller.
    /// </summary>
    private static ContainerComponent CreateStripGroup()
    {
        return DemoUI.CreateExample("A strip of cards",
            new ItemsViewComponent()
                .SetItems(CreateReleases())
                .SetOrientation(UIOrientation.Horizontal)
                .HorizontalScrollOnly()
                .SetScrollSnap(UIScrollSnapMode.Mandatory)
                .SetSpacing(12)
                .SetTemplate(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(220))
                    .SetContent(new TextComponent()
                        .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Primary))
                        .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Subtitle)
                        .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
                        .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                ),
            columns: 24,
            note: "A strip runs across the page rather than down a column: the cards scroll sideways, and a narrow box would hide most of them."
        );
    }

    private static DemoReleaseItem[] CreateReleases()
        =>
        [
            CreateRelease("r481", "481", "Raised the health gate to ten minutes.", "Live", UIBadgeType.Success, DemoImages.HarbourSky),
            CreateRelease("r480", "480", "DNS zone rebuild moved off the deploy path.", "Rolled back", UIBadgeType.Warning, DemoImages.SunsetRuins),
            CreateRelease("r479", "479", "Billing retries with jitter.", "Live", UIBadgeType.Success, DemoImages.NightStreet),
            CreateRelease("r478", "478", "Metrics kept for thirteen months.", "Live", UIBadgeType.Success, DemoImages.MeteorShore),
            CreateRelease("r477", "477", "Mail relay paused for the provider migration.", "Paused", UIBadgeType.Surface, DemoImages.HarbourSky),
            CreateRelease("r476", "476", "Invoices export as CSV.", "Live", UIBadgeType.Success, DemoImages.SunsetRuins)
        ];

    private static DemoReleaseItem CreateRelease(string id, string number, string note, string badge, UIBadgeType badgeStyle, string picture)
        => new() { Id = id, Icon = DemoIcons.Upload, Title = $"Release {number}", Description = note, BadgeText = badge, BadgeStyle = badgeStyle, Picture = picture };

    /// <summary>
    /// The ordinary list with a box, a select and a switch over it, against a collection it holds whole, all in the browser: the box
    /// narrows as the viewer types, the select while it holds a region, and the switch sorts by name while it is on — a sort rule gated
    /// on another component's value, like a filter, so the order comes back when it is off. A list with nothing left to show says so
    /// through an empty template worded for the screen.
    /// </summary>
    /// <remarks>The rows are the rich kind — a glyph, two lines and a badge at the end — since a list is rarely a column of names.</remarks>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateExample("Narrowed and sorted",
            UILayout.Stack(0)
                .AddChild(UILayout.Columns(12,
                        new TextInputComponent(FilterId)
                            .SetPlaceholder("Filter services")
                            .SetPrefixIcon(DemoIcons.Search)
                            .SetShowClearButton()
                            .SetDebounceMilliseconds(150),
                        new SelectComponent(RegionId)
                            .SetPlaceholder("Any region")
                            .SetShowClearButton()
                            .SetOptions(
                            [
                                new OptionItem { Id = "Europe West", Title = "Europe West" },
                                new OptionItem { Id = "US East", Title = "US East" },
                                new OptionItem { Id = "Asia South", Title = "Asia South" }
                            ]),
                        new SwitchComponent(SortId)
                            .SetTitle("Sort by name")
                            .SetVerticalAlignment(UIAlignment.Center)
                    )
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                )
                .AddChild(new ItemsViewComponent()
                    .SetItems(DemoSamples.Services(grouped: false))
                    .FilterBy(FilterId, IInputComponent.ValueProperty, nameof(TextItem.Title))
                    .FilterBy(RegionId, IInputComponent.ValueProperty, nameof(DemoServiceItem.Region), UIComparisonOperator.Equal)
                    .SortBy(SortId, IInputComponent.ValueProperty, nameof(TextItem.Title), UIItemsSortDirection.Ascending, UIComparisonOperator.Equal, true)
                    .SetSpacing(4)
                    .SetTemplate(new TextComponent()
                        .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
                        .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                    .ConfigureDefaultEmptyTemplate(template => _ = template
                        .SetIcon(DemoIcons.Outline(DemoIcons.Search))
                        .SetTitle("No service matches")
                        .SetDescription("Loosen the box or the region.")
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                ),
            note: "Two filters and a sort on one list, all in the browser; type what no service holds and the empty template takes the list's place. The inbox and the catalogue under Screens are the same list with more of them."
        );
    }

    /// <summary>
    /// The group is carried by the item and the header drawn by the group template, a labelled rule; the rows are one line each.
    /// </summary>
    private static ContainerComponent CreateGroupedGroup()
    {
        return DemoUI.CreateExample("Bucketed by region",
            new ItemsViewComponent()
                .SetItems(DemoSamples.Services())
                .SetSpacing(4)
                .SetTemplate(new TextComponent()
                    .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                    .SetIconColor(UIThemeColor.Muted)
                    .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                    .AsBody()
                    .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
                    .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
                    .SetBadgePlacement(UITextBadgePlacement.Trailing)
                )
        );
    }

    /// <summary>
    /// The other layout: tiles that wrap, each a picture over two lines and a badge — the shelf's shape, at a group's width.
    /// </summary>
    private static ContainerComponent CreateTilesGroup()
    {
        return DemoUI.CreateExample("Tiles that wrap",
            new ItemsViewComponent()
                .SetItems(CreateReleases())
                .SetLayoutType(UIItemsLayoutType.Wrap)
                .SetSpacing(12)
                .SetRowHoverable(true)
                .SetTemplate(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(200))
                    .SetPadding(UIThickness.Uniform(0))
                    .SetContent(UILayout.Stack(0,
                        new ImageComponent()
                            .BindSource(nameof(DemoReleaseItem.Picture), UIBindingScope.Relative)
                            .BindAltText(nameof(TextItem.Title), UIBindingScope.Relative)
                            .SetFit(UIImageFit.Cover)
                            .SetHeight(UILayoutLength.Absolute(88))
                            .SetCornerRadius(UICornerRadius.Top(8)),
                        new TextComponent()
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .AsBody()
                            .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
                            .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
                            .SetMargin(UIThickness.All(10, 8, 10, 10))
                        )
                    )
                ),
            note: "A tile is a card's shape without a card's regions; the catalogue under Screens is a page of them. The pointer's wash lies over the tile's own ground, and the arrows walk the tiles on both axes."
        );
    }

    /// <summary>
    /// A row moves the moment it is dropped, ahead of the command; the controller's answer then settles it. Where the controller puts
    /// the row elsewhere the row goes there, and where it refuses the row goes back.
    /// </summary>
    private static ContainerComponent CreateQueueGroup()
    {
        return DemoUI.CreateExample("The controller has the last word",
            new ItemsViewComponent()
                .BindItems(nameof(DeployQueueGroupContext.Deploys), UIBindingScope.Relative)
                .SetDraggable(true)
                .OnItemMoveWithItemKey(nameof(ItemsViewController.MoveDeploy))
                .SetSpacing(4)
                .SetTemplate(new TextComponent()
                    .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                    .SetIconColor(UIThemeColor.Muted)
                    .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                    .AsBody()
                    .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
                    .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
                    .SetBadgePlacement(UITextBadgePlacement.Trailing)
                ),
            note: "Drop panel #311 above the running deploy: it stands first at once, then settles second, where the controller put it. Drag dns #97 anywhere: it moves, then goes back, because the controller refused. The running deploy itself cannot be dragged (`CanDrag = false`).",
            context: QueueGroup
        );
    }

    /// <summary>
    /// Rows put in order two ways. By a drag of the whole row, or by Alt+Up and Alt+Down: the drop hands the controller the row's key and
    /// the place it takes, and the controller moves the row in its collection — or does not. By the grip at a row's end alone
    /// (<c>DragHandle</c>): the rest of the row is the reader's, so a command in it is selected and copied rather than taken for a drag.
    /// </summary>
    private static ContainerComponent CreateOrderGroup()
    {
        return DemoUI.CreateExample("Put in order",
            UILayout.Columns(24,
                DemoUI.CreateLabelled("By a drag: the order a release reaches the services in", new ItemsViewComponent()
                    .BindItems(nameof(RolloutOrderGroupContext.Services), UIBindingScope.Relative)
                    .SetDraggable(true)
                    .OnItemMoveWithItemKey(nameof(ItemsViewController.MoveService))
                    .SetSpacing(4)
                    .SetTemplate(new TextComponent()
                        .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
                        .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                ),
                DemoUI.CreateLabelled("By a grip: a failover's steps in the order they are run", new ItemsViewComponent()
                    .BindItems(nameof(RolloutOrderGroupContext.Steps), UIBindingScope.Relative)
                    .SetDraggable(true)
                    .SetDragHandle(true)
                    // A step's command is copied out of the list, so its words select, as a row's do not by default.
                    .SetTextSelectable(true)
                    .OnItemMoveWithItemKey(nameof(ItemsViewController.MoveStep))
                    .SetSpacing(4)
                    .SetTemplate(new TextComponent()
                        .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
            ),
            columns: 24,
            note: "Drag a row between two others, or put the keyboard on it and press Alt+Up or Alt+Down. The status page cannot be dragged (`CanDrag = false`), and a row dropped above it is refused. In the second list only the grip at a row's end drags it; the rest of the row keeps its words, which `SetTextSelectable(true)` lets the reader select and copy — a row's are not selected by default. The grip may stand at the start instead (`SetDragHandle(UIDragHandlePlacement.Start)`, or DragHandlePlacement among the options).",
            context: OrderGroup
        );
    }

    /// <summary>
    /// Three lists of one kind of card: a card dragged from one into another moves there, several chosen ones together; Ctrl (⌥ on a Mac)
    /// copies instead, and the notes, which are no list of cards, always take a copy of the titles.
    /// </summary>
    private static ContainerComponent CreateBoardGroup()
    {
        return DemoUI.CreateExample("Between lists",
            UILayout.Stack(16)
                .AddChild(UILayout.Columns(24,
                        CreateBoardList(BoardGroupContext.Todo, BoardGroupContext.TodoTitle, nameof(BoardGroupContext.TodoCards)),
                        CreateBoardList(BoardGroupContext.Doing, BoardGroupContext.DoingTitle, nameof(BoardGroupContext.DoingCards)),
                        CreateBoardList(BoardGroupContext.Done, BoardGroupContext.DoneTitle, nameof(BoardGroupContext.DoneCards))
                    )
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Notes")
                    .SetPlaceholder("Drop a card here to note it")
                    .BindValue(nameof(BoardGroupContext.Notes), UIBindingScope.Relative)
                    .OnDrop(BoardGroupContext.CardKind, nameof(ItemsViewController.NoteCards))
                ),
            columns: 24,
            note: "Drag a card from one list into another: it moves there at once, and stays if the controller moves it too. Ctrl+click chooses several, and they go together. Hold Ctrl (⌥ on a Mac) as you let go to copy instead. Drop a card on the notes and its title is written there: the notes are no list of cards, so they take a copy. From the keyboard: Ctrl+X or Ctrl+C on a card, then Ctrl+V in another list, after its keyboard's card.",
            context: BoardGroup
        );
    }

    /// <summary>One list of the board: it offers its cards as the kind it takes back, and moves its own among themselves.</summary>
    private static StackPanelComponent CreateBoardList(string id, string title, string items)
        => DemoUI.CreateLabelled(title, new ItemsViewComponent(id)
            .BindItems(items, UIBindingScope.Relative)
            .SetDragKind(BoardGroupContext.CardKind)
            .SetDraggable(true)
            .SetSelectionMode(UISelectionMode.Many)
            .OnItemMove(nameof(ItemsViewController.MoveCard), UIAction.Arg("list", id), UIAction.ArgCurrentItemKey("id"), UIAction.ArgEventValue("index"))
            .OnDrop(BoardGroupContext.CardKind, nameof(ItemsViewController.DropCards), UIAction.Arg("list", id))
            .SetSpacing(4)
            .SetMinHeight(UILayoutLength.Absolute(160))
            .SetTemplate(new TextComponent()
                .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                .AsBody()
                .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                .SetDescriptionColor(UIThemeColor.Muted)
            )
        );

    /// <summary>
    /// A row's own menu, two ways. A file's frequent actions stand in a bar above its row's end, the rest behind the bar's "…" (which
    /// leaves out what the bar shows; a right-click opens the whole menu), one menu for both; the row itself opens the file on a press, and a press on the bar is never the row's. A feed draws two templates over one
    /// collection: the entry's <c>Kind</c> picks the variant, so writing it redraws that row, its context menu included; a picture has no
    /// fixed size, so its row grows when it arrives and the feed stays at its end.
    /// </summary>
    private static ContainerComponent CreateRowMenusGroup()
    {
        return DemoUI.CreateExample("A row's own menu",
            UILayout.Columns(24,
                DemoUI.CreateLabelled("Actions over a row", new ItemsViewComponent()
                    .BindItems(nameof(RowMenusGroupContext.Files), UIBindingScope.Relative)
                    .SetRowHoverable(true)
                    .SetSpacing(2)
                    .OnItemClickWithItemKey(nameof(ItemsViewController.OpenFile))
                    .SetTemplate(new TextComponent()
                        .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(8, 6, 8, 6))
                        .SetContextMenu(new MenuComponent()
                            .SetItems(FileActions)
                            .OnItemClick(nameof(ItemsViewController.FileAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TextItem.Id)))
                        )
                        .SetActionBar(UIActionBarAlignment.End, repeatInMore: false)
                    )
                ),
                DemoUI.CreateLabelled("A feed of two kinds", new ItemsViewComponent()
                    .BindItems(nameof(RowMenusGroupContext.Entries), UIBindingScope.Relative)
                    .SetTemplateKeyProperty(nameof(DemoFeedItem.Kind))
                    .SetFallbackTemplateKey(RowMenusGroupContext.NoteKind)
                    .AddTemplateVariant(RowMenusGroupContext.NoteKind, new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetPadding(UIThickness.All(10, 8, 10, 8))
                        .SetContextMenu(CreateFeedMenu())
                        .SetContent(new TextComponent()
                            .BindTitle(nameof(DemoFeedItem.Title), UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .BindDescription(nameof(DemoFeedItem.Description), UIBindingScope.Relative)
                            .SetDescriptionType(UITextAppearance.Body)
                        )
                    )
                    .AddTemplateVariant(RowMenusGroupContext.ImageKind, new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetPadding(UIThickness.All(10, 8, 10, 8))
                        .SetContextMenu(CreateFeedMenu())
                        .SetContent(UILayout.Stack(6)
                            .AddChild(new TextComponent()
                                .BindTitle(nameof(DemoFeedItem.Title), UIBindingScope.Relative)
                                .SetTitleType(UITextAppearance.Caption)
                                .SetTitleColor(UIThemeColor.Muted)
                            )
                            // No height: the picture is drawn at its own proportions, so the row grows when it has loaded.
                            .AddChild(new ImageComponent()
                                .BindSource(nameof(DemoFeedItem.Source), UIBindingScope.Relative)
                                .BindAltText(nameof(DemoFeedItem.Description), UIBindingScope.Relative)
                                .SetMaxWidth(UILayoutLength.Absolute(360))
                                .SetMaxHeight(UILayoutLength.Absolute(240))
                                .SetCornerRadius(UICornerRadius.Uniform(6))
                            )
                            .AddChild(new TextComponent()
                                .BindTitle(nameof(DemoFeedItem.Description), UIBindingScope.Relative)
                                .SetTitleType(UITextAppearance.Caption)
                            )
                        )
                    )
                    .VerticalScrollOnly()
                    .AnchorToEnd()
                    .SetSpacing(8)
                    .SetHeight(UILayoutLength.Absolute(300))
                )
            ),
            columns: 24,
            note: "Press a file, or Tab into the list and arrow to one: share, download and delete stand in a bar above the row's end, and the … opens the rest of the menu (a right click opens all of it); Tab again goes into the bar. A press on the row opens the file and shows its bar; a press on the bar runs only its entry. On a phone a tap does the same, and a long press opens the menu with the bar's icons atop it. "
                + "Right-click or long-press a feed entry: a note offers copy and pin, a picture open and save — the menu is the entry's own list. Flip the newest and right-click it again: the row is drawn in the other kind with the other kind's menu. Post a picture: its size is not known until it has loaded, and the feed stays at its end as the row grows.",
            context: RowMenusGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Post a note"] = nameof(ItemsViewController.PostNote),
                ["Post a picture"] = nameof(ItemsViewController.PostPicture),
                ["Flip the newest"] = nameof(ItemsViewController.FlipNewest)
            })
        );
    }

    /// <summary>A row's context menu over the entry's own list; the press names the entry pressed and the row it was opened on.</summary>
    private static MenuComponent CreateFeedMenu()
        => new MenuComponent()
            .BindItems(nameof(DemoFeedItem.Menu), UIBindingScope.Relative)
            .OnItemClick(nameof(ItemsViewController.FeedMenuAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(DemoFeedItem.Id)));
}
