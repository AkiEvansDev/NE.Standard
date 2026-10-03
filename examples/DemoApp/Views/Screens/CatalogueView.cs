using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// Server offers narrowed in the browser. The list is served whole; a search box, a role, a price band and a region switch are
/// five filter rules on it — the band's two ends one each — and a select carries three sort rules of which one is active. Each
/// control is bound, and its change rewrites the page's query (<c>ReplaceAddressEffect</c>), both ends of the band included, so the
/// shelf can be reloaded, bookmarked and sent as a link.
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

    /// <summary>The controls the rules read, on one band, each written into the address as it changes; the order at its far end.</summary>
    /// <remarks>Its fields are Tonal: the band frames them, a toolbar's lone controls, not a form whose fields stack.</remarks>
    private static SurfaceComponent CreateFilters()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Tinted)
            .SetPadding(UIThickness.All(16, 12, 16, 12))
            .SetContent(UILayout.Row(16,
                new TextInputComponent(SearchId)
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetPlaceholder("Search the offers")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetShowClearButton()
                    .SetDebounceMilliseconds(150)
                    .BindValue(nameof(CatalogueController.Search))
                    .OnChange(nameof(CatalogueController.WriteAddress))
                    .SetWidth(UILayoutLength.Absolute(200)),
                new SelectComponent(RoleId)
                    .SetAppearance(UIInputAppearance.Tonal)
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
                    .BindValue(nameof(CatalogueController.Role))
                    .OnChange(nameof(CatalogueController.WriteAddress))
                    .SetWidth(UILayoutLength.Absolute(180)),
                new SliderComponent(PriceId)
                    .SetTitle("Price, €/mo")
                    .SetIsRange()
                    .SetMin(0)
                    .SetMax(CatalogueController.Ceiling)
                    .SetStep(10)
                    .BindValue(nameof(CatalogueController.MinPrice))
                    .BindEndValue(nameof(CatalogueController.MaxPrice))
                    .OnChange(nameof(CatalogueController.WriteAddress))
                    .SetShowValue(true)
                    .SetWidth(UILayoutLength.Absolute(200)),
                new SwitchComponent(AvailableId)
                    .SetTitle("In eu-north only")
                    .BindValue(nameof(CatalogueController.InRegion))
                    .OnChange(nameof(CatalogueController.WriteAddress))
                    .SetVerticalAlignment(UIAlignment.Center),
                new SelectComponent(SortId)
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetOptions(
                    [
                        new OptionItem { Id = CatalogueController.ByName, Title = "By name" },
                        new OptionItem { Id = CatalogueController.Cheapest, Title = "Cheapest first" },
                        new OptionItem { Id = CatalogueController.Dearest, Title = "Dearest first" }
                    ])
                    .BindValue(nameof(CatalogueController.Sort))
                    .OnChange(nameof(CatalogueController.WriteAddress))
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
    /// Five filters and three sorts on one list. A filter is active while its control holds a value; the region rule while
    /// the switch is on; each sort while the select says so. The price band is two rules: its start a floor, its end a ceiling.
    /// </summary>
    private static ItemsViewComponent CreateShelf()
        => new ItemsViewComponent()
            .BindItems(nameof(CatalogueController.Offers))
            .FilterBy(SearchId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Title))
            .FilterBy(RoleId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Role), UIComparisonOperator.Equal)
            .FilterBy(PriceId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Price), UIComparisonOperator.GreaterOrEqual)
            .FilterBy(PriceId, IPeriodInputComponent.EndValueProperty, nameof(DemoOfferItem.Price), UIComparisonOperator.LessOrEqual)
            .FilterBy(AvailableId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Available), UIComparisonOperator.Equal, UIComparisonOperator.Equal, true)
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Title), UIItemsSortDirection.Ascending, UIComparisonOperator.Equal, CatalogueController.ByName)
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Price), UIItemsSortDirection.Ascending, UIComparisonOperator.Equal, CatalogueController.Cheapest)
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoOfferItem.Price), UIItemsSortDirection.Descending, UIComparisonOperator.Equal, CatalogueController.Dearest)
            .SetLayoutType(UIItemsLayoutType.Wrap)
            .SetSpacing(16)
            // The page scrolls, not the shelf: a host that scrolls by itself draws a bar beside its empty state.
            .DisableScroll()
            .SetTemplate(CreateTile())
            .ConfigureDefaultEmptyTemplate(template => _ = template
                .SetIcon(DemoIcons.Outline(DemoIcons.Search))
                .SetTitle("No offer matches")
                .SetDescription("Loosen a filter or two.")
                .SetWrapMode(UITextWrapMode.Wrap)
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
