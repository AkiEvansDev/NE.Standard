using System.Globalization;

namespace DemoApp.Controllers.Screens;

/// <summary>A server on offer: what the tiles bind and what the filters read.</summary>
internal sealed partial class DemoOfferItem : TextItem
{
    [RecursiveMember]
    public partial string Role { get; set; } = string.Empty;

    [RecursiveMember]
    public partial decimal Price { get; set; }

    [RecursiveMember]
    public partial string PriceLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial bool Available { get; set; }

    [RecursiveMember]
    public partial string Image { get; set; } = string.Empty;
}

/// <summary>
/// The offers, whole, and the order. Every filter and sort runs in the browser over the list the page was served with; the
/// only round trip is a press on a tile.
/// </summary>
internal sealed partial class CatalogueController : UIControllerBase
{
    public const string Api = "api";
    public const string Web = "web";
    public const string Db = "db";
    public const string Cache = "cache";
    public const string Queue = "queue";
    public const string Storage = "storage";

    private int _inOrder;

    [RecursiveMember(false)]
    public RecursiveCollection<DemoOfferItem> Offers { get; } =
    [
        Offer("api-standard", "API server, Standard", Api, 18m, true, DemoImages.HarbourSky, "2 vCPU · 4 GB · 80 GB. Stateless."),
        Offer("api-pro", "API server, Pro", Api, 64m, true, DemoImages.SunsetRuins, "4 vCPU · 16 GB · 240 GB. Stateless."),
        Offer("db-dedicated", "Database, Dedicated", Db, 290m, false, DemoImages.MeteorShore, "16 vCPU · 64 GB · 960 GB. A host of its own."),
        Offer("db-pro", "Database, Pro", Db, 64m, true, DemoImages.NightStreet, "4 vCPU · 16 GB · 240 GB. Nightly backups."),
        Offer("web-starter", "Web server, Starter", Web, 6m, true, DemoImages.HarbourSky, "1 vCPU · 2 GB · 40 GB. A site or two."),
        Offer("web-standard", "Web server, Standard", Web, 18m, true, DemoImages.SunsetRuins, "2 vCPU · 4 GB · 80 GB. Busier sites."),
        Offer("cache-standard", "Cache, Standard", Cache, 18m, true, DemoImages.NightStreet, "2 vCPU · 4 GB · 80 GB. Held in memory."),
        Offer("cache-pro", "Cache, Pro", Cache, 64m, false, DemoImages.MeteorShore, "4 vCPU · 16 GB · 240 GB. Held in memory."),
        Offer("queue-starter", "Queue, Starter", Queue, 6m, true, DemoImages.HarbourSky, "1 vCPU · 2 GB · 40 GB. Jobs and events."),
        Offer("queue-standard", "Queue, Standard", Queue, 18m, true, DemoImages.SunsetRuins, "2 vCPU · 4 GB · 80 GB. Jobs and events."),
        Offer("storage-standard", "Storage node, Standard", Storage, 18m, true, DemoImages.NightStreet, "2 vCPU · 4 GB · 80 GB. Buckets."),
        Offer("storage-dedicated", "Storage node, Dedicated", Storage, 290m, false, DemoImages.MeteorShore, "16 vCPU · 64 GB · 960 GB. Snapshots.")
    ];

    [RecursiveMember]
    public partial string OrderLine { get; set; } = "Empty";

    /// <summary>A tile's press: the count goes up and the toast says what went in; the list itself never re-renders.</summary>
    [UICommand]
    public UICommandResult AddToOrder(string id)
    {
        foreach (DemoOfferItem offer in Offers)
        {
            if (offer.Id != id)
                continue;

            // The tile going off is the feedback; the rule is here, since a press can reach the server without it.
            if (!offer.Available)
                return UICommandResult.Ok([new ShowNotificationEffect($"{offer.Title} is not offered in this region.", UIColorStyle.Warning)]);

            _inOrder++;
            OrderLine = _inOrder == 1 ? "1 server" : $"{_inOrder.ToString(CultureInfo.InvariantCulture)} servers";

            return UICommandResult.Ok([new ShowNotificationEffect($"{offer.Title} is in the order.", UIColorStyle.Success)]);
        }

        return UICommandResult.Ok();
    }

    private static DemoOfferItem Offer(string id, string title, string role, decimal price, bool available, string image, string description)
        => new()
        {
            Id = id,
            Title = title,
            Description = description,
            Role = role,
            Price = price,
            // Per month, as the slider's caption says once for the whole list; a tile has no room to say it again beside a badge.
            PriceLine = $"€{price.ToString("0", CultureInfo.InvariantCulture)}",
            Available = available,
            // As short as a price leaves room for: the region is the switch's word beside the list.
            BadgeText = available ? null : "Not here",
            BadgeStyle = available ? null : UIBadgeType.Warning,
            Image = image
        };
}
