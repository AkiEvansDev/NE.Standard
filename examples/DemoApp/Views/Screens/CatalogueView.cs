using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// Server offers narrowed in the browser. The list is served whole; a search box, a role, a price ceiling and a region
/// switch are four filter rules on it, a select carries three sort rules of which one is active, and only a press on a tile
/// reaches the server.
/// </summary>
internal sealed class CatalogueView : DemoScreenView, IUIViewDefinition
{
    private const string SearchId = "catalogue-search";
    private const string RoleId = "catalogue-role";
    private const string PriceId = "catalogue-price";
    private const string AvailableId = "catalogue-available";
    private const string SortId = "catalogue-sort";

    public static string ViewKey => "demo.screens.catalogue";

    protected override string ComponentRoute => "/screens/catalogue";
    protected override string Header => "demo.screens.catalogue.header";
    protected override string HeaderDescription => "demo.screens.catalogue.description";

    protected override IVisualComponent CreateScreen()
        => UILayout.Stack(16, CreateFilters(), CreateShelf())
            .SetPadding(UIThickness.All(0, 8, 0, 0))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>The controls the rules read, on one band; the order at its far end is the one thing bound to the server.</summary>
    private static SurfaceComponent CreateFilters()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Tinted)
            .SetPadding(UIThickness.All(16, 12, 16, 12))
            .SetContent(UILayout.Row(16,
                new TextInputComponent(SearchId)
                    .SetPlaceholder("Search the offers")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetShowClearButton()
                    .SetDebounceMilliseconds(150)
                    .SetWidth(UILayoutLength.Absolute(240)),
                new SelectComponent(RoleId)
                    .SetPlaceholder("Any role")
                    .SetShowClearButton()
                    .SetOptions(
                    [
                        new OptionItem { Id = CatalogueController.Api, Title = "API" },
                        new OptionItem { Id = CatalogueController.Web, Title = "Web" },
                        new OptionItem { Id = CatalogueController.Db, Title = "Database" },
                        new OptionItem { Id = CatalogueController.Cache, Title = "Cache" },
                        new OptionItem { Id = CatalogueController.Queue, Title = "Queue" },
                        new OptionItem { Id = CatalogueController.Storage, Title = "Storage" }
                    ])
                    .SetWidth(UILayoutLength.Absolute(180)),
                new SliderComponent(PriceId)
                    .SetTitle("Up to €/mo")
                    .SetMin(0)
                    .SetMax(290)
                    .SetStep(10)
                    .SetValue(290)
                    .SetShowValue(true)
                    .SetWidth(UILayoutLength.Absolute(200)),
                new SwitchComponent(AvailableId)
                    .SetTitle("In eu-north only")
                    .SetVerticalAlignment(UIAlignment.Center),
                new SelectComponent(SortId)
                    .SetValue("name")
                    .SetOptions(
                    [
                        new OptionItem { Id = "name", Title = "By name" },
                        new OptionItem { Id = "price-asc", Title = "Cheapest first" },
                        new OptionItem { Id = "price-desc", Title = "Dearest first" }
                    ])
                    .SetWidth(UILayoutLength.Absolute(160)),
                new TextComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.Upload))
                    .SetTitle("Order")
                    .AsBody()
                    .BindBadgeText(nameof(CatalogueController.OrderLine))
                    .SetBadgeStyle(UIBadgeType.Primary)
                    .SetVerticalAlignment(UIAlignment.Center)
                )
            );

    /// <summary>
    /// Four filters and three sorts on one list. A filter is active while its control holds a value; the region rule while
    /// the switch is on; each sort while the select says so. The price rule reads the slider as a ceiling.
    /// </summary>
    private static ItemsViewComponent CreateShelf()
        => new ItemsViewComponent()
            .BindItems(nameof(CatalogueController.Offers))
            .FilterBy(SearchId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Title))
            .FilterBy(RoleId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Role), UIComparisonOperator.Equal)
            .FilterBy(PriceId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Price), UIComparisonOperator.LessOrEqual)
            .FilterBy(AvailableId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Available), UIComparisonOperator.Equal, UIComparisonOperator.Equal, true)
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Title), UIItemsSortDirection.Ascending, UIComparisonOperator.Equal, "name")
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Price), UIItemsSortDirection.Ascending, UIComparisonOperator.Equal, "price-asc")
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Price), UIItemsSortDirection.Descending, UIComparisonOperator.Equal, "price-desc")
            .SetLayoutType(UIItemsLayoutType.Wrap)
            .SetSpacing(16)
            // The page scrolls, not the shelf: a host that scrolls by itself draws a bar beside its empty state.
            .DisableScroll()
            .SetTemplate(CreateTile())
            .ConfigureDefaultEmptyTemplate(template => _ = template
                .SetIcon(DemoIcons.Outline(DemoIcons.Search))
                .SetTitle("No offer matches")
                .SetDescription("Loosen a filter or two.")
            );

    /// <summary>A share of the shelf's line rather than a fixed width, so the tiles end where the filter band does.</summary>
    private static SurfaceComponent CreateTile()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetPlacement(1, 1, 24, 1, sm: UIGridPlacement.At(1, 1, 12, 1), xl: UIGridPlacement.At(1, 1, 6, 1))
            .SetPadding(UIThickness.Uniform(0))
            .SetContent(UILayout.Stack(0,
                new ImageComponent()
                    .BindSource(nameof(DemoOfferItem.Image), UIBindingScope.Relative)
                    .BindAltText(nameof(DemoOfferItem.Title), UIBindingScope.Relative)
                    .SetFit(UIImageFit.Cover)
                    .SetHeight(UILayoutLength.Absolute(132))
                    .SetCornerRadius(UICornerRadius.Top(8)),
                UILayout.Stack(10,
                    new TextComponent()
                        .BindTitle(nameof(DemoOfferItem.Title), UIBindingScope.Relative)
                        .AsSubtitle()
                        .BindDescription(nameof(DemoOfferItem.Description), UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted),
                    // The badge sits by the price, where there is room; beside the title it would cost the title its end.
                    // A plain row, not a Split: a Split flips on the viewport's width, which says nothing about a tile's own.
                    new ContainerComponent()
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .BindTitle(nameof(DemoOfferItem.PriceLine), UIBindingScope.Relative)
                            .AsSubtitle()
                            .BindBadgeText(nameof(DemoOfferItem.BadgeText), UIBindingScope.Relative)
                            .BindBadgeStyle(nameof(DemoOfferItem.BadgeStyle), UIBindingScope.Relative)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new ButtonComponent()
                            .SetType(UIButtonType.Outline)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("Add")
                            .SetMargin(UIThickness.All(8, 0, 0, 0))
                            .SetVerticalAlignment(UIAlignment.Center)
                            .BindEnabled(nameof(DemoOfferItem.Available), UIBindingScope.Relative)
                            .OnClick(nameof(CatalogueController.AddToOrder), UIAction.ArgCurrentItemKey("id"))
                            .SetPlacement(24, 1, 1, 1)
                        )
                )
                .SetPadding(UIThickness.All(12, 10, 12, 12))
                )
            );
}
