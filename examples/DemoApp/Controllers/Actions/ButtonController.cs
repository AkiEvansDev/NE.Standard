using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// One button, and every property that can be bound to it.
/// </summary>
internal sealed partial class ButtonController() : DemoStandardController
{
    [RecursiveMember]
    public partial ButtonGroupContext ButtonGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Restart", "Graceful restart of api-eu-west-1");

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();
}
