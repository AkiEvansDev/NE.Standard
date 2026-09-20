using System.Globalization;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Screens;

/// <summary>A thing on the shelf: what the tiles bind and what the filters read.</summary>
internal sealed partial class DemoProductItem : TextItem
{
    [RecursiveMember]
    public partial string Category { get; set; } = string.Empty;

    [RecursiveMember]
    public partial decimal Price { get; set; }

    [RecursiveMember]
    public partial string PriceLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial bool InStock { get; set; }

    [RecursiveMember]
    public partial string Image { get; set; } = string.Empty;
}

/// <summary>
/// The shelf, whole, and the basket. Every filter and sort runs in the browser over the list the page was served with; the
/// only round trip is a press on a tile.
/// </summary>
internal sealed partial class CatalogueController : UIControllerBase
{
    public const string Notebooks = "notebooks";
    public const string Pens = "pens";
    public const string Ink = "ink";
    public const string Paper = "paper";

    private int _inBasket;

    [RecursiveMember(false)]
    public RecursiveCollection<DemoProductItem> Products { get; } =
    [
        Product("field-a5", "Field notebook, A5", Notebooks, 12.00m, true, DemoImages.HarbourSky, "Dot grid, 96 pages, lies flat."),
        Product("field-a6", "Field notebook, A6", Notebooks, 8.50m, true, DemoImages.SunsetRuins, "Pocket size, the same paper."),
        Product("sketch-a4", "Sketchbook, A4", Notebooks, 19.00m, false, DemoImages.MeteorShore, "Heavy paper for pencil and wash."),
        Product("brass-pen", "Brass pen", Pens, 38.00m, true, DemoImages.NightStreet, "Machined, takes any standard refill."),
        Product("brush-pen", "Brush pen", Pens, 6.00m, true, DemoImages.HarbourSky, "A fine tip that bends but does not fray."),
        Product("fountain", "Fountain pen, steel nib", Pens, 54.00m, true, DemoImages.SunsetRuins, "Medium nib, converter included."),
        Product("ink-midnight", "Ink, midnight", Ink, 9.50m, true, DemoImages.NightStreet, "A blue so dark it reads black."),
        Product("ink-rust", "Ink, rust", Ink, 9.50m, false, DemoImages.MeteorShore, "Shades from orange to brown as it dries."),
        Product("ink-sample", "Ink sample set", Ink, 14.00m, true, DemoImages.HarbourSky, "Six vials, two millilitres each."),
        Product("paper-a4", "Writing paper, A4", Paper, 7.00m, true, DemoImages.SunsetRuins, "Fifty sheets, ninety grams, no feathering."),
        Product("envelopes", "Envelopes, C6", Paper, 4.50m, true, DemoImages.NightStreet, "Twenty-five, lined, self-seal."),
        Product("cards", "Correspondence cards", Paper, 11.00m, false, DemoImages.MeteorShore, "Twenty cards with envelopes to match.")
    ];

    [RecursiveMember]
    public partial string BasketLine { get; set; } = "Empty";

    /// <summary>A tile's press: the count goes up and the toast says what went in; the list itself never re-renders.</summary>
    [UICommand]
    public UICommandResult AddToBasket(string id)
    {
        foreach (DemoProductItem product in Products)
        {
            if (product.Id != id)
                continue;

            _inBasket++;
            BasketLine = _inBasket == 1 ? "1 thing" : $"{_inBasket.ToString(CultureInfo.InvariantCulture)} things";

            return UICommandResult.Ok([new ShowNotificationEffect($"{product.Title} is in the basket.", UIColorStyle.Success)]);
        }

        return UICommandResult.Ok();
    }

    private static DemoProductItem Product(string id, string title, string category, decimal price, bool inStock, string image, string description)
        => new()
        {
            Id = id,
            Title = title,
            Description = description,
            Category = category,
            Price = price,
            PriceLine = $"€ {price.ToString("0.00", CultureInfo.InvariantCulture)}",
            InStock = inStock,
            BadgeText = inStock ? null : "Sold out",
            BadgeStyle = inStock ? null : UIBadgeType.Warning,
            Image = image
        };
}
