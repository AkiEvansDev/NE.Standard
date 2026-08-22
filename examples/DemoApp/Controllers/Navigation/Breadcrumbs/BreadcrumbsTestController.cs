using System.Collections.Generic;
using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.Breadcrumbs;

/// <summary>
/// A folder you can walk into and back out of. The trail is the walk, so descending appends a step and
/// clicking a step drops everything past it — which is the whole interaction a breadcrumb has.
/// </summary>
internal sealed partial class BreadcrumbsTestGroupContext : DemoGroupContext
{
    private static readonly Dictionary<string, string[]> Tree = new()
    {
        ["workspace"] = ["customers", "invoices", "reports"],
        ["customers"] = ["northwind", "contoso"],
        ["northwind"] = ["contacts", "orders"],
        ["contoso"] = ["contacts"],
        ["invoices"] = ["2025", "2026"],
        ["2026"] = ["march", "april"],
        ["reports"] = ["quarterly"]
    };

    [RecursiveMember(false)]
    public RecursiveCollection<BreadcrumbItem> Trail { get; } =
    [
        new() { Id = "workspace", Title = "Workspace", Icon = LucideIcons.LayoutDashboard }
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Children { get; } = [];

    public BreadcrumbsTestGroupContext()
    {
        FillChildren();
    }

    /// <summary>Walks into a child, which is one more step on the trail.</summary>
    public void Open(string id)
    {
        Trail.Add(new BreadcrumbItem { Id = id, Title = Titles.GetValueOrDefault(id, id), Icon = LucideIcons.Folder });
        FillChildren();

        LogEvent($"Opened '{Trail[^1].Title}'");
    }

    /// <summary>Goes back to a step, dropping every step past it.</summary>
    public void GoTo(string id)
    {
        var index = Trail.ToList().FindIndex(step => step.Id == id);

        // The last step is the page you are on, so a click on it is a click on where you already are.
        if (index < 0 || index == Trail.Count - 1)
            return;

        while (Trail.Count > index + 1)
            Trail.RemoveAt(Trail.Count - 1);

        FillChildren();

        LogEvent($"Back to '{Trail[^1].Title}'");
    }

    private void FillChildren()
    {
        Children.Clear();

        foreach (var id in Tree.GetValueOrDefault(Trail[^1].Id, []))
            Children.Add(new MenuItem { Id = id, Title = Titles.GetValueOrDefault(id, id), Icon = LucideIcons.Folder });
    }

    private static readonly Dictionary<string, string> Titles = new()
    {
        ["customers"] = "Customers",
        ["invoices"] = "Invoices",
        ["reports"] = "Reports",
        ["northwind"] = "Northwind Traders",
        ["contoso"] = "Contoso",
        ["contacts"] = "Contacts",
        ["orders"] = "Orders",
        ["2025"] = "2025",
        ["2026"] = "2026",
        ["march"] = "March",
        ["april"] = "April",
        ["quarterly"] = "Quarterly"
    };
}

internal sealed partial class BreadcrumbsTestController() : DemoController
{
    [RecursiveMember]
    public partial BreadcrumbsTestGroupContext WalkGroup { get; set; } = new();

    [UICommand]
    public void Open(string id)
        => WalkGroup.Open(id);

    [UICommand]
    public void GoTo(string id)
        => WalkGroup.GoTo(id);
}
