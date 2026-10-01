using System;
using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Navigation.TabsView;

/// <summary>
/// A strip the controller walks: four steps nobody closes or drags, driven by the server as readily as by a click.
/// </summary>
internal sealed partial class DriveGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Steps { get; } =
    [
        CreateStep("order", 1, "Order", "api-eu-west-1 on the Standard plan in eu-west. Nothing to do here."),
        CreateStep("disk", 2, "Disk", "80 GB created and the image written — 41 seconds on the last run."),
        CreateStep("boot", 3, "Boot", "Booted on the first try, with the firewall rules applied."),
        CreateStep("health", 4, "Health check", "Waits for the health check to pass, then hands the server to the customer.")
    ];

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "order";

    public void Move(int offset)
    {
        DemoDocumentItem[] ordered = [.. Steps.OrderBy(static step => step.Order)];

        var index = Array.FindIndex(ordered, step => string.Equals(step.Id, SelectedKey, StringComparison.Ordinal));
        var target = Math.Clamp(index + offset, 0, ordered.Length - 1);

        if (target == index)
        {
            LogEvent(offset > 0 ? "already on the last step" : "already on the first step");
            return;
        }

        SelectedKey = ordered[target].Id;
        LogEvent($"now on {ordered[target].Title}");
    }

    private static DemoDocumentItem CreateStep(string id, double order, string title, string body)
        => new() { Id = id, Title = title, Order = order, CanRemove = false, Body = body };
}

/// <summary>
/// A strip that starts with nothing open: the first document opened brings the strip with it, and closing the last one leaves the
/// empty template alone again.
/// </summary>
internal sealed partial class EmptyStripGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Documents { get; } = [];

    /// <summary>Opens the one document while none is open, and closes it while it is.</summary>
    public void Toggle()
    {
        if (Documents.Count > 0)
        {
            Documents.Clear();
            LogEvent("the last document closed, and the strip with it");
            return;
        }

        Documents.Add(new DemoDocumentItem
        {
            Id = "notes",
            Title = "notes.md",
            Icon = DemoIcons.Outline(DemoIcons.FileText),
            Order = 1,
            CanRemove = false,
            Body = "The first document open, and the strip that came with it."
        });
        LogEvent("notes.md opened, and the strip came with it");
    }
}

/// <summary>
/// One strip over a collection of documents, every property that can be bound to it or to one tab, a strip that starts empty and a
/// strip the controller walks.
/// </summary>
internal sealed partial class TabsViewController : DemoStandardController
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

    [RecursiveMember]
    public partial EmptyStripGroupContext EmptyGroup { get; set; } = new();

    [RecursiveMember]
    public partial DriveGroupContext DriveGroup { get; set; } = new();

    public TabsViewController()
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

    [UICommand]
    public void ToggleEmptyDocument()
        => EmptyGroup.Toggle();

    [UICommand]
    public void NextStep()
        => DriveGroup.Move(1);

    [UICommand]
    public void PreviousStep()
        => DriveGroup.Move(-1);
}
