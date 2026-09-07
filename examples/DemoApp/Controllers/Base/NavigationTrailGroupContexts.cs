using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// The trail back from where a page sits, and the rows that move its steps.
/// </summary>
/// <remarks>The last step is the current page by position, so shortening the trail moves the mark.</remarks>
internal sealed partial class BreadcrumbsGroupContext : DemoGroupContext
{
    private static readonly BreadcrumbItem[] FullTrail =
    [
        new() { Id = "home", Title = "Home", Icon = DemoIcons.Outline(DemoIcons.Home), Url = "https://example.com/" },
        new() { Id = "projects", Title = "Projects", Url = "https://example.com/projects" },
        new() { Id = "web-portal", Title = "Web Portal", Url = "https://example.com/projects/web-portal" },
        new() { Id = "deploy", Title = "Deploy #482", Url = "https://example.com/projects/web-portal/deploys/482" },
    ];

    [RecursiveMember]
    public partial UIResponsive<double>? Spacing { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<BreadcrumbItem> Steps { get; } = [.. FullTrail];

    public BreadcrumbsGroupContext()
    {
        AddOption(nameof(Spacing), CycleSpacing, () => Spacing);
        AddOption(nameof(Steps), CycleSteps, () => Steps.Count);
        AddOption("Hide a step", ToggleHiddenStep, () => Steps.Count > 2 && Steps[2].Visibility?.Base == UIVisibility.Collapsed);
        AddOption("Disable a step", ToggleDisabledStep, () => Steps.Count > 1 && Steps[1].Enabled == false);
        AddOption("Icon on the last", CycleLastIcon, () => Steps[^1].Icon);
        AddOption("Badge on the last", ToggleLastBadge, () => Steps[^1].BadgeText);
    }

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, null, 8d, 16d));

    // Four, then two, then one: a single step is still the current page, drawn as such and not a link.
    public void CycleSteps()
    {
        var count = Steps.Count switch
        {
            4 => 2,
            2 => 1,
            _ => 4
        };

        Steps.Clear();

        for (var i = 0; i < count; i++)
            Steps.Add(FullTrail[i]);
    }

    // A step in the middle: the mark goes with the step it belongs to, which the first and last cannot show.
    public void ToggleHiddenStep()
    {
        if (Steps.Count < 4)
            CycleSteps();

        BreadcrumbItem step = Steps[2];

        step.Visibility = step.Visibility?.Base == UIVisibility.Collapsed ? UIVisibility.Visible : UIVisibility.Collapsed;
    }

    public void ToggleDisabledStep()
    {
        if (Steps.Count < 2)
            CycleSteps();

        BreadcrumbItem step = Steps[1];

        step.Enabled = step.Enabled == false;
    }

    public void CycleLastIcon()
        => Steps[^1].Icon = CycleIconValue(Steps[^1].Icon, DemoIcons.FileText);

    // A count on the page you are on is what a badge on a trail is for.
    public void ToggleLastBadge()
    {
        BreadcrumbItem step = Steps[^1];

        if (step.BadgeText is null)
        {
            step.BadgeText = "3";
            step.BadgeStyle = UIBadgeType.Warning;
        }
        else
        {
            step.BadgeText = null;
            step.BadgeStyle = null;
        }
    }
}
