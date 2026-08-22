using DemoApp.Controllers.Base;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Actions.Action;

internal sealed partial class ActionTrailingGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? TrailingText { get; set; } = "UTC+2";

    [RecursiveMember]
    public partial string? TrailingIcon { get; set; }

    [RecursiveMember]
    public partial UIButtonType Type { get; set; } = UIButtonType.Ghost;

    public void ToggleTrailingText()
        => SetLastChange(nameof(TrailingText), TrailingText = CycleValue(TrailingText, null, "UTC+2", "Not configured"));

    public void ToggleTrailingIcon()
        => SetLastChange(nameof(TrailingIcon), TrailingIcon = CycleValue(TrailingIcon, null, LucideIcons.ExternalLink, LucideIcons.MoreHorizontal));

    public void CycleType()
        => SetLastChange(nameof(Type), Type = CycleEnum(Type));
}

internal sealed partial class ActionContentGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Icon { get; set; } = LucideIcons.Settings;

    [RecursiveMember]
    public partial string? Description { get; set; } = "Monitors, brightness, night light";

    public void ToggleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon, null, LucideIcons.Settings));

    public void ToggleDescription()
        => SetLastChange(nameof(Description), Description = CycleValue(Description, null, "Monitors, brightness, night light"));
}

internal sealed partial class ActionBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial ActionTrailingGroupContext TrailingGroup { get; set; } = new();

    [RecursiveMember]
    public partial ActionContentGroupContext ContentGroup { get; set; } = new();

    [UICommand]
    public void ToggleTrailingText()
        => TrailingGroup.ToggleTrailingText();

    [UICommand]
    public void ToggleTrailingIcon()
        => TrailingGroup.ToggleTrailingIcon();

    [UICommand]
    public void CycleType()
        => TrailingGroup.CycleType();

    [UICommand]
    public void ToggleIcon()
        => ContentGroup.ToggleIcon();

    [UICommand]
    public void ToggleDescription()
        => ContentGroup.ToggleDescription();
}

internal sealed partial class ActionTestGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial int ClickCount { get; set; }

    public void RecordClick(string row)
        => LogEvent($"{row} row clicked (count={++ClickCount})");
}

internal sealed partial class ActionTestController() : DemoController
{
    [RecursiveMember]
    public partial ActionTestGroupContext TestGroup { get; set; } = new();

    [UICommand]
    public void OpenDisplay()
        => TestGroup.RecordClick("Display");

    [UICommand]
    public void OpenStorage()
        => TestGroup.RecordClick("Storage");
}
