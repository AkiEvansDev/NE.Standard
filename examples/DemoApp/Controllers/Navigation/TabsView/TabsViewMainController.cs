using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Navigation.TabsView;

/// <summary>
/// One strip over a collection of documents, and every property that can be bound to it or to one tab.
/// </summary>
internal sealed partial class TabsViewMainController : DemoStandardController
{
    /// <summary>
    /// The documents the strip is over; on the controller because two sections act on the same objects.
    /// </summary>
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Documents { get; } =
    [
        new()
        {
            Id = TabsViewGroupContext.IncidentKey,
            Title = "incident-report.md",
            Icon = DemoIcons.Outline(DemoIcons.FileText),
            Order = 1,
            Body = "Slow API in Europe West. The disk of db-eu-west-1 ran full at 11:52, writes queued behind it, and the API answered in seconds rather than milliseconds until it was resized."
        },
        new()
        {
            Id = TabsViewGroupContext.HealthKey,
            Title = "health-check.cs",
            Icon = DemoIcons.Outline(DemoIcons.File),
            Order = 2,
            Body = "public HealthStatus Check(Server server)\n    => server.Disk.UsedPercent < 90\n        ? HealthStatus.Healthy\n        : HealthStatus.Degraded;"
        },
        new()
        {
            Id = TabsViewGroupContext.ServerKey,
            Title = "server.json",
            Icon = DemoIcons.Outline(DemoIcons.Settings),
            Order = 3,
            Body = /*lang=json,strict*/ "{\n  \"plan\": \"standard\",\n  \"region\": \"eu-west\",\n  \"image\": \"orvane-base-2026.09\"\n}"
        }
    ];

    [RecursiveMember]
    public partial TabsViewGroupContext TabsViewGroup { get; set; } = new();

    [RecursiveMember]
    public partial TabsViewItemGroupContext FirstTabGroup { get; set; }

    public TabsViewMainController()
    {
        FirstTabGroup = new TabsViewItemGroupContext(Documents[0]);
    }

    /// <summary>A tab's close or the tab menu's remove entry: reported, and the tab kept.</summary>
    [UICommand]
    public void RemoveDocument(string id)
        => TabsViewGroup.ReportRemove(Documents.FirstOrDefault(document => document.Id == id)?.Title?.ToString() ?? id);

    [UICommand]
    public void CycleTabsViewGroupOption(string id)
        => TabsViewGroup.CycleOption(id);

    [UICommand]
    public void CycleFirstTabGroupOption(string id)
        => FirstTabGroup.CycleOption(id);
}
