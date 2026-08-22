using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Expander;

internal sealed partial class ExpanderInteractionGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Expanded { get; set; } = true;

    [RecursiveMember]
    public partial int ToggleCount { get; set; }

    public void ToggleExpanded()
        => SetLastChange(nameof(Expanded), Expanded = !Expanded);

    public void RecordToggle()
        => LogEvent($"OnToggle fired (count={++ToggleCount})");
}

internal sealed partial class ExpanderTestController() : DemoController
{
    [RecursiveMember]
    public partial ExpanderInteractionGroupContext InteractionGroup { get; set; } = new();

    [UICommand]
    public void ToggleExpanded()
        => InteractionGroup.ToggleExpanded();

    [UICommand]
    public void RecordToggle()
        => InteractionGroup.RecordToggle();
}
