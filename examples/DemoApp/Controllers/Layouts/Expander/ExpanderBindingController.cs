using DemoApp.Controllers.Base;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Expander;

internal sealed partial class ExpanderContentGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? HeaderIcon { get; set; }

    [RecursiveMember]
    public partial string? HeaderBadge { get; set; }

    [RecursiveMember]
    public partial bool ShowChevron { get; set; } = true;

    [RecursiveMember]
    public partial bool Expanded { get; set; } = true;

    public void ToggleHeaderIcon()
        => SetLastChange(nameof(HeaderIcon), HeaderIcon = CycleValue(HeaderIcon, null, LucideIcons.Star));

    public void ToggleHeaderBadge()
        => SetLastChange(nameof(HeaderBadge), HeaderBadge = CycleValue(HeaderBadge, null, "New"));

    public void ToggleShowChevron()
        => SetLastChange(nameof(ShowChevron), ShowChevron = !ShowChevron);

    public void ToggleExpanded()
        => SetLastChange(nameof(Expanded), Expanded = !Expanded);
}

internal sealed partial class ExpanderBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial ExpanderContentGroupContext ContentGroup { get; set; } = new();

    [UICommand]
    public void ToggleHeaderIcon()
        => ContentGroup.ToggleHeaderIcon();

    [UICommand]
    public void ToggleHeaderBadge()
        => ContentGroup.ToggleHeaderBadge();

    [UICommand]
    public void ToggleShowChevron()
        => ContentGroup.ToggleShowChevron();

    [UICommand]
    public void ToggleExpanded()
        => ContentGroup.ToggleExpanded();
}
