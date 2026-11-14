using System;
using System.Collections.Generic;
using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Navigation.TabsView;

/// <summary>
/// Dynamic browser tabs that reorder by dragging and close into a reopenable stack.
/// </summary>
internal sealed partial class BrowserTabsGroupContext : DemoGroupContext
{
    private readonly List<DemoDocumentItem> _closed = [];

    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Pages { get; } =
    [
        CreatePage("docs", DemoIcons.FileText, "Getting started", 1, "docs.orvane.example/start", "Create a server, pick a plan and a region, and point your domain at it."),
        CreatePage("api", DemoIcons.Link, "API reference", 2, "docs.orvane.example/api", "Every call the public API takes, and the key each one needs."),
        CreatePage("status", DemoIcons.Alert, "Status", 3, "status.orvane.example", "All systems operational. Last incident 12 days ago.")
    ];

    public void Close(string id)
    {
        DemoDocumentItem? page = Pages.FirstOrDefault(item => string.Equals(item.Id, id, StringComparison.Ordinal));

        if (page is null)
            return;

        _ = Pages.Remove(page);
        _closed.Add(page);
        LogEvent($"{page.Title} closed");
    }

    public void ReopenAll()
    {
        if (_closed.Count == 0)
        {
            LogEvent("all tabs are already open");
            return;
        }

        while (_closed.Count > 0)
        {
            DemoDocumentItem page = _closed[^1];
            _closed.RemoveAt(_closed.Count - 1);
            Pages.Add(page);
        }

        LogEvent("restored closed tabs");
    }

    private static DemoDocumentItem CreatePage(string id, string icon, string title, double order, string address, string body)
        => new() { Id = id, Icon = DemoIcons.Outline(icon), Title = title, Address = address, Order = order, CanRemove = true, Body = body };
}

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
            CanRemove = true,
            Body = "The first document open, and the strip that came with it."
        });
        LogEvent("notes.md opened, and the strip came with it");
    }

    public void Close(string id)
    {
        DemoDocumentItem? document = Documents.FirstOrDefault(item => string.Equals(item.Id, id, StringComparison.Ordinal));

        if (document is null)
            return;

        _ = Documents.Remove(document);
        LogEvent("the last document closed, and the strip with it");
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
        },
        new()
        {
            Id = TabsViewGroupContext.PipelineKey,
            Title = "deploy-pipeline.yml",
            Icon = DemoIcons.Outline(DemoIcons.Upload),
            Order = 4,
            Body = "stages:\n  - staging-eu-west\n  - production-canary\n  - production-fleet"
        },
        new()
        {
            Id = TabsViewGroupContext.AlertsKey,
            Title = "alerts-policy.json",
            Icon = DemoIcons.Outline(DemoIcons.Bell),
            Order = 5,
            Body = /*lang=json,strict*/ "{\n  \"errorRateThreshold\": 0.02,\n  \"latencyP95Ms\": 250\n}"
        },
        new()
        {
            Id = TabsViewGroupContext.RunbookKey,
            Title = "runbook-failover.md",
            Icon = DemoIcons.Outline(DemoIcons.List),
            Order = 6,
            Body = "Drain eu-west traffic, promote the read replica in us-east, and verify DNS propagation."
        }
    ];

    [RecursiveMember]
    public partial TabsViewGroupContext TabsViewGroup { get; set; }

    [RecursiveMember]
    public partial TabsViewItemGroupContext FirstTabGroup { get; set; }

    [RecursiveMember]
    public partial BrowserTabsGroupContext BrowserGroup { get; set; } = new();

    [RecursiveMember]
    public partial EmptyStripGroupContext EmptyGroup { get; set; } = new();

    [RecursiveMember]
    public partial DriveGroupContext DriveGroup { get; set; } = new();

    public TabsViewController()
    {
        TabsViewGroup = new TabsViewGroupContext(Documents);
        FirstTabGroup = new TabsViewItemGroupContext(Documents[0]);
    }

    /// <summary>A tab's close or the tab menu's remove entry: the document is closed, and the Tabs view section brings it back.</summary>
    [UICommand]
    public void RemoveDocument(string id)
        => TabsViewGroup.Close(id);

    [UICommand]
    public void CloseBrowserPage(string id)
        => BrowserGroup.Close(id);

    [UICommand]
    public void ReopenBrowserPages()
        => BrowserGroup.ReopenAll();

    [UICommand]
    public void ToggleEmptyDocument()
        => EmptyGroup.Toggle();

    [UICommand]
    public void CloseEmptyDocument(string id)
        => EmptyGroup.Close(id);

    [UICommand]
    public void NextStep()
        => DriveGroup.Move(1);

    [UICommand]
    public void PreviousStep()
        => DriveGroup.Move(-1);
}
