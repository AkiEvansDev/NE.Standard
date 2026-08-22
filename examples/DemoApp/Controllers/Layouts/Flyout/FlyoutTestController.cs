using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Flyout;

internal sealed partial class FlyoutInteractionGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool IsOpen { get; set; }

    [RecursiveMember]
    public partial int CloseCount { get; set; }

    public void Open()
        => SetLastChange(nameof(IsOpen), IsOpen = true);

    public void RecordClose()
    {
        IsOpen = false;
        LogEvent($"OnClose fired (count={++CloseCount})");
    }
}

internal sealed partial class FlyoutTestController() : DemoController
{
    [RecursiveMember]
    public partial FlyoutInteractionGroupContext InteractionGroup { get; set; } = new();

    [UICommand]
    public void Open()
        => InteractionGroup.Open();

    [UICommand]
    public void RecordClose()
        => InteractionGroup.RecordClose();
}
