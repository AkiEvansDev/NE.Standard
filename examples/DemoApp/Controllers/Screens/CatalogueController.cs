using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

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
/// The offers, whole, the order, and the filters as the address names them. Every filter and sort runs in the browser over the list
/// the page was served with; a change also rewrites the page's query in place, so a reload, a copied link or a new tab arrives at the
/// same shelf, and Back leaves the page rather than undoing a filter.
/// </summary>
internal sealed partial class CatalogueController : UIControllerBase
{
    public const string Api = "api";
    public const string Web = "web";
    public const string Db = "db";
    public const string Cache = "cache";
    public const string Queue = "queue";
    public const string Storage = "storage";

    public const string ByName = "name";
    public const string Cheapest = "price-asc";
    public const string Dearest = "price-desc";
    public const decimal Ceiling = 290m;

    private static readonly string[] Roles = [Api, Web, Db, Cache, Queue, Storage];
    private static readonly string[] Sorts = [ByName, Cheapest, Dearest];

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

    [RecursiveMember]
    public partial string? Search { get; set; }

    [RecursiveMember]
    public partial string? Role { get; set; }

    [RecursiveMember]
    public partial decimal? MinPrice { get; set; } = 0;

    [RecursiveMember]
    public partial decimal? MaxPrice { get; set; } = Ceiling;

    [RecursiveMember]
    public partial bool? InRegion { get; set; }

    [RecursiveMember]
    public partial string? Sort { get; set; } = ByName;

    /// <summary>
    /// The shelf as an address names it, on arrival and on Back or Forward alike: a value the page does not offer reads as no filter.
    /// </summary>
    protected override Task OnNavigatedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        Search = navigation.TryGetParameter("q", out var search) ? search : null;
        Role = navigation.TryGetParameter("role", out var role) && Roles.Contains(role) ? role : null;
        MaxPrice = navigation.TryGetParameter("max", out decimal max) && max is >= 0 and < Ceiling ? max : Ceiling;
        // A floor above the ceiling names no band the slider can hold: the floor goes, as any other value the page does not offer.
        MinPrice = navigation.TryGetParameter("min", out decimal min) && min > 0 && min <= MaxPrice ? min : 0;
        InRegion = navigation.TryGetParameter("region", out var region) && region == "eu-north" ? true : null;
        Sort = navigation.TryGetParameter("sort", out var sort) && Sorts.Contains(sort) ? sort : ByName;

        return Task.CompletedTask;
    }

    /// <summary>
    /// A filter or the sort moved: the query is rewritten in place, not added as an entry, since narrowing a list is no place to go
    /// back to. Only what differs from the full shelf is written, so the bare route is the whole list.
    /// </summary>
    [UICommand]
    public UICommandResult WriteAddress()
    {
        Dictionary<string, object?> parameters = new(StringComparer.Ordinal);

        if (!string.IsNullOrWhiteSpace(Search))
            parameters["q"] = Search.Trim();

        if (Role is not null)
            parameters["role"] = Role;

        if (MinPrice is { } min && min > 0)
            parameters["min"] = min;

        if (MaxPrice is { } max && max < Ceiling)
            parameters["max"] = max;

        if (InRegion == true)
            parameters["region"] = "eu-north";

        if (Sort is not null and not ByName)
            parameters["sort"] = Sort;

        return UICommandResult.Ok([new ReplaceAddressEffect(parameters)]);
    }

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
            // Per month, as the price band's caption says once for the whole list; a tile has no room to say it again beside a badge.
            PriceLine = $"€{price.ToString("0", CultureInfo.InvariantCulture)}",
            Available = available,
            // As short as a price leaves room for: the region is the switch's word beside the list.
            BadgeText = available ? null : "Not here",
            BadgeStyle = available ? null : UIBadgeType.Warning,
            Image = image
        };
}
