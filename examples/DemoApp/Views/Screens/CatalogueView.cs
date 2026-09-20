using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
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

namespace DemoApp.Views.Screens;

/// <summary>
/// A shelf narrowed in the browser. The list is served whole; a search box, a category, a price ceiling and a stock switch
/// are four filter rules on it, a select carries three sort rules of which one is active, and only a press on a tile
/// reaches the server.
/// </summary>
internal sealed class CatalogueView : DemoScreenView, IUIViewDefinition
{
    private const string SearchId = "catalogue-search";
    private const string CategoryId = "catalogue-category";
    private const string PriceId = "catalogue-price";
    private const string StockId = "catalogue-stock";
    private const string SortId = "catalogue-sort";

    public static string ViewKey => "demo.screens.catalogue";

    protected override string ComponentRoute => "/screens/catalogue";
    protected override string Header => "demo.screens.catalogue.header";
    protected override string HeaderDescription => "demo.screens.catalogue.description";

    protected override IVisualComponent CreateScreen()
        => UILayout.Stack(16, CreateFilters(), CreateShelf())
            .SetPadding(UIThickness.All(0, 8, 0, 0))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>The controls the rules read, on one band; the basket at its far end is the one thing bound to the server.</summary>
    private static SurfaceComponent CreateFilters()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Tinted)
            .SetPadding(UIThickness.All(16, 12, 16, 12))
            .SetContent(UILayout.Row(16,
                new TextInputComponent(SearchId)
                    .SetPlaceholder("Search the shelf")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetShowClearButton()
                    .SetDebounceMilliseconds(150)
                    .SetWidth(UILayoutLength.Absolute(240)),
                new SelectComponent(CategoryId)
                    .SetPlaceholder("Any category")
                    .SetShowClearButton()
                    .SetOptions(
                    [
                        new OptionItem { Id = CatalogueController.Notebooks, Title = "Notebooks" },
                        new OptionItem { Id = CatalogueController.Pens, Title = "Pens" },
                        new OptionItem { Id = CatalogueController.Ink, Title = "Ink" },
                        new OptionItem { Id = CatalogueController.Paper, Title = "Paper" }
                    ])
                    .SetWidth(UILayoutLength.Absolute(180)),
                new SliderComponent(PriceId)
                    .SetTitle("Up to")
                    .SetMin(0)
                    .SetMax(60)
                    .SetStep(5)
                    .SetValue(60)
                    .SetShowValue(true)
                    .SetWidth(UILayoutLength.Absolute(200)),
                new SwitchComponent(StockId)
                    .SetTitle("In stock only")
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
                    .SetTitle("Basket")
                    .AsBody()
                    .BindBadgeText(nameof(CatalogueController.BasketLine))
                    .SetBadgeStyle(UIBadgeType.Primary)
                    .SetVerticalAlignment(UIAlignment.Center)
            ));

    /// <summary>
    /// Four filters and three sorts on one list. A filter is active while its control holds a value; the stock rule while
    /// the switch is on; each sort while the select says so. The price rule reads the slider as a ceiling.
    /// </summary>
    private static ItemsViewComponent CreateShelf()
        => new ItemsViewComponent()
            .BindItems(nameof(CatalogueController.Products))
            .FilterBy(SearchId, IInputComponent.ValueProperty, nameof(DemoProductItem.Title))
            .FilterBy(CategoryId, IInputComponent.ValueProperty, nameof(DemoProductItem.Category), UIComparisonOperator.Equal)
            .FilterBy(PriceId, IInputComponent.ValueProperty, nameof(DemoProductItem.Price), UIComparisonOperator.LessOrEqual)
            .FilterBy(StockId, IInputComponent.ValueProperty, nameof(DemoProductItem.InStock), UIComparisonOperator.Equal, UIComparisonOperator.Equal, true)
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoProductItem.Title), UIItemsSortDirection.Ascending, UIComparisonOperator.Equal, "name")
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoProductItem.Price), UIItemsSortDirection.Ascending, UIComparisonOperator.Equal, "price-asc")
            .SortBy(SortId, IInputComponent.ValueProperty, nameof(DemoProductItem.Price), UIItemsSortDirection.Descending, UIComparisonOperator.Equal, "price-desc")
            .SetLayoutType(UIItemsLayoutType.Wrap)
            .SetSpacing(16)
            // The page scrolls, not the shelf: a host that scrolls by itself draws a bar beside its empty state.
            .DisableScroll()
            .SetTemplate(CreateTile())
            .ConfigureDefaultEmptyTemplate(template => _ = template
                .SetIcon(DemoIcons.Outline(DemoIcons.Search))
                .SetTitle("Nothing on the shelf matches")
                .SetDescription("Loosen a filter or two.")
            );

    private static SurfaceComponent CreateTile()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetWidth(UILayoutLength.Absolute(232))
            .SetPadding(UIThickness.Uniform(0))
            .SetContent(UILayout.Stack(0,
                new ImageComponent()
                    .BindSource(nameof(DemoProductItem.Image), UIBindingScope.Relative)
                    .BindAltText(nameof(DemoProductItem.Title), UIBindingScope.Relative)
                    .SetFit(UIImageFit.Cover)
                    .SetHeight(UILayoutLength.Absolute(132))
                    .SetCornerRadius(UICornerRadius.Top(8)),
                UILayout.Stack(10,
                    new TextComponent()
                        .BindTitle(nameof(DemoProductItem.Title), UIBindingScope.Relative)
                        .AsSubtitle()
                        .BindDescription(nameof(DemoProductItem.Description), UIBindingScope.Relative)
                        .SetDescriptionColor(UIThemeColor.Muted),
                    // The badge sits by the price, where there is room; beside the title it would cost the title its end.
                    UILayout.Split(
                        new TextComponent()
                            .BindTitle(nameof(DemoProductItem.PriceLine), UIBindingScope.Relative)
                            .AsSubtitle()
                            .BindBadgeText(nameof(DemoProductItem.BadgeText), UIBindingScope.Relative)
                            .BindBadgeStyle(nameof(DemoProductItem.BadgeStyle), UIBindingScope.Relative)
                            .SetVerticalAlignment(UIAlignment.Center),
                        new ButtonComponent()
                            .SetType(UIButtonType.Outline)
                            .SetSize(UIButtonSize.Small)
                            .SetTitle("Add")
                            .SetHorizontalAlignment(UIAlignment.End)
                            .BindEnabled(nameof(DemoProductItem.InStock), UIBindingScope.Relative)
                            .OnClick(nameof(CatalogueController.AddToBasket), UIAction.ArgCurrentItemKey("id")),
                        sideSpan: 7,
                        spacing: 8
                    )
                )
                .SetPadding(UIThickness.All(12, 10, 12, 12))
            ));
}
