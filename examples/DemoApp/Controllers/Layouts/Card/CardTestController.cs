using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Card;

internal sealed partial class CardInteractionGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Clickable { get; set; } = true;

    [RecursiveMember]
    public partial int ClickCount { get; set; }

    public void ToggleClickable()
        => SetLastChange(nameof(Clickable), Clickable = !Clickable);

    public void RecordClick()
        => LogEvent($"OnClick fired (count={++ClickCount})");
}

internal sealed partial class CardTestController() : DemoController
{
    [RecursiveMember]
    public partial CardInteractionGroupContext InteractionGroup { get; set; } = new();

    [UICommand]
    public void ToggleClickable()
        => InteractionGroup.ToggleClickable();

    [UICommand]
    public void RecordClick()
        => InteractionGroup.RecordClick();
}
