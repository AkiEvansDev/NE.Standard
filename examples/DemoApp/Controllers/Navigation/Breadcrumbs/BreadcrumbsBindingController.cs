using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.Breadcrumbs;

internal sealed partial class BreadcrumbsBindingGroupContext : DemoGroupContext
{
    private static readonly string[] Deeper = ["Invoices", "2026", "March", "INV-2026-0342"];

    [RecursiveMember(false)]
    public RecursiveCollection<BreadcrumbItem> Trail { get; } =
    [
        new() { Id = "home", Title = "Home", Icon = LucideIcons.LayoutDashboard },
        new() { Id = "customers", Title = "Customers" }
    ];

    public void GoDeeper()
    {
        var next = Deeper.FirstOrDefault(title => Trail.All(step => step.Title != title));

        if (next is null)
            return;

        Trail.Add(new BreadcrumbItem { Id = next.ToLowerInvariant(), Title = next });
        SetLastChange(nameof(Trail), next);
    }

    public void GoUp()
    {
        if (Trail.Count < 2)
            return;

        BreadcrumbItem last = Trail[^1];

        Trail.RemoveAt(Trail.Count - 1);
        SetLastChange(nameof(Trail), $"dropped {last.Title}");
    }

    /// <summary>
    /// Renames the step you are on. The trail's last step is the current page, so this is the one that reads
    /// as plain text rather than as a link.
    /// </summary>
    public void RenameCurrent()
    {
        BreadcrumbItem current = Trail[^1];

        current.Title = current.Title?.EndsWith('*') == true
            ? current.Title.TrimEnd('*', ' ')
            : $"{current.Title} *";

        SetLastChange(nameof(BreadcrumbItem.Title), current.Title ?? "");
    }

    /// <summary>A step switched off by its own Visible takes the mark beside it with it.</summary>
    public void ToggleMiddle()
    {
        if (Trail.Count < 3)
            return;

        BreadcrumbItem middle = Trail[1];

        middle.Visible = middle.Visible != true;
        SetLastChange(nameof(BreadcrumbItem.Visible), middle.Visible?.ToString() ?? "");
    }
}

internal sealed partial class BreadcrumbsBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial BreadcrumbsBindingGroupContext BreadcrumbsGroup { get; set; } = new();

    [UICommand]
    public void GoDeeper()
        => BreadcrumbsGroup.GoDeeper();

    [UICommand]
    public void GoUp()
        => BreadcrumbsGroup.GoUp();

    [UICommand]
    public void RenameCurrent()
        => BreadcrumbsGroup.RenameCurrent();

    [UICommand]
    public void ToggleMiddle()
        => BreadcrumbsGroup.ToggleMiddle();
}
