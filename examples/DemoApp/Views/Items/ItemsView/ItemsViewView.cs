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
/// The list is capped at a height it does not fill, so <c>VerticalScroll</c> has something to do. The strip is author-declared data;
/// the other lists a controller answers for are pinned, moved, posted to or flipped by it. Filters and sorts over a list, and tiles
/// that wrap, are the catalogue's and the inbox's under Screens; a source too large to send whole, and a list filtered in the page or
/// on the server, the large lists' page; a moment in words the Words page.
/// </remarks>
internal sealed class ItemsViewView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ItemsGroup = nameof(ItemsViewController.ItemsGroup);
    private const string ServicesGroup = nameof(ItemsViewController.ServicesGroup);
    private const string RowMenusGroup = nameof(ItemsViewController.RowMenusGroup);
    private const string OrderGroup = nameof(ItemsViewController.OrderGroup);
    private const string BoardGroup = nameof(ItemsViewController.BoardGroup);

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
    protected override (string Route, string Title)? ComposedIn => ("/mechanisms/lists", "demo.nav.mechanisms.lists");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ItemsViewComponent()
            .BindStandard()
            .BindItems<ItemsViewController>(static x => x.ItemsGroup.Items)
            .BindLayoutType<ItemsViewController>(static x => x.ItemsGroup.LayoutType)
            .BindOrientation<ItemsViewController>(static x => x.ItemsGroup.Orientation)
            .BindSpacing<ItemsViewController>(static x => x.ItemsGroup.Spacing)
            .BindPadding<ItemsViewController>(static x => x.ItemsGroup.Padding)
            .BindHorizontalScroll<ItemsViewController>(static x => x.ItemsGroup.HorizontalScroll)
            .BindVerticalScroll<ItemsViewController>(static x => x.ItemsGroup.VerticalScroll)
            .BindScrollSnap<ItemsViewController>(static x => x.ItemsGroup.ScrollSnap)
            .BindScrollAnchor<ItemsViewController>(static x => x.ItemsGroup.ScrollAnchor)
            .BindSelectionMode<ItemsViewController>(static x => x.ItemsGroup.SelectionMode)
            .BindSelectedKey<ItemsViewController>(static x => x.ItemsGroup.SelectedKey)
            .BindSelectedKeys<ItemsViewController>(static x => x.ItemsGroup.SelectedKeys)
            .BindSelectionStyle<ItemsViewController>(static x => x.ItemsGroup.SelectionStyle)
            .BindDraggable<ItemsViewController>(static x => x.ItemsGroup.Draggable)
            .BindDragHandle<ItemsViewController>(static x => x.ItemsGroup.DragHandle)
            .BindDragHandlePlacement<ItemsViewController>(static x => x.ItemsGroup.DragHandlePlacement)
            .OnItemMoveWithItemKey(nameof(ItemsViewController.MoveItem))
            // One line per row: the properties are the exhibit here, the richer rows are in the examples below.
            .SetTemplate(new TextComponent().SetTitleType(UITextAppearance.Body).BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative))
            // Room for every row at the default spacing: at 240 the last row stood cut by four pixels, a scroll that read as a fault.
            .SetMaxHeight(UILayoutLength.Absolute(264))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 320);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ItemsGroup, "Items")
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateStripGroup(), .. DemoUI.CreateColumns([CreateGroupedGroup()], [CreateOrderGroup()]), CreateBoardGroup(), CreateRowMenusGroup()];

    /// <summary>
    /// A row of cards that scrolls sideways and stops on a card; the host is the scroller.
    /// </summary>
    private static ContainerComponent CreateStripGroup()
    {
        return DemoUI.CreateExample("Horizontal card strip",
            new ItemsViewComponent()
                .SetItems(CreateReleases())
                .SetOrientation(UIOrientation.Horizontal)
                .HorizontalScrollOnly()
                .SetScrollSnap(UIScrollSnapMode.Mandatory)
                .SetSpacing(12)
                .SetTemplate(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Surface)
                    .SetWidth(UILayoutLength.Absolute(220))
                    .SetContent(new TextComponent()
                        .BindIcon<TextItem>(static x => x.Icon, UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Default)
                        .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Subtitle)
                        .BindDescription<TextItem>(static x => x.Description, UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .BindBadgeTitle<TextItem>(static x => x.BadgeTitle, UIBindingScope.Relative)
                        .BindBadgeVariant<TextItem>(static x => x.BadgeVariant, UIBindingScope.Relative)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                ),
            columns: 24,
            note: "A strip runs across the page rather than down a column: the cards scroll sideways, and a narrow box would hide most of them."
        );
    }

    private static TextItem[] CreateReleases()
        =>
        [
            CreateRelease("r481", "481", "Raised the health gate to ten minutes.", "Live", UIBadgeVariant.Success),
            CreateRelease("r480", "480", "DNS zone rebuild moved off the deploy path.", "Rolled back", UIBadgeVariant.Warning),
            CreateRelease("r479", "479", "Billing retries with jitter.", "Live", UIBadgeVariant.Success),
            CreateRelease("r478", "478", "Metrics kept for thirteen months.", "Live", UIBadgeVariant.Success),
            CreateRelease("r477", "477", "Mail relay paused for the provider migration.", "Paused", UIBadgeVariant.Surface),
            CreateRelease("r476", "476", "Invoices export as CSV.", "Live", UIBadgeVariant.Success)
        ];

    private static TextItem CreateRelease(string id, string number, string note, string badge, UIBadgeVariant badgeVariant)
        => new() { Id = id, Icon = DemoIcons.Upload, Title = $"Release {number}", Description = note, BadgeTitle = badge, BadgeVariant = badgeVariant };

    /// <summary>
    /// The group is carried by the item and the header drawn by the group template, a labelled rule; the rows are one line each. A pin
    /// puts a service at the head under a group the list did not hold, and the list draws that group first, where the source has it;
    /// Enter or a double click opens a row, apart from the pin's press.
    /// </summary>
    private static ContainerComponent CreateGroupedGroup()
    {
        return DemoUI.CreateExample("Grouped sections",
            new ItemsViewComponent()
                .BindItems<PinnedServicesGroupContext>(static x => x.Services, UIBindingScope.Relative)
                .SetSpacing(4)
                .OnItemOpenWithItemKey(nameof(ItemsViewController.OpenService))
                .SetTemplate(new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .AddChild(new TextComponent()
                        .BindIcon<TextItem>(static x => x.Icon, UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription<TextItem>(static x => x.Description, UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .BindBadgeTitle<TextItem>(static x => x.BadgeTitle, UIBindingScope.Relative)
                        .BindBadgeVariant<TextItem>(static x => x.BadgeVariant, UIBindingScope.Relative)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    // Two buttons in one cell, one of them collapsed: the row says which way a press goes.
                    .AddChild(UIIconButtons.Pin()
                        .SetSize(UISize.Small)
                        .SetMargin(UIThickness.All(8, 0, 0, 0))
                        .SetVerticalAlignment(UIAlignment.Center)
                        .BindVisibility<DemoPinnableService>(static x => x.PinVisibility, UIBindingScope.Relative)
                        .OnClick(nameof(ItemsViewController.TogglePin), UIAction.ArgCurrentItemKey("id"))
                        .SetPlacement(24, 1, 1, 1)
                    )
                    .AddChild(UIIconButtons.Unpin()
                        .SetSize(UISize.Small)
                        .SetMargin(UIThickness.All(8, 0, 0, 0))
                        .SetVerticalAlignment(UIAlignment.Center)
                        .BindVisibility<DemoPinnableService>(static x => x.UnpinVisibility, UIBindingScope.Relative)
                        .OnClick(nameof(ItemsViewController.TogglePin), UIAction.ArgCurrentItemKey("id"))
                        .SetPlacement(24, 1, 1, 1)
                    )
                ),
            note: "The group is the row's own (`Group`), its header a labelled rule. Pin a service: it is taken out and put back at the head under Pinned, a group the list did not hold, and the list draws that group first because the source has it first. Unpin it and it goes back to its region. Double-click a row, or put the keyboard on it and press Enter, to open it (`OnItemOpenWithItemKey`); a press on the pin is the pin's alone.",
            context: ServicesGroup
        );
    }

    /// <summary>
    /// Rows put in order two ways. By a drag of the whole row, or by Alt+Up and Alt+Down: the row moves the moment it is dropped, and
    /// the controller's answer settles it — where the controller puts it elsewhere the row goes there, and where it refuses the row goes
    /// back. By the grip at a row's end alone (<c>DragHandle</c>): the rest of the row is the reader's, so a command in it is selected
    /// and copied rather than taken for a drag.
    /// </summary>
    private static ContainerComponent CreateOrderGroup()
    {
        return DemoUI.CreateExample("Drag-and-drop reordering",
            UILayout.Stack(16,
                DemoUI.CreateLabelled("By a drag: the deploy queue, whose order the controller keeps", new ItemsViewComponent()
                    .BindItems<DeployQueueGroupContext>(static x => x.Deploys, UIBindingScope.Relative)
                    .SetDraggable(true)
                    .OnItemMoveWithItemKey(nameof(ItemsViewController.MoveDeploy))
                    .SetSpacing(4)
                    .SetTemplate(new TextComponent()
                        .BindIcon<TextItem>(static x => x.Icon, UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription<TextItem>(static x => x.Description, UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .BindBadgeTitle<TextItem>(static x => x.BadgeTitle, UIBindingScope.Relative)
                        .BindBadgeVariant<TextItem>(static x => x.BadgeVariant, UIBindingScope.Relative)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                ),
                DemoUI.CreateLabelled("By a grip: a failover's steps in the order they are run", new ItemsViewComponent()
                    .BindItems<DeployQueueGroupContext>(static x => x.Steps, UIBindingScope.Relative)
                    .SetDraggable(true)
                    .SetDragHandle(true)
                    // A step's command is copied out of the list, so its words select, as a row's do not by default.
                    .SetTextSelectable(true)
                    .OnItemMoveWithItemKey(nameof(ItemsViewController.MoveStep))
                    .SetSpacing(4)
                    .SetTemplate(new TextComponent()
                        .BindIcon<TextItem>(static x => x.Icon, UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription<TextItem>(static x => x.Description, UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
            ),
            note: "Drag a row between two others, or put the keyboard on it and press Alt+Up or Alt+Down: it moves at once, and the controller has the last word. Drop panel #311 above the running deploy: it stands first, then settles second, where the controller put it. Drag dns #97 anywhere: it moves, then goes back, because the controller refused. The running deploy itself cannot be dragged (`CanDrag = false`). In the second list only the grip at a row's end drags it; the rest of the row keeps its words, which `SetTextSelectable(true)` lets the reader select and copy — a row's are not selected by default. The grip may stand at the start instead (`SetDragHandle(UIDragHandlePlacement.Start)`, or DragHandlePlacement among the options).",
            context: OrderGroup
        );
    }

    /// <summary>
    /// Three lists of one kind of card: a card dragged from one into another moves there, several chosen ones together; Ctrl (⌥ on a Mac)
    /// copies instead, and the notes, which are no list of cards, always take a copy of the titles. The routines offer their cards for a
    /// copy alone (<c>DragEffects</c>), so the board takes a new card and the routine stays.
    /// </summary>
    private static ContainerComponent CreateBoardGroup()
    {
        return DemoUI.CreateExample("Cross-list drag and drop",
            UILayout.Stack(16)
                .AddChild(UILayout.Columns(24,
                        DemoUI.CreateLabelled(BoardGroupContext.RoutinesTitle, new ItemsViewComponent(BoardGroupContext.Routines)
                            .BindItems<BoardGroupContext>(static x => x.RoutineCards, UIBindingScope.Relative)
                            .SetDragKind(BoardGroupContext.CardKind)
                            .SetDragEffects(UIDragEffects.Copy)
                            .SetSpacing(4)
                            .SetMinHeight(UILayoutLength.Absolute(160))
                            .SetTemplate(new TextComponent()
                                .SetIcon(DemoIcons.Outline(DemoIcons.History))
                                .SetIconColor(UIThemeColor.Muted)
                                .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                                .AsBody()
                                .BindDescription<TextItem>(static x => x.Description, UIBindingScope.Relative)
                                .SetDescriptionColor(UIThemeColor.Muted)
                            )
                        ),
                        CreateBoardList(BoardGroupContext.Todo, BoardGroupContext.TodoTitle, nameof(BoardGroupContext.TodoCards)),
                        CreateBoardList(BoardGroupContext.Doing, BoardGroupContext.DoingTitle, nameof(BoardGroupContext.DoingCards)),
                        CreateBoardList(BoardGroupContext.Done, BoardGroupContext.DoneTitle, nameof(BoardGroupContext.DoneCards))
                    )
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Notes")
                    .SetPlaceholder("Drop a card here to note it")
                    .BindValue<BoardGroupContext>(static x => x.Notes, UIBindingScope.Relative)
                    .OnDrop(BoardGroupContext.CardKind, nameof(ItemsViewController.NoteCards))
                ),
            columns: 24,
            note: "Drag a card from one list into another: it moves there at once, and stays if the controller moves it too. Ctrl+click chooses several, and they go together. Hold Ctrl (⌥ on a Mac) as you let go to copy instead. The routines lend copies only (`SetDragEffects(UIDragEffects.Copy)`): drag one onto the board and a new card stands there, the routine staying where it was, Ctrl or not. Drop a card on the notes and its title is written there: the notes are no list of cards, so they take a copy. From the keyboard: Ctrl+X or Ctrl+C on a card, then Ctrl+V in another list, after its keyboard's card; a routine takes Ctrl+C alone.",
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
                .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                .AsBody()
                .BindDescription<TextItem>(static x => x.Description, UIBindingScope.Relative)
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
        return DemoUI.CreateExample("Row context & overflow menus",
            UILayout.Columns(24,
                DemoUI.CreateLabelled("Actions over a row", new ItemsViewComponent()
                    .BindItems<RowMenusGroupContext>(static x => x.Files, UIBindingScope.Relative)
                    .SetRowHoverable(true)
                    .SetSpacing(2)
                    .OnItemClickWithItemKey(nameof(ItemsViewController.OpenFile))
                    .SetTemplate(new TextComponent()
                        .BindIcon<TextItem>(static x => x.Icon, UIBindingScope.Relative)
                        .SetIconColor(UIThemeColor.Muted)
                        .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                        .AsBody()
                        .BindDescription<TextItem>(static x => x.Description, UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetMargin(UIThickness.All(8, 6, 8, 6))
                        .SetContextMenu(new MenuComponent()
                            .SetItems(FileActions)
                            .OnItemClick(nameof(ItemsViewController.FileAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(TextItem.Id)))
                        )
                        .SetActionBar(UIActionBarAlignment.End, repeatInMore: false)
                    )
                ),
                DemoUI.CreateLabelled("A feed of two kinds", UILayout.Stack(4)
                    .AddChild(new ItemsViewComponent()
                        .BindItems<RowMenusGroupContext>(static x => x.Entries, UIBindingScope.Relative)
                        .BindFirstVisibleKey<RowMenusGroupContext>(static x => x.TopEntry, UIBindingScope.Relative)
                        .BindLastVisibleKey<RowMenusGroupContext>(static x => x.BottomEntry, UIBindingScope.Relative)
                        .SetTemplateKeyProperty(nameof(DemoFeedItem.Kind))
                        .SetFallbackTemplateKey(RowMenusGroupContext.NoteKind)
                        .AddTemplateVariant(RowMenusGroupContext.NoteKind, new SurfaceComponent()
                            .SetSurface(UISurfaceStyle.Surface)
                            .SetPadding(UIThickness.All(10, 8, 10, 8))
                            .SetContextMenu(CreateFeedMenu())
                            .SetContent(new TextComponent()
                                .BindTitle<DemoFeedItem>(static x => x.Title, UIBindingScope.Relative)
                                .SetTitleType(UITextAppearance.Caption)
                                .SetTitleColor(UIThemeColor.Muted)
                                .BindDescription<DemoFeedItem>(static x => x.Description, UIBindingScope.Relative)
                                .SetDescriptionType(UITextAppearance.Body)
                            )
                        )
                        .AddTemplateVariant(RowMenusGroupContext.ImageKind, new SurfaceComponent()
                            .SetSurface(UISurfaceStyle.Surface)
                            .SetPadding(UIThickness.All(10, 8, 10, 8))
                            .SetContextMenu(CreateFeedMenu())
                            .SetContent(UILayout.Stack(6)
                                .AddChild(new TextComponent()
                                    .BindTitle<DemoFeedItem>(static x => x.Title, UIBindingScope.Relative)
                                    .SetTitleType(UITextAppearance.Caption)
                                    .SetTitleColor(UIThemeColor.Muted)
                                )
                                // No height: the picture is drawn at its own proportions, so the row grows when it has loaded.
                                .AddChild(new ImageComponent()
                                    .BindSource<DemoFeedItem>(static x => x.Source, UIBindingScope.Relative)
                                    .BindAltText<DemoFeedItem>(static x => x.Description, UIBindingScope.Relative)
                                    .SetMaxWidth(UILayoutLength.Absolute(360))
                                    .SetMaxHeight(UILayoutLength.Absolute(240))
                                    .SetBorderRadius(UICornerRadius.Uniform(6))
                                )
                                .AddChild(new TextComponent()
                                    .BindTitle<DemoFeedItem>(static x => x.Description, UIBindingScope.Relative)
                                    .SetTitleType(UITextAppearance.Caption)
                                )
                            )
                        )
                        .VerticalScrollOnly()
                        .AnchorToEnd()
                        .SetSpacing(8)
                        .SetHeight(UILayoutLength.Absolute(300))
                    )
                    // The page writes the entries at the feed's top and foot back as the reader scrolls; the setters word them here.
                    .AddChild(new TextComponent()
                        .BindTitle<RowMenusGroupContext>(static x => x.InView, UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                    )
                )
            ),
            columns: 24,
            note: "Press a file, or Tab into the list and arrow to one: share, download and delete stand in a bar above the row's end, and the … opens the rest of the menu (a right click opens all of it); Tab again goes into the bar. A press on the row opens the file and shows its bar; a press on the bar runs only its entry. On a phone a tap does the same, and a long press opens the menu with the bar's icons atop it. "
                + "Right-click or long-press a feed entry: a note offers copy and pin, a picture open and save — the menu is the entry's own list. Flip the newest and right-click it again: the row is drawn in the other kind with the other kind's menu. Post a picture: its size is not known until it has loaded, and the feed stays at its end as the row grows. "
                + "Scroll the feed: once it comes to rest, the line under it names the entries at its top and its foot — the page writes the keys back (`BindFirstVisibleKey`, `BindLastVisibleKey`), and the controller's setters word them.",
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
            .BindItems<DemoFeedItem>(static x => x.Menu, UIBindingScope.Relative)
            .OnItemClick(nameof(ItemsViewController.FeedMenuAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(DemoFeedItem.Id)));
}
