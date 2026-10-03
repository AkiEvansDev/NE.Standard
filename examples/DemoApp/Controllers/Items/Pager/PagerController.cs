using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Items.Pager;

/// <summary>
/// Orvane's fleet, read a window at a time: <c>role-region-n</c> servers, each with its plan, its load and its status, made up from
/// the server's place in the fleet so nothing is held but the window on show.
/// </summary>
internal sealed class DemoFleetSource(int total) : UIItemSourceBase<TextItem>
{
    private static readonly string[] Roles = ["api", "web", "db", "cache", "queue", "storage"];
    private static readonly (string Id, string Name)[] Regions = [("eu-west", "Europe West"), ("eu-central", "Europe Central"), ("eu-north", "Europe North"), ("us-east", "US East"), ("ap-south", "Asia South")];
    private static readonly string[] Plans = ["Starter", "Standard", "Pro", "Dedicated"];

    protected override Task<UIItemWindow<TextItem>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken)
    {
        var start = request.Anchor.Kind switch
        {
            UIItemAnchorKind.Offset => request.Anchor.Offset,
            UIItemAnchorKind.End => total - request.Count,
            _ => 0
        };

        start = Math.Clamp(start, 0, Math.Max(0, total - 1));

        var count = Math.Max(0, Math.Min(request.Count, total - start));
        TextItem[] items = new TextItem[count];

        for (var i = 0; i < count; i++)
            items[i] = Server(start + i);

        return Task.FromResult(new UIItemWindow<TextItem>(items)
        {
            Offset = start,
            TotalCount = total,
            HasMoreBefore = start > 0,
            HasMoreAfter = start + count < total
        });
    }

    /// <summary>The server at a place in the fleet: thirty to a number, every role in every region before the next.</summary>
    private static TextItem Server(int index)
    {
        var role = Roles[index % Roles.Length];
        (var region, var regionName) = Regions[index / Roles.Length % Regions.Length];
        var name = string.Create(CultureInfo.InvariantCulture, $"{role}-{region}-{(index / (Roles.Length * Regions.Length)) + 1}");
        (var status, UIBadgeType style) = (index % 17, index % 23, index % 29) switch
        {
            (3, _, _) => ("Degraded", UIBadgeType.Warning),
            (_, 5, _) => ("Maintenance", UIBadgeType.Info),
            (_, _, 7) => ("Stopped", UIBadgeType.Surface),
            _ => ("Running", UIBadgeType.Success)
        };

        return new TextItem
        {
            Id = name,
            Title = name,
            Description = string.Create(CultureInfo.InvariantCulture, $"{regionName} · {Plans[index * 7 / 3 % Plans.Length]} · CPU {(index * 37 % 91) + 4}%"),
            Icon = DemoIcons.Outline(DemoIcons.Server),
            BadgeText = status,
            BadgeStyle = style
        };
    }
}

/// <summary>
/// What the preview's pager shows, and whether its list pages at all: a bound <c>Paging</c> turned off makes the list a scrolling
/// window, and the pager aimed at it hides.
/// </summary>
internal sealed partial class PagerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIPagerMode? Mode { get; set; }

    [RecursiveMember]
    public partial bool Paging { get; set; } = true;

    public PagerGroupContext()
    {
        AddOption(nameof(Mode), CycleMode, () => Mode);
        AddOption("Paging (the list's)", TogglePaging, () => Paging);
    }

    public void CycleMode()
        => SetLastChange(nameof(Mode), Mode = CycleEnum(Mode));

    public void TogglePaging()
        => SetLastChange(nameof(Paging), Paging = !Paging);
}

/// <summary>
/// The fleet a page at a time, four ways: the preview's list, a page of cards, a table and a narrow list with the compact pager; one
/// source each, since a source feeds the one host whose window it holds.
/// </summary>
internal sealed partial class PagerController() : DemoStandardController
{
    [RecursiveMember]
    public partial PagerGroupContext PagerGroup { get; set; } = new();

    [RecursiveMember(false)]
    public DemoFleetSource Preview { get; } = new(240);

    [RecursiveMember(false)]
    public DemoFleetSource Cards { get; } = new(240);

    [RecursiveMember(false)]
    public DemoFleetSource Table { get; } = new(812);

    [RecursiveMember(false)]
    public DemoFleetSource Narrow { get; } = new(812);

    /// <summary>Reads each first page here rather than leaving it to the client, so the page paints with its rows.</summary>
    protected override async Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        await Preview.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, 5), cancellationToken).ConfigureAwait(false);
        await Cards.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, 8), cancellationToken).ConfigureAwait(false);
        await Table.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, 8), cancellationToken).ConfigureAwait(false);
        await Narrow.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, 20), cancellationToken).ConfigureAwait(false);
    }

    [UICommand]
    public void CyclePagerOption(string id)
        => PagerGroup.CycleOption(id);
}
