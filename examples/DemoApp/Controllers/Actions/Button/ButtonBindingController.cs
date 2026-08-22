using DemoApp.Controllers.Base;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Actions.Button;

internal sealed partial class ButtonStyleGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIButtonType Type { get; set; } = UIButtonType.Primary;

    [RecursiveMember]
    public partial UITextAlignment TextAlignment { get; set; } = UITextAlignment.Start;

    public void CycleType()
        => SetLastChange(nameof(Type), Type = CycleEnum(Type));

    public void CycleTextAlignment()
        => SetLastChange(nameof(TextAlignment), TextAlignment = CycleEnum(TextAlignment));
}

internal sealed partial class ButtonContentGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Icon { get; set; } = LucideIcons.Star;

    [RecursiveMember]
    public partial UIIconSize IconSize { get; set; } = UIIconSize.Medium;

    [RecursiveMember]
    public partial string? Description { get; set; }

    [RecursiveMember]
    public partial bool Selectable { get; set; }

    public void ToggleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon, null, LucideIcons.Star));

    public void CycleIconSize()
    {
        if (string.IsNullOrEmpty(Icon))
            Icon = LucideIcons.Star;

        SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));
    }

    public void ToggleDescription()
        => SetLastChange(nameof(Description), Description = CycleValue(Description, null, "Supporting caption"));

    public void ToggleSelectable()
        => SetLastChange(nameof(Selectable), Selectable = !Selectable);
}

internal sealed partial class ButtonBadgeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UITextBadgePlacement BadgePlacement { get; set; } = UITextBadgePlacement.Trailing;

    [RecursiveMember]
    public partial UIBadgeType BadgeStyle { get; set; } = UIBadgeType.Info;

    [RecursiveMember]
    public partial string? BadgeIcon { get; set; }

    public void CycleBadgePlacement()
        => SetLastChange(nameof(BadgePlacement), BadgePlacement = CycleEnum(BadgePlacement));

    public void CycleBadgeStyle()
        => SetLastChange(nameof(BadgeStyle), BadgeStyle = CycleEnum(BadgeStyle));

    public void ToggleBadgeIcon()
        => SetLastChange(nameof(BadgeIcon), BadgeIcon = CycleValue(BadgeIcon, null, LucideIcons.Star));
}

internal sealed partial class ButtonBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial ButtonStyleGroupContext StyleGroup { get; set; } = new();

    [RecursiveMember]
    public partial ButtonContentGroupContext ContentGroup { get; set; } = new();

    [RecursiveMember]
    public partial ButtonBadgeGroupContext BadgeGroup { get; set; } = new();

    [UICommand]
    public void CycleType()
        => StyleGroup.CycleType();

    [UICommand]
    public void CycleTextAlignment()
        => StyleGroup.CycleTextAlignment();

    [UICommand]
    public void ToggleIcon()
        => ContentGroup.ToggleIcon();

    [UICommand]
    public void CycleIconSize()
        => ContentGroup.CycleIconSize();

    [UICommand]
    public void ToggleDescription()
        => ContentGroup.ToggleDescription();

    [UICommand]
    public void ToggleSelectable()
        => ContentGroup.ToggleSelectable();

    [UICommand]
    public void CycleBadgePlacement()
        => BadgeGroup.CycleBadgePlacement();

    [UICommand]
    public void CycleBadgeStyle()
        => BadgeGroup.CycleBadgeStyle();

    [UICommand]
    public void ToggleBadgeIcon()
        => BadgeGroup.ToggleBadgeIcon();
}
