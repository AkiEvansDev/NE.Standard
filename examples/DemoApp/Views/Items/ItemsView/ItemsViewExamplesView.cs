using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Views.Base;

namespace DemoApp.Views.Items.ItemsView;

/// <summary>
/// What a template over a collection is used for, one screen per job.
/// </summary>
/// <remarks>Every list but the feed is author-declared data; the feed needs a controller to write the kind.</remarks>
internal sealed class ItemsViewExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string FeedGroup = nameof(ItemsViewExamplesController.FeedGroup);
    private const string OrderGroup = nameof(ItemsViewExamplesController.OrderGroup);
    private const string RunbookGroup = nameof(ItemsViewExamplesController.RunbookGroup);

    /// <summary>Ids of the two controls a list's rules name; a rule reads a component, not a value.</summary>
    private const string FilterId = "items-examples-filter";
    private const string RegionId = "items-examples-region";
    private const string SortId = "items-examples-sort";

    public static string ViewKey => "demo.items.items-view.examples";

    protected override string ComponentRoute => "/items/items-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.items.items-view.header";
    protected override string HeaderDescription => "demo.items.items-view.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(CreateStripGroup());

        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateFilterGroup(), CreateGroupedGroup(), CreateTilesGroup()],
            [CreateFeedGroup(), CreateSortGroup(), CreateEmptyGroup(), CreateOrderGroup(), CreateRunbookGroup()]
            )
        );
    }

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
    /// Rows put in order by a drag, or by Alt+Up and Alt+Down: the drop hands the controller the row's key and the place it takes, and
    /// the controller moves the row in its collection — or does not.
    /// </summary>
    private static ContainerComponent CreateOrderGroup()
    {
        return DemoUI.CreateExample("Put in order by a drag",
            new ItemsViewComponent()
                .BindItems(nameof(RolloutOrderGroupContext.Services), UIBindingScope.Relative)
                .SetDraggable(true)
                .OnItemMoveWithItemKey(nameof(ItemsViewExamplesController.MoveService))
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
            note: "The order a release reaches the services in. Drag a row between two others, or put the keyboard on it and press Alt+Up or Alt+Down. Nothing moves until the controller moves the row in its RecursiveCollection; the status page cannot be dragged (`CanDrag = false`), and a row dropped above it is refused.",
            context: OrderGroup
        );
    }

    /// <summary>
    /// Rows put in order by the grip at their end alone (<c>DragHandle</c>): the rest of the row is the reader's, so a command in it
    /// is selected and copied rather than taken for a drag.
    /// </summary>
    private static ContainerComponent CreateRunbookGroup()
    {
        return DemoUI.CreateExample("Put in order by a grip",
            new ItemsViewComponent()
                .BindItems(nameof(RunbookGroupContext.Steps), UIBindingScope.Relative)
                .SetDraggable(true)
                .SetDragHandle(true)
                .OnItemMoveWithItemKey(nameof(ItemsViewExamplesController.MoveStep))
                .SetSpacing(4)
                .SetTemplate(new TextComponent()
                    .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                    .SetIconColor(UIThemeColor.Muted)
                    .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                    .AsBody()
                    .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                    .SetDescriptionColor(UIThemeColor.Muted)
                ),
            note: "A failover's steps in the order they are run. Only the grip at a row's end drags it, and the keyboard moves the list's row by Alt+Up and Alt+Down; the rest of the row keeps its words, so a command is selected and copied like any text. The grip may stand at the start instead (`SetDragHandle(UIDragHandlePlacement.Start)`, or DragHandlePlacement on the Main page).",
            context: RunbookGroup
        );
    }

    /// <summary>
    /// The ordinary list with a box and a select over it, narrowed in the browser against a collection it holds whole: the
    /// box as the viewer types, the select while it holds a region, and a row passes both or is hidden.
    /// </summary>
    /// <remarks>The rows are the rich kind — a glyph, two lines and a badge at the end — since a list is rarely a column of names.</remarks>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateExample("A list narrowed as you type, and by region",
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
                            ])
                    )
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                )
                .AddChild(new ItemsViewComponent()
                    .SetItems(DemoSamples.Services(grouped: false))
                    .FilterBy(FilterId, IInputComponent.ValueProperty, nameof(TextItem.Title))
                    .FilterBy(RegionId, IInputComponent.ValueProperty, nameof(DemoServiceItem.Region), UIComparisonOperator.Equal)
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
                    )
                ),
            note: "Two rules on one list, both in the browser; the inbox and the catalogue under Screens are the same list with more of them."
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
    /// Two templates over one collection: the entry's <c>Kind</c> picks the variant, so writing it redraws that row.
    /// </summary>
    private static ContainerComponent CreateFeedGroup()
    {
        return DemoUI.CreateExample("A feed of two kinds",
            new ItemsViewComponent()
                .BindItems($"{FeedGroup}.{nameof(FeedGroupContext.Entries)}")
                .SetTemplateKeyProperty(nameof(DemoFeedItem.Kind))
                .SetFallbackTemplateKey(FeedGroupContext.NoteKind)
                .AddTemplateVariant(FeedGroupContext.NoteKind, new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetPadding(UIThickness.All(10, 8, 10, 8))
                    .SetContent(new TextComponent()
                        .BindTitle(nameof(DemoFeedItem.Title), UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                        .BindDescription(nameof(DemoFeedItem.Description), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .AddTemplateVariant(FeedGroupContext.ImageKind, new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetPadding(UIThickness.All(10, 8, 10, 8))
                    .SetContent(UILayout.Stack(6)
                        .AddChild(new TextComponent()
                            .BindTitle(nameof(DemoFeedItem.Title), UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ImageComponent()
                            .BindSource(nameof(DemoFeedItem.Source), UIBindingScope.Relative)
                            .BindAltText(nameof(DemoFeedItem.Description), UIBindingScope.Relative)
                            .SetFit(UIImageFit.Cover)
                            .SetHeight(UILayoutLength.Absolute(140))
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
                .SetHeight(UILayoutLength.Absolute(300)),
            context: FeedGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Post a note"] = nameof(ItemsViewExamplesController.PostNote),
                ["Flip the newest"] = nameof(ItemsViewExamplesController.FlipNewest)
            })
        );
    }

    /// <summary>
    /// Chips under a switch: a sort rule can be gated on another component's value, like a filter, and the order comes back when it is off.
    /// </summary>
    private static ContainerComponent CreateSortGroup()
    {
        return DemoUI.CreateExample("Sorted while a switch is on",
            UILayout.Stack(0)
                .AddChild(new SwitchComponent(SortId)
                    .SetTitle("Sort by name")
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                )
                .AddChild(new ItemsViewComponent()
                    .SetItems(CreateTeams())
                    .SortBy(SortId, IInputComponent.ValueProperty, nameof(TextItem.Title), UIItemsSortDirection.Ascending, UIComparisonOperator.Equal, true)
                    .SetLayoutType(UIItemsLayoutType.Wrap)
                    .SetSpacing(8)
                    .SetTemplate(new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Tinted)
                        .SetPadding(UIThickness.All(10, 6, 10, 6))
                        .SetContent(new TextComponent()
                            .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                        )
                        .SetPlacement(1, 1, 6, 1)
                    )
                )
        );
    }

    /// <summary>The chips the sort switch orders; declared out of order so the switch has something to do.</summary>
    private static TextItem[] CreateTeams()
        =>
        [
            CreateTeam("billing", "Billing", DemoIcons.Shield),
            CreateTeam("dns", "DNS", DemoIcons.Link),
            CreateTeam("mail", "Mail", DemoIcons.Mail),
            CreateTeam("metrics", "Metrics", DemoIcons.FileText),
            CreateTeam("identity", "Identity", DemoIcons.Lock),
            CreateTeam("panel", "Panel", DemoIcons.LayoutDashboard),
            CreateTeam("storage", "Storage", DemoIcons.Folder),
            CreateTeam("status", "Status", DemoIcons.Bell)
        ];

    private static TextItem CreateTeam(string id, string title, string icon)
        => new() { Id = id, Icon = icon, Title = title };

    /// <summary>
    /// A list with nothing in it says so, through an empty template worded for the screen.
    /// </summary>
    private static ContainerComponent CreateEmptyGroup()
    {
        return DemoUI.CreateExample("Nothing to show",
            new ItemsViewComponent()
                .SetItems([])
                .ConfigureDefaultEmptyTemplate(template => _ = template
                    .SetIcon(DemoIcons.Outline(DemoIcons.BadgeCheck))
                    .SetTitle("No open incidents")
                    .SetDescription("Everything that paged in the last seven days has been resolved.")
                )
        );
    }
}
