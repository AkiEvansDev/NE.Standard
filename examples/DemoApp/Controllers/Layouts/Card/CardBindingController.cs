using DemoApp.Controllers.Base;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Card;

internal sealed partial class CardContentGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? HeaderIcon { get; set; }

    [RecursiveMember]
    public partial string? HeaderBadge { get; set; }

    [RecursiveMember]
    public partial bool HeaderSelectable { get; set; }

    public void ToggleHeaderIcon()
        => SetLastChange(nameof(HeaderIcon), HeaderIcon = CycleValue(HeaderIcon, null, LucideIcons.Star));

    public void ToggleHeaderBadge()
        => SetLastChange(nameof(HeaderBadge), HeaderBadge = CycleValue(HeaderBadge, null, "New"));

    public void ToggleHeaderSelectable()
        => SetLastChange(nameof(HeaderSelectable), HeaderSelectable = !HeaderSelectable);
}

internal sealed partial class CardBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial CardContentGroupContext ContentGroup { get; set; } = new();

    [UICommand]
    public void ToggleHeaderIcon()
        => ContentGroup.ToggleHeaderIcon();

    [UICommand]
    public void ToggleHeaderBadge()
        => ContentGroup.ToggleHeaderBadge();

    [UICommand]
    public void ToggleHeaderSelectable()
        => ContentGroup.ToggleHeaderSelectable();
}
