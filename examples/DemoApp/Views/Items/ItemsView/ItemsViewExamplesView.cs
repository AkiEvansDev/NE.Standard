using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Items.ItemsView;

/// <summary>
/// What a template over a collection is used for, one screen per job.
/// </summary>
/// <remarks>Every list but the feed is author-declared data; the feed needs a controller to write the kind.</remarks>
internal sealed class ItemsViewExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string FeedGroup = nameof(ItemsViewExamplesController.FeedGroup);

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
            [CreateFeedGroup(), CreateSortGroup(), CreateEmptyGroup()]
        ));
    }

    /// <summary>
    /// The ordinary list with a box and a select over it, narrowed in the browser against a collection it holds whole: the
    /// box as the viewer types, the select while it holds a region, and a row passes both or is hidden.
    /// </summary>
    /// <remarks>The rows are the rich kind — a glyph, two lines and a badge at the end — since a list is rarely a column of names.</remarks>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateGroup(null, "A list narrowed as you type, and by region",
            content => content
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
                            new OptionItem { Id = "Europe", Title = "Europe" },
                            new OptionItem { Id = "Americas", Title = "Americas" },
                            new OptionItem { Id = "Asia Pacific", Title = "Asia Pacific" }
                        ])
                )
                .SetMargin(UIThickness.All(0, 0, 0, 8))
                .SetPlacement(1, 1, 24, 1))
                .AddChild(new ItemsViewComponent()
                    .SetItems(CreateServices(grouped: false))
                    .FilterBy(FilterId, IInputComponent.ValueProperty, nameof(TextItem.Title))
                    .FilterBy(RegionId, IInputComponent.ValueProperty, nameof(DemoServiceItem.Region), UIComparisonOperator.Equal)
                    .SetSpacing(4)
                    .SetTemplate(CreateServiceRow())
                    .ConfigureDefaultEmptyTemplate(template => _ = template
                        .SetIcon(DemoIcons.Outline(DemoIcons.Search))
                        .SetTitle("No service matches")
                        .SetDescription("Loosen the box or the region.")
                    )
                    .SetPlacement(1, 2, 24, 1)
                ),
            note: "Two rules on one list, both in the browser; the inbox and the catalogue under Screens are the same list with more of them."
        );
    }

    /// <summary>A row with everything a service has to say: the glyph, the name, the line under it, and its state at the end.</summary>
    private static TextComponent CreateServiceRow()
        => new TextComponent()
            .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
            .SetIconColor(UIThemeColor.Muted)
            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
            .AsBody()
            .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
            .SetDescriptionColor(UIThemeColor.Muted)
            .BindBadgeText(nameof(TextItem.BadgeText), UIBindingScope.Relative)
            .BindBadgeStyle(nameof(TextItem.BadgeStyle), UIBindingScope.Relative)
            .SetBadgePlacement(UITextBadgePlacement.Trailing);

    /// <summary>
    /// Chips under a switch: a sort rule can be gated on another component's value, like a filter, and the order comes back when it is off.
    /// </summary>
    private static ContainerComponent CreateSortGroup()
    {
        return DemoUI.CreateGroup(null, "Sorted while a switch is on",
            content => content
                .AddChild(new SwitchComponent(SortId)
                    .SetTitle("Sort by name")
                    .SetMargin(UIThickness.All(0, 0, 0, 8))
                    .SetPlacement(1, 1, 24, 1)
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
                    .SetPlacement(1, 2, 24, 1)
                )
        );
    }

    /// <summary>
    /// The group is carried by the item and the header drawn by the group template, a labelled rule; the rows are one line each.
    /// </summary>
    private static ContainerComponent CreateGroupedGroup()
    {
        return DemoUI.CreateGroup(null, "Bucketed by region",
            content => content.AddChild(new ItemsViewComponent()
                .SetItems(CreateServices())
                .SetSpacing(4)
                .SetTemplate(CreateServiceRow())
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A list with nothing in it says so, through an empty template worded for the screen.
    /// </summary>
    private static ContainerComponent CreateEmptyGroup()
    {
        return DemoUI.CreateGroup(null, "Nothing to show",
            content => content.AddChild(new ItemsViewComponent()
                .SetItems([])
                .ConfigureDefaultEmptyTemplate(template => _ = template
                    .SetIcon(DemoIcons.Outline(DemoIcons.BadgeCheck))
                    .SetTitle("No open incidents")
                    .SetDescription("Everything that paged in the last seven days has been resolved.")
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A row of cards that scrolls sideways and stops on a card; the host is the scroller.
    /// </summary>
    private static ContainerComponent CreateStripGroup()
    {
        return DemoUI.CreateGroup(null, "A strip of cards",
            content => content.AddChild(new ItemsViewComponent()
                .SetItems(CreateReleases())
                .SetOrientation(UIOrientation.Horizontal)
                .HorizontalScrollOnly()
                .SetScrollSnap(UIScrollSnapMode.Mandatory)
                .SetSpacing(12)
                .SetTemplate(CreateReleaseCard())
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "A strip runs across the page rather than down a column: the cards scroll sideways, and a narrow box would hide most of them."
        );
    }

    private static SurfaceComponent CreateReleaseCard()
        => new SurfaceComponent()
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
            );

    /// <summary>
    /// The other layout: tiles that wrap, each a picture over two lines and a badge — the shelf's shape, at a group's width.
    /// </summary>
    private static ContainerComponent CreateTilesGroup()
    {
        return DemoUI.CreateGroup(null, "Tiles that wrap",
            content => content.AddChild(new ItemsViewComponent()
                .SetItems(CreateReleases())
                .SetLayoutType(UIItemsLayoutType.Wrap)
                .SetSpacing(12)
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
                    ))
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "A tile is a card's shape without a card's regions; the catalogue under Screens is a page of them."
        );
    }

    /// <summary>
    /// Two templates over one collection: the entry's <c>Kind</c> picks the variant, so writing it redraws that row.
    /// </summary>
    private static ContainerComponent CreateFeedGroup()
    {
        return DemoUI.CreateGroup(FeedGroup, "A feed of two kinds",
            content => content.AddChild(new ItemsViewComponent()
                .BindItems($"{FeedGroup}.{nameof(FeedGroupContext.Entries)}")
                .SetTemplateKeyProperty(nameof(DemoFeedItem.Kind))
                .SetFallbackTemplateKey(FeedGroupContext.NoteKind)
                .AddTemplateVariant(FeedGroupContext.NoteKind, CreateNoteTemplate())
                .AddTemplateVariant(FeedGroupContext.ImageKind, CreateImageTemplate())
                .VerticalScrollOnly()
                .AnchorToEnd()
                .SetSpacing(8)
                .SetHeight(UILayoutLength.Absolute(300))
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Post a note"] = nameof(ItemsViewExamplesController.PostNote),
                ["Flip the newest"] = nameof(ItemsViewExamplesController.FlipNewest)
            })
        );
    }

    private static SurfaceComponent CreateNoteTemplate()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetPadding(UIThickness.All(10, 8, 10, 8))
            .SetContent(new TextComponent()
                .BindTitle(nameof(DemoFeedItem.Title), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.Muted)
                .BindDescription(nameof(DemoFeedItem.Description), UIBindingScope.Relative)
                .SetDescriptionType(UITextAppearance.Body)
            );

    private static SurfaceComponent CreateImageTemplate()
        => new SurfaceComponent()
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
            );

    /// <summary>
    /// The author-declared services the lists on this page filter, sort and bucket without a round trip,
    /// bucketed or flat.
    /// </summary>
    private static DemoServiceItem[] CreateServices(bool grouped = true)
        =>
        [
            CreateService("payments-api", "Payments API", "12 replicas · eu-west-1", "Europe", "Healthy", UIBadgeType.Success, DemoIcons.Shield, grouped),
            CreateService("web-portal", "Web Portal", "4 replicas · eu-west-1", "Europe", "Healthy", UIBadgeType.Success, DemoIcons.LayoutDashboard, grouped),
            CreateService("search-indexer", "Search Indexer", "2 replicas · eu-central-1", "Europe", "Degraded", UIBadgeType.Warning, DemoIcons.Search, grouped),
            CreateService("mail-relay", "Mail Relay", "1 replica · us-east-1", "Americas", "Paused", UIBadgeType.Surface, DemoIcons.Mail, grouped),
            CreateService("report-builder", "Report Builder", "3 replicas · us-east-1", "Americas", "Healthy", UIBadgeType.Success, DemoIcons.FileText, grouped),
            CreateService("scheduler", "Scheduler", "1 replica · ap-south-1", "Asia Pacific", "Healthy", UIBadgeType.Success, DemoIcons.Clock, grouped)
        ];

    private static DemoServiceItem CreateService(string id, string title, string description, string region, string badge, UIBadgeType badgeStyle, string icon, bool grouped)
        => new() { Id = id, Icon = icon, Title = title, Description = description, BadgeText = badge, BadgeStyle = badgeStyle, Group = grouped ? region : null, Region = region };

    /// <summary>The chips the sort switch orders; declared out of order so the switch has something to do.</summary>
    private static TextItem[] CreateTeams()
        =>
        [
            CreateTeam("payments", "Payments", DemoIcons.Shield),
            CreateTeam("search", "Search", DemoIcons.Search),
            CreateTeam("mail", "Mail", DemoIcons.Mail),
            CreateTeam("billing", "Billing", DemoIcons.FileText),
            CreateTeam("identity", "Identity", DemoIcons.Lock),
            CreateTeam("portal", "Portal", DemoIcons.LayoutDashboard),
            CreateTeam("data", "Data", DemoIcons.Folder),
            CreateTeam("alerts", "Alerts", DemoIcons.Bell)
        ];

    private static TextItem CreateTeam(string id, string title, string icon)
        => new() { Id = id, Icon = icon, Title = title };

    private static DemoReleaseItem[] CreateReleases()
        =>
        [
            CreateRelease("r481", "481", "Raised the health gate to ten minutes.", "Live", UIBadgeType.Success, DemoImages.HarbourSky),
            CreateRelease("r480", "480", "Index rebuild moved off the deploy path.", "Rolled back", UIBadgeType.Warning, DemoImages.SunsetRuins),
            CreateRelease("r479", "479", "Payments retries with jitter.", "Live", UIBadgeType.Success, DemoImages.NightStreet),
            CreateRelease("r478", "478", "Search indexer on the new tokenizer.", "Live", UIBadgeType.Success, DemoImages.MeteorShore),
            CreateRelease("r477", "477", "Mail relay paused for the provider migration.", "Paused", UIBadgeType.Surface, DemoImages.HarbourSky),
            CreateRelease("r476", "476", "Report builder exports as CSV.", "Live", UIBadgeType.Success, DemoImages.SunsetRuins)
        ];

    private static DemoReleaseItem CreateRelease(string id, string number, string note, string badge, UIBadgeType badgeStyle, string picture)
        => new() { Id = id, Icon = DemoIcons.Upload, Title = $"Release {number}", Description = note, BadgeText = badge, BadgeStyle = badgeStyle, Picture = picture };
}
